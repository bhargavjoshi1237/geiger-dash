import { revalidatePath, revalidateTag } from 'next/cache'
import { createAdminClient } from '@/utils/supabase/admin'
import { hashPostKey, POST_KEY_PREFIX } from './keys.js'

// Calls allowed per key in a rolling minute.
const RATE_LIMIT_PER_MINUTE = 60

// Keys aren't Supabase sessions, so RLS can't apply: verifyPostKey and runOperation are what limit these calls.
function db() {
  const client = createAdminClient()
  if (!client) throw new Error('SUPABASE_SERVICE_ROLE_KEY is not configured')
  return client
}

// Returns the key only while it is active and its owner is still a content editor.
export async function verifyPostKey(rawKey) {
  if (!rawKey?.startsWith(POST_KEY_PREFIX)) return null
  const client = db()
  const { data: key, error } = await client
    .from('dash_post_api_keys')
    .select('id,name,user_id,access')
    .eq('key_hash', hashPostKey(rawKey))
    .is('deleted_at', null)
    .maybeSingle()
  if (error) {
    console.error('[posts.verifyKey]', error.message)
    return null
  }
  if (!key) return null

  const { data: editor, error: editorError } = await client
    .from('content_editors')
    .select('user_id')
    .eq('user_id', key.user_id)
    .maybeSingle()
  if (editorError) console.error('[posts.verifyKey]', editorError.message)
  if (!editor) return null

  const { error: touchError } = await client
    .from('dash_post_api_keys')
    .update({ last_used_at: new Date().toISOString() })
    .eq('id', key.id)
  if (touchError) console.error('[posts.verifyKey]', touchError.message)

  return { id: key.id, name: key.name, userId: key.user_id, access: key.access }
}

async function isRateLimited(key) {
  const since = new Date(Date.now() - 60_000).toISOString()
  const { count, error } = await db()
    .from('mcp_audit_log')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', key.userId)
    .eq('client_id', key.id)
    .gte('created_at', since)
  if (error) throw new Error(`isRateLimited: ${error.message}`)
  return (count || 0) >= RATE_LIMIT_PER_MINUTE
}

async function writeAudit(entry) {
  const { error } = await db().from('mcp_audit_log').insert(entry)
  if (error) throw new Error(`writeAudit: ${error.message}`)
}

async function loadAuthor(client, userId) {
  const { data, error } = await client.auth.admin.getUserById(userId)
  if (error) console.error('[posts.loadAuthor]', error.message)
  const user = data?.user
  return {
    name: user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'Geiger Author',
    avatar: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/pfp/${userId}/latest.jpg`,
  }
}

// A cache refresh that fails shouldn't report a saved post as failed.
function revalidate(slug) {
  try {
    revalidatePath('/blog')
    revalidatePath('/studio/posts')
    if (slug) revalidatePath(`/blog/${slug}`)
    revalidateTag('blog-posts', 'max')
  } catch (error) {
    console.error('[posts.revalidate]', error)
  }
}

export const defaultDeps = { db, isRateLimited, writeAudit, loadAuthor, revalidate }
