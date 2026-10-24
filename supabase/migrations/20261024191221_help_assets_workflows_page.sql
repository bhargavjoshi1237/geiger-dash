-- Help assets workflows page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the assets/workflows draft outline
-- (20261024191200_help_assets_structure) with the full Workflows guide and publishes it. No section showcases exist
-- for Assets yet. Left out on purpose: the License expiring and Duplicate detected triggers and the Wait / delay
-- action (nothing schedules the timed check that fires or resumes them), and the Send email and Generate rendition
-- actions (the engine always skips them).
-- Written from a survey of C:\Pro\geiger-assets (components/internal/screens/projects/workflows/*, lib/workflows/*,
-- lib/workflows/abilities/*, app/api/workflows/dispatch/route.js, app/api/workflows/tick/route.js,
-- lib/supabase/workflows.js, and the emitters in lib/supabase/assets.js, archive.js, approvals.js, shares.js,
-- collections.js, governance.js, lib/storage/service.js, lib/commerce/server.js, lib/creator/*).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Workflows',
    description = 'Automate asset work: pick a trigger, add conditions and actions, activate the workflow, and check every run in Run History.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'assets/workflows' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'assets/workflows' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, showcase, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.showcase, v.sort_order
from (
  values
    (
      'creating-a-workflow',
      'Basics',
      'Creating a workflow',
      $html$<p>A workflow runs steps on its own when something happens in the project, such as tagging every photo that's uploaded. To create one, open a project in Assets, choose <strong>Workflows → All Workflows</strong> in the sidebar, then <strong>Create workflow</strong>.</p><ol><li>Type a <strong>Workflow name</strong>. It's required.</li><li>In <strong>Trigger</strong>, pick what starts it. New workflows start on Asset uploaded.</li><li>In <strong>Scope</strong>, keep <strong>All collections (workspace)</strong>, or choose <strong>A specific collection</strong> and pick the <strong>Collection</strong>.</li><li>Choose <strong>Create workflow</strong>. It's created as a Draft.</li></ol><p>Open the workflow to add its conditions and actions, then choose <strong>Activate</strong>. Only active workflows run.</p><p>To start from a ready-made workflow instead, choose <strong>Workflows → Workflow Templates</strong>, pick one, such as Review on upload, Auto-tag incoming photos, Publish when approved or Large-file approval gate, and edit the copy it creates in All Workflows.</p>$html$,
      '[]',
      null,
      10
    ),
    (
      'how-workflows-run',
      'Concepts',
      'How a workflow runs',
      $html$<p>A workflow is a list of steps that starts with its trigger. When the trigger happens, Assets runs every active workflow with that trigger, in the background, and goes through each one's steps in order.</p><ul><li>A <strong>condition</strong> checks the asset or order. If it doesn't match, the run stops there and is recorded as Skipped.</li><li>An <strong>action</strong> changes something. If an action fails, the run stops and is recorded as Failed. An action that can't apply, such as an asset step when there's no asset, is skipped and the run carries on.</li></ul><p>A workflow scoped to <strong>A specific collection</strong> runs only for assets in that collection. For Asset uploaded, adding an existing asset to the collection counts as it arriving there.</p><p>Changes a workflow makes don't start other workflows, so workflows can't set each other off in a loop.</p>$html$,
      '[]',
      null,
      20
    ),
    (
      'triggers',
      'All Workflows',
      'Triggers',
      $html$<p>The trigger decides when a workflow runs. Assets fires these:</p><ul><li><strong>Ingest and review</strong>: Asset uploaded (a new file is uploaded or imported), Review requested (an asset's status is set to In Review), Asset approved (its status becomes Approved, or a review approves it) and Asset rejected (a review rejects it or requests changes).</li><li><strong>Lifecycle</strong>: Asset archived, and Storage threshold crossed, when an upload takes the project past the quota alert percentage set under <strong>Settings → Usage & Storage</strong>.</li><li><strong>Delivery</strong>: Asset published (delivery to the CDN is switched on for an asset) and Collection shared (a shared link is created for a collection).</li><li><strong>Commerce</strong>: Order placed, Order paid, Order fulfilled, Order refunded, Licence purchased and New customer, from gallery sales.</li><li><strong>Membership</strong>: Member joined a tier, New follower, Membership cancelled, Tip received, Content unlocked and Fan sent a message, from your creator page.</li></ul>$html$,
      '[]',
      null,
      30
    ),
    (
      'conditions-and-actions',
      'All Workflows',
      'Conditions and actions',
      $html$<p>In a workflow's builder, choose <strong>Add step</strong> and pick a condition or an action. Each step has its own settings.</p><ul><li><strong>Asset conditions</strong>: If asset type, If file size (greater than, less than or equal to a size in MB), If has tag and If status.</li><li><strong>Order conditions</strong>: If order total, If order contains a kind of product, If from gallery, If repeat customer and If discount used.</li><li><strong>Asset actions</strong>: Request approval (opens a review through the project's default asset pipeline and sets the asset to In Review), Move asset to a folder, Set status, Add tag, Remove tag and Update field.</li><li><strong>Publish asset</strong>: turns on CDN delivery for the asset. Other channels are skipped.</li><li><strong>Notify staff</strong> and <strong>Create task</strong>: post a message or a task to the project's activity feed, under Comments & Activity.</li><li><strong>Webhook</strong>: sends a GET, POST or PUT request with the event's details to a web address. It fails if the address doesn't answer within 10 seconds or answers with an error.</li><li><strong>Order actions</strong>: Grant downloads, Issue licence, Mark order fulfilled, Add order note, Add to collection, Tag customer, Grant membership and Accrue royalties.</li></ul>$html$,
      '[]',
      null,
      40
    ),
    (
      'workflow-builder',
      'All Workflows',
      'The workflow builder',
      $html$<p>Click a workflow on All Workflows, or choose <strong>Edit</strong> in its <strong>⋯</strong> menu, to open its builder. The sections on the left are:</p><ul><li><strong>General</strong>: the <strong>Workflow name</strong> and a <strong>Description</strong>.</li><li><strong>Trigger & Scope</strong>: the <strong>Trigger</strong>, and whether it covers all collections or one.</li><li><strong>Builder</strong>: the steps, shown as a <strong>List</strong> or on a <strong>Canvas</strong>. In the list, move steps with the up and down arrows and remove one with its remove button. On the canvas, drag steps around and connect them.</li></ul><p>Choose <strong>Save</strong> at the top to keep your edits. Leaving the builder without saving drops them. <strong>Activate</strong> and <strong>Pause</strong>, beside Save, also save the workflow. To delete it, use <strong>Delete workflow</strong> in the builder or <strong>Delete</strong> in its menu; Assets asks first.</p>$html$,
      '[]',
      null,
      50
    ),
    (
      'workflow-list',
      'All Workflows',
      'The workflow list',
      $html$<p>The figures across the top of All Workflows count <strong>Total workflows</strong>, <strong>Active</strong>, <strong>Drafts</strong> and <strong>Total runs</strong>. Each row shows the workflow's name, scope, status (Active, Paused or Draft), how many times it has run and when it last ran.</p><p>Filter by status and trigger, or search by name. Each row's <strong>⋯</strong> menu has <strong>Edit</strong>, <strong>Activate</strong> or <strong>Pause</strong>, <strong>Duplicate</strong> and <strong>Delete</strong>. A duplicate starts as a Draft.</p>$html$,
      '[]',
      null,
      60
    ),
    (
      'run-history',
      'Run History',
      'Run history',
      $html$<p><strong>Workflows → Run History</strong> lists every time a workflow ran, newest first. The figures across the top show <strong>Total runs</strong>, the <strong>Success rate</strong>, how many <strong>Failed</strong> and the <strong>Avg duration</strong>.</p><p>Each row shows the workflow, the run's status, how many steps completed, when it started and how long it took. A run's status is <strong>Success</strong> (every step ran), <strong>Skipped</strong> (a condition didn't match), <strong>Failed</strong> (an action failed) or <strong>Running</strong>. Filter by status and workflow, or search.</p><p>Click a run to see each step's outcome, with the note or error it left, such as why a step was skipped or what a webhook answered.</p>$html$,
      '[]',
      null,
      70
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"MessagesSquare","label":"Collaboration","href":"/help/assets/collaboration"},{"icon":"CloudUpload","label":"Uploads & requests","href":"/help/assets/uploads"},{"icon":"Code","label":"Platform & API","href":"/help/assets/platform"}]',
      null,
      80
    )
) as v(anchor_id, eyebrow, title, content, links, showcase, sort_order)
cross join (select id from public.docs_pages where slug = 'assets/workflows' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Workflows',
    description = 'Automate repeatable asset work with workflows, start from templates, and check each run.',
    status = 'draft',
    published_at = null
where slug = 'assets/workflows' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'assets/workflows' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Building a workflow</li><li>Workflow templates</li><li>Run history</li></ul>',
  10
from public.docs_pages p
where p.slug = 'assets/workflows' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
