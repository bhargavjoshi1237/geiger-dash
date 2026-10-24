// Reads a push's commits and changed files from the GitHub REST API, so callers only send a product and commit id.

const API = 'https://api.github.com'
const FULL_SHA = /^[0-9a-f]{40}$/i
const ZERO_SHA = /^0{40}$/

// Each product's repo is <owner>/<product slug>, e.g. bhargavjoshi1237/geiger-flow.
export function repoForProduct(product) {
  const owner = process.env.CHANGELOG_GITHUB_OWNER || 'bhargavjoshi1237'
  return `${owner}/${product}`
}

export function isCommitSha(value) {
  return FULL_SHA.test(String(value || ''))
}

// Returns null on 404 so callers can fall back; any other failure throws.
async function github(path, token) {
  const headers = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'geiger-changelog',
  }
  if (token) headers.Authorization = `Bearer ${token}`

  const response = await fetch(`${API}${path}`, { headers })
  if (response.status === 404) return null
  if (!response.ok) {
    const detail = await response.json().catch(() => ({}))
    throw new Error(`GitHub ${response.status}: ${detail.message || response.statusText}`)
  }
  return response.json()
}

function toCommit(entry) {
  return {
    sha: entry.sha,
    message: entry.commit?.message || '',
    author: { name: entry.commit?.author?.name || entry.author?.login || '' },
  }
}

function toFile(file) {
  return {
    status: file.status,
    path: file.filename,
    from: file.previous_filename || null,
    added: file.additions || 0,
    removed: file.deletions || 0,
    patch: file.patch || '',
  }
}

// Diffs before...sha for a whole push; a new branch, missing base, or no `before` falls back to the single commit.
// `token` is the calling workflow's GITHUB_TOKEN when forwarded, else CHANGELOG_GITHUB_TOKEN (public repos work without one).
export async function fetchPushChanges({ repo, sha, before, token }) {
  const auth = token || process.env.CHANGELOG_GITHUB_TOKEN || ''

  if (isCommitSha(before) && !ZERO_SHA.test(before) && before !== sha) {
    const compare = await github(`/repos/${repo}/compare/${before}...${sha}`, auth)
    if (compare) {
      return { commits: (compare.commits || []).map(toCommit), files: (compare.files || []).map(toFile) }
    }
  }

  const commit = await github(`/repos/${repo}/commits/${sha}`, auth)
  if (!commit) throw new Error(`Commit ${sha.slice(0, 7)} was not found in ${repo}.`)
  return { commits: [toCommit(commit)], files: (commit.files || []).map(toFile) }
}
