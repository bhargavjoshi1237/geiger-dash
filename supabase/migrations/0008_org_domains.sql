-- Per-organization custom domains for the purchasable "domains" add-on.
--
-- Backs the $5 Custom subdomain product (and, later, the $10 Own domain product).
-- One active row per (organization, type): a subdomain like `acme` makes the
-- workspace reachable at acme.geiger.studio via wildcard routing. `subdomain` is
-- globally unique (case-insensitive) across all orgs so two workspaces can't
-- claim the same host.
--
-- Subdomain -> org resolution at request time goes through the service-role admin
-- client (lib/domains/store.js), which bypasses RLS, so anon needs no access.
-- Owner/creator manage their rows; writes go through server actions that verify
-- ownership AND that the org owns the add-on. Idempotent + self-contained.

-- ===========================================================================
-- 0. Extensions + shared updated_at trigger (local + idempotent; matches 0007).
-- ===========================================================================
create extension if not exists citext;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ===========================================================================
-- 1. org_domains — one row per claimed subdomain/custom domain.
-- ===========================================================================
create table if not exists public.org_domains (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  subdomain citext not null,                        -- host label, e.g. `acme` (no dots)
  type text not null default 'subdomain',           -- subdomain | custom
  status text not null default 'active',            -- active | disabled
  verified boolean not null default true,           -- subdomains are live immediately; custom domains verify later
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

-- Global, case-insensitive uniqueness among live rows only, so a released
-- subdomain (soft-deleted) can be reclaimed by another org.
create unique index if not exists org_domains_subdomain_unique
  on public.org_domains (subdomain)
  where deleted_at is null;

-- One live row per (org, type): an org has at most one active subdomain.
create unique index if not exists org_domains_org_type_unique
  on public.org_domains (organization_id, type)
  where deleted_at is null;

create index if not exists org_domains_org_idx
  on public.org_domains (organization_id);

-- ===========================================================================
-- 2. updated_at trigger.
-- ===========================================================================
drop trigger if exists org_domains_touch_updated_at on public.org_domains;
create trigger org_domains_touch_updated_at before update on public.org_domains
  for each row execute function public.touch_updated_at();

-- ===========================================================================
-- 3. RLS — only the org's owner/creator may read or write its domain rows.
--    Request-time subdomain resolution uses the service-role client (bypasses
--    RLS), so anon is granted nothing here.
-- ===========================================================================
alter table public.org_domains enable row level security;

drop policy if exists org_domains_owner_all on public.org_domains;
create policy org_domains_owner_all on public.org_domains
  for all
  using (
    exists (
      select 1 from public.organizations o
      where o.id = organization_id
        and (o.owner = auth.uid() or o.created_by = auth.uid())
    )
  )
  with check (
    exists (
      select 1 from public.organizations o
      where o.id = organization_id
        and (o.owner = auth.uid() or o.created_by = auth.uid())
    )
  );

-- ===========================================================================
-- 4. Grants. anon: none. authenticated: gated by RLS. service_role: full.
-- ===========================================================================
revoke all on public.org_domains from anon;
grant select, insert, update, delete on public.org_domains to authenticated;
grant all on public.org_domains to service_role;
