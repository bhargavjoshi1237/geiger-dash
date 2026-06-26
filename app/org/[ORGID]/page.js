import { Header } from '@/components/header'
import { Badge } from '@/components/ui/badge'
import { getOrganizationProjects } from '@/lib/org/projects'
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

  return (
    <div className="geiger-flow-palette min-h-screen bg-background text-foreground">
      <Header megaMenue={false} />

      <main className="mx-auto flex min-h-[60vh] max-w-5xl flex-col bg-background px-4 py-24 sm:px-6 lg:px-8">
        <header className="border-b border-border pb-6">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-semibold tracking-tight">
              {organization?.name || 'Organization'}
            </h1>
            {organization ? (
              <Badge variant={organization.is_active ? 'success' : 'secondary'}>
                {organization.is_active ? 'Active' : 'Inactive'}
              </Badge>
            ) : null}
            <span className="ml-auto rounded bg-black/20 px-2 py-1 font-mono text-[11px] text-tertiary">
              {ORGID}
            </span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            {projectCount} {projectCount === 1 ? 'project' : 'projects'} · create or open a project to launch its products.
          </p>
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
            />
          </section>
        ) : null}
      </main>
    </div>
  )
}
