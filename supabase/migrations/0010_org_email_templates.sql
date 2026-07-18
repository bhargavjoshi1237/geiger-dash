-- Per-organization custom email templates for the purchasable "Custom email
-- templates" add-on ($10/mo, catalog id `emailTemplate`).
--
-- One row per template. An org that owns the add-on can create and manage
-- reusable, branded email templates (per event / purpose). Reads/writes go
-- through the service-role data layer (lib/email/store.js); server actions
-- (app/org/email-actions.js) verify org ownership AND that the org owns the
-- add-on before touching it. Idempotent + self-contained.

-- ===========================================================================
-- 0. Shared updated_at trigger (local + idempotent; matches 0008).
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
-- 1. org_email_templates — one row per template.
-- ===========================================================================
create table if not exists public.org_email_templates (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null default 'Untitled template',
  event_name text not null default '',            -- the event/purpose this template is for
  subject text not null default '',
  body text not null default '',
  status text not null default 'draft',           -- draft | active
  created_by uuid,
  metadata jsonb not null default '{}'::jsonb,     -- expansion bag for future fields
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

-- Back-fill older copies of the table (no-ops on a fresh create).
alter table public.org_email_templates add column if not exists event_name text not null default '';
alter table public.org_email_templates add column if not exists metadata jsonb not null default '{}'::jsonb;

create index if not exists org_email_templates_org_idx
  on public.org_email_templates (organization_id)
  where deleted_at is null;

-- ===========================================================================
-- 2. updated_at trigger.
-- ===========================================================================
drop trigger if exists org_email_templates_touch_updated_at on public.org_email_templates;
create trigger org_email_templates_touch_updated_at before update on public.org_email_templates
  for each row execute function public.touch_updated_at();

-- ===========================================================================
-- 3. RLS — only the org's owner/creator may read or write its template rows.
--    The data layer uses the service-role client (bypasses RLS); anon gets none.
-- ===========================================================================
alter table public.org_email_templates enable row level security;

drop policy if exists org_email_templates_owner_all on public.org_email_templates;
create policy org_email_templates_owner_all on public.org_email_templates
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
revoke all on public.org_email_templates from anon;
grant select, insert, update, delete on public.org_email_templates to authenticated;
grant all on public.org_email_templates to service_role;
