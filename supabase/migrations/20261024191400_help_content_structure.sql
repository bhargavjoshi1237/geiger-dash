-- Help content structure
--
-- One-time content move, like 20261023200049_help_flow_guide: gives Content its own sidebar group (sort 31). The
-- products/content draft is re-homed as the Content Overview (still a draft, now with the /content/playground hero),
-- and each section of Content's workspace sidebar starts as a draft outline, plus a Live feed child page under
-- Recommendations. The page migrations that follow (20261024191401 to 20261024191420) fill each page in.
-- Written from a survey of C:\Pro\geiger-content (components/internal/sidebar/sidebar_nav.jsx,
-- components/internal/screens/registry.jsx, app/project/feed/[projectId]/page.js).
-- Later edits happen in Studio, so this must never re-run.

-- @up
insert into public.docs_nav_groups (title, slug, sort_order)
values ('Content', 'content', 31)
on conflict (slug) do update set
  title = excluded.title,
  sort_order = excluded.sort_order;

-- Content Overview: re-home the products/content draft, or create it on a database that never had one.
update public.docs_pages
set nav_group_id = (select id from public.docs_nav_groups where slug = 'content'),
    slug = 'content',
    title = 'Geiger Content',
    nav_label = 'Overview',
    preview = 'content',
    sort_order = 10
where slug = 'products/content' and deleted_at is null;

insert into public.docs_pages (nav_group_id, slug, title, nav_label, description, preview, status, sort_order)
select g.id, 'content', 'Geiger Content', 'Overview', 'Personalized content feeds.', 'content', 'draft', 10
from public.docs_nav_groups g
where g.slug = 'content'
on conflict (slug) where deleted_at is null do nothing;

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>What Geiger Content is for</li><li>Opening it from a project</li><li>Key concepts</li><li>Common workflows</li></ul>',
  10
from public.docs_pages p
where p.slug = 'content' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;

-- Content's sidebar sections, in sidebar order: drafts with a writing outline, visible to editors in preview only.
insert into public.docs_pages (nav_group_id, slug, title, description, status, sort_order)
select g.id, v.slug, v.title, v.description, 'draft', v.sort_order
from (
  values
    ('content/library', 'Content library', 'Create and manage entries, pages, collections, assets and content slots.', 20),
    ('content/architecture', 'Content architecture', 'Define content types, fields, reusable blocks, references, validation, taxonomies, locales and external sources.', 30),
    ('content/editorial', 'Editorial', 'Write, review and approve content with editors, comments, assignments, workflows and version history.', 40),
    ('content/publishing', 'Publishing', 'Publish and deliver content through the queue, releases, environments, delivery APIs and webhooks.', 50),
    ('content/governance', 'Governance', 'Manage members, roles, permissions, content policies, consent, audit logs and retention.', 60),
    ('content/developers', 'Developer tools', 'Explore the delivery APIs, generate types, manage tokens and service accounts, and import or export content.', 70),
    ('content/audiences', 'Audiences', 'Profiles, anonymous visitors, identity, traits, behavior events, segments and consent.', 80),
    ('content/personalization', 'Personalization', 'Show different content to different people with variants, targeting rules, caps and boosts.', 90),
    ('content/experiments', 'Experiments', 'Run A/B tests and bandits, allocate traffic, set goals and holdouts, and read the results.', 100),
    ('content/recommendations', 'Recommendations', 'Rank and recommend content with models, similar content, affinity, trending, ranking rules and the Feed Lab.', 110),
    ('content/intelligence', 'Content intelligence', 'Content and audience performance, semantic search, tag suggestions, duplicates, gaps and the knowledge graph.', 120),
    ('content/settings', 'Project settings', 'General, workspace, branding, integrations and security settings for the project.', 130)
) as v(slug, title, description, sort_order)
cross join (select id from public.docs_nav_groups where slug = 'content') g
on conflict (slug) where deleted_at is null do nothing;

-- The live feed opens from Feed Lab, so it sits under Recommendations.
insert into public.docs_pages (nav_group_id, parent_id, slug, title, description, status, sort_order)
select p.nav_group_id, p.id, 'content/recommendations/live-feed', 'Live feed',
  'Browse the project''s live feed full screen, react to posts and steer what it shows next.', 'draft', 10
from public.docs_pages p
where p.slug = 'content/recommendations' and p.deleted_at is null
on conflict (slug) where deleted_at is null do nothing;

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview', '<p><em>Draft outline. Replace before publishing.</em></p><ul>' || v.outline || '</ul>', 10
from (
  values
    ('content/library', '<li>All Content and the entry list</li><li>Drafts, Pages, Scheduled and Archived</li><li>Editing an entry</li><li>Collections</li><li>Assets</li><li>Content Slots</li>'),
    ('content/architecture', '<li>Content Types</li><li>Field Schemas</li><li>Reusable Blocks</li><li>References</li><li>Validation Rules</li><li>Taxonomies</li><li>Localization</li><li>External Sources</li>'),
    ('content/editorial', '<li>Structured Editor</li><li>Visual Editor</li><li>Comments and mentions</li><li>Assignments</li><li>Review Queue</li><li>Approval Workflows</li><li>Version History</li><li>Compare and rollback</li><li>Bulk Editing</li><li>AI Assistant</li>'),
    ('content/publishing', '<li>Publishing Queue</li><li>Releases</li><li>Environments</li><li>Delivery APIs</li><li>Webhooks</li><li>Edge Delivery</li><li>Cache Invalidation</li><li>Publishing History</li><li>Sites and brands</li>'),
    ('content/governance', '<li>Team and members</li><li>Roles</li><li>Permissions</li><li>Content Policies</li><li>Consent and privacy</li><li>Audit Logs</li><li>Retention Policies</li>'),
    ('content/developers', '<li>API Explorer</li><li>REST API</li><li>GraphQL API</li><li>SDKs and CLI</li><li>Type Generation</li><li>Preview Tools</li><li>API Tokens</li><li>Service Accounts</li><li>Apps and plugins</li><li>Logs and usage</li><li>Import and export</li>'),
    ('content/audiences', '<li>Profiles</li><li>Anonymous Visitors</li><li>Identity Resolution</li><li>Traits</li><li>Calculated Attributes</li><li>Behavior Events</li><li>Segments</li><li>Consent State</li><li>Profile History</li><li>Data Connections</li>'),
    ('content/personalization', '<li>Content Variants</li><li>Targeting Rules</li><li>Segment, context, component and behavior targeting</li><li>Edge Decisions</li><li>Frequency Caps</li><li>Boosts and exclusions</li><li>Topic Journey Stages</li>'),
    ('content/experiments', '<li>All Experiments</li><li>A/B Tests</li><li>Traffic Allocation</li><li>Goals and metrics</li><li>Holdout Groups</li><li>Eligibility Rules</li><li>Experiment Schedule</li><li>Results and winner suggestions</li><li>Multi-armed Bandits</li><li>Collision Control</li>'),
    ('content/recommendations', '<li>Recommendation Models</li><li>Similar Content</li><li>User Affinity</li><li>Trending Content</li><li>Content-based, collaborative and context-aware ranking</li><li>Diversity Controls</li><li>Feed Lab</li><li>Business Rules</li><li>Real-time Ranking</li>'),
    ('content/recommendations/live-feed', '<li>Opening the live feed</li><li>Reacting to posts and hiding them</li><li>Steering the feed</li><li>The insights panel</li>'),
    ('content/intelligence', '<li>Content Performance</li><li>Audience Performance</li><li>Funnels and journeys</li><li>Topic Interest</li><li>Semantic Search</li><li>AI Tag Suggestions</li><li>Embeddings</li><li>Duplicate Detection</li><li>Content Gaps</li><li>Knowledge Graph</li><li>Decision Explanations</li>'),
    ('content/settings', '<li>General</li><li>Workspace</li><li>Branding</li><li>Integrations</li><li>Security</li>')
) as v(slug, outline)
join public.docs_pages p on p.slug = v.slug and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;

-- @down
-- Content drafts go with their outline blocks (on delete cascade). The child page goes before its parent.
delete from public.docs_pages
where slug = 'content/recommendations/live-feed' and deleted_at is null;

delete from public.docs_pages
where slug in (
  'content/library', 'content/architecture', 'content/editorial', 'content/publishing', 'content/governance',
  'content/developers', 'content/audiences', 'content/personalization', 'content/experiments',
  'content/recommendations', 'content/intelligence', 'content/settings'
) and deleted_at is null;

-- Move the Overview back before the group goes: deleting a group cascades to its pages.
update public.docs_pages
set nav_group_id = (select id from public.docs_nav_groups where slug = 'products'),
    slug = 'products/content',
    title = 'Geiger Content',
    nav_label = 'Content',
    preview = null,
    sort_order = 70
where slug = 'content' and deleted_at is null;

delete from public.docs_nav_groups where slug = 'content';
