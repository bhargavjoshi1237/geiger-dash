-- Help flow project overview page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the flow/project-overview draft outline
-- (added by 20261024142436_help_flow_structure) with the full guide to the project's Overview screen and publishes it.
-- Written from a survey of C:\Pro\geiger-flow (components/internal/screens/projects/overview/*,
-- components/internal/shared/deadlines.jsx, app/project/[id]/page.js, context/project-context.js,
-- context/nav-visibility-context.js, components/internal/sidebar/projects/*, components/internal/sidebar/sidebar_option.jsx,
-- features/issues/constants.js, features/milestones/constants.js, features/tasks/constants.js).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Project overview',
    description = 'See how a project is doing: recent activity, upcoming deadlines, workload, task status and the open issues that need attention first.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'flow/project-overview' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'flow/project-overview' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, showcase, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.showcase, v.sort_order
from (
  values
    (
      'opening-the-overview',
      'Basics',
      'Opening the project overview',
      $html$<p><strong>Overview</strong> is the first entry in a project's sidebar in Flow, and the screen a project opens on. It sums up the work from the project's other screens and is read-only: you change tasks, issues and milestones on their own screens. Overview loads the latest figures each time you open it.</p><p>The top of the screen shows the project's name, a badge with its first tag (or its status when it has no tags) and its description. Change the name and description under <strong>Settings → General</strong>, covered in <a href="/help/flow/settings">Project settings</a>.</p><p>Beside the name, three counts cover the whole project: <strong>Members</strong> (the people on the project's <strong>Team</strong> screen), <strong>Goals</strong> and <strong>Milestones</strong>.</p>$html$,
      '[]',
      null,
      10
    ),
    (
      'moving-around',
      'Basics',
      'Moving around a project',
      $html$<p>Choose an entry in a project's sidebar to open that screen. The page address keeps the screen you're on, so refreshing the page or sharing the link opens the same screen.</p><ul><li><strong>Issues</strong> opens the <a href="/help/flow/issues">issue tracker</a> in a new browser tab.</li><li><strong>Grounding</strong> opens the project's chat inside Flow. To give the chat a tab of its own, hover over the entry and click the new-tab icon at its right edge.</li><li><strong>Settings</strong> expands to its tabs: General, Connections, Customs, Navigation, Add-ons, Usage, Advanced and Enterprise.</li><li>Each add-on you turn on adds its own entry. See <a href="/help/flow/add-ons">Add-ons</a>.</li></ul><p>The button at the bottom of the sidebar collapses it to icons. Hover over an icon to see its name.</p><p>To hide entries you don't use, go to <strong>Settings → Navigation</strong>, covered in <a href="/help/flow/settings">Project settings</a>. That changes only your own sidebar in that project.</p>$html$,
      '[]',
      null,
      20
    ),
    (
      'time-range',
      'Concepts',
      'The time range',
      $html$<p>The time range menu at the top right of the project overview sets the window for its activity charts: <strong>Last 1 week</strong> (the default), <strong>Last 1 month</strong>, <strong>Last 3 months</strong> or <strong>Last 1 year</strong>. Overview goes back to Last 1 week each time you open it.</p><p>The range applies to the four activity cards, to <strong>Tasks handled</strong> in Resource Performance and to Progress. The cards and Progress split the range into 12 equal periods, and the trend under a chart compares the second half of the range with the first half.</p><p>The member, goal and milestone counts, Upcoming Deadlines, <strong>Allocation</strong>, Task Breakout by Status and Top Issues always cover the whole project.</p><p>Flow dates finished work by its last change. A task, issue or goal that was finished earlier and edited this week counts in this week's range.</p>$html$,
      '[]',
      null,
      30
    ),
    (
      'activity-cards',
      'Overview',
      'Activity cards',
      $html$<p>Four cards across the top of the project overview count the work done in the time range. Each card shows a total and a line across the range, with dates under it.</p><ul><li><strong>Productivity</strong>: entries in the project's activity log, the record shown on the <a href="/help/flow/logs">Logs</a> screen.</li><li><strong>New Features</strong>: goals whose status is Completed.</li><li><strong>Issues Solved</strong>: issues closed as Resolved, Done, Canceled or Duplicate.</li><li><strong>PR Merged</strong>: tasks whose status is Done. It counts tasks, not pull requests.</li></ul>$html$,
      '[]',
      null,
      40
    ),
    (
      'upcoming-deadlines',
      'Overview',
      'Upcoming deadlines',
      $html$<p>Upcoming Deadlines on the project overview shows the project's milestones that have a target date: the four with the earliest dates, including any whose date has passed. Choose <strong>View Schedule</strong> to open <strong>Milestones</strong>, where you add and change them (see <a href="/help/flow/goals">Milestones and goals</a>).</p><p>Each card shows:</p><ul><li>A priority badge set by the time left. It reads Critical at 3 days or less (including overdue), High at 4 to 14 days, Medium at 15 to 30 days and Low beyond 30 days.</li><li>The milestone's progress: the share of its tasks that are Done, as a percentage and a bar.</li><li><strong>Time Left</strong>, such as 5 days left, Due today or 2 days overdue, and the <strong>Due Date</strong>.</li><li>The milestone's owner (or Unassigned) and how many of its tasks are done, like <code>3/5 tasks</code>.</li></ul><p>Until a milestone has a target date, the section shows No deadlines yet.</p>$html$,
      '[]',
      null,
      50
    ),
    (
      'charts',
      'Overview',
      'Workload and progress charts',
      $html$<p>Three charts sit below Upcoming Deadlines on the project overview. Each has a menu at its top right that switches what it shows.</p><ul><li><strong>Resource Performance</strong> draws one ring per person, with the largest value in the middle. <strong>Tasks handled</strong> (the default) counts each person's assigned tasks that were created or changed in the time range. A task with several assignees counts for each of them, and tasks with nobody assigned count as Unassigned. <strong>Allocation</strong> shows each person's highest allocation in Resource Allocation, from 0% to 100%, across the whole project.</li><li><strong>Progress</strong> plots <strong>Tasks completed</strong> (the default), <strong>Issues closed</strong> or <strong>Activity</strong> (activity log entries) across the 12 periods of the time range, with the total and the trend under it.</li><li><strong>Task Breakout by Status</strong> groups every task in the project by status: To Do, In Progress, Blocked or Done. Hover over a slice, or pick a status from the chart's menu, to see its count and its share of all tasks.</li></ul>$html$,
      '[]',
      null,
      60
    ),
    (
      'top-issues',
      'Overview',
      'Top issues',
      $html$<p>Top Issues on the project overview lists up to five open issues: anything not Resolved, Done, Canceled or Duplicate. The highest priority comes first (Urgent, Critical, High, Medium, Low, then no priority), and the earliest due date comes first when priorities match. Each row shows the issue's priority, title, status and due date.</p><p>Choose <strong>View Issues</strong> to go to the project's issues. Until the project has an issue, the list shows No issues yet.</p>$html$,
      '[]',
      null,
      70
    ),
    (
      'project-not-found',
      'Troubleshooting',
      'Project not found',
      $html$<p>Flow shows <strong>Project not found</strong> instead of a project when the link you followed doesn't match a project, for example because the address was mistyped or cut off. The message names the project id from the link.</p><ol><li>Go to <a href="/org">your organization in Dash</a>.</li><li>Open the project, then launch Flow from it.</li></ol>$html$,
      '[]',
      null,
      80
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"Flag","label":"Milestones & goals","href":"/help/flow/goals"},{"icon":"GitBranch","label":"Issue tracker","href":"/help/flow/issues"},{"icon":"ListTodo","label":"Tasks","href":"/help/flow/tasks"},{"icon":"Activity","label":"Logs","href":"/help/flow/logs"},{"icon":"Users","label":"Team & resources","href":"/help/flow/team"},{"icon":"Settings","label":"Project settings","href":"/help/flow/settings"}]',
      null,
      90
    )
) as v(anchor_id, eyebrow, title, content, links, showcase, sort_order)
cross join (select id from public.docs_pages where slug = 'flow/project-overview' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Project overview',
    description = 'The project''s home screen: its details, progress and what needs attention.',
    status = 'draft',
    published_at = null
where slug = 'flow/project-overview' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'flow/project-overview' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Project details</li><li>Progress and activity</li><li>Jumping to issues and the schedule</li></ul>',
  10
from public.docs_pages p
where p.slug = 'flow/project-overview' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
