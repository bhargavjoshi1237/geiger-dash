import { createClient } from '@/utils/supabase/server'
import { requireUser } from '@/supabase/user/getUser'
import { HelpStudio } from '@/components/help-studio/help-studio'
import { StudioNoAccess } from '@/components/content-studio/studio-shell'
import { isContentEditor } from '@/lib/studio/access'
import { getDocsPageForStudio, listDocsGroups, listDocsPagesForStudio } from '@/lib/docs/queries'

export const dynamic = 'force-dynamic'

export default async function StudioHelpPage({ searchParams }) {
  const params = await searchParams
  const supabase = await createClient()
  await requireUser(supabase, '/login?next=/studio/help')

  if (!(await isContentEditor(supabase))) return <StudioNoAccess active="help" />

  // The open page lives in the URL (?page=<id>, or ?page=new) so a refresh stays on it.
  const selected = typeof params?.page === 'string' ? params.page : ''
  const isNew = selected === 'new'
  const [groups, pages, page] = await Promise.all([
    listDocsGroups(),
    listDocsPagesForStudio(),
    selected && !isNew ? getDocsPageForStudio(selected) : null,
  ])

  return <HelpStudio groups={groups} pages={pages} page={page} isNew={isNew} />
}
