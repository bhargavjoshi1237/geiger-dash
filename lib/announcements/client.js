'use client'

// Browser reads/writes for the in-app announcement host. Both RPCs act as the signed-in user,
// so another suite app can copy this file as-is (only the app key changes).

import { createClient } from '@/utils/supabase/client'

function normalizeCandidate(row) {
  return {
    id: row.id,
    format: row.format,
    priority: row.priority ?? 0,
    slides: Array.isArray(row.slides) ? row.slides : [],
    design: row.design && typeof row.design === 'object' ? row.design : {},
    frequency: row.frequency && typeof row.frequency === 'object' ? row.frequency : {},
    routes: row.routes || [],
    excludeRoutes: row.exclude_routes || [],
  }
}

// Live announcements this user qualifies for in `app`, highest priority first; [] on any failure.
export async function loadAnnouncements(app) {
  const { data, error } = await createClient().rpc('announcements_for', { p_app: app })
  if (error) {
    console.error('[announcements.load]', error.message)
    return []
  }
  return (data || []).map(normalizeCandidate)
}

export async function trackAnnouncement(app, id, kind, { path = '', slide = null } = {}) {
  const { error } = await createClient().rpc('log_announcement_event', {
    p_id: id,
    p_kind: kind,
    p_app: app,
    p_path: path,
    p_slide: slide,
  })
  if (error) console.error('[announcements.track]', error.message)
}
