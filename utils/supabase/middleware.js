import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import { getUser } from '@/supabase/user/getUser'
import { loginNextRouteNames } from '@/lib/product-routes.mjs'

// Inner app routes that require a signed-in user *with* an organization. These
// are the product workspaces (which proxy through this project via next.config
// rewrites) plus the org dashboard. Public/marketing routes are not listed and
// pass through untouched. `docs` is excluded because it serves public docs.
const GATED_SEGMENTS = new Set(loginNextRouteNames)
GATED_SEGMENTS.delete('docs')

const HAS_ORG_COOKIE = 'geiger_has_org'

function redirectWithCookies(url, base) {
  const res = NextResponse.redirect(url)
  base.cookies.getAll().forEach((cookie) => res.cookies.set(cookie))
  return res
}

export async function updateSession(request) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, {
              ...options,
              domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN || undefined,
              path: '/',
              sameSite: 'lax',
              secure: process.env.NODE_ENV === 'production',
            })
          )
        },
      },
    }
  )

  const user = await getUser(supabase)

  // Accept an invite captured before the user had a session (set by the invite
  // accept route). Best-effort and cleared regardless so a bad token can't loop.
  const pendingInvite = request.cookies.get('pending_invite')?.value
  if (user && pendingInvite) {
    await supabase.rpc('accept_invite', { p_token: pendingInvite })
    supabaseResponse.cookies.set('pending_invite', '', { path: '/', maxAge: 0 })
    supabaseResponse.cookies.set(HAS_ORG_COOKIE, '1', {
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7,
    })
  }

  const segment = request.nextUrl.pathname.split('/')[1] || ''
  if (!GATED_SEGMENTS.has(segment)) {
    return supabaseResponse
  }

  // Not signed in → send to login, remembering where they were headed.
  if (!user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.search = segment ? `?next=${segment}` : ''
    return redirectWithCookies(url, supabaseResponse)
  }

  // Signed in: confirm org membership. A short-lived cookie caches the answer so
  // we only hit the DB once per session instead of on every navigation. RLS is
  // the real security boundary; this cookie is only a routing optimization.
  if (request.cookies.get(HAS_ORG_COOKIE)?.value === '1') {
    return supabaseResponse
  }

  const { data: hasOrg, error } = await supabase.rpc('user_has_org')

  // Fail open on a transient RPC error: RLS is the real boundary, and bouncing a
  // genuine member to /onboarding here would loop. Only redirect when we know
  // for certain the user has no org.
  if (error) {
    return supabaseResponse
  }

  if (hasOrg) {
    supabaseResponse.cookies.set(HAS_ORG_COOKIE, '1', {
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7,
    })
    return supabaseResponse
  }

  const url = request.nextUrl.clone()
  url.pathname = '/onboarding'
  url.search = ''
  const res = redirectWithCookies(url, supabaseResponse)
  res.cookies.set(HAS_ORG_COOKIE, '', { path: '/', maxAge: 0 })
  return res
}
