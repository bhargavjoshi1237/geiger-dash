export async function searchTopic(config, query) {
  if (!config.search.apiKey) return []

  const response = await fetch(config.search.url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.search.apiKey}`,
    },
    body: JSON.stringify({
      api_key: config.search.apiKey,
      query,
      search_depth: 'advanced',
      max_results: config.maxResearchResults,
      include_answer: true,
      include_raw_content: false,
    }),
    signal: AbortSignal.timeout(45_000),
  })

  if (!response.ok) {
    throw new Error(`Research provider returned ${response.status}`)
  }

  const data = await response.json()
  return (data.results || []).slice(0, config.maxResearchResults).map((result) => ({
    title: String(result.title || '').slice(0, 500),
    url: String(result.url || '').slice(0, 2000),
    snippet: String(result.content || result.snippet || '').slice(0, 5000),
    score: Number(result.score || 0),
    sourceType: 'web',
  }))
}

export function formatResearch(sources) {
  if (sources.length === 0) {
    return 'No external search provider is configured. Do not invent facts or statistics. Use durable product and workflow knowledge only, and flag claims that need verification.'
  }

  return sources
    .map(
      (source, index) =>
        `[${index + 1}] ${source.title}\nURL: ${source.url}\nNotes: ${source.snippet}`
    )
    .join('\n\n')
}

