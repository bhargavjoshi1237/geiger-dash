'use client'

import { useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import {
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  Building2,
  Camera,
  Check,
  Copy,
  Crown,
  Gauge,
  Globe,
  Loader2,
  LogOut,
  Moon,
  Plus,
  ShieldCheck,
  Sun,
  Trash2,
} from 'lucide-react'
import { toast } from 'sonner'
import { Card, Section } from '@/components/account/panel'
import { ProductAccess } from '@/components/billing/product-access'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { clearProfileImageCache } from '@/lib/profile-image-cache'
import { cn } from '@/lib/utils'
import {
  changeEmailAction,
  changePasswordAction,
  removeAvatarAction,
  signOutEverywhereAction,
  updateAvatarAction,
  updatePreferencesAction,
  updateProfileAction,
} from '../actions'

const PLAN_PHASE_BADGE = {
  trialing: { label: 'Trial', variant: 'warning' },
  active: { label: 'Active', variant: 'success' },
  grace: { label: 'Ended', variant: 'destructive' },
  expired: { label: 'Expired', variant: 'secondary' },
  none: { label: 'No plan', variant: 'secondary' },
}

const PURCHASE_STATUS = {
  completed: { label: 'Completed', variant: 'success' },
  pending: { label: 'Pending', variant: 'secondary' },
  refunded: { label: 'Refunded', variant: 'secondary' },
  canceled: { label: 'Canceled', variant: 'secondary' },
}

const PROVIDER_LABEL = {
  email: 'Email & password',
  google: 'Google',
  github: 'GitHub',
  azure: 'Microsoft',
  oauth: 'Single sign-on',
}

function formatUsd(cents, currency = 'usd') {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format((cents || 0) / 100)
}

function formatDate(value) {
  if (!value) return '—'
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(
    new Date(value),
  )
}

function formatRelative(value) {
  if (!value) return 'never'
  const diff = Date.now() - new Date(value).getTime()
  const minutes = Math.round(diff / 60000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.round(hours / 24)
  if (days < 30) return `${days}d ago`
  return formatDate(value)
}

function initialsOf(name, email) {
  const source = (name || email || '').trim()
  if (!source) return 'U'
  const parts = source.split(/\s+/).filter(Boolean)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return source.slice(0, 2).toUpperCase()
}

function providerLabel(provider) {
  return PROVIDER_LABEL[provider] || provider.charAt(0).toUpperCase() + provider.slice(1)
}

// Line tabs. The shared trigger hangs its active underline 5px below the list,
// so the list must not be a scroll container or the underline gets clipped —
// pin it flush to the rail instead, and restore the pointer cursor Tailwind v4
// no longer puts on buttons.
const TAB_TRIGGER =
  'h-full flex-none cursor-pointer px-3 text-text-secondary hover:text-foreground data-[state=active]:text-foreground group-data-[orientation=horizontal]/tabs:after:bottom-0'

// Chrome-less field: the control only draws a border once you reach for it, so
// a form reads as labelled rows rather than a stack of boxes inside a box.
const QUIET_FIELD =
  'border-transparent bg-transparent shadow-none hover:border-border hover:bg-surface-subtle focus-visible:border-border-strong focus-visible:bg-surface-subtle'

// A settings row: label (and hint) on a fixed rail, control on the right.
function FieldRow({ htmlFor, label, hint, align = 'center', children }) {
  return (
    <div
      className={cn(
        'grid gap-1.5 px-5 py-3.5 sm:grid-cols-[12rem_1fr] sm:gap-6',
        align === 'start' ? 'sm:items-start' : 'sm:items-center',
      )}
    >
      <div className="min-w-0 sm:py-1.5">
        <Label htmlFor={htmlFor}>{label}</Label>
        {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
      </div>
      {children}
    </div>
  )
}

function Fact({ label, value }) {
  return (
    <div className="px-5 py-3">
      <dt className="text-xs text-text-tertiary">{label}</dt>
      <dd className="mt-0.5 truncate text-sm font-medium text-foreground">{value}</dd>
    </div>
  )
}

function Row({ label, children }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-3">
      <span className="text-sm text-muted-foreground">{label}</span>
      {children}
    </div>
  )
}

function CopyButton({ value, label }) {
  const [copied, setCopied] = useState(false)
  return (
    <Button
      type="button"
      variant="outline"
      size="icon-sm"
      aria-label={`Copy ${label}`}
      className="shrink-0 border-border bg-surface-subtle"
      onClick={() => {
        navigator.clipboard?.writeText(value)
        setCopied(true)
        toast.success(`${label} copied.`)
        setTimeout(() => setCopied(false), 1500)
      }}
    >
      {copied ? <Check className="size-4 text-emerald-400" /> : <Copy className="size-4" />}
    </Button>
  )
}

// Identity first, then the four facts people actually look up on a profile.
function ProfileHeader({
  profile,
  avatarSrc,
  uploading,
  onPickAvatar,
  onRemoveAvatar,
  workspaceCount,
  projectCount,
}) {
  const initials = initialsOf(profile.displayName, profile.email)

  return (
    <Card className="relative overflow-hidden">
      {/* Soft top-light, same as the plan card on /billing. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40" />
      <div className="relative flex flex-col gap-5 p-6 sm:flex-row sm:items-start">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label="Change profile picture"
              className="group relative size-16 shrink-0 overflow-hidden rounded-xl border border-border bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {avatarSrc ? (
                <Image src={avatarSrc} alt="" fill sizes="64px" unoptimized className="object-cover" />
              ) : (
                <span className="flex size-full items-center justify-center text-base font-semibold text-text-secondary">
                  {initials}
                </span>
              )}
              <span className="absolute inset-0 flex items-center justify-center bg-background/70 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                <Camera className="size-4 text-foreground" />
              </span>
              {uploading ? (
                <span className="absolute inset-0 flex items-center justify-center bg-background/70">
                  <Loader2 className="size-5 animate-spin text-foreground" />
                </span>
              ) : null}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-52">
            <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
              Square JPG or PNG, up to 2 MB
            </DropdownMenuLabel>
            <DropdownMenuItem onSelect={onPickAvatar}>
              <Camera className="size-4" />
              Upload a Picture
            </DropdownMenuItem>
            {avatarSrc ? (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" onSelect={onRemoveAvatar}>
                  <Trash2 className="size-4" />
                  Remove Picture
                </DropdownMenuItem>
              </>
            ) : null}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="min-w-0 flex-1">
          <h1 className="truncate text-xl font-semibold tracking-tight">{profile.displayName}</h1>

          <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
            <span className="truncate">{profile.email}</span>
            {profile.emailVerified ? (
              <span className="inline-flex items-center gap-1 text-emerald-400">
                <ShieldCheck className="size-3.5" />
                Verified
              </span>
            ) : (
              <span className="text-amber-400">Unverified</span>
            )}
          </p>

          {profile.jobTitle || profile.company || profile.location ? (
            <p className="mt-2 truncate text-sm text-text-secondary">
              {[profile.jobTitle, profile.company, profile.location].filter(Boolean).join(' · ')}
            </p>
          ) : null}

          {profile.bio ? (
            <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">{profile.bio}</p>
          ) : null}

          {profile.website ? (
            <a
              href={profile.website}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1.5 text-sm text-text-secondary transition-colors hover:text-foreground"
            >
              <Globe className="size-3.5" />
              {profile.website.replace(/^https?:\/\//, '')}
            </a>
          ) : null}
        </div>
      </div>

      <dl className="relative grid grid-cols-2 divide-x divide-y divide-border border-t border-border sm:grid-cols-4 sm:divide-y-0">
        <Fact label="Joined" value={formatDate(profile.createdAt)} />
        <Fact label="Last Signed In" value={formatRelative(profile.lastSignInAt)} />
        <Fact label="Organizations" value={workspaceCount} />
        <Fact label="Projects" value={projectCount} />
      </dl>
    </Card>
  )
}

export function ProfileClient({ profile, billing, workspaces, invites, projectCount, loadError }) {
  const router = useRouter()
  const { resolvedTheme, setTheme } = useTheme()
  const fileRef = useRef(null)

  const [tab, setTab] = useState('general')
  // Shows the freshly uploaded picture straight away; router.refresh() then
  // brings the prop up to the same versioned URL.
  const [avatarOverride, setAvatarOverride] = useState('')
  const [avatarRemoved, setAvatarRemoved] = useState(false)
  const [uploading, setUploading] = useState(false)

  const [form, setForm] = useState({
    displayName: profile.displayName,
    jobTitle: profile.jobTitle,
    company: profile.company,
    location: profile.location,
    website: profile.website,
    bio: profile.bio,
  })
  const [savedForm, setSavedForm] = useState(form)
  const [savingProfile, setSavingProfile] = useState(false)

  const [prefs, setPrefs] = useState({
    productEmails: profile.productEmails,
    marketingEmails: profile.marketingEmails,
  })

  const [emailDraft, setEmailDraft] = useState('')
  const [changingEmail, setChangingEmail] = useState(false)
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [changingPassword, setChangingPassword] = useState(false)
  const [signingOut, setSigningOut] = useState(false)

  const phaseBadge = PLAN_PHASE_BADGE[billing.phase] || PLAN_PHASE_BADGE.none
  const isDark = resolvedTheme === 'dark'

  // profile.avatarUrl already carries the ?v= cache buster (see lib/avatar-url),
  // so nothing needs appending here.
  const avatarSrc = useMemo(() => {
    if (avatarRemoved) return ''
    return avatarOverride || profile.avatarUrl || ''
  }, [avatarRemoved, avatarOverride, profile.avatarUrl])

  const dirty = useMemo(
    () => Object.keys(form).some((key) => form[key] !== savedForm[key]),
    [form, savedForm],
  )

  const set = (key) => (value) => setForm((current) => ({ ...current, [key]: value }))

  async function handleAvatarFile(event) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    setUploading(true)
    const data = new FormData()
    data.append('avatar', file)
    const result = await updateAvatarAction(data)
    setUploading(false)

    if (result?.ok) {
      // The suite caches avatars in CacheStorage keyed by user id — drop it or
      // every surface keeps showing the old picture.
      await clearProfileImageCache()
      setAvatarRemoved(false)
      setAvatarOverride(result.url || '')
      toast.success('Profile picture updated.')
      router.refresh()
    } else {
      toast.error(result?.error || 'Could not upload that picture.')
    }
  }

  async function handleRemoveAvatar() {
    const result = await removeAvatarAction()
    if (result?.ok) {
      await clearProfileImageCache()
      setAvatarOverride('')
      setAvatarRemoved(true)
      toast.success('Profile picture removed.')
      router.refresh()
    } else {
      toast.error(result?.error || 'Could not remove the picture.')
    }
  }

  async function handleSaveProfile(event) {
    event.preventDefault()
    setSavingProfile(true)
    const result = await updateProfileAction(form)
    setSavingProfile(false)

    if (result?.ok) {
      setSavedForm(form)
      toast.success('Profile saved.')
      router.refresh()
    } else {
      toast.error(result?.error || 'Could not save your profile.')
    }
  }

  async function handleTogglePref(key, value) {
    const previous = prefs
    const next = { ...prefs, [key]: value }
    setPrefs(next)
    const result = await updatePreferencesAction(next)
    if (!result?.ok) {
      setPrefs(previous)
      toast.error(result?.error || 'Could not save that preference.')
    }
  }

  async function handleChangeEmail(event) {
    event.preventDefault()
    setChangingEmail(true)
    const result = await changeEmailAction(emailDraft)
    setChangingEmail(false)

    if (result?.ok) {
      setEmailDraft('')
      toast.success(`Confirm the change from the link sent to ${result.email}.`)
    } else {
      toast.error(result?.error || 'Could not change your email.')
    }
  }

  async function handleChangePassword(event) {
    event.preventDefault()
    if (password !== passwordConfirm) {
      toast.error('The two passwords do not match.')
      return
    }
    setChangingPassword(true)
    const result = await changePasswordAction(password)
    setChangingPassword(false)

    if (result?.ok) {
      setPassword('')
      setPasswordConfirm('')
      toast.success('Password updated.')
    } else {
      toast.error(result?.error || 'Could not update your password.')
    }
  }

  async function handleSignOutEverywhere() {
    setSigningOut(true)
    const result = await signOutEverywhereAction()
    if (result?.ok) {
      await clearProfileImageCache()
      toast.success('Signed out on every device.')
      router.push('/login')
    } else {
      setSigningOut(false)
      toast.error(result?.error || 'Could not sign out everywhere.')
    }
  }

  return (
    <div className="mt-8 flex flex-col gap-6">
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleAvatarFile}
      />

      <ProfileHeader
        profile={profile}
        avatarSrc={avatarSrc}
        uploading={uploading}
        onPickAvatar={() => fileRef.current?.click()}
        onRemoveAvatar={handleRemoveAvatar}
        workspaceCount={workspaces.length}
        projectCount={projectCount}
      />

      {loadError ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {loadError}
        </div>
      ) : null}

      {billing.phase === 'grace' ? (
        <div className="flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" />
          <div className="flex-1">
            <p className="font-medium">
              Your plan ended. Your data will be deleted in {billing.deletionDaysRemaining}{' '}
              {billing.deletionDaysRemaining === 1 ? 'day' : 'days'} (
              {formatDate(billing.deletionDate)}) unless you renew.
            </p>
            <Button asChild size="sm" variant="destructive" className="mt-3">
              <Link href="/pricing">Renew Plan</Link>
            </Button>
          </div>
        </div>
      ) : null}

      {/* Invitations expire, so they get a line above the tabs that jumps to them. */}
      {invites.length ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-surface-subtle px-4 py-3">
          <p className="text-sm text-text-secondary">
            {invites.length === 1
              ? `${invites[0].organizationName} invited you to join.`
              : `You have ${invites.length} pending invitations.`}
          </p>
          <Button size="sm" variant="outline" className="border-border bg-surface-card" onClick={() => setTab('organizations')}>
            Review
          </Button>
        </div>
      ) : null}

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList variant="line" className="w-full justify-start gap-2 border-b border-border pb-0">
          <TabsTrigger value="general" className={TAB_TRIGGER}>
            General
          </TabsTrigger>
          <TabsTrigger value="organizations" className={TAB_TRIGGER}>
            Organizations
            <span className="ml-1.5 text-xs text-text-tertiary">{workspaces.length}</span>
          </TabsTrigger>
          <TabsTrigger value="billing" className={TAB_TRIGGER}>
            Billing
          </TabsTrigger>
          <TabsTrigger value="security" className={TAB_TRIGGER}>
            Security
          </TabsTrigger>
        </TabsList>

        {/* ---------------------------------------------------------------- */}
        <TabsContent value="general" className="flex flex-col gap-8 pt-4">
          <Section title="Profile">
            <Card>
              <form onSubmit={handleSaveProfile}>
                <div className="divide-y divide-border">
                  <FieldRow
                    htmlFor="displayName"
                    label="Display Name"
                    hint="Shown to teammates across every Geiger product."
                  >
                    <Input
                      id="displayName"
                      value={form.displayName}
                      onChange={(event) => set('displayName')(event.target.value)}
                      placeholder="Your name"
                      className={QUIET_FIELD}
                    />
                  </FieldRow>

                  <FieldRow htmlFor="jobTitle" label="Job Title">
                    <Input
                      id="jobTitle"
                      value={form.jobTitle}
                      onChange={(event) => set('jobTitle')(event.target.value)}
                      placeholder="Product designer"
                      className={QUIET_FIELD}
                    />
                  </FieldRow>

                  <FieldRow htmlFor="company" label="Company">
                    <Input
                      id="company"
                      value={form.company}
                      onChange={(event) => set('company')(event.target.value)}
                      placeholder="Acme Studio"
                      className={QUIET_FIELD}
                    />
                  </FieldRow>

                  <FieldRow htmlFor="location" label="Location">
                    <Input
                      id="location"
                      value={form.location}
                      onChange={(event) => set('location')(event.target.value)}
                      placeholder="Berlin, Germany"
                      className={QUIET_FIELD}
                    />
                  </FieldRow>

                  <FieldRow htmlFor="website" label="Website">
                    <Input
                      id="website"
                      value={form.website}
                      onChange={(event) => set('website')(event.target.value)}
                      placeholder="https://example.com"
                      className={QUIET_FIELD}
                    />
                  </FieldRow>

                  <FieldRow
                    htmlFor="bio"
                    label="About"
                    hint={`${form.bio.length}/400 characters`}
                    align="start"
                  >
                    <Textarea
                      id="bio"
                      value={form.bio}
                      onChange={(event) => set('bio')(event.target.value)}
                      placeholder="A short line about what you work on."
                      className={cn(QUIET_FIELD, 'min-h-24 resize-none py-2')}
                    />
                  </FieldRow>
                </div>

                <div className="flex items-center justify-end gap-2 border-t border-border px-5 py-3">
                  {dirty ? (
                    <Button type="button" variant="ghost" onClick={() => setForm(savedForm)}>
                      Discard
                    </Button>
                  ) : null}
                  <Button type="submit" disabled={!dirty || savingProfile}>
                    {savingProfile ? <Loader2 className="size-4 animate-spin" /> : null}
                    Save Changes
                  </Button>
                </div>
              </form>
            </Card>
          </Section>

          <Section title="Preferences">
            <Card className="divide-y divide-border">
              <div className="flex items-center justify-between gap-4 px-5 py-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">Theme</p>
                  <p className="text-xs text-muted-foreground">
                    Applies to every Geiger surface in this browser.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="shrink-0 border-border bg-surface-subtle"
                  onClick={() => setTheme(isDark ? 'light' : 'dark')}
                >
                  {isDark ? <Moon className="size-4" /> : <Sun className="size-4" />}
                  {isDark ? 'Dark' : 'Light'}
                </Button>
              </div>

              <div className="flex items-center justify-between gap-4 px-5 py-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">Product Emails</p>
                  <p className="text-xs text-muted-foreground">
                    Invitations, billing receipts, and account notices.
                  </p>
                </div>
                <Switch
                  checked={prefs.productEmails}
                  onCheckedChange={(value) => handleTogglePref('productEmails', value)}
                />
              </div>

              <div className="flex items-center justify-between gap-4 px-5 py-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">Product Updates</p>
                  <p className="text-xs text-muted-foreground">
                    Occasional news about new features across the suite.
                  </p>
                </div>
                <Switch
                  checked={prefs.marketingEmails}
                  onCheckedChange={(value) => handleTogglePref('marketingEmails', value)}
                />
              </div>
            </Card>
          </Section>
        </TabsContent>

        {/* ---------------------------------------------------------------- */}
        <TabsContent value="organizations" className="flex flex-col gap-8 pt-4">
          {invites.length ? (
            <Section title="Pending Invitations">
              <Card className="divide-y divide-border">
                {invites.map((invite) => (
                  <div key={invite.id} className="flex flex-wrap items-center gap-3 px-5 py-3">
                    <span className="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-surface-subtle text-muted-foreground">
                      {invite.organizationAvatar ? (
                        <Image src={invite.organizationAvatar} alt="" fill unoptimized className="object-cover" />
                      ) : (
                        <Building2 className="size-4" />
                      )}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">
                        {invite.organizationName}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        Invited as {invite.role} · {formatRelative(invite.createdAt)}
                      </p>
                    </div>
                    <Button asChild size="sm">
                      <Link href={`/invite/${invite.token}`}>Accept</Link>
                    </Button>
                  </div>
                ))}
              </Card>
            </Section>
          ) : null}

          <Section
            title="Organizations"
            action={
              <Button asChild size="sm" variant="outline" className="border-border bg-surface-card">
                <Link href="/org">
                  <Plus className="size-4" />
                  New Organization
                </Link>
              </Button>
            }
          >
            {workspaces.length ? (
              <Card className="divide-y divide-border">
                {workspaces.map((workspace) => {
                  const privileged = workspace.role === 'Owner' || workspace.role === 'Creator'
                  return (
                    <div key={workspace.id} className="flex flex-wrap items-center gap-3 px-5 py-4">
                      <span className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-surface-subtle text-muted-foreground">
                        {workspace.avatarUrl ? (
                          <Image src={workspace.avatarUrl} alt="" fill unoptimized className="object-cover" />
                        ) : (
                          <Building2 className="size-4" />
                        )}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="truncate text-sm font-medium text-foreground">{workspace.name}</p>
                          <span className="inline-flex items-center gap-1 rounded-md border border-border px-1.5 py-0.5 text-[11px] font-medium text-text-secondary">
                            {privileged ? <Crown className="size-3" /> : null}
                            {workspace.role}
                          </span>
                          {!workspace.isActive ? (
                            <Badge variant="secondary">Inactive</Badge>
                          ) : null}
                        </div>
                        <p className="truncate text-xs text-muted-foreground">
                          {workspace.memberCount} {workspace.memberCount === 1 ? 'member' : 'members'}{' '}
                          · Created {formatDate(workspace.createdAt)}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <Button asChild size="sm" variant="outline" className="border-border bg-surface-subtle">
                          <Link href={`/org/${workspace.id}`}>Open</Link>
                        </Button>
                        <Button
                          asChild
                          size="icon-sm"
                          variant="outline"
                          aria-label={`Usage for ${workspace.name}`}
                          className="border-border bg-surface-subtle"
                        >
                          <Link href={`/org/${workspace.id}/usage`}>
                            <Gauge className="size-4" />
                          </Link>
                        </Button>
                        <CopyButton value={workspace.id} label="Organization ID" />
                      </div>
                    </div>
                  )
                })}
              </Card>
            ) : (
              <Card className="flex flex-col items-center px-5 py-12 text-center">
                <h3 className="text-base font-semibold">No Organizations Yet</h3>
                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                  Create your first organization, or join one with an ID from your team.
                </p>
                <Button asChild className="mt-5">
                  <Link href="/org">
                    Go to Organizations
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </Card>
            )}
          </Section>
        </TabsContent>

        {/* ---------------------------------------------------------------- */}
        <TabsContent value="billing" className="flex flex-col gap-8 pt-4">
          <Section
            title="Plan"
            action={
              <Button asChild variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                <Link href="/billing">
                  Manage Billing
                  <ArrowUpRight className="size-4" />
                </Link>
              </Button>
            }
          >
            {billing.planName ? (
              <Card>
                <div className="flex flex-wrap items-start justify-between gap-4 p-5">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-lg font-semibold">{billing.planName}</p>
                      <Badge variant={phaseBadge.variant}>{phaseBadge.label}</Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {billing.periodEnd
                        ? `${billing.isTrial ? 'Trial ends' : 'Renews'} ${formatDate(billing.periodEnd)} · ${billing.daysRemaining} ${billing.daysRemaining === 1 ? 'day' : 'days'} left`
                        : `Member since ${formatDate(billing.startedAt)}`}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold tabular-nums tracking-tight">
                      {billing.isTrial ? 'Free' : formatUsd(billing.amountTotal, billing.currency)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {billing.isTrial
                        ? 'during trial'
                        : billing.billingInterval
                          ? `per ${billing.billingInterval}`
                          : ''}
                    </p>
                  </div>
                </div>
                <dl className="grid grid-cols-2 divide-x divide-y divide-border border-t border-border sm:grid-cols-3 sm:divide-y-0">
                  <Fact label="Total Spent" value={formatUsd(billing.totalSpent)} />
                  <Fact
                    label="Payments"
                    value={`${billing.paymentCount} ${billing.paymentCount === 1 ? 'payment' : 'payments'}`}
                  />
                  <Fact label="Member Since" value={formatDate(billing.startedAt)} />
                </dl>
              </Card>
            ) : (
              <Card className="flex flex-col items-center px-5 py-12 text-center">
                <h3 className="text-base font-semibold">No Plan Yet</h3>
                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                  Pick a foundation and choose the products your team works in.
                </p>
                <Button asChild className="mt-5">
                  <Link href="/pricing">
                    View Plans
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </Card>
            )}
          </Section>

          {billing.productIds.length ? (
            <Section title="Product Access">
              <ProductAccess productIds={billing.productIds} />
            </Section>
          ) : null}

          <Section title="Recent Payments">
            <Card className="divide-y divide-border">
              {billing.recentPurchases.length ? (
                billing.recentPurchases.map((purchase) => {
                  const status = PURCHASE_STATUS[purchase.status] || PURCHASE_STATUS.pending
                  return (
                    <div key={purchase.id} className="flex flex-wrap items-center gap-3 px-5 py-3">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">
                          {purchase.planName}
                          <span className="ml-1 text-xs font-normal text-muted-foreground">
                            /{purchase.billingInterval}
                          </span>
                        </p>
                        <p className="text-xs text-muted-foreground">{formatDate(purchase.createdAt)}</p>
                      </div>
                      <span className="text-sm font-medium tabular-nums">
                        {formatUsd(purchase.amountTotal, purchase.currency)}
                      </span>
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </div>
                  )
                })
              ) : (
                <p className="px-5 py-4 text-sm text-muted-foreground">
                  No payments yet. Anything you buy shows up here and on the billing page.
                </p>
              )}
            </Card>
          </Section>
        </TabsContent>

        {/* ---------------------------------------------------------------- */}
        <TabsContent value="security" className="flex flex-col gap-8 pt-4">
          <Section title="Email Address">
            <Card className="p-5">
              <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-surface-subtle px-3 py-2.5">
                <span className="min-w-0 flex-1 truncate text-sm text-foreground">{profile.email}</span>
                {profile.emailVerified ? (
                  <Badge variant="success" className="gap-1">
                    <ShieldCheck className="size-3" />
                    Verified
                  </Badge>
                ) : (
                  <Badge variant="warning">Unverified</Badge>
                )}
              </div>

              <form onSubmit={handleChangeEmail} className="mt-4 flex flex-col gap-2 sm:flex-row">
                <Input
                  type="email"
                  value={emailDraft}
                  onChange={(event) => setEmailDraft(event.target.value)}
                  placeholder="new@company.com"
                  className="flex-1 bg-surface-subtle"
                />
                <Button type="submit" disabled={changingEmail || !emailDraft.trim()}>
                  {changingEmail ? <Loader2 className="size-4 animate-spin" /> : null}
                  Change Email
                </Button>
              </form>
              <p className="mt-2 text-xs text-muted-foreground">
                We send a confirmation link to the new address. The change takes effect once you
                open it.
              </p>
            </Card>
          </Section>

          <Section title="Password">
            <Card className="p-5">
              <form onSubmit={handleChangePassword} className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-1.5">
                  <Label htmlFor="password">New Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    autoComplete="new-password"
                    className="bg-surface-subtle"
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="passwordConfirm">Confirm Password</Label>
                  <Input
                    id="passwordConfirm"
                    type="password"
                    value={passwordConfirm}
                    onChange={(event) => setPasswordConfirm(event.target.value)}
                    autoComplete="new-password"
                    className="bg-surface-subtle"
                  />
                </div>
                <div className="flex items-center justify-between gap-3 sm:col-span-2">
                  <p className="text-xs text-muted-foreground">At least 8 characters.</p>
                  <Button type="submit" disabled={changingPassword || password.length < 8}>
                    {changingPassword ? <Loader2 className="size-4 animate-spin" /> : null}
                    Update Password
                  </Button>
                </div>
              </form>
            </Card>
          </Section>

          <Section title="Account">
            <Card className="divide-y divide-border">
              <Row label="Sign-in Method">
                <span className="text-sm text-foreground">
                  {profile.providers.map(providerLabel).join(', ')}
                </span>
              </Row>
              <Row label="Account Created">
                <span className="text-sm text-foreground">{formatDate(profile.createdAt)}</span>
              </Row>
              <Row label="Last Sign-in">
                <span className="text-sm text-foreground">{formatRelative(profile.lastSignInAt)}</span>
              </Row>
              <Row label="User ID">
                <span className="flex items-center gap-2">
                  <span className="font-mono text-xs text-foreground">{profile.id}</span>
                  <CopyButton value={profile.id} label="User ID" />
                </span>
              </Row>
            </Card>
          </Section>

          <Section title="Sessions">
            <Card className="flex flex-wrap items-center justify-between gap-3 p-5">
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground">Sign Out Everywhere</p>
                <p className="text-xs text-muted-foreground">
                  Ends every active session, on every device — including this one.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                className="shrink-0 border-border bg-surface-subtle"
                onClick={handleSignOutEverywhere}
                disabled={signingOut}
              >
                {signingOut ? <Loader2 className="size-4 animate-spin" /> : <LogOut className="size-4" />}
                Sign Out Everywhere
              </Button>
            </Card>
          </Section>

          <Section title="Delete Account">
            <Card className="flex flex-wrap items-center justify-between gap-3 border-red-500/25 p-5">
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground">Delete This Account</p>
                <p className="max-w-xl text-xs text-muted-foreground">
                  Removes your profile and access to every workspace. Owned organizations have to be
                  transferred first, so we handle deletions by request.
                </p>
              </div>
              <Button
                asChild
                variant="ghost"
                className="shrink-0 bg-red-900/15 text-red-400 hover:bg-red-500/10 hover:text-red-400"
              >
                <Link href="/contact">
                  <Trash2 className="size-4" />
                  Request Deletion
                </Link>
              </Button>
            </Card>
          </Section>
        </TabsContent>
      </Tabs>
    </div>
  )
}
