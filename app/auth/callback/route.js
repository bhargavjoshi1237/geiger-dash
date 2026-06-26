import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

// Lands the Supabase email-confirmation (and any OAuth) redirect. Supabase sends
// either a PKCE `code` or an OTP `token_hash`+`type`; we exchange whichever is
// present for a session, then forward the user on. New/just-confirmed accounts
// have no organization yet, so the default destination is the onboarding gate
// (which itself bounces to /org if they already belong somewhere).
export async function GET(request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const tokenHash = searchParams.get('token_hash')
  const type = searchParams.get('type')
  const next = searchParams.get('next') || '/onboarding'

  const supabase = await createClient()

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  } else if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash })
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`)
}
