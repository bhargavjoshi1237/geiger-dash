import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { Header } from '@/components/header'
import Footer from '@/components/footer'
import { GridBackdrop } from '@/components/grid-backdrop'
import { Button } from '@/components/ui/button'
import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { requireUser } from '@/supabase/user/getUser'
import { getUserOrganizations } from '@/lib/org/membership'
import { avatarUrlForUser } from '@/lib/avatar-url'
import { getUserPlan, listPurchases } from '@/lib/billing/store'
import { derivePlanState } from '@/lib/billing/plan_state'
import { getPlan } from '@/lib/pricing/plans'
import { ProfileClient } from './profile-client'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Your profile',
  robots: { index: false, follow: false },
}

function roleFor(organization, userId) {
  if (organization.owner === userId) return 'Owner'
  if (organization.created_by === userId) return 'Creator'
  return 'Member'
}

// Pending invites are read with the service role on purpose: RLS only lets
// members read `organization_invites`, and the whole point here is to surface
// invites to someone who has NOT joined yet.
async function listPendingInvites(email) {
  const admin = createAdminClient()
  if (!admin || !email) return []

  const { data, error } = await admin
    .from('organization_invites')
    .select('id, token, role, created_at, organization_id, organizations(name, avatar_url)')
    .eq('email', email.toLowerCase())
    .eq('status', 'pending')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[profile.invites]', error.message)
    return []
  }

  return (data || []).map((row) => ({
    id: row.id,
    token: row.token,
    role: row.role,
    createdAt: row.created_at,
    organizationId: row.organization_id,
    organizationName: row.organizations?.name || 'An organization',
    organizationAvatar: row.organizations?.avatar_url || '',
  }))
}

// One count across every organization the user belongs to, rather than a
// per-org round trip.
async function countProjects(supabase, organizationIds) {
  if (organizationIds.length === 0) return 0

  const { count, error } = await supabase
    .from('organization_project')
    .select('id', { count: 'exact', head: true })
    .in('organisition', organizationIds)

  if (error) {
    console.error('[profile.projects]', error.message)
    return 0
  }
  return count || 0
}

export default async function ProfilePage({ params }) {
  const { USERID } = await params
  const supabase = await createClient()
  const user = await requireUser(supabase, `/login?next=/profile/${USERID}`)

  // The hub is personal — land everyone on their own profile.
  if (USERID !== user.id) {
    redirect(`/profile/${user.id}`)
  }

  const { organizations, error: orgError } = await getUserOrganizations(supabase, user.id)
  const organizationIds = organizations.map((organization) => organization.id)

  const [projectCount, plan, purchases, invites] = await Promise.all([
    countProjects(supabase, organizationIds),
    getUserPlan(user.id),
    listPurchases(user.id),
    listPendingInvites(user.email),
  ])

  const planState = derivePlanState(plan)
  const meta = user.user_metadata || {}
  const identities = Array.isArray(user.identities) ? user.identities : []

  const completedPurchases = purchases.filter((purchase) => purchase.status === 'completed')

  const profile = {
    id: user.id,
    email: user.email || '',
    emailVerified: Boolean(user.email_confirmed_at),
    createdAt: user.created_at || null,
    lastSignInAt: user.last_sign_in_at || null,
    provider: user.app_metadata?.provider || 'email',
    providers: identities.length
      ? identities.map((identity) => identity.provider)
      : [user.app_metadata?.provider || 'email'],
    avatarUrl: avatarUrlForUser(user),
    displayName: meta.full_name || meta.name || (user.email || '').split('@')[0] || 'You',
    jobTitle: meta.job_title || '',
    company: meta.company || '',
    location: meta.location || '',
    website: meta.website || '',
    bio: meta.bio || '',
    productEmails: meta.product_emails !== false,
    marketingEmails: Boolean(meta.marketing_emails),
  }

  const billing = {
    planKey: plan?.planKey || null,
    planName: plan?.planKey ? getPlan(plan.planKey)?.name || plan.planKey : null,
    billingInterval: plan?.billingInterval || null,
    amountTotal: plan?.amountTotal || 0,
    currency: plan?.currency || 'usd',
    startedAt: plan?.startedAt || null,
    phase: planState.phase,
    isTrial: planState.isTrial,
    daysRemaining: planState.daysRemaining,
    periodEnd: planState.periodEnd ? planState.periodEnd.toISOString() : null,
    deletionDate: planState.deletionDate ? planState.deletionDate.toISOString() : null,
    deletionDaysRemaining: planState.deletionDaysRemaining,
    totalSpent: completedPurchases.reduce((sum, purchase) => sum + (purchase.amountTotal || 0), 0),
    paymentCount: completedPurchases.length,
    // Raw ids — <ProductAccess> resolves them against the catalog itself.
    productIds: Array.isArray(plan?.products) ? plan.products : [],
    recentPurchases: purchases.slice(0, 4).map((purchase) => ({
      id: purchase.id,
      planKey: purchase.planKey,
      planName: purchase.planKey ? getPlan(purchase.planKey)?.name || purchase.planKey : '—',
      billingInterval: purchase.billingInterval,
      amountTotal: purchase.amountTotal,
      currency: purchase.currency,
      status: purchase.status,
      createdAt: purchase.createdAt,
    })),
  }

  const workspaces = organizations.map((organization) => ({
    id: organization.id,
    name: organization.name || 'Organization',
    description: organization.description || '',
    avatarUrl: organization.avatar_url || '',
    isActive: Boolean(organization.is_active),
    memberCount: organization.memberCount || 0,
    createdAt: organization.created_at || null,
    role: roleFor(organization, user.id),
  }))

  return (
    <div className="flex min-h-screen w-full flex-col overflow-x-clip bg-background text-foreground">
      <GridBackdrop variant="subtle" />
      <Header />
      <main className="relative z-10 mx-auto w-full max-w-4xl flex-1 px-4 pb-20 pt-24 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Profile</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Your account, organizations, and plan.
            </p>
          </div>
          <Button asChild variant="outline" className="shrink-0">
            <Link href="/org">
              Open Workspace
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </header>

        <ProfileClient
          profile={profile}
          billing={billing}
          workspaces={workspaces}
          invites={invites}
          projectCount={projectCount}
          loadError={orgError}
        />
      </main>
      <Footer />
    </div>
  )
}
