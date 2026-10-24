-- Help core concepts page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the core-concepts draft outline (created by
-- 20261023112957_help_center_structure) with the Core concepts page and publishes it. It explains how Dash, the apps,
-- organizations, members, projects, plans, add-ons and accounts relate, and links each one to the guide that acts on it.
-- No procedures live here.
-- Left out on purpose: Comms, Office and Docs (available: false in lib/org/product-apps.js, so they can't be added to a
-- project), the free trial (it records no apps, so nothing unlocks) and seat limits (not enforced anywhere).
-- Written from a survey of C:\Pro\geiger-dash (lib/org/product-apps.js, lib/org/membership.js, lib/product-routes.mjs,
-- lib/billing/entitlements.js, lib/billing/store.js, app/org/actions.js, app/org/organizations-client.jsx,
-- app/org/[ORGID]/*, app/onboarding/*, utils/supabase/middleware.js,
-- supabase/migrations/20260629212508_create_organization_rpc.sql) and the Workspace guides' surveys named in their own
-- migration headers (20261024192000 to 20261024192035).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Core concepts',
    description = 'How Geiger is organized: organizations hold members, a plan and projects, and each project opens in the apps its organization''s plan includes.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'core-concepts' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'core-concepts' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, showcase, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.showcase, v.sort_order
from (
  values
    (
      'dash-and-the-apps',
      'Suite',
      'Dash and the apps',
      $html$<p>Geiger is a suite of apps that share one account and one set of organizations. Dash is its hub: it's where you manage organizations, members, projects, billing and your profile, and where you open each project in its apps. The apps you can add to a project are Campaign, Flow, Events, Assets, Forms, Grey, Content, Pods, Notes and Property.</p><p>Each app runs on its own, at its own path on the same site as Dash, such as <code>/flow</code>, and the same account signs you in to all of them. The work you do in an app belongs to a project, and every project belongs to an organization.</p>$html$,
      '[]',
      null,
      10
    ),
    (
      'organizations',
      'Organizations',
      'Organizations',
      $html$<p>An organization is the top-level container in Geiger. It holds its members, its projects, its plan and its add-ons. Each organization is separate: belonging to one, or owning it, gives you nothing in another. You can belong to as many organizations as you like, and the Organizations page in Dash lists them all.</p><p>The person who creates an organization is its owner. Only the owner can open its settings, where they change its icon, invite and remove members, set roles and set up its add-ons. The <a href="/help/workspace/organizations">Organizations</a> guide covers creating, joining and managing one.</p>$html$,
      '[]',
      null,
      20
    ),
    (
      'members-and-roles',
      'Members',
      'Members and roles',
      $html$<p>A member is a person in an organization. People join when they accept an email invite from the owner, paste the organization's ID, or sign in through the organization's SSO. Every member sees all of the organization's projects, can create, edit and delete them, and can buy or upgrade the organization's plan.</p><p>Each member also has a role: Manager, User, Leader, Technical Officer or Financial Officer. In Dash, the role doesn't change what a member can do, but some apps read it to set a member's starting role in a project. The owner's role is fixed. The <a href="/help/workspace/members">Members and roles</a> guide covers invites, roles and removing members.</p>$html$,
      '[]',
      null,
      30
    ),
    (
      'projects',
      'Projects',
      'Projects',
      $html$<p>A project is the shared home for a piece of work. You create it in Dash, inside one organization, and pick the apps it uses. Work you do when you open the project in one of its apps stays tied to that project, so one project can hold, for example, its plans in Flow and its files in Assets.</p><p>In an organization, each app can be in only one project at a time, and a project's name is shared with its apps. Every member of the organization sees every project. The <a href="/help/workspace/projects">Projects</a> guide covers creating, opening, editing and deleting projects.</p>$html$,
      '[]',
      null,
      40
    ),
    (
      'plans',
      'Plans',
      'Plans',
      $html$<p>A plan belongs to the organization it was bought for. It decides, for every member, which apps the organization's projects can use, how many projects the organization can have and which add-ons it has. An organization without a live plan can't use any app or create projects.</p><p>A plan is one payment for 30 days, or for 365 days when billed yearly, and it doesn't renew on its own. The person who buys it also sees it as their own plan on their billing page. <a href="/help/plans-pricing">Plans and pricing</a> lists what each plan includes and costs, and <a href="/help/workspace/billing#plan-and-organization">Your plan and your organization's plan</a> explains how the two differ.</p>$html$,
      '[]',
      null,
      50
    ),
    (
      'add-ons',
      'Add-ons',
      'Add-ons',
      $html$<p>Add-ons are extras an organization buys with its plan: Custom Subdomain, Custom Email Templates and OAuth / SSO Login. Each one belongs to a single organization, and its settings appear as a tab in that organization's settings, which only the owner can open. The <a href="/help/workspace/add-ons">Add-ons</a> guide covers each one.</p>$html$,
      '[]',
      null,
      60
    ),
    (
      'your-account',
      'Account',
      'Your account',
      $html$<p>One Geiger account signs you in to Dash and every app, in every organization you belong to. You sign in with an email and password, Google, GitHub, a passkey or your organization's SSO, as <a href="/help/workspace/sign-in">Sign-in and OAuth</a> describes.</p><p>Your profile holds your name, picture and details, and only you can open it. Other members see your name, email and picture in the member lists of organizations you share. The <a href="/help/workspace/profile">Profile</a> guide covers it.</p>$html$,
      '[]',
      null,
      70
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"Rocket","label":"Quickstart","href":"/help/quickstart"},{"icon":"Building2","label":"Organizations","href":"/help/workspace/organizations"},{"icon":"Users","label":"Members & roles","href":"/help/workspace/members"},{"icon":"FolderKanban","label":"Projects","href":"/help/workspace/projects"},{"icon":"BadgeDollarSign","label":"Plans & pricing","href":"/help/plans-pricing"},{"icon":"Workflow","label":"Geiger Flow","href":"/help/flow"}]',
      null,
      80
    )
) as v(anchor_id, eyebrow, title, content, links, showcase, sort_order)
cross join (select id from public.docs_pages where slug = 'core-concepts' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Core concepts',
    description = 'Organizations, projects, members and products: how the pieces of Geiger fit together.',
    status = 'draft',
    published_at = null
where slug = 'core-concepts' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'core-concepts' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Organizations</li><li>Projects</li><li>Members and roles</li><li>Products and how they share a project</li></ul>',
  10
from public.docs_pages p
where p.slug = 'core-concepts' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
