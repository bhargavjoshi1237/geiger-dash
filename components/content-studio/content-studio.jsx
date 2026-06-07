'use client'

import { useEffect, useMemo, useState } from 'react'
import { Toaster } from 'sonner'
import {
  ArrowLeft,
  Calendar,
  ChevronRight,
  Copy,
  FileText,
  Folder,
  FolderPlus,
  GitCommit,
  Image as ImageIcon,
  Loader2,
  Megaphone,
  PlusCircle,
  RefreshCw,
  Save,
  Search,
  Sparkles,
  Upload,
} from 'lucide-react'
import {
  createStudioMediaFolderAction,
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
import { ScrollArea } from '@/components/ui/scroll-area'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { TiptapBlogEditor } from '@/components/content-studio/tiptap-blog-editor'
import { LlmSettingsDialog } from '@/components/content-studio/llm-settings-dialog'
import { CommitChangelogDialog } from '@/components/content-studio/commit-changelog-dialog'
import { useLlmConfig } from '@/components/content-studio/llm-config'

// Custom input styling to ensure visibility
const inputClassName = "bg-background border-input text-foreground placeholder:text-muted-foreground focus-visible:ring-ring"
const textareaClassName = "bg-background border-input text-foreground placeholder:text-muted-foreground focus-visible:ring-ring min-h-[80px]"


// Utility functions
const toDateTimeLocal = (value) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const pad = (n) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

const toDateInput = (value) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const pad = (n) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

const splitByType = (items, type) => {
  return (items || [])
    .filter((item) => item.type === type)
    .map((item) => item.description)
    .join('\n')
}

const publicObjectUrl = (bucket, path) => {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!base || !bucket || !path) return ''
  return `${base}/storage/v1/object/public/${bucket}/${String(path).replace(/^\/+/, '')}`
}

const formatFileSize = (value) => {
  const size = Number(value || 0)
  if (size >= 1024 * 1024) return `${(size / 1024 / 1024).toFixed(1)} MB`
  if (size >= 1024) return `${Math.round(size / 1024)} KB`
  return `${size} B`
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

// FormField Component
const FormField = ({ label, children, hint, required }) => (
  <div className="space-y-2">
    <Label className="text-sm font-medium text-foreground">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </Label>
    {children}
    {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
  </div>
)

// CoverImageUpload Component
const CoverImageUpload = ({ draft, existingUrl }) => {
  const [bucket, setBucket] = useState(draft.image_bucket || 'pfp')
  const [path, setPath] = useState(draft.image_path || '')
  const [url, setUrl] = useState(draft.image_url || '')
  const [previewUrl, setPreviewUrl] = useState(existingUrl || draft.image_url || publicObjectUrl(draft.image_bucket, draft.image_path))

  const resolvedStorageUrl = useMemo(() => publicObjectUrl(bucket, path), [bucket, path])

  useEffect(() => {
    const handleMediaSelected = (event) => {
      const media = event.detail
      if (!media?.publicUrl) return
      setBucket(media.bucket || 'pfp')
      setPath('')
      setUrl(media.publicUrl)
      setPreviewUrl(media.publicUrl)
    }

    window.addEventListener('content-studio:use-cover', handleMediaSelected)
    return () => window.removeEventListener('content-studio:use-cover', handleMediaSelected)
  }, [])

  const handleFilePreview = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    setPreviewUrl(URL.createObjectURL(file))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <ImageIcon className="h-4 w-4" />
          Cover Image
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <input type="hidden" name="existing_image_url" defaultValue={existingUrl || ''} />

        <div className="aspect-video w-full overflow-hidden rounded-lg border bg-muted">
          {previewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={previewUrl} alt="Cover preview" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center">
              <ImageIcon className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
        </div>

        <FormField label="Upload Image">
          <Input 
            name="image_upload" 
            type="file" 
            accept="image/*" 
            onChange={handleFilePreview}
            className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
          />
        </FormField>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField label="Storage Bucket">
            <Input 
              name="image_bucket" 
              value={bucket} 
              onChange={(e) => setBucket(e.target.value)}
              className="bg-background border-input"
            />
          </FormField>
          <FormField label="Object Path">
            <Input
              name="image_path"
              value={path}
              onChange={(e) => {
                setPath(e.target.value)
                setUrl('')
                setPreviewUrl(publicObjectUrl(bucket, e.target.value))
              }}
              placeholder="path/to/image.jpg"
              className="bg-background border-input"
            />
          </FormField>
        </div>

        <FormField 
          label="Direct URL" 
          hint={resolvedStorageUrl || 'Or paste a direct image URL'}
        >
          <Input
            name="image_url"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value)
              setPath('')
              setPreviewUrl(e.target.value || resolvedStorageUrl)
            }}
            placeholder="https://..."
            className="bg-background border-input"
          />
        </FormField>
      </CardContent>
    </Card>
  )
}

// BlogForm Component
const BlogForm = ({ blogDraft, categories, onReset, formKey }) => {
  const [category, setCategory] = useState(blogDraft.category || '')
  const [isPublished, setIsPublished] = useState(blogDraft.is_published)
  const [isFeatured, setIsFeatured] = useState(blogDraft.is_featured)

  return (
    <form key={formKey} action={saveBlogPostAction} className="space-y-6">
      <input type="hidden" name="id" defaultValue={blogDraft.id} />
      <input type="hidden" name="category" value={category} readOnly />
      <input type="hidden" name="is_published" value={isPublished ? 'on' : ''} readOnly />
      <input type="hidden" name="is_featured" value={isFeatured ? 'on' : ''} readOnly />

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Post Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className={inputClassName}>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.name}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="Tags" hint="Comma separated">
              <Input 
                name="tags" 
                defaultValue={blogDraft.tags} 
                placeholder="tag1, tag2, tag3"
                className={inputClassName}
              />
            </FormField>
            <FormField label="Reading Time (min)">
              <Input 
                type="number" 
                min={1} 
                name="reading_time_minutes" 
                defaultValue={blogDraft.reading_time_minutes}
                className={inputClassName}
              />
            </FormField>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Content</CardTitle>
        </CardHeader>
        <CardContent>
          <TiptapBlogEditor name="content" defaultValue={blogDraft.content} />
        </CardContent>
      </Card>

      <CoverImageUpload draft={blogDraft} existingUrl={blogDraft.featured_image} />

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Publishing Options
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
              />
              <Label htmlFor="is-published" className="cursor-pointer">Published</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch 
                id="is-featured"
                checked={isFeatured} 
                onCheckedChange={setIsFeatured} 
              />
              <Label htmlFor="is-featured" className="cursor-pointer">Featured</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between gap-4 sticky bottom-4 bg-background border rounded-lg p-4 shadow-lg">
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
    <form key={formKey} action={saveChangelogAction} className="space-y-6">
      <input type="hidden" name="id" defaultValue={fields.id} />
      <input type="hidden" name="category" value={fields.category} readOnly />
      <input type="hidden" name="product" value={fields.product} readOnly />
      <input type="hidden" name="is_featured" value={fields.is_featured ? 'on' : ''} readOnly />

      <Card>
        <CardHeader>
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
        <CardContent className="space-y-4">
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
                <SelectTrigger className={inputClassName}>
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
                <SelectTrigger className={inputClassName}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="geiger-flow">Geiger Flow</SelectItem>
                  <SelectItem value="geiger-notes">Geiger Notes</SelectItem>
                  <SelectItem value="geiger-dash">Geiger Dash</SelectItem>
                  <SelectItem value="geiger-dam">Geiger DAM</SelectItem>
                  <SelectItem value="geiger-grey">Geiger Grey</SelectItem>
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

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Release Items</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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

      <div className="flex items-center justify-between gap-4 sticky bottom-4 bg-background border rounded-lg p-4 shadow-lg">
        <div className="flex items-center gap-2">
          <Switch
            id="changelog-featured"
            checked={fields.is_featured}
            onCheckedChange={setField('is_featured')}
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

// MediaLibrary Component
const MediaLibrary = ({ activeTab }) => {
  const [contentType, setContentType] = useState(activeTab === 'changelog' ? 'changelog' : 'blog')
  const [folders, setFolders] = useState([])
  const [media, setMedia] = useState([])
  const [query, setQuery] = useState('')
  const [currentFolder, setCurrentFolder] = useState('')
  const [newFolderName, setNewFolderName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isCreatingFolder, setIsCreatingFolder] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    let isCurrent = true

    const loadMedia = async () => {
      setIsLoading(true)
      setMessage('')
      const result = await listStudioMediaAction(contentType, currentFolder)
      if (!isCurrent) return

      if (result.ok) {
        setFolders(result.folders || [])
        setMedia(result.media || [])
      } else {
        setFolders([])
        setMedia([])
        setMessage(result.error || 'Unable to load media.')
      }
      setIsLoading(false)
    }

    loadMedia()
    return () => {
      isCurrent = false
    }
  }, [contentType, currentFolder])

  const breadcrumbs = useMemo(() => {
    const parts = currentFolder.split('/').filter(Boolean)
    return parts.map((part, index) => ({
      name: part,
      path: parts.slice(0, index + 1).join('/'),
    }))
  }, [currentFolder])

  const filteredFolders = useMemo(() => {
    const normalizedQuery = query.toLowerCase().trim()
    if (!normalizedQuery) return folders
    return folders.filter((item) => `${item.name} ${item.path}`.toLowerCase().includes(normalizedQuery))
  }, [folders, query])

  const filteredMedia = useMemo(() => {
    const normalizedQuery = query.toLowerCase().trim()
    if (!normalizedQuery) return media
    return media.filter((item) => `${item.name} ${item.path}`.toLowerCase().includes(normalizedQuery))
  }, [media, query])

  const refreshMedia = async () => {
    setIsLoading(true)
    setMessage('')
    const result = await listStudioMediaAction(contentType, currentFolder)
    if (result.ok) {
      setFolders(result.folders || [])
      setMedia(result.media || [])
    } else {
      setMessage(result.error || 'Unable to refresh media.')
    }
    setIsLoading(false)
  }

  const uploadMedia = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.set('media_upload', file)
    formData.set('content_type', contentType)
    formData.set('folder', currentFolder || 'library')

    setIsUploading(true)
    setMessage('')
    const result = await uploadStudioMediaAction(formData)
    if (result.ok) {
      setMedia((items) => [result.media, ...items])
      setMessage('Uploaded successfully')
    } else {
      setMessage(result.error || 'Upload failed.')
    }
    setIsUploading(false)
    event.target.value = ''
  }

  const createFolder = async () => {
    const formData = new FormData()
    formData.set('content_type', contentType)
    formData.set('parent_folder', currentFolder)
    formData.set('folder_name', newFolderName)

    setIsCreatingFolder(true)
    setMessage('')
    const result = await createStudioMediaFolderAction(formData)
    if (result.ok) {
      setFolders((items) => [result.folder, ...items.filter((item) => item.path !== result.folder.path)])
      setNewFolderName('')
      setMessage('Folder created.')
    } else {
      setMessage(result.error || 'Unable to create folder.')
    }
    setIsCreatingFolder(false)
  }

  const copyUrl = async (item) => {
    await navigator.clipboard.writeText(item.publicUrl)
    setMessage('URL copied to clipboard')
  }

  const applyAsCover = (item) => {
    window.dispatchEvent(new CustomEvent('content-studio:use-cover', { detail: item }))
    setMessage('Applied as cover image')
  }

  const insertInEditor = (item) => {
    window.dispatchEvent(new CustomEvent('content-studio:insert-image', { detail: item }))
    setMessage('Inserted into editor')
  }

  const openFolder = (folderPath) => {
    const rootPrefix = folderPath.split('/').slice(0, 2).join('/')
    const relativePath = folderPath.replace(`${rootPrefix}/`, '')
    setCurrentFolder(relativePath)
    setQuery('')
  }

  const goBack = () => {
    const parts = currentFolder.split('/').filter(Boolean)
    setCurrentFolder(parts.slice(0, -1).join('/'))
    setQuery('')
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            Media Library
          </CardTitle>
          <Button 
            type="button" 
            size="sm" 
            variant="ghost" 
            onClick={refreshMedia} 
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={contentType} onValueChange={setContentType}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="blog">Blog</TabsTrigger>
            <TabsTrigger value="changelog">Changelog</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <Button 
              type="button" 
              size="sm" 
              variant="ghost" 
              onClick={goBack} 
              disabled={!currentFolder}
            >
              <ArrowLeft className="h-3 w-3" />
            </Button>
            <Button 
              type="button" 
              size="sm" 
              variant="ghost" 
              onClick={() => setCurrentFolder('')}
            >
              {contentType}
            </Button>
            {breadcrumbs.map((crumb) => (
              <div key={crumb.path} className="flex items-center gap-1">
                <ChevronRight className="h-3 w-3 text-muted-foreground" />
                <Button 
                  type="button" 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => setCurrentFolder(crumb.path)}
                >
                  {crumb.name}
                </Button>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Input
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="New folder name"
              className={inputClassName}
            />
            <Button 
              type="button" 
              onClick={createFolder} 
              disabled={isCreatingFolder || !newFolderName.trim()}
            >
              {isCreatingFolder ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <FolderPlus className="h-4 w-4" />
              )}
            </Button>
          </div>

          <div className="flex gap-2">
            <div className="flex-1 text-xs text-muted-foreground border rounded-md px-3 py-2 bg-muted">
              Target: {currentFolder || 'library'}
            </div>
            <Label className="inline-flex cursor-pointer">
              <Button type="button" disabled={isUploading} asChild>
                <span>
                  {isUploading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Upload className="h-4 w-4 mr-2" />
                  )}
                  Upload
                </span>
              </Button>
              <Input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={uploadMedia} 
                disabled={isUploading} 
              />
            </Label>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search media"
              className={`${inputClassName} pl-9`}
            />
          </div>

          {message && (
            <p className="text-xs text-muted-foreground">{message}</p>
          )}
        </div>

        <ScrollArea className="h-[400px]">
          <div className="grid grid-cols-2 gap-3 pr-4">
            {filteredFolders.map((item) => (
              <button
                key={item.path}
                type="button"
                className="rounded-lg border p-3 text-left hover:bg-accent transition-colors"
                onClick={() => openFolder(item.path)}
              >
                <div className="flex aspect-video items-center justify-center rounded-md bg-muted">
                  <Folder className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="mt-2 text-xs font-medium truncate">{item.name}</p>
                <p className="text-[11px] text-muted-foreground">Folder</p>
              </button>
            ))}
            
            {filteredMedia.map((item) => (
              <div key={item.path} className="rounded-lg border overflow-hidden">
                <div className="aspect-video bg-muted">
                  {item.publicUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img 
                      src={item.publicUrl} 
                      alt={item.name} 
                      className="h-full w-full object-cover" 
                      loading="lazy" 
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <ImageIcon className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="p-2 space-y-2">
                  <div>
                    <p className="text-xs font-medium truncate">{item.name}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {formatFileSize(item.size)}
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    <Button 
                      type="button" 
                      size="sm" 
                      variant="outline" 
                      onClick={() => applyAsCover(item)}
                      title="Use as cover"
                    >
                      <ImageIcon className="h-3 w-3" />
                    </Button>
                    <Button 
                      type="button" 
                      size="sm" 
                      variant="outline" 
                      onClick={() => insertInEditor(item)}
                      title="Insert in editor"
                    >
                      <FileText className="h-3 w-3" />
                    </Button>
                    <Button 
                      type="button" 
                      size="sm" 
                      variant="outline" 
                      onClick={() => copyUrl(item)}
                      title="Copy URL"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            {!isLoading && filteredFolders.length === 0 && filteredMedia.length === 0 && (
              <p className="col-span-2 text-center text-sm text-muted-foreground py-8">
                No media found. Upload an image or create a folder.
              </p>
            )}
            
            {isLoading && (
              <div className="col-span-2 flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

// RecordList Component
const RecordList = ({ title, items, empty, query, onQuery, onNew, onSelect, selectedId, type }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{title}</CardTitle>
          <Button type="button" size="sm" variant="outline" onClick={onNew}>
            <PlusCircle className="h-4 w-4 mr-2" />
            New
          </Button>
        </div>
        <div className="relative mt-3">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            value={query} 
            onChange={(e) => onQuery(e.target.value)} 
            placeholder="Search..." 
            className={`${inputClassName} pl-9`}
          />
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          <div className="space-y-2 pr-4">
            {items.map((item) => (
              <Button
                key={item.id}
                type="button"
                variant="outline"
                className={`h-auto w-full justify-start text-left p-3 ${
                  selectedId === item.id ? 'border-primary bg-primary/10' : ''
                }`}
                onClick={() => onSelect(item.id)}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium truncate">{item.title}</p>
                    {type === 'blog' && item.is_published && (
                      <Badge variant="secondary" className="text-xs">Live</Badge>
                    )}
                    {type === 'changelog' && item.is_featured && (
                      <Badge variant="secondary" className="text-xs">Featured</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate mt-1">
                    {type === 'blog' ? item.slug : `v${item.version} - ${item.product}`}
                  </p>
                </div>
              </Button>
            ))}
            {items.length === 0 && (
              <p className="text-center text-sm text-muted-foreground py-8">{empty}</p>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
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
  const [activeTab, setActiveTab] = useState(initialTab)
  const [llmOpen, setLlmOpen] = useState(false)
  const { isConfigured } = useLlmConfig()
  const [editingBlogId, setEditingBlogId] = useState('')
  const [editingChangelogId, setEditingChangelogId] = useState('')
  const [blogRevision, setBlogRevision] = useState(0)
  const [changelogRevision, setChangelogRevision] = useState(0)
  const [blogQuery, setBlogQuery] = useState('')
  const [changelogQuery, setChangelogQuery] = useState('')

  const editingBlog = useMemo(() => posts.find((post) => post.id === editingBlogId), [editingBlogId, posts])
  const editingChangelog = useMemo(
    () => changelogs.find((entry) => entry.id === editingChangelogId),
    [editingChangelogId, changelogs]
  )

  const filteredPosts = useMemo(() => {
    const q = blogQuery.toLowerCase().trim()
    if (!q) return posts
    return posts.filter((post) => `${post.title} ${post.slug} ${post.category}`.toLowerCase().includes(q))
  }, [blogQuery, posts])

  const filteredChangelogs = useMemo(() => {
    const q = changelogQuery.toLowerCase().trim()
    if (!q) return changelogs
    return changelogs.filter((entry) => `${entry.title} ${entry.version} ${entry.product}`.toLowerCase().includes(q))
  }, [changelogQuery, changelogs])

  const blogDraft = getBlogDraft(editingBlog)
  const changelogDraft = getChangelogDraft(editingChangelog)
  const publishedCount = posts.filter((post) => post.is_published).length
  const featuredCount = posts.filter((post) => post.is_featured).length + changelogs.filter((entry) => entry.is_featured).length

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Toaster theme="dark" position="bottom-right" richColors closeButton />
      <LlmSettingsDialog open={llmOpen} onOpenChange={setLlmOpen} />

      {/* Page header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Content Studio</h1>
          <p className="text-sm text-muted-foreground">Publish blog posts and product changelogs.</p>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => setLlmOpen(true)}
          className="gap-2"
        >
          <Sparkles className={`h-4 w-4 ${isConfigured ? 'text-indigo-400' : ''}`} />
          AI Settings
          <Badge
            variant="secondary"
            className={`ml-1 ${isConfigured ? 'bg-emerald-500/15 text-emerald-400' : 'bg-zinc-800 text-zinc-400'}`}
          >
            {isConfigured ? 'Connected' : 'Off'}
          </Badge>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Blog Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{posts.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Published</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{publishedCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Changelogs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{changelogs.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Featured</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{featuredCount}</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        {/* Editor */}
        <Card>
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{activeTab === 'blog' ? 'Blog Editor' : 'Changelog Editor'}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {activeTab === 'blog' ? 'Create and edit blog posts' : 'Create and edit changelog entries'}
                </p>
              </div>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="blog">
                    <FileText className="h-4 w-4 mr-2" />
                    Blog
                  </TabsTrigger>
                  <TabsTrigger value="changelog">
                    <Megaphone className="h-4 w-4 mr-2" />
                    Changelog
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            {saved && (
              <div className="mt-4 p-3 rounded-md bg-green-500/10 border border-green-500/20 text-green-600 text-sm">
                Saved successfully!
              </div>
            )}
            {error && (
              <div className="mt-4 p-3 rounded-md bg-red-500/10 border border-red-500/20 text-red-600 text-sm">
                Error: {error}
              </div>
            )}
          </CardHeader>

          <CardContent className="p-6">
            {activeTab === 'blog' ? (
              <BlogForm
                blogDraft={blogDraft}
                categories={categories}
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
          </CardContent>
        </Card>

        {/* Sidebar */}
        <div className="space-y-6">
          <MediaLibrary activeTab={activeTab} />
          
          <RecordList
            title="Blog Posts"
            items={filteredPosts}
            empty="No blog posts found"
            query={blogQuery}
            onQuery={setBlogQuery}
            selectedId={editingBlogId}
            type="blog"
            onNew={() => {
              setActiveTab('blog')
              setEditingBlogId('')
              setBlogRevision((v) => v + 1)
            }}
            onSelect={(id) => {
              setActiveTab('blog')
              setEditingBlogId(id)
              setBlogRevision((v) => v + 1)
            }}
          />

          <RecordList
            title="Changelog Entries"
            items={filteredChangelogs}
            empty="No changelog entries found"
            query={changelogQuery}
            onQuery={setChangelogQuery}
            selectedId={editingChangelogId}
            type="changelog"
            onNew={() => {
              setActiveTab('changelog')
              setEditingChangelogId('')
              setChangelogRevision((v) => v + 1)
            }}
            onSelect={(id) => {
              setActiveTab('changelog')
              setEditingChangelogId(id)
              setChangelogRevision((v) => v + 1)
            }}
          />
        </div>
      </div>
    </div>
  )
}
