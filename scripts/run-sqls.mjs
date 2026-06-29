// Runs every .sql file under supabase/sqls/ in directory-then-filename order.
// Each file is applied in its own transaction and rolled back on error.
//
// Usage: npm run db:push
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'
import pg from 'pg'

const SQLS_DIR = resolve('supabase/sqls')

function collectSqlFiles(dir) {
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

const files = collectSqlFiles(SQLS_DIR)
if (!files.length) {
  console.log('No SQL files found in supabase/sqls/.')
  process.exit(0)
}

console.log(`Found ${files.length} file${files.length === 1 ? '' : 's'}.\n`)

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
