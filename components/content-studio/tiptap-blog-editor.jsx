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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { callLlmChat, useLlmConfig } from '@/components/content-studio/llm-config'

function ToolbarButton({ active = false, label, children, ...props }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          size="icon-sm"
          variant="ghost"
          className={`border border-transparent text-zinc-300 hover:border-zinc-700 hover:bg-zinc-800 hover:text-zinc-50 ${
            active ? 'border-zinc-600 bg-zinc-800 text-zinc-50' : ''
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
  'prose prose-invert max-w-none min-h-[460px] rounded-md border border-zinc-800 bg-zinc-950 px-6 py-5 text-sm leading-relaxed text-zinc-100 focus:outline-none [&_a]:text-blue-300 [&_blockquote]:border-l-zinc-600 [&_blockquote]:text-zinc-300 [&_code]:rounded [&_code]:bg-zinc-800 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-[0.85em] [&_h1]:text-2xl [&_h1]:font-bold [&_h2]:text-xl [&_h2]:font-semibold [&_h3]:text-lg [&_h3]:font-semibold [&_hr]:border-zinc-800 [&_img]:my-4 [&_img]:rounded-lg [&_img]:border [&_img]:border-zinc-800 [&_pre]:bg-zinc-900 [&_pre]:border [&_pre]:border-zinc-800'

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

// Inline AI writing assistant shown in a popover from the toolbar.
function AiAssist({ editor }) {
  const { isConfigured, config } = useLlmConfig()
  const [open, setOpen] = useState(false)
  const [prompt, setPrompt] = useState('')
  const [draft, setDraft] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const abortRef = useRef(null)

  const selectionText = editor
    ? editor.state.doc
        .textBetween(editor.state.selection.from, editor.state.selection.to, ' ')
        .trim()
    : ''

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
    if (replace && selectionText) chain.deleteSelection()
    chain.insertContent(html).run()
    setOpen(false)
    setPrompt('')
    setDraft('')
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="gap-1.5 border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 hover:text-indigo-200"
            >
              <Sparkles className="h-4 w-4" />
              AI
            </Button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent>Write or rewrite with AI</TooltipContent>
      </Tooltip>

      <PopoverContent align="end" className="w-[380px] border-zinc-800 bg-zinc-950 p-3">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-zinc-200">
            <Sparkles className="h-4 w-4 text-indigo-400" />
            AI writing assistant
          </div>

          {selectionText && (
            <p className="rounded-md border border-zinc-800 bg-zinc-900 px-2 py-1.5 text-[11px] text-zinc-400">
              Working from your selection ({countWords(selectionText)} words)
            </p>
          )}

          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={
              selectionText
                ? 'e.g. Rewrite this to be more concise and add a heading'
                : 'e.g. Write an intro about real-time collaboration in Geiger Flow'
            }
            rows={3}
            className="resize-none border-zinc-800 bg-zinc-950 text-sm text-zinc-100 placeholder:text-zinc-500"
          />

          {!isConfigured && (
            <p className="text-[11px] text-amber-400">
              No AI model connected yet. Open AI Settings to add one.
            </p>
          )}

          {draft && (
            <div
              className="max-h-48 overflow-y-auto rounded-md border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-xs leading-relaxed text-zinc-300 [&_h2]:text-sm [&_h2]:font-semibold [&_h3]:font-semibold"
              dangerouslySetInnerHTML={{ __html: stripFences(draft) }}
            />
          )}

          <div className="flex items-center justify-between gap-2">
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

            <div className="flex gap-2">
              {selectionText && (
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => insert(true)}
                  disabled={!draft || isStreaming}
                >
                  Replace
                </Button>
              )}
              <Button type="button" size="sm" onClick={() => insert(false)} disabled={!draft || isStreaming}>
                Insert
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
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
      setHtml(next)
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
    ? 'fixed inset-0 z-50 flex flex-col gap-3 overflow-y-auto bg-zinc-950 p-4'
    : 'space-y-3'

  return (
    <TooltipProvider delayDuration={300}>
      <div className={shell}>
        <input type="hidden" name={name} value={html} />

        <Tabs value={activeView} onValueChange={setActiveView} className="flex flex-1 flex-col space-y-3">
          {/* Toolbar */}
          <div className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-zinc-800 bg-zinc-900/90 p-2 backdrop-blur">
            <div className="flex flex-wrap items-center gap-0.5">
              <ToolbarButton label="Undo" onClick={() => editor?.chain().focus().undo().run()} disabled={!editor?.can().undo()}>
                <Undo2 />
              </ToolbarButton>
              <ToolbarButton label="Redo" onClick={() => editor?.chain().focus().redo().run()} disabled={!editor?.can().redo()}>
                <Redo2 />
              </ToolbarButton>
              <Separator orientation="vertical" className="mx-1 h-7 bg-zinc-800" />
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
              <Separator orientation="vertical" className="mx-1 h-7 bg-zinc-800" />
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
              <Separator orientation="vertical" className="mx-1 h-7 bg-zinc-800" />
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
              <Separator orientation="vertical" className="mx-1 h-7 bg-zinc-800" />
              <ToolbarButton label="Add link" active={editor?.isActive('link')} onClick={setLink}>
                <Link2 />
              </ToolbarButton>
              <ToolbarButton label="Remove link" onClick={() => editor?.chain().focus().unsetLink().run()} disabled={!editor?.isActive('link')}>
                <Unlink />
              </ToolbarButton>
            </div>

            <div className="flex items-center gap-2">
              <AiAssist editor={editor} />
              <ToolbarButton
                label={isFullscreen ? 'Exit fullscreen (Esc)' : 'Fullscreen'}
                onClick={() => setIsFullscreen((v) => !v)}
              >
                {isFullscreen ? <Minimize2 /> : <Maximize2 />}
              </ToolbarButton>
              <TabsList className="bg-zinc-950">
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
          <div className="grid gap-3 rounded-lg border border-zinc-800 bg-zinc-900/40 p-3 md:grid-cols-[1fr_auto]">
            <div className="flex gap-2">
              <Input
                value={imageSrc}
                onChange={(event) => setImageSrc(event.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addImageBySrc())}
                placeholder="Paste an image URL to place it in the article"
                className="border-zinc-700 bg-zinc-950 text-zinc-100 placeholder:text-zinc-500"
              />
              <Button type="button" variant="outline" onClick={addImageBySrc} disabled={!canInsertImage}>
                <ImagePlus className="h-4 w-4" />
                Insert
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Label
                htmlFor={`${name}-inline-image`}
                className="inline-flex h-9 cursor-pointer items-center justify-center gap-2 rounded-md border border-zinc-700 bg-zinc-950 px-3 text-sm text-zinc-200 transition-colors hover:bg-zinc-800"
              >
                <ImagePlus className="h-4 w-4" />
                Upload inline
              </Label>
              <Input id={`${name}-inline-image`} type="file" accept="image/*" className="hidden" onChange={insertUploadedImage} />
            </div>
          </div>

          <TabsContent value="write" className="mt-0 flex-1">
            <EditorContent editor={editor} />
          </TabsContent>

          <TabsContent value="preview" className="mt-0 flex-1">
            <div
              className={editorSurfaceClass}
              dangerouslySetInnerHTML={{
                __html: html || '<p class="text-zinc-500">Your formatted post preview will appear here.</p>',
              }}
            />
          </TabsContent>

          <TabsContent value="html" className="mt-0 flex-1">
            <Textarea
              value={html}
              onChange={handleHtmlChange}
              spellCheck={false}
              className="min-h-[460px] resize-y border-zinc-800 bg-zinc-950 font-mono text-xs leading-6 text-zinc-100 placeholder:text-zinc-500"
              placeholder="<h2>Write with HTML</h2>"
            />
          </TabsContent>
        </Tabs>

        {/* Status bar */}
        <div className="flex items-center justify-between rounded-md border border-zinc-800 bg-zinc-900/60 px-3 py-1.5 text-[11px] text-zinc-500">
          <span>
            {stats.words} words · {stats.chars} characters
          </span>
          <span>~{stats.minutes} min read</span>
        </div>
      </div>
    </TooltipProvider>
  )
}
