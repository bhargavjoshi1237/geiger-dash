import sanitizeHtml from 'sanitize-html'

// The tags Studio's editor and the existing posts use; /blog/[slug] renders the result as raw HTML, so nothing else gets through.
const SANITIZE_OPTIONS = {
  allowedTags: [
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'br', 'hr', 'ul', 'ol', 'li', 'blockquote', 'pre', 'code',
    'strong', 'b', 'em', 'i', 'u', 's', 'a', 'img', 'figure', 'figcaption', 'table', 'thead', 'tbody', 'tr', 'th', 'td',
  ],
  allowedAttributes: {
    a: ['href', 'title', 'target', 'rel'],
    img: ['src', 'alt', 'title', 'width', 'height'],
    th: ['colspan', 'rowspan'],
    td: ['colspan', 'rowspan'],
  },
  allowedSchemes: ['http', 'https', 'mailto'],
  allowedSchemesByTag: { img: ['http', 'https', 'data'] },
  allowProtocolRelative: false,
}

// Must match formatPostContent in app/blog/[slug]/page.js: text it doesn't treat as HTML gets escaped there, so escaping it here too would double-encode.
const LOOKS_LIKE_HTML = /<[a-z][\s\S]*>/i

export function sanitizePostContent(content) {
  const value = String(content || '').trim()
  if (!LOOKS_LIKE_HTML.test(value)) return value
  return sanitizeHtml(value, SANITIZE_OPTIONS).trim()
}

export { slugify } from './slug.js'

// Same 200 words a minute as Studio.
export function readingTimeMinutes(content) {
  const words = String(content || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}
