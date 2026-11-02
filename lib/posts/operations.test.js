import test from 'node:test'
import assert from 'node:assert/strict'
import { sanitizePostContent, slugify } from './content.js'
import { generatePostKey, hasAccess, hashPostKey } from './keys.js'
import { getOperation, OPERATIONS } from './operations.js'
import { runOperation } from './run.js'
import { handlePostsRequest } from './http.js'
import { buildPostsMcpHandler } from './mcp.js'

const postId = '859617a2-6dfa-4e65-8db5-6c8691e3a6fb'
const key = (access = 'publish') => ({ id: 'key-1', name: 'Test', userId: 'user-1', access })

// A small stand-in for the Supabase client: one posts table and one categories table.
function fakeDb(initial = []) {
  const posts = initial.map((row) => ({ ...row }))
  const client = {
    posts,
    from(table) {
      const filters = []
      let values = null
      let inserting = false
      const rows = () => posts.filter((row) => filters.every(([column, value]) => row[column] === value))
      const query = {
        select: () => query,
        order: () => query,
        range: () => query,
        ilike: () => query,
        eq: (column, value) => {
          filters.push([column, value])
          return query
        },
        insert: (row) => {
          values = row
          inserting = true
          return query
        },
        update: (row) => {
          values = row
          return query
        },
        maybeSingle: async () => ({ data: rows()[0] ?? null, error: null }),
        single: async () => {
          if (inserting) {
            if (posts.some((row) => row.slug === values.slug)) return { data: null, error: { code: '23505', message: 'duplicate' } }
            const row = { id: 'new-post', ...values }
            posts.push(row)
            return { data: row, error: null }
          }
          const row = rows()[0]
          Object.assign(row, values)
          return { data: row, error: null }
        },
        then: (resolve) => {
          if (table === 'dash_blog_categories') return resolve({ data: [{ name: 'Guides', slug: 'guides' }], error: null })
          return resolve({ data: rows(), error: null, count: rows().length })
        },
      }
      return query
    },
  }
  return client
}

function makeDeps(db = fakeDb(), overrides = {}) {
  const audit = []
  const revalidated = []
  return {
    audit,
    revalidated,
    db: () => db,
    isRateLimited: async () => false,
    writeAudit: async (entry) => {
      audit.push(entry)
    },
    loadAuthor: async () => ({ name: 'Ada', avatar: 'https://x/a.jpg' }),
    revalidate: (slug) => revalidated.push(slug),
    ...overrides,
  }
}

const draftRow = (extra) => ({
  id: postId,
  title: 'Old',
  slug: 'old',
  excerpt: 'Old',
  content: '<p>Old</p>',
  category: 'Guides',
  is_published: false,
  published_at: null,
  ...extra,
})

const validDraft = { title: 'New post', excerpt: 'Short', content: '<p>Hello</p>', category: 'Guides' }

test('sanitizing removes scripts, handlers and unsafe links but keeps post markup', () => {
  const clean = sanitizePostContent(
    '<h2>Hi</h2><script>alert(1)</script><p onclick="x()">Text <a href="javascript:alert(1)">bad</a> <a href="/events">good</a></p><img src="https://a/b.png" onerror="x()">',
  )
  assert.ok(!/script|onclick|onerror|javascript:/i.test(clean))
  assert.match(clean, /<h2>Hi<\/h2>/)
  assert.match(clean, /href="\/events"/)
  assert.match(clean, /<img src="https:\/\/a\/b.png"/)
})

test('plain text is left for the blog page to escape', () => {
  assert.equal(sanitizePostContent('Fish & chips'), 'Fish & chips')
})

test('slugs are made safe', () => {
  assert.equal(slugify("What's new: Geiger & you!"), 'whats-new-geiger-you')
})

test('keys are hashed and access levels are ordered', () => {
  const { key: raw, hash } = generatePostKey()
  assert.ok(raw.startsWith('gp_live_'))
  assert.equal(hash, hashPostKey(raw))
  assert.equal(hasAccess('publish', 'draft'), true)
  assert.equal(hasAccess('draft', 'publish'), false)
  assert.equal(hasAccess('read', 'draft'), false)
  assert.equal(hasAccess('nonsense', 'read'), false)
})

test('a read key cannot create a draft', async () => {
  const deps = makeDeps()
  const result = await runOperation(getOperation('create_draft'), validDraft, key('read'), deps, 'rest')
  assert.equal(result.code, 'forbidden')
  assert.equal(deps.audit[0].outcome, 'denied')
})

test('a draft key cannot publish', async () => {
  const db = fakeDb([draftRow()])
  const result = await runOperation(getOperation('publish_post'), { id: postId }, key('draft'), makeDeps(db), 'rest')
  assert.equal(result.code, 'forbidden')
  assert.equal(db.posts[0].is_published, false)
})

test('a draft key cannot edit a live post', async () => {
  const db = fakeDb([draftRow({ is_published: true })])
  const result = await runOperation(getOperation('update_post'), { id: postId, title: 'Changed' }, key('draft'), makeDeps(db), 'rest')
  assert.equal(result.code, 'forbidden')
  assert.equal(db.posts[0].title, 'Old')
})

test('create_draft stores a sanitized unpublished post with the key owner as author', async () => {
  const db = fakeDb()
  const deps = makeDeps(db)
  const result = await runOperation(
    getOperation('create_draft'),
    { ...validDraft, content: '<p>Hello</p><script>alert(1)</script>' },
    key('draft'),
    deps,
    'mcp',
  )
  assert.equal(result.ok, true)
  assert.equal(result.data.status, 'draft')
  assert.equal(db.posts[0].is_published, false)
  assert.equal(db.posts[0].content, '<p>Hello</p>')
  assert.equal(db.posts[0].author_id, 'user-1')
  assert.equal(db.posts[0].slug, 'new-post')
  assert.deepEqual(deps.revalidated, ['new-post'])
  assert.equal(deps.audit[0].metadata.transport, 'mcp')
})

test('content that is empty once cleaned is refused', async () => {
  const db = fakeDb()
  const result = await runOperation(getOperation('create_draft'), { ...validDraft, content: '<script>alert(1)</script>' }, key(), makeDeps(db), 'rest')
  assert.equal(result.code, 'invalid_input')
  assert.equal(db.posts.length, 0)
})

test('text fields that reach the JSON-LD script refuse angle brackets', async () => {
  const result = await runOperation(
    getOperation('create_draft'),
    { ...validDraft, title: '</script><script>alert(1)</script>' },
    key(),
    makeDeps(),
    'rest',
  )
  assert.equal(result.code, 'invalid_input')
})

test('cover images must be https, because next/image rejects anything else', async () => {
  const result = await runOperation(getOperation('create_draft'), { ...validDraft, featuredImage: 'http://a.com/b.png' }, key(), makeDeps(), 'rest')
  assert.equal(result.code, 'invalid_input')
})

test('an unknown category lists the valid ones', async () => {
  const result = await runOperation(getOperation('create_draft'), { ...validDraft, category: 'Nope' }, key(), makeDeps(), 'rest')
  assert.equal(result.code, 'invalid_input')
  assert.match(result.message, /Guides/)
})

test('a taken slug is reported as a conflict', async () => {
  const result = await runOperation(getOperation('create_draft'), { ...validDraft, slug: 'old' }, key(), makeDeps(fakeDb([draftRow()])), 'rest')
  assert.equal(result.code, 'conflict')
})

test('publishing cleans the draft again and sets the date', async () => {
  const db = fakeDb([draftRow({ content: '<p>Hi</p><script>alert(1)</script>' })])
  const result = await runOperation(getOperation('publish_post'), { id: postId }, key(), makeDeps(db), 'rest')
  assert.equal(result.data.status, 'published')
  assert.ok(db.posts[0].published_at)
  assert.equal(db.posts[0].content, '<p>Hi</p>')
})

test('publishing a live post keeps its original date', async () => {
  const db = fakeDb([draftRow({ is_published: true, published_at: '2026-01-01T00:00:00Z' })])
  await runOperation(getOperation('publish_post'), { id: postId }, key(), makeDeps(db), 'rest')
  assert.equal(db.posts[0].published_at, '2026-01-01T00:00:00Z')
})

test('a live post keeps its slug', async () => {
  const db = fakeDb([draftRow({ is_published: true })])
  const result = await runOperation(getOperation('update_post'), { id: postId, slug: 'other' }, key(), makeDeps(db), 'rest')
  assert.equal(result.code, 'invalid_state')
})

test('unpublishing returns a post to draft', async () => {
  const db = fakeDb([draftRow({ is_published: true, published_at: '2026-01-01T00:00:00Z' })])
  const result = await runOperation(getOperation('unpublish_post'), { id: postId }, key(), makeDeps(db), 'rest')
  assert.equal(result.data.status, 'draft')
  assert.equal(db.posts[0].published_at, null)
})

test('unexpected fields are refused rather than ignored', async () => {
  const result = await runOperation(getOperation('create_draft'), { ...validDraft, is_published: true }, key(), makeDeps(), 'rest')
  assert.equal(result.code, 'invalid_input')
})

test('rate limited calls never reach the operation', async () => {
  const db = fakeDb([draftRow()])
  const deps = makeDeps(db, { isRateLimited: async () => true })
  const result = await runOperation(getOperation('publish_post'), { id: postId }, key(), deps, 'rest')
  assert.equal(result.code, 'rate_limited')
  assert.equal(db.posts[0].is_published, false)
  assert.equal(deps.audit[0].outcome, 'rate_limited')
})

test('database failures return a generic message', async () => {
  const deps = makeDeps(fakeDb(), {
    db: () => {
      throw new Error('secret connection detail')
    },
  })
  const original = console.error
  console.error = () => {}
  const result = await runOperation(getOperation('get_post'), { id: postId }, key(), deps, 'rest').finally(() => {
    console.error = original
  })
  assert.equal(result.code, 'internal')
  assert.doesNotMatch(result.message, /secret/)
})

test('a failed audit on a write is reported to the caller', async () => {
  const deps = makeDeps(fakeDb(), {
    writeAudit: async () => {
      throw new Error('down')
    },
  })
  const original = console.error
  console.error = () => {}
  const result = await runOperation(getOperation('create_draft'), validDraft, key(), deps, 'rest').finally(() => {
    console.error = original
  })
  assert.equal(result.ok, true)
  assert.match(result.data.auditWarning, /audit/)
})

test('REST: no key gets a 401, bad JSON a 400, and a new post a 201', async () => {
  const context = { deps: makeDeps(), verifyKey: async (raw) => (raw === 'good' ? key() : null) }
  const denied = await handlePostsRequest(new Request('http://x/api/posts'), context, 'list_posts', async () => ({}))
  assert.equal(denied.status, 401)

  const authed = (body) => new Request('http://x/api/posts', { method: 'POST', headers: { authorization: 'Bearer good' }, body })
  const badRequest = authed('{not json')
  const bad = await handlePostsRequest(badRequest, context, 'create_draft', () => badRequest.json(), 201)
  assert.equal(bad.status, 400)

  const goodRequest = authed(JSON.stringify(validDraft))
  const created = await handlePostsRequest(goodRequest, context, 'create_draft', () => goodRequest.json(), 201)
  assert.equal(created.status, 201)
  assert.equal((await created.json()).data.status, 'draft')
})

async function mcpCall(handler, token, method, params) {
  const headers = { 'content-type': 'application/json', accept: 'application/json, text/event-stream' }
  if (token) headers.authorization = `Bearer ${token}`
  const response = await handler(
    new Request('http://x/api/mcp', {
      method: 'POST',
      headers,
      body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
    }),
  )
  if (response.status !== 200) return { status: response.status }
  const text = await response.text()
  const line = text.split('\n').find((entry) => entry.startsWith('data: '))
  return { status: 200, body: JSON.parse(line ? line.slice(6) : text) }
}

test('MCP: refuses a missing key, lists every tool and runs them through the same checks', async () => {
  const db = fakeDb()
  const handler = buildPostsMcpHandler({
    deps: makeDeps(db),
    verifyKey: async (raw) => (raw === 'draft-key' ? key('draft') : null),
  })

  assert.equal((await mcpCall(handler, null, 'tools/list', {})).status, 401)

  const init = await mcpCall(handler, 'draft-key', 'initialize', {
    protocolVersion: '2025-06-18',
    capabilities: {},
    clientInfo: { name: 'test', version: '1' },
  })
  assert.equal(init.body.result.serverInfo.name, 'geiger-posts')

  const listed = await mcpCall(handler, 'draft-key', 'tools/list', {})
  assert.deepEqual(listed.body.result.tools.map((tool) => tool.name).sort(), OPERATIONS.map((op) => op.name).sort())

  const created = await mcpCall(handler, 'draft-key', 'tools/call', { name: 'create_draft', arguments: validDraft })
  assert.equal(JSON.parse(created.body.result.content[0].text).status, 'draft')
  assert.equal(db.posts.length, 1)

  const refused = await mcpCall(handler, 'draft-key', 'tools/call', { name: 'publish_post', arguments: { id: postId } })
  assert.equal(refused.body.result.isError, true)
})
