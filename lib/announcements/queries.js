// Studio reads against public.announcements and the announcement_stats() rollup; RLS limits both to content editors.

import { normalizeAnnouncement } from './shared'

const TABLE = 'announcements'

export async function listAnnouncements(supabase) {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .is('deleted_at', null)
    .order('updated_at', { ascending: false })
  if (error) {
    console.error('[announcements.list]', error.message)
    return []
  }
  return (data || []).map(normalizeAnnouncement)
}

export async function countAnnouncements(supabase) {
  const { count, error } = await supabase.from(TABLE).select('id', { count: 'exact', head: true }).is('deleted_at', null)
  if (error) {
    console.error('[announcements.count]', error.message)
    return undefined
  }
  return count ?? 0
}

const emptyTotals = () => ({ views: 0, viewers: 0, clicks: 0, clickers: 0, dismissals: 0 })

// { [announcementId]: { views, viewers, clicks, clickers, dismissals, byApp: { [app]: totals } } }
export function rollupStats(rows) {
  const byId = {}
  for (const row of rows || []) {
    const entry = (byId[row.announcement_id] ||= { ...emptyTotals(), byApp: {} })
    const app = (entry.byApp[row.app || 'unknown'] ||= emptyTotals())
    const events = Number(row.events) || 0
    const users = Number(row.users) || 0
    for (const target of [entry, app]) {
      if (row.kind === 'view') {
        target.views += events
        target.viewers += users
      } else if (row.kind === 'click') {
        target.clicks += events
        target.clickers += users
      } else if (row.kind === 'dismiss') {
        target.dismissals += events
      }
    }
  }
  return byId
}

export async function getAnnouncementStats(supabase, id = null) {
  const { data, error } = await supabase.rpc('announcement_stats', { p_id: id })
  if (error) {
    console.error('[announcements.stats]', error.message)
    return {}
  }
  return rollupStats(data)
}
