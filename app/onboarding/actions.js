'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'
import { requireUser } from '@/supabase/user/getUser'

// Wizard actions return plain result objects ({ ok, error, ... }) instead of
// redirecting, so the client wizard can show inline errors and animate to the
// final "done" state before navigating. Membership stays in
// `organizations.metadata.members` (the canonical list the /org dashboard reads)
// and is mirrored into the relational `organization_users` table.

function cleanText(value) {
  return String(value || '').trim()
}

function slugify(value) {
  return cleanText(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48)
}

// Best-effort unique slug. `slug` has no DB unique constraint, so we just avoid
// obvious visual collisions by appending a short suffix when the base is taken.
async function uniqueSlug(supabase, base) {
  const root = slugify(base) || 'workspace'
  const { data } = await supabase
    .from('organizations')
    .select('slug')
    .ilike('slug', `${root}%`)

  const taken = new Set((data || []).map((row) => row.slug))
  if (!taken.has(root)) return root

  for (let i = 2; i < 1000; i++) {
    const candidate = `${root}-${i}`
    if (!taken.has(candidate)) return candidate
  }
  return `${root}-${Date.now().toString(36)}`
}

// Mirror membership into organization_users. Non-fatal: metadata.members is the
// source the dashboard reads, so a failure here shouldn't sink the whole flow.
async function linkMember(supabase, organizationId, userId, role) {
  const { error } = await supabase
    .from('organization_users')
    .insert({ organization: organizationId, user: userId, role })
  if (error) {
    console.error('[onboarding.linkMember]', error.message)
  }
}

export async function createOrganization(input) {
  const supabase = await createClient()
  const user = await requireUser(supabase, '/login?next=org')

  const name = cleanText(input?.name)
  const description = cleanText(input?.description)

  if (!name) {
    return { ok: false, error: 'Please enter an organization name.' }
  }

  const slug = await uniqueSlug(supabase, name)

  const { data, error } = await supabase
    .from('organizations')
    .insert({
      name,
      description,
      slug,
      created_by: user.id,
      owner: user.id,
      created_at: new Date().toISOString(),
      is_active: true,
      metadata: {
        members: [user.id],
        onboarding: { source: 'wizard', completedAt: new Date().toISOString() },
      },
    })
    .select('id, slug')
    .single()

  if (error || !data) {
    return { ok: false, error: error?.message || 'Could not create the organization.' }
  }

  await linkMember(supabase, data.id, user.id, 'Owner')

  revalidatePath('/org')
  return { ok: true, organizationId: data.id, slug: data.slug }
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
