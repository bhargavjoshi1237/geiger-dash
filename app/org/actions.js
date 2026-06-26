'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { requireUser } from '@/supabase/user/getUser'

function cleanText(value) {
  return String(value || '').trim()
}

const ORG_ROUTE = '/org'

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
  await requireUser(supabase, '/login?next=org')
  const organizationId = cleanText(formData.get('organization_id'))

  if (!organizationId) {
    redirect(`${ORG_ROUTE}?error=missing_join_id`)
  }

  // Join through the SECURITY DEFINER RPC: under RLS a non-member can't read the
  // org row directly, and the RPC keeps organization_users + metadata in sync.
  const { data, error } = await supabase.rpc('join_organization', { q: organizationId })

  if (error) {
    redirect(`${ORG_ROUTE}?error=${encodeURIComponent(error.message)}`)
  }
  const row = Array.isArray(data) ? data[0] : data
  if (!row) {
    redirect(`${ORG_ROUTE}?error=organization_not_found`)
  }

  revalidatePath(ORG_ROUTE)
  redirect(`${ORG_ROUTE}?joined=1`)
}
