-- Help events operations page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the events/operations draft outline from
-- 20261024191100_help_events_structure with the full Operations workspace guide and publishes it. It covers the event
-- editor's Operations workspace section (setup, modules, records, the workflow, imports and exports, permissions).
-- Invitations and the operations portal are left out: Dash's proxy sends signed-out visitors of /events/operations/*
-- to the Geiger sign-in page, so invited outsiders can't reach it. The workflow's Notices tab is left out too: no
-- scheduler runs the notice worker and the email templates it names don't exist, so queued notices never send.
-- Written from a survey of C:\Pro\geiger-events (components/internal/screens/operations/*,
-- components/internal/screens/events/event_sections.js, app/api/events/[eventId]/operations/*, lib/operations/*,
-- app/operations/[eventId]/page.jsx, components/portal/operations/*, app/api/portal/operations/*,
-- app/api/portal/request-setup/route.js, app/api/internal/operations/notices/route.js, geiger-rbac.config.js,
-- components/internal/screens/settings/team/member_drawer.jsx, components/internal/screens/conference/modules/paper.jsx,
-- supabase/migrations/*operations*.sql) and of C:\Pro\geiger-dash\utils\supabase\middleware.js.
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set description = 'Track an event''s back-office work in private modules and records, and plan its people, rooms, schedule, evaluations and attendance.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'events/operations' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'events/operations' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, showcase, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.showcase, v.sort_order
from (
  values
    (
      'setting-up-the-workspace',
      'Basics',
      'Setting up the Operations workspace',
      $html$<p>To start tracking an event's back-office work, open the event in the event editor (in the sidebar, choose <strong>Events → All Events</strong> and click the event), then open <strong>Operations workspace</strong>. The first time, it shows <strong>Set up workspace</strong>: choose a reference pack, or <strong>Start empty</strong> for a blank one.</p><ul><li><strong>Conference</strong>: Accepted items (Title, and a Category of Talk or Poster) and Speaker preparation (Name, Email and Confirmed).</li><li><strong>Workshop</strong>: Course preparation (Title, Trainer and Attendee target) and Equipment checks (Item, Quantity and Checked).</li><li><strong>Competition</strong>: Entries (Title, and a Category of Individual or Team) and Judge onboarding (Name, Email and Confirmed).</li></ul><p>Every pack module's records move through New, In progress and Complete. Setting up only saves a draft, so you can rename modules and add fields before anyone records anything. Records start once you publish the draft on the <strong>Configure</strong> tab.</p><p>From then on the section opens on <strong>Event workspace</strong>, with the published version and revision, and three tabs: <strong>Records</strong>, <strong>Workflow</strong> and <strong>Configure</strong>. Each event has its own <strong>Operations workspace</strong>, and nothing in it appears on the event page.</p><p>By default, the Owner, Admin and Manager roles hold every operations permission, and the Member and Viewer roles hold none. To change who can use it, see <a href="/help/events/settings#roles-and-permissions">Roles and permissions</a>.</p>$html$,
      '[]',
      null,
      10
    ),
    (
      'modules-records-and-versions',
      'Concepts',
      'Modules, records and versions',
      $html$<p>An event's <strong>Operations workspace</strong> holds <strong>modules</strong>, and each module holds <strong>records</strong>. A record is one thing you're tracking, like a speaker to brief or a piece of equipment to check. A module sets its records' fields, the states a record can be in, and which moves between states are allowed. A new record starts in its module's first state.</p><p>The configuration has a draft and published versions. You change the draft on the <strong>Configure</strong> tab, save it, then publish it as the next version. The <strong>Records</strong> tab always works from the published version, so draft changes reach no one until you publish.</p><p>Pack modules keep their required fields: you can rename them and add fields, but not remove those fields or change them. Modules you add yourself have no such limits. Records belong to one event and stay inside it, so a reference field can only link records of the same event.</p><p>The workflow is the structured part: people, rooms and equipment, activities, assignments, evaluations, attendance and tasks, checked against scheduling rules. Turning it on adds People, Resources and Activities modules, which you manage on the <strong>Workflow</strong> tab rather than on <strong>Records</strong>.</p>$html$,
      '[]',
      null,
      20
    ),
    (
      'adding-and-editing-modules',
      'Configure',
      'Adding and editing modules',
      $html$<p>To add a module, open the <strong>Configure</strong> tab and use <strong>Add your own module</strong> at the bottom: type a <strong>Name</strong>, change the <strong>Stable key</strong> Events suggests from it if you want another, and choose <strong>Add</strong>. The key is permanent; the name can change later. A key starts with a letter, uses lowercase letters, digits and dashes, and can't repeat another module's. Your module starts with two states, New and Complete, with moves both ways.</p><p>Click a module's button across the top of the tab to edit it:</p><ul><li><strong>Display name</strong>: the module's name everywhere it appears.</li><li><strong>Fields</strong>: type a label, edit the suggested field ID if you want, pick a type and choose the <strong>+</strong> button. The types are text, textarea, email, number, boolean, select, date and reference. A field's ID and type are permanent; its label can change. Select <strong>Required</strong> to make a field mandatory, and use the trash icon to remove one. A module holds up to 40 fields.</li><li><strong>Select fields</strong> start with the options Option A and Option B. Replace them under <strong>Options, comma separated</strong>.</li><li><strong>Reference fields</strong> link to a record in another module, chosen under <strong>Target module</strong>. Adding one needs at least one other active module.</li><li><strong>States and transitions</strong>: type a name and choose <strong>Add state</strong>, or rename a state in its box. States can't be removed or reordered. To allow a move, pick the two states and choose <strong>Allow move</strong>; the × on a move removes it. Records can only move along the moves listed here.</li></ul><p>A module you haven't published yet has <strong>Remove draft</strong>, which takes it out of the draft. Every change on this tab is part of the draft until you choose <strong>Save draft</strong>.</p>$html$,
      '[]',
      null,
      30
    ),
    (
      'publishing-and-archiving',
      'Configure',
      'Publishing changes and archiving modules',
      $html$<p>Changes on the <strong>Configure</strong> tab are kept when you choose <strong>Save draft</strong>, and reach the <strong>Records</strong> tab when you choose <strong>Publish workspace</strong>. <strong>Publish workspace</strong> stays disabled while there are unsaved changes, so save first. The status beside the buttons reads <strong>Unsaved changes</strong> or <strong>Draft saved</strong>. To throw away saved draft changes, choose <strong>Restore published</strong>, which puts the published configuration back as the draft without asking first. It appears once a version is published and the draft differs from it.</p><p>Once a module has records, archived ones included, Events won't publish a change that removes one of its fields, changes a field's <strong>Required</strong> setting, options or target module, or adds a required field. Publishing fails with a message that the module has records. Renaming the module, its fields and its states, adding optional fields and states, and changing its moves all still publish.</p><p>To retire a published module, select it and choose <strong>Review archive</strong>. Events shows how many records it has and which active modules link to it through a reference field. While any do, <strong>Archive module</strong> stays disabled. Archiving publishes straight away. The module's records stay readable as history on the <strong>Records</strong> tab, where its button is marked <strong>· history</strong>, but no one can add or change them, and the editor has no way to bring the module back. <strong>Review archive</strong> is disabled while you have unsaved changes, and Events won't archive while a saved draft differs from the published version.</p><p>If a teammate saved or published after you opened the section, your save fails with <strong>This workspace changed. Reload and try again.</strong> Your edits stay on screen so you can note them. Reload the page to get the latest version, then make them again.</p>$html$,
      '[]',
      null,
      40
    ),
    (
      'creating-and-editing-records',
      'Records',
      'Creating and editing records',
      $html$<p>To add a record, open the <strong>Records</strong> tab, click the module's button, then choose <strong>New record</strong>. <strong>Record title</strong> is always required, up to 200 characters, and so is every field marked with an asterisk. Choose <strong>Create record</strong>. The record starts in the module's first state.</p><ul><li>Text, email, select and date values hold up to 200 characters, and a textarea up to 10,000. An email field needs a valid address.</li><li>A boolean field is a <strong>Yes</strong> checkbox. When the field is required, the checkbox has to be selected to save.</li><li>A select field offers its options, and a date field takes a calendar date.</li><li>A reference field suggests the 50 newest records of its target module, or takes a record's ID. It can only point at an active record of the same event.</li></ul><p>To change a record, choose <strong>Edit</strong> on it, then <strong>Save record</strong>. If a teammate changed it first, saving fails and keeps your edits: choose <strong>Compare latest</strong> to see the current values, then <strong>Use latest revision with my edits</strong>, and save again.</p><p>The <strong>Records</strong> tab lists the modules you've published, apart from the workflow's People, Resources and Activities. Until something is published, it shows <strong>No published modules yet</strong>.</p>$html$,
      '[]',
      null,
      50
    ),
    (
      'moving-and-archiving-records',
      'Records',
      'Moving and archiving records',
      $html$<p>Each module on the <strong>Records</strong> tab lists its records newest first, 25 at a time, and <strong>Load more</strong> fetches the next 25. Narrow the list with the state filter (<strong>All states</strong> or one state). The list and board icons switch between a list and a board with a column for each state, and the circular-arrow icon reloads the records.</p><p>Each record shows its title, state and revision, up to three filled-in values labeled by field ID, and how many records it links to.</p><ul><li><strong>Move to</strong> buttons move a record to another state, one for each move its module allows from the current state. A move saves straight away.</li><li><strong>Archive</strong> asks you to confirm with <strong>Archive record</strong>. An archived record stays in history but can't be edited, and the editor can't restore it.</li><li><strong>View history</strong> switches the list to archived records, read-only. Choose <strong>History</strong> to switch back. An archived module always shows its history.</li></ul>$html$,
      '[]',
      null,
      60
    ),
    (
      'turning-on-the-workflow',
      'Workflow',
      'Turning on the workflow',
      $html$<p>The workflow plans an event's people, rooms and equipment, activities and their schedule, responsibilities, evaluations, attendance and follow-up tasks. To turn it on, open the <strong>Workflow</strong> tab and choose <strong>Enable workflow</strong>. Events adds the People, Resources and Activities modules and publishes the next version. Save and publish your configuration first: the button is disabled while there are unsaved changes, and Events won't turn it on while a saved draft differs from the published version. The editor can't turn the workflow off again.</p><p>On the <strong>Configure</strong> tab, People, Resources and Activities show a note instead of an editor, because their core fields can't change.</p><p>The workflow's tabs each hold a form and a list. A form saves when you choose its button, <strong>Save</strong> on most of them. Once a list has entries, pick one under <strong>Create or edit</strong> to load it into the form, change it and save; <strong>Create new</strong> clears the form. People, resources, activities, cycles and tasks can't be deleted, and an assignment ends when you set it to revoked.</p><p>After each save, Events shows <strong>Command saved</strong> with the workflow's revision and reloads it. Choose <strong>Load latest</strong> to pick up teammates' changes. If a teammate saved first, your save fails and keeps your entries: choose <strong>Load latest</strong> and save again. If the connection drops during a save, choose <strong>Retry original command</strong>. Events applies the change once, however many times you retry.</p>$html$,
      '[]',
      null,
      70
    ),
    (
      'people-rooms-and-activities',
      'Workflow',
      'People, rooms and activities',
      $html$<p>On the workflow's <strong>People</strong> tab, add everyone involved in running the event. <strong>Name</strong> is required. <strong>Email</strong> is optional, and so is <strong>Existing contact ID</strong>, which links the person to a contact in this project's Contact Book by its ID. Under <strong>Roles</strong>, select any of Presenter, Evaluator, Staff, Volunteer and Participant. These roles describe the person; their responsibilities come from assignments.</p><p>On <strong>Resources</strong>, add rooms and equipment: <strong>Name</strong>, <strong>Kind</strong> (room or equipment, room by default), <strong>Capacity</strong> (at least 1) and an optional <strong>Location</strong>. To limit when a resource can be used, fill in both <strong>Available from</strong> and <strong>Available until</strong>.</p><p>On <strong>Activities</strong>, add the sessions, workshops, rounds and anything else that happens. <strong>Title</strong> and <strong>Type</strong> (session by default) are required. Optionally pick a <strong>Room or equipment</strong>, a <strong>Parent activity</strong> it belongs to and a <strong>Capacity</strong>, and set <strong>Starts at</strong> and <strong>Ends at</strong>. Fill in both times, or leave both empty for an unscheduled activity. An activity without its own room or equipment uses its parent's.</p><p>Every date and time in the workflow is entered in UTC, as the field labels say. <strong>Display timezone</strong> (UTC by default) sets the time zone an activity's times are shown in, written as an IANA name like <code>Europe/London</code> or <code>Asia/Kolkata</code>.</p>$html$,
      '[]',
      null,
      80
    ),
    (
      'schedule-and-conflicts',
      'Workflow',
      'The schedule and conflict checks',
      $html$<p>The workflow's <strong>Schedule</strong> tab lists every activity by start time, unscheduled ones last. Each shows its times in its own time zone, its room or equipment, its capacity and the people actively assigned to it. To reschedule, choose <strong>Edit an activity</strong> and change it on the <strong>Activities</strong> tab.</p><p>Events checks the whole schedule each time you save a resource, an activity or an assignment, import activities or publish a release, and refuses a change that breaks one of these rules:</p><ul><li>An activity with times has to fit inside its parent's times, and the parent has to be scheduled.</li><li>An activity's capacity can't exceed its room's, and its times have to fall inside the room's availability.</li><li>Two activities in the same room or equipment can't overlap, unless one is the parent of the other.</li><li>A person can't hold active assignments on two activities that overlap, unless one is the parent of the other.</li><li>An activity can't be its own parent, directly or through other activities.</li></ul><p>Overlaps and a child outside its parent fail with <strong>This allocation conflicts with the current schedule.</strong> The other rules fail with <strong>Invalid operations input.</strong></p>$html$,
      '[]',
      null,
      90
    ),
    (
      'assignments-and-releases',
      'Workflow',
      'Assignments and releases',
      $html$<p>An assignment gives a person a responsibility on an activity. On the workflow's <strong>Assignments</strong> tab, pick the <strong>Activity</strong>, the <strong>Person</strong> and a <strong>Role</strong> (presenter, evaluator, staff, volunteer or participant), and optionally a <strong>Due at</strong> date. <strong>Status</strong> starts as active; set it to revoked to end the assignment. A person can hold the same role on the same activity only once at a time, or once for each cycle as an evaluator. Saving a duplicate fails with <strong>This command ID was already used.</strong></p><p>An evaluator assignment needs an <strong>Evaluation cycle</strong> in the draft or open state, and the other roles can't have one. Once an evaluation exists for an evaluator assignment, its activity, person, role and cycle can't change, though you can still revoke it. Active assignments show under <strong>Current assignments</strong> and on the <strong>Schedule</strong> tab.</p><p>To freeze the schedule, open the <strong>Programme</strong> tab and choose <strong>Publish new release</strong>. A release records every scheduled activity, with its times, time zone, room and active assignments, as the next version, numbered from 1. Unscheduled activities are left out. A release can't be changed or deleted, so later changes need another release. <strong>Released programmes</strong> lists each version with its activities. Publishing a release doesn't email anyone.</p>$html$,
      '[]',
      null,
      100
    ),
    (
      'evaluations-and-scoring',
      'Workflow',
      'Evaluation cycles and scoring',
      $html$<p>Evaluations score activities against a rubric. On the workflow's <strong>Evaluations</strong> tab, create a cycle under <strong>Evaluation cycles and rubrics</strong>: a <strong>Cycle title</strong>, a <strong>State</strong> (draft, open or closed, draft by default), an optional <strong>Due at</strong>, and 1 to 20 scoring criteria, each with a label, <strong>Minimum</strong>, <strong>Maximum</strong> and <strong>Weight</strong>. A cycle starts with one criterion, Overall quality, scored 0 to 10 with weight 1. Choose <strong>Save cycle</strong>. Once an evaluation in a cycle is submitted, its criteria are locked, so create another cycle to score differently.</p><p>Then assign evaluators to activities on the <strong>Assignments</strong> tab. While the cycle is open, each evaluator assignment has a form under <strong>Assigned evaluations</strong>. Enter the scores and any <strong>Private evaluator notes</strong>, then choose <strong>Save draft</strong> or <strong>Submit evaluation</strong>. Submitting needs a score in range for every criterion, and locks the evaluation. To open one for changes again while its cycle is open, use <strong>Reopen a submitted evaluation</strong> and give a reason; the submitted version stays in history.</p><p><strong>Score aggregates</strong> shows each activity's result in each cycle, out of 100. Each criterion's score is scaled to its range and weighted, and the activity's result is the average across submitted evaluations. <strong>No submitted scores</strong> means nothing was submitted, which isn't the same as a zero.</p><p><strong>Release results</strong> sets a cycle to released. That's permanent: a released cycle can't be edited, scored or reopened. <strong>Load history</strong> under <strong>Submitted evaluation history</strong> lists every submitted version with its scores and notes.</p>$html$,
      '[]',
      null,
      110
    ),
    (
      'attendance-and-tasks',
      'Workflow',
      'Attendance and follow-up tasks',
      $html$<p>To record attendance, open the workflow's <strong>Attendance</strong> tab, pick the <strong>Activity</strong> and the <strong>Person</strong>, then a <strong>Purpose</strong> and an <strong>Attendance</strong> status, with optional <strong>Notes</strong>. Choose <strong>Save</strong>.</p><ul><li><strong>Purpose</strong>: delivery, for someone running the activity like a presenter, or participation (the default), for someone attending it.</li><li><strong>Attendance</strong>: present (the default), absent or excused.</li></ul><p>A person has one mark for each activity and purpose. Saving another mark for the same activity, person and purpose corrects it, and Events keeps the earlier one. <strong>Load history</strong> under <strong>Attendance correction history</strong> lists every version with the account that recorded it. Marking delivery as absent also adds an open task, Follow up absent presenter, for that person and activity.</p><p>On the <strong>Tasks</strong> tab, add follow-up tasks: a <strong>Title</strong>, optionally a <strong>Person</strong>, an <strong>Activity</strong> and a <strong>Due at</strong>, and a <strong>Status</strong> of open (the default) or complete. To complete a task, pick it under <strong>Create or edit</strong>, set its status to complete and save.</p>$html$,
      '[]',
      null,
      120
    ),
    (
      'importing-and-exporting',
      'Workflow',
      'Importing and exporting',
      $html$<p>The workflow's <strong>Import & export</strong> tab brings entries in and takes reports out.</p><ul><li><strong>Import accepted conference items</strong> turns accepted submissions from <strong>Program → Call for Papers</strong> into activities. Choose <strong>Load accepted project papers</strong> to list this project's accepted papers that aren't tied to another event, select them or paste their IDs one per line, then choose <strong>Import accepted items</strong>, 1 to 100 at a time. Each paper becomes an unscheduled activity named after it, with its format as the type and UTC as the time zone. When the paper has an author, Events also adds them as a person with the presenter role, assigned to the activity. A paper goes into one event, once, and later changes to it don't carry over.</li><li><strong>Import people or activities</strong> takes 1 to 100 rows at a time, as a CSV with a header row or a JSON array. People need the columns <code>name</code> and <code>email</code> (email can be blank), with optional <code>roles</code> (separated by <code>|</code>), <code>id</code> and <code>contactId</code>. Activities need <code>title</code>, <code>kind</code> and <code>timezone</code>, with optional <code>id</code>, <code>resourceId</code>, <code>parentId</code>, <code>startsAt</code>, <code>endsAt</code> and <code>capacity</code>. Times are timestamps with an offset, like <code>2026-11-02T09:00:00Z</code>. Choose <strong>Import batch</strong>. A row with an id updates that entry, and a row without one adds an entry, even for someone already listed. The rows save together or not at all.</li><li><strong>Export reports</strong> downloads <strong>Programme CSV</strong>, <strong>Attendance CSV</strong>, <strong>Evaluations CSV</strong> or <strong>People CSV</strong>. The programme report lists every activity in every release, or the current activities marked draft before the first release. The attendance and evaluations reports include every earlier version, and the evaluations report includes private evaluator notes.</li></ul><p>Submissions themselves are covered in <a href="/help/events/program">Program</a>.</p>$html$,
      '[]',
      null,
      130
    ),
    (
      'operations-permissions',
      'Reference',
      'Operations permissions',
      $html$<p>Five permissions, under <strong>Event operations</strong> in <strong>Settings → Roles & Permissions</strong>, decide what each teammate can do in an event's <strong>Operations workspace</strong>. Events checks them for every action.</p><ul><li><strong>View event operations</strong>: open the section, and read published records and the workflow.</li><li><strong>Configure event operations</strong>: set up and change modules, publish, archive modules, turn on the workflow, publish releases, manage evaluation cycles, release results, reopen evaluations and import accepted papers.</li><li><strong>Create operation records</strong>: add records and workflow entries, and import rows without an id.</li><li><strong>Update operation records</strong>: edit and move records, change workflow entries, enter evaluations, record attendance and import rows with an id.</li><li><strong>Archive operation records</strong>: archive records, read history and download the CSV reports.</li></ul><p>By default, the Owner, Admin and Manager roles hold all five, and Member and Viewer hold none. Each permission applies per event: when a teammate's <strong>Event access</strong> is limited to certain events under <strong>Settings → Team & Members</strong>, they hold these permissions only in those events. The section shows every control to everyone who can open it, and an action the role doesn't allow fails with <strong>You cannot perform this action.</strong> To change a role, see <a href="/help/events/settings#roles-and-permissions">Roles and permissions</a>; to limit someone to certain events, see <a href="/help/events/settings#team-and-members">Team and members</a>.</p>$html$,
      '[]',
      null,
      140
    ),
    (
      'limits',
      'Reference',
      'Limits',
      $html$<ul><li>Up to 30 modules for each event, 40 fields in a module and 100 options in a select field.</li><li>Record titles, and text, email, select and date values, up to 200 characters. Textarea values up to 10,000.</li><li>Records load 25 at a time. Reference fields suggest the 50 newest records of their target module.</li><li>Imports take 1 to 100 rows or papers at a time. A cycle holds 1 to 20 scoring criteria.</li><li>Workflow dates and times are entered in UTC.</li><li>Once any list in an event's workflow (people, activities, assignments, attendance marks and the others) reaches 500 entries, Events shows a 500-entry warning and stops accepting workflow changes, releases and CSV reports for that event.</li></ul>$html$,
      '[]',
      null,
      150
    ),
    (
      'you-cannot-perform-this-action',
      'Troubleshooting',
      'An operations action fails with You cannot perform this action',
      $html$<p>When the event editor's <strong>Operations workspace</strong> shows <strong>You cannot perform this action.</strong> with a <strong>Try again</strong> button, or an action in it fails with that message, your role doesn't hold the operations permission that action needs for this event. The Member and Viewer roles hold none by default, and a teammate whose <strong>Event access</strong> is limited to other events holds none here. In the workflow the message adds <strong>Your account does not have permission for this operation.</strong></p><ol><li>Ask an admin to give your role the permission under <strong>Event operations</strong> in <strong>Settings → Roles & Permissions</strong>, or to assign you a role that holds it.</li><li>If your <strong>Event access</strong> is limited, ask them to add this event to it under <strong>Settings → Team & Members</strong>.</li><li>Reload the page.</li></ol>$html$,
      '[]',
      null,
      160
    ),
    (
      'invalid-operations-input',
      'Troubleshooting',
      'A workflow save fails with Invalid operations input',
      $html$<p>The workflow shows <strong>Invalid operations input.</strong> when a save breaks a rule that has no message of its own. Check the entry against these causes:</p><ul><li>An activity's capacity exceeds its room's or equipment's, or its times fall outside the resource's <strong>Available from</strong> and <strong>Available until</strong>.</li><li>An activity's <strong>Parent activity</strong> leads back to the activity itself.</li><li>An assignment with a role other than evaluator has an <strong>Evaluation cycle</strong>.</li><li>The activity, person, role or cycle of an evaluator assignment changed after an evaluation was started for it.</li><li>A submitted evaluation is being reopened while its cycle isn't open.</li></ul><p>Fix the entry and save again. Your entries stay in the form after the failed save.</p>$html$,
      '[]',
      null,
      170
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"CalendarDays","label":"Events","href":"/help/events/events"},{"icon":"CalendarClock","label":"Program","href":"/help/events/program"},{"icon":"Settings","label":"Settings","href":"/help/events/settings"}]',
      null,
      180
    )
) as v(anchor_id, eyebrow, title, content, links, showcase, sort_order)
cross join (select id from public.docs_pages where slug = 'events/operations' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Operations workspace',
    description = 'Run an event''s back office with private modules, records and the staff who work on them.',
    status = 'draft',
    published_at = null
where slug = 'events/operations' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'events/operations' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Turning on the workspace</li><li>Modules and records</li><li>Staff access</li></ul>',
  10
from public.docs_pages p
where p.slug = 'events/operations' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
