// Data layer for public.mcp_connections and the read side of public.mcp_audit_log.
// Takes the caller's RLS-scoped client. Pure: console.error and return null/false/[], never throws.

const TABLE = 'mcp_connections'

export function normalizeConnection(row) {
  if (!row) return null
  return {
    id: row.id,
    clientId: row.client_id,
    clientName: row.client_name || 'AI client',
    redirectUri: row.redirect_uri || '',
    projectIds: Array.isArray(row.project_ids) ? row.project_ids : [],
    access: row.access === 'write' ? 'write' : 'read',
    createdAt: row.created_at ?? null,
  }
}

// Saves what the user chose on the consent page, replacing any earlier choice for this client.
export async function saveConnection(supabase, { userId, clientId, clientName, redirectUri, projectIds, access }) {
  if (!userId || !clientId) return null
  const { data: existing, error: readError } = await supabase
    .from(TABLE)
    .select('id')
    .eq('user_id', userId)
    .eq('client_id', clientId)
    .is('deleted_at', null)
    .maybeSingle()
  if (readError) {
    console.error('[mcp.saveConnection.read]', readError.message)
    return null
  }

  const fields = {
    client_name: clientName,
    redirect_uri: redirectUri,
    project_ids: projectIds,
    access,
  }
  const query = existing
    ? supabase.from(TABLE).update(fields).eq('id', existing.id)
    : supabase.from(TABLE).insert({ ...fields, user_id: userId, client_id: clientId, created_by: userId })
  const { data, error } = await query.select('*').single()
  if (error) {
    console.error('[mcp.saveConnection]', error.message)
    return null
  }
  return normalizeConnection(data)
}

export async function listConnections(supabase, userId) {
  if (!userId) return []
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('user_id', userId)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
  if (error) {
    console.error('[mcp.listConnections]', error.message)
    return []
  }
  return (data || []).map(normalizeConnection)
}

// Latest tool call per client, from the most recent audit rows.
export async function lastUsedByClient(supabase, userId) {
  if (!userId) return {}
  const { data, error } = await supabase
    .from('mcp_audit_log')
    .select('client_id, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(200)
  if (error) {
    console.error('[mcp.lastUsedByClient]', error.message)
    return {}
  }
  const lastUsed = {}
  for (const row of data || []) {
    if (!lastUsed[row.client_id]) lastUsed[row.client_id] = row.created_at
  }
  return lastUsed
}

// Soft-deletes the connection, which every product checks on each tool call, so access ends immediately.
export async function revokeConnection(supabase, userId, connectionId) {
  if (!userId || !connectionId) return null
  const { data, error } = await supabase
    .from(TABLE)
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', connectionId)
    .eq('user_id', userId)
    .is('deleted_at', null)
    .select('*')
    .maybeSingle()
  if (error) {
    console.error('[mcp.revokeConnection]', error.message)
    return null
  }
  return normalizeConnection(data)
}

// Callback URLs the user saved for apps they added by hand.
export async function listCustomRedirects(supabase, userId) {
  if (!userId) return []
  const { data, error } = await supabase
    .from('mcp_custom_clients')
    .select('redirect_uri')
    .eq('user_id', userId)
    .is('deleted_at', null)
    .not('redirect_uri', 'is', null)
  if (error) {
    console.error('[mcp.listCustomRedirects]', error.message)
    return []
  }
  return (data || []).map((row) => row.redirect_uri)
}

// Projects the user can see through RLS, grouped under their organization's name.
export async function listSelectableProjects(supabase) {
  const { data, error } = await supabase
    .from('projects')
    .select('id, name, organization_id')
    .is('deleted_at', null)
    .order('name', { ascending: true })
  if (error) {
    console.error('[mcp.listSelectableProjects]', error.message)
    return []
  }

  // projects has no foreign key to organizations, so names are looked up separately.
  const organizationIds = [...new Set((data || []).map((row) => row.organization_id).filter(Boolean))]
  const { data: organizations, error: organizationError } = organizationIds.length
    ? await supabase.from('organizations').select('id, name').in('id', organizationIds)
    : { data: [], error: null }
  if (organizationError) console.error('[mcp.listSelectableProjects.organizations]', organizationError.message)
  const nameById = new Map((organizations || []).map((organization) => [organization.id, organization.name]))

  return (data || []).map((row) => ({
    id: row.id,
    name: row.name || 'Untitled project',
    organizationName: nameById.get(row.organization_id) || 'Personal',
  }))
}
