// Key generation for the posts API, mirroring lib/filestore/keys.js: only the hash is stored and the key is shown once.
import crypto from 'node:crypto'

export const POST_KEY_PREFIX = 'gp_live_'

export const POST_KEY_ACCESS = ['read', 'draft', 'publish']

export function hashPostKey(key) {
  return crypto.createHash('sha256').update(key).digest('hex')
}

export function generatePostKey() {
  const key = `${POST_KEY_PREFIX}${crypto.randomBytes(24).toString('base64url')}`
  return { key, prefix: `${key.slice(0, 14)}…`, hash: hashPostKey(key) }
}

export function hasAccess(keyAccess, required) {
  const held = POST_KEY_ACCESS.indexOf(keyAccess)
  return held !== -1 && held >= POST_KEY_ACCESS.indexOf(required)
}
