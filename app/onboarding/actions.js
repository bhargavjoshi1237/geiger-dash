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

// Creation goes through the create_organization RPC (SECURITY DEFINER): an
// `insert ... returning` under RLS trips the SELECT policy against the row being
// inserted, so the definer function does the insert past RLS and returns id/slug
// while atomically seeding the owner's organization_users membership.
export async function createOrganization(input) {
  const supabase = await createClient()
  await requireUser(supabase, '/login?next=org')

  const name = cleanText(input?.name)
  const description = cleanText(input?.description)

  if (!name) {
    return { ok: false, error: 'Please enter an organization name.' }
  }

  const { data, error } = await supabase.rpc('create_organization', {
    p_name: name,
    p_description: description,
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
