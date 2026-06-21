'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Archive,
  Building2,
  MoreHorizontal,
  Pencil,
  Plus,
  Power,
  Settings2,
  ShieldCheck,
  UserPlus,
  Users,
} from 'lucide-react'
import { toast } from 'sonner'
import { createOrganizationAction, joinOrganizationAction } from './actions'
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

      <Dialog open={joinOpen} onOpenChange={setJoinOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="h-9 border-border bg-surface-subtle text-foreground hover:bg-surface-hover">
            <UserPlus className="h-4 w-4" />
            Join
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

function OrganizationCard({ organization, userId }) {
  const router = useRouter()
  const members = Array.isArray(organization.metadata?.members) ? organization.metadata.members : []
  const memberCount = Math.max(members.length, 1)
  const isOwner = organization.owner === userId
  const isCreator = organization.created_by === userId
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
                  <DropdownMenuContent align="end" className="w-48 rounded-lg border-border bg-surface-subtle text-foreground">
                    <DropdownMenuItem className="cursor-pointer gap-2 text-xs focus:bg-surface-active focus:text-foreground" onSelect={() => setEditOpen(true)}>
                      <Pencil className="h-3.5 w-3.5" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer gap-2 text-xs focus:bg-surface-active focus:text-foreground" onSelect={() => setArchiveOpen(true)}>
                      <Archive className="h-3.5 w-3.5" />
                      Archive
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer gap-2 text-xs focus:bg-surface-active focus:text-foreground" onSelect={() => setDeactivateOpen(true)}>
                      <Power className="h-3.5 w-3.5" />
                      Deactivate
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-surface-hover" />
                    <DropdownMenuItem className="cursor-pointer gap-2 text-xs focus:bg-surface-active focus:text-foreground" onSelect={() => setSettingsOpen(true)}>
                      <Settings2 className="h-3.5 w-3.5" />
                      Settings
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
          <ContextMenuItem onSelect={() => setEditOpen(true)} className="flex cursor-pointer items-center gap-2 px-2 py-1.5 text-xs focus:bg-surface-active focus:text-foreground">
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </ContextMenuItem>
          <ContextMenuItem onSelect={() => setArchiveOpen(true)} className="flex cursor-pointer items-center gap-2 px-2 py-1.5 text-xs focus:bg-surface-active focus:text-foreground">
            <Archive className="h-3.5 w-3.5" />
            Archive
          </ContextMenuItem>
          <ContextMenuItem onSelect={() => setDeactivateOpen(true)} className="flex cursor-pointer items-center gap-2 px-2 py-1.5 text-xs focus:bg-surface-active focus:text-foreground">
            <Power className="h-3.5 w-3.5" />
            Deactivate
          </ContextMenuItem>
          <ContextMenuSeparator className="bg-surface-hover" />
          <ContextMenuItem onSelect={() => setSettingsOpen(true)} className="flex cursor-pointer items-center gap-2 px-2 py-1.5 text-xs focus:bg-surface-active focus:text-foreground">
            <Settings2 className="h-3.5 w-3.5" />
            Settings
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

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
              <div className="space-y-4">
                <div className="rounded-lg border border-border bg-surface-subtle p-4">
                  <p className="text-sm font-medium text-foreground">Member access</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {memberCount} {memberCount === 1 ? 'member' : 'members'} currently in this workspace.
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-surface-subtle p-4">
                  <p className="text-sm font-medium text-foreground">Your role</p>
                  <p className="mt-1 text-sm text-muted-foreground">You currently have {role.toLowerCase()} access.</p>
                </div>
              </div>
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
  )
}

export function OrganizationsClient({ organizations, userId, searchState }) {
  const router = useRouter()
  const message = useMemo(() => getMessage(searchState), [searchState])
  const notifiedMessage = useRef(null)
  const activeCount = organizations.filter((organization) => organization.is_active).length
  const memberCount = organizations.reduce((total, organization) => {
    const members = Array.isArray(organization.metadata?.members) ? organization.metadata.members : []
    return total + Math.max(members.length, 1)
  }, 0)

  useEffect(() => {
    if (!message || notifiedMessage.current === message.id) return

    notifiedMessage.current = message.id
    toast[message.type](message.text)
    router.replace(ORG_ROUTE, { scroll: false })
  }, [message, router])

  return (
    <main className="min-h-screen bg-background pt-12 text-foreground">
      <section className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-2xl mt-6">
            <h1 className="text-3xl font-bold text-foreground">Organizations</h1>
            <p className="mt-1 text-muted-foreground">
              Manage the teams, ownership boundaries, and shared workspaces connected to your Geiger tools.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:items-end">
            {organizations.length > 0 ? <ActionDialogs /> : null}
          </div>
        </div>

        {organizations.length === 0 ? (
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
