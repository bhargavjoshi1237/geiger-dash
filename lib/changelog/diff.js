// Condenses a push's changed files ({ status, path, from, added, removed, patch }) into a prompt-sized summary.

const MAX_TOTAL_CHARS = 60_000
const MAX_LINES_PER_FILE = 80
const MAX_LISTED_FILES = 150

const STATUS_LABELS = { A: 'added', M: 'modified', D: 'deleted', R: 'renamed', C: 'copied' }
const STATUS_CODES = { added: 'A', removed: 'D', modified: 'M', changed: 'M', renamed: 'R', copied: 'C' }

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

// Keeps hunk headers and +/- lines only; context lines cost tokens without saying what changed.
function changedLines(patch) {
  return String(patch || '')
    .split('\n')
    .flatMap((line) => {
      if (line.startsWith('@@')) return [line.replace(/^@@[^@]*@@\s?/, '@@ ')]
      if (line.startsWith('+') || line.startsWith('-')) return [line]
      return []
    })
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

export function summarizeChanges(files) {
  const entries = (Array.isArray(files) ? files : [])
    .filter((file) => file?.path)
    .map((file) => ({
      status: STATUS_CODES[file.status] || 'M',
      path: file.path,
      from: file.from || null,
      added: file.added || 0,
      removed: file.removed || 0,
      lines: changedLines(file.patch),
    }))
  if (entries.length === 0) return ''

  const relevant = entries.filter((e) => !IGNORED.some((re) => re.test(e.path)))
  const deleted = relevant.filter((e) => e.status === 'D')
  const kept = relevant
    .filter((e) => e.status !== 'D')
    .map((e) => ({ ...e, score: priority(e.path) }))
    .sort((a, b) => b.score - a.score || b.added - a.added)

  const counts = Object.entries(
    relevant.reduce((acc, e) => ({ ...acc, [e.status]: (acc[e.status] || 0) + 1 }), {})
  ).map(([code, n]) => `${n} ${STATUS_LABELS[code] || code}`)

  const listed = kept
    .slice(0, MAX_LISTED_FILES)
    .map((e) => `${e.status}  ${e.from ? `${e.from} -> ` : ''}${e.path} (+${e.added} -${e.removed})`)
  if (kept.length > MAX_LISTED_FILES) listed.push(`... and ${kept.length - MAX_LISTED_FILES} more changed files`)

  let out = `Files changed: ${relevant.length} (${counts.join(', ')}); ${entries.length - relevant.length} lock/build/binary files ignored.\n`
  out += [...listed, ...groupDeleted(deleted)].join('\n')
  out += '\n\nPatch excerpts (changed lines only, most customer-relevant files first):\n'

  for (const e of kept) {
    if (e.lines.length === 0) continue
    const lines = e.lines.slice(0, MAX_LINES_PER_FILE)
    const more = e.lines.length - lines.length
    const block = `\n### ${e.path}\n${lines.join('\n')}${more > 0 ? `\n... ${more} more changed lines` : ''}\n`
    if (out.length + block.length > MAX_TOTAL_CHARS) {
      out += '\n... remaining patches omitted for length'
      break
    }
    out += block
  }
  return out
}
