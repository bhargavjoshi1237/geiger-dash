-- Help flow tasks page
--
-- One-time content move, like 20261023200049_help_flow_guide: replaces the flow/tasks draft outline with the full
-- Tasks guide and publishes it. Each part of the page embeds the live Flow component it describes (section
-- showcases, 20261024123159_help_section_showcases); the whole-app preview stays on the Flow Overview.
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Tasks',
    description = 'Plan a project''s work as tasks: set status, priority and stage, assign people, talk it through in comments, and work through it all in the Work Queue.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'flow/tasks' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'flow/tasks' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, showcase, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.showcase, v.sort_order
from (
  values
    (
      'creating-a-task',
      'Basics',
      'Creating a task',
      $html$<p>Open a project in Flow, choose <strong>Tasks</strong> in the sidebar, then <strong>Create Task</strong>. Only the title is required: <strong>Create Task</strong> stays disabled until there is one.</p><ul><li><strong>Title</strong> and <strong>Description</strong>: what needs doing. The description is plain text and keeps its line breaks.</li><li><strong>Type</strong>: Task, Issue, Bug, Feature or Improvement. New tasks are a Task.</li><li><strong>Status</strong> and <strong>Priority</strong>: new tasks start as To Do with Medium priority.</li><li><strong>Stage</strong>: where the work is in delivery. Leave it empty and the task starts in Backlog.</li><li><strong>Progress</strong>: a slider from 0% to 100%.</li><li><strong>Labels</strong>: separate them with commas, like <code>frontend, release</code>.</li><li><strong>Linked goal</strong>: optionally, the goal this task works toward.</li></ul><p>Assignees, start dates and due dates are set from the task's details once it exists.</p>$html$,
      'flow/add-task',
      10
    ),
    (
      'status-priority-stage',
      'Concepts',
      'Status, priority and stage',
      $html$<p>Every task carries three markers, and each answers a different question.</p><ul><li><strong>Status</strong> is whether the work is moving: To Do, In Progress, Blocked or Done. Done tasks count toward Completion and are never marked overdue.</li><li><strong>Priority</strong> is how much it matters: Low, Medium, High or Critical. Sorting by priority puts Critical first.</li><li><strong>Stage</strong> is which part of delivery the work has reached: Backlog, Planning, Execution, Testing, Review, Deploy (Pending or Running), Merge (Pending or Done) and Completed.</li></ul><p>Status and stage are set separately, so a task can be In Progress while it sits in Testing.</p>$html$,
      null,
      20
    ),
    (
      'task-list',
      'Tasks',
      'The task list',
      $html$<p>The figures across the top count every task in the project: <strong>Total tasks</strong> (with how many are done), <strong>In progress</strong>, <strong>Overdue</strong>, and <strong>Completion</strong>, the share of tasks that are Done. Search and filters don't change them.</p><p>Narrow the list by status and priority, and sort it by <strong>Newest</strong> (the default), <strong>Oldest</strong>, <strong>Priority</strong>, <strong>Due date</strong> (earliest first, undated last) or <strong>Progress</strong> (furthest along first). The search icon opens a box that matches task titles and descriptions; <code>Esc</code> clears it.</p><p>Each row shows the task's status, priority, assignees, due date and progress. A task is <strong>overdue</strong> once its due date arrives and it still isn't Done. <strong>Clear filters</strong> resets the search and filters and leaves the sort as it is.</p><p>The list shows 10 tasks a page to start with. Switch to 25, 50 or 100 at the bottom, or change the project's starting size under <strong>Settings → General → Default rows per page</strong>.</p>$html$,
      'flow/tasks',
      30
    ),
    (
      'task-details',
      'Tasks',
      'Task details',
      $html$<p>Click a task to open its details. Everything here saves as you change it, so there is no Save button.</p><ul><li><strong>Properties</strong>: status, priority, type, stage, and start and due dates. Choose <strong>No stage</strong> to clear the stage.</li><li><strong>Progress</strong>: drag the slider in steps of 5%. It saves when you let go.</li><li><strong>Assignees</strong>: choose <strong>Assign</strong>, search your organization's members by name, and pick as many as you need. Remove someone with the × beside their name.</li><li><strong>Labels</strong>: type a label and press <code>Enter</code> or a comma. <code>Backspace</code> in the empty box removes the last one.</li><li><strong>Linked goal</strong>: change or clear the goal the task works toward.</li></ul><p>The pencil at the top opens the full form, for changing the title, description and everything else at once.</p>$html$,
      'flow/task-details',
      40
    ),
    (
      'comments',
      'Tasks',
      'Comments',
      $html$<p>The <strong>Comments</strong> tab in a task's details holds its discussion, oldest first. Write in the box at the bottom and choose <strong>Comment</strong>, or press <code>Ctrl Enter</code> (<code>⌘ Enter</code> on Mac).</p><p>Hover over a comment to edit or delete it. Edited comments are marked <em>edited</em>. Deleting a comment happens straight away and can't be undone.</p>$html$,
      null,
      50
    ),
    (
      'editing-and-deleting',
      'Tasks',
      'Editing and deleting',
      $html$<p>Each row's <strong>⋯</strong> menu has <strong>Edit</strong>, which opens the full form, and <strong>Delete</strong>. You can also delete a task with the trash icon at the top of its details. Either way Flow asks you to confirm first, and a deleted task can't be restored from Flow.</p>$html$,
      null,
      60
    ),
    (
      'work-queue',
      'Work Queue',
      'Work Queue',
      $html$<p><strong>Work Queue</strong>, next to Tasks in the sidebar, shows the same tasks as one ordered list: the earliest due date first, tasks without a date last, and the higher priority first when dates match. There's no sort to change, so the top of the queue is always what's due next.</p><p>The figures across the top show everything <strong>Queued</strong>, what's <strong>Due today</strong>, what's <strong>Overdue</strong> (due before today and not Done) and the average <strong>Progress</strong>. Filter by status, or search by title, description, type or owner (the first assignee).</p><p>Each row's <strong>⋯</strong> menu moves the task along: <strong>Mark in progress</strong>, <strong>Mark done</strong> or <strong>Move back to to do</strong>. <strong>Delete</strong> here removes the task straight away, without asking. <strong>Add Work</strong> creates a task with the same form as the Tasks screen. To change anything else, open the task from Tasks.</p>$html$,
      'flow/work-queue',
      70
    ),
    (
      'shortcuts',
      'Reference',
      'Keyboard shortcuts',
      $html$<ul><li><code>Ctrl Enter</code> (<code>⌘ Enter</code> on Mac) posts a comment</li><li><code>Enter</code> or <code>,</code> adds a label, and <code>Backspace</code> in an empty label box removes the last one</li><li><code>Esc</code> clears and closes the search box</li></ul>$html$,
      null,
      80
    )
) as v(anchor_id, eyebrow, title, content, showcase, sort_order)
cross join (select id from public.docs_pages where slug = 'flow/tasks' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Tasks',
    description = 'Plan project work with statuses, priorities, types and delivery stages.',
    status = 'draft',
    published_at = null
where slug = 'flow/tasks' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'flow/tasks' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Creating a task</li><li>Status, priority and type</li><li>Delivery stages</li><li>Comments</li><li>The Work Queue</li></ul>',
  10
from public.docs_pages p
where p.slug = 'flow/tasks' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
