// Runs .sql files against DIRECT_URL, each in its own transaction (rolled back
// on error).
//
// Usage:
//   npm run db:push            # supabase/sqls/ only (base schema, per-area DDL)
//   npm run db:push -- --all   # also apply supabase/migrations/ (RLS + RPC layer)
//
// The org authorization layer (abilities, RLS policies, join/invite RPCs) lives
// in supabase/migrations/ and depends on the base tables created under
// supabase/sqls/. With --all we therefore apply sqls/ first, then migrations/,
// each tree in filename order. Every file there is idempotent, so re-applying is
// safe.
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'
import pg from 'pg'

const SQLS_DIR = resolve('supabase/sqls')
const MIGRATIONS_DIR = resolve('supabase/migrations')

const includeAll = process.argv.slice(2).includes('--all')

function collectSqlFiles(dir) {
  if (!existsSync(dir)) return []
  const files = []
  for (const entry of readdirSync(dir).sort()) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) {
      files.push(...collectSqlFiles(full))
    } else if (entry.endsWith('.sql')) {
      files.push(full)
    }
  }
  return files
}

const url = process.env.DIRECT_URL
if (!url) {
  console.error('Error: DIRECT_URL is not set in .env')
  process.exit(1)
}

// Base schema first, then (with --all) the migrations layer that builds on it.
const files = collectSqlFiles(SQLS_DIR)
if (includeAll) {
  files.push(...collectSqlFiles(MIGRATIONS_DIR))
}

if (!files.length) {
  console.log('No SQL files found.')
  process.exit(0)
}

console.log(
  `Found ${files.length} file${files.length === 1 ? '' : 's'}` +
    `${includeAll ? ' (sqls/ + migrations/)' : ' (sqls/ only — pass --all to include migrations/)'}.\n`,
)

const client = new pg.Client({ connectionString: url })
await client.connect()

let applied = 0
for (const file of files) {
  const label = relative(resolve('.'), file).replace(/\\/g, '/')
  const sql = readFileSync(file, 'utf8').trim()
  if (!sql) { console.log(`  skip  ${label} (empty)`); continue }
  try {
    await client.query('BEGIN')
    await client.query(sql)
    await client.query('COMMIT')
    console.log(`  ✓  ${label}`)
    applied++
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {})
    console.error(`  ✗  ${label}\n     ${err.message}`)
    await client.end()
    process.exit(1)
  }
}

await client.end()
console.log(`\n${applied} file${applied === 1 ? '' : 's'} applied.`)
