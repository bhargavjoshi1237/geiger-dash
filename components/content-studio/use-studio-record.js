'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

const ERROR_TEXT = { missing_required: 'Fill in the required fields first.' }

// Open record for a Studio editor, kept in ?<param>=<id> ('' = new draft). Save redirects land back on
// the record with saved=1 or error=…; that toasts, remounts the form with the server copy and tidies the URL.
export function useStudioRecord({ basePath, param, selectedId, saved, error, savedMessage }) {
  const router = useRouter()
  const fromProp = selectedId === 'new' ? '' : selectedId || ''
  const [openId, setOpenId] = useState(fromProp)
  const [revision, setRevision] = useState(0)
  const [synced, setSynced] = useState({ selectedId, saved })

  if (synced.selectedId !== selectedId || synced.saved !== saved) {
    const moved = synced.selectedId !== selectedId
    setSynced({ selectedId, saved })
    if (moved) setOpenId(fromProp)
    if (moved || saved) setRevision((value) => value + 1)
  }

  useEffect(() => {
    if (!saved && !error) return
    if (error) toast.error('Could not save', { id: 'studio-save', description: ERROR_TEXT[error] || error })
    else toast.success(savedMessage, { id: 'studio-save', description: 'Public pages were revalidated.' })
    const id = new URLSearchParams(window.location.search).get(param)
    router.replace(id ? `${basePath}?${param}=${id}` : basePath, { scroll: false })
  }, [saved, error, basePath, param, router, savedMessage])

  // Switching records is local state plus a shallow URL update, so it needs no server round trip.
  const open = (id) => {
    setOpenId(id)
    setRevision((value) => value + 1)
    window.history.replaceState(null, '', `${basePath}?${param}=${id || 'new'}`)
  }

  return { openId, open, formKey: `${openId || 'new'}-${revision}` }
}
