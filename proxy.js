import { NextResponse } from 'next/server'
import { updateSession } from './utils/supabase/middleware'

const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'geiger.studio'

export function subdomainFromHost(host) {
  if (!host) return ''
  const name = host.split(':')[0].toLowerCase()
  if (name === 'localhost' || name.endsWith('.localhost') || name.endsWith('.vercel.app')) return ''
  if (name === ROOT_DOMAIN || name === `www.${ROOT_DOMAIN}`) return ''
  const suffix = `.${ROOT_DOMAIN}`
  if (!name.endsWith(suffix)) return ''
  const label = name.slice(0, -suffix.length)
  return label && !label.includes('.') ? label : ''
}

export async function proxy(request) {
  // next.config sets skipTrailingSlashRedirect for the PostHog relay (excluded below), so restore Next's default here.
  // A plain URL, since NextURL re-appends the slash it saw on the incoming request.
  const url = new URL(request.url)
  if (url.pathname.length > 1 && url.pathname.endsWith('/')) {
    url.pathname = url.pathname.replace(/\/+$/, '')
    return NextResponse.redirect(url, 308)
  }

  const subdomain = subdomainFromHost(request.headers.get('host'))
  const requestHeaders = new Headers(request.headers)
  if (subdomain) requestHeaders.set('x-geiger-subdomain', subdomain)
  else requestHeaders.delete('x-geiger-subdomain')

  return await updateSession(request, requestHeaders)
}

export const config = {
  // `.+` leaves the bare `/` unmatched so the statically generated landing page is served straight from the CDN.
  // `[^/]+/_next/` skips the rewritten product apps' own assets (/property/_next/...) so chunks don't each hit auth.
  // `rly/` is the PostHog relay (lib/analytics/posthog-relay.mjs): analytics hits go straight to the rewrite.
  matcher: [
    '/((?!rly/|_next/static|_next/image|[^/]+/_next/|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).+)',
  ],
}
