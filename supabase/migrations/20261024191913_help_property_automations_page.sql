-- Help property automations page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the property/automations draft outline from
-- 20261024191900_help_property_structure with the full Automations guide (All Workflows, Workflow Templates, Run History
-- and the Scheduled Jobs dialog) and publishes it. SMS steps are left out: no SMS provider is connected.
-- Written from a survey of C:\Pro\geiger-property (components/internal/screens/automations/{automations,sections,
-- workflow_templates,run_history,scheduled_jobs,shared}.*, automations/canvas/*, lib/automations/{catalog,runner}.js,
-- lib/jobs/{registry,operations,financial,autopay,scheduled_reports}.js, lib/messaging/{deliver,send,reminder_jobs}.js,
-- app/api/cron/run-due/route.js).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Automations',
    description = 'Build workflows that send messages, notify the team, open work orders or update records when something happens or on a schedule.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'property/automations' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'property/automations' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.sort_order
from (
  values
    (
      'creating-a-workflow',
      'Basics',
      'Creating a workflow',
      $html$<p>A workflow runs steps for you when something happens, such as a lease being activated or rent going overdue, or on a schedule. To create one, choose <strong>Automations → All Workflows</strong> in the sidebar, then <strong>New Workflow</strong>. Enter a <strong>Workflow name</strong> (required) and pick what starts it under <strong>When</strong> (Lease created, to start). New workflows are Draft and switched off.</p><p>To start from a ready-made workflow instead, see "Workflow templates" on this page. Either way, add its steps in the editor, then choose <strong>Actions → Switch on</strong>. A workflow needs at least one step before it can be switched on.</p>$html$,
      '[]',
      10
    ),
    (
      'triggers',
      'Concepts',
      'Triggers',
      $html$<p>A workflow's <strong>Trigger</strong> section sets what starts it:</p><ul><li><strong>Leases</strong>: Lease created, Lease activated, and Lease ending, once per lease when its end date is a set number of days away (60 to start).</li><li><strong>Applications</strong>: Application submitted and Application approved.</li><li><strong>Maintenance</strong>: Work order created and Work order completed.</li><li><strong>Rent &amp; payments</strong>: Payment received (an income transaction recorded against a tenant or lease), and Rent overdue, once a month per tenant whose balance is still open a set number of days after the due date (5 to start) and over a minimum balance.</li><li><strong>Moves</strong>: Move-in scheduled and Move-out scheduled.</li><li><strong>Schedule</strong>: On a schedule, daily, weekly or monthly. Run it once, for each active lease, or for each tenant with a balance.</li></ul><p>Record triggers come from changes to your records; timed triggers are checked by the automation runner (see "Scheduled jobs" on this page).</p>$html$,
      '[]',
      20
    ),
    (
      'conditions-and-steps',
      'Workflows',
      'Conditions and steps',
      $html$<p>In <strong>Conditions</strong>, choose <strong>Add Condition</strong> to run the workflow only when the record matches, such as a work order's priority <strong>is</strong> Urgent or a lease's rent <strong>is greater than</strong> 2000. Operators are is, is not, contains, is greater than, is at least, is less than, is at most, is set and is empty. Every condition must hold. With none, the workflow runs for every matching event.</p><p>In <strong>Steps</strong>, choose <strong>Add Step</strong> and pick one:</p><ul><li><strong>Send a message</strong>: emails the tenant, the applicant, the assigned vendor, the property owner, your team alert recipients or a specific address. Pick a template, or write a subject and body with merge fields.</li><li><strong>Notify the team</strong>: logs a notification on the record's timeline, and optionally emails a teammate or the team alert recipients from <strong>Settings → Notifications</strong>.</li><li><strong>Create a work order</strong>: opens one linked to the record's property and unit, with a title, priority, category and description.</li><li><strong>Update status</strong>: sets the triggering record's status.</li><li><strong>Wait</strong>: pauses the run for a number of days.</li></ul><p>Steps run in order. Reorder them with the up and down arrows, or remove one with its trash icon.</p>$html$,
      '[]',
      30
    ),
    (
      'workflow-canvas',
      'Workflows',
      'The workflow canvas',
      $html$<p>A workflow's <strong>Canvas</strong> section shows the whole workflow as connected cards: the trigger, its conditions and each step. Drag in steps, rewire the order, and double-click a card to edit it.</p><p>The controls in the corner zoom in and out, fit the whole workflow in view, turn snapping to a grid on or off (and change the grid size), and lock the canvas so nothing moves by accident.</p>$html$,
      '[]',
      40
    ),
    (
      'managing-workflows',
      'Workflows',
      'Switching workflows on and off',
      $html$<p>A workflow is Draft, Active or Paused. Switch it on or off from its <strong>Actions</strong> menu (<strong>Switch on</strong> or <strong>Switch off</strong>), or from its row on the list. Only workflows that are switched on start new runs.</p><p>The list's figures count workflows (with drafts), those switched on, runs started all-time and paused workflows. Filter by on or off and by trigger, or search by name, trigger and steps. To remove a workflow and all its steps, use the <strong>Delete</strong> section at the bottom of its editor.</p>$html$,
      '[]',
      50
    ),
    (
      'workflow-templates',
      'Workflow templates',
      'Workflow templates',
      $html$<p><strong>Automations → Workflow Templates</strong> holds ready-made workflows: Move-in welcome, Move-out checklist, Collections follow-up, Application received, Approved applicant next steps, New lease kickoff, Maintenance request received, Repair follow-up, Payment thank-you, Monthly rent reminder and Renewal outreach. Filter them by category or search.</p><p><strong>Use template</strong> creates a new workflow from it, as a Draft that's switched off. Review its trigger, conditions and steps, then switch it on.</p>$html$,
      '[]',
      60
    ),
    (
      'run-history',
      'Run history',
      'Run history',
      $html$<p>Each time a workflow fires, it starts a <strong>run</strong>. <strong>Automations → Run History</strong> lists every run with its workflow, trigger, the record it ran for and its timing. A run is Queued, Running, Waiting (paused by a Wait step), Completed, Failed or Cancelled.</p><p>Open a run to see its per-step log: each step is Done, Warning, Error, Waiting or Not run. A run that hasn't finished can be cancelled. Filter by workflow and status. The figures show total runs, the success rate, failed runs and runs in progress. A workflow's own <strong>Runs</strong> section shows the same for that workflow.</p>$html$,
      '[]',
      70
    ),
    (
      'scheduled-jobs',
      'Scheduled jobs',
      'Scheduled jobs',
      $html$<p>Property's timed work is done by scheduled jobs. To see them, choose <strong>Scheduled Jobs</strong> at the top of <strong>Automations → All Workflows</strong>. The jobs are:</p><ul><li><strong>Automation runner</strong>: turns record events into workflow runs, fires timed triggers and resumes waiting steps.</li><li><strong>Post recurring charges</strong>, <strong>Assess late fees</strong>, <strong>Management fees</strong>, <strong>Deposit interest</strong> and <strong>Autopay charges</strong>.</li><li><strong>Preventive work orders</strong> and <strong>Scheduled reports</strong>.</li><li><strong>Scheduled announcements</strong>, <strong>Lease expiry &amp; renewal alerts</strong>, <strong>Rent reminders</strong> and <strong>Expiring documents</strong>.</li></ul><p>Each job shows its last run, and <strong>Recent runs</strong> lists the history. <strong>Run Now</strong> runs one job for this project, and <strong>Run Everything Due</strong> runs every job that's due. When the project's scheduler isn't set up, the dialog says so, and jobs run only when you run them here.</p>$html$,
      '[]',
      80
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"CircleDollarSign","label":"Rent & payments","href":"/help/property/payments"},{"icon":"Wrench","label":"Maintenance","href":"/help/property/maintenance"},{"icon":"Settings","label":"Project settings","href":"/help/property/settings"}]',
      200
    )
) as v(anchor_id, eyebrow, title, content, links, sort_order)
cross join (select id from public.docs_pages where slug = 'property/automations' and deleted_at is null) p;

-- @down
-- Restores the draft exactly as 20261024191900_help_property_structure left it.
update public.docs_pages
set title = 'Automations',
    description = 'Build workflows that run on their own, start from templates and review every run.',
    status = 'draft',
    published_at = null
where slug = 'property/automations' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'property/automations' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Workflows</li><li>Workflow templates</li><li>Run history</li></ul>',
  10
from public.docs_pages p
where p.slug = 'property/automations' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
