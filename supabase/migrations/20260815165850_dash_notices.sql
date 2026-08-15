-- Dash notices
--
-- Owns public.dash_notices — the full-width notice strip that renders above the
-- topbar (maintenance windows, incidents, announcements). Previously this was a
-- hard-coded DEMO_BANNER object in app/layout.js; the row is now the source of
-- truth and the strip renders nothing when no notice is live.
--
-- A notice is "live" when `is_active` is true, it is not soft-deleted, and now()
-- falls inside the optional [starts_at, ends_at) window (a null bound is open).
-- The layout renders the most recently updated live notice, so scheduling a
-- maintenance window and letting it expire needs no follow-up action.
--
-- Column shape mirrors @geiger/ui's <GlobalBanner /> contract:
-- `{ message, type, dismissible, link: { text, href, external } }`.
--
-- Self-contained: creates the shared updated_at trigger function, the table,
-- its indexes and RLS.

-- @up
create extension if not exists pgcrypto;

grant usage on schema public to anon, authenticated, service_role;

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

create table if not exists public.dash_notices (
  id uuid primary key default gen_random_uuid(),
  message text not null,
  -- Matches the banner themes shipped by @geiger/ui.
  type text not null default 'warning' check (type in ('warning', 'info')),
  dismissible boolean not null default true,
  -- Optional trailing call-to-action; a notice needs both text and href to show
  -- one, which the data layer enforces when it builds the view model.
  link_text text,
  link_href text,
  link_external boolean not null default false,
  is_active boolean not null default false,
  -- Optional schedule; null means "open-ended in that direction".
  starts_at timestamptz,
  ends_at timestamptz,
  -- Expansion bag: keep not-yet-promoted config here, promote to a real column
  -- once it needs indexing, constraints or its own RLS.
  metadata jsonb not null default '{}'::jsonb,
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index if not exists dash_notices_created_at_idx
  on public.dash_notices (created_at desc);

-- The read path: "the live notice, newest first".
create index if not exists dash_notices_live_idx
  on public.dash_notices (updated_at desc)
  where deleted_at is null and is_active;

drop trigger if exists dash_notices_touch_updated_at on public.dash_notices;
create trigger dash_notices_touch_updated_at
before update on public.dash_notices
for each row execute function public.touch_updated_at();

-- RLS: the strip renders for signed-out visitors too, so reads are open to
-- anon. Writes go through the admin surface on the service-role client, which
-- bypasses RLS — no anon write policy is granted.
alter table public.dash_notices enable row level security;

drop policy if exists dash_notices_demo_all on public.dash_notices;
drop policy if exists dash_notices_read_all on public.dash_notices;
create policy dash_notices_read_all on public.dash_notices
  for select
  to anon, authenticated
  using (true);

grant select on public.dash_notices to anon, authenticated;

-- @down
drop table if exists public.dash_notices cascade;
