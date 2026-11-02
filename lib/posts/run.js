// Every call passes through here: rate limit, key access, input, the operation, then the audit log.
import { z } from 'zod'
import { PostsError } from './errors.js'
import { hasAccess } from './keys.js'

function outcomeFor(error) {
  if (error?.code === 'rate_limited') return 'rate_limited'
  if (error?.code === 'forbidden' || error?.code === 'not_found') return 'denied'
  return 'error'
}

function describeIssues(error) {
  return error.issues
    .map((issue) => (issue.path.length ? `${issue.path.join('.')}: ${issue.message}` : issue.message))
    .join(' ')
}

export async function runOperation(operation, rawArgs, key, deps, transport) {
  const startedAt = Date.now()
  let failure = null
  let data = null
  let targetId = null

  try {
    if (await deps.isRateLimited(key)) {
      throw new PostsError('rate_limited', 'Too many requests. Wait a minute and try again.')
    }
    if (!hasAccess(key.access, operation.access)) {
      throw new PostsError('forbidden', `This key has ${key.access} access, and ${operation.name} needs ${operation.access}.`)
    }
    const parsed = z.object(operation.input).strict().safeParse(rawArgs ?? {})
    if (!parsed.success) throw new PostsError('invalid_input', describeIssues(parsed.error))

    targetId = parsed.data.id ?? null
    data = await operation.run({ db: deps.db(), key, deps }, parsed.data)
    targetId = targetId ?? data?.id ?? null
    if (operation.access !== 'read') deps.revalidate(data?.slug)
  } catch (error) {
    failure = error
    if (!(error instanceof PostsError)) console.error(`[posts.${operation.name}]`, error)
  }

  try {
    await deps.writeAudit({
      user_id: key.userId,
      client_id: key.id,
      product: 'posts',
      tool: operation.name,
      target_id: targetId,
      outcome: failure ? outcomeFor(failure) : 'ok',
      error_code: failure?.code ?? null,
      duration_ms: Date.now() - startedAt,
      metadata: { transport, argument_keys: Object.keys(rawArgs || {}) },
    })
  } catch (error) {
    console.error('[posts.audit]', error)
    // A change that can't be audited is reported, so nobody assumes the trail is complete.
    if (!failure && operation.access !== 'read') {
      data = { ...data, auditWarning: 'This change succeeded but could not be written to the audit log.' }
    }
  }

  if (failure instanceof PostsError) return { ok: false, code: failure.code, message: failure.message }
  if (failure) return { ok: false, code: 'internal', message: 'Something went wrong. Please try again.' }
  return { ok: true, data }
}
