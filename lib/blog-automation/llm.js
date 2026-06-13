function resolveEndpoint(baseUrl) {
  const trimmed = String(baseUrl || '').trim().replace(/\/+$/, '')
  if (/\/chat\/completions$/i.test(trimmed)) return trimmed
  return `${trimmed}/chat/completions`
}

function estimateCost(profile, usage) {
  const inputCost =
    (Number(usage.promptTokens || 0) / 1_000_000) * profile.inputPricePerMillion
  const outputCost =
    (Number(usage.completionTokens || 0) / 1_000_000) * profile.outputPricePerMillion
  return Number((inputCost + outputCost).toFixed(8))
}

export function extractJson(text) {
  const source = String(text || '')
  const fenced = source.match(/```(?:json)?\s*([\s\S]*?)```/i)
  const candidate = fenced ? fenced[1] : source
  const start = candidate.indexOf('{')
  const end = candidate.lastIndexOf('}')
  if (start === -1 || end <= start) return null
  try {
    return JSON.parse(candidate.slice(start, end + 1))
  } catch {
    return null
  }
}

export async function callAutomationLlm({
  supabase,
  runId,
  topicId,
  profile,
  role,
  messages,
  temperature = 0.4,
  responseFormat,
}) {
  const startedAt = Date.now()
  let response
  let responseBody
  let requestError

  try {
    response = await fetch(resolveEndpoint(profile.baseUrl), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${profile.apiKey}`,
        'HTTP-Referer': 'https://geiger.studio',
        'X-Title': 'Geiger Blog Automation',
      },
      body: JSON.stringify({
        model: profile.model,
        messages,
        temperature,
        ...(responseFormat ? { response_format: responseFormat } : {}),
      }),
      signal: AbortSignal.timeout(120_000),
    })

    responseBody = await response.json().catch(() => null)
    if (!response.ok) {
      throw new Error(
        responseBody?.error?.message ||
          responseBody?.error ||
          `LLM provider returned ${response.status}`
      )
    }
  } catch (error) {
    requestError = error
  }

  const rawUsage = responseBody?.usage || {}
  const usage = {
    promptTokens: Number(rawUsage.prompt_tokens || rawUsage.input_tokens || 0),
    completionTokens: Number(rawUsage.completion_tokens || rawUsage.output_tokens || 0),
    totalTokens: Number(rawUsage.total_tokens || 0),
  }
  if (!usage.totalTokens) usage.totalTokens = usage.promptTokens + usage.completionTokens

  await supabase.from('dash_llm_usage').insert({
    run_id: runId,
    topic_id: topicId || null,
    provider: profile.id,
    model: profile.model,
    role,
    prompt_tokens: usage.promptTokens,
    completion_tokens: usage.completionTokens,
    total_tokens: usage.totalTokens,
    estimated_cost_usd: estimateCost(profile, usage),
    duration_ms: Date.now() - startedAt,
    success: !requestError,
    error_message: requestError?.message || null,
  })

  if (requestError) throw requestError

  return {
    text: responseBody?.choices?.[0]?.message?.content || '',
    usage,
  }
}

