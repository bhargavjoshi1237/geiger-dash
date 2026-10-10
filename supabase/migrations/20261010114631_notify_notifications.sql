-- Notify: suite-wide notifications
--
-- Owns the `notify` schema — the cross-app notification store read and written
-- by the @geiger/notify package from every Geiger product on the shared session.
--
--   notify.notifications  one row per message (what was said, by which app)
--   notify.deliveries     one row per recipient (read / seen / archived state)
--   notify.preferences    per-user mute rules, most-specific rule wins
--   notify.inbox          security-invoker view: the caller's live deliveries
--
-- A notification targets a user, a list of users, or a whole organization
-- ("team" = org, optionally narrowed by member role). notify.send() resolves
-- the audience, applies mute rules and fans out deliveries atomically; clients
-- never insert rows directly. Deliveries are in the supabase_realtime
-- publication so bells update live.
--
-- Authorisation: signed-in senders may notify themselves, users who share an
-- organization with them, or an organization they belong to. The service role
-- (and direct DB sessions) are trusted and may target anyone and set the actor.
--
-- Self-contained: creates the schema, its touch_updated_at() trigger function,
-- tables, view, functions, RLS and the realtime publication entry.

-- @up
create extension if not exists pgcrypto;

create schema if not exists notify;
grant usage on schema notify to anon, authenticated, service_role;

create or replace function notify.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Tables ---------------------------------------------------------------------

create table if not exists notify.notifications (
  id uuid primary key default gen_random_uuid(),
  -- Source product ("dash", "events", "notes"...) and its own type key.
  app text not null,
  -- Cross-suite bucket used by bell tabs and mute rules (general, mention...).
  category text not null default 'general',
  type text not null default 'general',
  title text not null,
  body text,
  -- Root-relative ("/events/...") or absolute link opened on click.
  url text,
  -- PascalCase lucide icon name and an optional thumbnail/avatar image.
  icon text,
  image_url text,
  tone text not null default 'neutral'
    check (tone in ('neutral', 'info', 'success', 'warning', 'danger')),
  priority text not null default 'normal'
    check (priority in ('low', 'normal', 'high', 'urgent')),
  audience text not null default 'user'
    check (audience in ('user', 'users', 'organization')),
  organization_id uuid references public.organizations(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  -- Who caused it, plus a display snapshot ({ name, avatarUrl }).
  actor_id uuid,
  actor jsonb not null default '{}'::jsonb,
  -- Call-to-action buttons: [{ label, url, variant }].
  actions jsonb not null default '[]'::jsonb,
  -- Threading key for grouping related notifications in the UI.
  group_key text,
  -- Idempotency key, unique per app among live notifications.
  dedupe_key text,
  expires_at timestamptz,
  -- Expansion bag / app payload handed to custom renderers.
  metadata jsonb not null default '{}'::jsonb,
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create unique index if not exists notifications_app_dedupe_key
  on notify.notifications (app, dedupe_key)
  where dedupe_key is not null and deleted_at is null;
create index if not exists notifications_organization_idx
  on notify.notifications (organization_id);
create index if not exists notifications_created_by_idx
  on notify.notifications (created_by);

drop trigger if exists notifications_touch_updated_at on notify.notifications;
create trigger notifications_touch_updated_at
before update on notify.notifications
for each row execute function notify.touch_updated_at();

create table if not exists notify.deliveries (
  id uuid primary key default gen_random_uuid(),
  notification_id uuid not null references notify.notifications(id) on delete cascade,
  user_id uuid not null,
  -- Sort key; bumped when a deduped notification is replaced and resurfaced.
  notified_at timestamptz not null default now(),
  seen_at timestamptz,
  read_at timestamptz,
  archived_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- Set when the recipient dismisses it or the sender retracts it.
  deleted_at timestamptz,
  constraint deliveries_notification_user_key unique (notification_id, user_id)
);

create index if not exists deliveries_user_feed_idx
  on notify.deliveries (user_id, notified_at desc)
  where deleted_at is null;
create index if not exists deliveries_user_unread_idx
  on notify.deliveries (user_id)
  where read_at is null and deleted_at is null;

drop trigger if exists deliveries_touch_updated_at on notify.deliveries;
create trigger deliveries_touch_updated_at
before update on notify.deliveries
for each row execute function notify.touch_updated_at();

create table if not exists notify.preferences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid(),
  -- '*' is a wildcard; the most specific matching rule decides.
  app text not null default '*',
  category text not null default '*',
  type text not null default '*',
  muted boolean not null default true,
  -- A mute with muted_until stops applying once that time passes (snooze).
  muted_until timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint preferences_rule_key unique (user_id, app, category, type)
);

drop trigger if exists preferences_touch_updated_at on notify.preferences;
create trigger preferences_touch_updated_at
before update on notify.preferences
for each row execute function notify.touch_updated_at();

-- Inbox view -----------------------------------------------------------------
-- security_invoker so RLS on deliveries scopes it to the caller's own rows.

create or replace view notify.inbox
with (security_invoker = true) as
select
  d.id,
  d.notification_id,
  d.user_id,
  d.notified_at,
  d.seen_at,
  d.read_at,
  d.archived_at,
  n.app,
  n.category,
  n.type,
  n.title,
  n.body,
  n.url,
  n.icon,
  n.image_url,
  n.tone,
  n.priority,
  n.audience,
  n.organization_id,
  n.project_id,
  n.actor_id,
  n.actor,
  n.actions,
  n.group_key,
  n.dedupe_key,
  n.expires_at,
  n.metadata,
  n.created_at
from notify.deliveries d
join notify.notifications n on n.id = d.notification_id
where d.deleted_at is null
  and n.deleted_at is null
  and (n.expires_at is null or n.expires_at > now());

-- Internal helpers (not executable by API roles) -----------------------------

-- Service role, or a direct DB session with no JWT context at all.
create or replace function notify.is_trusted()
returns boolean
language sql
stable
set search_path = ''
as $$
  select coalesce(auth.role(), 'service_role') = 'service_role';
$$;

-- Members of an org, optionally filtered by role (case-insensitive). Mirrors
-- public.is_org_member: owner/creator, organization_users, legacy members[].
create or replace function notify.org_member_ids(p_org uuid, p_roles text[] default null)
returns table (user_id uuid)
language sql
stable
security definer
set search_path = ''
as $$
  select distinct m.user_id
  from (
    select o.owner as user_id, 'owner'::text as role
    from public.organizations o
    where o.id = p_org and o.deleted_at is null
    union all
    select o.created_by, 'owner'
    from public.organizations o
    where o.id = p_org and o.deleted_at is null
    union all
    select ou."user", lower(ou.role::text)
    from public.organization_users ou
    join public.organizations o on o.id = ou.organization and o.deleted_at is null
    where ou.organization = p_org
    union all
    select x.value::uuid, 'user'
    from public.organizations o
    cross join lateral jsonb_array_elements_text(
      case when jsonb_typeof(o.metadata->'members') = 'array'
        then o.metadata->'members' else '[]'::jsonb end
    ) as x(value)
    where o.id = p_org and o.deleted_at is null
      and x.value ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
  ) m
  where m.user_id is not null
    and (
      p_roles is null
      or cardinality(p_roles) = 0
      or m.role = any (select lower(r) from unnest(p_roles) as r)
    );
$$;

-- Organizations a user belongs to (same three membership sources).
create or replace function notify.user_org_ids(p_user uuid)
returns table (organization_id uuid)
language sql
stable
security definer
set search_path = ''
as $$
  select o.id
  from public.organizations o
  where o.deleted_at is null and (o.owner = p_user or o.created_by = p_user)
  union
  select ou.organization
  from public.organization_users ou
  join public.organizations o on o.id = ou.organization and o.deleted_at is null
  where ou."user" = p_user
  union
  select o.id
  from public.organizations o
  where o.deleted_at is null
    and jsonb_typeof(o.metadata->'members') = 'array'
    and (o.metadata->'members') ? p_user::text;
$$;

-- Most specific live rule wins; an explicit muted=false rule unmutes.
create or replace function notify.is_muted(p_user uuid, p_app text, p_category text, p_type text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce((
    select p.muted
    from notify.preferences p
    where p.user_id = p_user
      and p.deleted_at is null
      and p.app in ('*', p_app)
      and p.category in ('*', p_category)
      and p.type in ('*', p_type)
      and not (p.muted and p.muted_until is not null and p.muted_until <= now())
    order by
      (p.app <> '*')::int * 4 + (p.category <> '*')::int * 2 + (p.type <> '*')::int desc,
      p.updated_at desc
    limit 1
  ), false);
$$;

-- Public RPCs ----------------------------------------------------------------

-- Creates (or dedupes/replaces) a notification and fans out deliveries.
-- p: { app, title, body, category, type, url, icon, image_url, tone, priority,
--      organization_id, project_id, actor_id, actor, actions, group_key,
--      dedupe_key, on_conflict: skip|replace, resurface, expires_at, metadata,
--      include_actor, to: { user, users[], organization, roles[], exclude[] } }
-- Returns { id, delivered, recipients, deduped, replaced }.
create or replace function notify.send(p jsonb)
returns jsonb
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_trusted boolean := notify.is_trusted();
  v_to jsonb := coalesce(p->'to', '{}'::jsonb);
  v_app text := nullif(btrim(coalesce(p->>'app', '')), '');
  v_title text := nullif(btrim(coalesce(p->>'title', '')), '');
  v_category text := coalesce(nullif(btrim(coalesce(p->>'category', '')), ''), 'general');
  v_type text;
  v_tone text := coalesce(nullif(p->>'tone', ''), 'neutral');
  v_priority text := coalesce(nullif(p->>'priority', ''), 'normal');
  v_target_org uuid := nullif(v_to->>'organization', '')::uuid;
  v_org uuid := nullif(p->>'organization_id', '')::uuid;
  v_roles text[];
  v_explicit uuid[] := '{}';
  v_exclude uuid[] := '{}';
  v_recipients uuid[];
  v_rejected uuid[];
  v_actor_id uuid;
  v_actor jsonb := case when jsonb_typeof(p->'actor') = 'object' then p->'actor' else '{}'::jsonb end;
  v_snapshot jsonb;
  v_dedupe text := nullif(btrim(coalesce(p->>'dedupe_key', '')), '');
  v_on_conflict text := coalesce(nullif(p->>'on_conflict', ''), 'skip');
  v_resurface boolean := coalesce((p->>'resurface')::boolean, true);
  v_include_actor boolean := coalesce((p->>'include_actor')::boolean, false);
  v_audience text;
  v_existing notify.notifications%rowtype;
  v_id uuid;
  v_delivered integer := 0;
  v_replaced boolean := false;
begin
  if not v_trusted and v_uid is null then
    raise exception 'notify.send: not authenticated' using errcode = '42501';
  end if;
  if v_app is null then
    raise exception 'notify.send: app is required' using errcode = '22023';
  end if;
  if v_title is null then
    raise exception 'notify.send: title is required' using errcode = '22023';
  end if;
  if v_tone not in ('neutral', 'info', 'success', 'warning', 'danger') then
    raise exception 'notify.send: invalid tone %', v_tone using errcode = '22023';
  end if;
  if v_priority not in ('low', 'normal', 'high', 'urgent') then
    raise exception 'notify.send: invalid priority %', v_priority using errcode = '22023';
  end if;
  if v_on_conflict not in ('skip', 'replace') then
    raise exception 'notify.send: invalid on_conflict %', v_on_conflict using errcode = '22023';
  end if;
  v_type := coalesce(nullif(btrim(coalesce(p->>'type', '')), ''), v_category);

  -- Audience.
  if nullif(v_to->>'user', '') is not null then
    v_explicit := v_explicit || (v_to->>'user')::uuid;
  end if;
  if jsonb_typeof(v_to->'users') = 'array' then
    v_explicit := v_explicit || array(
      select x::uuid from jsonb_array_elements_text(v_to->'users') as x where x <> ''
    );
  end if;
  if jsonb_typeof(v_to->'exclude') = 'array' then
    v_exclude := array(
      select x::uuid from jsonb_array_elements_text(v_to->'exclude') as x where x <> ''
    );
  end if;
  if jsonb_typeof(v_to->'roles') = 'array' then
    v_roles := array(select x from jsonb_array_elements_text(v_to->'roles') as x);
  end if;
  if cardinality(v_explicit) = 0 and v_target_org is null then
    raise exception 'notify.send: no recipients (pass to.user, to.users or to.organization)'
      using errcode = '22023';
  end if;
  v_org := coalesce(v_org, v_target_org);

  -- Authorisation for signed-in senders.
  if v_trusted then
    v_actor_id := nullif(p->>'actor_id', '')::uuid;
  else
    v_actor_id := v_uid;
    if v_target_org is not null and not exists (
      select 1 from notify.org_member_ids(v_target_org) m where m.user_id = v_uid
    ) then
      raise exception 'notify.send: not a member of organization %', v_target_org
        using errcode = '42501';
    end if;
    if v_org is not null and v_org is distinct from v_target_org and not exists (
      select 1 from notify.org_member_ids(v_org) m where m.user_id = v_uid
    ) then
      raise exception 'notify.send: not a member of organization %', v_org
        using errcode = '42501';
    end if;
    select array_agg(r) into v_rejected
    from unnest(v_explicit) as r
    where r <> v_uid
      and not exists (
        select 1
        from notify.user_org_ids(v_uid) a
        join notify.user_org_ids(r) b on b.organization_id = a.organization_id
      );
    if v_rejected is not null then
      raise exception 'notify.send: cannot notify users outside your organizations: %', v_rejected
        using errcode = '42501';
    end if;
  end if;

  -- Actor snapshot; only trusted senders may override the display fields.
  if v_actor_id is not null then
    select jsonb_strip_nulls(jsonb_build_object(
      'name', coalesce(
        u.raw_user_meta_data->>'full_name',
        u.raw_user_meta_data->>'name',
        split_part(u.email, '@', 1)
      ),
      'avatarUrl', coalesce(u.raw_user_meta_data->>'avatar_url', u.raw_user_meta_data->>'picture')
    ))
    into v_snapshot
    from auth.users u
    where u.id = v_actor_id;
  end if;
  v_actor := case
    when v_trusted then coalesce(v_snapshot, '{}'::jsonb) || v_actor
    else coalesce(v_snapshot, '{}'::jsonb)
  end;

  select coalesce(array_agg(distinct s.r), '{}') into v_recipients
  from (
    select unnest(v_explicit) as r
    union
    select m.user_id
    from notify.org_member_ids(v_target_org, v_roles) m
    where v_target_org is not null
      and (v_include_actor or v_actor_id is null or m.user_id <> v_actor_id)
  ) s
  where s.r is not null
    and not (s.r = any (v_exclude))
    and exists (select 1 from auth.users u where u.id = s.r);

  v_audience := case
    when v_target_org is not null then 'organization'
    when cardinality(v_explicit) > 1 then 'users'
    else 'user'
  end;

  -- Dedupe: skip returns the live notification, replace rewrites it.
  if v_dedupe is not null then
    select * into v_existing
    from notify.notifications n
    where n.app = v_app and n.dedupe_key = v_dedupe and n.deleted_at is null
    for update;
    if found then
      if v_on_conflict = 'skip' then
        return jsonb_build_object(
          'id', v_existing.id, 'delivered', 0, 'recipients', 0,
          'deduped', true, 'replaced', false
        );
      end if;
      if not v_trusted and v_existing.created_by is distinct from v_uid then
        raise exception 'notify.send: cannot replace a notification you did not send'
          using errcode = '42501';
      end if;
      update notify.notifications set
        category = v_category,
        type = v_type,
        title = v_title,
        body = p->>'body',
        url = p->>'url',
        icon = p->>'icon',
        image_url = p->>'image_url',
        tone = v_tone,
        priority = v_priority,
        audience = v_audience,
        organization_id = v_org,
        project_id = nullif(p->>'project_id', '')::uuid,
        actor_id = v_actor_id,
        actor = v_actor,
        actions = case when jsonb_typeof(p->'actions') = 'array' then p->'actions' else '[]'::jsonb end,
        group_key = p->>'group_key',
        expires_at = nullif(p->>'expires_at', '')::timestamptz,
        metadata = case when jsonb_typeof(p->'metadata') = 'object' then p->'metadata' else '{}'::jsonb end
      where id = v_existing.id;
      v_id := v_existing.id;
      v_replaced := true;
    end if;
  end if;

  if v_id is null then
    insert into notify.notifications (
      app, category, type, title, body, url, icon, image_url, tone, priority,
      audience, organization_id, project_id, actor_id, actor, actions,
      group_key, dedupe_key, expires_at, metadata, created_by
    ) values (
      v_app, v_category, v_type, v_title, p->>'body', p->>'url', p->>'icon',
      p->>'image_url', v_tone, v_priority, v_audience, v_org,
      nullif(p->>'project_id', '')::uuid, v_actor_id, v_actor,
      case when jsonb_typeof(p->'actions') = 'array' then p->'actions' else '[]'::jsonb end,
      p->>'group_key', v_dedupe, nullif(p->>'expires_at', '')::timestamptz,
      case when jsonb_typeof(p->'metadata') = 'object' then p->'metadata' else '{}'::jsonb end,
      v_uid
    )
    returning id into v_id;
  end if;

  -- Fan out. Urgent notifications bypass mute rules.
  with fanned as (
    insert into notify.deliveries (notification_id, user_id, notified_at, created_by)
    select v_id, r, now(), v_uid
    from unnest(v_recipients) as r
    where v_priority = 'urgent' or not notify.is_muted(r, v_app, v_category, v_type)
    on conflict (notification_id, user_id) do update set
      notified_at = case when v_resurface then excluded.notified_at else notify.deliveries.notified_at end,
      seen_at = case when v_resurface then null else notify.deliveries.seen_at end,
      read_at = case when v_resurface then null else notify.deliveries.read_at end,
      archived_at = case when v_resurface then null else notify.deliveries.archived_at end,
      deleted_at = case when v_resurface then null else notify.deliveries.deleted_at end
    returning 1
  )
  select count(*) into v_delivered from fanned;

  return jsonb_build_object(
    'id', v_id,
    'delivered', v_delivered,
    'recipients', cardinality(v_recipients),
    'deduped', false,
    'replaced', v_replaced
  );
end;
$$;

-- Marks the caller's deliveries read, optionally scoped. Returns rows changed.
create or replace function notify.mark_all_read(
  p_app text default null,
  p_category text default null,
  p_organization_id uuid default null
)
returns integer
language sql
volatile
security definer
set search_path = ''
as $$
  with changed as (
    update notify.deliveries d
    set read_at = now(), seen_at = coalesce(d.seen_at, now())
    from notify.notifications n
    where n.id = d.notification_id
      and d.user_id = auth.uid()
      and d.read_at is null
      and d.deleted_at is null
      and n.deleted_at is null
      and (p_app is null or n.app = p_app)
      and (p_category is null or n.category = p_category)
      and (p_organization_id is null or n.organization_id = p_organization_id)
    returning 1
  )
  select count(*)::int from changed;
$$;

-- Unread badge counts for the caller: { total, unseen, apps, categories }.
create or replace function notify.unread_counts(p_organization_id uuid default null)
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  with u as (
    select n.app, n.category, d.seen_at
    from notify.deliveries d
    join notify.notifications n on n.id = d.notification_id
    where d.user_id = auth.uid()
      and d.read_at is null
      and d.archived_at is null
      and d.deleted_at is null
      and n.deleted_at is null
      and (n.expires_at is null or n.expires_at > now())
      and (p_organization_id is null or n.organization_id = p_organization_id)
  )
  select jsonb_build_object(
    'total', (select count(*) from u),
    'unseen', (select count(*) from u where u.seen_at is null),
    'apps', coalesce((select jsonb_object_agg(a.app, a.c) from (select app, count(*) as c from u group by app) a), '{}'::jsonb),
    'categories', coalesce((select jsonb_object_agg(a.category, a.c) from (select category, count(*) as c from u group by category) a), '{}'::jsonb)
  );
$$;

-- Withdraws a notification for every recipient (by id, or app + dedupe_key).
create or replace function notify.retract(
  p_id uuid default null,
  p_app text default null,
  p_dedupe_key text default null
)
returns boolean
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  v_row notify.notifications%rowtype;
begin
  select * into v_row
  from notify.notifications n
  where n.deleted_at is null
    and (
      (p_id is not null and n.id = p_id)
      or (p_id is null and n.app = p_app and n.dedupe_key = p_dedupe_key)
    )
  for update;
  if not found then
    return false;
  end if;
  if not notify.is_trusted() and v_row.created_by is distinct from auth.uid() then
    raise exception 'notify.retract: only the sender can retract this notification'
      using errcode = '42501';
  end if;
  update notify.notifications set deleted_at = now() where id = v_row.id;
  update notify.deliveries set deleted_at = now()
  where notification_id = v_row.id and deleted_at is null;
  return true;
end;
$$;

-- RLS ------------------------------------------------------------------------

alter table notify.notifications enable row level security;
drop policy if exists notifications_select_own on notify.notifications;
create policy notifications_select_own on notify.notifications
  for select to authenticated
  using (
    created_by = (select auth.uid())
    or exists (
      select 1 from notify.deliveries d
      where d.notification_id = notifications.id and d.user_id = (select auth.uid())
    )
  );

alter table notify.deliveries enable row level security;
drop policy if exists deliveries_select_own on notify.deliveries;
create policy deliveries_select_own on notify.deliveries
  for select to authenticated
  using (user_id = (select auth.uid()));
drop policy if exists deliveries_update_own on notify.deliveries;
create policy deliveries_update_own on notify.deliveries
  for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

alter table notify.preferences enable row level security;
drop policy if exists preferences_own on notify.preferences;
create policy preferences_own on notify.preferences
  for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

-- Grants ---------------------------------------------------------------------
-- Writes to notifications/deliveries go through notify.send(); recipients may
-- only flip their own state columns.

grant select on notify.notifications to authenticated;
grant select on notify.deliveries to authenticated;
grant update (seen_at, read_at, archived_at, deleted_at) on notify.deliveries to authenticated;
grant select, insert, update, delete on notify.preferences to authenticated;
grant select on notify.inbox to authenticated;
grant all on all tables in schema notify to service_role;

revoke all on all functions in schema notify from public, anon, authenticated;
grant execute on function notify.send(jsonb) to authenticated, service_role;
grant execute on function notify.mark_all_read(text, text, uuid) to authenticated, service_role;
grant execute on function notify.unread_counts(uuid) to authenticated, service_role;
grant execute on function notify.retract(uuid, text, text) to authenticated, service_role;
grant execute on all functions in schema notify to service_role;

-- Realtime -------------------------------------------------------------------

do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime')
    and not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime' and schemaname = 'notify' and tablename = 'deliveries'
    )
  then
    alter publication supabase_realtime add table notify.deliveries;
  end if;
end;
$$;

-- @down
do $$
begin
  if exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'notify' and tablename = 'deliveries'
  ) then
    alter publication supabase_realtime drop table notify.deliveries;
  end if;
end;
$$;

drop function if exists notify.retract(uuid, text, text);
drop function if exists notify.unread_counts(uuid);
drop function if exists notify.mark_all_read(text, text, uuid);
drop function if exists notify.send(jsonb);
drop function if exists notify.is_muted(uuid, text, text, text);
drop function if exists notify.user_org_ids(uuid);
drop function if exists notify.org_member_ids(uuid, text[]);
drop function if exists notify.is_trusted();
drop view if exists notify.inbox;
drop table if exists notify.preferences cascade;
drop table if exists notify.deliveries cascade;
drop table if exists notify.notifications cascade;
drop function if exists notify.touch_updated_at();
drop schema if exists notify;
