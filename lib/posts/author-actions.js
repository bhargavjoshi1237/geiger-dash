'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'
import { getUser } from '@/supabase/user/getUser'
import { isContentEditor } from '@/lib/studio/access'
import { normalizeAuthorInput } from './authors.js'

const SCREEN_PATH = '/studio/authors'

async function requireEditor() {
  const supabase = await createClient()
  const user = await getUser(supabase)
  if (!user) return { error: 'Sign in to continue.' }
  if (!(await isContentEditor(supabase))) return { error: 'Only content editors can manage authors.' }
  return { user, supabase }
}

// Keeps every post's byline in step with the profile it credits.
async function syncBylines(supabase, author) {
  const { error } = await supabase
    .from('dash_blog_posts')
    .update({ author_name: author.name, author_avatar: author.avatar_url })
    .eq('author_profile_id', author.id)
  if (error) console.error('[authors.syncBylines]', error.message)
}

function refresh(slug) {
  revalidatePath(SCREEN_PATH)
  revalidatePath('/blog')
  revalidatePath('/blog/[slug]', 'page')
  if (slug) revalidatePath(`/blog/authors/${slug}`)
}

export async function saveAuthorAction(input) {
  const { user, supabase, error: authError } = await requireEditor()
  if (authError) return { ok: false, error: authError }

  const checked = normalizeAuthorInput(input)
  if (!checked.ok) return checked

  const { data, error } = input?.id
    ? await supabase.from('dash_blog_authors').update(checked.values).eq('id', input.id).select('*').single()
    : await supabase.from('dash_blog_authors').insert({ ...checked.values, created_by: user.id }).select('*').single()
  if (error) {
    if (error.code === '23505') return { ok: false, error: 'Another author already uses this URL.' }
    console.error('[authors.save]', error.message)
    return { ok: false, error: "Couldn't save the author. Please try again." }
  }

  await syncBylines(supabase, data)
  refresh(data.slug)
  return { ok: true, author: data }
}

// Posts keep their byline text and lose only the link to the profile.
export async function deleteAuthorAction(id) {
  const { supabase, error: authError } = await requireEditor()
  if (authError) return { ok: false, error: authError }

  const { error: unlinkError } = await supabase.from('dash_blog_posts').update({ author_profile_id: null }).eq('author_profile_id', id)
  const { data, error } = unlinkError
    ? { data: null, error: unlinkError }
    : await supabase.from('dash_blog_authors').update({ deleted_at: new Date().toISOString() }).eq('id', id).select('slug').single()
  if (error) {
    console.error('[authors.delete]', error.message)
    return { ok: false, error: "Couldn't remove the author. Please try again." }
  }

  refresh(data.slug)
  return { ok: true }
}
