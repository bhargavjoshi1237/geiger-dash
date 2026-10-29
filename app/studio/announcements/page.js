import { createClient } from '@/utils/supabase/server'
import { requireUser } from '@/supabase/user/getUser'
import { AnnouncementsStudio } from '@/components/content-studio/announcements/announcements-studio'
import { StudioNoAccess } from '@/components/content-studio/studio-shell'
import { searchParam } from '@/lib/studio/form'
import { isContentEditor } from '@/lib/studio/access'
import { getAnnouncementStats, listAnnouncements } from '@/lib/announcements/queries'

export const dynamic = 'force-dynamic'

export default async function StudioAnnouncementsPage({ searchParams }) {
  const params = await searchParams
  const supabase = await createClient()
  await requireUser(supabase, '/login?next=/studio/announcements')
  if (!(await isContentEditor(supabase))) return <StudioNoAccess />

  const [announcements, stats] = await Promise.all([listAnnouncements(supabase), getAnnouncementStats(supabase)])

  return <AnnouncementsStudio initialAnnouncements={announcements} initialStats={stats} selectedId={searchParam(params, 'announcement')} />
}
