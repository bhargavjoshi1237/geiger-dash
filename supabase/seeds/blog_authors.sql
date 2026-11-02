-- Blog author profiles. Re-runnable: skips a slug that already exists, so later edits made in Studio are kept.
-- Run with `npm run db:seed -- blog_authors`.

insert into public.dash_blog_authors (slug, name, role, bio, avatar_url, links)
values (
  'bhargav-joshi',
  'Bhargav Joshi',
  'Full-stack developer, Geiger Studios',
  'Bhargav Joshi is a full-stack developer working across Node.js and PHP/Laravel, and increasingly on the AI systems behind web apps: RAG pipelines, self-hosted inference and custom agents. Bhargav builds Geiger Studios, a connected suite of apps for planning, creating and running work, and writes here about forms, events, AI models and what it takes to ship them.',
  'https://avatars.githubusercontent.com/u/68766403?v=4',
  '[
    {"label": "Website", "url": "https://alldesigns.vercel.app/"},
    {"label": "GitHub", "url": "https://github.com/bhargavjoshi1237"},
    {"label": "X", "url": "https://x.com/JACK0PG1"}
  ]'::jsonb
)
on conflict (slug) do nothing;
