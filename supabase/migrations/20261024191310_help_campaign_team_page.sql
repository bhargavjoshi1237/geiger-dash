-- Help campaign team page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the campaign/team draft outline from
-- 20261024191300_help_campaign_structure with the full Team & Roles guide and publishes it. Campaign has no component
-- routes yet, so no section carries a showcase. No "Related guides" row: the Campaign Overview is the only other
-- published Campaign page, so it's linked from the section text instead.
-- Written from a survey of C:\Pro\geiger-campaign (components/internal/screens/settings/team_roles_screen.jsx,
-- components/internal/screens/settings/team/*, lib/supabase/rbac.js, context/rbac-context.js, lib/rbac.js,
-- geiger-rbac.config.js, components/internal/sidebar/projects/project_sidebar.jsx,
-- app/project/[projectId]/[[...rest]]/page.js, components/internal/topbar/dialogue/profile_dropdown.jsx,
-- supabase/migrations/20261010172149_rbac_team_access.sql) and C:\Pro\geiger-dash (app/org/organizations-client.jsx
-- for the organization roles).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Team & Roles',
    description = 'Add people from your organization to a project in Campaign, set their roles, and choose which sections and team controls each role includes.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'campaign/team' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'campaign/team' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.sort_order
from (
  values
    (
      'adding-a-member',
      'Basics',
      'Adding a member',
      $html$<p>To give someone in your organization access to a project in Campaign, choose <strong>Settings → Team & Roles</strong> in the sidebar, then <strong>Add member</strong>. You need the <strong>Add members</strong> permission, which Owner, Admin and Manager have by default.</p><ol><li>Under <strong>Member</strong>, choose a teammate. The list holds the people in your organization who don't have a role in this project yet.</li><li>Under <strong>Role</strong>, pick their role. It starts at Member.</li><li>Choose <strong>Add member</strong>. It stays disabled until both are set.</li></ol><p>The person joins the member list straight away. Campaign doesn't email them. To add someone who isn't in your organization yet, invite them to the organization in Dash first. When everyone in the organization already has a role in the project, the dialog says Everyone is already here.</p>$html$,
      10
    ),
    (
      'how-members-get-a-role',
      'Concepts',
      'How members get their role',
      $html$<p>Everyone in your organization can open its projects in Campaign, and each person holds one role in each project. The first time someone opens a project in Campaign, Campaign gives them a role there based on their role in the organization:</p><ul><li>The organization's Owner becomes Owner.</li><li>A Manager becomes Manager.</li><li>Everyone else becomes Member.</li></ul><p>Someone you add with <strong>Add member</strong> before their first visit keeps the role you picked. Roles are set per project, so the same person can be an Admin in one project and a Viewer in another. The first visit to a project also sets up its five built-in roles.</p><p>A member you remove doesn't get a role back on their next visit. Add them again to give them access. <a href="/help/campaign#opening-campaign">Opening Campaign</a> covers how people get to a project.</p>$html$,
      20
    ),
    (
      'member-list',
      'Members',
      'The member list',
      $html$<p>The <strong>Members</strong> tab of <strong>Team & Roles</strong> lists everyone who holds a role in the project. The figures across the top count the project's <strong>Members</strong>, <strong>Owners</strong>, <strong>Roles</strong> and <strong>Custom roles</strong>.</p><p>Each row shows the member's name and email, their <strong>Role</strong>, and <strong>Member since</strong>, the date their role was granted. Your own row is marked (you). Members are listed by role, from Owner to Viewer and then custom roles, and by email within each role. Type in <strong>Search members</strong> to match names, emails and role names, and choose <strong>Clear search</strong> when nothing matches.</p><p>Only roles that include the Settings section can open Team & Roles: Owner, Admin and Manager by default. <strong>Security</strong> in the account menu opens it too.</p>$html$,
      30
    ),
    (
      'changing-a-role',
      'Members',
      'Changing a member''s role',
      $html$<p>To change someone's role, pick a new one in the <strong>Role</strong> menu on their row in the <strong>Members</strong> tab. The change saves straight away, and the menu offers every role in the project, Owner included. You need the <strong>Assign roles</strong> permission, which Owner, Admin and Manager have by default. Without it, roles show as labels you can't change.</p><p>You can't change your own role, or the role of the project's only Owner. If the only Owner needs a different role, give someone else the Owner role first. The new role takes effect for the person the next time they open the project.</p>$html$,
      40
    ),
    (
      'removing-a-member',
      'Members',
      'Removing a member',
      $html$<p>To remove someone from a project, open their row's <strong>⋯</strong> menu in the <strong>Members</strong> tab and choose <strong>Remove from project</strong>. Campaign removes them straight away, without asking. You need the <strong>Assign roles</strong> permission, and you can't remove yourself or the project's only Owner.</p><p>Removing someone takes away their access to the project in Campaign only. They stay in your organization, and other apps aren't affected. Campaign doesn't give them a role again when they next open the project: they see No access to this project until someone adds them back with <strong>Add member</strong>.</p>$html$,
      50
    ),
    (
      'built-in-roles',
      'Concepts',
      'Built-in roles',
      $html$<p>Every project in Campaign has five system roles. A role decides which sidebar sections its members see and whether they can manage the team.</p><ul><li><strong>Owner</strong>: every permission across the Geiger suite, including billing. By default it's the only role that sees <strong>Settings → Billing</strong>. Owner can't be edited.</li><li><strong>Admin</strong>: every section, plus adding members, assigning roles and editing roles. No billing.</li><li><strong>Manager</strong>: every section, plus adding members and assigning roles. Managers can't edit roles or see Billing.</li><li><strong>Member</strong>: Overview, Audience, Campaigns, Automations, Channels, Inbox, Content, Reporting and AI Assistant. Members don't see Settings, so they can't open Team & Roles.</li><li><strong>Viewer</strong>: Overview and Reporting.</li></ul><p>You can change every system role except Owner, but you can't delete one. Add your own roles alongside them with <strong>New role</strong>.</p><p>A project's roles are shared with the other Geiger apps that use roles. When a role also carries another app's permissions, the role editor says it's shared: renaming it renames it everywhere, and Campaign changes only Campaign's permissions.</p>$html$,
      60
    ),
    (
      'editing-a-role',
      'Roles',
      'Editing a role',
      $html$<p>To change what a role can do, open the <strong>Roles & Permissions</strong> tab of <strong>Team & Roles</strong> and click the role in the list. The list shows the system roles first, then custom roles, each with how many members hold it. The Owner role carries a lock.</p><p>The role's <strong>Name</strong>, <strong>Color</strong> and <strong>Description</strong> set how it appears in Team & Roles. The colors are Slate, Blue, Emerald, Amber, Violet and Red. The permission switches are grouped under Workspace views, Campaigns, Audience, Automations, Integrations, Team Control and Administration. <strong>Select all</strong> turns on a whole group, and once it's all on the button reads <strong>Clear all</strong>.</p><p>Nothing changes until you choose <strong>Save changes</strong>, and <strong>Discard</strong> puts back the saved version. The new permissions apply to everyone who holds the role. Your own sidebar updates as soon as you save, and other members get the change the next time they open the project.</p><p>Editing roles needs the <strong>Create and edit roles</strong> permission, which Owner and Admin have by default. Without it the editor is read-only, and each group shows how many of its permissions the role has, like 3/4.</p>$html$,
      70
    ),
    (
      'creating-a-role',
      'Roles',
      'Creating a role',
      $html$<p>To add a custom role, open the <strong>Roles & Permissions</strong> tab of <strong>Team & Roles</strong> and choose <strong>New role</strong>. Only the name is required: <strong>Create role</strong> stays disabled until there is one.</p><ul><li><strong>Name</strong> and <strong>Description</strong>: what the role is called and what it's for.</li><li><strong>Color</strong>: the color of its badge. It starts at Slate.</li><li><strong>Start from</strong>: <strong>No permissions</strong> (the default), or a copy of an existing role, such as <strong>Copy of Manager</strong>, to start with that role's Campaign permissions.</li></ul><p>The new role joins the end of the list. Click it to adjust its permissions, then give it to people from the <strong>Members</strong> tab. Creating a role needs the <strong>Create and edit roles</strong> permission, which Owner and Admin have by default.</p>$html$,
      80
    ),
    (
      'deleting-a-role',
      'Roles',
      'Deleting a role',
      $html$<p>To delete a custom role, click it in the <strong>Roles & Permissions</strong> tab and choose <strong>Delete role</strong>. Campaign deletes it straight away, without asking, and a deleted role can't be restored from Campaign. Deleting a role needs the <strong>Create and edit roles</strong> permission.</p><p><strong>Delete role</strong> is disabled, with the reason beside it, in three cases:</p><ul><li>It's a system role.</li><li>Members still hold it. Give them another role first.</li><li>Another Geiger app uses it.</li></ul>$html$,
      90
    ),
    (
      'permissions',
      'Reference',
      'Permissions that control access',
      $html$<p>These role permissions decide what people see in Campaign's sidebar and what they can do in Team & Roles. In the role editor, each switch also shows its permission key in small type, such as <code>campaign.team.invite</code>.</p><ul><li><strong>Workspace views</strong>: one switch for each sidebar section (Overview, Audience, Campaigns, Automations, Channels, Chat Automation, Broadcasts, Social, Communities, Ads, Creators, Transactional, Deliverability, CRM, Inbox, Acquisition, Commerce, Content, Reporting, AI Assistant, Data, Integrations and Settings). A section and all its screens appear only when its switch is on. Settings covers every Settings tab, Team & Roles included, except Billing.</li><li><strong>Add members</strong>: shows <strong>Add member</strong> in Team & Roles.</li><li><strong>Assign roles</strong>: changing members' roles and removing members.</li><li><strong>Create and edit roles</strong>: <strong>New role</strong>, and editing and deleting roles.</li><li><strong>Manage billing</strong>: adds <strong>Billing</strong> to the Settings tabs, for roles that also have the Settings section.</li></ul>$html$,
      100
    ),
    (
      'no-access-to-a-section',
      'Troubleshooting',
      'A section says No access',
      $html$<p>When you open a screen in a section your role doesn't include, Campaign shows a No access message with the section's name, such as No access to Team & Roles, instead of the screen. It happens when you follow a link to the section, or choose <strong>Settings</strong> or <strong>Security</strong> in the account menu while your role doesn't include Settings. The sidebar itself lists only the sections your role includes.</p><ol><li>Choose <strong>Go to Overview</strong> to get back, if your role includes Overview.</li><li>Ask someone who can edit roles (an Owner or Admin by default) to turn the section on for your role, or someone who can assign roles to give you a role that includes it.</li></ol>$html$,
      110
    ),
    (
      'no-access-to-this-project',
      'Troubleshooting',
      'No access to this project',
      $html$<p>When Campaign shows No access to this project, you don't hold a role in the project. You see it after someone removes you from the project in Team & Roles, because Campaign doesn't give a removed member a role again on its own.</p><p>To get back in, ask an Owner, Admin or Manager of the project to add you with <strong>Add member</strong> under <strong>Settings → Team & Roles</strong>. Your access returns the next time you open the project.</p>$html$,
      120
    )
) as v(anchor_id, eyebrow, title, content, sort_order)
cross join (select id from public.docs_pages where slug = 'campaign/team' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Team & Roles',
    description = 'Add people from your organization to a project in Campaign, set their roles, and choose what each role can see and do.',
    status = 'draft',
    published_at = null
where slug = 'campaign/team' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'campaign/team' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Adding a member</li><li>How members get their role</li><li>The member list</li><li>Changing a role and removing a member</li><li>Built-in roles</li><li>Editing, creating and deleting roles</li><li>Permissions</li><li>No access messages</li></ul>',
  10
from public.docs_pages p
where p.slug = 'campaign/team' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
