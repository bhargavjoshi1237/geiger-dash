-- Geiger Docs content system
-- Run this in the Supabase SQL editor after the base project tables.

create extension if not exists "pgcrypto";

create table if not exists public.docs_nav_groups (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.docs_pages (
  id uuid primary key default gen_random_uuid(),
  nav_group_id uuid not null references public.docs_nav_groups(id) on delete cascade,
  slug text not null unique,
  title text not null,
  nav_label text,
  description text not null default '',
  preview text,
  toc jsonb not null default '[]'::jsonb,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  sort_order integer not null default 0,
  has_children boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.docs_content_blocks (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null references public.docs_pages(id) on delete cascade,
  anchor_id text not null,
  block_type text not null default 'section' check (block_type in ('section')),
  eyebrow text,
  title text not null,
  body jsonb not null default '[]'::jsonb,
  cards jsonb not null default '[]'::jsonb,
  features jsonb not null default '[]'::jsonb,
  links jsonb not null default '[]'::jsonb,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (page_id, anchor_id)
);

create index if not exists docs_pages_nav_group_idx on public.docs_pages(nav_group_id, sort_order);
create index if not exists docs_pages_status_idx on public.docs_pages(status);
create index if not exists docs_content_blocks_page_idx on public.docs_content_blocks(page_id, sort_order);

alter table public.docs_nav_groups enable row level security;
alter table public.docs_pages enable row level security;
alter table public.docs_content_blocks enable row level security;

drop policy if exists "Docs nav groups are public" on public.docs_nav_groups;
create policy "Docs nav groups are public"
  on public.docs_nav_groups for select
  using (true);

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

insert into public.docs_nav_groups (title, slug, sort_order)
values
  ('Get Started', 'get-started', 10),
  ('Agent', 'agent', 20),
  ('Customizing', 'customizing', 30),
  ('Cloud Agents', 'cloud-agents', 40)
on conflict (slug) do update set
  title = excluded.title,
  sort_order = excluded.sort_order,
  updated_at = now();

with groups as (
  select id, slug from public.docs_nav_groups
)
insert into public.docs_pages (
  nav_group_id,
  slug,
  title,
  nav_label,
  description,
  preview,
  toc,
  status,
  sort_order,
  has_children,
  published_at
)
values
  (
    (select id from groups where slug = 'get-started'),
    'welcome',
    'Geiger Documentation',
    'Welcome',
    'Geiger is an AI workspace and delivery system. Use it to understand your projects, plan and build features, review changes, and work with the tools your team already uses.',
    'assets',
    '[{"label":"Start here","href":"#start-here"},{"label":"What you can do with Geiger","href":"#get-started"},{"label":"Products","href":"#products"}]'::jsonb,
    'published',
    10,
    false,
    now()
  ),
  ((select id from groups where slug = 'get-started'), 'quickstart', 'Quickstart', null, 'Install Geiger, connect a workspace, and make the first useful change.', null, '[{"label":"Overview","href":"#overview"}]'::jsonb, 'published', 20, false, now()),
  ((select id from groups where slug = 'get-started'), 'plans-pricing', 'Plans & Pricing', null, 'Compare plans, seats, usage pools, and team pricing.', null, '[{"label":"Overview","href":"#overview"}]'::jsonb, 'published', 30, true, now()),
  ((select id from groups where slug = 'get-started'), 'changelog', 'Changelog', null, 'Track the latest Geiger releases and product improvements.', null, '[{"label":"Overview","href":"#overview"}]'::jsonb, 'published', 40, false, now()),
  ((select id from groups where slug = 'agent'), 'agent/overview', 'Overview', null, 'Understand how Geiger agents read context, plan work, and prepare reviewable changes.', null, '[{"label":"Overview","href":"#overview"}]'::jsonb, 'published', 10, false, now()),
  ((select id from groups where slug = 'agent'), 'agent/window', 'Agents Window', null, 'Use the agent workspace for tasks, context, tools, and approvals.', null, '[{"label":"Overview","href":"#overview"}]'::jsonb, 'published', 20, false, now()),
  ((select id from groups where slug = 'agent'), 'agent/review', 'Agent Review', null, 'Review proposed changes, test results, and implementation notes.', null, '[{"label":"Overview","href":"#overview"}]'::jsonb, 'published', 30, false, now()),
  ((select id from groups where slug = 'agent'), 'agent/planning', 'Planning', null, 'Guide the agent through implementation plans and checkpoints.', null, '[{"label":"Overview","href":"#overview"}]'::jsonb, 'published', 40, false, now()),
  ((select id from groups where slug = 'agent'), 'agent/prompting', 'Prompting', null, 'Write instructions that give the agent useful context and clear outcomes.', null, '[{"label":"Overview","href":"#overview"}]'::jsonb, 'published', 50, false, now()),
  ((select id from groups where slug = 'agent'), 'agent/debugging', 'Debugging', null, 'Use logs, diffs, and test output to resolve agent work quickly.', null, '[{"label":"Overview","href":"#overview"}]'::jsonb, 'published', 60, false, now()),
  ((select id from groups where slug = 'agent'), 'agent/tools', 'Tools', null, 'Connect tools that let agents inspect, edit, and verify your workspace.', null, '[{"label":"Overview","href":"#overview"}]'::jsonb, 'published', 70, true, now()),
  ((select id from groups where slug = 'agent'), 'agent/security', 'Security', null, 'Keep permissions, approvals, and workspace boundaries visible.', null, '[{"label":"Overview","href":"#overview"}]'::jsonb, 'published', 80, false, now()),
  ((select id from groups where slug = 'customizing'), 'customizing/plugins', 'Plugins', null, 'Extend Geiger with product-specific plugins.', null, '[{"label":"Overview","href":"#overview"}]'::jsonb, 'published', 10, false, now()),
  ((select id from groups where slug = 'customizing'), 'customizing/rules', 'Rules', null, 'Add persistent project instructions and team standards.', null, '[{"label":"Overview","href":"#overview"}]'::jsonb, 'published', 20, false, now()),
  ((select id from groups where slug = 'customizing'), 'customizing/skills', 'Skills', null, 'Teach Geiger repeatable workflows with local skills.', null, '[{"label":"Overview","href":"#overview"}]'::jsonb, 'published', 30, false, now()),
  ((select id from groups where slug = 'customizing'), 'customizing/subagents', 'Subagents', null, 'Split focused work across specialized agents.', null, '[{"label":"Overview","href":"#overview"}]'::jsonb, 'published', 40, false, now()),
  ((select id from groups where slug = 'customizing'), 'customizing/hooks', 'Hooks', null, 'Run local automation around agent events.', null, '[{"label":"Overview","href":"#overview"}]'::jsonb, 'published', 50, false, now()),
  ((select id from groups where slug = 'customizing'), 'customizing/mcp', 'MCP', null, 'Connect external tools and resources through Model Context Protocol.', null, '[{"label":"Overview","href":"#overview"}]'::jsonb, 'published', 60, false, now()),
  ((select id from groups where slug = 'cloud-agents'), 'cloud-agents/overview', 'Overview', null, 'Run Geiger agents on managed or self-hosted cloud machines.', null, '[{"label":"Overview","href":"#overview"}]'::jsonb, 'published', 10, false, now()),
  ((select id from groups where slug = 'cloud-agents'), 'cloud-agents/setup', 'Setup', null, 'Prepare repositories, machines, and credentials for cloud execution.', null, '[{"label":"Overview","href":"#overview"}]'::jsonb, 'published', 20, false, now()),
  ((select id from groups where slug = 'cloud-agents'), 'cloud-agents/capabilities', 'Capabilities', null, 'Review what cloud agents can inspect, run, and change.', null, '[{"label":"Overview","href":"#overview"}]'::jsonb, 'published', 30, false, now()),
  ((select id from groups where slug = 'cloud-agents'), 'cloud-agents/my-machines', 'My Machines', null, 'Manage the machines available to your team.', null, '[{"label":"Overview","href":"#overview"}]'::jsonb, 'published', 40, false, now()),
  ((select id from groups where slug = 'cloud-agents'), 'cloud-agents/self-hosted-pool', 'Self-Hosted Pool', null, 'Attach your own worker pool for private infrastructure.', null, '[{"label":"Overview","href":"#overview"}]'::jsonb, 'published', 50, false, now()),
  ((select id from groups where slug = 'cloud-agents'), 'cloud-agents/bugbot', 'Bugbot', null, 'Use Bugbot to find and summarize product issues.', null, '[{"label":"Overview","href":"#overview"}]'::jsonb, 'published', 60, false, now())
on conflict (slug) do update set
  nav_group_id = excluded.nav_group_id,
  title = excluded.title,
  nav_label = excluded.nav_label,
  description = excluded.description,
  preview = excluded.preview,
  toc = excluded.toc,
  status = excluded.status,
  sort_order = excluded.sort_order,
  has_children = excluded.has_children,
  updated_at = now();

with welcome as (
  select id from public.docs_pages where slug = 'welcome'
)
insert into public.docs_content_blocks (
  page_id,
  anchor_id,
  block_type,
  eyebrow,
  title,
  body,
  cards,
  features,
  links,
  sort_order
)
values
  (
    (select id from welcome),
    'start-here',
    'section',
    null,
    'Start here',
    '[]'::jsonb,
    '[{"icon":"Rocket","title":"Get started","body":"Go from install to your first useful change in Geiger","href":"#get-started"},{"icon":"CircleDollarSign","title":"Plans & Pricing","body":"Compare plans, usage pools, and team pricing","href":"/pricing"},{"icon":"Sparkles","title":"Changelog","body":"Stay up to date with the latest features and improvements","href":"/changelog"}]'::jsonb,
    '[]'::jsonb,
    '[]'::jsonb,
    10
  ),
  (
    (select id from welcome),
    'get-started',
    'section',
    'Start here',
    'What you can do with Geiger',
    '["Start with a workspace, connect your project sources, and let the agent collect enough context to plan a useful change. From there, Geiger can draft implementation steps, update project assets, and prepare a reviewable change set."]'::jsonb,
    '[]'::jsonb,
    '[{"icon":"Bot","text":"Ask questions across your workspace"},{"icon":"GitPullRequestArrow","text":"Review and apply proposed changes"},{"icon":"Code2","text":"Generate implementation plans"},{"icon":"ShieldCheck","text":"Keep permissions and approvals visible"}]'::jsonb,
    '[]'::jsonb,
    20
  ),
  (
    (select id from welcome),
    'products',
    'section',
    'Products',
    'Core surfaces',
    '["Geiger Docs covers the dashboard, project planning, notes canvas, asset workflows, AI agents, and cloud execution. Each guide focuses on the shortest path from setup to a working team workflow."]'::jsonb,
    '[]'::jsonb,
    '[]'::jsonb,
    '[{"icon":"Box","label":"Dash","href":"/docs/quickstart"},{"icon":"WandSparkles","label":"Grey","href":"/docs/agent/overview"},{"icon":"Rocket","label":"Flow","href":"/docs/cloud-agents/overview"}]'::jsonb,
    30
  )
on conflict (page_id, anchor_id) do update set
  block_type = excluded.block_type,
  eyebrow = excluded.eyebrow,
  title = excluded.title,
  body = excluded.body,
  cards = excluded.cards,
  features = excluded.features,
  links = excluded.links,
  sort_order = excluded.sort_order,
  updated_at = now();

insert into public.docs_content_blocks (page_id, anchor_id, block_type, eyebrow, title, body, sort_order)
select
  docs_pages.id,
  'overview',
  'section',
  'Docs',
  docs_pages.title,
  jsonb_build_array('This page is managed from Supabase. Add more ordered rows in docs_content_blocks to build out the full guide.'),
  10
from public.docs_pages
where docs_pages.slug <> 'welcome'
on conflict (page_id, anchor_id) do nothing;
