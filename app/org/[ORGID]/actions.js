'use server'

import { randomUUID } from 'crypto'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { PRODUCT_APPS } from '@/lib/org/product-apps'
import { createClient as createServerClient } from '@/utils/supabase/server'
import { requireUser } from '@/supabase/user/getUser'

const PRODUCT_ID_SET = new Set(PRODUCT_APPS.map((product) => product.id))

function cleanText(value) {
  return typeof value === 'string' ? value.trim() : ''
}

function normalizeMembers(metadata) {
  const members = Array.isArray(metadata?.members) ? metadata.members : []

  return members
    .map((member) => (typeof member === 'string' ? member.trim() : ''))
    .filter(Boolean)
}

function redirectWithProjectError(organizationId, errorCode) {
  const basePath = organizationId ? `/org/${organizationId}` : '/org'

  redirect(`${basePath}?project_error=${encodeURIComponent(errorCode)}`)
}

function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    return null
  }

  return createSupabaseClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  })
}

async function rollbackProjectCreation(supabase, projectId, planId) {
  if (planId) {
    await supabase.from('plan').delete().eq('id', planId)
  }

  if (projectId) {
    await supabase.from('projects').delete().eq('id', projectId)
  }
}

export async function createProjectAction(formData) {
  const serverSupabase = await createServerClient()
  const user = await requireUser(serverSupabase, '/login?next=org')
  const supabase = createAdminClient() || serverSupabase
  const organizationId = cleanText(formData.get('organization_id'))
  const title = cleanText(formData.get('title'))

  if (!organizationId) {
    redirectWithProjectError('', 'missing_organization_id')
  }

  const { data: organization, error: organizationError } = await supabase
    .from('organizations')
    .select('id, owner, created_by, metadata')
    .eq('id', organizationId)
    .single()

  if (organizationError || !organization) {
    redirectWithProjectError(organizationId, 'organization_not_found')
  }

  const isMember = normalizeMembers(organization.metadata).includes(user.id)
  const isOwner = organization.owner === user.id || organization.created_by === user.id

  if (!isMember && !isOwner) {
    redirectWithProjectError(organizationId, 'forbidden')
  }

  const rawProductIds = formData.getAll('products').map(cleanText).filter(Boolean)
  const invalidProductIds = rawProductIds.filter((productId) => !PRODUCT_ID_SET.has(productId))

  if (invalidProductIds.length) {
    redirectWithProjectError(organizationId, 'invalid_products')
  }

  const selectedProductIds = Array.from(new Set(rawProductIds))
  const projectId = randomUUID()
  const planId = randomUUID()
  const organizationProjectId = randomUUID()
  const planPayload = {
    ...(title ? { title } : {}),
    selectedProducts: selectedProductIds,
    products: selectedProductIds,
  }

  const { error: projectError } = await supabase.from('projects').insert({
    id: projectId,
    organization_id: organizationId,
    created_by: user.id,
  })

  if (projectError) {
    redirectWithProjectError(organizationId, 'project_create_failed')
  }

  const { error: planError } = await supabase.from('plan').insert({
    id: planId,
    organisation: organizationId,
    plan: planPayload,
  })

  if (planError) {
    await rollbackProjectCreation(supabase, projectId, null)
    redirectWithProjectError(organizationId, 'plan_create_failed')
  }

  const { error: linkError } = await supabase.from('organization_project').insert({
    id: organizationProjectId,
    project: projectId,
    organisition: organizationId,
    plan: planId,
  })

  if (linkError) {
    await rollbackProjectCreation(supabase, projectId, planId)
    redirectWithProjectError(organizationId, linkError.message || 'link_create_failed')
  }

  revalidatePath(`/org/${organizationId}`)
  redirect(`/org/${organizationId}?project_created=1`)
}

// Membership/ownership check for destructive project actions. Reads via the
// admin client (RLS-bypassing) and accepts org owner/creator, a relational
// organization_users row, or a legacy metadata.members array entry.
async function userCanManageOrg(admin, organizationId, userId) {
  const { data: org } = await admin
    .from('organizations')
    .select('owner, created_by, metadata')
    .eq('id', organizationId)
    .single()

  if (!org) return false
  if (org.owner === userId || org.created_by === userId) return true
  if (normalizeMembers(org.metadata).includes(userId)) return true

  const { data: membership } = await admin
    .from('organization_users')
    .select('id')
    .eq('organization', organizationId)
    .eq('user', userId)
    .limit(1)

  return Array.isArray(membership) && membership.length > 0
}

export async function renameProjectAction(formData) {
  const serverSupabase = await createServerClient()
  const user = await requireUser(serverSupabase, '/login?next=org')
  const admin = createAdminClient() || serverSupabase
  const organizationId = cleanText(formData.get('organization_id'))
  const planId = cleanText(formData.get('plan_id'))
  const title = cleanText(formData.get('title'))

  if (!organizationId || !planId) {
    redirectWithProjectError(organizationId, 'missing_organization_id')
  }
  if (!(await userCanManageOrg(admin, organizationId, user.id))) {
    redirectWithProjectError(organizationId, 'forbidden')
  }

  // The project name lives in the plan JSON (plan.title), so merge it in.
  const { data: planRow } = await admin.from('plan').select('plan').eq('id', planId).single()
  const currentPlan = planRow?.plan && typeof planRow.plan === 'object' ? planRow.plan : {}
  const nextPlan = { ...currentPlan }
  if (title) {
    nextPlan.title = title
  } else {
    delete nextPlan.title
  }

  const { error } = await admin.from('plan').update({ plan: nextPlan }).eq('id', planId)
  if (error) {
    redirectWithProjectError(organizationId, 'project_rename_failed')
  }

  revalidatePath(`/org/${organizationId}`)
  redirect(`/org/${organizationId}?project_renamed=1`)
}

export async function deleteProjectAction(formData) {
  const serverSupabase = await createServerClient()
  const user = await requireUser(serverSupabase, '/login?next=org')
  const admin = createAdminClient() || serverSupabase
  const organizationId = cleanText(formData.get('organization_id'))
  const linkId = cleanText(formData.get('organization_project_id'))
  const projectId = cleanText(formData.get('project_id'))
  const planId = cleanText(formData.get('plan_id'))

  if (!organizationId || !linkId) {
    redirectWithProjectError(organizationId, 'missing_organization_id')
  }
  if (!(await userCanManageOrg(admin, organizationId, user.id))) {
    redirectWithProjectError(organizationId, 'forbidden')
  }

  // Remove the bridge row first (it FKs project + plan), then the orphans.
  const { error } = await admin.from('organization_project').delete().eq('id', linkId)
  if (error) {
    redirectWithProjectError(organizationId, 'project_delete_failed')
  }
  if (planId) {
    await admin.from('plan').delete().eq('id', planId)
  }
  if (projectId) {
    await admin.from('projects').delete().eq('id', projectId)
  }

  revalidatePath(`/org/${organizationId}`)
  redirect(`/org/${organizationId}?project_deleted=1`)
}