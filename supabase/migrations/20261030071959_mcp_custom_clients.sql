-- MCP custom clients
--
-- Owns public.mcp_custom_clients: AI apps a user added by hand. A saved callback URL
-- lets that one user finish the consent flow for an app outside the built-in list.

-- @up
create extension if not exists pgcrypto;

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create table if not exists public.mcp_custom_clients (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  name text not null check (char_length(name) between 1 and 80),
  redirect_uri text check (redirect_uri is null or char_length(redirect_uri) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index if not exists mcp_custom_clients_user_idx
  on public.mcp_custom_clients (user_id, created_at desc)
  where deleted_at is null;

drop trigger if exists mcp_custom_clients_touch_updated_at on public.mcp_custom_clients;
create trigger mcp_custom_clients_touch_updated_at
before update on public.mcp_custom_clients
for each row execute function public.touch_updated_at();

alter table public.mcp_custom_clients enable row level security;

-- Only a browser session may read or change these, so an AI client's token can't allow new callbacks.
drop policy if exists mcp_custom_clients_select on public.mcp_custom_clients;
create policy mcp_custom_clients_select on public.mcp_custom_clients
  for select to authenticated
  using (user_id = auth.uid() and auth.jwt() ->> 'client_id' is null);

drop policy if exists mcp_custom_clients_insert on public.mcp_custom_clients;
create policy mcp_custom_clients_insert on public.mcp_custom_clients
  for insert to authenticated
  with check (user_id = auth.uid() and auth.jwt() ->> 'client_id' is null);

drop policy if exists mcp_custom_clients_update on public.mcp_custom_clients;
create policy mcp_custom_clients_update on public.mcp_custom_clients
  for update to authenticated
  using (user_id = auth.uid() and auth.jwt() ->> 'client_id' is null)
  with check (user_id = auth.uid() and auth.jwt() ->> 'client_id' is null);

revoke all on public.mcp_custom_clients from anon;
grant select, insert, update on public.mcp_custom_clients to authenticated;
grant all on public.mcp_custom_clients to service_role;

-- @down
drop table if exists public.mcp_custom_clients cascade;
