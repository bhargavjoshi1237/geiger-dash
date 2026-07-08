// Small server-only crypto helpers for the OAuth auth-code flow (Node runtime).
import crypto from 'crypto'

function base64url(buf) {
  return buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

export function randomToken(bytes = 32) {
  return base64url(crypto.randomBytes(bytes))
}

export function challengeFromVerifier(verifier) {
  return base64url(crypto.createHash('sha256').update(verifier).digest())
}

// Decode a JWT payload without verifying the signature (used only as a fallback
// to read claims from an id_token when no userinfo endpoint is configured).
export function decodeJwtPayload(jwt) {
  try {
    const part = String(jwt || '').split('.')[1]
    if (!part) return null
    const json = Buffer.from(part.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8')
    return JSON.parse(json)
  } catch {
    return null
  }
}
