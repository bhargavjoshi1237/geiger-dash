-- Guard project and role ownership
--
-- Closes three ways a session could reach owner grade on suite-shared tables. Triggers, not policies: each rule compares
-- the old and new row, and permissive policies OR together across products.
-- * public.projects: the org "projects" module is open, so any member could rewrite organization_id or created_by, move a
--   project into an organization they created, become its owner, and move it back holding a real "*" grant. Now only the
--   verified owner of the source organization, or the creator of an org-less project, may change either column.
-- * public.roles: product role managers could add "*" or "<product>.*" to a role that was already granted, past each
--   product's grant-time guard. Now only a verified owner may add a wildcard or the 'owner' key. Seeding the Owner system
--   role still works, and edits that keep a role's existing wildcards pass, so system-role upkeep is unaffected.
-- * public.organizations: an org.update holder could rewrite owner or created_by, which both checks above trust. Now only
--   the organization's current owner or creator may change them. No app path changes either column today.
-- A verified owner is read from organizations.owner / created_by; organization_users.role is self-asserted and doesn't
-- count, and product "*" grants live in each product's schema so they don't count here. Sessionless writes (service role,
-- migrations) have no auth.uid() and pass. A role listing every permission by name isn't a wildcard and isn't caught.
-- Owns (new): public.is_verified_org_owner(uuid), public.is_verified_project_owner(uuid),
--   public.guard_project_ownership(), public.guard_role_owner_grade(), public.guard_organization_ownership() and their
--   triggers. Depends on: public.projects, public.organizations and public.roles (created by the first RBAC product).

-- @up

-- Read from the organization row only.
create or replace function public.is_verified_org_owner(p_org uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select auth.uid() is not null and exists (
    select 1 from public.organizations o
     where o.id = p_org
       and o.deleted_at is null
       and (o.owner = auth.uid() or o.created_by = auth.uid())
  );
$$;
revoke all on function public.is_verified_org_owner(uuid) from public, anon;
grant execute on function public.is_verified_org_owner(uuid) to authenticated, service_role;

-- The verified owner of the project's organization, or the creator of an org-less project.
create or replace function public.is_verified_project_owner(p_project uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select auth.uid() is not null and exists (
    select 1 from public.projects p
     where p.id = p_project
       and p.deleted_at is null
       and case when p.organization_id is null then p.created_by = auth.uid()
                else public.is_verified_org_owner(p.organization_id) end
  );
$$;
revoke all on function public.is_verified_project_owner(uuid) from public, anon;
grant execute on function public.is_verified_project_owner(uuid) to authenticated, service_role;

create or replace function public.guard_project_ownership()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if auth.uid() is null then
    return new;
  end if;
  if (case when old.organization_id is null then old.created_by = auth.uid()
           else public.is_verified_org_owner(old.organization_id) end) then
    return new;
  end if;
  raise exception 'Only the organization owner can transfer a project or change its creator.' using errcode = '42501';
end;
$$;
revoke all on function public.guard_project_ownership() from public, anon, authenticated;

drop trigger if exists projects_guard_ownership on public.projects;
create trigger projects_guard_ownership
before update on public.projects
for each row
when (old.organization_id is distinct from new.organization_id or old.created_by is distinct from new.created_by)
execute function public.guard_project_ownership();

create or replace function public.guard_organization_ownership()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if auth.uid() is null or old.owner = auth.uid() or old.created_by = auth.uid() then
    return new;
  end if;
  raise exception 'Only the organization owner can change its ownership.' using errcode = '42501';
end;
$$;
revoke all on function public.guard_organization_ownership() from public, anon, authenticated;

drop trigger if exists organizations_guard_ownership on public.organizations;
create trigger organizations_guard_ownership
before update on public.organizations
for each row
when (old.owner is distinct from new.owner or old.created_by is distinct from new.created_by)
execute function public.guard_organization_ownership();

create or replace function public.guard_role_owner_grade()
returns trigger language plpgsql security definer set search_path = '' as $$
declare
  v_gains boolean;
begin
  if auth.uid() is null then
    return new;
  end if;
  if tg_op = 'INSERT' then
    -- The Owner system role is seeded by project admins; who may hold it is each product's grant guard.
    if new.is_system and new.key = 'owner' then
      return new;
    end if;
    v_gains := new.key = 'owner' or exists (
      select 1 from unnest(new.permissions) p where p = '*' or p like '%.*'
    );
  else
    v_gains := (new.key = 'owner' and (old.key is distinct from 'owner' or old.project_id is distinct from new.project_id))
      or exists (
        select 1 from unnest(new.permissions) p
         where (p = '*' or p like '%.*')
           and (old.project_id is distinct from new.project_id or not (p = any (coalesce(old.permissions, '{}'::text[]))))
      );
  end if;
  if coalesce(v_gains, false) and not public.is_verified_project_owner(new.project_id) then
    raise exception 'Only the project owner can give a role owner-level permissions.' using errcode = '42501';
  end if;
  return new;
end;
$$;
revoke all on function public.guard_role_owner_grade() from public, anon, authenticated;

drop trigger if exists roles_guard_owner_grade on public.roles;
create trigger roles_guard_owner_grade
before insert or update on public.roles
for each row execute function public.guard_role_owner_grade();

-- @down
drop trigger if exists roles_guard_owner_grade on public.roles;
drop trigger if exists organizations_guard_ownership on public.organizations;
drop trigger if exists projects_guard_ownership on public.projects;
drop function if exists public.guard_role_owner_grade();
drop function if exists public.guard_organization_ownership();
drop function if exists public.guard_project_ownership();
drop function if exists public.is_verified_project_owner(uuid);
drop function if exists public.is_verified_org_owner(uuid);
