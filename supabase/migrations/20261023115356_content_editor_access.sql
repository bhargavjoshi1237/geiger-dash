-- Content editor access
--
-- Puts the blog, changelog and SEO page tables (and the blog automation tables Studio reads) behind the
-- public.content_editors allowlist, replacing "any signed-in user" write access. Turns RLS on for
-- dash_changelog / dash_changelog_items, which had it off, so any signed-in user could edit or delete them.
-- Public reads are unchanged; the changelog webhook and blog automation write with the service role and
-- are unaffected. Relies on public.is_content_editor() from 20261023112956_docs_editing.

-- @up
alter table public.dash_changelog enable row level security;
alter table public.dash_changelog_items enable row level security;

drop policy if exists "Authenticated users can manage blog posts" on public.dash_blog_posts;
drop policy if exists dash_blog_posts_editors_manage on public.dash_blog_posts;
create policy dash_blog_posts_editors_manage on public.dash_blog_posts
  for all to authenticated
  using ((select public.is_content_editor()))
  with check ((select public.is_content_editor()));

drop policy if exists "Authenticated users can manage blog categories" on public.dash_blog_categories;
drop policy if exists dash_blog_categories_editors_manage on public.dash_blog_categories;
create policy dash_blog_categories_editors_manage on public.dash_blog_categories
  for all to authenticated
  using ((select public.is_content_editor()))
  with check ((select public.is_content_editor()));

drop policy if exists "Authenticated users can insert changelogs" on public.dash_changelog;
drop policy if exists "Authenticated users can update changelogs" on public.dash_changelog;
drop policy if exists dash_changelog_editors_manage on public.dash_changelog;
create policy dash_changelog_editors_manage on public.dash_changelog
  for all to authenticated
  using ((select public.is_content_editor()))
  with check ((select public.is_content_editor()));

drop policy if exists "Authenticated users can insert changelog items" on public.dash_changelog_items;
drop policy if exists "Authenticated users can update changelog items" on public.dash_changelog_items;
drop policy if exists "Authenticated users can delete changelog items" on public.dash_changelog_items;
drop policy if exists dash_changelog_items_editors_manage on public.dash_changelog_items;
create policy dash_changelog_items_editors_manage on public.dash_changelog_items
  for all to authenticated
  using ((select public.is_content_editor()))
  with check ((select public.is_content_editor()));

drop policy if exists "Authenticated users can manage SEO pages" on public.dash_seo_pages;
drop policy if exists dash_seo_pages_editors_manage on public.dash_seo_pages;
create policy dash_seo_pages_editors_manage on public.dash_seo_pages
  for all to authenticated
  using ((select public.is_content_editor()))
  with check ((select public.is_content_editor()));

-- Blog automation history and LLM spend: Studio-only reads; writes come from the service role.
drop policy if exists "Authenticated users can view automation runs" on public.dash_blog_automation_runs;
drop policy if exists dash_blog_automation_runs_editors_read on public.dash_blog_automation_runs;
create policy dash_blog_automation_runs_editors_read on public.dash_blog_automation_runs
  for select to authenticated
  using ((select public.is_content_editor()));

drop policy if exists "Authenticated users can view blog topics" on public.dash_blog_topics;
drop policy if exists dash_blog_topics_editors_read on public.dash_blog_topics;
create policy dash_blog_topics_editors_read on public.dash_blog_topics
  for select to authenticated
  using ((select public.is_content_editor()));

drop policy if exists "Authenticated users can view research sources" on public.dash_blog_research_sources;
drop policy if exists dash_blog_research_sources_editors_read on public.dash_blog_research_sources;
create policy dash_blog_research_sources_editors_read on public.dash_blog_research_sources
  for select to authenticated
  using ((select public.is_content_editor()));

drop policy if exists "Authenticated users can view LLM usage" on public.dash_llm_usage;
drop policy if exists dash_llm_usage_editors_read on public.dash_llm_usage;
create policy dash_llm_usage_editors_read on public.dash_llm_usage
  for select to authenticated
  using ((select public.is_content_editor()));

-- Grants: visitors read published content only; TRUNCATE (which skips RLS) is gone for both roles.
revoke all on public.dash_blog_posts, public.dash_blog_categories, public.dash_changelog,
  public.dash_changelog_items, public.dash_seo_pages from anon;
grant select on public.dash_blog_posts, public.dash_blog_categories, public.dash_changelog,
  public.dash_changelog_items, public.dash_seo_pages to anon;

revoke truncate, references, trigger on public.dash_blog_posts, public.dash_blog_categories, public.dash_changelog,
  public.dash_changelog_items, public.dash_seo_pages from authenticated;
grant select, insert, update, delete on public.dash_blog_posts, public.dash_blog_categories, public.dash_changelog,
  public.dash_changelog_items, public.dash_seo_pages to authenticated;

revoke all on public.dash_blog_automation_runs, public.dash_blog_topics, public.dash_blog_research_sources,
  public.dash_llm_usage from anon, authenticated;
grant select on public.dash_blog_automation_runs, public.dash_blog_topics, public.dash_blog_research_sources,
  public.dash_llm_usage to authenticated;

-- @down
grant all on public.dash_blog_automation_runs, public.dash_blog_topics, public.dash_blog_research_sources,
  public.dash_llm_usage, public.dash_seo_pages to anon, authenticated;
grant all on public.dash_blog_posts, public.dash_blog_categories, public.dash_changelog,
  public.dash_changelog_items to authenticated;

drop policy if exists dash_llm_usage_editors_read on public.dash_llm_usage;
drop policy if exists "Authenticated users can view LLM usage" on public.dash_llm_usage;
create policy "Authenticated users can view LLM usage" on public.dash_llm_usage
  for select using (auth.role() = 'authenticated');

drop policy if exists dash_blog_research_sources_editors_read on public.dash_blog_research_sources;
drop policy if exists "Authenticated users can view research sources" on public.dash_blog_research_sources;
create policy "Authenticated users can view research sources" on public.dash_blog_research_sources
  for select using (auth.role() = 'authenticated');

drop policy if exists dash_blog_topics_editors_read on public.dash_blog_topics;
drop policy if exists "Authenticated users can view blog topics" on public.dash_blog_topics;
create policy "Authenticated users can view blog topics" on public.dash_blog_topics
  for select using (auth.role() = 'authenticated');

drop policy if exists dash_blog_automation_runs_editors_read on public.dash_blog_automation_runs;
drop policy if exists "Authenticated users can view automation runs" on public.dash_blog_automation_runs;
create policy "Authenticated users can view automation runs" on public.dash_blog_automation_runs
  for select using (auth.role() = 'authenticated');

drop policy if exists dash_seo_pages_editors_manage on public.dash_seo_pages;
drop policy if exists "Authenticated users can manage SEO pages" on public.dash_seo_pages;
create policy "Authenticated users can manage SEO pages" on public.dash_seo_pages
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists dash_changelog_items_editors_manage on public.dash_changelog_items;
drop policy if exists "Authenticated users can insert changelog items" on public.dash_changelog_items;
drop policy if exists "Authenticated users can update changelog items" on public.dash_changelog_items;
drop policy if exists "Authenticated users can delete changelog items" on public.dash_changelog_items;
create policy "Authenticated users can insert changelog items" on public.dash_changelog_items
  for insert with check (auth.role() = 'authenticated');
create policy "Authenticated users can update changelog items" on public.dash_changelog_items
  for update using (auth.role() = 'authenticated');
create policy "Authenticated users can delete changelog items" on public.dash_changelog_items
  for delete using (auth.role() = 'authenticated');

drop policy if exists dash_changelog_editors_manage on public.dash_changelog;
drop policy if exists "Authenticated users can insert changelogs" on public.dash_changelog;
drop policy if exists "Authenticated users can update changelogs" on public.dash_changelog;
create policy "Authenticated users can insert changelogs" on public.dash_changelog
  for insert with check (auth.role() = 'authenticated');
create policy "Authenticated users can update changelogs" on public.dash_changelog
  for update using (auth.role() = 'authenticated');

drop policy if exists dash_blog_categories_editors_manage on public.dash_blog_categories;
drop policy if exists "Authenticated users can manage blog categories" on public.dash_blog_categories;
create policy "Authenticated users can manage blog categories" on public.dash_blog_categories
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists dash_blog_posts_editors_manage on public.dash_blog_posts;
drop policy if exists "Authenticated users can manage blog posts" on public.dash_blog_posts;
create policy "Authenticated users can manage blog posts" on public.dash_blog_posts
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

alter table public.dash_changelog_items disable row level security;
alter table public.dash_changelog disable row level security;
