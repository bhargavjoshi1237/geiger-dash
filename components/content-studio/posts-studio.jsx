'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Download, Link2, Plus, Star } from 'lucide-react'
import {
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
  StatusPill,
  Switch,
  Textarea,
  cn,
} from '@geiger/ui'
import { deleteBlogPostAction, saveBlogPostAction } from '@/app/studio/posts/actions'
import {
  CountedLabel,
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
  SlugLine,
  StudioFrame,
  SwitchRow,
  TopBarDivider,
  ViewLiveLink,
  handleEditorKeys,
  useUnsavedGuard,
} from '@/components/content-studio/editor-kit'
import { CoverImageField, MediaLibrary, readingMinutesFromHtml, toDateTimeLocal } from '@/components/content-studio/shared'
import {
  PUBLISH_FILTERS,
  SITE_HOST,
  STUDIO_STATUS_MAP,
  countWords,
  formatDateTime,
  formatRelative,
  formatShortDate,
  publishStatus,
} from '@/components/content-studio/constants'
import { useStudioRecord } from '@/components/content-studio/use-studio-record'
import { SubmitButton } from '@/components/content-studio/submit-button'
import { TiptapBlogEditor } from '@/components/content-studio/tiptap-blog-editor'
import { AddCategoryDialog } from '@/components/content-studio/add-category-dialog'
import { BlogImportDialog } from '@/components/content-studio/blog-import-dialog'
import { slugify } from '@/lib/docs/text'

const INSPECTOR_TABS = [
  { label: 'Settings', value: 'settings' },
  { label: 'Media', value: 'media' },
]

function toDraft(record) {
  return {
    title: record?.title || '',
    slug: record?.slug || '',
    excerpt: record?.excerpt || '',
    content: record?.content || '',
    category: record?.category || '',
    tags: Array.isArray(record?.tags) ? record.tags.join(', ') : '',
    featuredImage: record?.featured_image || '',
    isPublished: Boolean(record?.is_published),
    isFeatured: Boolean(record?.is_featured),
    publishedAt: toDateTimeLocal(record?.published_at),
    readingMinutes: record?.reading_time_minutes || 5,
  }
}

// List subtitle: live posts show their date, scheduled the slot, drafts when they were last touched.
function whenLabel(post, status) {
  if (status === 'live') return formatShortDate(post.published_at)
  if (status === 'scheduled') return formatDateTime(post.published_at)
  return `Edited ${formatRelative(post.updated_at)}`
}

function PostEditor({ post, categories, onCategoryCreated, onDirtyChange, onDelete, onOpenList }) {
  const [initial] = useState(() => toDraft(post))
  const [title, setTitle] = useState(initial.title)
  const [slug, setSlug] = useState(initial.slug)
  const [excerpt, setExcerpt] = useState(initial.excerpt)
  const [category, setCategory] = useState(initial.category)
  const [content, setContent] = useState(initial.content)
  const [isPublished, setIsPublished] = useState(initial.isPublished)
  const [isFeatured, setIsFeatured] = useState(initial.isFeatured)
  const [publishedAt, setPublishedAt] = useState(initial.publishedAt)
  const [autoReading, setAutoReading] = useState(true)
  const [manualMinutes, setManualMinutes] = useState(initial.readingMinutes)
  const [tab, setTab] = useState('settings')
  const [inspectorOpen, setInspectorOpen] = useState(false)
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [openedAt] = useState(Date.now)

  const markDirty = useCallback(() => setDirty(true), [])
  const edit = (setter) => (value) => {
    setter(value)
    setDirty(true)
  }

  useEffect(() => {
    onDirtyChange(dirty)
  }, [dirty, onDirtyChange])
  useUnsavedGuard(dirty)

  const isNew = !post
  const status = publishStatus(post)
  const reading = autoReading ? readingMinutesFromHtml(content) : manualMinutes
  const future = publishedAt && new Date(publishedAt).getTime() > openedAt
  const publishLabel = future ? 'Schedule' : post?.is_published ? 'Update' : 'Publish'

  const validate = (event) => {
    let problem = ''
    if (!title.trim()) problem = 'Give the post a title.'
    else if (!excerpt.trim()) problem = 'Add an excerpt.'
    else if (!category) problem = 'Pick a category.'
    else if (!countWords(content)) problem = 'Write some content first.'
    if (!problem) return
    event.preventDefault()
    toast.error(problem)
    if (!category) {
      setTab('settings')
      setInspectorOpen(true)
    }
  }

  const copyLink = async () => {
    await navigator.clipboard.writeText(`https://${SITE_HOST}/blog/${post.slug}`)
    toast.success('Link copied')
  }

  return (
    <>
      <AddCategoryDialog
        open={categoryDialogOpen}
        onOpenChange={setCategoryDialogOpen}
        onCreated={(created) => {
          onCategoryCreated(created)
          if (created?.name) edit(setCategory)(created.name)
        }}
      />
      <form
        action={saveBlogPostAction}
        onSubmit={validate}
        onInput={markDirty}
        onKeyDown={handleEditorKeys}
        noValidate
        className="flex min-h-0 min-w-0 flex-1"
      >
        <input type="hidden" name="id" value={post?.id || ''} />
        <input type="hidden" name="category" value={category} />
        <input type="hidden" name="is_published" value={isPublished ? 'on' : ''} />
        <input type="hidden" name="is_featured" value={isFeatured ? 'on' : ''} />
        <input type="hidden" name="reading_time_auto" value={autoReading ? 'on' : ''} />

        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <EditorTopBar
            crumbs={['Posts']}
            current={title || 'Untitled post'}
            meta={
              <>
                {!isNew ? <StatusPill status={status} map={STUDIO_STATUS_MAP} /> : null}
                <SaveState dirty={dirty} isNew={isNew} savedAt={post?.updated_at} />
              </>
            }
            onOpenList={onOpenList}
            onOpenInspector={() => setInspectorOpen(true)}
            actions={
              <>
                <ViewLiveLink href={post?.is_published ? `/blog/${post.slug}` : '/blog'} />
                <MoreMenu>
                  <DropdownMenuItem onSelect={() => { setTab('media'); setInspectorOpen(true) }} className="cursor-pointer">
                    Open media library
                  </DropdownMenuItem>
                  {!isNew ? (
                    <>
                      <DropdownMenuItem onSelect={copyLink} className="cursor-pointer gap-2">
                        <Link2 className="size-3.5" />
                        Copy link
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DangerMenuItem onSelect={() => onDelete(post)}>Delete post</DangerMenuItem>
                    </>
                  ) : null}
                </MoreMenu>
                <TopBarDivider />
                {isPublished ? (
                  <SubmitButton intent="publish">{publishLabel}</SubmitButton>
                ) : (
                  <>
                    <SubmitButton intent="draft" variant="outline">
                      Save draft
                    </SubmitButton>
                    <SubmitButton intent="publish">{future ? 'Schedule' : 'Publish'}</SubmitButton>
                  </>
                )}
              </>
            }
          />

          <DocumentCanvas>
            <DocumentEyebrow>Blog post{category ? ` · ${category}` : ''}</DocumentEyebrow>
            <DocumentTitle
              name="title"
              value={title}
              onChange={setTitle}
              placeholder="Untitled post"
              aria-label="Title"
              className="text-[34px] leading-[1.15]"
            />
            <SlugLine prefix={`${SITE_HOST}/blog/`} slug={slug} onChange={edit(setSlug)} name="slug" placeholder={slugify(title) || 'auto-from-title'} />

            <div className="mt-6 flex flex-col gap-1.5">
              <CountedLabel label="Excerpt" required count={excerpt.length} />
              <Textarea
                name="excerpt"
                rows={2}
                value={excerpt}
                onChange={(event) => setExcerpt(event.target.value)}
                placeholder="One or two sentences shown on /blog and in social cards"
                className="min-h-0"
              />
            </div>

            <TiptapBlogEditor
              name="content"
              defaultValue={initial.content}
              onChange={setContent}
              onEdit={markDirty}
              readingTime
              className="mt-5"
            />
          </DocumentCanvas>
        </div>

        <InspectorPane tabs={INSPECTOR_TABS} value={tab} onChange={setTab} open={inspectorOpen} onClose={() => setInspectorOpen(false)}>
          <InspectorPanel active={tab === 'settings'}>
            <InspectorSection title="Publishing">
              <SwitchRow title="Published" description="Visible on /blog once saved" checked={isPublished} onCheckedChange={edit(setIsPublished)} />
              <SwitchRow title="Featured" description="Highlighted on the blog index" checked={isFeatured} onCheckedChange={edit(setIsFeatured)} />
              <Field label="Publish date & time" hint={future ? 'Goes live at this time' : 'Defaults to now when published'} className="gap-1.5">
                <Input type="datetime-local" name="published_at" value={publishedAt} onChange={(event) => setPublishedAt(event.target.value)} />
              </Field>
            </InspectorSection>

            <InspectorSection title="Organisation">
              <Field label={<>Category<Req /></>} className="gap-1.5">
                <div className="flex gap-1.5">
                  <Select value={category} onValueChange={edit(setCategory)}>
                    <SelectTrigger className="w-full min-w-0 flex-1">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((entry) => (
                        <SelectItem key={entry.id || entry.name} value={entry.name}>
                          {entry.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button type="button" variant="outline" size="icon" aria-label="Add category" onClick={() => setCategoryDialogOpen(true)} className="shrink-0">
                    <Plus className="size-4" />
                  </Button>
                </div>
              </Field>
              <Field label="Tags" hint="Comma separated" className="gap-1.5">
                <Input name="tags" defaultValue={initial.tags} placeholder="design, product, focus" />
              </Field>
              <Field label="Reading time" className="gap-1.5">
                <div className="flex items-center gap-2.5">
                  <Input
                    type="number"
                    min={1}
                    name="reading_time_minutes"
                    value={reading}
                    readOnly={autoReading}
                    onChange={(event) => setManualMinutes(Math.max(1, Number(event.target.value) || 1))}
                    aria-label="Reading time in minutes"
                    className={cn('w-24', autoReading && 'opacity-60')}
                  />
                  <span className="text-[13px] text-muted-foreground">min</span>
                  <label className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
                    Auto
                    <Switch checked={autoReading} onCheckedChange={edit(setAutoReading)} />
                  </label>
                </div>
              </Field>
            </InspectorSection>

            <InspectorSection title="Cover image" aside="16:9 · used as OG image">
              <CoverImageField existingUrl={initial.featuredImage} onBrowse={() => setTab('media')} onEdit={markDirty} />
            </InspectorSection>
          </InspectorPanel>

          <InspectorPanel active={tab === 'media'} className="min-h-full">
            {tab === 'media' ? <MediaLibrary activeTab="blog" /> : null}
          </InspectorPanel>
        </InspectorPane>
      </form>
    </>
  )
}

export function PostsStudio({ categories, posts, selectedId, saved = false, error = '' }) {
  const router = useRouter()
  const { openId, open, formKey } = useStudioRecord({
    basePath: '/studio/posts',
    param: 'post',
    selectedId,
    saved,
    error,
    savedMessage: 'Post saved',
  })
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const [listOpen, setListOpen] = useState(false)
  const [importOpen, setImportOpen] = useState(false)
  const [addedCategories, setAddedCategories] = useState([])
  const [importedPosts, setImportedPosts] = useState([])
  const dirtyRef = useRef(false)

  // Server categories plus any added this session, de-duped by name, so a new one is selectable at once.
  const categoryList = useMemo(() => {
    const seen = new Set()
    return [...categories, ...addedCategories].filter((entry) => {
      const key = String(entry?.name || '').toLowerCase()
      if (!key || seen.has(key)) return false
      seen.add(key)
      return true
    })
  }, [categories, addedCategories])

  // Just-imported posts first so they're editable before the server list catches up.
  const postList = useMemo(() => {
    const seen = new Set()
    return [...importedPosts, ...posts].filter((post) => {
      if (!post?.id || seen.has(post.id)) return false
      seen.add(post.id)
      return true
    })
  }, [importedPosts, posts])

  const rows = useMemo(() => {
    const q = query.toLowerCase().trim()
    return postList
      .map((post) => ({ post, status: publishStatus(post) }))
      .filter(({ post, status }) => (filter === 'all' || status === filter) && (!q || `${post.title} ${post.slug} ${post.category}`.toLowerCase().includes(q)))
  }, [postList, query, filter])

  const editing = postList.find((post) => post.id === openId)

  const handleDirtyChange = useCallback((dirty) => {
    dirtyRef.current = dirty
  }, [])

  const select = (id) => {
    if (id !== openId && dirtyRef.current && !window.confirm('Discard your unsaved changes?')) return
    dirtyRef.current = false
    open(id)
    setListOpen(false)
  }

  const handleImported = (record) => {
    if (record?.id) {
      setImportedPosts((prev) => [record, ...prev.filter((post) => post.id !== record.id)])
      dirtyRef.current = false
      open(record.id)
    }
    router.refresh()
  }

  const deletePost = async (post) => {
    if (!window.confirm(`Delete “${post.title}”? This cannot be undone.`)) return
    const result = await deleteBlogPostAction(post.id)
    if (!result.ok) {
      toast.error(result.error || 'Unable to delete the post')
      return
    }
    setImportedPosts((prev) => prev.filter((entry) => entry.id !== post.id))
    dirtyRef.current = false
    if (openId === post.id) open('')
    toast.success('Post deleted')
    router.refresh()
  }

  return (
    <StudioFrame>
      <BlogImportDialog open={importOpen} onOpenChange={setImportOpen} categories={categoryList} onPublished={handleImported} />

      <ListPane
        title="Posts"
        count={postList.length}
        open={listOpen}
        onClose={() => setListOpen(false)}
        actions={
          <>
            <Button type="button" variant="ghost" size="icon-sm" onClick={() => setImportOpen(true)} aria-label="Import a post" title="Import a post" className="text-muted-foreground">
              <Download className="size-4" />
            </Button>
            <Button type="button" size="sm" onClick={() => select('')}>
              <Plus className="size-4" />
              New
            </Button>
          </>
        }
        search={<SearchInput expanded value={query} onChange={setQuery} placeholder="Search posts…" />}
        filters={<SegmentedTabs fullWidth tabs={PUBLISH_FILTERS} value={filter} onChange={setFilter} buttonClassName="px-2 text-xs" />}
      >
        {rows.map(({ post, status }) => (
          <ListItem key={post.id} selected={post.id === openId} onClick={() => select(post.id)}>
            <span className="flex min-w-0 items-center gap-2">
              <span className="min-w-0 flex-1 truncate text-[13px] font-medium text-foreground">{post.title || 'Untitled post'}</span>
              {post.is_featured ? <Star aria-label="Featured" className="size-3.5 shrink-0 fill-current text-amber-500 dark:text-amber-400" /> : null}
            </span>
            <span className="flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground">
              <StatusPill status={status} map={STUDIO_STATUS_MAP} />
              <span suppressHydrationWarning className="truncate">
                {[post.category, whenLabel(post, status)].filter(Boolean).join(' · ')}
              </span>
            </span>
          </ListItem>
        ))}
        {rows.length === 0 ? <ListEmpty>{query || filter !== 'all' ? 'No posts match.' : 'No posts yet. Write one or import an article.'}</ListEmpty> : null}
      </ListPane>

      <PostEditor
        key={formKey}
        post={editing}
        categories={categoryList}
        onCategoryCreated={(category) => category?.name && setAddedCategories((prev) => [...prev, category])}
        onDirtyChange={handleDirtyChange}
        onDelete={deletePost}
        onOpenList={() => setListOpen(true)}
      />
    </StudioFrame>
  )
}
