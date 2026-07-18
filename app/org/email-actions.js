'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'
import { requireUser } from '@/supabase/user/getUser'
import { getOrgEntitlements, isProductUnlocked } from '@/lib/billing/entitlements'
import {
  listOrgEmailTemplates,
  createOrgEmailTemplate,
  updateOrgEmailTemplate,
  softDeleteEmailTemplate,
} from '@/lib/email/store'

const ORG_ROUTE = '/org'

// Verify the caller owns the org (owner/creator) AND the org owns the email
// templates add-on. Uses the user's RLS-scoped client so the select proves
// membership, and re-derives entitlements from org metadata server-side (the
// client's view of "what's owned" is never trusted). Returns { ok, org, user }
// or { ok:false, error }.
async function authorizeEmailManager(supabase, organizationId) {
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
  if (!isProductUnlocked(getOrgEntitlements(org), 'emailTemplate')) {
    return { ok: false, error: 'This organization does not have the email templates add-on.' }
  }
  return { ok: true, org, user }
}

function sanitizeInput(input = {}) {
  return {
    name: String(input.name ?? '').trim().slice(0, 120) || 'Untitled template',
    eventName: String(input.eventName ?? '').trim().slice(0, 160),
    subject: String(input.subject ?? '').trim().slice(0, 300),
    body: String(input.body ?? ''),
    status: input.status === 'active' ? 'active' : 'draft',
  }
}

export async function listOrgEmailTemplatesAction(organizationId) {
  const supabase = await createClient()
  const auth = await authorizeEmailManager(supabase, organizationId)
  if (!auth.ok) return auth

  const templates = await listOrgEmailTemplates(auth.org.id)
  if (templates === null) return { ok: false, error: 'Could not load templates.' }
  return { ok: true, templates }
}

export async function createOrgEmailTemplateAction(organizationId, input) {
  const supabase = await createClient()
  const auth = await authorizeEmailManager(supabase, organizationId)
  if (!auth.ok) return auth

  const clean = sanitizeInput(input)
  const template = await createOrgEmailTemplate(auth.org.id, { ...clean, createdBy: auth.user.id })
  if (!template) return { ok: false, error: 'Could not create the template.' }

  revalidatePath(ORG_ROUTE)
  return { ok: true, template }
}

export async function updateOrgEmailTemplateAction(organizationId, id, patch) {
  const supabase = await createClient()
  const auth = await authorizeEmailManager(supabase, organizationId)
  if (!auth.ok) return auth
  if (!id) return { ok: false, error: 'Missing template.' }

  const template = await updateOrgEmailTemplate(auth.org.id, id, sanitizeInput(patch))
  if (!template) return { ok: false, error: 'Could not save the template.' }

  revalidatePath(ORG_ROUTE)
  return { ok: true, template }
}

export async function deleteOrgEmailTemplateAction(organizationId, id) {
  const supabase = await createClient()
  const auth = await authorizeEmailManager(supabase, organizationId)
  if (!auth.ok) return auth
  if (!id) return { ok: false, error: 'Missing template.' }

  const ok = await softDeleteEmailTemplate(auth.org.id, id)
  if (!ok) return { ok: false, error: 'Could not delete the template.' }

  revalidatePath(ORG_ROUTE)
  return { ok: true }
}
