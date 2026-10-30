'use server'

import { createClient } from '@/utils/supabase/server'
import { getUser } from '@/supabase/user/getUser'
import { listCustomRedirects, listSelectableProjects, saveConnection } from '@/lib/mcp/connections'
import { isAllowedRedirect } from '@/lib/mcp/redirects'

// Approving and denying re-read the request from Supabase, so nothing about the client is trusted from the browser.
async function loadRequest(supabase, authorizationId) {
  const id = String(authorizationId || '').trim()
  if (!id) return { error: 'This request is missing its authorization ID.' }
  const { data, error } = await supabase.auth.oauth.getAuthorizationDetails(id)
  if (error || !data?.authorization_id) {
    if (error) console.error('[mcp.consent.details]', error.message)
    return { error: 'This request has expired. Start the connection again from your AI app.' }
  }
  return { details: data }
}

export async function approveConsentAction({ authorizationId, projectIds, access }) {
  const supabase = await createClient()
  const user = await getUser(supabase)
  if (!user) return { ok: false, error: 'Sign in to continue.' }

  const { details, error } = await loadRequest(supabase, authorizationId)
  if (error) return { ok: false, error }
  const customRedirects = await listCustomRedirects(supabase, user.id)
  if (!isAllowedRedirect(details.redirect_uri, process.env, customRedirects)) {
    return { ok: false, error: "This app isn't on the list of supported AI clients." }
  }

  // Keep only projects this user can actually see.
  const visible = new Set((await listSelectableProjects(supabase)).map((project) => project.id))
  const chosen = [...new Set(Array.isArray(projectIds) ? projectIds : [])].filter((id) => visible.has(id))
  if (chosen.length === 0) return { ok: false, error: 'Choose at least one project.' }

  const connection = await saveConnection(supabase, {
    userId: user.id,
    clientId: details.client.id,
    clientName: details.client.name || 'AI client',
    redirectUri: details.redirect_uri,
    projectIds: chosen,
    access: access === 'write' ? 'write' : 'read',
  })
  if (!connection) return { ok: false, error: "Couldn't save this connection. Please try again." }

  const { data, error: approveError } = await supabase.auth.oauth.approveAuthorization(details.authorization_id, {
    skipBrowserRedirect: true,
  })
  if (approveError || !data?.redirect_url) {
    if (approveError) console.error('[mcp.consent.approve]', approveError.message)
    return { ok: false, error: "Couldn't complete the connection. Please try again." }
  }
  return { ok: true, redirectUrl: data.redirect_url }
}

export async function denyConsentAction({ authorizationId }) {
  const supabase = await createClient()
  const user = await getUser(supabase)
  if (!user) return { ok: false, error: 'Sign in to continue.' }

  const { data, error } = await supabase.auth.oauth.denyAuthorization(String(authorizationId || ''), {
    skipBrowserRedirect: true,
  })
  if (error || !data?.redirect_url) {
    if (error) console.error('[mcp.consent.deny]', error.message)
    return { ok: false, error: 'This request has expired.' }
  }
  return { ok: true, redirectUrl: data.redirect_url }
}
