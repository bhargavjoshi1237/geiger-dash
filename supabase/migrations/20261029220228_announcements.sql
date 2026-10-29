-- Announcements
--
-- In-app announcement modals (centered modal, corner card, full-screen takeover, multi-step carousel)
-- authored in Studio and shown by @geiger/ui's AnnouncementHost in any suite app.
-- Owns public.announcements, public.announcement_events, public.announcement_texts(jsonb),
-- public.announcements_for(text), public.log_announcement_event(uuid, text, text, text, integer),
-- public.announcement_stats(uuid) and public.announcement_audience_lookup(text).
-- Depends on public.is_content_editor() (20261023112956_docs_editing).

-- @up
create extension if not exists pgcrypto;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Content, look, placement, audience, schedule and frequency for one announcement.
create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  name text not null default '',
  format text not null default 'modal',
  status text not null default 'draft',
  priority integer not null default 0,
  slides jsonb not null default '[]'::jsonb,
  design jsonb not null default '{}'::jsonb,
  audience jsonb not null default '{}'::jsonb,
  frequency jsonb not null default '{"mode":"once"}'::jsonb,
  apps text[] not null default '{}',
  routes text[] not null default '{}',
  exclude_routes text[] not null default '{}',
  starts_at timestamptz,
  ends_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint announcements_format_check check (format in ('modal', 'corner', 'takeover', 'carousel')),
  constraint announcements_status_check check (status in ('draft', 'live', 'paused', 'ended'))
);

create index if not exists announcements_live_idx
  on public.announcements (status, priority desc)
  where deleted_at is null;

drop trigger if exists announcements_touch_updated_at on public.announcements;
create trigger announcements_touch_updated_at
before update on public.announcements
for each row execute function public.touch_updated_at();

-- Append-only view/click/dismiss log: drives per-user frequency caps and Studio analytics.
create table if not exists public.announcement_events (
  id uuid primary key default gen_random_uuid(),
  announcement_id uuid not null references public.announcements(id) on delete cascade,
  user_id uuid not null,
  kind text not null,
  app text not null default '',
  path text not null default '',
  slide integer,
  created_at timestamptz not null default now(),
  constraint announcement_events_kind_check check (kind in ('view', 'click', 'dismiss'))
);

create index if not exists announcement_events_user_idx
  on public.announcement_events (user_id, announcement_id, kind);
create index if not exists announcement_events_announcement_idx
  on public.announcement_events (announcement_id, kind);

-- Editors manage announcements and read the event log; everyone else goes through the RPCs below.
alter table public.announcements enable row level security;
alter table public.announcement_events enable row level security;

drop policy if exists announcements_editors_all on public.announcements;
create policy announcements_editors_all on public.announcements
  for all to authenticated
  using (public.is_content_editor())
  with check (public.is_content_editor());

drop policy if exists announcement_events_editors_read on public.announcement_events;
create policy announcement_events_editors_read on public.announcement_events
  for select to authenticated
  using (public.is_content_editor());

revoke all on public.announcements from anon, authenticated;
revoke all on public.announcement_events from anon, authenticated;
grant select, insert, update on public.announcements to authenticated;
grant select on public.announcement_events to authenticated;

-- A jsonb string array as text[]; anything else is an empty list.
create or replace function public.announcement_texts(p jsonb)
returns text[]
language sql
immutable
set search_path = ''
as $$
  select case
    when jsonb_typeof(p) = 'array' then array(select jsonb_array_elements_text(p))
    else '{}'::text[]
  end;
$$;

-- Live announcements the signed-in user qualifies for in p_app, highest priority first.
-- Route globs are returned for the client to match on every navigation.
create or replace function public.announcements_for(p_app text)
returns table (
  id uuid,
  format text,
  priority integer,
  slides jsonb,
  design jsonb,
  frequency jsonb,
  routes text[],
  exclude_routes text[],
  updated_at timestamptz
)
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_app text := lower(coalesce(btrim(p_app), ''));
  v_joined timestamptz;
  v_orgs text[] := '{}';
  v_roles text[] := '{}';
  v_plans text[] := '{}';
  v_states text[] := '{}';
  v_products text[] := '{}';
  v_plan record;
  v_end timestamptz;
begin
  if v_uid is null then
    return;
  end if;

  select u.created_at into v_joined from auth.users u where u.id = v_uid;

  -- Org membership across the relational table, owner/creator columns and legacy metadata.members.
  with membership as (
    select o.id::text as org, 'Owner'::text as role
    from public.organizations o
    where o.owner = v_uid or o.created_by = v_uid
    union all
    select ou.organization::text, coalesce(ou.role::text, 'User')
    from public.organization_users ou
    where ou."user" = v_uid
    union all
    select o.id::text, 'User'
    from public.organizations o
    where jsonb_typeof(o.metadata -> 'members') = 'array' and o.metadata -> 'members' ? v_uid::text
  )
  select coalesce(array_agg(distinct m.org), '{}'), coalesce(array_agg(distinct m.role), '{}')
  into v_orgs, v_roles
  from membership m
  where m.org is not null;

  -- Live org subscriptions (organizations.metadata.subscription), mirroring lib/billing/entitlements.js.
  with subs as (
    select o.metadata -> 'subscription' as s
    from public.organizations o
    where o.id::text = any(v_orgs) and jsonb_typeof(o.metadata -> 'subscription') = 'object'
  ),
  live as (
    select s
    from subs
    where s ->> 'status' in ('active', 'trialing')
      and (
        s ->> 'planKey' = 'beta'
        or case
          when s ->> 'currentPeriodEnd' ~ '^\d{4}-\d{2}-\d{2}' then (s ->> 'currentPeriodEnd')::timestamptz > now()
          when s ->> 'updatedAt' ~ '^\d{4}-\d{2}-\d{2}' then
            (s ->> 'updatedAt')::timestamptz
              + make_interval(days => case when s ->> 'billingInterval' = 'year' then 365 else 30 end) > now()
          else true
        end
      )
  )
  select
    coalesce(array_agg(distinct live.s ->> 'planKey') filter (where live.s ->> 'planKey' is not null), '{}'),
    coalesce(array_agg(distinct live.s ->> 'status'), '{}'),
    coalesce((
      select array_agg(distinct p)
      from live l2, lateral unnest(public.announcement_texts(l2.s -> 'products')) as p
    ), '{}')
  into v_plans, v_states, v_products
  from live;

  -- The user's own plan, mirroring lib/billing/plan_state.js (30-day grace after the period ends).
  select up.plan_key, up.status, up.products, up.current_period_end
  into v_plan
  from public.user_plan up
  where up.user_id = v_uid;

  if found then
    v_end := v_plan.current_period_end;
    if v_plan.status in ('active', 'trialing') then
      if v_end is null or now() < v_end then
        v_states := array_append(v_states, v_plan.status);
        v_plans := array_append(v_plans, v_plan.plan_key);
        v_products := v_products || coalesce(v_plan.products, '{}');
      elsif now() < v_end + interval '30 days' then
        v_states := array_append(v_states, 'grace');
      else
        v_states := array_append(v_states, 'expired');
      end if;
    elsif v_plan.status = 'expired' then
      v_states := array_append(v_states, 'expired');
    end if;
  end if;

  if cardinality(v_plans) = 0 then
    v_plans := array['none'];
  end if;
  if cardinality(v_states) = 0 then
    v_states := array['none'];
  end if;
  -- Beta unlocks every app.
  if 'beta' = any(v_plans) then
    v_products := array['*'];
  end if;

  return query
  with mine as (
    select
      e.announcement_id,
      count(*) filter (where e.kind = 'view') as views,
      bool_or(e.kind = 'click') as clicked,
      max(e.created_at) filter (where e.kind in ('click', 'dismiss')) as last_closed
    from public.announcement_events e
    where e.user_id = v_uid
    group by e.announcement_id
  )
  select a.id, a.format, a.priority, a.slides, a.design, a.frequency, a.routes, a.exclude_routes, a.updated_at
  from public.announcements a
  left join mine on mine.announcement_id = a.id
  where a.deleted_at is null
    and a.status = 'live'
    and (a.starts_at is null or a.starts_at <= now())
    and (a.ends_at is null or a.ends_at > now())
    and (cardinality(a.apps) = 0 or v_app = any(a.apps))
    -- Audience: every filled rule must match; an empty list matches everyone.
    and not (v_uid::text = any(public.announcement_texts(a.audience -> 'excludeUserIds')))
    and (cardinality(public.announcement_texts(a.audience -> 'userIds')) = 0
      or v_uid::text = any(public.announcement_texts(a.audience -> 'userIds')))
    and (cardinality(public.announcement_texts(a.audience -> 'orgIds')) = 0
      or v_orgs && public.announcement_texts(a.audience -> 'orgIds'))
    and (cardinality(public.announcement_texts(a.audience -> 'roles')) = 0
      or v_roles && public.announcement_texts(a.audience -> 'roles'))
    and (cardinality(public.announcement_texts(a.audience -> 'plans')) = 0
      or v_plans && public.announcement_texts(a.audience -> 'plans'))
    and (cardinality(public.announcement_texts(a.audience -> 'planStates')) = 0
      or v_states && public.announcement_texts(a.audience -> 'planStates'))
    and (cardinality(public.announcement_texts(a.audience -> 'products')) = 0
      or '*' = any(v_products)
      or v_products && public.announcement_texts(a.audience -> 'products'))
    and (
      coalesce(a.audience -> 'account' ->> 'mode', 'any') = 'any'
      or v_joined is null
      or (
        (a.audience -> 'account' ->> 'mode') = 'new'
        and v_joined > now() - make_interval(days => greatest(1, coalesce(nullif(a.audience -> 'account' ->> 'days', '')::int, 14)))
      )
      or (
        (a.audience -> 'account' ->> 'mode') = 'existing'
        and v_joined <= now() - make_interval(days => greatest(1, coalesce(nullif(a.audience -> 'account' ->> 'days', '')::int, 14)))
      )
    )
    -- Frequency: a CTA click ends it unless stopOnClick is off; 'session' and 'always' are capped client-side.
    and not (coalesce((a.frequency ->> 'stopOnClick')::boolean, true) and coalesce(mine.clicked, false))
    and case coalesce(a.frequency ->> 'mode', 'once')
      when 'once' then mine.last_closed is null
      when 'times' then coalesce(mine.views, 0) < greatest(1, coalesce(nullif(a.frequency ->> 'times', '')::int, 1))
      when 'interval' then mine.last_closed is null
        or mine.last_closed < now() - make_interval(days => greatest(1, coalesce(nullif(a.frequency ->> 'days', '')::int, 7)))
      else true
    end
  order by a.priority desc, a.starts_at desc nulls last, a.updated_at desc
  limit 20;
end;
$$;

revoke all on function public.announcements_for(text) from public;
grant execute on function public.announcements_for(text) to authenticated;

-- Records one view/click/dismiss for the signed-in user; silently ignores anything invalid.
create or replace function public.log_announcement_event(
  p_id uuid,
  p_kind text,
  p_app text default '',
  p_path text default '',
  p_slide integer default null
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null or p_kind not in ('view', 'click', 'dismiss') then
    return;
  end if;
  if not exists (select 1 from public.announcements a where a.id = p_id and a.deleted_at is null) then
    return;
  end if;
  insert into public.announcement_events (announcement_id, user_id, kind, app, path, slide)
  values (p_id, auth.uid(), p_kind, left(lower(coalesce(p_app, '')), 40), left(coalesce(p_path, ''), 300), p_slide);
end;
$$;

revoke all on function public.log_announcement_event(uuid, text, text, text, integer) from public;
grant execute on function public.log_announcement_event(uuid, text, text, text, integer) to authenticated;

-- Event and unique-user counts per announcement, app and kind; RLS limits it to editors.
create or replace function public.announcement_stats(p_id uuid default null)
returns table (announcement_id uuid, app text, kind text, events bigint, users bigint)
language sql
stable
set search_path = ''
as $$
  select e.announcement_id, e.app, e.kind, count(*), count(distinct e.user_id)
  from public.announcement_events e
  where p_id is null or e.announcement_id = p_id
  group by e.announcement_id, e.app, e.kind;
$$;

revoke all on function public.announcement_stats(uuid) from public;
grant execute on function public.announcement_stats(uuid) to authenticated;

-- Studio audience picker: users by email/name and organizations by name. Editors only.
create or replace function public.announcement_audience_lookup(p_query text)
returns table (kind text, id text, label text, detail text)
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_q text := '%' || lower(btrim(coalesce(p_query, ''))) || '%';
begin
  if not public.is_content_editor() or length(btrim(coalesce(p_query, ''))) < 2 then
    return;
  end if;

  return query
  (
    select 'user'::text, u.id::text,
      coalesce(u.raw_user_meta_data ->> 'full_name', u.raw_user_meta_data ->> 'name', u.email::text),
      u.email::text
    from auth.users u
    where lower(u.email::text) like v_q
      or lower(coalesce(u.raw_user_meta_data ->> 'full_name', u.raw_user_meta_data ->> 'name', '')) like v_q
    limit 8
  )
  union all
  (
    select 'org'::text, o.id::text, coalesce(o.name, 'Untitled organization'), coalesce(o.slug, '')
    from public.organizations o
    where lower(coalesce(o.name, '')) like v_q or lower(coalesce(o.slug, '')) like v_q
    limit 8
  );
end;
$$;

revoke all on function public.announcement_audience_lookup(text) from public;
grant execute on function public.announcement_audience_lookup(text) to authenticated;

-- @down
drop function if exists public.announcement_audience_lookup(text);
drop function if exists public.announcement_stats(uuid);
drop function if exists public.log_announcement_event(uuid, text, text, text, integer);
drop function if exists public.announcements_for(text);
drop function if exists public.announcement_texts(jsonb);
drop table if exists public.announcement_events cascade;
drop table if exists public.announcements cascade;
