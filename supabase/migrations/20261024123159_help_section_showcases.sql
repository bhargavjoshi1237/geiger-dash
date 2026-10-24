-- Help section showcases
--
-- A help section can embed one live component streamed from an app's /<app>/playground/<component> route
-- (registry: lib/docs/showcases.js). Adds public.docs_content_blocks.showcase and teaches
-- public.docs_save_page to keep it, since Studio saves replace a page's sections wholesale.
-- Now owns the body of public.docs_save_page(jsonb, jsonb) (first defined in 20261023112956_docs_editing).

-- @up
alter table public.docs_content_blocks add column if not exists showcase text;

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
    id, page_id, anchor_id, eyebrow, title, content, cards, features, links, showcase, sort_order
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
    nullif(s->>'showcase', ''),
    (t.ord * 10)::integer
  from jsonb_array_elements(coalesce(p_sections, '[]'::jsonb)) with ordinality as t(s, ord);

  return v_id;
end;
$$;

revoke all on function public.docs_save_page(jsonb, jsonb) from public, anon;
grant execute on function public.docs_save_page(jsonb, jsonb) to authenticated;

-- @down
-- The previous body, from 20261023112956_docs_editing, without the showcase column.
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

alter table public.docs_content_blocks drop column if exists showcase;
