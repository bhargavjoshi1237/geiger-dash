// Shared organization-membership reads.
//
// Membership is tracked two ways for backwards-compat: the canonical list lives
// in `organizations.metadata.members` (what the /org dashboard has always read),
// and we additionally mirror rows into the relational `organization_users` table.
// This helper centralises "which orgs does this user belong to" so the /org
// dashboard, the onboarding gate, and the wizard all agree.

const ORG_SELECT_FIELDS =
  'id, name, description, created_by, created_at, owner, metadata, is_active, country, phone, slug, avatar_url'

function uniqueOrganizations(groups) {
  const seen = new Map()

  for (const group of groups) {
    for (const organization of group || []) {
      seen.set(String(organization.id), organization)
    }
  }

  return Array.from(seen.values()).sort((a, b) => {
    const aTime = a.created_at ? new Date(a.created_at).getTime() : 0
    const bTime = b.created_at ? new Date(b.created_at).getTime() : 0
    return bTime - aTime
  })
}

// Returns { organizations, error }. `error` is a string (empty when clean) so
// callers can decide whether a redirect is safe (never redirect on a read error).
export async function getUserOrganizations(supabase, userId) {
  const [createdResult, ownedResult, joinedResult] = await Promise.all([
    supabase.from('organizations').select(ORG_SELECT_FIELDS).eq('created_by', userId),
    supabase.from('organizations').select(ORG_SELECT_FIELDS).eq('owner', userId),
    supabase.from('organizations').select(ORG_SELECT_FIELDS).contains('metadata', { members: [userId] }),
  ])

  const organizations = uniqueOrganizations([
    createdResult.data,
    ownedResult.data,
    joinedResult.data,
  ])

  const error =
    createdResult.error?.message ||
    ownedResult.error?.message ||
    joinedResult.error?.message ||
    ''

  return { organizations, error }
}

export { uniqueOrganizations, ORG_SELECT_FIELDS }
