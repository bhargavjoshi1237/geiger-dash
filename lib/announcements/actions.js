'use server'

// Studio mutations for announcements. Each re-checks the content-editor allowlist (RLS enforces it too)
// and returns a plain { ok, ... } result; the screen owns toasts and optimistic state.

import { createClient } from '@/utils/supabase/server'
import { getUser } from '@/supabase/user/getUser'
import { isContentEditor } from '@/lib/studio/access'
import { getAnnouncementStats } from './queries'
import { normalizeAnnouncement, toAnnouncementRow } from './shared'

const TABLE = 'announcements'

async function requireEditor() {
  const supabase = await createClient()
  const user = await getUser(supabase)
  if (!user) return { error: 'You must be signed in.' }
  if (!(await isContentEditor(supabase))) return { error: 'Only content editors can manage announcements.' }
  return { supabase, user }
}

// Creates when `input.id` is new (the client mints the UUID up front), updates otherwise.
export async function saveAnnouncementAction(input) {
  const { supabase, user, error } = await requireEditor()
  if (error) return { ok: false, error }

  const row = toAnnouncementRow(input)
  if (!row.name) return { ok: false, error: 'Give the announcement a name.' }
  if (!row.slides.length || !row.slides.some((slide) => slide.title)) return { ok: false, error: 'Add a title to the first slide.' }
  if (row.starts_at && row.ends_at && row.ends_at <= row.starts_at) return { ok: false, error: 'The end date must be after the start date.' }
  if (!row.design.dismissible && !row.slides.at(-1)?.primaryLabel) {
    return { ok: false, error: 'An announcement that can’t be closed needs a button on its last slide.' }
  }

  const id = String(input?.id || '').trim()
  const { data: existing } = id ? await supabase.from(TABLE).select('id').eq('id', id).maybeSingle() : { data: null }

  const query = existing
    ? supabase.from(TABLE).update(row).eq('id', id)
    : supabase.from(TABLE).insert({ ...row, ...(id ? { id } : {}), created_by: user.id })
  const { data, error: writeError } = await query.select('*').single()
  if (writeError) {
    console.error('[announcements.save]', writeError.message)
    return { ok: false, error: writeError.message }
  }
  return { ok: true, announcement: normalizeAnnouncement(data) }
}

// Copies everything except schedule and status; the copy starts as a draft.
export async function duplicateAnnouncementAction(id) {
  const { supabase, user, error } = await requireEditor()
  if (error) return { ok: false, error }

  const { data: source, error: readError } = await supabase.from(TABLE).select('*').eq('id', id).maybeSingle()
  if (readError || !source) return { ok: false, error: readError?.message || 'Announcement not found.' }

  const copy = toAnnouncementRow({ ...normalizeAnnouncement(source), name: `${source.name} copy`, status: 'draft', startsAt: null, endsAt: null })
  const { data, error: writeError } = await supabase.from(TABLE).insert({ ...copy, created_by: user.id }).select('*').single()
  if (writeError) {
    console.error('[announcements.duplicate]', writeError.message)
    return { ok: false, error: writeError.message }
  }
  return { ok: true, announcement: normalizeAnnouncement(data) }
}

export async function deleteAnnouncementAction(id) {
  const { supabase, error } = await requireEditor()
  if (error) return { ok: false, error }

  const { error: writeError } = await supabase.from(TABLE).update({ deleted_at: new Date().toISOString() }).eq('id', id)
  if (writeError) {
    console.error('[announcements.delete]', writeError.message)
    return { ok: false, error: writeError.message }
  }
  return { ok: true }
}

export async function getAnnouncementStatsAction(id) {
  const { supabase, error } = await requireEditor()
  if (error) return { ok: false, error }
  const stats = await getAnnouncementStats(supabase, id)
  return { ok: true, stats: stats[id] || null }
}

// People and organizations matching a name or email, for the audience picker.
export async function searchAnnouncementAudienceAction(query) {
  const { supabase, error } = await requireEditor()
  if (error) return { ok: false, error, results: [] }

  const { data, error: readError } = await supabase.rpc('announcement_audience_lookup', { p_query: String(query || '') })
  if (readError) {
    console.error('[announcements.audience]', readError.message)
    return { ok: false, error: readError.message, results: [] }
  }
  return { ok: true, results: data || [] }
}
