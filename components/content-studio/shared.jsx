'use client'

// Shared Studio pieces used by Posts, Releases and Pages: date/size helpers, the
// inspector's cover-image field and the inspector's Media tab (storage browser).

import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { toast } from 'sonner'
import {
  Button,
  Field,
  Input,
  LogoLoading,
  SegmentedTabs,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  cn,
} from '@geiger/ui'
import {
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  Copy,
  Folder,
  FolderPlus,
  Image as ImageIcon,
  Images,
  Loader2,
  RefreshCw,
  Search,
  TextCursorInput,
  Upload,
  X,
} from 'lucide-react'
import {
  createStudioMediaFolderAction,
  listStudioMediaAction,
  uploadStudioMediaAction,
} from '@/app/studio/posts/actions'

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

const STRIPES =
  'bg-[repeating-linear-gradient(45deg,rgb(128_128_128/0.08)_0_1px,transparent_1px_10px)] bg-surface-card'

// Last path segment of a URL, for the preview's file label.
const fileLabel = (url) => {
  try {
    return decodeURIComponent(new URL(url).pathname.split('/').filter(Boolean).slice(-2).join('/'))
  } catch {
    return url
  }
}

// Inspector cover / OG image: upload, pick from the Media tab, or point at a bucket path or URL.
// Emits the image_upload / image_bucket / image_path / image_url / existing_image_url form fields.
export function CoverImageField({ existingUrl, onBrowse, onPreviewChange, onEdit }) {
  const fileInputId = useId()
  const [bucket, setBucket] = useState('pfp')
  const [path, setPath] = useState('')
  const [url, setUrl] = useState('')
  const [existing, setExisting] = useState(existingUrl || '')
  const [previewUrl, setPreviewUrl] = useState(existingUrl || '')
  const [advanced, setAdvanced] = useState(false)
  const onEditRef = useRef(onEdit)

  useEffect(() => {
    onEditRef.current = onEdit
  }, [onEdit])

  useEffect(() => {
    onPreviewChange?.(previewUrl)
  }, [previewUrl, onPreviewChange])

  useEffect(() => {
    const handleMediaSelected = (event) => {
      const media = event.detail
      if (!media?.publicUrl) return
      setBucket(media.bucket || 'pfp')
      setPath('')
      setUrl(media.publicUrl)
      setPreviewUrl(media.publicUrl)
      onEditRef.current?.()
    }
    window.addEventListener('content-studio:use-cover', handleMediaSelected)
    return () => window.removeEventListener('content-studio:use-cover', handleMediaSelected)
  }, [])

  const handleFile = (event) => {
    const file = event.target.files?.[0]
    if (file) setPreviewUrl(URL.createObjectURL(file))
  }

  const clear = () => {
    const input = document.getElementById(fileInputId)
    if (input) input.value = ''
    setPath('')
    setUrl('')
    setExisting('')
    setPreviewUrl('')
    onEdit?.()
  }

  return (
    <div className="flex flex-col gap-3">
      <input type="hidden" name="existing_image_url" value={existing} />

      <div className={cn('relative flex aspect-video items-end overflow-hidden rounded-lg border border-border p-2.5', !previewUrl && STRIPES)}>
        {previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={previewUrl} alt="Cover preview" className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <ImageIcon className="size-4" />
            No cover yet
          </span>
        )}
        {previewUrl ? (
          <>
            <span className="relative max-w-full truncate rounded-md border border-border bg-background px-2 py-0.5 font-mono text-[11px] text-muted-foreground">
              {previewUrl.startsWith('blob:') ? 'New upload' : fileLabel(previewUrl)}
            </span>
            <Button
              type="button"
              variant="outline"
              size="icon-xs"
              onClick={clear}
              aria-label="Remove cover image"
              className="absolute right-2 top-2"
            >
              <X />
            </Button>
          </>
        ) : null}
      </div>

      <div className="grid grid-cols-2 gap-1.5">
        <Button type="button" variant="outline" size="sm" asChild className="w-full cursor-pointer">
          <label htmlFor={fileInputId}>
            <Upload className="size-3.5" />
            Upload
          </label>
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={onBrowse} className="w-full">
          <Images className="size-3.5" />
          From library
        </Button>
      </div>
      <input id={fileInputId} name="image_upload" type="file" accept="image/*" onChange={handleFile} className="sr-only" />

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => setAdvanced((value) => !value)}
        aria-expanded={advanced}
        className="w-full text-muted-foreground"
      >
        <span className="flex-1 text-left font-normal">Bucket, path or direct URL</span>
        {advanced ? <ChevronDown className="size-3.5" /> : <ChevronRight className="size-3.5" />}
      </Button>
      <div className={cn('flex-col gap-3', advanced ? 'flex' : 'hidden')}>
        <div className="grid grid-cols-[96px_minmax(0,1fr)] gap-2">
          <Field label="Bucket" className="gap-1.5">
            <Input name="image_bucket" value={bucket} onChange={(e) => setBucket(e.target.value)} />
          </Field>
          <Field label="Object path" className="gap-1.5">
            <Input
              name="image_path"
              value={path}
              onChange={(e) => {
                setPath(e.target.value)
                setUrl('')
                setPreviewUrl(publicObjectUrl(bucket, e.target.value) || existing)
              }}
              placeholder="path/to/image.jpg"
            />
          </Field>
        </div>
        <Field label="Direct URL" className="gap-1.5">
          <Input
            name="image_url"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value)
              setPath('')
              setPreviewUrl(e.target.value || existing)
            }}
            placeholder="https://…"
          />
        </Field>
      </div>
    </div>
  )
}

const DEFAULT_MEDIA_TYPES = [
  { value: 'blog', label: 'Blog' },
  { value: 'changelog', label: 'Changelog' },
]

function MediaAction({ label, onClick, children }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button type="button" variant="outline" size="icon-sm" aria-label={label} onClick={onClick}>
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}

// Inspector Media tab: browse a storage root, make folders, upload, and use an image as cover, insert it, or copy its URL.
export function MediaLibrary({ activeTab, types = DEFAULT_MEDIA_TYPES }) {
  const initialType = types.find((entry) => entry.value === activeTab)?.value || types[0].value
  const [contentType, setContentType] = useState(initialType)
  const [folders, setFolders] = useState([])
  const [media, setMedia] = useState([])
  const [query, setQuery] = useState('')
  const [currentFolder, setCurrentFolder] = useState('')
  const [newFolderName, setNewFolderName] = useState('')
  const [isNamingFolder, setIsNamingFolder] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isCreatingFolder, setIsCreatingFolder] = useState(false)
  const uploadId = useId()

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
    return parts.map((part, index) => ({ name: part, path: parts.slice(0, index + 1).join('/') }))
  }, [currentFolder])

  const filteredFolders = useMemo(() => {
    const q = query.toLowerCase().trim()
    return q ? folders.filter((item) => `${item.name} ${item.path}`.toLowerCase().includes(q)) : folders
  }, [folders, query])

  const filteredMedia = useMemo(() => {
    const q = query.toLowerCase().trim()
    return q ? media.filter((item) => `${item.name} ${item.path}`.toLowerCase().includes(q)) : media
  }, [media, query])

  const refreshMedia = async () => {
    setIsLoading(true)
    const result = await listStudioMediaAction(contentType, currentFolder)
    if (result.ok) {
      setFolders(result.folders || [])
      setMedia(result.media || [])
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
    if (!newFolderName.trim()) return
    const formData = new FormData()
    formData.set('content_type', contentType)
    formData.set('parent_folder', currentFolder)
    formData.set('folder_name', newFolderName)

    setIsCreatingFolder(true)
    const result = await createStudioMediaFolderAction(formData)
    if (result.ok) {
      setFolders((items) => [result.folder, ...items.filter((item) => item.path !== result.folder.path)])
      setNewFolderName('')
      setIsNamingFolder(false)
      toast.success('Folder created')
    } else {
      toast.error(result.error || 'Unable to create folder.')
    }
    setIsCreatingFolder(false)
  }

  const copyUrl = async (item) => {
    await navigator.clipboard.writeText(item.publicUrl)
    toast.success('URL copied')
  }

  const applyAsCover = (item) => {
    window.dispatchEvent(new CustomEvent('content-studio:use-cover', { detail: item }))
    toast.success('Set as cover image')
  }

  const insertInEditor = (item) => {
    window.dispatchEvent(new CustomEvent('content-studio:insert-image', { detail: item }))
  }

  const openFolder = (folderPath) => {
    const rootPrefix = folderPath.split('/').slice(0, 2).join('/')
    setCurrentFolder(folderPath.replace(`${rootPrefix}/`, ''))
    setQuery('')
  }

  const goBack = () => {
    setCurrentFolder(currentFolder.split('/').filter(Boolean).slice(0, -1).join('/'))
    setQuery('')
  }

  const rootLabel = types.find((entry) => entry.value === contentType)?.label || contentType

  return (
    <TooltipProvider delayDuration={300}>
      {/* Browsing the library isn't an edit to the document around it. */}
      <div className="flex min-h-full flex-col" onInput={(event) => event.stopPropagation()}>
        <div className="flex flex-col gap-3 border-b border-sidebar-border p-3">
          {types.length > 1 ? (
            <SegmentedTabs
              fullWidth
              tabs={types}
              value={contentType}
              onChange={(value) => {
                setContentType(value)
                setCurrentFolder('')
                setQuery('')
              }}
              buttonClassName="h-7 text-xs"
            />
          ) : null}

          <div className="flex min-w-0 items-center gap-0.5 text-xs text-muted-foreground">
            <Button type="button" variant="ghost" size="icon-xs" onClick={goBack} disabled={!currentFolder} aria-label="Up one folder" className="text-muted-foreground">
              <ArrowLeft />
            </Button>
            <button type="button" onClick={() => setCurrentFolder('')} className={cn('shrink-0 px-1 hover:text-foreground', !currentFolder && 'text-foreground')}>
              {rootLabel.toLowerCase()}
            </button>
            <div className="flex min-w-0 items-center gap-0.5 overflow-hidden">
              {breadcrumbs.map((crumb, index) => (
                <span key={crumb.path} className="flex min-w-0 items-center gap-0.5">
                  <ChevronRight className="size-3 shrink-0 text-text-secondary" />
                  <button
                    type="button"
                    onClick={() => setCurrentFolder(crumb.path)}
                    className={cn('truncate px-1 hover:text-foreground', index === breadcrumbs.length - 1 && 'text-foreground')}
                  >
                    {crumb.name}
                  </button>
                </span>
              ))}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              onClick={refreshMedia}
              disabled={isLoading}
              aria-label="Refresh assets"
              className="ml-auto text-muted-foreground"
            >
              <RefreshCw className={cn(isLoading && 'animate-spin')} />
            </Button>
          </div>

          {isNamingFolder ? (
            <div className="flex gap-1.5">
              <Input
                autoFocus
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    createFolder()
                  }
                  if (e.key === 'Escape') setIsNamingFolder(false)
                }}
                placeholder="Folder name"
                className="h-8"
              />
              <Button type="button" size="sm" onClick={createFolder} disabled={isCreatingFolder || !newFolderName.trim()}>
                {isCreatingFolder ? <Loader2 className="size-3.5 animate-spin" /> : 'Create'}
              </Button>
              <Button type="button" variant="ghost" size="icon-sm" onClick={() => setIsNamingFolder(false)} aria-label="Cancel" className="text-muted-foreground">
                <X className="size-3.5" />
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-1.5">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsNamingFolder(true)} className="w-full">
                <FolderPlus className="size-3.5" />
                New folder
              </Button>
              <Button type="button" size="sm" asChild className={cn('w-full cursor-pointer', isUploading && 'pointer-events-none opacity-60')}>
                <label htmlFor={uploadId}>
                  {isUploading ? <Loader2 className="size-3.5 animate-spin" /> : <Upload className="size-3.5" />}
                  Upload
                </label>
              </Button>
              <input id={uploadId} type="file" accept="image/*" className="sr-only" onChange={uploadMedia} disabled={isUploading} />
            </div>
          )}

          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search assets…" className="pl-9" />
          </div>
        </div>

        <div className="grid flex-1 content-start grid-cols-2 gap-2.5 p-3">
          {filteredFolders.map((item) => (
            <button
              key={item.path}
              type="button"
              onClick={() => openFolder(item.path)}
              className="flex flex-col gap-2 rounded-lg border border-border bg-background p-2 text-left transition-colors hover:border-border-strong"
            >
              <span className="flex aspect-[16/10] items-center justify-center rounded-md bg-surface-card">
                <Folder className="size-6 text-muted-foreground" />
              </span>
              <span className="flex min-w-0 flex-col px-0.5">
                <span className="truncate text-xs font-medium text-foreground">{item.name}</span>
                <span className="text-[11px] text-muted-foreground">Folder</span>
              </span>
            </button>
          ))}

          {filteredMedia.map((item) => (
            <div key={item.path} className="group flex min-w-0 flex-col gap-2 rounded-lg border border-border bg-background p-2">
              <div className={cn('relative aspect-[16/10] overflow-hidden rounded-md', STRIPES)}>
                {item.publicUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.publicUrl} alt={item.name} className="h-full w-full object-cover" loading="lazy" />
                ) : null}
                <div className="absolute inset-0 flex items-center justify-center gap-1 bg-background/75 opacity-0 transition-opacity focus-within:opacity-100 group-hover:opacity-100">
                  <MediaAction label="Use as cover" onClick={() => applyAsCover(item)}>
                    <ImageIcon className="size-3.5" />
                  </MediaAction>
                  <MediaAction label="Insert in editor" onClick={() => insertInEditor(item)}>
                    <TextCursorInput className="size-3.5" />
                  </MediaAction>
                  <MediaAction label="Copy URL" onClick={() => copyUrl(item)}>
                    <Copy className="size-3.5" />
                  </MediaAction>
                </div>
              </div>
              <div className="flex min-w-0 flex-col px-0.5">
                <span className="truncate text-xs font-medium text-foreground">{item.name}</span>
                <span className="text-[11px] text-muted-foreground">{formatFileSize(item.size)}</span>
              </div>
            </div>
          ))}

          {!isLoading && filteredFolders.length === 0 && filteredMedia.length === 0 ? (
            <p className="col-span-2 py-10 text-center text-sm text-muted-foreground">
              {query ? 'No assets match your search.' : 'Nothing here yet. Upload an image or create a folder.'}
            </p>
          ) : null}

          {isLoading && filteredFolders.length === 0 && filteredMedia.length === 0 ? (
            <div className="col-span-2 flex items-center justify-center py-10">
              <LogoLoading size={36} />
            </div>
          ) : null}
        </div>

        <div className="sticky bottom-0 flex justify-between gap-2 border-t border-sidebar-border bg-surface-subtle px-3 py-2.5 text-[11px] text-muted-foreground">
          <span>Hover an image: cover · insert · copy URL</span>
          <span className="shrink-0 tabular-nums">
            {folders.length} {folders.length === 1 ? 'folder' : 'folders'} · {media.length} {media.length === 1 ? 'file' : 'files'}
          </span>
        </div>
      </div>
    </TooltipProvider>
  )
}
