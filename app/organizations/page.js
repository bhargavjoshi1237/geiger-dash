import { redirect } from 'next/navigation'
import { Header } from '@/components/header'
import { createClient } from '@/utils/supabase/server'
import { OrganizationsClient } from './organizations-client'

export const dynamic = 'force-dynamic'

function uniqueOrganizations(groups) {
  const seen = new Map()

  for (const group of groups) {
    for (const organization of group || []) {
      seen.set(String(organization.id), organization)
    }
  }

  return Array.from(seen.values()).sort((a, b) => {
    const aTime = a.created_at ? new Date(a.created_at).getTime() : 0
    const bTime = b.created_at ? new Date(b.created_at).getTime() : 0
    return bTime - aTime
  })
}

export default async function OrganizationsPage({ searchParams }) {
  const params = await searchParams
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?next=organizations')
  }

  const selectFields = 'id, name, description, created_by, created_at, owner, metadata, is_active, country, phone'
  const [createdResult, ownedResult, joinedResult] = await Promise.all([
    supabase.from('organizations').select(selectFields).eq('created_by', user.id),
    supabase.from('organizations').select(selectFields).eq('owner', user.id),
    supabase.from('organizations').select(selectFields).contains('metadata', { members: [user.id] }),
  ])

  const organizations = uniqueOrganizations([
    createdResult.data,
    ownedResult.data,
    joinedResult.data,
  ])

  const error =
    createdResult.error?.message ||
    ownedResult.error?.message ||
    joinedResult.error?.message ||
    (typeof params?.error === 'string' ? decodeURIComponent(params.error) : '')

  return (
    <>
      <Header />
      <OrganizationsClient
        organizations={organizations}
        userId={user.id}
        searchState={{
          created: params?.created === '1',
          joined: params?.joined === '1',
          error,
        }}
      />
    </>
  )
}
