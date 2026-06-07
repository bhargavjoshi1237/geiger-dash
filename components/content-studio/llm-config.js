'use client'

import { useCallback, useEffect, useState } from 'react'

export const LLM_STORAGE_KEY = 'geiger-studio-llm'

// Common OpenAI-compatible providers. `baseUrl` points at the API root that
// exposes a `/chat/completions` endpoint.
export const LLM_PRESETS = [
  { id: 'openai', label: 'OpenAI', baseUrl: 'https://api.openai.com/v1', model: 'gpt-4o-mini' },
  { id: 'openrouter', label: 'OpenRouter', baseUrl: 'https://openrouter.ai/api/v1', model: 'openai/gpt-4o-mini' },
  { id: 'groq', label: 'Groq', baseUrl: 'https://api.groq.com/openai/v1', model: 'llama-3.3-70b-versatile' },
  { id: 'together', label: 'Together AI', baseUrl: 'https://api.together.xyz/v1', model: 'meta-llama/Llama-3.3-70B-Instruct-Turbo' },
  { id: 'deepseek', label: 'DeepSeek', baseUrl: 'https://api.deepseek.com/v1', model: 'deepseek-chat' },
  { id: 'mistral', label: 'Mistral', baseUrl: 'https://api.mistral.ai/v1', model: 'mistral-small-latest' },
  { id: 'local', label: 'Local (Ollama / LM Studio)', baseUrl: 'http://localhost:11434/v1', model: 'llama3.1' },
  { id: 'custom', label: 'Custom endpoint', baseUrl: '', model: '' },
]

export const EMPTY_LLM_CONFIG = {
  provider: 'openai',
  baseUrl: 'https://api.openai.com/v1',
  apiKey: '',
  model: 'gpt-4o-mini',
}

function readStoredConfig() {
  if (typeof window === 'undefined') return EMPTY_LLM_CONFIG
  try {
    const raw = window.localStorage.getItem(LLM_STORAGE_KEY)
    if (!raw) return EMPTY_LLM_CONFIG
    const parsed = JSON.parse(raw)
    return { ...EMPTY_LLM_CONFIG, ...parsed }
  } catch {
    return EMPTY_LLM_CONFIG
  }
}

/**
 * Persisted, on-the-go LLM configuration kept in localStorage (no DB tables).
 * Returns the config plus helpers to update/clear it and a readiness flag.
 */
export function useLlmConfig() {
  const [config, setConfig] = useState(EMPTY_LLM_CONFIG)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setConfig(readStoredConfig())
    setHydrated(true)

    const sync = (event) => {
      if (event.key === LLM_STORAGE_KEY) setConfig(readStoredConfig())
    }
    const local = () => setConfig(readStoredConfig())
    window.addEventListener('storage', sync)
    window.addEventListener('geiger-studio:llm-updated', local)
    return () => {
      window.removeEventListener('storage', sync)
      window.removeEventListener('geiger-studio:llm-updated', local)
    }
  }, [])

  const save = useCallback((next) => {
    const merged = { ...EMPTY_LLM_CONFIG, ...next }
    window.localStorage.setItem(LLM_STORAGE_KEY, JSON.stringify(merged))
    setConfig(merged)
    window.dispatchEvent(new Event('geiger-studio:llm-updated'))
    return merged
  }, [])

  const clear = useCallback(() => {
    window.localStorage.removeItem(LLM_STORAGE_KEY)
    setConfig(EMPTY_LLM_CONFIG)
    window.dispatchEvent(new Event('geiger-studio:llm-updated'))
  }, [])

  const isConfigured = Boolean(config.baseUrl && config.apiKey && config.model)

  return { config, hydrated, isConfigured, save, clear }
}

/**
 * Call the OpenAI-compatible chat completions endpoint through our proxy.
 * When `onToken` is supplied the response is streamed token-by-token and the
 * full text is also returned once finished.
 */
export async function callLlmChat({ config, messages, temperature = 0.7, signal, onToken }) {
  if (!config?.baseUrl || !config?.apiKey || !config?.model) {
    throw new Error('Connect an AI model first (open AI Settings).')
  }

  const response = await fetch('/api/studio/llm', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    signal,
    body: JSON.stringify({
      baseUrl: config.baseUrl,
      apiKey: config.apiKey,
      model: config.model,
      messages,
      temperature,
      stream: Boolean(onToken),
    }),
  })

  if (!response.ok) {
    const detail = await response.json().catch(() => ({}))
    throw new Error(detail.error || `AI request failed (${response.status})`)
  }

  // Non-streaming path.
  if (!onToken) {
    const data = await response.json()
    return data.text || ''
  }

  // Streaming path — parse server-sent `data:` lines.
  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  let full = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })

    const lines = buffer.split('\n')
    buffer = lines.pop() || ''

    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed || !trimmed.startsWith('data:')) continue
      const payload = trimmed.slice(5).trim()
      if (payload === '[DONE]') continue
      try {
        const json = JSON.parse(payload)
        const delta = json.choices?.[0]?.delta?.content || ''
        if (delta) {
          full += delta
          onToken(delta, full)
        }
      } catch {
        // ignore keep-alive / partial chunks
      }
    }
  }

  return full
}

/**
 * Best-effort extraction of a JSON object from an LLM response that may be
 * wrapped in prose or markdown fences.
 */
export function extractJson(text) {
  if (!text) return null
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i)
  const candidate = fenced ? fenced[1] : text
  const start = candidate.indexOf('{')
  const end = candidate.lastIndexOf('}')
  if (start === -1 || end === -1 || end <= start) return null
  try {
    return JSON.parse(candidate.slice(start, end + 1))
  } catch {
    return null
  }
}
