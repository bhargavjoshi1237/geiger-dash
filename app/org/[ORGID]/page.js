import Link from 'next/link'
import { ArrowUpRight, Building2, Hash, Sparkles } from 'lucide-react'
import { Header } from '@/components/header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getOrganizationProjects } from '@/lib/org/projects'
import { getOrgEntitlements } from '@/lib/billing/entitlements'
import { OrganizationProjectsClient } from './organization-projects-client'

export const dynamic = 'force-dynamic'

export default async function OrganizationDetailPage({ params, searchParams }) {
  const { ORGID } = await params
  const query = await searchParams
  const { organization, projects, error } = await getOrganizationProjects(ORGID)
  
  // Pass notification params to client component
  const notificationParams = {
    projectCreated: query?.project_created === '1',
    projectRenamed: query?.project_renamed === '1',
    projectDeleted: query?.project_deleted === '1',
    projectError: typeof query?.project_error === 'string' ? query.project_error : null,
  }

  const projectCount = projects?.length || 0
  const entitlements = organization ? getOrgEntitlements(organization) : null
  const projectLimit = entitlements?.limits?.projects
  const projectLimitLabel = projectLimit === Infinity || projectLimit == null ? '∞' : projectLimit

  // Client-safe shape: Infinity isn't JSON-serializable, so unlimited => null.
  const clientEntitlements = entitlements
    ? {
        hasSubscription: entitlements.hasSubscription,
        planName: entitlements.planName,
        planKey: entitlements.planKey,
        unlockedProducts: entitlements.unlockedProducts, // null = all unlocked
        projectLimit: entitlements.limits.projects === Infinity ? null : entitlements.limits.projects,
      }
    : null

  return (
    <div className="geiger-flow-palette min-h-screen bg-background text-foreground">
      <Header megaMenue={false} />

      <main className="mx-auto flex min-h-[60vh] max-w-5xl flex-col bg-background px-4 pb-20 pt-24 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-border bg-surface-subtle text-foreground">
              <Building2 className="size-6" />
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="truncate text-2xl font-semibold tracking-tight">
                  {organization?.name || 'Organization'}
                </h1>
                {organization ? (
                  <Badge variant={organization.is_active ? 'success' : 'secondary'}>
                    {organization.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                ) : null}
              </div>
              <p className="mt-1 truncate text-sm text-muted-foreground">
                {projectCount} {projectCount === 1 ? 'project' : 'projects'} · Shared workspaces across the Geiger suite
              </p>
            </div>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-md border border-border bg-surface-subtle px-2.5 py-1.5 font-mono text-[11px] text-tertiary sm:self-auto">
            <Hash className="size-3" />
            {ORGID}
          </span>
        </header>

        {organization ? (
          <div className="mt-6 flex flex-col gap-3 rounded-xl border border-border bg-surface-card p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
                <Sparkles className="size-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {entitlements?.hasSubscription ? `${entitlements.planName} plan` : 'No active plan'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {entitlements?.hasSubscription
                    ? `${projectCount}/${projectLimitLabel} projects · ${entitlements.unlockedProducts.length} product${entitlements.unlockedProducts.length === 1 ? '' : 's'} unlocked`
                    : 'All products available. Choose a plan to set limits and billing.'}
                </p>
              </div>
            </div>
            <Button asChild variant="outline" size="sm" className="shrink-0">
              <Link href="/pricing">
                {entitlements?.hasSubscription ? 'Manage plan' : 'Choose a plan'}
                <ArrowUpRight className="size-4" />
              </Link>
            </Button>
          </div>
        ) : null}

        {error ? (
          <div className="mt-8 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            {error}
          </div>
        ) : null}

        {organization ? (
          <section className="mt-8">
            <OrganizationProjectsClient
              organizationId={ORGID}
              projects={projects}
              notificationParams={notificationParams}
              entitlements={clientEntitlements}
            />
          </section>
        ) : null}
      </main>
    </div>
  )
}
