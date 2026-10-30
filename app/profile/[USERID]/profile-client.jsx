'use client'

import { useMemo, useRef, useState, useSyncExternalStore } from 'react'
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
  CreditCard,
  Crown,
  Gauge,
  Globe,
  Loader2,
  LogOut,
  Monitor,
  Moon,
  MoreHorizontal,
  Plus,
  ShieldCheck,
  Sun,
  Trash2,
  UserRound,
} from 'lucide-react'
import { toast } from 'sonner'
import { SettingsBlock } from '@/components/account/panel'
import { ProductAccess } from '@/components/billing/product-access'
import { PasskeyManager } from '@/components/auth/passkey-manager'
import { ConnectedApps } from '@/components/account/connected-apps'
import {
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Field,
  Input,
  Switch,
  Textarea,
} from '@geiger/ui'
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
  completed: { label: 'Paid', variant: 'success' },
  pending: { label: 'Pending', variant: 'secondary' },
  refunded: { label: 'Refunded', variant: 'secondary' },
  canceled: { label: 'Canceled', variant: 'secondary' },
}

const PROVIDER_LABEL = {
  email: 'Email and password',
  google: 'Google',
  github: 'GitHub',
  azure: 'Microsoft',
  oauth: 'Single sign-on',
}

const SECTIONS = [
  { id: 'general', label: 'General', icon: UserRound, description: 'How you appear to teammates across every Geiger product.' },
  { id: 'organizations', label: 'Organizations', icon: Building2, description: 'The organizations you belong to and the invitations waiting for you.' },
  { id: 'billing', label: 'Billing', icon: CreditCard, description: 'Your plan, the products it includes and what you have paid.' },
  { id: 'security', label: 'Security', icon: ShieldCheck, description: 'How you sign in, where you are signed in, and your account.' },
]

const THEMES = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
]

const BIO_LIMIT = 400

function formatUsd(cents, currency = 'usd') {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format((cents || 0) / 100)
}

function formatDate(value) {
  if (!value) return '—'
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(value))
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

const subscribeNever = () => () => {}

function copyText(value, label) {
  navigator.clipboard?.writeText(value)
  toast.success(`${label} copied.`)
}

// Round avatar used in the rail and the profile editor; falls back to initials.
function Avatar({ src, name, email, size = 40, className }) {
  return (
    <span
      className={cn(
        'relative flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-surface-subtle font-semibold text-text-secondary',
        className,
      )}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.34) }}
    >
      {src ? <Image src={src} alt="" fill sizes={`${size}px`} unoptimized className="object-cover" /> : initialsOf(name, email)}
    </span>
  )
}

// Square tile for an organization: its logo, or its initials.
function OrgTile({ src, name }) {
  return (
    <span className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-surface-subtle text-xs font-semibold text-text-secondary">
      {src ? <Image src={src} alt="" fill unoptimized className="object-cover" /> : initialsOf(name)}
    </span>
  )
}

// A label/value line inside a flush settings block.
function DetailRow({ label, children }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 px-5 py-3 sm:px-6">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="min-w-0 text-sm text-foreground">{children}</span>
    </div>
  )
}

// A setting with its explanation on the left and the control on the right.
function ToggleRow({ title, description, children }) {
  return (
    <div className="flex items-center justify-between gap-6 px-5 py-4 sm:px-6">
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
      </div>
      {children}
    </div>
  )
}

function CopyButton({ value, label }) {
  const [copied, setCopied] = useState(false)
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      aria-label={`Copy ${label}`}
      className="shrink-0 text-muted-foreground hover:text-foreground"
      onClick={() => {
        copyText(value, label)
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
      }}
    >
      {copied ? <Check className="size-4 text-emerald-600 dark:text-emerald-400" /> : <Copy className="size-4" />}
    </Button>
  )
}

// Identity and section navigation; a sticky rail on desktop, a swipeable row on phones.
function Rail({ profile, avatarSrc, tab, onTab, counts, hasInvites }) {
  return (
    <aside className="min-w-0 lg:sticky lg:top-24 lg:self-start">
      <div className="flex items-center gap-3">
        <Avatar src={avatarSrc} name={profile.displayName} email={profile.email} size={44} />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">{profile.displayName}</p>
          <p className="truncate text-xs text-muted-foreground">{profile.email}</p>
        </div>
      </div>

      <nav
        aria-label="Account sections"
        className="-mx-4 mt-6 flex gap-1 overflow-x-auto px-4 [scrollbar-width:none] lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0 [&::-webkit-scrollbar]:hidden"
      >
        {SECTIONS.map((section) => {
          const Icon = section.icon
          const active = tab === section.id
          return (
            <button
              key={section.id}
              type="button"
              aria-current={active ? 'page' : undefined}
              onClick={() => onTab(section.id)}
              className={cn(
                'flex shrink-0 cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                active
                  ? 'bg-surface-hover font-medium text-foreground'
                  : 'text-text-secondary hover:bg-surface-subtle hover:text-foreground',
              )}
            >
              <Icon className="size-4 shrink-0" />
              {section.label}
              {counts[section.id] != null ? (
                <span className="ml-auto pl-2 text-xs tabular-nums text-text-tertiary">{counts[section.id]}</span>
              ) : null}
              {section.id === 'organizations' && hasInvites ? (
                <span className="size-1.5 shrink-0 rounded-full bg-foreground" aria-label="Pending invitations" />
              ) : null}
            </button>
          )
        })}
      </nav>

      <Link
        href="/org"
        className="mt-6 hidden items-center gap-1.5 border-t border-border px-3 pt-4 text-sm text-text-secondary transition-colors hover:text-foreground lg:flex"
      >
        Open workspace
        <ArrowRight className="size-3.5" />
      </Link>
    </aside>
  )
}

export function ProfileClient({ profile, billing, workspaces, invites, projectCount, connections, loadError }) {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  // The stored theme is only known in the browser, so highlight it after hydration to keep server and client markup equal.
  const hydrated = useSyncExternalStore(subscribeNever, () => true, () => false)
  const fileRef = useRef(null)

  const [tab, setTab] = useState('general')
  // Shows the freshly uploaded picture straight away; router.refresh() then brings the prop up to the same versioned URL.
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
  const section = SECTIONS.find((item) => item.id === tab) || SECTIONS[0]

  // profile.avatarUrl already carries the ?v= cache buster (see lib/avatar-url).
  const avatarSrc = useMemo(() => {
    if (avatarRemoved) return ''
    return avatarOverride || profile.avatarUrl || ''
  }, [avatarRemoved, avatarOverride, profile.avatarUrl])

  const dirty = useMemo(() => Object.keys(form).some((key) => form[key] !== savedForm[key]), [form, savedForm])

  // How far through the current billing period we are, from the server's days-remaining count.
  const periodProgress = useMemo(() => {
    if (!billing.periodEnd) return null
    const totalDays = billing.isTrial ? 15 : billing.billingInterval === 'year' ? 365 : 30
    return Math.min(1, Math.max(0, 1 - billing.daysRemaining / totalDays))
  }, [billing.periodEnd, billing.isTrial, billing.billingInterval, billing.daysRemaining])

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
      // The suite caches avatars in CacheStorage keyed by user id — drop it or every surface keeps the old picture.
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
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-14">
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarFile} />

      <Rail
        profile={profile}
        avatarSrc={avatarSrc}
        tab={tab}
        onTab={setTab}
        counts={{ organizations: workspaces.length }}
        hasInvites={invites.length > 0}
      />

      <div className="min-w-0">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">{section.label}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{section.description}</p>
        </div>

        <div className="flex flex-col gap-6">
          {loadError ? (
            <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">{loadError}</div>
          ) : null}

          {billing.phase === 'grace' ? (
            <div className="flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400">
              <AlertTriangle className="mt-0.5 size-4 shrink-0" />
              <div className="flex-1">
                <p className="font-medium">
                  Your plan ended. Your data will be deleted in {billing.deletionDaysRemaining}{' '}
                  {billing.deletionDaysRemaining === 1 ? 'day' : 'days'} ({formatDate(billing.deletionDate)}) unless you renew.
                </p>
                <Button asChild size="sm" variant="destructive" className="mt-3">
                  <Link href="/pricing">Renew plan</Link>
                </Button>
              </div>
            </div>
          ) : null}

          {invites.length && tab !== 'organizations' ? (
            <button
              type="button"
              onClick={() => setTab('organizations')}
              className="flex w-full cursor-pointer items-center gap-3 rounded-xl border border-border bg-surface-subtle px-4 py-3 text-left transition-colors hover:border-border-strong"
            >
              <span className="size-1.5 shrink-0 rounded-full bg-foreground" />
              <span className="min-w-0 flex-1 truncate text-sm text-text-secondary">
                {invites.length === 1
                  ? `${invites[0].organizationName} invited you to join.`
                  : `You have ${invites.length} pending invitations.`}
              </span>
              <span className="flex shrink-0 items-center gap-1 text-sm font-medium text-foreground">
                Review
                <ArrowRight className="size-3.5" />
              </span>
            </button>
          ) : null}

          {tab === 'general' ? (
            <>
              <form onSubmit={handleSaveProfile}>
                <SettingsBlock
                  title="Profile"
                  description="Your name, picture and role are shown to teammates in every organization."
                  footer={
                    <>
                      <span>{dirty ? 'You have unsaved changes.' : 'Changes apply across the whole suite.'}</span>
                      <span className="flex items-center gap-2">
                        {dirty ? (
                          <Button type="button" size="sm" variant="ghost" onClick={() => setForm(savedForm)}>
                            Discard
                          </Button>
                        ) : null}
                        <Button type="submit" size="sm" disabled={!dirty || savingProfile}>
                          {savingProfile ? <Loader2 className="size-4 animate-spin" /> : null}
                          Save changes
                        </Button>
                      </span>
                    </>
                  }
                >
                  <div className="flex flex-wrap items-center gap-4 border-b border-border pb-5">
                    <div className="relative">
                      <Avatar src={avatarSrc} name={form.displayName} email={profile.email} size={64} />
                      {uploading ? (
                        <span className="absolute inset-0 flex items-center justify-center rounded-full bg-background/70">
                          <Loader2 className="size-5 animate-spin text-foreground" />
                        </span>
                      ) : null}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground">Profile picture</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">A square JPG or PNG, up to 2 MB.</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Button
                        type="button"
                        size="icon-sm"
                        variant="outline"
                        aria-label={avatarSrc ? 'Replace picture' : 'Upload picture'}
                        title={avatarSrc ? 'Replace picture' : 'Upload picture'}
                        onClick={() => fileRef.current?.click()}
                        disabled={uploading}
                      >
                        <Camera className="size-4" />
                      </Button>
                      {avatarSrc ? (
                        <Button
                          type="button"
                          size="icon-sm"
                          variant="ghost"
                          aria-label="Remove picture"
                          title="Remove picture"
                          className="text-muted-foreground hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400"
                          onClick={handleRemoveAvatar}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      ) : null}
                    </div>
                  </div>

                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <Field label="Display name" htmlFor="displayName" className="sm:col-span-2">
                      <Input
                        id="displayName"
                        value={form.displayName}
                        onChange={(event) => set('displayName')(event.target.value)}
                        placeholder="Your name"
                        className="bg-surface-subtle"
                      />
                    </Field>
                    <Field label="Job title" htmlFor="jobTitle">
                      <Input
                        id="jobTitle"
                        value={form.jobTitle}
                        onChange={(event) => set('jobTitle')(event.target.value)}
                        placeholder="Product designer"
                        className="bg-surface-subtle"
                      />
                    </Field>
                    <Field label="Company" htmlFor="company">
                      <Input
                        id="company"
                        value={form.company}
                        onChange={(event) => set('company')(event.target.value)}
                        placeholder="Acme Studio"
                        className="bg-surface-subtle"
                      />
                    </Field>
                    <Field label="Location" htmlFor="location">
                      <Input
                        id="location"
                        value={form.location}
                        onChange={(event) => set('location')(event.target.value)}
                        placeholder="Berlin, Germany"
                        className="bg-surface-subtle"
                      />
                    </Field>
                    <Field label="Website" htmlFor="website">
                      <div className="relative">
                        <Globe className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-text-tertiary" />
                        <Input
                          id="website"
                          value={form.website}
                          onChange={(event) => set('website')(event.target.value)}
                          placeholder="https://example.com"
                          className="bg-surface-subtle pl-8"
                        />
                      </div>
                    </Field>
                    <Field label="About" htmlFor="bio" className="sm:col-span-2">
                      <Textarea
                        id="bio"
                        value={form.bio}
                        onChange={(event) => set('bio')(event.target.value)}
                        maxLength={BIO_LIMIT}
                        placeholder="A short line about what you work on."
                        className="min-h-20 resize-none bg-surface-subtle"
                      />
                      <p className="mt-1.5 text-right text-xs tabular-nums text-text-tertiary">
                        {form.bio.length}/{BIO_LIMIT}
                      </p>
                    </Field>
                  </div>
                </SettingsBlock>
              </form>

              <SettingsBlock title="Preferences" description="Saved as soon as you change them." flush>
                <ToggleRow title="Theme" description="Applies to every Geiger product in this browser.">
                  <div role="radiogroup" aria-label="Theme" className="flex shrink-0 rounded-lg border border-border bg-surface-subtle p-0.5">
                    {THEMES.map((option) => {
                      const Icon = option.icon
                      const active = hydrated && (theme ?? 'system') === option.value
                      return (
                        <button
                          key={option.value}
                          type="button"
                          role="radio"
                          aria-checked={active}
                          aria-label={option.label}
                          title={option.label}
                          onClick={() => setTheme(option.value)}
                          className={cn(
                            'flex cursor-pointer items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                            active ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground',
                          )}
                        >
                          <Icon className="size-3.5" />
                          <span className="hidden sm:inline">{option.label}</span>
                        </button>
                      )
                    })}
                  </div>
                </ToggleRow>
                <ToggleRow title="Account emails" description="Invitations, billing receipts and account notices.">
                  <Switch checked={prefs.productEmails} onCheckedChange={(value) => handleTogglePref('productEmails', value)} />
                </ToggleRow>
                <ToggleRow title="Product news" description="Occasional news about new features across the suite.">
                  <Switch checked={prefs.marketingEmails} onCheckedChange={(value) => handleTogglePref('marketingEmails', value)} />
                </ToggleRow>
              </SettingsBlock>
            </>
          ) : null}

          {tab === 'organizations' ? (
            <>
              {invites.length ? (
                <SettingsBlock title="Invitations" description="Accept to join the organization with the role you were invited as." flush>
                  {invites.map((invite) => (
                    <div key={invite.id} className="flex items-center gap-3 px-5 py-3.5 sm:px-6">
                      <OrgTile src={invite.organizationAvatar} name={invite.organizationName} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">{invite.organizationName}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          Invited as {invite.role} · {formatRelative(invite.createdAt)}
                        </p>
                      </div>
                      <Button asChild size="sm">
                        <Link href={`/invite/${invite.token}`}>Accept</Link>
                      </Button>
                    </div>
                  ))}
                </SettingsBlock>
              ) : null}

              <SettingsBlock
                title="Your organizations"
                description={`${workspaces.length} ${workspaces.length === 1 ? 'organization' : 'organizations'} · ${projectCount} ${projectCount === 1 ? 'project' : 'projects'} across them.`}
                action={
                  <Button asChild size="sm" variant="outline">
                    <Link href="/org">
                      <Plus className="size-4" />
                      New organization
                    </Link>
                  </Button>
                }
                flush
              >
                {workspaces.length ? (
                  workspaces.map((workspace) => {
                    const privileged = workspace.role === 'Owner' || workspace.role === 'Creator'
                    return (
                      <div key={workspace.id} className="flex items-center gap-3 px-5 py-3.5 sm:px-6">
                        <OrgTile src={workspace.avatarUrl} name={workspace.name} />
                        <div className="min-w-0 flex-1">
                          <div className="flex min-w-0 items-center gap-2">
                            <Link href={`/org/${workspace.id}`} className="truncate text-sm font-medium text-foreground hover:underline">
                              {workspace.name}
                            </Link>
                            <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-border px-2 py-px text-[11px] font-medium text-text-secondary">
                              {privileged ? <Crown className="size-3" /> : null}
                              {workspace.role}
                            </span>
                            {!workspace.isActive ? <Badge variant="secondary">Inactive</Badge> : null}
                          </div>
                          <p className="truncate text-xs text-muted-foreground">
                            {workspace.memberCount} {workspace.memberCount === 1 ? 'member' : 'members'} · Created {formatDate(workspace.createdAt)}
                          </p>
                        </div>
                        <Button asChild size="sm" variant="outline" className="shrink-0">
                          <Link href={`/org/${workspace.id}`}>Open</Link>
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button type="button" size="icon-sm" variant="ghost" aria-label={`More for ${workspace.name}`} className="shrink-0 text-muted-foreground">
                              <MoreHorizontal className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem asChild>
                              <Link href={`/org/${workspace.id}/usage`}>
                                <Gauge className="size-4" />
                                View usage
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onSelect={() => copyText(workspace.id, 'Organization ID')}>
                              <Copy className="size-4" />
                              Copy organization ID
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    )
                  })
                ) : (
                  <div className="flex flex-col items-center px-6 py-10 text-center">
                    <span className="flex size-10 items-center justify-center rounded-xl border border-border bg-surface-subtle">
                      <Building2 className="size-4 text-muted-foreground" />
                    </span>
                    <p className="mt-3 text-sm font-medium text-foreground">No organizations yet</p>
                    <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                      Create your first organization, or join one with an ID from your team.
                    </p>
                    <Button asChild size="sm" className="mt-4">
                      <Link href="/org">
                        Go to organizations
                        <ArrowRight className="size-4" />
                      </Link>
                    </Button>
                  </div>
                )}
              </SettingsBlock>
            </>
          ) : null}

          {tab === 'billing' ? (
            <>
              {billing.planName ? (
                <SettingsBlock
                  title="Current plan"
                  action={
                    <Button asChild size="sm" variant="outline">
                      <Link href="/billing">
                        Manage billing
                        <ArrowUpRight className="size-4" />
                      </Link>
                    </Button>
                  }
                  flush
                >
                  <div className="px-5 py-5 sm:px-6">
                    <div className="flex flex-wrap items-end justify-between gap-4">
                      <div className="flex items-center gap-2.5">
                        <p className="text-3xl font-semibold tracking-tight">{billing.planName}</p>
                        <Badge variant={phaseBadge.variant}>{phaseBadge.label}</Badge>
                      </div>
                      <p className="text-right">
                        <span className="text-2xl font-semibold tabular-nums tracking-tight">
                          {billing.isTrial ? 'Free' : formatUsd(billing.amountTotal, billing.currency)}
                        </span>
                        <span className="ml-1 text-sm text-muted-foreground">
                          {billing.isTrial ? 'during trial' : billing.billingInterval ? `/ ${billing.billingInterval}` : ''}
                        </span>
                      </p>
                    </div>

                    {periodProgress != null ? (
                      <div className="mt-5">
                        <div className="h-1.5 overflow-hidden rounded-full bg-surface-hover">
                          <div className="h-full rounded-full bg-foreground/70" style={{ width: `${Math.round(periodProgress * 100)}%` }} />
                        </div>
                        <p className="mt-2 flex justify-between text-xs text-muted-foreground">
                          <span>
                            {billing.isTrial ? 'Trial ends' : 'Renews'} {formatDate(billing.periodEnd)}
                          </span>
                          <span className="tabular-nums">
                            {billing.daysRemaining} {billing.daysRemaining === 1 ? 'day' : 'days'} left
                          </span>
                        </p>
                      </div>
                    ) : null}
                  </div>
                  <dl className="grid grid-cols-3 divide-x divide-border">
                    {[
                      ['Total spent', formatUsd(billing.totalSpent)],
                      ['Payments', billing.paymentCount],
                      ['Member since', formatDate(billing.startedAt)],
                    ].map(([label, value]) => (
                      <div key={label} className="px-5 py-3 sm:px-6">
                        <dt className="text-xs text-text-tertiary">{label}</dt>
                        <dd className="mt-0.5 truncate text-sm font-medium tabular-nums text-foreground">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </SettingsBlock>
              ) : (
                <SettingsBlock title="No plan yet" description="Pick a foundation and choose the products your team works in.">
                  <Button asChild size="sm">
                    <Link href="/pricing">
                      View plans
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                </SettingsBlock>
              )}

              {billing.productIds.length ? (
                <SettingsBlock title="Products" description="Every product your plan unlocks.">
                  <ProductAccess productIds={billing.productIds} />
                </SettingsBlock>
              ) : null}

              <SettingsBlock title="Recent payments" description="Your last four payments. The billing page has the full history." flush>
                {billing.recentPurchases.length ? (
                  billing.recentPurchases.map((purchase) => {
                    const status = PURCHASE_STATUS[purchase.status] || PURCHASE_STATUS.pending
                    return (
                      <div key={purchase.id} className="grid grid-cols-[minmax(0,1fr)_auto_5.5rem] items-center gap-4 px-5 py-3 sm:grid-cols-[7rem_minmax(0,1fr)_auto_5.5rem] sm:px-6">
                        <span className="hidden text-sm tabular-nums text-muted-foreground sm:block">{formatDate(purchase.createdAt)}</span>
                        <span className="min-w-0 truncate text-sm text-foreground">
                          {purchase.planName}
                          <span className="ml-1 text-xs text-muted-foreground">/ {purchase.billingInterval}</span>
                        </span>
                        <span className="text-right text-sm font-medium tabular-nums">{formatUsd(purchase.amountTotal, purchase.currency)}</span>
                        <span className="flex justify-end">
                          <Badge variant={status.variant}>{status.label}</Badge>
                        </span>
                      </div>
                    )
                  })
                ) : (
                  <p className="px-5 py-4 text-sm text-muted-foreground sm:px-6">No payments yet. Anything you buy shows up here.</p>
                )}
              </SettingsBlock>
            </>
          ) : null}

          {tab === 'security' ? (
            <>
              <form onSubmit={handleChangeEmail}>
                <SettingsBlock
                  title="Email address"
                  description="Where we send sign-in links, invitations and receipts."
                  footer={
                    <>
                      <span>We send a confirmation link to the new address first.</span>
                      <Button type="submit" size="sm" disabled={changingEmail || !emailDraft.trim()}>
                        {changingEmail ? <Loader2 className="size-4 animate-spin" /> : null}
                        Change email
                      </Button>
                    </>
                  }
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Current">
                      <div className="flex h-9 items-center gap-2 rounded-md border border-border bg-surface-subtle px-3">
                        <span className="min-w-0 flex-1 truncate text-sm text-foreground">{profile.email}</span>
                        {profile.emailVerified ? (
                          <span className="inline-flex shrink-0 items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                            <ShieldCheck className="size-3.5" />
                            Verified
                          </span>
                        ) : (
                          <span className="shrink-0 text-xs text-amber-600 dark:text-amber-400">Unverified</span>
                        )}
                      </div>
                    </Field>
                    <Field label="New email" htmlFor="newEmail">
                      <Input
                        id="newEmail"
                        type="email"
                        value={emailDraft}
                        onChange={(event) => setEmailDraft(event.target.value)}
                        placeholder="new@company.com"
                        className="bg-surface-subtle"
                      />
                    </Field>
                  </div>
                </SettingsBlock>
              </form>

              <form onSubmit={handleChangePassword}>
                <SettingsBlock
                  title="Password"
                  description="Set a password to sign in with your email address."
                  footer={
                    <>
                      <span>At least 8 characters.</span>
                      <Button type="submit" size="sm" disabled={changingPassword || password.length < 8}>
                        {changingPassword ? <Loader2 className="size-4 animate-spin" /> : null}
                        Update password
                      </Button>
                    </>
                  }
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="New password" htmlFor="password">
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        autoComplete="new-password"
                        className="bg-surface-subtle"
                      />
                    </Field>
                    <Field label="Confirm password" htmlFor="passwordConfirm">
                      <Input
                        id="passwordConfirm"
                        type="password"
                        value={passwordConfirm}
                        onChange={(event) => setPasswordConfirm(event.target.value)}
                        autoComplete="new-password"
                        className="bg-surface-subtle"
                      />
                    </Field>
                  </div>
                </SettingsBlock>
              </form>

              <PasskeyManager />

              <ConnectedApps connections={connections} />

              <SettingsBlock title="Sign-in details" flush>
                <DetailRow label="Sign-in methods">{profile.providers.map(providerLabel).join(', ')}</DetailRow>
                <DetailRow label="Account created">{formatDate(profile.createdAt)}</DetailRow>
                <DetailRow label="Last sign-in">{formatRelative(profile.lastSignInAt)}</DetailRow>
                <DetailRow label="User ID">
                  <span className="flex items-center gap-1">
                    <span className="truncate font-mono text-xs">{profile.id}</span>
                    <CopyButton value={profile.id} label="User ID" />
                  </span>
                </DetailRow>
              </SettingsBlock>

              <SettingsBlock
                title="Sessions"
                description="Signed in somewhere you don't recognise? End every session, on every device, including this one."
                footer={
                  <>
                    <span>You&apos;ll need to sign in again afterwards.</span>
                    <Button type="button" size="sm" variant="outline" onClick={handleSignOutEverywhere} disabled={signingOut}>
                      {signingOut ? <Loader2 className="size-4 animate-spin" /> : <LogOut className="size-4" />}
                      Sign out everywhere
                    </Button>
                  </>
                }
              />

              <SettingsBlock
                tone="danger"
                title="Delete account"
                description="Removes your profile and your access to every organization. Owned organizations have to be transferred first, so deletions are handled by request."
                footer={
                  <>
                    <span>This can&apos;t be undone.</span>
                    <Button
                      asChild
                      size="sm"
                      variant="ghost"
                      className="text-red-600 hover:bg-red-500/10 hover:text-red-600 dark:text-red-400 dark:hover:text-red-400"
                    >
                      <Link href="/contact">
                        <Trash2 className="size-4" />
                        Request deletion
                      </Link>
                    </Button>
                  </>
                }
              />
            </>
          ) : null}
        </div>
      </div>
    </div>
  )
}
