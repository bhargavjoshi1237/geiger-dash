'use client'

import { useCallback, useEffect, useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { ArrowDown, ArrowUp, ExternalLink, GripVertical, LayoutGrid, Link2, Loader2, MonitorPlay, Plus, Trash2 } from 'lucide-react'
import {
  Button,
  DropdownMenuItem,
  DropdownMenuSeparator,
  Field,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  StatusPill,
  cn,
} from '@geiger/ui'
import {
  DangerMenuItem,
  DocumentCanvas,
  DocumentEyebrow,
  DocumentTitle,
  EditorTopBar,
  InspectorPane,
  InspectorPanel,
  InspectorSection,
  MoreMenu,
  Req,
  SaveState,
  TopBarDivider,
  ViewLiveLink,
  useUnsavedGuard,
} from '@/components/content-studio/editor-kit'
import { STUDIO_STATUS_MAP } from '@/components/content-studio/constants'
import { TiptapBlogEditor } from '@/components/content-studio/tiptap-blog-editor'
import { ItemsEditor, ITEM_KINDS } from '@/components/help-studio/items-editor'
import { HELP_STATUS, NO_PARENT, NO_SHOWCASE, PAGE_STATUS_OPTIONS } from '@/components/help-studio/constants'
import { deleteHelpPageAction, saveHelpPageAction } from '@/app/studio/help/actions'
import { HELP_HOME_SLUG, helpHref } from '@/lib/docs/paths'
import { normalizeHelpSlug, slugify } from '@/lib/docs/text'
import { HELP_SHOWCASES } from '@/lib/docs/showcases'

const INSPECTOR_TABS = [
  { label: 'Page', value: 'page' },
  { label: 'Section', value: 'section' },
]
const SECTION_DRAG_TYPE = 'application/x-help-section'

function newSection(title = '') {
  return {
    id: crypto.randomUUID(),
    anchorId: '',
    eyebrow: '',
    title,
    content: '',
    cards: [],
    features: [],
    links: [],
    showcase: '',
  }
}

function toDraft(page, groups) {
  if (!page) {
    return {
      id: crypto.randomUUID(),
      title: '',
      navLabel: '',
      slug: '',
      slugTouched: false,
      navGroupId: groups[0]?.id || '',
      parentId: '',
      description: '',
      status: 'draft',
      sortOrder: '0',
      sections: [newSection('Overview')],
    }
  }
  return {
    id: page.id,
    title: page.title,
    navLabel: page.nav_label || '',
    slug: page.slug,
    slugTouched: true,
    navGroupId: page.nav_group_id,
    parentId: page.parent_id || '',
    description: page.description || '',
    status: page.status,
    sortOrder: String(page.sort_order ?? 0),
    sections: page.sections,
  }
}

// New pages get "<group or parent slug>/<title>" until the slug is edited by hand.
function autoSlug(draft, groups, pages) {
  const parent = pages.find((page) => page.id === draft.parentId)
  const prefix = parent ? parent.slug : groups.find((group) => group.id === draft.navGroupId)?.slug || ''
  return normalizeHelpSlug(`${prefix}/${slugify(draft.title)}`)
}

const plainText = (html) =>
  String(html || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const pluralize = (count, word) => `${count} ${count === 1 ? word.replace(/s$/, '') : word}`

function MetaChip({ onClick, mono, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground',
        mono && 'font-mono',
      )}
    >
      {children}
    </button>
  )
}

// Rich text for the selected section; content is captured at mount so typing never re-seeds the editor.
function SectionContent({ section, onContent, onEdit }) {
  const [initialContent] = useState(section.content)
  const handleChange = useCallback((html) => onContent(section.id, html), [onContent, section.id])
  return <TiptapBlogEditor name={`section-${section.id}`} defaultValue={initialContent} onChange={handleChange} onEdit={onEdit} size="sm" />
}

// One section in the page outline; the selected one opens its editor in place.
function SectionCard({ section, index, total, selected, onSelect, onMove, onDrop, onRemove, onContent, onEdit }) {
  const [dragOver, setDragOver] = useState(false)
  const body = plainText(section.content)
  const showcase = HELP_SHOWCASES.find((entry) => entry.id === section.showcase)
  const extras = Object.keys(ITEM_KINDS)
    .filter((kind) => section[kind].length)
    .map((kind) => pluralize(section[kind].length, kind))
  const accepts = (event) => event.dataTransfer.types.includes(SECTION_DRAG_TYPE)

  return (
    <div
      onDragOver={(event) => {
        if (!accepts(event)) return
        event.preventDefault()
        setDragOver(true)
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(event) => {
        if (!accepts(event)) return
        event.preventDefault()
        setDragOver(false)
        onDrop(Number(event.dataTransfer.getData(SECTION_DRAG_TYPE)), index)
      }}
      className={cn(
        'flex gap-2.5 rounded-[10px] border py-3 pl-2.5 pr-3 transition-colors',
        selected ? 'border-border-strong bg-surface-subtle' : 'border-border hover:border-border-strong',
        dragOver && 'border-dashed border-muted-foreground',
      )}
    >
      <span
        draggable
        onDragStart={(event) => {
          event.dataTransfer.setData(SECTION_DRAG_TYPE, String(index))
          event.dataTransfer.effectAllowed = 'move'
        }}
        title="Drag to reorder"
        className="cursor-grab pt-0.5 text-text-secondary active:cursor-grabbing"
      >
        <GripVertical className="size-4" />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="flex items-center gap-2.5">
          <button type="button" onClick={() => onSelect(section.id)} className="flex min-w-0 flex-1 items-baseline gap-2.5 text-left">
            <span className="shrink-0 font-mono text-xs text-text-secondary">{String(index + 1).padStart(2, '0')}</span>
            <span className={cn('truncate text-[15px] font-semibold', section.title ? 'text-foreground' : 'text-text-tertiary')}>
              {section.title || 'Untitled section'}
            </span>
            {section.eyebrow ? (
              <span className="hidden shrink-0 text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground sm:inline">{section.eyebrow}</span>
            ) : null}
          </button>
          <div className="flex shrink-0 gap-0.5">
            <Button type="button" variant="ghost" size="icon-xs" onClick={() => onMove(index, -1)} disabled={index === 0} aria-label="Move section up" className="text-muted-foreground">
              <ArrowUp />
            </Button>
            <Button type="button" variant="ghost" size="icon-xs" onClick={() => onMove(index, 1)} disabled={index === total - 1} aria-label="Move section down" className="text-muted-foreground">
              <ArrowDown />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              onClick={() => onRemove(section)}
              aria-label="Remove section"
              className="text-muted-foreground hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400"
            >
              <Trash2 />
            </Button>
          </div>
        </div>
        {!selected && body ? (
          <button type="button" onClick={() => onSelect(section.id)} className="line-clamp-2 text-left text-sm leading-relaxed text-muted-foreground">
            {body}
          </button>
        ) : null}
        {showcase || extras.length ? (
          <div className="mt-0.5 flex flex-wrap gap-1.5">
            {showcase ? (
              <span className="inline-flex items-center gap-1.5 rounded-md bg-surface-active px-2 py-0.5 text-xs text-muted-foreground">
                <MonitorPlay className="size-3" />
                Showcase · {showcase.app} · {showcase.label}
              </span>
            ) : null}
            {extras.length ? (
              <span className="inline-flex items-center gap-1.5 rounded-md bg-surface-active px-2 py-0.5 text-xs text-muted-foreground">
                <LayoutGrid className="size-3" />
                {extras.join(' · ')}
              </span>
            ) : null}
          </div>
        ) : null}
        {selected ? (
          <div className="mt-2">
            <SectionContent section={section} onContent={onContent} onEdit={onEdit} />
          </div>
        ) : null}
      </div>
    </div>
  )
}

export function PageEditor({ page, groups, pages, onDirtyChange, onOpenList }) {
  const router = useRouter()
  const [draft, setDraft] = useState(() => toDraft(page, groups))
  const [selectedSectionId, setSelectedSectionId] = useState(() => draft.sections[0]?.id || '')
  const [tab, setTab] = useState('page')
  const [inspectorOpen, setInspectorOpen] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [isSaving, startSaving] = useTransition()
  const [isDeleting, startDeleting] = useTransition()

  const isNew = !page
  const isHome = page?.slug === HELP_HOME_SLUG
  const slug = draft.slugTouched ? draft.slug : autoSlug(draft, groups, pages)
  const children = pages.filter((entry) => entry.parent_id === draft.id)
  const parent = pages.find((entry) => entry.id === draft.parentId)
  const parentOptions = pages.filter((entry) => entry.nav_group_id === draft.navGroupId && !entry.parent_id && entry.id !== draft.id)
  const groupTitle = groups.find((group) => group.id === draft.navGroupId)?.title || 'Help page'
  const sectionIndex = draft.sections.findIndex((section) => section.id === selectedSectionId)
  const selectedSection = draft.sections[sectionIndex]

  useEffect(() => {
    onDirtyChange?.(dirty)
  }, [dirty, onDirtyChange])
  useUnsavedGuard(dirty)

  const markDirty = useCallback(() => setDirty(true), [])
  const change = (updater) => {
    setDirty(true)
    setDraft(updater)
  }
  const set = (key) => (value) => change((current) => ({ ...current, [key]: value }))

  const patchSection = (id, patch) =>
    change((current) => ({
      ...current,
      sections: current.sections.map((section) => (section.id === id ? { ...section, ...patch } : section)),
    }))

  // Editor HTML mirrors in without marking dirty; the editor reports real edits through onEdit.
  const setSectionContent = useCallback((id, html) => {
    setDraft((current) => {
      const index = current.sections.findIndex((section) => section.id === id)
      if (index === -1 || current.sections[index].content === html) return current
      const sections = current.sections.slice()
      sections[index] = { ...sections[index], content: html }
      return { ...current, sections }
    })
  }, [])

  const moveSection = (from, to) => {
    if (from === to || Number.isNaN(from) || to < 0) return
    change((current) => {
      if (to >= current.sections.length) return current
      const sections = current.sections.slice()
      const [moved] = sections.splice(from, 1)
      sections.splice(to, 0, moved)
      return { ...current, sections }
    })
  }

  const selectSection = (id) => {
    setSelectedSectionId(id)
    setTab('section')
  }

  const removeSection = (section) => {
    const hasContent = section.title || plainText(section.content)
    if (hasContent && !window.confirm(`Remove “${section.title || 'this section'}”? This takes effect when you save.`)) return
    change((current) => ({ ...current, sections: current.sections.filter((entry) => entry.id !== section.id) }))
    if (section.id === selectedSectionId) setSelectedSectionId('')
  }

  const addSection = () => {
    const section = newSection()
    change((current) => ({ ...current, sections: [...current.sections, section] }))
    selectSection(section.id)
  }

  const save = () => {
    if (!draft.title.trim()) {
      toast.error('Give the page a title.')
      return
    }
    startSaving(async () => {
      const result = await saveHelpPageAction({ ...draft, slug })
      if (!result.ok) {
        toast.error('Could not save', { description: result.error })
        return
      }
      setDirty(false)
      toast.success(draft.status === 'published' ? 'Page saved and live' : 'Page saved')
      if (isNew) router.replace(`/studio/help?page=${result.id}`, { scroll: false })
      router.refresh()
    })
  }

  const remove = () => {
    const message = children.length
      ? `Delete “${draft.title}”? Its child pages move up a level.`
      : `Delete “${draft.title}”? It disappears from the Help Center.`
    if (!window.confirm(message)) return
    startDeleting(async () => {
      const result = await deleteHelpPageAction(draft.id)
      if (!result.ok) {
        toast.error('Could not delete', { description: result.error })
        return
      }
      setDirty(false)
      toast.success('Page deleted')
      router.replace('/studio/help', { scroll: false })
      router.refresh()
    })
  }

  const openPageTab = () => {
    setTab('page')
    setInspectorOpen(true)
  }

  return (
    <div
      className="flex min-h-0 min-w-0 flex-1"
      onKeyDown={(event) => {
        if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 's') {
          event.preventDefault()
          if (!isSaving) save()
        }
      }}
    >
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <EditorTopBar
          crumbs={['Help Center', groupTitle]}
          current={draft.title || 'Untitled page'}
          meta={
            <>
              <StatusPill status={HELP_STATUS[draft.status] || 'draft'} map={STUDIO_STATUS_MAP} />
              <SaveState dirty={dirty} isNew={isNew} savedAt={page?.updated_at} />
            </>
          }
          onOpenList={onOpenList}
          onOpenInspector={() => setInspectorOpen(true)}
          actions={
            <>
              {!isNew ? <ViewLiveLink href={helpHref(page.slug, { preview: true })}>Preview</ViewLiveLink> : null}
              <MoreMenu>
                <DropdownMenuItem onSelect={addSection} className="cursor-pointer gap-2">
                  <Plus className="size-3.5" />
                  Add section
                </DropdownMenuItem>
                {!isNew ? (
                  <DropdownMenuItem asChild className="cursor-pointer gap-2">
                    <Link href={helpHref(page.slug)} target="_blank">
                      <ExternalLink className="size-3.5" />
                      Open live page
                    </Link>
                  </DropdownMenuItem>
                ) : null}
                {!isNew && !isHome ? (
                  <>
                    <DropdownMenuSeparator />
                    <DangerMenuItem onSelect={remove} disabled={isDeleting}>
                      Delete page
                    </DangerMenuItem>
                  </>
                ) : null}
              </MoreMenu>
              <TopBarDivider />
              <Button type="button" size="sm" onClick={save} disabled={isSaving || isDeleting}>
                {isSaving ? <Loader2 className="size-3.5 animate-spin" /> : null}
                {isNew ? 'Create page' : 'Save page'}
              </Button>
            </>
          }
        />

        <DocumentCanvas>
          <DocumentEyebrow>{groupTitle}</DocumentEyebrow>
          <DocumentTitle value={draft.title} onChange={set('title')} placeholder="Untitled page" aria-label="Title" />
          <DocumentTitle
            value={draft.description}
            onChange={set('description')}
            placeholder="One or two sentences on what this page covers — also the search snippet"
            aria-label="Description"
            className="text-[15px] font-normal leading-relaxed tracking-normal text-muted-foreground"
          />

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <MetaChip onClick={openPageTab} mono>
              <Link2 className="size-3" />
              {helpHref(slug || '…')}
            </MetaChip>
            <MetaChip onClick={openPageTab}>Sidebar · {groupTitle}</MetaChip>
            <MetaChip onClick={openPageTab}>
              {parent ? `Under ${parent.nav_label || parent.title}` : 'Top level'} · order {draft.sortOrder || 0}
            </MetaChip>
            {children.length ? <MetaChip onClick={openPageTab}>{pluralize(children.length, 'child pages')}</MetaChip> : null}
          </div>

          <div className="mt-7 flex flex-col gap-0.5 pb-3">
            <span className="text-[15px] font-semibold text-foreground">Sections</span>
            <span className="text-xs text-muted-foreground">Each section is a heading on the page and an entry in “On this page”.</span>
          </div>
          <div className="flex flex-col gap-2">
            {draft.sections.map((section, index) => (
              <SectionCard
                key={section.id}
                section={section}
                index={index}
                total={draft.sections.length}
                selected={section.id === selectedSectionId}
                onSelect={selectSection}
                onMove={(from, delta) => moveSection(from, from + delta)}
                onDrop={moveSection}
                onRemove={removeSection}
                onContent={setSectionContent}
                onEdit={markDirty}
              />
            ))}
            <Button type="button" variant="outline" onClick={addSection} className="w-full border-dashed text-muted-foreground">
              <Plus className="size-4" />
              Add section
            </Button>
          </div>
        </DocumentCanvas>
      </div>

      <InspectorPane tabs={INSPECTOR_TABS} value={tab} onChange={setTab} open={inspectorOpen} onClose={() => setInspectorOpen(false)}>
        <InspectorPanel active={tab === 'page'}>
          <InspectorSection title="Navigation">
            <Field label="Sidebar label" hint="Defaults to the title" className="gap-1.5">
              <Input value={draft.navLabel} onChange={(event) => set('navLabel')(event.target.value)} placeholder={draft.title || 'Members'} />
            </Field>
            <Field label={<>Sidebar group<Req /></>} className="gap-1.5">
              <Select value={draft.navGroupId} onValueChange={(value) => change((current) => ({ ...current, navGroupId: value, parentId: '' }))}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose a group" />
                </SelectTrigger>
                <SelectContent>
                  {groups.map((group) => (
                    <SelectItem key={group.id} value={group.id}>
                      {group.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field
              label="Parent page"
              hint={children.length ? 'This page has child pages, so it stays top-level' : 'Nests this page one level under another'}
              className="gap-1.5"
            >
              <Select value={draft.parentId || NO_PARENT} onValueChange={(value) => set('parentId')(value === NO_PARENT ? '' : value)} disabled={Boolean(children.length)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NO_PARENT}>None (top level)</SelectItem>
                  {parentOptions.map((entry) => (
                    <SelectItem key={entry.id} value={entry.id}>
                      {entry.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </InspectorSection>
          <InspectorSection title="Publishing">
            <Field label="Slug" hint={isHome ? 'The home page always lives at /help' : `URL: ${helpHref(slug || '…')}`} className="gap-1.5">
              <Input
                value={slug}
                onChange={(event) => change((current) => ({ ...current, slug: event.target.value, slugTouched: true }))}
                onBlur={() => draft.slugTouched && set('slug')(normalizeHelpSlug(draft.slug))}
                disabled={isHome}
                placeholder="workspace/members"
                className="font-mono text-xs"
              />
            </Field>
            <div className="grid grid-cols-[minmax(0,1fr)_88px] gap-2.5">
              <Field label="Status" className="gap-1.5">
                <Select value={draft.status} onValueChange={set('status')}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PAGE_STATUS_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Order" className="gap-1.5">
                <Input type="number" value={draft.sortOrder} onChange={(event) => set('sortOrder')(event.target.value)} />
              </Field>
            </div>
            <p className="text-xs text-muted-foreground">Lower orders come first. Drafts stay hidden until published.</p>
          </InspectorSection>
        </InspectorPanel>

        <InspectorPanel active={tab === 'section'}>
          {selectedSection ? (
            <>
              <InspectorSection>
                <div className="flex min-w-0 items-baseline gap-2">
                  <span className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                    Section {String(sectionIndex + 1).padStart(2, '0')}
                  </span>
                  <span className="truncate text-[13px] font-medium text-foreground">{selectedSection.title || 'Untitled section'}</span>
                </div>
                <Field label="Title" hint="Heading, and its entry in “On this page”" className="gap-1.5">
                  <Input value={selectedSection.title} onChange={(event) => patchSection(selectedSection.id, { title: event.target.value })} placeholder="Section heading" />
                </Field>
                <div className="grid grid-cols-2 gap-2.5">
                  <Field label="Eyebrow" className="gap-1.5">
                    <Input value={selectedSection.eyebrow} onChange={(event) => patchSection(selectedSection.id, { eyebrow: event.target.value })} placeholder="Optional" />
                  </Field>
                  <Field label="Anchor" className="gap-1.5">
                    <Input
                      value={selectedSection.anchorId}
                      onChange={(event) => patchSection(selectedSection.id, { anchorId: event.target.value })}
                      placeholder={slugify(selectedSection.title) || `section-${sectionIndex + 1}`}
                      className="font-mono text-xs"
                    />
                  </Field>
                </div>
                <Field label="Showcase" hint="A live component from the app, shown under this section" className="gap-1.5">
                  <Select
                    value={selectedSection.showcase || NO_SHOWCASE}
                    onValueChange={(value) => patchSection(selectedSection.id, { showcase: value === NO_SHOWCASE ? '' : value })}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={NO_SHOWCASE}>None</SelectItem>
                      {HELP_SHOWCASES.map((showcase) => (
                        <SelectItem key={showcase.id} value={showcase.id}>
                          {showcase.app} · {showcase.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </InspectorSection>
              <InspectorSection>
                {Object.keys(ITEM_KINDS).map((kind, index) => (
                  <ItemsEditor
                    key={`${selectedSection.id}-${kind}`}
                    kind={kind}
                    items={selectedSection[kind]}
                    onChange={(items) => patchSection(selectedSection.id, { [kind]: items })}
                    className={cn(index > 0 && 'mt-1.5', kind === 'cards' && 'border-t border-sidebar-border pt-3.5')}
                  />
                ))}
              </InspectorSection>
            </>
          ) : (
            <p className="px-6 py-12 text-center text-sm text-muted-foreground">Select a section in the outline to edit its heading, showcase and extras here.</p>
          )}
        </InspectorPanel>
      </InspectorPane>
    </div>
  )
}
