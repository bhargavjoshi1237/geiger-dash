-- Help flow goals page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the flow/goals draft outline with the
-- full Milestones & goals guide (Milestones, Goals and Objectives) and publishes it. No section showcases exist for
-- these screens yet.
-- Written from a survey of C:\Pro\geiger-flow (components/internal/screens/projects/milestones/*, goals/*,
-- objectives/*, components/internal/dilouges/{milestones,goals,objectives}/*, features/{milestones,goals,objectives}/*,
-- components/internal/shared/pagination.jsx).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Milestones & goals',
    description = 'Mark checkpoints with milestones and set measurable goals with key results. Group goals under objectives on a board of their own.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'flow/goals' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'flow/goals' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, showcase, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.showcase, v.sort_order
from (
  values
    (
      'milestones-goals-objectives',
      'Concepts',
      'Milestones, goals and objectives',
      $html$<p>Milestones, goals and objectives each have their own screen in Flow's project sidebar, and each answers a different question.</p><ul><li><strong>Milestones</strong> are dated checkpoints. Each one holds a checklist of tasks, and Flow works out the milestone's status and progress from that checklist.</li><li><strong>Goals</strong> are measurable targets with key results. You set a goal's status and progress yourself.</li><li><strong>Objectives</strong> are larger aims with a start date, a target date and key results. Each objective has its own board of goals.</li></ul><p>All three use the same four statuses: Not Started, On Track, At Risk and Completed.</p><p>Milestones and objectives also show up in the issue tracker: each milestone as a cycle, and each objective as a division. See <a href="/help/flow/issues/cycles-and-divisions">Cycles, divisions and initiatives</a>.</p><p>The <strong>Goals</strong> screen lists only goals that don't belong to an objective. Goals you add on an objective's board stay on that board. A milestone's tasks are separate from the tasks on the <strong>Tasks</strong> screen, so checking one off doesn't change the other.</p>$html$,
      '[]',
      null,
      10
    ),
    (
      'creating-a-milestone',
      'Milestones',
      'Creating a milestone',
      $html$<p>To create a milestone, choose <strong>Milestones</strong> in the project sidebar, then <strong>New Milestone</strong>. Only the title is required: <strong>Create Milestone</strong> stays disabled until there is one.</p><ul><li><strong>Milestone Title</strong> and <strong>Description</strong>: what the milestone delivers.</li><li><strong>Owner</strong>: free text that starts as <code>You</code>.</li><li><strong>Target Date</strong>: when the milestone is due. Set one, because Flow orders milestones by it and uses it to flag them overdue.</li><li><strong>Tasks</strong>: the milestone's checklist. Each row has a task name, an assignee (free text) and a status: To Do, In Progress, Blocked or Done. New rows start as To Do. Choose <strong>Add</strong> for another row, or the × beside a row to remove it.</li></ul><p>Rows without a task name are dropped when you save.</p>$html$,
      '[]',
      null,
      20
    ),
    (
      'milestone-status',
      'Milestones',
      'Milestone status and progress',
      $html$<p>Flow sets a milestone's status from its tasks, so there is no status to pick.</p><ul><li><strong>Not Started</strong>: every task is To Do, or the milestone has no tasks.</li><li><strong>On Track</strong>: at least one task is In Progress or Done, and none is Blocked.</li><li><strong>At Risk</strong>: at least one task is Blocked.</li><li><strong>Completed</strong>: every task is Done.</li></ul><p>A milestone's progress is the share of its tasks that are Done, rounded to a whole percent. A milestone is <strong>overdue</strong> once its target date arrives and it isn't Completed. Its row then shows an <strong>Overdue</strong> badge beside the status.</p>$html$,
      '[]',
      null,
      30
    ),
    (
      'milestone-list',
      'Milestones',
      'The milestone list',
      $html$<p>The figures across the top of the <strong>Milestones</strong> screen cover every milestone in the project: <strong>Total milestones</strong> (with how many are completed), <strong>Task completion</strong> (the share of all milestone tasks that are Done), <strong>Overdue</strong> and <strong>Tasks in scope</strong> (how many tasks the milestones hold). The status filter and search don't change them.</p><p>Milestones are listed by target date, earliest first. Filter them by status, or search by title, description, owner or task name. When a search matches a task name, that milestone's tasks open so you can see the match. If nothing matches, <strong>Clear filters</strong> resets the search and the status filter.</p><p>Each row shows the target date, the number of tasks, the owner and how many tasks are done. Choose <strong>Show tasks</strong> to list a milestone's tasks, then click a task to mark it Done, or click a Done task to set it back to To Do. Each click saves straight away.</p><p>The list shows 10 milestones a page to start with. Switch to 25, 50 or 100 at the bottom, or change the project's starting size under <strong>Settings → General → Default rows per page</strong>.</p>$html$,
      '[]',
      null,
      40
    ),
    (
      'editing-and-deleting-milestones',
      'Milestones',
      'Editing and deleting milestones',
      $html$<p>Each milestone's <strong>⋯</strong> menu has <strong>Edit</strong> and <strong>Delete</strong>. <strong>Edit</strong> opens the milestone's form, where you can change any field, add or remove tasks, and set a task to In Progress or Blocked. Choose <strong>Save Changes</strong> to keep your edits.</p><p><strong>Delete</strong> asks you to confirm first, and a deleted milestone can't be restored from Flow.</p>$html$,
      '[]',
      null,
      50
    ),
    (
      'creating-a-goal',
      'Goals',
      'Creating a goal',
      $html$<p>To create a goal, choose <strong>Goals</strong> in the project sidebar, then <strong>Define New Goal</strong>. Only the title is required: <strong>Create Goal</strong> stays disabled until there is one.</p><ul><li><strong>Goal Title</strong> and <strong>Description</strong>: what the goal aims to achieve.</li><li><strong>Status</strong>: Not Started, On Track, At Risk or Completed. New goals start as Not Started.</li><li><strong>Target Date</strong>: when the goal is due.</li><li><strong>Owner</strong>: free text that starts as <code>You</code>.</li><li><strong>Progress (%)</strong>: a number from 0 to 100. New goals start at 0.</li><li><strong>Key Results</strong>: the measurable results that show the goal is met. Type one per row and choose <strong>Add</strong> for more. Empty rows are dropped when you save.</li></ul><p>The form also has <strong>Progress Source</strong>, <strong>Track Metric</strong> and <strong>Target</strong>. Flow saves them with the goal, but they don't calculate its progress for you.</p>$html$,
      '[]',
      null,
      60
    ),
    (
      'goal-list',
      'Goals',
      'The goal list',
      $html$<p>The figures across the top of the <strong>Goals</strong> screen count the goals listed there: <strong>Total goals</strong> (with how many are completed), <strong>On track</strong>, <strong>At risk</strong> and <strong>Avg. progress</strong>. The status filter and search don't change them.</p><p>The newest goals come first. Filter by status, or search by title, description or owner. Each row shows the goal's owner, target date, how many key results are done, its status and its progress.</p><p>Each goal's <strong>⋯</strong> menu has:</p><ul><li><strong>Edit</strong>: opens the goal's form to change any field, including each key result's progress.</li><li><strong>Duplicate</strong>: adds a copy with <code>(Copy)</code> at the end of its title. The copy is Not Started, with 0% progress and its key results reset to 0%.</li><li><strong>Not Started</strong>, <strong>On Track</strong>, <strong>At Risk</strong> and <strong>Completed</strong>: change the status. Completed also sets progress to 100%, and Not Started sets it to 0%.</li><li><strong>Delete</strong>: asks you to confirm first. A deleted goal can't be restored from Flow.</li></ul><p>The list shows 10 goals a page to start with. Switch to 25, 50 or 100 at the bottom.</p>$html$,
      '[]',
      null,
      70
    ),
    (
      'key-results',
      'Concepts',
      'Key results and progress',
      $html$<p>Goals and objectives both carry <strong>key results</strong>: short, measurable statements of what success looks like. When you create a goal or objective, you only name its key results. Once it exists, choose <strong>Edit</strong> in its <strong>⋯</strong> menu to give each key result a progress from 0 to 100. A key result counts as done at 100, and lists and cards show how many are done.</p><p>A goal's or objective's own progress doesn't come from its key results. For a goal, it's the number in <strong>Progress (%)</strong>. An objective starts at 0% and has no progress field: choosing <strong>Completed</strong> in its <strong>⋯</strong> menu sets it to 100%, and <strong>Not Started</strong> sets it back to 0%. On Track and At Risk leave progress as it is, for goals and objectives alike.</p>$html$,
      '[]',
      null,
      80
    ),
    (
      'creating-an-objective',
      'Objectives',
      'Creating an objective',
      $html$<p>To create an objective, choose <strong>Objectives</strong> in the project sidebar, then <strong>New Objective</strong>. The title, start date and target date are required: <strong>Create Objective</strong> stays disabled until all three are set.</p><ul><li><strong>Objective Title</strong> and <strong>Description</strong>: what the objective aims to achieve.</li><li><strong>Status</strong>: Not Started, On Track, At Risk or Completed. New objectives start as Not Started.</li><li><strong>Start Date</strong> and <strong>Target Date</strong>: the period the objective covers.</li><li><strong>Owner</strong>: free text that starts as <code>You</code>.</li><li><strong>Key Results</strong>: type one per row and choose <strong>Add</strong> for more. Empty rows are dropped when you save.</li></ul><p>New objectives start at 0% progress, with an empty goal board.</p>$html$,
      '[]',
      null,
      90
    ),
    (
      'objectives-list',
      'Objectives',
      'The objectives list',
      $html$<p>The figures across the top of the <strong>Objectives</strong> screen count every objective in the project: <strong>Total objectives</strong> (with how many are completed), <strong>On track</strong>, <strong>At risk</strong> and <strong>Avg. progress</strong>. The status filter and search don't change them.</p><p>Objectives show as cards to start with, and the two buttons beside the status filter switch between cards and a compact list. The newest objectives come first. Filter by status, or search by title, description or owner. Each objective shows its owner, start and target dates, how many key results are done and its progress. On a card, the <strong>Key Results</strong> toggle lists them.</p><p>Each objective's <strong>⋯</strong> menu has <strong>Edit</strong>, <strong>Duplicate</strong>, the four statuses and <strong>Delete</strong>. <strong>Duplicate</strong> adds a copy with <code>(Copy)</code> at the end of its title, set to Not Started with 0% progress and its key results reset to 0%. The copy's goal board starts empty.</p><p><strong>Delete</strong> asks you to confirm first, and a deleted objective can't be restored from Flow. The goals on its board go with it, and they don't move to the <strong>Goals</strong> screen.</p><p>The list shows 10 objectives a page to start with. Switch to 25, 50 or 100 at the bottom.</p>$html$,
      '[]',
      null,
      100
    ),
    (
      'objective-goal-board',
      'Objectives',
      'An objective''s goal board',
      $html$<p>To open an objective's goal board, choose the arrow at the right of its card or row on the <strong>Objectives</strong> screen. The top of the board shows the objective's status, description, progress, dates and key results, and the back arrow returns to the list.</p><p>Goals sit in columns by status: Not Started, On Track, At Risk and Completed, each with a count. To add a goal, choose the + at the top of a column. The <strong>New Goal</strong> form has the same fields as on the <strong>Goals</strong> screen, and the goal lands in the column you started from.</p><p>Drag a card by the handle at its top left to move it to another column, which changes its status, or to reorder it within a column. Flow saves the new status and order when you drop the card.</p><p>Each card shows the goal's owner, how many key results are done and its progress. Its <strong>⋯</strong> menu has <strong>Edit</strong>, <strong>Duplicate</strong> and <strong>Delete</strong>. On the board, <strong>Duplicate</strong> copies everything, including the status, progress and key results. <strong>Delete</strong> removes the goal straight away, without asking, and it can't be restored from Flow.</p>$html$,
      '[]',
      null,
      110
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"ListTodo","label":"Tasks","href":"/help/flow/tasks"},{"icon":"CalendarRange","label":"Projections","href":"/help/flow/projections"},{"icon":"ChartColumn","label":"Reporting","href":"/help/flow/reporting"}]',
      null,
      120
    )
) as v(anchor_id, eyebrow, title, content, links, showcase, sort_order)
cross join (select id from public.docs_pages where slug = 'flow/goals' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Milestones & goals',
    description = 'Set milestones, goals and objectives, and track their health and progress.',
    status = 'draft',
    published_at = null
where slug = 'flow/goals' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'flow/goals' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Milestones</li><li>Goals and how progress is measured</li><li>Objectives and their goal board</li><li>Health: Not Started, On Track, At Risk, Completed</li></ul>',
  10
from public.docs_pages p
where p.slug = 'flow/goals' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
