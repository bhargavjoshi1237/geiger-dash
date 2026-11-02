'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Check, Copy, KeyRound, Loader2, Plus, Trash2 } from 'lucide-react'
import {
  Button,
  DataTable,
  EmptyState,
  Field,
  Input,
  ScreenHeader,
  SectionCard,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  StatusPill,
} from '@geiger/ui'
import { createPostKeyAction, revokePostKeyAction } from '@/lib/posts/key-actions'

const ACCESS_OPTIONS = [
  { value: 'read', label: 'Read', hint: 'List and read posts' },
  { value: 'draft', label: 'Draft', hint: 'Also create and edit drafts' },
  { value: 'publish', label: 'Publish', hint: 'Also edit, publish and unpublish live posts' },
]

const ACCESS_MAP = Object.fromEntries(ACCESS_OPTIONS.map(({ value, label }) => [value, { label, variant: 'neutral', dot: false }]))

const ORIGIN = 'https://geiger.studio'

function formatWhen(iso) {
  if (!iso) return 'Never'
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

function CodeBlock({ children }) {
  return <pre className="overflow-x-auto rounded-lg border border-border bg-surface-subtle p-3 font-mono text-xs leading-relaxed text-text-secondary">{children}</pre>
}

function NewKeyNotice({ value }) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      toast.error("Couldn't copy the key. Select it and copy it by hand.")
    }
  }

  return (
    <div className="mt-4 rounded-lg border border-border bg-surface-subtle p-3">
      <p className="text-xs text-muted-foreground">Copy this key now. You won&apos;t be able to see it again.</p>
      <div className="mt-2 flex items-center gap-2">
        <code className="min-w-0 flex-1 truncate font-mono text-sm text-foreground">{value}</code>
        <Button type="button" variant="outline" size="sm" onClick={copy}>
          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
          {copied ? 'Copied' : 'Copy'}
        </Button>
      </div>
    </div>
  )
}

// Keys for /api/posts and /api/mcp; each editor sees and revokes only their own.
export function PostKeysScreen({ keys }) {
  const [name, setName] = useState('')
  const [access, setAccess] = useState('draft')
  const [creating, setCreating] = useState(false)
  const [newKey, setNewKey] = useState(null)
  const [revoking, setRevoking] = useState(null)

  async function handleCreate(event) {
    event.preventDefault()
    if (!name.trim()) {
      toast.error('Give the key a name')
      return
    }
    setCreating(true)
    const result = await createPostKeyAction({ name, access })
    setCreating(false)
    if (!result.ok) {
      toast.error(result.error || 'Unable to create the key')
      return
    }
    setNewKey(result.key)
    setName('')
    toast.success('API key created')
  }

  async function handleRevoke(id) {
    setRevoking(id)
    const result = await revokePostKeyAction(id)
    setRevoking(null)
    if (result.ok) toast.success('Key revoked')
    else toast.error(result.error || 'Unable to revoke the key')
  }

  const columns = [
    { key: 'name', header: 'Name', render: (row) => <span className="font-medium text-foreground">{row.name}</span> },
    { key: 'access', header: 'Access', render: (row) => <StatusPill status={row.access} map={ACCESS_MAP} /> },
    { key: 'prefix', header: 'Key', render: (row) => <code className="font-mono text-xs text-text-secondary">{row.prefix}</code> },
    { key: 'lastUsedAt', header: 'Last used', render: (row) => <span suppressHydrationWarning className="text-muted-foreground">{formatWhen(row.lastUsedAt)}</span> },
    {
      key: 'actions',
      header: '',
      align: 'right',
      render: (row) => (
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={`Revoke ${row.name}`}
          title="Revoke"
          disabled={revoking === row.id}
          onClick={() => handleRevoke(row.id)}
          className="text-muted-foreground hover:text-red-600 dark:hover:text-red-400"
        >
          {revoking === row.id ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
        </Button>
      ),
    },
  ]

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 px-6 py-8">
      <ScreenHeader title="API keys" description="Let an AI app or script read and write blog posts as you." />

      <SectionCard title="Create a key" description="Posts created with a key are credited to you. Only give a key publish access if it may put posts live without review.">
        <form onSubmit={handleCreate} className="flex flex-wrap items-end gap-3">
          <Field label="Name" htmlFor="post-key-name" className="min-w-52 flex-1 gap-1.5">
            <Input id="post-key-name" value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Claude Code" maxLength={100} />
          </Field>
          <Field label="Access" className="w-64 gap-1.5">
            <Select value={access} onValueChange={setAccess}>
              <SelectTrigger className="w-full" aria-label="Access">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ACCESS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label} · {option.hint}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Button type="submit" disabled={creating}>
            {creating ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
            Create key
          </Button>
        </form>
        {newKey ? <NewKeyNotice value={newKey} /> : null}
      </SectionCard>

      <DataTable
        columns={columns}
        data={keys}
        getRowKey={(row) => row.id}
        empty={<EmptyState icon={KeyRound} title="No keys yet" description="Create a key above to connect an AI app or script." className="[&_p]:normal-case" />}
      />

      <SectionCard title="Connect" description="Replace YOUR_KEY with a key from this page.">
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">Claude Code (MCP)</p>
            <CodeBlock>{`claude mcp add --transport http geiger-posts ${ORIGIN}/api/mcp --header "Authorization: Bearer YOUR_KEY"`}</CodeBlock>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">REST API</p>
            <CodeBlock>{`curl ${ORIGIN}/api/posts -H "Authorization: Bearer YOUR_KEY"`}</CodeBlock>
          </div>
        </div>
      </SectionCard>
    </div>
  )
}
