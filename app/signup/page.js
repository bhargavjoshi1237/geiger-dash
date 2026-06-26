import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { getUser } from '@/supabase/user/getUser'
import { SignupForm } from './signup-form'

export default async function SignupPage() {
  const supabase = await createClient()
  const user = await getUser(supabase)

  // Logged-in users don't sign up again — send them through the org gate, which
  // routes to the dashboard or the onboarding wizard depending on membership.
  if (user) {
    redirect('/org')
  }

  return <SignupForm />
}
