'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'
import { isContentEditor } from '@/lib/studio/access'
import { HELP_HOME_SLUG } from '@/lib/docs/paths'
import { normalizeHelpSlug, slugify } from '@/lib/docs/text'
import { getHelpShowcase } from '@/lib/docs/showcases'

const PAGE_STATUSES = ['draft', 'published', 'archived']
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const NOT_AN_EDITOR = 'Only content editors can make changes.'

// RLS is the real gate; this check turns its silent zero-row updates into a clear error.
async function editorClient() {
  const supabase = await createClient()
  return (await isContentEditor(supabase)) ? supabase : null
}

function friendlyError(error, fallback) {
  if (error?.code === '23505') return 'That slug is already used by another page.'
  if (error?.code === '42501') return NOT_AN_EDITOR
  return error?.message || fallback
}

// Keeps only the known fields and drops rows with nothing but an icon.
function cleanItems(items, fields) {
  return (Array.isArray(items) ? items : [])
    .map((item) => Object.fromEntries(['icon', ...fields].map((field) => [field, String(item?.[field] || '').trim()])))
    .filter((item) => fields.some((field) => item[field]))
}

function cleanSections(sections) {
  const anchors = new Set()
  return (Array.isArray(sections) ? sections : []).map((section, index) => {
    const title = String(section?.title || '').trim()
    const base = slugify(section?.anchorId || title) || `section-${index + 1}`
    let anchor = base
    for (let n = 2; anchors.has(anchor); n += 1) anchor = `${base}-${n}`
    anchors.add(anchor)

    const content = String(section?.content || '').trim()
    return {
      id: UUID.test(String(section?.id || '')) ? section.id : '',
      anchor_id: anchor,
      eyebrow: String(section?.eyebrow || '').trim(),
      title,
      content: content === '<p></p>' ? '' : content,
      cards: cleanItems(section?.cards, ['title', 'body', 'href']),
      features: cleanItems(section?.features, ['text']),
      links: cleanItems(section?.links, ['label', 'href']),
      showcase: getHelpShowcase(section?.showcase)?.id || '',
    }
  })
}

// One level of nesting: the parent is top-level in the same group, and a page with children can't be nested.
async function checkParent(supabase, { id, parentId, navGroupId }) {
  if (!parentId) return ''
  if (!UUID.test(parentId) || parentId === id) return 'Choose a different parent page.'

  const { data: parent } = await supabase
    .from('docs_pages')
    .select('parent_id,nav_group_id')
    .eq('id', parentId)
    .is('deleted_at', null)
    .maybeSingle()
  if (!parent || parent.parent_id) return 'A parent page must be a top-level page.'
  if (parent.nav_group_id !== navGroupId) return 'A parent page must be in the same sidebar group.'

  const { count } = await supabase
    .from('docs_pages')
    .select('id', { count: 'exact', head: true })
    .eq('parent_id', id)
    .is('deleted_at', null)
  return count ? "This page has child pages, so it can't be nested itself." : ''
}

function revalidateHelp() {
  revalidatePath('/help', 'layout')
}

export async function saveHelpPageAction(input) {
  const supabase = await editorClient()
  if (!supabase) return { ok: false, error: NOT_AN_EDITOR }

  const id = String(input?.id || '')
  const title = String(input?.title || '').trim()
  const navGroupId = String(input?.navGroupId || '')
  const parentId = String(input?.parentId || '')
  let slug = normalizeHelpSlug(input?.slug || title)

  if (!UUID.test(id)) return { ok: false, error: 'Invalid page.' }
  if (!title) return { ok: false, error: 'Add a page title.' }
  if (!slug) return { ok: false, error: 'Add a slug.' }
  if (!UUID.test(navGroupId)) return { ok: false, error: 'Choose a sidebar group.' }

  // The home page is what /help renders, so its slug can't change.
  const { data: existing } = await supabase.from('docs_pages').select('slug').eq('id', id).maybeSingle()
  if (existing?.slug === HELP_HOME_SLUG) slug = HELP_HOME_SLUG

  const parentError = await checkParent(supabase, { id, parentId, navGroupId })
  if (parentError) return { ok: false, error: parentError }

  const { data, error } = await supabase.rpc('docs_save_page', {
    p_page: {
      id,
      nav_group_id: navGroupId,
      parent_id: parentId,
      slug,
      title,
      nav_label: String(input?.navLabel || '').trim(),
      description: String(input?.description || '').trim(),
      status: PAGE_STATUSES.includes(input?.status) ? input.status : 'draft',
      sort_order: Number.parseInt(input?.sortOrder, 10) || 0,
    },
    p_sections: cleanSections(input?.sections),
  })
  if (error) {
    console.error('[help.savePage]', error.message)
    return { ok: false, error: friendlyError(error, 'Could not save the page.') }
  }

  revalidateHelp()
  return { ok: true, id: data, slug }
}

// Soft delete; child pages move up a level instead of vanishing with their parent.
export async function deleteHelpPageAction(id) {
  const supabase = await editorClient()
  if (!supabase) return { ok: false, error: NOT_AN_EDITOR }
  if (!UUID.test(String(id || ''))) return { ok: false, error: 'Invalid page.' }

  const { data: page } = await supabase.from('docs_pages').select('slug').eq('id', id).maybeSingle()
  if (page?.slug === HELP_HOME_SLUG) return { ok: false, error: "The home page can't be deleted." }

  const { error: detachError } = await supabase.from('docs_pages').update({ parent_id: null }).eq('parent_id', id)
  if (detachError) {
    console.error('[help.deletePage]', detachError.message)
    return { ok: false, error: friendlyError(detachError, 'Could not delete the page.') }
  }

  const { error } = await supabase.from('docs_pages').update({ deleted_at: new Date().toISOString() }).eq('id', id)
  if (error) {
    console.error('[help.deletePage]', error.message)
    return { ok: false, error: friendlyError(error, 'Could not delete the page.') }
  }

  revalidateHelp()
  return { ok: true }
}

export async function saveHelpGroupAction(input) {
  const supabase = await editorClient()
  if (!supabase) return { ok: false, error: NOT_AN_EDITOR }

  const title = String(input?.title || '').trim()
  const slug = slugify(input?.slug || title)
  if (!title) return { ok: false, error: 'Add a group title.' }
  if (!slug) return { ok: false, error: 'Add a group slug.' }
  if (input?.id && !UUID.test(input.id)) return { ok: false, error: 'Invalid group.' }

  const payload = { title, slug, sort_order: Number.parseInt(input?.sortOrder, 10) || 0 }
  const query = input?.id
    ? supabase.from('docs_nav_groups').update(payload).eq('id', input.id)
    : supabase.from('docs_nav_groups').insert(payload)
  const { data, error } = await query.select('id').single()
  if (error) {
    console.error('[help.saveGroup]', error.message)
    const message = error.code === '23505' ? 'Another group already uses that slug.' : friendlyError(error, 'Could not save the group.')
    return { ok: false, error: message }
  }

  revalidateHelp()
  return { ok: true, id: data.id }
}

// Groups have no soft delete, so only an empty group can go (its soft-deleted pages go with it).
export async function deleteHelpGroupAction(id) {
  const supabase = await editorClient()
  if (!supabase) return { ok: false, error: NOT_AN_EDITOR }
  if (!UUID.test(String(id || ''))) return { ok: false, error: 'Invalid group.' }

  const { count, error: countError } = await supabase
    .from('docs_pages')
    .select('id', { count: 'exact', head: true })
    .eq('nav_group_id', id)
    .is('deleted_at', null)
  if (countError) return { ok: false, error: friendlyError(countError, 'Could not delete the group.') }
  if (count) return { ok: false, error: 'Move or delete the pages in this group first.' }

  const { error } = await supabase.from('docs_nav_groups').delete().eq('id', id)
  if (error) {
    console.error('[help.deleteGroup]', error.message)
    return { ok: false, error: friendlyError(error, 'Could not delete the group.') }
  }

  revalidateHelp()
  return { ok: true }
}
