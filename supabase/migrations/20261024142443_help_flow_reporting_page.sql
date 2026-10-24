-- Help flow reporting page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the flow/reporting draft outline with the
-- full Reporting guide and publishes it.
-- Written from a survey of C:\Pro\geiger-flow (components/internal/screens/reporting/*, features/time_entries/*,
-- components/internal/shared/pagination.jsx, features/tasks/constants.js, features/issues/constants.js).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Reporting',
    description = 'Log time against a project, then see its open tasks and issues, each person''s workload and a weekly timesheet.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'flow/reporting' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'flow/reporting' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, showcase, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.showcase, v.sort_order
from (
  values
    (
      'logging-time',
      'Basics',
      'Logging time',
      $html$<p>To log time on a project, choose <strong>Reporting</strong> in the project's sidebar, then <strong>Log time</strong>. Only the description is required: <strong>Log time</strong> stays disabled until <strong>What did you work on?</strong> has text.</p><ul><li><strong>What did you work on?</strong>: a short description of the work.</li><li><strong>Task</strong>: optionally, one of the project's tasks to link the time to. It starts at <strong>No linked task</strong> and appears only once the project has tasks. When you pick a task, the dialog shows its current status.</li><li><strong>Date</strong>: the day you did the work. It starts at today.</li><li><strong>Hours</strong> and <strong>Minutes</strong>: how long it took. They start at 1 and 0.</li><li><strong>Billable</strong>: on by default. Turn it off for internal time.</li><li><strong>Notes</strong>: optional context for the timesheet.</li></ul><p>Choose <strong>Log time</strong> to save the entry. It appears in the <strong>Time</strong> view straight away, and the project's <a href="/help/flow/logs">Logs</a> record it. A time entry can't be edited once it's logged: to correct one, delete it and log it again.</p>$html$,
      '[]',
      null,
      10
    ),
    (
      'summary-figures',
      'Reporting',
      'Summary figures',
      $html$<p>The four figures across the top of Reporting cover all of the project's tasks and issues. The view, search and filter don't change them.</p><ul><li><strong>Open items</strong>: tasks and issues that are still open. A task stays open until it's Done.</li><li><strong>Due soon</strong>: open items due within the next 7 days, including any already past their due date.</li><li><strong>Completion</strong>: the share of all tasks and issues that are done.</li><li><strong>Time logged</strong>: the total of every time entry, with the number of entries under it.</li></ul>$html$,
      '[]',
      null,
      20
    ),
    (
      'tasks-view',
      'Reporting',
      'The Tasks view',
      $html$<p>Reporting has three views: <strong>Tasks</strong> (the default), <strong>Workload</strong> and <strong>Time</strong>. Switch between them with the buttons above the list.</p><p>The Tasks view lists every task and issue in the project in one table, with its <strong>Kind</strong>, <strong>Owner</strong> (the first assignee, or Unassigned), <strong>Status</strong>, <strong>Priority</strong>, <strong>Due</strong> date and <strong>Progress</strong>. Progress applies only to tasks, so issues show a dash. Narrow the list to <strong>All kinds</strong>, <strong>Tasks</strong> or <strong>Issues</strong> with the menu beside the views, or type in the search box to match titles, kinds and statuses.</p><p>The table is for reading. To change a task or an issue, open it in <a href="/help/flow/tasks">Tasks</a> or the <a href="/help/flow/issues">issue tracker</a>.</p><p>The list starts at the project's default rows per page, 10 unless it's changed under <strong>Settings → General → Default rows per page</strong>. Switch to 10, 25, 50 or 100 at the bottom.</p>$html$,
      '[]',
      null,
      30
    ),
    (
      'workload-view',
      'Reporting',
      'The Workload view',
      $html$<p>The Workload view in Reporting shows each person's open work, with the person who has the most open items first. Only tasks and issues that are still open count.</p><ul><li><strong>Open items</strong>: how many open tasks and issues the person is assigned, and how many of those are overdue (their due date has passed). An item with several assignees counts for each of them, and items with nobody assigned are grouped as Unassigned.</li><li><strong>Load</strong>: a bar comparing the person's open items with whoever has the most.</li><li><strong>Logged</strong>: the total of the time entries recorded against the person.</li></ul><p>In this view, the search box matches names.</p>$html$,
      '[]',
      null,
      40
    ),
    (
      'time-view',
      'Reporting',
      'The Time view',
      $html$<p>The Time view in Reporting is the project's timesheet. Time entries are grouped by week, Monday to Sunday, with the latest week first and each week's total beside its dates. Within a week, the latest date comes first.</p><p>Each entry shows what was worked on (with its notes), the <strong>Owner</strong>, the <strong>Date</strong>, the <strong>Duration</strong>, and whether it's Billable or Internal. The search box matches descriptions, notes and owners. Pages here count weeks rather than entries.</p><p>Until someone logs time, the view shows No time logged yet, with its own <strong>Log time</strong> button.</p>$html$,
      '[]',
      null,
      50
    ),
    (
      'deleting-time-entries',
      'Reporting',
      'Deleting a time entry',
      $html$<p>To delete a time entry, open the <strong>Time</strong> view in Reporting and choose <strong>Delete</strong> in the entry's <strong>⋯</strong> menu. Flow asks you to confirm in the <strong>Delete time entry</strong> dialog, and a deleted entry can't be restored from Flow. The project's <a href="/help/flow/logs">Logs</a> record the deletion.</p><p>There's no way to edit a time entry. To correct one, delete it and log it again.</p>$html$,
      '[]',
      null,
      60
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"ListTodo","label":"Tasks","href":"/help/flow/tasks"},{"icon":"GitBranch","label":"Issue tracker","href":"/help/flow/issues"},{"icon":"Users","label":"Team & resources","href":"/help/flow/team"},{"icon":"Activity","label":"Logs","href":"/help/flow/logs"},{"icon":"LayoutDashboard","label":"Project overview","href":"/help/flow/project-overview"},{"icon":"Settings","label":"Project settings","href":"/help/flow/settings"}]',
      null,
      70
    )
) as v(anchor_id, eyebrow, title, content, links, showcase, sort_order)
cross join (select id from public.docs_pages where slug = 'flow/reporting' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Reporting',
    description = 'Time entries and progress across tasks and issues.',
    status = 'draft',
    published_at = null
where slug = 'flow/reporting' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'flow/reporting' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Time entries</li><li>Task and issue reports</li></ul>',
  10
from public.docs_pages p
where p.slug = 'flow/reporting' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
