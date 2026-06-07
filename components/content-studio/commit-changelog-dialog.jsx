'use client'

import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import {
  Check,
  GitBranch,
  GitCommit,
  Loader2,
  Search,
  Sparkles,
  Wand2,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { callLlmChat, extractJson, useLlmConfig } from '@/components/content-studio/llm-config'

const fieldClass =
  'border-zinc-700 bg-zinc-950 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-zinc-600'

// Map a conventional-commit prefix to a changelog bucket.
const PREFIX_MAP = [
  [/^feat(\(.*\))?!?:/i, 'added'],
  [/^add(ed)?(\(.*\))?:/i, 'added'],
  [/^fix(\(.*\))?!?:/i, 'fixed'],
  [/^bug(fix)?(\(.*\))?:/i, 'fixed'],
  [/^perf(\(.*\))?:/i, 'changed'],
  [/^refactor(\(.*\))?:/i, 'changed'],
  [/^chore(\(.*\))?:/i, 'changed'],
  [/^style(\(.*\))?:/i, 'changed'],
  [/^docs(\(.*\))?:/i, 'changed'],
  [/^remove(d)?(\(.*\))?:/i, 'removed'],
  [/^deprecate(d)?(\(.*\))?:/i, 'deprecated'],
]

function cleanCommitTitle(title) {
  return String(title || '')
    .replace(/^[a-z]+(\(.*?\))?!?:\s*/i, '')
    .replace(/\(#\d+\)\s*$/i, '')
    .trim()
}

function classifyCommit(title) {
  for (const [pattern, type] of PREFIX_MAP) {
    if (pattern.test(title)) return type
  }
  return 'changed'
}

function capitalize(value) {
  const str = String(value || '').trim()
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : str
}

// Build a changelog draft locally (no AI) by grouping commits.
function combineCommits(commits) {
  const buckets = { added: [], changed: [], fixed: [], removed: [], deprecated: [] }
  commits.forEach((commit) => {
    const type = classifyCommit(commit.title)
    const text = capitalize(cleanCommitTitle(commit.title))
    if (text && !buckets[type].includes(text)) buckets[type].push(text)
  })

  const featureCount = buckets.added.length
  const fixCount = buckets.fixed.length
  const summaryParts = []
  if (featureCount) summaryParts.push(`${featureCount} new ${featureCount === 1 ? 'feature' : 'features'}`)
  if (fixCount) summaryParts.push(`${fixCount} ${fixCount === 1 ? 'fix' : 'fixes'}`)
  const otherCount = buckets.changed.length + buckets.removed.length + buckets.deprecated.length
  if (otherCount) summaryParts.push(`${otherCount} ${otherCount === 1 ? 'improvement' : 'improvements'}`)

  const category = featureCount ? 'feature' : fixCount ? 'bugfix' : 'improvement'

  return {
    title: buckets.added[0] || buckets.changed[0] || buckets.fixed[0] || 'New release',
    description: summaryParts.length
      ? `This release ships ${summaryParts.join(', ')} from ${commits.length} commits.`
      : `Updates from ${commits.length} commits.`,
    category,
    items_added: buckets.added.join('\n'),
    items_changed: buckets.changed.join('\n'),
    items_fixed: buckets.fixed.join('\n'),
    items_removed: buckets.removed.join('\n'),
    items_deprecated: buckets.deprecated.join('\n'),
  }
}

const AI_SYSTEM_PROMPT =
  'You are a release-notes writer for a SaaS product. Given a list of git commits, produce concise, ' +
  'user-facing changelog entries. Group meaningful changes and ignore noise like merge commits, ' +
  'version bumps, and formatting-only commits. Write in plain product language, not git-speak. ' +
  'Respond with ONLY a JSON object, no prose.'

function buildAiPrompt({ commits, product, branch }) {
  const list = commits
    .map((c) => `- ${c.shortSha} ${c.title}${c.body ? `\n    ${c.body.replace(/\n/g, ' ').slice(0, 200)}` : ''}`)
    .join('\n')

  return (
    `Product: ${product || 'our product'}\nBranch: ${branch || 'main'}\n\n` +
    `Commits:\n${list}\n\n` +
    'Return JSON with this exact shape:\n' +
    '{\n' +
    '  "version": "suggested semver like 1.4.0 (optional, may be empty)",\n' +
    '  "title": "short human release title",\n' +
    '  "description": "1-2 sentence summary for end users",\n' +
    '  "category": "feature | improvement | bugfix | breaking",\n' +
    '  "items": {\n' +
    '    "added": ["..."],\n' +
    '    "changed": ["..."],\n' +
    '    "fixed": ["..."],\n' +
    '    "removed": ["..."],\n' +
    '    "deprecated": ["..."]\n' +
    '  }\n' +
    '}'
  )
}

function aiResultToDraft(result) {
  if (!result) return null
  const items = result.items || {}
  const join = (value) =>
    Array.isArray(value) ? value.filter(Boolean).join('\n') : String(value || '')
  return {
    version: result.version || '',
    title: result.title || '',
    description: result.description || '',
    category: ['feature', 'improvement', 'bugfix', 'breaking'].includes(result.category)
      ? result.category
      : 'feature',
    items_added: join(items.added),
    items_changed: join(items.changed),
    items_fixed: join(items.fixed),
    items_removed: join(items.removed),
    items_deprecated: join(items.deprecated),
  }
}

export function CommitChangelogDialog({ open, onOpenChange, product, onApply }) {
  const { isConfigured, config } = useLlmConfig()
  const [repo, setRepo] = useState('')
  const [branch, setBranch] = useState('main')
  const [token, setToken] = useState('')
  const [commits, setCommits] = useState([])
  const [selected, setSelected] = useState(() => new Set())
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    if (!q) return commits
    return commits.filter((c) => `${c.title} ${c.shortSha} ${c.author}`.toLowerCase().includes(q))
  }, [commits, query])

  const selectedCommits = useMemo(
    () => commits.filter((c) => selected.has(c.sha)),
    [commits, selected]
  )

  const fetchCommits = async (nextPage = 1) => {
    if (!repo.trim()) {
      toast.error('Enter a repository, e.g. owner/repo')
      return
    }
    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        repo: repo.trim(),
        branch: branch.trim(),
        page: String(nextPage),
        per_page: '50',
      })
      if (token.trim()) params.set('token', token.trim())

      const response = await fetch(`/api/studio/commits?${params.toString()}`)
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to load commits')

      setCommits((prev) => (nextPage === 1 ? data.commits : [...prev, ...data.commits]))
      setHasMore(Boolean(data.hasMore))
      setPage(nextPage)
      if (nextPage === 1 && data.commits.length === 0) {
        toast.message('No commits found for that branch.')
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const toggle = (sha) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(sha)) next.delete(sha)
      else next.add(sha)
      return next
    })
  }

  const toggleAllVisible = () => {
    setSelected((prev) => {
      const next = new Set(prev)
      const allSelected = filtered.every((c) => next.has(c.sha))
      filtered.forEach((c) => (allSelected ? next.delete(c.sha) : next.add(c.sha)))
      return next
    })
  }

  const applyDraft = (draft) => {
    onApply(draft)
    onOpenChange(false)
    toast.success('Changelog draft filled from commits')
  }

  const handleCombine = () => {
    if (selectedCommits.length === 0) {
      toast.error('Select at least one commit')
      return
    }
    applyDraft(combineCommits(selectedCommits))
  }

  const handleGenerate = async () => {
    if (selectedCommits.length === 0) {
      toast.error('Select at least one commit')
      return
    }
    if (!isConfigured) {
      toast.error('Connect an AI model first (AI Settings)')
      return
    }
    setIsGenerating(true)
    try {
      const text = await callLlmChat({
        config,
        temperature: 0.4,
        messages: [
          { role: 'system', content: AI_SYSTEM_PROMPT },
          { role: 'user', content: buildAiPrompt({ commits: selectedCommits, product, branch }) },
        ],
      })
      const draft = aiResultToDraft(extractJson(text))
      if (!draft) throw new Error('The model did not return valid changelog JSON. Try again.')
      applyDraft(draft)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsGenerating(false)
    }
  }

  const allVisibleSelected = filtered.length > 0 && filtered.every((c) => selected.has(c.sha))

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[88vh] max-w-2xl flex-col gap-4">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GitCommit className="h-4 w-4 text-indigo-400" />
            Build changelog from commits
          </DialogTitle>
          <DialogDescription>
            Pull commits from any GitHub repo and branch, pick the ones that matter, then combine or
            let AI turn them into release notes.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 sm:grid-cols-[1fr_160px]">
          <div className="space-y-1.5">
            <Label className="text-xs text-zinc-400">Repository</Label>
            <Input
              value={repo}
              onChange={(e) => setRepo(e.target.value)}
              placeholder="owner/repo or github.com URL"
              className={fieldClass}
              onKeyDown={(e) => e.key === 'Enter' && fetchCommits(1)}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-zinc-400">Branch</Label>
            <div className="relative">
              <GitBranch className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
              <Input
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                placeholder="main"
                className={`${fieldClass} pl-8`}
                onKeyDown={(e) => e.key === 'Enter' && fetchCommits(1)}
              />
            </div>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
          <div className="space-y-1.5">
            <Label className="text-xs text-zinc-400">GitHub token (optional — private repos / rate limits)</Label>
            <Input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="ghp_..."
              autoComplete="off"
              className={fieldClass}
            />
          </div>
          <div className="flex items-end">
            <Button type="button" onClick={() => fetchCommits(1)} disabled={isLoading} className="w-full sm:w-auto">
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Fetch commits'}
            </Button>
          </div>
        </div>

        {commits.length > 0 && (
          <>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Filter commits"
                  className={`${fieldClass} pl-9`}
                />
              </div>
              <Button type="button" variant="outline" size="sm" onClick={toggleAllVisible}>
                {allVisibleSelected ? 'Clear' : 'Select all'}
              </Button>
            </div>

            <ScrollArea className="h-[280px] rounded-md border border-zinc-800">
              <div className="divide-y divide-zinc-800/70">
                {filtered.map((commit) => {
                  const isSelected = selected.has(commit.sha)
                  return (
                    <button
                      key={commit.sha}
                      type="button"
                      onClick={() => toggle(commit.sha)}
                      className={`flex w-full items-start gap-3 px-3 py-2.5 text-left transition-colors hover:bg-zinc-800/50 ${
                        isSelected ? 'bg-indigo-500/10' : ''
                      }`}
                    >
                      <span
                        className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                          isSelected
                            ? 'border-indigo-500 bg-indigo-500 text-white'
                            : 'border-zinc-600 bg-transparent'
                        }`}
                      >
                        {isSelected && <Check className="h-3 w-3" />}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm text-zinc-100">{commit.title}</span>
                        <span className="mt-0.5 flex items-center gap-2 text-[11px] text-zinc-500">
                          <code className="rounded bg-zinc-800 px-1 text-zinc-400">{commit.shortSha}</code>
                          <span className="truncate">{commit.author}</span>
                          {commit.date && <span>· {new Date(commit.date).toLocaleDateString()}</span>}
                        </span>
                      </span>
                    </button>
                  )
                })}
              </div>
              {hasMore && (
                <div className="p-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="w-full"
                    onClick={() => fetchCommits(page + 1)}
                    disabled={isLoading}
                  >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Load more'}
                  </Button>
                </div>
              )}
            </ScrollArea>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <Badge variant="secondary" className="bg-zinc-800 text-zinc-300">
                {selected.size} selected
              </Badge>
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={handleCombine} disabled={selected.size === 0}>
                  <Wand2 className="h-4 w-4" />
                  Combine
                </Button>
                <Button
                  type="button"
                  onClick={handleGenerate}
                  disabled={selected.size === 0 || isGenerating}
                  title={isConfigured ? 'Generate with AI' : 'Connect an AI model first'}
                >
                  {isGenerating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                  Generate with AI
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
