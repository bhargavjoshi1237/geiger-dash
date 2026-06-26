'use server'

import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'
import { requireUser } from '@/supabase/user/getUser'
import { sendTemplateEmail } from '@/lib/email/send'

async function requestOrigin() {
  const h = await headers()
  const host = h.get('x-forwarded-host') || h.get('host')
  const proto = h.get('x-forwarded-proto') || 'https'
  return host ? `${proto}://${host}` : ''
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Wizard actions return plain result objects ({ ok, error, ... }) instead of
// redirecting, so the client wizard can show inline errors and animate to the
// final "done" state before navigating. Membership stays in
// `organizations.metadata.members` (the canonical list the /org dashboard reads)
// and is mirrored into the relational `organization_users` table.

function cleanText(value) {
  return String(value || '').trim()
}

// Creation goes through the create_organization RPC (SECURITY DEFINER): an
// `insert ... returning` under RLS trips the SELECT policy against the row being
// inserted, so the definer function does the insert past RLS and returns id/slug
// while atomically seeding the owner's organization_users membership.
export async function createOrganization(input) {
  const supabase = await createClient()
  await requireUser(supabase, '/login?next=org')

  const name = cleanText(input?.name)
  const description = cleanText(input?.description)
  const teamSize = cleanText(input?.teamSize)

  if (!name) {
    return { ok: false, error: 'Please enter an organization name.' }
  }

  const { data, error } = await supabase.rpc('create_organization', {
    p_name: name,
    p_description: description,
    p_team_size: teamSize || null,
  })

  if (error) {
    return { ok: false, error: error.message }
  }
  const row = Array.isArray(data) ? data[0] : data
  if (!row) {
    return { ok: false, error: 'Could not create the organization.' }
  }

  revalidatePath('/org')
  return { ok: true, organizationId: row.id, slug: row.slug }
}

// Invite teammates by email: create invite rows (with tokens) via the RPC, then
// send each an "org.invite" email carrying an accept link. Skippable from the
// wizard, so an empty list is a no-op success.
export async function inviteTeammates({ organizationId, organizationName, emails, role = 'User' }) {
  const supabase = await createClient()
  const user = await requireUser(supabase, '/login?next=org')

  const list = Array.from(
    new Set((Array.isArray(emails) ? emails : []).map((e) => cleanText(e).toLowerCase()).filter((e) => EMAIL_RE.test(e)))
  )
  if (!organizationId || list.length === 0) {
    return { ok: true, sent: 0 }
  }

  const { data, error } = await supabase.rpc('invite_to_organization', {
    p_org: organizationId,
    p_emails: list,
    p_role: role,
  })
  if (error) {
    return { ok: false, error: error.message }
  }

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

  return { ok: true, sent }
}

// Look up an org by UUID or slug so the join step can confirm "you're joining X"
// before the user commits. Goes through the find_organization RPC because RLS
// hides organizations the caller isn't a member of yet.
export async function findOrganization(query) {
  const supabase = await createClient()
  await requireUser(supabase, '/login?next=org')

  const term = cleanText(query)
  if (!term) {
    return { ok: false, error: 'Enter an organization ID or workspace URL.' }
  }

  const { data, error } = await supabase.rpc('find_organization', { q: term })
  if (error) {
    return { ok: false, error: error.message }
  }
  const row = Array.isArray(data) ? data[0] : data
  if (!row) {
    return { ok: false, error: 'No organization found for that ID or URL.' }
  }

  return {
    ok: true,
    organization: {
      id: row.id,
      name: row.name,
      slug: row.slug,
      memberCount: row.member_count ?? 0,
    },
  }
}

// Join via the join_organization RPC (SECURITY DEFINER): it looks the org up
// past RLS, adds the caller to organization_users + metadata.members, and is the
// only sanctioned path to join an org you can't yet see.
export async function joinOrganization(query) {
  const supabase = await createClient()
  await requireUser(supabase, '/login?next=org')

  const term = cleanText(query)
  if (!term) {
    return { ok: false, error: 'Enter an organization ID or workspace URL.' }
  }

  const { data, error } = await supabase.rpc('join_organization', { q: term })
  if (error) {
    return { ok: false, error: error.message }
  }
  const row = Array.isArray(data) ? data[0] : data
  if (!row) {
    return { ok: false, error: 'No organization found for that ID or URL.' }
  }

  revalidatePath('/org')
  return { ok: true, organizationId: row.id, name: row.name }
}
