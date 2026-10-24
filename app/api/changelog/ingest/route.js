import { timingSafeEqual } from 'node:crypto'
import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/utils/supabase/admin'
import { CHANGELOG_PRODUCTS, generateChangelogFromPush } from '@/lib/changelog/generate'
import { isCommitSha } from '@/lib/changelog/github'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 150

// Changelog service for every product: POST { product, sha, before?, branch? } with Bearer CHANGELOG_INGEST_SECRET.
// Each repo calls it through the reusable .github/workflows/changelog-service.yml; an optional X-GitHub-Token lifts GitHub rate limits.
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
  const sha = String(body?.sha || '').trim()

  if (!CHANGELOG_PRODUCTS.includes(product)) {
    return NextResponse.json({ error: `Unknown product "${product}".` }, { status: 400 })
  }
  if (!isCommitSha(sha)) {
    return NextResponse.json({ error: 'sha must be a full 40-character commit id.' }, { status: 400 })
  }

  const supabase = createAdminClient()
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase service role is not configured.' }, { status: 500 })
  }

  try {
    const result = await generateChangelogFromPush({
      supabase,
      product,
      sha,
      before: String(body.before || '').trim(),
      branch: String(body.branch || '').trim(),
      githubToken: request.headers.get('x-github-token') || '',
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
