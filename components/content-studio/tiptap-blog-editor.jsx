'use client'

import { useEffect, useMemo, useState } from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import { Bold, Italic, Heading2, List, Link2, ImagePlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function TiptapBlogEditor({ name, defaultValue }) {
  const [html, setHtml] = useState(defaultValue || '')
  const [imageSrc, setImageSrc] = useState('')

  const editor = useEditor({
    extensions: [StarterKit, Image.configure({ inline: false })],
    content: defaultValue || '',
    editorProps: {
      attributes: {
        class:
          'min-h-[320px] rounded-md border border-zinc-700 bg-zinc-950 p-3 text-sm text-zinc-100 focus:outline-none',
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
      setHtml(next)
    }
  }, [defaultValue, editor])

  const canInsertImage = useMemo(() => imageSrc.trim().length > 0, [imageSrc])

  function addImageBySrc() {
    const src = imageSrc.trim()
    if (!src || !editor) return
    editor.chain().focus().setImage({ src }).run()
    setImageSrc('')
  }

  return (
    <div className="space-y-3">
      <input type="hidden" name={name} value={html} />

      <div className="flex flex-wrap gap-2">
        <Button type="button" size="xs" variant="secondary" onClick={() => editor?.chain().focus().toggleBold().run()}>
          <Bold className="h-3.5 w-3.5" />
          Bold
        </Button>
        <Button type="button" size="xs" variant="secondary" onClick={() => editor?.chain().focus().toggleItalic().run()}>
          <Italic className="h-3.5 w-3.5" />
          Italic
        </Button>
        <Button type="button" size="xs" variant="secondary" onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}>
          <Heading2 className="h-3.5 w-3.5" />
          H2
        </Button>
        <Button type="button" size="xs" variant="secondary" onClick={() => editor?.chain().focus().toggleBulletList().run()}>
          <List className="h-3.5 w-3.5" />
          Bullet
        </Button>
        <Button type="button" size="xs" variant="secondary" onClick={() => editor?.chain().focus().setLink({ href: 'https://' }).run()}>
          <Link2 className="h-3.5 w-3.5" />
          Link
        </Button>
      </div>

      <div className="flex gap-2">
        <Input
          value={imageSrc}
          onChange={(event) => setImageSrc(event.target.value)}
          placeholder="Paste image src URL to insert in editor"
          className="border-zinc-700 bg-zinc-950 text-zinc-100"
        />
        <Button type="button" variant="outline" onClick={addImageBySrc} disabled={!canInsertImage}>
          <ImagePlus className="h-4 w-4" />
          Insert image
        </Button>
      </div>

      <EditorContent editor={editor} />
    </div>
  )
}
