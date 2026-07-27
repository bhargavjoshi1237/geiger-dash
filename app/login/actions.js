'use server'

import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { resolveLoginRedirectPath } from '@/lib/product-routes.mjs'

export async function login(formData) {
  const supabase =  await createClient()

  const email = formData.get('email')
  const password = formData.get('password')
  const redirectPath = resolveLoginRedirectPath(formData.get('next'))

  const { data: { user }, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  
  redirect(user ? redirectPath : '/')
}

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

