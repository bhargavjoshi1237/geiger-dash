'use client'

import { useRef, useState } from 'react'
import { toast } from 'sonner'
import { ImagePlus, Link2, Loader2, Sparkles, Upload, X } from 'lucide-react'
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
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { callLlmChat, extractJson, useLlmConfig } from '@/components/content-studio/llm-config'
import { uploadStudioMediaAction } from '@/app/studio/posts/actions'
import { createGeneratedSeoPageAction } from '@/app/studio/pages/actions'
import { PAGE_PRODUCTS } from '@/lib/pages-studio/products'
import {
  PAGE_TYPE_OPTIONS,
  buildPageUserPrompt,
  getPageSkill,
  normalizeGeneratedPage,
} from '@/lib/pages-studio/skills'

const inputClassName = 'bg-background text-foreground placeholder:text-muted-foreground'
const textareaClassName = 'min-h-[120px] bg-background text-foreground placeholder:text-muted-foreground'

// Draft an SEO page with AI: pick the page type + product, describe the page in a
// brief, attach images (URL or direct upload to Supabase), then let the type's
// skill write it. The result is saved as an unpublished draft for review.
export function PageGenerateDialog({ open, onOpenChange, onGenerated }) {
  const { isConfigured, config } = useLlmConfig()
  const fileInputRef = useRef(null)
  const [pageType, setPageType] = useState('solution')
  const [product, setProduct] = useState(PAGE_PRODUCTS[0]?.value || '')
  const [brief, setBrief] = useState('')
  const [keywords, setKeywords] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [images, setImages] = useState([])
  const [status, setStatus] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [isBusy, setIsBusy] = useState(false)

  const reset = () => {
    setBrief('')
    setKeywords('')
    setImageUrl('')
    setImages([])
    setStatus('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleOpenChange = (next) => {
    if (isBusy) return
    if (!next) reset()
    onOpenChange(next)
  }

  const addImageUrl = () => {
    const trimmed = imageUrl.trim()
    if (!trimmed) return
    if (!/^https?:\/\//i.test(trimmed)) {
      toast.error('Enter a full image URL (https://…).')
      return
    }
    setImages((prev) => [...prev, { src: trimmed, alt: '' }])
    setImageUrl('')
  }

  const uploadImage = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.set('media_upload', file)
    formData.set('content_type', 'pages')
    formData.set('folder', 'generated')

    setIsUploading(true)
    const result = await uploadStudioMediaAction(formData)
    if (result.ok && result.media?.publicUrl) {
      setImages((prev) => [...prev, { src: result.media.publicUrl, alt: '' }])
      toast.success('Image uploaded')
    } else {
      toast.error(result.error || 'Upload failed.')
    }
    setIsUploading(false)
    event.target.value = ''
  }

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const run = async () => {
    if (!product) {
      toast.error('Choose a product first.')
      return
    }
    if (!brief.trim()) {
      toast.error('Add a short brief so the AI has something to work from.')
      return
    }
    if (!isConfigured) {
      toast.error('Connect an AI model first (AI model button).')
      return
    }

    const productEntry = PAGE_PRODUCTS.find((entry) => entry.value === product)

    setIsBusy(true)
    try {
      setStatus('Writing the page with AI…')
      const skill = getPageSkill(pageType)
      const text = await callLlmChat({
        config,
        temperature: 0.6,
        messages: [
          { role: 'system', content: skill.systemPrompt },
          {
            role: 'user',
            content: buildPageUserPrompt({
              pageType,
              productName: productEntry?.label || 'the product',
              brief,
              keywords,
              images,
            }),
          },
        ],
      })

      const page = normalizeGeneratedPage(extractJson(text), { images })
      if (!page) throw new Error('The model did not return a usable page. Try again.')

      setStatus('Saving draft…')
      const result = await createGeneratedSeoPageAction({ ...page, pageType, product })
      if (!result.ok) throw new Error(result.error)

      toast.success('Draft generated', { description: `${page.title} — review and publish` })
      onGenerated?.(result.page)
      reset()
      onOpenChange(false)
    } catch (error) {
      toast.error(error.message || 'Generation failed.')
      setStatus('')
    } finally {
      setIsBusy(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-indigo-400" />
            Generate a page with AI
          </DialogTitle>
          <DialogDescription>
            Pick the page type and product, describe what it should cover, attach any images, and
            AI writes an SEO landing page. It saves as a draft you review and publish.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Page type</Label>
              <Select value={pageType} onValueChange={setPageType} disabled={isBusy}>
                <SelectTrigger className={inputClassName}>
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
            </div>
            <div className="space-y-2">
              <Label>Product</Label>
              <Select value={product} onValueChange={setProduct} disabled={isBusy}>
                <SelectTrigger className={inputClassName}>
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
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="page-brief">Brief</Label>
            <Textarea
              id="page-brief"
              value={brief}
              onChange={(event) => setBrief(event.target.value)}
              placeholder="Who is this page for, the key features/benefits to cover, the angle, any real numbers or use-cases…"
              className={textareaClassName}
              disabled={isBusy}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="page-keywords">Target keywords</Label>
            <Input
              id="page-keywords"
              value={keywords}
              onChange={(event) => setKeywords(event.target.value)}
              placeholder="crm for agencies, client workflow (comma separated)"
              className={inputClassName}
              disabled={isBusy}
            />
          </div>

          <div className="space-y-2">
            <Label>Images</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Link2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={imageUrl}
                  onChange={(event) => setImageUrl(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault()
                      addImageUrl()
                    }
                  }}
                  placeholder="Paste an image URL"
                  className={`${inputClassName} pl-9`}
                  disabled={isBusy}
                />
              </div>
              <Button type="button" variant="outline" onClick={addImageUrl} disabled={isBusy}>
                <ImagePlus className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isBusy || isUploading}
                className="gap-2"
              >
                {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                Upload
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={uploadImage}
                className="sr-only"
              />
            </div>
            {images.length ? (
              <div className="flex flex-wrap gap-2 pt-1">
                {images.map((image, index) => (
                  <div
                    key={`${image.src}-${index}`}
                    className="relative size-16 overflow-hidden rounded-md border border-border"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={image.src} alt="" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute right-0.5 top-0.5 rounded bg-black/60 p-0.5 text-white hover:bg-black/80"
                      aria-label="Remove image"
                    >
                      <X className="size-3" />
                    </button>
                  </div>
                ))}
              </div>
            ) : null}
            <p className="text-xs text-muted-foreground">
              Attached images are offered to the AI to place in the page; the first becomes the
              cover / social image.
            </p>
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
            Generate draft
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
