import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// Service-role Supabase client for trusted server-side writes (webhooks, billing
// finalization) that must bypass RLS. Never import this into client components.
// Returns null when the service env is absent so callers can degrade gracefully.
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) return null

  return createSupabaseClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  })
}
