// Shared Studio lookups and formatters (config only, never row data).

export const SITE_HOST = 'geiger.studio'

// Status colours follow the DS badge variants: emerald live, sky scheduled, amber archived.
export const STUDIO_STATUS_MAP = {
  live: { label: 'Live', variant: 'success' },
  draft: { label: 'Draft', variant: 'neutral' },
  scheduled: { label: 'Scheduled', variant: 'info' },
  archived: { label: 'Archived', variant: 'warning' },
}

export const PUBLISH_FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'Live', value: 'live' },
  { label: 'Drafts', value: 'draft' },
  { label: 'Scheduled', value: 'scheduled' },
]

export const RELEASE_FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'Featured', value: 'featured' },
]

export const RELEASE_PRODUCTS = [
  { value: 'geiger-assets', label: 'Geiger Assets' },
  { value: 'geiger-campaign', label: 'Geiger Campaign' },
  { value: 'geiger-comms', label: 'Geiger Comms' },
  { value: 'geiger-content', label: 'Geiger Content' },
  { value: 'geiger-dash', label: 'Geiger Dash' },
  { value: 'geiger-docs', label: 'Geiger Docs' },
  { value: 'geiger-events', label: 'Geiger Events' },
  { value: 'geiger-flow', label: 'Geiger Flow' },
  { value: 'geiger-forms', label: 'Geiger Forms' },
  { value: 'geiger-grey', label: 'Geiger Grey' },
  { value: 'geiger-notes', label: 'Geiger Notes' },
  { value: 'geiger-office', label: 'Geiger Office' },
  { value: 'geiger-pods', label: 'Geiger Pods' },
  { value: 'geiger-property', label: 'Geiger Property' },
]

export const RELEASE_PRODUCT_LABEL = Object.fromEntries(RELEASE_PRODUCTS.map((product) => [product.value, product.label]))

export const RELEASE_CATEGORIES = [
  { value: 'feature', label: 'Feature' },
  { value: 'improvement', label: 'Improvement' },
  { value: 'bugfix', label: 'Bug fix' },
  { value: 'breaking', label: 'Breaking change' },
]

// Typed release items; `key` matches dash_changelog_items.type and the items_<key> form field.
export const RELEASE_ITEM_TYPES = [
  { key: 'added', label: 'Added', variant: 'success' },
  { key: 'changed', label: 'Changed', variant: 'info' },
  { key: 'fixed', label: 'Fixed', variant: 'warning' },
  { key: 'removed', label: 'Removed', variant: 'danger' },
  { key: 'deprecated', label: 'Deprecated', variant: 'purple' },
]

// Published rows dated in the future are scheduled; unpublished rows are drafts.
export function publishStatus(record) {
  if (!record?.is_published) return 'draft'
  const at = record.published_at ? new Date(record.published_at).getTime() : 0
  return at > Date.now() ? 'scheduled' : 'live'
}

const toDate = (value) => {
  const date = value ? new Date(value) : null
  return date && !Number.isNaN(date.getTime()) ? date : null
}

export function formatShortDate(value) {
  const date = toDate(value)
  return date ? date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''
}

export function formatDateTime(value) {
  const date = toDate(value)
  if (!date) return ''
  const time = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  return `${formatShortDate(date)}, ${time}`
}

// "just now", "4m ago", "3h ago", then a short date.
export function formatRelative(value) {
  const date = toDate(value)
  if (!date) return ''
  const minutes = Math.round((Date.now() - date.getTime()) / 60000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  if (minutes < 60 * 24) return `${Math.round(minutes / 60)}h ago`
  return formatShortDate(date)
}

// Plain-text word count of editor HTML.
export function countWords(html) {
  const text = String(html || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .trim()
  return text ? text.split(/\s+/).filter(Boolean).length : 0
}
