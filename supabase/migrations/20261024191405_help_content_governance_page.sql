-- Help content governance page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the content/governance draft outline with
-- the full Governance guide and publishes it. Content has no section showcases yet, so the page is text only.
-- Written from a survey of C:\Pro\geiger-content (components/internal/screens/governance/*, components/internal/screens/
-- operations_ui.jsx, geiger-rbac.config.js, lib/rbac.js, context/rbac-context.js, lib/supabase/{rbac,audit,consent}.js,
-- supabase/migrations/20261001081041_project_scoped_rls.sql, and the live content.can_access_project and
-- content.is_project_owner functions).
-- Left out: Content Policies and Retention Policies (their rules are stored, but nothing enforces or runs them), and the
-- Invite Members, View collections, View the asset library, Delete assets and Approve permissions' effects (nothing checks them).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Governance',
    description = 'Control who can do what in a Content project: give members roles, build custom roles from permissions, record consent and read the audit log.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'content/governance' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'content/governance' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, showcase, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.showcase, v.sort_order
from (
  values
    (
      'giving-a-member-a-role',
      'Basics',
      'Giving a member a role',
      $html$<p>Everyone in the project's organization can open the project in Content. The first time someone opens it, Content gives them a role: the person who created the project becomes Owner, and everyone else becomes Writer.</p><p>To change a member's role, choose <strong>Governance → Team & Members</strong> in the sidebar and pick a new role in the <strong>Role</strong> menu on their row. The change saves straight away, and Content confirms with "Role updated."</p><p>To give a role to someone who has signed up, choose <strong>Invite member</strong>, paste their <strong>User id</strong>, pick a <strong>Role</strong> and choose <strong>Send invite</strong>. Both fields are required. The member appears in the list straight away, and no email is sent.</p><p>Changing roles and inviting members need the Assign roles permission, which the Owner and Admin roles have.</p>$html$,
      '[]',
      null,
      10
    ),
    (
      'roles',
      'Concepts',
      'Roles and what they allow',
      $html$<p>A member's role decides which sidebar sections they see and what they can change. Every project starts with five roles:</p><ul><li><strong>Owner</strong>: full access to everything.</li><li><strong>Admin</strong>: every section. Admins can edit, publish and delete entries, manage content types, fields and blocks, manage delivery tokens and settings, and manage the team and its roles.</li><li><strong>Editor</strong>: every section. Editors can edit, publish and delete entries.</li><li><strong>Writer</strong>: the Overview, Content, Architecture and Editorial sections. Writers can create and edit entries that aren't Published or Scheduled.</li><li><strong>Viewer</strong>: the Overview and Intelligence sections, read only.</li></ul><p>Some changes only the Owner role can make by default: managing collections, uploading assets, and changing sites, data connections and project settings. Content checks permissions when it saves, so an action your role doesn't allow fails with an error even if its button shows. Custom roles can mix permissions differently.</p>$html$,
      '[]',
      null,
      20
    ),
    (
      'member-list',
      'Team & Members',
      'The member list',
      $html$<p><strong>Governance → Team & Members</strong> lists everyone who holds a role in the project. Each row shows the member's shortened user id and when they got the role, a <strong>Role</strong> menu, the scope (<strong>Whole project</strong>, or <strong>Narrowed</strong> for a grant limited to certain resources) and a status: Active, Invited or Suspended.</p><p>The figures across the top count <strong>Members</strong>, <strong>Active grants</strong>, <strong>Roles in use</strong> and <strong>Scoped grants</strong>. Search by user id or role name.</p><p>To remove someone's role, choose <strong>Revoke grant</strong> in their row's <strong>⋯</strong> menu, then <strong>Revoke</strong>. They lose that access at once, and Content never gives them a role again automatically, even when they open the project later.</p>$html$,
      '[]',
      null,
      30
    ),
    (
      'custom-roles',
      'Roles',
      'Creating a custom role',
      $html$<p>To create a role with your own mix of permissions, choose <strong>Governance → Roles</strong>, then <strong>Create role</strong>. Only the <strong>Name</strong> is required. Add an optional <strong>Description</strong>, select the permissions the role carries under <strong>Permissions</strong>, which counts how many are selected, and choose <strong>Create role</strong>.</p><p>The list shows each role's name, key and description, how many permissions it has (or Full access for Owner), whether it's a <strong>System</strong> or <strong>Custom</strong> role, and when it was last updated. The figures across the top count <strong>Total roles</strong>, <strong>System roles</strong>, <strong>Custom roles</strong> and the <strong>Permission keys</strong> in the catalog.</p><p>Each role's <strong>⋯</strong> menu has <strong>Edit</strong>, which opens the same form with <strong>Save role</strong>. Custom roles also have <strong>Delete</strong>, which asks you to confirm first; members who held the role keep any other roles they have. System roles can be edited but not deleted. Changing roles needs the Create and edit roles permission (Owner and Admin), and only an Owner can change a role with full access.</p>$html$,
      '[]',
      null,
      40
    ),
    (
      'permission-tester',
      'Permissions',
      'The permission catalog and tester',
      $html$<p><strong>Governance → Permissions</strong> lists every permission a role can carry, with its key, label and group. Filter by group, which starts on <strong>All groups</strong>, and search keys and labels. The figures across the top count <strong>Permission keys</strong>, <strong>View keys</strong> (which show sidebar sections), <strong>Operation keys</strong> (which allow actions) and <strong>Groups</strong>.</p><p>To check what someone can do, use the <strong>Permission tester</strong>: <strong>User id</strong> starts as your own, so change it to test someone else, pick a <strong>Permission</strong> and choose <strong>Evaluate</strong>. Content shows Allowed or Denied, the role that granted it and the permissions it matched. The tester only reads: it doesn't grant or change anything.</p>$html$,
      '[]',
      null,
      50
    ),
    (
      'permission-list',
      'Reference',
      'Permissions in Content',
      $html$<p>Each sidebar section has a view permission, named after the section, that shows it: Overview, Content, Architecture, Editorial, Publishing, Governance, Developers, Audiences, Personalization, Experiments, Recommendations, Intelligence and Settings. A member sees a section's screens when their role has its view permission.</p><p>These permissions allow actions:</p><ul><li><strong>Content</strong>: Edit an entry or page, Publish an entry or page, Approve entries and bulk-approve low-risk types, Delete an entry or page, View collections, Create, edit and delete collections, View the asset library, Upload assets, Delete assets</li><li><strong>Architecture</strong>: Manage content types, fields and blocks</li><li><strong>Developers</strong>: Create and revoke delivery tokens</li><li><strong>Team Control</strong>: Invite Members, Assign roles, Create and edit roles</li><li><strong>Administration</strong>: Manage billing, Manage settings, Edit fields restricted by content policies</li><li><strong>Audiences</strong>: Reveal sensitive trait values, Override a profile's consent state</li></ul><p>Each guide in the Content section of this Help Center names the permission an action needs.</p>$html$,
      '[]',
      null,
      60
    ),
    (
      'consent-and-privacy',
      'Consent & Privacy',
      'Recording consent',
      $html$<p><strong>Governance → Consent & Privacy</strong> records whether a profile, a person known to the project, agrees to their data being used. To record it, pick the <strong>Profile</strong> (the menu lists up to the 500 newest), the <strong>Purpose</strong> (Analytics or Personalization) and the <strong>Status</strong> (Granted, Denied or Pending), then choose <strong>Save consent</strong>. Only project owners can save consent.</p><p><strong>Recorded consent</strong> lists each profile's purposes, statuses and when they changed. A missing record doesn't count as granted personalization consent: only an explicit Granted makes a profile eligible for audience embeddings. <a href="/help/content/audiences">Audiences</a> covers profiles and the Consent State screen.</p>$html$,
      '[]',
      null,
      70
    ),
    (
      'audit-logs',
      'Audit Logs',
      'The audit log',
      $html$<p><strong>Governance → Audit Logs</strong> shows the latest 200 changes to entries, collections, assets and content slots. Each event shows when it happened, who made it (their shortened user id), the action (Create, Update, Delete or Publish), the kind of record and its shortened id, and up to three of the values that changed.</p><p>Filter by kind of record, which starts on <strong>All entities</strong>, and search actors, actions and records. The figures across the top count <strong>Total events</strong>, <strong>Creates</strong>, <strong>Updates</strong> and <strong>Deletes</strong>. The log can't be edited or cleared from Content.</p>$html$,
      '[]',
      null,
      80
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"Rss","label":"Geiger Content","href":"/help/content"},{"icon":"Library","label":"Content library","href":"/help/content/library"},{"icon":"FileText","label":"Editorial","href":"/help/content/editorial"},{"icon":"UsersRound","label":"Audiences","href":"/help/content/audiences"},{"icon":"CodeXml","label":"Developer tools","href":"/help/content/developers"},{"icon":"Settings","label":"Project settings","href":"/help/content/settings"}]',
      null,
      90
    )
) as v(anchor_id, eyebrow, title, content, links, showcase, sort_order)
cross join (select id from public.docs_pages where slug = 'content/governance' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Governance',
    description = 'Manage members, roles, permissions, content policies, consent, audit logs and retention.',
    status = 'draft',
    published_at = null
where slug = 'content/governance' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'content/governance' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Team and members</li><li>Roles</li><li>Permissions</li><li>Content Policies</li><li>Consent and privacy</li><li>Audit Logs</li><li>Retention Policies</li></ul>',
  10
from public.docs_pages p
where p.slug = 'content/governance' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
