// Data layer for per-org custom email templates (public.org_email_templates) —
// backs the purchasable "Custom email templates" add-on.
//
// This is the ONLY place that reads/writes that table. It uses the service-role
// admin client so writes don't depend on the caller's RLS; the server actions in
// app/org/email-actions.js own authorization (org ownership + add-on) and UX.
// Pure: returns null/false/[] on failure, console.error, never throws, never toasts.
//
// DB is snake_case; callers get camelCase view models.

import { createAdminClient } from '@/utils/supabase/admin'

const TABLE = 'org_email_templates'

export function normalizeEmailTemplate(row) {
  if (!row) return null
  const meta = row.metadata && typeof row.metadata === 'object' ? row.metadata : {}
  return {
    id: row.id,
    organizationId: row.organization_id,
    name: row.name ?? '',
    eventName: row.event_name ?? '',
    subject: row.subject ?? '',
    body: row.body ?? '',
    status: row.status ?? 'draft',
    createdBy: row.created_by ?? null,
    createdAt: row.created_at ?? null,
    updatedAt: row.updated_at ?? null,
    ...meta,
  }
}

// camelCase patch -> snake_case columns. Emits a column only when its key is
// present, so one helper serves both a full create and a partial inline update.
function toRow(input) {
  const row = {}
  const map = {
    name: 'name',
    eventName: 'event_name',
    subject: 'subject',
    body: 'body',
    status: 'status',
    createdBy: 'created_by',
  }
  for (const [key, col] of Object.entries(map)) if (key in input) row[col] = input[key]
  return row
}

export async function listOrgEmailTemplates(organizationId) {
  const sb = createAdminClient()
  if (!sb || !organizationId) return null
  try {
    const { data, error } = await sb
      .from(TABLE)
      .select('*')
      .eq('organization_id', organizationId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
    if (error) {
      console.error('[email.listOrgEmailTemplates]', error.message)
      return null
    }
    return (data || []).map(normalizeEmailTemplate)
  } catch (e) {
    console.error('[email.listOrgEmailTemplates]', e)
    return null
  }
}

export async function getOrgEmailTemplate(organizationId, id) {
  const sb = createAdminClient()
  if (!sb || !organizationId || !id) return null
  try {
    const { data, error } = await sb
      .from(TABLE)
      .select('*')
      .eq('organization_id', organizationId)
      .eq('id', id)
      .is('deleted_at', null)
      .maybeSingle()
    if (error) {
      console.error('[email.getOrgEmailTemplate]', error.message)
      return null
    }
    return normalizeEmailTemplate(data)
  } catch (e) {
    console.error('[email.getOrgEmailTemplate]', e)
    return null
  }
}

export async function createOrgEmailTemplate(organizationId, input = {}) {
  const sb = createAdminClient()
  if (!sb || !organizationId) return null
  try {
    const payload = { ...toRow(input), organization_id: organizationId }
    if (input.id) payload.id = input.id
    const { data, error } = await sb.from(TABLE).insert(payload).select('*').single()
    if (error) {
      console.error('[email.createOrgEmailTemplate]', error.message)
      return null
    }
    return normalizeEmailTemplate(data)
  } catch (e) {
    console.error('[email.createOrgEmailTemplate]', e)
    return null
  }
}

export async function updateOrgEmailTemplate(organizationId, id, patch = {}) {
  const sb = createAdminClient()
  if (!sb || !organizationId || !id) return null
  try {
    const { data, error } = await sb
      .from(TABLE)
      .update(toRow(patch))
      .eq('organization_id', organizationId)
      .eq('id', id)
      .is('deleted_at', null)
      .select('*')
      .single()
    if (error) {
      console.error('[email.updateOrgEmailTemplate]', error.message)
      return null
    }
    return normalizeEmailTemplate(data)
  } catch (e) {
    console.error('[email.updateOrgEmailTemplate]', e)
    return null
  }
}

export async function softDeleteEmailTemplate(organizationId, id) {
  const sb = createAdminClient()
  if (!sb || !organizationId || !id) return false
  try {
    const { error } = await sb
      .from(TABLE)
      .update({ deleted_at: new Date().toISOString() })
      .eq('organization_id', organizationId)
      .eq('id', id)
      .is('deleted_at', null)
    if (error) {
      console.error('[email.softDeleteEmailTemplate]', error.message)
      return false
    }
    return true
  } catch (e) {
    console.error('[email.softDeleteEmailTemplate]', e)
    return false
  }
}
