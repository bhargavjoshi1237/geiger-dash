'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2, Plus } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage, Button, DropdownMenuItem, DropdownMenuSeparator, Field, Input, SearchInput, Textarea } from '@geiger/ui'
import { deleteAuthorAction, saveAuthorAction } from '@/lib/posts/author-actions'
import { AUTHOR_LINKS, authorLinkFields } from '@/lib/posts/authors'
import { slugify } from '@/lib/posts/slug'
import {
  CountedLabel,
  DangerMenuItem,
  DocumentCanvas,
  DocumentEyebrow,
  DocumentTitle,
  EditorTopBar,
  InspectorPane,
  InspectorPanel,
  InspectorSection,
  ListEmpty,
  ListItem,
  ListPane,
  MoreMenu,
  SaveState,
  SlugLine,
  StudioFrame,
  TopBarDivider,
  ViewLiveLink,
  handleEditorKeys,
  useUnsavedGuard,
} from '@/components/content-studio/editor-kit'
import { SITE_HOST, formatShortDate } from '@/components/content-studio/constants'
import { useStudioRecord } from '@/components/content-studio/use-studio-record'

const INSPECTOR_TABS = [
  { label: 'Profile', value: 'profile' },
  { label: 'Posts', value: 'posts' },
]

const BIO_LIMIT = 2000

function AuthorAvatar({ name, src, className }) {
  const initials = String(name || '?').split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase()
  return (
    <Avatar className={className}>
      {src ? <AvatarImage src={src} alt="" /> : null}
      <AvatarFallback className="text-xs">{initials}</AvatarFallback>
    </Avatar>
  )
}

function AuthorEditor({ author, posts, onSaved, onDelete, onDirtyChange, onOpenList }) {
  const [name, setName] = useState(author?.name || '')
  const [slug, setSlug] = useState(author?.slug || '')
  const [role, setRole] = useState(author?.role || '')
  const [bio, setBio] = useState(author?.bio || '')
  const [avatarUrl, setAvatarUrl] = useState(author?.avatar_url || '')
  const [links, setLinks] = useState(() => authorLinkFields(author))
  const [saving, setSaving] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [tab, setTab] = useState('profile')
  const [inspectorOpen, setInspectorOpen] = useState(false)

  const isNew = !author
  const markDirty = useCallback(() => setDirty(true), [])
  const edit = (setter) => (value) => {
    setter(value)
    setDirty(true)
  }

  useEffect(() => {
    onDirtyChange(dirty)
  }, [dirty, onDirtyChange])
  useUnsavedGuard(dirty)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    const result = await saveAuthorAction({ id: author?.id, name, slug, role, bio, avatarUrl, links })
    setSaving(false)
    if (!result.ok) {
      toast.error(result.error || "Couldn't save the author")
      return
    }
    setDirty(false)
    toast.success(isNew ? 'Author added' : 'Author saved')
    onSaved(result.author)
  }

  return (
    <form onSubmit={handleSubmit} onInput={markDirty} onKeyDown={handleEditorKeys} noValidate className="flex min-h-0 min-w-0 flex-1">
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <EditorTopBar
          crumbs={['Authors']}
          current={name || 'New author'}
          meta={<SaveState dirty={dirty} isNew={isNew} savedAt={author?.updated_at} />}
          onOpenList={onOpenList}
          onOpenInspector={() => setInspectorOpen(true)}
          actions={
            <>
              {!isNew ? <ViewLiveLink href={`/blog/authors/${author.slug}`}>View page</ViewLiveLink> : null}
              {!isNew ? (
                <MoreMenu>
                  <DropdownMenuItem onSelect={() => { setTab('posts'); setInspectorOpen(true) }} className="cursor-pointer">
                    See credited posts
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DangerMenuItem onSelect={() => onDelete(author)}>Remove author</DangerMenuItem>
                </MoreMenu>
              ) : null}
              <TopBarDivider />
              <Button type="submit" size="sm" disabled={saving}>
                {saving ? <Loader2 className="size-3.5 animate-spin" /> : null}
                {isNew ? 'Add author' : 'Save'}
              </Button>
            </>
          }
        />

        <DocumentCanvas>
          <DocumentEyebrow>Author profile</DocumentEyebrow>
          <DocumentTitle value={name} onChange={edit(setName)} placeholder="Author name" aria-label="Name" maxLength={120} className="text-[34px] leading-[1.15]" />
          <SlugLine prefix={`${SITE_HOST}/blog/authors/`} slug={slug} onChange={edit(setSlug)} placeholder={slugify(name) || 'made-from-the-name'} />

          <Field label="Role" hint="Shown under the name on posts and the author page" className="mt-6 gap-1.5">
            <Input value={role} onChange={(event) => setRole(event.target.value)} maxLength={120} placeholder="e.g. Full-stack developer, Geiger Studios" />
          </Field>

          <div className="mt-6 flex flex-col gap-1.5">
            <CountedLabel label="Bio" required count={bio.length} limit={BIO_LIMIT} />
            <Textarea
              rows={9}
              value={bio}
              onChange={(event) => setBio(event.target.value)}
              maxLength={BIO_LIMIT}
              placeholder="What this person does and why they write about it. Public, and shown at the end of their posts."
            />
          </div>
        </DocumentCanvas>
      </div>

      <InspectorPane tabs={INSPECTOR_TABS} value={tab} onChange={setTab} open={inspectorOpen} onClose={() => setInspectorOpen(false)}>
        <InspectorPanel active={tab === 'profile'}>
          <InspectorSection title="Photo">
            <div className="flex items-center gap-3">
              <AuthorAvatar name={name} src={avatarUrl} className="size-12 shrink-0" />
              <Input value={avatarUrl} onChange={(event) => setAvatarUrl(event.target.value)} placeholder="https://" aria-label="Photo URL" className="min-w-0 flex-1" />
            </div>
          </InspectorSection>
          <InspectorSection title="Links" aside="HTTPS only">
            {AUTHOR_LINKS.map(({ key, label }) => (
              <Field key={key} label={label} className="gap-1.5">
                <Input value={links[key]} onChange={(event) => setLinks((current) => ({ ...current, [key]: event.target.value }))} placeholder="https://" />
              </Field>
            ))}
          </InspectorSection>
        </InspectorPanel>

        <InspectorPanel active={tab === 'posts'}>
          <InspectorSection title="Credited posts" aside={posts.length}>
            {posts.length ? (
              <ul className="flex flex-col gap-3">
                {posts.map((post) => (
                  <li key={post.id} className="min-w-0">
                    <a href={`/studio/posts?post=${post.id}`} className="block truncate text-[13px] font-medium text-foreground hover:underline">
                      {post.title}
                    </a>
                    <span suppressHydrationWarning className="text-xs text-muted-foreground">
                      {post.is_published ? formatShortDate(post.published_at) : 'Draft'}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-muted-foreground">No posts yet. Choose this author in a post&apos;s settings.</p>
            )}
          </InspectorSection>
        </InspectorPanel>
      </InspectorPane>
    </form>
  )
}

// Public author profiles: each one gets a page at /blog/authors/[slug] and can be credited on posts.
export function AuthorsStudio({ authors, posts, selectedId }) {
  const router = useRouter()
  const { openId, open, formKey } = useStudioRecord({ basePath: '/studio/authors', param: 'author', selectedId, saved: false, error: '', savedMessage: 'Author saved' })
  const [query, setQuery] = useState('')
  const [listOpen, setListOpen] = useState(false)
  const [savedAuthors, setSavedAuthors] = useState([])
  const [removedIds, setRemovedIds] = useState([])
  const dirtyRef = useRef(false)

  // Just-saved copies win so a record stays editable before the server list catches up.
  const authorList = useMemo(() => {
    const local = new Map(savedAuthors.map((author) => [author.id, author]))
    const merged = [...savedAuthors.filter((author) => !authors.some((entry) => entry.id === author.id)), ...authors.map((author) => local.get(author.id) || author)]
    return merged.filter((author) => !removedIds.includes(author.id))
  }, [authors, savedAuthors, removedIds])

  const rows = useMemo(() => {
    const q = query.toLowerCase().trim()
    return authorList.filter((author) => !q || `${author.name} ${author.role || ''} ${author.slug}`.toLowerCase().includes(q))
  }, [authorList, query])

  const countFor = (id) => posts.filter((post) => post.author_profile_id === id).length
  const editing = authorList.find((author) => author.id === openId)

  const handleDirtyChange = useCallback((dirty) => {
    dirtyRef.current = dirty
  }, [])

  const select = (id) => {
    if (id !== openId && dirtyRef.current && !window.confirm('Discard your unsaved changes?')) return
    dirtyRef.current = false
    open(id)
    setListOpen(false)
  }

  const handleSaved = (author) => {
    setSavedAuthors((current) => [author, ...current.filter((entry) => entry.id !== author.id)])
    dirtyRef.current = false
    open(author.id)
    router.refresh()
  }

  const handleDelete = async (author) => {
    if (!window.confirm(`Remove ${author.name}? Their posts keep the byline but lose the link to this profile.`)) return
    const result = await deleteAuthorAction(author.id)
    if (!result.ok) {
      toast.error(result.error || "Couldn't remove the author")
      return
    }
    setRemovedIds((current) => [...current, author.id])
    dirtyRef.current = false
    if (openId === author.id) open('')
    toast.success('Author removed')
    router.refresh()
  }

  return (
    <StudioFrame>
      <ListPane
        title="Authors"
        count={authorList.length}
        open={listOpen}
        onClose={() => setListOpen(false)}
        actions={
          <Button type="button" size="sm" onClick={() => select('')}>
            <Plus className="size-4" />
            New
          </Button>
        }
        search={<SearchInput expanded value={query} onChange={setQuery} placeholder="Search authors…" />}
      >
        {rows.map((author) => (
          <ListItem key={author.id} selected={author.id === openId} onClick={() => select(author.id)}>
            <span className="flex min-w-0 items-center gap-2.5">
              <AuthorAvatar name={author.name} src={author.avatar_url} className="size-8 shrink-0" />
              <span className="flex min-w-0 flex-col">
                <span className="truncate text-[13px] font-medium text-foreground">{author.name}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {countFor(author.id)} {countFor(author.id) === 1 ? 'post' : 'posts'}
                  {author.role ? ` · ${author.role}` : ''}
                </span>
              </span>
            </span>
          </ListItem>
        ))}
        {rows.length === 0 ? <ListEmpty>{query ? 'No authors match.' : 'No authors yet. Add the first one.'}</ListEmpty> : null}
      </ListPane>

      <AuthorEditor
        key={formKey}
        author={editing}
        posts={editing ? posts.filter((post) => post.author_profile_id === editing.id) : []}
        onSaved={handleSaved}
        onDelete={handleDelete}
        onDirtyChange={handleDirtyChange}
        onOpenList={() => setListOpen(true)}
      />
    </StudioFrame>
  )
}
