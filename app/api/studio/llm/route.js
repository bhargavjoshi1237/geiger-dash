import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Normalise a user supplied base URL into a full chat-completions endpoint.
function resolveEndpoint(baseUrl) {
  const trimmed = String(baseUrl || '').trim().replace(/\/+$/, '')
  if (!trimmed) return ''
  if (/\/chat\/completions$/i.test(trimmed)) return trimmed
  if (/\/completions$/i.test(trimmed)) return trimmed
  return `${trimmed}/chat/completions`
}

export async function POST(request) {
  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { baseUrl, apiKey, model, messages, temperature = 0.7, stream = false } = body || {}

  if (!apiKey) {
    return NextResponse.json({ error: 'Missing API key' }, { status: 400 })
  }
  if (!model) {
    return NextResponse.json({ error: 'Missing model' }, { status: 400 })
  }
  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: 'Missing messages' }, { status: 400 })
  }

  const endpoint = resolveEndpoint(baseUrl)
  if (!endpoint) {
    return NextResponse.json({ error: 'Missing base URL' }, { status: 400 })
  }

  let upstream
  try {
    upstream = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        // OpenRouter recommends these; harmless for other providers.
        'HTTP-Referer': 'https://geiger.studio',
        'X-Title': 'Geiger Studio',
      },
      body: JSON.stringify({ model, messages, temperature, stream }),
    })
  } catch (error) {
    return NextResponse.json(
      { error: `Could not reach the AI endpoint: ${error.message}` },
      { status: 502 }
    )
  }

  if (!upstream.ok) {
    const detail = await upstream.text().catch(() => '')
    let message = `AI provider error (${upstream.status})`
    try {
      const parsed = JSON.parse(detail)
      message = parsed.error?.message || parsed.error || parsed.message || message
    } catch {
      if (detail) message = detail.slice(0, 400)
    }
    return NextResponse.json({ error: message }, { status: upstream.status })
  }

  // Stream the raw SSE body straight back to the client.
  if (stream && upstream.body) {
    return new Response(upstream.body, {
      headers: {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
      },
    })
  }

  const data = await upstream.json().catch(() => null)
  const text = data?.choices?.[0]?.message?.content || ''
  return NextResponse.json({ text })
}
