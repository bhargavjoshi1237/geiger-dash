'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'
import { requireUser } from '@/supabase/user/getUser'
import { getOrgEntitlements, isProductUnlocked } from '@/lib/billing/entitlements'
import {
  getProvider,
  upsertProvider,
  setProviderEnabled,
  softDeleteProvider,
  resolveDiscovery,
  maskProvider,
} from '@/lib/oauth/providers'

const ORG_ROUTE = '/org'

// Verify the caller owns the org (owner/creator) AND the org owns the OAuth
// add-on. Uses the user's RLS-scoped client so a select proves membership, and
// re-derives entitlements from org metadata server-side (client is never
// trusted). Returns { ok, org } or { ok:false, error }.
async function authorizeOrgOwner(supabase, organizationId) {
  const orgId = String(organizationId || '').trim()
  if (!orgId) return { ok: false, error: 'Missing organization.' }

  const user = await requireUser(supabase, '/login?next=org')
  const { data: org } = await supabase
    .from('organizations')
    .select('id, owner, created_by, metadata')
    .eq('id', orgId)
    .is('deleted_at', null)
    .maybeSingle()

  if (!org || (org.owner !== user.id && org.created_by !== user.id)) {
    return { ok: false, error: 'You do not have permission to manage this organization.' }
  }
  if (!isProductUnlocked(getOrgEntitlements(org), 'oauth')) {
    return { ok: false, error: 'This organization does not have the OAuth add-on.' }
  }
  return { ok: true, org }
}

export async function getOrgOAuthProviderAction(organizationId) {
  const supabase = await createClient()
  const auth = await authorizeOrgOwner(supabase, organizationId)
  if (!auth.ok) return auth

  const provider = await getProvider(auth.org.id)
  return { ok: true, provider: maskProvider(provider) }
}

export async function saveOrgOAuthProviderAction(organizationId, config = {}) {
  const supabase = await createClient()
  const auth = await authorizeOrgOwner(supabase, organizationId)
  if (!auth.ok) return auth

  const cfg = { ...config }
  cfg.providerName = String(cfg.providerName || '').trim()
  cfg.clientId = String(cfg.clientId || '').trim()

  if (!cfg.providerName) return { ok: false, error: 'Enter a provider name.' }
  if (!cfg.clientId) return { ok: false, error: 'Enter the client ID.' }

  // At least one email domain is required — it's how a member's email resolves
  // to this org at login (domain-based SSO discovery).
  const domains = Array.isArray(cfg.emailDomains)
    ? cfg.emailDomains
    : String(cfg.emailDomains || '')
        .split(/[\s,]+/)
        .filter(Boolean)
  if (domains.length === 0) {
    return { ok: false, error: 'Add at least one email domain (e.g. acme.com).' }
  }

  // Keep the stored secret when the field is left blank on an edit.
  if (!cfg.clientSecret) delete cfg.clientSecret

  // Fill endpoints from an OIDC discovery URL when they weren't supplied.
  if (cfg.discoveryUrl && (!cfg.authorizationUrl || !cfg.tokenUrl)) {
    const resolved = await resolveDiscovery(cfg.discoveryUrl)
    if (resolved) {
      cfg.issuer = cfg.issuer || resolved.issuer
      cfg.authorizationUrl = cfg.authorizationUrl || resolved.authorizationUrl
      cfg.tokenUrl = cfg.tokenUrl || resolved.tokenUrl
      cfg.userinfoUrl = cfg.userinfoUrl || resolved.userinfoUrl
    }
  }

  if (!cfg.authorizationUrl || !cfg.tokenUrl) {
    return { ok: false, error: 'Provide the authorization and token URLs (or a working discovery URL).' }
  }

  const provider = await upsertProvider(auth.org.id, cfg)
  if (!provider) return { ok: false, error: 'Could not save the provider.' }

  revalidatePath(ORG_ROUTE)
  return { ok: true, provider: maskProvider(provider) }
}

export async function setOrgOAuthEnabledAction(organizationId, enabled) {
  const supabase = await createClient()
  const auth = await authorizeOrgOwner(supabase, organizationId)
  if (!auth.ok) return auth

  const ok = await setProviderEnabled(auth.org.id, enabled)
  if (!ok) return { ok: false, error: 'Could not update the provider.' }

  revalidatePath(ORG_ROUTE)
  return { ok: true }
}

export async function deleteOrgOAuthProviderAction(organizationId) {
  const supabase = await createClient()
  const auth = await authorizeOrgOwner(supabase, organizationId)
  if (!auth.ok) return auth

  const ok = await softDeleteProvider(auth.org.id)
  if (!ok) return { ok: false, error: 'Could not remove the provider.' }

  revalidatePath(ORG_ROUTE)
  return { ok: true }
}

// Used by the "Fetch endpoints" button in the setup form.
export async function resolveOAuthDiscoveryAction(organizationId, discoveryUrl) {
  const supabase = await createClient()
  const auth = await authorizeOrgOwner(supabase, organizationId)
  if (!auth.ok) return auth

  const endpoints = await resolveDiscovery(discoveryUrl)
  if (!endpoints) return { ok: false, error: 'Could not read that discovery URL.' }
  return { ok: true, endpoints }
}
