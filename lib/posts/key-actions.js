'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { getUser } from '@/supabase/user/getUser'
import { isContentEditor } from '@/lib/studio/access'
import { generatePostKey, POST_KEY_ACCESS } from './keys.js'

const SCREEN_PATH = '/studio/api-keys'

async function requireEditor() {
  const supabase = await createClient()
  const user = await getUser(supabase)
  if (!user) return { error: 'Sign in to continue.' }
  if (!(await isContentEditor(supabase))) return { error: 'Only content editors can manage API keys.' }
  const admin = createAdminClient()
  if (!admin) return { error: 'The service key is not configured.' }
  return { user, admin }
}

// The plaintext key is returned exactly once.
export async function createPostKeyAction({ name, access }) {
  const { user, admin, error: authError } = await requireEditor()
  if (authError) return { ok: false, error: authError }

  const cleanName = String(name || '').trim().slice(0, 100)
  if (!cleanName) return { ok: false, error: 'Give the key a name.' }
  if (!POST_KEY_ACCESS.includes(access)) return { ok: false, error: 'Choose an access level.' }

  const { key, prefix, hash } = generatePostKey()
  const { data, error } = await admin
    .from('dash_post_api_keys')
    .insert({
      user_id: user.id,
      name: cleanName,
      prefix,
      key_hash: hash,
      access,
      created_by: user.id,
    })
    .select('id,created_at')
    .single()
  if (error) {
    console.error('[posts.createKey]', error.message)
    return { ok: false, error: "Couldn't create the key. Please try again." }
  }

  revalidatePath(SCREEN_PATH)
  return { ok: true, key, record: { id: data.id, name: cleanName, prefix, access, lastUsedAt: null, createdAt: data.created_at } }
}

export async function revokePostKeyAction(id) {
  const { user, admin, error: authError } = await requireEditor()
  if (authError) return { ok: false, error: authError }

  const { error } = await admin
    .from('dash_post_api_keys')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', String(id || ''))
    .eq('user_id', user.id)
  if (error) {
    console.error('[posts.revokeKey]', error.message)
    return { ok: false, error: "Couldn't revoke the key. Please try again." }
  }

  revalidatePath(SCREEN_PATH)
  return { ok: true }
}
