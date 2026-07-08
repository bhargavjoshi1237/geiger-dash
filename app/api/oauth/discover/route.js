import { NextResponse } from 'next/server'
import { getProviderByDomain } from '@/lib/oauth/providers'

export const runtime = 'nodejs'

// Login discovery: resolve a user's email domain to the org that registered it
// for OAuth, then hand off to that org's start route. Keeps the org id off the
// user — they only type their email, like Supabase's own domain-based SSO.
export async function GET(request) {
  const { origin, searchParams } = new URL(request.url)
  const email = String(searchParams.get('email') || '').trim().toLowerCase()
  const next = searchParams.get('next') || ''

  const domain = email.includes('@') ? email.split('@').pop() : ''
  if (!domain) {
    return NextResponse.redirect(`${origin}/login?error=sso_invalid_email`)
  }

  const provider = await getProviderByDomain(domain)
  if (!provider) {
    return NextResponse.redirect(`${origin}/login?error=sso_not_found`)
  }

  const params = next ? `?next=${encodeURIComponent(next)}` : ''
  return NextResponse.redirect(`${origin}/api/oauth/${provider.organizationId}/start${params}`)
}
