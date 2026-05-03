import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { ContentStudio } from '@/components/content-studio/content-studio'

export const dynamic = 'force-dynamic'

export default async function StudioPostsPage({ searchParams }) {
  const params = await searchParams
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const [{ data: categories }, { data: posts }, { data: changelogs }] = await Promise.all([
    supabase.from('dash_blog_categories').select('*').order('name'),
    supabase.from('dash_blog_posts').select('*').order('updated_at', { ascending: false }),
    supabase
      .from('dash_changelog')
      .select(
        `
          *,
          items:dash_changelog_items (
            id,
            type,
            description
          )
        `
      )
      .order('release_date', { ascending: false }),
  ])

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Content Studio</h1>
            <p className="mt-2 text-sm text-zinc-400">
              Create and edit blog posts and changelog entries with Supabase-backed image placement.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/blog"
              className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-900"
            >
              View Blog
            </Link>
            <Link
              href="/changelog"
              className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-900"
            >
              View Changelog
            </Link>
          </div>
        </div>

        <ContentStudio
          categories={categories || []}
          posts={posts || []}
          changelogs={changelogs || []}
          initialTab={params?.tab === 'changelog' ? 'changelog' : 'blog'}
          saved={params?.saved === '1'}
          error={params?.error ? decodeURIComponent(params.error) : ''}
          currentUserId={user.id}
        />
      </div>
    </div>
  )
}
