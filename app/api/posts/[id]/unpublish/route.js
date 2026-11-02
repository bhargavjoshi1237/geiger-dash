import { defaultDeps, verifyPostKey } from '@/lib/posts/deps'
import { handlePostsRequest } from '@/lib/posts/http'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request, { params }) {
  const { id } = await params
  return handlePostsRequest(request, { deps: defaultDeps, verifyKey: verifyPostKey }, 'unpublish_post', async () => ({ id }))
}
