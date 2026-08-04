-- User nav prefs (suite-wide)
--
-- Owns public.user_nav_prefs — which sidebar entries a user has hidden, for
-- every Geiger product. Sidebar curation is a property of the USER, not of any
-- one product's domain, so it lives in the shared `public` schema alongside
-- projects and organizations rather than being duplicated per product schema.
-- Dash owns `public`, so the table is defined and pushed from here; the other
-- apps read and write it through a plain public-schema Supabase client.
--
-- The key is (product, surface, project_id, user_id):
--   product  — "events", "flow", "notes", … the app the preference belongs to.
--   surface  — which sidebar within that app ("workspace", "project"). An app
--              with two navs would otherwise collide on shared titles like
--              "Overview" or "Team".
--   project  — null for org-level navs that aren't scoped to a project.
--   user     — null is the unauthenticated visitor, who gets one shared row.
--
-- `hidden` is a jsonb array of exact sidebar titles. The rules about which
-- titles MAY be hidden, and what depends on what, live in each app's
-- geiger-ui.config.js and are enforced by @geiger/ui — never in the database.
--
-- Self-contained: creates the shared updated_at trigger function, the table,
-- its indexes and RLS.

-- @up
create extension if not exists pgcrypto;

-- Shared "touch updated_at" trigger function (suite convention). Defined here
-- so this migration never depends on another having run first.
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.user_nav_prefs (
  id uuid primary key default gen_random_uuid(),
  product text not null,
  surface text not null default 'workspace',
  project_id uuid references public.projects(id) on delete cascade,
  -- Plain uuid, no FK: products key users differently, and a missing user must
  -- degrade to "nothing hidden" rather than to a failed write.
  user_id uuid,
  -- Exact sidebar titles this user has hidden, e.g. ["Expo Booths", "Taxes"].
  hidden jsonb not null default '[]'::jsonb,
  -- Expansion bag: keep not-yet-promoted config here, promote to a real column
  -- once it needs indexing, constraints or its own RLS.
  metadata jsonb not null default '{}'::jsonb,
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

-- Back-fill an older copy of this table that predates the promoted columns.
alter table public.user_nav_prefs add column if not exists product text;
alter table public.user_nav_prefs
  add column if not exists surface text not null default 'workspace';
alter table public.user_nav_prefs
  add column if not exists project_id uuid references public.projects(id) on delete cascade;
alter table public.user_nav_prefs add column if not exists user_id uuid;
alter table public.user_nav_prefs
  add column if not exists hidden jsonb not null default '[]'::jsonb;

-- The upsert target. `nulls not distinct` keeps an org-level nav (null project)
-- and the unauthenticated visitor (null user) on a single row each, instead of
-- accumulating one per write.
create unique index if not exists user_nav_prefs_scope_idx
  on public.user_nav_prefs (product, surface, project_id, user_id) nulls not distinct
  where deleted_at is null;

create index if not exists user_nav_prefs_user_idx
  on public.user_nav_prefs (user_id)
  where deleted_at is null;

drop trigger if exists user_nav_prefs_touch_updated_at on public.user_nav_prefs;
create trigger user_nav_prefs_touch_updated_at
before update on public.user_nav_prefs
for each row execute function public.touch_updated_at();

-- Demo-open RLS, matching the rest of the suite. Tightening it to a "your own
-- row only" policy (user_id = auth.uid()) is a new migration.
alter table public.user_nav_prefs enable row level security;

drop policy if exists user_nav_prefs_demo_all on public.user_nav_prefs;
create policy user_nav_prefs_demo_all on public.user_nav_prefs
  for all
  to anon, authenticated
  using (true)
  with check (true);

grant select, insert, update, delete on public.user_nav_prefs to anon, authenticated;

-- @down
drop table if exists public.user_nav_prefs cascade;
