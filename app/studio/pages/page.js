import { createClient } from '@/utils/supabase/server'
import { requireUser } from '@/supabase/user/getUser'
import { PagesStudio } from '@/components/pages-studio/pages-studio'
import { StudioNoAccess } from '@/components/content-studio/studio-shell'
import { isContentEditor } from '@/lib/studio/access'

export const dynamic = 'force-dynamic'

export default async function StudioPagesPage({ searchParams }) {
  const params = await searchParams
  const supabase = await createClient()
  await requireUser(supabase, '/login?next=/studio/pages')
  if (!(await isContentEditor(supabase))) return <StudioNoAccess active="pages" />

  const { data: pages } = await supabase
    .from('dash_seo_pages')
    .select('*')
    .order('updated_at', { ascending: false })

  return (
    <PagesStudio
      pages={pages || []}
      saved={params?.saved === '1'}
      error={params?.error ? decodeURIComponent(params.error) : ''}
    />
  )
}
