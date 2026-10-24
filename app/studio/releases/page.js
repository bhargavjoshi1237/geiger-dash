import { createClient } from '@/utils/supabase/server'
import { requireUser } from '@/supabase/user/getUser'
import { ReleasesStudio } from '@/components/content-studio/releases-studio'
import { StudioNoAccess } from '@/components/content-studio/studio-shell'
import { searchParam } from '@/lib/studio/form'
import { isContentEditor } from '@/lib/studio/access'

export const dynamic = 'force-dynamic'

export default async function StudioReleasesPage({ searchParams }) {
  const params = await searchParams
  const supabase = await createClient()
  await requireUser(supabase, '/login?next=/studio/releases')
  if (!(await isContentEditor(supabase))) return <StudioNoAccess />

  const { data: changelogs } = await supabase
    .from('dash_changelog')
    .select('*, items:dash_changelog_items (id, type, description)')
    .order('release_date', { ascending: false })

  return (
    <ReleasesStudio
      changelogs={changelogs || []}
      selectedId={searchParam(params, 'release')}
      saved={params?.saved === '1'}
      error={searchParam(params, 'error')}
    />
  )
}
