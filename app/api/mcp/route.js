import { buildPostsMcpHandler } from '@/lib/posts/mcp'
import { defaultDeps, verifyPostKey } from '@/lib/posts/deps'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const handler = buildPostsMcpHandler({ deps: defaultDeps, verifyKey: verifyPostKey })

export { handler as GET, handler as POST, handler as DELETE }
