'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { getUser } from '@/supabase/user/getUser'
import { isContentEditor } from '@/lib/studio/access'
import { publishIntent, studioUrl } from '@/lib/studio/form'
import { isValidPageType, PAGE_TYPE_PATH } from '@/lib/pages-studio/skills'
import { resolveProductApp } from '@/lib/pages-studio/products'

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function parseKeywords(value) {
  if (Array.isArray(value)) return value.map((item) => String(item || '').trim()).filter(Boolean)
  return String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

function buildPublicObjectUrl(bucket, objectPath) {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL
  return `${base}/storage/v1/object/public/${bucket}/${objectPath}`
}

function sanitizeObjectPath(pathValue) {
  return String(pathValue || '').trim().replace(/^\/+/, '')
}

function extensionFromFile(file) {
  const pieces = String(file?.name || '').split('.')
  const ext = pieces.length > 1 ? pieces.at(-1) : 'jpg'
  return String(ext || 'jpg').toLowerCase()
}

function toActionErrorMessage(error, fallbackMessage) {
  const message = String(error?.message || '').trim()
  const lower = message.toLowerCase()
  if (lower.includes('row-level security') || lower.includes('rls')) {
    return 'Storage upload blocked by Supabase RLS. Run database/init/storage_policies.sql and keep image_bucket set to "pfp".'
  }
  return message || fallbackMessage
}

// Non-editors land back on /studio/pages, which shows the no-access screen.
async function ensureContentEditor(supabase, user) {
  if (!user) redirect('/login?next=/studio/pages')
  if (!(await isContentEditor(supabase))) redirect('/studio/pages')
}

// Resolve the cover image from an upload, a storage path, a direct URL, or the
// existing value — mirrors the posts studio uploader contract.
async function resolveImageUrl({ supabase, userId, slug, uploadFile, bucket, imagePath, imageUrl, fallbackUrl }) {
  const selectedBucket = String(bucket || 'pfp').trim() || 'pfp'
  const sanitizedImagePath = sanitizeObjectPath(imagePath)
  const sanitizedImageUrl = String(imageUrl || '').trim()

  if (uploadFile && uploadFile.size > 0) {
    const ext = extensionFromFile(uploadFile)
    const objectPath = `${userId}/pages/${slug}/${Date.now()}.${ext}`
    const bytes = Buffer.from(await uploadFile.arrayBuffer())
    const { error: uploadError } = await supabase.storage.from(selectedBucket).upload(objectPath, bytes, {
      cacheControl: '3600',
      contentType: uploadFile.type || 'application/octet-stream',
      upsert: true,
    })
    if (uploadError) throw new Error(uploadError.message)
    return buildPublicObjectUrl(selectedBucket, objectPath)
  }

  if (sanitizedImagePath) return buildPublicObjectUrl(selectedBucket, sanitizedImagePath)
  if (sanitizedImageUrl) return sanitizedImageUrl
  return String(fallbackUrl || '').trim() || null
}

function revalidatePublic(pageType, product, slug) {
  const segment = PAGE_TYPE_PATH[pageType] || 'solutions'
  const productId = resolveProductApp(product)?.id
  revalidatePath(`/${segment}`)
  if (productId) {
    revalidatePath(`/${segment}/${productId}`)
    if (slug) revalidatePath(`/${segment}/${productId}/${slug}`)
  } else if (slug) {
    revalidatePath(`/${segment}/${slug}`)
  }
  revalidatePath('/studio/pages')
}

function authorFields(user) {
  const displayName =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split('@')[0] ||
    'Geiger Author'
  return {
    author_id: user.id,
    author_name: displayName,
    author_avatar: buildPublicObjectUrl('pfp', `${user.id}/latest.jpg`),
  }
}

export async function saveSeoPageAction(formData) {
  const supabase = await createClient()
  const user = await getUser(supabase)
  await ensureContentEditor(supabase, user)

  const pageId = String(formData.get('id') || '').trim()
  const pageType = String(formData.get('page_type') || 'solution').trim()
  const product = String(formData.get('product') || '').trim()
  const title = String(formData.get('title') || '').trim()
  const manualSlug = String(formData.get('slug') || '').trim()
  const normalizedSlug = slugify(manualSlug || title)
  const excerpt = String(formData.get('excerpt') || '').trim()
  const content = String(formData.get('content') || '').trim()
  const heroHeading = String(formData.get('hero_heading') || '').trim()
  const heroSubheading = String(formData.get('hero_subheading') || '').trim()
  const heroCtaText = String(formData.get('hero_cta_text') || '').trim()
  const metaTitle = String(formData.get('meta_title') || '').trim()
  const metaDescription = String(formData.get('meta_description') || '').trim()
  const keywords = parseKeywords(formData.get('keywords'))
  const isPublished = publishIntent(formData)
  const isFeatured = formData.get('is_featured') === 'on'
  const providedPublishedAt = String(formData.get('published_at') || '').trim()
  const publishedAt = isPublished
    ? providedPublishedAt
      ? new Date(providedPublishedAt).toISOString()
      : new Date().toISOString()
    : null

  const validType = isValidPageType(pageType) ? pageType : 'solution'
  const back = (params) => redirect(studioUrl('/studio/pages', { page: pageId || 'new', ...params }))

  if (!title || !content || !normalizedSlug) {
    back({ error: 'missing_required' })
  }

  const uploadFile = formData.get('image_upload')
  let coverImage
  try {
    coverImage = await resolveImageUrl({
      supabase,
      userId: user.id,
      slug: normalizedSlug,
      uploadFile: uploadFile instanceof File ? uploadFile : null,
      bucket: formData.get('image_bucket'),
      imagePath: formData.get('image_path'),
      imageUrl: formData.get('image_url'),
      fallbackUrl: formData.get('existing_image_url'),
    })
  } catch (error) {
    back({ error: toActionErrorMessage(error, 'Unable to process the cover image') })
  }

  const payload = {
    page_type: validType,
    product: product || null,
    title,
    slug: normalizedSlug,
    excerpt: excerpt || metaDescription || title,
    content,
    hero_heading: heroHeading || null,
    hero_subheading: heroSubheading || null,
    hero_cta_text: heroCtaText || null,
    meta_title: metaTitle || null,
    meta_description: metaDescription || null,
    keywords,
    cover_image: coverImage,
    is_published: isPublished,
    is_featured: isFeatured,
    published_at: publishedAt,
    ...authorFields(user),
  }

  const { data: saved, error } = pageId
    ? await supabase.from('dash_seo_pages').update(payload).eq('id', pageId).select('id').single()
    : await supabase.from('dash_seo_pages').insert(payload).select('id').single()
  if (error) {
    if (error.code === '23505' || /duplicate|unique/i.test(error.message)) {
      back({ error: 'That slug is already used for this page type.' })
    }
    back({ error: error.message })
  }

  revalidatePublic(validType, product, normalizedSlug)
  redirect(studioUrl('/studio/pages', { page: saved.id, saved: '1' }))
}

export async function deleteSeoPageAction(pageId) {
  const supabase = await createClient()
  const user = await getUser(supabase)
  await ensureContentEditor(supabase, user)

  const id = String(pageId || '').trim()
  if (!id) return { ok: false, error: 'Missing page id.' }

  const { data, error } = await supabase
    .from('dash_seo_pages')
    .delete()
    .eq('id', id)
    .select('page_type, product, slug')
    .maybeSingle()
  if (error) return { ok: false, error: error.message }

  if (data) revalidatePublic(data.page_type, data.product, data.slug)
  return { ok: true }
}

// Persist an AI-generated page as an unpublished draft, then hand the studio a
// row-shaped record so it opens for review before the author publishes it.
export async function createGeneratedSeoPageAction(input) {
  const supabase = await createClient()
  const user = await getUser(supabase)
  await ensureContentEditor(supabase, user)

  const pageType = isValidPageType(input?.pageType) ? input.pageType : 'solution'
  const title = String(input?.title || '').trim()
  const content = String(input?.content || '').trim()
  if (!title || !content) {
    return { ok: false, error: 'The generated page is missing a title or content.' }
  }

  const normalizedSlug = slugify(String(input?.slug || '').trim() || title)
  const keywords = parseKeywords(input?.keywords)

  const payload = {
    page_type: pageType,
    product: String(input?.product || '').trim() || null,
    title,
    slug: normalizedSlug,
    excerpt: String(input?.excerpt || input?.metaDescription || '').trim() || title,
    content,
    hero_heading: String(input?.heroHeading || '').trim() || null,
    hero_subheading: String(input?.heroSubheading || '').trim() || null,
    hero_cta_text: String(input?.heroCtaText || '').trim() || null,
    meta_title: String(input?.metaTitle || '').trim() || null,
    meta_description: String(input?.metaDescription || '').trim() || null,
    keywords,
    cover_image: String(input?.coverImage || '').trim() || null,
    is_published: false,
    is_featured: false,
    published_at: null,
    ...authorFields(user),
  }

  let { data, error } = await supabase.from('dash_seo_pages').insert(payload).select('*').single()

  // Retry once with a unique suffix if the (type, slug) pair already exists.
  if (error && (error.code === '23505' || /duplicate|unique/i.test(error.message))) {
    payload.slug = `${normalizedSlug}-${Date.now().toString(36).slice(-4)}`
    ;({ data, error } = await supabase.from('dash_seo_pages').insert(payload).select('*').single())
  }

  if (error) return { ok: false, error: error.message }

  revalidatePath('/studio/pages')
  return { ok: true, page: data }
}
