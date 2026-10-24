import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { requireUser } from '@/supabase/user/getUser'
import { PostsStudio } from '@/components/content-studio/posts-studio'
import { StudioNoAccess } from '@/components/content-studio/studio-shell'
import { searchParam } from '@/lib/studio/form'
import { isContentEditor } from '@/lib/studio/access'

export const dynamic = 'force-dynamic'

export default async function StudioPostsPage({ searchParams }) {
  const params = await searchParams
  // Releases used to be a tab on this screen.
  if (params?.tab === 'changelog') redirect('/studio/releases')

  const supabase = await createClient()
  await requireUser(supabase, '/login?next=/studio/posts')
  if (!(await isContentEditor(supabase))) return <StudioNoAccess />

  const [{ data: categories }, { data: posts }] = await Promise.all([
    supabase.from('dash_blog_categories').select('*').order('name'),
    supabase.from('dash_blog_posts').select('*').order('updated_at', { ascending: false }),
  ])

  return (
    <PostsStudio
      categories={categories || []}
      posts={posts || []}
      selectedId={searchParam(params, 'post')}
      saved={params?.saved === '1'}
      error={searchParam(params, 'error')}
    />
  )
}
