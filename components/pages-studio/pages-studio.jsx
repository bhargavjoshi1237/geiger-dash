'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { ArrowRight, Link2, Plus, WandSparkles } from 'lucide-react'
import {
  Button,
  DropdownMenuItem,
  DropdownMenuSeparator,
  Field,
  InlineTitleInput,
  Input,
  Logo,
  Progress,
  SearchInput,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  StatusPill,
  Textarea,
  cn,
} from '@geiger/ui'
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
  ListGroupLabel,
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
import { CoverImageField, MediaLibrary, toDateTimeLocal } from '@/components/content-studio/shared'
import { SITE_HOST, STUDIO_STATUS_MAP, countWords, publishStatus } from '@/components/content-studio/constants'
import { useStudioRecord } from '@/components/content-studio/use-studio-record'
import { SubmitButton } from '@/components/content-studio/submit-button'
import { TiptapBlogEditor } from '@/components/content-studio/tiptap-blog-editor'
import { PageGenerateDialog } from '@/components/pages-studio/page-generate-dialog'
import { saveSeoPageAction, deleteSeoPageAction } from '@/app/studio/pages/actions'
import { PAGE_PRODUCTS, resolveProductApp } from '@/lib/pages-studio/products'
import { PAGE_TYPE_HUB, PAGE_TYPE_LABEL, PAGE_TYPE_OPTIONS, PAGE_TYPE_PATH, buildSeoPagePath } from '@/lib/pages-studio/skills'
import { slugify } from '@/lib/docs/text'

const INSPECTOR_TABS = [
  { label: 'Settings', value: 'settings' },
  { label: 'SEO', value: 'seo' },
  { label: 'Media', value: 'media' },
]
const MEDIA_TYPES = [{ value: 'pages', label: 'Pages' }]
const META_TITLE_LIMIT = 60
const META_DESCRIPTION_LIMIT = 160

function toDraft(record) {
  return {
    pageType: record?.page_type || 'solution',
    product: record?.product || PAGE_PRODUCTS[0]?.value || '',
    title: record?.title || '',
    slug: record?.slug || '',
    excerpt: record?.excerpt || '',
    content: record?.content || '',
    heroHeading: record?.hero_heading || '',
    heroSubheading: record?.hero_subheading || '',
    heroCtaText: record?.hero_cta_text || '',
    metaTitle: record?.meta_title || '',
    metaDescription: record?.meta_description || '',
    keywords: Array.isArray(record?.keywords) ? record.keywords.join(', ') : '',
    coverImage: record?.cover_image || '',
    isPublished: Boolean(record?.is_published),
    isFeatured: Boolean(record?.is_featured),
    publishedAt: toDateTimeLocal(record?.published_at),
  }
}

// Length meter under a meta field: emerald within the limit, amber over it.
function LengthMeter({ count, limit }) {
  return (
    <Progress
      value={Math.min(100, Math.round((count / limit) * 100))}
      className={cn(
        'h-1 bg-surface-hover',
        count > limit ? '[&>[data-slot=progress-indicator]]:bg-amber-500' : '[&>[data-slot=progress-indicator]]:bg-emerald-500',
      )}
    />
  )
}

function PageEditor({ page, onDirtyChange, onDelete, onOpenList }) {
  const [initial] = useState(() => toDraft(page))
  const [fields, setFields] = useState(initial)
  const [coverPreview, setCoverPreview] = useState(initial.coverImage)
  const [tab, setTab] = useState('settings')
  const [inspectorOpen, setInspectorOpen] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [openedAt] = useState(Date.now)

  const markDirty = useCallback(() => setDirty(true), [])
  const set = (key) => (value) => {
    setFields((current) => ({ ...current, [key]: value }))
    setDirty(true)
  }
  const bind = (key) => ({ value: fields[key], onChange: (event) => set(key)(event.target.value) })
  // The editor mirrors its HTML on load too, so this must stay stable and not mark the page dirty.
  const setContent = useCallback((html) => setFields((current) => (current.content === html ? current : { ...current, content: html })), [])

  useEffect(() => {
    onDirtyChange(dirty)
  }, [dirty, onDirtyChange])
  useUnsavedGuard(dirty)

  const isNew = !page
  const status = publishStatus(page)
  const typeHub = PAGE_TYPE_HUB[fields.pageType] || PAGE_TYPE_HUB.solution
  const productApp = resolveProductApp(fields.product)
  const slugValue = fields.slug || slugify(fields.title)
  const publicPath = buildSeoPagePath(fields.pageType, fields.product, slugValue || '…')
  const future = fields.publishedAt && new Date(fields.publishedAt).getTime() > openedAt
  const snippetTitle = fields.metaTitle || fields.title || 'Page title'
  const snippetDescription = fields.metaDescription || fields.excerpt || 'Add a meta description to control the search snippet.'

  const validate = (event) => {
    const problem = !fields.title.trim() ? 'Give the page a title.' : !countWords(fields.content) ? 'Write some content first.' : ''
    if (!problem) return
    event.preventDefault()
    toast.error(problem)
  }

  const copyLink = async () => {
    await navigator.clipboard.writeText(`https://${SITE_HOST}${buildSeoPagePath(page.page_type, page.product, page.slug)}`)
    toast.success('Link copied')
  }

  return (
    <form
      action={saveSeoPageAction}
      onSubmit={validate}
      onInput={markDirty}
      onKeyDown={handleEditorKeys}
      noValidate
      className="flex min-h-0 min-w-0 flex-1"
    >
      <input type="hidden" name="id" value={page?.id || ''} />
      <input type="hidden" name="page_type" value={fields.pageType} />
      <input type="hidden" name="product" value={fields.product} />
      <input type="hidden" name="is_published" value={fields.isPublished ? 'on' : ''} />
      <input type="hidden" name="is_featured" value={fields.isFeatured ? 'on' : ''} />

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <EditorTopBar
          crumbs={['Pages', typeHub.label]}
          current={fields.title || 'Untitled page'}
          meta={
            <>
              {!isNew ? <StatusPill status={status} map={STUDIO_STATUS_MAP} /> : null}
              <SaveState dirty={dirty} isNew={isNew} savedAt={page?.updated_at} />
            </>
          }
          onOpenList={onOpenList}
          onOpenInspector={() => setInspectorOpen(true)}
          actions={
            <>
              <ViewLiveLink href={page?.is_published ? buildSeoPagePath(page.page_type, page.product, page.slug) : `/${PAGE_TYPE_PATH[fields.pageType] || 'solutions'}`} />
              <MoreMenu>
                <DropdownMenuItem onSelect={() => { setTab('seo'); setInspectorOpen(true) }} className="cursor-pointer">
                  Edit SEO
                </DropdownMenuItem>
                {!isNew ? (
                  <>
                    <DropdownMenuItem onSelect={copyLink} className="cursor-pointer gap-2">
                      <Link2 className="size-3.5" />
                      Copy link
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DangerMenuItem onSelect={() => onDelete(page)}>Delete page</DangerMenuItem>
                  </>
                ) : null}
              </MoreMenu>
              <TopBarDivider />
              {fields.isPublished ? (
                <SubmitButton intent="publish">{future ? 'Schedule' : page?.is_published ? 'Update' : 'Publish'}</SubmitButton>
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
          <DocumentEyebrow>{PAGE_TYPE_LABEL[fields.pageType] || 'SEO'} page</DocumentEyebrow>
          <DocumentTitle name="title" value={fields.title} onChange={set('title')} placeholder="Untitled page" aria-label="Title" />
          <SlugLine
            prefix={`${SITE_HOST}${buildSeoPagePath(fields.pageType, fields.product, '')}`}
            slug={fields.slug}
            onChange={set('slug')}
            name="slug"
            placeholder={slugify(fields.title) || 'auto-from-title'}
          />

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <Field label={<>Page type<Req /></>} className="gap-1.5">
              <Select value={fields.pageType} onValueChange={set('pageType')}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PAGE_TYPE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Product" hint="Used as the hero call-to-action" className="gap-1.5">
              <Select value={fields.product} onValueChange={set('product')}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select product" />
                </SelectTrigger>
                <SelectContent>
                  {PAGE_PRODUCTS.map((entry) => (
                    <SelectItem key={entry.value} value={entry.value}>
                      {entry.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>

          <Field label="Excerpt / summary" hint="Fallback description used in listings and social cards" className="mt-3 gap-1.5">
            <Textarea name="excerpt" rows={2} {...bind('excerpt')} placeholder="One or two sentences summarising the page" className="min-h-0" />
          </Field>

          <div className="relative mt-6 flex flex-col items-center gap-3.5 rounded-xl border border-border bg-surface-subtle bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] px-6 pb-10 pt-11 text-center sm:px-10">
            <span className="absolute left-3 top-3 rounded-md border border-border bg-background px-2 py-0.5 text-[11px] font-medium text-muted-foreground">Hero</span>
            <span className="absolute right-3 top-3 hidden text-[11px] text-text-secondary sm:inline">Click any line to edit</span>
            <DocumentTitle
              name="hero_heading"
              value={fields.heroHeading}
              onChange={set('heroHeading')}
              placeholder="Punchy headline above the content"
              aria-label="Hero heading"
              className="mt-0 max-w-[560px] border-b border-dashed border-border-strong pb-0.5 text-center [text-wrap:balance]"
            />
            <DocumentTitle
              name="hero_subheading"
              value={fields.heroSubheading}
              onChange={set('heroSubheading')}
              placeholder="Supporting sentence under the headline"
              aria-label="Hero subheading"
              className="mt-0 max-w-[500px] text-center text-[15px] font-normal leading-relaxed tracking-normal text-muted-foreground"
            />
            <div className="mt-1.5 inline-flex h-9 max-w-full items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground">
              <InlineTitleInput
                name="hero_cta_text"
                value={fields.heroCtaText}
                onChange={(event) => set('heroCtaText')(event.target.value)}
                placeholder={productApp ? `Start with Geiger ${productApp.name}` : 'Call to action'}
                aria-label="Call-to-action text"
                className="min-w-[4ch] text-center placeholder:text-primary-foreground/60"
              />
              <ArrowRight className="size-4 shrink-0" />
            </div>
            <span className="text-[11px] text-text-secondary">CTA links to {productApp ? `Geiger ${productApp.name}` : 'the selected product'}</span>
          </div>

          <TiptapBlogEditor name="content" defaultValue={initial.content} onChange={setContent} onEdit={markDirty} className="mt-5" />
        </DocumentCanvas>
      </div>

      <InspectorPane tabs={INSPECTOR_TABS} value={tab} onChange={setTab} open={inspectorOpen} onClose={() => setInspectorOpen(false)}>
        <InspectorPanel active={tab === 'settings'}>
          <InspectorSection title="Publishing">
            <SwitchRow title="Published" description={`Visible under /${typeHub.path} once saved`} checked={fields.isPublished} onCheckedChange={set('isPublished')} />
            <SwitchRow title="Featured" description="Highlighted on the hub page" checked={fields.isFeatured} onCheckedChange={set('isFeatured')} />
            <Field label="Publish date & time" hint={future ? 'Goes live at this time' : 'Defaults to now when published'} className="gap-1.5">
              <Input type="datetime-local" name="published_at" {...bind('publishedAt')} />
            </Field>
          </InspectorSection>
          <InspectorSection title="Cover image" aside="16:9 · social image">
            <CoverImageField existingUrl={initial.coverImage} onBrowse={() => setTab('media')} onPreviewChange={setCoverPreview} onEdit={markDirty} />
          </InspectorSection>
        </InspectorPanel>

        <InspectorPanel active={tab === 'seo'}>
          <InspectorSection title="Search preview">
            <div className="flex flex-col gap-1.5 rounded-[10px] border border-border bg-background p-3.5">
              <div className="flex items-center gap-2">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-surface-hover text-foreground">
                  <Logo size={11} />
                </span>
                <div className="flex min-w-0 flex-col leading-tight">
                  <span className="text-xs text-foreground">Geiger</span>
                  <span className="truncate text-[11px] text-muted-foreground">{[SITE_HOST, ...publicPath.split('/').filter(Boolean)].join(' › ')}</span>
                </div>
              </div>
              <span className="line-clamp-2 text-[15px] leading-snug text-sky-700 dark:text-sky-400">{snippetTitle}</span>
              <span className="line-clamp-3 text-xs leading-normal text-muted-foreground">{snippetDescription}</span>
            </div>
          </InspectorSection>
          <InspectorSection>
            <div className="flex flex-col gap-1.5">
              <CountedLabel label="Meta title" count={fields.metaTitle.length} limit={META_TITLE_LIMIT} />
              <Input name="meta_title" {...bind('metaTitle')} placeholder={fields.title || 'Defaults to the page title'} />
              <LengthMeter count={fields.metaTitle.length} limit={META_TITLE_LIMIT} />
            </div>
            <div className="flex flex-col gap-1.5">
              <CountedLabel label="Meta description" count={fields.metaDescription.length} limit={META_DESCRIPTION_LIMIT} />
              <Textarea name="meta_description" rows={4} {...bind('metaDescription')} placeholder="Search result snippet, 150–160 characters" className="min-h-0" />
              <LengthMeter count={fields.metaDescription.length} limit={META_DESCRIPTION_LIMIT} />
              <span className="text-xs text-muted-foreground">Defaults to the excerpt if left blank</span>
            </div>
            <Field label="Keywords" hint="Comma separated" className="gap-1.5">
              <Input name="keywords" defaultValue={initial.keywords} placeholder="client onboarding, agency crm" />
            </Field>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-muted-foreground">Social card</span>
                <span className="text-text-secondary">Uses the cover image</span>
              </div>
              <div className="overflow-hidden rounded-[10px] border border-border bg-background">
                <div className="aspect-[1.91/1] bg-[repeating-linear-gradient(45deg,rgb(128_128_128/0.08)_0_1px,transparent_1px_10px)] bg-surface-card">
                  {coverPreview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={coverPreview} alt="" className="h-full w-full object-cover" />
                  ) : null}
                </div>
                <div className="flex flex-col gap-0.5 px-3 py-2.5">
                  <span className="text-[11px] text-muted-foreground">{SITE_HOST}</span>
                  <span className="truncate text-[13px] font-medium text-foreground">{snippetTitle}</span>
                </div>
              </div>
            </div>
          </InspectorSection>
        </InspectorPanel>

        <InspectorPanel active={tab === 'media'} className="min-h-full">
          {tab === 'media' ? <MediaLibrary activeTab="pages" types={MEDIA_TYPES} /> : null}
        </InspectorPanel>
      </InspectorPane>
    </form>
  )
}

export function PagesStudio({ pages, selectedId, saved = false, error = '' }) {
  const router = useRouter()
  const { openId, open, formKey } = useStudioRecord({
    basePath: '/studio/pages',
    param: 'page',
    selectedId,
    saved,
    error,
    savedMessage: 'Page saved',
  })
  const [query, setQuery] = useState('')
  const [listOpen, setListOpen] = useState(false)
  const [generateOpen, setGenerateOpen] = useState(false)
  const [generatedPages, setGeneratedPages] = useState([])
  const dirtyRef = useRef(false)

  // Freshly generated drafts first so they open before the server list catches up.
  const pageList = useMemo(() => {
    const seen = new Set()
    return [...generatedPages, ...pages].filter((page) => {
      if (!page?.id || seen.has(page.id)) return false
      seen.add(page.id)
      return true
    })
  }, [generatedPages, pages])

  // The list is grouped by page type, in picker order.
  const groups = useMemo(() => {
    const q = query.toLowerCase().trim()
    const matches = (page) => !q || `${page.title} ${page.slug} ${page.page_type} ${page.product}`.toLowerCase().includes(q)
    return PAGE_TYPE_OPTIONS.map((option) => ({
      type: option.value,
      label: PAGE_TYPE_HUB[option.value]?.label || option.label,
      pages: pageList.filter((page) => (page.page_type || 'solution') === option.value && matches(page)),
    })).filter((group) => group.pages.length)
  }, [pageList, query])

  const editing = pageList.find((page) => page.id === openId)

  const handleDirtyChange = useCallback((dirty) => {
    dirtyRef.current = dirty
  }, [])

  const select = (id) => {
    if (id !== openId && dirtyRef.current && !window.confirm('Discard your unsaved changes?')) return
    dirtyRef.current = false
    open(id)
    setListOpen(false)
  }

  const handleGenerated = (record) => {
    if (record?.id) {
      setGeneratedPages((prev) => [record, ...prev.filter((page) => page.id !== record.id)])
      dirtyRef.current = false
      open(record.id)
    }
    router.refresh()
  }

  const deletePage = async (page) => {
    if (!window.confirm(`Delete “${page.title}”? This cannot be undone.`)) return
    const result = await deleteSeoPageAction(page.id)
    if (!result.ok) {
      toast.error(result.error || 'Unable to delete the page')
      return
    }
    setGeneratedPages((prev) => prev.filter((entry) => entry.id !== page.id))
    dirtyRef.current = false
    if (openId === page.id) open('')
    toast.success('Page deleted')
    router.refresh()
  }

  return (
    <StudioFrame>
      <PageGenerateDialog open={generateOpen} onOpenChange={setGenerateOpen} onGenerated={handleGenerated} />

      <ListPane
        title="Pages"
        count={pageList.length}
        open={listOpen}
        onClose={() => setListOpen(false)}
        actions={
          <>
            <Button type="button" variant="ghost" size="icon-sm" onClick={() => setGenerateOpen(true)} aria-label="New page with AI" title="New page with AI" className="text-muted-foreground">
              <WandSparkles className="size-4" />
            </Button>
            <Button type="button" size="sm" onClick={() => select('')}>
              <Plus className="size-4" />
              New
            </Button>
          </>
        }
        search={<SearchInput expanded value={query} onChange={setQuery} placeholder="Search pages…" />}
      >
        {groups.map((group) => (
          <div key={group.type} className="flex flex-col gap-0.5">
            <ListGroupLabel label={group.label} count={group.pages.length} />
            {group.pages.map((page) => (
              <ListItem key={page.id} selected={page.id === openId} onClick={() => select(page.id)} className="flex-row items-center gap-2.5 py-2">
                <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="truncate text-[13px] font-medium text-foreground">{page.title || 'Untitled page'}</span>
                  <span className="truncate font-mono text-[11px] text-muted-foreground">{buildSeoPagePath(page.page_type, page.product, page.slug)}</span>
                </span>
                <StatusPill status={publishStatus(page)} map={STUDIO_STATUS_MAP} className="shrink-0" />
              </ListItem>
            ))}
          </div>
        ))}
        {groups.length === 0 ? <ListEmpty>{query ? 'No pages match.' : 'No pages yet. Generate one with AI.'}</ListEmpty> : null}
      </ListPane>

      <PageEditor
        key={formKey}
        page={editing}
        onDirtyChange={handleDirtyChange}
        onDelete={deletePage}
        onOpenList={() => setListOpen(true)}
      />
    </StudioFrame>
  )
}
