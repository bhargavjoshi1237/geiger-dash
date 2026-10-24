-- Fix has_org_ability role_key ambiguity
--
-- public.has_org_ability (20260629212507_org_abilities_rls) keeps the caller's org role in a plpgsql variable named
-- role_key, then filters public.org_role_ability on ra.role_key = role_key. Postgres cannot tell the column from the
-- variable, so every call that reaches that lookup raises 42702 "column reference role_key is ambiguous": any member
-- who is not an owner, checking any ability outside an open module (members.*, org.*). Delegated org abilities never
-- worked, invite_to_organization / set_organization_member_role / remove_organization_member raised instead of
-- refusing, and the organizations, organization_users and organization_invites policies that call it errored.
--
-- Same signature, volatility, SECURITY DEFINER, search_path and grants; same semantics: no session or no org role is
-- false, an owner is true, an open module is true for any member, otherwise a per-role grant of the ability or '*'.
-- Only the variable is renamed and the parameters are qualified.
--
-- Becomes the owner of: public.has_org_ability(uuid, text), from 20260629212507_org_abilities_rls.
-- @down restores the 20260629212507 body verbatim, ambiguity included.

-- @up

create or replace function public.has_org_ability(target_org uuid, ability text)
returns boolean
language plpgsql stable security definer set search_path = public, auth
as $$
declare
  v_role_key text;
begin
  if auth.uid() is null then
    return false;
  end if;

  v_role_key := public.org_role(has_org_ability.target_org);
  if v_role_key is null then
    return false;
  end if;

  -- Owners can do anything.
  if v_role_key = 'owner' then
    return true;
  end if;

  -- Open modules are available to every member.
  if exists (
    select 1 from public.org_open_module om
    where om.module = split_part(has_org_ability.ability, '.', 1)
  ) then
    return true;
  end if;

  -- Otherwise require an explicit per-role grant ('*' = all abilities).
  return exists (
    select 1 from public.org_role_ability ra
    where ra.organization_id = has_org_ability.target_org
      and ra.role_key = v_role_key
      and (ra.ability = has_org_ability.ability or ra.ability = '*')
  );
end;
$$;

-- @down

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
