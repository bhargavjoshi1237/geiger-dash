'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'sonner'
import {
  ArrowUpRight,
  Calendar,
  Download,
  FileText,
  GitCommit,
  LayoutGrid,
  Megaphone,
  Plus,
  Save,
  Sparkles,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  createStudioMediaFolderAction,
  deleteBlogPostAction,
  deleteChangelogAction,
  listStudioMediaAction,
  saveBlogPostAction,
  saveChangelogAction,
  uploadStudioMediaAction,
} from '@/app/studio/posts/actions'
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
  readingMinutesFromHtml,
  textareaClassName,
  toDateInput,
  toDateTimeLocal,
} from '@/components/content-studio/shared'
import { TiptapBlogEditor } from '@/components/content-studio/tiptap-blog-editor'
import { LlmSettingsDialog } from '@/components/content-studio/llm-settings-dialog'
import { CommitChangelogDialog } from '@/components/content-studio/commit-changelog-dialog'
import { AddCategoryDialog } from '@/components/content-studio/add-category-dialog'
import { BlogImportDialog } from '@/components/content-studio/blog-import-dialog'
import { useLlmConfig } from '@/components/content-studio/llm-config'

const releaseProducts = [
  { value: 'geiger-assets', label: 'Geiger Assets' },
  { value: 'geiger-campaign', label: 'Geiger Campaign' },
  { value: 'geiger-canvas', label: 'Geiger Canvas' },
  { value: 'geiger-chat', label: 'Geiger Chat' },
  { value: 'geiger-content', label: 'Geiger Content' },
  { value: 'geiger-dash', label: 'Geiger Dash' },
  { value: 'geiger-docs', label: 'Geiger Docs' },
  { value: 'geiger-events', label: 'Geiger Events' },
  { value: 'geiger-flow', label: 'Geiger Flow' },
  { value: 'geiger-forms', label: 'Geiger Forms' },
  { value: 'geiger-grey', label: 'Geiger Grey' },
  { value: 'geiger-notes', label: 'Geiger Notes' },
  { value: 'geiger-office', label: 'Geiger Office' },
]


// Join a changelog's items of one type into newline-separated text for the form.
const splitByType = (items, type) => {
  return (items || [])
    .filter((item) => item.type === type)
    .map((item) => item.description)
    .join('\n')
}

// Data transformation functions
const getBlogDraft = (record) => {
  if (!record) {
    return {
      id: '',
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      category: '',
      tags: '',
      featured_image: '',
      image_bucket: 'pfp',
      image_path: '',
      image_url: '',
      is_published: false,
      is_featured: false,
      published_at: '',
      reading_time_minutes: 5,
    }
  }

  return {
    id: record.id || '',
    title: record.title || '',
    slug: record.slug || '',
    excerpt: record.excerpt || '',
    content: record.content || '',
    category: record.category || '',
    tags: Array.isArray(record.tags) ? record.tags.join(', ') : '',
    featured_image: record.featured_image || '',
    image_bucket: 'pfp',
    image_path: '',
    image_url: '',
    is_published: Boolean(record.is_published),
    is_featured: Boolean(record.is_featured),
    published_at: toDateTimeLocal(record.published_at),
    reading_time_minutes: record.reading_time_minutes || 5,
  }
}

const getChangelogDraft = (record) => {
  if (!record) {
    return {
      id: '',
      version: '',
      title: '',
      description: '',
      category: 'feature',
      product: 'geiger-dash',
      release_date: toDateInput(new Date().toISOString()),
      is_featured: false,
      image_url: '',
      image_bucket: 'pfp',
      image_path: '',
      items_added: '',
      items_changed: '',
      items_fixed: '',
      items_removed: '',
      items_deprecated: '',
    }
  }

  return {
    id: record.id || '',
    version: record.version || '',
    title: record.title || '',
    description: record.description || '',
    category: record.category || 'feature',
    product: record.product || 'geiger-dash',
    release_date: toDateInput(record.release_date),
    is_featured: Boolean(record.is_featured),
    image_url: record.image_url || '',
    image_bucket: 'pfp',
    image_path: '',
    items_added: splitByType(record.items, 'added'),
    items_changed: splitByType(record.items, 'changed'),
    items_fixed: splitByType(record.items, 'fixed'),
    items_removed: splitByType(record.items, 'removed'),
    items_deprecated: splitByType(record.items, 'deprecated'),
  }
}

// BlogForm Component
const BlogForm = ({ blogDraft, categories, onReset, onCategoryCreated, formKey }) => {
  const [category, setCategory] = useState(blogDraft.category || '')
  const [isPublished, setIsPublished] = useState(blogDraft.is_published)
  const [isFeatured, setIsFeatured] = useState(blogDraft.is_featured)
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false)
  const [content, setContent] = useState(blogDraft.content || '')
  const [autoReadingTime, setAutoReadingTime] = useState(true)
  const [manualMinutes, setManualMinutes] = useState(blogDraft.reading_time_minutes || 5)

  const autoMinutes = useMemo(() => readingMinutesFromHtml(content), [content])
  const readingValue = autoReadingTime ? autoMinutes : manualMinutes

  return (
    <form key={formKey} action={saveBlogPostAction} className="min-w-0 max-w-full space-y-6 overflow-x-clip">
      <input type="hidden" name="id" defaultValue={blogDraft.id} />
      <input type="hidden" name="category" value={category} readOnly />
      <input type="hidden" name="is_published" value={isPublished ? 'on' : ''} readOnly />
      <input type="hidden" name="is_featured" value={isFeatured ? 'on' : ''} readOnly />
      <input type="hidden" name="reading_time_auto" value={autoReadingTime ? 'on' : ''} readOnly />

      <CollapsibleSection value="post-details" icon={FileText} title="Post Details">
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Title" required>
              <Input 
                name="title" 
                defaultValue={blogDraft.title} 
                placeholder="Enter post title"
                className={inputClassName}
                required
              />
            </FormField>
            <FormField label="Slug" hint="Auto-generated if left blank">
              <Input 
                name="slug" 
                defaultValue={blogDraft.slug} 
                placeholder="post-url-slug"
                className={inputClassName}
              />
            </FormField>
          </div>

          <FormField label="Excerpt" required>
            <Textarea 
              name="excerpt" 
              rows={3} 
              defaultValue={blogDraft.excerpt}
              placeholder="Brief description of the post"
              className={textareaClassName}
              required
            />
          </FormField>

          <div className="grid gap-4 md:grid-cols-3">
            <FormField label="Category" required>
              <div className="flex items-center gap-2">
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className={`${inputClassName} flex-1`}>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id || cat.name} value={cat.name}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="shrink-0"
                  onClick={() => setCategoryDialogOpen(true)}
                  aria-label="Add category"
                  title="Add category"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </FormField>
            <FormField label="Tags" hint="Comma separated">
              <Input
                name="tags"
                defaultValue={blogDraft.tags}
                placeholder="tag1, tag2, tag3"
                className={inputClassName}
              />
            </FormField>
            <FormField label="Reading Time (min)" hint={autoReadingTime ? 'Auto from content length' : 'Manual override'}>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min={1}
                  name="reading_time_minutes"
                  value={readingValue}
                  readOnly={autoReadingTime}
                  onChange={(e) => setManualMinutes(Math.max(1, Number(e.target.value) || 1))}
                  className={`${inputClassName} flex-1 ${autoReadingTime ? 'opacity-70' : ''}`}
                />
                <label className="flex shrink-0 items-center gap-1.5 text-xs text-muted-foreground">
                  <Switch
                    checked={autoReadingTime}
                    onCheckedChange={setAutoReadingTime}
                    className="data-[state=checked]:bg-emerald-500 data-[state=unchecked]:bg-muted"
                  />
                  Auto
                </label>
              </div>
            </FormField>
          </div>
        </div>
      </CollapsibleSection>

      <AddCategoryDialog
        open={categoryDialogOpen}
        onOpenChange={setCategoryDialogOpen}
        onCreated={(cat) => {
          onCategoryCreated?.(cat)
          if (cat?.name) setCategory(cat.name)
        }}
      />

      <Card className="min-w-0 max-w-full overflow-hidden rounded-lg border-border bg-card/45 shadow-none">
        <CardHeader className="p-4">
          <CardTitle className="text-base">Content</CardTitle>
        </CardHeader>
        <CardContent className="min-w-0 max-w-full overflow-hidden p-4 pt-0">
          <TiptapBlogEditor name="content" defaultValue={blogDraft.content} onChange={setContent} />
        </CardContent>
      </Card>

      <CoverImageUpload draft={blogDraft} existingUrl={blogDraft.featured_image} />

      <Card className="rounded-lg border-border bg-card/45 shadow-none">
        <CardHeader className="p-4">
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Publishing Options
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 p-4 pt-0">
          <FormField label="Publish Date & Time">
            <Input 
              type="datetime-local" 
              name="published_at" 
              defaultValue={blogDraft.published_at}
              className={inputClassName}
            />
          </FormField>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Switch 
                id="is-published"
                checked={isPublished} 
                onCheckedChange={setIsPublished} 
                className="data-[state=checked]:bg-emerald-500 data-[state=unchecked]:bg-muted"
              />
              <Label htmlFor="is-published" className="cursor-pointer">Published</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch 
                id="is-featured"
                checked={isFeatured} 
                onCheckedChange={setIsFeatured} 
                className="data-[state=checked]:bg-emerald-500 data-[state=unchecked]:bg-muted"
              />
              <Label htmlFor="is-featured" className="cursor-pointer">Featured</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="sticky bottom-3 z-20 flex items-center justify-between gap-4 rounded-lg border border-border bg-background/95 p-3 shadow-xl backdrop-blur">
        <p className="text-sm text-muted-foreground">
          {blogDraft.id ? 'Editing existing post' : 'Creating new post'}
        </p>
        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={onReset}>
            Reset
          </Button>
          <Button type="submit" className="gap-2">
            <Save className="h-4 w-4" />
            {blogDraft.id ? 'Update Post' : 'Create Post'}
          </Button>
        </div>
      </div>
    </form>
  )
}

// ChangelogForm Component
const ChangelogForm = ({ changelogDraft, onReset, formKey }) => {
  const [fields, setFields] = useState(changelogDraft)
  const [commitOpen, setCommitOpen] = useState(false)

  const setField = (key) => (event) => {
    const value = event?.target ? event.target.value : event
    setFields((prev) => ({ ...prev, [key]: value }))
  }

  // Merge an AI / commit-generated draft into the form, keeping anything the
  // generator left blank.
  const applyGenerated = (partial) => {
    setFields((prev) => {
      const next = { ...prev }
      Object.entries(partial).forEach(([key, value]) => {
        if (value !== undefined && value !== null && String(value).length > 0) {
          next[key] = value
        }
      })
      return next
    })
  }

  return (
    <form key={formKey} action={saveChangelogAction} className="min-w-0 max-w-full space-y-6 overflow-x-clip">
      <input type="hidden" name="id" defaultValue={fields.id} />
      <input type="hidden" name="category" value={fields.category} readOnly />
      <input type="hidden" name="product" value={fields.product} readOnly />
      <input type="hidden" name="is_featured" value={fields.is_featured ? 'on' : ''} readOnly />

      <Card className="rounded-lg border-border bg-card/45 shadow-none">
        <CardHeader className="p-4">
          <div className="flex items-center justify-between gap-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Megaphone className="h-4 w-4" />
              Release Information
            </CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setCommitOpen(true)}
              className="gap-1.5"
            >
              <GitCommit className="h-4 w-4" />
              From commits
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 p-4 pt-0">
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Version" required>
              <Input
                name="version"
                value={fields.version}
                onChange={setField('version')}
                placeholder="1.0.0"
                className={inputClassName}
                required
              />
            </FormField>
            <FormField label="Release Date">
              <Input
                type="date"
                name="release_date"
                value={fields.release_date}
                onChange={setField('release_date')}
                className={inputClassName}
              />
            </FormField>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Category">
              <Select value={fields.category} onValueChange={setField('category')}>
                <SelectTrigger className={`${inputClassName} w-full`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="feature">Feature</SelectItem>
                  <SelectItem value="improvement">Improvement</SelectItem>
                  <SelectItem value="bugfix">Bug Fix</SelectItem>
                  <SelectItem value="breaking">Breaking Change</SelectItem>
                </SelectContent>
              </Select>
            </FormField>

            <FormField label="Product">
              <Select value={fields.product} onValueChange={setField('product')}>
                <SelectTrigger className={`${inputClassName} w-full`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {releaseProducts.map((product) => (
                    <SelectItem key={product.value} value={product.value}>
                      {product.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
          </div>

          <FormField label="Title" required>
            <Input
              name="title"
              value={fields.title}
              onChange={setField('title')}
              placeholder="Release title"
              className={inputClassName}
              required
            />
          </FormField>

          <FormField label="Description" required>
            <Textarea
              name="description"
              rows={3}
              value={fields.description}
              onChange={setField('description')}
              placeholder="Brief summary of this release"
              className={textareaClassName}
              required
            />
          </FormField>
        </CardContent>
      </Card>

      <Card className="rounded-lg border-border bg-card/45 shadow-none">
        <CardHeader className="p-4">
          <CardTitle className="text-base">Release Items</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 p-4 pt-0">
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Added" hint="One item per line">
              <Textarea
                name="items_added"
                rows={4}
                value={fields.items_added}
                onChange={setField('items_added')}
                placeholder="New features..."
                className={textareaClassName}
              />
            </FormField>
            <FormField label="Changed" hint="One item per line">
              <Textarea
                name="items_changed"
                rows={4}
                value={fields.items_changed}
                onChange={setField('items_changed')}
                placeholder="Changes..."
                className={textareaClassName}
              />
            </FormField>
            <FormField label="Fixed" hint="One item per line">
              <Textarea
                name="items_fixed"
                rows={4}
                value={fields.items_fixed}
                onChange={setField('items_fixed')}
                placeholder="Bug fixes..."
                className={textareaClassName}
              />
            </FormField>
            <div className="space-y-4">
              <FormField label="Removed" hint="One item per line">
                <Textarea
                  name="items_removed"
                  rows={2}
                  value={fields.items_removed}
                  onChange={setField('items_removed')}
                  placeholder="Removed items..."
                  className={textareaClassName}
                />
              </FormField>
              <FormField label="Deprecated" hint="One item per line">
                <Textarea
                  name="items_deprecated"
                  rows={2}
                  value={fields.items_deprecated}
                  onChange={setField('items_deprecated')}
                  placeholder="Deprecated items..."
                  className={textareaClassName}
                />
              </FormField>
            </div>
          </div>
        </CardContent>
      </Card>

      <CommitChangelogDialog
        open={commitOpen}
        onOpenChange={setCommitOpen}
        product={fields.product}
        onApply={applyGenerated}
      />

      <CoverImageUpload draft={changelogDraft} existingUrl={changelogDraft.image_url} />

      <div className="sticky bottom-3 z-20 flex items-center justify-between gap-4 rounded-lg border border-border bg-background/95 p-3 shadow-xl backdrop-blur">
        <div className="flex items-center gap-2">
          <Switch
            id="changelog-featured"
            checked={fields.is_featured}
            onCheckedChange={setField('is_featured')}
            className="data-[state=checked]:bg-emerald-500 data-[state=unchecked]:bg-muted"
          />
          <Label htmlFor="changelog-featured" className="cursor-pointer">Featured Release</Label>
        </div>
        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={onReset}>
            Reset
          </Button>
          <Button type="submit" className="gap-2">
            <Save className="h-4 w-4" />
            {fields.id ? 'Update Release' : 'Create Release'}
          </Button>
        </div>
      </div>
    </form>
  )
}

// Main ContentStudio Component
export function ContentStudio({
  categories,
  posts,
  changelogs,
  initialTab = 'blog',
  saved = false,
  error = '',
}) {
  const router = useRouter()
  const hasShownRouteToast = useRef(false)
  const [activeTab, setActiveTab] = useState(initialTab)
  const [llmOpen, setLlmOpen] = useState(false)
  const [importOpen, setImportOpen] = useState(false)
  const { isConfigured } = useLlmConfig()
  const [editingBlogId, setEditingBlogId] = useState('')
  const [editingChangelogId, setEditingChangelogId] = useState('')
  const [blogRevision, setBlogRevision] = useState(0)
  const [changelogRevision, setChangelogRevision] = useState(0)
  const [blogQuery, setBlogQuery] = useState('')
  const [changelogQuery, setChangelogQuery] = useState('')
  const [addedCategories, setAddedCategories] = useState([])
  const [importedPosts, setImportedPosts] = useState([])

  // Merge server categories with any added this session, de-duped by name, so a
  // freshly created category is selectable immediately without a full reload.
  const categoryList = useMemo(() => {
    const seen = new Set()
    const merged = []
    for (const cat of [...categories, ...addedCategories]) {
      const key = String(cat?.name || '').toLowerCase()
      if (!key || seen.has(key)) continue
      seen.add(key)
      merged.push(cat)
    }
    return merged
  }, [categories, addedCategories])

  // Merge just-imported posts with the server list (de-duped by id) so a live
  // import is selectable and editable immediately, before the RSC refetch lands.
  const postList = useMemo(() => {
    const seen = new Set()
    const merged = []
    for (const post of [...importedPosts, ...posts]) {
      if (!post?.id || seen.has(post.id)) continue
      seen.add(post.id)
      merged.push(post)
    }
    return merged
  }, [importedPosts, posts])

  const editingBlog = useMemo(() => postList.find((post) => post.id === editingBlogId), [editingBlogId, postList])
  const editingChangelog = useMemo(
    () => changelogs.find((entry) => entry.id === editingChangelogId),
    [editingChangelogId, changelogs]
  )

  const filteredPosts = useMemo(() => {
    const q = blogQuery.toLowerCase().trim()
    if (!q) return postList
    return postList.filter((post) => `${post.title} ${post.slug} ${post.category}`.toLowerCase().includes(q))
  }, [blogQuery, postList])

  const filteredChangelogs = useMemo(() => {
    const q = changelogQuery.toLowerCase().trim()
    if (!q) return changelogs
    return changelogs.filter((entry) => `${entry.title} ${entry.version} ${entry.product}`.toLowerCase().includes(q))
  }, [changelogQuery, changelogs])

  const blogDraft = getBlogDraft(editingBlog)
  const changelogDraft = getChangelogDraft(editingChangelog)
  const publishedCount = postList.filter((post) => post.is_published).length

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
      toast.success('Changes saved', {
        description: 'Public pages were revalidated.',
      })
    }

    router.replace(`/studio/posts?tab=${initialTab}`, { scroll: false })
  }, [error, initialTab, router, saved])

  const handleCategoryCreated = (category) => {
    if (category?.name) setAddedCategories((prev) => [...prev, category])
  }

  // Add the imported post to the local list, open it for editing, and refresh
  // so the server row reconciles in.
  const handleImported = (record) => {
    if (record?.id) {
      setImportedPosts((prev) => [record, ...prev.filter((post) => post.id !== record.id)])
      setActiveTab('blog')
      setEditingBlogId(record.id)
      setBlogRevision((value) => value + 1)
    }
    router.refresh()
  }

  const deleteBlogPost = async (post) => {
    const result = await deleteBlogPostAction(post.id)
    if (!result.ok) {
      toast.error(result.error || 'Unable to delete blog post')
      return
    }
    if (editingBlogId === post.id) {
      setEditingBlogId('')
      setBlogRevision((value) => value + 1)
    }
    toast.success('Blog post deleted')
    router.refresh()
  }

  const deleteChangelog = async (entry) => {
    const result = await deleteChangelogAction(entry.id)
    if (!result.ok) {
      toast.error(result.error || 'Unable to delete release')
      return
    }
    if (editingChangelogId === entry.id) {
      setEditingChangelogId('')
      setChangelogRevision((value) => value + 1)
    }
    toast.success('Release deleted')
    router.refresh()
  }

  return (
    <div className="fixed inset-0 flex min-h-0 min-w-0 flex-col overflow-hidden bg-background text-foreground">
      <LlmSettingsDialog open={llmOpen} onOpenChange={setLlmOpen} />
      <BlogImportDialog
        open={importOpen}
        onOpenChange={setImportOpen}
        categories={categoryList}
        onPublished={handleImported}
      />

      <header className="flex h-14 items-center justify-between border-b border-border bg-background/95 px-3 backdrop-blur sm:px-4">
        <div className="flex min-w-0 items-center gap-3">
          <Link href="/" className="flex size-8 shrink-0 items-center justify-center rounded-md border border-border bg-card">
            <LayoutGrid className="size-4" />
            <span className="sr-only">Back to Geiger</span>
          </Link>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="truncate text-sm font-semibold">Geiger Content Studio</h1>
              <Badge variant="outline" className="hidden font-mono text-[10px] sm:inline-flex">EDITOR</Badge>
            </div>
            <p className="hidden text-xs text-muted-foreground sm:block">
              {activeTab === 'blog' ? `${publishedCount} published posts` : `${changelogs.length} release entries`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Tabs value="posts" className="hidden sm:block">
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
            <Link href={activeTab === 'blog' ? '/blog' : '/changelog'} target="_blank">
              View live
              <ArrowUpRight className="size-3.5" />
            </Link>
          </Button>
          <Button type="button" size="sm" variant="outline" onClick={() => setImportOpen(true)} className="gap-1.5">
            <Download className="size-3.5" />
            <span className="hidden sm:inline">Import</span>
          </Button>
          <Button type="button" size="sm" variant="outline" onClick={() => setLlmOpen(true)}>
            <Sparkles className={isConfigured ? 'text-emerald-400' : ''} />
            <span className="hidden sm:inline">AI model</span>
            <span
              className={`size-1.5 rounded-full ${isConfigured ? 'bg-emerald-400' : 'bg-muted-foreground'}`
              }
              aria-label={isConfigured ? 'AI connected' : 'AI disconnected'}
            />
          </Button>
        </div>
      </header>

      <div className="grid min-h-0 min-w-0 flex-1 grid-cols-1 overflow-x-hidden lg:grid-cols-[280px_minmax(0,1fr)] xl:grid-cols-[280px_minmax(0,1fr)_330px]">
        <aside className="hidden min-h-0 min-w-0 overflow-x-hidden border-r border-border bg-card/25 lg:flex lg:flex-col">
          <div className="border-b border-border p-3">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="blog">
                  <FileText className="size-3.5" />
                  Posts
                </TabsTrigger>
                <TabsTrigger value="changelog">
                  <Megaphone className="size-3.5" />
                  Releases
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <div className="min-h-0 flex-1">
            {activeTab === 'blog' ? (
              <RecordList
                title="Blog posts"
                items={filteredPosts}
                empty="No blog posts found"
                query={blogQuery}
                onQuery={setBlogQuery}
                selectedId={editingBlogId}
                type="blog"
                onDelete={deleteBlogPost}
                onNew={() => {
                  setEditingBlogId('')
                  setBlogRevision((v) => v + 1)
                }}
                onSelect={(id) => {
                  setEditingBlogId(id)
                  setBlogRevision((v) => v + 1)
                }}
              />
            ) : (
              <RecordList
                title="Release notes"
                items={filteredChangelogs}
                empty="No changelog entries found"
                query={changelogQuery}
                onQuery={setChangelogQuery}
                selectedId={editingChangelogId}
                type="changelog"
                onDelete={deleteChangelog}
                onNew={() => {
                  setEditingChangelogId('')
                  setChangelogRevision((v) => v + 1)
                }}
                onSelect={(id) => {
                  setEditingChangelogId(id)
                  setChangelogRevision((v) => v + 1)
                }}
              />
            )}
          </div>
        </aside>

        <main className="min-h-0 min-w-0 overflow-x-hidden overflow-y-auto overscroll-contain bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]">
          <div className="mx-auto min-w-0 max-w-4xl px-3 py-4 sm:px-6 sm:py-6">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                  {activeTab === 'blog' ? 'Blog document' : 'Product release'}
                </p>
                <h2 className="mt-1 text-xl font-semibold tracking-tight">
                  {activeTab === 'blog'
                    ? editingBlog?.title || 'Untitled post'
                    : editingChangelog?.title || 'Untitled release'}
                </h2>
              </div>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="lg:hidden">
                <TabsList>
                  <TabsTrigger value="blog">Blog</TabsTrigger>
                  <TabsTrigger value="changelog">Changelog</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {activeTab === 'blog' ? (
              <BlogForm
                blogDraft={blogDraft}
                categories={categoryList}
                onCategoryCreated={handleCategoryCreated}
                formKey={`${editingBlogId || 'new'}-${blogRevision}`}
                onReset={() => {
                  setEditingBlogId('')
                  setBlogRevision((v) => v + 1)
                }}
              />
            ) : (
              <ChangelogForm
                changelogDraft={changelogDraft}
                formKey={`${editingChangelogId || 'new'}-${changelogRevision}`}
                onReset={() => {
                  setEditingChangelogId('')
                  setChangelogRevision((v) => v + 1)
                }}
              />
            )}
          </div>
        </main>

        <aside className="hidden min-h-0 min-w-0 overflow-x-hidden border-l border-border bg-card/25 xl:flex xl:flex-col">
          <div className="min-h-0 flex-1">
            <MediaLibrary activeTab={activeTab} />
          </div>
        </aside>
      </div>
    </div>
  )
}
