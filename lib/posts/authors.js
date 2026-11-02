import { slugify } from './slug.js'

export const AUTHOR_LINKS = [
  { key: 'website', label: 'Website' },
  { key: 'github', label: 'GitHub' },
  { key: 'x', label: 'X' },
  { key: 'linkedin', label: 'LinkedIn' },
]

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

function httpsUrl(value) {
  try {
    const url = new URL(value)
    return url.protocol === 'https:' ? url.href : null
  } catch {
    return null
  }
}

// Checks an author form; name, role and bio reach a JSON-LD script tag, so they can't contain < or >.
export function normalizeAuthorInput(input) {
  const name = String(input?.name || '').trim().slice(0, 120)
  const role = String(input?.role || '').trim().slice(0, 120)
  const bio = String(input?.bio || '').trim().slice(0, 2000)
  const slug = String(input?.slug || '').trim() || slugify(name)
  const avatar = String(input?.avatarUrl || '').trim()

  if (!name) return { ok: false, error: 'Add a name.' }
  if (!bio) return { ok: false, error: 'Add a short bio.' }
  if ([name, role, bio].some((text) => /[<>]/.test(text))) return { ok: false, error: 'Name, role and bio must be plain text, without < or >.' }
  if (!SLUG.test(slug)) return { ok: false, error: 'Use lowercase letters, numbers and hyphens in the URL.' }

  const avatarUrl = avatar ? httpsUrl(avatar) : null
  if (avatar && !avatarUrl) return { ok: false, error: 'The photo must be an HTTPS link.' }

  const links = []
  for (const { key, label } of AUTHOR_LINKS) {
    const value = String(input?.links?.[key] || '').trim()
    if (!value) continue
    const url = httpsUrl(value)
    if (!url) return { ok: false, error: `The ${label} link must start with https://.` }
    links.push({ label, url })
  }

  return { ok: true, values: { name, slug, role: role || null, bio, avatar_url: avatarUrl, links } }
}

export function authorSameAs(author) {
  return (Array.isArray(author?.links) ? author.links : []).map((link) => link.url)
}

// Reads a stored link back into the form's fields.
export function authorLinkFields(author) {
  const stored = Array.isArray(author?.links) ? author.links : []
  return Object.fromEntries(AUTHOR_LINKS.map(({ key, label }) => [key, stored.find((link) => link.label === label)?.url || '']))
}
