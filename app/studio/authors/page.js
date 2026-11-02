import { createClient } from '@/utils/supabase/server'
import { requireUser } from '@/supabase/user/getUser'
import { AuthorsStudio } from '@/components/content-studio/authors-studio'
import { StudioNoAccess } from '@/components/content-studio/studio-shell'
import { searchParam } from '@/lib/studio/form'
import { isContentEditor } from '@/lib/studio/access'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Authors',
}

export default async function StudioAuthorsPage({ searchParams }) {
  const params = await searchParams
  const supabase = await createClient()
  await requireUser(supabase, '/login?next=/studio/authors')
  if (!(await isContentEditor(supabase))) return <StudioNoAccess />

  const [{ data: authors }, { data: posts }] = await Promise.all([
    supabase.from('dash_blog_authors').select('*').is('deleted_at', null).order('name'),
    supabase
      .from('dash_blog_posts')
      .select('id,title,is_published,published_at,author_profile_id')
      .not('author_profile_id', 'is', null)
      .order('published_at', { ascending: false, nullsFirst: true }),
  ])

  return <AuthorsStudio authors={authors || []} posts={posts || []} selectedId={searchParam(params, 'author')} />
}
