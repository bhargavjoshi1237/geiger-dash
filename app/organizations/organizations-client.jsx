'use client'

import { useMemo, useState } from 'react'
import { Building2, CalendarDays, CheckCircle2, CircleAlert, MapPin, Phone, Plus, UserPlus } from 'lucide-react'
import { createOrganizationAction, joinOrganizationAction } from './actions'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

function formatDate(value) {
  if (!value) return 'No date'
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value))
}

function getMessage(searchState) {
  if (searchState.created) return { type: 'success', text: 'Organization created.' }
  if (searchState.joined) return { type: 'success', text: 'Organization joined.' }
  if (searchState.error === 'missing_required') return { type: 'error', text: 'Name and description are required.' }
  if (searchState.error === 'missing_join_id') return { type: 'error', text: 'Enter an organization ID to join.' }
  if (searchState.error === 'organization_not_found') return { type: 'error', text: 'No organization was found for that ID.' }
  if (searchState.error) return { type: 'error', text: searchState.error }
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
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="country">Country</Label>
          <Input id="country" name="country" placeholder="India" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" placeholder="+91 98765 43210" />
        </div>
      </div>
      <DialogFooter>
        <Button type="submit" className="w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          Create organization
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
          <Button>
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
          <Button variant="outline">
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
      <div className="mx-auto flex max-w-md flex-col items-center text-center">
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-lg border border-border bg-surface-subtle">
          <Building2 className="h-6 w-6 text-muted-foreground" />
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
  const members = Array.isArray(organization.metadata?.members) ? organization.metadata.members : []
  const memberCount = Math.max(members.length, 1)
  const isOwner = organization.owner === userId
  const isCreator = organization.created_by === userId
  const role = isOwner ? 'Owner' : isCreator ? 'Creator' : 'Member'

  return (
    <article className="rounded-lg border border-border bg-card p-5 shadow-sm transition-colors hover:border-border-strong">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="truncate text-base font-semibold">{organization.name || 'Untitled organization'}</h2>
            <Badge variant={organization.is_active ? 'success' : 'secondary'}>
              {organization.is_active ? 'Active' : 'Inactive'}
            </Badge>
          </div>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">{organization.description}</p>
        </div>
        <Badge variant="outline">{role}</Badge>
      </div>

      <div className="mt-5 grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
        <span className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4" />
          {formatDate(organization.created_at)}
        </span>
        <span className="flex items-center gap-2">
          <Building2 className="h-4 w-4" />
          ID {organization.id}
        </span>
        {organization.country ? (
          <span className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            {organization.country}
          </span>
        ) : null}
        {organization.phone ? (
          <span className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            {organization.phone}
          </span>
        ) : null}
      </div>

      <div className="mt-5 border-t border-border pt-4 text-xs text-foreground0">
        {memberCount} {memberCount === 1 ? 'member' : 'members'}
      </div>
    </article>
  )
}

export function OrganizationsClient({ organizations, userId, searchState }) {
  const message = useMemo(() => getMessage(searchState), [searchState])

  return (
    <main className="min-h-screen bg-background pt-12 text-foreground">
      <section className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex flex-col gap-5 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-foreground0">Workspace</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">Organizations</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              View the organizations you own, created, or joined.
            </p>
          </div>
          {organizations.length > 0 ? <ActionDialogs /> : null}
        </div>

        {message ? (
          <div
            className={`mt-4 flex items-center gap-2 rounded-lg border px-3 py-2 text-sm ${
              message.type === 'success'
                ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                : 'border-red-500/20 bg-red-500/10 text-red-500'
            }`}
          >
            {message.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <CircleAlert className="h-4 w-4" />}
            {message.text}
          </div>
        ) : null}

        {organizations.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {organizations.map((organization) => (
              <OrganizationCard key={organization.id} organization={organization} userId={userId} />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
