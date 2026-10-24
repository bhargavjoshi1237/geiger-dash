'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { GitCommitHorizontal, Plus, X } from 'lucide-react'
import {
  Badge,
  Button,
  DropdownMenuItem,
  DropdownMenuSeparator,
  Field,
  Input,
  SearchInput,
  SegmentedTabs,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from '@geiger/ui'
import { deleteChangelogAction, saveChangelogAction } from '@/app/studio/posts/actions'
import {
  DangerMenuItem,
  DocumentCanvas,
  DocumentEyebrow,
  DocumentTitle,
  EditorTopBar,
  InspectorPane,
  InspectorPanel,
  InspectorSection,
  ListEmpty,
  ListItem,
  ListPane,
  MoreMenu,
  Req,
  SaveState,
  StudioFrame,
  SwitchRow,
  TopBarDivider,
  ViewLiveLink,
  handleEditorKeys,
  useUnsavedGuard,
} from '@/components/content-studio/editor-kit'
import { CoverImageField, MediaLibrary, toDateInput } from '@/components/content-studio/shared'
import {
  RELEASE_CATEGORIES,
  RELEASE_FILTERS,
  RELEASE_ITEM_TYPES,
  RELEASE_PRODUCTS,
  RELEASE_PRODUCT_LABEL,
  formatShortDate,
} from '@/components/content-studio/constants'
import { useStudioRecord } from '@/components/content-studio/use-studio-record'
import { SubmitButton } from '@/components/content-studio/submit-button'
import { CommitChangelogDialog } from '@/components/content-studio/commit-changelog-dialog'

const INSPECTOR_TABS = [
  { label: 'Settings', value: 'settings' },
  { label: 'Media', value: 'media' },
]

const versionLabel = (version) => {
  const value = String(version || '').trim()
  if (!value) return ''
  return /^v/i.test(value) ? value : `v${value}`
}

const newItem = (text = '') => ({ id: crypto.randomUUID(), text })
const linesToItems = (text) =>
  String(text || '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => newItem(line))

function toDraft(record) {
  const items = Object.fromEntries(
    RELEASE_ITEM_TYPES.map(({ key }) => [
      key,
      (record?.items || []).filter((item) => item.type === key).map((item) => newItem(item.description)),
    ]),
  )
  return {
    version: record?.version || '',
    title: record?.title || '',
    description: record?.description || '',
    category: record?.category || 'feature',
    product: record?.product || 'geiger-dash',
    releaseDate: toDateInput(record?.release_date || new Date().toISOString()),
    isFeatured: Boolean(record?.is_featured),
    imageUrl: record?.image_url || '',
    items,
  }
}

// One typed group of release items; each row is a line on /changelog. Enter adds a row, Backspace on an empty row removes it.
function ItemGroup({ type, items, onChange }) {
  const refs = useRef(new Map())
  const pendingFocus = useRef(null)

  // Focus a just-added (or the previous) row once it has rendered.
  useEffect(() => {
    if (!pendingFocus.current) return
    refs.current.get(pendingFocus.current)?.focus()
    pendingFocus.current = null
  })
  const setFocusId = (id) => {
    pendingFocus.current = id
  }

  const update = (id, text) => onChange(items.map((item) => (item.id === id ? { ...item, text } : item)))
  const insertAfter = (index) => {
    const item = newItem()
    onChange([...items.slice(0, index + 1), item, ...items.slice(index + 1)])
    setFocusId(item.id)
  }
  const remove = (index, focusPrevious = false) => {
    onChange(items.filter((_, i) => i !== index))
    if (focusPrevious && index > 0) setFocusId(items[index - 1].id)
  }

  return (
    <div className="grid grid-cols-1 gap-2 border-b border-sidebar-border py-3.5 sm:grid-cols-[110px_minmax(0,1fr)] sm:gap-4">
      <div className="flex h-8 items-center gap-1.5">
        <Badge variant={type.variant}>{type.label}</Badge>
        <span className="text-xs tabular-nums text-text-secondary">{items.length}</span>
      </div>
      <div className="flex min-w-0 flex-col gap-1">
        {items.map((item, index) => (
          <div key={item.id} className="group flex min-h-8 items-center gap-2.5 rounded-md pl-2.5 pr-1 transition-colors focus-within:bg-surface-hover hover:bg-surface-hover">
            <span aria-hidden className="size-1 shrink-0 rounded-full bg-muted-foreground" />
            <input
              ref={(element) => (element ? refs.current.set(item.id, element) : refs.current.delete(item.id))}
              value={item.text}
              onChange={(event) => update(item.id, event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault()
                  insertAfter(index)
                } else if (event.key === 'Backspace' && !item.text) {
                  event.preventDefault()
                  remove(index, true)
                }
              }}
              placeholder={`What was ${type.label.toLowerCase()}?`}
              aria-label={`${type.label} item ${index + 1}`}
              className="min-w-0 flex-1 bg-transparent py-1.5 text-sm text-foreground outline-none placeholder:text-text-tertiary"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              onClick={() => remove(index)}
              aria-label="Remove item"
              className="text-text-secondary opacity-0 transition-opacity focus-visible:opacity-100 group-hover:opacity-100"
            >
              <X />
            </Button>
          </div>
        ))}
        <div className="flex h-8 items-center">
          <Button type="button" variant="ghost" size="xs" onClick={() => insertAfter(items.length - 1)} className="text-muted-foreground">
            <Plus />
            Add item
          </Button>
        </div>
      </div>
    </div>
  )
}

function ReleaseEditor({ release, onDirtyChange, onDelete, onOpenList }) {
  const [initial] = useState(() => toDraft(release))
  const [fields, setFields] = useState(initial)
  const [tab, setTab] = useState('settings')
  const [inspectorOpen, setInspectorOpen] = useState(false)
  const [commitOpen, setCommitOpen] = useState(false)
  const [dirty, setDirty] = useState(false)

  const markDirty = useCallback(() => setDirty(true), [])
  const set = (key) => (value) => {
    setFields((current) => ({ ...current, [key]: value }))
    setDirty(true)
  }
  const setItems = (key) => (items) => {
    setFields((current) => ({ ...current, items: { ...current.items, [key]: items } }))
    setDirty(true)
  }

  useEffect(() => {
    onDirtyChange(dirty)
  }, [dirty, onDirtyChange])
  useUnsavedGuard(dirty)

  const isNew = !release
  const totalItems = RELEASE_ITEM_TYPES.reduce((sum, { key }) => sum + fields.items[key].filter((item) => item.text.trim()).length, 0)

  // Merge a commit-generated draft, keeping anything the generator left blank.
  const applyGenerated = (draft) => {
    setFields((current) => {
      const next = { ...current, items: { ...current.items } }
      for (const key of ['version', 'title', 'description', 'category']) {
        if (draft[key]) next[key] = draft[key]
      }
      for (const { key } of RELEASE_ITEM_TYPES) {
        const items = linesToItems(draft[`items_${key}`])
        if (items.length) next.items[key] = items
      }
      return next
    })
    setDirty(true)
  }

  const validate = (event) => {
    const problem = !fields.version.trim()
      ? 'Add a version number.'
      : !fields.title.trim()
        ? 'Give the release a title.'
        : !fields.description.trim()
          ? 'Add a short description.'
          : ''
    if (!problem) return
    event.preventDefault()
    toast.error(problem)
  }

  return (
    <>
      <CommitChangelogDialog open={commitOpen} onOpenChange={setCommitOpen} product={fields.product} onApply={applyGenerated} />
      <form
        action={saveChangelogAction}
        onSubmit={validate}
        onInput={markDirty}
        onKeyDown={handleEditorKeys}
        noValidate
        className="flex min-h-0 min-w-0 flex-1"
      >
        <input type="hidden" name="id" value={release?.id || ''} />
        <input type="hidden" name="category" value={fields.category} />
        <input type="hidden" name="product" value={fields.product} />
        <input type="hidden" name="is_featured" value={fields.isFeatured ? 'on' : ''} />
        {RELEASE_ITEM_TYPES.map(({ key }) => (
          <input
            key={key}
            type="hidden"
            name={`items_${key}`}
            value={fields.items[key].map((item) => item.text.trim()).filter(Boolean).join('\n')}
          />
        ))}

        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <EditorTopBar
            crumbs={['Releases']}
            current={versionLabel(fields.version) || 'New release'}
            currentClassName="font-mono"
            meta={
              <>
                {fields.isFeatured ? <Badge variant="info">Featured</Badge> : null}
                <SaveState dirty={dirty} isNew={isNew} savedAt={release?.updated_at} />
              </>
            }
            onOpenList={onOpenList}
            onOpenInspector={() => setInspectorOpen(true)}
            actions={
              <>
                <ViewLiveLink href={release ? `/changelog/${release.id}` : '/changelog'}>View changelog</ViewLiveLink>
                <MoreMenu>
                  <DropdownMenuItem onSelect={() => setCommitOpen(true)} className="cursor-pointer gap-2">
                    <GitCommitHorizontal className="size-3.5" />
                    Generate from commits
                  </DropdownMenuItem>
                  {!isNew ? (
                    <>
                      <DropdownMenuSeparator />
                      <DangerMenuItem onSelect={() => onDelete(release)}>Delete release</DangerMenuItem>
                    </>
                  ) : null}
                </MoreMenu>
                <TopBarDivider />
                <SubmitButton>{isNew ? 'Create release' : 'Update release'}</SubmitButton>
              </>
            }
          />

          <DocumentCanvas>
            <DocumentEyebrow>Product release</DocumentEyebrow>
            <DocumentTitle name="title" value={fields.title} onChange={set('title')} placeholder="Untitled release" aria-label="Title" />

            <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-[120px_minmax(0,1fr)_minmax(0,1fr)_150px]">
              <Field label={<>Version<Req /></>} className="gap-1.5">
                <Input name="version" value={fields.version} onChange={(event) => set('version')(event.target.value)} placeholder="1.0.0" className="font-mono" />
              </Field>
              <Field label="Product" className="gap-1.5">
                <Select value={fields.product} onValueChange={set('product')}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {RELEASE_PRODUCTS.map((product) => (
                      <SelectItem key={product.value} value={product.value}>
                        {product.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Category" className="gap-1.5">
                <Select value={fields.category} onValueChange={set('category')}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {RELEASE_CATEGORIES.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Release date" className="gap-1.5">
                <Input type="date" name="release_date" value={fields.releaseDate} onChange={(event) => set('releaseDate')(event.target.value)} />
              </Field>
            </div>

            <Field label={<>Description<Req /></>} className="mt-4 gap-1.5">
              <Textarea
                name="description"
                rows={2}
                value={fields.description}
                onChange={(event) => set('description')(event.target.value)}
                placeholder="One or two sentences on what this release brings"
                className="min-h-0"
              />
            </Field>

            <div className="mt-7 flex flex-wrap items-center gap-x-2.5 gap-y-1 border-b border-border pb-3">
              <span className="text-[15px] font-semibold text-foreground">Release items</span>
              <span className="text-xs text-muted-foreground">Each line becomes one entry on /changelog</span>
              <Button type="button" variant="outline" size="sm" onClick={() => setCommitOpen(true)} className="ml-auto">
                <GitCommitHorizontal className="size-4" />
                From commits
              </Button>
            </div>
            {RELEASE_ITEM_TYPES.map((type) => (
              <ItemGroup key={type.key} type={type} items={fields.items[type.key]} onChange={setItems(type.key)} />
            ))}
            <p className="mt-3 text-xs text-muted-foreground">
              {totalItems} {totalItems === 1 ? 'entry' : 'entries'} · empty groups are left off the changelog.
            </p>
          </DocumentCanvas>
        </div>

        <InspectorPane tabs={INSPECTOR_TABS} value={tab} onChange={setTab} open={inspectorOpen} onClose={() => setInspectorOpen(false)}>
          <InspectorPanel active={tab === 'settings'}>
            <InspectorSection title="Publishing">
              <SwitchRow title="Featured" description="Highlighted at the top of /changelog" checked={fields.isFeatured} onCheckedChange={set('isFeatured')} />
            </InspectorSection>
            <InspectorSection title="Cover image" aside="Optional · shown on the entry">
              <CoverImageField existingUrl={initial.imageUrl} onBrowse={() => setTab('media')} onEdit={markDirty} />
            </InspectorSection>
          </InspectorPanel>
          <InspectorPanel active={tab === 'media'} className="min-h-full">
            {tab === 'media' ? <MediaLibrary activeTab="changelog" /> : null}
          </InspectorPanel>
        </InspectorPane>
      </form>
    </>
  )
}

export function ReleasesStudio({ changelogs, selectedId, saved = false, error = '' }) {
  const router = useRouter()
  const { openId, open, formKey } = useStudioRecord({
    basePath: '/studio/releases',
    param: 'release',
    selectedId,
    saved,
    error,
    savedMessage: 'Release saved',
  })
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const [listOpen, setListOpen] = useState(false)
  const dirtyRef = useRef(false)

  const rows = useMemo(() => {
    const q = query.toLowerCase().trim()
    return changelogs.filter(
      (entry) =>
        (filter === 'all' || entry.is_featured) &&
        (!q || `${entry.title} ${entry.version} ${RELEASE_PRODUCT_LABEL[entry.product] || entry.product}`.toLowerCase().includes(q)),
    )
  }, [changelogs, query, filter])

  const editing = changelogs.find((entry) => entry.id === openId)

  const handleDirtyChange = useCallback((dirty) => {
    dirtyRef.current = dirty
  }, [])

  const select = (id) => {
    if (id !== openId && dirtyRef.current && !window.confirm('Discard your unsaved changes?')) return
    dirtyRef.current = false
    open(id)
    setListOpen(false)
  }

  const deleteRelease = async (entry) => {
    if (!window.confirm(`Delete ${versionLabel(entry.version)} “${entry.title}”? This cannot be undone.`)) return
    const result = await deleteChangelogAction(entry.id)
    if (!result.ok) {
      toast.error(result.error || 'Unable to delete the release')
      return
    }
    dirtyRef.current = false
    if (openId === entry.id) open('')
    toast.success('Release deleted')
    router.refresh()
  }

  return (
    <StudioFrame>
      <ListPane
        title="Releases"
        count={changelogs.length}
        open={listOpen}
        onClose={() => setListOpen(false)}
        actions={
          <Button type="button" size="sm" onClick={() => select('')}>
            <Plus className="size-4" />
            New
          </Button>
        }
        search={<SearchInput expanded value={query} onChange={setQuery} placeholder="Search version, title, product…" />}
        filters={<SegmentedTabs fullWidth tabs={RELEASE_FILTERS} value={filter} onChange={setFilter} buttonClassName="text-xs" />}
      >
        {rows.map((entry) => (
          <ListItem key={entry.id} selected={entry.id === openId} onClick={() => select(entry.id)}>
            <span className="flex min-w-0 items-center gap-2">
              <span className="shrink-0 rounded-[5px] border border-border bg-surface-card px-1.5 font-mono text-[11px] text-muted-foreground">
                {versionLabel(entry.version)}
              </span>
              <span className="min-w-0 flex-1 truncate text-[13px] font-medium text-foreground">{entry.title || 'Untitled release'}</span>
            </span>
            <span className="flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground">
              <span className="truncate">
                {RELEASE_PRODUCT_LABEL[entry.product] || entry.product} · {formatShortDate(entry.release_date)}
              </span>
              {entry.is_featured ? (
                <Badge variant="info" className="ml-auto shrink-0">
                  Featured
                </Badge>
              ) : null}
            </span>
          </ListItem>
        ))}
        {rows.length === 0 ? <ListEmpty>{query || filter !== 'all' ? 'No releases match.' : 'No releases yet.'}</ListEmpty> : null}
      </ListPane>

      <ReleaseEditor
        key={formKey}
        release={editing}
        onDirtyChange={handleDirtyChange}
        onDelete={deleteRelease}
        onOpenList={() => setListOpen(true)}
      />
    </StudioFrame>
  )
}
