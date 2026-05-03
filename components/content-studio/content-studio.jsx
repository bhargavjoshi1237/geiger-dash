'use client'

import { useMemo, useState } from 'react'
import { Save, FileText, Megaphone, PlusCircle, Copy, ExternalLink } from 'lucide-react'
import { saveBlogPostAction, saveChangelogAction } from '@/app/studio/posts/actions'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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

function toDateTimeLocal(value) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const pad = (n) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(
    date.getMinutes()
  )}`
}

function toDateInput(value) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const pad = (n) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

function splitByType(items, type) {
  return (items || [])
    .filter((item) => item.type === type)
    .map((item) => item.description)
    .join('\n')
}

function getBlogDraft(record, currentUserId) {
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
      image_path: `${currentUserId}/blog/new-post/latest.jpg`,
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

function getChangelogDraft(record, currentUserId) {
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
      image_path: `${currentUserId}/changelog/new-release/latest.jpg`,
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

function StorageHelper({ currentUserId, activeTab }) {
  const [bucket, setBucket] = useState('pfp')
  const [path, setPath] = useState(
    activeTab === 'blog'
      ? `${currentUserId}/blog/your-post/latest.jpg`
      : `${currentUserId}/changelog/your-release/latest.jpg`
  )

  const publicUrl = useMemo(() => {
    const base = process.env.NEXT_PUBLIC_SUPABASE_URL
    if (!base || !bucket || !path) return ''
    return `${base}/storage/v1/object/public/${bucket}/${String(path).replace(/^\/+/, '')}`
  }, [bucket, path])

  async function copyPublicUrl() {
    if (!publicUrl) return
    await navigator.clipboard.writeText(publicUrl)
  }

  return (
    <Card className="border-zinc-800 bg-zinc-900/40">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Storage Access</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-1">
          <Label>Useful directories</Label>
          <div className="space-y-1 text-xs text-zinc-300">
            <p>`pfp/{currentUserId}/blog/`</p>
            <p>`pfp/{currentUserId}/changelog/`</p>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="storage-bucket">Bucket</Label>
          <Input id="storage-bucket" value={bucket} onChange={(e) => setBucket(e.target.value)} className="border-zinc-700 bg-zinc-950 text-zinc-100" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="storage-path">Object path</Label>
          <Input id="storage-path" value={path} onChange={(e) => setPath(e.target.value)} className="border-zinc-700 bg-zinc-950 text-zinc-100" />
        </div>

        <div className="space-y-2">
          <Label>Public URL</Label>
          <Textarea value={publicUrl} readOnly rows={3} className="border-zinc-700 bg-zinc-950 text-zinc-100" />
          <div className="flex gap-2">
            <Button type="button" size="sm" variant="outline" onClick={copyPublicUrl} className="gap-1">
              <Copy className="h-3.5 w-3.5" />
              Copy URL
            </Button>
            {publicUrl && (
              <Button type="button" size="sm" variant="outline" asChild className="gap-1">
                <a href={publicUrl} target="_blank" rel="noreferrer">
                  <ExternalLink className="h-3.5 w-3.5" />
                  Open
                </a>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function BlogForm({ blogDraft, categories, onReset, formKey }) {
  const [category, setCategory] = useState(blogDraft.category || '')
  const [isPublished, setIsPublished] = useState(blogDraft.is_published)
  const [isFeatured, setIsFeatured] = useState(blogDraft.is_featured)
  const inputClass = 'border-zinc-700 bg-zinc-950 text-zinc-100 placeholder:text-zinc-500'

  return (
    <form key={formKey} action={saveBlogPostAction} className="space-y-4">
      <input type="hidden" name="id" defaultValue={blogDraft.id} />
      <input type="hidden" name="existing_image_url" defaultValue={blogDraft.featured_image} />
      <input type="hidden" name="category" value={category} />
      <input type="hidden" name="is_published" value={isPublished ? 'on' : ''} />
      <input type="hidden" name="is_featured" value={isFeatured ? 'on' : ''} />

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="blog-title">Title</Label>
          <Input id="blog-title" required name="title" defaultValue={blogDraft.title} className={inputClass} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="blog-slug">Slug (optional)</Label>
          <Input id="blog-slug" name="slug" defaultValue={blogDraft.slug} className={inputClass} />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="blog-excerpt">Excerpt</Label>
        <Textarea id="blog-excerpt" required name="excerpt" rows={3} defaultValue={blogDraft.excerpt} className={inputClass} />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-1.5">
          <Label>Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className={inputClass}>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((entry) => (
                <SelectItem key={entry.id} value={entry.name}>
                  {entry.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="blog-tags">Tags</Label>
          <Input id="blog-tags" name="tags" defaultValue={blogDraft.tags} className={inputClass} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="blog-read-time">Read time</Label>
          <Input id="blog-read-time" type="number" min={1} name="reading_time_minutes" defaultValue={blogDraft.reading_time_minutes} className={inputClass} />
        </div>
      </div>

      <Card className="border-zinc-800 bg-zinc-950/70">
        <CardContent className="space-y-3 p-3 pt-3">
          <Label>Post content (Tiptap)</Label>
          <TiptapBlogEditor name="content" defaultValue={blogDraft.content} />
        </CardContent>
      </Card>

      <Card className="border-zinc-800 bg-zinc-950/70">
        <CardContent className="space-y-3 p-3 pt-3">
          <p className="text-sm font-medium text-zinc-200">Image source</p>
          <div className="grid gap-3 md:grid-cols-2">
            <Input name="image_bucket" defaultValue={blogDraft.image_bucket} placeholder="bucket" className={inputClass} />
            <Input name="image_path" defaultValue={blogDraft.image_path} placeholder="user-id/blog/slug/latest.jpg" className={inputClass} />
          </div>
          <Input name="image_url" defaultValue={blogDraft.image_url} placeholder="https://..." className={inputClass} />
          <Input name="image_upload" type="file" accept="image/*" className={inputClass} />
        </CardContent>
      </Card>

      <div className="grid gap-3 md:grid-cols-2">
        <Input type="datetime-local" name="published_at" defaultValue={blogDraft.published_at} className={inputClass} />
        <Card className="border-zinc-800 bg-zinc-950/70">
          <CardContent className="flex items-center gap-6 p-3 text-sm">
            <div className="flex items-center gap-2">
              <Switch checked={isPublished} onCheckedChange={setIsPublished} />
              <span>Published</span>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={isFeatured} onCheckedChange={setIsFeatured} />
              <span>Featured</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button type="submit" className="gap-2">
          <Save className="h-4 w-4" />
          {blogDraft.id ? 'Update blog post' : 'Create blog post'}
        </Button>
        <Button type="button" variant="outline" onClick={onReset}>
          Reset
        </Button>
      </div>
    </form>
  )
}

function ChangelogForm({ changelogDraft, onReset, formKey }) {
  const [category, setCategory] = useState(changelogDraft.category || 'feature')
  const [product, setProduct] = useState(changelogDraft.product || 'geiger-dash')
  const [isFeatured, setIsFeatured] = useState(changelogDraft.is_featured)
  const inputClass = 'border-zinc-700 bg-zinc-950 text-zinc-100 placeholder:text-zinc-500'

  return (
    <form key={formKey} action={saveChangelogAction} className="space-y-4">
      <input type="hidden" name="id" defaultValue={changelogDraft.id} />
      <input type="hidden" name="existing_image_url" defaultValue={changelogDraft.image_url} />
      <input type="hidden" name="category" value={category} />
      <input type="hidden" name="product" value={product} />
      <input type="hidden" name="is_featured" value={isFeatured ? 'on' : ''} />

      <div className="grid gap-4 md:grid-cols-2">
        <Input required name="version" defaultValue={changelogDraft.version} placeholder="Version" className={inputClass} />
        <Input type="date" name="release_date" defaultValue={changelogDraft.release_date} className={inputClass} />
      </div>

      <Input required name="title" defaultValue={changelogDraft.title} placeholder="Title" className={inputClass} />
      <Textarea required name="description" rows={3} defaultValue={changelogDraft.description} placeholder="Summary" className={inputClass} />

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1.5">
          <Label>Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className={inputClass}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="feature">feature</SelectItem>
              <SelectItem value="improvement">improvement</SelectItem>
              <SelectItem value="bugfix">bugfix</SelectItem>
              <SelectItem value="breaking">breaking</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label>Product</Label>
          <Select value={product} onValueChange={setProduct}>
            <SelectTrigger className={inputClass}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="geiger-flow">geiger-flow</SelectItem>
              <SelectItem value="geiger-notes">geiger-notes</SelectItem>
              <SelectItem value="geiger-dash">geiger-dash</SelectItem>
              <SelectItem value="geiger-dam">geiger-dam</SelectItem>
              <SelectItem value="geiger-grey">geiger-grey</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="border-zinc-800 bg-zinc-950/70">
        <CardContent className="p-3 pt-3">
          <p className="mb-2 text-sm font-medium text-zinc-200">Items (one per line)</p>
          <div className="grid gap-3 md:grid-cols-2">
            <Textarea name="items_added" rows={3} defaultValue={changelogDraft.items_added} placeholder="Added" className={inputClass} />
            <Textarea name="items_changed" rows={3} defaultValue={changelogDraft.items_changed} placeholder="Changed" className={inputClass} />
            <Textarea name="items_fixed" rows={3} defaultValue={changelogDraft.items_fixed} placeholder="Fixed" className={inputClass} />
            <div className="space-y-2">
              <Textarea name="items_removed" rows={2} defaultValue={changelogDraft.items_removed} placeholder="Removed" className={inputClass} />
              <Textarea name="items_deprecated" rows={2} defaultValue={changelogDraft.items_deprecated} placeholder="Deprecated" className={inputClass} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-zinc-800 bg-zinc-950/70">
        <CardContent className="space-y-3 p-3 pt-3">
          <p className="text-sm font-medium text-zinc-200">Image source</p>
          <div className="grid gap-3 md:grid-cols-2">
            <Input name="image_bucket" defaultValue={changelogDraft.image_bucket} placeholder="bucket" className={inputClass} />
            <Input name="image_path" defaultValue={changelogDraft.image_path} placeholder="user-id/changelog/release/latest.jpg" className={inputClass} />
          </div>
          <Input name="image_url" defaultValue={changelogDraft.image_url} placeholder="https://..." className={inputClass} />
          <Input name="image_upload" type="file" accept="image/*" className={inputClass} />
        </CardContent>
      </Card>

      <div className="flex items-center gap-2 text-sm">
        <Switch checked={isFeatured} onCheckedChange={setIsFeatured} />
        <span>Featured</span>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button type="submit" className="gap-2">
          <Save className="h-4 w-4" />
          {changelogDraft.id ? 'Update changelog' : 'Create changelog'}
        </Button>
        <Button type="button" variant="outline" onClick={onReset}>
          Reset
        </Button>
      </div>
    </form>
  )
}

export function ContentStudio({
  categories,
  posts,
  changelogs,
  initialTab = 'blog',
  saved = false,
  error = '',
  currentUserId,
}) {
  const [activeTab, setActiveTab] = useState(initialTab)
  const [editingBlogId, setEditingBlogId] = useState('')
  const [editingChangelogId, setEditingChangelogId] = useState('')
  const [blogRevision, setBlogRevision] = useState(0)
  const [changelogRevision, setChangelogRevision] = useState(0)

  const editingBlog = useMemo(() => posts.find((post) => post.id === editingBlogId), [editingBlogId, posts])
  const editingChangelog = useMemo(
    () => changelogs.find((entry) => entry.id === editingChangelogId),
    [editingChangelogId, changelogs]
  )

  const blogDraft = getBlogDraft(editingBlog, currentUserId)
  const changelogDraft = getChangelogDraft(editingChangelog, currentUserId)

  return (
    <div className="grid gap-6 lg:grid-cols-[1.35fr_1fr]">
      <Card className="border-zinc-800 bg-zinc-900/40">
        <CardHeader className="pb-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="bg-zinc-800/80">
                <TabsTrigger value="blog" className="gap-2">
                  <FileText className="h-4 w-4" />
                  Blog
                </TabsTrigger>
                <TabsTrigger value="changelog" className="gap-2">
                  <Megaphone className="h-4 w-4" />
                  Changelog
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <Badge variant="outline" className="border-zinc-700 text-zinc-300">
              shadcn controls + Tiptap + Supabase storage helper
            </Badge>
          </div>
          {saved && (
            <p className="mt-4 rounded-md border border-emerald-700/60 bg-emerald-500/10 p-2 text-sm text-emerald-300">
              Saved successfully.
            </p>
          )}
          {error && (
            <p className="mt-4 rounded-md border border-red-700/60 bg-red-500/10 p-2 text-sm text-red-300">Error: {error}</p>
          )}
        </CardHeader>

        <CardContent>
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

      <div className="space-y-6">
        <StorageHelper currentUserId={currentUserId} activeTab={activeTab} />

        <Card className="border-zinc-800 bg-zinc-900/40">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Blog Posts</CardTitle>
              <Button
                type="button"
                size="xs"
                variant="outline"
                className="gap-1"
                onClick={() => {
                  setActiveTab('blog')
                  setEditingBlogId('')
                  setBlogRevision((v) => v + 1)
                }}
              >
                <PlusCircle className="h-3.5 w-3.5" />
                New
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[280px] pr-2">
              <div className="space-y-2">
                {posts.map((post) => (
                  <Button
                    key={post.id}
                    type="button"
                    variant="outline"
                    className={`h-auto w-full justify-start whitespace-normal px-3 py-2 text-left ${
                      editingBlogId === post.id ? 'border-zinc-400 bg-zinc-800/80' : 'border-zinc-800 bg-zinc-900/70'
                    }`}
                    onClick={() => {
                      setActiveTab('blog')
                      setEditingBlogId(post.id)
                      setBlogRevision((v) => v + 1)
                    }}
                  >
                    <div>
                      <p className="line-clamp-1 text-sm font-medium text-zinc-100">{post.title}</p>
                      <p className="mt-1 line-clamp-1 text-xs text-zinc-400">{post.slug}</p>
                    </div>
                  </Button>
                ))}
                {posts.length === 0 && <p className="text-xs text-zinc-500">No blog posts yet.</p>}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="border-zinc-800 bg-zinc-900/40">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Changelog Entries</CardTitle>
              <Button
                type="button"
                size="xs"
                variant="outline"
                className="gap-1"
                onClick={() => {
                  setActiveTab('changelog')
                  setEditingChangelogId('')
                  setChangelogRevision((v) => v + 1)
                }}
              >
                <PlusCircle className="h-3.5 w-3.5" />
                New
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[280px] pr-2">
              <div className="space-y-2">
                {changelogs.map((entry) => (
                  <Button
                    key={entry.id}
                    type="button"
                    variant="outline"
                    className={`h-auto w-full justify-start whitespace-normal px-3 py-2 text-left ${
                      editingChangelogId === entry.id ? 'border-zinc-400 bg-zinc-800/80' : 'border-zinc-800 bg-zinc-900/70'
                    }`}
                    onClick={() => {
                      setActiveTab('changelog')
                      setEditingChangelogId(entry.id)
                      setChangelogRevision((v) => v + 1)
                    }}
                  >
                    <div>
                      <p className="line-clamp-1 text-sm font-medium text-zinc-100">{entry.title}</p>
                      <p className="mt-1 line-clamp-1 text-xs text-zinc-400">
                        v{entry.version} . {entry.product}
                      </p>
                    </div>
                  </Button>
                ))}
                {changelogs.length === 0 && <p className="text-xs text-zinc-500">No changelog entries yet.</p>}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
