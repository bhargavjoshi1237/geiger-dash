'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { getUser } from '@/supabase/user/getUser'

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

function sanitizeRelativeFolder(pathValue) {
  return String(pathValue || '')
    .split('/')
    .map((part) => slugify(part))
    .filter(Boolean)
    .join('/')
}

function sanitizeFileName(value) {
  return String(value || 'image')
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9.]+/g, '-')
    .replace(/^-+|-+$/g, '')
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

async function listStorageFolder(supabase, bucket, prefix) {
  const { data, error } = await supabase.storage.from(bucket).list(prefix, {
    limit: 100,
    offset: 0,
    sortBy: { column: 'updated_at', order: 'desc' },
  })

  if (error) {
    throw new Error(error.message)
  }

  return (data || []).reduce(
    (acc, entry) => {
      const objectPath = `${prefix}/${entry.name}`.replace(/^\/+/, '')

      if (!entry.id) {
        acc.folders.push({
          name: entry.name,
          path: objectPath,
          updatedAt: entry.updated_at || entry.created_at || '',
        })
        return acc
      }

      if (entry.name === '.keep') {
        return acc
      }

      acc.media.push({
        bucket,
        path: objectPath,
        name: entry.name,
        size: entry.metadata?.size || 0,
        mimeType: entry.metadata?.mimetype || entry.metadata?.mimeType || '',
        updatedAt: entry.updated_at || entry.created_at || '',
        publicUrl: buildPublicObjectUrl(bucket, objectPath),
      })
      return acc
    },
    { folders: [], media: [] }
  )
}

export async function listStudioMediaAction(contentType = 'blog', folderPath = '') {
  const supabase = await createClient()
  const user = await getUser(supabase)
  ensureAuthUser(user)

  const bucket = 'pfp'
  const selectedType = ['blog', 'changelog'].includes(contentType) ? contentType : 'blog'
  const selectedFolder = sanitizeRelativeFolder(folderPath)
  const rootPath = `${user.id}/${selectedType}`
  const currentPath = selectedFolder ? `${rootPath}/${selectedFolder}` : rootPath

  try {
    const result = await listStorageFolder(supabase, bucket, currentPath)
    return { ok: true, currentFolder: selectedFolder, rootPath, ...result }
  } catch (error) {
    return {
      ok: false,
      error: toActionErrorMessage(error, 'Unable to load media library'),
      currentFolder: selectedFolder,
      folders: [],
      media: [],
    }
  }
}

export async function createStudioMediaFolderAction(formData) {
  const supabase = await createClient()
  const user = await getUser(supabase)
  ensureAuthUser(user)

  const contentType = String(formData.get('content_type') || 'blog')
  const selectedType = ['blog', 'changelog'].includes(contentType) ? contentType : 'blog'
  const parentFolder = sanitizeRelativeFolder(formData.get('parent_folder'))
  const folderName = slugify(formData.get('folder_name'))

  if (!folderName) {
    return { ok: false, error: 'Enter a folder name.' }
  }

  const bucket = 'pfp'
  const relativeFolder = parentFolder ? `${parentFolder}/${folderName}` : folderName
  const objectPath = `${user.id}/${selectedType}/${relativeFolder}/.keep`

  try {
    const { error } = await supabase.storage.from(bucket).upload(objectPath, Buffer.from(''), {
      cacheControl: '3600',
      contentType: 'text/plain',
      upsert: true,
    })

    if (error) {
      throw new Error(error.message)
    }

    revalidatePath('/studio/posts')
    return {
      ok: true,
      folder: {
        name: folderName,
        path: `${user.id}/${selectedType}/${relativeFolder}`,
        updatedAt: new Date().toISOString(),
      },
    }
  } catch (error) {
    return { ok: false, error: toActionErrorMessage(error, 'Unable to create folder') }
  }
}

export async function uploadStudioMediaAction(formData) {
  const supabase = await createClient()
  const user = await getUser(supabase)
  ensureAuthUser(user)

  const uploadFile = formData.get('media_upload')
  const contentType = String(formData.get('content_type') || 'blog')
  const selectedType = ['blog', 'changelog'].includes(contentType) ? contentType : 'blog'
  const selectedFolder = sanitizeRelativeFolder(formData.get('folder')) || 'library'

  if (!(uploadFile instanceof File) || uploadFile.size <= 0) {
    return { ok: false, error: 'Choose an image before uploading.' }
  }

  const bucket = 'pfp'
  const ext = extensionFromFile(uploadFile)
  const safeName = sanitizeFileName(uploadFile.name).replace(/\.[^.]+$/, '') || 'image'
  const objectPath = `${user.id}/${selectedType}/${selectedFolder}/${Date.now()}-${safeName}.${ext}`

  try {
    const bytes = Buffer.from(await uploadFile.arrayBuffer())
    const { error } = await supabase.storage.from(bucket).upload(objectPath, bytes, {
      cacheControl: '3600',
      contentType: uploadFile.type || 'application/octet-stream',
      upsert: false,
    })

    if (error) {
      throw new Error(error.message)
    }

    const media = {
      bucket,
      path: objectPath,
      name: uploadFile.name,
      size: uploadFile.size,
      mimeType: uploadFile.type,
      updatedAt: new Date().toISOString(),
      publicUrl: buildPublicObjectUrl(bucket, objectPath),
    }

    revalidatePath('/studio/posts')
    return { ok: true, media }
  } catch (error) {
    return { ok: false, error: toActionErrorMessage(error, 'Unable to upload media') }
  }
}

export async function deleteBlogPostAction(postId) {
  const supabase = await createClient()
  const user = await getUser(supabase)
  ensureAuthUser(user)

  const id = String(postId || '').trim()
  if (!id) return { ok: false, error: 'Missing blog post id.' }

  const { error } = await supabase.from('dash_blog_posts').delete().eq('id', id)
  if (error) return { ok: false, error: error.message }

  revalidatePath('/blog')
  revalidatePath('/studio/posts')
  return { ok: true }
}

export async function deleteChangelogAction(changelogId) {
  const supabase = await createClient()
  const user = await getUser(supabase)
  ensureAuthUser(user)

  const id = String(changelogId || '').trim()
  if (!id) return { ok: false, error: 'Missing release id.' }

  const { error } = await supabase.from('dash_changelog').delete().eq('id', id)
  if (error) return { ok: false, error: error.message }

  revalidatePath('/changelog')
  revalidatePath(`/changelog/${id}`)
  revalidatePath('/studio/posts')
  return { ok: true }
}

export async function saveBlogPostAction(formData) {
  const supabase = await createClient()
  const user = await getUser(supabase)
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
  const user = await getUser(supabase)
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
  revalidatePath(`/changelog/${changelogId}`)
  revalidatePath('/studio/posts')
  redirect('/studio/posts?tab=changelog&saved=1')
}
