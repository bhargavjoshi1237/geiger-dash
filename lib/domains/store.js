// Data layer for per-org custom domains (public.org_domains) — backs the
// purchasable "Custom subdomain" add-on.
//
// This is the ONLY place that reads/writes that table. It uses the service-role
// admin client because subdomain -> org resolution happens at request time for
// visitors who aren't members of the org, so it can't rely on the caller's RLS.
// Pure: returns null/false on failure, console.error, never throws, never toasts.
// The server actions in app/org/domain-actions.js own validation messaging + UX.
//
// DB is snake_case; callers get camelCase view models.

import { createAdminClient } from '@/utils/supabase/admin'

const TABLE = 'org_domains'

// Host labels we never let an org claim (platform + infra + marketing routes).
export const RESERVED_SUBDOMAINS = new Set([
  'www', 'app', 'api', 'admin', 'auth', 'login', 'logout', 'signup', 'register',
  'onboarding', 'org', 'orgs', 'dashboard', 'billing', 'pricing', 'account',
  'settings', 'mail', 'email', 'smtp', 'imap', 'cdn', 'assets', 'static', 'img',
  'images', 'media', 'files', 'docs', 'doc', 'blog', 'help', 'support', 'status',
  'about', 'contact', 'legal', 'terms', 'privacy', 'security', 'oauth',
  'callback', 'webhook', 'webhooks', 'stripe', 'vercel', 'ns', 'ns1', 'ns2',
  'mx', 'ftp', 'test', 'staging', 'stage', 'dev', 'demo', 'preview', 'geiger',
  'studio', 'root', 'system', 'internal', 'go', 'link',
])

// Lowercase, trim, and strip everything that isn't a valid host-label char. Used
// both as-you-type sanitising (client mirrors this) and before every DB touch.
export function sanitizeSubdomain(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '')
    .replace(/^-+/, '')
    .slice(0, 63)
}

// Pure format + reserved-word check. Returns { valid, reason } where reason is a
// human-readable string the action surfaces directly.
export function validateSubdomain(value) {
  const sub = sanitizeSubdomain(value)
  if (sub.length < 3) return { valid: false, reason: 'Use at least 3 characters.' }
  if (sub.length > 63) return { valid: false, reason: 'Keep it under 63 characters.' }
  if (!/^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/.test(sub)) {
    return { valid: false, reason: 'Use letters, numbers, and hyphens only (no leading or trailing hyphen).' }
  }
  if (RESERVED_SUBDOMAINS.has(sub)) return { valid: false, reason: 'That subdomain is reserved.' }
  return { valid: true, reason: '', subdomain: sub }
}

export function normalizeDomain(row) {
  if (!row) return null
  return {
    id: row.id,
    organizationId: row.organization_id,
    subdomain: row.subdomain ?? '',
    type: row.type ?? 'subdomain',
    status: row.status ?? 'active',
    verified: Boolean(row.verified),
    createdAt: row.created_at ?? null,
    updatedAt: row.updated_at ?? null,
  }
}

// The org's active subdomain row (or null).
export async function getOrgDomain(organizationId) {
  const sb = createAdminClient()
  if (!sb || !organizationId) return null
  try {
    const { data, error } = await sb
      .from(TABLE)
      .select('*')
      .eq('organization_id', organizationId)
      .eq('type', 'subdomain')
      .is('deleted_at', null)
      .maybeSingle()
    if (error) {
      console.error('[domains.getOrgDomain]', error.message)
      return null
    }
    return normalizeDomain(data)
  } catch (e) {
    console.error('[domains.getOrgDomain]', e)
    return null
  }
}

// Resolve a host label to the org that owns it (request-time routing). Returns
// { id, name, slug } or null when unclaimed. Spans orgs the visitor may not be a
// member of, hence the admin client.
export async function getOrgBySubdomain(subdomainRaw) {
  const sb = createAdminClient()
  const subdomain = sanitizeSubdomain(subdomainRaw)
  if (!sb || !subdomain) return null
  try {
    const { data, error } = await sb
      .from(TABLE)
      .select('organization_id, status, organizations!inner(id, name, slug)')
      .eq('subdomain', subdomain)
      .eq('status', 'active')
      .is('deleted_at', null)
      .maybeSingle()
    if (error) {
      console.error('[domains.getOrgBySubdomain]', error.message)
      return null
    }
    if (!data?.organizations) return null
    return { id: data.organizations.id, name: data.organizations.name ?? '', slug: data.organizations.slug ?? '' }
  } catch (e) {
    console.error('[domains.getOrgBySubdomain]', e)
    return null
  }
}

// true when no live row (other than exceptOrgId's) holds this subdomain. Returns
// null on a DB error so the caller can distinguish "unknown" from "taken".
export async function isSubdomainAvailable(subdomainRaw, exceptOrgId = null) {
  const sb = createAdminClient()
  const subdomain = sanitizeSubdomain(subdomainRaw)
  if (!sb || !subdomain) return null
  try {
    const { data, error } = await sb
      .from(TABLE)
      .select('organization_id')
      .eq('subdomain', subdomain)
      .is('deleted_at', null)
      .maybeSingle()
    if (error) {
      console.error('[domains.isSubdomainAvailable]', error.message)
      return null
    }
    if (!data) return true
    return exceptOrgId ? data.organization_id === exceptOrgId : false
  } catch (e) {
    console.error('[domains.isSubdomainAvailable]', e)
    return null
  }
}

// Claim/replace the org's subdomain. Updates the existing active row in place or
// inserts a new one. Returns the row or null (a null after a passed availability
// check means we lost the unique-index race — the action re-checks to report it).
export async function saveSubdomain(organizationId, subdomainRaw) {
  const sb = createAdminClient()
  const subdomain = sanitizeSubdomain(subdomainRaw)
  if (!sb || !organizationId || !subdomain) return null
  try {
    const existing = await getOrgDomain(organizationId)
    const query = existing
      ? sb.from(TABLE).update({ subdomain, status: 'active' }).eq('id', existing.id)
      : sb.from(TABLE).insert({ organization_id: organizationId, subdomain, type: 'subdomain' })
    const { data, error } = await query.select('*').single()
    if (error) {
      console.error('[domains.saveSubdomain]', error.message)
      return null
    }
    return normalizeDomain(data)
  } catch (e) {
    console.error('[domains.saveSubdomain]', e)
    return null
  }
}

export async function softDeleteDomain(organizationId) {
  const sb = createAdminClient()
  if (!sb || !organizationId) return false
  try {
    const { error } = await sb
      .from(TABLE)
      .update({ deleted_at: new Date().toISOString(), status: 'disabled' })
      .eq('organization_id', organizationId)
      .eq('type', 'subdomain')
      .is('deleted_at', null)
    if (error) {
      console.error('[domains.softDeleteDomain]', error.message)
      return false
    }
    return true
  } catch (e) {
    console.error('[domains.softDeleteDomain]', e)
    return false
  }
}
