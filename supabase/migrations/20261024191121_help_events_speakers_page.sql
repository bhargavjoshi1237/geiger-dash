-- Help events speakers page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the events/speakers draft outline from
-- 20261024191100_help_events_structure with the full Speakers guide and publishes it.
-- Written from a survey of C:\Pro\geiger-events (components/internal/sidebar/sidebar_nav.jsx,
-- components/internal/screens/registry.jsx, components/internal/screens/conference/{screens.jsx,constants.js,detail_fields.jsx},
-- components/internal/screens/conference/modules/{speaker,portal_invite,backstage,shared,recording,simulive}.jsx,
-- components/internal/shared/records/{records_kit,record_fields,builders}.jsx, components/internal/shared/editor_shell.jsx,
-- components/internal/screens/events/{event_conference.jsx,event_sections.js}, components/internal/screens/events/builder/components/proof.jsx,
-- lib/supabase/{records,conference,storage}.js, lib/passes/{attendees,roles}.js, lib/email/catalog.js, geiger-ui.config.js).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set description = 'Keep a roster of your speakers, track the bio, slides and other materials each one owes you, and run a checklist for every backstage green room.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'events/speakers' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'events/speakers' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, showcase, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.showcase, v.sort_order
from (
  values
    (
      'adding-a-speaker',
      'Basics',
      'Adding a speaker',
      $html$<p>To add a speaker, choose <strong>Speakers → Speakers</strong> in the sidebar, then <strong>Add speaker</strong>. Only <strong>Full name</strong> is required: without one, Events asks for a name and doesn't add the speaker.</p><ul><li><strong>Full name</strong>, <strong>Title / role</strong> and <strong>Company</strong>: who they are. The title and company show under the name in the list.</li><li><strong>Status</strong>: Confirmed, Invited, Tentative or Declined. New speakers start as Invited.</li></ul><p>The speaker joins the top of the list straight away. Click them to fill in the rest of their profile. Adding a speaker doesn't email them or invite them anywhere: the list is your team's record of who's presenting.</p><p>By default, <strong>Speakers</strong> appears in the sidebar for the Owner, Admin and Manager roles. Under <strong>Settings → Navigation</strong>, <strong>Speakers</strong> can't be hidden while <strong>Speaker Portal</strong> or <strong>Speaker Backstage</strong> is showing. To change who sees it, see <a href="/help/events/settings#roles-and-permissions">Roles and permissions</a>.</p>$html$,
      '[]',
      null,
      10
    ),
    (
      'how-the-speaker-screens-fit',
      'Concepts',
      'How the speaker screens fit together',
      $html$<p>The <strong>Speakers</strong> area has three screens, and each keeps its own list. Nothing links them: a speaker you add on one screen doesn't appear on the others, so add them to each screen you use.</p><ul><li><strong>Speakers</strong> is the roster: each speaker's profile, bio, topics, sessions and headshot. It's the only one of the three that other parts of Events read.</li><li><strong>Speaker Portal</strong> tracks what each speaker has handed in: their bio, headshot, slides, A/V form and availability. Your team ticks items off as they arrive.</li><li><strong>Speaker Backstage</strong> is a checklist for each session's green room: who's on deck, the call time, tech checks and the run of show.</li></ul><p>Every status on these screens is a label your team sets by hand. Events never changes one on its own, for example when a deadline passes or a session starts.</p><p>Speakers from these lists don't appear on the event page. To feature people on an event's page, add them in the event editor's <strong>Guests</strong> section; see <a href="/help/events/event-page">Event page</a>.</p>$html$,
      '[]',
      null,
      20
    ),
    (
      'speaker-list',
      'Speakers',
      'The speaker list',
      $html$<p><strong>Speakers → Speakers</strong> lists every speaker in the project, newest first. Each row shows the speaker's headshot (or the first letter of their name), their name with title and company, their status, up to three of their topics, and <strong>★ Featured</strong> for featured speakers.</p><p>The figures across the top count the whole roster: <strong>Speakers</strong>, <strong>Confirmed</strong>, <strong>Featured</strong> and <strong>Companies</strong>, the number of different companies your speakers come from. Search and filters don't change them.</p><p>Filter the list by status, or type in <strong>Search speakers, companies, topics</strong> to match names, companies and topics. When nothing matches, <strong>Clear filters</strong> resets both.</p>$html$,
      '[]',
      null,
      30
    ),
    (
      'editing-a-speaker-profile',
      'Speakers',
      'Editing a speaker''s profile',
      $html$<p>Click a speaker, or choose <strong>Edit</strong> in their row's <strong>⋯</strong> menu, to open their profile. Pick a section from the list beside it:</p><ul><li><strong>Profile</strong>: <strong>Full name</strong>, <strong>Status</strong>, <strong>Title / role</strong>, <strong>Company</strong>, <strong>Email</strong> and <strong>Phone</strong>.</li><li><strong>Bio & topics</strong>: a <strong>Biography</strong>, <strong>Topics</strong>, and <strong>Featured speaker</strong>, which marks them Featured in the list and on their profile. To add a topic, type it and press <code>Enter</code> or choose <strong>Add</strong>; the × beside a topic removes it.</li><li><strong>Sessions</strong>: the titles of the sessions they present, added the same way as topics. These are titles you type, not links to sessions in Agenda Builder.</li><li><strong>Links</strong>: <strong>X / Twitter</strong>, <strong>LinkedIn</strong> and <strong>Website</strong>.</li><li><strong>Headshot</strong>: a square photo, shown in the list and at the top of the profile.</li></ul><p>The strip under the speaker's name shows their title, company, number of sessions and topics, with buttons to email or call them and to open their website, X and LinkedIn profiles once those are filled in.</p><p>Changes in <strong>Profile</strong>, <strong>Bio & topics</strong>, <strong>Sessions</strong> and <strong>Links</strong> are kept only when you choose <strong>Save Changes</strong> at the top. Uploading or removing a headshot saves straight away. Only the teammate who added the speaker can upload one, and Events shrinks it to under 500 KB.</p>$html$,
      '[]',
      null,
      40
    ),
    (
      'where-speakers-appear',
      'Speakers',
      'Where speakers appear',
      $html$<p>Speakers in <strong>Speakers → Speakers</strong> are used in two other places in Events:</p><ul><li><strong>Badges</strong>: in <strong>Check-in → Badge Printing</strong>, every speaker in the project gets a pass with the Speaker role for each event you print, whatever their status. The pass carries their name, title, company and email, with their first session (or first two topics) as its detail line. See <a href="/help/events/check-in">Check-in</a>.</li><li><strong>Recordings</strong>: the <strong>Speaker</strong> picker on a recording in <strong>Recordings & Replay</strong>, or on a broadcast in <strong>Simulive & On-demand</strong>, lists your speakers. See <a href="/help/events/broadcast">Broadcast & On-demand</a>.</li></ul><p>Deleting a speaker takes them out of both. Speakers aren't shown on the event page; the people there come from the event editor's <strong>Guests</strong> section.</p>$html$,
      '[]',
      null,
      50
    ),
    (
      'tracking-speaker-submissions',
      'Speaker Portal',
      'Tracking speaker submissions',
      $html$<p><strong>Speaker Portal</strong> tracks the five things each speaker owes you: their bio, headshot, slides, A/V form and availability. To start tracking a speaker, choose <strong>Speakers → Speaker Portal</strong>, then <strong>Invite speaker</strong>. Only <strong>Speaker name</strong> is required; <strong>Email</strong> and <strong>Session</strong> are optional. New invites start as Not started.</p><p><strong>Invite speaker</strong> only adds a row for your team. Events doesn't email the speaker or host a portal page for them. If speakers send their materials somewhere of your own, paste that address into <strong>Portal link</strong> so your team can open it from the invite.</p><p>Click an invite to open it:</p><ul><li><strong>Invite</strong>: <strong>Speaker name</strong>, <strong>Status</strong>, <strong>Email</strong>, <strong>Session</strong>, <strong>Deadline</strong> and <strong>Portal link</strong>. The deadline is plain text, like <code>2026-06-01</code>.</li><li><strong>Checklist</strong>: turn on <strong>Bio submitted</strong>, <strong>Headshot submitted</strong>, <strong>Slides submitted</strong>, <strong>A/V form submitted</strong> and <strong>Availability confirmed</strong> as each one arrives.</li><li><strong>Materials</strong>: the <strong>Speaker bio</strong> they sent, and <strong>Notes</strong> for follow-ups.</li><li><strong>Headshot</strong>: their photo.</li></ul><p>The card at the top shows a completion ring (the share of the five items done), the status, the session and deadline, and buttons to email the speaker and open the portal link. Fields need <strong>Save Changes</strong>; uploading a headshot saves straight away. The bio and headshot here are separate from the speaker's profile in <strong>Speakers</strong>, and changing one doesn't change the other.</p>$html$,
      '[]',
      null,
      60
    ),
    (
      'speaker-portal-list',
      'Speaker Portal',
      'The Speaker Portal list',
      $html$<p><strong>Speakers → Speaker Portal</strong> lists every invite, newest first, with the speaker and their session, <strong>Progress</strong> (checklist items done out of 5), <strong>Deadline</strong> and status.</p><p>The status is Not started, In progress, Submitted, Approved or Overdue, and you set it yourself in the invite's <strong>Invite</strong> section. Ticking checklist items doesn't change it, and an invite isn't marked Overdue when its deadline passes.</p><p>The figures across the top are <strong>Invites</strong>, <strong>Approved</strong>, <strong>Overdue</strong> and <strong>Completion</strong>, the share of all checklist items done across every invite. Filter the list by status, or search by speaker name, email or session.</p>$html$,
      '[]',
      null,
      70
    ),
    (
      'running-a-backstage-room',
      'Speaker Backstage',
      'Running a backstage room',
      $html$<p><strong>Speaker Backstage</strong> keeps a checklist for each session's green room. To add one, choose <strong>Speakers → Speaker Backstage</strong>, then <strong>Add backstage room</strong>. Only <strong>Room Name</strong> is required; you can also type the <strong>Session</strong> and the <strong>Call time</strong>, like <code>08:30</code>. New rooms start in Green room.</p><p>Click a room to open it:</p><ul><li><strong>Room</strong>: <strong>Room Name</strong>, <strong>Status</strong>, <strong>Session</strong>, <strong>Call time</strong> and <strong>Stage manager</strong>.</li><li><strong>Event</strong>: the event the session belongs to, or <strong>Not linked to an event</strong>. Picking one saves straight away.</li><li><strong>Line-up</strong>: <strong>Speakers on deck</strong>, names you type (not linked to the roster), and the <strong>Backstage join link</strong> for your green-room call.</li><li><strong>Tech check</strong>: <strong>Microphone tested</strong>, <strong>Camera tested</strong>, <strong>Screen share tested</strong> and <strong>Connection stable</strong>.</li><li><strong>Run of show</strong>: the timed plan for the session, and private <strong>Producer notes</strong>.</li></ul><p>Move the room's status through Green room, Tech check, Standing by, On air and Wrapped as the session goes. The status, join link and checks are for your team: Events doesn't send the link to anyone, host the call, or take a livestream room live when you choose On air.</p><p>The list shows each room's session, how many speakers are on deck, the call time, tech checks done out of 4, and the status. The figures across the top are <strong>Rooms</strong>, <strong>Standing by</strong>, <strong>On air</strong> and <strong>Speakers</strong>, everyone on deck across all rooms. Filter by status, or search by room, session, speaker or stage manager.</p>$html$,
      '[]',
      null,
      80
    ),
    (
      'saving-duplicating-and-deleting',
      'Speakers',
      'Saving, duplicating and deleting',
      $html$<p><strong>Speakers</strong>, <strong>Speaker Portal</strong> and <strong>Speaker Backstage</strong> work the same way. Each row's <strong>⋯</strong> menu has <strong>Edit</strong>, <strong>Duplicate</strong> and <strong>Delete</strong>.</p><ul><li>In an open speaker, invite or backstage room, field changes wait for <strong>Save Changes</strong>, which stays unavailable until you change something. Events doesn't warn you if you go back to the list without saving.</li><li>A photo upload, and a backstage room's <strong>Event</strong>, save straight away, along with any unsaved changes elsewhere in the same record.</li><li><strong>Duplicate</strong> adds a copy named with <code>(copy)</code> at the end, with everything except the photo.</li><li><strong>Delete</strong> asks you to confirm first, and a deleted record can't be restored from Events. You can also delete from the <strong>Delete</strong> button at the top of an open record.</li></ul>$html$,
      '[]',
      null,
      90
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"CalendarClock","label":"Program","href":"/help/events/program"},{"icon":"Radio","label":"Broadcast & On-demand","href":"/help/events/broadcast"},{"icon":"ScanLine","label":"Check-in","href":"/help/events/check-in"},{"icon":"LayoutTemplate","label":"Event page","href":"/help/events/event-page"},{"icon":"Handshake","label":"Sponsors & Expo","href":"/help/events/sponsors"},{"icon":"CalendarDays","label":"Events","href":"/help/events/events"}]',
      null,
      100
    )
) as v(anchor_id, eyebrow, title, content, links, showcase, sort_order)
cross join (select id from public.docs_pages where slug = 'events/speakers' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Speakers',
    description = 'Manage speakers, their submission portal and the backstage run of show.',
    status = 'draft',
    published_at = null
where slug = 'events/speakers' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'events/speakers' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Speakers</li><li>Speaker portal</li><li>Speaker backstage</li></ul>',
  10
from public.docs_pages p
where p.slug = 'events/speakers' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
