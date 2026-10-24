// Organization join requests: joining by ID or slug files a request that an owner approves.
// Every read and write goes through SECURITY DEFINER RPCs (migration 20261024200000_organization_join_requests),
// because RLS hides an organization from people who aren't in it yet. Server-only: actions and pages import this.
import { notifyJoinRequested } from '@/lib/notifications/send'

const MESSAGE_LIMIT = 500

function cleanText(value) {
  return String(value || '').trim()
}

// Files (or reuses) the caller's pending request. status is 'pending', or 'member' when they're already in.
export async function requestToJoin(supabase, user, { query, message }) {
  const term = cleanText(query)
  if (!term) return { ok: false, error: 'Enter an organization ID or workspace URL.' }
  const note = cleanText(message).slice(0, MESSAGE_LIMIT)

  const { data, error } = await supabase.rpc('request_to_join_organization', { q: term, p_message: note || null })
  if (error) return { ok: false, error: error.message }
  const row = Array.isArray(data) ? data[0] : data
  if (!row) return { ok: false, error: 'No organization found for that ID or URL.' }

  if (row.status === 'pending') {
    notifyJoinRequested({ user, organizationId: row.id, orgName: row.name, requestId: row.request_id, message: note })
  }
  return {
    ok: true,
    status: row.status,
    organization: { id: row.id, name: row.name || '' },
  }
}

// The signed-in user's pending requests, newest first; [] on any failure so pages still render.
export async function getMyPendingJoinRequests(supabase) {
  const { data, error } = await supabase.rpc('my_pending_join_requests')
  if (error) {
    console.error('[org.join_requests.mine]', error.message)
    return []
  }
  return (data || []).map((r) => ({
    id: r.id,
    organizationId: r.organization_id,
    orgName: r.org_name || '',
    createdAt: r.created_at,
  }))
}

// An organization's pending requests with each requester's identity; [] for anyone who can't decide them.
export async function listPendingJoinRequests(supabase, organizationId) {
  const { data, error } = await supabase.rpc('pending_join_requests', { p_org: organizationId })
  if (error) return []
  return (data || []).map((r) => ({
    id: r.id,
    userId: r.user_id,
    email: r.email || '',
    name: r.name || '',
    avatarUrl: r.avatar_url || '',
    message: r.message || '',
    createdAt: r.created_at,
  }))
}
