-- Pricing versions
--
-- Owns public.pricing_versions, an append-only history of everything /admin/pricing controls; the newest row is live and none means the code defaults.
-- Adds public.purchases.pricing_version_id, so a purchase keeps the prices and limits it was sold under when pricing changes later.
-- Relies on public.is_content_editor() from 20261023112956_docs_editing.

-- @up
grant usage on schema public to anon, authenticated, service_role;

create table if not exists public.pricing_versions (
  id uuid primary key default gen_random_uuid(),
  config jsonb not null,
  note text,
  created_by uuid,
  created_by_email text,
  created_at timestamptz not null default now()
);

create index if not exists pricing_versions_created_at_idx on public.pricing_versions (created_at desc);

-- Prices are public, so the config is readable by anyone; the note and author stay server-side through column grants.
alter table public.pricing_versions enable row level security;

drop policy if exists pricing_versions_public_read on public.pricing_versions;
create policy pricing_versions_public_read on public.pricing_versions
  for select to anon, authenticated
  using (true);

drop policy if exists pricing_versions_editors_insert on public.pricing_versions;
create policy pricing_versions_editors_insert on public.pricing_versions
  for insert to authenticated
  with check ((select public.is_content_editor()) and created_by = (select auth.uid()));

-- No update or delete for anyone but service_role: a version a purchase points at must never change.
revoke all on public.pricing_versions from anon, authenticated;
grant select (id, config, created_at) on public.pricing_versions to anon, authenticated;
grant insert on public.pricing_versions to authenticated;
grant all on public.pricing_versions to service_role;

alter table public.purchases
  add column if not exists pricing_version_id uuid references public.pricing_versions(id) on delete set null;

-- @down
alter table public.purchases drop column if exists pricing_version_id;
drop table if exists public.pricing_versions;
