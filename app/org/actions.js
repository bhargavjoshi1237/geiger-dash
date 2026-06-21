'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { requireUser } from '@/supabase/user/getUser'

function cleanText(value) {
  return String(value || '').trim()
}

const ORG_ROUTE = '/org'

function normalizeMembers(metadata) {
  const members = Array.isArray(metadata?.members) ? metadata.members : []
  return members.map(String).filter(Boolean)
}

export async function createOrganizationAction(formData) {
  const supabase = await createClient()
  const user = await requireUser(supabase)

  const name = cleanText(formData.get('name'))
  const description = cleanText(formData.get('description'))
  const country = cleanText(formData.get('country')) || null
  const phone = cleanText(formData.get('phone')) || null

  if (!name || !description) {
    redirect(`${ORG_ROUTE}?error=missing_required`)
  }

  const { error } = await supabase.from('organizations').insert({
    name,
    description,
    country,
    phone,
    created_by: user.id,
    owner: user.id,
    created_at: new Date().toISOString(),
    is_active: true,
    metadata: {
      members: [user.id],
    },
  })

  if (error) {
    redirect(`${ORG_ROUTE}?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath(ORG_ROUTE)
  redirect(`${ORG_ROUTE}?created=1`)
}

export async function joinOrganizationAction(formData) {
  const supabase = await createClient()
  const user = await requireUser(supabase, '/login?next=org')
  const organizationId = cleanText(formData.get('organization_id'))

  if (!organizationId) {
    redirect(`${ORG_ROUTE}?error=missing_join_id`)
  }

  const { data: organization, error: loadError } = await supabase
    .from('organizations')
    .select('id, metadata')
    .eq('id', organizationId)
    .single()

  if (loadError || !organization) {
    redirect(`${ORG_ROUTE}?error=organization_not_found`)
  }

  const members = normalizeMembers(organization.metadata)
  const nextMembers = members.includes(user.id) ? members : [...members, user.id]
  const nextMetadata = {
    ...(organization.metadata && typeof organization.metadata === 'object'
      ? organization.metadata
      : {}),
    members: nextMembers,
  }

  const { error } = await supabase
    .from('organizations')
    .update({ metadata: nextMetadata })
    .eq('id', organization.id)

  if (error) {
    redirect(`${ORG_ROUTE}?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath(ORG_ROUTE)
  redirect(`${ORG_ROUTE}?joined=1`)
}
