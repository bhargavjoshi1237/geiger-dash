import { createMcpHandler, withMcpAuth } from 'mcp-handler'
import { z } from 'zod'
import { OPERATIONS } from './operations.js'
import { runOperation } from './run.js'

function toolResult(result) {
  if (!result.ok) return { isError: true, content: [{ type: 'text', text: result.message }] }
  return { content: [{ type: 'text', text: JSON.stringify(result.data) }] }
}

export function buildPostsMcpHandler({ deps, verifyKey, operations = OPERATIONS }) {
  const handler = createMcpHandler(
    (server) => {
      for (const operation of operations) {
        server.registerTool(
          operation.name,
          {
            title: operation.title,
            description: operation.description,
            inputSchema: z.object(operation.input),
            annotations: { title: operation.title, readOnlyHint: operation.access === 'read' },
          },
          async (args, ctx) => toolResult(await runOperation(operation, args, ctx.http?.authInfo?.extra?.key, deps, 'mcp')),
        )
      }
    },
    { serverInfo: { name: 'geiger-posts', version: '1.0.0' } },
  )

  const verify = async (_request, token) => {
    const key = await verifyKey(token)
    return key ? { token, clientId: key.id, scopes: [key.access], extra: { key } } : undefined
  }

  return withMcpAuth(handler, verify, { required: true })
}
