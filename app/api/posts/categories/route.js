import { defaultDeps, verifyPostKey } from '@/lib/posts/deps'
import { handlePostsRequest } from '@/lib/posts/http'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request) {
  return handlePostsRequest(request, { deps: defaultDeps, verifyKey: verifyPostKey }, 'list_categories', async () => ({}))
}
