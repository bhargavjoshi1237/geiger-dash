'use client'

import { useCallback, useMemo, useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { FolderPlus, House, LifeBuoy, Loader2, Pencil, Plus } from 'lucide-react'
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  EmptyState,
  Field,
  Input,
  SearchInput,
  cn,
} from '@geiger/ui'
import { EditorTopBar, ListEmpty, ListGroupLabel, ListPane, Req, StudioFrame, ViewLiveLink } from '@/components/content-studio/editor-kit'
import { PageEditor } from '@/components/help-studio/page-editor'
import { HELP_STATUS, HELP_STATUS_DOT } from '@/components/help-studio/constants'
import { deleteHelpGroupAction, saveHelpGroupAction } from '@/app/studio/help/actions'
import { HELP_HOME_SLUG } from '@/lib/docs/paths'
import { slugify } from '@/lib/docs/text'

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
          <Field label={<>Title<Req /></>} className="gap-1.5">
            <Input value={draft.title} onChange={set('title')} placeholder="Workspace" autoFocus />
          </Field>
          <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_110px]">
            <Field label="Slug" hint="Prefix for new pages in this group" className="gap-1.5">
              <Input value={draft.slug} onChange={set('slug')} placeholder={slugify(draft.title) || 'workspace'} className="font-mono text-xs" />
            </Field>
            <Field label="Order" className="gap-1.5">
              <Input type="number" value={draft.sortOrder} onChange={set('sortOrder')} />
            </Field>
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
  const matches = (page) => !q || `${page.title} ${page.nav_label || ''} ${page.slug}`.toLowerCase().includes(q)
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

function StatusDot({ status }) {
  return <span aria-hidden className={cn('mx-[3px] size-[7px] shrink-0 rounded-full', HELP_STATUS_DOT[status])} />
}

const LEGEND = [
  { status: 'live', label: 'Live' },
  { status: 'draft', label: 'Draft' },
  { status: 'archived', label: 'Archived' },
]

export function HelpStudio({ groups, pages, page, isNew }) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [groupDialog, setGroupDialog] = useState(null)
  const [listOpen, setListOpen] = useState(false)
  const dirtyRef = useRef(false)

  const tree = useMemo(() => buildTree(groups, pages, query), [groups, pages, query])
  const liveCount = pages.filter((entry) => entry.status === 'published').length
  const selectedId = isNew ? '' : page?.id || ''

  const handleDirtyChange = useCallback((dirty) => {
    dirtyRef.current = dirty
  }, [])

  const open = (id) => {
    if (dirtyRef.current && !window.confirm('Discard your unsaved changes?')) return
    dirtyRef.current = false
    setListOpen(false)
    router.push(`/studio/help?page=${id}`, { scroll: false })
  }

  return (
    <StudioFrame>
      {groupDialog ? <GroupDialog group={groupDialog.group} onOpenChange={(next) => !next && setGroupDialog(null)} /> : null}

      <ListPane
        title="Help Center"
        subtitle={`${liveCount} of ${pages.length} live`}
        open={listOpen}
        onClose={() => setListOpen(false)}
        actions={
          <>
            <Button type="button" variant="ghost" size="icon-sm" onClick={() => setGroupDialog({ group: null })} aria-label="New group" title="New group" className="text-muted-foreground">
              <FolderPlus className="size-4" />
            </Button>
            <Button type="button" size="sm" onClick={() => open('new')} disabled={!groups.length}>
              <Plus className="size-4" />
              Page
            </Button>
          </>
        }
        search={<SearchInput expanded value={query} onChange={setQuery} placeholder="Search pages…" />}
        footer={
          <div className="flex shrink-0 gap-3.5 border-t border-sidebar-border px-4 py-2.5 text-[11px] text-muted-foreground">
            {LEGEND.map((entry) => (
              <span key={entry.status} className="inline-flex items-center gap-1.5">
                <StatusDot status={entry.status} />
                {entry.label}
              </span>
            ))}
          </div>
        }
      >
        {tree.map(({ group, rows }) => (
          <div key={group.id} className="flex flex-col gap-px">
            <ListGroupLabel
              label={group.title}
              action={
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => setGroupDialog({ group })}
                  aria-label={`Edit the ${group.title} group`}
                  className="text-text-secondary"
                >
                  <Pencil />
                </Button>
              }
            />
            {rows.length === 0 ? <p className="px-2.5 py-1 text-xs text-muted-foreground">{query ? 'No matches' : 'No pages yet'}</p> : null}
            {rows.map(({ page: entry, depth }) => (
              <button
                key={entry.id}
                type="button"
                onClick={() => open(entry.id)}
                aria-current={selectedId === entry.id ? 'page' : undefined}
                className={cn(
                  'flex h-8 w-full shrink-0 items-center gap-2 rounded-md border pr-2.5 text-left transition-colors',
                  depth ? 'pl-7' : 'pl-2.5',
                  selectedId === entry.id ? 'border-border bg-surface-active' : 'border-transparent hover:bg-surface-hover',
                )}
              >
                {entry.slug === HELP_HOME_SLUG ? (
                  <House className="size-3.5 shrink-0 text-muted-foreground" />
                ) : (
                  <StatusDot status={HELP_STATUS[entry.status] || 'draft'} />
                )}
                <span className="min-w-0 flex-1 truncate text-[13px] text-foreground">{entry.nav_label || entry.title}</span>
              </button>
            ))}
          </div>
        ))}
        {groups.length === 0 ? <ListEmpty>Create a group to start adding pages.</ListEmpty> : null}
      </ListPane>

      {page || isNew ? (
        <PageEditor
          key={page ? `${page.id}-${page.updated_at}` : 'new'}
          page={page}
          groups={groups}
          pages={pages}
          onDirtyChange={handleDirtyChange}
          onOpenList={() => setListOpen(true)}
        />
      ) : (
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <EditorTopBar current="Help Center" onOpenList={() => setListOpen(true)} actions={<ViewLiveLink href="/help">View /help</ViewLiveLink>} />
          <EmptyState
            icon={LifeBuoy}
            title="Pick a page to edit"
            description="Choose a page from the tree, or create a new one. Drafts stay hidden until you publish them."
            className="[&_p]:normal-case"
            action={
              <Button type="button" size="sm" onClick={() => open('new')} disabled={!groups.length}>
                <Plus className="size-3.5" />
                New page
              </Button>
            }
          />
        </div>
      )}
    </StudioFrame>
  )
}
