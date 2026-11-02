// Every action on a post. The REST routes and the MCP tools both run these through runOperation.
import { z } from 'zod'
import { PostsError } from './errors.js'
import { hasAccess } from './keys.js'
import { readingTimeMinutes, sanitizePostContent, slugify } from './content.js'

const TABLE = 'dash_blog_posts'
const AUTHORS_TABLE = 'dash_blog_authors'
const SUMMARY_COLUMNS =
  'id,title,slug,excerpt,category,tags,featured_image,is_published,is_featured,published_at,reading_time_minutes,author_name,author_profile_id,created_at,updated_at'
const FULL_COLUMNS = `${SUMMARY_COLUMNS},content`

// These fields reach a JSON-LD script tag on the public page, where a closing tag would break out of it.
const plainText = (max) =>
  z
    .string()
    .trim()
    .min(1)
    .max(max)
    .refine((value) => !/[<>]/.test(value), 'Must be plain text, without < or >.')

// z.guid because seeded posts have hand-written ids that z.uuid's version check can refuse.
const postId = z.guid().describe('The post id.')

const postFields = {
  title: plainText(200),
  excerpt: plainText(1000).describe('One or two sentences shown on the blog list and in search results.'),
  content: z
    .string()
    .trim()
    .min(1)
    .max(500_000)
    .describe('The body as an HTML fragment: h2, h3, p, ul, ol, li, a, img, strong, em, blockquote, code, table. Other tags are removed. Do not repeat the title as an h1.'),
  category: z.string().trim().min(1).max(100).describe('A category name exactly as list_categories returns it.'),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers and hyphens.')
    .max(180)
    .describe('URL path after /blog/. Made from the title when left out.'),
  tags: z.array(plainText(50)).max(20),
  featuredImage: z
    .url({ protocol: /^https$/ })
    .max(2000)
    .transform((value) => new URL(value).href)
    .describe('HTTPS URL of the cover image.'),
  authorSlug: z.string().trim().min(1).max(180).describe('Credit an author profile, by a slug from list_authors. New posts otherwise use the key owner.'),
}

function serialize(row) {
  const post = {
    id: row.id,
    title: row.title,
    slug: row.slug,
    url: `/blog/${row.slug}`,
    excerpt: row.excerpt,
    category: row.category,
    tags: row.tags || [],
    featuredImage: row.featured_image,
    status: row.is_published ? 'published' : 'draft',
    isFeatured: row.is_featured,
    publishedAt: row.published_at,
    readingTimeMinutes: row.reading_time_minutes,
    authorName: row.author_name,
    authorProfileId: row.author_profile_id ?? null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
  if (row.content !== undefined) post.content = row.content
  return post
}

function unwrap({ data, error }, label) {
  if (error) throw new Error(`${label}: ${error.message}`)
  return data
}

async function loadPost(db, id) {
  const row = unwrap(await db.from(TABLE).select(FULL_COLUMNS).eq('id', id).maybeSingle(), 'loadPost')
  if (!row) throw new PostsError('not_found', 'Post not found.')
  return row
}

async function assertCategory(db, name) {
  const rows = unwrap(await db.from('dash_blog_categories').select('name').order('name'), 'assertCategory')
  const names = rows.map((row) => row.name)
  if (!names.includes(name)) {
    throw new PostsError('invalid_input', `Unknown category "${name}". Use one of: ${names.join(', ')}.`)
  }
}

// The byline columns for a post credited to this author profile.
async function authorColumns(db, slug) {
  const author = unwrap(
    await db.from(AUTHORS_TABLE).select('id,name,avatar_url').eq('slug', slug).is('deleted_at', null).maybeSingle(),
    'authorColumns',
  )
  if (!author) throw new PostsError('invalid_input', `Unknown author "${slug}". Use a slug from list_authors.`)
  return { author_profile_id: author.id, author_name: author.name, author_avatar: author.avatar_url }
}

function cleanContent(content) {
  const clean = sanitizePostContent(content)
  if (!clean) throw new PostsError('invalid_input', 'The content is empty once unsupported HTML is removed.')
  return clean
}

function writeError(error, slug, label) {
  if (error?.code === '23505') {
    return new PostsError('conflict', `A post already uses the slug "${slug}". Choose another slug.`)
  }
  return new Error(`${label}: ${error?.message}`)
}

async function setPublished(db, id, values) {
  const row = unwrap(await db.from(TABLE).update(values).eq('id', id).select(FULL_COLUMNS).single(), 'setPublished')
  return serialize(row)
}

export const OPERATIONS = [
  {
    name: 'list_posts',
    title: 'List posts',
    description: 'List blog posts, newest edits first, without their content. Use get_post to read one in full.',
    access: 'read',
    input: {
      status: z.enum(['all', 'draft', 'published']).default('all'),
      query: z.string().trim().max(200).optional().describe('Search within titles.'),
      limit: z.number().int().min(1).max(100).default(25),
      offset: z.number().int().min(0).default(0),
    },
    run: async ({ db }, { status, query, limit, offset }) => {
      let request = db
        .from(TABLE)
        .select(SUMMARY_COLUMNS, { count: 'exact' })
        .order('updated_at', { ascending: false })
        .range(offset, offset + limit - 1)
      if (status !== 'all') request = request.eq('is_published', status === 'published')
      if (query) request = request.ilike('title', `%${query.replace(/[\\%_]/g, '\\$&')}%`)
      const { data, error, count } = await request
      if (error) throw new Error(`list_posts: ${error.message}`)
      return { posts: data.map(serialize), total: count ?? 0, limit, offset }
    },
  },
  {
    name: 'get_post',
    title: 'Get a post',
    description: 'Read one blog post, including its HTML content.',
    access: 'read',
    input: { id: postId },
    run: async ({ db }, { id }) => serialize(await loadPost(db, id)),
  },
  {
    name: 'list_categories',
    title: 'List categories',
    description: 'List the blog categories. A post must use one of these names.',
    access: 'read',
    input: {},
    run: async ({ db }) => ({
      categories: unwrap(await db.from('dash_blog_categories').select('name,slug').order('name'), 'list_categories'),
    }),
  },
  {
    name: 'list_authors',
    title: 'List authors',
    description: 'List the author profiles a post can be credited to.',
    access: 'read',
    input: {},
    run: async ({ db }) => ({
      authors: unwrap(await db.from(AUTHORS_TABLE).select('slug,name,role').is('deleted_at', null).order('name'), 'list_authors'),
    }),
  },
  {
    name: 'create_draft',
    title: 'Create a draft',
    description: 'Create a blog post as an unpublished draft. It stays off the site until it is published.',
    access: 'draft',
    input: {
      title: postFields.title,
      excerpt: postFields.excerpt,
      content: postFields.content,
      category: postFields.category,
      slug: postFields.slug.optional(),
      tags: postFields.tags.optional(),
      featuredImage: postFields.featuredImage.optional(),
      authorSlug: postFields.authorSlug.optional(),
    },
    run: async ({ db, key, deps }, args) => {
      await assertCategory(db, args.category)
      const content = cleanContent(args.content)
      const slug = args.slug || slugify(args.title)
      if (!slug) throw new PostsError('invalid_input', 'Provide a slug: this title has no letters or numbers to make one from.')
      const profile = args.authorSlug ? await authorColumns(db, args.authorSlug) : null
      const author = profile ? null : await deps.loadAuthor(db, key.userId)
      const { data, error } = await db
        .from(TABLE)
        .insert({
          title: args.title,
          slug,
          excerpt: args.excerpt,
          content,
          category: args.category,
          tags: args.tags || [],
          featured_image: args.featuredImage || null,
          author_id: key.userId,
          ...(profile || { author_name: author.name, author_avatar: author.avatar }),
          is_published: false,
          is_featured: false,
          published_at: null,
          reading_time_minutes: readingTimeMinutes(content),
        })
        .select(FULL_COLUMNS)
        .single()
      if (error) throw writeError(error, slug, 'create_draft')
      return serialize(data)
    },
  },
  {
    name: 'update_post',
    title: 'Update a post',
    description: 'Change fields on a post; fields left out stay as they are. A live post needs a key with publish access, and its slug cannot change.',
    access: 'draft',
    input: {
      id: postId,
      title: postFields.title.optional(),
      excerpt: postFields.excerpt.optional(),
      content: postFields.content.optional(),
      category: postFields.category.optional(),
      slug: postFields.slug.optional(),
      tags: postFields.tags.optional(),
      featuredImage: postFields.featuredImage.nullable().optional(),
      authorSlug: postFields.authorSlug.optional(),
    },
    run: async ({ db, key }, { id, ...args }) => {
      if (Object.keys(args).length === 0) throw new PostsError('invalid_input', 'Provide at least one field to change.')
      const current = await loadPost(db, id)
      if (current.is_published && !hasAccess(key.access, 'publish')) {
        throw new PostsError('forbidden', 'This post is live, and changing it needs a key with publish access.')
      }
      if (current.is_published && args.slug && args.slug !== current.slug) {
        throw new PostsError('invalid_state', 'This post is live, so changing its slug would break its link. Unpublish it first.')
      }
      if (args.category) await assertCategory(db, args.category)

      const row = {}
      for (const field of ['title', 'excerpt', 'category', 'slug', 'tags']) {
        if (args[field] !== undefined) row[field] = args[field]
      }
      if (args.featuredImage !== undefined) row.featured_image = args.featuredImage
      if (args.authorSlug) Object.assign(row, await authorColumns(db, args.authorSlug))
      if (args.content !== undefined) {
        row.content = cleanContent(args.content)
        row.reading_time_minutes = readingTimeMinutes(row.content)
      }
      const { data, error } = await db.from(TABLE).update(row).eq('id', id).select(FULL_COLUMNS).single()
      if (error) throw writeError(error, args.slug, 'update_post')
      return serialize(data)
    },
  },
  {
    name: 'publish_post',
    title: 'Publish a post',
    description: 'Put a draft live on the public blog now. Publishing a post that is already live changes nothing.',
    access: 'publish',
    input: { id: postId },
    run: async ({ db }, { id }) => {
      const current = await loadPost(db, id)
      if (current.is_published) return serialize(current)
      // A draft may have been written elsewhere, so it is cleaned again before going public.
      const content = cleanContent(current.content)
      return setPublished(db, id, { is_published: true, published_at: new Date().toISOString(), content })
    },
  },
  {
    name: 'unpublish_post',
    title: 'Unpublish a post',
    description: 'Take a live post off the public blog and return it to draft.',
    access: 'publish',
    input: { id: postId },
    run: async ({ db }, { id }) => {
      const current = await loadPost(db, id)
      if (!current.is_published) return serialize(current)
      return setPublished(db, id, { is_published: false, published_at: null })
    },
  },
]

export function getOperation(name) {
  const operation = OPERATIONS.find((entry) => entry.name === name)
  if (!operation) throw new Error(`Unknown posts operation: ${name}`)
  return operation
}
