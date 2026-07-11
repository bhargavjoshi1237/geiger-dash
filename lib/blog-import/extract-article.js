// Server-side article extraction. Ports scripts/extract_article.py from the
// benchmark-blog-rewriter skill: strip scripts/styles/nav chrome from a saved
// HTML page and return the readable article text.

// Tags whose contents are never article body.
const SKIP_TAGS = new Set(['script', 'style', 'noscript', 'head', 'svg', 'path'])

// Boilerplate that appears in site nav/footer and is never article content.
const BOILERPLATE = new Set([
  'Artificial Analysis', 'Models', 'Coding Agents', 'Hardware', 'Leaderboards',
  'About', 'AI Trends', 'Arenas', 'All articles', 'Read the latest',
  'Get notified about new articles', 'Email address', 'Subscribe', 'Explore',
  'LLM Leaderboard', 'Image Arena', 'Video Arena', 'AI Agents', 'Evaluations',
  'Company', 'Methodology', 'Services', 'Contact', 'Articles', 'FAQ',
  'Terms of Use', 'Privacy Policy', 'X', 'LinkedIn', 'YouTube', 'Discord',
  'Rednote', 'Speech, Image, Video, Music', 'K',
])

function decodeEntities(text) {
  return String(text || '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
}

// Walk the HTML once, collecting text that sits outside skipped tags. Mirrors
// the Python HTMLParser: track skip depth so nested script/style is dropped.
export function extractArticleText(html, { maxLines = 400 } = {}) {
  const source = String(html || '')
  if (!source.trim()) return ''

  const chunks = []
  let skipDepth = 0
  // Match a tag or a run of text between tags.
  const tokenizer = /<\/?([a-zA-Z][a-zA-Z0-9]*)\b[^>]*?(\/?)>|([^<]+)/g
  let match

  while ((match = tokenizer.exec(source)) !== null) {
    const [full, tagName, selfClose, textRun] = match

    if (tagName) {
      const tag = tagName.toLowerCase()
      if (!SKIP_TAGS.has(tag)) continue
      const isClosing = full.startsWith('</')
      const isSelfClosing = Boolean(selfClose)
      if (isClosing) {
        skipDepth = Math.max(0, skipDepth - 1)
      } else if (!isSelfClosing) {
        skipDepth += 1
      }
      continue
    }

    if (skipDepth || !textRun) continue
    const text = decodeEntities(textRun).replace(/\s+/g, ' ').trim()
    if (text && !BOILERPLATE.has(text)) chunks.push(text)
  }

  return chunks.slice(0, maxLines).join('\n')
}

// Fetch a remote page and return its extracted article text.
export async function fetchArticleText(url, { maxLines = 400 } = {}) {
  const target = String(url || '').trim()
  if (!/^https?:\/\//i.test(target)) {
    throw new Error('Enter a valid http(s) URL.')
  }

  let response
  try {
    response = await fetch(target, {
      redirect: 'follow',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (compatible; GeigerStudioBot/1.0; +https://geiger.studio)',
        Accept: 'text/html,application/xhtml+xml,text/plain,*/*',
      },
    })
  } catch (error) {
    throw new Error(`Could not reach that URL: ${error.message}`)
  }

  if (!response.ok) {
    throw new Error(`The source returned ${response.status} ${response.statusText}.`)
  }

  const body = await response.text()
  const text = extractArticleText(body, { maxLines })
  if (!text.trim()) {
    throw new Error('No readable article text was found at that URL.')
  }
  return text
}
