// Read-only: assess RLS impact on existing rows before enabling it.
import { readFileSync } from 'node:fs'
import pg from 'pg'

const env = {}
for (const line of readFileSync(new URL('../.env', import.meta.url), 'utf8').split('\n')) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
  if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, '')
}
const client = new pg.Client({ connectionString: env.DIRECT_URL })
await client.connect()
const q = (sql) => client.query(sql).then((r) => r.rows)

console.log('organizations:')
console.log(JSON.stringify(await q(`select id, name, created_by, owner, slug, metadata, deleted_at from public.organizations`), null, 2))

console.log('\norganization_users:')
console.log(JSON.stringify(await q(`select * from public.organization_users`), null, 2))

console.log('\nprojects (org link presence):')
console.log(JSON.stringify(await q(`select id, name, organization_id, created_by, deleted_at from public.projects`), null, 2))

console.log('\norganization_project:')
console.log(JSON.stringify(await q(`select id, project, organisition, plan from public.organization_project`), null, 2))

console.log('\nplan:')
console.log(JSON.stringify(await q(`select id, organisation from public.plan`), null, 2))

console.log('\nauth.users:')
console.log(JSON.stringify(await q(`select id, email, email_confirmed_at from auth.users`), null, 2))

console.log('\ndefault grants on public org tables (role -> privileges):')
console.log(JSON.stringify(await q(`
  select table_name, grantee, string_agg(privilege_type, ',' order by privilege_type) privs
  from information_schema.role_table_grants
  where table_schema='public'
    and table_name in ('organizations','organization_users','projects','organization_project','plan')
    and grantee in ('anon','authenticated','service_role')
  group by table_name, grantee order by table_name, grantee`), null, 2))

await client.end()
