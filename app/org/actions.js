'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { requireUser } from '@/supabase/user/getUser'

function cleanText(value) {
  return String(value || '').trim()
}

const ORG_ROUTE = '/org'

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
