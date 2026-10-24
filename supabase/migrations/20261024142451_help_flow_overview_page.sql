-- Help flow overview page
--
-- One-time content move, like 20261023200049_help_flow_guide: rewrites the published Flow Overview now that every
-- Flow area has its own guide (20261024142437 to 20261024142450). Each headline area gets a section that links to its
-- guide, the playground card's facts move into section text, and the claims the area surveys found wrong are fixed
-- (no assignee emails from the tracker, Initiatives is a 3, 6 or 12 month timeline, Grounding has no mentions).
-- Existing anchors (start-here, opening-flow, project-areas, issue-tracker, shortcuts, grounding) are kept.
-- Written from a survey of C:\Pro\geiger-flow (components/internal/sidebar/projects/sidebar_data.js,
-- components/landing/playground/playground_session.jsx, components/internal/screens/it/*, geiger-ui.config.js)
-- and the area guides' surveys named in their own migration headers.
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set description = 'Flow is where your team plans and tracks work. Each project gets an issue tracker, tasks, milestones and goals, a planning board, reporting and its own chat.'
where slug = 'flow' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'flow' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, cards, features, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.cards::jsonb, v.features::jsonb, v.sort_order
from (
  values
    (
      'start-here',
      null,
      'Start here',
      '',
      '[{"icon":"FolderKanban","title":"Open a project","body":"Launch Flow from any project in your organization","href":"/org"},{"icon":"GitBranch","title":"Track issues","body":"Create, triage and ship in the issue tracker","href":"/help/flow/issues"},{"icon":"CirclePlay","title":"Try the playground","body":"Explore a sample project without signing up","href":"/flow/playground"}]',
      '[]',
      10
    ),
    (
      'opening-flow',
      'Basics',
      'Opening Flow',
      $html$<p>Flow works inside a <strong>project</strong>. Open your organization in Dash and launch Flow from one of its projects. Everything you create there belongs to that project, and everyone in your organization can open it.</p><p>The project sidebar lists its areas in this order: Overview, Issues, Tasks, Work Queue, Grounding, Planning, Projections, Milestones, Goals, Reporting, Objectives, Assets, Logs, Team, Resource Allocation, Vault, Externals, Security and Settings. Each add-on you turn on adds its own entry. <strong>Issues</strong> opens the issue tracker in a new browser tab, and every other area opens inside the project.</p><p>To hide areas you don't use, go to <strong>Settings → Navigation</strong>. That changes only your own sidebar, in that project. The <a href="/help/flow/settings#hiding-sidebar-sections">Project settings</a> guide covers it.</p>$html$,
      '[]',
      '[]',
      20
    ),
    (
      'trying-the-playground',
      'Basics',
      'Trying Flow in the playground',
      $html$<p>The <a href="/flow/playground">Flow playground</a> opens a sample project in Flow without an account, so you can click through its areas before you sign up.</p><p>Changes you make in the playground last until you reload the page, and add-ons start turned off. Anything the playground can't do shows "This isn't available in the playground."</p>$html$,
      '[]',
      '[]',
      30
    ),
    (
      'project-areas',
      'Areas',
      'What''s in a project',
      '<p>Each area in the project sidebar covers one part of running the project, and each has its own guide. The sections on this page sum them up and link to each one.</p>',
      '[]',
      '[{"icon":"LayoutDashboard","text":"Project overview: activity, deadlines, workload and top issues"},{"icon":"GitBranch","text":"Issue tracker: lists, boards, triage, cycles and divisions"},{"icon":"ListTodo","text":"Tasks and Work Queue: status, priority, stage and what''s due next"},{"icon":"Radio","text":"Grounding: direct messages, channels, threads and calls"},{"icon":"Waypoints","text":"Planning board: notes, images, files and calendars on a canvas"},{"icon":"CalendarRange","text":"Projections: releases, reviews and deadlines on a calendar"},{"icon":"Flag","text":"Milestones, goals and objectives with key results"},{"icon":"ChartColumn","text":"Reporting: time entries, workload and open work"},{"icon":"Images","text":"Assets: the project''s uploaded files and media"},{"icon":"Activity","text":"Logs: the project''s activity log"},{"icon":"Users","text":"Team and resource allocation"},{"icon":"KeyRound","text":"Vault and externals: shared secrets and outside links"},{"icon":"ShieldCheck","text":"Security: findings, access policies and keys"},{"icon":"Settings","text":"Settings: project details, your sidebar, add-ons and usage"}]',
      40
    ),
    (
      'issue-tracker',
      'Issues',
      'Issue tracker',
      $html$<p>Issues have their own tracker. Choosing <strong>Issues</strong> in the project sidebar opens it in a new browser tab, with Inbox, My Issues, and the project's Issues, Triage, Cycles, Divisions and Views.</p><ul><li><strong>Status</strong>: Backlog, Todo, In Progress, In Review, Done, Canceled or Duplicate</li><li><strong>Priority</strong>: Urgent, High, Medium, Low or No priority</li><li><strong>Properties</strong>: assignees, labels, division, cycle, estimate and due date</li></ul><p>Show issues as a list or a board, group them by status, assignee, priority, division, cycle or label, and filter on the same fields. An open issue is overdue the day after its due date.</p><p><strong>Cycles</strong> are the project's milestones, with issues planned into them. <strong>Divisions</strong> are its objectives, each with a lead, health and progress. <strong>Initiatives</strong> lays both out on a month-by-month timeline of 3, 6 or 12 months.</p><p>The <a href="/help/flow/issues">Issue tracker</a> guide covers everything you do with issues, and <a href="/help/flow/issues/cycles-and-divisions">Cycles, divisions and initiatives</a> covers planning them.</p>$html$,
      '[]',
      '[]',
      50
    ),
    (
      'tasks-and-work-queue',
      'Tasks',
      'Tasks and the Work Queue',
      $html$<p><strong>Tasks</strong> holds the project's planned work. Each task has a status (To Do, In Progress, Blocked or Done), a priority (Low, Medium, High or Critical), a type and a delivery stage, along with assignees, dates, progress and comments.</p><p><strong>Work Queue</strong> shows the same tasks as one list, ordered by due date, so the top is always what's due next. The <a href="/help/flow/tasks">Tasks</a> guide covers both.</p>$html$,
      '[]',
      '[]',
      60
    ),
    (
      'grounding',
      'Chat',
      'Grounding',
      $html$<p>Grounding is the project's own chat. Choosing <strong>Grounding</strong> in the sidebar opens direct messages and channels, with threads, replies, reactions and file attachments. You can start an audio or video call from any conversation, and message people from outside the project.</p><p>The <a href="/help/flow/grounding">Grounding</a> guide covers conversations, files, calls and notifications.</p>$html$,
      '[]',
      '[]',
      70
    ),
    (
      'planning-and-scheduling',
      'Planning',
      'Planning and scheduling',
      $html$<p>Three kinds of screen help you plan a project's work ahead of time.</p><ul><li><strong>Planning</strong> is a canvas of notes, links, comments, images, files and calendars that you arrange and connect, kept in as many planning files as you need. See <a href="/help/flow/planning">Planning board</a>.</li><li><strong>Projections</strong> puts milestones, releases, reviews and deadlines on a calendar you browse by month, week or day. See <a href="/help/flow/projections">Projections</a>.</li><li><strong>Milestones</strong> are dated checkpoints with a checklist of tasks, <strong>Goals</strong> are measurable targets with key results, and <strong>Objectives</strong> group goals on a board of their own. See <a href="/help/flow/goals">Milestones and goals</a>.</li></ul>$html$,
      '[]',
      '[]',
      80
    ),
    (
      'progress-and-reporting',
      'Reporting',
      'Progress and reporting',
      $html$<p>Three screens show how a project is going.</p><ul><li><strong>Overview</strong>, where a project opens, sums up recent activity, upcoming deadlines, workload, task status and the open issues to look at first. See <a href="/help/flow/project-overview">Project overview</a>.</li><li><strong>Reporting</strong> is where you log time, and it lists open tasks and issues, each person's workload and a weekly timesheet. See <a href="/help/flow/reporting">Reporting</a>.</li><li><strong>Logs</strong> is the project's activity log: what changed, who changed it and when, with filters and a CSV export. See <a href="/help/flow/logs">Logs</a>.</li></ul>$html$,
      '[]',
      '[]',
      90
    ),
    (
      'team-files-and-access',
      'Team',
      'Team, files and access',
      $html$<ul><li><strong>Team</strong> records who works on the project and their role, and <strong>Resource Allocation</strong> plans how much of each person's time the project takes. See <a href="/help/flow/team">Team and resources</a>.</li><li><strong>Assets</strong> holds the project's uploaded files and media, up to 25 MB each. See <a href="/help/flow/assets">Assets</a>.</li><li><strong>Vault</strong> keeps the project's passwords, API keys and other secrets, and <strong>Externals</strong> links the outside services the project uses.</li><li><strong>Security</strong> tracks security findings, access policies and the project's keys. See <a href="/help/flow/security">Security</a>.</li></ul>$html$,
      '[]',
      '[]',
      100
    ),
    (
      'settings-and-add-ons',
      'Settings',
      'Settings and add-ons',
      $html$<p><strong>Settings</strong> holds the project's name and description, how many rows its lists show, which areas appear in your own sidebar, its add-ons and its usage figures. See <a href="/help/flow/settings">Project settings</a>.</p><p>Add-ons are optional screens you turn on for the whole project under <strong>Settings → Add-ons</strong>, such as the System Architecture canvas and Budget Tracker. See <a href="/help/flow/add-ons">Add-ons</a>.</p>$html$,
      '[]',
      '[]',
      110
    ),
    (
      'shortcuts',
      'Reference',
      'Keyboard shortcuts',
      $html$<p>In the issue tracker, single-key shortcuts work anywhere except while you're typing in a field:</p><ul><li><code>Ctrl K</code> or <code>Ctrl /</code> (<code>⌘ K</code> or <code>⌘ /</code> on Mac) opens the command palette</li><li><code>C</code> creates an issue</li><li><code>G</code> then a letter goes to a view: <code>I</code> Inbox, <code>M</code> My Issues, <code>A</code> Issues, <code>T</code> Triage, <code>C</code> Cycles, <code>D</code> Divisions, <code>V</code> Views, <code>R</code> Initiatives, <code>S</code> Settings</li><li><code>J</code> and <code>K</code>, or the down and up arrows, move through an issue list, <code>X</code> selects the focused issue and <code>Enter</code> opens it</li><li><code>Esc</code> clears the selection, or clears and closes the search box</li></ul><p>The <a href="/help/flow/issues#shortcuts">Issue tracker</a>, <a href="/help/flow/tasks#shortcuts">Tasks</a>, <a href="/help/flow/grounding#shortcuts">Grounding</a> and <a href="/help/flow/planning#shortcuts">Planning board</a> guides each list their area's shortcuts.</p>$html$,
      '[]',
      '[]',
      120
    )
) as v(anchor_id, eyebrow, title, content, cards, features, sort_order)
cross join (select id from public.docs_pages where slug = 'flow' and deleted_at is null) p;

-- @down
-- Restores the Overview exactly as 20261023200049_help_flow_guide left it (it was never edited in Studio).
update public.docs_pages
set description = 'Flow is where your team plans and tracks work. Each project gets tasks, milestones and goals, a fast issue tracker, and Grounding, its built-in chat.'
where slug = 'flow' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'flow' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, cards, features, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.cards::jsonb, v.features::jsonb, v.sort_order
from (
  values
    (
      'start-here',
      null,
      'Start here',
      '',
      '[{"icon":"FolderKanban","title":"Open a project","body":"Launch Flow from any project in your organization","href":"/org"},{"icon":"SquareKanban","title":"Track issues","body":"Triage, prioritize and ship from the issue tracker","href":"#issue-tracker"},{"icon":"CirclePlay","title":"Try the playground","body":"Explore a sample project without signing up","href":"/flow/playground"}]',
      '[]',
      10
    ),
    (
      'opening-flow',
      'Basics',
      'Opening Flow',
      $html$<p>Flow works inside a <strong>project</strong>. Open your organization in Dash and launch Flow from one of its projects. Everything you create there belongs to that project.</p><p>The sidebar lists the project's areas, from Overview and Tasks to Milestones, Goals and Reporting. If your team doesn't use some of them, hide them under <strong>Settings → Navigation</strong>. That only changes your own sidebar.</p>$html$,
      '[]',
      '[]',
      20
    ),
    (
      'project-areas',
      'Workspace',
      'What''s in a project',
      '<p>Each area in the sidebar covers one part of running the project.</p>',
      '[]',
      '[{"icon":"ListTodo","text":"Tasks: status, priority, type and delivery stage"},{"icon":"Flag","text":"Milestones, goals and objectives with health tracking"},{"icon":"CalendarRange","text":"Projections: releases, reviews and deadlines on a calendar"},{"icon":"Shapes","text":"Planning: a free-form canvas for notes, images and files"},{"icon":"ChartColumn","text":"Reporting: time entries and progress across tasks and issues"},{"icon":"Users","text":"Team: invite members as Admin, Member or Viewer"},{"icon":"KeyRound","text":"Vault: passwords, API keys and other shared secrets"},{"icon":"ShieldCheck","text":"Security: policies, vulnerabilities and access events"}]',
      30
    ),
    (
      'issue-tracker',
      'Issues',
      'Issue tracker',
      $html$<p>Issues have their own fast tracker. Choosing <strong>Issues</strong> in the project sidebar opens it in a new tab, with Inbox, My Issues, and your team's Issues, Triage, Cycles, Divisions and Views.</p><ul><li><strong>Status:</strong> Backlog, Todo, In Progress, In Review, Done, Canceled or Duplicate</li><li><strong>Priority:</strong> Urgent, High, Medium, Low or No priority</li><li><strong>Properties:</strong> assignees, labels, division, cycle, estimate and due date</li></ul><p>Show issues as a list or a board, group them by status, assignee, priority, division, cycle or label, and filter on the same fields. Assigning someone sends them an email, and overdue issues are flagged.</p><p><strong>Cycles</strong> group issues toward a target date, <strong>Divisions</strong> track a body of work with a lead, health and progress, and <strong>Initiatives</strong> lay out the roadmap by quarter or month.</p>$html$,
      '[]',
      '[]',
      40
    ),
    (
      'shortcuts',
      'Issues',
      'Keyboard shortcuts',
      $html$<ul><li><code>Ctrl K</code> (<code>⌘ K</code> on Mac) opens the command palette</li><li><code>C</code> creates an issue</li><li><code>G</code> then a letter jumps to a view: <code>I</code> Inbox, <code>M</code> My Issues, <code>A</code> all issues, <code>T</code> Triage, <code>C</code> Cycles, <code>D</code> Divisions, <code>V</code> Views, <code>R</code> Initiatives, <code>S</code> Settings</li><li><code>J</code> / <code>K</code> or the arrow keys move through a list, <code>X</code> selects, <code>Enter</code> opens and <code>Esc</code> closes</li></ul>$html$,
      '[]',
      '[]',
      50
    ),
    (
      'grounding',
      'Chat',
      'Grounding',
      $html$<p>Grounding is the project's own chat. Choosing <strong>Grounding</strong> in the sidebar opens direct messages and channels, with threaded replies, reactions, mentions and attachments.</p><p>It also has audio calls and video meetings, a shared files view, and external contacts for talking with people outside your team.</p>$html$,
      '[]',
      '[]',
      60
    )
) as v(anchor_id, eyebrow, title, content, cards, features, sort_order)
cross join (select id from public.docs_pages where slug = 'flow' and deleted_at is null) p;
