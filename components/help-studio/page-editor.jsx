'use client'

import { useCallback, useEffect, useRef, useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { ArrowDown, ArrowUp, ArrowUpRight, FileText, Loader2, Plus, Save, Trash2 } from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from '@geiger/ui'
import { CollapsibleSection, FormField, inputClassName, textareaClassName } from '@/components/content-studio/shared'
import { TiptapBlogEditor } from '@/components/content-studio/tiptap-blog-editor'
import { ItemsEditor, ITEM_KINDS } from '@/components/help-studio/items-editor'
import { NO_PARENT, NO_SHOWCASE, PAGE_STATUS_BADGE, PAGE_STATUS_OPTIONS } from '@/components/help-studio/constants'
import { deleteHelpPageAction, saveHelpPageAction } from '@/app/studio/help/actions'
import { HELP_HOME_SLUG, helpHref } from '@/lib/docs/paths'
import { normalizeHelpSlug, slugify } from '@/lib/docs/text'
import { HELP_SHOWCASES } from '@/lib/docs/showcases'

function newSection(title = '') {
  return {
    id: crypto.randomUUID(),
    anchorId: '',
    eyebrow: '',
    title,
    content: '',
    initialContent: '',
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
    sections: page.sections.map((section) => ({ ...section, initialContent: section.content })),
  }
}

// New pages get "<group or parent slug>/<title>" until the slug is edited by hand.
function autoSlug(draft, groups, pages) {
  const parent = pages.find((page) => page.id === draft.parentId)
  const prefix = parent ? parent.slug : groups.find((group) => group.id === draft.navGroupId)?.slug || ''
  return normalizeHelpSlug(`${prefix}/${slugify(draft.title)}`)
}

function SectionEditor({ section, index, total, onPatch, onContent, onMove, onRemove }) {
  // Tiptap re-emits normalized HTML on load; only edits after the user touches the editor count as changes.
  const touched = useRef(false)
  const markTouched = () => {
    touched.current = true
  }
  const handleContent = useCallback((html) => onContent(section.id, html, touched.current), [onContent, section.id])
  const extrasCount = section.cards.length + section.features.length + section.links.length
  const anchorPreview = slugify(section.anchorId || section.title) || `section-${index + 1}`

  return (
    <Card className="min-w-0 max-w-full gap-0 overflow-hidden rounded-lg border-border bg-card/45 py-0 shadow-none">
      <CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0 border-b border-border p-3">
        <CardTitle className="min-w-0 truncate text-sm font-medium">
          <span className="text-muted-foreground">Section {index + 1}</span>
          {section.title ? <span className="text-foreground"> · {section.title}</span> : null}
        </CardTitle>
        <div className="flex shrink-0 items-center gap-1">
          <Button type="button" size="icon-sm" variant="ghost" onClick={() => onMove(index, -1)} disabled={index === 0} aria-label="Move section up">
            <ArrowUp className="size-3.5" />
          </Button>
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            onClick={() => onMove(index, 1)}
            disabled={index === total - 1}
            aria-label="Move section down"
          >
            <ArrowDown className="size-3.5" />
          </Button>
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            onClick={() => onRemove(section)}
            aria-label="Remove section"
            className="text-muted-foreground hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400"
          >
            <Trash2 className="size-3.5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="min-w-0 space-y-4 p-4">
        <div className="grid gap-4 md:grid-cols-3">
          <FormField label="Title" hint="Heading, and its entry in “On this page”">
            <Input
              value={section.title}
              onChange={(event) => onPatch(section.id, { title: event.target.value })}
              placeholder="Section heading"
              className={inputClassName}
            />
          </FormField>
          <FormField label="Eyebrow" hint="Optional small label above the heading">
            <Input
              value={section.eyebrow}
              onChange={(event) => onPatch(section.id, { eyebrow: event.target.value })}
              placeholder="Getting started"
              className={inputClassName}
            />
          </FormField>
          <FormField label="Anchor" hint={`Links to #${anchorPreview}`}>
            <Input
              value={section.anchorId}
              onChange={(event) => onPatch(section.id, { anchorId: event.target.value })}
              placeholder={slugify(section.title) || 'Auto from title'}
              className={inputClassName}
            />
          </FormField>
        </div>

        <div className="min-w-0" onPointerDownCapture={markTouched} onKeyDownCapture={markTouched} onPasteCapture={markTouched}>
          <TiptapBlogEditor name={`section-${section.id}`} defaultValue={section.initialContent} onChange={handleContent} />
        </div>

        <FormField label="Showcase" hint="A live component from the app, shown under this section">
          <Select
            value={section.showcase || NO_SHOWCASE}
            onValueChange={(value) => onPatch(section.id, { showcase: value === NO_SHOWCASE ? '' : value })}
          >
            <SelectTrigger className={`${inputClassName} w-full md:w-80`}>
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
        </FormField>

        <Accordion type="single" collapsible defaultValue={extrasCount ? 'extras' : undefined} className="rounded-md border border-border">
          <AccordionItem value="extras" className="border-0">
            <AccordionTrigger className="px-3 py-2.5 text-sm hover:no-underline">
              Cards, features &amp; links{extrasCount ? ` (${extrasCount})` : ''}
            </AccordionTrigger>
            <AccordionContent className="space-y-5 px-3 pb-3">
              {Object.keys(ITEM_KINDS).map((kind) => (
                <ItemsEditor key={kind} kind={kind} items={section[kind]} onChange={(items) => onPatch(section.id, { [kind]: items })} />
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  )
}

export function PageEditor({ page, groups, pages, onDirtyChange }) {
  const router = useRouter()
  const [draft, setDraft] = useState(() => toDraft(page, groups))
  const [dirty, setDirty] = useState(false)
  const [isSaving, startSaving] = useTransition()
  const [isDeleting, startDeleting] = useTransition()

  const isNew = !page
  const isHome = page?.slug === HELP_HOME_SLUG
  const slug = draft.slugTouched ? draft.slug : autoSlug(draft, groups, pages)
  const hasChildren = pages.some((entry) => entry.parent_id === draft.id)
  const parentOptions = pages.filter(
    (entry) => entry.nav_group_id === draft.navGroupId && !entry.parent_id && entry.id !== draft.id,
  )
  const groupTitle = groups.find((group) => group.id === draft.navGroupId)?.title || 'Help page'
  const statusBadge = PAGE_STATUS_BADGE[draft.status] || PAGE_STATUS_BADGE.draft

  useEffect(() => {
    onDirtyChange?.(dirty)
  }, [dirty, onDirtyChange])

  useEffect(() => {
    if (!dirty) return undefined
    const warn = (event) => event.preventDefault()
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])

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

  const setSectionContent = useCallback((id, html, byUser) => {
    if (byUser) setDirty(true)
    setDraft((current) => {
      const index = current.sections.findIndex((section) => section.id === id)
      if (index === -1 || current.sections[index].content === html) return current
      const sections = current.sections.slice()
      sections[index] = { ...sections[index], content: html }
      return { ...current, sections }
    })
  }, [])

  const moveSection = (index, delta) =>
    change((current) => {
      const sections = current.sections.slice()
      const [moved] = sections.splice(index, 1)
      sections.splice(index + delta, 0, moved)
      return { ...current, sections }
    })

  const removeSection = (section) => {
    const hasContent = section.title || section.content.replace(/<[^>]+>/g, '').trim()
    if (hasContent && !window.confirm(`Remove “${section.title || 'this section'}”? This takes effect when you save.`)) return
    change((current) => ({ ...current, sections: current.sections.filter((entry) => entry.id !== section.id) }))
  }

  const addSection = () => change((current) => ({ ...current, sections: [...current.sections, newSection()] }))

  const save = () =>
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

  const remove = () => {
    const message = hasChildren
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

  return (
    <div className="min-w-0 max-w-full space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">{groupTitle}</p>
          <h2 className="mt-1 truncate text-xl font-semibold tracking-tight">{draft.title || 'Untitled page'}</h2>
        </div>
        <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
      </div>

      <CollapsibleSection value="page-details" icon={FileText} title="Page details">
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Title" required>
              <Input
                value={draft.title}
                onChange={(event) => set('title')(event.target.value)}
                placeholder="Members & roles"
                className={inputClassName}
              />
            </FormField>
            <FormField label="Sidebar label" hint="Defaults to the title">
              <Input
                value={draft.navLabel}
                onChange={(event) => set('navLabel')(event.target.value)}
                placeholder={draft.title || 'Members'}
                className={inputClassName}
              />
            </FormField>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Sidebar group" required>
              <Select
                value={draft.navGroupId}
                onValueChange={(value) => change((current) => ({ ...current, navGroupId: value, parentId: '' }))}
              >
                <SelectTrigger className={`${inputClassName} w-full`}>
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
            </FormField>
            <FormField label="Parent page" hint={hasChildren ? 'This page has child pages, so it stays top-level' : 'Nests this page one level under another'}>
              <Select
                value={draft.parentId || NO_PARENT}
                onValueChange={(value) => set('parentId')(value === NO_PARENT ? '' : value)}
                disabled={hasChildren}
              >
                <SelectTrigger className={`${inputClassName} w-full`}>
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
            </FormField>
          </div>

          <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_180px_140px]">
            <FormField label="Slug" hint={isHome ? 'The home page always lives at /help' : `URL: ${helpHref(slug || '…')}`}>
              <Input
                value={slug}
                onChange={(event) => change((current) => ({ ...current, slug: event.target.value, slugTouched: true }))}
                onBlur={() => draft.slugTouched && set('slug')(normalizeHelpSlug(draft.slug))}
                disabled={isHome}
                placeholder="workspace/members"
                className={inputClassName}
              />
            </FormField>
            <FormField label="Status">
              <Select value={draft.status} onValueChange={set('status')}>
                <SelectTrigger className={`${inputClassName} w-full`}>
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
            </FormField>
            <FormField label="Order" hint="Lower comes first">
              <Input
                type="number"
                value={draft.sortOrder}
                onChange={(event) => set('sortOrder')(event.target.value)}
                className={inputClassName}
              />
            </FormField>
          </div>

          <FormField label="Description" hint="Shown under the title and used as the search snippet">
            <Textarea
              value={draft.description}
              onChange={(event) => set('description')(event.target.value)}
              rows={2}
              placeholder="One or two sentences on what this page covers"
              className={textareaClassName}
            />
          </FormField>
        </div>
      </CollapsibleSection>

      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold">Sections</h3>
            <p className="text-xs text-muted-foreground">Each section is a heading on the page and an entry in “On this page”.</p>
          </div>
          <Button type="button" size="sm" variant="outline" onClick={addSection}>
            <Plus className="size-3.5" />
            Add section
          </Button>
        </div>

        {draft.sections.map((section, index) => (
          <SectionEditor
            key={section.id}
            section={section}
            index={index}
            total={draft.sections.length}
            onPatch={patchSection}
            onContent={setSectionContent}
            onMove={moveSection}
            onRemove={removeSection}
          />
        ))}

        {draft.sections.length === 0 ? (
          <p className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            No sections yet. Add one to start writing.
          </p>
        ) : null}
      </div>

      <div className="sticky bottom-3 z-20 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-background/95 p-3 shadow-xl backdrop-blur">
        <p className="text-sm text-muted-foreground">
          {dirty ? 'Unsaved changes' : isNew ? 'New page, not saved yet' : 'All changes saved'}
        </p>
        <div className="flex flex-wrap gap-2">
          {!isNew && !isHome ? (
            <Button
              type="button"
              variant="ghost"
              onClick={remove}
              disabled={isDeleting || isSaving}
              className="text-red-600 hover:bg-red-500/10 hover:text-red-600 dark:text-red-400 dark:hover:text-red-400"
            >
              {isDeleting ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
              Delete
            </Button>
          ) : null}
          {!isNew ? (
            <Button asChild type="button" variant="outline">
              <Link href={helpHref(page.slug, { preview: true })} target="_blank">
                Preview
                <ArrowUpRight className="size-3.5" />
              </Link>
            </Button>
          ) : null}
          <Button type="button" onClick={save} disabled={isSaving || isDeleting} className="gap-2">
            {isSaving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            {isNew ? 'Create page' : 'Save page'}
          </Button>
        </div>
      </div>
    </div>
  )
}
