-- Blog authors
--
-- Owns public.dash_blog_authors: public author profiles shown on posts and at /blog/authors/[slug].
-- Adds dash_blog_posts.author_profile_id; author_name and author_avatar stay as the byline for posts without a profile.

-- @up
create extension if not exists pgcrypto;

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create table if not exists public.dash_blog_authors (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  role text,
  bio text not null,
  avatar_url text,
  links jsonb not null default '[]'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

drop trigger if exists dash_blog_authors_touch_updated_at on public.dash_blog_authors;
create trigger dash_blog_authors_touch_updated_at
before update on public.dash_blog_authors
for each row execute function public.touch_updated_at();

alter table public.dash_blog_posts
  add column if not exists author_profile_id uuid references public.dash_blog_authors(id) on delete set null;
create index if not exists idx_blog_posts_author_profile on public.dash_blog_posts (author_profile_id) where author_profile_id is not null;

alter table public.dash_blog_authors enable row level security;

drop policy if exists dash_blog_authors_public_read on public.dash_blog_authors;
create policy dash_blog_authors_public_read on public.dash_blog_authors
  for select to anon, authenticated
  using (deleted_at is null);

drop policy if exists dash_blog_authors_editors_manage on public.dash_blog_authors;
create policy dash_blog_authors_editors_manage on public.dash_blog_authors
  for all to authenticated
  using ((select public.is_content_editor()))
  with check ((select public.is_content_editor()));

grant select on public.dash_blog_authors to anon, authenticated;
grant insert, update, delete on public.dash_blog_authors to authenticated;

notify pgrst, 'reload schema';

-- @down
drop index if exists public.idx_blog_posts_author_profile;
alter table public.dash_blog_posts drop column if exists author_profile_id;
drop table if exists public.dash_blog_authors cascade;
notify pgrst, 'reload schema';
