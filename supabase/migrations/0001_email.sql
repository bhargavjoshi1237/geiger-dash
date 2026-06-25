-- Geiger email subsystem.
--
-- geiger-dash is the "mother" project of the suite: it hosts every transactional
-- email template, the admin editing surface, the sending pipeline, and a
-- cross-app send API. Other suite apps (geiger-flow, geiger-notes, ...) call the
-- API instead of bundling their own email stack.
--
-- Everything lives in a dedicated `email` schema so it stays isolated from the
-- product tables in `public`. The schema is granted to the API roles here; also
-- add `email` under Supabase -> API -> Exposed schemas so PostgREST serves it.

create extension if not exists "pgcrypto";

create schema if not exists email;

grant usage on schema email to anon, authenticated, service_role;
alter default privileges in schema email grant all on tables to service_role;
alter default privileges in schema email grant all on sequences to service_role;

-- Shared updated_at trigger function (schema-local).
create or replace function email.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- templates: one row per transactional email.
--   content     - editable text slots (admin-editable, merged at render time)
--   fields      - editor schema describing the slots in `content`
--   sample_data - variables used to render the admin preview
--   variables   - documented runtime variables the calling app must supply
-- The React component itself is resolved in app code by `key`.
-- ---------------------------------------------------------------------------
create table if not exists email.templates (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  project text not null default 'geiger-flow',
  category text not null default 'General',
  name text not null,
  description text not null default '',
  subject text not null default '',
  content jsonb not null default '{}'::jsonb,
  fields jsonb not null default '[]'::jsonb,
  sample_data jsonb not null default '{}'::jsonb,
  variables jsonb not null default '[]'::jsonb,
  status text not null default 'active' check (status in ('active', 'draft', 'archived')),
  version integer not null default 1,
  updated_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists email_templates_project_idx on email.templates(project, category);
create index if not exists email_templates_status_idx on email.templates(status);

drop trigger if exists email_templates_updated_at on email.templates;
create trigger email_templates_updated_at
  before update on email.templates
  for each row execute function email.set_updated_at();

-- ---------------------------------------------------------------------------
-- messages: append-only send log.
-- ---------------------------------------------------------------------------
create table if not exists email.messages (
  id uuid primary key default gen_random_uuid(),
  template_key text,
  project text,
  to_address text not null,
  from_address text not null,
  subject text not null,
  html text,
  status text not null default 'queued' check (status in ('queued', 'sent', 'failed')),
  provider text not null default 'resend',
  provider_id text,
  error text,
  data jsonb not null default '{}'::jsonb,
  api_key_id uuid,
  created_at timestamptz not null default now(),
  sent_at timestamptz
);

create index if not exists email_messages_created_idx on email.messages(created_at desc);
create index if not exists email_messages_template_idx on email.messages(template_key);
create index if not exists email_messages_status_idx on email.messages(status);

-- ---------------------------------------------------------------------------
-- api_keys: let other suite apps authenticate to the send API. Only the SHA-256
-- hash is stored; the plaintext key is shown once, at creation.
-- ---------------------------------------------------------------------------
create table if not exists email.api_keys (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  project text not null default 'geiger-flow',
  prefix text not null,
  key_hash text not null unique,
  active boolean not null default true,
  created_by uuid references auth.users(id),
  last_used_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists email_api_keys_active_idx on email.api_keys(active);

-- ---------------------------------------------------------------------------
-- RLS. App code talks to these tables through the service role (which bypasses
-- RLS). The policies below only widen read access for signed-in suite users.
-- api_keys gets no policy on purpose: secrets stay service-role only.
-- ---------------------------------------------------------------------------
alter table email.templates enable row level security;
alter table email.messages enable row level security;
alter table email.api_keys enable row level security;

drop policy if exists "Authenticated manage templates" on email.templates;
create policy "Authenticated manage templates" on email.templates
  for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists "Authenticated read messages" on email.messages;
create policy "Authenticated read messages" on email.messages
  for select
  using (auth.role() = 'authenticated');

grant select, insert, update, delete on all tables in schema email to service_role;
grant select on email.templates to anon, authenticated;
grant select on email.messages to authenticated;
