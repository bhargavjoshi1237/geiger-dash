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
    projectError: typeof query?.project_error === 'string' ? query.project_error : null,
  }

  return (
    <div className="geiger-flow-palette min-h-screen bg-background text-foreground">
      <Header megaMenue={false} />

      <main className="mx-auto flex min-h-[60vh] max-w-5xl flex-col bg-background px-4 py-24 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="w-full">
            <div className="flex w-full  items-center gap-2">
              <h1 className="text-3xl font-semibold tracking-tight">
                {organization?.name || 'Organization'}
              </h1>
              {organization ? (
                <Badge variant={organization.is_active ? 'success' : 'secondary'}>
                  {organization.is_active ? 'Active' : 'Inactive'}
                </Badge>
              ) : null}
               <p className="ml-auto text-xs text-muted-foreground">{ORGID}</p>
            </div>
            
           
          </div>
        </div>

        {error ? (
          <div className="mt-8 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            {error}
          </div>
        ) : null}

        {organization ? (
          <section className="mt-12">
            <div className="mb-8">
              <p className="mt-1 text-sm text-muted-foreground">
                Create or open a project to view purchased products and launch its apps.
              </p>
            </div>
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
