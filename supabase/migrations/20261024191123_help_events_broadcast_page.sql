-- Help events broadcast page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the events/broadcast draft outline from
-- 20261024191100_help_events_structure with the full Broadcast & On-demand guide and publishes it. Mobile Event App and
-- Branded App get no section (neither changes anything attendees use: Branded App keeps nothing, and the Mobile Event App
-- settings are read by nothing), and neither does Captions & Transcription (its jobs are simulated: a timer marks them
-- Ready with a made-up transcript link).
-- Written from a survey of C:\Pro\geiger-events (components/internal/sidebar/sidebar_nav.jsx,
-- components/internal/screens/registry.jsx, components/internal/screens/conference/{screens.jsx,constants.js,detail_fields.jsx,
-- live_control.jsx,breakout_assign.jsx,captions.jsx,caption_settings.jsx,mobile_app.jsx},
-- components/internal/screens/conference/modules/{room,webinar,breakout,recording,simulive,caption,session,shared}.jsx,
-- components/internal/screens/branded/branded_app.jsx, components/internal/shared/records/*, app/r/[id]/page.js,
-- app/api/live/*, app/api/portal/{live,watch}/*, lib/live/*, lib/portal/{live,watch,grants}.js, lib/video-embed.js,
-- lib/memberships/entitlements.js, lib/hooks/use-presence-heartbeat.js, components/portal/{portal_live,portal_watch,portal_shell}.jsx,
-- mobile/app.json, mobile/eas.json, geiger-ui.config.js).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set description = 'Run livestream, webinar and breakout rooms for plan members, decide who can watch, and publish recordings and on-demand broadcasts.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'events/broadcast' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'events/broadcast' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, showcase, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.showcase, v.sort_order
from (
  values
    (
      'adding-a-livestream-room',
      'Basics',
      'Adding a livestream room',
      $html$<p>To add a livestream room, choose <strong>Broadcast & On-demand → Livestream Rooms</strong> in the sidebar, then <strong>Add room</strong>. Only <strong>Room Name</strong> is required: without one, Events asks for a name and doesn't add the room.</p><ul><li><strong>Type</strong>: Digital, On-site or Hybrid. New rooms are Digital.</li><li><strong>Capacity</strong>: how many people the room holds. It's for your records: Events doesn't stop people joining once it's reached.</li><li><strong>Access</strong>: which plan members can watch. New rooms are <strong>Free To Watch</strong>; see <a href="#who-can-watch">Who can watch</a>.</li></ul><p>New rooms start as Offline. Click the room to set its schedule and the link attendees watch. Events doesn't stream video itself: a room plays a link you give it, such as a YouTube or Vimeo stream.</p><p>By default, <strong>Broadcast & On-demand</strong> appears in the sidebar for the Owner, Admin and Manager roles. Under <strong>Settings → Navigation</strong>, <strong>Livestream Rooms</strong> can't be hidden while <strong>Recordings & Replay</strong> is showing, and <strong>Recordings & Replay</strong> can't be hidden while a screen that needs it, such as <strong>Simulive & On-demand</strong>, is showing. To change who sees it, see <a href="/help/events/settings#roles-and-permissions">Roles and permissions</a>.</p>$html$,
      '[]',
      null,
      10
    ),
    (
      'how-attendees-watch',
      'Concepts',
      'How attendees watch',
      $html$<p>Attendees watch in the members portal, after signing in. Rooms from <strong>Livestream Rooms</strong>, <strong>Webinar Rooms</strong> and <strong>Breakout Rooms</strong> appear under <strong>Live</strong>. Recordings from <strong>Recordings & Replay</strong> and broadcasts from <strong>Simulive & On-demand</strong> appear under <strong>Watch</strong>. See <a href="/help/events/members-portal">Members portal</a>.</p><p>Only plan members see them: people with an Active membership, on an active plan, in this project. Someone who holds a ticket but no membership sees nothing under Live or Watch. Each item's access setting then decides which plan members get it.</p><p>Events doesn't upload, host or stream video. It plays the link you add. YouTube and Vimeo links, embed links (with <code>/embed</code> in the address) and direct video files such as <code>.mp4</code>, <code>.webm</code> or <code>.mov</code> play inside the portal. Any other link is treated as a video file, so a meeting invite, such as a Zoom or Teams link, doesn't play there.</p><p>While an attendee has a room or recording open, the portal checks in every 30 seconds, and the viewer figures in Events come from those check-ins. <strong>Watching now</strong> counts people seen in the last 90 seconds, <strong>Unique viewers</strong> counts everyone who has ever opened the item, and <strong>Watch time</strong> adds up their time. Nobody types these in.</p>$html$,
      '[]',
      null,
      20
    ),
    (
      'who-can-watch',
      'Concepts',
      'Who can watch: access rules',
      $html$<p>Every livestream room, webinar, breakout room and simulive broadcast has an <strong>Access</strong> setting that decides which plan members (people with an Active membership in this project) see it in the members portal. You set it when you add the item, or later in its <strong>Access</strong> section, where changes need <strong>Save Changes</strong>.</p><ul><li><strong>Free To Watch</strong>, the default: every plan member in the project. The <strong>Require registration</strong> switch under it is saved but not checked, so it doesn't narrow who can watch.</li><li><strong>Paid / Restricted</strong>: plan members on a plan you select under <strong>Membership</strong>. Plan members whose plan's <strong>VOD content</strong> covers the item get in too: <strong>Full catalogue</strong> covers every item, and <strong>Selected</strong> covers items linked to one of the plan's events. See <a href="/help/events/memberships">Memberships</a>.</li><li><strong>One-time purchase</strong> and <strong>Rental</strong> save a price, and a rental's <strong>Access window</strong> in days (3 to start). They show in the list's <strong>Access</strong> column, but attendees have no way to buy or rent, so they let nobody in.</li></ul><p>Restricted access ends when the membership's expiry date passes, or when a time-based VOD content period runs out, whichever comes first. Free items stay visible for as long as the membership is Active, even past its expiry date.</p><p>Recordings in <strong>Recordings & Replay</strong> have no access setting: every plan member in the project can watch every published recording, whatever their plan's VOD content is set to.</p>$html$,
      '[]',
      null,
      30
    ),
    (
      'scheduling-and-going-live',
      'Livestream Rooms',
      'Scheduling a room and going live',
      $html$<p>A livestream room or webinar opens to attendees on its schedule. Set <strong>Starts at</strong> and, optionally, <strong>Ends at</strong> in the room's <strong>Room</strong> section (a webinar's <strong>Overview</strong>), then choose <strong>Save Changes</strong>. Attendees see the room in one of these states:</p><ul><li><strong>Scheduled</strong>: more than 15 minutes before the start. It's listed, but it can't be opened yet.</li><li><strong>Opening soon</strong>: the last 15 minutes before the start. Attendees can open it.</li><li><strong>Live</strong>: from the start until <strong>Ends at</strong>, or until you end it when there's no end time.</li><li><strong>Ended</strong>: after the end time. The room leaves attendees' lists.</li><li><strong>Manual</strong>: there's no start time. Attendees can open the room only while its <strong>Status</strong> is Live.</li></ul><p>The <strong>Live</strong> section overrides the schedule, and each button saves straight away. <strong>Go live</strong> opens the room now, <strong>End room</strong> closes it and takes it off attendees' lists, and <strong>Clear override</strong> goes back to the schedule. The section also shows the state attendees see, and the room's <strong>Watching now</strong>, <strong>Unique viewers</strong> and <strong>Watch time</strong>, refreshed every 15 seconds.</p><p>Attendees whose access allows it see a room from the moment it exists, whatever its Status, until it ends. Once a room has a start time or an override, its Status is only a label for your team: setting a webinar to Cancelled, for example, doesn't stop it opening. Use <strong>End room</strong>, or delete it.</p>$html$,
      '[]',
      null,
      40
    ),
    (
      'livestream-room-settings',
      'Livestream Rooms',
      'Livestream room settings',
      $html$<p>Click a room in <strong>Livestream Rooms</strong> to open it. Besides <strong>Room</strong>, <strong>Live</strong> and <strong>Access</strong>, it has these sections:</p><ul><li><strong>Event</strong>: the event the room belongs to, or <strong>Not linked to an event</strong>. Attendees see the event's name on the room, and a plan's Selected VOD content covers the room through it. Picking one saves straight away.</li><li><strong>Location</strong>: where the physical room is, for on-site and hybrid rooms.</li><li><strong>Stream</strong>: <strong>Provider</strong>, <strong>Stream / ingest URL</strong>, <strong>Watch link</strong> and <strong>Notes</strong>.</li></ul><p>The <strong>Watch link</strong> is what attendees play. If it's empty, the members portal plays the <strong>Stream / ingest URL</strong> instead, so keep a private ingest address out of the room until it has a watch link. The <strong>Notes</strong> show to attendees under the player, so don't keep private AV notes there. <strong>Provider</strong> and <strong>Location</strong> stay in Events.</p><p>The list shows each room's location or provider, type, access, start time, how many are watching, and status. The figures across the top are <strong>Rooms</strong>, <strong>Live now</strong> (rooms whose Status is Live), <strong>Watching</strong> and <strong>Unique viewers</strong>, counted when you open the screen. Filter by status or type, or search by name, location or provider.</p>$html$,
      '[]',
      null,
      50
    ),
    (
      'webinar-rooms',
      'Webinar Rooms',
      'Webinar rooms',
      $html$<p>To add a webinar, choose <strong>Broadcast & On-demand → Webinar Rooms</strong>, then <strong>Add webinar</strong>. Only <strong>Webinar title</strong> is required. You can also pick a <strong>Platform</strong> (Zoom, YouTube Live, Google Meet, Teams or Custom; Zoom to start), name the <strong>Presenter</strong> and set <strong>Access</strong>. New webinars are Draft.</p><p>A webinar opens and closes like a livestream room: set <strong>Starts at</strong> and <strong>Ends at</strong> under <strong>Overview</strong>, or use <strong>Go live</strong> and <strong>End room</strong> in its <strong>Live</strong> section. The <strong>Join link</strong> in <strong>Stream & replay</strong> is what attendees play, the same way a watch link plays, so a Zoom or Teams meeting link won't play in the portal. The <strong>Description</strong> from <strong>Overview</strong> shows under the player. Link the webinar to its event in <strong>Event</strong>.</p><p>Some webinar fields are records for your team and change nothing for attendees:</p><ul><li><strong>Requires registration</strong> and <strong>Registration link</strong> aren't checked or shown. <strong>Registered (manual)</strong> is a number you type, used in the <strong>Registered</strong> column and the <strong>Show rate</strong> figure.</li><li><strong>Replay link</strong> isn't shown anywhere. To offer the replay, add it in <strong>Recordings & Replay</strong>.</li><li><strong>Platform</strong>, <strong>Presenter</strong>, <strong>Duration</strong>, <strong>Capacity</strong> and the <strong>Cover</strong> image stay in Events.</li></ul><p>The list shows each webinar's platform and presenter, access, start time, <strong>Registered</strong> (your typed count out of capacity), <strong>Attended</strong> (unique viewers) and status. The figures are <strong>Webinars</strong>, <strong>Watching</strong>, <strong>Registered</strong> and <strong>Show rate</strong>, attended out of registered. Filter by status or platform.</p>$html$,
      '[]',
      null,
      60
    ),
    (
      'breakout-rooms',
      'Breakout Rooms',
      'Breakout rooms',
      $html$<p>To add a breakout room, choose <strong>Broadcast & On-demand → Breakout Rooms</strong>, then <strong>Add breakout room</strong>. Only <strong>Room Name</strong> is required. You can also pick a <strong>Type</strong> (Discussion, Workshop, Networking or Roundtable; Discussion to start), name the <strong>Facilitator</strong> and set <strong>Access</strong>. New breakout rooms are Draft.</p><p>Breakout rooms have no schedule and no <strong>Live</strong> section. Attendees whose access allows it see a breakout room under Live from the moment it exists, and can open it only while its <strong>Status</strong> is Open. Draft, In progress, Full and Closed all keep it listed but closed. It stays on attendees' lists until you delete it.</p><p>Click a breakout room to open it:</p><ul><li><strong>Room</strong>: <strong>Room Name</strong>, <strong>Status</strong>, <strong>Type</strong>, <strong>Topic</strong> and <strong>Duration</strong>.</li><li><strong>Facilitator & session</strong>: the <strong>Facilitator</strong>, and the <strong>Parent session</strong> the room splits from, picked from the sessions in <strong>Program → Agenda Builder</strong>.</li><li><strong>Capacity</strong>: how many people <strong>Assign attendees</strong> places in the room. The <strong>Auto-assign attendees</strong> switch is saved but does nothing.</li><li><strong>Rounds & roster</strong>: assignments, the round clock and broadcasts.</li><li><strong>Join & notes</strong>: the <strong>Join link</strong> attendees play, and <strong>Notes</strong>, which show to attendees under the player.</li></ul><p>Breakout rooms aren't linked to an event, so a plan's Selected VOD content never covers them. The list shows each room's topic, type, access, facilitator, <strong>Seats</strong> (watching now out of capacity) and status. The figures are <strong>Rooms</strong>, <strong>Open</strong>, <strong>Participants</strong> (in rooms now) and <strong>Fill</strong>, participants out of total capacity.</p>$html$,
      '[]',
      null,
      70
    ),
    (
      'running-breakout-rounds',
      'Breakout Rooms',
      'Running breakout rounds',
      $html$<p>Breakout rooms that share a <strong>Parent session</strong> form a round. Open any of them and choose <strong>Rounds & roster</strong> to run the round for every room in it. Pick the parent session under <strong>Facilitator & session</strong> first; until you do, the section asks for one.</p><ul><li><strong>Assignment</strong>: choose <strong>Balanced</strong> (spread evenly, the default) or <strong>Sequential</strong> (fill each room in turn), then <strong>Assign attendees</strong>. Events places every plan member with an Active membership in the project, up to each room's capacity, and names anyone who didn't fit. The placements are saved on the rooms for your team. Attendees aren't told their room, and can open any breakout room their access allows.</li><li><strong>Round clock</strong>: pick 5, 10, 15 or 25 minutes (10 to start) and choose <strong>Start round</strong>. <strong>Stop</strong> ends it early. Attendees in any of the round's rooms see the same countdown.</li><li><strong>Broadcast</strong>: type a message and choose <strong>Send</strong>, or press <code>Enter</code>. It appears under <strong>From the host</strong> in every room of the round, where attendees see the latest 8 messages, newest first.</li></ul><p>Each action saves straight away. Attendees' rooms check for a new clock and messages every 5 seconds.</p>$html$,
      '[]',
      null,
      80
    ),
    (
      'adding-a-recording',
      'Recordings & Replay',
      'Adding a recording',
      $html$<p>To add a recording, choose <strong>Broadcast & On-demand → Recordings & Replay</strong>, then <strong>Add recording</strong>. Only <strong>Title</strong> is required. Type the <strong>Session</strong> it captured, like <code>Main Stage · Day 1</code>, and paste its <strong>Video URL</strong>. New recordings are Draft.</p><p>Events doesn't upload or host the video: the recording plays from the link, the same way a livestream room does. To change the link later, open the recording's <strong>Video</strong> section, paste the new link, and press <code>Enter</code> or click away. It saves then, and a preview plays underneath.</p><p>A recording appears under <strong>Watch</strong> in the members portal once its <strong>Status</strong> is Published and it has a video link; Processing and Draft keep it out. Recordings have no access setting, so every plan member with an Active membership in the project can watch every published recording. See <a href="/help/events/members-portal">Members portal</a>.</p>$html$,
      '[]',
      null,
      90
    ),
    (
      'recording-details',
      'Recordings & Replay',
      'Recording details and what viewers see',
      $html$<p>Click a recording in <strong>Recordings & Replay</strong> to open it:</p><ul><li><strong>Details</strong>: <strong>Title</strong>, <strong>Status</strong> (Published, Processing or Draft), the <strong>Session</strong> and <strong>Speaker</strong> pickers, <strong>Recorded on</strong>, <strong>Duration</strong> (like <code>42:15</code>), <strong>Tags</strong> and <strong>Description</strong>. These need <strong>Save Changes</strong>.</li><li><strong>Video</strong>: the link and a preview.</li><li><strong>Events</strong>: select the events the recording came from. The members portal shows the first one's name.</li><li><strong>Sharing</strong>: the public replay page.</li><li><strong>Thumbnail</strong>: the image on the recording's card in the members portal.</li></ul><p><strong>Video</strong>, <strong>Events</strong>, <strong>Sharing</strong> and <strong>Thumbnail</strong> save straight away when you change them.</p><p>Viewers see the title, the session you typed when you added the recording, the duration, the description and the tags. The <strong>Session</strong> and <strong>Speaker</strong> pickers link the recording to an Agenda Builder session and a speaker from <strong>Speakers</strong> for your team, but neither name is shown to viewers. The typed session can't be changed once the recording exists.</p><p>The list shows each recording's session, duration, <strong>Viewers</strong> (unique viewers in the members portal), <strong>Sharing</strong> (Public link or Private) and status. The figures are <strong>Recordings</strong>, <strong>Published</strong>, <strong>Public links</strong> and <strong>Viewers</strong>.</p>$html$,
      '[]',
      null,
      100
    ),
    (
      'public-replay-page',
      'Recordings & Replay',
      'Sharing a public replay page',
      $html$<p>A public replay page lets anyone with its link watch a recording, without signing in or holding a membership. To publish one, open the recording in <strong>Recordings & Replay</strong>, choose <strong>Sharing</strong>, and turn on <strong>Public replay page</strong>. It saves straight away, and the link appears underneath with <strong>Copy</strong> and <strong>Open</strong>.</p><p>The page plays the video and shows the title, the session typed when the recording was added, the duration, <strong>Recorded on</strong>, the description and the tags, with a <strong>Share</strong> button. It ignores the recording's Status, so a Draft recording with the switch on can still be watched. Turn the switch off to close the page: the link then shows <strong>Recording unavailable</strong>.</p><p>Views on the public page aren't counted in the recording's viewer figures. Duplicating a public recording makes a copy that's public too, with a link of its own.</p>$html$,
      '[]',
      null,
      110
    ),
    (
      'simulive-and-on-demand',
      'Simulive & On-demand',
      'Simulive and on-demand broadcasts',
      $html$<p><strong>Simulive & On-demand</strong> holds pre-recorded broadcasts that, unlike recordings, have access rules. To add one, choose <strong>Broadcast & On-demand → Simulive & On-demand</strong>, then <strong>Add broadcast</strong>. Only <strong>Title</strong> is required. Pick a <strong>Mode</strong> (Simulive, On-demand or Encore; Simulive to start), paste the <strong>Content</strong> link and set <strong>Access</strong>. New broadcasts are Draft.</p><p>A broadcast appears under <strong>Watch</strong> in the members portal while its <strong>Status</strong> is Available or Premiering and it has a video link, for the plan members its access lets in. Draft, Scheduled and Ended keep it out. Attendees play it from the start whenever they open it: <strong>Premiere time</strong> and <strong>Mode</strong> don't schedule or sync playback, so change the Status yourself when the premiere starts and ends.</p><p>Click a broadcast to open it. Its sections are <strong>Details</strong> (<strong>Title</strong>, <strong>Status</strong>, <strong>Mode</strong>, the <strong>Session</strong> and <strong>Speaker</strong> pickers, <strong>Premiere time</strong>, <strong>Duration</strong> and <strong>Description</strong>), <strong>Video</strong>, <strong>Access</strong>, <strong>Event</strong> (one event, shown to viewers and used by a plan's Selected VOD content) and <strong>Thumbnail</strong>. The <strong>Captions available</strong> switch under <strong>Access</strong> is saved but adds no captions. Viewers see the title, duration, description, event and thumbnail.</p><p>The list shows each broadcast's mode, access, premiere time, <strong>Viewers</strong> and status. The figures are <strong>Broadcasts</strong>, <strong>Premiering</strong>, <strong>Available</strong> and <strong>Viewers</strong>. Filter by status or mode.</p>$html$,
      '[]',
      null,
      120
    ),
    (
      'saving-duplicating-and-deleting',
      'Broadcast & On-demand',
      'Saving, duplicating and deleting',
      $html$<p>Livestream rooms, webinars, breakout rooms, recordings and broadcasts all work the same way. Click a row, or choose <strong>Edit</strong> in its <strong>⋯</strong> menu, to open it, then pick a section from the list beside it.</p><ul><li>Fields wait for <strong>Save Changes</strong> at the top, which stays unavailable until you change something. Events doesn't warn you if you go back to the list without saving.</li><li><strong>Live</strong>, <strong>Event</strong>, <strong>Events</strong>, <strong>Video</strong>, <strong>Sharing</strong> and image uploads save straight away, along with any unsaved changes elsewhere in the same record.</li><li>Images are shrunk to under 500 KB, and only the teammate who added the record can upload one.</li><li><strong>Duplicate</strong> adds a copy named with <code>(copy)</code> at the end, with everything except the image. Attendees whose access allows it see the copy too.</li><li><strong>Delete</strong> asks you to confirm first, and a deleted record can't be restored from Events. It no longer shows in the members portal.</li></ul><p>Each list shows the newest first. Its figures count every record, whatever the search and filters.</p>$html$,
      '[]',
      null,
      130
    ),
    (
      'attendee-cant-see-a-room',
      'Troubleshooting',
      'An attendee can''t see a room or recording',
      $html$<p>When an attendee can't find a room under <strong>Live</strong> or a recording under <strong>Watch</strong> in the members portal, check these in order:</p><ol><li>They hold an Active membership on an active plan in this project, in <strong>Memberships → Members</strong>. A ticket on its own doesn't add anything to Live or Watch.</li><li>They signed in to the members portal with the email on that membership.</li><li>The item's <strong>Access</strong> lets their plan in: <strong>Free To Watch</strong>, their plan selected under <strong>Membership</strong>, or their plan's VOD content covering it. A purchase or rental price lets nobody in.</li><li>A recording is Published, and a simulive broadcast is Available or Premiering. Both need a video link.</li><li>A room hasn't ended: its <strong>Ends at</strong> hasn't passed and nobody chose <strong>End room</strong>.</li><li>For a restricted item, the membership's expiry date and the plan's VOD content period haven't passed.</li></ol><p>Live reloads its list each time the attendee opens it. Watch loads when they open the members portal, so they reload the portal to see a new recording.</p>$html$,
      '[]',
      null,
      140
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"CircleUser","label":"Members portal","href":"/help/events/members-portal"},{"icon":"BadgeCheck","label":"Memberships","href":"/help/events/memberships"},{"icon":"Mic","label":"Speakers","href":"/help/events/speakers"},{"icon":"CalendarClock","label":"Program","href":"/help/events/program"},{"icon":"CalendarDays","label":"Events","href":"/help/events/events"},{"icon":"Settings","label":"Settings","href":"/help/events/settings"}]',
      null,
      150
    )
) as v(anchor_id, eyebrow, title, content, links, showcase, sort_order)
cross join (select id from public.docs_pages where slug = 'events/broadcast' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Broadcast & On-demand',
    description = 'Run livestream, webinar and breakout rooms, publish recordings and captions, and set up the event app.',
    status = 'draft',
    published_at = null
where slug = 'events/broadcast' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'events/broadcast' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Livestream rooms</li><li>Webinar and breakout rooms</li><li>Recordings and replay</li><li>Simulive and on-demand</li><li>Captions and transcription</li><li>Mobile event app</li><li>Branded app</li></ul>',
  10
from public.docs_pages p
where p.slug = 'events/broadcast' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
