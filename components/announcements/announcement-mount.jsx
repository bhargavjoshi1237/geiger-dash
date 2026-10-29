'use client'

// Mounts the shared announcement host for dash; resolved client-side so the root layout stays static.

import { useCallback } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { AnnouncementHost } from '@geiger/ui/announcements'
import { useSessionUser } from '@/lib/hooks/use-session-user'
import { loadAnnouncements, trackAnnouncement } from '@/lib/announcements/client'

const APP = 'dash'

// Studio and the admin console are where announcements get made, so they never pop up there.
const HIDDEN_PREFIXES = ['/studio', '/admin']

export function AnnouncementMount() {
  const userId = useSessionUser()?.id
  const pathname = usePathname() || '/'
  const router = useRouter()

  const load = useCallback(() => loadAnnouncements(APP), [])
  const track = useCallback((id, kind, details) => trackAnnouncement(APP, id, kind, details), [])

  if (HIDDEN_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))) return null

  return <AnnouncementHost userKey={userId} pathname={pathname} load={load} track={track} navigate={router.push} />
}
