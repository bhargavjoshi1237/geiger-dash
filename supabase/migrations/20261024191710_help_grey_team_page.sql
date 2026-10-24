-- Help grey team page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the grey/team draft outline
-- (20261024191700_help_grey_structure) with the full Team & roles guide and publishes it.
-- Invitations are described only as far as they reliably work: grey.rbac_ensure_membership prefers the
-- organization role over an invite's role, project access needs organization membership, no email is sent and the
-- invite message isn't stored. The 25-seat limit is a placeholder constant (DEFAULT_SEAT_LIMIT), so it's left out.
-- Written from a survey of C:\Pro\geiger-grey (components/internal/screens/settings/team_members.jsx, settings/team/*,
-- settings/roles_permissions.jsx, settings/constants.js, lib/supabase/team.js, lib/supabase/rbac.js, lib/rbac.js,
-- context/rbac-context.js, lib/hooks/use-visible-nav.js, geiger-rbac.config.js,
-- supabase/migrations/20261010120000_grey_core.sql, 20261010120100_adopt_rbac.sql, 20261010120200_team.sql).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Team & roles',
    description = 'Who can open a Grey project and what each role can do: manage members, suspend or remove them, and create roles with their own permissions.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'grey/team' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'grey/team' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.sort_order
from (
  values
    (
      'who-can-open-a-project',
      'Basics',
      'Who can open a Grey project',
      $html$<p>Everyone in a project's organization can open it in Grey. The first time someone opens it, Grey gives them a role matched to their organization role:</p><ul><li>Organization Owner: <strong>Owner</strong>.</li><li>Organization Manager: <strong>Manager</strong>.</li><li>Any other organization role: <strong>Member</strong>.</li></ul><p>Nobody becomes an Admin automatically; give someone that role in Grey.</p><p>To give someone access, add them to your organization in Dash. Roles in Grey are per project, so the same person can be an Admin in one project and a Viewer in another. Change a role in <strong>Settings → Team & Members</strong>; it doesn't change their organization role.</p><p>Someone you remove from a project doesn't get access back by opening it again.</p>$html$,
      '[]',
      10
    ),
    (
      'built-in-roles',
      'Concepts',
      'Built-in roles',
      $html$<p>Every project has five built-in roles:</p><ul><li><strong>Owner</strong>: everything, now and in the future. Its permissions can't be edited.</li><li><strong>Admin</strong>: every permission, including the team, roles, model providers, API keys, MCP servers, widgets, usage and settings.</li><li><strong>Manager</strong>: every screen, plus managing knowledge bases, sources, ingestion, presets, the knowledge graph and its ontology, managing and publishing pipelines, evaluations, data exports and inviting people. Not model providers, delivery, usage settings, roles or project settings.</li><li><strong>Member</strong>: every screen except Settings, plus uploading sources, running ingestion, editing the knowledge graph and managing evaluations.</li><li><strong>Viewer</strong>: read-only access to Overview, Knowledge Bases, Knowledge Graph and Playground. A Viewer can chat in the Playground.</li></ul><p>Admins and Owners can edit the built-in roles' permissions (except Owner's) and create custom roles. A project always keeps at least one Owner: Grey won't change, suspend or remove its last one.</p>$html$,
      '[]',
      20
    ),
    (
      'how-permissions-work',
      'Concepts',
      'How permissions work',
      $html$<p>Permissions come in two kinds, grouped on the <strong>Roles & Permissions</strong> screen.</p><ul><li><strong>Workspace views</strong>: one per sidebar section, from Overview to Settings. Without a section's view permission, the section and everything under it disappears from your sidebar and from search.</li><li><strong>Actions</strong>: what you can change, such as <strong>Manage knowledge bases</strong>, <strong>Upload sources</strong> or <strong>Publish pipelines</strong>. Without one, the matching buttons and menu items are disabled, with a note on hover saying why, or don't appear.</li></ul><p>Each Grey guide names the permission an action needs. Permissions apply to the whole project, not to single knowledge bases or pipelines.</p>$html$,
      '[]',
      30
    ),
    (
      'member-list',
      'Team & Members',
      'The member list',
      $html$<p><strong>Settings → Team & Members</strong> lists who's in the project. You need the Settings view permission, which Owners, Admins and Managers have. The tabs are <strong>Members</strong>, <strong>Invitations</strong>, <strong>Groups</strong> and <strong>Activity</strong>.</p><p>On <strong>Members</strong>, each row shows the person's name and email, role, groups, status (Active or Suspended), when they were last active and when they joined. Filter by role, status and group, or search by name or email.</p><p>Each row's <strong>⋯</strong> menu has <strong>Manage</strong>, which opens the member's panel, plus <strong>Suspend</strong> or <strong>Reactivate</strong> and <strong>Remove</strong> if you can assign roles. You can also change a role from the role badge in the row.</p>$html$,
      '[]',
      40
    ),
    (
      'managing-a-member',
      'Team & Members',
      'Changing a member''s role or access',
      $html$<p>Choose <strong>Manage</strong> on a member to open their panel.</p><ul><li><strong>Role</strong>: pick another role. It applies straight away, and the panel lists what the new role can do.</li><li><strong>Groups</strong>: select the groups they belong to.</li><li><strong>Suspend</strong>: pauses their access to the project without removing them. <strong>Reactivate</strong> restores it.</li><li><strong>Remove</strong>: asks you to confirm, then takes them out of the project. They lose access immediately.</li></ul><p>These need the <strong>Assign roles to members</strong> permission, which Owners and Admins have. Grey refuses to change the role of, suspend or remove the project's last Owner: give someone else the Owner role first.</p>$html$,
      '[]',
      50
    ),
    (
      'invitations-groups-activity',
      'Team & Members',
      'Invitations, groups and activity',
      $html$<ul><li><strong>Invitations</strong>: <strong>Invite people</strong> records a pending invitation for each address in <strong>Email addresses</strong> (separate them with commas or new lines), with a <strong>Role</strong> (Member to start with) and an optional <strong>Group</strong>. Grey doesn't email anyone, and only people in the project's organization can open the project. Pending invitations are listed on the tab, each with <strong>Revoke</strong>. Inviting needs the <strong>Invite team members</strong> permission.</li><li><strong>Groups</strong>: sub-teams for organizing members. <strong>New Group</strong> takes a <strong>Name</strong> and a <strong>Description</strong>. Groups don't change what anyone can do.</li><li><strong>Activity</strong>: who invited, removed, suspended or reactivated whom, who changed someone's role or groups, and who created groups or created, edited and deleted roles. Nobody can edit it.</li></ul>$html$,
      '[]',
      60
    ),
    (
      'roles-and-permissions',
      'Roles & Permissions',
      'Creating and editing roles',
      $html$<p><strong>Settings → Roles & Permissions</strong> has two tabs. <strong>Roles</strong> lists every role as <strong>System</strong> or <strong>Custom</strong>, with how many people hold it. <strong>Permission matrix</strong> shows every permission against every role: click a cell to grant or remove it.</p><p>To create a role, choose <strong>Create role</strong>. Give it a <strong>Name</strong> and optional <strong>Description</strong>, and under <strong>Start from</strong> pick an existing role to copy its permissions, or <strong>Blank (no permissions)</strong>.</p><p>Click a role to open its panel, where its permissions are grouped with a switch each, and <strong>Select all</strong> or <strong>Clear</strong> for a whole group. Changes save as you make them. A role's <strong>⋯</strong> menu has <strong>Edit permissions</strong>, <strong>Rename</strong>, <strong>Duplicate</strong>, <strong>View in Team</strong> and, for custom roles, <strong>Delete</strong>. Deleting asks you to confirm, and anyone holding the role loses the access it gave them. Owner can't be renamed or edited, and built-in roles can't be deleted.</p><p>Changing roles needs the <strong>Create and edit roles</strong> permission, which Owners and Admins have. Everyone else sees the roles read-only.</p>$html$,
      '[]',
      70
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"Settings","label":"Project settings","href":"/help/grey/settings"},{"icon":"LayoutDashboard","label":"Project overview","href":"/help/grey/project-overview"},{"icon":"BrainCircuit","label":"Geiger Grey","href":"/help/grey"}]',
      80
    )
) as v(anchor_id, eyebrow, title, content, links, sort_order)
cross join (select id from public.docs_pages where slug = 'grey/team' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Team & roles',
    nav_label = null,
    description = 'Invite members to a Grey project, assign roles and decide what each role can do.',
    status = 'draft',
    published_at = null
where slug = 'grey/team' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'grey/team' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Inviting members</li><li>Roles and permissions</li><li>Groups and activity</li></ul>',
  10
from public.docs_pages p
where p.slug = 'grey/team' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
