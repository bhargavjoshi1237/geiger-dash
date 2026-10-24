-- Help forms collaboration page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the forms/collaboration draft outline (from
-- 20261024191600_help_forms_structure) with the full Collaboration guide and publishes it.
-- Written from a survey of C:\Pro\geiger-forms (components/internal/screens/forms/shared/shared_screen.jsx,
-- roles/roles_screen.jsx, comments/comments_screen.jsx, activity/activity_screen.jsx, catalog/feature_map.js,
-- geiger-rbac.config.js, lib/rbac.js, context/rbac-context.js, lib/supabase/rbac.js, lib/server/auth.js (userCan),
-- app/api/responses/[id]/comments/route.js, app/api/forms/[id]/invite/route.js,
-- supabase/migrations/20261008155427_lock_down_rls.sql, 20261021105053_retire_unscoped_access.sql,
-- 20261021114224_rbac_trust_hardening.sql, 20261021114225_tamper_proof_audit.sql).
-- Left out on purpose: what the Viewer role can see (its description promises the overview and reports, but it holds
-- neither the Forms nor the Responses view permission, so those screens load no data for it), the Members tab's
-- "Limited forms" scope (nothing in the app sets it) and the unused Manage billing permission's effect.
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Collaboration',
    description = 'Bring teammates into Forms, give them roles and custom permissions, share forms, and follow comments and the activity log.',
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'forms/collaboration' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'forms/collaboration' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.sort_order
from (
  values
    (
      'how-teammates-join',
      'Basics',
      'How teammates join Forms',
      $html$<p>Forms doesn't send invitations to a project of its own. Anyone in the project's organization joins Forms the first time they open that project in Forms, and gets a role there. The person who created the project becomes its Owner, and everyone else starts as a Member.</p><p>To bring someone new in, invite them to your organization in Dash, then send them to the project. Their role in Forms covers that project only, and it's separate from their role in other apps.</p><p>Someone whose access you revoke isn't added back when they open Forms again. To see who has joined, choose <strong>Collaboration → Roles & Permissions</strong> in the Forms sidebar.</p>$html$,
      '[]',
      10
    ),
    (
      'roles',
      'Concepts',
      'Roles',
      $html$<p>Every member of a project in Forms has one role, and the role decides what they can do. Forms has five built-in roles:</p><ul><li><strong>Owner</strong>: everything, including permissions added later.</li><li><strong>Admin</strong>: everything in Forms: see, edit, publish and delete forms, export and delete responses, share forms, assign roles, create and edit roles, and manage workspace settings and API keys.</li><li><strong>Manager</strong>: see, edit and publish forms, see and export responses, share forms and assign roles. A Manager can't delete forms or responses, edit roles, or change workspace settings.</li><li><strong>Member</strong>: see and edit forms, and see and export responses. A Member can't publish, delete, share forms, assign roles or change settings.</li><li><strong>Viewer</strong>: none of the editing, publishing, exporting or deleting permissions.</li></ul><p>Where a role can't do something, the button is hidden or disabled, often with a note such as "Your role can't edit forms." You can also create your own roles with the permissions you choose.</p>$html$,
      '[]',
      20
    ),
    (
      'changing-a-members-role',
      'Collaboration',
      'Changing a member''s role',
      $html$<p>The <strong>Members</strong> tab of <strong>Collaboration → Roles & Permissions</strong> lists everyone with a role in the project's Forms, with you first, and when each joined. The figures across the top count <strong>Members</strong>, <strong>Roles</strong>, <strong>Owners</strong> and <strong>Permissions</strong>.</p><ul><li>To change someone's role, pick a new one in their row. It applies straight away.</li><li>To remove someone, choose the trash icon in their row. Their access ends at once, and they aren't added back if they open Forms again. You can't remove yourself.</li></ul><p>A project always keeps at least one Owner: Forms won't change the role of, or remove, the last one. Changing roles and removing members needs the Assign roles permission: Owner, Admin or Manager.</p><p><strong>Security & Compliance → Access Control</strong> opens the same screen, with a note that sign-in, single sign-on and passkeys come from your Geiger account and organization settings, not from Forms.</p>$html$,
      '[]',
      30
    ),
    (
      'custom-roles',
      'Collaboration',
      'Creating custom roles',
      $html$<p>The <strong>Roles</strong> tab of <strong>Collaboration → Roles & Permissions</strong> lists the project's roles with how many members each has. Click a role to see its permissions.</p><p>The five built-in roles are locked. To start from one, select it and choose <strong>Duplicate</strong>, which makes a copy named after it with "(custom)" added. The Owner role can't be copied. To start from nothing:</p><ol><li>Choose <strong>New role</strong>.</li><li>Type a <strong>Name</strong> (required) and an optional <strong>Description</strong>, and pick a <strong>Color</strong>.</li><li>Choose <strong>Create role</strong>. The role starts with no permissions.</li><li>Select the permissions it should have.</li></ol><p>Changes to a custom role's permissions apply at once to everyone who has it. To delete a custom role, select it and choose <strong>Delete</strong>, after moving its members to another role. Creating, changing and deleting roles needs the Create and edit roles permission: Owner or Admin.</p>$html$,
      '[]',
      40
    ),
    (
      'permissions',
      'Reference',
      'Permissions',
      $html$<p>A role's permissions are grouped like this:</p><ul><li><strong>Forms</strong>: <strong>Edit a form</strong>, <strong>Publish a form</strong> and <strong>Delete a form</strong>.</li><li><strong>Responses</strong>: <strong>Export responses</strong> and <strong>Delete responses</strong>.</li><li><strong>Team Control</strong>: <strong>Invite Members</strong> (share forms from Team & Sharing), <strong>Assign roles</strong> and <strong>Create and edit roles</strong>.</li><li><strong>Administration</strong>: <strong>Manage settings</strong> (workspace settings, workspace themes and API keys) and <strong>Manage billing</strong>.</li><li><strong>Workspace views</strong>: one entry per screen.</li></ul><p>Four of the Workspace views entries decide what data a role can see. <strong>Forms</strong> lets it see the project's forms, <strong>Responses</strong> lets it see responses with their comments, saved views and access log, <strong>Overview</strong> lets it see the activity log, and <strong>Settings</strong> lets it read workspace settings. The other entries don't hide anything: every screen stays in everyone's sidebar.</p>$html$,
      '[]',
      50
    ),
    (
      'sharing-a-form',
      'Collaboration',
      'Sharing a form with teammates',
      $html$<p><strong>Collaboration → Team & Sharing</strong> keeps a list of who you've shared each form with, as <strong>Can view</strong>, <strong>Can edit</strong> or <strong>Admin</strong>. The list is a record: what each person can actually do comes from their role.</p><ol><li>Choose <strong>Share a form</strong>.</li><li>Pick the <strong>Form</strong>, add the <strong>People</strong> by email and pick a <strong>Role</strong>.</li><li>Leave <strong>Email them a link to the form</strong> on to send each person the form's link with a note that they've been given access. It's only sent for a published form, and when email is set up for your deployment.</li><li>Choose <strong>Share</strong>.</li></ol><p>Change someone's role in their row, or remove them with the trash icon. The same list is under <strong>Team access</strong> in each form's <strong>Access & Sharing</strong> settings. Sharing needs the Invite Members permission: Owner, Admin or Manager. The screen also lists the project's roles with how many members each has.</p>$html$,
      '[]',
      60
    ),
    (
      'response-comments',
      'Collaboration',
      'Response comments',
      $html$<p><strong>Collaboration → Response Comments</strong> gathers the 300 most recent internal comments on responses across the project's forms. Respondents never see them. The figures across the top count the comments, those from this week, the responses discussed and the people who commented.</p><p>Narrow the list by form, by author or to <strong>Mentioning me</strong>, or search the comments, respondents and form names. Click a comment to open its response's details, where you can reply. <strong>Refresh</strong> loads new comments.</p><p>Comments can't be edited or deleted once posted. Seeing them needs access to responses. The <a href="/help/forms/responses#commenting">Responses</a> guide covers writing comments and mentioning teammates.</p>$html$,
      '[]',
      70
    ),
    (
      'activity-and-audit',
      'Collaboration',
      'Activity and audit',
      $html$<p><strong>Collaboration → Activity & Audit</strong> records who did what, in two tabs:</p><ul><li><strong>Activity</strong>: the latest 500 events. They include forms created, published, unpublished, archived or deleted; responses submitted, changed, assigned, approved, rejected, countersigned, edited by the respondent or deleted; edit requests, signed links and forms sent by email; payments received; automations run; and respondent data exported or erased. Each shows when, who, the form and any detail.</li><li><strong>Response access log</strong>: each time someone viewed a response, revealed a sensitive answer, exported, printed or edited it, with the response and field.</li></ul><p>Filter by form, action and person, or search. The figures across the top count events, people active, events in the last 24 hours and sensitive reveals. Entries can't be changed or deleted. Seeing activity needs the Overview permission, and the access log needs access to responses.</p>$html$,
      '[]',
      80
    ),
    (
      'live-presence',
      'Collaboration',
      'Live presence',
      $html$<p>When teammates have the same form open in the builder, Forms shows their avatars and tells you when their changes save. <strong>Collaboration → Live Presence</strong> lists the project's forms and shows which ones are shared with collaborators, with <strong>Open builder</strong> for each. The <a href="/help/forms/builder#editing-with-teammates">Form builder</a> guide covers editing with teammates.</p>$html$,
      '[]',
      90
    ),
    (
      'related-guides',
      null::text,
      'Related guides',
      '',
      '[{"icon":"ShieldCheck","label":"Security & compliance","href":"/help/forms/security"},{"icon":"Inbox","label":"Responses","href":"/help/forms/responses"},{"icon":"PencilRuler","label":"Form builder","href":"/help/forms/builder"},{"icon":"Settings","label":"Workspace settings","href":"/help/forms/settings"},{"icon":"Settings2","label":"Form settings","href":"/help/forms/form-settings"},{"icon":"FileText","label":"All forms","href":"/help/forms/all-forms"}]',
      100
    )
) as v(anchor_id, eyebrow, title, content, links, sort_order)
cross join (select id from public.docs_pages where slug = 'forms/collaboration' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Collaboration',
    description = 'Invite teammates, give them roles, comment on responses, and see who changed what in the activity log.',
    status = 'draft',
    published_at = null
where slug = 'forms/collaboration' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'forms/collaboration' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Inviting teammates</li><li>Roles and permissions</li><li>Response comments</li><li>Activity and audit</li><li>Live presence</li></ul>',
  10
from public.docs_pages p
where p.slug = 'forms/collaboration' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
