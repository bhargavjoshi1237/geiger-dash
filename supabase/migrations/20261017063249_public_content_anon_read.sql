-- Public content anon read
--
-- Signed-out visitors were denied at the table-grant level on changelog, blog and docs, so public pages
-- fell back to placeholders. Grants SELECT only; the existing RLS select policies still limit anon to
-- published rows (blog posts, docs pages) and writes stay authenticated-only.

-- @up
grant usage on schema public to anon, authenticated;

grant select on
  public.dash_changelog,
  public.dash_changelog_items,
  public.dash_blog_posts,
  public.dash_blog_categories,
  public.docs_nav_groups,
  public.docs_pages,
  public.docs_content_blocks,
  public.dash_seo_pages
to anon, authenticated;

-- @down
-- Only anon is revoked: authenticated may have held these grants before this migration.
revoke select on
  public.dash_changelog,
  public.dash_changelog_items,
  public.dash_blog_posts,
  public.dash_blog_categories,
  public.docs_nav_groups,
  public.docs_pages,
  public.docs_content_blocks
from anon;
