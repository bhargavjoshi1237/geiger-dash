'use client'

// Announcement editor: name, format, live preview and slide content in the canvas; setup, design,
// audience, stats and media in the inspector. Saves through a server action and reports back up.

import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import {
  AppWindow,
  ChevronLeft,
  ChevronRight,
  GalleryHorizontal,
  Loader2,
  Maximize2,
  PictureInPicture2,
  Play,
  Plus,
  Trash2,
} from 'lucide-react'
import { Badge, Button, DropdownMenuItem, DropdownMenuSeparator, cn } from '@geiger/ui'
import { AnnouncementPreview, AnnouncementView } from '@geiger/ui/announcements'
import {
  DangerMenuItem,
  DocumentCanvas,
  DocumentEyebrow,
  DocumentTitle,
  EditorTopBar,
  InspectorPane,
  InspectorPanel,
  MoreMenu,
  SaveState,
  TopBarDivider,
  useUnsavedGuard,
} from '@/components/content-studio/editor-kit'
import { MediaLibrary } from '@/components/content-studio/shared'
import { saveAnnouncementAction } from '@/lib/announcements/actions'
import {
  ANNOUNCEMENT_DESIGN_DEFAULTS,
  ANNOUNCEMENT_FORMATS,
  ANNOUNCEMENT_STATUS_MAP,
  MAX_SLIDES,
} from '@/lib/announcements/constants'
import { displayStatus, emptySlide } from '@/lib/announcements/shared'
import { AudiencePanel } from './audience-panel'
import { DesignPanel, SetupPanel, StatsPanel } from './inspector-panels'
import { SlideFields } from './slide-fields'

const INSPECTOR_TABS = [
  { label: 'Setup', value: 'setup' },
  { label: 'Design', value: 'design' },
  { label: 'Audience', value: 'audience' },
  { label: 'Stats', value: 'stats' },
  { label: 'Media', value: 'media' },
]

const MEDIA_TYPES = [{ value: 'announcements', label: 'Announcements' }]

const FORMAT_ICON = { modal: AppWindow, corner: PictureInPicture2, takeover: Maximize2, carousel: GalleryHorizontal }

function toDraft(record) {
  if (record) return { ...record, slides: record.slides.length ? record.slides.map((slide) => ({ ...emptySlide(), ...slide })) : [emptySlide()] }
  return {
    id: crypto.randomUUID(),
    name: '',
    format: 'modal',
    status: 'draft',
    priority: 0,
    slides: [emptySlide()],
    design: { ...ANNOUNCEMENT_DESIGN_DEFAULTS },
    audience: {
      plans: [],
      planStates: [],
      products: [],
      roles: [],
      orgIds: [],
      userIds: [],
      excludeUserIds: [],
      account: { mode: 'any', days: 14 },
      labels: {},
    },
    frequency: { mode: 'once', times: 3, days: 7, stopOnClick: true },
    apps: ['dash'],
    routes: [],
    excludeRoutes: [],
    startsAt: null,
    endsAt: null,
  }
}

function FormatPicker({ value, onChange }) {
  return (
    <div className="mt-6 grid grid-cols-2 gap-2 md:grid-cols-4" role="radiogroup" aria-label="Format">
      {ANNOUNCEMENT_FORMATS.map((format) => {
        const Icon = FORMAT_ICON[format.value]
        const active = value === format.value
        return (
          <button
            key={format.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(format.value)}
            className={cn(
              'flex flex-col gap-1.5 rounded-lg border p-3 text-left transition-colors',
              active ? 'border-border-strong bg-surface-active' : 'border-border bg-surface-subtle hover:bg-surface-hover',
            )}
          >
            <Icon className={cn('size-4', active ? 'text-foreground' : 'text-muted-foreground')} />
            <span className="text-[13px] font-medium text-foreground">{format.label}</span>
            <span className="text-[11px] leading-snug text-muted-foreground">{format.description}</span>
          </button>
        )
      })}
    </div>
  )
}

function SlideTabs({ slides, index, onSelect, onAdd, onMove, onRemove }) {
  return (
    <div className="mt-7 flex flex-wrap items-center gap-1.5 border-b border-border pb-3">
      <span className="mr-1.5 text-[15px] font-semibold text-foreground">Slides</span>
      {slides.map((slide, i) => (
        <button
          key={slide.id}
          type="button"
          onClick={() => onSelect(i)}
          aria-current={i === index ? 'true' : undefined}
          className={cn(
            'h-7 max-w-[160px] truncate rounded-md border px-2.5 text-xs font-medium transition-colors',
            i === index ? 'border-border-strong bg-surface-active text-foreground' : 'border-border text-muted-foreground hover:bg-surface-hover',
          )}
        >
          {i + 1}. {slide.title || 'Untitled'}
        </button>
      ))}
      <Button type="button" variant="ghost" size="xs" onClick={onAdd} disabled={slides.length >= MAX_SLIDES} className="text-muted-foreground">
        <Plus />
        Add slide
      </Button>
      <span className="ml-auto flex items-center gap-0.5">
        <Button type="button" variant="ghost" size="icon-xs" onClick={() => onMove(-1)} disabled={index === 0} aria-label="Move slide earlier" className="text-muted-foreground">
          <ChevronLeft />
        </Button>
        <Button type="button" variant="ghost" size="icon-xs" onClick={() => onMove(1)} disabled={index === slides.length - 1} aria-label="Move slide later" className="text-muted-foreground">
          <ChevronRight />
        </Button>
        <Button type="button" variant="ghost" size="icon-xs" onClick={onRemove} disabled={slides.length < 2} aria-label="Remove slide" className="text-muted-foreground">
          <Trash2 />
        </Button>
      </span>
    </div>
  )
}

export function AnnouncementEditor({ announcement, stats, onSaved, onStats, onDelete, onDuplicate, onDirtyChange, onOpenList }) {
  const [draft, setDraft] = useState(() => toDraft(announcement))
  const [dirty, setDirty] = useState(false)
  const [saving, setSaving] = useState('')
  const [tab, setTab] = useState('setup')
  const [inspectorOpen, setInspectorOpen] = useState(false)
  const [slideIndex, setSlideIndex] = useState(0)
  const [trying, setTrying] = useState(false)
  const slideRef = useRef(0)

  const isNew = !announcement
  const isCarousel = draft.format === 'carousel'
  const activeIndex = isCarousel ? Math.min(slideIndex, draft.slides.length - 1) : 0
  const status = displayStatus(draft)
  const statusMeta = ANNOUNCEMENT_STATUS_MAP[status] || ANNOUNCEMENT_STATUS_MAP.draft

  const set = (key) => (value) => {
    setDraft((current) => ({ ...current, [key]: value }))
    setDirty(true)
  }
  const updateSlides = useCallback((update) => {
    setDraft((current) => ({ ...current, slides: update(current.slides) }))
    setDirty(true)
  }, [])

  useEffect(() => {
    slideRef.current = activeIndex
  }, [activeIndex])
  useEffect(() => {
    onDirtyChange(dirty)
  }, [dirty, onDirtyChange])
  useUnsavedGuard(dirty)

  // The Media tab's "Use as cover" sets the image on the slide being edited.
  useEffect(() => {
    const useImage = (event) => {
      const url = event.detail?.publicUrl
      if (!url) return
      updateSlides((slides) => slides.map((slide, i) => (i === slideRef.current ? { ...slide, imageUrl: url } : slide)))
      toast.success('Image added to the slide')
    }
    window.addEventListener('content-studio:use-cover', useImage)
    return () => window.removeEventListener('content-studio:use-cover', useImage)
  }, [updateSlides])

  const save = async (nextStatus) => {
    if (saving) return
    setSaving(nextStatus === 'live' && draft.status !== 'live' ? 'publish' : 'save')
    const result = await saveAnnouncementAction(nextStatus ? { ...draft, status: nextStatus } : draft)
    setSaving('')
    if (!result.ok) {
      toast.error('Could not save', { description: result.error })
      return
    }
    setDraft((current) => ({ ...current, status: result.announcement.status }))
    setDirty(false)
    toast.success(nextStatus === 'live' && draft.status !== 'live' ? 'Announcement is live' : 'Announcement saved')
    onSaved(result.announcement, isNew)
  }

  const handleKeys = (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 's') {
      event.preventDefault()
      save()
    }
  }

  const addSlide = () => {
    updateSlides((slides) => [...slides, emptySlide()])
    setSlideIndex(draft.slides.length)
  }
  const moveSlide = (direction) => {
    const target = activeIndex + direction
    updateSlides((slides) => {
      const next = [...slides]
      ;[next[activeIndex], next[target]] = [next[target], next[activeIndex]]
      return next
    })
    setSlideIndex(target)
  }
  const removeSlide = () => {
    updateSlides((slides) => slides.filter((_, i) => i !== activeIndex))
    setSlideIndex(Math.max(0, activeIndex - 1))
  }

  const live = draft.status === 'live'

  return (
    <div className="flex min-h-0 min-w-0 flex-1" onKeyDown={handleKeys}>
      {trying ? (
        <AnnouncementView
          announcement={draft}
          open={trying}
          onPrimary={() => setTrying(false)}
          onSecondary={(slide) => slide.secondaryUrl && window.open(slide.secondaryUrl, '_blank', 'noopener,noreferrer')}
          onDismiss={() => setTrying(false)}
        />
      ) : null}

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <EditorTopBar
          crumbs={['Announcements']}
          current={draft.name || 'New announcement'}
          meta={
            <>
              {!isNew ? <Badge variant={statusMeta.variant}>{statusMeta.label}</Badge> : null}
              <SaveState dirty={dirty} isNew={isNew} savedAt={announcement?.updatedAt} />
            </>
          }
          onOpenList={onOpenList}
          onOpenInspector={() => setInspectorOpen(true)}
          actions={
            <>
              <Button type="button" variant="ghost" size="sm" onClick={() => setTrying(true)} className="hidden text-muted-foreground sm:inline-flex">
                <Play className="size-3.5" />
                Try it
              </Button>
              <MoreMenu>
                <DropdownMenuItem disabled={isNew} onSelect={() => onDuplicate(announcement)} className="cursor-pointer">
                  Duplicate
                </DropdownMenuItem>
                {live ? (
                  <DropdownMenuItem onSelect={() => save('paused')} className="cursor-pointer">
                    Pause
                  </DropdownMenuItem>
                ) : draft.status === 'paused' ? (
                  <DropdownMenuItem onSelect={() => save('live')} className="cursor-pointer">
                    Resume
                  </DropdownMenuItem>
                ) : null}
                {!isNew && draft.status !== 'ended' ? (
                  <DropdownMenuItem onSelect={() => save('ended')} className="cursor-pointer">
                    End now
                  </DropdownMenuItem>
                ) : null}
                {!isNew ? (
                  <>
                    <DropdownMenuSeparator />
                    <DangerMenuItem onSelect={() => onDelete(announcement)}>Delete announcement</DangerMenuItem>
                  </>
                ) : null}
              </MoreMenu>
              <TopBarDivider />
              {live ? (
                <Button type="button" size="sm" onClick={() => save()} disabled={Boolean(saving)}>
                  {saving ? <Loader2 className="size-3.5 animate-spin" /> : null}
                  Update
                </Button>
              ) : (
                <>
                  <Button type="button" variant="outline" size="sm" onClick={() => save()} disabled={Boolean(saving)}>
                    {saving === 'save' ? <Loader2 className="size-3.5 animate-spin" /> : null}
                    {isNew ? 'Save draft' : 'Save'}
                  </Button>
                  <Button type="button" size="sm" onClick={() => save('live')} disabled={Boolean(saving)}>
                    {saving === 'publish' ? <Loader2 className="size-3.5 animate-spin" /> : null}
                    Publish
                  </Button>
                </>
              )}
            </>
          }
        />

        <DocumentCanvas>
          <DocumentEyebrow>Announcement</DocumentEyebrow>
          <DocumentTitle value={draft.name} onChange={set('name')} placeholder="Untitled announcement" aria-label="Name" />
          <p className="mt-1 text-xs text-muted-foreground">Internal name. Only editors see it.</p>

          <FormatPicker value={draft.format} onChange={set('format')} />

          <div className="mt-7 flex items-baseline gap-2.5 border-b border-border pb-3">
            <span className="text-[15px] font-semibold text-foreground">Preview</span>
            <span className="text-xs text-muted-foreground">Follows the app’s light or dark theme</span>
          </div>
          <AnnouncementPreview announcement={draft} index={activeIndex} onIndexChange={setSlideIndex} className="mt-4" />

          {isCarousel ? (
            <SlideTabs
              slides={draft.slides}
              index={activeIndex}
              onSelect={setSlideIndex}
              onAdd={addSlide}
              onMove={moveSlide}
              onRemove={removeSlide}
            />
          ) : null}

          <SlideFields
            key={draft.slides[activeIndex]?.id}
            slide={draft.slides[activeIndex]}
            onChange={(slide) => updateSlides((slides) => slides.map((item, i) => (i === activeIndex ? slide : item)))}
            onBrowseMedia={() => {
              setTab('media')
              setInspectorOpen(true)
            }}
            isCarousel={isCarousel}
            isLast={activeIndex === draft.slides.length - 1}
          />
        </DocumentCanvas>
      </div>

      <InspectorPane tabs={INSPECTOR_TABS} value={tab} onChange={setTab} open={inspectorOpen} onClose={() => setInspectorOpen(false)}>
        <InspectorPanel active={tab === 'setup'}>
          <SetupPanel draft={draft} set={set} />
        </InspectorPanel>
        <InspectorPanel active={tab === 'design'}>
          <DesignPanel draft={draft} set={set} />
        </InspectorPanel>
        <InspectorPanel active={tab === 'audience'}>
          <AudiencePanel audience={draft.audience} onChange={set('audience')} />
        </InspectorPanel>
        <InspectorPanel active={tab === 'stats'}>
          {tab === 'stats' ? <StatsPanel announcementId={announcement?.id} stats={stats} onStats={onStats} /> : null}
        </InspectorPanel>
        <InspectorPanel active={tab === 'media'} className="min-h-full">
          {tab === 'media' ? <MediaLibrary activeTab="announcements" types={MEDIA_TYPES} /> : null}
        </InspectorPanel>
      </InspectorPane>
    </div>
  )
}
