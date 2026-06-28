// One-off: dump the geiger-flow ability/RLS implementation from the live DB so
// we can mirror it for the public org tables. Read-only.
import { readFileSync } from 'node:fs'
import pg from 'pg'

const env = {}
for (const line of readFileSync(new URL('../.env', import.meta.url), 'utf8').split('\n')) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
  if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, '')
}

const client = new pg.Client({ connectionString: env.DIRECT_URL })
await client.connect()
const q = (sql, p) => client.query(sql, p).then((r) => r.rows)

console.log('=== FUNCTIONS in flow schema (full source) ===')
const fns = await q(`
  select p.proname, pg_get_functiondef(p.oid) as def
  from pg_proc p join pg_namespace n on n.oid = p.pronamespace
  where n.nspname = 'flow' order by p.proname`)
for (const f of fns) {
  console.log(`\n----- flow.${f.proname} -----`)
  console.log(f.def)
}

console.log('\n\n=== functions in public that look ability/membership related ===')
const pubFns = await q(`
  select p.proname, pg_get_functiondef(p.oid) as def
  from pg_proc p join pg_namespace n on n.oid = p.pronamespace
  where n.nspname = 'public'
    and (p.proname ilike '%abilit%' or p.proname ilike '%member%' or p.proname ilike '%org%' or p.proname ilike '%role%')
  order by p.proname`)
for (const f of pubFns) {
  console.log(`\n----- public.${f.proname} -----`)
  console.log(f.def)
}

console.log('\n\n=== flow.role_ability rows ===')
console.log(JSON.stringify(await q(`select * from flow.role_ability limit 200`), null, 2))

console.log('\n=== flow.open_module rows ===')
console.log(JSON.stringify(await q(`select * from flow.open_module`), null, 2))

console.log('\n=== distinct abilities referenced in flow policies ===')
const pol = await q(`select schemaname, tablename, policyname, cmd, qual, with_check from pg_policies where schemaname='flow' order by tablename, policyname`)
console.log(JSON.stringify(pol, null, 2))

console.log('\n=== public.organization_users sample + Role enum ===')
console.log(JSON.stringify(await q(`select * from public.organization_users limit 20`), null, 2))
console.log(JSON.stringify(await q(`select enumlabel from pg_enum e join pg_type t on t.oid=e.enumtypid where t.typname='Role' order by e.enumsortorder`), null, 2))

await client.end()
