// Data layer for per-org OAuth (SSO) provider config (public.org_oauth_providers).
//
// This is the ONLY place that reads/writes that table. It uses the service-role
// admin client because the row holds client_secret, which must never reach the
// browser — callers that expose data to the client use maskProvider(). Pure:
// returns null/false/[] on failure, console.error, never throws, never toasts.
//
// DB is snake_case; callers get camelCase view models.

import { createAdminClient } from '@/utils/supabase/admin'

const TABLE = 'org_oauth_providers'

// Normalize an email domain: lowercase, trimmed, no leading '@' or scheme.
export function normalizeDomain(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/^@+/, '')
    .replace(/^https?:\/\//, '')
    .replace(/\/.*$/, '')
}

function normalizeDomainList(input) {
  const raw = Array.isArray(input)
    ? input
    : String(input || '').split(/[\s,]+/)
  return [...new Set(raw.map(normalizeDomain).filter(Boolean))]
}

export function normalizeProvider(row) {
  if (!row) return null
  return {
    id: row.id,
    organizationId: row.organization_id,
    providerName: row.provider_name ?? '',
    providerType: row.provider_type ?? 'oidc',
    clientId: row.client_id ?? '',
    clientSecret: row.client_secret ?? '',
    issuer: row.issuer ?? '',
    discoveryUrl: row.discovery_url ?? '',
    authorizationUrl: row.authorization_url ?? '',
    tokenUrl: row.token_url ?? '',
    userinfoUrl: row.userinfo_url ?? '',
    scopes: Array.isArray(row.scopes) ? row.scopes : [],
    emailDomains: Array.isArray(row.email_domains) ? row.email_domains : [],
    attributeMapping:
      row.attribute_mapping && typeof row.attribute_mapping === 'object' ? row.attribute_mapping : {},
    pkceEnabled: row.pkce_enabled !== false,
    enabled: Boolean(row.enabled),
    createdAt: row.created_at ?? null,
    updatedAt: row.updated_at ?? null,
  }
}

// Strip the secret before sending a provider to the browser.
export function maskProvider(provider) {
  if (!provider) return null
  const { clientSecret, ...rest } = provider
  return { ...rest, hasSecret: Boolean(clientSecret) }
}

function toRow(input) {
  const row = {}
  const map = {
    providerName: 'provider_name',
    providerType: 'provider_type',
    clientId: 'client_id',
    clientSecret: 'client_secret',
    issuer: 'issuer',
    discoveryUrl: 'discovery_url',
    authorizationUrl: 'authorization_url',
    tokenUrl: 'token_url',
    userinfoUrl: 'userinfo_url',
    pkceEnabled: 'pkce_enabled',
    enabled: 'enabled',
  }
  for (const [key, col] of Object.entries(map)) if (key in input) row[col] = input[key]
  if ('scopes' in input) {
    row.scopes = Array.isArray(input.scopes)
      ? input.scopes
      : String(input.scopes || '')
          .split(/[\s,]+/)
          .filter(Boolean)
  }
  if ('attributeMapping' in input) {
    row.attribute_mapping =
      input.attributeMapping && typeof input.attributeMapping === 'object' ? input.attributeMapping : {}
  }
  if ('emailDomains' in input) {
    row.email_domains = normalizeDomainList(input.emailDomains)
  }
  return row
}

// Full provider (INCLUDES client_secret) — for the server-side OAuth flow only.
export async function getProvider(organizationId) {
  const sb = createAdminClient()
  if (!sb || !organizationId) return null
  try {
    const { data, error } = await sb
      .from(TABLE)
      .select('*')
      .eq('organization_id', organizationId)
      .is('deleted_at', null)
      .maybeSingle()
    if (error) {
      console.error('[oauth.getProvider]', error.message)
      return null
    }
    return normalizeProvider(data)
  } catch (e) {
    console.error('[oauth.getProvider]', e)
    return null
  }
}

// Resolve an email domain to its org's enabled provider (login discovery). Uses
// the admin client because the lookup spans orgs the visitor isn't a member of.
export async function getProviderByDomain(domain) {
  const sb = createAdminClient()
  const clean = normalizeDomain(domain)
  if (!sb || !clean) return null
  try {
    const { data, error } = await sb
      .from(TABLE)
      .select('*')
      .contains('email_domains', [clean])
      .eq('enabled', true)
      .is('deleted_at', null)
      .limit(1)
      .maybeSingle()
    if (error) {
      console.error('[oauth.getProviderByDomain]', error.message)
      return null
    }
    return normalizeProvider(data)
  } catch (e) {
    console.error('[oauth.getProviderByDomain]', e)
    return null
  }
}

// Upsert the single provider row for an org (one row per organization_id).
export async function upsertProvider(organizationId, config) {
  const sb = createAdminClient()
  if (!sb || !organizationId) return null
  try {
    const payload = { ...toRow(config), organization_id: organizationId }
    const { data, error } = await sb
      .from(TABLE)
      .upsert(payload, { onConflict: 'organization_id' })
      .select('*')
      .single()
    if (error) {
      console.error('[oauth.upsertProvider]', error.message)
      return null
    }
    return normalizeProvider(data)
  } catch (e) {
    console.error('[oauth.upsertProvider]', e)
    return null
  }
}

export async function setProviderEnabled(organizationId, enabled) {
  const sb = createAdminClient()
  if (!sb || !organizationId) return false
  try {
    const { error } = await sb
      .from(TABLE)
      .update({ enabled: Boolean(enabled) })
      .eq('organization_id', organizationId)
    if (error) {
      console.error('[oauth.setProviderEnabled]', error.message)
      return false
    }
    return true
  } catch (e) {
    console.error('[oauth.setProviderEnabled]', e)
    return false
  }
}

export async function softDeleteProvider(organizationId) {
  const sb = createAdminClient()
  if (!sb || !organizationId) return false
  try {
    const { error } = await sb
      .from(TABLE)
      .update({ deleted_at: new Date().toISOString(), enabled: false })
      .eq('organization_id', organizationId)
    if (error) {
      console.error('[oauth.softDeleteProvider]', error.message)
      return false
    }
    return true
  } catch (e) {
    console.error('[oauth.softDeleteProvider]', e)
    return false
  }
}

// Fetch an OIDC discovery document and pull out the endpoints. Returns a partial
// { issuer, authorizationUrl, tokenUrl, userinfoUrl } or null on any failure.
export async function resolveDiscovery(discoveryUrl) {
  const raw = String(discoveryUrl || '').trim()
  if (!raw) return null
  // Accept a bare issuer or a full .well-known URL.
  const url = raw.includes('/.well-known/')
    ? raw
    : `${raw.replace(/\/$/, '')}/.well-known/openid-configuration`
  try {
    const res = await fetch(url, { headers: { accept: 'application/json' } })
    if (!res.ok) {
      console.error('[oauth.resolveDiscovery]', `HTTP ${res.status}`)
      return null
    }
    const doc = await res.json()
    return {
      issuer: doc.issuer || '',
      authorizationUrl: doc.authorization_endpoint || '',
      tokenUrl: doc.token_endpoint || '',
      userinfoUrl: doc.userinfo_endpoint || '',
    }
  } catch (e) {
    console.error('[oauth.resolveDiscovery]', e)
    return null
  }
}
