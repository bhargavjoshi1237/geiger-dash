// Server-only helpers that turn an externally-authenticated OAuth identity into
// a real Supabase user + session, and auto-join them to the org whose provider
// they signed in through. Uses the service-role admin client. Pure: returns
// null/false on failure, console.error, never throws.
//
// Session minting reuses the existing /auth/callback route: we generate a
// magiclink hashed_token via the admin API and redirect the browser to
// /auth/callback?token_hash=...&type=magiclink, which calls verifyOtp and sets
// the Supabase session cookies. No bespoke session logic.

import { createAdminClient } from '@/utils/supabase/admin'
import { getOrgEntitlements, isProductUnlocked } from '@/lib/billing/entitlements'

// Find the auth user for an email, creating (auto-provisioning) one if absent.
// Returns { user, created }, or null on failure.
export async function findOrCreateUser({ email, name, avatar }) {
  const sb = createAdminClient()
  const clean = String(email || '').trim().toLowerCase()
  if (!sb || !clean) return null
  try {
    const userMeta = {}
    if (name) userMeta.full_name = name
    if (avatar) userMeta.avatar_url = avatar

    // Try to create; if the email already exists this errors and we look it up.
    const { data: created, error: createErr } = await sb.auth.admin.createUser({
      email: clean,
      email_confirm: true,
      user_metadata: userMeta,
    })
    if (!createErr && created?.user) return { user: created.user, created: true }

    // Existing user — find it by paging the user list (demo-scale lookup).
    const found = await findUserByEmail(sb, clean)
    if (found) return { user: found, created: false }

    console.error('[oauth.findOrCreateUser]', createErr?.message || 'user not found after create')
    return null
  } catch (e) {
    console.error('[oauth.findOrCreateUser]', e)
    return null
  }
}

async function findUserByEmail(sb, email) {
  // supabase-js admin has no getUserByEmail; page through until found.
  for (let page = 1; page <= 20; page += 1) {
    const { data, error } = await sb.auth.admin.listUsers({ page, perPage: 200 })
    if (error) {
      console.error('[oauth.findUserByEmail]', error.message)
      return null
    }
    const match = (data?.users || []).find((u) => (u.email || '').toLowerCase() === email)
    if (match) return match
    if (!data?.users?.length || data.users.length < 200) break
  }
  return null
}

// True when the user already belongs to the org: owner, creator, membership row or legacy metadata.members.
export async function isOrgMember(organizationId, userId) {
  const sb = createAdminClient()
  if (!sb || !organizationId || !userId) return false
  const [{ data: row, error: rowError }, { data: org, error: orgError }] = await Promise.all([
    sb
      .from('organization_users')
      .select('organization')
      .eq('organization', organizationId)
      .eq('user', userId)
      .maybeSingle(),
    sb.from('organizations').select('owner, created_by, metadata').eq('id', organizationId).maybeSingle(),
  ])
  if (rowError || orgError) {
    console.error('[oauth.isOrgMember]', rowError?.message || orgError?.message)
    return false
  }
  const legacyMembers = Array.isArray(org?.metadata?.members) ? org.metadata.members : []
  return Boolean(row) || org?.owner === userId || org?.created_by === userId || legacyMembers.includes(userId)
}

// True when the org currently owns the OAuth add-on.
export async function orgHasOAuthAddon(organizationId) {
  const sb = createAdminClient()
  if (!sb || !organizationId) return false
  const { data, error } = await sb
    .from('organizations')
    .select('id, metadata')
    .eq('id', organizationId)
    .is('deleted_at', null)
    .maybeSingle()
  if (error || !data) {
    if (error) console.error('[oauth.orgHasOAuthAddon]', error.message)
    return false
  }
  return isProductUnlocked(getOrgEntitlements(data), 'oauth')
}

// Idempotently add the user to the org: a relational organization_users row plus
// the legacy metadata.members array (mirrors join_organization).
export async function ensureOrgMembership(organizationId, userId, role = 'User') {
  const sb = createAdminClient()
  if (!sb || !organizationId || !userId) return false
  try {
    const { data: existing } = await sb
      .from('organization_users')
      .select('organization')
      .eq('organization', organizationId)
      .eq('user', userId)
      .maybeSingle()

    if (!existing) {
      const { error: insErr } = await sb
        .from('organization_users')
        .insert({ organization: organizationId, user: userId, role })
      if (insErr) {
        console.error('[oauth.ensureOrgMembership.insert]', insErr.message)
        return false
      }
    }

    const { data: org } = await sb
      .from('organizations')
      .select('metadata')
      .eq('id', organizationId)
      .maybeSingle()
    const metadata = org?.metadata && typeof org.metadata === 'object' ? org.metadata : {}
    const members = Array.isArray(metadata.members) ? metadata.members : []
    if (!members.includes(userId)) {
      const next = { ...metadata, members: [...members, userId] }
      const { error: upErr } = await sb
        .from('organizations')
        .update({ metadata: next })
        .eq('id', organizationId)
      if (upErr) console.error('[oauth.ensureOrgMembership.metadata]', upErr.message)
    }
    return true
  } catch (e) {
    console.error('[oauth.ensureOrgMembership]', e)
    return false
  }
}

// Mint a one-time magiclink token for the user and return the /auth/callback URL
// that establishes the Supabase session. Returns null on failure.
export async function buildSessionCallbackUrl({ origin, email, next = '/org' }) {
  const sb = createAdminClient()
  const clean = String(email || '').trim().toLowerCase()
  if (!sb || !clean) return null
  try {
    const { data, error } = await sb.auth.admin.generateLink({ type: 'magiclink', email: clean })
    if (error || !data?.properties?.hashed_token) {
      console.error('[oauth.buildSessionCallbackUrl]', error?.message || 'no hashed_token')
      return null
    }
    const params = new URLSearchParams({
      token_hash: data.properties.hashed_token,
      type: 'magiclink',
      next,
    })
    return `${origin}/auth/callback?${params.toString()}`
  } catch (e) {
    console.error('[oauth.buildSessionCallbackUrl]', e)
    return null
  }
}
