-- Filestore: the suite-wide storage pool.
--
-- geiger-dash is the "mother" project of the suite. It already owns transactional
-- email for every app; this does the same for files. Many heterogeneous storage
-- providers (S3-compatible, generic REST, Supabase Storage, Vercel Blob) are
-- aggregated into one pool with a single declared capacity, and every consumer
-- app uploads through /api/storage with a hashed API key.
--
-- The central idea is that `nodes` (the virtual folder tree a user sees) and
-- `placements` (where the bytes physically live) are separate tables. A file at
-- /covers/cat.png may sit on Uploadcare today and R2 tomorrow; only the
-- placement row changes, so logical paths and gateway links never break.
--
-- Everything lives in a dedicated `filestore` schema. It is NOT called `storage`
-- because Supabase already owns that schema (storage.objects, storage.buckets)
-- in this same project. Add `filestore` under Supabase -> API -> Exposed schemas
-- so PostgREST serves it.
--
-- Owns: filestore.providers, .namespaces, .nodes, .placements, .rules,
--       .api_keys, .uploads, .events and the byte-ledger RPCs.

-- @up
create extension if not exists "pgcrypto";

create schema if not exists filestore;

grant usage on schema filestore to anon, authenticated, service_role;
alter default privileges in schema filestore grant all on tables to service_role;
alter default privileges in schema filestore grant all on sequences to service_role;

-- Shared updated_at trigger function (schema-local so this file is self-contained).
create or replace function filestore.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- providers: the members of the pool.
--   capacity_bytes - admin-declared ceiling; 0 means unlimited (Uploadcare and
--                    Vercel Blob report no ceiling of their own)
--   used_bytes     - ledger maintained by the reserve/settle RPCs below
--   config         - non-secret driver config (endpoint, bucket, url templates)
--   secrets        - AES-256-GCM envelope {v, iv, tag, data}; never leaves the server
--   capabilities   - {cdn, publicRead, presign, multipart, maxObjectSize, mimeAllow[]}
-- A provider starts 'unverified' and only reaches 'active' by passing a probe.
-- ---------------------------------------------------------------------------
create table if not exists filestore.providers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  driver text not null check (driver in ('s3', 'rest', 'supabase', 'vercel_blob')),
  status text not null default 'unverified'
    check (status in ('unverified', 'active', 'readonly', 'draining', 'error', 'disabled')),
  priority integer not null default 100,
  capacity_bytes bigint not null default 0,
  used_bytes bigint not null default 0,
  object_count integer not null default 0,
  config jsonb not null default '{}'::jsonb,
  secrets jsonb not null default '{}'::jsonb,
  capabilities jsonb not null default '{}'::jsonb,
  public_url_template text not null default '',
  last_probe_at timestamptz,
  last_probe_ok boolean,
  last_probe_error text,
  metadata jsonb not null default '{}'::jsonb,
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index if not exists filestore_providers_priority_idx
  on filestore.providers (priority asc) where deleted_at is null;
create index if not exists filestore_providers_status_idx
  on filestore.providers (status) where deleted_at is null;

drop trigger if exists filestore_providers_updated_at on filestore.providers;
create trigger filestore_providers_updated_at
  before update on filestore.providers
  for each row execute function filestore.set_updated_at();

-- ---------------------------------------------------------------------------
-- namespaces: one virtual root per consumer app. An API key is scoped to
-- exactly one of these, so apps cannot list each other's files.
-- ---------------------------------------------------------------------------
create table if not exists filestore.namespaces (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  name text not null,
  project text not null default 'geiger-dash',
  quota_bytes bigint not null default 0,
  used_bytes bigint not null default 0,
  object_count integer not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

drop trigger if exists filestore_namespaces_updated_at on filestore.namespaces;
create trigger filestore_namespaces_updated_at
  before update on filestore.namespaces
  for each row execute function filestore.set_updated_at();

-- ---------------------------------------------------------------------------
-- nodes: the virtual tree. Folders exist ONLY here -- no provider is ever asked
-- to create a directory. `path` is materialized for fast lookup and deep links.
-- ---------------------------------------------------------------------------
create table if not exists filestore.nodes (
  id uuid primary key default gen_random_uuid(),
  namespace_id uuid not null references filestore.namespaces(id) on delete cascade,
  parent_id uuid references filestore.nodes(id) on delete cascade,
  kind text not null check (kind in ('folder', 'file')),
  name text not null,
  path text not null,
  size_bytes bigint not null default 0,
  mime_type text not null default '',
  checksum text,
  status text not null default 'pending' check (status in ('pending', 'ready', 'failed')),
  metadata jsonb not null default '{}'::jsonb,
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create unique index if not exists filestore_nodes_path_key
  on filestore.nodes (namespace_id, path) where deleted_at is null;
create index if not exists filestore_nodes_parent_idx
  on filestore.nodes (namespace_id, parent_id) where deleted_at is null;
create index if not exists filestore_nodes_size_idx
  on filestore.nodes (size_bytes desc) where deleted_at is null and kind = 'file';
create index if not exists filestore_nodes_created_idx
  on filestore.nodes (created_at desc);

drop trigger if exists filestore_nodes_updated_at on filestore.nodes;
create trigger filestore_nodes_updated_at
  before update on filestore.nodes
  for each row execute function filestore.set_updated_at();

-- ---------------------------------------------------------------------------
-- placements: where a file's bytes actually are. Migration between providers is
-- "write a new placement, flip is_current, drop the old one" -- the node, its
-- path and its gateway link are untouched.
-- ---------------------------------------------------------------------------
create table if not exists filestore.placements (
  id uuid primary key default gen_random_uuid(),
  node_id uuid not null references filestore.nodes(id) on delete cascade,
  provider_id uuid not null references filestore.providers(id),
  provider_key text not null default '',
  provider_url text not null default '',
  size_bytes bigint not null default 0,
  etag text,
  state text not null default 'reserved'
    check (state in ('reserved', 'committed', 'orphaned', 'migrating')),
  is_current boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists filestore_placements_current_key
  on filestore.placements (node_id) where is_current;
create index if not exists filestore_placements_provider_idx
  on filestore.placements (provider_id, state);

drop trigger if exists filestore_placements_updated_at on filestore.placements;
create trigger filestore_placements_updated_at
  before update on filestore.placements
  for each row execute function filestore.set_updated_at();

-- ---------------------------------------------------------------------------
-- rules: placement overrides evaluated before the default priority fill.
--   match  - {mimePrefix, minSize, maxSize, namespaceKey, requiresCapability[]}
--   target - {providerId} to pin, or {requireCapabilities: ["cdn"]} to narrow
-- ---------------------------------------------------------------------------
create table if not exists filestore.rules (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  priority integer not null default 100,
  enabled boolean not null default true,
  match jsonb not null default '{}'::jsonb,
  target jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index if not exists filestore_rules_priority_idx
  on filestore.rules (priority asc) where deleted_at is null;

drop trigger if exists filestore_rules_updated_at on filestore.rules;
create trigger filestore_rules_updated_at
  before update on filestore.rules
  for each row execute function filestore.set_updated_at();

-- ---------------------------------------------------------------------------
-- api_keys: how other suite apps authenticate to /api/storage. Only the
-- SHA-256 hash is persisted; the plaintext is shown once, at creation.
-- ---------------------------------------------------------------------------
create table if not exists filestore.api_keys (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  project text not null default 'geiger-flow',
  namespace_id uuid not null references filestore.namespaces(id) on delete cascade,
  prefix text not null,
  key_hash text not null unique,
  scopes text[] not null default array['read', 'write']::text[],
  active boolean not null default true,
  created_by uuid,
  last_used_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists filestore_api_keys_active_idx on filestore.api_keys (active);

-- ---------------------------------------------------------------------------
-- uploads: in-flight tickets. Bytes go straight from the client to the provider,
-- so a commit must be tied back to a real reservation -- this row is that tie.
-- Expired rows are swept by the reconcile action (bytes released, placement
-- orphaned).
-- ---------------------------------------------------------------------------
create table if not exists filestore.uploads (
  id uuid primary key default gen_random_uuid(),
  namespace_id uuid not null references filestore.namespaces(id) on delete cascade,
  node_id uuid not null references filestore.nodes(id) on delete cascade,
  provider_id uuid not null references filestore.providers(id),
  placement_id uuid references filestore.placements(id) on delete set null,
  api_key_id uuid,
  mode text not null check (mode in ('form-post', 'multipart', 'presigned-put', 'proxy')),
  reserved_bytes bigint not null default 0,
  ticket jsonb not null default '{}'::jsonb,
  driver_state jsonb not null default '{}'::jsonb,
  state text not null default 'open'
    check (state in ('open', 'committed', 'aborted', 'expired')),
  expires_at timestamptz not null default now() + interval '6 hours',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists filestore_uploads_state_idx on filestore.uploads (state, expires_at);

drop trigger if exists filestore_uploads_updated_at on filestore.uploads;
create trigger filestore_uploads_updated_at
  before update on filestore.uploads
  for each row execute function filestore.set_updated_at();

-- ---------------------------------------------------------------------------
-- events: append-only activity log behind the admin log and the growth charts.
-- ---------------------------------------------------------------------------
create table if not exists filestore.events (
  id uuid primary key default gen_random_uuid(),
  type text not null
    check (type in ('upload', 'delete', 'migrate', 'probe', 'reconcile', 'error')),
  node_id uuid,
  provider_id uuid,
  namespace_id uuid,
  api_key_id uuid,
  bytes bigint not null default 0,
  detail jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists filestore_events_created_idx on filestore.events (created_at desc);
create index if not exists filestore_events_type_idx on filestore.events (type, created_at desc);

-- ---------------------------------------------------------------------------
-- Byte ledger RPCs.
--
-- Uploads go direct to the provider, so capacity has to be debited BEFORE the
-- transfer and corrected afterwards. reserve_bytes does the debit under the
-- row lock the UPDATE already takes, which is what stops concurrent uploads
-- from all seeing the same headroom and oversubscribing a provider.
-- ---------------------------------------------------------------------------
create or replace function filestore.reserve_bytes(p_provider uuid, p_bytes bigint)
returns boolean
language plpgsql
as $$
declare
  reserved boolean;
begin
  update filestore.providers
     set used_bytes = used_bytes + p_bytes,
         object_count = object_count + 1
   where id = p_provider
     and deleted_at is null
     and status = 'active'
     and (capacity_bytes = 0 or used_bytes + p_bytes <= capacity_bytes)
  returning true into reserved;

  return coalesce(reserved, false);
end;
$$;

create or replace function filestore.release_bytes(p_provider uuid, p_bytes bigint)
returns void
language plpgsql
as $$
begin
  update filestore.providers
     set used_bytes = greatest(0, used_bytes - p_bytes),
         object_count = greatest(0, object_count - 1)
   where id = p_provider;
end;
$$;

-- Commit-time correction: the provider is the authority on the real size.
create or replace function filestore.settle_bytes(
  p_provider uuid,
  p_reserved bigint,
  p_actual bigint
)
returns void
language plpgsql
as $$
begin
  update filestore.providers
     set used_bytes = greatest(0, used_bytes - p_reserved + p_actual)
   where id = p_provider;
end;
$$;

create or replace function filestore.bump_namespace(
  p_namespace uuid,
  p_bytes bigint,
  p_objects integer
)
returns void
language plpgsql
as $$
begin
  update filestore.namespaces
     set used_bytes = greatest(0, used_bytes + p_bytes),
         object_count = greatest(0, object_count + p_objects)
   where id = p_namespace;
end;
$$;

-- Re-sum the ledger from committed placements and report the drift it corrected.
create or replace function filestore.reconcile_provider(p_provider uuid)
returns jsonb
language plpgsql
as $$
declare
  before_bytes bigint;
  real_bytes bigint;
  real_count integer;
begin
  select used_bytes into before_bytes
    from filestore.providers where id = p_provider;

  select coalesce(sum(p.size_bytes), 0), count(*)
    into real_bytes, real_count
    from filestore.placements p
    join filestore.nodes n on n.id = p.node_id
   where p.provider_id = p_provider
     and p.state = 'committed'
     and p.is_current
     and n.deleted_at is null;

  update filestore.providers
     set used_bytes = real_bytes,
         object_count = real_count
   where id = p_provider;

  return jsonb_build_object(
    'beforeBytes', coalesce(before_bytes, 0),
    'afterBytes', real_bytes,
    'objectCount', real_count,
    'driftBytes', coalesce(before_bytes, 0) - real_bytes
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- RLS. Every table is reached through the service role (which bypasses RLS)
-- from server code only -- the admin UI goes through server actions, never a
-- browser client. No policies are created on purpose: providers.secrets and
-- api_keys.key_hash must never be readable by anon or authenticated.
-- ---------------------------------------------------------------------------
alter table filestore.providers enable row level security;
alter table filestore.namespaces enable row level security;
alter table filestore.nodes enable row level security;
alter table filestore.placements enable row level security;
alter table filestore.rules enable row level security;
alter table filestore.api_keys enable row level security;
alter table filestore.uploads enable row level security;
alter table filestore.events enable row level security;

grant select, insert, update, delete on all tables in schema filestore to service_role;
grant execute on all functions in schema filestore to service_role;

-- @down
drop function if exists filestore.reconcile_provider(uuid);
drop function if exists filestore.bump_namespace(uuid, bigint, integer);
drop function if exists filestore.settle_bytes(uuid, bigint, bigint);
drop function if exists filestore.release_bytes(uuid, bigint);
drop function if exists filestore.reserve_bytes(uuid, bigint);

drop table if exists filestore.events cascade;
drop table if exists filestore.uploads cascade;
drop table if exists filestore.api_keys cascade;
drop table if exists filestore.rules cascade;
drop table if exists filestore.placements cascade;
drop table if exists filestore.nodes cascade;
drop table if exists filestore.namespaces cascade;
drop table if exists filestore.providers cascade;

drop function if exists filestore.set_updated_at();
drop schema if exists filestore;
