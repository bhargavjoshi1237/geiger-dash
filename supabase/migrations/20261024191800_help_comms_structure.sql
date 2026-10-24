-- Help comms structure
--
-- One-time content move, like 20261023200049_help_flow_guide: gives Comms its own sidebar group. The products/comms
-- draft is re-homed as the Comms Overview (no whole-app preview: comms isn't in SANDBOX_APP_IDS), and each area in
-- Comms's project sidebar starts as a draft outline, in the sidebar's order. The page migrations that follow
-- (20261024191801 to 20261024191850) fill each page in. Comms isn't deployed yet (available: false in
-- lib/org/product-apps.js), so every page stays a draft.
-- Written from a survey of C:\Pro\geiger-comms (components/internal/sidebar/sidebar_nav.jsx,
-- components/internal/screens/registry.jsx, geiger-ui.config.js). Sidebar entries that still render the
-- coming-soon screen (Phone, AI Agent, AI Performance, Proactive, Integrations and the hidden Settings and
-- Knowledge Base entries) get no page.
-- Later edits happen in Studio, so this must never re-run.

-- @up
insert into public.docs_nav_groups (title, slug, sort_order)
values ('Comms', 'comms', 35)
on conflict (slug) do update set
  title = excluded.title,
  sort_order = excluded.sort_order;

-- Comms Overview: re-home the products/comms draft, or create it on a database that never had one.
update public.docs_pages
set nav_group_id = (select id from public.docs_nav_groups where slug = 'comms'),
    slug = 'comms',
    title = 'Geiger Comms',
    nav_label = 'Overview',
    sort_order = 10
where slug = 'products/comms' and deleted_at is null;

insert into public.docs_pages (nav_group_id, slug, title, nav_label, description, status, sort_order)
select g.id, 'comms', 'Geiger Comms', 'Overview', 'Customer messaging and support.', 'draft', 10
from public.docs_nav_groups g
where g.slug = 'comms'
on conflict (slug) where deleted_at is null do nothing;

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>What Geiger Comms is for</li><li>Opening it from a project</li><li>Key concepts</li><li>Common workflows</li></ul>',
  10
from public.docs_pages p
where p.slug = 'comms' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;

-- Comms's areas, in its sidebar order: drafts with a writing outline, visible to editors in preview only.
insert into public.docs_pages (nav_group_id, slug, title, description, status, sort_order)
select g.id, v.slug, v.title, v.description, 'draft', v.sort_order
from (
  values
    ('comms/project-overview', 'Project overview', 'The project''s dashboard: conversation volume, response load and resolutions across every channel.', 20),
    ('comms/inbox', 'Inbox', 'Work customer conversations in your inbox, all conversations, mentions and saved views.', 30),
    ('comms/tickets', 'Tickets', 'Track customer, back-office and tracker tickets in one queue.', 40),
    ('comms/channels', 'Channels', 'Connect the channels customers reach you on, and send replies by email.', 50),
    ('comms/messenger', 'Messenger', 'Set up and install the Messenger chat widget on your site or app.', 60),
    ('comms/customers', 'Customers', 'Keep the people, companies and segments behind each conversation.', 70),
    ('comms/workflows', 'Workflows', 'Automate what happens when a conversation starts, a customer replies or a tag is added.', 80),
    ('comms/macros', 'Macros', 'Save canned replies, with optional actions, and use them from the inbox.', 90),
    ('comms/routing-and-slas', 'Routing rules & SLAs', 'Route new conversations to the right teammates and set response-time targets.', 100),
    ('comms/articles', 'Articles', 'Write, translate and publish help articles for your help centers and the Messenger.', 110),
    ('comms/help-centers', 'Help centers', 'Publish articles as help centers, organized into collections.', 120),
    ('comms/knowledge-gaps', 'Knowledge gaps', 'Find the questions your articles don''t answer, ranked by how often they come up.', 130),
    ('comms/reports', 'Reports', 'Analytics on volume, responsiveness, SLAs, satisfaction and teammate performance.', 140),
    ('comms/teammates', 'Teammates & roles', 'Invite teammates, organize groups and control what each role can do.', 150),
    ('comms/ai-providers', 'AI providers', 'Connect your own AI provider and choose which AI features Comms uses.', 160),
    ('comms/settings', 'Settings', 'Choose what your sidebar shows and set your business hours.', 170)
) as v(slug, title, description, sort_order)
cross join (select id from public.docs_nav_groups where slug = 'comms') g
on conflict (slug) where deleted_at is null do nothing;

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview', '<p><em>Draft outline. Replace before publishing.</em></p><ul>' || v.outline || '</ul>', 10
from (
  values
    ('comms/project-overview', '<li>Headline figures</li><li>Conversation trend and channel mix</li><li>Resolution and backlog</li><li>What needs attention</li>'),
    ('comms/inbox', '<li>Your Inbox, All Conversations and Mentions</li><li>The conversation list and filters</li><li>Replying and internal notes</li><li>Assigning, snoozing and closing</li><li>Bulk actions and merging</li><li>Copilot</li><li>Views</li>'),
    ('comms/tickets', '<li>Creating a ticket</li><li>Ticket types and states</li><li>The ticket list</li><li>Ticket details</li>'),
    ('comms/channels', '<li>The channel list</li><li>Connecting a channel</li><li>Email delivery</li><li>Disconnecting and deleting</li>'),
    ('comms/messenger', '<li>Setting up Messenger</li><li>Installing the widget</li><li>What customers see</li><li>Testing it in Comms</li>'),
    ('comms/customers', '<li>People</li><li>Person details and timeline</li><li>Companies</li><li>Segments</li><li>Importing from CSV</li>'),
    ('comms/workflows', '<li>Creating a workflow</li><li>Triggers, conditions and actions</li><li>The workflow builder</li><li>Workflow templates</li><li>Run history</li>'),
    ('comms/macros', '<li>Creating a macro</li><li>Variables</li><li>Actions</li><li>Using a macro in a conversation</li>'),
    ('comms/routing-and-slas', '<li>Routing rules</li><li>Round robin</li><li>SLA policies</li><li>SLA timers in the inbox</li>'),
    ('comms/articles', '<li>Creating an article</li><li>The editor</li><li>AI writing assistant</li><li>Translations</li><li>Publishing and history</li>'),
    ('comms/help-centers', '<li>Creating a help center</li><li>Collections</li><li>Appearance and settings</li><li>The default help center</li>'),
    ('comms/knowledge-gaps', '<li>How gaps are found</li><li>Reviewing a gap</li><li>Writing or linking an article</li><li>Dismissing a gap</li>'),
    ('comms/reports', '<li>Analytics</li><li>Filters and date ranges</li><li>Quality & CSAT</li>'),
    ('comms/teammates', '<li>Inviting teammates</li><li>Members and groups</li><li>Roles</li><li>The permissions matrix</li>'),
    ('comms/ai-providers', '<li>Connecting a provider</li><li>Default models</li><li>AI features and limits</li><li>Data sharing</li><li>Usage</li>'),
    ('comms/settings', '<li>Navigation</li><li>Business hours</li><li>Holidays</li>')
) as v(slug, outline)
join public.docs_pages p on p.slug = v.slug and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;

-- @down
-- Comms drafts go with their outline blocks (on delete cascade).
delete from public.docs_pages where slug like 'comms/%';

update public.docs_pages
set nav_group_id = (select id from public.docs_nav_groups where slug = 'products'),
    slug = 'products/comms',
    title = 'Geiger Comms',
    nav_label = 'Comms',
    description = 'Customer messaging and support.',
    preview = null,
    status = 'draft',
    published_at = null,
    sort_order = 90
where slug = 'comms' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'products/comms' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>What Geiger Comms is for</li><li>Opening it from a project</li><li>Key concepts</li><li>Common workflows</li></ul>',
  10
from public.docs_pages p
where p.slug = 'products/comms' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;

delete from public.docs_nav_groups where slug = 'comms';
