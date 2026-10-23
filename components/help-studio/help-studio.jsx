'use client'

import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { ArrowUpRight, FilePlus2, FolderPlus, LayoutGrid, Loader2, Pencil, Search } from 'lucide-react'
import {
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
} from '@geiger/ui'
import { FormField, inputClassName } from '@/components/content-studio/shared'
import { StudioTabs } from '@/components/content-studio/studio-shell'
import { PageEditor } from '@/components/help-studio/page-editor'
import { PAGE_STATUS_BADGE } from '@/components/help-studio/constants'
import { deleteHelpGroupAction, saveHelpGroupAction } from '@/app/studio/help/actions'
import { slugify } from '@/lib/docs/text'

function StudioHeader({ children }) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-background/95 px-3 backdrop-blur sm:px-4">
      <div className="flex min-w-0 items-center gap-3">
        <Link href="/" className="flex size-8 shrink-0 items-center justify-center rounded-md border border-border bg-card">
          <LayoutGrid className="size-4" />
          <span className="sr-only">Back to Geiger</span>
        </Link>
        <div className="flex min-w-0 items-center gap-2">
          <h1 className="truncate text-sm font-semibold">Geiger Help Studio</h1>
          <Badge variant="outline" className="hidden font-mono text-[10px] sm:inline-flex">Help</Badge>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <StudioTabs active="help" />
        {children}
      </div>
    </header>
  )
}

function GroupDialog({ group, onOpenChange }) {
  const router = useRouter()
  const [draft, setDraft] = useState(() => ({
    id: group?.id || '',
    title: group?.title || '',
    slug: group?.slug || '',
    sortOrder: String(group?.sort_order ?? 0),
  }))
  const [isPending, startTransition] = useTransition()
  const set = (key) => (event) => setDraft((current) => ({ ...current, [key]: event.target.value }))

  const run = (action, success) =>
    startTransition(async () => {
      const result = await action()
      if (!result.ok) {
        toast.error(result.error)
        return
      }
      toast.success(success)
      onOpenChange(false)
      router.refresh()
    })

  const save = (event) => {
    event.preventDefault()
    run(() => saveHelpGroupAction(draft), draft.id ? 'Group updated' : 'Group created')
  }

  const remove = () => {
    if (!window.confirm(`Delete the “${draft.title}” group?`)) return
    run(() => deleteHelpGroupAction(draft.id), 'Group deleted')
  }

  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={save} className="grid gap-4">
          <DialogHeader>
            <DialogTitle>{draft.id ? 'Edit group' : 'New group'}</DialogTitle>
            <DialogDescription>Groups are the headings in the Help Center sidebar.</DialogDescription>
          </DialogHeader>
          <FormField label="Title" required>
            <Input value={draft.title} onChange={set('title')} placeholder="Workspace" className={inputClassName} autoFocus />
          </FormField>
          <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_110px]">
            <FormField label="Slug" hint="Prefix for new pages in this group">
              <Input value={draft.slug} onChange={set('slug')} placeholder={slugify(draft.title) || 'workspace'} className={inputClassName} />
            </FormField>
            <FormField label="Order">
              <Input type="number" value={draft.sortOrder} onChange={set('sortOrder')} className={inputClassName} />
            </FormField>
          </div>
          <DialogFooter className="gap-2 sm:justify-between">
            {draft.id ? (
              <Button
                type="button"
                variant="ghost"
                onClick={remove}
                disabled={isPending}
                className="text-red-600 hover:bg-red-500/10 hover:text-red-600 dark:text-red-400 dark:hover:text-red-400"
              >
                Delete group
              </Button>
            ) : (
              <span />
            )}
            <div className="flex gap-2">
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending} className="bg-primary">
                {isPending ? <Loader2 className="size-4 animate-spin" /> : null}
                {draft.id ? 'Save group' : 'Create group'}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Each group's pages, children listed right after their parent.
function buildTree(groups, pages, query) {
  const q = query.trim().toLowerCase()
  const matches = (page) => !q || `${page.title} ${page.slug}`.toLowerCase().includes(q)
  const bySort = (a, b) => a.sort_order - b.sort_order || a.title.localeCompare(b.title)

  return groups.map((group) => {
    const inGroup = pages.filter((page) => page.nav_group_id === group.id).sort(bySort)
    const ids = new Set(inGroup.map((page) => page.id))
    const rows = []
    for (const page of inGroup.filter((entry) => !entry.parent_id || !ids.has(entry.parent_id))) {
      rows.push({ page, depth: 0 })
      for (const child of inGroup.filter((entry) => entry.parent_id === page.id)) rows.push({ page: child, depth: 1 })
    }
    return { group, rows: rows.filter((row) => matches(row.page)) }
  })
}

export function HelpStudio({ groups, pages, page, isNew }) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [groupDialog, setGroupDialog] = useState(null)
  const dirtyRef = useRef(false)

  const tree = useMemo(() => buildTree(groups, pages, query), [groups, pages, query])
  const publishedCount = pages.filter((entry) => entry.status === 'published').length
  const selectedId = page?.id || ''

  // Same full-height shell as the other Studio screens.
  useEffect(() => {
    const previousHtmlOverflow = document.documentElement.style.overflow
    const previousBodyOverflow = document.body.style.overflow
    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
    return () => {
      document.documentElement.style.overflow = previousHtmlOverflow
      document.body.style.overflow = previousBodyOverflow
    }
  }, [])

  const handleDirtyChange = useCallback((dirty) => {
    dirtyRef.current = dirty
  }, [])

  const open = (id) => {
    if (dirtyRef.current && !window.confirm('Discard your unsaved changes?')) return
    dirtyRef.current = false
    router.push(`/studio/help?page=${id}`, { scroll: false })
  }

  return (
    <div className="fixed inset-0 flex min-h-0 min-w-0 flex-col overflow-hidden bg-background text-foreground">
      {groupDialog ? <GroupDialog group={groupDialog.group} onOpenChange={(next) => !next && setGroupDialog(null)} /> : null}

      <StudioHeader>
        <Button asChild type="button" size="sm" variant="ghost" className="hidden sm:inline-flex">
          <Link href="/help" target="_blank">
            View live
            <ArrowUpRight className="size-3.5" />
          </Link>
        </Button>
        <Button type="button" size="sm" onClick={() => open('new')} disabled={!groups.length} className="gap-1.5">
          <FilePlus2 className="size-3.5" />
          <span className="hidden sm:inline">New page</span>
        </Button>
      </StudioHeader>

      <div className="grid min-h-0 min-w-0 flex-1 grid-cols-1 overflow-x-hidden lg:grid-cols-[300px_minmax(0,1fr)]">
        <aside className="hidden min-h-0 min-w-0 flex-col border-r border-border bg-card/25 lg:flex">
          <div className="space-y-3 border-b border-border p-3">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-sm font-semibold">Pages</p>
                <p className="text-xs text-muted-foreground">
                  {publishedCount} of {pages.length} live
                </p>
              </div>
              <Button type="button" size="sm" variant="outline" onClick={() => setGroupDialog({ group: null })}>
                <FolderPlus className="size-3.5" />
                Group
              </Button>
            </div>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search pages..."
                className={`${inputClassName} pl-9`}
              />
            </div>
          </div>

          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-2">
            {tree.map(({ group, rows }) => (
              <div key={group.id} className="space-y-1">
                <div className="flex items-center justify-between gap-2 px-2 pt-2">
                  <p className="truncate text-xs font-medium uppercase text-text-secondary">{group.title}</p>
                  <Button
                    type="button"
                    size="icon-sm"
                    variant="ghost"
                    onClick={() => setGroupDialog({ group })}
                    aria-label={`Edit the ${group.title} group`}
                    className="size-7 text-muted-foreground"
                  >
                    <Pencil className="size-3" />
                  </Button>
                </div>
                {rows.length === 0 ? (
                  <p className="px-2 py-1 text-xs text-muted-foreground">{query ? 'No matches' : 'No pages yet'}</p>
                ) : null}
                {rows.map(({ page: entry, depth }) => {
                  const badge = PAGE_STATUS_BADGE[entry.status] || PAGE_STATUS_BADGE.draft
                  return (
                    <button
                      key={entry.id}
                      type="button"
                      onClick={() => open(entry.id)}
                      className={`grid w-full min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-2 rounded-md border px-2 py-1.5 text-left transition-colors ${
                        depth ? 'ml-4 w-[calc(100%-1rem)]' : ''
                      } ${selectedId === entry.id ? 'border-border bg-surface-active' : 'border-transparent hover:bg-surface-hover'}`}
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium">{entry.nav_label || entry.title}</span>
                        <span className="block truncate text-xs text-muted-foreground">{entry.slug}</span>
                      </span>
                      <Badge variant={badge.variant} className="px-1.5 py-0.5 text-[10px]">
                        {badge.label}
                      </Badge>
                    </button>
                  )
                })}
              </div>
            ))}
            {groups.length === 0 ? (
              <p className="px-2 py-8 text-center text-sm text-muted-foreground">Create a group to start adding pages.</p>
            ) : null}
          </div>
        </aside>

        <main className="min-h-0 min-w-0 overflow-y-auto overflow-x-hidden overscroll-contain bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]">
          <div className="mx-auto min-w-0 max-w-4xl px-3 py-4 sm:px-6 sm:py-6">
            {page || isNew ? (
              <PageEditor
                key={page ? `${page.id}-${page.updated_at}` : 'new'}
                page={page}
                groups={groups}
                pages={pages}
                onDirtyChange={handleDirtyChange}
              />
            ) : (
              <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-center">
                <p className="text-base font-semibold">Pick a page to edit</p>
                <p className="max-w-sm text-sm text-muted-foreground">
                  Choose a page from the list, or create a new one. Drafts stay hidden until you publish them.
                </p>
                <Button type="button" size="sm" onClick={() => open('new')} disabled={!groups.length}>
                  <FilePlus2 className="size-3.5" />
                  New page
                </Button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
