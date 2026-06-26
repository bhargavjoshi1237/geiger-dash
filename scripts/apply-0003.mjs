import { readFileSync } from 'node:fs'
import pg from 'pg'
const env = {}
for (const line of readFileSync(new URL('../.env', import.meta.url), 'utf8').split('\n')) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
  if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, '')
}
const sql = readFileSync(new URL('../supabase/migrations/0003_create_organization_rpc.sql', import.meta.url), 'utf8')
const c = new pg.Client({ connectionString: env.DIRECT_URL })
await c.connect()
const q = (s, p) => c.query(s, p)
const UID = '77bc4a76-4959-4a23-a5ae-eaccdf731bb3'

// 1. Persist the function.
await q('BEGIN')
await q(sql)
await q('COMMIT')
console.log('Function created/replaced.')

// 2. Verify it works via the previously-failing returning path; roll back the test org.
await q('BEGIN')
await q(`select set_config('role','authenticated',true)`)
await q(`select set_config('request.jwt.claims',$1,true)`, [JSON.stringify({ sub: UID, role: 'authenticated' })])
await q(`select set_config('request.jwt.claim.sub',$1,true)`, [UID])
const r = await q(`select * from public.create_organization('Diag Wizard Org','hello')`)
console.log('create_organization returned:', r.rows[0])
const ou = await q(`select count(*)::int n from public.organization_users where organization=$1 and "user"=$2`, [r.rows[0].id, UID])
console.log('organization_users row created:', ou.rows[0].n === 1)
await q('RESET ROLE')
await q('ROLLBACK')
console.log('Test org rolled back (not persisted).')
await c.end()
