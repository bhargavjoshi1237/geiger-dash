-- Organization ability + RLS layer for geiger-dash.
--
-- Mirrors the geiger-flow authorization model (flow.has_ability / is_org_member
-- / role_ability / open_module) but operates directly on the public org tables:
--   organizations, organization_users, projects, organization_project, plan
--
-- Membership is recognised three ways so nothing that worked pre-RLS breaks:
--   1. organizations.created_by / owner          (the org creator/owner)
--   2. organization_users row                    (the relational source of truth)
--   3. organizations.metadata.members[]          (legacy array the dashboard wrote)
--
-- Everything here is idempotent and wrapped, by the apply script, in a single
-- transaction that verifies real-user access before committing.

-- ===========================================================================
-- 1. Helper functions (SECURITY DEFINER so policy predicates never recurse
--    back into RLS on the tables they read).
-- ===========================================================================

create or replace function public.is_org_member(target_org uuid)
returns boolean
language sql stable security definer set search_path = public, auth
as $$
  select target_org is not null and auth.uid() is not null and (
    exists (
      select 1 from public.organizations o
      where o.id = target_org and (o.created_by = auth.uid() or o.owner = auth.uid())
    )
    or exists (
      select 1 from public.organization_users ou
      where ou.organization = target_org and ou."user" = auth.uid()
    )
    or exists (
      select 1 from public.organizations o
      where o.id = target_org
        and jsonb_typeof(o.metadata->'members') = 'array'
        and (o.metadata->'members') ? auth.uid()::text
    )
  );
$$;

-- Lowercased role for the current user in an org. Creator/owner => 'owner'.
create or replace function public.org_role(target_org uuid)
returns text
language plpgsql stable security definer set search_path = public, auth
as $$
declare
  uid uuid := auth.uid();
  r text;
begin
  if uid is null or target_org is null then
    return null;
  end if;

  if exists (
    select 1 from public.organizations o
    where o.id = target_org and (o.created_by = uid or o.owner = uid)
  ) then
    return 'owner';
  end if;

  select lower(ou.role::text) into r
  from public.organization_users ou
  where ou.organization = target_org and ou."user" = uid
  limit 1;
  if r is not null then
    return r;
  end if;

  if exists (
    select 1 from public.organizations o
    where o.id = target_org
      and jsonb_typeof(o.metadata->'members') = 'array'
      and (o.metadata->'members') ? uid::text
  ) then
    return 'user';
  end if;

  return null;
end;
$$;

-- Ability tables (mirror flow.open_module / flow.role_ability).
create table if not exists public.org_open_module (
  module text primary key
);

create table if not exists public.org_role_ability (
  organization_id uuid not null,
  role_key text not null,
  ability text not null,
  created_at timestamptz not null default now(),
  primary key (organization_id, role_key, ability)
);

create or replace function public.has_org_ability(target_org uuid, ability text)
returns boolean
language plpgsql stable security definer set search_path = public, auth
as $$
declare
  role_key text;
begin
  if auth.uid() is null then
    return false;
  end if;

  role_key := public.org_role(target_org);
  if role_key is null then
    return false;
  end if;

  -- Owners can do anything.
  if role_key = 'owner' then
    return true;
  end if;

  -- Open modules are available to every member.
  if exists (
    select 1 from public.org_open_module om
    where om.module = split_part(ability, '.', 1)
  ) then
    return true;
  end if;

  -- Otherwise require an explicit per-role grant ('*' = all abilities).
  return exists (
    select 1 from public.org_role_ability ra
    where ra.organization_id = target_org
      and ra.role_key = role_key
      and (ra.ability = has_org_ability.ability or ra.ability = '*')
  );
end;
$$;

-- "Does the current user belong to any org?" — used by the middleware gate.
create or replace function public.user_has_org()
returns boolean
language sql stable security definer set search_path = public, auth
as $$
  select auth.uid() is not null and (
    exists (
      select 1 from public.organizations o
      where (o.created_by = auth.uid() or o.owner = auth.uid()) and o.deleted_at is null
    )
    or exists (
      select 1 from public.organization_users ou
      join public.organizations o on o.id = ou.organization
      where ou."user" = auth.uid() and o.deleted_at is null
    )
    or exists (
      select 1 from public.organizations o
      where o.deleted_at is null
        and jsonb_typeof(o.metadata->'members') = 'array'
        and (o.metadata->'members') ? auth.uid()::text
    )
  );
$$;

-- ===========================================================================
-- 2. Controlled join/find RPCs.
--    Because the SELECT policy hides orgs from non-members, joining-by-id/slug
--    must go through a definer function that looks the org up and adds the
--    caller as a member. This is the only sanctioned way to join.
-- ===========================================================================

create or replace function public.find_organization(q text)
returns table (id uuid, name text, slug text, member_count int)
language sql stable security definer set search_path = public, auth
as $$
  select o.id, o.name, o.slug,
         case when jsonb_typeof(o.metadata->'members') = 'array'
              then jsonb_array_length(o.metadata->'members') else 0 end
         + (select count(*)::int from public.organization_users ou where ou.organization = o.id)
  from public.organizations o
  where o.deleted_at is null
    and auth.uid() is not null
    and (
      (q ~ '^[0-9a-fA-F-]{36}$' and o.id = q::uuid)
      or (o.slug is not null and o.slug = lower(q))
    )
  limit 1;
$$;

create or replace function public.join_organization(q text)
returns table (id uuid, name text)
language plpgsql security definer set search_path = public, auth
as $$
declare
  uid uuid := auth.uid();
  org public.organizations%rowtype;
  members jsonb;
begin
  if uid is null then
    raise exception 'Authentication required' using errcode = '28000';
  end if;

  select * into org
  from public.organizations o
  where o.deleted_at is null
    and (
      (q ~ '^[0-9a-fA-F-]{36}$' and o.id = q::uuid)
      or (o.slug is not null and o.slug = lower(q))
    )
  limit 1;

  if not found then
    return;
  end if;

  -- Relational membership (guard against duplicates; no unique constraint).
  if not exists (
    select 1 from public.organization_users ou
    where ou.organization = org.id and ou."user" = uid
  ) then
    insert into public.organization_users (organization, "user", role)
    values (org.id, uid, 'User');
  end if;

  -- Keep the legacy metadata.members array in sync.
  members := case when jsonb_typeof(org.metadata->'members') = 'array'
                  then org.metadata->'members' else '[]'::jsonb end;
  if not (members ? uid::text) then
    update public.organizations
    set metadata = coalesce(metadata, '{}'::jsonb)
                   || jsonb_build_object('members', members || to_jsonb(uid::text))
    where organizations.id = org.id;
  end if;

  id := org.id;
  name := org.name;
  return next;
end;
$$;

-- ===========================================================================
-- 3. Backfill so RLS doesn't orphan existing rows.
-- ===========================================================================

-- Link projects to their org (currently only joined via organization_project).
update public.projects p
set organization_id = op.organisition
from public.organization_project op
where op.project = p.id
  and p.organization_id is null
  and op.organisition is not null;

update public.projects p
set created_by = o.created_by
from public.organizations o
where p.organization_id = o.id and p.created_by is null;

-- Materialise existing owners into the relational membership table.
insert into public.organization_users (organization, "user", role)
select o.id, o.created_by, 'Owner'
from public.organizations o
where o.created_by is not null
  and not exists (
    select 1 from public.organization_users ou
    where ou.organization = o.id and ou."user" = o.created_by
  );

-- Seed open modules: members may manage projects (and the plan/link rows that
-- hang off them). Org + member administration stays owner-only by default.
insert into public.org_open_module (module) values ('projects')
on conflict do nothing;

-- ===========================================================================
-- 4. Enable RLS + policies.
-- ===========================================================================

-- organizations -------------------------------------------------------------
alter table public.organizations enable row level security;
drop policy if exists organizations_select on public.organizations;
drop policy if exists organizations_insert on public.organizations;
drop policy if exists organizations_update on public.organizations;
drop policy if exists organizations_delete on public.organizations;
create policy organizations_select on public.organizations
  for select using (public.is_org_member(id));
create policy organizations_insert on public.organizations
  for insert with check (created_by = auth.uid());
create policy organizations_update on public.organizations
  for update using (public.has_org_ability(id, 'org.update'))
  with check (public.has_org_ability(id, 'org.update'));
create policy organizations_delete on public.organizations
  for delete using (public.has_org_ability(id, 'org.delete'));

-- organization_users --------------------------------------------------------
alter table public.organization_users enable row level security;
drop policy if exists organization_users_select on public.organization_users;
drop policy if exists organization_users_insert on public.organization_users;
drop policy if exists organization_users_update on public.organization_users;
drop policy if exists organization_users_delete on public.organization_users;
create policy organization_users_select on public.organization_users
  for select using (public.is_org_member(organization));
create policy organization_users_insert on public.organization_users
  for insert with check ("user" = auth.uid() or public.has_org_ability(organization, 'members.add'));
create policy organization_users_update on public.organization_users
  for update using (public.has_org_ability(organization, 'members.manage'))
  with check (public.has_org_ability(organization, 'members.manage'));
create policy organization_users_delete on public.organization_users
  for delete using ("user" = auth.uid() or public.has_org_ability(organization, 'members.manage'));

-- projects ------------------------------------------------------------------
alter table public.projects enable row level security;
drop policy if exists projects_select on public.projects;
drop policy if exists projects_insert on public.projects;
drop policy if exists projects_update on public.projects;
drop policy if exists projects_delete on public.projects;
create policy projects_select on public.projects
  for select using (public.is_org_member(organization_id));
create policy projects_insert on public.projects
  for insert with check (public.has_org_ability(organization_id, 'projects.create'));
create policy projects_update on public.projects
  for update using (public.has_org_ability(organization_id, 'projects.update'))
  with check (public.has_org_ability(organization_id, 'projects.update'));
create policy projects_delete on public.projects
  for delete using (public.has_org_ability(organization_id, 'projects.delete'));

-- organization_project (bridge; note the historical column spelling) --------
alter table public.organization_project enable row level security;
drop policy if exists organization_project_select on public.organization_project;
drop policy if exists organization_project_insert on public.organization_project;
drop policy if exists organization_project_update on public.organization_project;
drop policy if exists organization_project_delete on public.organization_project;
create policy organization_project_select on public.organization_project
  for select using (public.is_org_member(organisition));
create policy organization_project_insert on public.organization_project
  for insert with check (public.has_org_ability(organisition, 'projects.create'));
create policy organization_project_update on public.organization_project
  for update using (public.has_org_ability(organisition, 'projects.update'))
  with check (public.has_org_ability(organisition, 'projects.update'));
create policy organization_project_delete on public.organization_project
  for delete using (public.has_org_ability(organisition, 'projects.delete'));

-- plan ----------------------------------------------------------------------
alter table public.plan enable row level security;
drop policy if exists plan_select on public.plan;
drop policy if exists plan_insert on public.plan;
drop policy if exists plan_update on public.plan;
drop policy if exists plan_delete on public.plan;
create policy plan_select on public.plan
  for select using (public.is_org_member(organisation));
create policy plan_insert on public.plan
  for insert with check (public.has_org_ability(organisation, 'projects.create'));
create policy plan_update on public.plan
  for update using (public.has_org_ability(organisation, 'projects.update'))
  with check (public.has_org_ability(organisation, 'projects.update'));
create policy plan_delete on public.plan
  for delete using (public.has_org_ability(organisation, 'projects.delete'));

-- ability config tables -----------------------------------------------------
alter table public.org_open_module enable row level security;
drop policy if exists org_open_module_read on public.org_open_module;
create policy org_open_module_read on public.org_open_module
  for select using (auth.uid() is not null);

alter table public.org_role_ability enable row level security;
drop policy if exists org_role_ability_read on public.org_role_ability;
drop policy if exists org_role_ability_write on public.org_role_ability;
create policy org_role_ability_read on public.org_role_ability
  for select using (public.is_org_member(organization_id));
create policy org_role_ability_write on public.org_role_ability
  for all using (
    exists (select 1 from public.organizations o
            where o.id = organization_id and o.created_by = auth.uid())
  ) with check (
    exists (select 1 from public.organizations o
            where o.id = organization_id and o.created_by = auth.uid())
  );

-- ===========================================================================
-- 5. Grants. anon (unauthenticated) loses all direct access to org tables;
--    authenticated keeps table privileges but they're now gated by RLS;
--    service_role keeps full bypass for server-side admin work.
-- ===========================================================================

revoke all on public.organizations from anon;
revoke all on public.organization_users from anon;
revoke all on public.projects from anon;
revoke all on public.organization_project from anon;
revoke all on public.plan from anon;

grant select on public.org_open_module to authenticated;
grant select on public.org_role_ability to authenticated;
grant all on public.org_open_module to service_role;
grant all on public.org_role_ability to service_role;

grant execute on function public.is_org_member(uuid) to anon, authenticated, service_role;
grant execute on function public.org_role(uuid) to anon, authenticated, service_role;
grant execute on function public.has_org_ability(uuid, text) to anon, authenticated, service_role;
grant execute on function public.user_has_org() to anon, authenticated, service_role;
grant execute on function public.find_organization(text) to authenticated, service_role;
grant execute on function public.join_organization(text) to authenticated, service_role;
