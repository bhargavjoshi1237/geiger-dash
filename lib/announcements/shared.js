// public.announcements row <-> camelCase view model, plus the input sanitizer the server actions write through.

import {
  ANNOUNCEMENT_ACCOUNT_MODES,
  ANNOUNCEMENT_APPS,
  ANNOUNCEMENT_DESIGN_DEFAULTS,
  ANNOUNCEMENT_DESIGN_OPTIONS,
  ANNOUNCEMENT_FORMATS,
  ANNOUNCEMENT_FREQUENCIES,
  ANNOUNCEMENT_PLANS,
  ANNOUNCEMENT_PLAN_STATES,
  ANNOUNCEMENT_PRODUCTS,
  ANNOUNCEMENT_ROLES,
  ANNOUNCEMENT_STATUSES,
  MAX_SLIDES,
} from './constants'

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const values = (options) => options.map((option) => option.value)

const obj = (value) => (value && typeof value === 'object' && !Array.isArray(value) ? value : {})
const list = (value) => (Array.isArray(value) ? value : [])
const text = (value, max) => String(value ?? '').trim().slice(0, max)
const oneOf = (value, allowed, fallback) => (allowed.includes(value) ? value : fallback)
const intIn = (value, min, max, fallback) => {
  const n = Number.parseInt(value, 10)
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : fallback
}
const pick = (value, allowed) => [...new Set(list(value).filter((item) => allowed.includes(item)))]
const ids = (value) => [...new Set(list(value).map((item) => String(item).trim()).filter((item) => UUID.test(item)))]

// Relative paths and http(s) URLs only, so a link can never run script.
function safeUrl(value) {
  const url = text(value, 500)
  if (!url) return ''
  if (url.startsWith('/') && !url.startsWith('//')) return url
  return /^https?:\/\//i.test(url) ? url : ''
}

function toIso(value) {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date.toISOString()
}

export const emptySlide = () => ({
  id: crypto.randomUUID(),
  imageUrl: '',
  imageAlt: '',
  badge: '',
  title: '',
  body: '',
  primaryLabel: '',
  primaryUrl: '',
  primaryNewTab: false,
  secondaryLabel: '',
  secondaryUrl: '',
  secondaryNewTab: true,
  nextLabel: '',
})

function sanitizeSlide(slide) {
  const s = obj(slide)
  return {
    id: UUID.test(String(s.id)) ? String(s.id) : crypto.randomUUID(),
    imageUrl: safeUrl(s.imageUrl),
    imageAlt: text(s.imageAlt, 200),
    badge: text(s.badge, 60),
    title: text(s.title, 160),
    body: text(s.body, 1200),
    primaryLabel: text(s.primaryLabel, 40),
    primaryUrl: safeUrl(s.primaryUrl),
    primaryNewTab: Boolean(s.primaryNewTab),
    secondaryLabel: text(s.secondaryLabel, 40),
    secondaryUrl: safeUrl(s.secondaryUrl),
    secondaryNewTab: s.secondaryNewTab !== false,
    nextLabel: text(s.nextLabel, 30),
  }
}

function sanitizeDesign(design) {
  const d = obj(design)
  const o = ANNOUNCEMENT_DESIGN_OPTIONS
  const base = ANNOUNCEMENT_DESIGN_DEFAULTS
  return {
    size: oneOf(d.size, values(o.size), base.size),
    position: oneOf(d.position, values(o.position), base.position),
    align: oneOf(d.align, values(o.align), base.align),
    imageAspect: oneOf(d.imageAspect, values(o.imageAspect), base.imageAspect),
    imageFit: oneOf(d.imageFit, values(o.imageFit), base.imageFit),
    imageBackground: oneOf(d.imageBackground, values(o.imageBackground), base.imageBackground),
    badgeTone: oneOf(d.badgeTone, values(o.badgeTone), base.badgeTone),
    primaryStyle: oneOf(d.primaryStyle, values(o.primaryStyle), base.primaryStyle),
    dismissible: d.dismissible !== false,
    closeOnOutside: d.closeOnOutside !== false,
    delaySeconds: intIn(d.delaySeconds, 0, 120, 0),
    autoAdvanceSeconds: intIn(d.autoAdvanceSeconds, 0, 60, 0),
    showProgress: d.showProgress !== false,
  }
}

function sanitizeAudience(audience) {
  const a = obj(audience)
  const account = obj(a.account)
  const labels = obj(a.labels)
  const audienceIds = [...ids(a.userIds), ...ids(a.excludeUserIds), ...ids(a.orgIds)]
  return {
    plans: pick(a.plans, values(ANNOUNCEMENT_PLANS)),
    planStates: pick(a.planStates, values(ANNOUNCEMENT_PLAN_STATES)),
    products: pick(a.products, values(ANNOUNCEMENT_PRODUCTS)),
    roles: pick(a.roles, values(ANNOUNCEMENT_ROLES)),
    orgIds: ids(a.orgIds),
    userIds: ids(a.userIds),
    excludeUserIds: ids(a.excludeUserIds),
    account: {
      mode: oneOf(account.mode, values(ANNOUNCEMENT_ACCOUNT_MODES), 'any'),
      days: intIn(account.days, 1, 3650, 14),
    },
    // Display names for the picked people/orgs, so Studio needn't look them up again.
    labels: Object.fromEntries(audienceIds.filter((id) => labels[id]).map((id) => [id, text(labels[id], 120)])),
  }
}

function sanitizeFrequency(frequency) {
  const f = obj(frequency)
  return {
    mode: oneOf(f.mode, values(ANNOUNCEMENT_FREQUENCIES), 'once'),
    times: intIn(f.times, 1, 100, 3),
    days: intIn(f.days, 1, 365, 7),
    stopOnClick: f.stopOnClick !== false,
  }
}

const routeList = (value) =>
  [...new Set(list(value).map((route) => text(route, 200)).filter((route) => route.startsWith('/') || route === '*'))].slice(0, 30)

// Full camelCase input -> snake_case row; every field is validated and defaulted.
export function toAnnouncementRow(input) {
  const i = obj(input)
  const format = oneOf(i.format, values(ANNOUNCEMENT_FORMATS), 'modal')
  const slides = list(i.slides).slice(0, MAX_SLIDES).map(sanitizeSlide)
  return {
    name: text(i.name, 120),
    format,
    status: oneOf(i.status, values(ANNOUNCEMENT_STATUSES), 'draft'),
    priority: intIn(i.priority, -100, 100, 0),
    slides: format === 'carousel' ? slides : slides.slice(0, 1),
    design: sanitizeDesign(i.design),
    audience: sanitizeAudience(i.audience),
    frequency: sanitizeFrequency(i.frequency),
    apps: pick(i.apps, values(ANNOUNCEMENT_APPS)),
    routes: routeList(i.routes),
    exclude_routes: routeList(i.excludeRoutes),
    starts_at: toIso(i.startsAt),
    ends_at: toIso(i.endsAt),
  }
}

export function normalizeAnnouncement(row) {
  if (!row) return null
  return {
    id: row.id,
    name: row.name ?? '',
    format: row.format ?? 'modal',
    status: row.status ?? 'draft',
    priority: row.priority ?? 0,
    slides: list(row.slides),
    design: sanitizeDesign(row.design),
    audience: sanitizeAudience(row.audience),
    frequency: sanitizeFrequency(row.frequency),
    apps: list(row.apps),
    routes: list(row.routes),
    excludeRoutes: list(row.exclude_routes),
    startsAt: row.starts_at ?? null,
    endsAt: row.ends_at ?? null,
    createdAt: row.created_at ?? null,
    updatedAt: row.updated_at ?? null,
  }
}

// Status as people read it: live rows before their start are scheduled, after their end are ended.
export function displayStatus(announcement) {
  if (announcement?.status !== 'live') return announcement?.status || 'draft'
  const now = Date.now()
  if (announcement.startsAt && new Date(announcement.startsAt).getTime() > now) return 'scheduled'
  if (announcement.endsAt && new Date(announcement.endsAt).getTime() <= now) return 'ended'
  return 'live'
}
