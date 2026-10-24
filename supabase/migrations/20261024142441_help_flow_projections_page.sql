-- Help flow projections page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the flow/projections draft outline with
-- the full Projections guide and publishes it. Flow has no component showcase for this screen yet.
-- Written from a survey of C:\Pro\geiger-flow (components/internal/screens/projects/projections/projections_screen.jsx,
-- components/internal/dilouges/projections/new_projection_dilouge.jsx, features/projections/*,
-- supabase/migrations/20260826122612_projections.sql) and the Calendar it renders (C:\Pro\geiger-ui src/ui/calendar.jsx
-- at 258dd6a, the version Flow pins).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Projections',
    description = 'Put milestones, releases, reviews and deadlines on the project calendar, browse it by month, week or day, and archive what''s done.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'flow/projections' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'flow/projections' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, showcase, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.showcase, v.sort_order
from (
  values
    (
      'creating-an-event',
      'Basics',
      'Creating an event',
      $html$<p>Each item on the Projections calendar is an <strong>event</strong>: a dated marker such as a release or a deadline. To add one, open a project in Flow, choose <strong>Projections</strong> in the sidebar, then <strong>New Event</strong>. <strong>Create Event</strong> stays disabled until the event has a title and a start date.</p><ul><li><strong>Title</strong>: what the event marks. Required.</li><li><strong>Description</strong>: optional notes.</li><li><strong>Kind</strong>: Milestone, Release, Review or Deadline. New events are a Milestone.</li><li><strong>Visibility</strong>: Public or Shared. New events are Public.</li><li><strong>Start Date</strong>: required. It starts as today, or as the day you picked on the calendar.</li><li><strong>End Date</strong>: optional, for an event that spans several days. It can't be earlier than the start date.</li><li><strong>Owner</strong>: who's responsible, as plain text. It starts as You, and you can type any name.</li></ul><p>You can also start an event from the calendar. Click the + beside the view picker, or right-click a day in the month view and choose <strong>Add event</strong>. In the week view, hover over an empty hour and click the + that appears. In the day view, click an empty hour, marked <strong>Click to add event</strong>. Events have dates but no times, so the hour you pick doesn't matter.</p>$html$,
      '[]',
      null,
      10
    ),
    (
      'kinds-and-visibility',
      'Concepts',
      'Event kinds and visibility',
      $html$<p>An event's <strong>Kind</strong> says what it marks: Milestone, Release, Review or Deadline. A Milestone event is a marker on the Projections calendar only. It isn't linked to the project's <a href="/help/flow/goals">milestones and goals</a>.</p><p><strong>Visibility</strong> is a label, Public or Shared, that sorts events into the <strong>Public</strong> and <strong>Shared</strong> tabs. It doesn't change who can see an event: everyone in the project sees every event, whichever label it has.</p><p>An event without an <strong>End Date</strong> sits on its start date. With one, it appears on every day from the start date to the end date, across months too.</p>$html$,
      '[]',
      null,
      20
    ),
    (
      'calendar',
      'Projections',
      'The calendar',
      $html$<p>The Projections calendar opens on the current month. Choose <strong>Month</strong>, <strong>Week</strong> or <strong>Day</strong> in the view picker at the top right. Switching views jumps back to today. The arrows beside the picker move back or forward one month, week or day, and the heading names the period on screen.</p><p>In the month view, each day lists up to three events and counts the rest, as in <strong>2 more...</strong>. Clicking that count, or anywhere else in the day, opens the day in the day view. Hover over a day's date to see all of its events. Right-click a day for <strong>Add event</strong>, <strong>View day</strong>, <strong>View week</strong> and <strong>Copy date</strong>.</p><p>The day view adds a strip of dates: click one to show that day, or use the strip's arrows to move 10 days at a time. In the week and day views, <strong>Month</strong> at the top left goes back to the month view.</p><p>Click any event, in any view, to open it for editing.</p>$html$,
      '[]',
      null,
      30
    ),
    (
      'filtering-and-searching',
      'Projections',
      'Filtering and searching events',
      $html$<p>The tabs above the calendar narrow what it shows: <strong>All</strong> (every event that isn't archived, the default), <strong>Shared</strong>, <strong>Public</strong> and <strong>Archived</strong>. The search icon opens a box that matches event titles and owners; <code>Esc</code> clears it.</p><p>The figures across the top count the whole project, whatever tab or search is active:</p><ul><li><strong>Total events</strong>: every event, archived ones included, with how many are shown</li><li><strong>Shared</strong> and <strong>Public</strong>: events with that label that aren't archived</li><li><strong>Archived</strong>: archived events</li></ul><p>When nothing matches the tab and search, Flow shows <strong>Nothing matches this filter</strong> in place of the calendar. <strong>Clear filters</strong> goes back to the All tab and clears the search.</p>$html$,
      '[]',
      null,
      40
    ),
    (
      'editing-archiving-deleting',
      'Projections',
      'Editing, archiving and deleting',
      $html$<p>Click an event on the calendar to open it in <strong>Edit Event</strong>. Change any field, then choose <strong>Save Changes</strong>.</p><p><strong>Archive</strong>, in the same dialog, takes the event off the calendar straight away and moves it to the <strong>Archived</strong> tab. Other changes in the dialog aren't saved when you archive, so save them first. To bring an event back, open it from the <strong>Archived</strong> tab and choose <strong>Restore</strong>.</p><p>To delete an event, choose <strong>Delete</strong> in <strong>Edit Event</strong>. Flow asks you to confirm first: choose <strong>Confirm delete</strong>, or <strong>Keep</strong> to cancel. A deleted event can't be restored from Flow, so archive an event you want to keep instead.</p>$html$,
      '[]',
      null,
      50
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"Flag","label":"Milestones & goals","href":"/help/flow/goals"},{"icon":"Waypoints","label":"Planning board","href":"/help/flow/planning"},{"icon":"ListTodo","label":"Tasks","href":"/help/flow/tasks"}]',
      null,
      60
    )
) as v(anchor_id, eyebrow, title, content, links, showcase, sort_order)
cross join (select id from public.docs_pages where slug = 'flow/projections' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Projections',
    description = 'Plan releases, reviews and deadlines on the project calendar.',
    status = 'draft',
    published_at = null
where slug = 'flow/projections' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'flow/projections' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Milestones, releases, reviews and deadlines</li><li>Public and shared items</li></ul>',
  10
from public.docs_pages p
where p.slug = 'flow/projections' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
