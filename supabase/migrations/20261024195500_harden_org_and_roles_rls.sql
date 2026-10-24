-- Harden org and roles rls
--
-- Closes two live RLS holes on suite-shared tables in public.
--
-- organization_users_insert (20260629212507_org_abilities_rls) let any signed-in user insert themselves into any
-- organization with any role, Owner included. Every legitimate join already runs past RLS: create_organization,
-- accept_invite, join_organization and set_organization_member_role are SECURITY DEFINER RPCs, and the OAuth
-- auto-join (lib/oauth/session.js) uses the service role. A direct insert now needs members.add, may never add the
-- caller, and may add an Owner or Admin row only when the caller is owner-grade.
--
-- roles_write on public.roles (for all to authenticated using (true)) came from the assets, campaign, comms, content,
-- events, forms and grey RBAC adoptions. It admitted every signed-in user to the permissive layer, voiding content's
-- roles_workspace_write and leaving grey's and events' restrictive guards, which trust organization_users.role, as
-- the only barrier. It is dropped and each product that writes public.roles from a session client gets its own
-- permissive policy. Role rows are shared across products, so these policies are OR'ed and the grey and events
-- restrictive guards still apply on top. Pods never writes public.roles and gets none; content keeps its own policy.
--
-- Owns (new):
--   public.can_administer_project_roles(uuid)  owner/admin of the project's org, or creator of an org-less project
--   public.is_project_member(uuid)             member of the project's org, or creator of an org-less project
--   on public.roles:
--     assets_roles_write    project admins only (assets.role_grants is writable by any signed-in user, so
--                           assets.rbac_allows cannot authorize a write to a shared table)
--     campaign_roles_write  project admins, or project members holding campaign.role.manage, on roles without "*"
--     comms_roles_write     same shape with comms.role.manage; geiger-comms 20261021103047_rbac_trust_hardening
--                           (not yet applied) replaces it by name
--     forms_roles_write     same shape with forms.role.manage
--     grey_roles_write      permissive twin of grey's own guard (grey.can_administer_roles or grey.role.manage)
--     events_roles_write    permissive twin of events' own guard (events.ops_can_administer_roles)
-- Becomes the owner of: organization_users_insert, from 20260629212507_org_abilities_rls.
-- Drops: roles_write on public.roles, from the products' adopt_rbac migrations.
--
-- Depends on (owned elsewhere): campaign.rbac_allows, comms.rbac_allows, forms.rbac_allows, grey.rbac_allows,
-- grey.can_administer_roles, events.ops_can_administer_roles. Each product policy is created only when its
-- functions exist; a product rollback that drops one of them must drop that product's policy here first.
-- @down restores both original policies exactly (reopening both holes) and drops everything above, including
-- comms_roles_write even if geiger-comms has taken it over by then.

-- @up

-- Owner/admin of the project's organization, or the creator of an org-less project.
create or replace function public.can_administer_project_roles(p_project uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select auth.uid() is not null and exists (
    select 1
      from public.projects p
      left join public.organizations o on o.id = p.organization_id and o.deleted_at is null
     where p.id = p_project
       and p.deleted_at is null
       and (
         (p.organization_id is null and p.created_by = auth.uid())
         or o.owner = auth.uid()
         or o.created_by = auth.uid()
         or exists (
           select 1
             from public.organization_users ou
            where ou.organization = o.id
              and ou."user" = auth.uid()
              and lower(ou.role::text) in ('owner', 'admin')
         )
       )
  );
$$;

-- Any member of the project's organization, or the creator of an org-less project.
create or replace function public.is_project_member(p_project uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select auth.uid() is not null and exists (
    select 1
      from public.projects p
     where p.id = p_project
       and p.deleted_at is null
       and (
         (p.organization_id is null and p.created_by = auth.uid())
         or public.is_org_member(p.organization_id)
       )
  );
$$;

revoke all on function public.can_administer_project_roles(uuid) from public, anon;
grant execute on function public.can_administer_project_roles(uuid) to authenticated, service_role;
revoke all on function public.is_project_member(uuid) from public, anon;
grant execute on function public.is_project_member(uuid) to authenticated, service_role;

-- Joins go through the SECURITY DEFINER RPCs; a direct insert is an org admin adding someone else.
drop policy if exists organization_users_insert on public.organization_users;
create policy organization_users_insert on public.organization_users
  for insert to authenticated
  with check (
    "user" is not null
    and "user" <> auth.uid()
    and public.has_org_ability(organization, 'members.add')
    and (
      lower(coalesce(role::text, '')) not in ('owner', 'admin')
      or public.org_role(organization) = 'owner'
    )
  );

do $roles$
begin
  -- public.roles is created by the first product to adopt RBAC; nothing to guard before then.
  if to_regclass('public.roles') is null then
    return;
  end if;

  drop policy if exists roles_write on public.roles;

  if to_regnamespace('assets') is not null then
    drop policy if exists assets_roles_write on public.roles;
    create policy assets_roles_write on public.roles for all to authenticated
      using (public.can_administer_project_roles(project_id))
      with check (public.can_administer_project_roles(project_id));
  end if;

  if to_regprocedure('campaign.rbac_allows(text, uuid, text, uuid)') is not null then
    drop policy if exists campaign_roles_write on public.roles;
    create policy campaign_roles_write on public.roles for all to authenticated
      using (
        public.can_administer_project_roles(project_id)
        or (
          public.is_project_member(project_id)
          and campaign.rbac_allows('campaign.role.manage', project_id)
          and not ('*' = any (permissions))
        )
      )
      with check (
        public.can_administer_project_roles(project_id)
        or (
          public.is_project_member(project_id)
          and campaign.rbac_allows('campaign.role.manage', project_id)
          and not ('*' = any (permissions))
        )
      );
  end if;

  if to_regprocedure('comms.rbac_allows(text, uuid, text, uuid)') is not null then
    drop policy if exists comms_roles_write on public.roles;
    create policy comms_roles_write on public.roles for all to authenticated
      using (
        public.can_administer_project_roles(project_id)
        or (
          public.is_project_member(project_id)
          and comms.rbac_allows('comms.role.manage', project_id)
          and not ('*' = any (permissions))
        )
      )
      with check (
        public.can_administer_project_roles(project_id)
        or (
          public.is_project_member(project_id)
          and comms.rbac_allows('comms.role.manage', project_id)
          and not ('*' = any (permissions))
        )
      );
  end if;

  if to_regprocedure('forms.rbac_allows(text, uuid, text, uuid)') is not null then
    drop policy if exists forms_roles_write on public.roles;
    create policy forms_roles_write on public.roles for all to authenticated
      using (
        public.can_administer_project_roles(project_id)
        or (
          public.is_project_member(project_id)
          and forms.rbac_allows('forms.role.manage', project_id)
          and not ('*' = any (permissions))
        )
      )
      with check (
        public.can_administer_project_roles(project_id)
        or (
          public.is_project_member(project_id)
          and forms.rbac_allows('forms.role.manage', project_id)
          and not ('*' = any (permissions))
        )
      );
  end if;

  if to_regprocedure('grey.can_administer_roles(uuid)') is not null
     and to_regprocedure('grey.rbac_allows(text, uuid, text, uuid)') is not null then
    drop policy if exists grey_roles_write on public.roles;
    create policy grey_roles_write on public.roles for all to authenticated
      using (
        project_id is not null
        and (grey.can_administer_roles(project_id) or grey.rbac_allows('grey.role.manage', project_id))
      )
      with check (
        project_id is not null
        and (grey.can_administer_roles(project_id) or grey.rbac_allows('grey.role.manage', project_id))
      );
  end if;

  if to_regprocedure('events.ops_can_administer_roles(uuid)') is not null then
    drop policy if exists events_roles_write on public.roles;
    create policy events_roles_write on public.roles for all to authenticated
      using (events.ops_can_administer_roles(project_id))
      with check (events.ops_can_administer_roles(project_id));
  end if;
end;
$roles$;

-- @down

do $roles$
begin
  if to_regclass('public.roles') is null then
    return;
  end if;

  drop policy if exists events_roles_write on public.roles;
  drop policy if exists grey_roles_write on public.roles;
  drop policy if exists forms_roles_write on public.roles;
  drop policy if exists comms_roles_write on public.roles;
  drop policy if exists campaign_roles_write on public.roles;
  drop policy if exists assets_roles_write on public.roles;

  drop policy if exists roles_write on public.roles;
  create policy roles_write on public.roles
    for all to authenticated using (true) with check (true);
end;
$roles$;

drop policy if exists organization_users_insert on public.organization_users;
create policy organization_users_insert on public.organization_users
  for insert with check ("user" = auth.uid() or public.has_org_ability(organization, 'members.add'));

drop function if exists public.is_project_member(uuid);
drop function if exists public.can_administer_project_roles(uuid);
