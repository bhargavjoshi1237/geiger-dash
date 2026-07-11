'use client'

// Shared studio primitives used by both the Content Studio (posts/changelog) and
// the Pages Studio (SEO pages): form scaffolding, the cover-image uploader, the
// left-hand record list, and the right-hand media library. Kept here so the two
// studios stay visually and behaviourally identical without duplicating code.

import { useEffect, useId, useMemo, useState } from 'react'
import { toast } from 'sonner'
import {
  ArrowLeft,
  ChevronRight,
  Circle,
  Copy,
  FileText,
  Folder,
  FolderPlus,
  Image as ImageIcon,
  Loader2,
  PlusCircle,
  RefreshCw,
  Search,
  Settings2,
  Trash2,
  Upload,
} from 'lucide-react'
import {
  createStudioMediaFolderAction,
  listStudioMediaAction,
  uploadStudioMediaAction,
} from '@/app/studio/posts/actions'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

export const inputClassName = 'bg-background text-foreground placeholder:text-muted-foreground'
export const textareaClassName =
  'min-h-[80px] bg-background text-foreground placeholder:text-muted-foreground'

export const toDateTimeLocal = (value) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const pad = (n) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export const toDateInput = (value) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const pad = (n) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

export const publicObjectUrl = (bucket, path) => {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!base || !bucket || !path) return ''
  return `${base}/storage/v1/object/public/${bucket}/${String(path).replace(/^\/+/, '')}`
}

export const formatFileSize = (value) => {
  const size = Number(value || 0)
  if (size >= 1024 * 1024) return `${(size / 1024 / 1024).toFixed(1)} MB`
  if (size >= 1024) return `${Math.round(size / 1024)} KB`
  return `${size} B`
}

// Estimate reading minutes from editor HTML (~200 wpm), matching the server.
export const readingMinutesFromHtml = (value) => {
  const text = String(value || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  const words = text ? text.split(/\s+/).filter(Boolean).length : 0
  return Math.max(1, Math.round(words / 200))
}

export const FormField = ({ label, children, hint, required }) => (
  <div className="min-w-0 space-y-2">
    <Label className="text-sm font-medium text-foreground">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </Label>
    {children}
    {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
  </div>
)

export const CollapsibleSection = ({ value, icon: Icon, title, children }) => (
  <Card className="min-w-0 max-w-full overflow-hidden border-border bg-card/45 shadow-none">
    <Accordion type="single" collapsible defaultValue={value} className="min-w-0 max-w-full">
      <AccordionItem value={value} className="border-0">
        <CardHeader className="p-0">
          <AccordionTrigger className="px-4 py-4 hover:no-underline">
            <span className="flex items-center gap-2 text-base">
              {Icon ? <Icon className="size-4" /> : null}
              {title}
            </span>
          </AccordionTrigger>
        </CardHeader>
        <AccordionContent className="min-w-0 max-w-full overflow-hidden px-4 pb-4">
          {children}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </Card>
)

// Cover / OG image picker: upload a file, point at a storage object, or paste a
// direct URL. Listens for the media library's "use as cover" event.
export const CoverImageUpload = ({ draft, existingUrl }) => {
  const fileInputId = useId()
  const [bucket, setBucket] = useState(draft.image_bucket || 'pfp')
  const [path, setPath] = useState(draft.image_path || '')
  const [url, setUrl] = useState(draft.image_url || '')
  const [fileName, setFileName] = useState('')
  const [previewUrl, setPreviewUrl] = useState(
    existingUrl || draft.image_url || publicObjectUrl(draft.image_bucket, draft.image_path)
  )

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
    setFileName(file.name)
    setPreviewUrl(URL.createObjectURL(file))
  }

  return (
    <CollapsibleSection value="cover-image" icon={ImageIcon} title="Cover Image">
      <div className="space-y-4">
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
          <div className="flex min-w-0 items-center gap-3">
            <Button type="button" variant="outline" asChild>
              <Label htmlFor={fileInputId} className="cursor-pointer">
                <Upload className="size-4" />
                Choose image
              </Label>
            </Button>
            <span className="min-w-0 truncate text-sm text-muted-foreground">
              {fileName || 'No file selected'}
            </span>
          </div>
          <Input
            id={fileInputId}
            name="image_upload"
            type="file"
            accept="image/*"
            onChange={handleFilePreview}
            className="sr-only"
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

        <FormField label="Direct URL" hint={resolvedStorageUrl || 'Or paste a direct image URL'}>
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
      </div>
    </CollapsibleSection>
  )
}

// Left-hand searchable record list. `type` drives the subtitle + status badge:
// 'blog'/'pages' show a Live/Draft badge, 'changelog' shows a Featured badge.
export const RecordList = ({
  title,
  items,
  empty,
  query,
  onQuery,
  onNew,
  onSelect,
  onDelete,
  selectedId,
  type,
  searchPlaceholder,
}) => {
  const [deletingId, setDeletingId] = useState('')
  const showPublished = type === 'blog' || type === 'pages'

  const handleDelete = async (item) => {
    const label = type === 'blog' ? 'blog post' : type === 'pages' ? 'page' : 'release'
    if (!window.confirm(`Delete this ${label}? This cannot be undone.`)) return

    setDeletingId(item.id)
    await onDelete(item)
    setDeletingId('')
  }

  const subtitleFor = (item) => {
    if (type === 'blog') return item.slug
    if (type === 'pages') return `${item.page_type} · ${item.slug}`
    return `v${item.version} - ${item.product}`
  }

  return (
    <Card className="h-full rounded-none border-0 bg-transparent shadow-none">
      <CardHeader className="border-b border-border p-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{title}</CardTitle>
          <Button type="button" size="sm" variant="outline" onClick={onNew}>
            <PlusCircle className="h-4 w-4 mr-2" />
            New
          </Button>
        </div>
        <div className="relative mt-3">
          <Search className="pointer-events-none absolute left-3 top-1/2 z-10 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder={searchPlaceholder || 'Search...'}
            className={`${inputClassName} pl-9`}
          />
        </div>
      </CardHeader>
      <CardContent className="min-w-0 overflow-hidden p-2">
        <ScrollArea className="h-[calc(100vh-215px)] min-h-72 min-w-0 max-w-full [&_[data-slot=scroll-area-viewport]>div]:!block">
          <div className="min-w-0 max-w-full space-y-1 pr-3">
            {items.map((item) => (
              <div
                key={item.id}
                className={`grid w-full min-w-0 max-w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-1 overflow-hidden rounded-md border p-1 transition-colors ${
                  selectedId === item.id ? 'border-border bg-accent' : 'bg-transparent hover:border-border'
                }`}
              >
                <button
                  type="button"
                  className="min-w-0 overflow-hidden rounded-sm px-2 py-2 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  onClick={() => onSelect(item.id)}
                >
                  <p className="block w-full truncate text-sm font-medium">{item.title}</p>
                  <p className="mt-1 truncate text-xs text-muted-foreground">{subtitleFor(item)}</p>
                </button>
                <div className="flex shrink-0 items-center gap-1 pr-1">
                  {showPublished ? (
                    <Badge
                      variant={item.is_published ? 'success' : 'outline'}
                      className="gap-1 px-1.5 py-0.5 text-[10px]"
                    >
                      <Circle className={`size-1.5 ${item.is_published ? 'fill-current' : ''}`} />
                      {item.is_published ? 'Live' : 'Draft'}
                    </Badge>
                  ) : item.is_featured ? (
                    <Badge variant="info" className="px-1.5 py-0.5 text-[10px]">
                      Featured
                    </Badge>
                  ) : null}
                  <Button
                    type="button"
                    size="icon-sm"
                    variant="ghost"
                    className="shrink-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => handleDelete(item)}
                    disabled={deletingId === item.id}
                    aria-label={`Delete ${item.title}`}
                    title={`Delete ${item.title}`}
                  >
                    {deletingId === item.id ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="size-3.5" />
                    )}
                  </Button>
                </div>
              </div>
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

const DEFAULT_MEDIA_TYPES = [
  { value: 'blog', label: 'Blog' },
  { value: 'changelog', label: 'Changelog' },
]

// Right-hand media browser: folder navigation, upload, and per-asset actions
// (use as cover, insert in editor, copy URL). `types` sets which storage roots
// the tabs switch between.
export const MediaLibrary = ({ activeTab, types = DEFAULT_MEDIA_TYPES }) => {
  const initialType = types.find((entry) => entry.value === activeTab)?.value || types[0].value
  const [contentType, setContentType] = useState(initialType)
  const [folders, setFolders] = useState([])
  const [media, setMedia] = useState([])
  const [query, setQuery] = useState('')
  const [currentFolder, setCurrentFolder] = useState('')
  const [newFolderName, setNewFolderName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isCreatingFolder, setIsCreatingFolder] = useState(false)

  useEffect(() => {
    let isCurrent = true

    const loadMedia = async () => {
      setIsLoading(true)
      const result = await listStudioMediaAction(contentType, currentFolder)
      if (!isCurrent) return

      if (result.ok) {
        setFolders(result.folders || [])
        setMedia(result.media || [])
      } else {
        setFolders([])
        setMedia([])
        toast.error(result.error || 'Unable to load media.')
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
    const result = await listStudioMediaAction(contentType, currentFolder)
    if (result.ok) {
      setFolders(result.folders || [])
      setMedia(result.media || [])
      toast.success('Assets refreshed')
    } else {
      toast.error(result.error || 'Unable to refresh media.')
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
    const result = await uploadStudioMediaAction(formData)
    if (result.ok) {
      setMedia((items) => [result.media, ...items])
      toast.success('Asset uploaded')
    } else {
      toast.error(result.error || 'Upload failed.')
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
    const result = await createStudioMediaFolderAction(formData)
    if (result.ok) {
      setFolders((items) => [result.folder, ...items.filter((item) => item.path !== result.folder.path)])
      setNewFolderName('')
      toast.success('Folder created')
    } else {
      toast.error(result.error || 'Unable to create folder.')
    }
    setIsCreatingFolder(false)
  }

  const copyUrl = async (item) => {
    await navigator.clipboard.writeText(item.publicUrl)
    toast.success('URL copied to clipboard')
  }

  const applyAsCover = (item) => {
    window.dispatchEvent(new CustomEvent('content-studio:use-cover', { detail: item }))
    toast.success('Applied as cover image')
  }

  const insertInEditor = (item) => {
    window.dispatchEvent(new CustomEvent('content-studio:insert-image', { detail: item }))
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
    <Card className="h-full rounded-none border-0 bg-transparent shadow-none">
      <CardHeader className="border-b border-border p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings2 className="size-3.5 text-muted-foreground" />
            <span className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
              Assets
            </span>
          </div>
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            onClick={refreshMedia}
            disabled={isLoading}
            aria-label="Refresh assets"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 p-4">
        {types.length > 1 ? (
          <Tabs value={contentType} onValueChange={setContentType}>
            <TabsList
              className={`grid w-full bg-muted ${types.length >= 3 ? 'grid-cols-3' : 'grid-cols-2'}`}
            >
              {types.map((entry) => (
                <TabsTrigger
                  key={entry.value}
                  value={entry.value}
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  {entry.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        ) : null}

        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <Button type="button" size="sm" variant="ghost" onClick={goBack} disabled={!currentFolder}>
              <ArrowLeft className="h-3 w-3" />
            </Button>
            <Button type="button" size="sm" variant="ghost" onClick={() => setCurrentFolder('')}>
              {contentType}
            </Button>
            {breadcrumbs.map((crumb) => (
              <div key={crumb.path} className="flex items-center gap-1">
                <ChevronRight className="h-3 w-3 text-muted-foreground" />
                <Button type="button" size="sm" variant="ghost" onClick={() => setCurrentFolder(crumb.path)}>
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
            <Button type="button" onClick={createFolder} disabled={isCreatingFolder || !newFolderName.trim()}>
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
            <Search className="pointer-events-none absolute left-3 top-1/2 z-10 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search assets..."
              className={`${inputClassName} pl-9`}
            />
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-430px)] min-h-64">
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
                    <p className="text-[11px] text-muted-foreground">{formatFileSize(item.size)}</p>
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
