import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { requireUser } from '@/supabase/user/getUser'

export const dynamic = 'force-dynamic'

// `/profile` is the memorable entry point; the canonical URL is id-scoped.
export default async function ProfileIndexPage() {
  const supabase = await createClient()
  const user = await requireUser(supabase, '/login?next=/profile')

  redirect(`/profile/${user.id}`)
}
