import { createHash } from 'node:crypto'
import { extractJson } from '@/lib/blog-automation/llm'
import { summarizeChanges } from '@/lib/changelog/diff'
import { callChatCompletion } from '@/lib/llm/chat-completions'
import { buildUserPrompt, formatCommits, getChangelogPrompts, productDisplayName } from '@/lib/changelog/prompts'

// Mirrors the dash_changelog_product_check constraint (20260718044511_changelog_products.sql).
export const CHANGELOG_PRODUCTS = [
  'geiger-assets',
  'geiger-campaign',
  'geiger-canvas',
  'geiger-chat',
  'geiger-content',
  'geiger-dash',
  'geiger-docs',
  'geiger-events',
  'geiger-flow',
  'geiger-forms',
  'geiger-grey',
  'geiger-notes',
  'geiger-office',
]

const CATEGORIES = ['feature', 'improvement', 'bugfix', 'breaking']
const ITEM_TYPES = ['added', 'changed', 'fixed', 'removed', 'deprecated']
const SKIP_MARKER = /\[(skip changelog|changelog skip|no changelog)\]/i
const MAX_COMMITS = 100
const MAX_ITEMS_PER_TYPE = 6

// Any OpenAI-compatible /chat/completions provider, configured through Vercel env.
export function getChangelogLlmConfig() {
  const baseUrl = process.env.CHANGELOG_LLM_BASE_URL
  const apiKey = process.env.CHANGELOG_LLM_API_KEY
  const model = process.env.CHANGELOG_LLM_MODEL
  if (!baseUrl || !apiKey || !model) {
    throw new Error('Configure CHANGELOG_LLM_BASE_URL, CHANGELOG_LLM_API_KEY, and CHANGELOG_LLM_MODEL.')
  }
  return { baseUrl, apiKey, model }
}

// Stable uuid per (product, head sha) so a re-run of the same push never duplicates the entry.
function entryIdFor(product, headSha) {
  const hex = createHash('sha256').update(`changelog:${product}:${headSha}`).digest('hex')
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-4${hex.slice(13, 16)}-a${hex.slice(17, 20)}-${hex.slice(20, 32)}`
}

// Normalizes push-payload commits and drops merges and opted-out commits.
export function normalizeCommits(commits) {
  return (Array.isArray(commits) ? commits : [])
    .map((commit) => {
      const message = String(commit?.message || '').trim()
      const [title = '', ...rest] = message.split('\n')
      return {
        sha: String(commit?.id || commit?.sha || ''),
        title: title.trim(),
        body: rest.join('\n').trim(),
        author: String(commit?.author?.name || commit?.author || ''),
      }
    })
    .filter((commit) => commit.title && !/^Merge (branch|pull request|remote-tracking)/i.test(commit.title))
    .filter((commit) => !SKIP_MARKER.test(`${commit.title}\n${commit.body}`))
    .slice(-MAX_COMMITS)
}

function cleanSentence(value) {
  const text = String(value || '').replace(/\s+/g, ' ').trim().replace(/^[-*•]\s*/, '')
  if (!text) return ''
  const capitalized = text.charAt(0).toUpperCase() + text.slice(1)
  return /[.!?]$/.test(capitalized) ? capitalized : `${capitalized}.`
}

// Keeps whole sentences up to the limit so an over-long summary never renders as a wall of text.
function clampSentences(text, limit = 280) {
  if (text.length <= limit) return text
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text]
  let out = ''
  for (const sentence of sentences) {
    if ((out + sentence).trim().length > limit) break
    out += sentence
  }
  return out.trim() || sentences[0].trim()
}

function toItems(result) {
  const items = result?.items || {}
  const seen = new Set()
  return ITEM_TYPES.flatMap((type) =>
    (Array.isArray(items[type]) ? items[type] : [])
      .map(cleanSentence)
      .filter((description) => {
        const key = description.toLowerCase()
        if (!description || seen.has(key)) return false
        seen.add(key)
        return true
      })
      .slice(0, MAX_ITEMS_PER_TYPE)
      .map((description) => ({ type, description }))
  )
}

// Features and breaking changes bump the minor version, everything else the patch.
function nextVersion(previous, category) {
  const match = String(previous || '').match(/(\d+)\.(\d+)\.(\d+)/)
  if (!match) return '0.1.0'
  const [major, minor, patch] = match.slice(1).map(Number)
  if (category === 'feature' || category === 'breaking') return `${major}.${minor + 1}.0`
  return `${major}.${minor}.${patch + 1}`
}

async function latestVersion(supabase, product) {
  const { data, error } = await supabase
    .from('dash_changelog')
    .select('version')
    .eq('product', product)
    .order('release_date', { ascending: false })
    .limit(1)
    .maybeSingle()
  if (error) throw new Error(error.message)
  return data?.version || ''
}

// Asks the LLM for an entry from already-normalized commits; returns null when it opts to skip.
// `changes` is the raw diff from the workflow: { nameStatus, patch } (both optional).
export async function draftChangelogEntry({ product, branch, commits, previousVersion, changes }) {
  const prompts = getChangelogPrompts()
  const userPrompt = buildUserPrompt(prompts.user, {
    product,
    productName: productDisplayName(product),
    branch: branch || 'main',
    previousVersion: previousVersion || 'none (first release)',
    commitCount: commits.length,
    commits: formatCommits(commits),
    changes: summarizeChanges(changes || {}) || 'Not provided; rely on the commit messages.',
  })

  const text = await callChatCompletion(
    getChangelogLlmConfig(),
    [
      { role: 'system', content: prompts.system },
      { role: 'user', content: userPrompt },
    ],
    { title: 'Geiger Changelog' }
  )
  // Some reasoning models inline their thinking ahead of the JSON answer.
  const result = extractJson(text.replace(/<think>[\s\S]*?<\/think>/gi, ''))
  if (!result) throw new Error('LLM response was not valid JSON.')
  if (result.skip === true) return null

  const title = String(result.title || '').replace(/\s+/g, ' ').trim().replace(/[.\s]+$/, '')
  const description = clampSentences(cleanSentence(result.description))
  if (!title || !description) throw new Error('LLM response is missing a title or description.')

  const items = toItems(result)
  const category = CATEGORIES.includes(result.category) ? result.category : 'improvement'
  return { title, description, category, items }
}

// Turns one push into a published changelog entry; returns why it skipped otherwise.
export async function generateChangelogFromPush({ supabase, product, branch, headSha, commits, changes }) {
  const relevant = normalizeCommits(commits)
  if (relevant.length === 0) return { status: 'skipped', reason: 'no-relevant-commits' }

  const id = entryIdFor(product, headSha)
  const { data: existing } = await supabase.from('dash_changelog').select('id, version').eq('id', id).maybeSingle()
  if (existing) return { status: 'skipped', reason: 'already-recorded', id, version: existing.version }

  const previousVersion = await latestVersion(supabase, product)
  const entry = await draftChangelogEntry({ product, branch, commits: relevant, previousVersion, changes })
  if (!entry) return { status: 'skipped', reason: 'no-user-facing-changes' }

  const { title, description, category, items } = entry
  const version = nextVersion(previousVersion, category)

  const { error: insertError } = await supabase
    .from('dash_changelog')
    .insert({ id, version, title, description, category, product, release_date: new Date().toISOString() })
  if (insertError) throw new Error(insertError.message)

  if (items.length > 0) {
    const { error: itemsError } = await supabase
      .from('dash_changelog_items')
      .insert(items.map((item) => ({ ...item, changelog_id: id })))
    if (itemsError) {
      await supabase.from('dash_changelog').delete().eq('id', id)
      throw new Error(itemsError.message)
    }
  }

  return { status: 'created', id, version, title, category, items: items.length, commits: relevant.length }
}
