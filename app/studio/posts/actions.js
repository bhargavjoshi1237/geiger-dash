'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function splitLines(value) {
  return String(value || '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}

function parseTags(value) {
  return String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

function isMissingColumnError(error, columnName) {
  if (!error) return false
  const text = `${error.message || ''} ${error.details || ''} ${error.hint || ''}`.toLowerCase()
  return text.includes(columnName.toLowerCase()) && text.includes('column')
}

function extensionFromFile(file) {
  const base = String(file?.name || '')
  const pieces = base.split('.')
  const ext = pieces.length > 1 ? pieces.at(-1) : 'jpg'
  return String(ext || 'jpg').toLowerCase()
}

function buildPublicObjectUrl(bucket, objectPath) {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL
  return `${base}/storage/v1/object/public/${bucket}/${objectPath}`
}

function sanitizeObjectPath(pathValue) {
  return String(pathValue || '').trim().replace(/^\/+/, '')
}

function toActionErrorMessage(error, fallbackMessage) {
  const message = String(error?.message || '').trim()
  const lower = message.toLowerCase()

  if (lower.includes('row-level security') || lower.includes('rls')) {
    return 'Storage upload blocked by Supabase RLS. Run database/init/storage_policies.sql and keep image_bucket set to "pfp".'
  }

  return message || fallbackMessage
}

async function resolveImageUrl({
  supabase,
  userId,
  contentType,
  slug,
  uploadFile,
  bucket,
  imagePath,
  imageUrl,
  fallbackUrl,
}) {
  const selectedBucket = String(bucket || 'pfp').trim() || 'pfp'
  const sanitizedImagePath = sanitizeObjectPath(imagePath)
  const sanitizedImageUrl = String(imageUrl || '').trim()

  if (uploadFile && uploadFile.size > 0) {
    const ext = extensionFromFile(uploadFile)
    const objectPath = `${userId}/${contentType}/${slug}/latest.${ext}`
    const bytes = Buffer.from(await uploadFile.arrayBuffer())
    const { error: uploadError } = await supabase.storage
      .from(selectedBucket)
      .upload(objectPath, bytes, {
        cacheControl: '3600',
        contentType: uploadFile.type || 'application/octet-stream',
        upsert: true,
      })

    if (uploadError) {
      throw new Error(uploadError.message)
    }

    return buildPublicObjectUrl(selectedBucket, objectPath)
  }

  if (sanitizedImagePath) {
    return buildPublicObjectUrl(selectedBucket, sanitizedImagePath)
  }

  if (sanitizedImageUrl) {
    return sanitizedImageUrl
  }

  return String(fallbackUrl || '').trim() || null
}

function ensureAuthUser(user) {
  if (!user) {
    redirect('/login')
  }
}

export async function saveBlogPostAction(formData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  ensureAuthUser(user)

  const postId = String(formData.get('id') || '').trim()
  const title = String(formData.get('title') || '').trim()
  const excerpt = String(formData.get('excerpt') || '').trim()
  const content = String(formData.get('content') || '').trim()
  const category = String(formData.get('category') || '').trim()
  const manualSlug = String(formData.get('slug') || '').trim()
  const normalizedSlug = slugify(manualSlug || title)
  const tags = parseTags(formData.get('tags'))
  const readingMinutes = Number(formData.get('reading_time_minutes') || 5)
  const isPublished = formData.get('is_published') === 'on'
  const isFeatured = formData.get('is_featured') === 'on'
  const providedPublishedAt = String(formData.get('published_at') || '').trim()
  const publishedAt = isPublished
    ? (providedPublishedAt ? new Date(providedPublishedAt).toISOString() : new Date().toISOString())
    : null

  if (!title || !excerpt || !content || !category || !normalizedSlug) {
    redirect('/studio/posts?tab=blog&error=missing_required')
  }

  const uploadFile = formData.get('image_upload')
  let featuredImage
  try {
    featuredImage = await resolveImageUrl({
      supabase,
      userId: user.id,
      contentType: 'blog',
      slug: normalizedSlug,
      uploadFile: uploadFile instanceof File ? uploadFile : null,
      bucket: formData.get('image_bucket'),
      imagePath: formData.get('image_path'),
      imageUrl: formData.get('image_url'),
      fallbackUrl: formData.get('existing_image_url'),
    })
  } catch (error) {
    const message = toActionErrorMessage(error, 'Unable to process blog image')
    redirect(`/studio/posts?tab=blog&error=${encodeURIComponent(message)}`)
  }

  const displayName =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split('@')[0] ||
    'Geiger Author'
  const authorAvatar = buildPublicObjectUrl('pfp', `${user.id}/latest.jpg`)

  const payload = {
    title,
    slug: normalizedSlug,
    excerpt,
    content,
    category,
    tags,
    author_id: user.id,
    author_name: displayName,
    author_avatar: authorAvatar,
    featured_image: featuredImage,
    is_published: isPublished,
    is_featured: isFeatured,
    published_at: publishedAt,
    reading_time_minutes: Number.isFinite(readingMinutes) ? readingMinutes : 5,
  }

  let query
  if (postId) {
    query = supabase.from('dash_blog_posts').update(payload).eq('id', postId)
  } else {
    query = supabase.from('dash_blog_posts').insert(payload)
  }

  const { error } = await query
  if (error) {
    redirect(`/studio/posts?tab=blog&error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/blog')
  revalidatePath('/studio/posts')
  redirect('/studio/posts?tab=blog&saved=1')
}

function buildChangelogItems(formData) {
  const added = splitLines(formData.get('items_added')).map((description) => ({ type: 'added', description }))
  const changed = splitLines(formData.get('items_changed')).map((description) => ({ type: 'changed', description }))
  const fixed = splitLines(formData.get('items_fixed')).map((description) => ({ type: 'fixed', description }))
  const removed = splitLines(formData.get('items_removed')).map((description) => ({ type: 'removed', description }))
  const deprecated = splitLines(formData.get('items_deprecated')).map((description) => ({ type: 'deprecated', description }))

  return [...added, ...changed, ...fixed, ...removed, ...deprecated]
}

async function upsertChangelogRecord(supabase, recordId, payload) {
  if (recordId) {
    let { error } = await supabase.from('dash_changelog').update(payload).eq('id', recordId)
    if (error && isMissingColumnError(error, 'image_url')) {
      const { image_url, ...withoutImage } = payload
      ;({ error } = await supabase.from('dash_changelog').update(withoutImage).eq('id', recordId))
    }
    return { id: recordId, error }
  }

  let insert = await supabase.from('dash_changelog').insert(payload).select('id').single()
  if (insert.error && isMissingColumnError(insert.error, 'image_url')) {
    const { image_url, ...withoutImage } = payload
    insert = await supabase.from('dash_changelog').insert(withoutImage).select('id').single()
  }
  return { id: insert.data?.id, error: insert.error }
}

export async function saveChangelogAction(formData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  ensureAuthUser(user)

  const recordId = String(formData.get('id') || '').trim()
  const version = String(formData.get('version') || '').trim()
  const title = String(formData.get('title') || '').trim()
  const description = String(formData.get('description') || '').trim()
  const category = String(formData.get('category') || '').trim()
  const product = String(formData.get('product') || '').trim()
  const releaseDateInput = String(formData.get('release_date') || '').trim()
  const releaseDate = releaseDateInput ? new Date(releaseDateInput).toISOString() : new Date().toISOString()
  const isFeatured = formData.get('is_featured') === 'on'

  if (!version || !title || !description || !category || !product) {
    redirect('/studio/posts?tab=changelog&error=missing_required')
  }

  const uploadFile = formData.get('image_upload')
  const normalizedSlug = slugify(`${version}-${title}`)
  let imageUrl
  try {
    imageUrl = await resolveImageUrl({
      supabase,
      userId: user.id,
      contentType: 'changelog',
      slug: normalizedSlug,
      uploadFile: uploadFile instanceof File ? uploadFile : null,
      bucket: formData.get('image_bucket'),
      imagePath: formData.get('image_path'),
      imageUrl: formData.get('image_url'),
      fallbackUrl: formData.get('existing_image_url'),
    })
  } catch (error) {
    const message = toActionErrorMessage(error, 'Unable to process changelog image')
    redirect(`/studio/posts?tab=changelog&error=${encodeURIComponent(message)}`)
  }

  const payload = {
    version,
    title,
    description,
    category,
    product,
    release_date: releaseDate,
    is_featured: isFeatured,
    image_url: imageUrl,
  }

  const upsertResult = await upsertChangelogRecord(supabase, recordId, payload)
  if (upsertResult.error || !upsertResult.id) {
    const message = upsertResult.error?.message || 'Unable to save changelog'
    redirect(`/studio/posts?tab=changelog&error=${encodeURIComponent(message)}`)
  }

  const changelogId = upsertResult.id
  const items = buildChangelogItems(formData)

  const { error: deleteError } = await supabase
    .from('dash_changelog_items')
    .delete()
    .eq('changelog_id', changelogId)
  if (deleteError) {
    redirect(`/studio/posts?tab=changelog&error=${encodeURIComponent(deleteError.message)}`)
  }

  if (items.length > 0) {
    const payloadItems = items.map((item) => ({
      changelog_id: changelogId,
      type: item.type,
      description: item.description,
    }))
    const { error: insertItemsError } = await supabase.from('dash_changelog_items').insert(payloadItems)
    if (insertItemsError) {
      redirect(`/studio/posts?tab=changelog&error=${encodeURIComponent(insertItemsError.message)}`)
    }
  }

  revalidatePath('/changelog')
  revalidatePath('/studio/posts')
  redirect('/studio/posts?tab=changelog&saved=1')
}
