-- Rewrite four Events feature pages whose copy described unshipped capabilities, to match what the product does today.
-- Re-runnable: each update is a full overwrite keyed by (product, page_type, slug) and skips rows already matching.

-- API & Webhooks: the public REST API is not shipped; outbound webhooks run as an automation step.
update public.dash_seo_pages set
  excerpt = 'Send event activity to any system with webhook steps in Geiger Events automations — ticket purchases, registrations, check-ins and more, posted to a URL you choose the moment they happen.',
  hero_heading = 'Push event activity to the rest of your stack',
  hero_subheading = 'Webhook steps inside automations send purchases, registrations, check-ins and no-shows to any URL, in real time, with conditions you control.',
  meta_title = 'Event Webhooks & Integrations | Geiger Events',
  meta_description = 'Send ticket purchases, registrations, check-ins and refunds to any URL with webhook steps in Geiger Events automations. Filter by ticket type, tag or order value.',
  content = $html$<p>No event platform is the only tool a team uses. A purchase needs to reach the finance sheet, a registration needs to reach the CRM, and a check-in might need to ping the team chat. In Geiger Events, that connection is a <strong>webhook step</strong> inside an <a href="/features/events/event-automation">automation</a>: when something happens at your event, Geiger Events makes an HTTP request to a URL you choose.</p>

<h2>How a webhook automation works</h2>
<p>Every automation is a trigger, optional conditions, and one or more steps. A webhook is one of those steps, so it composes with everything else an automation can do — send an email, send an SMS, add a tag, add a contact to a segment, update a field or create a follow-up task for your team.</p>
<ol>
  <li><strong>Pick a trigger.</strong> Ticket purchased, registration submitted, RSVP confirmed, refund issued, payment failed, attendee checked in, waitlist joined, event published, event starting soon, or attendee no-show.</li>
  <li><strong>Narrow it with conditions</strong> (optional). Only fire for a given ticket type, for orders above an amount, for buyers with a specific attribute, or for contacts carrying a tag.</li>
  <li><strong>Add a Webhook step.</strong> Choose the method — POST, GET or PUT — and the URL of the endpoint that should receive it.</li>
  <li><strong>Turn it on.</strong> Automations have Draft, Active and Paused states, and every run is recorded in the automation's history, so you can see what fired and when.</li>
</ol>

<h2>What teams connect</h2>
<ul>
  <li><strong>Sales into finance.</strong> Post every ticket purchase and refund to the endpoint that feeds your accounting sheet or data warehouse.</li>
  <li><strong>Registrations into a CRM.</strong> Send each registration submitted to your CRM's inbound endpoint, or to an automation tool that maps it for you.</li>
  <li><strong>Door activity into team chat.</strong> Fire a check-in webhook at a chat incoming-hook URL, filtered to VIP ticket types, so hosts know when key guests arrive.</li>
  <li><strong>Payment problems into support.</strong> A payment-failed trigger can notify your helpdesk while a second step emails the buyer a nudge to retry.</li>
</ul>

<h2>Webhooks, native steps, or both</h2>
<p>If the job stays inside Geiger Events — a reminder email, a tag, a task for a colleague — use the native step; it needs no endpoint and no code. Reach for the webhook step when the data has to leave the platform. Most useful automations mix the two: tag the buyer, email them, and post the order to your finance endpoint, all from one trigger.</p>

<h2>What is not here yet</h2>
<p>A public REST API for pulling events, orders and attendees on demand is on the roadmap but not available today. Until it ships, webhooks cover the "tell another system when something happens" case, and exports from your <a href="/features/events/attendee-crm">attendee CRM</a> and registrations cover bulk data. The data your webhooks send comes from the same records as your <a href="/features/events/event-ticketing-payments">orders</a>, <a href="/features/events/event-registration-rsvp">registrations</a> and <a href="/features/events/event-check-in-app">check-ins</a>, so there is nothing to reconcile.</p>

<h2>What changes for you</h2>
<p>Event activity stops being something you export on Fridays. The moment a ticket sells or a guest walks in, the systems that care hear about it — with conditions so they only hear what matters. See how automations fit your plan on the <a href="/pricing">pricing page</a>.</p>$html$
where product = 'geiger-events' and page_type = 'feature' and slug = 'api-webhooks'
  and content not like '%<h2>What is not here yet</h2>%';

-- Venue sourcing: ships as OpenStreetMap venue search plus a shortlist/quote pipeline (proposals and instant book are not shipped).
update public.dash_seo_pages set
  title = 'Venue Sourcing',
  excerpt = 'Search real venues by city or area, preview them on a map, and shortlist the best into a sourcing pipeline with capacity, quotes, contacts and notes — then track each one to booked.',
  hero_heading = 'Find the room, then track it to booked',
  hero_subheading = 'Search real venues on a map, shortlist the promising ones, and keep quotes, contacts and notes in one pipeline instead of an inbox.',
  meta_title = 'Venue Sourcing for Events | Geiger Events',
  meta_description = 'Search real venues by city or area, preview them on a map, and track shortlisted venues through quotes and contacts to booked — venue sourcing in Geiger Events.',
  keywords = array['venue sourcing','event venue search','find event venues','venue shortlist','event venue pipeline'],
  content = $html$<p>Finding a venue usually starts in a search engine and ends in a spreadsheet: twenty tabs of venue websites, a list of names someone typed up, and quotes scattered across email threads. Venue Sourcing in Geiger Events replaces that with a search, a map and a pipeline, so the shortlist, the quotes and the contacts live in one place next to the event they are for.</p>

<h2>Search real venues on a map</h2>
<p>Type a city or an area — "Berlin", "Austin", "SoHo NYC" — and Venue Sourcing searches real venues from OpenStreetMap and plots them on a map. Narrow the radius to within 2, 5, 10 or 25 km of the area you searched, so a venue list for a downtown conference does not fill up with places an hour out of town. Preview each result on the map before you decide whether it is worth a call.</p>

<h2>Shortlist into a pipeline</h2>
<p>When a venue looks promising, shortlist it. It becomes a lead in your sourcing pipeline with the details that matter when you compare rooms:</p>
<ul>
  <li><strong>Location and capacity</strong>, so you can rule out rooms that are too small before anyone quotes.</li>
  <li><strong>Quote</strong>, so the pipeline can show your average quote across the venues you are considering.</li>
  <li><strong>Contact and notes</strong> — who you spoke to, their email, and what they said about availability, catering, AV and terms.</li>
  <li><strong>Status</strong>, from shortlisted through to booked.</li>
</ul>
<p>Instead of asking "which venue quoted what?" in a team thread, everyone opens the same list.</p>

<h2>From booked venue to running event</h2>
<p>Once a room is chosen, keep it as a reusable record in <a href="/features/events/venue-management">venue management</a> — location, capacity, amenities and contacts — so the next event there starts pre-filled. If the venue has fixed seating, build its <a href="/features/events/event-floor-plans-seating">seat map</a> once and attach it to every event you hold there; if it is an exhibition hall, lay out the booths the same way.</p>

<h2>A sourcing workflow that works</h2>
<ol>
  <li>Search the city, set the radius, and scan the map.</li>
  <li>Shortlist five to ten candidates with rough capacity.</li>
  <li>Contact them and log each quote and the conversation in the lead's notes.</li>
  <li>Compare on capacity, quote and terms, and mark the winner as booked.</li>
  <li>Save it as a venue so the next event there is a two-minute setup.</li>
</ol>

<p>Structured proposals and instant booking with participating venues are on the roadmap. Today, Venue Sourcing is the search and the pipeline — the part that saves most of the time. It is part of the conference toolkit alongside <a href="/features/events/call-for-papers">call for papers</a> and the <a href="/features/events/conference-agenda-speakers">agenda builder</a>; see the <a href="/solutions/events/conference-event-software">conference software overview</a> for how they fit, or the <a href="/pricing">pricing page</a> for plans.</p>$html$
where product = 'geiger-events' and page_type = 'feature' and slug = 'venue-sourcing'
  and content not like '%searches real venues from OpenStreetMap%';

-- Floor plans: Event Design diagramming is not shipped; seat maps and exhibitor hall maps are.
update public.dash_seo_pages set
  title = 'Seat Maps & Exhibitor Floor Plans',
  excerpt = 'Build a venue''s seat map once — sections, rows, tables, GA zones and accessible seats — or lay out an exhibitor hall booth by booth, then attach it to any event held there.',
  hero_heading = 'Lay the room out once, reuse it for every event',
  hero_subheading = 'Seat maps with sections, rows, tables, GA zones and accessible seats, and exhibitor halls with numbered, priced booths — built per venue, attached per event.',
  meta_title = 'Seat Map & Exhibitor Floor Plan Builder | Geiger Events',
  meta_description = 'Build venue seat maps with sections, rows, tables, GA zones and accessible seats, or lay out exhibitor halls with numbered booths — then attach them to any event.',
  keywords = array['seat map builder','event seating chart','venue seat map','exhibitor floor plan','booth layout software'],
  content = $html$<p>A room layout is usually rebuilt from scratch for every event: a seating plan in a spreadsheet, a booth list in another, and a PDF from the venue that nobody can edit. In Geiger Events, layouts belong to the <strong>venue</strong>. You build a room's seat map or exhibitor hall once, and every event held there picks it up.</p>

<h2>Seat maps</h2>
<p>A seat map is a configuration of a venue — "End-stage concert", "In the round", "Banquet rounds" — made of sections you place on the floor and fill with seats. For each section you set:</p>
<ul>
  <li><strong>Rows and seats per row</strong>, with row labels and a first row to start from.</li>
  <li><strong>Seat numbering</strong>, including odd/even numbering counted outward from a centre aisle, the theatre convention.</li>
  <li><strong>Aisles</strong> after given seat numbers.</li>
  <li><strong>Shape</strong> — curve, rake toward the back, tiers — and the direction the section faces, so a bowl section can turn toward the stage or the field.</li>
  <li><strong>Tables</strong>, with seats per table, for galas and banquets.</li>
  <li><strong>GA zones</strong>, which sell by capacity and have no chairs, for standing floors next to seated sections.</li>
  <li><strong>Accessible seats</strong>, marked on the map.</li>
</ul>
<p>Already have a seat list from a box-office system? Import it from CSV; exports from most systems work as-is. The editor keeps a running total capacity as you build, and configurations move through Draft, Active and Archived so a work-in-progress layout never reaches a live event.</p>

<h2>Exhibitor halls</h2>
<p>For expos and trade shows, a hall map lays out booths over the venue's floor. Generate rows and columns of booths with a code prefix and starting number (A1, A2, A3…), set each booth's size and size class, and add a price when the event sells booths directly. Hide booths that should not be sold, and add zones and features — stages, catering, lounges — as floor furniture that never sells. The result feeds <a href="/features/events/sponsors-exhibitors">sponsors and exhibitors</a> booth assignment.</p>

<h2>Built per venue, attached per event</h2>
<p>Seat maps and halls live on the venue record in <a href="/features/events/venue-management">venue management</a>. When you create an event at that venue, attach the configuration it should use. Turn on <a href="/features/events/reserved-seating">reserved seating</a> and buyers pick their exact seat from that map at checkout, with each seat held while they pay.</p>

<h2>Questions organisers ask</h2>
<h3>Can one venue have several layouts?</h3>
<p>Yes. Each venue can hold multiple seat map configurations and multiple halls — a theatre setup and a cabaret setup of the same room, for example — and each event picks one.</p>
<h3>Can I mix seated and standing areas?</h3>
<p>Yes. Add a GA zone with a capacity alongside seated sections; the zone sells by headcount while the sections sell by seat.</p>
<h3>Is there a drag-and-drop diagram tool for furniture and room setups?</h3>
<p>Full event diagramming — an object library, setup-style capacity checks and 3D walkthroughs — is on the roadmap. Today's layouts cover seating and booths, which is what ticketing and exhibitor sales depend on.</p>

<p>See it in context in <a href="/solutions/events/expo-trade-show-management">expo and trade show management</a> or <a href="/solutions/events/nightlife-club-ticketing">club ticketing</a>, or check plans on the <a href="/pricing">pricing page</a>.</p>$html$
where product = 'geiger-events' and page_type = 'feature' and slug = 'event-floor-plans-seating'
  and content not like '%<h2>Exhibitor halls</h2>%';

-- Livestream: rooms carry your own stream link; no built-in backstage. Captions ship as Whisper transcription of recordings.
update public.dash_seo_pages set
  excerpt = 'Run livestream, webinar and breakout rooms inside your event — bring your stream from YouTube Live, Zoom or RTMP, unlock rooms by purchase or membership, and transcribe recordings into captions.',
  hero_heading = 'Run the online rooms inside the same event',
  hero_subheading = 'Livestream, webinar and breakout rooms with access tied to what attendees bought, live viewer counts, replays, and transcripts of every recording.',
  meta_description = 'Run livestream, webinar and breakout rooms inside Geiger Events. Bring your own stream, unlock rooms by purchase or membership, track viewers, and transcribe recordings.',
  content = $html$<p>Running the online side of an event usually means a video tool, a registration tool and a replay host, glued together with a spreadsheet of who is allowed in. Geiger Events keeps the rooms inside the event: you bring the stream you already use, and the event decides who can open it, tracks who is watching, and keeps the replay where attendees expect it.</p>

<h2>Three kinds of room</h2>
<h3>Livestream rooms</h3>
<p>For keynotes and main-stage sessions. Point the room at your stream — YouTube Live, Zoom, an RTMP ingest or a studio link — and give attendees the watch link they should open. Each room has a schedule: attendees can open it 15 minutes before start, and it closes at an end time or stays open until you end it. For hybrid events, add the physical location ("Hall B, Level 2") and internal notes for AV setup, backup streams and moderators. While live, the room shows how many people are watching and how many unique viewers it has had.</p>
<h3>Webinar rooms</h3>
<p>For talks with a sign-up. Require attendees to register before they can join, set a live-room link and an on-demand replay link, and track registered, watching and show rate — the share of registrants who actually turned up.</p>
<h3>Breakout rooms</h3>
<p>For small-group sessions split from a main session. Give each room a capacity, a facilitator and a prompt, then spread attendees across rooms automatically. Sibling rooms that split from the same session are assigned and timed together, and each room keeps a roster of who is in it.</p>

<h2>Access tied to what attendees hold</h2>
<p>Each room chooses how attendees unlock it: free, with a <a href="/features/events/memberships">membership</a>, by purchase, or as a rental. That means an all-access pass and a general pass can see different rooms, driven by the same <a href="/features/events/event-ticketing-payments">ticketing</a> as the in-person door, with no separate access list to maintain.</p>

<h2>Captions and transcripts</h2>
<p>Recordings in your library can be transcribed with Whisper: pick a recording, a model and a language, start the job, and download the finished transcript when it is ready. Use it for captions on replays, for accessibility requests, or to turn a talk into a written recap.</p>

<h2>Questions organisers ask</h2>
<h3>Does Geiger Events host the video itself?</h3>
<p>No — rooms carry the stream you run on the platform you already use, which means you keep your existing production setup and quality. Geiger Events handles access, scheduling, viewer tracking, replays and transcripts around it.</p>
<h3>Can a hybrid session have both a room and a stream?</h3>
<p>Yes. A livestream room holds the physical location and the stream together, and the session sits on the same <a href="/features/events/conference-agenda-speakers">agenda</a> as everything else.</p>

<h2>What changes for you</h2>
<p>The online audience stops being a second event. The same tickets unlock the rooms, the same attendee list shows who watched, and every recording can become a transcript. Explore the full <a href="/solutions/events/virtual-hybrid-events">virtual and hybrid events</a> overview, or see plans on the <a href="/pricing">pricing page</a>.</p>$html$
where product = 'geiger-events' and page_type = 'feature' and slug = 'livestream-webinar-rooms'
  and content not like '%<h3>Breakout rooms</h3>%';
