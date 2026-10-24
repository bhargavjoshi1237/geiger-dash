-- Help events tickets page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the events/tickets draft outline from
-- 20261024191100_help_events_structure with the full Tickets guide and publishes it.
-- Written from a survey of C:\Pro\geiger-events (components/internal/sidebar/sidebar_nav.jsx,
-- components/internal/screens/tickets/{ticket_types,ticket_tiers,reserved_seating,records_kit,settings_kit,controls,
-- constants,ticket_questions_editor,event_tickets,ticket_stub,discount_code_picker,event_ticket_rules}.jsx,
-- components/internal/screens/events/{event_sections.js,event_detail,event_seating,seat_map_view,seat_offers,seat_picker,
-- event_reserved,offerings,purchasables,ticket_addons_step,slots,event_ctas,ticket_selection,express_lane,
-- purchase_disclaimer,disclaimer_placement,all_events,event_builder}.jsx,
-- components/internal/screens/events/public_page/{tickets.js,use_page_data.js,page_content.jsx,sidebar_cards.jsx},
-- components/internal/screens/events/public_page/checkout/*, components/portal/portal_tickets.jsx,
-- lib/supabase/{ticketing,ticket_questions,orders}.js, lib/events/{use-event-config,reserved,slots,purchasables,ctas,
-- ticket_selection,express_checkout,purchase_disclaimer}.js, lib/seating/offers.js, lib/stripe/fulfill-checkout.js,
-- app/api/checkout/{route,verify/route,email/route}.js, app/api/tickets/[orderId]/qr/route.js, lib/email/catalog.js,
-- supabase/migrations/{20260726194125_ticket_questions,20260904090000_ticket_releases}.sql, geiger-rbac.config.js,
-- geiger-ui.config.js) and C:\Pro\geiger-dash (mails/templates/geiger-events/ticket-purchase-confirmation.jsx).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set description = 'Add tickets to an event, group them into tiers, sell assigned seats, add extras and time slots, and see how buyers check out and get their tickets.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'events/tickets' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'events/tickets' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, showcase, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.showcase, v.sort_order
from (
  values
    (
      'adding-tickets-to-an-event',
      'Basics',
      'Adding tickets to an event',
      $html$<p>Tickets belong to one event. To add one, open the event from <strong>Events → All Events</strong>, open <strong>Tickets</strong> in the event editor, and choose <strong>Add Ticket</strong>. Events saves a free, unlimited ticket called General Admission straight away and opens it in <strong>Edit ticket</strong>.</p><ul><li><strong>Ticket name</strong>: required. Events won't save the ticket without one.</li><li><strong>Price</strong>: what one ticket costs. At 0 the ticket is free, and buyers register without paying.</li><li><strong>Quantity</strong>: how many you sell. 0 means unlimited.</li><li><strong>Description</strong>: a line shown under the ticket's name.</li><li><strong>Group</strong>: the tier group the ticket sits in, once the event has groups. Tickets start as Ungrouped.</li><li><strong>Apply ticket type</strong>: optional, a reusable ticket type from <strong>Tickets → Ticket Types</strong>. It starts as No type.</li><li><strong>Discount codes</strong>: tick the codes buyers can use on this ticket. A code works only on the tickets where it's ticked. You create codes under <strong>Tickets → Discounts & Codes</strong> (see <a href="/help/events/ticket-rules">Discounts & ticket rules</a>).</li></ul><p>Choose <strong>Save</strong>. <strong>Cancel</strong> keeps the ticket as Events first saved it, so delete it if you don't want it.</p><p>By default, <strong>Tickets</strong> appears in the sidebar for the Owner, Admin and Manager roles. To change who sees it, see <a href="/help/events/settings#roles-and-permissions">Roles and permissions</a>. The event editor's Tickets group isn't limited by role: anyone who can open an event can change its tickets.</p>$html$,
      '[]',
      null,
      10
    ),
    (
      'tickets-types-and-tiers',
      'Concepts',
      'Tickets, ticket types and tiers',
      $html$<p>A <strong>ticket</strong> is what buyers pick on the event page. It lives on one event and has its own name, price, quantity and description. Two reusable records in the <strong>Tickets</strong> sidebar area add to it:</p><ul><li>A <strong>ticket type</strong> (<strong>Tickets → Ticket Types</strong>) is a set of rules and attendee questions you apply to tickets on any event. It has no price of its own.</li><li>A <strong>tier</strong> (<strong>Tickets → Ticket Tiers</strong>) is a level such as General, VIP or Platinum. Adding a tier to an event creates a group, and the event page lists that group's tickets under the tier's name.</li></ul><p>The rest of selling is set per event, in the event editor's Tickets group: assigned seats (<strong>Seating</strong>), held tickets (<strong>Reserved Seating</strong>), extras (<strong>Offerings</strong> and <strong>Purchasables</strong>), time slots (<strong>Slots</strong>), the tickets card's buttons (<strong>Call to action</strong> and <strong>Ticket Selection</strong>), <strong>Express Lane</strong> and the <strong>Purchase Disclaimer</strong>.</p><p>Discount codes, bundles, early-bird prices, access codes and the other ticket rules are covered in <a href="/help/events/ticket-rules">Discounts & ticket rules</a>. Payment methods, currencies, refunds and invoices are covered in <a href="/help/events/payments">Payments & policies</a>.</p>$html$,
      '[]',
      null,
      20
    ),
    (
      'editing-tickets',
      'Event editor',
      'Editing, ordering and removing tickets',
      $html$<p>The <strong>Tickets</strong> section of the event editor shows each ticket with its price (or Free), how many are available (or Unlimited), its waves from Batched Releases, its ticket type and that type's visibility, and the discount codes it accepts. A ticket with no type shows No Rules Applied.</p><ul><li>Click a ticket, or choose <strong>Edit</strong> in its <strong>⋯</strong> menu, to change it in <strong>Edit ticket</strong>. Changes save when you choose <strong>Save</strong>.</li><li><strong>Move up</strong> and <strong>Move down</strong> change the ticket's place within its group. The event page lists tickets in the same order.</li><li><strong>Delete</strong> removes the ticket straight away, without asking. Orders already placed keep the ticket's name.</li></ul><p>Add at least one ticket before you publish. An event with no tickets shows a stand-in ticket on its event page (General Admission, or Free registration for an online event), and buyers can buy it.</p><p>Under the tickets, <strong>Attach Dietary & Accessibility inquiry</strong> adds the project's dietary and accessibility questions to this event's checkout. It saves straight away when you switch it. You write the questions under <strong>Registrations → Dietary & Accessibility</strong> (see <a href="/help/events/registrations">Registrations</a>).</p>$html$,
      '[]',
      null,
      30
    ),
    (
      'ticket-types',
      'Ticket Types',
      'Ticket types',
      $html$<p>A ticket type is a reusable set of rules and questions for tickets. To create one, choose <strong>Tickets → Ticket Types</strong> in the sidebar, then <strong>New ticket</strong>. Type a <strong>Name</strong> (required) and choose <strong>Create</strong>. The type opens on its edit page, where <strong>Save</strong> keeps your changes. To use it, pick it in a ticket's <strong>Apply ticket type</strong> field in the event editor.</p><p>Checkout applies two parts of a ticket type:</p><ul><li><strong>Visibility</strong>, on the <strong>Visibility & access</strong> tab: Public (the default) or Hidden. Hidden tickets don't appear on the event page or in Express Lane.</li><li><strong>Questions</strong>: asked of each attendee at checkout.</li></ul><p>The other settings save with the type and show in its summary, but checkout doesn't enforce them: the <strong>Sales window</strong> and <strong>Order limits</strong> on <strong>Availability</strong>, the <strong>Refund policy</strong> tab, the Scheduled visibility option, <strong>Access-code gating</strong> and <strong>Reserved seating</strong>. Buyers can request a refund of any paid order from the members portal, whatever the type says. To hide tickets behind a code, use Access Codes in <a href="/help/events/ticket-rules">Discounts & ticket rules</a>. To hold tickets back or sell assigned seats, use the event's <strong>Reserved Seating</strong> and <strong>Seating</strong> sections.</p><p>The list shows each type's name, a summary such as Refundable · Public · 2 questions, and its status. Active and Inactive are for your own sorting: an inactive type still applies to its tickets. Filter by status, search by name, and use each row's <strong>⋯</strong> menu to <strong>Edit</strong>, <strong>Deactivate</strong> or <strong>Activate</strong>, or <strong>Delete</strong>. Events asks you to confirm a delete, and a deleted type stops applying to the tickets that used it.</p>$html$,
      '[]',
      null,
      40
    ),
    (
      'attendee-questions',
      'Ticket Types',
      'Questions for each attendee',
      $html$<p>A ticket type's <strong>Questions</strong> tab holds what checkout asks each attendee before they pay. To add one, open the type in <strong>Tickets → Ticket Types</strong>, choose <strong>Add question</strong>, and fill it in:</p><ul><li><strong>Question label</strong>: the question. Questions start as Untitled question.</li><li><strong>Response type</strong>: Short text (the default), Paragraph, Number, Email, Dropdown or Checkbox. For a dropdown, type its <strong>Options</strong> separated by commas, like <code>Small, Medium, Large</code>.</li><li><strong>Required</strong>: buyers can't continue until it's answered.</li></ul><p>Each question's wording, response type and <strong>Required</strong> switch save as you edit them. Adding questions and reordering them with the ▲ and ▼ arrows take effect when you choose <strong>Save</strong>. The trash icon deletes a question straight away, without asking.</p><p>Checkout asks the questions once per ticket in the order, headed Attendee 1 of 3, Attendee 2 of 3 and so on. Events stores the answers, but no screen in Events shows them.</p>$html$,
      '[]',
      null,
      50
    ),
    (
      'ticket-tiers',
      'Ticket Tiers',
      'Ticket tiers and groups',
      $html$<p>To create a tier, choose <strong>Tickets → Ticket Tiers</strong> in the sidebar, then <strong>New tier</strong>. Type a <strong>Name</strong> (required) and choose <strong>Create</strong>. The tier opens on its edit page:</p><ul><li><strong>Rank</strong>: where the tier sits, from 1. Lower ranks show first, and tiers with the same rank sort by name.</li><li><strong>Accent</strong>: the dot that marks the tier: Slate (the default), Emerald, Amber, Violet or Rose.</li><li><strong>Description</strong>: what the tier includes. It shows under the group's name in the event editor.</li></ul><p>Choose <strong>Save</strong> to keep your changes. The list, its filters and its <strong>⋯</strong> menu work the same way as for ticket types.</p><p>To use a tier on an event, open the event's <strong>Tickets</strong> section, choose <strong>Add Group</strong> and pick the tier. Add tickets with the group's own <strong>Add Ticket</strong>, or move a ticket in with its <strong>Group</strong> field. The event page lists each group that has tickets under its name and accent, by rank, then the ungrouped tickets.</p><p>The trash icon on a group removes it straight away, and its tickets become ungrouped. The event page keeps a tier's name, accent and rank as they were when you added the group, so after changing a tier, remove the group, add it again and move its tickets back. Deleting a tier doesn't remove its groups from events.</p>$html$,
      '[]',
      null,
      60
    ),
    (
      'assigned-seating',
      'Event editor',
      'Selling assigned seats',
      $html$<p>To sell assigned seats, the event needs a venue with a seat map. Set the venue in the event editor's <strong>Location & Time</strong> section. Seat maps are built on the venue (see <a href="/help/events/venues">Venues & sourcing</a>). Then open <strong>Seating</strong>:</p><ol><li>In <strong>Seat map</strong>, pick one of the venue's maps. No seating (general admission) is the default.</li><li>In <strong>How buyers choose</strong>, pick <strong>Map first</strong> (the default), where the section sets the price, or <strong>Ticket and quantity first, then pick seats</strong>.</li><li>In <strong>Section pricing</strong>, map each section to one of the event's tickets. The section sells at that ticket's price. A section left as Not sellable can't be bought.</li><li>Optional: change <strong>Hold seats for</strong>, the minutes a buyer's chosen seats stay held while they check out: 1 to 60, 10 by default.</li></ol><p>Each choice saves as you make it, and <strong>Hold seats for</strong> saves when you leave the field. With <strong>Map first</strong>, buyers pick seats on the map before anything else, all from one section, and the quantity follows the seats. With the other option, buyers choose a ticket and quantity, then pick that many seats in the sections mapped to that ticket. Once a buyer goes to pay, Events holds their seats for 30 minutes.</p><p><strong>Box office</strong> shows every seat as sold, held off sale or open, with counts. Click an open seat to hold it off sale, or a held seat to release it. Sold seats can't be changed there. <strong>Refresh</strong> reloads the map.</p>$html$,
      '[]',
      null,
      70
    ),
    (
      'reserved-seating',
      'Event editor',
      'Reserved seating and held tickets',
      $html$<p>Reserved Seating holds back part of each ticket's quantity from public sale, for guest lists, press or sales you handle yourself. It doesn't use a seat map. To turn it on for an event, open <strong>Ticket Rules</strong> in the event editor and turn on <strong>Reserved seating</strong> (see <a href="/help/events/ticket-rules">Discounts & ticket rules</a>). A <strong>Reserved Seating</strong> section then appears in the event editor's Tickets group.</p><p>The section lists each ticket with its quantity and how many are sold, reserved and available. Type how many to hold in <strong>Reserved</strong>: it saves as you type and can't go over the ticket's quantity. <strong>Note</strong> is optional and saves when you leave the field. Held tickets come off what buyers can buy online, and they count against the event's capacity too. To release them, lower the number.</p><p>In the sidebar, <strong>Tickets → Reserved Seating</strong> lists your events on its <strong>Events</strong> tab, marked Reserved seating or General admission by whether the rule is on. Its other settings (<strong>Enable reserved seating</strong>, <strong>Pick-your-seat</strong>, <strong>Seat hold</strong> and <strong>Default seat map</strong>) save with <strong>Save Changes</strong> but don't change how any event sells. Seat holds and seat maps are set per event in <strong>Seating</strong>.</p>$html$,
      '[]',
      null,
      80
    ),
    (
      'tickets-card-buttons',
      'Event editor',
      'Buttons on the tickets card',
      $html$<p>The tickets card on the event page has a main button whose wording changes on its own: Get Tickets, Register when the selected ticket is free, and Sold out when nothing's left. To change the buttons, open <strong>Call to action</strong> in the event editor. Nothing changes on the page until you choose <strong>Save buttons</strong>.</p><ul><li><strong>Label</strong>, under <strong>Get Tickets button</strong>: your own wording for the main button. Leave it blank for the automatic wording. A sold-out event still shows Sold out.</li><li><strong>Add button</strong>: a button under the main one, with a <strong>Label</strong>, a <strong>Links to</strong> address (a web address, a <code>#section</code> of the page, <code>mailto:</code> or <code>tel:</code>) and a style: Primary, Outline (the default) or Text. A button with no label or an unusable link doesn't show. Web addresses open in a new tab, and these buttons stay clickable when the event sells out. The grip moves a button up one place, and the trash icon removes it.</li></ul><p><strong>Ticket Selection</strong> replaces the main button with two routes: one opens the seating plan, the other lets buyers pick a ticket by price. Open it, turn on <strong>Enable selection modes</strong>, and choose <strong>Save</strong>.</p><ul><li><strong>Routes shown</strong>: Seating plan and by price (the default), Seating plan only, or By price only. The seating-plan route needs a seat map in <strong>Seating</strong>.</li><li><strong>Seat-plan button label</strong> and <strong>By-price button label</strong>: the buttons' wording.</li><li><strong>Feature highlights</strong>: chips for Selection based on plan, Cancellation insurance and Digital ticket. They're labels only: Events doesn't add insurance to orders.</li><li><strong>Booking notes</strong>: numbered footnotes. <strong>Sold out</strong> shows only when the event is sold out.</li></ul><p>With <strong>Map first</strong> seating, the by-price route sells a ticket without a seat, and Events doesn't assign one. The default <strong>Automatic seat assignment</strong> note says otherwise, so rewrite or clear it.</p>$html$,
      '[]',
      null,
      90
    ),
    (
      'offerings',
      'Event editor',
      'Offerings',
      $html$<p>Offerings are choices or extras buyers pick on the checkout's details step, such as a meal preference. To add one, open <strong>Offerings</strong> in the event editor and choose <strong>Add offering</strong>:</p><ul><li><strong>Name</strong>: required. <strong>Description</strong> is optional.</li><li><strong>Selection</strong>: Single choice (radio), the default, or Multiple choice (checkbox). Turn on <strong>Require a choice</strong> to make buyers pick one of a single choice's options.</li><li><strong>Offered with</strong>: All tickets (the default) or the tickets you pick. Tickets are matched by name, so after renaming a ticket, pick it again.</li><li><strong>Options</strong>: at least one, each with a label and a price. Leave the price at 0 for a free option.</li></ul><p>Choose <strong>Add offering</strong> to save it. On each offering, the switch turns it off and on, the arrows reorder it, the pencil edits it, and the trash icon deletes it after you confirm. Each change saves straight away.</p><p>An option's price is charged once per ticket in the order. While the event has any purchasable turned on, checkout shows purchasables instead of offerings.</p>$html$,
      '[]',
      null,
      100
    ),
    (
      'purchasables',
      'Event editor',
      'Purchasables',
      $html$<p>Purchasables are add-ons checkout offers on an <strong>Add-ons</strong> step after the buyer's details, each shown only when its conditions match. To add one, open <strong>Purchasables</strong> in the event editor and choose <strong>Add purchasable</strong>. Only <strong>Name</strong> is required, and <strong>Price</strong> starts at 0, which makes it free.</p><ul><li><strong>Allow buying multiple</strong>: gives buyers a quantity stepper, up to <strong>Max quantity per item</strong> (blank for no limit). Off, buyers tick it once.</li><li><strong>Required to check out</strong>: buyers can't continue without it when it's shown.</li><li><strong>Available</strong>: turn it off to hide the add-on without deleting it.</li><li><strong>Conditions</strong>: with none on, everyone sees it. Turn on any of <strong>Time band</strong>, <strong>Specific slots</strong>, <strong>Ticket types</strong> (the event's tickets), <strong>Tickets in cart</strong> (a minimum and maximum), <strong>Cut-off before the slot</strong>, <strong>Requires another add-on</strong> and <strong>Excludes another add-on</strong>, then choose <strong>Match all</strong> (the default) or <strong>Match any</strong>.</li></ul><p>Choose <strong>Add purchasable</strong> to save it. The switch, arrows, pencil and trash icon on each one work as they do for offerings. Prices are charged once per ticket in the order: two tickets with a $10 add-on add $20. Time band, slot and cut-off conditions match only once the buyer picks a slot. Checkout doesn't recognize members, so an add-on with <strong>Members only</strong> on never shows.</p>$html$,
      '[]',
      null,
      110
    ),
    (
      'time-slots',
      'Event editor',
      'Time slots',
      $html$<p>Slots let buyers book a time, such as an evening seating, as part of checkout. To set them up, open <strong>Slots</strong> in the event editor and turn on <strong>Allow slot booking</strong>, which saves straight away. <strong>Picker label</strong> is the heading buyers see (Choose your time to start with), and <strong>Require a slot to check out</strong> is on by default.</p><p>Choose <strong>Add slot</strong>. A <strong>Name</strong> and a start time are required.</p><ul><li><strong>Starts</strong> and <strong>Ends</strong>: the date and time. The end is optional.</li><li><strong>Time band</strong>: Morning, Afternoon, Evening or Night, set from the start time unless you pick one. Purchasables can use it as a condition.</li><li><strong>Capacity</strong>: how many tickets the slot takes. 0 means unlimited.</li><li><strong>Price adjustment</strong>: added to each ticket's price for this slot.</li><li><strong>Location</strong>: an optional room or area.</li><li><strong>Booking cutoff</strong>: how many hours before the start booking closes. Blank means it doesn't close.</li><li><strong>Bookable with</strong>: All tickets, or the tickets you pick.</li><li><strong>Slot available</strong>: turn it off to hide the slot.</li></ul><p>Choose <strong>Add slot</strong> to save it. Each slot shows its time, location, time band and how many are booked against its capacity, and its switch, arrows, pencil and trash icon work as they do for offerings. At checkout, a slot shows how many places are left once 10 or fewer remain, and Full or Closed when it can't be booked.</p><p>Leave <strong>Offer a waitlist when full</strong> off: it keeps a full slot selectable, but Events can't complete an order for a full slot. <strong>Max per order</strong> isn't applied at checkout.</p>$html$,
      '[]',
      null,
      120
    ),
    (
      'express-lane',
      'Event editor',
      'Express Lane',
      $html$<p>Express Lane is a two-click checkout: buyers pick a ticket, choose <strong>Pay</strong>, and give their email and card to Stripe. To turn it on, open <strong>Express Lane</strong> in the event editor, turn on <strong>Enable Express Lane</strong>, and choose <strong>Save</strong>.</p><p>Express Lane runs only when checkout needs nothing typed in. <strong>Readiness</strong> lists anything in the way, with <strong>Fix</strong> to open the section concerned: online payments turned off, a seat map in <strong>Seating</strong>, an exhibitor floor, registrations that need approval, a required slot, a required offering or purchasable, or a required registration question. Only paid tickets that aren't sold out go express. If the chosen ticket has required attendee questions, choosing <strong>Pay</strong> moves the buyer to the full checkout.</p><ul><li><strong>Placement</strong>: Extra button under Get Tickets (the default), labeled with <strong>Button label</strong>, or Get Tickets opens Express Lane.</li><li><strong>Tagline</strong>: the line at the top of the express screen.</li><li><strong>Pre-selected ticket</strong>: Whichever is selected on the page (the default), or a ticket you pick.</li><li><strong>Let buyers switch ticket</strong>, <strong>Let buyers change quantity</strong>, <strong>Ask for the buyer's name on Stripe</strong>, <strong>Pre-fill signed-in buyers</strong> and <strong>Offer the full checkout</strong>: all on by default. <strong>Most tickets per order</strong> starts at 6.</li></ul><p>A purchase disclaimer with a tick-box adds a third click. <strong>Preview</strong> shows the express screen as buyers see it.</p>$html$,
      '[]',
      null,
      130
    ),
    (
      'purchase-disclaimer',
      'Event editor',
      'Purchase disclaimer',
      $html$<p>A purchase disclaimer is text buyers accept before they pay, such as your terms of sale. To add one, open <strong>Purchase Disclaimer</strong> in the event editor, turn on <strong>Ask buyers to acknowledge before buying</strong>, write the <strong>Disclaimer</strong>, and choose <strong>Save Disclaimer</strong>. An empty disclaimer never shows.</p><ul><li><strong>Require a tick-box</strong>: on by default. Buyers tick the box, worded by <strong>Tick-box label</strong>, to continue. Off, choosing the <strong>Pay button</strong> (Agree & continue) counts as acceptance.</li><li><strong>Applies to</strong>: every order (the default), including free orders and approval requests, or <strong>Paid orders only</strong>.</li><li><strong>Heading</strong>: Before you buy, unless you change it. Each line of the disclaimer becomes its own paragraph.</li></ul><p>The disclaimer shows on a final <strong>Review</strong> step next to the order summary, and the button that finishes the order stays off until it's accepted. In Express Lane it shows over <strong>Pay</strong>. <strong>Preview</strong> shows what buyers see. For fine print that doesn't need accepting, use the event editor's <strong>Disclaimer</strong> section instead (see <a href="/help/events/event-page">Event page</a>).</p>$html$,
      '[]',
      null,
      140
    ),
    (
      'how-buyers-check-out',
      'Checkout',
      'How buyers check out',
      $html$<p>Buyers pick a ticket on the event page's tickets card and choose its main button, which opens checkout. The card lists each ticket with its price (or Free), grouped by tier, and how many tickets remain unless <strong>Show tickets remaining</strong> is off in the event's <strong>Registration Settings</strong>.</p><p>Checkout runs in steps, each one only when the event needs it:</p><ol><li><strong>Seats</strong>: with <strong>Map first</strong> seating, buyers pick seats before anything else. With an exhibitor floor, they pick a booth instead (see <a href="/help/events/sponsors">Sponsors & Expo</a>).</li><li><strong>Details</strong>: the quantity, a time slot, offerings, a donation and a discount code, then the buyer's name and email, registration questions, the dietary and accessibility inquiry, and the ticket type's questions for each attendee.</li><li><strong>Seats</strong>: with <strong>Ticket and quantity first</strong> seating, buyers pick that many seats.</li><li><strong>Add-ons</strong>: the purchasables whose conditions match.</li><li><strong>Review</strong>: the order summary and your purchase disclaimer.</li><li><strong>Payment</strong>: paid orders go to Stripe. A free order ends with <strong>Complete registration</strong>, and an event that needs approval ends with <strong>Request to register</strong>.</li></ol><p>A buyer can take up to 10 tickets in one order, or fewer when fewer are left. Group orders can go higher (see <a href="/help/events/ticket-rules">Discounts & ticket rules</a>).</p>$html$,
      '[]',
      null,
      150
    ),
    (
      'payment-and-ticket-emails',
      'Checkout',
      'Payment and ticket emails',
      $html$<p>Paid orders are charged on Stripe's checkout page, in the currency set in the event's payment settings (see <a href="/help/events/payments">Payments & policies</a>). If online payments are turned off for the event, buyers can't complete a paid order. A buyer who backs out of Stripe returns to the event page and isn't charged.</p><p>Once Stripe confirms the payment, Events records the order (see <a href="/help/events/orders">Orders</a>) and emails the buyer their tickets: the order number, an entry QR code, the ticket and the total paid. The QR code holds the order number, which check-in scans (see <a href="/help/events/check-in">Check-in</a>).</p><p>The confirmation screen shows whether the email went out. Buyers can choose <strong>Resend</strong> once a minute, and Events stops after five sends. The email is the <strong>Purchase confirmation</strong> notification under <strong>Settings → Notifications</strong> (see <a href="/help/events/settings">Settings</a>). With it off, the confirmation screen tells buyers the event doesn't email tickets.</p><p>Free orders and approval requests get no ticket email. Attendees see every order made with their email in the members portal (see <a href="/help/events/members-portal#signing-in">Signing in</a>).</p>$html$,
      '[]',
      null,
      160
    ),
    (
      'ticket-changes-not-showing',
      'Troubleshooting',
      'Ticket changes don''t show in other sections',
      $html$<p>You add or change tickets, and then another section of the event editor (<strong>Seating</strong>, <strong>Reserved Seating</strong>, <strong>Offerings</strong>, <strong>Slots</strong>, <strong>Purchasables</strong>, <strong>Batched Releases</strong> or <strong>Express Lane</strong>) doesn't list them, or <strong>Tickets</strong> shows the old list when you come back to it.</p><p>The event editor works from the copy of the event it loaded when you opened the event, and changes in the <strong>Tickets</strong> section don't update that copy. Your changes are saved, but changing tickets from the old list saves that list over them.</p><ol><li>After you change tickets, reload the page in your browser.</li><li>The event editor opens on the same section, with your saved tickets.</li></ol>$html$,
      '[]',
      null,
      170
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"CalendarDays","label":"Events","href":"/help/events/events"},{"icon":"Percent","label":"Discounts & ticket rules","href":"/help/events/ticket-rules"},{"icon":"CreditCard","label":"Payments & policies","href":"/help/events/payments"},{"icon":"ShoppingBag","label":"Orders","href":"/help/events/orders"},{"icon":"MapPin","label":"Venues & sourcing","href":"/help/events/venues"},{"icon":"ScanLine","label":"Check-in","href":"/help/events/check-in"}]',
      null,
      180
    )
) as v(anchor_id, eyebrow, title, content, links, showcase, sort_order)
cross join (select id from public.docs_pages where slug = 'events/tickets' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Tickets',
    description = 'Create ticket types and tiers, add them to events, and set up seating, slots and add-ons.',
    status = 'draft',
    published_at = null
where slug = 'events/tickets' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'events/tickets' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Ticket types</li><li>Ticket tiers</li><li>Adding tickets to an event</li><li>Seating and reserved seating</li><li>Slots and purchasables</li><li>Checkout settings</li></ul>',
  10
from public.docs_pages p
where p.slug = 'events/tickets' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
