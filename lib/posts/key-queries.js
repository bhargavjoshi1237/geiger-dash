import { createAdminClient } from '@/utils/supabase/admin'

// Only ever returns the signed-in editor's own keys, and never the hash.
export async function listPostKeys(userId) {
  const admin = createAdminClient()
  if (!admin) return []
  const { data, error } = await admin
    .from('dash_post_api_keys')
    .select('id,name,prefix,access,last_used_at,created_at')
    .eq('user_id', userId)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
  if (error) {
    console.error('[posts.listKeys]', error.message)
    return []
  }
  return data.map((row) => ({
    id: row.id,
    name: row.name,
    prefix: row.prefix,
    access: row.access,
    lastUsedAt: row.last_used_at,
    createdAt: row.created_at,
  }))
}
