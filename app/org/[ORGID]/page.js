import Image from 'next/image'
import { Building2, Hash } from 'lucide-react'
import { Header } from '@/components/header'
import { Badge } from '@/components/ui/badge'
import { getOrganizationProjects } from '@/lib/org/projects'
import { getOrgEntitlements } from '@/lib/billing/entitlements'
import { OrganizationProjectsClient } from './organization-projects-client'
import { NewProjectButton } from './new-project-button'

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
    projectUpdated: query?.project_updated === '1',
    projectError: typeof query?.project_error === 'string' ? query.project_error : null,
  }

  const projectCount = projects?.length || 0
  const entitlements = organization ? getOrgEntitlements(organization) : null

  // Collect every product ID already allocated across existing projects so the
  // create / edit dialogs can block double-allocation.
  const usedProductIds = (projects || []).flatMap((p) => (p.products || []).map((prod) => prod.id))

  // Client-safe shape: Infinity isn't JSON-serializable, so unlimited => null.
  const clientEntitlements = entitlements
    ? {
        hasSubscription: entitlements.hasSubscription,
        planName: entitlements.planName,
        planKey: entitlements.planKey,
        unlockedProducts: entitlements.unlockedProducts, // null = all unlocked
        projectLimit: entitlements.limits.projects === Infinity ? null : entitlements.limits.projects,
        usedProductIds, // products already allocated to a project in this org
      }
    : null

  return (
    <div className="geiger-flow-palette min-h-screen bg-background text-foreground">
      <Header megaMenue={false} />

      <main className="mx-auto flex min-h-[60vh] max-w-5xl flex-col bg-background px-4 pb-20 pt-24 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <span className="relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-surface-subtle text-foreground">
              {organization?.avatar_url ? (
                <Image src={organization.avatar_url} alt="" fill className="object-cover" />
              ) : (
                <Building2 className="size-6" />
              )}
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
          <div className="flex shrink-0 items-center gap-2 self-start sm:self-auto">
            <NewProjectButton organizationId={ORGID} entitlements={clientEntitlements} />
          </div>
        </header>

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
