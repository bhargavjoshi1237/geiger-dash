-- Organization join requests
--
-- Joining an organization by ID or slug no longer makes the caller a member: it files a pending request that the
-- organization's owner (or anyone holding members.add) approves or declines. Invites (invite_to_organization,
-- accept_invite) are unchanged. Builds on 20261024195500_harden_org_and_roles_rls, which stops direct self-inserts
-- into organization_users; every write here runs past RLS inside a SECURITY DEFINER RPC.
--
-- Owns (new):
--   public.organization_join_requests            one row per request; at most one pending per user per org
--   public.request_to_join_organization(text, text)  files (or returns) the caller's pending request; 'member' if already in
--   public.approve_join_request(uuid)            members.add holders only; adds the requester as User, the lowest role
--   public.decline_join_request(uuid)            members.add holders only; no membership
--   public.pending_join_requests(uuid)           an org's pending requests with requester identity, for approvers
--   public.my_pending_join_requests()            the caller's own pending requests with the org name
-- Becomes the owner of: public.join_organization(text), from 20260629212507_org_abilities_rls. It keeps its name,
-- signature and grants but now files a request through request_to_join_organization.
-- Redefines (same body): public.touch_updated_at(), shared with other public tables, so @down leaves it in place.
-- @down restores join_organization's original body exactly (immediate membership) and drops everything above.

-- @up

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.organization_join_requests (
  id uuid primary key default gen_random_uuid(),
  organization uuid not null references public.organizations(id) on delete cascade,
  "user" uuid not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'declined')),
  message text,
  decided_by uuid,
  decided_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create unique index if not exists organization_join_requests_one_pending
  on public.organization_join_requests (organization, "user")
  where status = 'pending' and deleted_at is null;
create index if not exists organization_join_requests_org_status_idx
  on public.organization_join_requests (organization, status)
  where deleted_at is null;
create index if not exists organization_join_requests_user_idx
  on public.organization_join_requests ("user")
  where deleted_at is null;

drop trigger if exists organization_join_requests_touch_updated_at on public.organization_join_requests;
create trigger organization_join_requests_touch_updated_at
before update on public.organization_join_requests
for each row execute function public.touch_updated_at();

-- Requesters read their own rows and approvers their org's; every write goes through the RPCs below.
alter table public.organization_join_requests enable row level security;
drop policy if exists organization_join_requests_select on public.organization_join_requests;
create policy organization_join_requests_select on public.organization_join_requests
  for select to authenticated
  using ("user" = auth.uid() or public.has_org_ability(organization, 'members.add'));

revoke all on public.organization_join_requests from anon, authenticated;
grant select on public.organization_join_requests to authenticated;
grant all on public.organization_join_requests to service_role;

-- Files the caller's request by org ID or slug, or returns the pending one; status is 'pending' or 'member'.
create or replace function public.request_to_join_organization(q text, p_message text default null)
returns table (id uuid, name text, status text, request_id uuid)
language plpgsql
volatile
security definer
set search_path = public, auth
as $$
#variable_conflict use_column
declare
  uid uuid := auth.uid();
  org public.organizations%rowtype;
  note text := left(nullif(btrim(coalesce(p_message, '')), ''), 500);
  req uuid;
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

  if public.is_org_member(org.id) then
    id := org.id;
    name := org.name;
    status := 'member';
    request_id := null;
    return next;
    return;
  end if;

  select r.id into req
  from public.organization_join_requests r
  where r.organization = org.id and r."user" = uid and r.status = 'pending' and r.deleted_at is null
  limit 1;

  if req is null then
    begin
      insert into public.organization_join_requests (organization, "user", message, created_by)
      values (org.id, uid, note, uid)
      returning organization_join_requests.id into req;
    exception when unique_violation then
      -- A concurrent call filed it first; reuse that one.
      select r.id into req
      from public.organization_join_requests r
      where r.organization = org.id and r."user" = uid and r.status = 'pending' and r.deleted_at is null
      limit 1;
    end;
  end if;

  id := org.id;
  name := org.name;
  status := 'pending';
  request_id := req;
  return next;
end;
$$;

-- Kept for any caller of the old name: it now files a request instead of adding a member.
create or replace function public.join_organization(q text)
returns table (id uuid, name text)
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  return query select r.id, r.name from public.request_to_join_organization(q) r;
end;
$$;

-- Approves a pending request: adds the requester as User and mirrors metadata.members, the way joining used to.
create or replace function public.approve_join_request(p_request uuid)
returns table (id uuid, organization_id uuid, org_name text, user_id uuid, status text)
language plpgsql
volatile
security definer
set search_path = public, auth
as $$
#variable_conflict use_column
declare
  uid uuid := auth.uid();
  req public.organization_join_requests%rowtype;
  org public.organizations%rowtype;
  members jsonb;
begin
  if uid is null then
    raise exception 'Authentication required' using errcode = '28000';
  end if;

  select * into req
  from public.organization_join_requests r
  where r.id = p_request and r.deleted_at is null
  for update;
  if not found then
    return;
  end if;

  if not public.has_org_ability(req.organization, 'members.add') then
    raise exception 'Not allowed to decide join requests for this organization' using errcode = '42501';
  end if;

  if req.status <> 'pending' then
    return;
  end if;

  select * into org from public.organizations o where o.id = req.organization and o.deleted_at is null;
  if not found then
    return;
  end if;

  if not exists (
    select 1 from public.organization_users ou
    where ou.organization = org.id and ou."user" = req."user"
  ) then
    insert into public.organization_users (organization, "user", role)
    values (org.id, req."user", 'User');
  end if;

  members := case when jsonb_typeof(org.metadata->'members') = 'array'
                  then org.metadata->'members' else '[]'::jsonb end;
  if not (members ? req."user"::text) then
    update public.organizations o
    set metadata = coalesce(o.metadata, '{}'::jsonb)
                   || jsonb_build_object('members', members || to_jsonb(req."user"::text))
    where o.id = org.id;
  end if;

  update public.organization_join_requests r
  set status = 'approved', decided_by = uid, decided_at = now()
  where r.id = req.id;

  id := req.id;
  organization_id := org.id;
  org_name := org.name;
  user_id := req."user";
  status := 'approved';
  return next;
end;
$$;

-- Declines a pending request; the requester stays outside the organization and may ask again.
create or replace function public.decline_join_request(p_request uuid)
returns table (id uuid, organization_id uuid, org_name text, user_id uuid, status text)
language plpgsql
volatile
security definer
set search_path = public, auth
as $$
#variable_conflict use_column
declare
  uid uuid := auth.uid();
  req public.organization_join_requests%rowtype;
  v_name text;
begin
  if uid is null then
    raise exception 'Authentication required' using errcode = '28000';
  end if;

  select * into req
  from public.organization_join_requests r
  where r.id = p_request and r.deleted_at is null
  for update;
  if not found then
    return;
  end if;

  if not public.has_org_ability(req.organization, 'members.add') then
    raise exception 'Not allowed to decide join requests for this organization' using errcode = '42501';
  end if;

  if req.status <> 'pending' then
    return;
  end if;

  update public.organization_join_requests r
  set status = 'declined', decided_by = uid, decided_at = now()
  where r.id = req.id;

  select o.name into v_name from public.organizations o where o.id = req.organization;

  id := req.id;
  organization_id := req.organization;
  org_name := v_name;
  user_id := req."user";
  status := 'declined';
  return next;
end;
$$;

-- An org's pending requests with the requester's identity (auth.users is unreadable to clients); approvers only.
create or replace function public.pending_join_requests(p_org uuid)
returns table (
  id uuid,
  user_id uuid,
  email text,
  name text,
  avatar_url text,
  message text,
  created_at timestamptz
)
language plpgsql
stable
security definer
set search_path = public, auth
as $$
begin
  if not public.has_org_ability(p_org, 'members.add') then
    return;
  end if;

  -- Hides requests from people who got in another way meanwhile (an accepted invite, say).
  return query
  select r.id,
         r."user",
         u.email::text,
         coalesce(
           u.raw_user_meta_data->>'full_name',
           u.raw_user_meta_data->>'name',
           u.raw_user_meta_data->>'display_name'
         )::text,
         (u.raw_user_meta_data->>'avatar_url')::text,
         r.message,
         r.created_at
  from public.organization_join_requests r
  left join auth.users u on u.id = r."user"
  where r.organization = p_org
    and r.status = 'pending'
    and r.deleted_at is null
    and not exists (
      select 1 from public.organization_users ou
      where ou.organization = p_org and ou."user" = r."user"
    )
    and not exists (
      select 1 from public.organizations o
      where o.id = p_org
        and jsonb_typeof(o.metadata->'members') = 'array'
        and (o.metadata->'members') ? r."user"::text
    )
  order by r.created_at asc;
end;
$$;

-- The caller's pending requests with the org name, which RLS on organizations hides from non-members.
create or replace function public.my_pending_join_requests()
returns table (id uuid, organization_id uuid, org_name text, created_at timestamptz)
language sql
stable
security definer
set search_path = public, auth
as $$
  select r.id, o.id, o.name, r.created_at
  from public.organization_join_requests r
  join public.organizations o on o.id = r.organization and o.deleted_at is null
  where r."user" = auth.uid()
    and r.status = 'pending'
    and r.deleted_at is null
  order by r.created_at desc;
$$;

revoke all on function public.request_to_join_organization(text, text) from public, anon;
grant execute on function public.request_to_join_organization(text, text) to authenticated, service_role;
revoke all on function public.approve_join_request(uuid) from public, anon;
grant execute on function public.approve_join_request(uuid) to authenticated, service_role;
revoke all on function public.decline_join_request(uuid) from public, anon;
grant execute on function public.decline_join_request(uuid) to authenticated, service_role;
revoke all on function public.pending_join_requests(uuid) from public, anon;
grant execute on function public.pending_join_requests(uuid) to authenticated, service_role;
revoke all on function public.my_pending_join_requests() from public, anon;
grant execute on function public.my_pending_join_requests() to authenticated, service_role;

-- @down

create or replace function public.join_organization(q text)
returns table (id uuid, name text)
language plpgsql
security definer
set search_path = public, auth
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

drop function if exists public.my_pending_join_requests();
drop function if exists public.pending_join_requests(uuid);
drop function if exists public.decline_join_request(uuid);
drop function if exists public.approve_join_request(uuid);
drop function if exists public.request_to_join_organization(text, text);
drop table if exists public.organization_join_requests cascade;
