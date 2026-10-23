// Minimal server-side client for any OpenAI-compatible /chat/completions provider (carries an API key — never import client-side).

export function resolveChatEndpoint(baseUrl) {
  const trimmed = String(baseUrl || '').trim().replace(/\/+$/, '')
  if (/\/chat\/completions$/i.test(trimmed)) return trimmed
  return `${trimmed}/chat/completions`
}

export async function callChatCompletion(config, messages, { title = 'Geiger', temperature = 0.3, timeoutMs = 100_000 } = {}) {
  const response = await fetch(resolveChatEndpoint(config.baseUrl), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.apiKey}`,
      'HTTP-Referer': 'https://geiger.studio',
      'X-Title': title,
    },
    body: JSON.stringify({ model: config.model, messages, temperature }),
    signal: AbortSignal.timeout(timeoutMs),
  })
  const body = await response.json().catch(() => null)
  if (!response.ok) {
    throw new Error(body?.error?.message || body?.error || `LLM provider returned ${response.status}`)
  }
  return body?.choices?.[0]?.message?.content || ''
}
