-- Help assets collaboration page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the assets/collaboration draft outline
-- (20261024191200_help_assets_structure) with the full Collaboration guide and publishes it. No section showcases
-- exist for Assets yet. Left out on purpose: a shared link's password, download, comment and visibility settings
-- (the shared page doesn't apply them), team invitations and guests (no email is sent and the invite link has no
-- page), and a pipeline's stage order, "Opens" and version-lock settings (reviews don't follow them).
-- Written from a survey of C:\Pro\geiger-assets (components/internal/screens/projects/collaboration/*,
-- app/s/[token]/page.js, lib/supabase/shares.js, lib/supabase/approvals.js, lib/supabase/comments.js,
-- lib/supabase/activity.js, lib/supabase/invitations.js, lib/supabase/rbac.js, lib/storage/auth.js,
-- supabase/migrations/20260920000000_collaboration.sql, 20260906020000_rbac_org_role_mapping.sql).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Collaboration',
    description = 'Share assets and collections through links that expire, route work through approval pipelines, follow comments and activity, and manage the project team.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'assets/collaboration' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'assets/collaboration' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, showcase, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.showcase, v.sort_order
from (
  values
    (
      'sharing-a-link',
      'Basics',
      'Creating a shared link',
      $html$<p>A shared link lets people outside the project see an asset or a collection without signing in. To create one, open a project in Assets, choose <strong>Collaboration → Shared Links</strong> in the sidebar, then <strong>New link</strong>.</p><ol><li>In <strong>Link name</strong>, type a name you'll recognize later. It's required.</li><li>In <strong>Shares</strong>, choose <strong>A single asset</strong> or <strong>A collection</strong>, then pick it in the field beside it.</li><li>In <strong>Expires</strong>, choose <strong>Never expires</strong>, <strong>In 7 days</strong>, <strong>In 30 days</strong> (the default) or <strong>In 90 days</strong>.</li><li>Choose <strong>Create link</strong>. The link is live straight away.</li></ol><p>To send it, choose <strong>Copy URL</strong> in the link's <strong>⋯</strong> menu, or click its row. The page it opens shows the shared files' thumbnails, names and types, and the date access ends; it has no download button. A shared collection shows the assets in it when the page is opened.</p><p>You can also share one asset from the Asset Library: <strong>Share → Create share link</strong> in its <strong>⋯</strong> menu makes a link that expires in 30 days and copies it for you.</p>$html$,
      '[]',
      null,
      10
    ),
    (
      'managing-shared-links',
      'Shared Links',
      'Managing shared links',
      $html$<p>The figures across the top of Shared Links count <strong>Active links</strong> (with the total), <strong>Views</strong> and <strong>Downloads</strong>, and the links <strong>Expiring soon</strong>, within 7 days. A link counts a view each time someone opens its page.</p><p>Each row shows the link's name and what it shares, its status, when it expires (in amber when that's within 7 days), its views and the date it was created. Filter by status, or search by link name and the shared asset or collection.</p><p>Each row's <strong>⋯</strong> menu has these actions:</p><ul><li><strong>Copy URL</strong> and <strong>Open</strong>.</li><li><strong>Edit</strong>: change the name, what it shares and when it expires.</li><li><strong>Revoke</strong>: the URL stops working at once, and the link stays in the list as Revoked.</li><li><strong>Delete</strong>: Assets asks first, then the URL stops working and the link and its view count are gone.</li></ul><p>A link also stops working once its expiry date passes. Anyone opening a revoked, expired or deleted link sees "This link isn't available".</p>$html$,
      '[]',
      null,
      20
    ),
    (
      'requesting-a-review',
      'Approvals',
      'Requesting a review',
      $html$<p>A review routes work through an approval pipeline until it's approved or rejected. You need an active pipeline for the kind of work first; see <a href="#creating-a-pipeline">Creating an approval pipeline</a>. Then choose <strong>Collaboration → Approvals</strong> in the sidebar and <strong>Request review</strong>.</p><ol><li>In <strong>Review name</strong>, type a name. It's required.</li><li>In <strong>Reviewing</strong>, pick the kind of work, such as Asset, Collection, Shared link or Payout. Asset is the default.</li><li>In <strong>Pipeline</strong>, pick one of the active pipelines for that kind of work. The default pipeline is picked for you.</li><li>Set <strong>Priority</strong> (Low, Normal, High or Urgent; Normal to start) and <strong>Due</strong> (No due date, In 3 days, In a week or In two weeks; In a week to start).</li><li>For an asset review, select the assets to review in <strong>Assets</strong>. At least one is required.</li><li>Choose <strong>Request review</strong>.</li></ol><p>The review starts In Review at the pipeline's first stage. It keeps its own copy of the pipeline's stages, so editing the pipeline later doesn't change reviews already under way. Only asset reviews carry items; reviews of other kinds of work hold the decisions and discussion on their own.</p>$html$,
      '[]',
      null,
      30
    ),
    (
      'review-statuses',
      'Concepts',
      'Review statuses',
      $html$<p>Every review has one status, shown on the Approvals list and in the review:</p><ul><li><strong>In Review</strong>: waiting on its current stage. New reviews start here.</li><li><strong>Changes Requested</strong>: sent back. It stays on the same stage, and approving again picks up from there.</li><li><strong>Approved</strong>: the last stage signed off.</li><li><strong>Rejected</strong>: someone rejected it, which closes it.</li><li><strong>Cancelled</strong>: someone cancelled it from the list.</li></ul><p>Approved, Rejected and Cancelled reviews are finished. Choose <strong>Reopen</strong> in a finished review to put it back In Review on the same stage. A review is <strong>overdue</strong> once its due date passes while it's still open.</p>$html$,
      '[]',
      null,
      40
    ),
    (
      'deciding-on-a-review',
      'Approvals',
      'Deciding on a review',
      $html$<p>Click a review on the Approvals list to open it. Its <strong>Approval route</strong> shows each stage, who it's for and how many approvals it still needs.</p><ul><li><strong>Items</strong>: for an asset review, each asset has buttons to approve it, request changes on it or reject it. These per-item decisions save straight away.</li><li><strong>Decision</strong>: add an optional note, then choose <strong>Approve stage</strong>, <strong>Request changes</strong> or <strong>Reject</strong>. Request changes appears only when the stage allows change requests. In an asset review, decide on at least one item before you approve the stage.</li></ul><p>Each approval counts toward the stage's minimum. Once a stage has enough, the review moves to the next stage, and after the last one it's Approved. When a review is approved, its assets are set to Approved, unless the pipeline's <strong>Mark the subject approved</strong> setting is off.</p><p><strong>Decision history</strong> lists every decision with its note. <strong>Discussion</strong> holds the review's comments: write one and choose the send icon, reply to a thread, or <strong>Resolve</strong> it.</p>$html$,
      '[]',
      null,
      50
    ),
    (
      'review-list',
      'Approvals',
      'The review list',
      $html$<p>The figures across the top of Approvals count reviews <strong>In flight</strong>, those that <strong>Need changes</strong>, the ones <strong>Approved</strong>, and those <strong>Overdue</strong>.</p><p>Each row shows the review's name, the kind of work and its number of items, its pipeline, the stage it's on (such as 1 of 2), its priority, status and due date, in red when overdue. Filter by status and by kind of work, or search by name and pipeline.</p><p>Each row's <strong>⋯</strong> menu has <strong>Open</strong>, <strong>Cancel</strong> for a review that isn't finished, and <strong>Delete</strong>. Delete asks first, and the review's decision history goes with it; cancel instead to keep the record.</p>$html$,
      '[]',
      null,
      60
    ),
    (
      'creating-a-pipeline',
      'Approval Pipelines',
      'Creating an approval pipeline',
      $html$<p>An approval pipeline is the route a kind of work follows to sign-off, one stage after another. To create one, choose <strong>Collaboration → Approval Pipelines</strong> in the sidebar, then <strong>Create pipeline</strong>.</p><ol><li>Type a <strong>Pipeline name</strong>. It's required.</li><li>In <strong>Applies to</strong>, pick the kind of work it routes, such as Asset, Collection, Shared link, Role grant or Payout.</li><li>In <strong>Start from</strong>, pick <strong>Blank pipeline</strong> or a starter: <strong>Brand review</strong>, <strong>Client delivery</strong>, <strong>External access</strong> or <strong>Finance sign-off</strong>.</li><li>Choose <strong>Create pipeline</strong>.</li></ol><p>The pipeline is created as a Draft. Open it to set its stages, then choose <strong>Activate</strong>; only active pipelines can take new reviews. <strong>Pause</strong> stops new reviews without touching reviews under way.</p>$html$,
      '[]',
      null,
      70
    ),
    (
      'stages-and-approvers',
      'Approval Pipelines',
      'Stages and approvers',
      $html$<p>Open a pipeline from Approval Pipelines to edit it. Changes save as you make them.</p><ul><li><strong>General</strong>: the pipeline's <strong>Name</strong>, <strong>Description</strong> and <strong>Applies to</strong>, and <strong>Default pipeline</strong>, which makes it the one picked first when someone requests a review of that kind of work.</li><li><strong>Approval route</strong>: choose <strong>Add stage</strong> for each step. Give each stage a name, then in <strong>Who approves</strong> choose <strong>Anyone with a role</strong> and a <strong>Role</strong>, or <strong>Specific people</strong> and the <strong>People</strong>. Set <strong>Minimum approvals</strong>, and turn <strong>Allow change requests</strong> on or off. Move stages up or down, or remove them.</li><li><strong>On final approval</strong>: <strong>Mark the subject approved</strong> sets a review's assets to Approved when the last stage signs off. It's on by default.</li></ul><p>To activate a pipeline, it needs at least one stage, and every stage needs an approver. <strong>Delete pipeline</strong> asks first; reviews already under way keep their own copy of the stages. The <strong>⋯</strong> menu on the pipeline list also has <strong>Edit</strong>, <strong>Duplicate</strong>, <strong>Make default</strong> and <strong>Delete</strong>.</p>$html$,
      '[]',
      null,
      80
    ),
    (
      'comments-and-activity',
      'Comments & Activity',
      'Comments and activity',
      $html$<p><strong>Collaboration → Comments & Activity</strong> collects the project's conversations and a log of what happened. The figures across the top count <strong>Open threads</strong>, <strong>Replies</strong>, <strong>Resolved</strong> threads and <strong>Events today</strong>.</p><ul><li><strong>Comments</strong>: every thread from review discussions. Filter by <strong>All Threads</strong>, <strong>Open</strong> or <strong>Resolved</strong>, search them, reply, and choose <strong>Resolve</strong> or <strong>Reopen</strong>.</li><li><strong>Activity</strong>: who did what and when, newest first and grouped by day, covering shared links, review requests and decisions, and comments. Filter by <strong>All Activity</strong>, <strong>Assets</strong>, <strong>Sharing</strong>, <strong>Approvals</strong>, <strong>Comments</strong> or <strong>Team</strong>, or search.</li></ul>$html$,
      '[]',
      null,
      90
    ),
    (
      'team',
      'Team',
      'The project team',
      $html$<p><strong>Collaboration → Team</strong> lists the people with a role in the project in Assets, on its <strong>Members</strong> tab, with each person's role and the date they joined. Search by name, email or role.</p><ul><li><strong>Sync from org</strong> adds everyone in your organization who isn't on the team yet. Each person gets the role matching their organization role: Owner, Admin or Manager, and Member for everyone else.</li><li><strong>Role</strong>: pick a different role for someone in their row. It changes straight away and decides what they can do, such as whether they can delete assets.</li><li><strong>Remove from workspace</strong>, in a person's <strong>⋯</strong> menu, asks first. They lose their role in the project and can no longer upload, download or delete its files. What they created stays.</li></ul><p>People in your organization also join the team with their matching role the first time they work with the project's files. Someone you removed isn't added back that way. Roles and their permissions are set under <strong>Settings → Permissions & Security</strong>; see <a href="/help/assets/settings#permissions-and-security">Project settings</a>.</p>$html$,
      '[]',
      null,
      100
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"Workflow","label":"Workflows","href":"/help/assets/workflows"},{"icon":"FolderOpen","label":"Asset library","href":"/help/assets/library"},{"icon":"Settings","label":"Project settings","href":"/help/assets/settings"}]',
      null,
      110
    )
) as v(anchor_id, eyebrow, title, content, links, showcase, sort_order)
cross join (select id from public.docs_pages where slug = 'assets/collaboration' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Collaboration',
    description = 'Share assets through links, run approvals, follow comments and activity, and manage the team.',
    status = 'draft',
    published_at = null
where slug = 'assets/collaboration' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'assets/collaboration' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Shared links</li><li>Approvals</li><li>Approval pipelines</li><li>Comments and activity</li><li>Team</li></ul>',
  10
from public.docs_pages p
where p.slug = 'assets/collaboration' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
