'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import { toast } from 'sonner'
import {
  Bold,
  Code,
  Code2,
  Eye,
  Heading1,
  Heading2,
  Heading3,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListOrdered,
  Maximize2,
  Minimize2,
  Minus,
  Pilcrow,
  Quote,
  Redo2,
  Sparkles,
  Strikethrough,
  Undo2,
  Unlink,
  WrapText,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { callLlmChat, useLlmConfig } from '@/components/content-studio/llm-config'

function ToolbarButton({ active = false, label, children, ...props }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          size="icon-sm"
          variant="ghost"
          className={`border border-transparent text-muted-foreground hover:border-border-strong hover:bg-surface-hover hover:text-foreground ${
            active ? 'border-zinc-600 bg-surface-hover text-foreground' : ''
          }`}
          {...props}
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}

const editorSurfaceClass =
  'prose prose-invert min-h-[460px] min-w-0 max-w-full overflow-x-hidden break-words rounded-md border border-border bg-background px-6 py-5 text-sm leading-relaxed text-foreground focus:outline-none [&_a]:break-all [&_a]:text-blue-300 [&_blockquote]:border-l-zinc-600 [&_blockquote]:text-muted-foreground [&_code]:rounded [&_code]:bg-surface-hover [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-[0.85em] [&_h1]:text-2xl [&_h1]:font-bold [&_h2]:text-xl [&_h2]:font-semibold [&_h3]:text-lg [&_h3]:font-semibold [&_hr]:border-border [&_img]:my-4 [&_img]:max-w-full [&_img]:rounded-lg [&_img]:border [&_img]:border-border [&_pre]:max-w-full [&_pre]:overflow-x-auto [&_pre]:bg-surface-subtle [&_pre]:border [&_pre]:border-border'

const AI_SYSTEM_PROMPT =
  'You are an expert technical blog writer for a modern SaaS product suite. ' +
  'Write clear, engaging, well-structured content. ' +
  'Return clean semantic HTML only (use <h2>, <h3>, <p>, <ul>, <ol>, <li>, <strong>, <em>, <blockquote>, <pre><code>). ' +
  'Do NOT include <html>, <head>, <body>, markdown fences, or commentary — only the article fragment.'

function stripFences(value) {
  return String(value || '')
    .replace(/^```(?:html)?\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim()
}

function countWords(text) {
  const clean = String(text || '').trim()
  if (!clean) return 0
  return clean.split(/\s+/).filter(Boolean).length
}

function AiAssist({ editor }) {
  const { isConfigured, config } = useLlmConfig()
  const [open, setOpen] = useState(false)
  const [prompt, setPrompt] = useState('')
  const [draft, setDraft] = useState('')
  const [selectionText, setSelectionText] = useState('')
  const [selectionRange, setSelectionRange] = useState(null)
  const [isStreaming, setIsStreaming] = useState(false)
  const abortRef = useRef(null)

  const handleOpenChange = (nextOpen) => {
    if (nextOpen && editor) {
      const { from, to } = editor.state.selection
      const selected = editor.state.doc.textBetween(from, to, ' ').trim()
      if (selected) {
        setSelectionText(selected)
        setSelectionRange({ from, to })
      }
    }
    setOpen(nextOpen)
  }

  const run = async () => {
    if (!prompt.trim()) {
      toast.error('Describe what you want to write')
      return
    }
    if (!isConfigured) {
      toast.error('Connect an AI model first (AI Settings)')
      return
    }
    setIsStreaming(true)
    setDraft('')
    abortRef.current = new AbortController()

    const context = selectionText
      ? `The user selected this passage to work from:\n"""\n${selectionText}\n"""\n\n`
      : ''

    try {
      await callLlmChat({
        config,
        temperature: 0.7,
        signal: abortRef.current.signal,
        messages: [
          { role: 'system', content: AI_SYSTEM_PROMPT },
          { role: 'user', content: `${context}Task: ${prompt.trim()}` },
        ],
        onToken: (_token, full) => setDraft(stripFences(full)),
      })
    } catch (error) {
      if (error.name !== 'AbortError') toast.error(error.message)
    } finally {
      setIsStreaming(false)
    }
  }

  const stop = () => abortRef.current?.abort()

  const insert = (replace) => {
    const html = stripFences(draft)
    if (!html || !editor) return
    const chain = editor.chain().focus()
    if (replace && selectionRange) {
      const maxPosition = editor.state.doc.content.size
      chain
        .setTextSelection({
          from: Math.min(selectionRange.from, maxPosition),
          to: Math.min(selectionRange.to, maxPosition),
        })
        .deleteSelection()
    }
    chain.insertContent(html).run()
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="gap-1.5 border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 hover:text-indigo-200"
            >
              <Sparkles className="h-4 w-4" />
              AI
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>Write or rewrite with AI</TooltipContent>
      </Tooltip>

      <DialogContent className="max-h-[85dvh] max-w-3xl overflow-hidden p-0">
        <DialogHeader className="border-b border-border px-6 py-5 pr-12">
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="size-4 text-indigo-400" />
            AI writing assistant
          </DialogTitle>
          <DialogDescription>
            Generate, refine, and insert formatted article content. Your workspace is preserved when this dialog closes.
          </DialogDescription>
        </DialogHeader>

        <div className="grid min-h-0 gap-5 overflow-y-auto px-6 py-5 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div className="min-w-0 space-y-4">
            {selectionText ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <Label>Selected text</Label>
                  <span className="text-xs text-muted-foreground">
                    {countWords(selectionText)} words
                  </span>
                </div>
                <div className="max-h-40 overflow-y-auto whitespace-pre-wrap rounded-md border border-border bg-muted/40 p-3 text-sm leading-relaxed text-muted-foreground">
                  {selectionText}
                </div>
              </div>
            ) : null}

            <div className="space-y-2">
              <Label htmlFor="ai-writing-prompt">Instructions</Label>
              <Textarea
                id="ai-writing-prompt"
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                placeholder={
                  selectionText
                    ? 'Rewrite this to be more concise and add a heading'
                    : 'Write an intro about real-time collaboration in Geiger Flow'
                }
                rows={8}
                className="min-h-44 resize-y border-border bg-background text-sm text-foreground"
              />
            </div>

            {!isConfigured ? (
              <p className="rounded-md border border-amber-500/20 bg-amber-500/10 p-3 text-xs text-amber-400">
                No AI model connected yet. Open AI Settings to add one.
              </p>
            ) : null}

            <div>
            {isStreaming ? (
              <Button type="button" size="sm" variant="outline" onClick={stop}>
                Stop
              </Button>
            ) : (
              <Button type="button" size="sm" variant="outline" onClick={run} disabled={!isConfigured}>
                <Sparkles className="h-3.5 w-3.5" />
                {draft ? 'Regenerate' : 'Generate'}
              </Button>
            )}
            </div>
          </div>

          <div className="flex min-h-72 min-w-0 flex-col gap-2">
            <div className="flex items-center justify-between gap-3">
              <Label>Generated content</Label>
              {draft ? (
                <span className="text-xs text-muted-foreground">
                  {countWords(stripFences(draft).replace(/<[^>]+>/g, ' '))} words
                </span>
              ) : null}
            </div>
            <div
              className="prose prose-invert min-h-64 flex-1 overflow-y-auto rounded-md border border-border bg-muted/30 p-4 text-sm leading-relaxed text-foreground [&_h2]:text-lg [&_h2]:font-semibold [&_h3]:text-base [&_h3]:font-semibold"
              dangerouslySetInnerHTML={{
                __html: draft
                  ? stripFences(draft)
                  : '<p class="text-muted-foreground">Generated text will appear here.</p>',
              }}
            />
          </div>
        </div>

        <DialogFooter className="border-t border-border px-6 py-4">
          {selectionText ? (
            <Button
              type="button"
              variant="outline"
              onClick={() => insert(true)}
              disabled={!draft || isStreaming}
            >
              Replace selection
            </Button>
          ) : null}
          <Button type="button" onClick={() => insert(false)} disabled={!draft || isStreaming}>
            Insert at cursor
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function TiptapBlogEditor({ name, defaultValue }) {
  const [html, setHtml] = useState(defaultValue || '')
  const [imageSrc, setImageSrc] = useState('')
  const [activeView, setActiveView] = useState('write')
  const [isFullscreen, setIsFullscreen] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        link: {
          openOnClick: false,
          autolink: true,
          defaultProtocol: 'https',
          HTMLAttributes: {
            class: 'text-blue-300 underline underline-offset-4',
            rel: 'noopener noreferrer nofollow',
            target: '_blank',
          },
        },
      }),
      Image.configure({ inline: false, allowBase64: true }),
    ],
    content: defaultValue || '',
    editorProps: {
      attributes: { class: editorSurfaceClass },
    },
    onUpdate: ({ editor: activeEditor }) => {
      setHtml(activeEditor.getHTML())
    },
    immediatelyRender: false,
  })

  useEffect(() => {
    if (!editor) return
    const next = defaultValue || ''
    if (editor.getHTML() !== next) {
      editor.commands.setContent(next)
    }
  }, [defaultValue, editor])

  useEffect(() => {
    if (!editor) return
    function handleInsertImage(event) {
      const media = event.detail
      if (!media?.publicUrl) return
      editor.chain().focus().setImage({ src: media.publicUrl, alt: media.name || '' }).run()
      toast.success('Image inserted')
    }
    window.addEventListener('content-studio:insert-image', handleInsertImage)
    return () => window.removeEventListener('content-studio:insert-image', handleInsertImage)
  }, [editor])

  // Allow Esc to leave fullscreen.
  useEffect(() => {
    if (!isFullscreen) return
    const onKey = (e) => e.key === 'Escape' && setIsFullscreen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isFullscreen])

  const stats = useMemo(() => {
    const text = String(html || '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
    const words = countWords(text)
    return {
      words,
      chars: text.length,
      minutes: Math.max(1, Math.round(words / 200)),
    }
  }, [html])

  const canInsertImage = imageSrc.trim().length > 0

  function addImageBySrc() {
    const src = imageSrc.trim()
    if (!src || !editor) return
    editor.chain().focus().setImage({ src }).run()
    setImageSrc('')
  }

  function setLink() {
    if (!editor) return
    const previousUrl = editor.getAttributes('link').href || 'https://'
    const url = window.prompt('Link URL', previousUrl)
    if (url === null) return
    if (url.trim() === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url.trim() }).run()
  }

  function handleHtmlChange(event) {
    const nextHtml = event.target.value
    setHtml(nextHtml)
    editor?.commands.setContent(nextHtml)
  }

  function insertUploadedImage(event) {
    const file = event.target.files?.[0]
    if (!file || !editor) return
    const reader = new FileReader()
    reader.onload = () => {
      const src = String(reader.result || '')
      if (src) editor.chain().focus().setImage({ src, alt: file.name }).run()
    }
    reader.readAsDataURL(file)
    event.target.value = ''
  }

  const shell = isFullscreen
    ? 'fixed inset-0 z-50 flex min-w-0 flex-col gap-3 overflow-x-hidden overflow-y-auto bg-background p-4'
    : 'min-w-0 max-w-full space-y-3 overflow-x-hidden'

  return (
    <TooltipProvider delayDuration={300}>
      <div className={shell}>
        <input type="hidden" name={name} value={html} />

        <Tabs value={activeView} onValueChange={setActiveView} className="min-w-0 max-w-full flex-1 space-y-3 overflow-x-hidden">
          {/* Toolbar */}
          <div className="sticky top-0 z-10 flex min-w-0 max-w-full flex-wrap items-center justify-between gap-3 overflow-hidden rounded-lg border border-border bg-surface-subtle/90 p-2 backdrop-blur">
            <div className="flex min-w-0 flex-wrap items-center gap-0.5">
              <ToolbarButton label="Undo" onClick={() => editor?.chain().focus().undo().run()} disabled={!editor?.can().undo()}>
                <Undo2 />
              </ToolbarButton>
              <ToolbarButton label="Redo" onClick={() => editor?.chain().focus().redo().run()} disabled={!editor?.can().redo()}>
                <Redo2 />
              </ToolbarButton>
              <Separator orientation="vertical" className="mx-1 h-7 bg-surface-hover" />
              <ToolbarButton label="Paragraph" active={editor?.isActive('paragraph')} onClick={() => editor?.chain().focus().setParagraph().run()}>
                <Pilcrow />
              </ToolbarButton>
              <ToolbarButton label="Heading 1" active={editor?.isActive('heading', { level: 1 })} onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}>
                <Heading1 />
              </ToolbarButton>
              <ToolbarButton label="Heading 2" active={editor?.isActive('heading', { level: 2 })} onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}>
                <Heading2 />
              </ToolbarButton>
              <ToolbarButton label="Heading 3" active={editor?.isActive('heading', { level: 3 })} onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}>
                <Heading3 />
              </ToolbarButton>
              <Separator orientation="vertical" className="mx-1 h-7 bg-surface-hover" />
              <ToolbarButton label="Bold" active={editor?.isActive('bold')} onClick={() => editor?.chain().focus().toggleBold().run()}>
                <Bold />
              </ToolbarButton>
              <ToolbarButton label="Italic" active={editor?.isActive('italic')} onClick={() => editor?.chain().focus().toggleItalic().run()}>
                <Italic />
              </ToolbarButton>
              <ToolbarButton label="Strikethrough" active={editor?.isActive('strike')} onClick={() => editor?.chain().focus().toggleStrike().run()}>
                <Strikethrough />
              </ToolbarButton>
              <ToolbarButton label="Inline code" active={editor?.isActive('code')} onClick={() => editor?.chain().focus().toggleCode().run()}>
                <Code />
              </ToolbarButton>
              <Separator orientation="vertical" className="mx-1 h-7 bg-surface-hover" />
              <ToolbarButton label="Bullet list" active={editor?.isActive('bulletList')} onClick={() => editor?.chain().focus().toggleBulletList().run()}>
                <List />
              </ToolbarButton>
              <ToolbarButton label="Numbered list" active={editor?.isActive('orderedList')} onClick={() => editor?.chain().focus().toggleOrderedList().run()}>
                <ListOrdered />
              </ToolbarButton>
              <ToolbarButton label="Quote" active={editor?.isActive('blockquote')} onClick={() => editor?.chain().focus().toggleBlockquote().run()}>
                <Quote />
              </ToolbarButton>
              <ToolbarButton label="Code block" active={editor?.isActive('codeBlock')} onClick={() => editor?.chain().focus().toggleCodeBlock().run()}>
                <Code2 />
              </ToolbarButton>
              <ToolbarButton label="Divider" onClick={() => editor?.chain().focus().setHorizontalRule().run()}>
                <Minus />
              </ToolbarButton>
              <Separator orientation="vertical" className="mx-1 h-7 bg-surface-hover" />
              <ToolbarButton label="Add link" active={editor?.isActive('link')} onClick={setLink}>
                <Link2 />
              </ToolbarButton>
              <ToolbarButton label="Remove link" onClick={() => editor?.chain().focus().unsetLink().run()} disabled={!editor?.isActive('link')}>
                <Unlink />
              </ToolbarButton>
            </div>

            <div className="flex min-w-0 max-w-full flex-wrap items-center gap-2">
              <AiAssist editor={editor} />
              <ToolbarButton
                label={isFullscreen ? 'Exit fullscreen (Esc)' : 'Fullscreen'}
                onClick={() => setIsFullscreen((v) => !v)}
              >
                {isFullscreen ? <Minimize2 /> : <Maximize2 />}
              </ToolbarButton>
              <TabsList className="max-w-full bg-background">
                <TabsTrigger value="write" className="gap-1">
                  <Pilcrow className="h-3.5 w-3.5" />
                  Write
                </TabsTrigger>
                <TabsTrigger value="preview" className="gap-1">
                  <Eye className="h-3.5 w-3.5" />
                  Preview
                </TabsTrigger>
                <TabsTrigger value="html" className="gap-1">
                  <WrapText className="h-3.5 w-3.5" />
                  HTML
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          {/* Image insertion bar */}
          <div className="grid min-w-0 max-w-full gap-3 overflow-hidden rounded-lg border border-border bg-surface-subtle/40 p-3 md:grid-cols-[minmax(0,1fr)_auto]">
            <div className="flex min-w-0 gap-2">
              <Input
                value={imageSrc}
                onChange={(event) => setImageSrc(event.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addImageBySrc())}
                placeholder="Paste an image URL to place it in the article"
                className="border-border-strong bg-background text-foreground placeholder:text-foreground0"
              />
              <Button type="button" variant="outline" onClick={addImageBySrc} disabled={!canInsertImage}>
                <ImagePlus className="h-4 w-4" />
                Insert
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Label
                htmlFor={`${name}-inline-image`}
                className="inline-flex h-9 cursor-pointer items-center justify-center gap-2 rounded-md border border-border-strong bg-background px-3 text-sm text-foreground transition-colors hover:bg-surface-hover"
              >
                <ImagePlus className="h-4 w-4" />
                Upload inline
              </Label>
              <Input id={`${name}-inline-image`} type="file" accept="image/*" className="hidden" onChange={insertUploadedImage} />
            </div>
          </div>

          <TabsContent value="write" className="mt-0 min-w-0 max-w-full flex-1 overflow-x-hidden">
            <EditorContent editor={editor} />
          </TabsContent>

          <TabsContent value="preview" className="mt-0 min-w-0 max-w-full flex-1 overflow-x-hidden">
            <div
              className={editorSurfaceClass}
              dangerouslySetInnerHTML={{
                __html: html || '<p class="text-foreground0">Your formatted post preview will appear here.</p>',
              }}
            />
          </TabsContent>

          <TabsContent value="html" className="mt-0 min-w-0 max-w-full flex-1 overflow-x-hidden">
            <Textarea
              value={html}
              onChange={handleHtmlChange}
              spellCheck={false}
              className="min-h-[460px] resize-y border-border bg-background font-mono text-xs leading-6 text-foreground placeholder:text-foreground0"
              placeholder="<h2>Write with HTML</h2>"
            />
          </TabsContent>
        </Tabs>

        {/* Status bar */}
        <div className="flex items-center justify-between rounded-md border border-border bg-surface-subtle/60 px-3 py-1.5 text-[11px] text-foreground0">
          <span>
            {stats.words} words · {stats.chars} characters
          </span>
          <span>~{stats.minutes} min read</span>
        </div>
      </div>
    </TooltipProvider>
  )
}
