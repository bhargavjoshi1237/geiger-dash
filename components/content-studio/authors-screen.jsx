'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Loader2, Pencil, Plus, Trash2, UserRound } from 'lucide-react'
import { Button, DataTable, EmptyState, Field, Input, ScreenHeader, SectionCard, Textarea } from '@geiger/ui'
import { deleteAuthorAction, saveAuthorAction } from '@/lib/posts/author-actions'
import { AUTHOR_LINKS, authorLinkFields } from '@/lib/posts/authors'

const EMPTY = { id: null, name: '', slug: '', role: '', bio: '', avatarUrl: '', links: authorLinkFields(null) }

function toForm(author) {
  return {
    id: author.id,
    name: author.name,
    slug: author.slug,
    role: author.role || '',
    bio: author.bio,
    avatarUrl: author.avatar_url || '',
    links: authorLinkFields(author),
  }
}

// Public author profiles: each one gets a page at /blog/authors/[slug] and can be credited on posts.
export function AuthorsScreen({ authors }) {
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [removing, setRemoving] = useState(null)

  const set = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }))
  const setLink = (key) => (event) => setForm((current) => ({ ...current, links: { ...current.links, [key]: event.target.value } }))

  async function handleSave(event) {
    event.preventDefault()
    setSaving(true)
    const result = await saveAuthorAction(form)
    setSaving(false)
    if (!result.ok) {
      toast.error(result.error || "Couldn't save the author")
      return
    }
    toast.success(form.id ? 'Author updated' : 'Author added')
    setForm(EMPTY)
  }

  async function handleRemove(author) {
    setRemoving(author.id)
    const result = await deleteAuthorAction(author.id)
    setRemoving(null)
    if (!result.ok) {
      toast.error(result.error || "Couldn't remove the author")
      return
    }
    toast.success('Author removed')
    if (form.id === author.id) setForm(EMPTY)
  }

  const columns = [
    { key: 'name', header: 'Name', render: (row) => <span className="font-medium text-foreground">{row.name}</span> },
    { key: 'role', header: 'Role', render: (row) => <span className="text-muted-foreground">{row.role || '—'}</span> },
    {
      key: 'slug',
      header: 'Page',
      render: (row) => (
        <a href={`/blog/authors/${row.slug}`} className="font-mono text-xs text-text-secondary hover:text-foreground">
          /blog/authors/{row.slug}
        </a>
      ),
    },
    {
      key: 'actions',
      header: '',
      align: 'right',
      render: (row) => (
        <div className="flex justify-end gap-1">
          <Button type="button" variant="ghost" size="icon-sm" aria-label={`Edit ${row.name}`} title="Edit" onClick={() => setForm(toForm(row))}>
            <Pencil className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={`Remove ${row.name}`}
            title="Remove"
            disabled={removing === row.id}
            onClick={() => handleRemove(row)}
            className="text-muted-foreground hover:text-red-600 dark:hover:text-red-400"
          >
            {removing === row.id ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 px-6 py-8">
      <ScreenHeader title="Authors" description="Public profiles for the people credited on blog posts." />

      <DataTable
        columns={columns}
        data={authors}
        getRowKey={(row) => row.id}
        empty={<EmptyState icon={UserRound} title="No authors yet" description="Add a profile below, then choose it on a post." className="[&_p]:normal-case" />}
      />

      <SectionCard title={form.id ? `Edit ${form.name || 'author'}` : 'Add an author'} description="Everything here is public on the author's page.">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name" htmlFor="author-name" className="gap-1.5">
              <Input id="author-name" value={form.name} onChange={set('name')} maxLength={120} />
            </Field>
            <Field label="Role" htmlFor="author-role" className="gap-1.5">
              <Input id="author-role" value={form.role} onChange={set('role')} maxLength={120} placeholder="e.g. Full-stack developer" />
            </Field>
            <Field label="Page URL" htmlFor="author-slug" hint="Made from the name when left empty" className="gap-1.5">
              <Input id="author-slug" value={form.slug} onChange={set('slug')} maxLength={180} placeholder="first-last" />
            </Field>
            <Field label="Photo URL" htmlFor="author-avatar" className="gap-1.5">
              <Input id="author-avatar" value={form.avatarUrl} onChange={set('avatarUrl')} placeholder="https://" />
            </Field>
          </div>
          <Field label="Bio" htmlFor="author-bio" className="gap-1.5">
            <Textarea id="author-bio" rows={5} value={form.bio} onChange={set('bio')} maxLength={2000} placeholder="What this person does and why they write about it" />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            {AUTHOR_LINKS.map(({ key, label }) => (
              <Field key={key} label={label} htmlFor={`author-${key}`} className="gap-1.5">
                <Input id={`author-${key}`} value={form.links[key]} onChange={setLink(key)} placeholder="https://" />
              </Field>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Button type="submit" disabled={saving}>
              {saving ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
              {form.id ? 'Save changes' : 'Add author'}
            </Button>
            {form.id ? (
              <Button type="button" variant="ghost" onClick={() => setForm(EMPTY)}>
                Cancel
              </Button>
            ) : null}
          </div>
        </form>
      </SectionCard>
    </div>
  )
}
