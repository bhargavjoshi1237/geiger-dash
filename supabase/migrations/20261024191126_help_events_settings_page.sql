-- Help events settings page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the events/settings draft outline from
-- 20261024191100_help_events_structure with the full Settings guide and publishes it. Custom Domains is left out: its
-- saves and checks are simulated in the browser and nothing is stored. API & Webhooks and Usage are Coming soon.
-- Written from a survey of C:\Pro\geiger-events (components/internal/sidebar/sidebar_nav.jsx,
-- components/internal/screens/registry.jsx, components/internal/screens/settings/* and settings/team/*,
-- components/internal/screens/tickets/settings_kit.jsx, geiger-rbac.config.js, geiger-ui.config.js, lib/rbac.js,
-- context/rbac-context.js, context/nav-visibility-context.js, context/addons-context.js, lib/hooks/use-visible-nav.js,
-- lib/supabase/rbac.js, lib/supabase/team.js, lib/supabase/nav_prefs.js, lib/supabase/project_addons.js,
-- lib/notifications/*, lib/email/*, app/api/portal/request-setup/route.js, app/api/registrations/approval-email/route.js,
-- lib/stripe/fulfill-checkout.js, lib/operations/server/access.js, components/internal/screens/events/page_design.jsx,
-- addons/index.js, addons/registry.js, addons/manifest_schema.js, app/project/[projectId]/[[...rest]]/page.js,
-- supabase/migrations/*rbac*, *team*, 20261002091000_operations_role_write_guards.sql) and of @geiger/ui's nav resolver
-- (C:\Pro\geiger-ui\src\nav\resolve.js, nav-visibility-settings.jsx) and @geiger/rbac's evaluator.
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set description = 'Manage who''s on the project''s team and what each role can do, choose your own sidebar, and set which emails the project sends and which add-ons it uses.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'events/settings' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'events/settings' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, showcase, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.showcase, v.sort_order
from (
  values
    (
      'team-and-members',
      'Team & Members',
      'Team and members',
      $html$<p>Everyone in your organization can open its projects in Events, and <strong>Settings → Team & Members</strong> lists who's on this project's team. The figures across the top count <strong>Active members</strong>, <strong>Pending invites</strong>, <strong>Seats used</strong> and <strong>Groups</strong>, and the tabs hold <strong>Members</strong>, <strong>Invitations</strong>, <strong>Groups</strong> and <strong>Activity</strong>.</p><p>The first time someone opens the project, Events gives them the role that matches their organization role: an organization Owner becomes Owner, an Admin becomes Admin, a Manager becomes Manager, and everyone else becomes Member. When an Owner or Admin of the organization opens Team & Members, Events also adds anyone in the organization who isn't on the list yet, with the same role.</p><p>The <strong>Members</strong> tab shows each teammate's role, event access, groups, status and the date they joined. Narrow it by role, status or group, or search by name or email. Click a teammate to open their panel.</p><p>By default, <strong>Settings</strong> appears in the sidebar for the Owner, Admin and Manager roles. To change who sees it, see <a href="/help/events/settings#roles-and-permissions">Roles and permissions</a>. Events saves changes to teammates and roles only for an Owner or Admin of your organization, whatever their role in Events.</p>$html$,
      '[]',
      null,
      10
    ),
    (
      'inviting-people',
      'Team & Members',
      'Inviting people',
      $html$<p>To invite someone, choose <strong>Settings → Team & Members</strong>, then <strong>Invite people</strong>. Type one or more <strong>Email addresses</strong>, separated by commas, spaces or new lines, pick a <strong>Role</strong> (Member to start with) and optionally a <strong>Group</strong>, then choose <strong>Send invitations</strong>. Each address waits on the <strong>Invitations</strong> tab with its role until the person joins. <strong>Revoke</strong> there cancels an invitation straight away, without asking.</p><p>An invitation doesn't send an email and doesn't give access by itself. People reach the project through your organization, so add them to the organization in Dash as well. The first time they open the project, their invitation moves to <strong>Members</strong>, and they get the role that matches their organization role rather than the one on the invitation. Change it afterwards on the <strong>Members</strong> tab. The optional <strong>Message</strong> is saved with the invitation, but because Events doesn't email invitations, nobody sees it.</p><p>Each project has 25 seats, and everyone on the team who isn't Suspended takes one, pending invitations included. When they're all taken, <strong>Invite people</strong> is unavailable, and a batch that needs more seats than are left is refused with <strong>Not enough seats for that many invites</strong>. An address that's already on the team can't be invited again.</p><p><strong>Invite people</strong> appears for roles with the <strong>Invite Members</strong> permission: Owner, Admin and Manager by default.</p>$html$,
      '[]',
      null,
      20
    ),
    (
      'changing-a-role',
      'Team & Members',
      'Changing a role or event access',
      $html$<p>To change a teammate's role, click the role in their row on the <strong>Members</strong> tab and pick another, or click the row to open their panel and use <strong>Role</strong>. The change saves straight away, reaches them the next time they load Events, and Events sends them a notification naming their new role. You can't give the project's last Owner another role until someone else holds Owner.</p><p><strong>Event access</strong>, in the same panel, narrows a teammate's role to the events you tick. <strong>All Events</strong> puts it back to the whole project. It applies to the permissions tagged <strong>per event</strong> in the permission matrix, which in practice means what they can do in each event's operations. It doesn't change their sidebar or which events they can open. Event access isn't available for an invitation, only for teammates who hold a role. The <strong>Access</strong> column on the Members tab shows <strong>All Events</strong> or how many events someone is limited to.</p><p>The panel also lists what the teammate's role can do, grouped the same way as the permission matrix.</p><p>Changing roles and event access needs the <strong>Assign roles</strong> permission, which Owner, Admin and Manager have by default. Without it, the role and access controls are locked, and a note at the top of Team & Members says so.</p>$html$,
      '[]',
      null,
      30
    ),
    (
      'suspending-and-removing',
      'Team & Members',
      'Suspending and removing teammates',
      $html$<p>Each row's <strong>⋯</strong> menu on the <strong>Members</strong> tab has <strong>Suspend</strong> (or <strong>Reactivate</strong>) and <strong>Remove</strong>, and so does the <strong>Danger zone</strong> at the bottom of a teammate's panel. Both need the <strong>Assign roles</strong> permission.</p><ul><li><strong>Suspend</strong> marks the teammate Suspended and frees their seat. It doesn't take away their access: a suspended teammate can still open the project with their role. To stop someone using the project, remove them.</li><li><strong>Remove</strong> asks you to confirm, then revokes their access to the project straight away and sends them a notification that they were removed. They stay in your organization.</li></ul><p>Events never gives a removed teammate their access back on its own, even when they open the project again. To let them back in, pick a role for them on the <strong>Members</strong> tab. To take someone out of every project at once, remove them from your organization in Dash.</p><p>You can't remove the project's last Owner until someone else holds Owner.</p>$html$,
      '[]',
      null,
      40
    ),
    (
      'groups-and-activity',
      'Team & Members',
      'Groups and the activity log',
      $html$<p>Groups sort teammates into sub-teams, such as check-in staff. To create one, open the <strong>Groups</strong> tab on <strong>Settings → Team & Members</strong>, choose <strong>New Group</strong>, type a <strong>Name</strong> and an optional <strong>Description</strong>, then choose <strong>Create group</strong>. Each group's card shows how many teammates are in it.</p><p>Put people in groups with the <strong>Groups</strong> checkboxes in their panel, which saves as you tick, or pick a group when you invite them. Groups don't change what anyone can do: they label people and let you filter the Members tab. A group can't be renamed or deleted once it's created.</p><p>The <strong>Activity</strong> tab lists the latest 50 team changes, newest first, with who made each one: invitations, role and event access changes, suspensions and reactivations, removals, group changes, and roles created, renamed or deleted.</p>$html$,
      '[]',
      null,
      50
    ),
    (
      'roles-and-permissions',
      'Roles & Permissions',
      'Roles and permissions',
      $html$<p>A role is a set of permissions, and each teammate holds one role in the project. To see the project's roles, choose <strong>Settings → Roles & Permissions</strong>. Every project has five system roles:</p><ul><li><strong>Owner</strong>: every permission, including any that Events adds later. Owner can't be edited, renamed or deleted, so the project always keeps a role that can run it.</li><li><strong>Admin</strong>: every sidebar area and every permission Events checks.</li><li><strong>Manager</strong>: every sidebar area. Managers can invite teammates and assign roles, but can't create or edit roles or add custom code to a page.</li><li><strong>Member</strong>: Overview, Events, Registrations, Guests, Check-in, Analytics, Community and Workflows.</li><li><strong>Viewer</strong>: Overview and Analytics.</li></ul><p>Each top-level sidebar area has a view permission, and the screens under an area come with it. A view permission decides what appears in someone's sidebar and in the search in the top bar, not who can reach the data. Everyone in your organization can work with the project's data, and can still open a screen their role hides, for example from a link someone shares. Don't rely on roles to keep information private.</p><p>Apart from Owner, system roles are a starting point. You can change their permissions, and the change applies to this project only. A change to a role reaches the people who hold it the next time they load Events.</p>$html$,
      '[]',
      null,
      60
    ),
    (
      'creating-and-editing-roles',
      'Roles & Permissions',
      'Creating and editing roles',
      $html$<p>To create a role, choose <strong>Create role</strong> on <strong>Settings → Roles & Permissions</strong>. Only the <strong>Name</strong> is required. Under <strong>Start from</strong>, keep <strong>Blank (no permissions)</strong> or copy another role's permissions, then choose <strong>Create role</strong>. The new role is marked Custom, and its panel opens.</p><p>A role's panel has a switch for every permission, in the same groups as the matrix. Each switch saves as you change it, and <strong>Select all</strong> or <strong>Clear</strong> sets a whole group at once. Type in <strong>Filter permissions</strong> to find one. Open a role's panel by clicking its row, or with <strong>Edit permissions</strong> in its <strong>⋯</strong> menu.</p><p>The <strong>Permission matrix</strong> tab shows every permission against every role. Click a cell to grant or remove that permission. Filter it by group or search it to answer a question like who can invite teammates.</p><p>A role's <strong>⋯</strong> menu also has <strong>Rename</strong> (its name and description), <strong>Duplicate</strong> (a Custom copy with <code>copy</code> added to the name), <strong>View in Team</strong> (the Members tab filtered to that role) and, for Custom roles only, <strong>Delete</strong>. Events asks you to confirm a delete. Anyone who held the deleted role shows <strong>No role</strong> and has an empty sidebar until you give them another.</p><p>Changing roles needs the <strong>Create and edit roles</strong> permission, which Owner and Admin have by default. Without it, the screen is read-only and says so at the top.</p>$html$,
      '[]',
      null,
      70
    ),
    (
      'permissions-events-checks',
      'Reference',
      'Permissions Events checks',
      $html$<p>The permission matrix groups permissions under <strong>Workspace views</strong>, <strong>Event operations</strong>, <strong>Events</strong>, <strong>Orders</strong>, <strong>Team Control</strong> and <strong>Administration</strong>. Events acts on these:</p><ul><li><strong>Workspace views</strong>: one for each sidebar area, plus Affiliates while that add-on is on. Each one shows or hides its area.</li><li><strong>Invite Members</strong>: shows <strong>Invite people</strong> on Team & Members.</li><li><strong>Assign roles</strong>: changing teammates' roles, event access and groups, and suspending or removing them.</li><li><strong>Create and edit roles</strong>: changing anything on Roles & Permissions.</li><li><strong>Add custom code to a page</strong>: the page builder's <strong>Code</strong> button and its <strong>Raw HTML</strong> block.</li><li><strong>View event operations</strong>, <strong>Configure event operations</strong>, <strong>Create operation records</strong>, <strong>Update operation records</strong> and <strong>Archive operation records</strong>: what a teammate can do in an event's operations.</li></ul><p>Permissions tagged <strong>per event</strong> follow a teammate's Event access. A teammate limited to specific events has the event operations permissions on those events only, and can't add custom code to any page.</p><p><strong>Edit an event</strong>, <strong>Publish an event</strong>, <strong>Delete an event</strong>, <strong>Refund an order</strong>, <strong>Manage billing</strong> and <strong>Manage settings</strong> are listed, but Events doesn't check them: turning one off doesn't stop anyone from doing that thing.</p>$html$,
      '[]',
      null,
      80
    ),
    (
      'navigation',
      'Navigation',
      'Sidebar navigation',
      $html$<p>To hide sidebar entries you don't use, choose <strong>Settings → Navigation</strong> and turn off the switch beside a section or screen. Each switch saves as you change it. The choice is yours alone and only for this project: teammates keep their own sidebar, and your other projects keep theirs. Hidden entries also leave the search in the top bar.</p><p>Hiding a section hides every screen under it. <strong>Overview</strong>, <strong>Events</strong>, <strong>All Events</strong>, <strong>Settings</strong> and <strong>Navigation</strong> are always on and show a lock instead of a switch.</p><p>Some entries need another one. For example, <strong>Orders</strong> needs <strong>Tickets</strong>, and <strong>Guest List</strong> needs <strong>Contact Book</strong>. You can't hide an entry while a visible entry needs it, and you can't show an entry while something it needs is hidden. Its switch is unavailable, and its row names the entries in the way. Choose one of those names to jump to it, change it first, then come back.</p><p>The list holds only the areas your role shows you. Filter it with <strong>All</strong>, <strong>Shown</strong>, <strong>Hidden</strong> or <strong>Always on</strong>, or search it, and choose <strong>Show all</strong> to put every entry back. Navigation sits under Settings, so by default only the Owner, Admin and Manager roles can reach it.</p>$html$,
      '[]',
      null,
      90
    ),
    (
      'notifications',
      'Notifications',
      'Email notifications',
      $html$<p>To choose which automated emails the project sends, choose <strong>Settings → Notifications</strong>. The settings cover every event in the project. Change the switches, then choose <strong>Save Changes</strong>: nothing applies until you save, and Events picks up a saved change within 30 seconds.</p><p><strong>Send transactional emails</strong>, under <strong>Delivery</strong>, is the master switch. While it's off, the project sends none of these emails and the other switches can't be changed.</p><p>Each email type has its own switch, in sections for who receives it. Events sends three of them:</p><ul><li><strong>Registration approved</strong>, under <strong>Registrations & RSVPs</strong>: sent to a guest when you approve their registration under <strong>Registrations → Approval Gates</strong>, with a link back to the event page to finish booking.</li><li><strong>Purchase confirmation</strong>, under <strong>Tickets & orders</strong>: sent to the buyer for every new paid order, with their ticket's QR code.</li><li><strong>Set or reset your password</strong>, under <strong>Members portal</strong>: the link an attendee asks for to set their members portal password. The switch applies only when their portal account belongs to this project alone; otherwise the email always sends.</li></ul><p>Types marked <strong>Planned</strong> aren't sent by Events: their switches save your choice and nothing else. The ones marked <strong>Live</strong> are the three that send, and <strong>Wired up today</strong> counts them.</p>$html$,
      '[]',
      null,
      100
    ),
    (
      'add-ons',
      'Add-ons',
      'Add-ons',
      $html$<p>Add-ons are optional modules you turn on for one project. Choose <strong>Settings → Add-ons</strong> and turn on an add-on's switch: its section joins the sidebar for everyone in the project whose role shows it. Affiliates is the one add-on Events offers. It credits ticket sales that affiliates refer through tracked links, and adds screens for programs, commissions and payouts.</p><p>Each switch saves as you change it. Turning an add-on off hides its screens and keeps its data, so turning it back on brings everything back. Turning Affiliates off doesn't stop its active programs from crediting sales, so set those programs to Paused or Ended first.</p><p><strong>More details</strong> lists what an add-on adds and its screens. While it's on, <strong>Sidebar position</strong> moves its section: <strong>Auto (manifest default)</strong> places Affiliates after Orders, or pick an existing section to place it before. The position is the same for everyone in the project.</p><p>Packages isn't an add-on: you turn it on from <strong>Packages</strong> in the sidebar. See <a href="/help/events/packages">Packages</a>.</p>$html$,
      '[]',
      null,
      110
    ),
    (
      'sidebar-is-empty',
      'Troubleshooting',
      'A teammate''s sidebar is empty',
      $html$<p>A teammate opens the project and sees no sidebar entries. That happens when they hold no role in the project: they were removed from it earlier, or the role they held was deleted. Events never hands a removed teammate's access back on its own.</p><ol><li>As an Owner or Admin of your organization, choose <strong>Settings → Team & Members</strong>.</li><li>On the <strong>Members</strong> tab, find the teammate. If their role was deleted, it shows as <strong>No role</strong>.</li><li>Click their role and pick one. They see that role's areas the next time they load Events.</li></ol>$html$,
      '[]',
      null,
      120
    ),
    (
      'changes-dont-save',
      'Troubleshooting',
      'Team or role changes don''t save',
      $html$<p>You invite someone, change a teammate's role or edit a role, and Events shows an error such as <strong>Couldn't change the role</strong>, <strong>Couldn't update permissions</strong> or <strong>Couldn't invite</strong> followed by the address. Events saves changes to teammates and roles only for an Owner or Admin of your organization, whatever role you hold in Events.</p><p>Ask an Owner or Admin of your organization to make the change, or to give you one of those roles in Dash. An invitation also fails when the address is already on the team. Events still shows <strong>Invitation sent</strong> after a batch in which some addresses failed, so check the <strong>Invitations</strong> tab.</p>$html$,
      '[]',
      null,
      130
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"CalendarDays","label":"Events","href":"/help/events/events"},{"icon":"ClipboardList","label":"Registrations","href":"/help/events/registrations"},{"icon":"ShoppingBag","label":"Orders","href":"/help/events/orders"},{"icon":"Gem","label":"Packages","href":"/help/events/packages"},{"icon":"BriefcaseBusiness","label":"Operations workspace","href":"/help/events/operations"},{"icon":"CircleUserRound","label":"Members portal","href":"/help/events/members-portal"}]',
      null,
      140
    )
) as v(anchor_id, eyebrow, title, content, links, showcase, sort_order)
cross join (select id from public.docs_pages where slug = 'events/settings' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Settings',
    description = 'Manage your team and roles, your sidebar, notifications, custom domains and add-ons.',
    status = 'draft',
    published_at = null
where slug = 'events/settings' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'events/settings' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Team and members</li><li>Roles and permissions</li><li>Navigation</li><li>Notifications</li><li>Custom domains</li><li>Add-ons</li></ul>',
  10
from public.docs_pages p
where p.slug = 'events/settings' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
