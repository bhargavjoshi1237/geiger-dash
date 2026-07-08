import { redirect } from 'next/navigation'
import { AuthForm } from './auth-form'
import { resolveLoginRedirectPath } from '@/lib/product-routes.mjs'
import { createClient } from '@/utils/supabase/server'
import { getUser } from '@/supabase/user/getUser'

export default async function LoginPage({ searchParams }) {
  const params = await searchParams
  const next = params?.next
  const safeNext = typeof next === 'string' ? next : ''
  const error = typeof params?.error === 'string' ? params.error : ''
  const redirectPath = resolveLoginRedirectPath(next)
  const supabase = await createClient()
  const user = await getUser(supabase)

  if (user) {
    redirect(redirectPath)
  }

  return <AuthForm next={safeNext} initialError={error} />
}
