'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

function cleanText(value) {
  return String(value || '').trim()
}

function normalizeMembers(metadata) {
  const members = Array.isArray(metadata?.members) ? metadata.members : []
  return members.map(String).filter(Boolean)
}

async function requireUser(supabase) {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?next=organizations')
  }

  return user
}

export async function createOrganizationAction(formData) {
  const supabase = await createClient()
  const user = await requireUser(supabase)

  const name = cleanText(formData.get('name'))
  const description = cleanText(formData.get('description'))
  const country = cleanText(formData.get('country')) || null
  const phone = cleanText(formData.get('phone')) || null

  if (!name || !description) {
    redirect('/organizations?error=missing_required')
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
    redirect(`/organizations?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/organizations')
  redirect('/organizations?created=1')
}

export async function joinOrganizationAction(formData) {
  const supabase = await createClient()
  const user = await requireUser(supabase)
  const organizationId = cleanText(formData.get('organization_id'))

  if (!organizationId) {
    redirect('/organizations?error=missing_join_id')
  }

  const { data: organization, error: loadError } = await supabase
    .from('organizations')
    .select('id, metadata')
    .eq('id', organizationId)
    .single()

  if (loadError || !organization) {
    redirect('/organizations?error=organization_not_found')
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
    redirect(`/organizations?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/organizations')
  redirect('/organizations?joined=1')
}
