// A page's search param as a plain string, e.g. ?post=<id>.
export function searchParam(params, key) {
  const value = params?.[key]
  return typeof value === 'string' ? value : ''
}

// Studio editor URL with the open record and status flags, e.g. /studio/posts?post=<id>&saved=1.
export function studioUrl(path, params) {
  const search = new URLSearchParams(Object.entries(params).filter(([, value]) => value))
  return `${path}?${search.toString()}`
}

// "Save draft" / "Publish" submit an intent; without one the Published switch decides.
export function publishIntent(formData) {
  const intent = String(formData.get('intent') || '')
  if (intent === 'publish') return true
  if (intent === 'draft') return false
  return formData.get('is_published') === 'on'
}
