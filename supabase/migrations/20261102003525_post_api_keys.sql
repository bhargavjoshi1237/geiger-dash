-- Post API keys
--
-- Owns public.dash_post_api_keys: keys content editors create for /api/posts and /api/mcp.
-- Only the SHA-256 hash is stored, and the plaintext is shown once at creation.

-- @up
create extension if not exists pgcrypto;

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create table if not exists public.dash_post_api_keys (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  name text not null,
  prefix text not null,
  key_hash text not null unique,
  access text not null default 'draft' check (access in ('read', 'draft', 'publish')),
  last_used_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index if not exists dash_post_api_keys_user_idx
  on public.dash_post_api_keys (user_id, created_at desc)
  where deleted_at is null;

drop trigger if exists dash_post_api_keys_touch_updated_at on public.dash_post_api_keys;
create trigger dash_post_api_keys_touch_updated_at
before update on public.dash_post_api_keys
for each row execute function public.touch_updated_at();

-- No policies on purpose: key hashes stay service-role only.
alter table public.dash_post_api_keys enable row level security;
revoke all on public.dash_post_api_keys from anon, authenticated;
grant all on public.dash_post_api_keys to service_role;

-- @down
drop table if exists public.dash_post_api_keys cascade;
