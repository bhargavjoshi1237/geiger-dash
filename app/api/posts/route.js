import { defaultDeps, verifyPostKey } from '@/lib/posts/deps'
import { handlePostsRequest } from '@/lib/posts/http'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const context = { deps: defaultDeps, verifyKey: verifyPostKey }

function numberParam(params, name) {
  return params.has(name) ? Number(params.get(name)) : undefined
}

export async function GET(request) {
  const params = new URL(request.url).searchParams
  return handlePostsRequest(request, context, 'list_posts', async () => ({
    status: params.get('status') ?? undefined,
    query: params.get('query') ?? undefined,
    limit: numberParam(params, 'limit'),
    offset: numberParam(params, 'offset'),
  }))
}

export async function POST(request) {
  return handlePostsRequest(request, context, 'create_draft', () => request.json(), 201)
}
