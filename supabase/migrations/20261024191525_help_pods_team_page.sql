-- Help pods team page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the pods/team draft outline (from
-- 20261024191500_help_pods_structure) with the Team & access guide and publishes it. Granting product roles on
-- Settings → Team & Access is left out on purpose: the dialog needs a raw user ID that Pods never shows, and the
-- workspace only reads the inherited organization role (context/rbac-context.jsx), so a grant doesn't change what
-- the grantee sees. Other pages link to the #roles anchor. No Pods showcases exist, so the page embeds none.
-- Written from a survey of C:\Pro\geiger-pods (geiger-rbac.config.js, lib/workspace/access.mjs, context/rbac-context.jsx,
-- lib/control/authz.mjs, components/internal/sidebar/sidebar_nav.jsx, components/internal/screens/registry.jsx,
-- components/internal/screens/settings/team_access.jsx, settings/team/*, settings/roles_permissions.jsx,
-- lib/supabase/projects.js) and of C:\Pro\geiger-dash (app/org/organizations-client.jsx, the public."Role" enum).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Team & access',
    description = 'Who can work on a project in Pods, how each person''s role comes from their organization role, and what Owners, Admins, Managers and Members can do.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'pods/team' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'pods/team' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.sort_order
from (
  values
    (
      'who-can-open-a-project',
      'Basics',
      'Who can open a project in Pods',
      $html$<p>Pods uses your Geiger account and your organization's projects. You can open a project in Pods when it belongs to an organization you're a member of, or when you created it as a personal project.</p><p>There's nobody to invite inside Pods. To give someone access, add them to the organization in Dash, and to change what they can do, change their organization role there. <strong>Settings → General → Project</strong> shows your own <strong>Inherited role</strong>, and <strong>Manage in Geiger</strong> opens the organization in Dash.</p>$html$,
      '[]',
      10
    ),
    (
      'roles',
      'Concepts',
      'Roles in Pods',
      $html$<p>Each person has one of four roles in Pods, taken from their role in the organization that owns the project:</p><ul><li><strong>Owner</strong>: the organization's Owner, or the creator of a personal project.</li><li><strong>Admin</strong>: organization members whose role is Admin.</li><li><strong>Manager</strong>: organization members whose role is Manager.</li><li><strong>Member</strong>: everyone else in the organization, whatever their role there, such as User, Leader, Technical Officer or Financial Officer.</li></ul><p>A change to someone's organization role changes their Pods role the next time Pods loads the project. Every role sees every entry in the sidebar; what differs is what each one can change or open, as <a href="/help/pods/team#what-each-role-can-do">What each role can do</a> describes.</p>$html$,
      '[]',
      20
    ),
    (
      'what-each-role-can-do',
      'Concepts',
      'What each role can do',
      $html$<ul><li><strong>Owner</strong>: everything in Pods.</li><li><strong>Admin</strong>: everything an Owner can do, except managing product role grants.</li><li><strong>Manager</strong>: builds and releases APIs without the destructive or credential-revealing actions. A Manager can edit resources, routes, methods, integrations, models, authorizers, gateway responses and docs; deploy, edit stages, roll back, flush caches and run test calls; manage API keys (but not reveal their values) and usage plans; read logs, including request and response bodies; and create and edit developer portals (but not publish them). A Manager can't create, edit, delete, import or export APIs, manage secrets, the firewall, domains, connectors, alarms or log exports, generate SDKs, publish portals, change project settings or manage access tokens.</li><li><strong>Member</strong>: read-only. A Member can browse the project and read the logs, but can't change anything, and doesn't see request and response bodies.</li></ul><p>When a role can't use a screen or an action, Pods hides the button or shows "Access unavailable" in its place.</p>$html$,
      '[]',
      30
    ),
    (
      'roles-and-permissions',
      'Roles & Permissions',
      'The Roles & Permissions screen',
      $html$<p><strong>Settings → Roles & Permissions</strong> shows what each role can do, permission by permission. It's read-only: roles can't be created or edited there.</p><ul><li><strong>Roles</strong>: each role with its type (System or Custom), key, how many people hold it and how much of Pods it covers. Filter by <strong>Type</strong> or search. <strong>View permissions</strong> in a role's <strong>⋯</strong> menu lists every permission it has.</li><li><strong>Permission matrix</strong>: every permission against every role. Filter by <strong>Group</strong>, such as APIs, Build, Release, Consumers, Security, Network, Operations, Distribution and Administration, or search.</li></ul><p>The figures across the top count the roles, how many are System and Custom, and the permissions.</p>$html$,
      '[]',
      40
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"Settings","label":"Project settings","href":"/help/pods/settings"},{"icon":"Network","label":"APIs","href":"/help/pods/apis"},{"icon":"Plug","label":"Geiger Pods","href":"/help/pods"}]',
      50
    )
) as v(anchor_id, eyebrow, title, content, links, sort_order)
cross join (select id from public.docs_pages where slug = 'pods/team' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Team & access',
    description = 'See who can work on the project in Pods, what each role allows, and grant roles to members.',
    status = 'draft',
    published_at = null
where slug = 'pods/team' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'pods/team' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Team members</li><li>Roles</li><li>Granting a role</li><li>Custom roles and permissions</li></ul>',
  10
from public.docs_pages p
where p.slug = 'pods/team' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
