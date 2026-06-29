'use server'

import { randomUUID } from 'crypto'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { PRODUCT_APPS } from '@/lib/org/product-apps'
import { createClient as createServerClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { requireUser } from '@/supabase/user/getUser'
import { getOrgEntitlements, canAddProject, isProductUnlocked } from '@/lib/billing/entitlements'

const PRODUCT_ID_SET = new Set(PRODUCT_APPS.map((product) => product.id))

function cleanText(value) {
  return typeof value === 'string' ? value.trim() : ''
}

function slugify(value) {
  return cleanText(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
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

  // Plan enforcement — gate against the org's recorded subscription. No active
  // subscription is treated as unrestricted (see lib/billing/entitlements.js).
  const entitlements = getOrgEntitlements(organization)

  const lockedSelected = selectedProductIds.filter(
    (productId) => !isProductUnlocked(entitlements, productId),
  )
  if (lockedSelected.length) {
    redirectWithProjectError(organizationId, 'plan_product_locked')
  }

  if (entitlements.limits.projects !== Infinity) {
    const { count: projectCount } = await supabase
      .from('projects')
      .select('id', { count: 'exact', head: true })
      .eq('organization_id', organizationId)
      .is('deleted_at', null)
    if (!canAddProject(entitlements, projectCount || 0)) {
      redirectWithProjectError(organizationId, 'plan_limit_projects')
    }
  }

  const projectId = randomUUID()
  const planId = randomUUID()
  const organizationProjectId = randomUUID()
  const planPayload = {
    ...(title ? { title } : {}),
    selectedProducts: selectedProductIds,
    products: selectedProductIds,
  }

  // Flow (and other products) read the display name from projects.name, so write
  // it here — defaulting to a sensible label when no title was given.
  const projectName = title || 'Untitled project'
  const { error: projectError } = await supabase.from('projects').insert({
    id: projectId,
    organization_id: organizationId,
    created_by: user.id,
    name: projectName,
    slug: slugify(projectName) || 'project',
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
  const projectId = cleanText(formData.get('project_id'))
  const title = cleanText(formData.get('title'))

  if (!organizationId || !planId) {
    redirectWithProjectError(organizationId, 'missing_organization_id')
  }
  if (!(await userCanManageOrg(admin, organizationId, user.id))) {
    redirectWithProjectError(organizationId, 'forbidden')
  }

  // The name is stored in two places kept in sync: plan.title (dash legacy) and
  // projects.name (what Flow and other products read).
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

  if (projectId) {
    const projectName = title || 'Untitled project'
    await admin
      .from('projects')
      .update({ name: projectName, slug: slugify(projectName) || 'project' })
      .eq('id', projectId)
  }

  revalidatePath(`/org/${organizationId}`)
  redirect(`/org/${organizationId}?project_renamed=1`)
}

export async function updateProjectAction(formData) {
  const serverSupabase = await createServerClient()
  const user = await requireUser(serverSupabase, '/login?next=org')
  const admin = createAdminClient() || serverSupabase
  const organizationId = cleanText(formData.get('organization_id'))
  const planId = cleanText(formData.get('plan_id'))
  const projectId = cleanText(formData.get('project_id'))
  const title = cleanText(formData.get('title'))

  if (!organizationId || !planId) {
    redirectWithProjectError(organizationId, 'missing_organization_id')
  }
  if (!(await userCanManageOrg(admin, organizationId, user.id))) {
    redirectWithProjectError(organizationId, 'forbidden')
  }

  const rawProductIds = formData.getAll('products').map(cleanText).filter(Boolean)
  const invalidProductIds = rawProductIds.filter((id) => !PRODUCT_ID_SET.has(id))
  if (invalidProductIds.length) {
    redirectWithProjectError(organizationId, 'invalid_products')
  }
  const selectedProductIds = Array.from(new Set(rawProductIds))

  // Validate against the org's plan entitlements.
  const { data: orgRow } = await admin
    .from('organizations')
    .select('metadata')
    .eq('id', organizationId)
    .single()
  const entitlements = getOrgEntitlements(orgRow || {})
  const lockedSelected = selectedProductIds.filter((id) => !isProductUnlocked(entitlements, id))
  if (lockedSelected.length) {
    redirectWithProjectError(organizationId, 'plan_product_locked')
  }

  const { data: planRow } = await admin.from('plan').select('plan').eq('id', planId).single()
  const currentPlan = planRow?.plan && typeof planRow.plan === 'object' ? planRow.plan : {}
  const nextPlan = { ...currentPlan, products: selectedProductIds, selectedProducts: selectedProductIds }
  if (title) {
    nextPlan.title = title
  } else {
    delete nextPlan.title
  }

  const { error } = await admin.from('plan').update({ plan: nextPlan }).eq('id', planId)
  if (error) {
    redirectWithProjectError(organizationId, 'project_update_failed')
  }

  if (projectId) {
    const projectName = title || 'Untitled project'
    await admin
      .from('projects')
      .update({ name: projectName, slug: slugify(projectName) || 'project' })
      .eq('id', projectId)
  }

  revalidatePath(`/org/${organizationId}`)
  redirect(`/org/${organizationId}?project_updated=1`)
}

export async function updateProjectAvatarAction(formData) {
  const serverSupabase = await createServerClient()
  const user = await requireUser(serverSupabase, '/login?next=org')
  const organizationId = cleanText(formData.get('organization_id'))
  const projectId = cleanText(formData.get('project_id'))
  const file = formData.get('avatar')

  if (!projectId || !file || file.size === 0) {
    return { ok: false, error: 'Missing file or project.' }
  }
  if (file.size > 2 * 1024 * 1024) {
    return { ok: false, error: 'File must be under 2 MB.' }
  }

  const admin = createAdminClient()
  if (!admin) return { ok: false, error: 'Storage is not configured.' }

  if (!(await userCanManageOrg(admin, organizationId, user.id))) {
    return { ok: false, error: 'You do not have permission to update this project.' }
  }

  await admin.storage.createBucket('projects', { public: true }).catch(() => {})

  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg'
  const path = `${projectId}/avatar.${ext}`
  const bytes = await file.arrayBuffer()

  const { error: uploadError } = await admin.storage
    .from('projects')
    .upload(path, bytes, { contentType: file.type, upsert: true })

  if (uploadError) return { ok: false, error: uploadError.message }

  const { data: { publicUrl } } = admin.storage.from('projects').getPublicUrl(path)

  const { error: updateError } = await admin
    .from('projects')
    .update({ avatar_url: publicUrl })
    .eq('id', projectId)

  if (updateError) return { ok: false, error: updateError.message }

  revalidatePath(`/org/${organizationId}`)
  return { ok: true, url: publicUrl }
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