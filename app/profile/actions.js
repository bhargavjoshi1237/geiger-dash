'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'
import { requireUser } from '@/supabase/user/getUser'
import { userAvatarUrl } from '@/lib/avatar-url'

// Profile server actions — everything the /profile hub can change about the
// signed-in user. All identity data lives on the Supabase auth user (email,
// password) and its `user_metadata` bag; the avatar lives in the public `pfp`
// bucket at `<user id>/latest.jpg`, which is the path the header reads from.
// Each action returns a plain { ok, error? } result so the client owns toasts.

const AVATAR_BUCKET = 'pfp'
const MAX_AVATAR_BYTES = 2 * 1024 * 1024
// Supabase defaults public objects to an hour. The object name is reused on
// every upload, so a long TTL means a stale picture everywhere that still reads
// the unversioned URL — keep it short as a backstop for those callers.
const AVATAR_CACHE_SECONDS = 60
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function cleanText(value, max = 200) {
  return String(value ?? '').trim().slice(0, max)
}

// The storage object every surface in the suite reads the avatar from. The
// object name is fixed, so the URL is only unique per upload once `version`
// (user_metadata.avatar_version) is appended — without it, browsers serve the
// previous picture from cache for the whole AVATAR_CACHE_SECONDS window.
// `lib/avatar-url.js` owns the URL shape; this just re-exports it as an action.
function avatarPath(userId) {
  return `${userId}/latest.jpg`
}

export async function avatarPublicUrl(userId, version = 0) {
  return userAvatarUrl(userId, version)
}

// Saves the editable profile fields. `name`/`full_name` are kept in sync because
// the header, member directory, and invite emails each read a different one.
export async function updateProfileAction(patch = {}) {
  const supabase = await createClient()
  const user = await requireUser(supabase, '/login?next=/profile')

  const displayName = cleanText(patch.displayName, 80)
  if (!displayName) return { ok: false, error: 'Enter a display name.' }

  const website = cleanText(patch.website, 200)
  if (website && !/^https?:\/\//i.test(website)) {
    return { ok: false, error: 'Website must start with http:// or https://' }
  }

  const data = {
    name: displayName,
    full_name: displayName,
    job_title: cleanText(patch.jobTitle, 80),
    company: cleanText(patch.company, 80),
    location: cleanText(patch.location, 80),
    website,
    bio: cleanText(patch.bio, 400),
  }

  const { error } = await supabase.auth.updateUser({ data })
  if (error) return { ok: false, error: error.message }

  revalidatePath(`/profile/${user.id}`)
  return { ok: true, profile: data }
}

// Notification/marketing switches. Stored on the same metadata bag so they
// travel with the user across every app in the suite.
export async function updatePreferencesAction(prefs = {}) {
  const supabase = await createClient()
  const user = await requireUser(supabase, '/login?next=/profile')

  const next = {
    product_emails: Boolean(prefs.productEmails),
    marketing_emails: Boolean(prefs.marketingEmails),
  }

  const { error } = await supabase.auth.updateUser({ data: next })
  if (error) return { ok: false, error: error.message }

  revalidatePath(`/profile/${user.id}`)
  return { ok: true }
}

// Uploads the avatar under the user's own folder — storage RLS ("PFP auth
// insert/update own folder") is what authorises it, so this uses the caller's
// client rather than the service role.
export async function updateAvatarAction(formData) {
  const supabase = await createClient()
  const user = await requireUser(supabase, '/login?next=/profile')

  const file = formData.get('avatar')
  if (!file || typeof file === 'string' || file.size === 0) {
    return { ok: false, error: 'Choose an image to upload.' }
  }
  if (file.size > MAX_AVATAR_BYTES) {
    return { ok: false, error: 'Image must be under 2 MB.' }
  }
  if (!String(file.type || '').startsWith('image/')) {
    return { ok: false, error: 'That file is not an image.' }
  }

  const bytes = await file.arrayBuffer()
  const { error } = await supabase.storage
    .from(AVATAR_BUCKET)
    .upload(avatarPath(user.id), bytes, {
      contentType: file.type,
      cacheControl: String(AVATAR_CACHE_SECONDS),
      upsert: true,
    })

  if (error) return { ok: false, error: error.message }

  // The upload reuses the same object name, so the picture only changes for a
  // browser if the URL does. `avatar_version` is that cache buster: every
  // surface builds the src as `<path>?v=<avatar_version>`.
  const version = Date.now()
  const url = await avatarPublicUrl(user.id, version)

  // Mirror the URL onto the auth user so apps that read `avatar_url` (the member
  // directory, OAuth-provisioned profiles) pick the new picture up too.
  await supabase.auth.updateUser({
    data: { avatar_url: url, avatar_version: version },
  })

  revalidatePath(`/profile/${user.id}`)
  revalidatePath('/org')
  return { ok: true, url, version }
}

export async function removeAvatarAction() {
  const supabase = await createClient()
  const user = await requireUser(supabase, '/login?next=/profile')

  const { error } = await supabase.storage.from(AVATAR_BUCKET).remove([avatarPath(user.id)])
  if (error) return { ok: false, error: error.message }

  // Clear the version too, so a later upload can't collide with a cached entry
  // stored under the old one.
  await supabase.auth.updateUser({ data: { avatar_url: '', avatar_version: 0 } })

  revalidatePath(`/profile/${user.id}`)
  revalidatePath('/org')
  return { ok: true }
}

// Email changes are confirmation-gated by Supabase: the address only switches
// once the user clicks the link sent to the NEW address.
export async function changeEmailAction(nextEmail) {
  const supabase = await createClient()
  const user = await requireUser(supabase, '/login?next=/profile')

  const email = cleanText(nextEmail, 200).toLowerCase()
  if (!EMAIL_RE.test(email)) return { ok: false, error: 'Enter a valid email address.' }
  if (email === String(user.email || '').toLowerCase()) {
    return { ok: false, error: 'That is already your email address.' }
  }

  const { error } = await supabase.auth.updateUser({ email })
  if (error) return { ok: false, error: error.message }

  return { ok: true, email }
}

export async function changePasswordAction(password) {
  const supabase = await createClient()
  await requireUser(supabase, '/login?next=/profile')

  const next = String(password ?? '')
  if (next.length < 8) return { ok: false, error: 'Password must be at least 8 characters.' }

  const { error } = await supabase.auth.updateUser({ password: next })
  if (error) return { ok: false, error: error.message }

  return { ok: true }
}

// Ends every session for this user, on every device, including this one — the
// client redirects to /login afterwards.
export async function signOutEverywhereAction() {
  const supabase = await createClient()
  await requireUser(supabase, '/login?next=/profile')

  const { error } = await supabase.auth.signOut({ scope: 'global' })
  if (error) return { ok: false, error: error.message }

  return { ok: true }
}
