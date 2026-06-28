import { readFileSync } from 'node:fs'
import pg from 'pg'
const env = {}
for (const line of readFileSync(new URL('../.env', import.meta.url), 'utf8').split('\n')) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
  if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, '')
}
const c = new pg.Client({ connectionString: env.DIRECT_URL })
await c.connect()
const q = (s, p) => c.query(s, p)

console.log('--- policies on organizations ---')
console.log((await q(`select policyname, cmd, roles, qual, with_check from pg_policies where tablename='organizations'`)).rows)

const UID = '77bc4a76-4959-4a23-a5ae-eaccdf731bb3'
async function asUser(uid) {
  await q(`select set_config('role','authenticated',true)`)
  await q(`select set_config('request.jwt.claims',$1,true)`, [JSON.stringify({ sub: uid, role: 'authenticated' })])
  await q(`select set_config('request.jwt.claim.sub',$1,true)`, [uid])
}

console.log('\n--- attempt insert as authenticated user, created_by = self (should pass) ---')
try {
  await q('BEGIN')
  await asUser(UID)
  console.log('auth.uid() =', (await q('select auth.uid() as u')).rows[0].u)
  console.log('current_user =', (await q('select current_user')).rows[0].current_user)
  console.log('jwt.claims =', (await q(`select current_setting('request.jwt.claims', true) as c`)).rows[0].c)
  const r = await q(
    `insert into public.organizations (name, description, slug, created_by, owner, is_active, metadata)
     values ('Diag Org','d','diag-org',$1,$1,true,$2) returning id`,
    [UID, JSON.stringify({ members: [UID] })]
  )
  console.log('INSERT OK, id=', r.rows[0].id)
  await q('RESET ROLE')
  await q('ROLLBACK')
} catch (e) {
  console.log('INSERT FAILED:', e.message)
  try { await q('RESET ROLE') } catch {}
  await q('ROLLBACK')
}

console.log('\n--- bare insert WITHOUT returning (isolate RETURNING/SELECT policy) ---')
try {
  await q('BEGIN')
  await asUser(UID)
  await q(
    `insert into public.organizations (name, description, slug, created_by, owner, is_active, metadata)
     values ('Diag Org2','d','diag-org2',$1,$1,true,$2)`,
    [UID, JSON.stringify({ members: [UID] })]
  )
  console.log('BARE INSERT OK (no returning)')
  await q('RESET ROLE'); await q('ROLLBACK')
} catch (e) {
  console.log('BARE INSERT FAILED:', e.message)
  try { await q('RESET ROLE') } catch {}; await q('ROLLBACK')
}

console.log('\n--- triggers on organizations ---')
console.log((await q(`select tgname, pg_get_triggerdef(oid) as def from pg_trigger where tgrelid='public.organizations'::regclass and not tgisinternal`)).rows)

console.log('\n--- check authenticated grants on organizations ---')
console.log((await q(`select grantee, privilege_type from information_schema.role_table_grants where table_schema='public' and table_name='organizations' and grantee in ('authenticated','anon')`)).rows)

await c.end()
