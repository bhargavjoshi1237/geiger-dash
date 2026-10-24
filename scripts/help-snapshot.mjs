// Read-only snapshot of the live Help Center, so a content migration builds on what is published rather than on an old file.
// Run: node --env-file=.env scripts/help-snapshot.mjs              (every page and what last wrote it)
//      node --env-file=.env scripts/help-snapshot.mjs flow/tasks   (one page, its full section HTML and the showcases its app offers)
//      node --env-file=.env scripts/help-snapshot.mjs --components (every embeddable component and where it is used)
import { existsSync } from 'node:fs'
import pg from 'pg'

// The registries are typeless ES modules; Node's reparse warning is noise here.
process.removeAllListeners('warning')
const { HELP_SHOWCASES } = await import('../lib/docs/showcases.js')
const { SANDBOX_APP_IDS } = await import('../components/why-geiger/why_geiger_content.js')

const arg = process.argv[2]
const db = new pg.Client({ connectionString: process.env.DIRECT_URL, ssl: { rejectUnauthorized: false } })
await db.connect()
await db.query('begin read only')
const q = (sql, params) => db.query(sql, params).then((result) => result.rows)

// A migration's rows share its transaction's now(), so they carry its exact applied_at; any other timestamp is a Studio save.
const WRITTEN_BY = `coalesce(
  (select m.version || '_' || m.name from public.geiger_migrations m where m.applied_at = last_edit limit 1),
  'Studio'
)`
const PAGE_EDIT = `greatest(p.updated_at, (select max(b.updated_at) from public.docs_content_blocks b where b.page_id = p.id))`

// "flow/tasks" -> "flow", "products/notes" -> "notes".
const appOf = (slug) => {
  const [first, second] = String(slug).split('/')
  return first === 'products' ? second : first
}

// Component ids a product serves at /<app>/playground/<component>, read from its sibling repo when it is checked out.
async function productComponentIds(app) {
  const file = `C:/Pro/geiger-${app}/components/landing/playground/playground_components.js`
  if (!existsSync(file)) return null
  const { PLAYGROUND_COMPONENT_IDS = [] } = await import(`file:///${file}`)
  return PLAYGROUND_COMPONENT_IDS
}

async function listPages() {
  const pages = await q(
    `select slug, "group", status, preview, sections, ${WRITTEN_BY} as written_by
     from (
       select p.slug, g.title as "group", g.sort_order as group_order, p.sort_order, p.status, p.preview,
              (select count(*)::int from public.docs_content_blocks b where b.page_id = p.id) as sections,
              ${PAGE_EDIT} as last_edit
       from public.docs_pages p join public.docs_nav_groups g on g.id = p.nav_group_id
       where p.deleted_at is null
     ) pages
     order by group_order, sort_order`,
  )
  console.table(pages)
}

async function showPage(slug) {
  const [page] = await q(
    `select *, ${WRITTEN_BY} as written_by
     from (
       select p.id, p.slug, g.slug as group_slug, p.parent_id, p.title, p.nav_label, p.description, p.status,
              p.preview, p.sort_order, p.published_at, ${PAGE_EDIT} as last_edit
       from public.docs_pages p join public.docs_nav_groups g on g.id = p.nav_group_id
       where p.slug = $1 and p.deleted_at is null
     ) page`,
    [slug],
  )
  if (!page) {
    console.log(`No live page at "${slug}".`)
    return
  }

  const sections = await q(
    `select anchor_id, eyebrow, title, content, cards, features, links, showcase, sort_order
     from public.docs_content_blocks where page_id = $1 order by sort_order`,
    [page.id],
  )
  console.log(JSON.stringify({ page, sections }, null, 2))
  console.log(
    page.written_by === 'Studio'
      ? '\nLast edited in Studio: base your migration (and its @down) on the HTML above, not on an older migration file.'
      : `\nLast written by ${page.written_by}: that file matches what is live.`,
  )

  const app = appOf(slug)
  const used = new Set(sections.map((section) => section.showcase).filter(Boolean))
  const offered = HELP_SHOWCASES.filter((showcase) => showcase.app.toLowerCase() === app)
  console.log(`\nWhole-app preview for "${app}": ${SANDBOX_APP_IDS.includes(app) ? 'available (home and overview pages only)' : 'none'}`)
  console.log(`Showcases registered for "${app}": ${offered.length}`)
  for (const showcase of offered) {
    console.log(`  ${used.has(showcase.id) ? 'used  ' : 'unused'} ${showcase.id} (${showcase.label})`)
  }
}

async function showComponents() {
  const usage = await q(
    `select b.showcase, p.slug, b.anchor_id, p.status
     from public.docs_content_blocks b join public.docs_pages p on p.id = b.page_id
     where b.showcase is not null and p.deleted_at is null order by p.slug, b.sort_order`,
  )
  const previews = await q(
    `select slug, preview, status from public.docs_pages where preview is not null and deleted_at is null order by slug`,
  )

  console.log('Whole-app previews (docs_pages.preview, home and overview pages only)')
  console.log(`  Available: ${SANDBOX_APP_IDS.join(', ')}`)
  for (const page of previews) {
    const flag = SANDBOX_APP_IDS.includes(page.preview) ? '' : '  <- not a sandbox app, renders nothing'
    console.log(`  ${page.slug} (${page.status}) uses ${page.preview}${flag}`)
  }

  console.log(`\nSection showcases registered in lib/docs/showcases.js: ${HELP_SHOWCASES.length}`)
  for (const showcase of HELP_SHOWCASES) {
    const where = usage.filter((row) => row.showcase === showcase.id).map((row) => `${row.slug}#${row.anchor_id}`)
    const size = `${showcase.viewport.width}x${showcase.viewport.height}${showcase.floating ? ', floating' : ''}`
    console.log(`  ${showcase.id} (${showcase.label}, ${size}): ${where.length ? where.join(', ') : 'unused'}`)
  }

  const unknown = usage.filter((row) => !HELP_SHOWCASES.some((showcase) => showcase.id === row.showcase))
  if (unknown.length) {
    console.log('\nSections naming an unregistered showcase (they render without it):')
    for (const row of unknown) console.log(`  ${row.slug}#${row.anchor_id} -> ${row.showcase}`)
  }

  console.log('\nComponents products serve that Dash has not registered yet:')
  const apps = [...new Set([...SANDBOX_APP_IDS, ...HELP_SHOWCASES.map((showcase) => showcase.app.toLowerCase())])]
  for (const app of apps) {
    const ids = await productComponentIds(app)
    if (!ids) {
      console.log(`  ${app}: no component routes (only the whole-app playground, if any)`)
      continue
    }
    const missing = ids.filter((id) => !HELP_SHOWCASES.some((showcase) => showcase.id === `${app}/${id}`))
    console.log(`  ${app}: ${missing.length ? missing.join(', ') : 'all registered'}`)
  }
}

try {
  if (arg === '--components') await showComponents()
  else if (arg) await showPage(arg)
  else await listPages()
} finally {
  await db.query('rollback')
  await db.end()
}
