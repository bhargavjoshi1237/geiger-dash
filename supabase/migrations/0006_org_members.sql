-- Organization member directory + management RPCs.
--
-- Members reference auth.users, which the anon client can't read, so listing a
-- member's identity (email / name / avatar) goes through a SECURITY DEFINER RPC.
-- Management (remove / set-role) is gated by has_org_ability(org,'members.manage')
-- (owner-only by default) and never touches the owner/creator. Idempotent.

-- ---------------------------------------------------------------------------
-- List members with identity + role. Visible to any org member; unions the
-- relational rows, the owner/creator columns, and the legacy metadata.members
-- array (mirroring is_org_member) so the directory can't disagree with access.
-- ---------------------------------------------------------------------------
create or replace function public.organization_members(p_org uuid)
returns table (
  user_id uuid,
  email text,
  name text,
  avatar_url text,
  member_role text,
  is_owner boolean,
  is_creator boolean,
  joined_at timestamptz
)
language plpgsql stable security definer set search_path = public, auth
as $$
declare
  v_owner uuid;
  v_creator uuid;
begin
  if not public.is_org_member(p_org) then
    return;
  end if;

  select o.owner, o.created_by into v_owner, v_creator
  from public.organizations o
  where o.id = p_org;

  return query
  with raw as (
    select ou."user" as uid, ou.role::text as role, ou.created_at as joined
    from public.organization_users ou
    where ou.organization = p_org and ou."user" is not null
    union all
    select v_owner, 'Owner'::text, null::timestamptz where v_owner is not null
    union all
    select v_creator, 'Owner'::text, null::timestamptz where v_creator is not null
    union all
    select (m.value)::uuid, null::text, null::timestamptz
    from public.organizations o
    cross join lateral jsonb_array_elements_text(
      case when jsonb_typeof(o.metadata->'members') = 'array'
           then o.metadata->'members' else '[]'::jsonb end
    ) as m(value)
    where o.id = p_org
  ),
  grouped as (
    -- The injected 'Owner' rows are excluded here so a member's real relational
    -- role wins; owner/creator are surfaced through the boolean flags instead.
    select uid,
           max(role) filter (where role is not null and role <> 'Owner') as member_role,
           max(joined) as joined
    from raw
    where uid is not null
    group by uid
  )
  select
    g.uid,
    u.email::text,
    coalesce(
      u.raw_user_meta_data->>'full_name',
      u.raw_user_meta_data->>'name',
      u.raw_user_meta_data->>'display_name'
    )::text,
    (u.raw_user_meta_data->>'avatar_url')::text,
    g.member_role,
    (g.uid = v_owner) as is_owner,
    (g.uid = v_creator) as is_creator,
    g.joined
  from grouped g
  left join auth.users u on u.id = g.uid
  order by (g.uid = v_owner) desc, (g.uid = v_creator) desc, g.joined asc nulls last, u.email asc;
end;
$$;

grant execute on function public.organization_members(uuid) to authenticated, service_role;

-- ---------------------------------------------------------------------------
-- Remove a member (relational row + legacy metadata array). Owner/creator can
-- never be removed. Returns false when the caller lacks members.manage.
-- ---------------------------------------------------------------------------
create or replace function public.remove_organization_member(p_org uuid, p_user uuid)
returns boolean
language plpgsql volatile security definer set search_path = public, auth
as $$
declare
  v_owner uuid;
  v_creator uuid;
  members jsonb;
begin
  if p_user is null or not public.has_org_ability(p_org, 'members.manage') then
    return false;
  end if;

  select o.owner, o.created_by into v_owner, v_creator
  from public.organizations o where o.id = p_org;
  if p_user = v_owner or p_user = v_creator then
    return false;
  end if;

  delete from public.organization_users
  where organization = p_org and "user" = p_user;

  select case when jsonb_typeof(o.metadata->'members') = 'array'
              then o.metadata->'members' else '[]'::jsonb end
    into members
  from public.organizations o where o.id = p_org;

  if members ? p_user::text then
    update public.organizations
    set metadata = coalesce(metadata, '{}'::jsonb)
                   || jsonb_build_object('members', members - p_user::text)
    where id = p_org;
  end if;

  return true;
end;
$$;

grant execute on function public.remove_organization_member(uuid, uuid) to authenticated, service_role;

-- ---------------------------------------------------------------------------
-- Set a member's role (upsert into organization_users — the table has no unique
-- (organization,user) constraint, so update-then-insert). Owner/creator role is
-- fixed. Rejects an unknown role rather than silently defaulting.
-- ---------------------------------------------------------------------------
create or replace function public.set_organization_member_role(p_org uuid, p_user uuid, p_role text)
returns boolean
language plpgsql volatile security definer set search_path = public, auth
as $$
declare
  v_owner uuid;
  v_creator uuid;
  r public."Role";
  updated int;
begin
  if p_user is null or coalesce(btrim(p_role), '') = '' then
    return false;
  end if;
  if not public.has_org_ability(p_org, 'members.manage') then
    return false;
  end if;

  select o.owner, o.created_by into v_owner, v_creator
  from public.organizations o where o.id = p_org;
  if p_user = v_owner or p_user = v_creator then
    return false;
  end if;

  begin
    r := p_role::public."Role";
  exception when others then
    return false;
  end;

  update public.organization_users
  set role = r
  where organization = p_org and "user" = p_user;
  get diagnostics updated = row_count;

  if updated = 0 then
    insert into public.organization_users (organization, "user", role)
    values (p_org, p_user, r);
  end if;

  return true;
end;
$$;

grant execute on function public.set_organization_member_role(uuid, uuid, text) to authenticated, service_role;
