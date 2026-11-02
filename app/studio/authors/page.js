import { createClient } from '@/utils/supabase/server'
import { requireUser } from '@/supabase/user/getUser'
import { AuthorsScreen } from '@/components/content-studio/authors-screen'
import { StudioNoAccess } from '@/components/content-studio/studio-shell'
import { isContentEditor } from '@/lib/studio/access'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Authors',
}

export default async function StudioAuthorsPage() {
  const supabase = await createClient()
  await requireUser(supabase, '/login?next=/studio/authors')
  if (!(await isContentEditor(supabase))) return <StudioNoAccess />

  const { data: authors } = await supabase.from('dash_blog_authors').select('*').is('deleted_at', null).order('name')

  return <AuthorsScreen authors={authors || []} />
}
