-- Suite product badges
--
-- Owns public.suite_product_badges, the stage badge beside each product in the suite's Products menu.
-- Edited at /admin/version-control; every app reads it and passes the result to @geiger/ui's SuiteHeader.
-- Seeded with the badges previously hardcoded in geiger-ui, so nothing changes visually when this lands.
-- Relies on public.is_content_editor() from 20261023112956_docs_editing.

-- @up
grant usage on schema public to anon, authenticated, service_role;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.suite_product_badges (
  id uuid primary key default gen_random_uuid(),
  href text not null unique,
  name text not null,
  badge text check (badge in ('Pre-alpha', 'Alpha', 'Beta')),
  metadata jsonb not null default '{}'::jsonb,
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

drop trigger if exists suite_product_badges_touch_updated_at on public.suite_product_badges;
create trigger suite_product_badges_touch_updated_at
before update on public.suite_product_badges
for each row execute function public.touch_updated_at();

-- The menu renders for signed-out visitors in every app, so reads are public; only content editors can change a badge.
alter table public.suite_product_badges enable row level security;

drop policy if exists suite_product_badges_public_read on public.suite_product_badges;
create policy suite_product_badges_public_read on public.suite_product_badges
  for select to anon, authenticated
  using (true);

drop policy if exists suite_product_badges_editors_update on public.suite_product_badges;
create policy suite_product_badges_editors_update on public.suite_product_badges
  for update to authenticated
  using ((select public.is_content_editor()))
  with check ((select public.is_content_editor()));

revoke all on public.suite_product_badges from anon, authenticated;
grant select on public.suite_product_badges to anon, authenticated;
grant update on public.suite_product_badges to authenticated;
grant all on public.suite_product_badges to service_role;

insert into public.suite_product_badges (href, name, badge) values
  ('/notes', 'Notes', 'Pre-alpha'),
  ('/flow', 'Flow', 'Pre-alpha'),
  ('/events', 'Events', 'Pre-alpha'),
  ('/assets', 'Assets', null),
  ('/grey', 'Grey', null),
  ('/forms', 'Forms', null),
  ('/content', 'Content', null),
  ('/campaign', 'Campaign', null),
  ('/pods', 'Pods', null),
  ('/comms', 'Comms', null),
  ('/docs', 'Docs', null),
  ('/property', 'Property', null)
on conflict (href) do nothing;

-- @down
drop table if exists public.suite_product_badges;
