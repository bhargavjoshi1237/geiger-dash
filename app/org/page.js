import { redirect } from 'next/navigation'
import { Header } from '@/components/header'
import { createClient } from '@/utils/supabase/server'
import { requireUser } from '@/supabase/user/getUser'
import { getUserOrganizations } from '@/lib/org/membership'
import { OrganizationsClient } from './organizations-client'

export const dynamic = 'force-dynamic'

export default async function OrganizationsPage({ searchParams }) {
  const params = await searchParams
  const supabase = await createClient()
  const user = await requireUser(supabase, '/login?next=org')

  const { organizations, error: loadError } = await getUserOrganizations(supabase, user.id)

  // New users with no organization are routed through the onboarding wizard.
  // Only redirect on a clean read — never bounce away because a query errored.
  if (!loadError && organizations.length === 0) {
    redirect('/onboarding')
  }

  const error =
    loadError ||
    (typeof params?.error === 'string' ? decodeURIComponent(params.error) : '')

  return (
    <div className="geiger-flow-palette min-h-screen bg-background text-foreground">
      <Header megaMenue={false} />
      <OrganizationsClient
        organizations={organizations}
        userId={user.id}
        searchState={{
          created: params?.created === '1',
          joined: params?.joined === '1',
          error,
        }}
      />
    </div>
  )
}
