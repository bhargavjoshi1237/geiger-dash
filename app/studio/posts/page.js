import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { ContentStudio } from '@/components/content-studio/content-studio'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

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
    <div className="min-h-screen bg-background px-4 py-6 text-foreground sm:px-6 lg:py-10">
      <div className="mx-auto max-w-7xl">
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
