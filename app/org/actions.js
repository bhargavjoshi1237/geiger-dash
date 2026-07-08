'use server'

import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { requireUser } from '@/supabase/user/getUser'
import { sendTemplateEmail } from '@/lib/email/send'

function cleanText(value) {
  return String(value || '').trim()
}

const ORG_ROUTE = '/org'
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

async function requestOrigin() {
  const h = await headers()
  const host = h.get('x-forwarded-host') || h.get('host')
  const proto = h.get('x-forwarded-proto') || 'https'
  return host ? `${proto}://${host}` : ''
}

export async function createOrganizationAction(formData) {
  const supabase = await createClient()
  const user = await requireUser(supabase)

  const name = cleanText(formData.get('name'))
  const description = cleanText(formData.get('description'))
  const country = cleanText(formData.get('country')) || null
  const phone = cleanText(formData.get('phone')) || null

  if (!name || !description) {
    redirect(`${ORG_ROUTE}?error=missing_required`)
  }

  const { error } = await supabase.from('organizations').insert({
    name,
    description,
    country,
    phone,
    created_by: user.id,
    owner: user.id,
    created_at: new Date().toISOString(),
    is_active: true,
    metadata: {
      members: [user.id],
    },
  })

  if (error) {
    redirect(`${ORG_ROUTE}?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath(ORG_ROUTE)
  redirect(`${ORG_ROUTE}?created=1`)
}

export async function updateOrgAvatarAction(formData) {
  const supabase = await createClient()
  const user = await requireUser(supabase)

  const orgId = String(formData.get('organization_id') || '').trim()
  const file = formData.get('avatar')

  if (!orgId || !file || file.size === 0) {
    return { ok: false, error: 'Missing file or organization.' }
  }
  if (file.size > 2 * 1024 * 1024) {
    return { ok: false, error: 'File must be under 2 MB.' }
  }

  const { data: org } = await supabase
    .from('organizations')
    .select('id, owner, created_by')
    .eq('id', orgId)
    .single()

  if (!org || (org.owner !== user.id && org.created_by !== user.id)) {
    return { ok: false, error: 'You do not have permission to update this organization.' }
  }

  const admin = createAdminClient()
  if (!admin) return { ok: false, error: 'Storage is not configured.' }

  // Create bucket if it doesn't exist (public so URLs are directly linkable).
  await admin.storage.createBucket('organizations', { public: true }).catch(() => {})

  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg'
  const path = `${orgId}/avatar.${ext}`
  const bytes = await file.arrayBuffer()

  const { error: uploadError } = await admin.storage
    .from('organizations')
    .upload(path, bytes, { contentType: file.type, upsert: true })

  if (uploadError) return { ok: false, error: uploadError.message }

  const { data: { publicUrl } } = admin.storage.from('organizations').getPublicUrl(path)

  const { error: updateError } = await supabase
    .from('organizations')
    .update({ avatar_url: publicUrl })
    .eq('id', orgId)

  if (updateError) return { ok: false, error: updateError.message }

  revalidatePath('/org')
  return { ok: true, url: publicUrl }
}

export async function joinOrganizationAction(formData) {
  const supabase = await createClient()
  await requireUser(supabase, '/login?next=org')
  const organizationId = cleanText(formData.get('organization_id'))

  if (!organizationId) {
    redirect(`${ORG_ROUTE}?error=missing_join_id`)
  }

  // Join through the SECURITY DEFINER RPC: under RLS a non-member can't read the
  // org row directly, and the RPC keeps organization_users + metadata in sync.
  const { data, error } = await supabase.rpc('join_organization', { q: organizationId })

  if (error) {
    redirect(`${ORG_ROUTE}?error=${encodeURIComponent(error.message)}`)
  }
  const row = Array.isArray(data) ? data[0] : data
  if (!row) {
    redirect(`${ORG_ROUTE}?error=organization_not_found`)
  }

  revalidatePath(ORG_ROUTE)
  redirect(`${ORG_ROUTE}?joined=1`)
}

// --- Members -----------------------------------------------------------------
// The member directory is read through the organization_members RPC (members
// reference auth.users, unreadable via the anon client). Management goes through
// SECURITY DEFINER RPCs gated on `members.manage`; each returns a plain result
// object so the client owns toasts + optimistic state.

export async function listOrgMembersAction(organizationId) {
  const supabase = await createClient()
  await requireUser(supabase, '/login?next=org')
  const orgId = cleanText(organizationId)
  if (!orgId) return { ok: false, error: 'Missing organization.' }

  const [{ data: members, error: membersError }, { data: invites }] = await Promise.all([
    supabase.rpc('organization_members', { p_org: orgId }),
    supabase
      .from('organization_invites')
      .select('id, email, role, created_at')
      .eq('organization_id', orgId)
      .eq('status', 'pending')
      .order('created_at', { ascending: false }),
  ])

  if (membersError) return { ok: false, error: membersError.message }

  return {
    ok: true,
    members: (members || []).map((m) => ({
      userId: m.user_id,
      email: m.email || '',
      name: m.name || '',
      avatarUrl: m.avatar_url || '',
      role: m.member_role || '',
      isOwner: Boolean(m.is_owner),
      isCreator: Boolean(m.is_creator),
      joinedAt: m.joined_at || null,
    })),
    invites: (invites || []).map((i) => ({
      id: i.id,
      email: i.email,
      role: i.role,
      createdAt: i.created_at,
    })),
  }
}

export async function inviteOrgMembersAction({ organizationId, organizationName, emails, role = 'User' }) {
  const supabase = await createClient()
  const user = await requireUser(supabase, '/login?next=org')
  const orgId = cleanText(organizationId)
  const list = Array.from(
    new Set(
      (Array.isArray(emails) ? emails : [emails])
        .map((e) => cleanText(e).toLowerCase())
        .filter((e) => EMAIL_RE.test(e)),
    ),
  )
  if (!orgId) return { ok: false, error: 'Missing organization.' }
  if (list.length === 0) return { ok: false, error: 'Enter at least one valid email address.' }

  const { data, error } = await supabase.rpc('invite_to_organization', {
    p_org: orgId,
    p_emails: list,
    p_role: role,
  })
  if (error) return { ok: false, error: error.message }

  const origin = await requestOrigin()
  const inviterName =
    cleanText(user.user_metadata?.full_name || user.user_metadata?.name) || user.email || 'A teammate'

  let sent = 0
  for (const row of data || []) {
    const result = await sendTemplateEmail({
      key: 'org.invite',
      to: row.email,
      project: 'geiger-dash',
      data: {
        inviterName,
        orgName: cleanText(organizationName) || 'your organization',
        role,
        acceptUrl: `${origin}/invite/${row.token}`,
      },
    })
    if (result?.ok) sent += 1
  }

  revalidatePath(ORG_ROUTE)
  return { ok: true, sent, invited: (data || []).map((r) => r.email) }
}

export async function setOrgMemberRoleAction({ organizationId, userId, role }) {
  const supabase = await createClient()
  await requireUser(supabase, '/login?next=org')
  const orgId = cleanText(organizationId)
  const uid = cleanText(userId)
  const nextRole = cleanText(role)
  if (!orgId || !uid || !nextRole) return { ok: false, error: 'Missing role.' }

  const { data, error } = await supabase.rpc('set_organization_member_role', {
    p_org: orgId,
    p_user: uid,
    p_role: nextRole,
  })
  if (error) return { ok: false, error: error.message }
  if (!data) return { ok: false, error: "You can't change this member's role." }

  revalidatePath(ORG_ROUTE)
  return { ok: true }
}

export async function removeOrgMemberAction({ organizationId, userId }) {
  const supabase = await createClient()
  await requireUser(supabase, '/login?next=org')
  const orgId = cleanText(organizationId)
  const uid = cleanText(userId)
  if (!orgId || !uid) return { ok: false, error: 'Missing member.' }

  const { data, error } = await supabase.rpc('remove_organization_member', {
    p_org: orgId,
    p_user: uid,
  })
  if (error) return { ok: false, error: error.message }
  if (!data) return { ok: false, error: "You can't remove this member." }

  revalidatePath(ORG_ROUTE)
  return { ok: true }
}

export async function revokeOrgInviteAction({ organizationId, inviteId }) {
  const supabase = await createClient()
  await requireUser(supabase, '/login?next=org')
  const orgId = cleanText(organizationId)
  const id = cleanText(inviteId)
  if (!orgId || !id) return { ok: false, error: 'Missing invite.' }

  // RLS: organization_invites writes require has_org_ability(members.add).
  const { error } = await supabase
    .from('organization_invites')
    .update({ status: 'revoked' })
    .eq('id', id)
    .eq('organization_id', orgId)
  if (error) return { ok: false, error: error.message }

  revalidatePath(ORG_ROUTE)
  return { ok: true }
}
