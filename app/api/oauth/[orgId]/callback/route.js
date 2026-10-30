import { NextResponse } from 'next/server'
import { getProvider } from '@/lib/oauth/providers'
import { decodeJwtPayload } from '@/lib/oauth/pkce'
import { canSignInViaOrgProvider, isEmailOnOrgDomain } from '@/lib/oauth/email-policy'
import {
  findOrCreateUser,
  ensureOrgMembership,
  buildSessionCallbackUrl,
  isOrgMember,
  orgHasOAuthAddon,
} from '@/lib/oauth/session'

export const runtime = 'nodejs'

function fail(origin, reason = 'oauth_failed') {
  return NextResponse.redirect(`${origin}/login?error=${reason}`)
}

// Completes the org's OAuth sign-in: validates state, exchanges the code for
// tokens, reads the user's profile, then finds/creates the Supabase user,
// auto-joins them to the org, and redirects through /auth/callback to establish
// the session.
export async function GET(request, { params }) {
  const { orgId } = await params
  const { origin, searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const returnedState = searchParams.get('state')

  const savedState = request.cookies.get('oauth_state')?.value
  const verifier = request.cookies.get('oauth_verifier')?.value
  const next = request.cookies.get('oauth_next')?.value || `/org/${orgId}`

  if (!code || !returnedState || !savedState || returnedState !== savedState) {
    return fail(origin, 'oauth_state')
  }

  const provider = await getProvider(orgId)
  if (!provider || !provider.enabled || !provider.tokenUrl) {
    return fail(origin, 'oauth_unavailable')
  }

  try {
    const redirectUri = `${origin}/api/oauth/${orgId}/callback`
    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      client_id: provider.clientId,
    })
    if (provider.clientSecret) body.set('client_secret', provider.clientSecret)
    if (verifier) body.set('code_verifier', verifier)

    const tokenRes = await fetch(provider.tokenUrl, {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded', accept: 'application/json' },
      body,
    })
    if (!tokenRes.ok) {
      console.error('[oauth.callback.token]', `HTTP ${tokenRes.status}`)
      return fail(origin)
    }
    const tokens = await tokenRes.json()
    const accessToken = tokens.access_token
    const idToken = tokens.id_token

    // Read profile claims: prefer the userinfo endpoint, fall back to id_token.
    let claims = {}
    if (provider.userinfoUrl && accessToken) {
      const infoRes = await fetch(provider.userinfoUrl, {
        headers: { authorization: `Bearer ${accessToken}`, accept: 'application/json' },
      })
      if (infoRes.ok) claims = await infoRes.json()
    }
    if (!claims.email && idToken) {
      claims = { ...(decodeJwtPayload(idToken) || {}), ...claims }
    }

    const map = provider.attributeMapping || {}
    const email = claims[map.email || 'email'] || claims.email
    const name =
      claims[map.name || 'name'] || claims.name || claims.full_name || claims.preferred_username || ''
    const avatar = claims[map.avatar || 'picture'] || claims.picture || claims.avatar_url || ''

    if (!email) {
      console.error('[oauth.callback]', 'no email in profile')
      return fail(origin, 'oauth_no_email')
    }

    // An org's provider is only trusted for its own domains, and only while the org holds the add-on.
    if (claims.email_verified === false || !isEmailOnOrgDomain(email, provider.emailDomains)) {
      console.error('[oauth.callback]', 'email rejected for this provider')
      return fail(origin, 'oauth_email_domain')
    }
    if (!(await orgHasOAuthAddon(orgId))) return fail(origin, 'oauth_unavailable')

    const result = await findOrCreateUser({ email, name, avatar })
    if (!result) return fail(origin)
    const { user, created } = result

    // Domains aren't ownership-verified, so a provider can't take over an account from outside its org.
    if (!canSignInViaOrgProvider({ created, isMember: await isOrgMember(orgId, user.id) })) {
      console.error('[oauth.callback]', 'existing account is not a member of this org')
      return fail(origin, 'oauth_not_member')
    }

    await ensureOrgMembership(orgId, user.id)

    const callbackUrl = await buildSessionCallbackUrl({ origin, email, next })
    if (!callbackUrl) return fail(origin)

    const res = NextResponse.redirect(callbackUrl)
    res.cookies.delete('oauth_state')
    res.cookies.delete('oauth_verifier')
    res.cookies.delete('oauth_next')
    return res
  } catch (e) {
    console.error('[oauth.callback]', e)
    return fail(origin)
  }
}
