-- Help events program page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the events/program draft outline from
-- 20261024191100_help_events_structure with the full Program guide and publishes it. Assign Agenda and CEU &
-- Certificates are left out: they store records that nothing delivers, issues or shows to attendees.
-- Written from a survey of C:\Pro\geiger-events (components/internal/sidebar/sidebar_nav.jsx,
-- components/internal/screens/registry.jsx, components/internal/screens/conference/{screens,agenda_builder,agenda_grid,
-- display_boards,constants,detail_fields}.jsx, components/internal/screens/conference/modules/{session,paper,certificate,
-- agenda_assignment,recording,simulive,breakout}.jsx, components/internal/screens/conference/display/*,
-- components/internal/shared/records/*, lib/agenda/sessions.js, lib/display/*, lib/supabase/{conference,records,
-- display_boards,events}.js, app/display/[boardId]/page.js, lib/email/catalog.js, components/portal/*,
-- components/internal/screens/events/{event_sections.js,checkin_section.jsx,public_page/layouts/agenda.jsx},
-- components/internal/screens/operations/{workflow_panel,workflow_import,workspace_section}.jsx,
-- supabase/migrations/{20260812060147_display_boards_public,20260815155746_fix_board_session_policy_recursion,
-- 20260726194134_project_access,20261002090000_operations_workflow}.sql, geiger-rbac.config.js, geiger-ui.config.js)
-- and of C:\Pro\geiger-dash utils/supabase/middleware.js (the proxy that makes /events/display/* need a signed-in account).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set description = 'Build each event''s agenda of sessions, tracks and rooms, show it on venue screens with display boards, and review talk submissions.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'events/program' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'events/program' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, showcase, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.showcase, v.sort_order
from (
  values
    (
      'building-an-agenda',
      'Basics',
      'Building an event''s agenda',
      $html$<p>Each event has its own agenda of sessions. To build one, choose <strong>Program → Agenda Builder</strong> in the sidebar, click the event, then choose <strong>Add session</strong>. Only <strong>Session title</strong> is required: without one, Events asks you to give the session a title first.</p><ul><li><strong>Status</strong>: Scheduled, Live, Draft or Cancelled. New sessions are Draft.</li><li><strong>Day</strong>: a label you type, like <code>Day 1 · Tue</code>. Sessions with the same label share a day.</li><li><strong>Start time</strong> and <strong>End time</strong>: the dialog shows the session's length once both are set.</li><li><strong>Track</strong> and <strong>Room</strong>: names you type, like <code>Main Stage</code> or <code>Room 2B</code>.</li><li><strong>Speaker</strong> and <strong>Description</strong>: optional.</li></ul><p>Choose <strong>Add session</strong> in the dialog to save it. Agenda Builder lists every event in the project with how many sessions it has. Filter the list by event status, or by <strong>With agenda</strong> and <strong>No agenda</strong>, sort it by date (the default, undated events last), name or number of sessions, and search by name, venue or city.</p><p>By default, <strong>Program</strong> appears in the sidebar for the Owner, Admin and Manager roles. To change who sees it, see <a href="/help/events/settings#roles-and-permissions">Roles and permissions</a>. Under <strong>Settings → Navigation</strong>, you can't hide <strong>Agenda Builder</strong> while <strong>Call for Papers</strong>, <strong>Assign Agenda</strong>, <strong>CEU & Certificates</strong> or <strong>Session Check-in</strong> is showing, so hide those first (see <a href="/help/events/settings#navigation">Sidebar navigation</a>).</p>$html$,
      '[]',
      null,
      10
    ),
    (
      'sessions-days-and-tracks',
      'Concepts',
      'Sessions, days and tracks',
      $html$<p>A <strong>session</strong> is one item on an event's agenda. Each session belongs to the event you built it in and can't be moved to another one. Day, track, room and speaker are plain text you type, so spell them the same way each time: <code>Main Stage</code> and <code>main stage</code> make two tracks.</p><ul><li><strong>Day</strong> groups sessions into days. Days sort by their label, with numbers in order, so <code>Day 2</code> comes before <code>Day 10</code>. A day label isn't tied to a calendar date.</li><li><strong>Track</strong> is a stream of sessions that runs alongside others. Each track gets its own column and color on the agenda grid, and tracks sort A to Z.</li><li><strong>Room</strong> and <strong>Speaker</strong> are what Agenda Builder checks for double-bookings. The speaker is a name you type, not a link to a profile in <strong>Speakers</strong>.</li></ul><p>A session's status is a label for your team. Agenda Builder counts Scheduled and Live sessions as confirmed, but no status changes what attendees see: Events doesn't set a session to Live when it starts, and display boards show Draft and Cancelled sessions too. To take a session off the boards, delete it.</p>$html$,
      '[]',
      null,
      20
    ),
    (
      'where-sessions-appear',
      'Concepts',
      'Where attendees see the agenda',
      $html$<p>Attendees see Agenda Builder sessions on the event's display boards, the venue screens you build under <strong>Program → Display Boards</strong>. The sessions don't appear anywhere else attendees look:</p><ul><li>The event page shows its own schedule, which you build in the event editor's <strong>Schedule</strong> section (see <a href="/help/events/event-page">Event page</a>).</li><li>The members portal has no agenda or personal schedule.</li><li>Session check-in uses its own list of sessions, set in the event editor's <strong>Sessions</strong> section (see <a href="/help/events/check-in">Check-in</a>).</li></ul><p>Inside Events, a recording in <strong>Recordings & Replay</strong>, an item in <strong>Simulive & On-demand</strong> and a breakout room's <strong>Parent session</strong> each pick a session from your agendas (see <a href="/help/events/broadcast">Broadcast & On-demand</a>).</p>$html$,
      '[]',
      null,
      30
    ),
    (
      'agenda-grid',
      'Agenda Builder',
      'The agenda grid',
      $html$<p>An event's agenda opens on the <strong>Grid</strong> view in Agenda Builder: one column per track, or a single <strong>All sessions</strong> column when no session has a track, with times down the side. When the agenda has two or more days, tabs across the top switch between them. An empty day spans 8:00 AM to 6:00 PM; otherwise the grid fits the day's sessions, to the hour.</p><ul><li><strong>Move a session</strong>: drag it to another time or track. It snaps to 15-minute steps, keeps its length (at least 30 minutes, or an hour when it has no end time) and saves straight away.</li><li><strong>Add a session at a time</strong>: click an empty spot in a column. <strong>Add session</strong> opens with that day, track and start time filled in, and an end time an hour later.</li><li><strong>Edit a session</strong>: click it, make your changes and choose <strong>Save session</strong>.</li><li><strong>Delete a session</strong>: hover over it and choose the trash icon. Events asks you to confirm, and a deleted session can't be restored.</li></ul><p>Sessions without a start time wait in the <strong>Unscheduled</strong> tray at the top of the agenda. Drag one onto the grid to place it on the day you're looking at, in the track you drop it on.</p>$html$,
      '[]',
      null,
      40
    ),
    (
      'double-bookings',
      'Agenda Builder',
      'Double-booking warnings',
      $html$<p>Agenda Builder warns you when the same room or the same speaker is booked for two sessions at once. On the agenda grid, an amber banner lists each double-booking on the day you're looking at, and both sessions turn amber. The <strong>Move</strong> button beside a pair, which names the second session, opens that session so you can change its time, room or speaker.</p><p>Two sessions clash when they're on the same day and their times overlap. Names match whatever their capital letters, so <code>Room 2B</code> and <code>room 2b</code> are the same room. Every session counts whatever its status, Cancelled ones included. A session without a start time never clashes, and one without an end time counts as an hour long. The warning doesn't stop you from saving.</p>$html$,
      '[]',
      null,
      50
    ),
    (
      'filters-and-list-view',
      'Agenda Builder',
      'Filters and the List view',
      $html$<p>At the top of an event's agenda in Agenda Builder, filter the sessions by track (<strong>All tracks</strong> to start) and by status (<strong>All Statuses</strong>, Scheduled, Live, Draft or Cancelled). The count beside them shows how many sessions match. When none match, <strong>Clear filters</strong> resets both. Switch between <strong>Grid</strong> and <strong>List</strong> on the right.</p><p>The <strong>List</strong> view groups sessions by day, in day order, with each day's sessions by start time. Sessions with no day come last, under <strong>Unscheduled</strong>. Each row shows the session's times, status, track, room, speaker and the start of its description. Its <strong>⋯</strong> menu has <strong>Edit</strong> and <strong>Delete</strong>. Events asks you to confirm a delete, and it can't be undone.</p><p>The figures across the top count the event's <strong>Sessions</strong>, <strong>Days</strong> and <strong>Tracks</strong>, and how many sessions are Scheduled or Live. Choose <strong>Agenda Builder</strong> at the top to go back to the list of events.</p>$html$,
      '[]',
      null,
      60
    ),
    (
      'creating-a-display-board',
      'Display Boards',
      'Creating a display board',
      $html$<p>A <strong>display board</strong> is a rotating set of slides for a screen at the venue, such as the lobby wall or the sign outside a room. It shows one event's agenda and keeps up with it as the agenda changes. To create one, choose <strong>Program → Display Boards</strong>, then <strong>New board</strong>. Type a <strong>Board name</strong>, pick the <strong>Event</strong> whose agenda it shows, choose a <strong>Theme</strong>, and choose <strong>Create board</strong>.</p><p>The name and the event are required: <strong>Create board</strong> stays disabled until both are set, and <strong>New board</strong> stays disabled until the project has an event. Themes are Midnight (the default), Slate, Paper and Ink. A board's event can't be changed later. A new board starts as a Draft with two slides, a <strong>Title card</strong> and <strong>Now & Next</strong>, and opens in its editor.</p><p><strong>Display Boards</strong> lists every board, newest first, with its event, status and number of slides. Filter by <strong>Published</strong> or <strong>Draft</strong>, or search by board or event name. Each board's <strong>⋯</strong> menu has <strong>Edit</strong>, <strong>Duplicate</strong> (an unpublished copy), <strong>Copy live URL</strong> and <strong>Delete</strong>. <strong>Delete</strong> asks you to confirm, and a deleted board can't be restored.</p>$html$,
      '[]',
      null,
      70
    ),
    (
      'building-the-slide-queue',
      'Display Boards',
      'Building the slide queue',
      $html$<p>A display board plays its slides in order, then starts again. In the board's editor, the <strong>Canvas</strong> view shows the slides as connected cards:</p><ul><li>To add a slide, drag it from the <strong>Drag to add</strong> palette onto the canvas.</li><li>To set the order, drag from the bottom of one slide to the top of the next. The board starts at the slide nothing connects into and follows the connections. Slides left unconnected play after the rest.</li><li>To remove a slide or a connection, select it and press <code>Delete</code> or <code>Backspace</code>.</li></ul><p>The <strong>List</strong> view shows the same queue top to bottom: the arrows move a slide earlier or later, the trash icon removes it, and <strong>Add a slide</strong> adds one at the end.</p><p>Select a slide to set it up in the panel on the right; the preview jumps to it. <strong>Play</strong> runs the rotation as the venue screen will, and the arrows step through the slides. <strong>In venue</strong> shows the board on a simulated venue screen: Center-hung, Ribbon boards, Stage wall, Video wall, Totems, Door signs, Marquee or Anamorphic. The preview changes nothing on the board.</p><p>Everything in the editor saves on its own a moment after you change it, so there is no Save button. Under <strong>Board settings</strong>, <strong>Theme</strong> sets the colors and <strong>Rotation speed</strong> scales every slide's time on screen: choose <strong>Fast (½×)</strong>, <strong>Normal</strong>, <strong>Relaxed (1½×)</strong> or <strong>Slow (2×)</strong>. Fast halves each slide's time and Slow doubles it. <strong>Delete This Board</strong> deletes the board straight away, without asking.</p>$html$,
      '[]',
      null,
      80
    ),
    (
      'slide-types',
      'Display Boards',
      'Slide types',
      $html$<p>Every slide on a display board has <strong>On screen for</strong>, its time on screen in seconds (at least 2), and <strong>Remove this slide</strong>. The six types, with the time each starts with:</p><ul><li><strong>Title card</strong> (8 seconds): the event's name, with its date, venue and city underneath, over the event's cover image while <strong>Use the cover image</strong> is on. <strong>Heading</strong> and <strong>Subheading</strong> replace the name and the line under it.</li><li><strong>Now & Next</strong> (12 seconds): the sessions running now, marked NOW, then the ones coming up. <strong>Day</strong> picks which day's sessions it reads, and <strong>How many to preview</strong> sets how many upcoming sessions follow, from 1 to 5 (4 to start). The <strong>Heading</strong> starts as Happening now.</li><li><strong>Full day grid</strong> (15 seconds): a whole day's sessions in track columns. Pick the <strong>Day</strong>; the <strong>Heading</strong> defaults to the day.</li><li><strong>Up next by room</strong> (12 seconds): what's on now and next in one <strong>Room</strong>, for the screen outside its door. Set the <strong>Day</strong> and <strong>How many to list</strong>, from 1 to 5 (5 to start). The <strong>Heading</strong> defaults to the room's name.</li><li><strong>Message</strong> (8 seconds): a <strong>Heading</strong> and an optional <strong>Body</strong>, for an announcement such as a room change.</li><li><strong>Image</strong> (8 seconds): a sponsor board, a map or any other picture. Upload it, choose <strong>Fill the screen</strong> or <strong>Fit inside</strong> under <strong>How it fills the screen</strong>, and add an optional <strong>Caption</strong>. Only the person who created the event can upload images for it.</li></ul><p><strong>Day</strong> and <strong>Room</strong> offer the days and rooms the event's agenda already uses, plus <strong>Every day</strong> or <strong>Every room</strong>.</p>$html$,
      '[]',
      null,
      90
    ),
    (
      'showing-a-board',
      'Display Boards',
      'Showing a board on a venue screen',
      $html$<p>To put a display board on a screen, turn on <strong>Published</strong> under <strong>Board settings</strong> in the board's editor, choose <strong>Copy live URL</strong>, and open that address in a browser on the screen. <strong>Published</strong> saves the moment you switch it. The link only works while the board is published, and until then <strong>Copy live URL</strong> asks you to publish first.</p><p>The screen's browser has to be signed in to a Geiger account that belongs to an organization. A signed-out screen goes to the Geiger <a href="/login">sign-in page</a>: sign in there, then open the address again. Use an account in your own organization. With an account from another organization, the board of a Private event shows <code>Event</code> instead of the event's name, and no date, venue or cover image.</p><p>The live board fills the browser at 16:9. Move the mouse or tap the screen to show the fullscreen button in the bottom-right corner. Once the board is published, <strong>Open board</strong> at the top of its editor opens the live board in a new tab.</p><p>The live board checks for changes every 30 seconds, so edits to its slides, its settings and the event's agenda reach the screen without reloading it. If you unpublish or delete the board, the screen shows <strong>Board unavailable</strong> at its next check.</p><p>To play the board somewhere without a browser, choose <strong>Download video</strong> in the editor. Events records one pass through the slides in real time, so a 60-second loop takes a minute, and downloads it as a WebM video named after the board. It needs at least one slide and a browser that can record video, such as Chrome or Edge. Schedule slides in the video show the agenda as it stood when you recorded it.</p>$html$,
      '[]',
      null,
      100
    ),
    (
      'what-a-board-shows-live',
      'Display Boards',
      'What a board shows live',
      $html$<p>A live display board reads the event's agenda as it is now. Its schedule slides show the event's name, the slide's day and the current time across the top. What counts as on now comes from the clock of the device showing the board: a session is on from its start time until its end time, or for an hour when it has no end time. Set that device to the venue's time zone.</p><ul><li>Day labels aren't dates, so a board can't tell which day is today. For an agenda that runs over several days, set each schedule slide's <strong>Day</strong> to the day being shown, and change it each day. With <strong>Every day</strong>, the board treats sessions from every day as if they were today.</li><li>Sessions without a start time never appear on a board.</li><li>Every session shows whatever its status, so a Draft or Cancelled session still appears. Delete it in Agenda Builder to take it off.</li><li><strong>Now & Next</strong> and <strong>Up next by room</strong> show at most six sessions: everything on now, then the next ones, up to the number you set.</li></ul>$html$,
      '[]',
      null,
      110
    ),
    (
      'adding-submissions',
      'Call for Papers',
      'Adding and reviewing submissions',
      $html$<p>Call for Papers is where your team keeps track of proposed talks and reviews them. To add one, choose <strong>Program → Call for Papers</strong>, then <strong>Add submission</strong>. Type a <strong>Title</strong>, an <strong>Author</strong> and a <strong>Format</strong> (Talk, Workshop or Panel; Talk to start), and choose <strong>Add submission</strong>. Only the title is required. New submissions are Submitted, and they belong to the project rather than to one event.</p><p>Click a submission to open it. It has three sections, and nothing is saved until you choose <strong>Save Changes</strong>. Going back without saving discards your edits, without asking.</p><ul><li><strong>Submission</strong>: the title, <strong>Status</strong>, author, <strong>Email</strong>, <strong>Track</strong> and format.</li><li><strong>Abstract</strong>: the <strong>Abstract</strong>, and <strong>Topics</strong> (type one, then press <code>Enter</code> or choose <strong>Add</strong>).</li><li><strong>Review</strong>: a <strong>Score</strong> from 1 to 5, and <strong>Reviewer notes</strong>.</li></ul><p>Statuses are Submitted, Under review, Accepted, Waitlisted and Rejected. The list shows each submission's author, track, format, score and status, newest first. Filter it by status or format, or search titles, authors and tracks. Each row's <strong>⋯</strong> menu has <strong>Edit</strong>, <strong>Duplicate</strong> and <strong>Delete</strong>, and an open submission has its own <strong>Delete</strong>. Either way Events asks you to confirm, and a deleted submission can't be restored.</p>$html$,
      '[]',
      null,
      120
    ),
    (
      'accepting-a-submission',
      'Call for Papers',
      'What accepting a submission does',
      $html$<p>Call for Papers is a record your team keeps. Speakers can't send submissions to Events themselves, because there's no public form, so your team adds each one. Changing a submission's status doesn't email its author, and setting it to Accepted doesn't add a session to any agenda. To schedule an accepted talk, add it as a session in <strong>Program → Agenda Builder</strong>.</p><p>Accepted submissions can be imported into an event's operations workflow as unscheduled activities, with their author added as a presenter. In the event editor, open <strong>Operations workspace</strong>, then its <strong>Workflow</strong> tab and <strong>Import & export</strong>. See <a href="/help/events/operations">Operations workspace</a>.</p><p>The figures across the top of Call for Papers count all <strong>Submissions</strong>, the <strong>Accepted</strong> and <strong>Under review</strong> ones, and the <strong>Accept rate</strong>, the share of submissions that are Accepted.</p>$html$,
      '[]',
      null,
      130
    ),
    (
      'session-missing-from-grid',
      'Troubleshooting',
      'A session is missing from the agenda grid',
      $html$<p>A session you added doesn't appear on the event's agenda grid in Agenda Builder.</p><p>The grid shows the sessions on the day you're looking at that have a start time. A session without one waits in the <strong>Unscheduled</strong> tray at the top of the agenda. A session with a start time but no <strong>Day</strong> only shows on the grid when no session in the event has a day, and a track or status filter can hide a session too.</p><p>To find and fix it:</p><ol><li>Set the filters back to <strong>All tracks</strong> and <strong>All Statuses</strong>.</li><li>Switch to <strong>List</strong>, and find the session under its day or under <strong>Unscheduled</strong>.</li><li>In the session's <strong>⋯</strong> menu, choose <strong>Edit</strong>.</li><li>Give it a <strong>Day</strong> and a <strong>Start time</strong>, then choose <strong>Save session</strong>.</li></ol>$html$,
      '[]',
      null,
      140
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"CalendarDays","label":"Events","href":"/help/events/events"},{"icon":"LayoutTemplate","label":"Event page","href":"/help/events/event-page"},{"icon":"Mic","label":"Speakers","href":"/help/events/speakers"},{"icon":"Radio","label":"Broadcast & On-demand","href":"/help/events/broadcast"},{"icon":"ScanLine","label":"Check-in","href":"/help/events/check-in"},{"icon":"BriefcaseBusiness","label":"Operations workspace","href":"/help/events/operations"}]',
      null,
      150
    )
) as v(anchor_id, eyebrow, title, content, links, showcase, sort_order)
cross join (select id from public.docs_pages where slug = 'events/program' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Program',
    description = 'Build the agenda, run display boards, collect papers, assign sessions and issue certificates.',
    status = 'draft',
    published_at = null
where slug = 'events/program' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'events/program' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Agenda Builder</li><li>Display boards</li><li>Call for papers</li><li>Assign agenda</li><li>CEU and certificates</li></ul>',
  10
from public.docs_pages p
where p.slug = 'events/program' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
