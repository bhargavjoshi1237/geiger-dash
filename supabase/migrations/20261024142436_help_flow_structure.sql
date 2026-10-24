-- Help flow structure
--
-- One-time content move, like 20261023200049_help_flow_guide: gives every area in Flow's project sidebar a page.
-- Adds draft outlines for Project overview, Assets, Logs, Vault & externals, Security and Add-ons, narrows
-- flow/team to Team & resources (Vault and Security get their own pages), and re-sorts the Flow group to follow
-- Flow's sidebar order. The page migrations that follow (20261024142437 to 20261024142451) fill each page in.
-- Written from a survey of C:\Pro\geiger-flow (components/internal/sidebar/projects/sidebar_data.js, addons/*/manifest.js).
-- Later edits happen in Studio, so this must never re-run.

-- @up
-- Flow's sidebar order: Overview, Issues, Tasks, Work Queue, Grounding, Planning, Projections, Milestones, Goals,
-- Reporting, Objectives, Assets, Logs, Team, Resource Allocation, Vault, Externals, Security, Settings.
update public.docs_pages p
set sort_order = v.sort_order
from (
  values
    ('flow/issues', 30),
    ('flow/tasks', 40),
    ('flow/grounding', 50),
    ('flow/planning', 60),
    ('flow/projections', 70),
    ('flow/goals', 80),
    ('flow/reporting', 90),
    ('flow/team', 120),
    ('flow/settings', 150)
) as v(slug, sort_order)
where p.slug = v.slug and p.deleted_at is null;

update public.docs_pages
set title = 'Team & resources',
    description = 'Invite members, set their roles, and plan who works on what with resource allocation.'
where slug = 'flow/team' and deleted_at is null;

update public.docs_content_blocks
set content = '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Inviting members</li><li>Roles</li><li>Resource allocation</li></ul>'
where anchor_id = 'overview'
  and page_id in (select id from public.docs_pages where slug = 'flow/team' and deleted_at is null);

insert into public.docs_pages (nav_group_id, slug, title, description, status, sort_order)
select g.id, v.slug, v.title, v.description, 'draft', v.sort_order
from (
  values
    ('flow/project-overview', 'Project overview', 'The project''s home screen: its details, progress and what needs attention.', 20),
    ('flow/assets', 'Assets', 'Upload, preview and organize the project''s files and media.', 100),
    ('flow/logs', 'Logs', 'The project''s activity log: who changed what, and when.', 110),
    ('flow/vault', 'Vault & externals', 'Keep shared credentials in the vault and link the external services the project uses.', 130),
    ('flow/security', 'Security', 'Security policies, vulnerabilities and access events for the project.', 140),
    ('flow/add-ons', 'Add-ons', 'Extra project screens you turn on per project, from System Architecture to SQL and Forms.', 160)
) as v(slug, title, description, sort_order)
cross join (select id from public.docs_nav_groups where slug = 'flow') g
on conflict (slug) where deleted_at is null do nothing;

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview', '<p><em>Draft outline. Replace before publishing.</em></p><ul>' || v.outline || '</ul>', 10
from (
  values
    ('flow/project-overview', '<li>Project details</li><li>Progress and activity</li><li>Jumping to issues and the schedule</li>'),
    ('flow/assets', '<li>Uploading files</li><li>Previewing and downloading</li><li>Storage</li>'),
    ('flow/logs', '<li>Reading the activity log</li><li>Filtering and searching</li>'),
    ('flow/vault', '<li>Adding vault items</li><li>Access control</li><li>External links</li>'),
    ('flow/security', '<li>Policies</li><li>Vulnerabilities</li><li>Access events</li>'),
    ('flow/add-ons', '<li>Turning add-ons on</li><li>System Architecture</li><li>SQL Explorer</li><li>Forms</li><li>Credited Resources</li><li>Project add-ons: risks, decisions and more</li>')
) as v(slug, outline)
join public.docs_pages p on p.slug = v.slug and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;

-- @down
-- New drafts go with their outline blocks (on delete cascade).
delete from public.docs_pages
where slug in ('flow/project-overview', 'flow/assets', 'flow/logs', 'flow/vault', 'flow/security', 'flow/add-ons');

update public.docs_content_blocks
set content = '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Inviting members</li><li>Roles: Admin, Member, Viewer</li><li>Vault secrets</li><li>Security policies, vulnerabilities and access events</li></ul>'
where anchor_id = 'overview'
  and page_id in (select id from public.docs_pages where slug = 'flow/team' and deleted_at is null);

update public.docs_pages
set title = 'Team & access',
    description = 'Invite members, set roles, and manage the vault and security.'
where slug = 'flow/team' and deleted_at is null;

update public.docs_pages p
set sort_order = v.sort_order
from (
  values
    ('flow/issues', 20),
    ('flow/tasks', 30),
    ('flow/planning', 40),
    ('flow/goals', 50),
    ('flow/projections', 60),
    ('flow/grounding', 70),
    ('flow/reporting', 80),
    ('flow/team', 90),
    ('flow/settings', 100)
) as v(slug, sort_order)
where p.slug = v.slug and p.deleted_at is null;
