import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { getUser } from '@/supabase/user/getUser'

// Invite accept link target. If the visitor is signed in we accept immediately
// and drop them in the org. If not, we stash the token in a short-lived cookie
// and send them to log in / sign up — the middleware accepts the pending invite
// once they have a session (works for both the login and email-confirm paths).
export async function GET(request, { params }) {
  const { token } = await params
  const { origin } = new URL(request.url)

  const supabase = await createClient()
  const user = await getUser(supabase)

  if (!user) {
    const res = NextResponse.redirect(`${origin}/login?next=org`)
    res.cookies.set('pending_invite', token, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 30,
    })
    return res
  }

  const { data, error } = await supabase.rpc('accept_invite', { p_token: token })
  const row = Array.isArray(data) ? data[0] : data

  if (error || !row) {
    return NextResponse.redirect(`${origin}/org?error=invite_invalid`)
  }

  const res = NextResponse.redirect(`${origin}/org?joined=1`)
  // The user now has an org — prime the middleware's membership cache.
  res.cookies.set('geiger_has_org', '1', {
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7,
  })
  return res
}
