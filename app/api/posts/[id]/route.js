import { defaultDeps, verifyPostKey } from '@/lib/posts/deps'
import { handlePostsRequest } from '@/lib/posts/http'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const context = { deps: defaultDeps, verifyKey: verifyPostKey }

export async function GET(request, { params }) {
  const { id } = await params
  return handlePostsRequest(request, context, 'get_post', async () => ({ id }))
}

export async function PATCH(request, { params }) {
  const { id } = await params
  return handlePostsRequest(request, context, 'update_post', async () => {
    const body = await request.json()
    return body && typeof body === 'object' && !Array.isArray(body) ? { ...body, id } : body
  })
}
