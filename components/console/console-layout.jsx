import { createClient } from '@/utils/supabase/server'
import { getUser } from '@/supabase/user/getUser'
import { getActiveNotice } from '@/lib/notices/queries'
import { isContentEditor } from '@/lib/studio/access'
import { ConsoleShell } from '@/components/console/console-shell'

async function countRows(query) {
  const { count, error } = await query
  if (error) {
    console.error('[console.count]', error.message)
    return undefined
  }
  return count ?? 0
}

// Sidebar counts are for content editors only; everyone else just sees the nav.
async function studioCounts(supabase) {
  const head = { count: 'exact', head: true }
  const [posts, releases, pages, help] = await Promise.all([
    countRows(supabase.from('dash_blog_posts').select('id', head)),
    countRows(supabase.from('dash_changelog').select('id', head)),
    countRows(supabase.from('dash_seo_pages').select('id', head)),
    countRows(supabase.from('docs_pages').select('id', head).is('deleted_at', null)),
  ])
  return { posts, releases, pages, help }
}

function toAccount(user, isEditor) {
  if (!user) return null
  const meta = user.user_metadata || {}
  return {
    name: meta.full_name || meta.name || user.email?.split('@')[0] || 'Account',
    email: user.email || '',
    avatarUrl: meta.avatar_url || meta.picture || '',
    role: isEditor ? 'Content editor' : 'Member',
  }
}

// Server half of the Console frame: who's signed in, sidebar counts and whether a notice is live.
export async function ConsoleLayout({ children }) {
  const supabase = await createClient()
  const user = await getUser(supabase)
  const isEditor = user ? await isContentEditor(supabase) : false
  const [counts, notice] = await Promise.all([isEditor ? studioCounts(supabase) : {}, getActiveNotice()])

  return (
    <ConsoleShell counts={counts} noticeLive={Boolean(notice)} account={toAccount(user, isEditor)}>
      {children}
    </ConsoleShell>
  )
}
