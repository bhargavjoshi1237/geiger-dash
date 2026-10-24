'use client'

import { useCallback } from 'react'
import { useSearchParams } from 'next/navigation'

// Tab state kept in ?section= so the Console sidebar's sub-links and a refresh land on the same tab.
export function useSectionParam(ids, fallback) {
  const current = useSearchParams().get('section')
  const section = ids.includes(current) ? current : fallback

  const setSection = useCallback((next) => {
    const params = new URLSearchParams(window.location.search)
    params.set('section', next)
    window.history.replaceState(null, '', `?${params.toString()}`)
  }, [])

  return [section, setSection]
}
