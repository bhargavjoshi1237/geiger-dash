-- Help grey structure
--
-- One-time content move, like 20261023200049_help_flow_guide: graduates Grey into its own sidebar group. The
-- products/grey draft is re-homed as the Grey Overview (slug grey, still a draft; 20261024191720 fills it in), and
-- each area in Grey's project sidebar starts as a draft outline at grey/<area>. The page migrations that follow
-- (20261024191701 to 20261024191711) fill each page in. Grey isn't in SANDBOX_APP_IDS, so no page sets a preview.
-- Tools has no page: its sidebar entry still opens a "Coming soon" screen.
-- Written from a survey of C:\Pro\geiger-grey (lib/workspace/nav_tree.js, components/internal/screens/registry.jsx,
-- geiger-rbac.config.js).
-- Later edits happen in Studio, so this must never re-run.

-- @up
insert into public.docs_nav_groups (title, slug, sort_order)
values ('Grey', 'grey', 34)
on conflict (slug) do update set
  title = excluded.title,
  sort_order = excluded.sort_order;

-- Grey Overview: re-home the products/grey draft, or create it on a database that never had one.
update public.docs_pages
set nav_group_id = (select id from public.docs_nav_groups where slug = 'grey'),
    slug = 'grey',
    title = 'Geiger Grey',
    nav_label = 'Overview',
    preview = null,
    sort_order = 10
where slug = 'products/grey' and deleted_at is null;

insert into public.docs_pages (nav_group_id, slug, title, nav_label, description, status, sort_order)
select g.id, 'grey', 'Geiger Grey', 'Overview', 'Managed RAG and knowledge graphs.', 'draft', 10
from public.docs_nav_groups g
where g.slug = 'grey'
on conflict (slug) where deleted_at is null do nothing;

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>What Geiger Grey is for</li><li>Opening it from a project</li><li>Key concepts</li><li>Common workflows</li></ul>',
  10
from public.docs_pages p
where p.slug = 'grey' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;

-- Grey's areas, in its sidebar order: Overview, Knowledge Bases, Knowledge Graph, Playground, Tools, Pipelines,
-- Delivery, Quality, Usage, Settings. Knowledge Bases and Settings each split into two guides.
insert into public.docs_pages (nav_group_id, slug, title, description, status, sort_order)
select g.id, v.slug, v.title, v.description, 'draft', v.sort_order
from (
  values
    ('grey/project-overview', 'Project overview', 'The project''s home screen in Grey: activity, usage and what needs attention.', 20),
    ('grey/knowledge-bases', 'Knowledge bases', 'Create knowledge bases, choose how their sources are chunked and embedded, and browse the chunks they hold.', 30),
    ('grey/sources', 'Sources & ingestion', 'Add files and links to a knowledge base, keep them fresh, and follow ingestion jobs.', 40),
    ('grey/knowledge-graph', 'Knowledge graph', 'Explore the entities and relationships Grey extracts from your sources, and shape the ontology behind them.', 50),
    ('grey/playground', 'Playground', 'Chat with a pipeline, inspect the context behind each answer, and revisit past conversations.', 60),
    ('grey/pipelines', 'Pipelines & model providers', 'Build retrieval pipelines, version and publish them, and connect the model providers they run on.', 70),
    ('grey/delivery', 'Delivery', 'Serve pipelines to apps and people through API keys, MCP servers and embeddable chat widgets.', 80),
    ('grey/quality', 'Evaluations & feedback', 'Score pipeline versions against eval sets, and review the feedback people leave on answers.', 90),
    ('grey/usage', 'Usage & request logs', 'Track usage and costs across the project, and inspect each request in the logs.', 100),
    ('grey/team', 'Team & roles', 'Invite members to a Grey project, assign roles and decide what each role can do.', 110),
    ('grey/settings', 'Settings', 'Project details, your sidebar and data exports.', 120)
) as v(slug, title, description, sort_order)
cross join (select id from public.docs_nav_groups where slug = 'grey') g
on conflict (slug) where deleted_at is null do nothing;

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview', '<p><em>Draft outline. Replace before publishing.</em></p><ul>' || v.outline || '</ul>', 10
from (
  values
    ('grey/project-overview', '<li>Opening the overview</li><li>Summary figures and charts</li><li>Top pipelines</li><li>What needs attention</li>'),
    ('grey/knowledge-bases', '<li>Creating a knowledge base</li><li>Ingestion settings</li><li>Knowledge base details</li><li>Browsing chunks</li><li>Ingestion presets</li>'),
    ('grey/sources', '<li>Adding sources</li><li>The source list</li><li>Source details</li><li>Freshness</li><li>Ingestion jobs</li>'),
    ('grey/knowledge-graph', '<li>Graph Explorer</li><li>Entities</li><li>Merging entities</li><li>Ontology</li>'),
    ('grey/playground', '<li>Chat</li><li>Run settings</li><li>Context and citations</li><li>Conversations</li>'),
    ('grey/pipelines', '<li>Creating a pipeline</li><li>Pipeline settings</li><li>Publishing versions</li><li>Model providers</li>'),
    ('grey/delivery', '<li>API keys</li><li>MCP servers</li><li>Widgets</li>'),
    ('grey/quality', '<li>Eval sets</li><li>Running evaluations</li><li>Feedback</li>'),
    ('grey/usage', '<li>Usage and costs</li><li>Request logs</li>'),
    ('grey/team', '<li>Inviting members</li><li>Roles and permissions</li><li>Groups and activity</li>'),
    ('grey/settings', '<li>General</li><li>Navigation</li><li>Data export</li>')
) as v(slug, outline)
join public.docs_pages p on p.slug = v.slug and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;

-- @down
-- Area drafts go with their outline blocks (on delete cascade).
delete from public.docs_pages
where slug in (
  'grey/project-overview', 'grey/knowledge-bases', 'grey/sources', 'grey/knowledge-graph', 'grey/playground',
  'grey/pipelines', 'grey/delivery', 'grey/quality', 'grey/usage', 'grey/team', 'grey/settings'
);

update public.docs_pages
set nav_group_id = (select id from public.docs_nav_groups where slug = 'products'),
    slug = 'products/grey',
    title = 'Geiger Grey',
    nav_label = 'Grey',
    preview = null,
    sort_order = 60
where slug = 'grey' and deleted_at is null;

delete from public.docs_nav_groups where slug = 'grey';
