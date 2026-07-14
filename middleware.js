import { NextResponse } from 'next/server'
import { updateSession } from './utils/supabase/middleware'

const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'geiger.studio'

// Resolve the org subdomain label from a Host header, or '' for the apex, www,
// Vercel previews, and local dev. e.g. acme.geiger.studio -> 'acme'. Only a
// single-label subdomain counts as an org host (multi-label hosts are ignored).
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

export async function middleware(request) {
  const subdomain = subdomainFromHost(request.headers.get('host'))

  // Forward the resolved subdomain to server components via a request header so
  // /org can scope its listing to just that organization.
  const requestHeaders = new Headers(request.headers)
  if (subdomain) requestHeaders.set('x-geiger-subdomain', subdomain)
  else requestHeaders.delete('x-geiger-subdomain')

  if (request.nextUrl.pathname === '/') {
    return NextResponse.next({ request: { headers: requestHeaders } })
  }

  return await updateSession(request, requestHeaders)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
