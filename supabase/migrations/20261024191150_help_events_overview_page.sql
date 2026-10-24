-- Help events overview page
--
-- One-time content move, like 20261024142451_help_flow_overview_page: replaces the Events Overview draft outline (the
-- products/events draft that 20261024191100_help_events_structure re-homed to slug events, with the /events/playground
-- hero) with the published Geiger Events overview. Each headline area gets a section that links to its guide
-- (20261024191101 to 20261024191126); the Overview screen section comes from the Analytics survey.
-- Written from a survey of C:\Pro\geiger-events (components/internal/sidebar/sidebar_nav.jsx, components/internal/topbar/*,
-- components/EventsPlayground.jsx, lib/playground/*, components/internal/screens/overview/events_overview.jsx,
-- geiger-rbac.config.js, context/rbac-context.js, lib/hooks/use-visible-nav.js, geiger-ui.config.js, the pinned
-- @geiger/ui topbar, command-palette and sidebar) and C:\Pro\geiger-dash (lib/org/product-apps.js, lib/org/projects.js),
-- plus the area guides' surveys named in their own migration headers.
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Geiger Events',
    nav_label = 'Overview',
    description = 'Run your team''s events: build each event and its page, sell tickets, take registrations, check people in, and give attendees a members portal.',
    preview = 'events',
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'events' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'events' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, cards, features, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.cards::jsonb, v.features::jsonb, v.sort_order
from (
  values
    (
      'start-here',
      null,
      'Start here',
      '',
      '[{"icon":"FolderKanban","title":"Open a project","body":"Launch Events from any project in your organization","href":"/org"},{"icon":"CalendarPlus","title":"Create an event","body":"Set up an event and its public page","href":"/help/events/events#creating-an-event"},{"icon":"CirclePlay","title":"Try the playground","body":"Explore a sample project without signing up","href":"/events/playground"}]',
      '[]',
      10
    ),
    (
      'opening-events',
      'Basics',
      'Opening Events',
      $html$<p>Events works inside a <strong>project</strong>. Open your organization in Dash and launch Events from one of its projects. Everything you create there belongs to that project, and every member of your organization can open it. Events opens on <strong>Overview</strong>.</p><p>Each person gets an Events role from their organization role, and the role decides which areas appear in their sidebar. By default the Owner, Admin and Manager roles see every area, Member sees Overview, Events, Registrations, Guests, Check-in, Analytics, Community and Workflows, and Viewer sees Overview and Analytics. Roles change what appears in the sidebar and search, not which data a person can open. See <a href="/help/events/settings#roles-and-permissions">Roles and permissions</a>.</p><p>To jump to any screen in your sidebar, choose <strong>Search Events</strong> at the top or press <code>Ctrl K</code> (<code>⌘ K</code> on Mac). To hide areas you don't use from your own sidebar, go to <strong>Settings → Navigation</strong>; see <a href="/help/events/settings#navigation">Sidebar navigation</a>.</p>$html$,
      '[]',
      '[]',
      20
    ),
    (
      'trying-the-playground',
      'Basics',
      'Trying Events in the playground',
      $html$<p>The <a href="/events/playground">Events playground</a> opens a sample project in Events without an account, so you can click through its areas before you sign up.</p><p>Changes you make in the playground last until you reload the page. Anything that needs Events' server, such as paying for a ticket, doesn't work there.</p>$html$,
      '[]',
      '[]',
      30
    ),
    (
      'whats-in-events',
      'Areas',
      'What''s in Events',
      '<p>Each area in the sidebar covers one part of running events, and each has its own guide. The sections on this page sum them up and link to each one.</p>',
      '[]',
      '[{"icon": "CalendarDays", "text": "Events: create events and run each one from the event editor"}, {"icon": "LayoutTemplate", "text": "Event page: the public page buyers see, designed in the event editor"}, {"icon": "LayoutGrid", "text": "Event Wall & Discovery: a public list of your events and an organizer profile"}, {"icon": "Building2", "text": "Venues & sourcing: reusable venues, seat maps and exhibitor halls"}, {"icon": "ClipboardList", "text": "Registrations: sign-ups, approvals, waitlists and capacity"}, {"icon": "Users", "text": "Guests: the Contact Book, guest lists, segments and exports"}, {"icon": "Ticket", "text": "Tickets: ticket types, tiers, seating, add-ons and checkout"}, {"icon": "Percent", "text": "Discounts & ticket rules: codes, early-bird pricing, donations and waves"}, {"icon": "CreditCard", "text": "Payments & policies: how buyers pay and request refunds"}, {"icon": "ShoppingBag", "text": "Orders: every sale, with refunds, receipts and disputes"}, {"icon": "Gem", "text": "Packages: VIP packages sold from their own page"}, {"icon": "Boxes", "text": "Inventory: stock and merch, event allocations and purchase orders"}, {"icon": "BadgeCheck", "text": "Memberships: plans that open live rooms and recordings"}, {"icon": "QrCode", "text": "Check-in: the staff scanner, door sales, kiosks and passes"}, {"icon": "MessagesSquare", "text": "Community: event chats, Q&A threads, messages and announcements"}, {"icon": "CalendarClock", "text": "Program: agendas, display boards and talk submissions"}, {"icon": "Mic", "text": "Speakers: the speaker roster, what each one owes you and backstage checklists"}, {"icon": "Handshake", "text": "Sponsors & Expo: sponsor spots, sponsorship inquiries and exhibitor booths"}, {"icon": "Radio", "text": "Broadcast & On-demand: live rooms, recordings and on-demand broadcasts"}, {"icon": "ClipboardCheck", "text": "Operations workspace: private modules, records and planning for each event"}, {"icon": "CircleUser", "text": "Members portal: what attendees see when they sign in"}, {"icon": "Settings", "text": "Settings: your team and roles, your sidebar, emails and add-ons"}]',
      40
    ),
    (
      'overview-screen',
      'Overview',
      'The Overview screen',
      $html$<p>Events opens on <strong>Overview</strong>, a summary of the project you're in. Choose <strong>Overview</strong> in the sidebar to come back to it. Its figures load when the screen opens, so reopen it to see the latest sales. Every default role sees it, Viewer included.</p><ul><li><strong>Events</strong>, <strong>Upcoming</strong> and <strong>Attendees</strong>: all the project's events, those dated today or later (drafts included), and the <strong>Registrations</strong> total.</li><li><strong>Registrations</strong>: the tickets on every order plus the party size of every registration. A ticket bought on an event page creates both, so it counts twice here, in <strong>Attendees</strong>, in the <strong>Registration Funnel</strong> and in <strong>Attendance Rate</strong>.</li><li><strong>Ticket Revenue</strong>: the total of every order, with nothing taken off for refunds or cancellations.</li><li><strong>Check-ins</strong>: every check-in recorded for the project's events.</li><li><strong>New RSVPs</strong>: registrations made in the last 30 days.</li></ul><p>The percentage beside each figure compares the last 30 days with the 30 days before.</p><p><strong>Registrations Over Time</strong> plots the last 12 weeks, one point per week. Switch it between <strong>RSVPs</strong> (the default), <strong>Tickets sold</strong> and <strong>Revenue</strong>. <strong>Ticket Type Mix</strong> splits every ticket sold by type, the five biggest and then <strong>Other</strong>; choose a type to see its count and share. The <strong>Registration Funnel</strong> runs from all sign-ups to Confirmed (orders not canceled, and Confirmed or Checked-in registrations) to Checked-in. <strong>Sell-Through Rate</strong> is seats sold against your events' capacity, and <strong>Attendance Rate</strong> is check-ins against confirmed sign-ups.</p><p><strong>Top Performing Events</strong> ranks five events by <strong>Revenue</strong> (order totals less refunds issued) or <strong>Sell-through</strong>. <strong>Momentum</strong> is Selling fast from 85% sold, On track from 40%, Slow under that, and Not yet on sale for Draft and Scheduled events. The arrow on a row opens the event in the event editor. Where a widget has a calendar button, it narrows that widget to the events you select.</p><p><strong>Overall Stats</strong> lists what needs doing, most urgent first. Click a row to open the screen for it:</p><ul><li><strong>Refund requests</strong>: refunds marked Requested in <strong>Orders → Refunds & Cancellations</strong>. Requests attendees send from the members portal go to <strong>Tickets → Refunds</strong> and aren't counted.</li><li><strong>Disputes needing response</strong>: logged disputes still at Needs response, in <strong>Orders → Disputes & Chargebacks</strong>.</li><li><strong>Waitlist approvals</strong>: waitlisted registrations, in <strong>Registrations → Waitlist</strong>.</li><li><strong>Events near capacity</strong>: events at least 90% sold, in <strong>Registrations → Capacity Limits</strong>.</li><li><strong>Unpublished drafts</strong>: events still in Draft, in <strong>Events → All Events</strong>.</li></ul><p>A widget with nothing to show says so: <strong>No activity yet</strong>, <strong>No ticket sales yet</strong> or <strong>No events yet</strong>.</p>$html$,
      '[]',
      '[]',
      50
    ),
    (
      'events-and-event-pages',
      'Events',
      'Events and event pages',
      $html$<p>You create each event under <strong>Events → All Events</strong> and run it from the event editor, a page of sections for its details, location, page design, tickets, registration, check-in and more. See <a href="/help/events/events">Events</a>.</p><p>Every event has a public event page at <code>/events/e/</code> followed by the event's ID. The page works from the moment the event exists: an event's status is a label and doesn't take its page offline, so set its visibility to Private to keep it from the public. You design the page and its content in the event editor; see <a href="/help/events/event-page">Event page</a>.</p><p>The <strong>Event Wall</strong> lists the events you choose on one public page, with an organizer profile visitors can follow. See <a href="/help/events/event-wall">Event Wall & Discovery</a>.</p>$html$,
      '[]',
      '[]',
      60
    ),
    (
      'venues-and-sourcing',
      'Venues',
      'Venues and sourcing',
      $html$<p><strong>Venues</strong> keeps the project's reusable venues, with their address, map, capacity, amenities, guidelines and photos, and the seat maps and exhibitor halls that events sell seats and booths from. Picking a saved venue in an event's <strong>Location & Time</strong> section copies its details into the event.</p><p><strong>Sourcing</strong> searches for venues, places to stay and travel options, and keeps a shortlist that you track yourself. See <a href="/help/events/venues">Venues & sourcing</a>.</p>$html$,
      '[]',
      '[]',
      70
    ),
    (
      'tickets-and-orders',
      'Tickets',
      'Tickets, payments and orders',
      $html$<ul><li><strong>Tickets</strong> are added to each event in the event editor, with optional ticket types, tiers, assigned seating, add-ons and time slots. See <a href="/help/events/tickets">Tickets</a>.</li><li>Discount codes, early-bird pricing, donations, access codes, group orders, bundles and ticket waves are covered in <a href="/help/events/ticket-rules">Discounts & ticket rules</a>.</li><li>Paid tickets are charged in US dollars through a secure checkout page. <a href="/help/events/payments">Payments & policies</a> explains how buyers pay and request refunds, and what each payment setting does.</li><li>Every sale becomes an order under <strong>Orders</strong>, where you record refunds and cancellations. Recording a refund doesn't send money back to the buyer. See <a href="/help/events/orders">Orders</a>.</li><li><strong>Packages</strong> sell VIP bundles for an event from their own page, and <strong>Memberships</strong> sells plans that open the members portal's live rooms and recordings. See <a href="/help/events/packages">Packages</a> and <a href="/help/events/memberships">Memberships</a>.</li></ul>$html$,
      '[]',
      '[]',
      80
    ),
    (
      'registrations-and-guests',
      'Registrations',
      'Registrations and guests',
      $html$<p>People register from an event's page, and you can add registrants by hand. Under <strong>Registrations</strong> you approve requests, promote people from the waitlist, set capacity and plan for dietary and accessibility needs. Buying a ticket also registers the buyer. See <a href="/help/events/registrations">Registrations</a>.</p><p><strong>Guests</strong> holds the project's Contact Book, with tags, notes and consent, plus the Guest List of everyone who has registered, attendee exports, segments and data requests. See <a href="/help/events/guests">Guests</a>.</p>$html$,
      '[]',
      '[]',
      90
    ),
    (
      'on-the-day',
      'Check-in',
      'Check-in, inventory and operations',
      $html$<p>Staff check attendees in with the event's check-in scanner, on a phone, tablet or laptop that's signed in to Geiger, after entering an access code. They find people by name, email or ticket code, and you can also sell tickets at the door, run a self-service kiosk and print passes. See <a href="/help/events/check-in">Check-in</a>.</p><p><strong>Inventory</strong> keeps a catalog of stock and merch, records every stock movement, commits items to events, sells them as add-ons, and buys stock with purchase orders. See <a href="/help/events/inventory">Inventory</a>.</p><p>Each event's <strong>Operations workspace</strong>, a section of the event editor, tracks back-office work in private modules and records, and can plan the event's people, rooms, schedule, evaluations and attendance. By default the Owner, Admin and Manager roles can use it. See <a href="/help/events/operations">Operations workspace</a>.</p>$html$,
      '[]',
      '[]',
      100
    ),
    (
      'attendees-and-community',
      'Members portal',
      'The members portal and community',
      $html$<p>Attendees sign in to the members portal at <a href="/events/login">/events/login</a> to see their tickets and QR codes, orders and refund requests, memberships, recordings, event chats and messages. Placing an order creates their account, and the first time they sign in, the sign-in page emails them a link to set a password. Nothing links attendees to the portal, so share its address with them. See <a href="/help/events/members-portal">Members portal</a>.</p><p>You talk with attendees under <strong>Community</strong>: each event's group chat, Q&A threads, one-to-one messages and announcements that appear in the portal. See <a href="/help/events/community">Community</a>.</p>$html$,
      '[]',
      '[]',
      110
    ),
    (
      'program-sponsors-broadcast',
      'Program',
      'Program, speakers, sponsors and broadcasts',
      $html$<ul><li><strong>Program</strong> builds each event's agenda of sessions, tracks and rooms, shows it on venue screens with display boards, and tracks talk submissions. See <a href="/help/events/program">Program</a>.</li><li><strong>Speakers</strong> keeps your speaker roster, the materials each speaker owes you, and checklists for each backstage room. See <a href="/help/events/speakers">Speakers</a>.</li><li><strong>Sponsors & Expo</strong> records sponsorship deals, shows sponsors on the event page, collects inquiries from a public sponsorship page, and sells exhibitor booths. See <a href="/help/events/sponsors">Sponsors & Expo</a>.</li><li><strong>Broadcast & On-demand</strong> runs livestream, webinar and breakout rooms and publishes recordings, which plan members watch in the members portal. See <a href="/help/events/broadcast">Broadcast & On-demand</a>.</li></ul>$html$,
      '[]',
      '[]',
      120
    ),
    (
      'settings',
      'Settings',
      'Settings',
      $html$<p><strong>Settings</strong> holds the project's team and roles, your own sidebar, which emails the project sends, and its add-ons. By default it appears for the Owner, Admin and Manager roles. See <a href="/help/events/settings">Settings</a>.</p>$html$,
      '[]',
      '[]',
      130
    ),
    (
      'shortcuts',
      'Reference',
      'Keyboard shortcuts',
      $html$<ul><li><code>Ctrl K</code> or <code>Ctrl /</code> (<code>⌘ K</code> or <code>⌘ /</code> on Mac) opens search</li><li><code>Ctrl B</code> (<code>⌘ B</code> on Mac) collapses or expands the sidebar</li></ul><p>The <a href="/help/events/event-page#formatting-shortcuts-and-limits">Event page</a> guide lists the text formatting shortcuts for event descriptions.</p>$html$,
      '[]',
      '[]',
      140
    )
) as v(anchor_id, eyebrow, title, content, cards, features, sort_order)
cross join (select id from public.docs_pages where slug = 'events' and deleted_at is null) p;

-- @down
-- Restores the Overview draft exactly as 20261024191100_help_events_structure left it (the products/events outline).
update public.docs_pages
set title = 'Geiger Events',
    nav_label = 'Overview',
    description = 'Event operations and registration.',
    preview = 'events',
    status = 'draft',
    published_at = null
where slug = 'events' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'events' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>What Geiger Events is for</li><li>Opening it from a project</li><li>Key concepts</li><li>Common workflows</li></ul>',
  10
from public.docs_pages p
where p.slug = 'events' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
