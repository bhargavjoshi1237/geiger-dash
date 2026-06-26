// One-off: introspect the live Supabase Postgres and write a schema snapshot.
// Reads DATABASE_URL from .env. Run: node scripts/snapshot-schema.mjs
import { readFileSync, writeFileSync } from 'node:fs'
import pg from 'pg'

// Minimal .env parser (avoid extra deps).
const env = {}
for (const line of readFileSync(new URL('../.env', import.meta.url), 'utf8').split('\n')) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
  if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, '')
}

const client = new pg.Client({ connectionString: env.DATABASE_URL })
await client.connect()

const q = (sql) => client.query(sql).then((r) => r.rows)

// User schemas only (skip pg internals + supabase plumbing).
const skip = `('pg_catalog','information_schema','pg_toast','extensions','graphql','graphql_public','pgbouncer','pgsodium','pgsodium_masks','vault','realtime','supabase_functions','supabase_migrations','net','cron')`

const schemas = await q(`select nspname from pg_namespace where nspname not like 'pg_%' and nspname not in ${skip} order by 1`)

const columns = await q(`
  select table_schema, table_name, column_name, data_type, udt_name,
         is_nullable, column_default, ordinal_position
  from information_schema.columns
  where table_schema not in ${skip} and table_schema not like 'pg_%'
  order by table_schema, table_name, ordinal_position`)

const tables = await q(`
  select schemaname, tablename from pg_tables
  where schemaname not in ${skip} and schemaname not like 'pg_%'
  order by 1,2`)

const pks = await q(`
  select tc.table_schema, tc.table_name, kcu.column_name
  from information_schema.table_constraints tc
  join information_schema.key_column_usage kcu
    on tc.constraint_name = kcu.constraint_name and tc.table_schema = kcu.table_schema
  where tc.constraint_type = 'PRIMARY KEY' and tc.table_schema not in ${skip}
  order by 1,2, kcu.ordinal_position`)

const fks = await q(`
  select tc.table_schema, tc.table_name, kcu.column_name,
         ccu.table_schema as f_schema, ccu.table_name as f_table, ccu.column_name as f_column
  from information_schema.table_constraints tc
  join information_schema.key_column_usage kcu
    on tc.constraint_name = kcu.constraint_name and tc.table_schema = kcu.table_schema
  join information_schema.constraint_column_usage ccu
    on ccu.constraint_name = tc.constraint_name and ccu.table_schema = tc.table_schema
  where tc.constraint_type = 'FOREIGN KEY' and tc.table_schema not in ${skip}
  order by 1,2,3`)

const checks = await q(`
  select n.nspname as schema, t.relname as table_name, c.conname, pg_get_constraintdef(c.oid) as def
  from pg_constraint c
  join pg_class t on t.oid = c.conrelid
  join pg_namespace n on n.oid = t.relnamespace
  where c.contype = 'c' and n.nspname not in ${skip}
  order by 1,2,3`)

const indexes = await q(`
  select schemaname, tablename, indexname, indexdef from pg_indexes
  where schemaname not in ${skip} and schemaname not like 'pg_%'
  order by 1,2,3`)

const enums = await q(`
  select n.nspname as schema, t.typname as name, string_agg(e.enumlabel, ', ' order by e.enumsortorder) as values
  from pg_type t join pg_enum e on e.enumtypid = t.oid
  join pg_namespace n on n.oid = t.typnamespace
  where n.nspname not in ${skip}
  group by 1,2 order by 1,2`)

const funcs = await q(`
  select n.nspname as schema, p.proname as name,
         pg_get_function_arguments(p.oid) as args
  from pg_proc p join pg_namespace n on n.oid = p.pronamespace
  where n.nspname not in ${skip} and n.nspname not like 'pg_%'
  order by 1,2`)

const rls = await q(`
  select n.nspname as schema, c.relname as table_name, c.relrowsecurity as rls_enabled
  from pg_class c join pg_namespace n on n.oid = c.relnamespace
  where c.relkind = 'r' and n.nspname not in ${skip}
  order by 1,2`)

const policies = await q(`
  select schemaname, tablename, policyname, cmd, roles, qual, with_check
  from pg_policies where schemaname not in ${skip} order by 1,2,3`)

// rough row counts
const counts = {}
for (const t of tables) {
  try {
    const r = await q(`select count(*)::int as n from "${t.schemaname}"."${t.tablename}"`)
    counts[`${t.schemaname}.${t.tablename}`] = r[0].n
  } catch { counts[`${t.schemaname}.${t.tablename}`] = '?' }
}

await client.end()

// ---- render markdown ----
const out = []
out.push('# Database Schema Snapshot')
out.push(`\nProject: \`${env.NEXT_PUBLIC_SUPABASE_URL}\``)
out.push(`Captured via DATABASE_URL pooler. User schemas only (Supabase/system schemas excluded).\n`)

out.push('## Schemas\n')
out.push(schemas.map((s) => `- \`${s.nspname}\``).join('\n') || '_none_')

const pkMap = {}
for (const p of pks) (pkMap[`${p.table_schema}.${p.table_name}`] ??= []).push(p.column_name)
const fkMap = {}
for (const f of fks) (fkMap[`${f.table_schema}.${f.table_name}`] ??= []).push(f)
const ckMap = {}
for (const c of checks) (ckMap[`${c.schema}.${c.table_name}`] ??= []).push(c)
const idxMap = {}
for (const i of indexes) (idxMap[`${i.schemaname}.${i.tablename}`] ??= []).push(i)
const rlsMap = {}
for (const r of rls) rlsMap[`${r.schema}.${r.table_name}`] = r.rls_enabled
const polMap = {}
for (const p of policies) (polMap[`${p.schemaname}.${p.tablename}`] ??= []).push(p)

const colMap = {}
for (const c of columns) (colMap[`${c.table_schema}.${c.table_name}`] ??= []).push(c)

out.push('\n## Tables\n')
for (const t of tables) {
  const key = `${t.schemaname}.${t.tablename}`
  out.push(`### \`${key}\`  ·  ${counts[key]} rows  ·  RLS ${rlsMap[key] ? 'ON' : 'off'}\n`)
  out.push('| column | type | null | default |')
  out.push('|---|---|---|---|')
  for (const c of colMap[key] || []) {
    const type = c.data_type === 'USER-DEFINED' ? c.udt_name : c.data_type
    const pk = (pkMap[key] || []).includes(c.column_name) ? ' 🔑' : ''
    out.push(`| ${c.column_name}${pk} | ${type} | ${c.is_nullable === 'YES' ? 'yes' : 'no'} | ${c.column_default ? '`' + c.column_default.replace(/\|/g, '\\|') + '`' : ''} |`)
  }
  if (pkMap[key]) out.push(`\n**PK:** ${pkMap[key].join(', ')}`)
  if (fkMap[key]) {
    out.push('\n**Foreign keys:**')
    for (const f of fkMap[key]) out.push(`- ${f.column_name} → \`${f.f_schema}.${f.f_table}.${f.f_column}\``)
  }
  if (ckMap[key]) {
    out.push('\n**Checks:**')
    for (const c of ckMap[key]) out.push(`- ${c.conname}: \`${c.def}\``)
  }
  if (idxMap[key]) {
    out.push('\n**Indexes:**')
    for (const i of idxMap[key]) out.push(`- \`${i.indexdef}\``)
  }
  if (polMap[key]) {
    out.push('\n**RLS policies:**')
    for (const p of polMap[key]) out.push(`- ${p.policyname} (${p.cmd}) roles=${p.roles}${p.qual ? ' using=`' + p.qual + '`' : ''}${p.with_check ? ' check=`' + p.with_check + '`' : ''}`)
  }
  out.push('')
}

if (enums.length) {
  out.push('## Enums\n')
  for (const e of enums) out.push(`- \`${e.schema}.${e.name}\`: ${e.values}`)
  out.push('')
}

if (funcs.length) {
  out.push('## Functions\n')
  for (const f of funcs) out.push(`- \`${f.schema}.${f.name}(${f.args})\``)
  out.push('')
}

writeFileSync(new URL('../schema-snapshot.md', import.meta.url), out.join('\n'))
console.log('Wrote schema-snapshot.md')
console.log('Schemas:', schemas.map((s) => s.nspname).join(', '))
console.log('Tables:', tables.length)
