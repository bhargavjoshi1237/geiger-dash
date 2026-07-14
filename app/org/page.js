import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { Header } from '@/components/header'
import { createClient } from '@/utils/supabase/server'
import { requireUser } from '@/supabase/user/getUser'
import { getUserOrganizations } from '@/lib/org/membership'
import { getOrgBySubdomain } from '@/lib/domains/store'
import { OrganizationsClient } from './organizations-client'

export const dynamic = 'force-dynamic'

export default async function OrganizationsPage({ searchParams }) {
  const params = await searchParams
  const supabase = await createClient()
  const user = await requireUser(supabase, '/login?next=org')

  const { organizations, error: loadError } = await getUserOrganizations(supabase, user.id)

  // On a subdomain host (set by middleware), pin the page to that one org.
  const subdomain = (await headers()).get('x-geiger-subdomain') || ''
  let scope = null
  let targetId = null
  if (subdomain) {
    const target = await getOrgBySubdomain(subdomain)
    if (!target) {
      scope = { subdomain, orgName: '', status: 'not-found' }
    } else {
      targetId = target.id
      const isMember = organizations.some((org) => org.id === target.id)
      scope = {
        subdomain,
        orgName: target.name,
        status: isMember ? 'member' : 'not-member',
      }
    }
  }

  // New users with no organization go through onboarding — but never bounce a
  // subdomain visitor (they may have other orgs) or on a read that errored.
  if (!scope && !loadError && organizations.length === 0) {
    redirect('/onboarding')
  }

  // When pinned to an org the viewer belongs to, show only that one.
  const visibleOrganizations =
    scope?.status === 'member'
      ? organizations.filter((org) => org.id === targetId)
      : organizations

  const error =
    loadError ||
    (typeof params?.error === 'string' ? decodeURIComponent(params.error) : '')

  return (
    <div className="geiger-flow-palette min-h-screen bg-background text-foreground">
      <Header megaMenue={false} />
      <OrganizationsClient
        organizations={visibleOrganizations}
        userId={user.id}
        searchState={{
          created: params?.created === '1',
          joined: params?.joined === '1',
          error,
        }}
        scope={scope}
      />
    </div>
  )
}
