// Which AI clients may complete the MCP consent flow, judged by their redirect URI. Pure.

const EXACT = new Set([
  'https://claude.ai/api/mcp/auth_callback',
  'https://claude.com/api/mcp/auth_callback',
  'https://chatgpt.com/connector_platform_oauth_redirect',
])

const PREFIXES = ['https://chatgpt.com/connector/oauth/']

const LOOPBACK_HOSTS = new Set(['localhost', '127.0.0.1', '[::1]'])

// MCP_ALLOWED_REDIRECTS adds exact callback URLs, comma separated, for other clients.
function extraRedirects(env) {
  return String(env?.MCP_ALLOWED_REDIRECTS || '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean)
}

export function isLoopbackRedirect(uri) {
  try {
    const url = new URL(uri)
    return url.protocol === 'http:' && LOOPBACK_HOSTS.has(url.hostname)
  } catch {
    return false
  }
}

// customRedirects are exact callback URLs this user saved for apps they added by hand.
export function isAllowedRedirect(uri, env = process.env, customRedirects = []) {
  if (typeof uri !== 'string' || !uri) return false
  if (EXACT.has(uri) || extraRedirects(env).includes(uri) || customRedirects.includes(uri)) return true
  if (PREFIXES.some((prefix) => uri.startsWith(prefix) && !uri.includes('..'))) return true
  return isLoopbackRedirect(uri)
}
