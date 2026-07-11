'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Loader2, Tag } from 'lucide-react'
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
import { createBlogCategoryAction } from '@/app/studio/posts/actions'

const inputClassName = 'bg-background text-foreground placeholder:text-muted-foreground'

// Small dialog to type + save a new blog category. Calls onCreated with the
// saved row so the parent can add it to the list and select it.
export function AddCategoryDialog({ open, onOpenChange, onCreated }) {
  const [name, setName] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const submit = async () => {
    const clean = name.trim()
    if (!clean) {
      toast.error('Enter a category name.')
      return
    }
    setIsSaving(true)
    const result = await createBlogCategoryAction(clean)
    setIsSaving(false)
    if (!result.ok) {
      toast.error(result.error || 'Unable to save category.')
      return
    }
    toast.success('Category added')
    onCreated?.(result.category)
    setName('')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-emerald-400" />
            New category
          </DialogTitle>
          <DialogDescription>
            Add a category to the blog. It becomes selectable right away.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label htmlFor="new-category-name">Category name</Label>
          <Input
            id="new-category-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault()
                submit()
              }
            }}
            placeholder="e.g. Model Reviews"
            className={inputClassName}
            autoFocus
          />
        </div>

        <DialogFooter>
          <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={submit} disabled={isSaving} className="gap-2">
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Save category
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
