import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { getUser } from '@/supabase/user/getUser'

// Studio is limited to the public.content_editors allowlist; RLS enforces the same rule on every content write.
export async function isContentEditor(supabase) {
  const { data, error } = await supabase.rpc('is_content_editor')
  if (error) {
    console.error('[studio.isContentEditor]', error.message)
    return false
  }
  return data === true
}

// Route-handler guard: `{ response }` (401/403) unless the caller is a content editor, else `{ supabase, user }`.
export async function requireContentEditorApi() {
  const supabase = await createClient()
  const user = await getUser(supabase)
  if (!user) return { response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  if (!(await isContentEditor(supabase))) {
    return { response: NextResponse.json({ error: 'Only content editors can use Studio.' }, { status: 403 }) }
  }
  return { supabase, user }
}
