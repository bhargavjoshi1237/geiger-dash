'use server'

import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

// Best-effort origin for the email confirmation redirect, derived from the
// incoming request (works across localhost / preview / prod without an env var).
async function requestOrigin() {
  const h = await headers()
  const host = h.get('x-forwarded-host') || h.get('host')
  const proto = h.get('x-forwarded-proto') || 'https'
  return host ? `${proto}://${host}` : ''
}

// Sign-up returns a result object so the form can branch between two outcomes:
//  - session present  → email confirmation is off; the user is logged in now.
//  - session absent    → Supabase sent a confirmation email; show "check inbox".
// New accounts have no organization, so a confirmed/auto session lands on the
// onboarding wizard (the form performs that redirect).
export async function signUp(formData) {
  const supabase = await createClient()

  const email = String(formData.get('email') || '').trim()
  const password = String(formData.get('password') || '')

  if (!email || !password) {
    return { error: 'Email and password are required.' }
  }
  if (password.length < 8) {
    return { error: 'Password must be at least 8 characters.' }
  }

  const origin = await requestOrigin()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: origin ? { emailRedirectTo: `${origin}/auth/callback` } : undefined,
  })

  if (error) {
    return { error: error.message }
  }

  if (data.session) {
    revalidatePath('/', 'layout')
    return { ok: true, needsConfirmation: false }
  }

  return { ok: true, needsConfirmation: true }
}
