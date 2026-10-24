-- Help events events page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the events/events draft outline from
-- 20261024191100_help_events_structure with the full Events guide (All Events, the event editor and its core
-- sections, Templates and Event Series) and publishes it.
-- Written from a survey of C:\Pro\geiger-events (components/internal/sidebar/{sidebar_nav,sidebar_option}.jsx,
-- components/internal/screens/registry.jsx, components/internal/screens/events/{all_events,events_home,templates,
-- event_series,series_detail,event_detail,event_builder,overview,alerts,location_time,date_time_fields,location_picker,
-- publishing,distribution,recurring_clone,people,event_card_viewer}.jsx, components/internal/screens/events/
-- {event_sections,sample_data}.js, components/internal/shared/{editor_shell,pagination,screen_kit}.jsx,
-- lib/supabase/{events,templates,series,event_team,team,notes}.js, lib/events/{use-event-config,
-- use-default-organizer,schedule}.js, lib/hooks/use-workspace-url.js, lib/notifications/{client,types}.js,
-- lib/passes/{attendees,roles}.js, lib/email/catalog.js, app/e/[id]/*, lib/events/fetch_event_row.js,
-- geiger-ui.config.js, geiger-rbac.config.js, supabase/migrations/{20260726194122_storage,
-- 20260726194134_project_access,20260904090000_ticket_releases}.sql).
-- Left out on purpose: the Events home screen (unreachable, sample data), and the Alerts, Time-zone and Recurring
-- Events sections, Hybrid Mode's streaming and capacity fields and Visibility's access and indexing switches, which
-- save settings nothing reads.
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set description = 'Create events and run each one from the event editor: details, location, visibility and co-hosts, plus templates and event series.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'events/events' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'events/events' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, showcase, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.showcase, v.sort_order
from (
  values
    (
      'creating-an-event',
      'Basics',
      'Creating an event',
      $html$<p>To create an event, choose <strong>Events → All Events</strong> in the sidebar, then <strong>Create Event</strong>. Only <strong>Event name</strong> is required: without one, Events asks you to name the event first. Press <code>Enter</code> in the name field, or choose <strong>Create Event</strong> at the bottom of the dialog, to finish.</p><ul><li><strong>Format</strong>: In-person, Online or Hybrid. New events are In-person.</li><li><strong>Visibility</strong>: Public, Unlisted or Private. New events are Public, so anyone with the link can open the event page (see <a href="#visibility-and-publishing">Visibility and publishing</a>).</li><li><strong>Date</strong> and <strong>Start time</strong>: leave them empty and the event gets a placeholder date and an 18:00 start, so set the real ones before you share it.</li><li><strong>Venue</strong>: one of your project's saved venues, which fills in the address and city too (see <a href="/help/events/venues">Venues & sourcing</a>). Without one, the event gets a placeholder venue until you set one in <strong>Location & Time</strong>.</li><li><strong>Capacity</strong>: how many tickets the event can sell in total, which checkout enforces. It starts at 0, which sets no event-wide limit. An <strong>Overbook buffer</strong> under <strong>Registrations → Capacity Limits</strong> adds to it (see <a href="/help/events/registrations">Registrations</a>).</li></ul><p>The event appears at the top of All Events as a Draft, with your name as its organizer and the London time zone. It doesn't open by itself: click it to open the event editor and set up its tickets, page and the rest. To start from saved defaults instead, see <a href="#templates">Event templates</a>.</p><p>By default, <strong>Events</strong> appears in the sidebar for the Owner, Admin, Manager and Member roles. To change who sees it, see <a href="/help/events/settings#roles-and-permissions">Roles and permissions</a>.</p>$html$,
      '[]',
      null,
      10
    ),
    (
      'event-statuses',
      'Concepts',
      'Event statuses and formats',
      $html$<p>Every event has a status and a format. Both show in All Events and at the top of the event editor, and All Events can be filtered by either.</p><ul><li><strong>Status</strong> is where the event is in its life: Draft, Scheduled, On Sale, Sold out or Ended. New events start as Draft. You set the status yourself on the event's <strong>Overview</strong> in the event editor, and Events never changes it for you: an event doesn't switch to Sold out when its tickets run out, or to Ended when its date passes.</li><li><strong>Format</strong> is how people attend: In-person, Online or Hybrid. It shows on the event page.</li></ul><p>Status is a label for you and your team. It feeds the All Events figures (On Sale and Sold out events count as on sale now), but it doesn't decide who can open the event page or buy tickets. Visibility does that (see <a href="#visibility-and-publishing">Visibility and publishing</a>).</p>$html$,
      '[]',
      null,
      20
    ),
    (
      'all-events',
      'All Events',
      'The All Events list',
      $html$<p><strong>All Events</strong>, under <strong>Events</strong> in the sidebar, lists every event in the project, newest first. Click a row to open that event in the event editor.</p><p>The figures across the top count every event, and search and filters don't change them: <strong>Total events</strong> (with how many are on sale now), <strong>Tickets sold</strong>, <strong>Revenue</strong> (gross, before fees) and <strong>Avg. capacity</strong>, the average share of each event's capacity that's sold.</p><p>Each row shows the event's name, date, start time and venue, its status and format, a sell-through bar (tickets sold against capacity) and its revenue. Narrow the list by status (<strong>All Statuses</strong>, On Sale, Sold out, Scheduled, Draft or Ended) and by format (<strong>All Types</strong>, In-person, Online or Hybrid), or type in the search box to match event names, venues and cities.</p><p>The list shows 25 events a page. Switch to 10, 25, 50 or 100 next to <strong>Per Page</strong> at the bottom.</p><p><strong>Events → All Events</strong> stays in the sidebar for everyone whose role shows Events: it can't be hidden under <a href="/help/events/settings#navigation">Sidebar navigation</a>.</p>$html$,
      '[]',
      null,
      30
    ),
    (
      'duplicating-and-deleting',
      'All Events',
      'Duplicating and deleting events',
      $html$<p>Each row's <strong>⋯</strong> menu in <strong>All Events</strong> has <strong>Edit</strong> (opens the event editor), <strong>Duplicate</strong>, <strong>View page</strong> (opens the event page in a new tab) and <strong>Delete</strong>.</p><ul><li><strong>Duplicate</strong> adds a copy, named after the original with <code>(copy)</code> at the end, to the top of the list as a Draft with no sales. The copy keeps the event's format, date and time, venue, capacity, visibility, organizer, summary, series and Event Wall listing. It doesn't copy the cover media, the organizer photo, the page design, the tickets or any other event editor section, so set those up again on the copy.</li><li><strong>Delete</strong> asks you to confirm first. A deleted event leaves All Events, its event page shows <strong>Event not found</strong>, and Events can't restore it.</li></ul><p>The event editor has no delete of its own: go back to All Events to delete an event.</p>$html$,
      '[]',
      null,
      40
    ),
    (
      'the-event-editor',
      'Event editor',
      'The event editor',
      $html$<p>The event editor is where you set up one event. To open it, click an event in <strong>Events → All Events</strong>, or choose <strong>Edit</strong> in the row's <strong>⋯</strong> menu. It opens on the event's <strong>Overview</strong>.</p><p>The top of the event editor shows the event's name and status, with its date, start time and venue. The editor's own section list sits to the right on a wide screen, and over the section on a narrow one. Choose a section to open it, or choose the search icon at the top of the list (<strong>Search screens</strong>) and type to find a section or group by name. The page address keeps the open event and section, so a refresh or a shared link opens the same place.</p><p>Each group of sections has its own guide:</p><ul><li><strong>Overview</strong>, <strong>Event details</strong>, <strong>Location & Time</strong>, <strong>Co-hosts & Admins</strong>, and <strong>Visibility</strong> and <strong>Hybrid Mode</strong> under <strong>Settings</strong>: this guide.</li><li><strong>Operations</strong>: <a href="/help/events/operations">Operations workspace</a>.</li><li><strong>Design</strong>, <strong>Page</strong>, <strong>Map & Directions</strong> and <strong>Sharing</strong>: <a href="/help/events/event-page">Event page</a>.</li><li><strong>Tickets</strong>: <a href="/help/events/tickets">Tickets</a>. Its rule sections, from <strong>Ticket Rules</strong> to <strong>Batched Releases</strong>, are in <a href="/help/events/ticket-rules">Discounts & ticket rules</a>, <strong>Memberships</strong> in <a href="/help/events/memberships">Memberships</a>, <strong>Packages</strong> in <a href="/help/events/packages">Packages</a> and <strong>Exhibitor Floor</strong> in <a href="/help/events/sponsors">Sponsors & Expo</a>.</li><li><strong>Orders & Attendees</strong>, <strong>Invoices & Receipts</strong> and <strong>Multi-currency</strong>: <a href="/help/events/payments">Payments & policies</a>. <strong>Anti-scalping & Resale</strong> and <strong>Dynamic Pricing</strong>: <a href="/help/events/ticket-rules">Discounts & ticket rules</a>.</li><li><strong>Sponsorship</strong>: <a href="/help/events/sponsors">Sponsors & Expo</a>.</li><li><strong>Registration</strong>, and <strong>Dietary & Accessibility</strong> under <strong>Location</strong>: <a href="/help/events/registrations">Registrations</a>.</li><li><strong>Check-in</strong>: <a href="/help/events/check-in">Check-in</a>. <strong>Communication</strong>: <a href="/help/events/community">Community</a>.</li></ul><p>Some sections appear only when a feature is on. <strong>Packages</strong> and <strong>Packages Page</strong> need packages turned on for the project, and <strong>Early-bird</strong>, <strong>Donations</strong>, <strong>Access Codes</strong>, <strong>Reserved Seating</strong> and <strong>Group Orders</strong> appear once you turn them on in <strong>Ticket Rules</strong>.</p>$html$,
      '[]',
      null,
      50
    ),
    (
      'saving-changes',
      'Event editor',
      'Saving changes and viewing the event page',
      $html$<p>How a change saves depends on the section. <strong>Event details</strong> keeps your edits until you choose <strong>Save Changes</strong> at the top of the event editor, and that button also saves any unsaved <strong>Page design</strong> changes. The other sections in this guide save on their own, as you change them or with a <strong>Save</strong> button inside the section.</p><p>Edits waiting for <strong>Save Changes</strong> are lost if you leave the event editor first, and Events doesn't warn you. To go back to the list, choose <strong>All Events</strong> over the event's name, or use your browser's back button.</p><p>Two icons beside <strong>Save Changes</strong> show the event the way others see it:</p><ul><li>The arrow-out-of-a-box icon (<strong>View live page</strong>) opens the event page in a new tab, whatever the event's status. In All Events, <strong>View page</strong> in each row's <strong>⋯</strong> menu opens the same page.</li><li>The ID card icon (<strong>Open card viewer</strong>) previews the attendee pass with sample details. It needs attendee badges turned on and a design chosen in the event editor's <strong>Badge Printing</strong> section (see <a href="/help/events/check-in">Check-in</a>).</li></ul>$html$,
      '[]',
      null,
      60
    ),
    (
      'event-overview',
      'Event editor',
      'Event overview and pre-launch checklist',
      $html$<p>The event editor opens on <strong>Overview</strong>, a summary of one event. Its figures are <strong>Tickets sold</strong> (with how much of the capacity is left), <strong>Revenue</strong> (gross, with the average per ticket once tickets sell), <strong>Sell-through</strong> (the share of capacity sold) and <strong>Days to go</strong>, which reads Today on the day and Ended once the date has passed.</p><p><strong>Status & sharing</strong> holds the event's <strong>Status</strong> and <strong>Visibility</strong>, and each saves the moment you pick a value. <strong>At a glance</strong> shows the date and start time, capacity, venue and organizer.</p><p>The <strong>Pre-launch checklist</strong> tracks the steps left before the event goes live, and everyone on your team sees the same list. To add a step:</p><ol><li>Choose <strong>Add Item</strong>.</li><li>Type the step in <strong>Item</strong>. It's the only required field.</li><li>Optional: pick a <strong>Due date</strong>.</li><li>Choose <strong>Add Item</strong> in the dialog.</li></ol><p>Select a step's checkbox to mark it done, and the progress bar and the done count follow. A step that isn't done by its due date shows as <strong>Overdue</strong>. Hover over a step and choose the trash icon to delete it: it goes straight away, without asking. The checklist saves as you change it.</p>$html$,
      '[]',
      null,
      70
    ),
    (
      'event-details',
      'Event editor',
      'Event details',
      $html$<p>In the event editor, open <strong>Event details</strong> under <strong>General</strong> to change the event's basics, then choose <strong>Save Changes</strong> at the top of the editor. Leaving the event editor before you save discards these edits.</p><ul><li><strong>Event name</strong>: shown in All Events and on the event page.</li><li><strong>Organizer</strong>: shown as Hosted by on the event page. New events use your name, or the project's name when your account has none.</li><li><strong>Add Photo</strong> (<strong>Change Photo</strong> once there is one), beside the organizer: uploads the organizer's photo, which saves straight away. The trash icon removes it. Without a photo, the event page uses your Event Wall logo, then the organizer's initials. Only the person who created the event can upload images to it.</li><li><strong>Short summary</strong>: one or two lines about the event, which the event page can show (see <a href="/help/events/event-page">Event page</a>).</li><li><strong>Format</strong>: In-person, Online or Hybrid.</li><li><strong>Date</strong> and <strong>Start time</strong>: the same date and start time as in <strong>Location & Time</strong>. The time field follows your device's 12- or 24-hour clock.</li></ul><p>You can also change the format in <strong>Hybrid Mode</strong>, under <strong>Settings</strong> in the section list. Choosing <strong>In-person</strong>, <strong>Online</strong> or <strong>Hybrid</strong> there saves straight away, without <strong>Save Changes</strong>.</p>$html$,
      '[]',
      null,
      80
    ),
    (
      'location-and-time',
      'Event editor',
      'Location and time',
      $html$<p>In the event editor, open <strong>Location & Time</strong> under <strong>Location</strong> to set where and when the event happens, then choose <strong>Save</strong> at the bottom of the section. Until you do, your changes there aren't saved.</p><p>If your project has saved venues, start with <strong>Saved venue</strong>. Choosing one fills in the venue name, address, city, time zone, map pin, arrival notes and nearby places, and saves straight away. Change any field afterwards to override it for this event only. <strong>Detach</strong> unlinks the venue and keeps what it filled in, and typing a different <strong>Venue name</strong> unlinks it too.</p><p>To place the event on the map, pick a tab at the top of the section:</p><ul><li><strong>Search</strong>: type in the search box and choose a result.</li><li><strong>Drop a pin</strong>: click the map, and Events fills in the address from the pin.</li><li><strong>Coordinates</strong>: type the <strong>Latitude</strong> and <strong>Longitude</strong>.</li></ul><p>In any tab, you can drag the pin to fine-tune it. Under <strong>Venue details</strong>:</p><ul><li><strong>Venue name</strong> and <strong>Room / floor</strong>.</li><li><strong>Timezone</strong>: London, New York, Los Angeles, Berlin or Singapore. New events use London.</li><li><strong>Date</strong> and <strong>Starts</strong>: the same date and start time as in <strong>Event details</strong>.</li><li><strong>Doors open</strong>: starts out at the event's start time.</li><li><strong>Ends</strong>: an optional end date and time, for an event that runs past its first day.</li></ul><p>Directions, transport and parking notes, and the nearby places attendees see, are set in <strong>Map & Directions</strong> (see <a href="/help/events/event-page">Event page</a>). To keep venues for reuse, see <a href="/help/events/venues">Venues & sourcing</a>.</p>$html$,
      '[]',
      null,
      90
    ),
    (
      'visibility-and-publishing',
      'Event editor',
      'Visibility and publishing',
      $html$<p>An event's page is live from the moment the event exists: Events has no separate publish step. The event's status doesn't change who can open the page or buy tickets, so a Draft event's page opens, and sells any tickets it has, for anyone its visibility allows.</p><ul><li><strong>Public</strong> and <strong>Unlisted</strong> work the same way: anyone with the event page link can open it.</li><li><strong>Private</strong>: only signed-in people who can open the project in Events can open the page. Everyone else sees <strong>Event not found</strong>, and the event doesn't show on your Event Wall for them.</li></ul><p>New events are Public. To change visibility, in the event editor open <strong>Visibility</strong> under <strong>Settings</strong> and choose a card, or use <strong>Visibility</strong> on the event's <strong>Overview</strong>. Either saves straight away.</p><p>Showing the event on your Event Wall is a separate choice. In <strong>Visibility</strong>, turn on <strong>List on Event Wall</strong> to add the event to your public Event Wall page, or turn it off to remove it. It saves as you switch it (see <a href="/help/events/event-wall">Event Wall & Discovery</a>).</p><p>To take an event's page down, set the event to Private, or delete it in All Events. Setting its status doesn't take the page down (see <a href="#event-statuses">Event statuses and formats</a>).</p>$html$,
      '[]',
      null,
      100
    ),
    (
      'co-hosts-and-admins',
      'Event editor',
      'Co-hosts and admins',
      $html$<p>In the event editor, open <strong>Co-hosts & Admins</strong> under <strong>Team</strong> to list the people who help run the event, with their role on it. The first person to open the section becomes the event's <strong>Owner</strong>.</p><ul><li><strong>Add from team</strong>: pick people already on the project's team (see <a href="/help/events/settings#team-and-members">Team and members</a>), choose one <strong>Role</strong> for all of them, then choose <strong>Add</strong>. Teammates with an account get a notification under the bell in the top bar.</li><li><strong>Add member</strong>: add anyone by <strong>Name</strong> or <strong>Email address</strong> (one of the two is required), with an optional <strong>Photo</strong> that only the event's creator can upload. Events doesn't email them, and there's nothing for them to accept. Each email can be on an event's list once.</li></ul><p>The roles are Admin, Co-host, Check-in staff and Viewer, and new people are Co-hosts. Each row's <strong>⋯</strong> menu has <strong>Edit details</strong>, a <strong>Make</strong> option for each other role (such as <strong>Make Admin</strong>) and <strong>Remove from event</strong>, which asks you to confirm first. The Owner's role can't be changed, and the Owner can't be removed. Teammates get a notification when their role changes or they're removed. Filter the list by role, or search it by name or email.</p><p>The list and its roles are a record of who runs the event. Adding someone here doesn't let them open the project in Events, and their event role doesn't change what they can do: that comes from their project role (see <a href="/help/events/settings#roles-and-permissions">Roles and permissions</a>). Everyone on the list does get a pass to print under <strong>Check-in → Badge Printing</strong> (see <a href="/help/events/check-in">Check-in</a>).</p>$html$,
      '[]',
      null,
      110
    ),
    (
      'templates',
      'Templates',
      'Event templates',
      $html$<p>A template saves a starting point for new events: a format, a capacity and a visibility. To create one, choose <strong>Events → Templates</strong> in the sidebar, then <strong>New template</strong>. Only <strong>Template name</strong> is required.</p><ul><li><strong>Category</strong>: Community (the default), Music, Education, Online, Conference or Social. Choose <strong>Add category</strong> to type your own, and press <code>Enter</code> to keep it.</li><li><strong>Icon</strong> and <strong>Description</strong>: how the template's card looks and what it's for.</li><li><strong>Blueprint defaults</strong>: the <strong>Format</strong> (In-person unless you change it), <strong>Capacity</strong> and <strong>Visibility</strong> (Public unless you change it) that events made from it start with.</li></ul><p>Choose <strong>Create template</strong> to save it. To make an event from a template, choose <strong>Use</strong> on its card. Events creates a Draft event named after the template, with its format, capacity and visibility, a placeholder date and venue and an 18:00 start, and opens it in the event editor. Each card counts the events made from it.</p><p>A template holds only those defaults: it doesn't carry tickets, a page design or any other event editor section, and an existing event can't be saved as a template. To copy an existing event's details, use <strong>Duplicate</strong> in All Events (see <a href="#duplicating-and-deleting">Duplicating and deleting events</a>).</p><p>Each card's <strong>⋯</strong> menu has <strong>Edit</strong>, <strong>Duplicate</strong> and <strong>Delete</strong>. Delete asks you to confirm first and can't be undone, and events already made from the template keep their settings. Filter the cards by category, or search them by name. Templates belong to the project, so your whole team sees the same ones.</p>$html$,
      '[]',
      null,
      120
    ),
    (
      'event-series',
      'Event Series',
      'Creating an event series',
      $html$<p>An event series groups related events, such as a monthly meetup, so you can see and manage them together. To create one, choose <strong>Events → Event Series</strong> in the sidebar, then <strong>New series</strong>. Only <strong>Series name</strong> is required. Pick a <strong>Cadence</strong> (Weekly, Monthly, Quarterly or Custom; new series are Monthly), add an optional <strong>Description</strong>, then choose <strong>Create series</strong>. New series start as Draft.</p><p>The list shows each series' name, how many events it has and its description, its cadence, its <strong>Next event</strong> (the earliest of its events dated today or later) and its status. Filter by status (<strong>All Statuses</strong>, Draft, Scheduled, On Sale or Ended) or search by name. Click a series, or choose <strong>Manage</strong> in its <strong>⋯</strong> menu, to open it.</p><p><strong>Delete</strong> in the same menu asks you to confirm first and can't be undone. The series' events aren't deleted: they stay in All Events as standalone events.</p><p>An event belongs to one series at most. Events join a series from the series itself (see <a href="#events-in-a-series">Events in a series</a>), and a duplicated event joins the same series as the original.</p>$html$,
      '[]',
      null,
      130
    ),
    (
      'events-in-a-series',
      'Event Series',
      'Events in a series',
      $html$<p>Open a series from <strong>Events → Event Series</strong> to manage it. Its own section list has <strong>Overview</strong>, <strong>Events</strong>, <strong>Shared Defaults</strong>, <strong>Cadence</strong> and <strong>Publishing</strong>. Choose <strong>Event Series</strong> over the series' name to go back to the list.</p><ul><li><strong>Overview</strong> adds up the series' events: <strong>Events</strong>, <strong>Capacity</strong>, <strong>Tickets sold</strong>, <strong>Revenue</strong> and the <strong>Next event</strong>. Change the <strong>Series name</strong> and <strong>Description</strong> there. Each saves when you click away from the field.</li><li><strong>Events</strong> lists the series' events. <strong>Add existing</strong> shows the events that aren't in any series: choose <strong>Add</strong> beside each one you want, then <strong>Done</strong>. <strong>New event</strong> creates a Draft named after the series, with the series' shared defaults, a placeholder date and an 18:00 start, and keeps you on the series.</li><li>Click an event, or the arrow-out-of-a-box icon beside it, to open it in the event editor. The × beside it removes it from the series straight away, without asking, and the event stays in All Events. The up and down arrows reorder the list.</li><li><strong>Publishing</strong> sets the series' <strong>Status</strong>, which shows in the series list and its filter. It saves as you pick it.</li></ul>$html$,
      '[]',
      null,
      140
    ),
    (
      'series-defaults-and-cadence',
      'Event Series',
      'Series defaults and cadence',
      $html$<p><strong>Shared Defaults</strong> in a series sets the <strong>Format</strong>, <strong>Visibility</strong>, <strong>Organizer</strong>, <strong>Default capacity</strong> and <strong>Time zone</strong> for its events. Type the time zone as a name, like <code>Europe/London</code>.</p><ul><li><strong>Save defaults</strong> keeps them for the events you create later with <strong>New event</strong> in the series. Existing events don't change.</li><li><strong>Apply to all</strong> (the button shows how many events the series has) also writes the format, visibility and time zone onto every event already in the series, plus the organizer and capacity when you've set them. It happens straight away, without asking, and replaces what each event had.</li></ul><p><strong>Cadence</strong> previews when the series' events would fall. Choose how it <strong>Repeats</strong> (Weekly, Monthly, Quarterly or Custom), an <strong>Anchor date</strong> for the first one and the number of <strong>Occurrences</strong>. Once there's an anchor date, <strong>Upcoming dates</strong> lists up to 12 dates from it. Custom previews monthly dates. Choose <strong>Save cadence</strong> to keep your choices.</p><p>The cadence doesn't create events. Add each one with <strong>New event</strong> in the series' <strong>Events</strong>, then set its date in the event editor.</p>$html$,
      '[]',
      null,
      150
    ),
    (
      'event-not-found',
      'Troubleshooting',
      'The event page says Event not found',
      $html$<p>When someone opens an event's link and sees <strong>Event not found</strong>, either the event is Private and they aren't signed in as someone who can open the project in Events, or the event was deleted.</p><ol><li>Choose <strong>Events → All Events</strong> in the sidebar and find the event. If it's gone, it was deleted: Events can't restore it, so its link stays broken.</li><li>Open the event. On its <strong>Overview</strong>, set <strong>Visibility</strong> to Public or Unlisted.</li><li>Ask them to open the link again.</li></ol>$html$,
      '[]',
      null,
      160
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"Palette","label":"Event page","href":"/help/events/event-page"},{"icon":"Ticket","label":"Tickets","href":"/help/events/tickets"},{"icon":"ClipboardList","label":"Registrations","href":"/help/events/registrations"},{"icon":"MapPin","label":"Venues & sourcing","href":"/help/events/venues"},{"icon":"LayoutGrid","label":"Event Wall & Discovery","href":"/help/events/event-wall"},{"icon":"Settings","label":"Settings","href":"/help/events/settings"}]',
      null,
      170
    )
) as v(anchor_id, eyebrow, title, content, links, showcase, sort_order)
cross join (select id from public.docs_pages where slug = 'events/events' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Events',
    description = 'Create and manage events: the All Events list, the event editor, templates and event series.',
    status = 'draft',
    published_at = null
where slug = 'events/events' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'events/events' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Creating an event</li><li>Event statuses</li><li>The All Events list</li><li>The event editor</li><li>Event details, location and time</li><li>Visibility and publishing</li><li>Co-hosts and admins</li><li>Templates</li><li>Event series and recurring events</li></ul>',
  10
from public.docs_pages p
where p.slug = 'events/events' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
