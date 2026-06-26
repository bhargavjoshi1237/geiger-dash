-- Organization invites + onboarding team-size capture.
--
-- Adds a token-based invite system (create invites past RLS, email an accept
-- link, accept by token) and extends create_organization with an optional
-- team-size personalization value stored in metadata.onboarding.

-- ---------------------------------------------------------------------------
-- create_organization gains an optional team_size (drop the 2-arg form first;
-- a new argument list is a different function, not a replace).
-- ---------------------------------------------------------------------------
drop function if exists public.create_organization(text, text);

create or replace function public.create_organization(
  p_name text,
  p_description text default '',
  p_team_size text default null
)
returns table (id uuid, slug text)
language plpgsql security definer set search_path = public, auth
as $$
declare
  uid uuid := auth.uid();
  base text;
  candidate text;
  n int := 2;
  new_id uuid;
  onboarding jsonb;
begin
  if uid is null then
    raise exception 'Authentication required' using errcode = '28000';
  end if;
  if coalesce(btrim(p_name), '') = '' then
    raise exception 'Organization name is required' using errcode = '22023';
  end if;

  base := btrim(coalesce(nullif(regexp_replace(lower(btrim(p_name)), '[^a-z0-9]+', '-', 'g'), ''), 'workspace'), '-');
  if base = '' then base := 'workspace'; end if;
  base := left(base, 48);
  candidate := base;
  while exists (select 1 from public.organizations o where o.slug = candidate) loop
    candidate := base || '-' || n;
    n := n + 1;
    if n > 1000 then
      candidate := base || '-' || left(replace(gen_random_uuid()::text, '-', ''), 8);
      exit;
    end if;
  end loop;

  onboarding := jsonb_build_object('source', 'wizard', 'completedAt', now());
  if coalesce(btrim(p_team_size), '') <> '' then
    onboarding := onboarding || jsonb_build_object('teamSize', btrim(p_team_size));
  end if;

  insert into public.organizations (name, description, slug, created_by, owner, is_active, metadata)
  values (
    btrim(p_name),
    coalesce(btrim(p_description), ''),
    candidate,
    uid, uid, true,
    jsonb_build_object('members', jsonb_build_array(uid::text), 'onboarding', onboarding)
  )
  returning organizations.id into new_id;

  if not exists (
    select 1 from public.organization_users ou
    where ou.organization = new_id and ou."user" = uid
  ) then
    insert into public.organization_users (organization, "user", role)
    values (new_id, uid, 'Owner');
  end if;

  id := new_id;
  slug := candidate;
  return next;
end;
$$;

grant execute on function public.create_organization(text, text, text) to authenticated, service_role;

-- ---------------------------------------------------------------------------
-- organization_invites
-- ---------------------------------------------------------------------------
create table if not exists public.organization_invites (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  email text not null,
  role public."Role" not null default 'User',
  token text not null unique,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'revoked')),
  invited_by uuid,
  accepted_by uuid,
  created_at timestamptz not null default now(),
  accepted_at timestamptz
);

create index if not exists organization_invites_org_idx on public.organization_invites(organization_id, status);
create index if not exists organization_invites_token_idx on public.organization_invites(token);

alter table public.organization_invites enable row level security;
drop policy if exists organization_invites_select on public.organization_invites;
drop policy if exists organization_invites_write on public.organization_invites;
create policy organization_invites_select on public.organization_invites
  for select using (public.is_org_member(organization_id));
create policy organization_invites_write on public.organization_invites
  for all using (public.has_org_ability(organization_id, 'members.add'))
  with check (public.has_org_ability(organization_id, 'members.add'));

revoke all on public.organization_invites from anon;
grant select, insert, update, delete on public.organization_invites to authenticated;
grant all on public.organization_invites to service_role;

-- ---------------------------------------------------------------------------
-- Invite RPCs (SECURITY DEFINER): create past RLS with server-generated tokens,
-- preview by token, and accept by token (capability link).
-- ---------------------------------------------------------------------------
create or replace function public.invite_to_organization(p_org uuid, p_emails text[], p_role text default 'User')
returns table (email text, token text)
language plpgsql security definer set search_path = public, auth
as $$
declare
  uid uuid := auth.uid();
  e text;
  norm text;
  tok text;
  r public."Role";
begin
  if uid is null then
    raise exception 'Authentication required' using errcode = '28000';
  end if;
  if not public.has_org_ability(p_org, 'members.add') then
    raise exception 'Not allowed to invite to this organization' using errcode = '42501';
  end if;

  begin
    r := p_role::public."Role";
  exception when others then
    r := 'User';
  end;

  foreach e in array coalesce(p_emails, array[]::text[]) loop
    norm := lower(btrim(e));
    if norm = '' or position('@' in norm) = 0 then
      continue;
    end if;

    select oi.token into tok
    from public.organization_invites oi
    where oi.organization_id = p_org and lower(oi.email) = norm and oi.status = 'pending'
    limit 1;

    if tok is null then
      -- 64 hex chars from two core gen_random_uuid()s (avoids pgcrypto/schema issues).
      tok := replace(gen_random_uuid()::text, '-', '') || replace(gen_random_uuid()::text, '-', '');
      insert into public.organization_invites (organization_id, email, role, token, invited_by)
      values (p_org, norm, r, tok, uid);
    end if;

    email := norm;
    token := tok;
    return next;
    tok := null;
  end loop;
end;
$$;

create or replace function public.get_invite(p_token text)
returns table (organization_id uuid, org_name text, email text, role text, status text)
language sql security definer set search_path = public
as $$
  select oi.organization_id, o.name, oi.email, oi.role::text, oi.status
  from public.organization_invites oi
  join public.organizations o on o.id = oi.organization_id
  where oi.token = p_token
  limit 1;
$$;

create or replace function public.accept_invite(p_token text)
returns table (organization_id uuid, org_name text)
language plpgsql security definer set search_path = public, auth
as $$
declare
  uid uuid := auth.uid();
  inv public.organization_invites%rowtype;
  org public.organizations%rowtype;
  members jsonb;
begin
  if uid is null then
    raise exception 'Authentication required' using errcode = '28000';
  end if;

  select * into inv from public.organization_invites where token = p_token and status = 'pending' limit 1;
  if not found then
    return;
  end if;

  select * into org from public.organizations where id = inv.organization_id and deleted_at is null;
  if not found then
    return;
  end if;

  if not exists (
    select 1 from public.organization_users ou
    where ou.organization = org.id and ou."user" = uid
  ) then
    insert into public.organization_users (organization, "user", role)
    values (org.id, uid, inv.role);
  end if;

  members := case when jsonb_typeof(org.metadata->'members') = 'array' then org.metadata->'members' else '[]'::jsonb end;
  if not (members ? uid::text) then
    update public.organizations
    set metadata = coalesce(metadata, '{}'::jsonb) || jsonb_build_object('members', members || to_jsonb(uid::text))
    where id = org.id;
  end if;

  update public.organization_invites
  set status = 'accepted', accepted_at = now(), accepted_by = uid
  where id = inv.id;

  organization_id := org.id;
  org_name := org.name;
  return next;
end;
$$;

grant execute on function public.invite_to_organization(uuid, text[], text) to authenticated, service_role;
grant execute on function public.get_invite(text) to authenticated, service_role;
grant execute on function public.accept_invite(text) to authenticated, service_role;
