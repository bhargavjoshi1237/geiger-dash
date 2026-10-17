import { timingSafeEqual } from 'node:crypto'
import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/utils/supabase/admin'
import { CHANGELOG_PRODUCTS, generateChangelogFromPush } from '@/lib/changelog/generate'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 150

// Called by each product repo's GitHub "changelog" workflow with Bearer CHANGELOG_INGEST_SECRET.
function isAuthorized(request) {
  const secret = process.env.CHANGELOG_INGEST_SECRET
  const header = request.headers.get('authorization') || ''
  if (!secret || !header.startsWith('Bearer ')) return false
  const given = Buffer.from(header.slice(7))
  const expected = Buffer.from(secret)
  return given.length === expected.length && timingSafeEqual(given, expected)
}

export async function POST(request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  const product = String(body?.product || '').trim()
  const headSha = String(body?.headSha || '').trim()

  if (!CHANGELOG_PRODUCTS.includes(product)) {
    return NextResponse.json({ error: `Unknown product "${product}".` }, { status: 400 })
  }
  if (!headSha || !Array.isArray(body?.commits)) {
    return NextResponse.json({ error: 'headSha and commits are required.' }, { status: 400 })
  }

  const supabase = createAdminClient()
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase service role is not configured.' }, { status: 500 })
  }

  try {
    const result = await generateChangelogFromPush({
      supabase,
      product,
      branch: String(body.branch || ''),
      headSha,
      commits: body.commits,
      changes: { nameStatus: String(body.nameStatus || ''), patch: String(body.patch || '') },
    })
    if (result.status === 'created') {
      revalidatePath('/changelog')
      revalidatePath(`/changelog/${result.id}`)
    }
    return NextResponse.json(result)
  } catch (error) {
    console.error('[changelog.ingest]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
