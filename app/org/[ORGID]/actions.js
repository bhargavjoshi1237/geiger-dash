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