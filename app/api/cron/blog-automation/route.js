import { NextResponse } from 'next/server'
import { runBlogAutomation } from '@/lib/blog-automation/pipeline'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 300

function isAuthorized(request) {
  const secret = process.env.CRON_SECRET
  return Boolean(secret && request.headers.get('authorization') === `Bearer ${secret}`)
}

export async function GET(request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    return NextResponse.json(await runBlogAutomation({ trigger: 'cron' }))
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export const POST = GET

