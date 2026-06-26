// Apply a migration file inside ONE transaction, then verify real-user access
// under RLS before committing. Rolls back everything (including backfills) if a
// real owner would lose visibility or isolation is breached.
//
// Usage: node scripts/apply-migration.mjs supabase/migrations/0002_org_abilities_rls.sql
import { readFileSync } from 'node:fs'
import pg from 'pg'

const env = {}
for (const line of readFileSync(new URL('../.env', import.meta.url), 'utf8').split('\n')) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
  if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, '')
}

const file = process.argv[2]
if (!file) {
  console.error('Pass a migration file path.')
  process.exit(1)
}
const sql = readFileSync(new URL(`../${file}`, import.meta.url), 'utf8')

const OWNER = '39149c4b-526f-445b-8a8c-ea3898e9c50c' // Geiger Studios owner
const OTHER = '77bc4a76-4959-4a23-a5ae-eaccdf731bb3' // unrelated user
const ORG = 'fcc95889-9832-4072-a34f-3c3ce55d8893'

const client = new pg.Client({ connectionString: env.DIRECT_URL })
await client.connect()

async function asUser(uid) {
  await client.query(`select set_config('role','authenticated',true)`)
  const claims = JSON.stringify({ sub: uid, role: 'authenticated' })
  await client.query(`select set_config('request.jwt.claims',$1,true)`, [claims])
  await client.query(`select set_config('request.jwt.claim.sub',$1,true)`, [uid])
}
const count = async (sql, params) => (await client.query(sql, params)).rows[0].n

try {
  await client.query('BEGIN')
  console.log('Applying migration…')
  await client.query(sql)
  console.log('Migration statements applied. Verifying under RLS…\n')

  // ---- as the real owner ----
  await asUser(OWNER)
  const ownerOrgs = await count('select count(*)::int n from public.organizations')
  const ownerProjects = await count('select count(*)::int n from public.projects')
  const ownerLinks = await count('select count(*)::int n from public.organization_project where organisition=$1', [ORG])
  const ownerPlans = await count('select count(*)::int n from public.plan where organisation=$1', [ORG])
  const ability = (await client.query(`select public.has_org_ability($1,'org.update') as a`, [ORG])).rows[0].a
  console.log(`owner: orgs=${ownerOrgs} projects=${ownerProjects} links=${ownerLinks} plans=${ownerPlans} org.update=${ability}`)

  // ---- as an unrelated user (isolation) ----
  await asUser(OTHER)
  const otherOrgs = await count('select count(*)::int n from public.organizations')
  const otherProjects = await count('select count(*)::int n from public.projects')
  console.log(`other: orgs=${otherOrgs} projects=${otherProjects}`)

  // ---- find/join RPC as the other user ----
  await asUser(OTHER)
  const found = (await client.query(`select * from public.find_organization($1)`, [ORG])).rows
  console.log(`other find_organization(by id): ${found.length} row(s)`, found[0] || '')

  await client.query('RESET ROLE')

  const failures = []
  if (ownerOrgs < 1) failures.push('owner cannot see their organization')
  if (ownerProjects < 1) failures.push('owner cannot see backfilled projects')
  if (ownerLinks < 1) failures.push('owner cannot see organization_project rows')
  if (ownerPlans < 1) failures.push('owner cannot see plan rows')
  if (ability !== true) failures.push('owner lost org.update ability')
  if (otherOrgs !== 0) failures.push(`isolation breach: other user sees ${otherOrgs} orgs`)
  if (found.length !== 1) failures.push('find_organization RPC did not return the org for a non-member')

  if (failures.length) {
    console.error('\n❌ Verification FAILED — rolling back:')
    failures.forEach((f) => console.error('   - ' + f))
    await client.query('ROLLBACK')
    process.exitCode = 1
  } else {
    await client.query('COMMIT')
    console.log('\n✅ Verification passed. Committed.')
  }
} catch (err) {
  console.error('\n❌ Error — rolling back:', err.message)
  try { await client.query('ROLLBACK') } catch {}
  process.exitCode = 1
} finally {
  await client.end()
}
