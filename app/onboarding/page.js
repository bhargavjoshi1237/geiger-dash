import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { requireUser } from '@/supabase/user/getUser'
import { getUserOrganizations } from '@/lib/org/membership'
import { getMyPendingJoinRequests } from '@/lib/org/join-requests'
import { OnboardingWizard } from './onboarding-wizard'

export const dynamic = 'force-dynamic'

export default async function OnboardingPage() {
  const supabase = await createClient()
  const user = await requireUser(supabase, '/login?next=org')

  // Already belongs to an org → skip the wizard and go straight to the dashboard.
  const { organizations, error } = await getUserOrganizations(supabase, user.id)
  if (!error && organizations.length > 0) {
    redirect('/org')
  }

  // A request still awaiting an owner's approval reopens the wizard on its pending state.
  const pendingRequests = await getMyPendingJoinRequests(supabase)

  return <OnboardingWizard email={user.email || ''} pendingRequests={pendingRequests} />
}
