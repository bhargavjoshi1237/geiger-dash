'use client'

import { useEffect, useMemo, useState } from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import {
  Bold,
  Code2,
  Eye,
  Heading2,
  Heading3,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListOrdered,
  Minus,
  Pilcrow,
  Quote,
  Redo2,
  Strikethrough,
  Undo2,
  Unlink,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'

function ToolbarButton({ active = false, children, className = '', ...props }) {
  return (
    <Button
      type="button"
      size="icon-sm"
      variant={active ? 'secondary' : 'ghost'}
      className={`border border-transparent text-zinc-300 hover:border-zinc-700 hover:bg-zinc-800 hover:text-zinc-50 ${
        active ? 'border-zinc-600 bg-zinc-800 text-zinc-50' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </Button>
  )
}

const editorSurfaceClass =
  'prose prose-invert max-w-none min-h-[440px] rounded-md border border-zinc-800 bg-zinc-950 px-5 py-4 text-sm text-zinc-100 focus:outline-none [&_a]:text-blue-300 [&_blockquote]:border-l-zinc-600 [&_blockquote]:text-zinc-300 [&_code]:rounded [&_code]:bg-zinc-800 [&_code]:px-1 [&_h2]:text-xl [&_h2]:font-semibold [&_h3]:text-lg [&_h3]:font-semibold [&_hr]:border-zinc-800 [&_img]:my-4 [&_img]:rounded-lg [&_img]:border [&_img]:border-zinc-800'

export function TiptapBlogEditor({ name, defaultValue }) {
  const [html, setHtml] = useState(defaultValue || '')
  const [imageSrc, setImageSrc] = useState('')
  const [activeView, setActiveView] = useState('write')

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
      attributes: {
        class: editorSurfaceClass,
      },
    },
    onUpdate: ({ editor: activeEditor }) => {
      setHtml(activeEditor.getHTML())
    },
    immediatelyRender: false,
  })

  useEffect(() => {
    if (!editor) return
    const next = defaultValue || ''
    const current = editor.getHTML()
    if (current !== next) {
      editor.commands.setContent(next)
    }
  }, [defaultValue, editor])

  useEffect(() => {
    if (!editor) return

    function handleInsertImage(event) {
      const media = event.detail
      if (!media?.publicUrl) return
      editor.chain().focus().setImage({ src: media.publicUrl, alt: media.name || '' }).run()
    }

    window.addEventListener('content-studio:insert-image', handleInsertImage)
    return () => window.removeEventListener('content-studio:insert-image', handleInsertImage)
  }, [editor])

  const canInsertImage = useMemo(() => imageSrc.trim().length > 0, [imageSrc])

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
      if (src) {
        editor.chain().focus().setImage({ src, alt: file.name }).run()
      }
    }
    reader.readAsDataURL(file)
    event.target.value = ''
  }

  return (
    <div className="space-y-3">
      <input type="hidden" name={name} value={html} />

      <Tabs value={activeView} onValueChange={setActiveView} className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-zinc-800 bg-zinc-900/70 p-2">
          <div className="flex flex-wrap items-center gap-1">
            <ToolbarButton onClick={() => editor?.chain().focus().undo().run()} disabled={!editor?.can().undo()}>
              <Undo2 />
            </ToolbarButton>
            <ToolbarButton onClick={() => editor?.chain().focus().redo().run()} disabled={!editor?.can().redo()}>
              <Redo2 />
            </ToolbarButton>
            <Separator orientation="vertical" className="mx-1 h-7 bg-zinc-800" />
            <ToolbarButton active={editor?.isActive('paragraph')} onClick={() => editor?.chain().focus().setParagraph().run()}>
              <Pilcrow />
            </ToolbarButton>
            <ToolbarButton
              active={editor?.isActive('heading', { level: 2 })}
              onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
            >
              <Heading2 />
            </ToolbarButton>
            <ToolbarButton
              active={editor?.isActive('heading', { level: 3 })}
              onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
            >
              <Heading3 />
            </ToolbarButton>
            <Separator orientation="vertical" className="mx-1 h-7 bg-zinc-800" />
            <ToolbarButton active={editor?.isActive('bold')} onClick={() => editor?.chain().focus().toggleBold().run()}>
              <Bold />
            </ToolbarButton>
            <ToolbarButton active={editor?.isActive('italic')} onClick={() => editor?.chain().focus().toggleItalic().run()}>
              <Italic />
            </ToolbarButton>
            <ToolbarButton active={editor?.isActive('strike')} onClick={() => editor?.chain().focus().toggleStrike().run()}>
              <Strikethrough />
            </ToolbarButton>
            <ToolbarButton active={editor?.isActive('codeBlock')} onClick={() => editor?.chain().focus().toggleCodeBlock().run()}>
              <Code2 />
            </ToolbarButton>
            <Separator orientation="vertical" className="mx-1 h-7 bg-zinc-800" />
            <ToolbarButton active={editor?.isActive('bulletList')} onClick={() => editor?.chain().focus().toggleBulletList().run()}>
              <List />
            </ToolbarButton>
            <ToolbarButton active={editor?.isActive('orderedList')} onClick={() => editor?.chain().focus().toggleOrderedList().run()}>
              <ListOrdered />
            </ToolbarButton>
            <ToolbarButton active={editor?.isActive('blockquote')} onClick={() => editor?.chain().focus().toggleBlockquote().run()}>
              <Quote />
            </ToolbarButton>
            <ToolbarButton onClick={() => editor?.chain().focus().setHorizontalRule().run()}>
              <Minus />
            </ToolbarButton>
            <Separator orientation="vertical" className="mx-1 h-7 bg-zinc-800" />
            <ToolbarButton active={editor?.isActive('link')} onClick={setLink}>
              <Link2 />
            </ToolbarButton>
            <ToolbarButton onClick={() => editor?.chain().focus().unsetLink().run()} disabled={!editor?.isActive('link')}>
              <Unlink />
            </ToolbarButton>
          </div>

          <TabsList className="bg-zinc-950">
            <TabsTrigger value="write" className="gap-1">
              <Pilcrow className="h-3.5 w-3.5" />
              Write
            </TabsTrigger>
            <TabsTrigger value="html" className="gap-1">
              <Code2 className="h-3.5 w-3.5" />
              HTML
            </TabsTrigger>
            <TabsTrigger value="preview" className="gap-1">
              <Eye className="h-3.5 w-3.5" />
              Preview
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="grid gap-3 rounded-lg border border-zinc-800 bg-zinc-900/40 p-3 md:grid-cols-[1fr_auto]">
          <div className="flex gap-2">
            <Input
              value={imageSrc}
              onChange={(event) => setImageSrc(event.target.value)}
              placeholder="Paste image URL to place it inside the article"
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

        <TabsContent value="write" className="mt-0">
          <EditorContent editor={editor} />
        </TabsContent>

        <TabsContent value="html" className="mt-0">
          <Textarea
            value={html}
            onChange={handleHtmlChange}
            spellCheck={false}
            className="min-h-[440px] resize-y border-zinc-800 bg-zinc-950 font-mono text-xs leading-6 text-zinc-100 placeholder:text-zinc-500"
            placeholder="<h2>Write with HTML</h2>"
          />
        </TabsContent>

        <TabsContent value="preview" className="mt-0">
          <div
            className={editorSurfaceClass}
            dangerouslySetInnerHTML={{
              __html: html || '<p class="text-zinc-500">Your formatted post preview will appear here.</p>',
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
