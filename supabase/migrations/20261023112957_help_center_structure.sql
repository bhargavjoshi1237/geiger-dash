-- Help center structure
--
-- Replaces the placeholder Cursor-style docs (Agent, Customizing, Cloud Agents, Bugbot…) with the Geiger
-- suite structure served at /help: Get Started, Workspace and Products. One-time content move, so it is a
-- migration rather than a seed — later edits happen in Studio and must never be overwritten by a re-run.
-- Only Welcome stays published; every new page starts as a draft carrying a writing outline.

-- @up
-- Placeholder groups go with their pages and sections (on delete cascade).
delete from public.docs_nav_groups where slug in ('agent', 'customizing', 'cloud-agents');
-- /changelog already covers release notes.
delete from public.docs_pages where slug = 'changelog';

insert into public.docs_nav_groups (title, slug, sort_order)
values
  ('Get Started', 'get-started', 10),
  ('Workspace', 'workspace', 20),
  ('Products', 'products', 30)
on conflict (slug) do update set
  title = excluded.title,
  sort_order = excluded.sort_order;

update public.docs_pages
set title = 'Geiger Help Center',
    nav_label = 'Welcome',
    description = 'Guides for the Geiger suite: setting up your organization, running projects, and getting the most out of each product.',
    status = 'published',
    sort_order = 10,
    has_children = false,
    toc = '[]'::jsonb
where slug = 'welcome' and deleted_at is null;

update public.docs_pages
set title = 'Quickstart',
    nav_label = null,
    description = 'Create an account, set up your organization, and open your first project.',
    status = 'draft',
    sort_order = 20,
    has_children = false,
    toc = '[]'::jsonb
where slug = 'quickstart' and deleted_at is null;

update public.docs_pages
set title = 'Plans & pricing',
    nav_label = null,
    description = 'How plans, seats, add-ons and usage are billed.',
    status = 'draft',
    sort_order = 40,
    has_children = false,
    toc = '[]'::jsonb
where slug = 'plans-pricing' and deleted_at is null;

insert into public.docs_pages (nav_group_id, slug, title, nav_label, description, status, sort_order)
select g.id, v.slug, v.title, v.nav_label, v.description, 'draft', v.sort_order
from (
  values
    ('get-started', 'core-concepts', 'Core concepts', null, 'Organizations, projects, members and products: how the pieces of Geiger fit together.', 30),
    ('workspace', 'workspace/organizations', 'Organizations', null, 'Create an organization, manage its settings, and switch between organizations.', 10),
    ('workspace', 'workspace/members', 'Members & roles', null, 'Invite teammates, assign roles, and manage who can access what.', 20),
    ('workspace', 'workspace/projects', 'Projects', null, 'Create projects and open them in the products your team uses.', 30),
    ('workspace', 'workspace/billing', 'Billing & usage', null, 'Manage your plan, payments and usage.', 40),
    ('workspace', 'workspace/add-ons', 'Add-ons', null, 'Extend your organization with add-ons such as a custom subdomain and email templates.', 50),
    ('workspace', 'workspace/sign-in', 'Sign-in & OAuth', null, 'Configure how members sign in, including OAuth providers for your organization.', 60),
    ('products', 'products/flow', 'Geiger Flow', 'Flow', 'Projects and delivery.', 10),
    ('products', 'products/notes', 'Geiger Notes', 'Notes', 'Docs and knowledge.', 20),
    ('products', 'products/assets', 'Geiger Assets', 'Assets', 'Creative asset control.', 30),
    ('products', 'products/events', 'Geiger Events', 'Events', 'Event operations and registration.', 40),
    ('products', 'products/forms', 'Geiger Forms', 'Forms', 'Intake and feedback.', 50),
    ('products', 'products/grey', 'Geiger Grey', 'Grey', 'Managed RAG and knowledge graphs.', 60),
    ('products', 'products/content', 'Geiger Content', 'Content', 'Personalized content feeds.', 70),
    ('products', 'products/campaign', 'Geiger Campaign', 'Campaign', 'Campaign planning and delivery.', 80),
    ('products', 'products/comms', 'Geiger Comms', 'Comms', 'Customer messaging and support.', 90),
    ('products', 'products/office', 'Geiger Office', 'Office', 'Workspace operations.', 100),
    ('products', 'products/docs', 'Geiger Docs', 'Docs', 'Document signing and agreements.', 110),
    ('products', 'products/pods', 'Geiger Pods', 'Pods', 'API gateway.', 120),
    ('products', 'products/property', 'Geiger Property', 'Property', 'Real estate and property management.', 130)
) as v(group_slug, slug, title, nav_label, description, sort_order)
join public.docs_nav_groups g on g.slug = v.group_slug
on conflict (slug) where deleted_at is null do nothing;

-- Welcome: rewritten for the suite.
delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'welcome' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, cards, features, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.cards::jsonb, v.features::jsonb, v.sort_order
from (
  values
    (
      'start-here',
      null,
      'Start here',
      '',
      '[{"icon":"UserPlus","title":"Create an account","body":"Sign up and set up your organization","href":"/signup"},{"icon":"CircleDollarSign","title":"Plans & pricing","body":"Compare plans, seats and add-ons","href":"/pricing"},{"icon":"Sparkles","title":"Changelog","body":"See what shipped across the suite","href":"/changelog"}]',
      '[]',
      10
    ),
    (
      'how-it-fits',
      'Concepts',
      'How Geiger is organized',
      '<p>Everything in Geiger belongs to an <strong>organization</strong>. Your organization holds its members, billing and settings, along with the <strong>projects</strong> your team works on.</p><p>Each project can be opened in the products it uses: planning in Flow, files in Assets, event operations in Events. The work stays connected to the same project wherever it happens.</p>',
      '[]',
      '[]',
      20
    ),
    (
      'products',
      'Products',
      'The suite',
      '<p>Each product is its own app, opened from the same organization and project.</p>',
      '[]',
      '[{"icon":"Workflow","text":"Flow: projects and delivery"},{"icon":"NotebookPen","text":"Notes: docs and knowledge"},{"icon":"Images","text":"Assets: creative asset control"},{"icon":"CalendarDays","text":"Events: event operations and registration"},{"icon":"ClipboardList","text":"Forms: intake and feedback"},{"icon":"BrainCircuit","text":"Grey: managed RAG and knowledge graphs"},{"icon":"Rss","text":"Content: personalized content feeds"},{"icon":"Megaphone","text":"Campaign: campaign planning and delivery"},{"icon":"MessagesSquare","text":"Comms: customer messaging and support"},{"icon":"Building2","text":"Office: workspace operations"},{"icon":"Signature","text":"Docs: document signing and agreements"},{"icon":"Plug","text":"Pods: API gateway"},{"icon":"House","text":"Property: real estate and property management"}]',
      30
    )
) as v(anchor_id, eyebrow, title, content, cards, features, sort_order)
cross join (select id from public.docs_pages where slug = 'welcome' and deleted_at is null) p;

-- Drafts: replace the old placeholder section with a writing outline.
delete from public.docs_content_blocks
where anchor_id = 'overview'
  and page_id in (select id from public.docs_pages where slug in ('quickstart', 'plans-pricing') and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview', '<p><em>Draft outline. Replace before publishing.</em></p><ul>' || v.outline || '</ul>', 10
from (
  values
    ('quickstart', '<li>Create an account</li><li>Set up your organization</li><li>Create your first project</li><li>Open a product from the project</li><li>Invite your team</li>'),
    ('core-concepts', '<li>Organizations</li><li>Projects</li><li>Members and roles</li><li>Products and how they share a project</li>'),
    ('plans-pricing', '<li>Plans and what they include</li><li>Seats</li><li>Add-ons</li><li>Usage-based charges</li><li>Trials and plan expiry</li>'),
    ('workspace/organizations', '<li>Creating an organization</li><li>Organization settings</li><li>Switching between organizations</li><li>Leaving or deleting an organization</li>'),
    ('workspace/members', '<li>Inviting members</li><li>Roles and permissions</li><li>Pending invites</li><li>Removing a member</li>'),
    ('workspace/projects', '<li>Creating a project</li><li>Opening a project in a product</li><li>Project settings</li><li>Managing projects</li>'),
    ('workspace/billing', '<li>Your current plan</li><li>Checkout and payments</li><li>The usage page</li><li>Changing plans</li>'),
    ('workspace/add-ons', '<li>Custom subdomain</li><li>Email templates</li><li>Email sending credits</li><li>OAuth sign-in</li>'),
    ('workspace/sign-in', '<li>Signing in</li><li>OAuth providers for your organization</li><li>Troubleshooting sign-in</li>')
) as v(slug, outline)
join public.docs_pages p on p.slug = v.slug and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select
  p.id,
  'overview',
  'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>What ' || p.title || ' is for</li><li>Opening it from a project</li><li>Key concepts</li><li>Common workflows</li></ul>',
  10
from public.docs_pages p
where p.slug like 'products/%' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;

-- @down
delete from public.docs_nav_groups where slug in ('workspace', 'products');
delete from public.docs_pages where slug = 'core-concepts';

update public.docs_nav_groups set title = 'Get Started', sort_order = 10 where slug = 'get-started';

insert into public.docs_nav_groups (title, slug, sort_order)
values
  ('Agent', 'agent', 20),
  ('Customizing', 'customizing', 30),
  ('Cloud Agents', 'cloud-agents', 40)
on conflict (slug) do nothing;

update public.docs_pages
set title = 'Geiger Documentation',
    nav_label = 'Welcome',
    description = 'Geiger is an AI workspace and delivery system. Use it to understand your projects, plan and build features, review changes, and work with the tools your team already uses.',
    status = 'published',
    sort_order = 10,
    toc = '[{"label":"Start here","href":"#start-here"},{"label":"What you can do with Geiger","href":"#get-started"},{"label":"Products","href":"#products"}]'::jsonb
where slug = 'welcome' and deleted_at is null;

update public.docs_pages
set title = 'Quickstart',
    description = 'Install Geiger, connect a workspace, and make the first useful change.',
    status = 'published',
    sort_order = 20,
    toc = '[{"label":"Overview","href":"#overview"}]'::jsonb
where slug = 'quickstart' and deleted_at is null;

update public.docs_pages
set title = 'Plans & Pricing',
    description = 'Compare plans, seats, usage pools, and team pricing.',
    status = 'published',
    sort_order = 30,
    has_children = true,
    toc = '[{"label":"Overview","href":"#overview"}]'::jsonb
where slug = 'plans-pricing' and deleted_at is null;

insert into public.docs_pages (nav_group_id, slug, title, description, toc, status, sort_order, has_children, published_at)
select g.id, v.slug, v.title, v.description, '[{"label":"Overview","href":"#overview"}]'::jsonb, 'published', v.sort_order, v.has_children, now()
from (
  values
    ('get-started', 'changelog', 'Changelog', 'Track the latest Geiger releases and product improvements.', 40, false),
    ('agent', 'agent/overview', 'Overview', 'Understand how Geiger agents read context, plan work, and prepare reviewable changes.', 10, false),
    ('agent', 'agent/window', 'Agents Window', 'Use the agent workspace for tasks, context, tools, and approvals.', 20, false),
    ('agent', 'agent/review', 'Agent Review', 'Review proposed changes, test results, and implementation notes.', 30, false),
    ('agent', 'agent/planning', 'Planning', 'Guide the agent through implementation plans and checkpoints.', 40, false),
    ('agent', 'agent/prompting', 'Prompting', 'Write instructions that give the agent useful context and clear outcomes.', 50, false),
    ('agent', 'agent/debugging', 'Debugging', 'Use logs, diffs, and test output to resolve agent work quickly.', 60, false),
    ('agent', 'agent/tools', 'Tools', 'Connect tools that let agents inspect, edit, and verify your workspace.', 70, true),
    ('agent', 'agent/security', 'Security', 'Keep permissions, approvals, and workspace boundaries visible.', 80, false),
    ('customizing', 'customizing/plugins', 'Plugins', 'Extend Geiger with product-specific plugins.', 10, false),
    ('customizing', 'customizing/rules', 'Rules', 'Add persistent project instructions and team standards.', 20, false),
    ('customizing', 'customizing/skills', 'Skills', 'Teach Geiger repeatable workflows with local skills.', 30, false),
    ('customizing', 'customizing/subagents', 'Subagents', 'Split focused work across specialized agents.', 40, false),
    ('customizing', 'customizing/hooks', 'Hooks', 'Run local automation around agent events.', 50, false),
    ('customizing', 'customizing/mcp', 'MCP', 'Connect external tools and resources through Model Context Protocol.', 60, false),
    ('cloud-agents', 'cloud-agents/overview', 'Overview', 'Run Geiger agents on managed or self-hosted cloud machines.', 10, false),
    ('cloud-agents', 'cloud-agents/setup', 'Setup', 'Prepare repositories, machines, and credentials for cloud execution.', 20, false),
    ('cloud-agents', 'cloud-agents/capabilities', 'Capabilities', 'Review what cloud agents can inspect, run, and change.', 30, false),
    ('cloud-agents', 'cloud-agents/my-machines', 'My Machines', 'Manage the machines available to your team.', 40, false),
    ('cloud-agents', 'cloud-agents/self-hosted-pool', 'Self-Hosted Pool', 'Attach your own worker pool for private infrastructure.', 50, false),
    ('cloud-agents', 'cloud-agents/bugbot', 'Bugbot', 'Use Bugbot to find and summarize product issues.', 60, false)
) as v(group_slug, slug, title, description, sort_order, has_children)
join public.docs_nav_groups g on g.slug = v.group_slug
on conflict (slug) where deleted_at is null do nothing;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'welcome' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, body, content, cards, features, links, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.body::jsonb, v.content, v.cards::jsonb, v.features::jsonb, v.links::jsonb, v.sort_order
from (
  values
    (
      'start-here', null, 'Start here', '[]', '',
      '[{"icon":"Rocket","title":"Get started","body":"Go from install to your first useful change in Geiger","href":"#get-started"},{"icon":"CircleDollarSign","title":"Plans & Pricing","body":"Compare plans, usage pools, and team pricing","href":"/pricing"},{"icon":"Sparkles","title":"Changelog","body":"Stay up to date with the latest features and improvements","href":"/changelog"}]',
      '[]', '[]', 10
    ),
    (
      'get-started', 'Start here', 'What you can do with Geiger',
      '["Start with a workspace, connect your project sources, and let the agent collect enough context to plan a useful change. From there, Geiger can draft implementation steps, update project assets, and prepare a reviewable change set."]',
      '<p>Start with a workspace, connect your project sources, and let the agent collect enough context to plan a useful change. From there, Geiger can draft implementation steps, update project assets, and prepare a reviewable change set.</p>',
      '[]',
      '[{"icon":"Bot","text":"Ask questions across your workspace"},{"icon":"GitPullRequestArrow","text":"Review and apply proposed changes"},{"icon":"Code2","text":"Generate implementation plans"},{"icon":"ShieldCheck","text":"Keep permissions and approvals visible"}]',
      '[]', 20
    ),
    (
      'products', 'Products', 'Core surfaces',
      '["Geiger Docs covers the dashboard, project planning, notes canvas, asset workflows, AI agents, and cloud execution. Each guide focuses on the shortest path from setup to a working team workflow."]',
      '<p>Geiger Docs covers the dashboard, project planning, notes canvas, asset workflows, AI agents, and cloud execution. Each guide focuses on the shortest path from setup to a working team workflow.</p>',
      '[]', '[]',
      '[{"icon":"Box","label":"Dash","href":"/docs/quickstart"},{"icon":"WandSparkles","label":"Grey","href":"/docs/agent/overview"},{"icon":"Rocket","label":"Flow","href":"/docs/cloud-agents/overview"}]',
      30
    )
) as v(anchor_id, eyebrow, title, body, content, cards, features, links, sort_order)
cross join (select id from public.docs_pages where slug = 'welcome' and deleted_at is null) p;

delete from public.docs_content_blocks
where anchor_id = 'overview'
  and page_id in (select id from public.docs_pages where slug in ('quickstart', 'plans-pricing') and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, body, content, sort_order)
select
  p.id,
  'overview',
  'Docs',
  p.title,
  jsonb_build_array('This page is managed from Supabase. Add more ordered rows in docs_content_blocks to build out the full guide.'),
  '<p>This page is managed from Supabase. Add more ordered rows in docs_content_blocks to build out the full guide.</p>',
  10
from public.docs_pages p
where p.slug <> 'welcome' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
