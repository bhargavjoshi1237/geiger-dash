-- Per-organization OAuth (SSO) provider config for the purchasable OAuth add-on.
--
-- One row per organization (unique organization_id) describing a generic
-- OAuth2/OIDC identity provider the org's members sign in through. The app runs
-- the auth-code flow itself (app/api/oauth/[orgId]/*), so this is OUR table, not
-- Supabase's auth.custom_oauth_providers — Supabase provider config is
-- project-global and can't be per-org.
--
-- client_secret is read only server-side through the service-role client and is
-- never sent to the browser (the management UI receives a masked value). Writes
-- happen through server actions (ownership verified) via service_role.
-- Idempotent + self-contained.

-- ===========================================================================
-- 0. Shared updated_at trigger (local + idempotent; matches 0005_payments.sql).
-- ===========================================================================
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
-- 1. org_oauth_providers — one generic OAuth2/OIDC provider per organization.
-- ===========================================================================
create table if not exists public.org_oauth_providers (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null unique references public.organizations(id) on delete cascade,
  provider_name text not null,                         -- display name, e.g. "Acme SSO"
  provider_type text not null default 'oidc',          -- oidc | oauth2
  client_id text not null default '',
  client_secret text not null default '',              -- server-only; masked to the client
  issuer text,                                         -- OIDC issuer (optional)
  discovery_url text,                                  -- .well-known/openid-configuration (optional)
  authorization_url text,
  token_url text,
  userinfo_url text,
  scopes text[] not null default '{openid,email,profile}',
  attribute_mapping jsonb not null default '{}'::jsonb, -- { email, name, avatar } claim keys
  email_domains text[] not null default '{}',          -- e.g. {acme.com} -> resolves an email to this org at login
  pkce_enabled boolean not null default true,
  enabled boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

-- Back-fill the domains column on any pre-existing copy of the table.
alter table public.org_oauth_providers
  add column if not exists email_domains text[] not null default '{}';

create index if not exists org_oauth_providers_org_idx
  on public.org_oauth_providers (organization_id);

-- GIN index for the email-domain -> org lookup at login.
create index if not exists org_oauth_providers_domains_idx
  on public.org_oauth_providers using gin (email_domains);

-- ===========================================================================
-- 2. updated_at trigger.
-- ===========================================================================
drop trigger if exists org_oauth_providers_touch_updated_at on public.org_oauth_providers;
create trigger org_oauth_providers_touch_updated_at before update on public.org_oauth_providers
  for each row execute function public.touch_updated_at();

-- ===========================================================================
-- 3. RLS — only the org's owner/creator may read or write its provider row.
--    Server actions still verify ownership; this is defense in depth. Reads of
--    client_secret in the app go through the service-role client, which bypasses
--    RLS, so the secret never needs to reach the authenticated client.
-- ===========================================================================
alter table public.org_oauth_providers enable row level security;

drop policy if exists org_oauth_providers_owner_all on public.org_oauth_providers;
create policy org_oauth_providers_owner_all on public.org_oauth_providers
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
revoke all on public.org_oauth_providers from anon;
grant select, insert, update, delete on public.org_oauth_providers to authenticated;
grant all on public.org_oauth_providers to service_role;
