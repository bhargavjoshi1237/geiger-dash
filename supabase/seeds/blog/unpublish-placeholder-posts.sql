-- Unpublish the sample case study inserted by the original blog migration (fabricated quote and figures).
-- Re-runnable: only flips is_published; the row is kept so it can be rewritten as a real case study later.

update public.dash_blog_posts
set is_published = false
where slug = 'acme-corp-case-study'
  and is_published = true;
