-- Help comms workflows page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the comms/workflows draft outline from
-- 20261024191800_help_comms_structure with the full Workflows guide (Workflows, Workflow Templates and Run History).
-- Comms isn't deployed yet, so the page stays a draft. Left out: the "Let the AI agent answer" and "Send CSAT survey"
-- actions, which the builder lists as unavailable (lib/workflows/availability.js), and the templates built on them.
-- Written from a survey of C:\Pro\geiger-comms (components/internal/screens/automation/workflows.jsx,
-- workflow_builder.jsx, step_list.jsx, workflow_catalog.js, workflow_templates.jsx, run_history.jsx, constants.js,
-- canvas/*, lib/workflows/availability.js, graph.js, steps.js, lib/automation/events.js, executor.js, actions.js,
-- conditions.js, tick.js, time.js).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Workflows',
    description = 'Automate what happens when a conversation starts, a customer replies, a tag is added or someone goes quiet, and check every run in Run History.'
where slug = 'comms/workflows' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'comms/workflows' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.sort_order
from (
  values
    (
      'creating-a-workflow',
      'Basics',
      'Creating a workflow',
      $html$<p>A workflow runs steps automatically when something happens in a conversation. To create one, go to <strong>Automation → Workflows</strong> and choose <strong>Create workflow</strong>.</p><ol><li>Type a <strong>Workflow name</strong> and pick the <strong>Trigger</strong> that starts it.</li><li>Choose <strong>Create workflow</strong>. It opens in the builder as a Draft.</li><li>Choose <strong>Add step</strong> to add conditions and actions, and fill in each step.</li><li>Choose <strong>Save</strong>.</li><li>When it's ready, choose <strong>Set live</strong>. Only live workflows run.</li></ol><p>To start from a ready-made workflow instead, choose <strong>Templates</strong>; see <a href="#workflow-templates">Workflow templates</a>.</p><p>Creating and changing workflows needs the <strong>Manage settings</strong> permission, which the Owner and Admin roles have. Without it, you can open workflows to view them, and the controls say why they're disabled.</p>$html$,
      '[]',
      10
    ),
    (
      'how-workflows-run',
      'Concepts',
      'How workflows run',
      $html$<p>When a trigger fires, every live workflow with that trigger runs, in the order they're listed. Each one works through its steps from top to bottom:</p><ul><li><strong>Conditions</strong> at the start decide whether the workflow applies. If one isn't met, the workflow doesn't run and nothing is recorded.</li><li><strong>Actions</strong> change the conversation, one after another. If an action fails, the run stops and is marked Failed.</li><li>A condition after an action stops the run there when it isn't met.</li><li>A <strong>Wait</strong> step pauses the run and picks it up again once the time is up.</li></ul><p>For a new conversation, live workflows run first, then routing rules assign it if it's still unassigned. A workflow's own changes can start other workflows, but never itself, and Comms stops a chain after three automated changes in a row.</p><p>Workflows started by a Messenger conversation run as the customer's message arrives. Others, including time-based triggers and the end of a wait, run on the automation engine's next scheduled pass.</p>$html$,
      '[]',
      20
    ),
    (
      'triggers',
      'Reference',
      'Triggers',
      $html$<p>Each workflow has one trigger:</p><ul><li><strong>New conversation</strong>: a customer starts a conversation.</li><li><strong>Customer replies</strong>: a customer sends a message in an existing conversation.</li><li><strong>Teammate replies</strong>: a teammate replies to the customer.</li><li><strong>Conversation assigned</strong>: a conversation is assigned.</li><li><strong>Tag added</strong>: a tag is added. Name a tag, or leave it blank for any tag.</li><li><strong>State changes</strong>: a conversation changes to Closed, Snoozed or Reopened, or to any state.</li><li><strong>Customer unresponsive</strong>: the customer hasn't replied for a set time, 2 days to start with.</li><li><strong>Teammate unresponsive</strong>: the customer has waited on a teammate's reply for a set time, 4 hours to start with.</li><li><strong>Ticket created</strong> and <strong>Ticket state changes</strong>: a ticket is created, or moves to Submitted, In progress, Waiting, Resolved or any state.</li></ul><p>A time-based run that's waiting stops when the silence breaks: when the customer writes back, or a teammate replies.</p>$html$,
      '[]',
      30
    ),
    (
      'conditions',
      'Reference',
      'Conditions',
      $html$<p>A condition lets the workflow continue only when it's true:</p><ul><li><strong>Channel is</strong>: the conversation's channel, such as Chat or Email.</li><li><strong>Priority is</strong>: Urgent, Normal or Low.</li><li><strong>Has tag</strong>: the conversation has a tag.</li><li><strong>State is</strong>: Open, Snoozed or Closed.</li><li><strong>Office hours</strong>: <strong>Inside office hours</strong> or <strong>Outside office hours</strong>, by the project's business hours.</li><li><strong>Assignment</strong>: the conversation is Unassigned or Assigned.</li><li><strong>Message contains</strong>: the message mentions a phrase.</li><li><strong>Contact attribute</strong>: Plan, Company, Lifecycle, Location or Email domain is, is not, or contains a value.</li></ul>$html$,
      '[]',
      40
    ),
    (
      'actions',
      'Reference',
      'Actions',
      $html$<ul><li><strong>Send a reply</strong>: replies to the customer. On an email channel with sending on, the reply is emailed too.</li><li><strong>Add a note</strong>: leaves an internal note, signed with the workflow's name.</li><li><strong>Assign</strong>: by <strong>Round robin</strong>, <strong>Balanced workload</strong> or <strong>A specific teammate or team</strong>. Type a teammate's or team's name, or leave it blank for anyone available.</li><li><strong>Add tag</strong> and <strong>Remove tag</strong>.</li><li><strong>Set priority</strong>: Urgent, Normal or Low.</li><li><strong>Snooze</strong>: for 1 hour or 3 hours, until tomorrow 9am, or until next week. The 9am is in the project's time zone.</li><li><strong>Close conversation</strong>.</li><li><strong>Apply SLA</strong>: starts a named SLA policy's clock. The policy must be enabled.</li><li><strong>Convert to ticket</strong>: creates a Customer, Back-office or Tracker ticket, titled with the conversation's subject and linked to it.</li><li><strong>Wait</strong>: pauses for a number of minutes, hours or days.</li><li><strong>Send webhook</strong>: makes a POST, GET or PUT request to a public URL. POST and PUT send the workflow and the conversation's details as JSON. The step fails if the address doesn't answer with success within 10 seconds.</li><li><strong>Update contact</strong>: sets an attribute on the conversation's contact.</li></ul>$html$,
      '[]',
      50
    ),
    (
      'the-builder',
      'Workflows',
      'The workflow builder',
      $html$<p>The builder has two tabs. <strong>Builder</strong> holds the steps, in two views of the same workflow:</p><ul><li><strong>Canvas</strong> (the default): the steps as connected cards. Drag a condition or action from the panel onto the canvas, then connect it. The run follows the connections from the trigger, and cards that aren't connected run after them. Select a card and press <code>Backspace</code> or <code>Delete</code> to remove it. The corner controls zoom, fit the view, snap cards to a grid and lock the canvas.</li><li><strong>List</strong>: the steps in order. <strong>Add step</strong> adds one, and each step has <strong>Move up</strong>, <strong>Move down</strong> and <strong>Remove step</strong>.</li></ul><p><strong>Settings</strong> holds the <strong>Workflow name</strong>, a <strong>Description</strong>, the <strong>Trigger</strong> and its options, and <strong>Delete</strong>.</p><p>Changes in the builder aren't saved until you choose <strong>Save</strong>, which stays disabled until you change something. A workflow needs a name and a trigger to save. <strong>Set live</strong> saves your changes and turns the workflow on; <strong>Pause</strong> turns it off.</p>$html$,
      '[]',
      60
    ),
    (
      'workflow-list',
      'Workflows',
      'The workflow list',
      $html$<p><strong>Workflows</strong> lists each workflow with its status, how many times it has run, when it last ran and when it was last updated. The figures across the top show how many workflows there are, how many are live, the total runs and how many are drafts.</p><ul><li><strong>Draft</strong>: not running. New workflows start as drafts.</li><li><strong>Live</strong>: runs whenever its trigger fires.</li><li><strong>Paused</strong>: turned off. Runs that are waiting stop when they would pick up again.</li></ul><p>Narrow the list by status or trigger, or search it. Each row's <strong>⋯</strong> menu has <strong>Edit</strong>, <strong>Set live</strong> (or <strong>Pause</strong>), <strong>Duplicate</strong> and <strong>Delete</strong>. Deleting asks you to confirm first, and the workflow stops running straight away.</p>$html$,
      '[]',
      70
    ),
    (
      'workflow-templates',
      'Workflow Templates',
      'Workflow templates',
      $html$<p><strong>Workflow Templates</strong>, under Automation, is a gallery of ready-made workflows in the categories Routing, Escalation, Customer experience and Tickets. Filter by category, or search. Each card says what starts the workflow and how many steps it has. Among them:</p><ul><li><strong>Auto-assign new conversations</strong>: shares new conversations across available teammates by round robin.</li><li><strong>Out-of-office reply</strong>: replies to new conversations outside office hours.</li><li><strong>Escalate urgent conversations</strong>: assigns urgent conversations to a team, applies an SLA policy and leaves a note.</li><li><strong>Bug reports to a tracker</strong>: turns conversations tagged <code>bug</code> into a tracker ticket and tells the customer.</li><li><strong>Nudge unresponsive customers</strong> and <strong>Reassign when a teammate goes quiet</strong>.</li></ul><p><strong>Use template</strong> creates the workflow as a draft and opens it in the builder. Change any names it refers to, such as a team or an SLA policy, before you set it live. Using a template needs the <strong>Manage settings</strong> permission.</p>$html$,
      '[]',
      80
    ),
    (
      'run-history',
      'Run History',
      'Run History',
      $html$<p><strong>Run History</strong>, under Automation, has one row for each time a workflow ran, from the latest 500 runs. The figures across the top show the total runs, the success rate, how many failed and the average duration.</p><ul><li><strong>Success</strong>: at least one action ran and nothing failed.</li><li><strong>Failed</strong>: a step failed, and the run stopped there.</li><li><strong>Running</strong>: still going, or waiting on a Wait step.</li><li><strong>Skipped</strong>: no action ran, for example because a condition after the trigger wasn't met.</li></ul><p>Narrow the list by status or workflow, or search by workflow name or trigger. Click a run to see its status, duration, how many steps completed, when it started and finished, and a log of every step with its outcome. A failed run shows the error, such as "No teammate is available." <strong>Open conversation</strong> opens the conversation it ran on.</p>$html$,
      '[]',
      90
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"Route","label":"Routing rules & SLAs","href":"/help/comms/routing-and-slas"},{"icon":"Zap","label":"Macros","href":"/help/comms/macros"},{"icon":"Settings","label":"Settings","href":"/help/comms/settings"}]',
      100
    )
) as v(anchor_id, eyebrow, title, content, links, sort_order)
cross join (select id from public.docs_pages where slug = 'comms/workflows' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Workflows',
    description = 'Automate what happens when a conversation starts, a customer replies or a tag is added.'
where slug = 'comms/workflows' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'comms/workflows' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Creating a workflow</li><li>Triggers, conditions and actions</li><li>The workflow builder</li><li>Workflow templates</li><li>Run history</li></ul>',
  10
from public.docs_pages p
where p.slug = 'comms/workflows' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
