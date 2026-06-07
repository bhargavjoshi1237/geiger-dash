import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Accepts owner/repo, a full GitHub URL, or git@ remote and returns "owner/repo".
function parseRepo(value) {
  const raw = String(value || '').trim()
  if (!raw) return ''
  const cleaned = raw
    .replace(/^https?:\/\/github\.com\//i, '')
    .replace(/^git@github\.com:/i, '')
    .replace(/\.git$/i, '')
    .replace(/^\/+|\/+$/g, '')
  const parts = cleaned.split('/').filter(Boolean)
  if (parts.length < 2) return ''
  return `${parts[0]}/${parts[1]}`
}

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const repo = parseRepo(searchParams.get('repo'))
  const branch = String(searchParams.get('branch') || '').trim()
  const token = String(searchParams.get('token') || '').trim()
  const perPage = Math.min(Number(searchParams.get('per_page') || 50) || 50, 100)
  const page = Math.max(Number(searchParams.get('page') || 1) || 1, 1)

  if (!repo) {
    return NextResponse.json(
      { error: 'Enter a repository as "owner/repo" or a GitHub URL.' },
      { status: 400 }
    )
  }

  const url = new URL(`https://api.github.com/repos/${repo}/commits`)
  url.searchParams.set('per_page', String(perPage))
  url.searchParams.set('page', String(page))
  if (branch) url.searchParams.set('sha', branch)

  const headers = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'geiger-studio',
  }
  if (token) headers.Authorization = `Bearer ${token}`

  let response
  try {
    response = await fetch(url, { headers })
  } catch (error) {
    return NextResponse.json({ error: `Could not reach GitHub: ${error.message}` }, { status: 502 })
  }

  if (!response.ok) {
    const detail = await response.json().catch(() => ({}))
    let message = detail.message || `GitHub error (${response.status})`
    if (response.status === 404) {
      message = `Repository or branch not found: ${repo}${branch ? `@${branch}` : ''}. Add a token for private repos.`
    } else if (response.status === 403 && /rate limit/i.test(message)) {
      message = 'GitHub API rate limit reached. Add a personal access token to continue.'
    }
    return NextResponse.json({ error: message }, { status: response.status })
  }

  const raw = await response.json()
  const commits = (Array.isArray(raw) ? raw : []).map((entry) => {
    const fullMessage = entry.commit?.message || ''
    const [title, ...rest] = fullMessage.split('\n')
    return {
      sha: entry.sha,
      shortSha: String(entry.sha || '').slice(0, 7),
      title: title.trim(),
      body: rest.join('\n').trim(),
      message: fullMessage.trim(),
      author: entry.commit?.author?.name || entry.author?.login || 'Unknown',
      date: entry.commit?.author?.date || '',
      url: entry.html_url || '',
    }
  })

  const linkHeader = response.headers.get('link') || ''
  const hasMore = /rel="next"/.test(linkHeader)

  return NextResponse.json({ repo, branch, page, hasMore, commits })
}
