// Shared route-handler path for /api/posts: authenticate the key, build the arguments, run the operation.
import { getOperation } from './operations.js'
import { runOperation } from './run.js'

const STATUS_FOR = {
  invalid_input: 400,
  forbidden: 403,
  not_found: 404,
  conflict: 409,
  invalid_state: 409,
  rate_limited: 429,
  internal: 500,
}

function errorResponse(code, message, status) {
  return Response.json({ error: { code, message } }, { status })
}

function extractKey(request) {
  const header = request.headers.get('authorization')
  if (header?.toLowerCase().startsWith('bearer ')) return header.slice(7).trim()
  return request.headers.get('x-api-key')?.trim() || null
}

export async function handlePostsRequest(request, { deps, verifyKey }, operationName, buildArgs, successStatus = 200) {
  const key = await verifyKey(extractKey(request))
  if (!key) return errorResponse('unauthorized', 'Invalid or missing API key.', 401)

  let args
  try {
    args = await buildArgs()
  } catch (error) {
    if (!(error instanceof SyntaxError)) throw error
    return errorResponse('invalid_input', 'The request body must be valid JSON.', 400)
  }

  const result = await runOperation(getOperation(operationName), args, key, deps, 'rest')
  if (!result.ok) return errorResponse(result.code, result.message, STATUS_FOR[result.code] ?? 500)
  return Response.json({ data: result.data }, { status: successStatus })
}
