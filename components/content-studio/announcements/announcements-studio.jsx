'use client'

// Studio > Announcements: list of in-app announcements on the left, the editor for the open one on the right.

import { useCallback, useMemo, useRef, useState } from 'react'
import { toast } from 'sonner'
import { Plus } from 'lucide-react'
import { Badge, Button, SearchInput, SegmentedTabs } from '@geiger/ui'
import { ListEmpty, ListItem, ListPane, StudioFrame } from '@/components/content-studio/editor-kit'
import { useStudioRecord } from '@/components/content-studio/use-studio-record'
import { deleteAnnouncementAction, duplicateAnnouncementAction } from '@/lib/announcements/actions'
import {
  ANNOUNCEMENT_APPS,
  ANNOUNCEMENT_FILTERS,
  ANNOUNCEMENT_FORMAT_LABEL,
  ANNOUNCEMENT_STATUS_MAP,
} from '@/lib/announcements/constants'
import { displayStatus } from '@/lib/announcements/shared'
import { AnnouncementEditor } from './announcement-editor'

const APP_LABEL = Object.fromEntries(ANNOUNCEMENT_APPS.map((app) => [app.value, app.label]))

function appsLabel(apps) {
  if (!apps.length) return 'All apps'
  if (apps.length === 1) return APP_LABEL[apps[0]] || apps[0]
  return `${apps.length} apps`
}

export function AnnouncementsStudio({ initialAnnouncements, initialStats, selectedId }) {
  const [announcements, setAnnouncements] = useState(initialAnnouncements)
  const [stats, setStats] = useState(initialStats)
  const { openId, open, formKey } = useStudioRecord({
    basePath: '/studio/announcements',
    param: 'announcement',
    selectedId,
    saved: false,
    error: '',
    savedMessage: 'Announcement saved',
  })
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const [listOpen, setListOpen] = useState(false)
  const dirtyRef = useRef(false)

  const rows = useMemo(() => {
    const q = query.toLowerCase().trim()
    return announcements.filter((item) => {
      if (filter !== 'all' && displayStatus(item) !== filter) return false
      if (!q) return true
      const title = item.slides[0]?.title || ''
      return `${item.name} ${title} ${ANNOUNCEMENT_FORMAT_LABEL[item.format]}`.toLowerCase().includes(q)
    })
  }, [announcements, query, filter])

  const editing = announcements.find((item) => item.id === openId)

  const handleDirtyChange = useCallback((dirty) => {
    dirtyRef.current = dirty
  }, [])

  const select = (id) => {
    if (id !== openId && dirtyRef.current && !window.confirm('Discard your unsaved changes?')) return
    dirtyRef.current = false
    open(id)
    setListOpen(false)
  }

  const handleSaved = (saved, wasNew) => {
    setAnnouncements((current) => [saved, ...current.filter((item) => item.id !== saved.id)])
    if (wasNew) {
      dirtyRef.current = false
      open(saved.id)
    }
  }

  const handleDuplicate = async (source) => {
    if (dirtyRef.current && !window.confirm('Discard your unsaved changes?')) return
    const result = await duplicateAnnouncementAction(source.id)
    if (!result.ok) {
      toast.error('Couldn’t duplicate', { description: result.error })
      return
    }
    dirtyRef.current = false
    setAnnouncements((current) => [result.announcement, ...current])
    open(result.announcement.id)
    toast.success('Duplicated as a draft')
  }

  // Optimistic: drop the row first, put it back if the delete fails.
  const handleDelete = async (target) => {
    if (!window.confirm(`Delete “${target.name || 'Untitled announcement'}”? It stops showing straight away.`)) return
    const previous = announcements
    setAnnouncements((current) => current.filter((item) => item.id !== target.id))
    if (openId === target.id) {
      dirtyRef.current = false
      open('')
    }
    const result = await deleteAnnouncementAction(target.id)
    if (!result.ok) {
      setAnnouncements(previous)
      toast.error('Couldn’t delete', { description: result.error })
      return
    }
    toast.success('Announcement deleted')
  }

  const handleStats = useCallback(
    (next) => {
      if (openId) setStats((current) => ({ ...current, [openId]: next || undefined }))
    },
    [openId],
  )

  return (
    <StudioFrame>
      <ListPane
        title="Announcements"
        count={announcements.length}
        open={listOpen}
        onClose={() => setListOpen(false)}
        actions={
          <Button type="button" size="sm" onClick={() => select('')}>
            <Plus className="size-4" />
            New
          </Button>
        }
        search={<SearchInput expanded value={query} onChange={setQuery} placeholder="Search announcements…" />}
        filters={<SegmentedTabs fullWidth tabs={ANNOUNCEMENT_FILTERS} value={filter} onChange={setFilter} buttonClassName="text-xs" />}
      >
        {rows.map((item) => {
          const status = ANNOUNCEMENT_STATUS_MAP[displayStatus(item)]
          const reached = stats[item.id]?.viewers || 0
          return (
            <ListItem key={item.id} selected={item.id === openId} onClick={() => select(item.id)}>
              <span className="flex min-w-0 items-center gap-2">
                <span className="min-w-0 flex-1 truncate text-[13px] font-medium text-foreground">{item.name || 'Untitled announcement'}</span>
                <Badge variant={status.variant} className="shrink-0">
                  {status.label}
                </Badge>
              </span>
              <span className="truncate text-xs text-muted-foreground">
                {ANNOUNCEMENT_FORMAT_LABEL[item.format]} · {appsLabel(item.apps)}
                {reached ? ` · ${reached.toLocaleString()} reached` : ''}
              </span>
            </ListItem>
          )
        })}
        {rows.length === 0 ? (
          <ListEmpty>{query || filter !== 'all' ? 'No announcements match.' : 'No announcements yet. Create one to show it in the apps.'}</ListEmpty>
        ) : null}
      </ListPane>

      <AnnouncementEditor
        key={formKey}
        announcement={editing}
        stats={editing ? stats[editing.id] : null}
        onSaved={handleSaved}
        onStats={handleStats}
        onDelete={handleDelete}
        onDuplicate={handleDuplicate}
        onDirtyChange={handleDirtyChange}
        onOpenList={() => setListOpen(true)}
      />
    </StudioFrame>
  )
}
