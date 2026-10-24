-- Help events structure
--
-- One-time content move, like 20261023200049_help_flow_guide: gives Events its own sidebar group. The products/events
-- draft is re-homed as the Events Overview (with the /events/playground hero) and stays a draft until
-- 20261024191150_help_events_overview_page fills it in. Each Events area starts as a draft outline, in the order of
-- Events' own sidebar; the page migrations that follow (20261024191101 to 20261024191127) fill each one in.
-- Event Design, Smart Custom Proposals, Instant Book and the other sidebar entries that open a "Coming soon" screen get no page,
-- and neither do Workflows (nothing executes a workflow), Advertising (it stores account names; nothing connects to an ad
-- platform), Campaigns (a send only marks the campaign sent; no email goes out) or Analytics (every dashboard draws
-- hard-coded demo figures, and nothing sends a scheduled report).
-- Written from a survey of C:\Pro\geiger-events (components/internal/sidebar/sidebar_nav.jsx,
-- components/internal/screens/registry.jsx, components/internal/screens/events/event_sections.js, addons/*).
-- Later edits happen in Studio, so this must never re-run.

-- @up
insert into public.docs_nav_groups (title, slug, sort_order)
values ('Events', 'events', 27)
on conflict (slug) do update set
  title = excluded.title,
  sort_order = excluded.sort_order;

-- Events Overview: re-home the products/events draft, or create it on a database that never had one.
update public.docs_pages
set nav_group_id = (select id from public.docs_nav_groups where slug = 'events'),
    slug = 'events',
    title = 'Geiger Events',
    nav_label = 'Overview',
    preview = 'events',
    sort_order = 10
where slug = 'products/events' and deleted_at is null;

insert into public.docs_pages (nav_group_id, slug, title, nav_label, description, preview, status, sort_order)
select g.id, 'events', 'Geiger Events', 'Overview', 'Event operations and registration.', 'events', 'draft', 10
from public.docs_nav_groups g
where g.slug = 'events'
on conflict (slug) where deleted_at is null do nothing;

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>What Geiger Events is for</li><li>Opening it from a project</li><li>Key concepts</li><li>Common workflows</li></ul>',
  10
from public.docs_pages p
where p.slug = 'events' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;

-- Events' areas: drafts with a writing outline, visible to editors in preview only.
insert into public.docs_pages (nav_group_id, slug, title, description, status, sort_order)
select g.id, v.slug, v.title, v.description, 'draft', v.sort_order
from (
  values
    ('events/events', 'Events', 'Create and manage events: the All Events list, the event editor, templates and event series.', 20),
    ('events/event-page', 'Event page', 'Design the public page buyers see: layout, cover media, description, schedule, FAQ and sharing.', 30),
    ('events/event-wall', 'Event Wall & Discovery', 'Publish a public wall of your events and an organizer profile people can follow.', 40),
    ('events/venues', 'Venues & sourcing', 'Keep a book of reusable venues, source new ones, and plan housing and travel.', 50),
    ('events/registrations', 'Registrations', 'Collect RSVPs with registration forms, and manage waitlists, approvals, capacity and dietary needs.', 60),
    ('events/guests', 'Guests', 'Keep every contact in one book, with guest lists, segments, tags, notes, exports and data requests.', 70),
    ('events/tickets', 'Tickets', 'Create ticket types and tiers, add them to events, and set up seating, slots and add-ons.', 80),
    ('events/ticket-rules', 'Discounts & ticket rules', 'Set up discount codes, bundles, early-bird pricing, releases, donations, access codes and resale rules.', 90),
    ('events/payments', 'Payments & policies', 'Set up payment methods, payment plans, payouts, currencies, taxes, refunds, transfers and invoices.', 100),
    ('events/orders', 'Orders', 'Find any order, issue refunds and cancellations, and handle transactions, receipts and disputes.', 110),
    ('events/packages', 'Packages', 'Sell VIP packages for an event on their own sales page.', 120),
    ('events/inventory', 'Inventory', 'Track stock and merch, allocate items to events, and hand them out at the issuing desk.', 130),
    ('events/memberships', 'Memberships', 'Sell membership plans that unlock pricing and access, and manage who''s enrolled.', 140),
    ('events/check-in', 'Check-in', 'Scan tickets at the door, sell at the door, run kiosks, print badges and follow attendance live.', 150),
    ('events/community', 'Community', 'Run event chat, answer attendee messages, and engage attendees with polls, surveys, Q&A and announcements.', 200),
    ('events/program', 'Program', 'Build the agenda, run display boards, collect papers, assign sessions and issue certificates.', 210),
    ('events/speakers', 'Speakers', 'Manage speakers, their submission portal and the backstage run of show.', 220),
    ('events/sponsors', 'Sponsors & Expo', 'Sell sponsorship packages, manage sponsors, rooms and expo booths, and lay out the floor.', 230),
    ('events/broadcast', 'Broadcast & On-demand', 'Run livestream, webinar and breakout rooms, publish recordings and captions, and set up the event app.', 240),
    ('events/operations', 'Operations workspace', 'Run an event''s back office with private modules, records and the staff who work on them.', 250),
    ('events/members-portal', 'Members portal', 'What attendees see when they sign in: tickets, orders, memberships, live rooms, community and messages.', 260),
    ('events/settings', 'Settings', 'Manage your team and roles, your sidebar, notifications, custom domains and add-ons.', 270),
    ('events/affiliates', 'Affiliates', 'Pay affiliates commission on the sales they refer, with programs, templates and payouts.', 280)
) as v(slug, title, description, sort_order)
cross join (select id from public.docs_nav_groups where slug = 'events') g
on conflict (slug) where deleted_at is null do nothing;

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview', '<p><em>Draft outline. Replace before publishing.</em></p><ul>' || v.outline || '</ul>', 10
from (
  values
    ('events/events', '<li>Creating an event</li><li>Event statuses</li><li>The All Events list</li><li>The event editor</li><li>Event details, location and time</li><li>Visibility and publishing</li><li>Co-hosts and admins</li><li>Templates</li><li>Event series and recurring events</li>'),
    ('events/event-page', '<li>Page design and layouts</li><li>Cover media and description</li><li>Schedule, FAQ and highlights</li><li>Guests and speakers on the page</li><li>Custom URL, SEO and sharing</li><li>What buyers see</li>'),
    ('events/event-wall', '<li>The Event Wall</li><li>The organiser profile</li><li>Followers</li>'),
    ('events/venues', '<li>Adding a venue</li><li>The venue editor</li><li>Using a venue on an event</li><li>Venue sourcing</li><li>Housing and travel</li>'),
    ('events/registrations', '<li>RSVPs</li><li>Registration forms and custom questions</li><li>Waitlist</li><li>Approval gates</li><li>Capacity limits</li><li>Dietary and accessibility</li>'),
    ('events/guests', '<li>Contact Book</li><li>Importing and finding duplicates</li><li>Guest List and Who''s Going</li><li>Attendee export</li><li>Segments and tags</li><li>Notes</li><li>Data requests</li>'),
    ('events/tickets', '<li>Ticket types</li><li>Ticket tiers</li><li>Adding tickets to an event</li><li>Seating and reserved seating</li><li>Slots and purchasables</li><li>Checkout settings</li>'),
    ('events/ticket-rules', '<li>Discounts and codes</li><li>Bundles</li><li>Batched releases</li><li>Early-bird sales</li><li>Donations</li><li>Group purchasing</li><li>Access-code tickets</li><li>Dynamic pricing</li><li>Anti-scalping and resale</li>'),
    ('events/payments', '<li>Payments and methods</li><li>Payment plans</li><li>Payouts</li><li>Multi-currency</li><li>Taxes</li><li>Refund and transfer policies</li><li>Orders and attendees settings</li><li>Invoices and receipts</li>'),
    ('events/orders', '<li>All orders</li><li>Order details</li><li>Refunds and cancellations</li><li>Transactions</li><li>Billing and receipts</li><li>Disputes and chargebacks</li><li>Order settings</li>'),
    ('events/packages', '<li>Turning packages on</li><li>Building packages for an event</li><li>The packages page</li>'),
    ('events/inventory', '<li>Items</li><li>Stock movements</li><li>Event allocations</li><li>Item issuing</li><li>Issuing staff</li><li>Suppliers and purchase orders</li>'),
    ('events/memberships', '<li>Membership plans</li><li>Members</li><li>Membership settings</li><li>Attaching plans to events</li>'),
    ('events/check-in', '<li>QR tickets</li><li>The check-in app</li><li>Door sales</li><li>Kiosk mode</li><li>Badge printing</li><li>Session check-in</li><li>Gates and zones</li><li>Real-time attendance</li><li>Staff scanning roles</li><li>Lead retrieval</li>'),
    ('events/community', '<li>Event chat</li><li>Messages</li><li>Polls</li><li>Surveys</li><li>Q&A</li><li>Announcements</li>'),
    ('events/program', '<li>Agenda Builder</li><li>Display boards</li><li>Call for papers</li><li>Assign agenda</li><li>CEU and certificates</li>'),
    ('events/speakers', '<li>Speakers</li><li>Speaker portal</li><li>Speaker backstage</li>'),
    ('events/sponsors', '<li>Sponsors</li><li>Sponsorship packages</li><li>Sponsor rooms</li><li>Expo booths</li><li>Floor plan and booths</li><li>Sponsorship on an event</li>'),
    ('events/broadcast', '<li>Livestream rooms</li><li>Webinar and breakout rooms</li><li>Recordings and replay</li><li>Simulive and on-demand</li><li>Captions and transcription</li><li>Mobile event app</li><li>Branded app</li>'),
    ('events/operations', '<li>Turning on the workspace</li><li>Modules and records</li><li>Staff access</li>'),
    ('events/members-portal', '<li>Signing in</li><li>Tickets and orders</li><li>Memberships</li><li>Live and watch</li><li>Community and Q&A</li><li>Messages and notifications</li><li>The mobile app</li>'),
    ('events/settings', '<li>Team and members</li><li>Roles and permissions</li><li>Navigation</li><li>Notifications</li><li>Custom domains</li><li>Add-ons</li>'),
    ('events/affiliates', '<li>Turning on Affiliates</li><li>Programs</li><li>Affiliates</li><li>Commissions</li><li>Payouts</li><li>Settings</li>')
) as v(slug, outline)
join public.docs_pages p on p.slug = v.slug and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;

-- @down
-- Events drafts go with their outline blocks (on delete cascade).
delete from public.docs_pages where slug like 'events/%';

update public.docs_pages
set nav_group_id = (select id from public.docs_nav_groups where slug = 'products'),
    slug = 'products/events',
    title = 'Geiger Events',
    nav_label = 'Events',
    description = 'Event operations and registration.',
    preview = null,
    status = 'draft',
    published_at = null,
    sort_order = 40
where slug = 'events' and deleted_at is null;

delete from public.docs_nav_groups where slug = 'events';
