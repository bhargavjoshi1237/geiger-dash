-- Help events registrations page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the events/registrations draft outline from
-- 20261024191100_help_events_structure with the full Registrations guide and publishes it.
-- Written from a survey of C:\Pro\geiger-events (components/internal/sidebar/sidebar_nav.jsx, geiger-ui.config.js,
-- geiger-rbac.config.js, components/internal/screens/registry.jsx, components/internal/screens/registrations/*,
-- components/internal/screens/events/{event_sections.js,rsvp.jsx,content_media.jsx,event_builder.jsx,guidelines.jsx,
-- section_heading.jsx,event_detail.jsx,all_events.jsx}, components/internal/shared/guideline_editor.jsx,
-- components/internal/screens/tickets/event_tickets.jsx, components/internal/screens/events/public_page/{page_content.jsx,
-- sidebar_cards.jsx,use_page_data.js,layouts/luma.jsx}, public_page/checkout/{use_checkout.js,details_step.jsx,
-- review_step.jsx,question_fields.jsx,validate.js,done_step.jsx,post_purchase_request.jsx},
-- components/internal/screens/checkin/name_search_lookup.jsx, lib/supabase/{registrations,registration_forms,dietary,
-- orders}.js, lib/events/{registration_answers,section_titles,use-event-config,express_checkout}.js,
-- lib/stripe/fulfill-checkout.js, lib/email/{catalog,notifications}.js, lib/notifications/server.js,
-- app/api/registrations/approval-email/route.js, app/kiosk/[eventId]/page.js, app/door/[eventId]/page.js,
-- supabase/migrations/{20260726194120_registrations,20260726194134_project_access}.sql).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set description = 'Take registrations from the event page or by hand, approve requests, promote from the waitlist, set capacity, and plan for dietary and accessibility needs.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'events/registrations' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'events/registrations' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, showcase, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.showcase, v.sort_order
from (
  values
    (
      'registering-on-the-event-page',
      'Basics',
      'Registering on the event page',
      $html$<p>People register for an event on its event page. They pick a ticket on the ticket card and choose its button (<strong>Register</strong> for a free ticket and <strong>Get Tickets</strong> for a paid one, by default). Checkout opens on its details step, which asks for a <strong>Quantity</strong>, <strong>Full name</strong> and <strong>Email</strong>, then the event's custom questions and, when the event attaches it, the dietary and accessibility inquiry. The name and a valid email are required, and an attendee who's signed in has them filled in.</p><p>The last button on the details step decides what happens next:</p><ul><li><strong>Complete registration</strong>: for a free ticket. Events records a free order and a Confirmed registration.</li><li><strong>Continue To Payment</strong>: for a paid ticket. The attendee pays through Stripe, and Events records a Confirmed registration once the payment goes through.</li><li><strong>Request to register</strong>: when the event requires approval. Events records a Pending registration and takes no payment until you approve it.</li></ul><p>The button reads <strong>Continue</strong> instead when more steps follow, such as seats, add-ons or a terms review. Each registration takes as many seats as the quantity chosen. For ticket types, prices and the rest of checkout, see <a href="/help/events/tickets">Tickets</a>.</p><p>By default, <strong>Registrations</strong> appears in the sidebar for the Owner, Admin, Manager and Member roles. To change who sees it, see <a href="/help/events/settings#roles-and-permissions">Roles and permissions</a>.</p>$html$,
      '[]',
      null,
      10
    ),
    (
      'adding-a-registrant',
      'Basics',
      'Adding a registrant by hand',
      $html$<p>To register someone yourself, for a comp, a VIP or a phone sign-up, choose <strong>Registrations → RSVPs</strong> in the sidebar, then <strong>Add Registrant</strong>. <strong>Full name</strong> and <strong>Event</strong> are required: Events won't add the registrant without them.</p><ul><li><strong>Email</strong> and <strong>Phone</strong>: optional. Approval emails go to the email address.</li><li><strong>Event</strong>: the event they're registering for. When you add someone from an event's own registrations, the event is already set.</li><li><strong>Status</strong>: Confirmed, Pending, Waitlisted, Checked-in, Declined or Cancelled. New registrants are Confirmed.</li><li><strong>Party size</strong>: how many seats the registration takes, the registrant included. It starts at 1.</li><li><strong>Dietary needs</strong> and <strong>Accessibility needs</strong>: optional notes that feed the needs report in <strong>Dietary & Accessibility</strong>.</li></ul><p>Choose <strong>Add Registrant</strong> to save. The registration's source is Organizer. Adding someone doesn't check the event's capacity, doesn't create an order or a ticket, and doesn't email them.</p>$html$,
      '[]',
      null,
      20
    ),
    (
      'statuses-seats-and-sources',
      'Concepts',
      'Registration statuses, seats and sources',
      $html$<p>A <strong>registration</strong> is one person's place at one event. It's separate from an order: every completed checkout on the event page records both, an approval request records only the registration, and a registrant you add by hand has no order. Changing a registration never changes an order, and refunding or canceling an order doesn't change its registration.</p><p>Every registration has one of six statuses:</p><ul><li><strong>Confirmed</strong>: has a place at the event.</li><li><strong>Pending</strong>: waiting for your decision in <strong>Approval Gates</strong>.</li><li><strong>Waitlisted</strong>: in the event's queue in <strong>Waitlist</strong>, where its position shows as #1, #2 and so on.</li><li><strong>Checked-in</strong>: marked as arrived.</li><li><strong>Declined</strong>: their request was turned down.</li><li><strong>Cancelled</strong>: no longer coming. Events never sets this status on its own.</li></ul><p>Confirmed and Checked-in registrations take <strong>seats</strong>: each one counts its party size, which is the quantity chosen at checkout or the <strong>Party size</strong> you set when adding someone by hand. Seats are what the registration screens compare with the event's capacity.</p><p>The <strong>source</strong> says where a registration came from: Online (the event page), Organizer (added by your team) or Kiosk (the check-in kiosk's <strong>Register</strong> option). The guest list in Guests is built from registrations; see <a href="/help/events/guests">Guests</a>.</p>$html$,
      '[]',
      null,
      30
    ),
    (
      'rsvps-screen',
      'RSVPs',
      'The RSVPs screen',
      $html$<p>Choose <strong>Registrations → RSVPs</strong> in the sidebar to see every registration in the project. Switch between two views at the top:</p><ul><li><strong>By Event</strong> (the default): a card for each event that has at least one registration, with its date, format and how many registrations are Confirmed, Pending, Waitlisted and Checked-in. The right side shows seats filled out of the event's capacity, or <strong>No limit</strong>, and a <strong>Full</strong> or <strong>Over capacity</strong> badge marks events at or past capacity. Events with the most Pending and Waitlisted registrations come first, then the busiest. Search matches event names.</li><li><strong>All People</strong>: every registration, newest first, with the person, event, source, registration date and status. A number beside a name shows how many extra seats the registration takes. Search matches names, emails and event names. Click a row to open its details.</li></ul><p>The lists show 60 events or 100 people at a time, with a <strong>Show more</strong> button at the bottom for the rest. Click an event card to manage that event's registrations.</p><p><strong>Export</strong> downloads every registration in the project as a CSV file, whatever view or search you're on, with each person's name, email, event, status, source, party size, dietary and accessibility needs, and registration date.</p><p>Waitlist, Approval Gates and Capacity Limits depend on RSVPs, and Dietary & Accessibility depends on Registration Forms. To hide RSVPs or Registration Forms from your own sidebar under <strong>Settings → Navigation</strong>, hide the entries that depend on it first; see <a href="/help/events/settings#navigation">Sidebar navigation</a>.</p>$html$,
      '[]',
      null,
      40
    ),
    (
      'managing-an-events-registrations',
      'RSVPs',
      'Managing an event''s registrations',
      $html$<p>Click an event card in <strong>Registrations → RSVPs</strong> to open that event's registrations. The header shows seats filled out of capacity, and the tabs narrow the list: <strong>All</strong>, <strong>Pending</strong>, <strong>Confirmed</strong>, <strong>Waitlist</strong> and <strong>Checked in</strong>, each with its count. Search matches names and emails, and <strong>All Events</strong> at the top goes back.</p><ul><li><strong>Approve</strong> on a Pending row and <strong>Promote</strong> on a Waitlisted row confirm that registration.</li><li>Each row's <strong>⋯</strong> menu has <strong>View details</strong>, <strong>Check in</strong> (for Confirmed registrations), <strong>Move to waitlist</strong> and <strong>Remove</strong>.</li><li>Select rows with their checkboxes, then choose <strong>Confirm</strong> or <strong>Waitlist</strong> to change them all at once, or <strong>Clear</strong>.</li></ul><p>Click a row to open its details: event, source, registration date, party size, phone, waitlist position, dietary and accessibility needs, and answers to custom questions under <strong>Form answers</strong>. Change the status from the <strong>Status</strong> menu, or with the buttons at the bottom: <strong>Approve</strong> and <strong>Decline</strong>, <strong>Check in</strong>, or <strong>Promote</strong>.</p><p>Every change saves straight away. Approving here doesn't email the attendee: approve in <strong>Approval Gates</strong> for that. <strong>Check in</strong> only changes the status and doesn't record an admission in <a href="/help/events/check-in">Check-in</a>. <strong>Remove</strong> asks you to confirm first, and a removed registration can't be restored from Events.</p><p><strong>Export</strong> downloads the registrations in the current tab and search as a CSV file, and <strong>Add Registrant</strong> adds someone to this event.</p>$html$,
      '[]',
      null,
      50
    ),
    (
      'after-registering',
      'Event page',
      'What attendees see after registering',
      $html$<p>When checkout finishes, the attendee sees a confirmation screen that depends on the outcome:</p><ul><li><strong>You're going!</strong> for a confirmed registration, with the ticket and quantity, the date and venue, their email and the order number.</li><li><strong>Registration received</strong> when the event requires approval, with the status Pending review.</li></ul><p>What arrives by email depends on how they registered:</p><ul><li>A paid order gets its tickets by email once the payment goes through. See <a href="/help/events/tickets">Tickets</a>.</li><li>A free registration gets no email from Events, so the confirmation screen is its only confirmation.</li><li>A request waiting for approval gets no email until you approve it in <strong>Approval Gates</strong>.</li></ul><p>When dietary and accessibility requests are turned on for the project and for the event, the confirmation screen also has a <strong>Dietary or accessibility need?</strong> box, where the attendee writes a request and chooses <strong>Send request</strong>.</p>$html$,
      '[]',
      null,
      60
    ),
    (
      'rsvp-options',
      'Event editor',
      'RSVP options',
      $html$<p>RSVP options set whether an event's registrations need approval and how many people it takes. In the event editor, open <strong>RSVP Options</strong>, under Registration. Each switch saves as you change it, and <strong>Maximum attendees</strong> saves when you leave the field.</p><ul><li><strong>Require approval</strong>: every registration from the event page becomes a request. The last checkout button reads <strong>Request to register</strong>, no payment is taken, and the registration waits as Pending in <strong>Approval Gates</strong>. It's off to start with.</li><li><strong>Limit capacity</strong> and <strong>Maximum attendees</strong>: the event's capacity, the same number as the capacity you set when creating the event and in <strong>Capacity Limits</strong>. Turning on <strong>Limit capacity</strong> sets 100 when the event has no capacity yet, and turning it off removes the limit. Once tickets sold reach it, the event page shows <strong>Sold out</strong>.</li><li><strong>Enable waitlist</strong>: shows <strong>One entry per guest on the waitlist</strong>. The event page doesn't put anyone on the waitlist itself: when the event is full, it shows <strong>Sold out</strong>.</li><li><strong>One entry per guest on the waitlist</strong>: stops someone whose email is already on the event's waitlist from registering or buying again. Checkout tells them they're already on the waitlist.</li></ul><p><strong>Enable RSVPs</strong>, at the top, only shows or hides these settings. Turning it off doesn't change the event page, and a setting that's already on, such as <strong>Require approval</strong>, stays in effect.</p><p>The other settings in the section (<strong>Allow "Maybe" responses</strong>, <strong>Allow changes & cancellations</strong>, <strong>RSVP deadline</strong>, <strong>Allow plus-ones</strong> and its options, <strong>Show who's going</strong> and <strong>Send confirmation email</strong>) are saved with the event but don't change the event page or checkout. A deadline doesn't close registration, and no confirmation email is sent.</p>$html$,
      '[]',
      null,
      70
    ),
    (
      'custom-questions',
      'Event editor',
      'Custom questions',
      $html$<p>Custom questions are what checkout asks each attendee after their name and email. To add one, open the event in the event editor, open <strong>Custom Questions</strong> and choose <strong>Add question</strong>. Type the <strong>Question label</strong>, pick an <strong>Answer type</strong> (Short text, the default, Paragraph, Dropdown, Checkboxes or Number), turn on <strong>Required question</strong> if it must be answered, and choose <strong>Add question</strong>. Only the label is required.</p><p>Every change in this section saves on its own. Use the arrows to reorder questions and each question's <strong>Required</strong> switch to change whether it must be answered. The trash icon removes a question straight away, without asking. To change a question's label or type, remove it and add it again.</p><p>On the event page:</p><ul><li>Short text and Number are one-line boxes, and Paragraph is a larger box.</li><li>Checkboxes is a single tick box, and Dropdown is a text box: there's no list of choices to pick from.</li><li>Questions labeled Name, Full name, Email or E-mail are skipped, because checkout always asks for those.</li><li>Checkout won't continue until every required question is answered.</li></ul><p>An answer to a question whose label mentions diet or allergies is saved as the registration's dietary needs, and one whose label mentions accessibility, mobility or disability as its accessibility needs. Other answers appear under <strong>Form answers</strong> in the registration's details.</p><p>A new event's list starts with Full name, Dietary requirements, T-shirt size and How did you hear about us?, but checkout asks none of them until you first add, remove, reorder or change a question. The event page also lists the questions in a card headed At registration; to rename it, choose the name beside <strong>Shown on your page as</strong>. Checkout asks only the questions in this section: forms built under <strong>Registrations → Registration Forms</strong> aren't attached to any event.</p>$html$,
      '[]',
      null,
      80
    ),
    (
      'registration-settings',
      'Event editor',
      'Registration settings',
      $html$<p>In the event editor, open <strong>Registration Settings</strong>, under Registration. Both switches save as you change them.</p><ul><li><strong>Show tickets remaining</strong>: on to start with. The event page shows how many tickets are left, or that the event is sold out.</li><li><strong>Require approval</strong>: adds an <strong>Approval Required</strong> notice to the ticket card when the event page uses the Luma layout. It doesn't hold registrations for approval: to do that, turn on <strong>Require approval</strong> in <strong>RSVP Options</strong>.</li></ul>$html$,
      '[]',
      null,
      90
    ),
    (
      'approval-gates',
      'Approval Gates',
      'Approving and declining registrations',
      $html$<p>Choose <strong>Registrations → Approval Gates</strong> in the sidebar to see every event with registrations waiting for a decision, each with how many are pending. Sort by <strong>Most pending</strong> (the default), <strong>Fewest pending</strong> or <strong>Event date</strong>, or alphabetically by name, and search by event name. Click an event to see its requests, oldest first, with each person's email, request date, party size, dietary and accessibility needs, and up to three of their answers.</p><ul><li><strong>Approve</strong> confirms the registration straight away.</li><li><strong>Decline</strong> asks you to confirm, then sets the registration to Declined.</li><li><strong>Approve all</strong> and <strong>Decline all</strong> act on every pending request for the event, and ask you to confirm first. <strong>Approve all</strong> is also on each event's row in the list.</li></ul><p>Approving here emails the attendee a link back to the event page, where checkout opens with their name and email filled in so they can finish registering, or pay for a paid ticket. Until they do, they have a Confirmed registration but no order or ticket. Approval doesn't check capacity, so an approved attendee can find the event sold out when they come back.</p><p>The email goes only to registrations with an email address, and only while <strong>Registration approved</strong> is on under <strong>Settings → Notifications</strong>; see <a href="/help/events/settings">Settings</a>. Approving from <strong>RSVPs</strong> confirms without sending it. Events doesn't email declined attendees, so let them know yourself. To reverse a decision, change the registration's status in <strong>RSVPs</strong>.</p>$html$,
      '[]',
      null,
      100
    ),
    (
      'waitlist',
      'Waitlist',
      'Promoting people from the waitlist',
      $html$<p>Choose <strong>Registrations → Waitlist</strong> in the sidebar to see every event that has someone waiting, with how many are waiting and how many seats are open (capacity minus seats taken), or <strong>full</strong>. Sort by <strong>Most waiting</strong> (the default), <strong>Fewest waiting</strong>, <strong>Most open spots</strong> or <strong>Event date</strong>, or alphabetically by name, and search by event name.</p><p><strong>Promote</strong> on an event's row, or <strong>Promote next</strong> once you click into the event, confirms the person at the top of the queue and moves everyone else up a place. Both need an open seat. An event with no capacity limit always shows as full here, so promote its waitlisted people from <strong>RSVPs</strong> instead, where <strong>Promote</strong> confirms the person on that row.</p><p>An event's own view lists its queue in order, with each person's position, email and the date they joined. People you move to the waitlist from <strong>RSVPs</strong> get no position number and queue after everyone who has one.</p><p>Events promotes people only when you do: the settings under <strong>Rules</strong> are saved but don't promote or email anyone. A promoted person gets a Confirmed registration, but no email, order or ticket.</p><p>The event page never puts anyone on the waitlist: when tickets sold reach capacity, it shows <strong>Sold out</strong>. People join a waitlist when you set their status to Waitlisted, or when they register at the check-in kiosk after the event's seats, plus any overbook buffer, are full.</p>$html$,
      '[]',
      null,
      110
    ),
    (
      'capacity-limits',
      'Capacity Limits',
      'Capacity and the overbook buffer',
      $html$<p>An event's <strong>capacity</strong> is how many people it takes, and 0 means no limit. Set it when you create the event, in the event editor's <strong>RSVP Options</strong>, or in <strong>Registrations → Capacity Limits</strong>: click an event, change <strong>Capacity</strong> and <strong>Overbook buffer</strong> (extra seats beyond capacity) in <strong>Adjust capacity</strong>, and choose <strong>Save</strong>.</p><p>Capacity Limits lists every event with its seats taken out of capacity plus buffer, how full it is, and its buffer. <strong>At capacity</strong> counts events that are full or over, <strong>Total seats</strong> adds up every event's capacity, and <strong>Avg. fill</strong> averages the fill of events that have a limit. Sort by <strong>Fullest first</strong> (the default), <strong>Emptiest first</strong>, <strong>Most seats left</strong> or <strong>Largest capacity</strong>, or alphabetically by name, and search by event name.</p><p>Capacity limits sales and registrations in different ways:</p><ul><li>The event page counts tickets sold, not registrations, and shows <strong>Sold out</strong> once they reach the capacity. It doesn't use the buffer.</li><li>Door sales and the check-in kiosk can go past capacity, up to capacity plus the buffer.</li><li>Registrations you add by hand, approve or promote aren't checked against capacity, and don't count as tickets sold.</li></ul><p>The fill on Capacity Limits, RSVPs and Waitlist counts the seats taken by Confirmed and Checked-in registrations.</p>$html$,
      '[]',
      null,
      120
    ),
    (
      'dietary-and-accessibility-guidelines',
      'Event editor',
      'Dietary and accessibility guidelines',
      $html$<p>Guidelines answer attendees' dietary and accessibility questions before they register, like where the step-free entrance is. To add one, open the event in the event editor, open <strong>Dietary & Accessibility</strong>, under Location, and choose <strong>Add guideline</strong>. Pick a <strong>Category</strong> (Dietary, the default, or Accessibility), type the <strong>Guideline</strong>, and optionally a detail to show under it. Use the arrows to reorder guidelines and the trash icon to remove one.</p><p>Nothing reaches the event page until you choose <strong>Save guidelines</strong>, and a guideline with no text isn't shown. The event page lists the venue's guidelines first, then the event's, in a card headed Dietary & Accessibility. To rename the card, choose the name beside <strong>Shown on your page as</strong> at the top of the section and type up to 60 characters.</p><p>The section's <strong>Requests</strong> card has <strong>Enable post-purchase requests</strong>, which saves as you change it. While it's on, and requests are turned on for the whole project in <strong>Registrations → Dietary & Accessibility</strong>, the confirmation screen at the end of checkout lets attendees send you a dietary or accessibility request.</p>$html$,
      '[]',
      null,
      130
    ),
    (
      'needs-report',
      'Dietary & Accessibility',
      'The needs report',
      $html$<p>The needs report gathers every registration with dietary or accessibility needs, for catering and venue planning. Choose <strong>Registrations → Dietary & Accessibility</strong> in the sidebar; it opens on the <strong>Needs report</strong> tab. Registrations that were declined or canceled are left out.</p><ul><li>The figures across the top count <strong>Registrations with needs</strong> (with their total heads, adding up party sizes), <strong>Dietary requirements</strong> and <strong>Accessibility requests</strong>.</li><li><strong>Dietary breakdown</strong> counts the registrations whose dietary needs mention Vegetarian, Vegan, Gluten-free, Nut allergy, Halal, Kosher or Dairy-free. Only requirements someone has are shown.</li><li><strong>Inquiry responses</strong> counts how many people picked each option in the dietary and accessibility inquiry, once there are answers.</li><li>The table lists each registrant with their event, dietary and accessibility needs, party size and registration date.</li></ul><p>The event filter, <strong>All Events</strong> to start with, narrows everything on the tab. Search matches names and needs, and narrows only the table. The export icon beside the tabs downloads the table's rows as a CSV file with each person's name, email, event, needs and party size.</p><p>Needs come from custom questions about diet, allergies, accessibility, mobility or disability, and from the <strong>Dietary needs</strong> and <strong>Accessibility needs</strong> fields when you add a registrant by hand.</p>$html$,
      '[]',
      null,
      140
    ),
    (
      'dietary-and-accessibility-requests',
      'Dietary & Accessibility',
      'Dietary and accessibility requests',
      $html$<p>Requests let attendees message you about a dietary or accessibility need once they've registered. To turn them on, choose <strong>Registrations → Dietary & Accessibility</strong>, open the <strong>Requests</strong> tab and turn on <strong>Enable Dietary & Accessibility Requests</strong>. The switch covers the whole project, is off to start with, and saves as you change it. Each event also has to opt in with <strong>Enable post-purchase requests</strong> in the event editor's <strong>Dietary & Accessibility</strong> section.</p><p><strong>Request prompt</strong> is optional text shown over the attendee's message box, and it saves when you leave the field. Attendees see the box on the confirmation screen at the end of checkout, write their request and choose <strong>Send request</strong>. It arrives with the name and email they gave at checkout.</p><p>The <strong>Requests</strong> tab lists requests newest first, with who sent each one, the event, the request, its status (Open or Resolved) and when it arrived. Filter by event and status, or search names, emails and messages. Each row's <strong>⋯</strong> menu has <strong>Mark resolved</strong> or <strong>Reopen</strong>, and <strong>Delete</strong>, which asks you to confirm first and can't be undone. Events doesn't tell you when a request arrives, so check the tab. The export icon beside the tabs downloads the requests shown as a CSV file.</p>$html$,
      '[]',
      null,
      150
    ),
    (
      'dietary-and-accessibility-inquiry',
      'Dietary & Accessibility',
      'The dietary and accessibility inquiry',
      $html$<p>The inquiry is a set of multiple-choice questions, such as dietary preferences, that checkout asks on every event that attaches it. You build it once for the project: choose <strong>Registrations → Dietary & Accessibility</strong>, open the <strong>Inquiry</strong> tab and choose <strong>Add question</strong>.</p><ul><li><strong>Question label</strong>: the question. It starts as Untitled question.</li><li><strong>Type</strong>: <strong>Single choice (radio)</strong>, the default, or <strong>Multiple choice (checkboxes)</strong>.</li><li><strong>Options</strong>: the answers to pick from. Choose <strong>Add option</strong> for each one. A question keeps at least one option.</li><li><strong>Required</strong>: checkout won't continue until the question is answered.</li></ul><p>Use the arrows to reorder questions and the trash icon to remove one. Under <strong>Introduction</strong>, an optional <strong>Heading</strong> and <strong>Description</strong> appear over the questions in checkout. Nothing saves until you choose <strong>Save inquiry</strong>, which drops blank options and any question without a label or an option.</p><p>To ask the inquiry on an event, open the event in the event editor, open <strong>Tickets</strong>, and turn on <strong>Attach Dietary & Accessibility inquiry</strong>. It saves on its own and lists the questions checkout will ask. The answers are counted under <strong>Inquiry responses</strong> in the needs report.</p>$html$,
      '[]',
      null,
      160
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"CalendarDays","label":"Events","href":"/help/events/events"},{"icon":"LayoutTemplate","label":"Event page","href":"/help/events/event-page"},{"icon":"Ticket","label":"Tickets","href":"/help/events/tickets"},{"icon":"Users","label":"Guests","href":"/help/events/guests"},{"icon":"ScanLine","label":"Check-in","href":"/help/events/check-in"},{"icon":"Settings","label":"Settings","href":"/help/events/settings"}]',
      null,
      170
    )
) as v(anchor_id, eyebrow, title, content, links, showcase, sort_order)
cross join (select id from public.docs_pages where slug = 'events/registrations' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Registrations',
    description = 'Collect RSVPs with registration forms, and manage waitlists, approvals, capacity and dietary needs.',
    status = 'draft',
    published_at = null
where slug = 'events/registrations' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'events/registrations' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>RSVPs</li><li>Registration forms and custom questions</li><li>Waitlist</li><li>Approval gates</li><li>Capacity limits</li><li>Dietary and accessibility</li></ul>',
  10
from public.docs_pages p
where p.slug = 'events/registrations' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
