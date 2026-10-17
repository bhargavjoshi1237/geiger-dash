// Condenses a push's raw `git diff` into a prompt-sized summary: file list plus prioritized patch excerpts.

const MAX_TOTAL_CHARS = 60_000
const MAX_LINES_PER_FILE = 80
const MAX_LISTED_FILES = 150

const STATUS_LABELS = { A: 'added', M: 'modified', D: 'deleted', R: 'renamed', C: 'copied' }

// Noise the model should never spend tokens on.
const IGNORED = [
  /(^|\/)(package-lock\.json|pnpm-lock\.yaml|yarn\.lock|bun\.lockb?)$/,
  /(^|\/)(dist|build|out|\.next|coverage|node_modules)\//,
  /\.(min\.(js|css)|map|snap|lock)$/,
  /\.(png|jpe?g|gif|webp|ico|svg|woff2?|ttf|otf|mp4|pdf|zip)$/i,
]

// Higher scores reach the model first; customer-facing source beats config, tests and docs.
function priority(path) {
  if (/(^|\/)(__tests__|tests?|e2e)\/|\.(test|spec)\.[jt]sx?$/.test(path)) return 1
  if (/\.(md|mdx|txt)$/i.test(path) || /^\.github\//.test(path)) return 1
  if (/(^|\/)(supabase\/migrations|prisma)\//.test(path)) return 2
  if (/\.(json|ya?ml|toml|config\.[cm]?[jt]s)$/.test(path) || /(^|\/)\.[^/]+$/.test(path)) return 1
  if (/^(app|pages|src\/app|src\/pages)\//.test(path)) return 5
  if (/^(components|src\/components|features|src\/features|mails)\//.test(path)) return 4
  if (/^(lib|src|utils|hooks)\//.test(path)) return 3
  return 2
}

function parseNameStatus(text) {
  return String(text || '')
    .split('\n')
    .map((line) => line.split('\t'))
    .filter((parts) => parts.length >= 2 && parts[0])
    .map(([code, ...paths]) => ({ status: code.charAt(0), path: paths[paths.length - 1], from: paths.length > 1 ? paths[0] : null }))
}

// Splits a unified diff into per-file change lines (+/- and hunk headers only, no context).
function parsePatch(text) {
  const files = new Map()
  let current = null
  for (const line of String(text || '').split('\n')) {
    const header = line.match(/^diff --git a\/.+? b\/(.+)$/)
    if (header) {
      current = { path: header[1], lines: [], added: 0, removed: 0 }
      files.set(current.path, current)
      continue
    }
    if (!current || line.startsWith('+++') || line.startsWith('---')) continue
    if (line.startsWith('@@')) current.lines.push(line.replace(/^@@[^@]*@@\s?/, '@@ '))
    else if (line.startsWith('+')) { current.added += 1; current.lines.push(line) }
    else if (line.startsWith('-')) { current.removed += 1; current.lines.push(line) }
  }
  return files
}

// Deleted files are listed per folder so a removed feature reads as one line, not hundreds.
function groupDeleted(entries) {
  const groups = new Map()
  for (const { path } of entries) {
    const parts = path.split('/')
    const folder = parts.length > 2 ? parts.slice(0, Math.min(parts.length - 1, 3)).join('/') + '/' : path
    groups.set(folder, (groups.get(folder) || 0) + 1)
  }
  return [...groups].map(([folder, count]) => (count > 1 ? `D  ${folder} (${count} files)` : `D  ${folder}`))
}

export function summarizeChanges({ nameStatus, patch }) {
  const patchFiles = parsePatch(patch)
  const entries = parseNameStatus(nameStatus)
  if (entries.length === 0 && patchFiles.size === 0) return ''

  const relevant = entries.filter((e) => !IGNORED.some((re) => re.test(e.path)))
  const deleted = relevant.filter((e) => e.status === 'D')
  const kept = relevant
    .filter((e) => e.status !== 'D')
    .map((e) => ({ ...e, diff: patchFiles.get(e.path), score: priority(e.path) }))
    .sort((a, b) => b.score - a.score || (b.diff?.added || 0) - (a.diff?.added || 0))

  const counts = Object.entries(
    relevant.reduce((acc, e) => ({ ...acc, [e.status]: (acc[e.status] || 0) + 1 }), {})
  ).map(([code, n]) => `${n} ${STATUS_LABELS[code] || code}`)

  const listed = kept.slice(0, MAX_LISTED_FILES).map((e) => {
    const stat = e.diff ? ` (+${e.diff.added} -${e.diff.removed})` : ''
    return `${e.status}  ${e.from ? `${e.from} -> ` : ''}${e.path}${stat}`
  })
  if (kept.length > MAX_LISTED_FILES) listed.push(`... and ${kept.length - MAX_LISTED_FILES} more changed files`)

  let out = `Files changed: ${relevant.length} (${counts.join(', ')}); ${entries.length - relevant.length} lock/build/binary files ignored.\n`
  out += [...listed, ...groupDeleted(deleted)].join('\n')
  out += '\n\nPatch excerpts (changed lines only, most customer-relevant files first):\n'

  for (const e of kept) {
    if (!e.diff || e.diff.lines.length === 0) continue
    const lines = e.diff.lines.slice(0, MAX_LINES_PER_FILE)
    const more = e.diff.lines.length - lines.length
    const block = `\n### ${e.path}\n${lines.join('\n')}${more > 0 ? `\n... ${more} more changed lines` : ''}\n`
    if (out.length + block.length > MAX_TOTAL_CHARS) {
      out += '\n... remaining patches omitted for length'
      break
    }
    out += block
  }
  return out
}
