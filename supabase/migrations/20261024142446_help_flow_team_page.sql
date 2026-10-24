-- Help flow team page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the flow/team draft outline with the
-- full Team & resources guide (Flow's Team and Resource Allocation screens) and publishes it.
-- Written from a survey of C:\Pro\geiger-flow (components/internal/screens/projects/team/team.jsx,
-- components/internal/dilouges/teams/invitemember_dilouge.jsx, components/internal/screens/projects/resource_allocation/*,
-- features/team/*, features/resources/*, components/internal/shared/pagination.jsx).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Team & resources',
    description = 'Add people to the project''s team and set their roles, then plan who works on what with allocations and resource requests.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'flow/team' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'flow/team' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, showcase, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.showcase, v.sort_order
from (
  values
    (
      'inviting-a-member',
      'Basics',
      'Inviting a member',
      $html$<p>To add someone to the project's team, choose <strong>Team</strong> in the project sidebar, then <strong>Invite member</strong>. Type their <strong>Email Address</strong>, pick a role under <strong>Set Role</strong>, and choose <strong>Send Invite</strong>. Only the email is required: <strong>Send Invite</strong> stays disabled until there is one.</p><ul><li><strong>Set Role</strong>: Admin, Member or Viewer. New invites are Member.</li></ul><p>The person joins the team list straight away as Active, named after the part of their email before the @. Flow doesn't send them an email. Each email can be on a project's team once, so inviting an address that's already there fails with <strong>Couldn't invite member</strong>.</p><p>The team list and its roles are a record of who works on the project. Adding someone here doesn't let them open the project, and their role doesn't change what they can do in Flow. Everyone in your organization can open its projects, so add new people to the organization in Dash.</p>$html$,
      '[]',
      null,
      10
    ),
    (
      'team-list',
      'Team',
      'The team list',
      $html$<p>The figures across the top of <strong>Team</strong> count the project's team: <strong>Total members</strong> (with how many are active), <strong>Admins</strong>, <strong>Members</strong> and <strong>Viewers</strong>. Search and filters don't change them.</p><p>Each row shows the member's name and email, their role and their status. Members are listed in the order they joined, oldest first. Narrow the list by role with the filter (<strong>All Roles</strong>, <strong>Admin</strong>, <strong>Member</strong> or <strong>Viewer</strong>), or type in <strong>Search members</strong> to match names and emails.</p><p>The list shows 10 members a page unless the project's default is changed under <strong>Settings → General → Default rows per page</strong>. Choose 10, 25, 50 or 100 at the bottom to change it for the list you're looking at.</p>$html$,
      '[]',
      null,
      20
    ),
    (
      'changing-a-role',
      'Team',
      'Changing a role or removing a member',
      $html$<p>Each row's <strong>⋯</strong> menu on the <strong>Team</strong> screen has <strong>Edit Role</strong> and <strong>Remove</strong>.</p><ul><li><strong>Edit Role</strong> opens <strong>Edit Member Role</strong>. The email can't be changed there: pick the new role under <strong>Set Role</strong> and choose <strong>Save Changes</strong>.</li><li><strong>Remove</strong> asks you to confirm first. Once you choose <strong>Remove</strong> in the dialog, the member leaves the team list. Flow can't restore them, but you can invite the same email again.</li></ul><p>To change a member's email, remove them and invite the new address.</p>$html$,
      '[]',
      null,
      30
    ),
    (
      'allocations-and-requests',
      'Concepts',
      'Allocations and requests',
      $html$<p><strong>Resource Allocation</strong> plans who works on the project and how much of their time it takes. It has two tabs.</p><ul><li>An <strong>allocation</strong> assigns a person to project work at a load from 0% to 100%, with optional start and end dates. Its status is Active, Planned or Completed.</li><li>A <strong>resource request</strong> asks for extra capacity, such as another designer. It stays Pending until someone approves or denies it.</li></ul><p>The two aren't linked: approving a request doesn't create an allocation, and an allocation's status doesn't change on its own when its end date passes. The person on an allocation is a name you type, not someone picked from the team list.</p>$html$,
      '[]',
      null,
      40
    ),
    (
      'creating-an-allocation',
      'Resource Allocation',
      'Creating an allocation',
      $html$<p>Choose <strong>Resource Allocation</strong> in the project sidebar, then <strong>New Allocation</strong>. Only the member is required: <strong>Create Allocation</strong> stays disabled until there is one.</p><ul><li><strong>Member</strong>: the person's full name.</li><li><strong>Role</strong>: what they do on the project, like <code>Backend Engineer</code>.</li><li><strong>Status</strong>: Active, Planned or Completed. New allocations are Active.</li><li><strong>Allocation</strong>: their load, as a whole percentage from 0 to 100. It starts at 50.</li><li><strong>Starts on</strong> and <strong>Ends on</strong>: optional dates.</li><li><strong>Notes</strong>: anything worth remembering about the allocation.</li></ul>$html$,
      '[]',
      null,
      50
    ),
    (
      'allocations-list',
      'Resource Allocation',
      'The allocations list',
      $html$<p>The <strong>Allocations</strong> tab lists every allocation, newest first, with its member and role, status, load, start and end dates, and notes. A warning icon beside a name marks an <strong>overloaded</strong> allocation: one over 80% that isn't Completed.</p><p>The figures across the top of <strong>Resource Allocation</strong> are <strong>Total load</strong> (every allocation's percentage added up, with how many are over 80%), <strong>Active</strong>, <strong>Planned</strong> and <strong>Pending requests</strong>. Search and filters don't change them.</p><p>Filter by status (<strong>All Statuses</strong>, <strong>Active</strong>, <strong>Planned</strong> or <strong>Completed</strong>), or search by member, role or notes. When nothing matches, <strong>Clear filters</strong> resets both.</p><p>Each row's <strong>⋯</strong> menu has <strong>Edit</strong>, which opens the same form, and <strong>Delete</strong>. Flow asks you to confirm a delete, and a deleted allocation can't be restored from Flow.</p>$html$,
      '[]',
      null,
      60
    ),
    (
      'resource-requests',
      'Resource Allocation',
      'Resource requests',
      $html$<p>To ask for extra capacity, open the <strong>Requests</strong> tab in <strong>Resource Allocation</strong> and choose <strong>New Request</strong>. <strong>Requester</strong> (who is asking) and <strong>Request</strong> (what they need) are required: <strong>Create Request</strong> stays disabled until both are filled in. <strong>Target</strong> names what's needed, like <code>Designer</code> or <code>QA tooling</code>, and <strong>Requested on</strong> is today's date unless you pick another.</p><p>New requests start as Pending. Each row's <strong>⋯</strong> menu has <strong>Approve</strong> and <strong>Deny</strong> while a request is Pending, and <strong>Reopen</strong>, which sets it back to Pending, once it's decided. <strong>Delete</strong> asks you to confirm first, and a deleted request can't be restored from Flow.</p><p>Requests are listed newest first. Filter them by status (<strong>All Statuses</strong>, <strong>Pending</strong>, <strong>Approved</strong> or <strong>Denied</strong>), or search by request, requester or target.</p>$html$,
      '[]',
      null,
      70
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"ShieldCheck","label":"Security","href":"/help/flow/security"},{"icon":"PackagePlus","label":"Add-ons","href":"/help/flow/add-ons"},{"icon":"Settings","label":"Project settings","href":"/help/flow/settings"}]',
      null,
      80
    )
) as v(anchor_id, eyebrow, title, content, links, showcase, sort_order)
cross join (select id from public.docs_pages where slug = 'flow/team' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Team & resources',
    description = 'Invite members, set their roles, and plan who works on what with resource allocation.',
    status = 'draft',
    published_at = null
where slug = 'flow/team' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'flow/team' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Inviting members</li><li>Roles</li><li>Resource allocation</li></ul>',
  10
from public.docs_pages p
where p.slug = 'flow/team' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
