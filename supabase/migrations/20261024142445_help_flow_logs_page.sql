-- Help flow logs page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the flow/logs draft outline (added by
-- 20261024142436_help_flow_structure) with the full Logs guide and publishes it. Flow has no component showcase for
-- this screen yet.
-- Written from a survey of C:\Pro\geiger-flow (components/internal/screens/projects/logs/*, features/activity_logs/*,
-- the logActivity calls in features/*/actions.js and features/issues/relations.js, components/internal/shared/pagination.jsx,
-- supabase/migrations/20260826122615_activity_logs.sql).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Logs',
    description = 'Review the project''s activity log: what changed, who changed it and when. Filter and search entries, export them to CSV or delete them.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'flow/logs' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'flow/logs' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, showcase, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.showcase, v.sort_order
from (
  values
    (
      'reading-the-log',
      'Basics',
      'Reading the activity log',
      $html$<p>The activity log records changes made in a project. To read it, open a project in Flow and choose <strong>Logs</strong> in the sidebar. Entries are listed newest first, and each row shows the entry's <strong>Level</strong>, its message, its <strong>Source</strong> and the <strong>Time</strong>, down to the second.</p><p>The figures across the top count every entry in the project: <strong>Total logs</strong> (with how many match the level filter and search), <strong>Errors</strong>, <strong>Warnings</strong> and <strong>Sources</strong>, the number of different sources.</p><p>The list shows the project's default number of rows per page, which is 10 unless it's changed under <strong>Settings → General → Default rows per page</strong>. Switch to 10, 25, 50 or 100 at the bottom.</p>$html$,
      '[]',
      null,
      10
    ),
    (
      'what-gets-logged',
      'Concepts',
      'What gets logged',
      $html$<p>Flow writes an entry to the activity log when someone creates, changes or deletes one of these. The entry's <strong>Source</strong> names where it happened:</p><ul><li><code>issues</code>: issues, an issue's parent, and links between issues</li><li><code>tasks</code>: tasks</li><li><code>goals</code>, <code>milestones</code> and <code>objectives</code>: goals, milestones and objectives</li><li><code>time</code>: time entries from Reporting</li><li><code>vault</code>: vault items</li><li><code>architecture</code>, <code>credits</code> and <code>forms</code>: saving a System Architecture diagram, creating a Credited Resources allocation and creating a form, in the add-ons of those names</li></ul><p>Creating or changing something is logged at the <strong>Info</strong> level, and deleting it as a <strong>Warning</strong>. A change names the field and its new value, like <code>Updated task status → Done</code>. Changing several fields at once also names the item.</p><p>Other activity isn't logged, including projection events, comments, Grounding messages and uploads to Assets.</p>$html$,
      '[]',
      null,
      20
    ),
    (
      'log-details',
      'Logs',
      'Log details',
      $html$<p>Click an entry, or choose <strong>View details</strong> in its <strong>⋯</strong> menu, to open its details. The top shows the message, the exact time, the level and the source. The rest of the panel has these parts:</p><ul><li><strong>Description</strong>: the full message.</li><li><strong>Detail</strong>: the data Flow stored with the entry, such as the item's ID and the fields that changed. It appears only when there is some.</li><li><strong>Source</strong>: the <strong>Actor</strong> (the ID of the account that made the change), the source and the <strong>Log ID</strong>.</li><li><strong>Raw</strong>: the whole entry as JSON. The copy button in its corner copies it.</li></ul><p>To copy an entry without opening it, choose <strong>Copy JSON</strong> in its <strong>⋯</strong> menu.</p>$html$,
      '[]',
      null,
      30
    ),
    (
      'filtering-and-searching',
      'Logs',
      'Filtering and searching logs',
      $html$<p>The level filter at the top of the activity log starts on <strong>All levels</strong>. Choose <strong>Info</strong>, <strong>Warning</strong>, <strong>Error</strong> or <strong>Debug</strong> to see only that level. The search icon opens a box that matches an entry's message, source and actor; <code>Esc</code> clears it. Changing the filter or the search takes you back to the first page.</p><p>When nothing matches, the list shows <strong>No matching logs</strong>. <strong>Clear filters</strong> resets the level filter and the search.</p>$html$,
      '[]',
      null,
      40
    ),
    (
      'exporting-logs',
      'Logs',
      'Exporting logs',
      $html$<p>To download the activity log, choose <strong>Export Logs</strong> at the top of the Logs screen. Flow saves a CSV file of every entry that matches the current level filter and search, on every page, not only the page on screen. Its columns are Occurred At, Level, Source, Actor, Message and Detail.</p><p><strong>Export Logs</strong> stays disabled while no entries match.</p>$html$,
      '[]',
      null,
      50
    ),
    (
      'deleting-log-entries',
      'Logs',
      'Deleting log entries',
      $html$<p>To delete a log entry, choose <strong>Delete</strong> in its <strong>⋯</strong> menu, or <strong>Delete Log</strong> at the bottom of its details. Flow removes the entry straight away, without asking, for everyone in the project, and it can't be restored.</p><p>A deleted entry also drops out of the <strong>Activity</strong> counts on the <a href="/help/flow/project-overview">project overview</a>.</p>$html$,
      '[]',
      null,
      60
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"GitBranch","label":"Issue tracker","href":"/help/flow/issues"},{"icon":"ListTodo","label":"Tasks","href":"/help/flow/tasks"},{"icon":"Flag","label":"Milestones & goals","href":"/help/flow/goals"},{"icon":"ChartColumn","label":"Reporting","href":"/help/flow/reporting"},{"icon":"LayoutDashboard","label":"Project overview","href":"/help/flow/project-overview"},{"icon":"PackagePlus","label":"Add-ons","href":"/help/flow/add-ons"}]',
      null,
      70
    )
) as v(anchor_id, eyebrow, title, content, links, showcase, sort_order)
cross join (select id from public.docs_pages where slug = 'flow/logs' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Logs',
    description = 'The project''s activity log: who changed what, and when.',
    status = 'draft',
    published_at = null
where slug = 'flow/logs' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'flow/logs' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Reading the activity log</li><li>Filtering and searching</li></ul>',
  10
from public.docs_pages p
where p.slug = 'flow/logs' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
