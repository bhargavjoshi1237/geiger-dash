'use client'

// Content fields for one announcement slide: image, badge, copy, primary button and secondary link.

import { useId, useState } from 'react'
import { toast } from 'sonner'
import { Image as ImageIcon, Images, Loader2, Upload, X } from 'lucide-react'
import { Button, Field, Input, Textarea, cn } from '@geiger/ui'
import { uploadStudioMediaAction } from '@/app/studio/posts/actions'
import { CountedLabel, SwitchRow } from '@/components/content-studio/editor-kit'

const STRIPES = 'bg-[repeating-linear-gradient(45deg,rgb(128_128_128/0.08)_0_1px,transparent_1px_10px)] bg-surface-card'

function ImageField({ value, onChange, onBrowse }) {
  const inputId = useId()
  const [uploading, setUploading] = useState(false)

  const upload = async (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    const formData = new FormData()
    formData.set('media_upload', file)
    formData.set('content_type', 'announcements')
    formData.set('folder', 'library')
    setUploading(true)
    const result = await uploadStudioMediaAction(formData)
    setUploading(false)
    if (!result.ok) {
      toast.error(result.error || 'Upload failed.')
      return
    }
    onChange(result.media.publicUrl)
  }

  return (
    <div className="grid gap-3 sm:grid-cols-[200px_minmax(0,1fr)]">
      <div className={cn('relative flex aspect-video items-center justify-center overflow-hidden rounded-lg border border-border', !value && STRIPES)}>
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <span className="flex items-center gap-2 text-xs text-muted-foreground">
            <ImageIcon className="size-4" />
            No image
          </span>
        )}
        {value ? (
          <Button type="button" variant="outline" size="icon-xs" onClick={() => onChange('')} aria-label="Remove image" className="absolute right-2 top-2">
            <X />
          </Button>
        ) : null}
      </div>
      <div className="flex min-w-0 flex-col gap-2">
        <div className="grid grid-cols-2 gap-1.5">
          <Button type="button" variant="outline" size="sm" asChild className={cn('w-full cursor-pointer', uploading && 'pointer-events-none opacity-60')}>
            <label htmlFor={inputId}>
              {uploading ? <Loader2 className="size-3.5 animate-spin" /> : <Upload className="size-3.5" />}
              Upload
            </label>
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={onBrowse} className="w-full">
            <Images className="size-3.5" />
            From library
          </Button>
        </div>
        <input id={inputId} type="file" accept="image/*" onChange={upload} disabled={uploading} className="sr-only" />
        <Input value={value} onChange={(event) => onChange(event.target.value)} placeholder="…or paste an image URL" aria-label="Image URL" />
        <p className="text-xs text-muted-foreground">Optional. Illustrations work best on a white or black background (Design tab).</p>
      </div>
    </div>
  )
}

function SectionHeading({ title, aside }) {
  return (
    <div className="mt-7 flex items-baseline gap-2.5 border-b border-border pb-3">
      <span className="text-[15px] font-semibold text-foreground">{title}</span>
      {aside ? <span className="text-xs text-muted-foreground">{aside}</span> : null}
    </div>
  )
}

export function SlideFields({ slide, onChange, onBrowseMedia, isCarousel, isLast }) {
  const set = (key) => (value) => onChange({ ...slide, [key]: value })
  const setText = (key) => (event) => set(key)(event.target.value)
  const showsNext = isCarousel && !isLast

  return (
    <div className="flex flex-col">
      <SectionHeading title="Image" />
      <div className="mt-4 flex flex-col gap-3">
        <ImageField value={slide.imageUrl} onChange={set('imageUrl')} onBrowse={onBrowseMedia} />
        {slide.imageUrl ? (
          <Field label="Alt text" hint="Describes the image for screen readers; leave empty if it's decorative." className="gap-1.5">
            <Input value={slide.imageAlt} onChange={setText('imageAlt')} placeholder="People celebrating with books and papers" />
          </Field>
        ) : null}
      </div>

      <SectionHeading title="Copy" />
      <div className="mt-4 grid gap-4">
        <Field label="Badge" hint="A short tag above the title, e.g. “Save 50%” or “New”." className="gap-1.5">
          <Input value={slide.badge} onChange={setText('badge')} placeholder="New" maxLength={60} />
        </Field>
        <div className="flex flex-col gap-1.5">
          <CountedLabel label="Title" required count={slide.title.length} limit={70} />
          <Input value={slide.title} onChange={setText('title')} placeholder="Get more done this quarter" maxLength={160} aria-label="Title" />
        </div>
        <div className="flex flex-col gap-1.5">
          <CountedLabel label="Body" count={slide.body.length} limit={220} />
          <Textarea value={slide.body} onChange={setText('body')} rows={3} placeholder="One or two sentences on what's new and why it matters." maxLength={1200} aria-label="Body" />
        </div>
      </div>

      <SectionHeading title={showsNext ? 'Navigation' : 'Primary button'} aside={showsNext ? 'Middle slides step forward' : 'Leave the link empty to just close'} />
      <div className="mt-4 grid gap-4">
        {showsNext ? (
          <Field label="Next button label" className="gap-1.5">
            <Input value={slide.nextLabel} onChange={setText('nextLabel')} placeholder="Next" maxLength={30} />
          </Field>
        ) : (
          <>
            <div className="grid gap-3 sm:grid-cols-[180px_minmax(0,1fr)]">
              <Field label="Label" className="gap-1.5">
                <Input value={slide.primaryLabel} onChange={setText('primaryLabel')} placeholder="Claim offer" maxLength={40} />
              </Field>
              <Field label="Link" className="gap-1.5">
                <Input value={slide.primaryUrl} onChange={setText('primaryUrl')} placeholder="/pricing or https://…" />
              </Field>
            </div>
            <SwitchRow title="Open in a new tab" checked={slide.primaryNewTab} onCheckedChange={set('primaryNewTab')} />
          </>
        )}
      </div>

      <SectionHeading title="Secondary link" aside="Optional, e.g. “Learn more”" />
      <div className="mt-4 grid gap-4">
        <div className="grid gap-3 sm:grid-cols-[180px_minmax(0,1fr)]">
          <Field label="Label" className="gap-1.5">
            <Input value={slide.secondaryLabel} onChange={setText('secondaryLabel')} placeholder="Learn more" maxLength={40} />
          </Field>
          <Field label="Link" className="gap-1.5">
            <Input value={slide.secondaryUrl} onChange={setText('secondaryUrl')} placeholder="https://…" />
          </Field>
        </div>
        <SwitchRow title="Open in a new tab" description="A link that opens in this tab closes the announcement." checked={slide.secondaryNewTab} onCheckedChange={set('secondaryNewTab')} />
      </div>
    </div>
  )
}
