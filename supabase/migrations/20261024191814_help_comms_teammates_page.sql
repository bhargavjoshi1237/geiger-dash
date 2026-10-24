-- Help comms teammates page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the comms/teammates draft outline from
-- 20261024191800_help_comms_structure with the full Teammates & roles guide (Settings → Teammates and
-- Settings → Roles & Permissions). Comms isn't deployed yet, so the page stays a draft.
-- Written from a survey of C:\Pro\geiger-comms (components/internal/screens/settings/team_members.jsx, team/*,
-- roles_permissions.jsx, roles/*, constants.js, context/rbac-context.js, lib/supabase/team.js, rbac.js, lib/rbac.js,
-- geiger-rbac.config.js, lib/email/team_invites.js, app/api/team/invites/**, supabase/migrations/
-- 20261021103047_rbac_trust_hardening.sql, 20261021103419_team_invite_claim.sql, 20261021110405_role_grants_owner_guard.sql).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Teammates & roles',
    description = 'Invite teammates to a Comms project, organize them into groups, and control what each role can see and do.'
where slug = 'comms/teammates' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'comms/teammates' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.sort_order
from (
  values
    (
      'inviting-teammates',
      'Basics',
      'Inviting teammates',
      $html$<p>To invite people to the project, go to <strong>Settings → Teammates</strong> and choose <strong>Invite people</strong>.</p><ol><li>In <strong>Email addresses</strong>, type one or more addresses, separated by commas or new lines. You can invite up to 20 people at a time.</li><li>Pick a <strong>Role</strong>. It starts as Member.</li><li>Optional: pick a <strong>Group</strong> and write a <strong>Message</strong> for the email.</li><li>Choose <strong>Send invitations</strong>.</li></ol><p>Inviting needs the <strong>Invite Members</strong> permission, which the Owner, Admin and Manager roles have. Inviting with any role other than Member also needs <strong>Assign roles</strong>, and no invitation can carry the Owner role: invite the person as Admin, then promote them.</p>$html$,
      '[]',
      10
    ),
    (
      'how-access-works',
      'Concepts',
      'How roles and access work',
      $html$<p>Each teammate holds one role in the project, and the role decides what they can see and do. Roles apply across the whole project. The sidebar shows each teammate only the sections their role grants, so a Viewer sees only Overview and Reports.</p><p>The first time someone in your organization opens a Comms project, Comms gives them a role:</p><ul><li>The project's creator and the organization's owner get <strong>Owner</strong>.</li><li>Someone with an invitation gets the invitation's role.</li><li>Anyone else in the organization gets <strong>Member</strong>.</li></ul><p>A teammate who was removed doesn't get a role back by opening the project again. Only a project owner can give someone the Owner role or take it away, and a project always keeps at least one Owner.</p>$html$,
      '[]',
      20
    ),
    (
      'accepting-an-invitation',
      'Teammates',
      'How invitations reach people',
      $html$<p>Each invitation adds the person to your organization too, because only organization members can reach its projects. Geiger emails them a link: they open it, sign in or sign up, and accept. When they then open Comms, their invitation turns into a membership with the role you chose.</p><p>When email can't be sent, Comms shows the invite links instead, with "nothing was emailed". Copy each link and send it to its invitee only, because anyone who opens a link can accept it. <strong>Get invite link</strong> on a pending invitation shows its link again.</p>$html$,
      '[]',
      30
    ),
    (
      'members-list',
      'Teammates',
      'The members list',
      $html$<p><strong>Settings → Teammates</strong> has four tabs: <strong>Members</strong>, <strong>Invitations</strong>, <strong>Groups</strong> and <strong>Activity</strong>. The figures across the top show active members, pending invites, <strong>Seats used</strong> out of the project's 25 seats, and groups. When every seat is taken, <strong>Invite people</strong> is disabled.</p><p><strong>Members</strong> lists each teammate with their role, groups, status (Active, or Invited until they join), whether they've linked a Geiger account, when they joined and when they were last active. Narrow it by role, group or status, or search names and emails.</p><p>Each row's <strong>⋯</strong> menu has <strong>Edit</strong>, which opens the teammate's details, <strong>Manage</strong>, which opens a quicker side panel, and <strong>Remove</strong>.</p>$html$,
      '[]',
      40
    ),
    (
      'teammate-details',
      'Teammates',
      'A teammate''s details',
      $html$<p>A teammate's details have these sections:</p><ul><li><strong>Overview</strong>: their email, account, join date and access at a glance.</li><li><strong>Profile</strong>: their <strong>Display name</strong>, shown on conversations and in the roster. It saves automatically. Their email comes from their Geiger account and can't be edited here.</li><li><strong>Role & access</strong>: their <strong>Assigned role</strong> and everything it grants.</li><li><strong>Groups</strong>: the groups they belong to. Groups organize people and don't grant permissions.</li><li><strong>Activity</strong>: role changes and group edits for this person.</li><li><strong>Advanced</strong>: removing them from the project.</li></ul>$html$,
      '[]',
      50
    ),
    (
      'changing-a-role',
      'Teammates',
      'Changing a teammate''s role',
      $html$<p>To change someone's role, open their details, go to <strong>Role & access</strong> and pick a different <strong>Assigned role</strong>. The change takes effect immediately.</p><p>Changing roles needs the <strong>Assign roles</strong> permission, which the Owner, Admin and Manager roles have. Only a project owner can move someone to or from the Owner role. If the person is the project's last Owner, Comms won't change their role until someone else holds Owner.</p>$html$,
      '[]',
      60
    ),
    (
      'removing-teammates',
      'Teammates',
      'Removing teammates',
      $html$<p>To remove someone from the project, choose <strong>Remove</strong> in their row's <strong>⋯</strong> menu, or under <strong>Advanced</strong> in their details. Comms asks you to confirm first. Removing takes them off the project and revokes their role straight away, so they lose access immediately. Their history stays on the conversations they worked on.</p><p>Removing needs the <strong>Assign roles</strong> permission. The project's last Owner can't be removed until someone else holds Owner.</p>$html$,
      '[]',
      70
    ),
    (
      'managing-invitations',
      'Teammates',
      'Managing invitations',
      $html$<p>The <strong>Invitations</strong> tab lists the people who haven't joined, with the role they were invited with and when. Search it or narrow it by role. Each invitation's <strong>⋯</strong> menu has:</p><ul><li><strong>Resend</strong>: emails the invitation again.</li><li><strong>Get invite link</strong>: shows the link to send yourself.</li><li><strong>Revoke</strong>: cancels the invitation.</li></ul><p>Once the person joins, they move to <strong>Members</strong>.</p>$html$,
      '[]',
      80
    ),
    (
      'groups',
      'Teammates',
      'Groups',
      $html$<p>Groups gather teammates into sub-teams, such as a billing team or a second line. They don't grant permissions. Routing rules can assign conversations within a group, and reports can be filtered by one.</p><p>To create a group, open the <strong>Groups</strong> tab and choose <strong>New Group</strong>. Give it a <strong>Name</strong> and an optional <strong>Description</strong>, then choose <strong>Create group</strong>. Add people to it from each teammate's <strong>Groups</strong> section, or pick it when you invite them.</p><p>Each group's <strong>⋯</strong> menu has <strong>View members</strong>, <strong>Edit</strong> and <strong>Delete</strong>. Deleting asks you to confirm first; its members keep their access and are no longer grouped.</p>$html$,
      '[]',
      90
    ),
    (
      'team-activity',
      'Teammates',
      'Team activity',
      $html$<p>The <strong>Activity</strong> tab records invitations, role changes and removals, with when each happened and the details. Narrow it by kind of event, or search it.</p>$html$,
      '[]',
      100
    ),
    (
      'system-roles',
      'Roles',
      'System roles',
      $html$<p>Every project comes with five system roles. They can't be deleted, and you can change what each grants, except Owner.</p><ul><li><strong>Owner</strong>: full access to everything, including billing. It always grants every permission.</li><li><strong>Admin</strong>: every section and every permission except <strong>Manage billing</strong>.</li><li><strong>Manager</strong>: every section, works the inbox and invites teammates. It doesn't include <strong>Create and edit roles</strong>, <strong>Manage settings</strong> or <strong>Manage billing</strong>.</li><li><strong>Member</strong>: Overview, Inbox, Channels, Customers and Knowledge Base, with <strong>Reply to a conversation</strong> and <strong>Assign a conversation</strong>. Members can't close or snooze conversations.</li><li><strong>Viewer</strong>: read-only access to Overview and Reports.</li></ul>$html$,
      '[]',
      110
    ),
    (
      'custom-roles',
      'Roles',
      'Creating and editing roles',
      $html$<p>To create a role, go to <strong>Settings → Roles & Permissions</strong> and choose <strong>Create role</strong>. Give it a <strong>Name</strong> (required) and a <strong>Description</strong>, and choose what to <strong>Start from</strong>: <strong>Blank (no permissions)</strong> or an existing role, whose permissions are copied. Choose <strong>Create role</strong>.</p><p>The <strong>Roles</strong> tab lists every role with its type (System or Custom), how much it can access and how many people hold it. Click a role to open its panel, where you turn permissions on and off. Each change saves immediately.</p><p>Each role's <strong>⋯</strong> menu has <strong>Edit permissions</strong>, <strong>Rename</strong>, <strong>Duplicate</strong>, <strong>View in Team</strong> and <strong>Delete</strong>. Deleting a custom role asks you to confirm first, and everyone holding it loses the access it granted. Creating and changing roles needs the <strong>Create and edit roles</strong> permission; without it, you can see the roles but not change them.</p>$html$,
      '[]',
      120
    ),
    (
      'permission-matrix',
      'Roles',
      'The permission matrix',
      $html$<p>The <strong>Permission matrix</strong> tab shows every permission as a row and every role as a column, so you can compare roles side by side and turn permissions on and off in place. Search permissions, or narrow the matrix to one group. The Owner column is locked, because Owner always has everything.</p>$html$,
      '[]',
      130
    ),
    (
      'permissions-reference',
      'Reference',
      'Permissions',
      $html$<p>Each top-level sidebar section has a permission that shows it: Overview, Inbox, Channels, Customers, Automation, Knowledge Base, Reports and Settings. These operations have their own permissions:</p><ul><li><strong>Reply to a conversation</strong>: reply and add internal notes.</li><li><strong>Assign a conversation</strong>: assign and unassign.</li><li><strong>Close a conversation</strong>: close, reopen, snooze and merge.</li><li><strong>Publish a help-centre article</strong>: publish articles and change help centers.</li><li><strong>Invite Members</strong>: invite people to the project.</li><li><strong>Assign roles</strong>: change teammates' roles and remove them.</li><li><strong>Create and edit roles</strong>: manage roles and their permissions.</li><li><strong>Manage settings</strong>: change workflows, routing rules, SLA policies, shared macros, Messenger widget apps, AI providers and teammates' shared views.</li></ul>$html$,
      '[]',
      140
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"Settings","label":"Settings","href":"/help/comms/settings"},{"icon":"Route","label":"Routing rules & SLAs","href":"/help/comms/routing-and-slas"},{"icon":"Inbox","label":"Inbox","href":"/help/comms/inbox"}]',
      150
    )
) as v(anchor_id, eyebrow, title, content, links, sort_order)
cross join (select id from public.docs_pages where slug = 'comms/teammates' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Teammates & roles',
    description = 'Invite teammates, organize groups and control what each role can do.'
where slug = 'comms/teammates' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'comms/teammates' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Inviting teammates</li><li>Members and groups</li><li>Roles</li><li>The permissions matrix</li></ul>',
  10
from public.docs_pages p
where p.slug = 'comms/teammates' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
