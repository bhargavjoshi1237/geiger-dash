import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { getUser } from '@/supabase/user/getUser'
import { runBlogAutomation } from '@/lib/blog-automation/pipeline'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 300

async function authenticatedClient() {
  const supabase = await createClient()
  const user = await getUser(supabase)
  return { supabase, user }
}

export async function GET() {
  const { supabase, user } = await authenticatedClient()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const [{ data: runs, error: runsError }, { data: usage, error: usageError }] =
    await Promise.all([
      supabase
        .from('dash_blog_automation_runs')
        .select('id,status,quality_score,error_message,started_at,completed_at,metadata,blog_post_id')
        .order('started_at', { ascending: false })
        .limit(30),
      supabase
        .from('dash_llm_usage')
        .select('model,role,total_tokens,estimated_cost_usd,success,created_at')
        .order('created_at', { ascending: false })
        .limit(250),
    ])

  if (runsError || usageError) {
    return NextResponse.json(
      { error: runsError?.message || usageError?.message },
      { status: 500 }
    )
  }

  const totals = (usage || []).reduce(
    (sum, item) => ({
      calls: sum.calls + 1,
      tokens: sum.tokens + Number(item.total_tokens || 0),
      estimatedCostUsd: sum.estimatedCostUsd + Number(item.estimated_cost_usd || 0),
      failedCalls: sum.failedCalls + (item.success ? 0 : 1),
    }),
    { calls: 0, tokens: 0, estimatedCostUsd: 0, failedCalls: 0 }
  )

  return NextResponse.json({ runs: runs || [], usage: usage || [], totals })
}

export async function POST() {
  const { user } = await authenticatedClient()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    return NextResponse.json(await runBlogAutomation({ trigger: 'manual', force: true }))
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

