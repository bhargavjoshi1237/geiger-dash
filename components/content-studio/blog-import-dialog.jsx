'use client'

import { useRef, useState } from 'react'
import { toast } from 'sonner'
import { Download, FileText, Link2, Loader2, Sparkles, Upload } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { callLlmChat, extractJson, useLlmConfig } from '@/components/content-studio/llm-config'
import { extractArticleAction, createImportedBlogPostAction } from '@/app/studio/posts/actions'
import {
  BLOG_IMPORT_SYSTEM_PROMPT,
  buildBlogImportUserPrompt,
  normalizeImportedPost,
} from '@/lib/blog-import/skill-prompt'

const inputClassName = 'bg-background text-foreground placeholder:text-muted-foreground'
const ACCEPTED = '.html,.htm,.md,.markdown,.txt'

function fileExtension(file) {
  const parts = String(file?.name || '').toLowerCase().split('.')
  return parts.length > 1 ? parts.at(-1) : ''
}

function readFileText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result || ''))
    reader.onerror = () => reject(new Error('Could not read that file.'))
    reader.readAsText(file)
  })
}

// Turn a source blog/benchmark URL or file into readable article text plus any
// image links: URLs and HTML go through the server extractor; md/txt are used
// verbatim (their inline image URLs already survive in the text).
async function resolveSource({ url, file }) {
  if (url) {
    const result = await extractArticleAction({ url })
    if (!result.ok) throw new Error(result.error)
    return { text: result.text, images: result.images || [] }
  }

  const ext = fileExtension(file)
  const raw = await readFileText(file)
  if (!raw.trim()) throw new Error('That file is empty.')

  if (ext === 'html' || ext === 'htm') {
    const result = await extractArticleAction({ html: raw })
    if (!result.ok) throw new Error(result.error)
    return { text: result.text, images: result.images || [] }
  }
  return { text: raw, images: [] }
}

// Import a source article, rewrite it into an original post with the configured
// model + benchmark-blog-rewriter rules, then publish it live for editing.
export function BlogImportDialog({ open, onOpenChange, categories = [], onPublished }) {
  const { isConfigured, config } = useLlmConfig()
  const fileInputRef = useRef(null)
  const [url, setUrl] = useState('')
  const [file, setFile] = useState(null)
  const [status, setStatus] = useState('')
  const [isBusy, setIsBusy] = useState(false)

  const reset = () => {
    setUrl('')
    setFile(null)
    setStatus('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleOpenChange = (next) => {
    if (isBusy) return
    if (!next) reset()
    onOpenChange(next)
  }

  const pickFile = (event) => {
    const selected = event.target.files?.[0] || null
    setFile(selected)
    if (selected) setUrl('')
  }

  const run = async () => {
    const trimmedUrl = url.trim()
    if (!trimmedUrl && !file) {
      toast.error('Paste a URL or choose a file first.')
      return
    }
    if (!isConfigured) {
      toast.error('Connect an AI model first (AI model button).')
      return
    }

    setIsBusy(true)
    try {
      setStatus(trimmedUrl ? 'Downloading source article…' : 'Reading file…')
      const { text: sourceText, images } = await resolveSource({ url: trimmedUrl, file })
      const categoryNames = categories.map((category) => category.name)

      setStatus('Writing the post with AI…')
      const text = await callLlmChat({
        config,
        temperature: 0.6,
        messages: [
          { role: 'system', content: BLOG_IMPORT_SYSTEM_PROMPT },
          {
            role: 'user',
            content: buildBlogImportUserPrompt({
              sourceText,
              categories: categoryNames,
              images,
            }),
          },
        ],
      })

      const post = normalizeImportedPost(extractJson(text), {
        categories: categoryNames,
        images,
      })
      if (!post) throw new Error('The model did not return a usable post. Try again.')

      setStatus('Publishing…')
      const result = await createImportedBlogPostAction(post)
      if (!result.ok) throw new Error(result.error)

      // Hand the parent a row-shaped record so it can open the post for editing
      // immediately, before the server refetch lands.
      toast.success('Post imported and published', { description: post.title })
      onPublished?.({
        id: result.id,
        slug: result.slug,
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        category: post.category,
        tags: post.tags,
        featured_image: post.featuredImage || null,
        is_published: true,
        is_featured: false,
        published_at: new Date().toISOString(),
        reading_time_minutes: post.readingTimeMinutes || 0,
      })
      reset()
      onOpenChange(false)
    } catch (error) {
      toast.error(error.message || 'Import failed.')
      setStatus('')
    } finally {
      setIsBusy(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-4 w-4 text-indigo-400" />
            Import a post
          </DialogTitle>
          <DialogDescription>
            Give a blog/benchmark link or a file, and AI rewrites it into an original,
            attributed post that publishes live — edit it afterwards.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="import-url">Source URL</Label>
            <div className="relative">
              <Link2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="import-url"
                value={url}
                onChange={(event) => {
                  setUrl(event.target.value)
                  if (event.target.value) setFile(null)
                }}
                placeholder="https://example.com/benchmark-article"
                className={`${inputClassName} pl-9`}
                disabled={isBusy}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="h-px flex-1 bg-border" />
            <span className="text-xs uppercase tracking-wider text-muted-foreground">or</span>
            <span className="h-px flex-1 bg-border" />
          </div>

          <div className="space-y-2">
            <Label>Upload a file</Label>
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isBusy}
                className="gap-2"
              >
                <Upload className="h-4 w-4" />
                Choose file
              </Button>
              <span className="flex min-w-0 items-center gap-1.5 truncate text-sm text-muted-foreground">
                {file ? <FileText className="h-3.5 w-3.5 shrink-0" /> : null}
                {file ? file.name : 'No file selected'}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Accepts .html, .md, or .txt files.</p>
            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPTED}
              onChange={pickFile}
              className="sr-only"
            />
          </div>

          {!isConfigured ? (
            <p className="rounded-md border border-amber-500/20 bg-amber-500/10 p-3 text-xs text-amber-400">
              No AI model connected. Use the AI model button in the top bar to add one.
            </p>
          ) : null}

          {status ? (
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              {status}
            </p>
          ) : null}
        </div>

        <DialogFooter>
          <Button type="button" variant="ghost" onClick={() => handleOpenChange(false)} disabled={isBusy}>
            Cancel
          </Button>
          <Button type="button" onClick={run} disabled={isBusy || !isConfigured} className="gap-2">
            {isBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            Generate &amp; publish
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
