-- MCP connections and audit log
--
-- Owns public.mcp_connections (which projects and access level a user gave an AI client)
-- and public.mcp_audit_log (one row per MCP tool call, written by products with the service role).
-- Supabase OAuth scopes only cover identity data, so these limits live here.

-- @up
create extension if not exists pgcrypto;

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create table if not exists public.mcp_connections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  client_id text not null,
  client_name text not null default '',
  redirect_uri text not null default '',
  project_ids uuid[] not null default '{}',
  access text not null default 'read' check (access in ('read', 'write')),
  metadata jsonb not null default '{}'::jsonb,
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create unique index if not exists mcp_connections_active_idx
  on public.mcp_connections (user_id, client_id)
  where deleted_at is null;

drop trigger if exists mcp_connections_touch_updated_at on public.mcp_connections;
create trigger mcp_connections_touch_updated_at
before update on public.mcp_connections
for each row execute function public.touch_updated_at();

alter table public.mcp_connections enable row level security;

drop policy if exists mcp_connections_select on public.mcp_connections;
create policy mcp_connections_select on public.mcp_connections
  for select to authenticated
  using (user_id = auth.uid());

-- Only a browser session may change a connection, so an AI client's token can't widen its own access.
drop policy if exists mcp_connections_insert on public.mcp_connections;
create policy mcp_connections_insert on public.mcp_connections
  for insert to authenticated
  with check (user_id = auth.uid() and auth.jwt() ->> 'client_id' is null);

drop policy if exists mcp_connections_update on public.mcp_connections;
create policy mcp_connections_update on public.mcp_connections
  for update to authenticated
  using (user_id = auth.uid() and auth.jwt() ->> 'client_id' is null)
  with check (user_id = auth.uid() and auth.jwt() ->> 'client_id' is null);

revoke all on public.mcp_connections from anon;
grant select, insert, update on public.mcp_connections to authenticated;
grant all on public.mcp_connections to service_role;

create table if not exists public.mcp_audit_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  client_id text not null,
  connection_id uuid,
  product text not null,
  tool text not null,
  project_id uuid,
  target_id text,
  outcome text not null check (outcome in ('ok', 'denied', 'error', 'rate_limited')),
  error_code text,
  duration_ms integer,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists mcp_audit_log_user_idx
  on public.mcp_audit_log (user_id, created_at desc);

alter table public.mcp_audit_log enable row level security;

drop policy if exists mcp_audit_log_select on public.mcp_audit_log;
create policy mcp_audit_log_select on public.mcp_audit_log
  for select to authenticated
  using (user_id = auth.uid());

revoke all on public.mcp_audit_log from anon;
grant select on public.mcp_audit_log to authenticated;
grant all on public.mcp_audit_log to service_role;

-- @down
drop table if exists public.mcp_audit_log cascade;
drop table if exists public.mcp_connections cascade;
