-- Strip the "actively shipping" disclaimer repeated verbatim on every published Events SEO page.
-- Re-runnable: only touches rows that still contain it; the updated_at trigger bumps each page's sitemap lastmod.

update public.dash_seo_pages
set content = btrim(regexp_replace(
  content,
  '\s*<p>\s*<em>\s*Geiger Events is actively shipping\.[^<]*</em>\s*</p>',
  '',
  'g'
))
where content like '%Geiger Events is actively shipping%';
