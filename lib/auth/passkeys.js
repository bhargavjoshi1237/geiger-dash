// Browser-side passkey (WebAuthn) helpers over Supabase Auth. Pure: never toast,
// return null/false on failure so the calling component owns the UX.
import { createClient } from '@/utils/supabase/client'

const DISMISS_KEY = 'geiger_passkey_prompt_dismissed'

const ERROR_MESSAGES = {
  passkey_disabled: 'Passkeys are not enabled yet.',
  too_many_passkeys: "You've reached the maximum number of passkeys.",
  webauthn_credential_exists: 'This device already has a passkey for your account.',
  webauthn_credential_not_found: "That passkey isn't registered to any account.",
  webauthn_challenge_expired: 'The request timed out. Please try again.',
  webauthn_verification_failed: "Your passkey couldn't be verified. Please try again.",
  email_not_confirmed: 'Confirm your email address before signing in.',
  user_banned: 'This account has been suspended.',
  ERROR_AUTHENTICATOR_PREVIOUSLY_REGISTERED: 'This device already has a passkey for your account.',
}

export function isPasskeySupported() {
  return typeof window !== 'undefined' && typeof window.PublicKeyCredential === 'function'
}

// A closed/cancelled browser prompt is not an error worth surfacing.
function isCancelled(error) {
  return (
    error?.code === 'ERROR_CEREMONY_ABORTED' ||
    error?.name === 'NotAllowedError' ||
    error?.cause?.name === 'NotAllowedError' ||
    error?.name === 'AbortError'
  )
}

function toResult(error, fallback) {
  if (isCancelled(error)) return { ok: false, cancelled: true, error: '' }
  // The browser rejects a hostname that isn't the Supabase Relying Party ID (or a subdomain of it).
  if (error?.code === 'ERROR_INVALID_DOMAIN' || error?.code === 'ERROR_INVALID_RP_ID') {
    return { ok: false, cancelled: false, error: `Passkeys aren't set up for ${window.location.hostname}.` }
  }
  return { ok: false, cancelled: false, error: ERROR_MESSAGES[error?.code] || error?.message || fallback }
}

export async function signInWithPasskey() {
  try {
    const { data, error } = await createClient().auth.signInWithPasskey()
    if (error || !data?.session) return toResult(error, "Couldn't sign in with a passkey.")
    return { ok: true, user: data.user }
  } catch (e) {
    console.error('[passkeys.signIn]', e)
    return toResult(e, "Couldn't sign in with a passkey.")
  }
}

export async function registerPasskey() {
  try {
    const { data, error } = await createClient().auth.registerPasskey()
    if (error || !data) return toResult(error, "Couldn't set up your passkey.")
    return { ok: true, passkey: normalizePasskey(data) }
  } catch (e) {
    console.error('[passkeys.register]', e)
    return toResult(e, "Couldn't set up your passkey.")
  }
}

export function normalizePasskey(row) {
  return {
    id: row.id,
    name: row.friendly_name || 'Passkey',
    createdAt: row.created_at ?? null,
    lastUsedAt: row.last_used_at ?? null,
  }
}

// null → passkeys disabled for the project or the request failed.
export async function listPasskeys() {
  try {
    const { data, error } = await createClient().auth.passkey.list()
    if (error) {
      if (error.code !== 'passkey_disabled') console.error('[passkeys.list]', error.message)
      return null
    }
    return (data || []).map(normalizePasskey)
  } catch (e) {
    console.error('[passkeys.list]', e)
    return null
  }
}

export async function deletePasskey(passkeyId) {
  if (!passkeyId) return false
  try {
    const { error } = await createClient().auth.passkey.delete({ passkeyId })
    if (error) {
      console.error('[passkeys.delete]', error.message)
      return false
    }
    return true
  } catch (e) {
    console.error('[passkeys.delete]', e)
    return false
  }
}

function readDismissed() {
  try {
    return JSON.parse(window.localStorage.getItem(DISMISS_KEY) || '[]')
  } catch {
    return []
  }
}

// "Don't ask again" is remembered per user on this browser.
export function dismissPasskeyPrompt(userId) {
  if (!userId) return
  try {
    const ids = readDismissed()
    if (!ids.includes(userId)) window.localStorage.setItem(DISMISS_KEY, JSON.stringify([...ids, userId]))
  } catch {
    // Storage unavailable (private mode) — the prompt simply returns next time.
  }
}

// Returns the signed-in user when a setup prompt makes sense, else null: the
// browser supports WebAuthn, passkeys are enabled, the user is eligible (not
// SSO/anonymous), hasn't opted out here, and has no passkey yet.
export async function getPasskeyPromptUser() {
  if (!isPasskeySupported()) return null
  try {
    const { data } = await createClient().auth.getUser()
    const user = data?.user
    if (!user || user.is_anonymous || user.is_sso_user) return null
    if (readDismissed().includes(user.id)) return null
    const passkeys = await listPasskeys()
    return Array.isArray(passkeys) && passkeys.length === 0 ? user : null
  } catch (e) {
    console.error('[passkeys.prompt]', e)
    return null
  }
}
