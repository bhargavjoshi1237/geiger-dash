import { NextResponse } from 'next/server'
import { getProvider } from '@/lib/oauth/providers'
import { randomToken, challengeFromVerifier } from '@/lib/oauth/pkce'

export const runtime = 'nodejs'

// Kick off the org's OAuth sign-in: build the provider authorization URL and
// stash state (+ PKCE verifier) in short-lived httpOnly cookies. The callback
// route completes the exchange and mints the Supabase session.
export async function GET(request, { params }) {
  const { orgId } = await params
  const { origin, searchParams } = new URL(request.url)
  const next = searchParams.get('next') || `/org/${orgId}`

  const provider = await getProvider(orgId)
  if (!provider || !provider.enabled || !provider.authorizationUrl || !provider.clientId) {
    return NextResponse.redirect(`${origin}/login?error=oauth_unavailable`)
  }

  const state = randomToken(16)
  const redirectUri = `${origin}/api/oauth/${orgId}/callback`
  const authUrl = new URL(provider.authorizationUrl)
  authUrl.searchParams.set('response_type', 'code')
  authUrl.searchParams.set('client_id', provider.clientId)
  authUrl.searchParams.set('redirect_uri', redirectUri)
  authUrl.searchParams.set('scope', (provider.scopes || []).join(' ') || 'openid email profile')
  authUrl.searchParams.set('state', state)

  let verifier = ''
  if (provider.pkceEnabled) {
    verifier = randomToken(32)
    authUrl.searchParams.set('code_challenge', challengeFromVerifier(verifier))
    authUrl.searchParams.set('code_challenge_method', 'S256')
  }

  const res = NextResponse.redirect(authUrl.toString())
  const cookieOpts = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 600,
  }
  res.cookies.set('oauth_state', state, cookieOpts)
  res.cookies.set('oauth_next', next, cookieOpts)
  if (verifier) res.cookies.set('oauth_verifier', verifier, cookieOpts)
  return res
}
