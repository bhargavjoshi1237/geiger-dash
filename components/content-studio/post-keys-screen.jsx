'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Check, Copy, Loader2, Plus } from 'lucide-react'
import {
  Button,
  Field,
  SearchInput,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  StatusPill,
} from '@geiger/ui'
import { createPostKeyAction, revokePostKeyAction } from '@/lib/posts/key-actions'
import {
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
  StudioFrame,
  handleEditorKeys,
} from '@/components/content-studio/editor-kit'
import { formatRelative, formatShortDate } from '@/components/content-studio/constants'
import { useStudioRecord } from '@/components/content-studio/use-studio-record'

const ACCESS_OPTIONS = [
  { value: 'read', label: 'Read', hint: 'List and read posts, including drafts.' },
  { value: 'draft', label: 'Draft', hint: 'Also create drafts and edit unpublished posts.' },
  { value: 'publish', label: 'Publish', hint: 'Also edit live posts, publish and unpublish. Only for keys that may put posts live without review.' },
]

const ACCESS_MAP = Object.fromEntries(ACCESS_OPTIONS.map(({ value, label }) => [value, { label, variant: 'neutral', dot: false }]))
const ORIGIN = 'https://geiger.studio'

function CodeBlock({ children }) {
  return <pre className="whitespace-pre-wrap break-all rounded-lg border border-border bg-surface-subtle p-3 font-mono text-xs leading-relaxed text-text-secondary">{children}</pre>
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
    <div className="mt-6 rounded-lg border border-border bg-surface-subtle p-3">
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

function ConnectGuide() {
  return (
    <div className="mt-10 flex flex-col gap-5 border-t border-border pt-6">
      <div>
        <h2 className="text-sm font-semibold text-foreground">Connect</h2>
        <p className="mt-1 text-xs text-muted-foreground">Replace YOUR_KEY with this key. Calls run with its access level and are written to the audit log.</p>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-[13px] font-medium text-foreground">Claude Code (MCP)</p>
        <CodeBlock>{`claude mcp add --transport http geiger-posts ${ORIGIN}/api/mcp --header "Authorization: Bearer YOUR_KEY"`}</CodeBlock>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-[13px] font-medium text-foreground">REST API</p>
        <CodeBlock>{`curl ${ORIGIN}/api/posts -H "Authorization: Bearer YOUR_KEY"`}</CodeBlock>
      </div>
    </div>
  )
}

function DetailRow({ label, children }) {
  return (
    <div className="flex items-center justify-between gap-3 text-[13px]">
      <span className="text-muted-foreground">{label}</span>
      <span suppressHydrationWarning className="min-w-0 truncate text-foreground">{children}</span>
    </div>
  )
}

function NewKeyEditor({ onCreated, onOpenList }) {
  const [name, setName] = useState('')
  const [access, setAccess] = useState('draft')
  const [creating, setCreating] = useState(false)
  const [inspectorOpen, setInspectorOpen] = useState(false)

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
    toast.success('API key created')
    onCreated(result.record, result.key)
  }

  return (
    <form onSubmit={handleCreate} onKeyDown={handleEditorKeys} noValidate className="flex min-h-0 min-w-0 flex-1">
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <EditorTopBar
          crumbs={['API keys']}
          current={name || 'New key'}
          meta={<span className="shrink-0 whitespace-nowrap text-xs text-muted-foreground">Not created yet</span>}
          onOpenList={onOpenList}
          onOpenInspector={() => setInspectorOpen(true)}
          actions={
            <Button type="submit" size="sm" disabled={creating}>
              {creating ? <Loader2 className="size-3.5 animate-spin" /> : null}
              Create key
            </Button>
          }
        />
        <DocumentCanvas>
          <DocumentEyebrow>API key</DocumentEyebrow>
          <DocumentTitle value={name} onChange={setName} placeholder="Name this key" aria-label="Name" maxLength={100} className="text-[34px] leading-[1.15]" />
          <p className="mt-3 text-sm text-muted-foreground">Lets an AI app or script read and write blog posts as you. New posts are credited to you unless the call names an author.</p>
          <ConnectGuide />
        </DocumentCanvas>
      </div>

      <InspectorPane title="Details" open={inspectorOpen} onClose={() => setInspectorOpen(false)}>
        <InspectorPanel active>
          <InspectorSection title="Access">
            <Field label="Level" className="gap-1.5">
              <Select value={access} onValueChange={setAccess}>
                <SelectTrigger className="w-full" aria-label="Access">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ACCESS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <p className="text-xs leading-5 text-muted-foreground">{ACCESS_OPTIONS.find((option) => option.value === access)?.hint}</p>
          </InspectorSection>
        </InspectorPanel>
      </InspectorPane>
    </form>
  )
}

function KeyDetail({ record, revealed, onRevoke, onOpenList }) {
  const [inspectorOpen, setInspectorOpen] = useState(false)

  return (
    <div className="flex min-h-0 min-w-0 flex-1">
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <EditorTopBar
          crumbs={['API keys']}
          current={record.name}
          meta={<StatusPill status={record.access} map={ACCESS_MAP} />}
          onOpenList={onOpenList}
          onOpenInspector={() => setInspectorOpen(true)}
          actions={
            <MoreMenu>
              <DangerMenuItem onSelect={() => onRevoke(record)}>Revoke key</DangerMenuItem>
            </MoreMenu>
          }
        />
        <DocumentCanvas>
          <DocumentEyebrow>API key</DocumentEyebrow>
          <h1 className="mt-2.5 text-[34px] font-semibold leading-[1.15] tracking-[-0.02em] text-foreground">{record.name}</h1>
          <p className="mt-3 font-mono text-xs text-muted-foreground">{record.prefix}</p>
          {revealed ? <NewKeyNotice value={revealed} /> : null}
          <ConnectGuide />
        </DocumentCanvas>
      </div>

      <InspectorPane title="Details" open={inspectorOpen} onClose={() => setInspectorOpen(false)}>
        <InspectorPanel active>
          <InspectorSection title="Access">
            <div className="flex">
              <StatusPill status={record.access} map={ACCESS_MAP} />
            </div>
            <p className="text-xs leading-5 text-muted-foreground">{ACCESS_OPTIONS.find((option) => option.value === record.access)?.hint}</p>
          </InspectorSection>
          <InspectorSection title="Activity">
            <DetailRow label="Created">{formatShortDate(record.createdAt)}</DetailRow>
            <DetailRow label="Last used">{record.lastUsedAt ? formatRelative(record.lastUsedAt) : 'Never'}</DetailRow>
          </InspectorSection>
        </InspectorPanel>
      </InspectorPane>
    </div>
  )
}

// Keys for /api/posts and /api/mcp; each editor sees and revokes only their own.
export function PostKeysScreen({ keys, selectedId }) {
  const router = useRouter()
  const { openId, open, formKey } = useStudioRecord({ basePath: '/studio/api-keys', param: 'key', selectedId, saved: false, error: '', savedMessage: '' })
  const [query, setQuery] = useState('')
  const [listOpen, setListOpen] = useState(false)
  const [createdKeys, setCreatedKeys] = useState([])
  const [revokedIds, setRevokedIds] = useState([])
  const [revealed, setRevealed] = useState(null)

  const keyList = useMemo(() => {
    const fresh = createdKeys.filter((created) => !keys.some((entry) => entry.id === created.id))
    return [...fresh, ...keys].filter((entry) => !revokedIds.includes(entry.id))
  }, [keys, createdKeys, revokedIds])

  const rows = useMemo(() => {
    const q = query.toLowerCase().trim()
    return keyList.filter((entry) => !q || `${entry.name} ${entry.prefix} ${entry.access}`.toLowerCase().includes(q))
  }, [keyList, query])

  const selected = keyList.find((entry) => entry.id === openId)

  const select = (id) => {
    open(id)
    setListOpen(false)
  }

  const handleCreated = (record, plaintext) => {
    setCreatedKeys((current) => [record, ...current])
    setRevealed({ id: record.id, value: plaintext })
    open(record.id)
    router.refresh()
  }

  const handleRevoke = async (record) => {
    if (!window.confirm(`Revoke ${record.name}? Anything using this key stops working straight away.`)) return
    const result = await revokePostKeyAction(record.id)
    if (!result.ok) {
      toast.error(result.error || 'Unable to revoke the key')
      return
    }
    setRevokedIds((current) => [...current, record.id])
    if (openId === record.id) open('')
    toast.success('Key revoked')
    router.refresh()
  }

  return (
    <StudioFrame>
      <ListPane
        title="API keys"
        count={keyList.length}
        open={listOpen}
        onClose={() => setListOpen(false)}
        actions={
          <Button type="button" size="sm" onClick={() => select('')}>
            <Plus className="size-4" />
            New
          </Button>
        }
        search={<SearchInput expanded value={query} onChange={setQuery} placeholder="Search keys…" />}
      >
        {rows.map((entry) => (
          <ListItem key={entry.id} selected={entry.id === openId} onClick={() => select(entry.id)}>
            <span className="truncate text-[13px] font-medium text-foreground">{entry.name}</span>
            <span className="flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground">
              <StatusPill status={entry.access} map={ACCESS_MAP} />
              <span suppressHydrationWarning className="truncate">
                {entry.lastUsedAt ? `Used ${formatRelative(entry.lastUsedAt)}` : 'Never used'}
              </span>
            </span>
          </ListItem>
        ))}
        {rows.length === 0 ? <ListEmpty>{query ? 'No keys match.' : 'No keys yet. Create one to connect an AI app or script.'}</ListEmpty> : null}
      </ListPane>

      {selected ? (
        <KeyDetail
          key={formKey}
          record={selected}
          revealed={revealed?.id === selected.id ? revealed.value : null}
          onRevoke={handleRevoke}
          onOpenList={() => setListOpen(true)}
        />
      ) : (
        <NewKeyEditor key={formKey} onCreated={handleCreated} onOpenList={() => setListOpen(true)} />
      )}
    </StudioFrame>
  )
}
