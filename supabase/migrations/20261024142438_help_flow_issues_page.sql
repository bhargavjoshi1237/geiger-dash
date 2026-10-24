-- Help flow issues page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the flow/issues draft outline with the
-- full Issue tracker guide and publishes it, and adds its one child page, flow/issues/cycles-and-divisions (Cycles,
-- divisions & initiatives). No Flow showcase covers the tracker yet, so neither page embeds one.
-- Written from a survey of C:\Pro\geiger-flow (components/internal/sidebar/projects/project_sidebar.jsx,
-- app/it/[id]/page.js, components/internal/screens/it/* and views/*, features/issues/actions.js and constants.js,
-- features/milestones/actions.js, features/objectives/actions.js and constants.js) and of @geiger/ui's
-- useCommandShortcut (C:\Pro\geiger-ui\src\ui\command-palette.jsx).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Issue tracker',
    description = 'Create, triage and track a project''s issues: statuses and priorities, list and board layouts, filters, comments, views and shortcuts.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'flow/issues' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'flow/issues' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, showcase, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.showcase, v.sort_order
from (
  values
    (
      'opening-the-tracker',
      'Basics',
      'Opening the issue tracker',
      $html$<p>Issues live in their own tracker. Open a project in Flow and choose <strong>Issues</strong> in the sidebar: the tracker opens in a new browser tab, on the project's full issue list.</p><p>The tracker's sidebar holds everything else:</p><ul><li><strong>Search</strong>, <strong>Inbox</strong> and <strong>My Issues</strong>, your own starting points.</li><li><strong>Initiatives</strong>, <strong>Divisions</strong>, <strong>Views</strong> and <strong>Members</strong>, under <strong>Workspace</strong>.</li><li><strong>Issues</strong>, <strong>Triage</strong>, <strong>Cycles</strong>, <strong>Divisions</strong> and <strong>Views</strong>, under the project's key. Click the key to fold them away.</li><li><strong>Settings</strong>, at the bottom.</li></ul><p>The address bar keeps the view you're on and the issue you have open, so a refresh or a shared link lands in the same place. The tracker loads the project's issues, cycles and divisions when it opens, so reload it to see changes made elsewhere. To leave, open the menu under the project's name at the top and choose <strong>Back to Geiger Flow</strong>.</p>$html$,
      '[]',
      null,
      10
    ),
    (
      'creating-an-issue',
      'Basics',
      'Creating an issue',
      $html$<p>To create an issue, press <code>C</code> anywhere in the tracker, or choose <strong>New</strong> at the top of an issue list. Only the title is required: Flow won't create an issue without one.</p><ul><li><strong>Issue title</strong> and <strong>Add description</strong>: what the issue is about. The description is plain text.</li><li><strong>Status</strong>: new issues start in Backlog.</li><li><strong>Priority</strong>: new issues start with No priority.</li><li><strong>Assignee</strong>: pick one or more people from your organization.</li><li><strong>Label</strong>: pick an existing label, or type a new one and press <code>Enter</code>.</li><li><strong>Division</strong> and <strong>Cycle</strong>: optionally, where the issue belongs.</li></ul><p>Choose <strong>Create issue</strong>, or press <code>Enter</code> in the title. The issue gets the next ID in the project and opens in its details, where you set its estimate and due date.</p><p>The <strong>+</strong> beside a group's heading creates an issue already set to that group's value. In a list grouped by status, the <strong>+</strong> beside In Progress starts the issue as In Progress. An issue left in Backlog with nobody assigned also shows up in Triage.</p>$html$,
      '[]',
      null,
      20
    ),
    (
      'status-and-priority',
      'Concepts',
      'Status and priority',
      $html$<p>Every issue has a status and a priority, each from a fixed set.</p><ul><li><strong>Status</strong>, in workflow order: Backlog, Todo, In Progress, In Review, Done, Canceled or Duplicate. Done, Canceled and Duplicate close an issue.</li><li><strong>Priority</strong>, highest first: Urgent, High, Medium, Low or No priority. Ordering by priority puts No priority last.</li></ul><p>A closed issue counts as completed in cycle, division and member progress, and is never overdue. An open issue becomes <strong>overdue</strong> the day after its due date, and its due date is highlighted wherever it shows.</p><p>Each issue has an ID made of the project's key and a number, like <code>APP-12</code>. Numbers count up within the project, and the tracker's settings show the key as the <strong>Issue prefix</strong>.</p>$html$,
      '[]',
      null,
      30
    ),
    (
      'issue-list',
      'Issues',
      'The issue list',
      $html$<p>Choose <strong>Issues</strong> under the project's key to see every issue in the project. The tabs at the top narrow it: <strong>All issues</strong>, <strong>Active</strong> (In Progress and In Review) and <strong>Backlog</strong>, each with its count. The list starts grouped by status and ordered by priority.</p><p>Each row shows the issue's priority, ID, status and title, then its labels, division, due date and assignees. Click a row to open the issue. A few things change without opening it:</p><ul><li>Click the priority or status icon to pick a new one.</li><li>Click the assignee avatars to add or remove people.</li><li>Right-click a row for <strong>Status</strong>, <strong>Priority</strong>, <strong>Assignees</strong>, <strong>Labels</strong> (once the project has any), <strong>Division</strong>, <strong>Cycle</strong>, <strong>Copy ID</strong> and <strong>Delete</strong>.</li></ul><p>Changes made from the list save straight away. When the project has no issues yet, choose <strong>New issue</strong> to create the first one.</p>$html$,
      '[]',
      null,
      40
    ),
    (
      'searching-and-filtering',
      'Issues',
      'Searching and filtering',
      $html$<p>To search, click the search icon at the top of Issues, My Issues or a view. The box matches issue titles, descriptions and labels. <code>Esc</code> or the × clears and closes it.</p><p>To filter, choose <strong>Filter</strong> under the header, pick a field, then select one or more values. The menu stays open so you can pick several. The fields are <strong>Status</strong>, <strong>Priority</strong>, <strong>Assignee</strong> (including <strong>No assignee</strong>), <strong>Label</strong>, <strong>Division</strong> and <strong>Cycle</strong>. Triage has the same filters.</p><p>Each filter shows as a chip, like "Status is any of Todo, In Progress". An issue has to match every chip, and any one of the values in a chip. Click a chip's values to change them and the × on a chip to remove it. Choose <strong>Add filter</strong> for another field, or <strong>Reset</strong> to clear them all.</p><p>Search and filters apply to the list you're on, and reset when you switch to another view or reload the page.</p>$html$,
      '[]',
      null,
      50
    ),
    (
      'grouping-and-layout',
      'Issues',
      'Grouping, ordering and layout',
      $html$<p>Choose <strong>Display</strong> at the top of an issue list to change how it's laid out. Your choices apply to that list only, and reset when you leave it or reload the page.</p><ul><li><strong>List</strong> or <strong>Board</strong>: rows, or a column for each group. List is the default.</li><li><strong>Grouping</strong>: Status (the default), Assignee, Priority, Division, Cycle, Label or No grouping. Empty groups are hidden, and an issue with several assignees or labels appears under each one.</li><li><strong>Ordering</strong>: Status, Priority (the default), Last created, Last updated, Due date (earliest first, undated last) or Title. Ties go to the higher priority, then the newer issue.</li><li><strong>Show completed</strong>: turn it off to hide Done, Canceled and Duplicate issues.</li><li><strong>Display properties</strong>: the details each row shows. Priority, ID, Status, Labels, Division, Due date, Links and Assignee start on; Cycle, Estimate and Created start off.</li></ul><p>On the board, drag a card to another column to change the value the board is grouped by. Dropping it on an assignee or label column replaces the issue's assignees or labels with that one. With No grouping, dragging changes nothing. The <strong>+</strong> at the top of a column creates an issue in that column.</p>$html$,
      '[]',
      null,
      60
    ),
    (
      'bulk-changes',
      'Issues',
      'Changing several issues at once',
      $html$<p>To select issues in the list layout, hover over a row and select the checkbox at its left, or press <code>X</code> on the focused row. Once one is selected, a bar at the bottom shows how many, with <strong>Status</strong>, <strong>Priority</strong>, <strong>Assignee</strong>, <strong>Labels</strong> and <strong>Delete</strong>.</p><ul><li><strong>Status</strong> and <strong>Priority</strong> set the value you pick on every selected issue.</li><li><strong>Assignee</strong> and <strong>Labels</strong> replace each issue's assignees or labels with the one you pick. <strong>No assignee</strong> clears the assignees.</li><li><strong>Delete</strong> deletes every selected issue straight away, without asking.</li></ul><p>The selection clears after a change. To clear it yourself, click the × at the end of the bar or press <code>Esc</code>.</p>$html$,
      '[]',
      null,
      70
    ),
    (
      'issue-details',
      'Issues',
      'Issue details',
      $html$<p>Click an issue to open its details. Edit the title and description in place: each saves when you click away, and an emptied title goes back to what it was. Every property on the right saves as soon as you pick it, so there is no Save button.</p><ul><li><strong>Status</strong> and <strong>Priority</strong>.</li><li><strong>Assignees</strong>: pick as many people as you need, or <strong>No assignee</strong> to clear them.</li><li><strong>Labels</strong>: pick existing labels, or type a new one and press <code>Enter</code>.</li><li><strong>Division</strong> and <strong>Cycle</strong>: choose <strong>No division</strong> or <strong>No cycle</strong> to take the issue out of one.</li><li><strong>Estimate</strong>: 1, 2, 3, 5, 8 or 13 points, or <strong>No estimate</strong>.</li><li><strong>Due date</strong>: highlighted once the issue is overdue.</li></ul><p>Under the properties, the issue shows when it was created and by whom, and when it was last updated. The arrows at the top move to the next or previous issue in the project. The × or <strong>Issues</strong> at the top left closes the details.</p>$html$,
      '[]',
      null,
      80
    ),
    (
      'comments',
      'Issues',
      'Comments',
      $html$<p>An issue's comments sit under its description, oldest first. Write in the <strong>Leave a comment</strong> box and choose <strong>Comment</strong>. The button stays disabled until there's some text.</p><p>To delete one of your own comments, hover over it and click the trash icon. It's deleted straight away, without asking, and can't be restored. Comments can't be edited in the tracker.</p>$html$,
      '[]',
      null,
      90
    ),
    (
      'duplicating-and-deleting',
      'Issues',
      'Duplicating and deleting',
      $html$<p>The <strong>•••</strong> menu at the top of an issue's details has:</p><ul><li><strong>Copy ID</strong> and <strong>Copy link</strong>, which copy the issue's ID or its address.</li><li><strong>Duplicate</strong>, which creates a copy with "(copy)" after the title. The copy starts as Todo, gets the next ID, and keeps the description, priority, labels, assignees, estimate and due date. It isn't added to a cycle or division, and the original stays open.</li><li><strong>Delete</strong>, which deletes the issue and closes its details.</li></ul><p>Deleting happens straight away, without asking, whether you use this menu, a row's right-click menu or the selection bar. A deleted issue can't be restored from Flow.</p>$html$,
      '[]',
      null,
      100
    ),
    (
      'inbox',
      'Inbox',
      'Inbox and My Issues',
      $html$<p><strong>Inbox</strong> collects what needs attention in the project, newest first.</p><ul><li><strong>Priority</strong> tab: <strong>Assigned to you</strong> (your open issues), <strong>Overdue</strong> (every overdue issue in the project) and <strong>In review</strong> (every issue In Review).</li><li><strong>Other</strong> tab: <strong>Needs triage</strong> (issues in Backlog with nobody assigned) and <strong>Activity</strong> (the 40 latest entries in the project's activity log).</li></ul><p>Click an entry to read it. An issue opens beside the list, ready to edit. A dot marks entries you haven't opened yet. <strong>Mark all read</strong> clears the dots, but read marks aren't saved, so they come back when you leave Inbox or reload the page.</p><p><strong>My Issues</strong> lists the issues assigned to you on its <strong>Assigned</strong> tab and the ones you created on <strong>Created</strong>, with the same search, filters and display options as the issue list.</p>$html$,
      '[]',
      null,
      110
    ),
    (
      'triage',
      'Triage',
      'Triage',
      $html$<p><strong>Triage</strong>, under the project's key, holds the issues that are in Backlog with nobody assigned, and its count in the sidebar shows how many are waiting. They're grouped by priority and ordered newest first, and you can filter them and change the display like any issue list.</p><p>An issue leaves Triage once it has an assignee or moves out of Backlog. Change issues one at a time from their rows or details, or use the bar at the bottom:</p><ul><li><strong>Accept all into Todo</strong> moves every issue in Triage to Todo.</li><li><strong>Decline all</strong> moves every issue in Triage to Canceled.</li></ul><p>Both act on the whole queue, including issues a filter hides, and neither asks first.</p>$html$,
      '[]',
      null,
      120
    ),
    (
      'views',
      'Views',
      'Views',
      $html$<p><strong>Views</strong> are ready-made filters over the project's issues, each listed with its count:</p><ul><li><strong>Active</strong>: everything In Progress or In Review.</li><li><strong>Urgent & high</strong>: open issues with Urgent or High priority.</li><li><strong>Unassigned</strong>: open issues with nobody on them.</li><li><strong>Overdue</strong>: open issues past their due date.</li><li><strong>Needs estimate</strong>: open issues without an estimate.</li><li><strong>Recently completed</strong>: closed issues last changed in the past 14 days.</li></ul><p>Click a view to open its issues, with search, filters and display options at the top. Choose <strong>Views</strong> at the top to go back. The tracker doesn't save views of your own.</p>$html$,
      '[]',
      null,
      130
    ),
    (
      'members',
      'Members',
      'Members',
      $html$<p><strong>Members</strong> lists everyone in your organization with their issues in this project: <strong>Open</strong>, <strong>Started</strong> (In Progress or In Review), <strong>Done</strong> (closed), <strong>Overdue</strong>, and a ring showing the share that's closed. People with the most open issues come first.</p><p>Click a member to list the issues assigned to them, then click an issue to open it. <strong>Invite & manage members</strong>, in the menu under the project's name, opens this list too. The list comes from your organization's members, so to add someone, add them to the organization in Dash.</p>$html$,
      '[]',
      null,
      140
    ),
    (
      'tracker-settings',
      'Reference',
      'Tracker settings',
      $html$<p><strong>Settings</strong>, at the bottom of the tracker's sidebar, is a read-only summary of how the tracker is set up. <strong>Workspace settings</strong>, in the menu under the project's name, opens it too.</p><ul><li><strong>Workspace</strong>: the project's name, its <strong>Issue prefix</strong>, and how many issues, divisions and cycles it has.</li><li><strong>Workflow</strong>: each status with its group (backlog, unstarted, started, completed or canceled) and how many issues are in it.</li><li><strong>Priorities</strong>: each priority, highest first, with its count.</li><li><strong>Labels</strong>: every label in use, with its count. Labels are created by typing them on an issue, each one's color comes from its name, and a label stays listed while an issue uses it.</li><li><strong>Members</strong>: everyone in the organization, with their email.</li></ul>$html$,
      '[]',
      null,
      150
    ),
    (
      'shortcuts',
      'Reference',
      'Keyboard shortcuts',
      $html$<p>Single-key shortcuts work anywhere in the tracker, except while you're typing in a field.</p><ul><li><code>Ctrl K</code> or <code>Ctrl /</code> (<code>⌘ K</code> or <code>⌘ /</code> on Mac) opens the command palette, to go to a view or find one of the 60 most recently created issues by title or ID</li><li><code>C</code> creates an issue</li><li><code>G</code> followed within a second by a letter goes to a view: <code>I</code> Inbox, <code>M</code> My Issues, <code>A</code> Issues, <code>T</code> Triage, <code>C</code> Cycles, <code>D</code> Divisions, <code>V</code> Views, <code>R</code> Initiatives, <code>S</code> Settings</li><li><code>J</code> and <code>K</code>, or the down and up arrows, move through an issue list</li><li><code>X</code> selects the focused issue, and <code>Enter</code> opens it</li><li><code>Esc</code> clears the selection, or clears and closes the search box</li><li><code>Enter</code> in a label picker adds the label you typed</li></ul>$html$,
      '[]',
      null,
      160
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"Repeat","label":"Cycles, divisions & initiatives","href":"/help/flow/issues/cycles-and-divisions"},{"icon":"ListTodo","label":"Tasks","href":"/help/flow/tasks"},{"icon":"Flag","label":"Milestones & goals","href":"/help/flow/goals"},{"icon":"ChartColumn","label":"Reporting","href":"/help/flow/reporting"},{"icon":"Activity","label":"Logs","href":"/help/flow/logs"},{"icon":"LayoutDashboard","label":"Project overview","href":"/help/flow/project-overview"}]',
      null,
      170
    )
) as v(anchor_id, eyebrow, title, content, links, showcase, sort_order)
cross join (select id from public.docs_pages where slug = 'flow/issues' and deleted_at is null) p;

-- Child page: Cycles, divisions & initiatives, under the Issue tracker (one level deep, same group).
insert into public.docs_pages (nav_group_id, parent_id, slug, title, nav_label, description, status, published_at, sort_order)
select parent.nav_group_id, parent.id, 'flow/issues/cycles-and-divisions', 'Cycles, divisions & initiatives', 'Cycles & divisions',
  'Plan issues into cycles and divisions, follow their progress and health, and see both on the Initiatives timeline.',
  'published', now(), 10
from public.docs_pages parent
where parent.slug = 'flow/issues' and parent.deleted_at is null
on conflict (slug) where deleted_at is null do nothing;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'flow/issues/cycles-and-divisions' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, showcase, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.showcase, v.sort_order
from (
  values
    (
      'cycles',
      'Cycles',
      'Cycles',
      $html$<p>A <strong>cycle</strong> is a dated window of work in the issue tracker, and an issue joins it through its <strong>Cycle</strong> property. Each cycle is one of the project's milestones, so a cycle you create in the tracker also appears on Flow's <strong>Milestones</strong> screen, and every milestone shows up in the tracker as a cycle.</p><p>To create one, choose <strong>Cycles</strong> under the project's key in the tracker, then <strong>New cycle</strong>. Only the <strong>Name</strong> is required, and <strong>Ends</strong> sets the cycle's end date. Choose <strong>Create cycle</strong>.</p><p>The tabs sort cycles by their end date:</p><ul><li><strong>Active</strong>: the cycle that ends next, today or later, opened straight away. When no cycle has an end date ahead, the first cycle without one.</li><li><strong>Upcoming</strong>: the dated cycles after the active one, then any without an end date.</li><li><strong>Completed</strong>: cycles whose end date has passed, most recent first.</li></ul><p>Each cycle in a list shows its end date, how many of its issues are closed and its percentage. Click one to open it.</p>$html$,
      '[]',
      null,
      10
    ),
    (
      'cycle-progress',
      'Cycles',
      'Cycle progress',
      $html$<p>An open cycle shows its progress at the top. The chart plots <strong>Completed</strong> issues against <strong>Scope</strong> (all of the cycle's issues) from the day the cycle was created to its end date. Beside the chart, <strong>Scope</strong> counts the cycle's issues, <strong>Started</strong> the ones In Progress or In Review, <strong>Completed</strong> the closed ones, and <strong>Points</strong> adds up their estimates.</p><p>The ring and percentage show the share of the cycle's issues that are closed (Done, Canceled or Duplicate). The issues are listed underneath, grouped by status, and the <strong>+</strong> beside a group creates an issue that's already in the cycle.</p><p>Cycles can't be renamed or deleted in the tracker. Edit or delete them as milestones in Flow, as the <a href="/help/flow/goals">Milestones & goals</a> guide describes.</p>$html$,
      '[]',
      null,
      20
    ),
    (
      'divisions',
      'Divisions',
      'Divisions',
      $html$<p>A <strong>division</strong> is a section of the project with its own summary, target date and health, and an issue joins it through its <strong>Division</strong> property. Each division is one of the project's objectives, so divisions also appear on Flow's <strong>Objectives</strong> screen, and every objective shows up in the issue tracker as a division.</p><p>To create one, choose <strong>Divisions</strong> in the tracker's sidebar, then <strong>New division</strong>. Only the <strong>Name</strong> is required. <strong>Summary</strong> and <strong>Target date</strong> are optional. Choose <strong>Create division</strong>. A new division starts with Backlog health.</p><p>The list shows each division's health, progress and target date, and a target date that has passed is highlighted. A division's progress is its own progress when one is set in Objectives, and otherwise the share of its issues that are closed.</p>$html$,
      '[]',
      null,
      30
    ),
    (
      'division-health',
      'Divisions',
      'Division health and details',
      $html$<p>A division's health is Backlog, On track, At risk or Completed. Click the health pill, in the list or on the division itself, to move it to the next one. After Completed it goes back to Backlog. Each change saves straight away. Flow's Objectives screen shows the same values as Not Started, On Track, At Risk and Completed.</p><p>Click a division to open it. The top shows its summary, health, lead, target date and how many of its issues are closed. The issues are listed underneath, grouped by status, and the <strong>+</strong> beside a group creates an issue that's already in the division.</p><p>The lead is the objective's owner. Divisions can't be renamed or deleted in the tracker: change them, and set the owner, as objectives in Flow. The <a href="/help/flow/goals">Milestones & goals</a> guide covers objectives.</p>$html$,
      '[]',
      null,
      40
    ),
    (
      'initiatives',
      'Initiatives',
      'Initiatives',
      $html$<p><strong>Initiatives</strong>, in the issue tracker's sidebar, is the project's roadmap: every division and cycle as a bar on a month-by-month timeline, listed by start date. Choose <strong>3m</strong>, <strong>6m</strong> (the default) or <strong>12m</strong> to set how many months it covers, starting with last month. A line marks today.</p><ul><li>A division's bar runs from its start date, or the day it was created, to its target date.</li><li>A cycle's bar runs from the day it was created to its end date.</li><li>Without an end date, a bar runs for 30 days.</li></ul><p>The filled part of each bar shows its progress. A bar is highlighted when its end date has passed and it hasn't reached 100%. Click a name on the left to open that division or cycle.</p>$html$,
      '[]',
      null,
      50
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"GitBranch","label":"Issue tracker","href":"/help/flow/issues"},{"icon":"Flag","label":"Milestones & goals","href":"/help/flow/goals"},{"icon":"ChartColumn","label":"Reporting","href":"/help/flow/reporting"}]',
      null,
      60
    )
) as v(anchor_id, eyebrow, title, content, links, showcase, sort_order)
cross join (select id from public.docs_pages where slug = 'flow/issues/cycles-and-divisions' and deleted_at is null) p;

-- @down
-- The child page goes with its blocks (on delete cascade).
delete from public.docs_pages where slug = 'flow/issues/cycles-and-divisions';

update public.docs_pages
set title = 'Issue tracker',
    description = 'Triage, prioritize and ship issues with lists, boards, cycles and views.',
    status = 'draft',
    published_at = null
where slug = 'flow/issues' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'flow/issues' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Opening the tracker</li><li>Statuses and priorities</li><li>List and board layouts</li><li>Grouping, ordering and filters</li><li>Issue properties</li><li>Cycles, divisions and initiatives</li><li>Inbox and My Issues</li><li>Keyboard shortcuts</li></ul>',
  10
from public.docs_pages p
where p.slug = 'flow/issues' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
