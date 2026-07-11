'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'sonner'
import { ArrowUpRight, Calendar, FileText, LayoutGrid, Save, Sparkles, Wand2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  CollapsibleSection,
  CoverImageUpload,
  FormField,
  MediaLibrary,
  RecordList,
  inputClassName,
  textareaClassName,
  toDateTimeLocal,
} from '@/components/content-studio/shared'
import { TiptapBlogEditor } from '@/components/content-studio/tiptap-blog-editor'
import { LlmSettingsDialog } from '@/components/content-studio/llm-settings-dialog'
import { useLlmConfig } from '@/components/content-studio/llm-config'
import { PageGenerateDialog } from '@/components/pages-studio/page-generate-dialog'
import { saveSeoPageAction, deleteSeoPageAction } from '@/app/studio/pages/actions'
import { PAGE_PRODUCTS } from '@/lib/pages-studio/products'
import { PAGE_TYPE_OPTIONS, PAGE_TYPE_LABEL, PAGE_TYPE_PATH } from '@/lib/pages-studio/skills'

const MEDIA_TYPES = [{ value: 'pages', label: 'Pages' }]

const getPageDraft = (record) => {
  if (!record) {
    return {
      id: '',
      page_type: 'solution',
      product: PAGE_PRODUCTS[0]?.value || '',
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      hero_heading: '',
      hero_subheading: '',
      hero_cta_text: '',
      meta_title: '',
      meta_description: '',
      keywords: '',
      cover_image: '',
      image_bucket: 'pfp',
      image_path: '',
      image_url: '',
      is_published: false,
      is_featured: false,
      published_at: '',
    }
  }

  return {
    id: record.id || '',
    page_type: record.page_type || 'solution',
    product: record.product || '',
    title: record.title || '',
    slug: record.slug || '',
    excerpt: record.excerpt || '',
    content: record.content || '',
    hero_heading: record.hero_heading || '',
    hero_subheading: record.hero_subheading || '',
    hero_cta_text: record.hero_cta_text || '',
    meta_title: record.meta_title || '',
    meta_description: record.meta_description || '',
    keywords: Array.isArray(record.keywords) ? record.keywords.join(', ') : '',
    cover_image: record.cover_image || '',
    image_bucket: 'pfp',
    image_path: '',
    image_url: '',
    is_published: Boolean(record.is_published),
    is_featured: Boolean(record.is_featured),
    published_at: toDateTimeLocal(record.published_at),
  }
}

const SeoPageForm = ({ pageDraft, onReset, formKey }) => {
  const [pageType, setPageType] = useState(pageDraft.page_type || 'solution')
  const [product, setProduct] = useState(pageDraft.product || PAGE_PRODUCTS[0]?.value || '')
  const [isPublished, setIsPublished] = useState(pageDraft.is_published)
  const [isFeatured, setIsFeatured] = useState(pageDraft.is_featured)

  const publicPath = `/${PAGE_TYPE_PATH[pageType] || 'solutions'}/${pageDraft.slug || '…'}`

  return (
    <form key={formKey} action={saveSeoPageAction} className="min-w-0 max-w-full space-y-6 overflow-x-clip">
      <input type="hidden" name="id" defaultValue={pageDraft.id} />
      <input type="hidden" name="page_type" value={pageType} readOnly />
      <input type="hidden" name="product" value={product} readOnly />
      <input type="hidden" name="is_published" value={isPublished ? 'on' : ''} readOnly />
      <input type="hidden" name="is_featured" value={isFeatured ? 'on' : ''} readOnly />

      <CollapsibleSection value="page-details" icon={FileText} title="Page Details">
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Page Type" required>
              <Select value={pageType} onValueChange={setPageType}>
                <SelectTrigger className={`${inputClassName} w-full`}>
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
            </FormField>
            <FormField label="Product" hint="Linked as the page's call-to-action">
              <Select value={product} onValueChange={setProduct}>
                <SelectTrigger className={`${inputClassName} w-full`}>
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
            </FormField>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Title" required>
              <Input
                name="title"
                defaultValue={pageDraft.title}
                placeholder="Page title (H1)"
                className={inputClassName}
                required
              />
            </FormField>
            <FormField label="Slug" hint={`URL: ${publicPath}`}>
              <Input
                name="slug"
                defaultValue={pageDraft.slug}
                placeholder="page-url-slug"
                className={inputClassName}
              />
            </FormField>
          </div>

          <FormField label="Excerpt / summary" hint="Fallback description used in listings and social cards">
            <Textarea
              name="excerpt"
              rows={2}
              defaultValue={pageDraft.excerpt}
              placeholder="One or two sentences summarising the page"
              className={textareaClassName}
            />
          </FormField>
        </div>
      </CollapsibleSection>

      <CollapsibleSection value="hero" icon={Sparkles} title="Hero">
        <div className="space-y-4">
          <FormField label="Hero heading">
            <Input
              name="hero_heading"
              defaultValue={pageDraft.hero_heading}
              placeholder="Punchy headline shown above the content"
              className={inputClassName}
            />
          </FormField>
          <FormField label="Hero subheading">
            <Textarea
              name="hero_subheading"
              rows={2}
              defaultValue={pageDraft.hero_subheading}
              placeholder="Supporting sentence under the headline"
              className={textareaClassName}
            />
          </FormField>
          <FormField label="CTA button text" hint="Links to the selected product">
            <Input
              name="hero_cta_text"
              defaultValue={pageDraft.hero_cta_text}
              placeholder="Start with Geiger Flow"
              className={inputClassName}
            />
          </FormField>
        </div>
      </CollapsibleSection>

      <Card className="min-w-0 max-w-full overflow-hidden rounded-lg border-border bg-card/45 shadow-none">
        <CardHeader className="p-4">
          <CardTitle className="text-base">Content</CardTitle>
        </CardHeader>
        <CardContent className="min-w-0 max-w-full overflow-hidden p-4 pt-0">
          <TiptapBlogEditor name="content" defaultValue={pageDraft.content} />
        </CardContent>
      </Card>

      <CollapsibleSection value="seo" icon={FileText} title="SEO">
        <div className="space-y-4">
          <FormField label="Meta title" hint="Browser tab + search result title (~60 chars)">
            <Input
              name="meta_title"
              defaultValue={pageDraft.meta_title}
              placeholder="Defaults to the page title if blank"
              className={inputClassName}
            />
          </FormField>
          <FormField label="Meta description" hint="Search result snippet (150-160 chars)">
            <Textarea
              name="meta_description"
              rows={2}
              defaultValue={pageDraft.meta_description}
              placeholder="Defaults to the excerpt if blank"
              className={textareaClassName}
            />
          </FormField>
          <FormField label="Keywords" hint="Comma separated">
            <Input
              name="keywords"
              defaultValue={pageDraft.keywords}
              placeholder="crm for agencies, client workflow"
              className={inputClassName}
            />
          </FormField>
        </div>
      </CollapsibleSection>

      <CoverImageUpload draft={pageDraft} existingUrl={pageDraft.cover_image} />

      <Card className="rounded-lg border-border bg-card/45 shadow-none">
        <CardHeader className="p-4">
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Publishing
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 p-4 pt-0">
          <FormField label="Publish Date & Time">
            <Input
              type="datetime-local"
              name="published_at"
              defaultValue={pageDraft.published_at}
              className={inputClassName}
            />
          </FormField>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Switch
                id="page-published"
                checked={isPublished}
                onCheckedChange={setIsPublished}
                className="data-[state=checked]:bg-emerald-500 data-[state=unchecked]:bg-muted"
              />
              <Label htmlFor="page-published" className="cursor-pointer">Published</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="page-featured"
                checked={isFeatured}
                onCheckedChange={setIsFeatured}
                className="data-[state=checked]:bg-emerald-500 data-[state=unchecked]:bg-muted"
              />
              <Label htmlFor="page-featured" className="cursor-pointer">Featured</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="sticky bottom-3 z-20 flex items-center justify-between gap-4 rounded-lg border border-border bg-background/95 p-3 shadow-xl backdrop-blur">
        <p className="text-sm text-muted-foreground">
          {pageDraft.id ? 'Editing existing page' : 'Creating new page'}
        </p>
        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={onReset}>
            Reset
          </Button>
          <Button type="submit" className="gap-2">
            <Save className="h-4 w-4" />
            {pageDraft.id ? 'Update Page' : 'Create Page'}
          </Button>
        </div>
      </div>
    </form>
  )
}

export function PagesStudio({ pages, saved = false, error = '' }) {
  const router = useRouter()
  const hasShownRouteToast = useRef(false)
  const [llmOpen, setLlmOpen] = useState(false)
  const [generateOpen, setGenerateOpen] = useState(false)
  const { isConfigured } = useLlmConfig()
  const [editingPageId, setEditingPageId] = useState('')
  const [revision, setRevision] = useState(0)
  const [query, setQuery] = useState('')
  const [generatedPages, setGeneratedPages] = useState([])

  // Merge freshly generated drafts with the server list (de-duped by id) so a new
  // draft is selectable and editable immediately, before the RSC refetch lands.
  const pageList = useMemo(() => {
    const seen = new Set()
    const merged = []
    for (const page of [...generatedPages, ...pages]) {
      if (!page?.id || seen.has(page.id)) continue
      seen.add(page.id)
      merged.push(page)
    }
    return merged
  }, [generatedPages, pages])

  const editingPage = useMemo(
    () => pageList.find((page) => page.id === editingPageId),
    [editingPageId, pageList]
  )

  const filteredPages = useMemo(() => {
    const q = query.toLowerCase().trim()
    if (!q) return pageList
    return pageList.filter((page) =>
      `${page.title} ${page.slug} ${page.page_type} ${page.product}`.toLowerCase().includes(q)
    )
  }, [query, pageList])

  const pageDraft = getPageDraft(editingPage)
  const publishedCount = pageList.filter((page) => page.is_published).length

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

  useEffect(() => {
    if (hasShownRouteToast.current || (!saved && !error)) return
    hasShownRouteToast.current = true

    if (error) {
      toast.error('Could not save', { description: error })
    } else {
      toast.success('Page saved', { description: 'Public pages were revalidated.' })
    }

    router.replace('/studio/pages', { scroll: false })
  }, [error, router, saved])

  // Add the generated draft to the local list and open it for review.
  const handleGenerated = (record) => {
    if (record?.id) {
      setGeneratedPages((prev) => [record, ...prev.filter((page) => page.id !== record.id)])
      setEditingPageId(record.id)
      setRevision((value) => value + 1)
    }
    router.refresh()
  }

  const deletePage = async (page) => {
    const result = await deleteSeoPageAction(page.id)
    if (!result.ok) {
      toast.error(result.error || 'Unable to delete page')
      return
    }
    if (editingPageId === page.id) {
      setEditingPageId('')
      setRevision((value) => value + 1)
    }
    toast.success('Page deleted')
    router.refresh()
  }

  const livePath = editingPage
    ? `/${PAGE_TYPE_PATH[editingPage.page_type] || 'solutions'}`
    : '/solutions'

  return (
    <div className="fixed inset-0 flex min-h-0 min-w-0 flex-col overflow-hidden bg-background text-foreground">
      <LlmSettingsDialog open={llmOpen} onOpenChange={setLlmOpen} />
      <PageGenerateDialog open={generateOpen} onOpenChange={setGenerateOpen} onGenerated={handleGenerated} />

      <header className="flex h-14 items-center justify-between border-b border-border bg-background/95 px-3 backdrop-blur sm:px-4">
        <div className="flex min-w-0 items-center gap-3">
          <Link href="/" className="flex size-8 shrink-0 items-center justify-center rounded-md border border-border bg-card">
            <LayoutGrid className="size-4" />
            <span className="sr-only">Back to Geiger</span>
          </Link>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="truncate text-sm font-semibold">Geiger Pages Studio</h1>
              <Badge variant="outline" className="hidden font-mono text-[10px] sm:inline-flex">SEO</Badge>
            </div>
            <p className="hidden text-xs text-muted-foreground sm:block">
              {publishedCount} published pages
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Tabs value="pages" className="hidden sm:block">
            <TabsList>
              <TabsTrigger value="posts" asChild>
                <Link href="/studio/posts">Posts</Link>
              </TabsTrigger>
              <TabsTrigger value="pages" asChild>
                <Link href="/studio/pages">Pages</Link>
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Button asChild type="button" size="sm" variant="ghost" className="hidden sm:inline-flex">
            <Link href={livePath} target="_blank">
              View live
              <ArrowUpRight className="size-3.5" />
            </Link>
          </Button>
          <Button type="button" size="sm" variant="outline" onClick={() => setGenerateOpen(true)} className="gap-1.5">
            <Wand2 className="size-3.5" />
            <span className="hidden sm:inline">New with AI</span>
          </Button>
          <Button type="button" size="sm" variant="outline" onClick={() => setLlmOpen(true)}>
            <Sparkles className={isConfigured ? 'text-emerald-400' : ''} />
            <span className="hidden sm:inline">AI model</span>
            <span
              className={`size-1.5 rounded-full ${isConfigured ? 'bg-emerald-400' : 'bg-muted-foreground'}`}
              aria-label={isConfigured ? 'AI connected' : 'AI disconnected'}
            />
          </Button>
        </div>
      </header>

      <div className="grid min-h-0 min-w-0 flex-1 grid-cols-1 overflow-x-hidden lg:grid-cols-[280px_minmax(0,1fr)] xl:grid-cols-[280px_minmax(0,1fr)_330px]">
        <aside className="hidden min-h-0 min-w-0 overflow-x-hidden border-r border-border bg-card/25 lg:flex lg:flex-col">
          <div className="min-h-0 flex-1">
            <RecordList
              title="SEO pages"
              items={filteredPages}
              empty="No pages yet — generate one with AI"
              query={query}
              onQuery={setQuery}
              selectedId={editingPageId}
              type="pages"
              searchPlaceholder="Search pages..."
              onDelete={deletePage}
              onNew={() => {
                setEditingPageId('')
                setRevision((v) => v + 1)
              }}
              onSelect={(id) => {
                setEditingPageId(id)
                setRevision((v) => v + 1)
              }}
            />
          </div>
        </aside>

        <main className="min-h-0 min-w-0 overflow-x-hidden overflow-y-auto overscroll-contain bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]">
          <div className="mx-auto min-w-0 max-w-4xl px-3 py-4 sm:px-6 sm:py-6">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                  {editingPage ? PAGE_TYPE_LABEL[editingPage.page_type] || 'SEO page' : 'SEO page'}
                </p>
                <h2 className="mt-1 text-xl font-semibold tracking-tight">
                  {editingPage?.title || 'Untitled page'}
                </h2>
              </div>
            </div>

            <SeoPageForm
              pageDraft={pageDraft}
              formKey={`${editingPageId || 'new'}-${revision}`}
              onReset={() => {
                setEditingPageId('')
                setRevision((v) => v + 1)
              }}
            />
          </div>
        </main>

        <aside className="hidden min-h-0 min-w-0 overflow-x-hidden border-l border-border bg-card/25 xl:flex xl:flex-col">
          <div className="min-h-0 flex-1">
            <MediaLibrary activeTab="pages" types={MEDIA_TYPES} />
          </div>
        </aside>
      </div>
    </div>
  )
}
