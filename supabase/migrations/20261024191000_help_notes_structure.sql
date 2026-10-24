-- Help notes structure
--
-- One-time content move, like 20261023200049_help_flow_guide: gives Notes its own sidebar group (sort_order 26, after
-- Flow) and re-homes the products/notes draft as the Notes Overview at /help/notes, with the /notes/playground hero.
-- Each Notes area starts as a draft outline; the page migrations that follow (20261024191010 to 20261024191017) fill
-- them in, and 20261024191030 writes and publishes the Overview.
-- Written from a survey of C:\Pro\geiger-notes (components/internal/layout/Topbar.jsx, components/internal/layout/sidebar/*,
-- lib/settings/tools.js, lib/settings/defaults.js, components/internal/nodes/registry.js, app/project/[projectId]/page.js).
-- Later edits happen in Studio, so this must never re-run.

-- @up
insert into public.docs_nav_groups (title, slug, sort_order)
values ('Notes', 'notes', 26)
on conflict (slug) do update set
  title = excluded.title,
  sort_order = excluded.sort_order;

-- Notes Overview: re-home the products/notes draft, or create it on a database that never had one.
update public.docs_pages
set nav_group_id = (select id from public.docs_nav_groups where slug = 'notes'),
    slug = 'notes',
    nav_label = 'Overview',
    preview = 'notes',
    sort_order = 10
where slug = 'products/notes' and deleted_at is null;

insert into public.docs_pages (nav_group_id, slug, title, nav_label, description, preview, status, sort_order)
select g.id, 'notes', 'Geiger Notes', 'Overview', 'Docs and knowledge.', 'notes', 'draft', 10
from public.docs_nav_groups g
where g.slug = 'notes'
on conflict (slug) where deleted_at is null do nothing;

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>What Geiger Notes is for</li><li>Opening it from a project</li><li>Key concepts</li><li>Common workflows</li></ul>',
  10
from public.docs_pages p
where p.slug = 'notes' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;

-- Notes areas: drafts with a writing outline, visible to editors in preview only.
insert into public.docs_pages (nav_group_id, slug, title, description, status, sort_order)
select g.id, v.slug, v.title, v.description, 'draft', v.sort_order
from (
  values
    ('notes/boards', 'Boards', 'Open your boards, move around the canvas, add and connect nodes, nest boards inside boards, and control who can open them.', 20),
    ('notes/nodes', 'Nodes', 'Write notes, to-do lists and tables, add images, files, calendars and clocks, and style any node from the Node Settings panel.', 30),
    ('notes/more-tools', 'More tools', 'Add embeds, media, code, timers, polls, charts, mind maps, Mermaid diagrams, formulas, the AI assistant and mirrors to a board.', 40),
    ('notes/documents', 'Documents', 'Write long-form documents that live on a board, and format them in the document editor.', 50),
    ('notes/sketches', 'Sketches', 'Draw freehand sketches, link them to boards and documents, push them onto a board, and sketch together.', 60),
    ('notes/live-sessions', 'Live sessions', 'Start a live session on a board, let people join by code, manage their roles, and merge the session back into your board.', 70),
    ('notes/meetings', 'Meetings & huddles', 'Start or join a video meeting from any board, and add a huddle node to meet around part of the board.', 80),
    ('notes/settings', 'Settings', 'Set how the canvas behaves and looks, the default style for new connections and nodes, which tools your toolbar shows, and your account.', 90)
) as v(slug, title, description, sort_order)
cross join (select id from public.docs_nav_groups where slug = 'notes') g
on conflict (slug) where deleted_at is null do nothing;

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview', '<p><em>Draft outline. Replace before publishing.</em></p><ul>' || v.outline || '</ul>', 10
from (
  values
    ('notes/boards', '<li>Opening your boards</li><li>Moving around the canvas</li><li>Adding nodes from the toolbar</li><li>Connecting nodes</li><li>Boards inside boards</li><li>Renaming and downloading a board</li><li>Board access and access keys</li><li>Saving and syncing</li><li>Recently deleted</li><li>Keyboard shortcuts</li>'),
    ('notes/nodes', '<li>Selecting and editing a node</li><li>The Node Settings panel</li><li>Notes and text</li><li>To-do lists</li><li>Tables and columns</li><li>Comments and links</li><li>Images and files</li><li>Calendars and clocks</li><li>Shapes and stickers</li>'),
    ('notes/more-tools', '<li>Turning on more tools</li><li>Embeds and media</li><li>Code</li><li>Timers, polls and progress</li><li>Charts and formulas</li><li>People and palettes</li><li>Mind maps and Mermaid diagrams</li><li>AI assistant</li><li>Mirrors</li>'),
    ('notes/documents', '<li>Creating a document</li><li>Writing and formatting</li><li>Opening a document from a sketch</li>'),
    ('notes/sketches', '<li>Creating a sketch</li><li>Drawing in the sketch editor</li><li>Linking elements to boards and documents</li><li>Pushing a sketch to a board</li><li>Sketching together</li><li>Downloading a sketch</li>'),
    ('notes/live-sessions', '<li>Starting a session</li><li>Joining by code</li><li>Members and roles</li><li>Host controls</li><li>Following and presence</li><li>Ending a session</li><li>Merging a session into your board</li>'),
    ('notes/meetings', '<li>Starting a meeting</li><li>Joining by code</li><li>The meeting stage</li><li>Host tools</li><li>Huddle nodes</li>'),
    ('notes/settings', '<li>Opening settings</li><li>General</li><li>Canvas and board appearance</li><li>Defaults: connections, node style and toolbar</li><li>Account</li>')
) as v(slug, outline)
join public.docs_pages p on p.slug = v.slug and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;

-- @down
-- Notes drafts go with their outline blocks (on delete cascade).
delete from public.docs_pages
where slug in ('notes/boards', 'notes/nodes', 'notes/more-tools', 'notes/documents', 'notes/sketches',
               'notes/live-sessions', 'notes/meetings', 'notes/settings')
  and deleted_at is null;

update public.docs_pages
set nav_group_id = (select id from public.docs_nav_groups where slug = 'products'),
    slug = 'products/notes',
    title = 'Geiger Notes',
    nav_label = 'Notes',
    description = 'Docs and knowledge.',
    preview = null,
    status = 'draft',
    published_at = null,
    sort_order = 20
where slug = 'notes' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'products/notes' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>What Geiger Notes is for</li><li>Opening it from a project</li><li>Key concepts</li><li>Common workflows</li></ul>',
  10
from public.docs_pages p
where p.slug = 'products/notes' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;

delete from public.docs_nav_groups where slug = 'notes';
