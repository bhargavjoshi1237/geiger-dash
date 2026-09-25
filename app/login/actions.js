'use server'

import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

// Password sign-in runs in the browser (auth-form.jsx): a cookie-setting Server Action re-renders
// /login, which redirects the signed-in user before the passkey setup dialog can show.

export async function logout() {
  const supabase =  await createClient()
  await supabase.auth.signOut()

  // Drop the middleware's org-membership cache so the next user on this browser
  // doesn't inherit a stale "has org" answer.
  const cookieStore = await cookies()
  cookieStore.set('geiger_has_org', '', { path: '/', maxAge: 0 })

  revalidatePath('/', 'layout')
  redirect('/')
}

