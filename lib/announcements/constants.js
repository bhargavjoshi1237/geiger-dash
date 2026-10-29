// Announcement lookups shared by Studio, the server actions and the in-app host (config only, never row data).

import { products } from '@/lib/pricing/plans'

const APP_CATEGORIES = ['core', 'addon', 'cherry']

export const ANNOUNCEMENT_PRODUCTS = products
  .filter((product) => APP_CATEGORIES.includes(product.category))
  .map((product) => ({ value: product.id, label: product.name }))
  .sort((a, b) => a.label.localeCompare(b.label))

// App keys each suite app passes to <AnnouncementHost app="…" />.
export const ANNOUNCEMENT_APPS = [{ value: 'dash', label: 'Dash' }, ...ANNOUNCEMENT_PRODUCTS]

export const ANNOUNCEMENT_FORMATS = [
  { value: 'modal', label: 'Modal', description: 'Centered dialog with image and call to action' },
  { value: 'corner', label: 'Corner card', description: 'Small card that does not block the page' },
  { value: 'takeover', label: 'Takeover', description: 'Full-screen splash for big launches' },
  { value: 'carousel', label: 'Carousel', description: 'Several slides, stepped through in order' },
]

export const ANNOUNCEMENT_FORMAT_LABEL = Object.fromEntries(ANNOUNCEMENT_FORMATS.map((f) => [f.value, f.label]))

export const ANNOUNCEMENT_STATUSES = [
  { value: 'draft', label: 'Draft' },
  { value: 'live', label: 'Live' },
  { value: 'paused', label: 'Paused' },
  { value: 'ended', label: 'Ended' },
]

// Display status adds "scheduled" (live, not started) and folds live-but-past-end into "ended".
export const ANNOUNCEMENT_STATUS_MAP = {
  live: { label: 'Live', variant: 'success' },
  scheduled: { label: 'Scheduled', variant: 'info' },
  paused: { label: 'Paused', variant: 'warning' },
  draft: { label: 'Draft', variant: 'neutral' },
  ended: { label: 'Ended', variant: 'outline' },
}

export const ANNOUNCEMENT_FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'Live', value: 'live' },
  { label: 'Scheduled', value: 'scheduled' },
  { label: 'Drafts', value: 'draft' },
]

export const ANNOUNCEMENT_PLANS = [
  { value: 'beta', label: 'Alpha tester' },
  { value: 'basic', label: 'Basic' },
  { value: 'plus', label: 'Plus' },
  { value: 'pro', label: 'Pro' },
  { value: 'none', label: 'No plan' },
]

export const ANNOUNCEMENT_PLAN_STATES = [
  { value: 'trialing', label: 'Trialing' },
  { value: 'active', label: 'Paid' },
  { value: 'grace', label: 'Grace period' },
  { value: 'expired', label: 'Expired' },
  { value: 'none', label: 'Never subscribed' },
]

// public."Role" values; owners and org creators count as Owner.
export const ANNOUNCEMENT_ROLES = [
  { value: 'Owner', label: 'Owner' },
  { value: 'Admin', label: 'Admin' },
  { value: 'Manager', label: 'Manager' },
  { value: 'User', label: 'Member' },
]

export const ANNOUNCEMENT_ACCOUNT_MODES = [
  { value: 'any', label: 'Any account age' },
  { value: 'new', label: 'Joined in the last…' },
  { value: 'existing', label: 'Joined more than…' },
]

export const ANNOUNCEMENT_FREQUENCIES = [
  { value: 'once', label: 'Once, until dismissed', hint: 'Shows on every visit until the person closes it or clicks the button.' },
  { value: 'session', label: 'Once per session', hint: 'Shows once per browser session, every session.' },
  { value: 'always', label: 'Every page load', hint: 'Shows on every full page load while it is live.' },
  { value: 'times', label: 'Up to N times', hint: 'Shows at most N times per person.' },
  { value: 'interval', label: 'Again after N days', hint: 'Comes back N days after the person last closed it.' },
]

export const ANNOUNCEMENT_DESIGN_OPTIONS = {
  size: [
    { value: 'sm', label: 'Small' },
    { value: 'md', label: 'Medium' },
    { value: 'lg', label: 'Large' },
  ],
  position: [
    { value: 'bottom-right', label: 'Bottom right' },
    { value: 'bottom-left', label: 'Bottom left' },
    { value: 'top-right', label: 'Top right' },
    { value: 'top-left', label: 'Top left' },
  ],
  align: [
    { value: 'left', label: 'Left' },
    { value: 'center', label: 'Center' },
  ],
  imageAspect: [
    { value: 'wide', label: 'Wide 16:9' },
    { value: 'banner', label: 'Banner 2:1' },
    { value: 'tall', label: 'Classic 4:3' },
    { value: 'square', label: 'Square' },
  ],
  imageFit: [
    { value: 'cover', label: 'Fill' },
    { value: 'contain', label: 'Fit' },
  ],
  imageBackground: [
    { value: 'muted', label: 'Surface' },
    { value: 'light', label: 'White' },
    { value: 'dark', label: 'Black' },
    { value: 'none', label: 'None' },
  ],
  badgeTone: [
    { value: 'info', label: 'Blue' },
    { value: 'success', label: 'Green' },
    { value: 'warning', label: 'Amber' },
    { value: 'danger', label: 'Red' },
    { value: 'purple', label: 'Violet' },
    { value: 'neutral', label: 'Neutral' },
  ],
  primaryStyle: [
    { value: 'default', label: 'Solid' },
    { value: 'secondary', label: 'Soft' },
    { value: 'outline', label: 'Outline' },
  ],
}

// Mirrors DEFAULT_ANNOUNCEMENT_DESIGN in @geiger/ui/announcements; kept here because server code can't import a client module's values.
export const ANNOUNCEMENT_DESIGN_DEFAULTS = {
  size: 'md',
  position: 'bottom-right',
  align: 'left',
  imageAspect: 'wide',
  imageFit: 'cover',
  imageBackground: 'muted',
  badgeTone: 'info',
  primaryStyle: 'default',
  dismissible: true,
  closeOnOutside: true,
  delaySeconds: 0,
  autoAdvanceSeconds: 0,
  showProgress: true,
}

export const MAX_SLIDES = 8
