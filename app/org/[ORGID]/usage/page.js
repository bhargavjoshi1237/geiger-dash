import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Header } from '@/components/header'
import Footer from '@/components/footer'
import { GridBackdrop } from '@/components/grid-backdrop'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getOrganizationProjects } from '@/lib/org/projects'
import { getOrgEntitlements } from '@/lib/billing/entitlements'
import { products as PRODUCT_CATALOG } from '@/lib/pricing/plans'
import { UsageScreen } from './usage-client'

export const dynamic = 'force-dynamic'

const PRODUCT_BY_ID = new Map(PRODUCT_CATALOG.map((p) => [p.id, p]))

export default async function OrganizationUsagePage({ params }) {
  const { ORGID } = await params
  const { organization, projects, error } = await getOrganizationProjects(ORGID)

  const entitlements = organization ? getOrgEntitlements(organization) : null
  const projectCount = projects?.length || 0

  // Client-safe shape. Allowances come from what the org actually purchased
  // (entitlements.currentMetrics); with no plan they read 0 and the screen shows
  // its "no plan" state. Infinity isn't JSON-serializable — coerce to null.
  const metrics = entitlements?.currentMetrics || {}
  const ownedIds = Array.isArray(entitlements?.unlockedProducts) ? entitlements.unlockedProducts : []
  const usage = organization
    ? {
        organizationId: ORGID,
        organizationName: organization.name || 'Organization',
        hasSubscription: Boolean(entitlements?.hasSubscription),
        isTrial: Boolean(entitlements?.isTrial),
        planName: entitlements?.planName || null,
        billingInterval: entitlements?.billingInterval || null,
        allowances: {
          projects: metrics.projects ?? 0,
          seats: metrics.seats ?? 0,
          storage: metrics.storage ?? 0,
          bandwidth: metrics.bandwidth ?? 0,
          edgeData: metrics.edgeData ?? 0,
          aiCredits: metrics.aiCredits ?? 0,
          emails: metrics.emails ?? 0,
        },
        // Only projects has a real "used" count today; the rest await a usage
        // pipeline and render 0.
        used: { projects: projectCount },
        ownedProducts: ownedIds
          .map((id) => PRODUCT_BY_ID.get(id))
          .filter(Boolean)
          .map((p) => ({ id: p.id, name: p.name, category: p.category })),
      }
    : null

  return (
    <div className="flex min-h-screen w-full flex-col overflow-x-clip bg-background text-foreground">
      <GridBackdrop variant="subtle" />
      <Header />

      <main className="relative z-10 mx-auto w-full max-w-4xl flex-1 px-4 pb-20 pt-24 sm:px-6 lg:px-8">
        <Link
          href={`/org/${ORGID}`}
          className="mb-6 inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to Organization
        </Link>

        <header className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold tracking-tight">Usage</h1>
            <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <span className="truncate">
                {organization?.name || 'Organization'} · what you&apos;re using against the
                allowance you&apos;ve purchased
              </span>
              {usage?.hasSubscription ? (
                <Badge variant={usage.isTrial ? 'warning' : 'success'}>
                  {usage.planName} {usage.isTrial ? 'trial' : 'plan'}
                </Badge>
              ) : null}
            </p>
          </div>
          <Button asChild variant="outline" className="shrink-0">
            <Link href="/pricing">
              {usage?.hasSubscription ? 'Add Capacity' : 'Choose a Plan'}
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </header>

        {error || !organization ? (
          <div className="mt-8 rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error || 'Organization not found.'}
          </div>
        ) : (
          <UsageScreen usage={usage} />
        )}
      </main>
      <Footer />
    </div>
  )
}
