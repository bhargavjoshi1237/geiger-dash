-- Help events check-in page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the events/check-in draft outline from
-- 20261024191100_help_events_structure with the full Check-in guide and publishes it. Offline Check-in (under
-- development), Lead Retrieval (nothing records leads), and the settings that nothing reads (QR size, encoding and
-- rotating codes; Check-in App methods, re-entry and offline caching; the Door Sales, Kiosk Mode and Self Check-in
-- options; the event editor's Check-in options and Door Sales & Kiosk switches; role scope and override; the
-- per-gate switch) are left out, and so is RFID / NFC: Dash gates /events/api/nfc behind suite sign-in, so readers
-- can't post taps in production.
-- Written from a survey of C:\Pro\geiger-events (components/internal/sidebar/sidebar_nav.jsx,
-- components/internal/screens/registry.jsx, components/internal/screens/checkin/* and badge/*,
-- components/internal/screens/events/{checkin_section,event_badge,event_card_viewer,event_sections}.jsx,
-- app/checkin/[eventId], app/door/[eventId], app/kiosk/[eventId], components/checkin_routes/*, app/api/nfc/tap,
-- app/api/tickets/[orderId]/qr, app/api/portal/ticket/[id]/qr, lib/passes/*, lib/supabase/{checkin,nfc,orders,
-- registrations,storage}.js, lib/stripe/fulfill-checkout.js, components/internal/shared/pagination.jsx,
-- supabase/migrations/{20260715100707_checkin_routes,20260715100708_checkin,20260908000000_nfc_paid_entry}.sql,
-- geiger-ui.config.js) and of this repo's utils/supabase/middleware.js (which gates /events/* behind sign-in).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set description = 'Check attendees in with a staff scanner, sell tickets at the door, run a kiosk, print passes and follow arrivals live.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'events/check-in' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'events/check-in' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, showcase, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.showcase, v.sort_order
from (
  values
    (
      'setting-up-check-in',
      'Basics',
      'Setting up check-in',
      $html$<p>Check-in runs on a phone, tablet or laptop at the venue: staff open the event's scanner and enter an access code. To set one up:</p><ol><li>In the sidebar, choose <strong>Check-in → Staff Scanning Roles</strong>, then <strong>New role</strong>.</li><li>Type a <strong>Role name</strong>, keep the type <strong>Staff</strong>, and choose <strong>Create</strong>. The role's page opens with <strong>Scan & admit</strong> on.</li><li>Note the six-digit code under <strong>Access code</strong>, or choose <strong>Copy code</strong>.</li><li>Open the event in the event editor and copy its ID: the code after <code>event=</code> in the browser's address bar.</li><li>On the staff device, sign in to Geiger, then open <code>/events/checkin/</code> followed by the event's ID.</li><li>Type the access code and choose <strong>Unlock</strong>.</li></ol><p>To skip the last step, add <code>?code=</code> and the access code to the end of the link. The device has to be signed in to a Geiger account that belongs to an organization, so sign in before you open the link.</p><p>By default, <strong>Check-in</strong> appears in the sidebar for the Owner, Admin, Manager and Member roles. To change who sees it, see <a href="/help/events/settings#roles-and-permissions">Roles and permissions</a>.</p>$html$,
      '[]',
      null,
      10
    ),
    (
      'how-check-in-fits-together',
      'Concepts',
      'How check-in fits together',
      $html$<p>Check-in is spread over three places.</p><ul><li><strong>Check-in</strong> in the sidebar holds the project-wide screens: scanning roles and their access codes, pass designs, the look of ticket QR codes, and the attendance screens. They cover every event in the project.</li><li>The event editor's Check-in group holds one event's <strong>Multi-gate & Zones</strong>, <strong>Sessions</strong> and <strong>Badge Printing</strong> sections.</li><li>The staff screens open on a device at the venue, for one event at a time: the scanner, door sales and the kiosk. Each opens with an access code from <strong>Staff Scanning Roles</strong>.</li></ul><p>Gates, zones and sessions are turned on for the project first. Turn on <strong>Multi-gate & zones</strong> or <strong>Session check-in</strong> on its screen under <strong>Check-in</strong> and choose <strong>Save Changes</strong>; until then, the matching event editor section only shows a prompt with a button to that screen.</p><p>The scanner, the kiosk, door sales, NFC readers and <strong>Name-search Lookup</strong> all record check-ins in the same place, so an attendee admitted one way shows as checked in everywhere. A registration is checked in once per event, and a check-in can't be undone from Events. Checking someone in doesn't change their registration's status in <a href="/help/events/registrations">Registrations</a>, and setting a registration to Checked-in there doesn't record a check-in.</p><p>Some Check-in screens depend on others. In <a href="/help/events/settings#navigation">Sidebar navigation</a>, you can't hide <strong>Tickets</strong> while <strong>Check-in</strong> shows, <strong>QR Tickets</strong> while <strong>Check-in App</strong> shows, or Check-in App while any screen that relies on it shows, which is most of the Check-in area. Hide those first. <strong>Session Check-in</strong> also relies on <strong>Agenda Builder</strong>.</p>$html$,
      '[]',
      null,
      20
    ),
    (
      'staff-roles-and-access-codes',
      'Staff Scanning Roles',
      'Staff roles and access codes',
      $html$<p>A scanning role is an access code and what it lets staff do. To create one, choose <strong>Check-in → Staff Scanning Roles</strong> in the sidebar, then <strong>New role</strong>. Type a <strong>Role name</strong> (required), pick a <strong>Type</strong> and choose <strong>Create</strong>.</p><ul><li><strong>Staff</strong> codes open the check-in scanner and door sales.</li><li><strong>Kiosk</strong> codes open the self-service kiosk.</li></ul><p>The two are kept apart: a staff code doesn't open a kiosk, and a kiosk code doesn't open the scanner. A code works for every event in the project.</p><p>The role's page opens once it's created. Under <strong>Abilities</strong>:</p><ul><li><strong>Scan & admit</strong>: on by default. A staff role needs it to open the scanner, and a kiosk role to open the kiosk.</li><li><strong>Sell at the door</strong>: off by default. A staff role needs it to open door sales.</li></ul><p>Each role starts with a random six-digit code under <strong>Access code</strong>. <strong>Regenerate</strong> makes a new one and <strong>Copy code</strong> copies it. Changes to the name, abilities and code take effect when you choose <strong>Save</strong>, and once a new code is saved the old one stops working.</p><p>The list shows each role's type and access code to everyone who can open the screen. Filter it by type, or search by name. Each row's <strong>⋯</strong> menu has <strong>Edit</strong> and <strong>Delete</strong>. Events asks you to confirm a delete: staff using that code lose access, and the role can't be restored.</p>$html$,
      '[]',
      null,
      30
    ),
    (
      'scanning-and-admitting',
      'Check-in App',
      'Scanning and admitting attendees',
      $html$<p>The check-in scanner is a page for one event, at <code>/events/checkin/</code> followed by the event's ID. Open it on a device signed in to Geiger and enter a staff code that has <strong>Scan & admit</strong>. It stays open in that browser tab until someone chooses <strong>Exit</strong> or closes the tab.</p><p>To admit someone, type a name, email or ticket code in <strong>Search name, email, or ticket #</strong> and choose <strong>Search</strong>. Names and emails match on any part; a ticket code (the eight characters shown beside each match) has to match in full. Up to 25 of the event's registrations show, sorted by name, each with <strong>Admit</strong>, or <strong>In</strong> once they're checked in.</p><p>The camera reads a QR code and looks up what it holds the same way, admitting the attendee at once when that finds their ticket code or exactly one registration. The QR codes Events puts on tickets in the members portal and on printed passes aren't codes the scanner can match, so scanning one shows <strong>No match for that code</strong>: search for the attendee by name or email instead. A banner then shows the result:</p><ul><li><strong>Admitted</strong> and the name: they're checked in.</li><li><strong>is already checked in</strong>: they were admitted before, and nothing new is recorded.</li><li><strong>No match for that code</strong>: nothing matched. Search for them by name instead.</li><li><strong>Couldn't record the check-in</strong>: the check-in didn't save, so try again.</li></ul><p>If the camera can't start or permission is denied, use the search box. The header shows the event, the role you're scanning as, and how many are in against the event's Confirmed and Checked-in registrations, refreshed every 15 seconds. When the event has gates, zones or sessions, pickers at the top set where the device is, and each check-in records them.</p>$html$,
      '[]',
      null,
      40
    ),
    (
      'name-search-lookup',
      'Name-search Lookup',
      'Looking up an attendee',
      $html$<p><strong>Name-search Lookup</strong> checks an attendee in from Events itself, for when someone arrives without their ticket. Choose <strong>Check-in → Name-search Lookup</strong> in the sidebar and pick the event.</p><p>Search by name, email or ticket code. Narrow the list by registration status (All statuses, Confirmed, Pending, Waitlisted, Declined or Cancelled) and by check-in (All attendees, Checked in or Not checked in), and sort by name from A to Z (the default) or Z to A, by <strong>Recently registered</strong> or by <strong>Largest party</strong>. Each row shows the ticket code, the email and the party size, and marks waitlisted registrations.</p><p><strong>Check in</strong> records the check-in straight away, without asking, whatever the registration's status. It can't be undone from Events. The list shows 25 attendees a page; switch to 10, 50 or 100 at the bottom.</p>$html$,
      '[]',
      null,
      50
    ),
    (
      'selling-at-the-door',
      'Door Sales',
      'Selling tickets at the door',
      $html$<p>Door sales sell a ticket to a walk-in and check them in at once. Turn on <strong>Sell at the door</strong> for a staff role, then open <code>/events/door/</code> followed by the event's ID on a device signed in to Geiger, and enter that role's code.</p><ol><li>Pick a ticket. The choices are the <a href="/help/events/tickets#adding-tickets-to-an-event">tickets added to the event</a>, with their prices; an event without tickets sells a free General Admission.</li><li>Set the quantity, from 1 to 10.</li><li>Pick how they paid: <strong>Cash</strong>, <strong>Card</strong> or <strong>Comp</strong>.</li><li>Optional: type the buyer's <strong>Name</strong> and <strong>Email</strong>.</li><li>Choose <strong>Sell & check in</strong>. For a comp, confirm with <strong>Issue free admission</strong>.</li></ol><p>Door sales don't take payment. The sale is recorded as an order for the ticket's price times the quantity (nothing for a comp), with the method you picked, and you collect the money yourself. A sold-out ticket can't be sold at the door either.</p><p>Events doesn't email the buyer. With an email, the order shows in their members portal once they're <a href="/help/events/members-portal#signing-in">signed in</a>. Each sale counts as one check-in, whatever the quantity. <strong>New sale</strong> starts the next one.</p>$html$,
      '[]',
      null,
      60
    ),
    (
      'running-a-kiosk',
      'Kiosk Mode',
      'Running a self-service kiosk',
      $html$<p>A kiosk is a screen attendees use on their own at the entrance. Create a role with the type <strong>Kiosk</strong>, open <code>/events/kiosk/</code> followed by the event's ID on a device signed in to Geiger, and enter the kiosk code under <strong>Kiosk setup</strong>. The kiosk then shows the event's name and <strong>Tap anywhere to begin</strong>, and offers three options:</p><ul><li><strong>Check in</strong>: attendees type their name or ticket code and choose <strong>Find</strong>, or hold a QR code to the camera, which is looked up the same way. A ticket code or a single match checks them in. With several matches, they choose <strong>Check in</strong> beside their own name.</li><li><strong>Register</strong>: they type a <strong>Full name</strong> (required) and an optional <strong>Email</strong>, then choose <strong>Register & check in</strong>. This adds a registration from the kiosk and checks it in, without approval. When the event is full, the registration is Waitlisted and still checked in.</li><li><strong>Buy a ticket</strong>: they pick one of the event's tickets, type a name (required) and email, and choose the button with the price (<strong>Get ticket</strong> for a free one). This records an order at the ticket's price and checks them in, but the kiosk doesn't take payment.</li></ul><p>After each one, a welcome screen returns to the start after 4 seconds, or when they choose <strong>Done</strong>. The exit icon on the options screen locks the kiosk again, and it takes the kiosk code to restart it.</p>$html$,
      '[]',
      null,
      70
    ),
    (
      'gates-and-zones',
      'Multi-gate & Zones',
      'Gates and zones',
      $html$<p>Gates are the entrances staff scan at, and zones are areas inside, such as Backstage. Each check-in records the gate and zone its device was set to, and <strong>Real-time Attendance</strong> counts arrivals per gate.</p><ol><li>In the sidebar, choose <strong>Check-in → Multi-gate & Zones</strong>, turn on <strong>Multi-gate & zones</strong> and choose <strong>Save Changes</strong>.</li><li>Optional: on the same screen, add gates and zones your events reuse under <strong>Gates</strong> and <strong>Zones</strong>, and choose <strong>Save Changes</strong> again.</li><li>In the event editor, open <strong>Multi-gate & Zones</strong>. Type a gate or zone and choose <strong>Add</strong> (or press <code>Enter</code>), or click one under <strong>From the project catalog</strong>. The × beside one removes it.</li><li>Choose <strong>Save</strong>.</li></ol><p>Only the event's own gates and zones reach the scanner. There, pickers at the top set the device's gate (<strong>Any gate</strong> to start with) and zone (<strong>Any zone</strong>). Events records them but doesn't turn anyone away, so any ticket can be admitted at any gate.</p>$html$,
      '[]',
      null,
      80
    ),
    (
      'session-check-in',
      'Session Check-in',
      'Session check-in',
      $html$<p>Session check-in records which part of an event, such as a keynote or a workshop, an attendee was admitted to.</p><ol><li>In the sidebar, choose <strong>Check-in → Session Check-in</strong>, turn on <strong>Session check-in</strong> and choose <strong>Save Changes</strong>.</li><li>In the event editor, open <strong>Sessions</strong>. Type a session's name and choose <strong>Add</strong> (or press <code>Enter</code>).</li><li>Optional: set the session's date and time. The × beside a session removes it.</li><li>Choose <strong>Save</strong>.</li></ol><p>On the scanner, the session picker starts on <strong>Whole event</strong>. Pick a session, and each check-in from that device records it; <strong>Real-time Attendance</strong> counts each session separately.</p><p>An attendee is checked in once per event, so a session counts only the people whose first check-in was for that session. Someone admitted at the door earlier shows as already checked in. These sessions are kept separately from the event's agenda in <a href="/help/events/program">Program</a>.</p>$html$,
      '[]',
      null,
      90
    ),
    (
      'real-time-attendance',
      'Real-time Attendance',
      'Real-time attendance',
      $html$<p><strong>Real-time Attendance</strong> shows how many people have checked in to each of the project's events, and refreshes every 15 seconds. Choose <strong>Refresh</strong> to update it straight away.</p><p>Each row shows the event and its date, its status, <strong>Checked in</strong> against the number expected, an arrival bar, and a count for each gate and session. An event is Live once anyone has checked in, and shows No arrivals until then. The expected number is the event's Confirmed and Checked-in registrations, or its tickets sold when it has none.</p><p>Checked in counts each registration once, and each door or kiosk sale once, whatever its quantity. Events doesn't record people leaving, so the count only goes up.</p><p>The figures across the top, <strong>Checked in now</strong>, <strong>Live events</strong> and <strong>Overall arrival</strong> (checked in against expected), add up the events in the list, so the search and filter change them. Filter by <strong>All events</strong>, <strong>Live</strong> or <strong>No arrivals yet</strong>, or search by event name. Events with the most check-ins come first, 25 to a page.</p>$html$,
      '[]',
      null,
      100
    ),
    (
      'ticket-qr-codes',
      'QR Tickets',
      'Ticket QR codes',
      $html$<p><strong>QR Tickets</strong> sets how the QR code looks on each ticket in the members portal. Choose <strong>Check-in → QR Tickets</strong> in the sidebar, change the settings and choose <strong>Save Changes</strong>. They cover every event in the project, and the <strong>Preview</strong> card shows a sample code as you change them.</p><ul><li><strong>Error correction</strong>: Low (7%), Medium (15%), Quartile (25%) or High (30%). Medium is the default. A higher level keeps the code readable when it's scuffed or partly covered. Printed passes use the same level.</li><li><strong>Show logo in center</strong>: puts the Geiger logo in the middle of the code. It's on by default, but the logo only shows at Quartile or High, so at Medium the code has none.</li><li><strong>Brand color</strong>: a hex color for the code, like <code>#111111</code>. Leave it blank for black.</li></ul>$html$,
      '[]',
      null,
      110
    ),
    (
      'pass-designs',
      'Badge Printing',
      'Pass designs',
      $html$<p><strong>Badge Printing</strong> is where you design the passes attendees wear, and print them. Choose <strong>Check-in → Badge Printing</strong> in the sidebar and pick an upcoming event at the top. Designs belong to the project, so every event shares them, and a project starts with one Classic design.</p><p>The design menu beside the event lists each design with how many of this event's passes it prints. From it:</p><ul><li><strong>New design</strong> starts from a preset: Classic, Compact, QR-forward, VIP, Speaker, Crew & staff, Guest, or Press & partners.</li><li><strong>Duplicate</strong> copies the open design.</li><li><strong>Make default</strong> uses it for every pass no other design matches.</li><li><strong>Delete</strong> asks you to confirm, and its passes move to another design. The last design can't be deleted.</li></ul><p>Each pass prints on one design: one bound to the pass's role wins, then one bound to its ticket tier, then the default. Set both on the <strong>Binding</strong> tab of the right-hand panel, which also holds the design's <strong>Name</strong>:</p><ul><li><strong>Pass roles</strong>: Attendee, Guest, Speaker, Sponsor, Exhibitor, Staff, Crew, VIP, Press, Volunteer, Organiser or Vendor.</li><li><strong>Ticket tiers</strong>: matched by the tier's name, so one design follows a tier across events. Click a tier the event uses, or type a name and choose <strong>Add</strong>.</li></ul><p>Nothing on this screen is kept until you choose <strong>Save</strong>, which saves every design at once.</p>$html$,
      '[]',
      null,
      120
    ),
    (
      'editing-a-pass-design',
      'Badge Printing',
      'Editing a pass design',
      $html$<p>The middle of <strong>Badge Printing</strong> is a canvas showing the open design on a real pass from the event. The arrows under it step through the event's passes; with nobody registered, it shows a sample attendee.</p><ul><li><strong>Front of the card</strong> and <strong>Back of the card</strong> switch sides. The back is blank, and isn't printed, until you put something on it.</li><li>The tools are <strong>Select & move</strong>, <strong>Draw a section</strong>, <strong>Add text</strong> and <strong>Add an image slot</strong>. Drag things to place them. Snapping lines them up every 1, 2, 5 or 10 mm, and the lock stops the canvas moving while you work.</li><li><strong>Add to card</strong>, in the left-hand panel, adds a field filled in for each pass: event name, date, time, venue or city; the attendee's name, company or role, job title or email; ticket tier, assigned seat, pass number, ticket code or source; role and role detail; or custom text. It also adds a QR code, an image or a section.</li><li>The left-hand panel lists everything on the card, to reorder, hide or delete.</li><li>The right-hand panel's <strong>Design</strong> tab edits the selected item: text style, the QR code's color and center mark, position and size in millimeters, rotation and opacity. With nothing selected, it edits the card: background color and image, the font for all text, the border and corner radius, and <strong>Finish & effects</strong> such as gloss, foil or glow on both sides.</li></ul><p><strong>Worn preview</strong>, at the top left, shows the pass hanging from a lanyard; drag it to swing it. Uploaded images are compressed to under 500 KB. Choose <strong>Save</strong> to keep your changes.</p>$html$,
      '[]',
      null,
      130
    ),
    (
      'printing-and-exporting-passes',
      'Badge Printing',
      'Printing and exporting passes',
      $html$<p><strong>Badge Printing</strong> makes a pass for everyone attending the event you pick:</p><ul><li>One for each ticket on an order, except canceled and refunded orders.</li><li>One for each registration with no order under the same email, except waitlisted, canceled and declined ones, plus a Guest pass for each plus-one.</li><li>One for each member of the event's team, each <a href="/help/events/speakers">speaker</a>, each sponsor contact and each exhibitor, with their own role.</li></ul><p>Choose <strong>Print / PDF</strong> to open every pass in a new tab with your browser's print dialog, where you can also save a PDF. If nothing opens, allow pop-ups for the site. Passes are grouped by design, on the page each design's <strong>Output</strong> tab sets:</p><ul><li><strong>Stock</strong>: Name badge (88.9 × 57.15 mm), Lanyard (portrait) (85.73 × 136.53 mm), Card (CR80) (85.6 × 54 mm), A7, A6, or Custom (20 to 500 mm each way).</li><li><strong>Sheet layout</strong>: A4 or US Letter, a <strong>Margin</strong> (10 mm to start) and <strong>Gutter</strong> (4 mm), <strong>Crop marks</strong>, and <strong>Print the back</strong>, which adds a back sheet after each front sheet, mirrored for double-sided printing on the long edge.</li></ul><p>The <strong>Export</strong> menu downloads a PNG of the pass on the canvas (one side, or both once the back has content), a ZIP with a PNG of every pass, or the pass data as a CSV. PNGs are 300 DPI.</p>$html$,
      '[]',
      null,
      140
    ),
    (
      'badges-for-one-event',
      'Event editor',
      'Badges for one event',
      $html$<p>In the event editor, open <strong>Badge Printing</strong> and turn on <strong>Print badges for this event</strong> to show the event's pass in the event editor. Under <strong>Pass design</strong>, pick which of the project's designs it shows (<strong>Project default</strong> to start with). Both save as you change them. The pass then hangs in the section, where you can drag it or flick it sideways to see the back.</p><p>The design picked here only changes what the event editor shows. Printed passes follow the bindings in Badge Printing: role, then ticket tier, then the default design. Once badges are on, <strong>Edit badge</strong> opens Badge Printing on this event.</p>$html$,
      '[]',
      null,
      150
    ),
    (
      'access-code-not-accepted',
      'Troubleshooting',
      'An access code isn''t accepted',
      $html$<p>When the scanner, door sales or the kiosk won't accept an access code, the message under the code says why.</p><ul><li><strong>That code isn't valid for this event.</strong> The code doesn't belong to a role in the event's project. Check the digits, check that the role wasn't deleted or given a new code, and use a <strong>Staff</strong> code for the scanner and door sales and a <strong>Kiosk</strong> code for the kiosk.</li><li><strong>This code doesn't have permission for this action.</strong> The role needs <strong>Scan & admit</strong> for the scanner or kiosk, or <strong>Sell at the door</strong> for door sales. Turn it on in <strong>Staff Scanning Roles</strong>, choose <strong>Save</strong>, and enter the code again.</li></ul><p>If the link opens the Geiger sign-in page instead, sign in on the device first, then open the link again.</p>$html$,
      '[]',
      null,
      190
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"Ticket","label":"Tickets","href":"/help/events/tickets"},{"icon":"ClipboardList","label":"Registrations","href":"/help/events/registrations"},{"icon":"ShoppingBag","label":"Orders","href":"/help/events/orders"},{"icon":"CircleUser","label":"Members portal","href":"/help/events/members-portal"},{"icon":"CalendarDays","label":"Program","href":"/help/events/program"},{"icon":"Boxes","label":"Inventory","href":"/help/events/inventory"}]',
      null,
      200
    )
) as v(anchor_id, eyebrow, title, content, links, showcase, sort_order)
cross join (select id from public.docs_pages where slug = 'events/check-in' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Check-in',
    description = 'Scan tickets at the door, sell at the door, run kiosks, print badges and follow attendance live.',
    status = 'draft',
    published_at = null
where slug = 'events/check-in' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'events/check-in' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>QR tickets</li><li>The check-in app</li><li>Door sales</li><li>Kiosk mode</li><li>Badge printing</li><li>Session check-in</li><li>Gates and zones</li><li>Real-time attendance</li><li>Staff scanning roles</li><li>Lead retrieval</li></ul>',
  10
from public.docs_pages p
where p.slug = 'events/check-in' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
