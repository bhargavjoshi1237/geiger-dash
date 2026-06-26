import { readFileSync } from 'node:fs'
import pg from 'pg'
const env = {}
for (const line of readFileSync(new URL('../.env', import.meta.url), 'utf8').split('\n')) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
  if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, '')
}
const sql = readFileSync(new URL('../supabase/migrations/0004_org_invites.sql', import.meta.url), 'utf8')
const c = new pg.Client({ connectionString: env.DIRECT_URL })
await c.connect()
const q = (s, p) => c.query(s, p)
const OWNER = '39149c4b-526f-445b-8a8c-ea3898e9c50c'
const OTHER = '77bc4a76-4959-4a23-a5ae-eaccdf731bb3'
const ORG = 'fcc95889-9832-4072-a34f-3c3ce55d8893'
async function asUser(uid) {
  await q(`select set_config('role','authenticated',true)`)
  await q(`select set_config('request.jwt.claims',$1,true)`, [JSON.stringify({ sub: uid, role: 'authenticated' })])
  await q(`select set_config('request.jwt.claim.sub',$1,true)`, [uid])
}

await q('BEGIN'); await q(sql); await q('COMMIT')
console.log('Migration 0004 applied.')

await q('BEGIN')
await asUser(OWNER)
const inv = await q(`select * from public.invite_to_organization($1, $2::text[], 'User')`, [ORG, ['Test.User@Example.com', 'bad', '']])
console.log('invite_to_organization →', inv.rows)
const tok = inv.rows[0]?.token
const preview = await q(`select * from public.get_invite($1)`, [tok])
console.log('get_invite →', preview.rows[0])
await asUser(OTHER)
const acc = await q(`select * from public.accept_invite($1)`, [tok])
console.log('accept_invite (as other user) →', acc.rows[0])
const member = await q(`select count(*)::int n from public.organization_users where organization=$1 and "user"=$2`, [ORG, OTHER])
console.log('membership row for accepting user:', member.rows[0].n === 1)
await q('RESET ROLE'); await q('ROLLBACK')
console.log('Smoke test rolled back (not persisted).')
await c.end()
