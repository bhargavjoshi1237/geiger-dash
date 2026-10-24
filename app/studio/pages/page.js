import { createClient } from '@/utils/supabase/server'
import { requireUser } from '@/supabase/user/getUser'
import { PagesStudio } from '@/components/pages-studio/pages-studio'
import { StudioNoAccess } from '@/components/content-studio/studio-shell'
import { searchParam } from '@/lib/studio/form'
import { isContentEditor } from '@/lib/studio/access'

export const dynamic = 'force-dynamic'

export default async function StudioPagesPage({ searchParams }) {
  const params = await searchParams
  const supabase = await createClient()
  await requireUser(supabase, '/login?next=/studio/pages')
  if (!(await isContentEditor(supabase))) return <StudioNoAccess />

  const { data: pages } = await supabase
    .from('dash_seo_pages')
    .select('*')
    .order('updated_at', { ascending: false })

  return (
    <PagesStudio
      pages={pages || []}
      selectedId={searchParam(params, 'page')}
      saved={params?.saved === '1'}
      error={searchParam(params, 'error')}
    />
  )
}
