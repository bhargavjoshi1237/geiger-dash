-- Help campaign structure
--
-- One-time content move, like 20261024142436_help_flow_structure: gives Campaign its own sidebar group (sort_order 29)
-- and re-homes the products/campaign draft as the Campaign Overview (nav_label Overview, the /campaign/playground hero),
-- still a draft with its outline. Adds campaign/team (Team & Roles) as a draft outline. The page migrations that follow
-- fill both in: 20261024191310 (Team & Roles), then 20261024191320 (Overview).
-- Team & Roles sorts at 230, after the slots Campaign's other sidebar sections would take (Audience 20 to Integrations 220),
-- because Settings is last in Campaign's sidebar.
-- Written from a survey of C:\Pro\geiger-campaign (components/internal/sidebar/projects/sidebar_data.js,
-- components/internal/screens/screen_registry.js, components/internal/screens/settings/team_roles_screen.jsx).
-- Later edits happen in Studio, so this must never re-run.

-- @up
insert into public.docs_nav_groups (title, slug, sort_order)
values ('Campaign', 'campaign', 29)
on conflict (slug) do update set
  title = excluded.title,
  sort_order = excluded.sort_order;

-- Campaign Overview: re-home the products/campaign draft, or create it on a database that never had one.
update public.docs_pages
set nav_group_id = (select id from public.docs_nav_groups where slug = 'campaign'),
    slug = 'campaign',
    title = 'Geiger Campaign',
    nav_label = 'Overview',
    preview = 'campaign',
    sort_order = 10
where slug = 'products/campaign' and deleted_at is null;

insert into public.docs_pages (nav_group_id, slug, title, nav_label, description, preview, status, sort_order)
select g.id, 'campaign', 'Geiger Campaign', 'Overview', 'Campaign planning and delivery.', 'campaign', 'draft', 10
from public.docs_nav_groups g
where g.slug = 'campaign'
on conflict (slug) where deleted_at is null do nothing;

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>What Geiger Campaign is for</li><li>Opening it from a project</li><li>Key concepts</li><li>Common workflows</li></ul>',
  10
from public.docs_pages p
where p.slug = 'campaign' and p.deleted_at is null
  and not exists (select 1 from public.docs_content_blocks b where b.page_id = p.id);

-- Team & Roles: a draft with its writing outline, visible to editors in preview only.
insert into public.docs_pages (nav_group_id, slug, title, description, status, sort_order)
select g.id, 'campaign/team', 'Team & Roles',
  'Add people from your organization to a project in Campaign, set their roles, and choose what each role can see and do.',
  'draft', 230
from public.docs_nav_groups g
where g.slug = 'campaign'
on conflict (slug) where deleted_at is null do nothing;

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Adding a member</li><li>How members get their role</li><li>The member list</li><li>Changing a role and removing a member</li><li>Built-in roles</li><li>Editing, creating and deleting roles</li><li>Permissions</li><li>No access messages</li></ul>',
  10
from public.docs_pages p
where p.slug = 'campaign/team' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;

-- @down
-- The Team & Roles draft goes with its outline block (on delete cascade).
delete from public.docs_pages where slug = 'campaign/team' and deleted_at is null;

-- Restores products/campaign exactly as 20261023112957_help_center_structure left it (never edited in Studio).
update public.docs_pages
set nav_group_id = (select id from public.docs_nav_groups where slug = 'products'),
    slug = 'products/campaign',
    title = 'Geiger Campaign',
    nav_label = 'Campaign',
    description = 'Campaign planning and delivery.',
    preview = null,
    status = 'draft',
    published_at = null,
    sort_order = 80
where slug = 'campaign' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'products/campaign' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>What Geiger Campaign is for</li><li>Opening it from a project</li><li>Key concepts</li><li>Common workflows</li></ul>',
  10
from public.docs_pages p
where p.slug = 'products/campaign' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;

-- Pages cascade with their group, so only drop it once it's empty.
delete from public.docs_nav_groups g
where g.slug = 'campaign'
  and not exists (select 1 from public.docs_pages p where p.nav_group_id = g.id);
