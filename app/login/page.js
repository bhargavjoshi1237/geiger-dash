import { redirect } from 'next/navigation'
import { AuthForm } from './auth-form'
import { resolveLoginRedirectPath } from '@/lib/product-routes.mjs'
import { createClient } from '@/utils/supabase/server'

export default async function LoginPage({ searchParams }) {
  const params = await searchParams
  const next = params?.next
  const safeNext = typeof next === 'string' ? next : ''
  const redirectPath = resolveLoginRedirectPath(next)
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect(redirectPath)
  }

  return <AuthForm next={safeNext} />
}
