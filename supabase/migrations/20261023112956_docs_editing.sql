-- Docs editing
--
-- Readies the docs tables behind the /help center for editing in Studio: HTML section content,
-- one level of page nesting, soft delete, and an editor allowlist that replaces the old
-- "any signed-in user can write" policies.
-- Owns public.content_editors, public.is_content_editor() and public.docs_save_page(jsonb, jsonb).

-- @up
create table if not exists public.content_editors (
  user_id uuid primary key,
  note text,
  created_by uuid,
  created_at timestamptz not null default now()
);

alter table public.content_editors enable row level security;

-- Editors can see their own row (Studio checks membership); the list itself stays private.
drop policy if exists content_editors_read_own on public.content_editors;
create policy content_editors_read_own on public.content_editors
  for select to authenticated
  using (user_id = (select auth.uid()));

revoke all on public.content_editors from anon, authenticated;
grant select on public.content_editors to authenticated;

-- Security definer so policies can consult the allowlist without exposing it.
create or replace function public.is_content_editor()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.content_editors where user_id = auth.uid());
$$;

revoke all on function public.is_content_editor() from public;
grant execute on function public.is_content_editor() to anon, authenticated;

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

alter table public.docs_pages add column if not exists parent_id uuid references public.docs_pages(id) on delete set null;
alter table public.docs_pages add column if not exists metadata jsonb not null default '{}'::jsonb;
alter table public.docs_pages add column if not exists created_by uuid;
alter table public.docs_pages add column if not exists deleted_at timestamptz;
create index if not exists docs_pages_parent_idx on public.docs_pages (parent_id, sort_order);

-- Slugs only need to be unique among live pages, so a soft-deleted page frees its slug.
alter table public.docs_pages drop constraint if exists docs_pages_slug_key;
create unique index if not exists docs_pages_live_slug_key on public.docs_pages (slug) where deleted_at is null;

alter table public.docs_content_blocks add column if not exists content text not null default '';

-- Carry the legacy plain-text paragraphs (body jsonb) into the HTML content column.
update public.docs_content_blocks b
set content = (
  select string_agg('<p>' || replace(replace(replace(t.paragraph, '&', '&amp;'), '<', '&lt;'), '>', '&gt;') || '</p>', '' order by t.ord)
  from jsonb_array_elements_text(b.body) with ordinality as t(paragraph, ord)
)
where b.content = ''
  and jsonb_typeof(b.body) = 'array'
  and jsonb_array_length(b.body) > 0;

drop trigger if exists docs_nav_groups_touch_updated_at on public.docs_nav_groups;
create trigger docs_nav_groups_touch_updated_at
before update on public.docs_nav_groups
for each row execute function public.touch_updated_at();

drop trigger if exists docs_pages_touch_updated_at on public.docs_pages;
create trigger docs_pages_touch_updated_at
before update on public.docs_pages
for each row execute function public.touch_updated_at();

drop trigger if exists docs_content_blocks_touch_updated_at on public.docs_content_blocks;
create trigger docs_content_blocks_touch_updated_at
before update on public.docs_content_blocks
for each row execute function public.touch_updated_at();

-- Public reads: published, not soft-deleted.
drop policy if exists "Published docs pages are public" on public.docs_pages;
create policy "Published docs pages are public"
  on public.docs_pages for select
  using (status = 'published' and deleted_at is null);

drop policy if exists "Published docs blocks are public" on public.docs_content_blocks;
create policy "Published docs blocks are public"
  on public.docs_content_blocks for select
  using (
    exists (
      select 1
      from public.docs_pages p
      where p.id = docs_content_blocks.page_id
        and p.status = 'published'
        and p.deleted_at is null
    )
  );

-- Writes (and draft reads): content editors only.
drop policy if exists "Authenticated users manage docs nav groups" on public.docs_nav_groups;
drop policy if exists "Authenticated users manage docs pages" on public.docs_pages;
drop policy if exists "Authenticated users manage docs blocks" on public.docs_content_blocks;

drop policy if exists docs_nav_groups_editors_manage on public.docs_nav_groups;
create policy docs_nav_groups_editors_manage on public.docs_nav_groups
  for all to authenticated
  using ((select public.is_content_editor()))
  with check ((select public.is_content_editor()));

drop policy if exists docs_pages_editors_manage on public.docs_pages;
create policy docs_pages_editors_manage on public.docs_pages
  for all to authenticated
  using ((select public.is_content_editor()))
  with check ((select public.is_content_editor()));

drop policy if exists docs_content_blocks_editors_manage on public.docs_content_blocks;
create policy docs_content_blocks_editors_manage on public.docs_content_blocks
  for all to authenticated
  using ((select public.is_content_editor()))
  with check ((select public.is_content_editor()));

-- TRUNCATE bypasses RLS entirely, so signed-in users must not hold it.
revoke truncate, references, trigger on public.docs_nav_groups, public.docs_pages, public.docs_content_blocks from authenticated;
grant select, insert, update, delete on public.docs_nav_groups, public.docs_pages, public.docs_content_blocks to authenticated;

-- Saves a page and replaces its sections in one transaction. Runs as the caller, so RLS still applies.
create or replace function public.docs_save_page(p_page jsonb, p_sections jsonb)
returns uuid
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_id uuid := coalesce(nullif(p_page->>'id', '')::uuid, gen_random_uuid());
  v_status text := coalesce(nullif(p_page->>'status', ''), 'draft');
begin
  if not public.is_content_editor() then
    raise exception 'Only content editors can save docs pages' using errcode = '42501';
  end if;

  insert into public.docs_pages as p (
    id, nav_group_id, parent_id, slug, title, nav_label, description, status, sort_order, published_at, created_by
  )
  values (
    v_id,
    (p_page->>'nav_group_id')::uuid,
    nullif(p_page->>'parent_id', '')::uuid,
    p_page->>'slug',
    p_page->>'title',
    nullif(p_page->>'nav_label', ''),
    coalesce(p_page->>'description', ''),
    v_status,
    coalesce((p_page->>'sort_order')::integer, 0),
    case when v_status = 'published' then now() end,
    auth.uid()
  )
  on conflict (id) do update set
    nav_group_id = excluded.nav_group_id,
    parent_id = excluded.parent_id,
    slug = excluded.slug,
    title = excluded.title,
    nav_label = excluded.nav_label,
    description = excluded.description,
    status = excluded.status,
    sort_order = excluded.sort_order,
    published_at = coalesce(p.published_at, excluded.published_at);

  delete from public.docs_content_blocks where page_id = v_id;

  insert into public.docs_content_blocks (
    id, page_id, anchor_id, eyebrow, title, content, cards, features, links, sort_order
  )
  select
    coalesce(nullif(s->>'id', '')::uuid, gen_random_uuid()),
    v_id,
    s->>'anchor_id',
    nullif(s->>'eyebrow', ''),
    s->>'title',
    coalesce(s->>'content', ''),
    coalesce(s->'cards', '[]'::jsonb),
    coalesce(s->'features', '[]'::jsonb),
    coalesce(s->'links', '[]'::jsonb),
    (t.ord * 10)::integer
  from jsonb_array_elements(coalesce(p_sections, '[]'::jsonb)) with ordinality as t(s, ord);

  return v_id;
end;
$$;

revoke all on function public.docs_save_page(jsonb, jsonb) from public, anon;
grant execute on function public.docs_save_page(jsonb, jsonb) to authenticated;

-- @down
drop function if exists public.docs_save_page(jsonb, jsonb);

drop policy if exists docs_nav_groups_editors_manage on public.docs_nav_groups;
drop policy if exists docs_pages_editors_manage on public.docs_pages;
drop policy if exists docs_content_blocks_editors_manage on public.docs_content_blocks;

drop policy if exists "Authenticated users manage docs nav groups" on public.docs_nav_groups;
create policy "Authenticated users manage docs nav groups"
  on public.docs_nav_groups for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists "Authenticated users manage docs pages" on public.docs_pages;
create policy "Authenticated users manage docs pages"
  on public.docs_pages for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists "Authenticated users manage docs blocks" on public.docs_content_blocks;
create policy "Authenticated users manage docs blocks"
  on public.docs_content_blocks for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists "Published docs pages are public" on public.docs_pages;
create policy "Published docs pages are public"
  on public.docs_pages for select
  using (status = 'published');

drop policy if exists "Published docs blocks are public" on public.docs_content_blocks;
create policy "Published docs blocks are public"
  on public.docs_content_blocks for select
  using (
    exists (
      select 1
      from public.docs_pages
      where docs_pages.id = docs_content_blocks.page_id
        and docs_pages.status = 'published'
    )
  );

grant truncate, references, trigger on public.docs_nav_groups, public.docs_pages, public.docs_content_blocks to authenticated;

drop trigger if exists docs_nav_groups_touch_updated_at on public.docs_nav_groups;
drop trigger if exists docs_pages_touch_updated_at on public.docs_pages;
drop trigger if exists docs_content_blocks_touch_updated_at on public.docs_content_blocks;

alter table public.docs_content_blocks drop column if exists content;

drop index if exists public.docs_pages_live_slug_key;
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'docs_pages_slug_key' and conrelid = 'public.docs_pages'::regclass) then
    alter table public.docs_pages add constraint docs_pages_slug_key unique (slug);
  end if;
end;
$$;

drop index if exists public.docs_pages_parent_idx;
alter table public.docs_pages drop column if exists deleted_at;
alter table public.docs_pages drop column if exists created_by;
alter table public.docs_pages drop column if exists metadata;
alter table public.docs_pages drop column if exists parent_id;

drop function if exists public.is_content_editor();
drop table if exists public.content_editors;
