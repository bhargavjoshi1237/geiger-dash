'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'
import { requireUser } from '@/supabase/user/getUser'
import { getOrgEntitlements, isProductUnlocked } from '@/lib/billing/entitlements'
import {
  getOrgDomain,
  isSubdomainAvailable,
  saveSubdomain,
  softDeleteDomain,
  sanitizeSubdomain,
  validateSubdomain,
} from '@/lib/domains/store'

const ORG_ROUTE = '/org'

// Verify the caller owns the org (owner/creator) AND the org owns the subdomain
// add-on. Uses the user's RLS-scoped client so the select proves membership, and
// re-derives entitlements from org metadata server-side (client never trusted).
// Returns { ok, org } or { ok:false, error }.
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
  if (!isProductUnlocked(getOrgEntitlements(org), 'subdomain')) {
    return { ok: false, error: 'This organization does not have the subdomain add-on.' }
  }
  return { ok: true, org }
}

export async function getOrgDomainAction(organizationId) {
  const supabase = await createClient()
  const auth = await authorizeOrgOwner(supabase, organizationId)
  if (!auth.ok) return auth

  const domain = await getOrgDomain(auth.org.id)
  return { ok: true, domain }
}

// Live check behind the input's availability indicator. Validates format first,
// then queries the table (excluding the org's own current row).
export async function checkSubdomainAvailabilityAction(organizationId, subdomain) {
  const supabase = await createClient()
  const auth = await authorizeOrgOwner(supabase, organizationId)
  if (!auth.ok) return auth

  const check = validateSubdomain(subdomain)
  if (!check.valid) {
    return { ok: true, available: false, reason: check.reason, subdomain: sanitizeSubdomain(subdomain) }
  }

  const available = await isSubdomainAvailable(check.subdomain, auth.org.id)
  if (available === null) return { ok: false, error: 'Could not check availability. Try again.' }

  return {
    ok: true,
    available,
    reason: available ? '' : 'That subdomain is already taken.',
    subdomain: check.subdomain,
  }
}

export async function saveOrgSubdomainAction(organizationId, subdomain) {
  const supabase = await createClient()
  const auth = await authorizeOrgOwner(supabase, organizationId)
  if (!auth.ok) return auth

  const check = validateSubdomain(subdomain)
  if (!check.valid) return { ok: false, error: check.reason }

  const available = await isSubdomainAvailable(check.subdomain, auth.org.id)
  if (available === null) return { ok: false, error: 'Could not check availability. Try again.' }
  if (!available) return { ok: false, error: 'That subdomain is already taken.' }

  const domain = await saveSubdomain(auth.org.id, check.subdomain)
  if (!domain) {
    // A null after a passing check almost always means we lost the unique-index
    // race to another org claiming the same subdomain a moment earlier.
    const stillFree = await isSubdomainAvailable(check.subdomain, auth.org.id)
    return { ok: false, error: stillFree ? 'Could not save the subdomain.' : 'That subdomain was just taken.' }
  }

  revalidatePath(ORG_ROUTE)
  return { ok: true, domain }
}

export async function removeOrgSubdomainAction(organizationId) {
  const supabase = await createClient()
  const auth = await authorizeOrgOwner(supabase, organizationId)
  if (!auth.ok) return auth

  const ok = await softDeleteDomain(auth.org.id)
  if (!ok) return { ok: false, error: 'Could not remove the subdomain.' }

  revalidatePath(ORG_ROUTE)
  return { ok: true }
}
