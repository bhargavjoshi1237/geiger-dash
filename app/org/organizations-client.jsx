'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  Archive,
  Building2,
  Camera,
  Check,
  Copy,
  Crown,
  ExternalLink,
  Gauge,
  Globe,
  KeyRound,
  Link2,
  Loader2,
  Mail,
  MoreHorizontal,
  Pencil,
  Plus,
  Power,
  RefreshCw,
  Settings2,
  ShieldCheck,
  Trash2,
  UserMinus,
  UserPlus,
  Users,
} from 'lucide-react'
import { toast } from 'sonner'
import {
  createOrganizationAction,
  inviteOrgMembersAction,
  joinOrganizationAction,
  listOrgMembersAction,
  removeOrgMemberAction,
  revokeOrgInviteAction,
  setOrgMemberRoleAction,
  updateOrgAvatarAction,
} from './actions'
import {
  getOrgOAuthProviderAction,
  saveOrgOAuthProviderAction,
  setOrgOAuthEnabledAction,
  deleteOrgOAuthProviderAction,
  resolveOAuthDiscoveryAction,
} from './oauth-actions'
import {
  getOrgDomainAction,
  checkSubdomainAvailabilityAction,
  saveOrgSubdomainAction,
  removeOrgSubdomainAction,
} from './domain-actions'
import {
  listOrgEmailTemplatesAction,
  createOrgEmailTemplateAction,
  updateOrgEmailTemplateAction,
  deleteOrgEmailTemplateAction,
} from './email-actions'
import { getOrgEntitlements, isProductUnlocked } from '@/lib/billing/entitlements'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'

const ORG_ROUTE = '/org'

const AWS_DEPLOYMENT_LOCATIONS = [
  { value: 'us-east-1', label: 'US East (N. Virginia)', flag: '🇺🇸' },
  { value: 'us-east-2', label: 'US East (Ohio)', flag: '🇺🇸' },
  { value: 'us-west-1', label: 'US West (N. California)', flag: '🇺🇸' },
  { value: 'us-west-2', label: 'US West (Oregon)', flag: '🇺🇸' },
  { value: 'ca-central-1', label: 'Canada (Central)', flag: '🇨🇦' },
  { value: 'eu-west-1', label: 'Europe (Ireland)', flag: '🇮🇪' },
  { value: 'eu-west-2', label: 'Europe (London)', flag: '🇬🇧' },
  { value: 'eu-west-3', label: 'Europe (Paris)', flag: '🇫🇷' },
  { value: 'eu-central-1', label: 'Europe (Frankfurt)', flag: '🇩🇪' },
  { value: 'eu-north-1', label: 'Europe (Stockholm)', flag: '🇸🇪' },
  { value: 'ap-south-1', label: 'Asia Pacific (Mumbai)', flag: '🇮🇳' },
  { value: 'ap-southeast-1', label: 'Asia Pacific (Singapore)', flag: '🇸🇬' },
  { value: 'ap-southeast-2', label: 'Asia Pacific (Sydney)', flag: '🇦🇺' },
  { value: 'ap-northeast-1', label: 'Asia Pacific (Tokyo)', flag: '🇯🇵' },
  { value: 'ap-northeast-2', label: 'Asia Pacific (Seoul)', flag: '🇰🇷' },
  { value: 'sa-east-1', label: 'South America (Sao Paulo)', flag: '🇧🇷' },
  { value: 'me-south-1', label: 'Middle East (Bahrain)', flag: '🇧🇭' },
  { value: 'af-south-1', label: 'Africa (Cape Town)', flag: '🇿🇦' },
]

function getDeploymentLocation(value) {
  return AWS_DEPLOYMENT_LOCATIONS.find((location) => location.value === value)
}

function getMessage(searchState) {
  if (searchState.created) return { id: 'created', type: 'success', text: 'Organization created.' }
  if (searchState.joined) return { id: 'joined', type: 'success', text: 'Organization joined.' }
  if (searchState.error === 'missing_required') {
    return { id: 'missing_required', type: 'error', text: 'Name and description are required.' }
  }
  if (searchState.error === 'missing_join_id') {
    return { id: 'missing_join_id', type: 'error', text: 'Enter an organization ID to join.' }
  }
  if (searchState.error === 'organization_not_found') {
    return { id: 'organization_not_found', type: 'error', text: 'No organization was found for that ID.' }
  }
  if (searchState.error) return { id: searchState.error, type: 'error', text: searchState.error }
  return null
}

function OrganizationForm({ onSubmitted }) {
  return (
    <form action={createOrganizationAction} className="space-y-4" onSubmit={onSubmitted}>
      <div className="grid gap-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" placeholder="Acme Studio" required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="What this organization manages."
          required
          className="min-h-24 resize-none"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="country">Deployment location</Label>
        <Select name="country" defaultValue="ap-south-1" required>
          <SelectTrigger id="country" className="w-full">
            <SelectValue placeholder="Choose AWS location" />
          </SelectTrigger>
          <SelectContent>
            {AWS_DEPLOYMENT_LOCATIONS.map((location) => (
              <SelectItem key={location.value} value={location.value}>
                <span>{location.flag}</span>
                <span>{location.label}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DialogFooter>
        <Button type="submit" className="w-full sm:w-auto">
          Create
        </Button>
      </DialogFooter>
    </form>
  )
}

function JoinForm({ onSubmitted }) {
  return (
    <form action={joinOrganizationAction} className="space-y-4" onSubmit={onSubmitted}>
      <div className="grid gap-2">
        <Label htmlFor="organization_id">Organization ID</Label>
        <Input id="organization_id" name="organization_id" placeholder="Paste the organization ID" required />
      </div>
      <DialogFooter>
        <Button type="submit" className="w-full sm:w-auto">
          <UserPlus className="h-4 w-4" />
          Join organization
        </Button>
      </DialogFooter>
    </form>
  )
}

function ActionDialogs() {
  const [createOpen, setCreateOpen] = useState(false)
  const [joinOpen, setJoinOpen] = useState(false)

  return (
    <div className="flex flex-col gap-2 sm:flex-row">

      <Dialog open={joinOpen} onOpenChange={setJoinOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="h-9 border-border bg-surface-subtle text-foreground hover:bg-surface-hover">
            <UserPlus className="h-4 w-4" />
            
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Join organization</DialogTitle>
            <DialogDescription>Use an organization ID shared by an owner or admin.</DialogDescription>
          </DialogHeader>
          <JoinForm onSubmitted={() => setJoinOpen(false)} />
        </DialogContent>
      </Dialog>


      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogTrigger asChild>
          <Button className="h-9 bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="h-4 w-4" />
             Create
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create organization</DialogTitle>
            <DialogDescription>Add the workspace your team will create and manage from.</DialogDescription>
          </DialogHeader>
          <OrganizationForm onSubmitted={() => setCreateOpen(false)} />
        </DialogContent>
      </Dialog>

      
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex min-h-[52vh] items-center justify-center">
      <div className="mx-auto flex max-w-md flex-col items-center rounded-xl border border-dashed border-border bg-surface-subtle px-8 py-12 text-center">
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-md border border-border bg-background">
          <Building2 className="h-6 w-6 text-text-secondary" />
        </div>
        <h2 className="text-xl font-semibold tracking-tight">No organizations yet</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Create your first organization or join one with an ID from your team.
        </p>
        <div className="mt-6">
          <ActionDialogs />
        </div>
      </div>
    </div>
  )
}

const MEMBER_ROLE_OPTIONS = ['Manager', 'User', 'Leader', 'Technical Officer', 'Financial Officer']

// Stable avatar tint from a key (mirrors the project-avatar palette idea).
const MEMBER_TINTS = [
  'bg-blue-500/15 text-blue-400',
  'bg-violet-500/15 text-violet-400',
  'bg-emerald-500/15 text-emerald-400',
  'bg-orange-500/15 text-orange-400',
  'bg-pink-500/15 text-pink-400',
  'bg-cyan-500/15 text-cyan-400',
  'bg-amber-500/15 text-amber-400',
  'bg-rose-500/15 text-rose-400',
]
function memberTint(key = '') {
  let h = 0
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) & 0xffffff
  return MEMBER_TINTS[h % MEMBER_TINTS.length]
}
function memberInitials(name, email) {
  const src = (name || email || '').trim()
  if (!src) return '?'
  const parts = src.split(/\s+/).filter(Boolean)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return src.slice(0, 2).toUpperCase()
}
function memberRoleLabel(member) {
  if (member.isOwner) return 'Owner'
  if (member.isCreator) return 'Creator'
  return member.role || 'Member'
}

// Polished "Your role" summary — an icon chip, the role badge, and the concrete
// things that role can do as check chips.
function YourRoleCard({ roleLabel }) {
  const privileged = roleLabel === 'Owner' || roleLabel === 'Creator'
  const Icon = privileged ? Crown : ShieldCheck
  const blurb = privileged
    ? 'You have full control of this workspace — manage members, projects, billing, and settings.'
    : 'You have member access to this workspace and its shared projects.'
  const caps = privileged
    ? ['Manage members', 'Manage projects', 'Billing & plan', 'Workspace settings']
    : ['Access shared projects', 'Launch products']

  return (
    <div className="rounded-lg border border-border bg-surface-card p-4">
      <div className="flex items-start gap-3">
        <span
          className={cn(
            'flex size-10 shrink-0 items-center justify-center rounded-lg border',
            privileged
              ? 'border-primary/20 bg-primary/10 text-primary'
              : 'border-border bg-surface-subtle text-muted-foreground',
          )}
        >
          <Icon className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-foreground">Your role</p>
            <Badge variant={privileged ? 'success' : 'secondary'}>{roleLabel}</Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{blurb}</p>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {caps.map((c) => (
          <span
            key={c}
            className="inline-flex items-center gap-1 rounded-full border border-border bg-surface-subtle px-2 py-0.5 text-xs text-muted-foreground"
          >
            <Check className="size-3 text-emerald-400" />
            {c}
          </span>
        ))}
      </div>
    </div>
  )
}

function MemberAvatar({ member }) {
  if (member.avatarUrl) {
    return (
      <span className="relative flex size-9 shrink-0 overflow-hidden rounded-full border border-border">
        <Image src={member.avatarUrl} alt="" fill className="object-cover" unoptimized />
      </span>
    )
  }
  return (
    <span
      className={cn(
        'flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold',
        memberTint(member.userId || member.email),
      )}
    >
      {memberInitials(member.name, member.email)}
    </span>
  )
}

// Members tab: fetches the directory + pending invites on open, renders the role
// card, an invite form, the member list (with role + remove for managers), and
// pending invites. Reads through server actions; owns its own toasts.
function MembersTab({ organization, userId, roleLabel, canManage }) {
  const [loading, setLoading] = useState(true)
  const [members, setMembers] = useState([])
  const [invites, setInvites] = useState([])
  const [busyId, setBusyId] = useState(null)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('User')
  const [inviting, setInviting] = useState(false)
  const [removeTarget, setRemoveTarget] = useState(null)
  const [removing, setRemoving] = useState(false)

  async function reload() {
    const result = await listOrgMembersAction(organization.id)
    if (result?.ok) {
      setMembers(result.members)
      setInvites(result.invites)
    }
  }

  // MembersTab mounts fresh each time the tab opens (Dialog + tab conditional
  // both unmount on close), so `loading` starts true and we just fetch on mount.
  useEffect(() => {
    let active = true
    listOrgMembersAction(organization.id).then((result) => {
      if (!active) return
      if (result?.ok) {
        setMembers(result.members)
        setInvites(result.invites)
      } else if (result?.error) {
        toast.error(result.error)
      }
      setLoading(false)
    })
    return () => {
      active = false
    }
  }, [organization.id])

  const currentMember = members.find((m) => m.userId === userId)
  const preciseRole = currentMember ? memberRoleLabel(currentMember) : roleLabel

  async function handleInvite(e) {
    e.preventDefault()
    const email = inviteEmail.trim()
    if (!email) return
    setInviting(true)
    const result = await inviteOrgMembersAction({
      organizationId: organization.id,
      organizationName: organization.name,
      emails: [email],
      role: inviteRole,
    })
    setInviting(false)
    if (result?.ok) {
      toast.success(result.sent ? `Invite sent to ${email}.` : `Invite created for ${email}.`)
      setInviteEmail('')
      reload()
    } else {
      toast.error(result?.error || 'Could not send the invite.')
    }
  }

  async function handleRole(member, nextRole) {
    if (nextRole === member.role) return
    setBusyId(member.userId)
    setMembers((prev) => prev.map((m) => (m.userId === member.userId ? { ...m, role: nextRole } : m)))
    const result = await setOrgMemberRoleAction({
      organizationId: organization.id,
      userId: member.userId,
      role: nextRole,
    })
    setBusyId(null)
    if (result?.ok) {
      toast.success('Role updated.')
    } else {
      toast.error(result?.error || 'Could not update the role.')
      reload()
    }
  }

  async function handleRemoveConfirm() {
    if (!removeTarget) return
    setRemoving(true)
    const result = await removeOrgMemberAction({
      organizationId: organization.id,
      userId: removeTarget.userId,
    })
    setRemoving(false)
    if (result?.ok) {
      setMembers((prev) => prev.filter((m) => m.userId !== removeTarget.userId))
      toast.success('Member removed.')
      setRemoveTarget(null)
    } else {
      toast.error(result?.error || 'Could not remove the member.')
    }
  }

  async function handleRevoke(invite) {
    setBusyId(invite.id)
    const result = await revokeOrgInviteAction({ organizationId: organization.id, inviteId: invite.id })
    setBusyId(null)
    if (result?.ok) {
      setInvites((prev) => prev.filter((i) => i.id !== invite.id))
      toast.success('Invite revoked.')
    } else {
      toast.error(result?.error || 'Could not revoke the invite.')
    }
  }

  return (
    <div className="space-y-4">
      <YourRoleCard roleLabel={preciseRole} />

      {canManage && (
        <form onSubmit={handleInvite} className="rounded-lg border border-border bg-surface-card p-4">
          <div className="flex items-center gap-2">
            <UserPlus className="size-4 text-muted-foreground" />
            <p className="text-sm font-medium text-foreground">Invite a teammate</p>
          </div>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <Input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="name@company.com"
              className="flex-1 bg-surface-subtle"
            />
            <Select value={inviteRole} onValueChange={setInviteRole}>
              <SelectTrigger className="w-full bg-surface-subtle sm:w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MEMBER_ROLE_OPTIONS.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button type="submit" disabled={inviting || !inviteEmail.trim()}>
              {inviting ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
              Invite
            </Button>
          </div>
        </form>
      )}

      <div className="overflow-hidden rounded-lg border border-border bg-surface-card">
        <div className="flex items-center justify-between border-b border-border px-3 py-2.5">
          <div className="flex items-center gap-2">
            <Users className="size-4 text-muted-foreground" />
            <p className="text-sm font-medium text-foreground">Members</p>
          </div>
          <span className="text-xs text-muted-foreground">{members.length}</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            Loading members…
          </div>
        ) : members.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">No members found.</p>
        ) : (
          <div className="divide-y divide-border">
            {members.map((m) => {
              const isSelf = m.userId === userId
              const fixed = m.isOwner || m.isCreator
              const manageable = canManage && !fixed && !isSelf
              return (
                <div key={m.userId || m.email} className="flex items-center gap-3 px-3 py-2.5">
                  <MemberAvatar member={m} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <p className="truncate text-sm font-medium text-foreground">
                        {m.name || m.email || 'Unknown user'}
                      </p>
                      {isSelf && (
                        <span className="rounded-full border border-border bg-surface-subtle px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                          You
                        </span>
                      )}
                    </div>
                    {m.name && m.email && <p className="truncate text-xs text-muted-foreground">{m.email}</p>}
                  </div>

                  {manageable ? (
                    <div className="flex items-center gap-1.5">
                      <Select
                        value={MEMBER_ROLE_OPTIONS.includes(m.role) ? m.role : 'User'}
                        onValueChange={(v) => handleRole(m, v)}
                        disabled={busyId === m.userId}
                      >
                        <SelectTrigger className="h-8 w-[150px] bg-surface-subtle text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {MEMBER_ROLE_OPTIONS.map((r) => (
                            <SelectItem key={r} value={r}>
                              {r}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label="Member actions"
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-52">
                          <DropdownMenuItem variant="destructive" onSelect={() => setRemoveTarget(m)}>
                            <UserMinus className="size-4" />
                            Remove from workspace
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ) : (
                    <Badge variant={fixed ? 'success' : 'secondary'} className="gap-1">
                      {fixed && <Crown className="size-3" />}
                      {memberRoleLabel(m)}
                    </Badge>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {canManage && invites.length > 0 && (
        <div className="overflow-hidden rounded-lg border border-border bg-surface-card">
          <div className="flex items-center justify-between border-b border-border px-3 py-2.5">
            <div className="flex items-center gap-2">
              <Mail className="size-4 text-muted-foreground" />
              <p className="text-sm font-medium text-foreground">Pending invites</p>
            </div>
            <span className="text-xs text-muted-foreground">{invites.length}</span>
          </div>
          <div className="divide-y divide-border">
            {invites.map((i) => (
              <div key={i.id} className="flex items-center gap-3 px-3 py-2.5">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-dashed border-border bg-surface-subtle text-muted-foreground">
                  <Mail className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{i.email}</p>
                  <p className="truncate text-xs text-muted-foreground">Invited as {i.role}</p>
                </div>
                <Badge variant="secondary">Invited</Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={busyId === i.id}
                  onClick={() => handleRevoke(i)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {busyId === i.id ? <Loader2 className="size-4 animate-spin" /> : 'Revoke'}
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      <Dialog open={Boolean(removeTarget)} onOpenChange={(o) => !o && setRemoveTarget(null)}>
        <DialogContent className="geiger-flow-palette max-w-md border-border bg-background text-foreground">
          <DialogHeader>
            <DialogTitle>Remove member?</DialogTitle>
            <DialogDescription>
              {removeTarget ? (
                <>
                  Remove{' '}
                  <span className="font-medium text-foreground">
                    {removeTarget.name || removeTarget.email}
                  </span>{' '}
                  from {organization.name || 'this workspace'}? They&rsquo;ll lose access to its projects.
                </>
              ) : null}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setRemoveTarget(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRemoveConfirm} disabled={removing}>
              {removing ? <Loader2 className="size-4 animate-spin" /> : <UserMinus className="size-4" />}
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

const EMPTY_OAUTH_DRAFT = {
  providerName: '',
  providerType: 'oidc',
  emailDomains: '',
  discoveryUrl: '',
  authorizationUrl: '',
  tokenUrl: '',
  userinfoUrl: '',
  clientId: '',
  clientSecret: '',
  scopes: 'openid email profile',
  mapEmail: '',
  mapName: '',
  mapAvatar: '',
  pkceEnabled: true,
}

// Read-only value + copy button (redirect URI / SSO login link).
function CopyRow({ label, value }) {
  return (
    <div className="grid gap-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <div className="flex items-center gap-2">
        <Input readOnly value={value} className="flex-1 bg-surface-subtle text-xs" />
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          aria-label={`Copy ${label}`}
          className="shrink-0 border-border bg-surface-subtle"
          onClick={() => {
            navigator.clipboard?.writeText(value)
            toast.success(`${label} copied.`)
          }}
        >
          <Copy className="size-4" />
        </Button>
      </div>
    </div>
  )
}

// OAuth settings tab: configure a per-org OAuth2/OIDC provider (setup form) or
// manage an existing one. Only rendered for owners of orgs that bought the
// OAuth add-on. Reads/writes through the oauth server actions; owns its toasts.
function OAuthTab({ organization }) {
  const [loading, setLoading] = useState(true)
  const [provider, setProvider] = useState(null)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [fetchingDiscovery, setFetchingDiscovery] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [origin] = useState(() => (typeof window !== 'undefined' ? window.location.origin : ''))
  const [draft, setDraft] = useState(EMPTY_OAUTH_DRAFT)

  useEffect(() => {
    let active = true
    getOrgOAuthProviderAction(organization.id).then((res) => {
      if (!active) return
      if (res?.ok) setProvider(res.provider)
      else if (res?.error) toast.error(res.error)
      setLoading(false)
    })
    return () => {
      active = false
    }
  }, [organization.id])

  const redirectUri = origin ? `${origin}/api/oauth/${organization.id}/callback` : ''
  const loginUrl = origin ? `${origin}/api/oauth/${organization.id}/start` : ''
  const set = (key) => (value) => setDraft((d) => ({ ...d, [key]: value }))

  function startEdit() {
    setDraft(
      provider
        ? {
            providerName: provider.providerName || '',
            providerType: provider.providerType || 'oidc',
            emailDomains: (provider.emailDomains || []).join(', '),
            discoveryUrl: provider.discoveryUrl || '',
            authorizationUrl: provider.authorizationUrl || '',
            tokenUrl: provider.tokenUrl || '',
            userinfoUrl: provider.userinfoUrl || '',
            clientId: provider.clientId || '',
            clientSecret: '',
            scopes: (provider.scopes || []).join(' '),
            mapEmail: provider.attributeMapping?.email || '',
            mapName: provider.attributeMapping?.name || '',
            mapAvatar: provider.attributeMapping?.avatar || '',
            pkceEnabled: provider.pkceEnabled !== false,
          }
        : EMPTY_OAUTH_DRAFT,
    )
    setEditing(true)
  }

  async function handleFetchDiscovery() {
    if (!draft.discoveryUrl.trim()) {
      toast.error('Enter a discovery or issuer URL first.')
      return
    }
    setFetchingDiscovery(true)
    const res = await resolveOAuthDiscoveryAction(organization.id, draft.discoveryUrl)
    setFetchingDiscovery(false)
    if (res?.ok) {
      setDraft((d) => ({
        ...d,
        authorizationUrl: res.endpoints.authorizationUrl || d.authorizationUrl,
        tokenUrl: res.endpoints.tokenUrl || d.tokenUrl,
        userinfoUrl: res.endpoints.userinfoUrl || d.userinfoUrl,
      }))
      toast.success('Endpoints filled from discovery URL.')
    } else {
      toast.error(res?.error || 'Could not read that discovery URL.')
    }
  }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    const attributeMapping = {}
    if (draft.mapEmail.trim()) attributeMapping.email = draft.mapEmail.trim()
    if (draft.mapName.trim()) attributeMapping.name = draft.mapName.trim()
    if (draft.mapAvatar.trim()) attributeMapping.avatar = draft.mapAvatar.trim()
    const res = await saveOrgOAuthProviderAction(organization.id, {
      providerName: draft.providerName,
      providerType: draft.providerType,
      emailDomains: draft.emailDomains,
      discoveryUrl: draft.discoveryUrl,
      authorizationUrl: draft.authorizationUrl,
      tokenUrl: draft.tokenUrl,
      userinfoUrl: draft.userinfoUrl,
      clientId: draft.clientId,
      clientSecret: draft.clientSecret,
      scopes: draft.scopes,
      attributeMapping,
      pkceEnabled: draft.pkceEnabled,
    })
    setSaving(false)
    if (res?.ok) {
      setProvider(res.provider)
      setEditing(false)
      toast.success('OAuth provider saved.')
    } else {
      toast.error(res?.error || 'Could not save the provider.')
    }
  }

  async function handleToggleEnabled(nextEnabled) {
    setProvider((p) => (p ? { ...p, enabled: nextEnabled } : p))
    const res = await setOrgOAuthEnabledAction(organization.id, nextEnabled)
    if (!res?.ok) {
      setProvider((p) => (p ? { ...p, enabled: !nextEnabled } : p))
      toast.error(res?.error || 'Could not update the provider.')
    } else {
      toast.success(nextEnabled ? 'OAuth sign-in enabled.' : 'OAuth sign-in disabled.')
    }
  }

  async function handleDelete() {
    setDeleting(true)
    const res = await deleteOrgOAuthProviderAction(organization.id)
    setDeleting(false)
    if (res?.ok) {
      setProvider(null)
      setEditing(false)
      toast.success('OAuth provider removed.')
    } else {
      toast.error(res?.error || 'Could not remove the provider.')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        Loading OAuth settings…
      </div>
    )
  }

  // Setup / edit form.
  if (editing || !provider) {
    return (
      <form onSubmit={handleSave} className="space-y-4">
        <div className="rounded-lg border border-border bg-surface-card p-4">
          <div className="flex items-center gap-2">
            <KeyRound className="size-4 text-muted-foreground" />
            <p className="text-sm font-medium text-foreground">
              {provider ? 'Edit OAuth provider' : 'Set up OAuth'}
            </p>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Connect an OAuth2 / OIDC identity provider so your members can sign in through it.
            Register the redirect URI below at your provider.
          </p>
        </div>

        <div className="grid gap-4 rounded-lg border border-border bg-surface-card p-4">
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label>Provider name</Label>
              <Input
                value={draft.providerName}
                onChange={(e) => set('providerName')(e.target.value)}
                placeholder="Acme SSO"
                className="bg-surface-subtle"
              />
            </div>
            <div className="grid gap-1.5">
              <Label>Protocol</Label>
              <Select value={draft.providerType} onValueChange={set('providerType')}>
                <SelectTrigger className="bg-surface-subtle">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="oidc">OpenID Connect</SelectItem>
                  <SelectItem value="oauth2">OAuth 2.0</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label>Email domains</Label>
            <Input
              value={draft.emailDomains}
              onChange={(e) => set('emailDomains')(e.target.value)}
              placeholder="acme.com, acme.io"
              className="bg-surface-subtle"
            />
            <p className="text-xs text-muted-foreground">
              Members with these email domains are routed to this provider at sign-in.
            </p>
          </div>

          <div className="grid gap-1.5">
            <Label>Discovery / issuer URL (optional)</Label>
            <div className="flex items-center gap-2">
              <Input
                value={draft.discoveryUrl}
                onChange={(e) => set('discoveryUrl')(e.target.value)}
                placeholder="https://idp.example.com/.well-known/openid-configuration"
                className="flex-1 bg-surface-subtle"
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleFetchDiscovery}
                disabled={fetchingDiscovery}
                className="shrink-0 border-border bg-surface-subtle"
              >
                {fetchingDiscovery ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <RefreshCw className="size-4" />
                )}
                Fetch
              </Button>
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label>Authorization URL</Label>
            <Input
              value={draft.authorizationUrl}
              onChange={(e) => set('authorizationUrl')(e.target.value)}
              placeholder="https://idp.example.com/authorize"
              className="bg-surface-subtle"
            />
          </div>
          <div className="grid gap-1.5">
            <Label>Token URL</Label>
            <Input
              value={draft.tokenUrl}
              onChange={(e) => set('tokenUrl')(e.target.value)}
              placeholder="https://idp.example.com/token"
              className="bg-surface-subtle"
            />
          </div>
          <div className="grid gap-1.5">
            <Label>Userinfo URL (optional)</Label>
            <Input
              value={draft.userinfoUrl}
              onChange={(e) => set('userinfoUrl')(e.target.value)}
              placeholder="https://idp.example.com/userinfo"
              className="bg-surface-subtle"
            />
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label>Client ID</Label>
              <Input
                value={draft.clientId}
                onChange={(e) => set('clientId')(e.target.value)}
                className="bg-surface-subtle"
              />
            </div>
            <div className="grid gap-1.5">
              <Label>Client secret</Label>
              <Input
                type="password"
                value={draft.clientSecret}
                onChange={(e) => set('clientSecret')(e.target.value)}
                placeholder={provider?.hasSecret ? '•••••• (leave blank to keep)' : ''}
                className="bg-surface-subtle"
              />
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label>Scopes</Label>
            <Input
              value={draft.scopes}
              onChange={(e) => set('scopes')(e.target.value)}
              placeholder="openid email profile"
              className="bg-surface-subtle"
            />
          </div>

          <div className="grid gap-2 sm:grid-cols-3">
            <div className="grid gap-1.5">
              <Label className="text-xs">Email claim</Label>
              <Input
                value={draft.mapEmail}
                onChange={(e) => set('mapEmail')(e.target.value)}
                placeholder="email"
                className="bg-surface-subtle"
              />
            </div>
            <div className="grid gap-1.5">
              <Label className="text-xs">Name claim</Label>
              <Input
                value={draft.mapName}
                onChange={(e) => set('mapName')(e.target.value)}
                placeholder="name"
                className="bg-surface-subtle"
              />
            </div>
            <div className="grid gap-1.5">
              <Label className="text-xs">Avatar claim</Label>
              <Input
                value={draft.mapAvatar}
                onChange={(e) => set('mapAvatar')(e.target.value)}
                placeholder="picture"
                className="bg-surface-subtle"
              />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border bg-surface-subtle p-3">
            <div>
              <p className="text-sm font-medium text-foreground">Use PKCE</p>
              <p className="text-xs text-muted-foreground">Recommended for OIDC providers.</p>
            </div>
            <Switch checked={draft.pkceEnabled} onCheckedChange={set('pkceEnabled')} />
          </div>

          {redirectUri && <CopyRow label="Redirect URI" value={redirectUri} />}
        </div>

        <div className="flex justify-end gap-2">
          {provider && (
            <Button type="button" variant="ghost" onClick={() => setEditing(false)}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={saving}>
            {saving ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
            Save provider
          </Button>
        </div>
      </form>
    )
  }

  // Management view.
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-lg border border-border bg-surface-card p-4">
        <div className="flex items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
            <KeyRound className="size-5" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-foreground">{provider.providerName || 'OAuth provider'}</p>
              <Badge variant={provider.enabled ? 'success' : 'secondary'}>
                {provider.enabled ? 'Enabled' : 'Disabled'}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground uppercase">{provider.providerType}</p>
          </div>
        </div>
        <Switch checked={provider.enabled} onCheckedChange={handleToggleEnabled} />
      </div>

      <div className="grid gap-4 rounded-lg border border-border bg-surface-card p-4">
        <div className="grid gap-1.5">
          <Label className="text-xs text-muted-foreground">Email domains</Label>
          {provider.emailDomains?.length ? (
            <div className="flex flex-wrap gap-1.5">
              {provider.emailDomains.map((d) => (
                <span
                  key={d}
                  className="inline-flex items-center gap-1 rounded-full border border-border bg-surface-subtle px-2 py-0.5 text-xs text-muted-foreground"
                >
                  <Mail className="size-3" />@{d}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">None — members can only sign in via the direct link.</p>
          )}
        </div>
        <CopyRow label="Redirect URI" value={redirectUri} />
        <CopyRow label="SSO login link" value={loginUrl} />
        <div className="grid gap-1.5">
          <Label className="text-xs text-muted-foreground">Client ID</Label>
          <Input readOnly value={provider.clientId || ''} className="bg-surface-subtle text-xs" />
        </div>
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Link2 className="size-3.5" />
          Share the SSO login link with members, or wire it from the login page.
        </p>
      </div>

      <div className="flex justify-between gap-2">
        <Button
          type="button"
          variant="ghost"
          onClick={handleDelete}
          disabled={deleting}
          className="text-red-400 hover:bg-red-500/10 hover:text-red-400"
        >
          {deleting ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
          Remove
        </Button>
        <Button type="button" onClick={startEdit}>
          <Pencil className="size-4" />
          Edit provider
        </Button>
      </div>
    </div>
  )
}

// Root domain subdomains are hosted under. Inlined at build from the env var.
const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'geiger.studio'

// Domain settings tab: claim/change/remove the org's custom subdomain. Only
// rendered for owners of orgs that bought the subdomain add-on. Debounced live
// availability + preview; reads/writes through the domain server actions and
// owns its toasts.
function DomainTab({ organization }) {
  const [loading, setLoading] = useState(true)
  const [domain, setDomain] = useState(null) // active row or null
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState('')
  const [status, setStatus] = useState('idle') // idle | checking | available | unavailable
  const [reason, setReason] = useState('')
  const [saving, setSaving] = useState(false)
  const [removing, setRemoving] = useState(false)

  useEffect(() => {
    let active = true
    getOrgDomainAction(organization.id).then((res) => {
      if (!active) return
      if (res?.ok) setDomain(res.domain || null)
      else if (res?.error) toast.error(res.error)
      setLoading(false)
    })
    return () => {
      active = false
    }
  }, [organization.id])

  // The form is active for a brand-new claim (no domain) or when changing one.
  const formActive = editing || !domain

  // Debounced availability check as the user types. All state is set inside the
  // async timer callback (never synchronously in the effect body).
  useEffect(() => {
    if (!formActive) return
    const clean = value.trim()
    const timer = setTimeout(async () => {
      if (!clean) {
        setStatus('idle')
        setReason('')
        return
      }
      setStatus('checking')
      const res = await checkSubdomainAvailabilityAction(organization.id, clean)
      if (res?.ok) {
        setStatus(res.available ? 'available' : 'unavailable')
        setReason(res.reason || '')
      } else {
        setStatus('idle')
        setReason(res?.error || '')
      }
    }, clean ? 450 : 0)
    return () => clearTimeout(timer)
  }, [value, formActive, organization.id])

  function startEdit() {
    setValue(domain?.subdomain || '')
    setStatus('idle')
    setReason('')
    setEditing(true)
  }

  // Mirror the server's sanitiser so the preview + stored value stay host-legal.
  function handleChange(e) {
    setValue(
      e.target.value
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, '')
        .replace(/^-+/, '')
        .slice(0, 63),
    )
  }

  const unchanged = value === (domain?.subdomain || '')
  const canSave = status === 'available' && !unchanged && !saving

  async function handleSave() {
    setSaving(true)
    const res = await saveOrgSubdomainAction(organization.id, value)
    setSaving(false)
    if (res?.ok) {
      setDomain(res.domain)
      setEditing(false)
      toast.success('Subdomain saved.')
    } else {
      toast.error(res?.error || 'Could not save the subdomain.')
    }
  }

  async function handleRemove() {
    setRemoving(true)
    const res = await removeOrgSubdomainAction(organization.id)
    setRemoving(false)
    if (res?.ok) {
      setDomain(null)
      setEditing(false)
      setValue('')
      toast.success('Subdomain removed.')
    } else {
      toast.error(res?.error || 'Could not remove the subdomain.')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        Loading domain settings…
      </div>
    )
  }

  const previewHost = `${value || 'yourname'}.${ROOT_DOMAIN}`

  // Live view — an active subdomain exists and we're not changing it.
  if (domain && !editing) {
    const host = `${domain.subdomain}.${ROOT_DOMAIN}`
    return (
      <div className="space-y-4">
        <div className="rounded-lg border border-border bg-surface-card p-4">
          <div className="flex items-center gap-2">
            <Globe className="size-4 text-muted-foreground" />
            <p className="text-sm font-medium text-foreground">Your subdomain is live</p>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            This workspace is reachable at the address below. Opening it shows only this organization.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-lg border border-border bg-surface-card p-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-surface-subtle text-emerald-400">
            <Globe className="size-4" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-semibold text-foreground">{host}</span>
            <span className="block text-xs text-emerald-400">Active</span>
          </span>
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            aria-label="Copy address"
            className="shrink-0 border-border bg-surface-subtle"
            onClick={() => {
              navigator.clipboard?.writeText(host)
              toast.success('Address copied.')
            }}
          >
            <Copy className="size-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            aria-label="Visit workspace"
            asChild
            className="shrink-0 border-border bg-surface-subtle"
          >
            <a href={`https://${host}`} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="size-4" />
            </a>
          </Button>
        </div>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="ghost"
            onClick={handleRemove}
            disabled={removing}
            className="text-red-400 hover:bg-red-500/10 hover:text-red-400"
          >
            {removing ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
            Remove
          </Button>
          <Button type="button" onClick={startEdit}>
            <Pencil className="size-4" />
            Change
          </Button>
        </div>
      </div>
    )
  }

  // Setup / change form.
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border bg-surface-card p-4">
        <div className="flex items-center gap-2">
          <Globe className="size-4 text-muted-foreground" />
          <p className="text-sm font-medium text-foreground">
            {domain ? 'Change your subdomain' : 'Claim your subdomain'}
          </p>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Pick a subdomain to host this workspace. Visitors to it see only this organization.
        </p>
      </div>

      <div className="grid gap-2 rounded-lg border border-border bg-surface-card p-4">
        <Label htmlFor={`subdomain-${organization.id}`}>Subdomain</Label>
        <div className="flex items-stretch overflow-hidden rounded-md border border-border bg-surface-subtle focus-within:ring-2 focus-within:ring-ring">
          <input
            id={`subdomain-${organization.id}`}
            value={value}
            onChange={handleChange}
            placeholder="yourname"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-foreground outline-none placeholder:text-text-tertiary"
          />
          <span className="flex items-center border-l border-border bg-surface-active px-3 text-sm text-muted-foreground">
            .{ROOT_DOMAIN}
          </span>
        </div>

        <div className="flex min-h-[1.25rem] items-center gap-2 text-xs">
          {status === 'checking' && (
            <>
              <Loader2 className="size-3.5 animate-spin text-muted-foreground" />
              <span className="text-muted-foreground">Checking availability…</span>
            </>
          )}
          {status === 'available' && (
            <>
              <Check className="size-3.5 text-emerald-400" />
              <span className="text-emerald-400">{previewHost} is available</span>
            </>
          )}
          {status === 'unavailable' && <span className="text-red-400">{reason || 'Not available.'}</span>}
          {status === 'idle' && value && <span className="text-muted-foreground">Preview: {previewHost}</span>}
          {status === 'idle' && !value && (
            <span className="text-text-tertiary">3–63 characters · letters, numbers, and hyphens</span>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        {editing && domain && (
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              setEditing(false)
              setValue('')
            }}
          >
            Cancel
          </Button>
        )}
        <Button type="button" onClick={handleSave} disabled={!canSave}>
          {saving ? <Loader2 className="size-4 animate-spin" /> : <Globe className="size-4" />}
          {domain ? 'Save changes' : 'Claim subdomain'}
        </Button>
      </div>
    </div>
  )
}

const EMPTY_TEMPLATE_DRAFT = {
  name: '',
  eventName: '',
  subject: '',
  body: '',
  status: 'draft',
}

// Emails settings tab: create and manage the org's branded email templates. Only
// rendered for owners of orgs that bought the "Custom email templates" add-on.
// Reads/writes through the email server actions; optimistic + owns its toasts.
function EmailTemplatesTab({ organization }) {
  const [loading, setLoading] = useState(true)
  const [templates, setTemplates] = useState([])
  const [mode, setMode] = useState('list') // list | form
  const [editingId, setEditingId] = useState(null)
  const [draft, setDraft] = useState(EMPTY_TEMPLATE_DRAFT)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    let active = true
    listOrgEmailTemplatesAction(organization.id).then((res) => {
      if (!active) return
      if (res?.ok) setTemplates(res.templates)
      else if (res?.error) toast.error(res.error)
      setLoading(false)
    })
    return () => {
      active = false
    }
  }, [organization.id])

  const set = (key) => (value) => setDraft((d) => ({ ...d, [key]: value }))

  function startCreate() {
    setEditingId(null)
    setDraft(EMPTY_TEMPLATE_DRAFT)
    setMode('form')
  }

  function startEdit(template) {
    setEditingId(template.id)
    setDraft({
      name: template.name || '',
      eventName: template.eventName || '',
      subject: template.subject || '',
      body: template.body || '',
      status: template.status || 'draft',
    })
    setMode('form')
  }

  async function handleSave(e) {
    e.preventDefault()
    if (!draft.name.trim()) {
      toast.error('Give the template a name.')
      return
    }
    setSaving(true)
    const res = editingId
      ? await updateOrgEmailTemplateAction(organization.id, editingId, draft)
      : await createOrgEmailTemplateAction(organization.id, draft)
    setSaving(false)
    if (res?.ok) {
      setTemplates((prev) =>
        editingId
          ? prev.map((t) => (t.id === res.template.id ? res.template : t))
          : [res.template, ...prev],
      )
      toast.success(editingId ? 'Template saved.' : 'Template created.')
      setMode('list')
      setEditingId(null)
    } else {
      toast.error(res?.error || 'Could not save the template.')
    }
  }

  async function handleDelete(template) {
    setDeletingId(template.id)
    const res = await deleteOrgEmailTemplateAction(organization.id, template.id)
    setDeletingId(null)
    if (res?.ok) {
      setTemplates((prev) => prev.filter((t) => t.id !== template.id))
      toast.success('Template deleted.')
    } else {
      toast.error(res?.error || 'Could not delete the template.')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        Loading templates…
      </div>
    )
  }

  // Create / edit form.
  if (mode === 'form') {
    return (
      <form onSubmit={handleSave} className="space-y-4">
        <div className="rounded-lg border border-border bg-surface-card p-4">
          <div className="flex items-center gap-2">
            <Mail className="size-4 text-muted-foreground" />
            <p className="text-sm font-medium text-foreground">
              {editingId ? 'Edit email template' : 'New email template'}
            </p>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Design a reusable, branded email for one of your events. Sends draw from your organization&apos;s shared email purse.
          </p>
        </div>

        <div className="grid gap-4 rounded-lg border border-border bg-surface-card p-4">
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label>Template name</Label>
              <Input
                value={draft.name}
                onChange={(e) => set('name')(e.target.value)}
                placeholder="Launch invite"
                className="bg-surface-subtle"
              />
            </div>
            <div className="grid gap-1.5">
              <Label>Event / purpose</Label>
              <Input
                value={draft.eventName}
                onChange={(e) => set('eventName')(e.target.value)}
                placeholder="Summer Launch 2026"
                className="bg-surface-subtle"
              />
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label>Subject line</Label>
            <Input
              value={draft.subject}
              onChange={(e) => set('subject')(e.target.value)}
              placeholder="You're invited to our launch"
              className="bg-surface-subtle"
            />
          </div>

          <div className="grid gap-1.5">
            <Label>Body</Label>
            <Textarea
              value={draft.body}
              onChange={(e) => set('body')(e.target.value)}
              placeholder="Write your email. Use {{name}} to personalize."
              className="min-h-40 resize-y bg-surface-subtle"
            />
            <p className="text-xs text-muted-foreground">
              Plain text or HTML. Merge fields like <code>{'{{name}}'}</code> are filled in when the email is sent.
            </p>
          </div>

          <div className="grid gap-1.5 sm:max-w-[200px]">
            <Label>Status</Label>
            <Select value={draft.status} onValueChange={set('status')}>
              <SelectTrigger className="bg-surface-subtle">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="active">Active</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              setMode('list')
              setEditingId(null)
            }}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
            {editingId ? 'Save template' : 'Create template'}
          </Button>
        </div>
      </form>
    )
  }

  // List view.
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-surface-card p-4">
        <div className="flex items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
            <Mail className="size-5" />
          </span>
          <div>
            <p className="text-sm font-medium text-foreground">Email templates</p>
            <p className="text-xs text-muted-foreground">Reusable branded emails for your events.</p>
          </div>
        </div>
        <Button type="button" onClick={startCreate}>
          <Plus className="size-4" />
          New template
        </Button>
      </div>

      {templates.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-border bg-surface-card px-6 py-10 text-center">
          <Mail className="size-6 text-muted-foreground" />
          <p className="text-sm font-medium text-foreground">No templates yet</p>
          <p className="max-w-xs text-xs text-muted-foreground">
            Create your first branded email template to reuse across your events.
          </p>
          <Button type="button" variant="outline" className="mt-2 border-border bg-surface-subtle" onClick={startCreate}>
            <Plus className="size-4" />
            New template
          </Button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-border bg-surface-card">
          <div className="divide-y divide-border">
            {templates.map((t) => (
              <div key={t.id} className="flex items-center gap-3 px-3 py-2.5">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-surface-subtle text-muted-foreground">
                  <Mail className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-medium text-foreground">{t.name}</p>
                    <Badge variant={t.status === 'active' ? 'success' : 'secondary'}>
                      {t.status === 'active' ? 'Active' : 'Draft'}
                    </Badge>
                  </div>
                  <p className="truncate text-xs text-muted-foreground">
                    {t.eventName ? `${t.eventName} · ` : ''}
                    {t.subject || 'No subject'}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Edit template"
                  className="text-muted-foreground hover:text-foreground"
                  onClick={() => startEdit(t)}
                >
                  <Pencil className="size-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Delete template"
                  disabled={deletingId === t.id}
                  className="text-red-400 hover:bg-red-500/10 hover:text-red-400"
                  onClick={() => handleDelete(t)}
                >
                  {deletingId === t.id ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function OrganizationCard({ organization, userId }) {
  const router = useRouter()
  const members = Array.isArray(organization.metadata?.members) ? organization.metadata.members : []
  // Prefer the authoritative count computed in the data layer (union of the
  // relational members, owner/creator, and legacy metadata list); fall back to
  // the legacy array only when it wasn't provided.
  const memberCount = Number.isFinite(organization.memberCount)
    ? Math.max(organization.memberCount, 1)
    : Math.max(members.length, 1)
  const isOwner = organization.owner === userId
  const isCreator = organization.created_by === userId
  // Org administration (edit / archive / deactivate / settings) is owner-only,
  // matching the RLS model where `org.*` abilities aren't an open module.
  const canManage = isOwner || isCreator
  // Show the OAuth tab only when this org bought the OAuth add-on (derived from
  // its recorded subscription) and the viewer can manage the org.
  const hasOauthAddon = useMemo(
    () => isProductUnlocked(getOrgEntitlements(organization), 'oauth'),
    [organization],
  )
  // Show the Domain tab only when this org bought the subdomain add-on.
  const hasSubdomainAddon = useMemo(
    () => isProductUnlocked(getOrgEntitlements(organization), 'subdomain'),
    [organization],
  )
  // Show the Emails tab only when this org bought the email templates add-on.
  const hasEmailTemplateAddon = useMemo(
    () => isProductUnlocked(getOrgEntitlements(organization), 'emailTemplate'),
    [organization],
  )
  const role = isOwner ? 'Owner' : isCreator ? 'Creator' : 'Member'
  const statusLabel = organization.is_active ? 'Active' : 'Inactive'
  const [editOpen, setEditOpen] = useState(false)
  const [archiveOpen, setArchiveOpen] = useState(false)
  const [deactivateOpen, setDeactivateOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [activeSettingsTab, setActiveSettingsTab] = useState('general')
  const [editForm, setEditForm] = useState({
    name: organization.name || '',
    description: organization.description || '',
    country: organization.country || '',
    phone: organization.phone || '',
  })
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [avatarUploading, setAvatarUploading] = useState(false)
  const avatarInputRef = useRef(null)

  async function handleAvatarChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarPreview(URL.createObjectURL(file))
    setAvatarUploading(true)
    const fd = new FormData()
    fd.set('organization_id', organization.id)
    fd.set('avatar', file)
    const result = await updateOrgAvatarAction(fd)
    setAvatarUploading(false)
    if (result.ok) {
      toast.success('Icon updated.')
    } else {
      setAvatarPreview(null)
      toast.error(result.error || 'Upload failed.')
    }
    e.target.value = ''
  }

  function handleEditSave(event) {
    event.preventDefault()
    toast.success('Organization updated.')
    setEditOpen(false)
  }

  function handleArchiveConfirm() {
    toast.success('Organization archived.')
    setArchiveOpen(false)
  }

  function handleDeactivateConfirm() {
    toast.success('Organization deactivated.')
    setDeactivateOpen(false)
  }

  function handleOpenOrganization() {
    if (organization?.id) {
      router.push(`/org/${organization.id}`)
    }
  }

  const deploymentLocation = getDeploymentLocation(organization.country)

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <Card
            className="group cursor-pointer border-border bg-surface-subtle py-0 text-foreground transition-colors duration-200 hover:border-border-strong"
            onClick={handleOpenOrganization}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                handleOpenOrganization()
              }
            }}
            role="button"
            tabIndex={0}
          >
            <CardContent className="space-y-4 p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 flex-1 items-start gap-3">
                  <div className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-surface-card">
                    {avatarPreview || organization.avatar_url ? (
                      <Image
                        src={avatarPreview || organization.avatar_url}
                        alt=""
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <span className="select-none text-sm font-semibold text-foreground">
                        {(organization.name || 'O').slice(0, 1).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="truncate text-sm font-semibold leading-snug text-foreground transition-colors group-hover:text-foreground">
                        {organization.name || 'Untitled organization'}
                      </h2>
                      <Badge variant={organization.is_active ? 'success' : 'secondary'} className="border px-2 py-0 text-[10px]">
                        {statusLabel}
                      </Badge>
                    </div>
                    <p className="flex items-center gap-1.5 text-xs text-text-secondary">
                      {deploymentLocation ? (
                        <span className="text-sm leading-none" aria-label={deploymentLocation.label} title={deploymentLocation.label}>
                          {deploymentLocation.flag}
                        </span>
                      ) : (
                        'Workspace'
                      )}
                    </p>
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 shrink-0 text-text-tertiary hover:bg-surface-active hover:text-muted-foreground"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-48 rounded-lg border-border bg-surface-subtle text-foreground"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <DropdownMenuItem className="cursor-pointer gap-2 text-xs focus:bg-surface-active focus:text-foreground" onClick={() => handleOpenOrganization()}>
                      <ExternalLink className="h-3.5 w-3.5" />
                      Open
                    </DropdownMenuItem>
                    {canManage ? (
                      <>
                        <DropdownMenuSeparator className="bg-surface-hover" />
                        <DropdownMenuItem className="cursor-pointer gap-2 text-xs focus:bg-surface-active focus:text-foreground" onClick={() => setEditOpen(true)}>
                          <Pencil className="h-3.5 w-3.5" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer gap-2 text-xs focus:bg-surface-active focus:text-foreground" onClick={() => setArchiveOpen(true)}>
                          <Archive className="h-3.5 w-3.5" />
                          Archive
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer gap-2 text-xs focus:bg-surface-active focus:text-foreground" onClick={() => setDeactivateOpen(true)}>
                          <Power className="h-3.5 w-3.5" />
                          Deactivate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-surface-hover" />
                        <DropdownMenuItem className="cursor-pointer gap-2 text-xs focus:bg-surface-active focus:text-foreground" onClick={() => setSettingsOpen(true)}>
                          <Settings2 className="h-3.5 w-3.5" />
                          Settings
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer gap-2 text-xs focus:bg-surface-active focus:text-foreground" onClick={() => router.push(`/org/${organization.id}/usage`)}>
                          <Gauge className="h-3.5 w-3.5" />
                          Usage
                        </DropdownMenuItem>
                      </>
                    ) : null}
                    <DropdownMenuSeparator className="bg-surface-hover" />
                    <DropdownMenuItem
                      className="cursor-pointer gap-2 text-xs focus:bg-surface-active focus:text-foreground"
                      onClick={() => { navigator.clipboard?.writeText(organization.id); toast.success('ID copied.') }}
                    >
                      <Copy className="h-3.5 w-3.5" />
                      Copy ID
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="inline-flex items-center gap-1.5 rounded-md bg-surface-card px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-text-secondary">
                  <ShieldCheck className="h-3 w-3" />
                  {role}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-md bg-surface-card px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-text-secondary">
                  <Users className="h-3 w-3" />
                  {memberCount} {memberCount === 1 ? 'member' : 'members'}
                </span>
              </div>
            </CardContent>
          </Card>
        </ContextMenuTrigger>

        <ContextMenuContent className="w-48 rounded-lg border-border bg-surface-subtle p-1 text-foreground">
          <ContextMenuItem onClick={() => handleOpenOrganization()} className="flex cursor-pointer items-center gap-2 px-2 py-1.5 text-xs focus:bg-surface-active focus:text-foreground">
            <ExternalLink className="h-3.5 w-3.5" />
            Open
          </ContextMenuItem>
          {canManage ? (
            <>
              <ContextMenuSeparator className="bg-surface-hover" />
              <ContextMenuItem onClick={() => setEditOpen(true)} className="flex cursor-pointer items-center gap-2 px-2 py-1.5 text-xs focus:bg-surface-active focus:text-foreground">
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </ContextMenuItem>
              <ContextMenuItem onClick={() => setArchiveOpen(true)} className="flex cursor-pointer items-center gap-2 px-2 py-1.5 text-xs focus:bg-surface-active focus:text-foreground">
                <Archive className="h-3.5 w-3.5" />
                Archive
              </ContextMenuItem>
              <ContextMenuItem onClick={() => setDeactivateOpen(true)} className="flex cursor-pointer items-center gap-2 px-2 py-1.5 text-xs focus:bg-surface-active focus:text-foreground">
                <Power className="h-3.5 w-3.5" />
                Deactivate
              </ContextMenuItem>
              <ContextMenuSeparator className="bg-surface-hover" />
              <ContextMenuItem onClick={() => setSettingsOpen(true)} className="flex cursor-pointer items-center gap-2 px-2 py-1.5 text-xs focus:bg-surface-active focus:text-foreground">
                <Settings2 className="h-3.5 w-3.5" />
                Settings
              </ContextMenuItem>
              <ContextMenuItem onClick={() => router.push(`/org/${organization.id}/usage`)} className="flex cursor-pointer items-center gap-2 px-2 py-1.5 text-xs focus:bg-surface-active focus:text-foreground">
                <Gauge className="h-3.5 w-3.5" />
                Usage
              </ContextMenuItem>
            </>
          ) : null}
          <ContextMenuSeparator className="bg-surface-hover" />
          <ContextMenuItem
            onClick={() => { navigator.clipboard?.writeText(organization.id); toast.success('ID copied.') }}
            className="flex cursor-pointer items-center gap-2 px-2 py-1.5 text-xs focus:bg-surface-active focus:text-foreground"
          >
            <Copy className="h-3.5 w-3.5" />
            Copy ID
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      {canManage ? (
        <>
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="geiger-flow-palette max-w-lg border-border bg-surface-subtle text-foreground">
          <DialogHeader>
            <DialogTitle>Edit organization</DialogTitle>
            <DialogDescription>Update the basic workspace details for this organization.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSave} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor={`org-name-${organization.id}`}>Name</Label>
              <Input
                id={`org-name-${organization.id}`}
                value={editForm.name}
                onChange={(event) => setEditForm((current) => ({ ...current, name: event.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`org-description-${organization.id}`}>Description</Label>
              <Textarea
                id={`org-description-${organization.id}`}
                value={editForm.description}
                onChange={(event) => setEditForm((current) => ({ ...current, description: event.target.value }))}
                className="min-h-24 resize-none"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor={`org-country-${organization.id}`}>Country</Label>
                <Input
                  id={`org-country-${organization.id}`}
                  value={editForm.country}
                  onChange={(event) => setEditForm((current) => ({ ...current, country: event.target.value }))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor={`org-phone-${organization.id}`}>Phone</Label>
                <Input
                  id={`org-phone-${organization.id}`}
                  value={editForm.phone}
                  onChange={(event) => setEditForm((current) => ({ ...current, phone: event.target.value }))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setEditOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={archiveOpen} onOpenChange={setArchiveOpen}>
        <DialogContent className="geiger-flow-palette max-w-md border-border bg-surface-subtle text-foreground">
          <DialogHeader>
            <DialogTitle>Archive organization</DialogTitle>
            <DialogDescription>
              This will move {organization.name || 'this organization'} into the archive view without removing it.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setArchiveOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleArchiveConfirm}>Archive</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deactivateOpen} onOpenChange={setDeactivateOpen}>
        <DialogContent className="geiger-flow-palette max-w-md border-border bg-surface-subtle text-foreground">
          <DialogHeader>
            <DialogTitle>Deactivate organization</DialogTitle>
            <DialogDescription>
              This will disable the workspace and keep it available for later reactivation.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeactivateOpen(false)}>
              Cancel
            </Button>
            <Button variant="secondary" onClick={handleDeactivateConfirm}>
              Deactivate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="geiger-flow-palette max-w-2xl overflow-hidden border-border bg-surface-subtle p-0 text-foreground shadow-xl">
          <DialogHeader className="border-b border-border p-4">
            <div className="flex items-center gap-2">
              <Settings2 className="h-5 w-5 text-muted-foreground" />
              <DialogTitle className="text-base font-medium text-foreground">Organization settings</DialogTitle>
            </div>
          </DialogHeader>

          <div className="flex border-b border-border bg-surface-subtle">
            {[
              { id: 'general', label: 'General' },
              { id: 'members', label: 'Members' },
              { id: 'security', label: 'Security' },
              ...(hasSubdomainAddon ? [{ id: 'domain', label: 'Domain' }] : []),
              ...(hasEmailTemplateAddon ? [{ id: 'emails', label: 'Emails' }] : []),
              ...(hasOauthAddon ? [{ id: 'oauth', label: 'OAuth' }] : []),
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveSettingsTab(tab.id)}
                className={`flex-1 border-b-2 py-3 text-sm font-medium transition-colors ${activeSettingsTab === tab.id ? 'border-white bg-surface-hover/30 text-foreground' : 'border-transparent text-foreground/70 hover:bg-surface-hover/20 hover:text-foreground'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="max-h-[460px] overflow-y-auto bg-surface-subtle p-6">
            {activeSettingsTab === 'general' && (
              <div className="space-y-4">
                <div className="flex items-center gap-4 rounded-lg border border-border bg-surface-card p-4">
                  <div className="group/avatar relative shrink-0">
                    <div className="relative flex size-16 items-center justify-center overflow-hidden rounded-xl border border-border bg-surface-subtle">
                      {avatarPreview || organization.avatar_url ? (
                        <Image
                          src={avatarPreview || organization.avatar_url}
                          alt=""
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <span className="select-none text-2xl font-semibold text-foreground">
                          {(organization.name || 'O').slice(0, 1).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => avatarInputRef.current?.click()}
                      disabled={avatarUploading}
                      aria-label="Change organization icon"
                      className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/50 opacity-0 transition-opacity group-hover/avatar:opacity-100 disabled:pointer-events-none"
                    >
                      {avatarUploading
                        ? <Loader2 className="size-5 animate-spin text-white" />
                        : <Camera className="size-5 text-white" />
                      }
                    </button>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">Organization icon</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">PNG, JPG, or WebP · max 2 MB</p>
                    <button
                      type="button"
                      onClick={() => avatarInputRef.current?.click()}
                      disabled={avatarUploading}
                      className="mt-2 text-xs text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none"
                    >
                      {avatarUploading ? 'Uploading…' : 'Upload image'}
                    </button>
                  </div>
                  <input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor={`settings-name-${organization.id}`}>Workspace name</Label>
                  <Input id={`settings-name-${organization.id}`} defaultValue={organization.name || ''} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor={`settings-country-${organization.id}`}>Country</Label>
                  <Input id={`settings-country-${organization.id}`} defaultValue={organization.country || ''} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor={`settings-phone-${organization.id}`}>Phone</Label>
                  <Input id={`settings-phone-${organization.id}`} defaultValue={organization.phone || ''} />
                </div>
              </div>
            )}

            {activeSettingsTab === 'members' && (
              <MembersTab
                organization={organization}
                userId={userId}
                roleLabel={role}
                canManage={canManage}
              />
            )}

            {activeSettingsTab === 'security' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border border-border bg-surface-subtle p-4">
                  <div>
                    <p className="text-sm font-medium text-foreground">Workspace active</p>
                    <p className="text-sm text-muted-foreground">Allow members to access this workspace.</p>
                  </div>
                  <Switch defaultChecked={Boolean(organization.is_active)} />
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border bg-surface-subtle p-4">
                  <div>
                    <p className="text-sm font-medium text-foreground">Require approval for new joins</p>
                    <p className="text-sm text-muted-foreground">Review incoming requests before access is granted.</p>
                  </div>
                  <Switch />
                </div>
              </div>
            )}

            {activeSettingsTab === 'domain' && hasSubdomainAddon && <DomainTab organization={organization} />}

            {activeSettingsTab === 'emails' && hasEmailTemplateAddon && <EmailTemplatesTab organization={organization} />}

            {activeSettingsTab === 'oauth' && hasOauthAddon && <OAuthTab organization={organization} />}
          </div>

          <div className="flex justify-end gap-2 border-t border-border bg-surface-subtle p-4">
            <Button variant="ghost" onClick={() => setSettingsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => { toast.success('Settings updated.'); setSettingsOpen(false) }}>
              Save changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
        </>
      ) : null}
    </>
  )
}

// Shown on a subdomain host when the signed-in user can't see the pinned org.
function SubdomainNotice({ scope }) {
  const notFound = scope.status === 'not-found'
  const host = `${scope.subdomain}.${ROOT_DOMAIN}`
  return (
    <div className="flex min-h-[52vh] items-center justify-center">
      <div className="mx-auto flex max-w-md flex-col items-center rounded-xl border border-dashed border-border bg-surface-subtle px-8 py-12 text-center">
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-md border border-border bg-background">
          <Globe className="h-6 w-6 text-text-secondary" />
        </div>
        <h2 className="text-xl font-semibold tracking-tight">
          {notFound ? 'Workspace not found' : "You're not a member"}
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {notFound
            ? `No workspace is connected to ${host}.`
            : `${scope.orgName || 'This workspace'} is hosted at ${host}, but your account isn't a member of it.`}
        </p>
        <a
          href={`https://${ROOT_DOMAIN}/org`}
          className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors hover:text-muted-foreground"
        >
          <ExternalLink className="size-4" />
          Go to all organizations
        </a>
      </div>
    </div>
  )
}

export function OrganizationsClient({ organizations, userId, searchState, scope = null }) {
  const router = useRouter()
  const message = useMemo(() => getMessage(searchState), [searchState])
  const notifiedMessage = useRef(null)

  useEffect(() => {
    if (!message || notifiedMessage.current === message.id) return

    notifiedMessage.current = message.id
    toast[message.type](message.text)
    router.replace(ORG_ROUTE, { scroll: false })
  }, [message, router])

  // On a subdomain host the page is pinned to a single organization: no create /
  // join affordances, and a tailored notice when the user can't see it.
  const scoped = Boolean(scope)
  const scopedBlocked = scoped && scope.status !== 'member'

  return (
    <main className="min-h-screen bg-background pt-12 text-foreground">
      <section className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-2xl mt-6">
            <h1 className="text-3xl font-bold text-foreground">
              {scoped ? scope.orgName || 'Workspace' : 'Organizations'}
            </h1>
            <p className="mt-1 text-muted-foreground">
              {scoped
                ? `You're viewing this workspace on ${scope.subdomain}.${ROOT_DOMAIN}.`
                : 'Manage the teams, ownership boundaries, and shared workspaces connected to your Geiger tools.'}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:items-end">
            {!scoped && organizations.length > 0 ? <ActionDialogs /> : null}
          </div>
        </div>

        {scopedBlocked ? (
          <SubdomainNotice scope={scope} />
        ) : organizations.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {organizations.map((organization) => (
              <OrganizationCard key={organization.id} organization={organization} userId={userId} />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
