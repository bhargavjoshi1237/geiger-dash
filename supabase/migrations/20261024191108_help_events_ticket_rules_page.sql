-- Help events ticket rules page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the events/ticket-rules draft outline from
-- 20261024191100_help_events_structure with the full Discounts & ticket rules guide and publishes it.
-- Written from a survey of C:\Pro\geiger-events (components/internal/sidebar/sidebar_nav.jsx,
-- components/internal/screens/registry.jsx, components/internal/screens/tickets/{discounts,records_kit,
-- discount_rule_editor,discount_code_picker,constants,event_ticket_rules,event_tickets,release_editor,releases,bundles,
-- earlybird,donations,access_codes,group_purchasing,dynamic_pricing,anti_scalping,event_policies,settings_kit}.jsx,
-- components/internal/screens/events/{event_sections.js,event_detail.jsx,event_earlybird.jsx,event_donation.jsx,
-- event_access_codes.jsx,event_group.jsx,event_bundles.jsx,event_releases.jsx,event_discounts.jsx},
-- components/internal/shared/{editor_shell,pagination}.jsx, components/internal/screens/events/public_page/{use_page_data.js,
-- sidebar_cards.jsx,page_content.jsx,layouts/luma.jsx,checkout/*}, lib/events/{discount_rules,earlybird,donation,group,
-- access_codes,bundles,ticket_releases,express_checkout,use-event-config}.js, lib/supabase/{ticketing,discounts,orders,
-- group_purchases}.js, app/api/checkout/route.js, lib/stripe/fulfill-checkout.js, supabase/migrations/
-- {20260726194138_ticketing_addons,20260830120000_ticket_discount_rules,20260904090000_ticket_releases}.sql).
-- Left out because nothing applies them at checkout: Dynamic Pricing and Anti-scalping & Resale rules, records on the
-- Tickets > Bundles screen, the Group rule / Early-bird rule / Affiliate code discount types, coupon Usage Limit, donation
-- Minimum and Require a donation, group Require approval, and the project-level switches and defaults on Early-bird Sales,
-- Donations, Access-code Tickets and Group Purchasing.
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set description = 'Create discount codes for your tickets, then set up early-bird pricing, donations, access codes, group orders, bundles and batched releases per event.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'events/ticket-rules' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'events/ticket-rules' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, showcase, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.showcase, v.sort_order
from (
  values
    (
      'creating-a-discount-code',
      'Basics',
      'Creating a discount code',
      $html$<p>A discount code is a coupon buyers type at checkout to lower their order's total. To create one, choose <strong>Tickets → Discounts & Codes</strong> in the sidebar, then <strong>New discount</strong>. Type a <strong>Name</strong>, keep <strong>Coupon</strong> as the <strong>Type</strong>, and choose <strong>Create</strong>. Checkout only accepts coupons, so use that type for every code. The coupon's edit page opens.</p><ul><li><strong>Code</strong>: what buyers type, like <code>SAVE10</code>. Checkout ignores letter case. A coupon with no code can't be redeemed.</li><li><strong>Base discount</strong>: <strong>% off</strong> or <strong>$ off</strong>, and the amount. New coupons start at 10% off. A percentage comes off the order's tickets, at their early-bird price when there is one, plus their add-ons.</li><li><strong>Flat applies</strong>: for <strong>$ off</strong> only. <strong>Once per order</strong> (the default) takes the amount off once, and <strong>Per ticket</strong> takes it off for each ticket.</li><li><strong>Max discount</strong>: the most the code takes off one order. Leave it blank for no cap.</li></ul><p>No discount takes off more than the tickets and add-ons cost. The switch at the top of the edit page marks the coupon <strong>Active</strong> or <strong>Inactive</strong>, and checkout refuses inactive codes. Nothing on the edit page is kept until you choose <strong>Save</strong>. A coupon works only once you tick it onto tickets in the <strong>Tickets</strong> section of each event's editor.</p><p>By default, <strong>Tickets</strong> appears in the sidebar for the Owner, Admin and Manager roles. To change who sees it, see <a href="/help/events/settings#roles-and-permissions">Roles and permissions</a>.</p>$html$,
      '[]',
      null,
      10
    ),
    (
      'codes-and-ticket-rules',
      'Concepts',
      'How codes and ticket rules fit together',
      $html$<p>Discount codes and ticket rules are set up in different places, and checkout combines them in a fixed order.</p><ul><li><strong>Discount codes</strong> belong to the project. You create a code once under <strong>Tickets → Discounts & Codes</strong>, then tick it onto each ticket that accepts it, in any event. A code never works on a ticket it isn't ticked onto.</li><li><strong>Ticket rules</strong> belong to one event. In the event editor, open <strong>Ticket Rules</strong> and turn on early-bird pricing, donations, access-code tickets, group purchasing or bundles. Each feature you turn on gets a section of the event editor, where you set it up for that event only.</li><li><strong>Batched releases</strong> belong to one event too. The <strong>Batched Releases</strong> section is always in the event editor, under Tickets.</li></ul><p>At checkout, early-bird pricing lowers each ticket's price first. A discount code then comes off that price plus add-ons, and a group discount comes off the tickets alone. A donation is added last, and no discount reduces it. A buyer can apply one code per order. Bundles take none of these: no early-bird price, code, group discount or donation.</p><p>When the discounts bring an order's total to zero, the buyer confirms it without a payment step.</p>$html$,
      '[]',
      null,
      20
    ),
    (
      'eligibility-and-discount-rules',
      'Discounts & Codes',
      'Eligibility and discount rules',
      $html$<p>Two cards on a coupon's edit page decide when the code works and how much it gives. Open the coupon from <strong>Tickets → Discounts & Codes</strong>, and choose <strong>Save</strong> when you're done.</p><p><strong>Eligibility</strong> sets when the code works at all. When an order fails one of these, checkout refuses the code rather than giving a smaller discount.</p><ul><li><strong>Min. tickets</strong> and <strong>Max. tickets</strong>: how many tickets the order needs. Blank means no limit.</li><li><strong>Valid from</strong> and <strong>Valid until</strong>: when the code starts and stops working. Blank means it works straight away and never expires.</li></ul><p><strong>Discount Rules</strong> change the amount by quantity or date. Choose <strong>Add rule</strong>, or <strong>Start from a preset</strong> for a filled-in rule: <strong>Buy 3 or more</strong> gives 15% off from 3 tickets, <strong>Buy 5 or more</strong> 25% off from 5, <strong>Big spender (10+)</strong> 30% off from 10, and <strong>Last 7 days before the event</strong> 20% off. That last preset comes without dates, so set them yourself.</p><ul><li>Each rule has a name, <strong>Min. tickets</strong>, <strong>Max. tickets</strong>, <strong>Valid from</strong>, <strong>Valid until</strong> and its own <strong>Discount</strong>. A <strong>$ off</strong> rule is taken <strong>Per order</strong> or <strong>Per ticket</strong>.</li><li>Checkout reads the rules from the top and uses the first one that matches the order. When none matches, the base discount applies, so a rule never refuses a code.</li><li>Drag a rule, or use its arrows, to change the order, and put the most specific rule first. The trash icon deletes a rule.</li></ul><p>When a buyer changes the quantity after applying a code, checkout checks the code again, so a different rule can apply, or the code can be refused.</p>$html$,
      '[]',
      null,
      30
    ),
    (
      'discount-list',
      'Discounts & Codes',
      'The discount list',
      $html$<p><strong>Tickets → Discounts & Codes</strong> lists the project's discounts, newest first, with each one's type, a summary of its code and amount, and its status. Filter by status (<strong>All Statuses</strong>, <strong>Active</strong> or <strong>Inactive</strong>) or by type, or search by name. The list shows 25 discounts a page; choose 10, 50 or 100 at the bottom.</p><p>Click a discount to open its edit page. Each row's <strong>⋯</strong> menu has <strong>Edit</strong>, <strong>Deactivate</strong> (<strong>Activate</strong> for an inactive one) and <strong>Delete</strong>.</p><ul><li><strong>Deactivate</strong> and <strong>Activate</strong> save straight away. Checkout refuses an inactive code on every ticket it's ticked onto, until you activate it again.</li><li><strong>Delete</strong> asks you to confirm first. The code stops working on every event, and Events can't restore it.</li></ul>$html$,
      '[]',
      null,
      40
    ),
    (
      'adding-codes-to-tickets',
      'Event editor',
      'Adding codes to tickets',
      $html$<p>To let buyers use a discount code on a ticket, open the event in the event editor and open <strong>Tickets</strong>. In the ticket's <strong>⋯</strong> menu, choose <strong>Edit</strong>, tick the codes under <strong>Discount codes</strong>, and choose <strong>Save</strong>. The list shows every coupon in the project with its code and amount, and marks inactive ones <strong>Off</strong>. <strong>Clear</strong> unticks them all.</p><p>Codes are set per ticket, so one ticket can accept several codes while another on the same event accepts none. The ticked codes show on the ticket in the <strong>Tickets</strong> section. For the ticket's other settings, see <a href="/help/events/tickets#adding-tickets-to-an-event">Adding tickets to an event</a>.</p><p>At checkout, a ticket that accepts at least one code shows a <strong>Discount code</strong> box. The buyer types the code and chooses <strong>Apply</strong>, or presses <code>Enter</code>. An accepted code shows as applied, with <strong>Remove</strong> beside it, and the total gains a <strong>Discount</strong> line naming the code. There's no code box on a ticket with no codes, on a bundle, or in Express Lane.</p>$html$,
      '[]',
      null,
      50
    ),
    (
      'turning-on-ticket-rules',
      'Event editor',
      'Turning on ticket rules',
      $html$<p>Ticket rules are checkout features you turn on for one event. In the event editor, open <strong>Ticket Rules</strong> and turn on the switch for each feature the event uses. Each switch saves straight away and changes only this event.</p><ul><li><strong>Early-bird pricing</strong>: a lower price while a window is open. Adds the <strong>Early-bird</strong> section.</li><li><strong>Donations</strong>: a gift buyers can add at checkout. Adds the <strong>Donations</strong> section.</li><li><strong>Access-code tickets</strong>: tickets hidden until a buyer enters a code. Adds the <strong>Access Codes</strong> section.</li><li><strong>Reserved seating</strong>: a block of tickets held back from public sale. Adds the <strong>Reserved Seating</strong> section, covered in <a href="/help/events/tickets">Tickets</a>.</li><li><strong>Group purchasing</strong>: one order for several attendees, at a group discount. Adds the <strong>Group Orders</strong> section.</li><li><strong>Bundles</strong>: several tickets sold together. Its section opens only from <strong>Configure</strong>.</li><li><strong>Batched releases</strong>: the <strong>Batched Releases</strong> section is always in the event editor, and waves work whether this switch is on or off.</li></ul><p>Once a feature is on, choose <strong>Configure</strong> beside it to open its section. The section joins the event editor's list, under Tickets, once you reload the page.</p><p>Turning a feature off stops it at checkout and keeps its settings for when you turn it back on. Turning off <strong>Access-code tickets</strong> shows the event's hidden tickets to everyone.</p>$html$,
      '[]',
      null,
      60
    ),
    (
      'early-bird-pricing',
      'Event editor',
      'Early-bird pricing',
      $html$<p>Early-bird pricing takes an amount off every ticket on an event while its window is open. In the event editor, turn on <strong>Early-bird pricing</strong> in <strong>Ticket Rules</strong>, then open <strong>Early-bird</strong>. Choices save as you make them, and number and text fields save when you click away.</p><ul><li><strong>Discount type</strong>: <strong>Percent off</strong> (the default) or <strong>Flat amount</strong>.</li><li><strong>Discount %</strong> or <strong>Amount off</strong>: how much comes off each ticket's price. It never takes more than the price itself.</li><li><strong>Starts</strong> and <strong>Ends</strong>: the date and time the window opens and closes. Leave either blank to keep that end open.</li><li><strong>Note</strong>: for your team. Buyers don't see it.</li></ul><p>The section starts at 15% off with no start or end, so turning on early-bird pricing discounts every ticket straight away, until you set <strong>Ends</strong> or turn it off.</p><p>The event page keeps showing each ticket's full price. At checkout, the total shows the saving as an <strong>Early bird</strong> line, such as <code>Early bird (15% off)</code>. Early-bird pricing doesn't apply to bundles, and a discount code or group discount comes off the early-bird price.</p>$html$,
      '[]',
      null,
      70
    ),
    (
      'donations',
      'Event editor',
      'Donations at checkout',
      $html$<p>Donations add an optional gift to an order at checkout. In the event editor, turn on <strong>Donations</strong> in <strong>Ticket Rules</strong>, then open <strong>Donations</strong>. Switches save straight away, and text fields save when you click away.</p><ul><li><strong>Allow custom amount</strong>: on by default. Adds a box where buyers type their own amount.</li><li><strong>Cause</strong>: what the donations support, like <code>Community scholarship fund</code>.</li><li><strong>Suggested amounts</strong>: the amounts buyers pick with one click, separated by commas. They start as 5, 10 and 25.</li><li><strong>Prompt</strong>: the heading over the amounts. With no prompt, buyers see Support followed by the cause, or Add a donation when there's no cause either.</li></ul><p>At checkout, the buyer clicks an amount (clicking it again clears it) or types one in the <strong>Other</strong> box. The donation is added once per order, whatever the quantity, and shows as a <strong>Donation</strong> line in the total. Discount codes and group discounts don't reduce it. Events records the donation and its cause with the order. Bundles don't offer a donation.</p>$html$,
      '[]',
      null,
      80
    ),
    (
      'access-codes',
      'Event editor',
      'Hiding tickets behind an access code',
      $html$<p>An access code hides chosen tickets from the event page until a buyer enters the code, for guest lists and invite-only tickets. In the event editor, turn on <strong>Access-code tickets</strong> in <strong>Ticket Rules</strong>, then open <strong>Access Codes</strong> and choose <strong>Add code</strong>.</p><ul><li><strong>Code</strong>: what buyers type, like <code>VIP2026</code>. It's required. Letter case and spaces at either end don't matter.</li><li><strong>Label</strong>: an optional note for your team.</li><li><strong>Unlocks these tickets</strong>: click each ticket the code reveals. Add the tickets in the <strong>Tickets</strong> section first.</li></ul><p>Choose <strong>Add code</strong> to save it. The pencil edits a code, and the trash icon deletes it after you confirm; a deleted code can't be restored. One code can reveal several tickets, and a ticket stays hidden while any code lists it. Deleting a ticket's last code shows that ticket to everyone, and so does turning off <strong>Access-code tickets</strong>.</p><p>When an event has hidden tickets, its ticket list on the event page shows a <strong>Have an access code?</strong> box with an <strong>Unlock</strong> button. A right code adds its tickets to the list until the buyer reloads or leaves the page. A wrong one shows <strong>That code isn't valid for this event</strong>. Events checks the code again when the order is placed.</p>$html$,
      '[]',
      null,
      90
    ),
    (
      'group-orders',
      'Event editor',
      'Group orders',
      $html$<p>Group purchasing lets one buyer order tickets for several attendees in one payment, at a group discount. In the event editor, turn on <strong>Group purchasing</strong> in <strong>Ticket Rules</strong>, then open <strong>Group Orders</strong>. Number fields save when you click away, and ticket choices save as you click them.</p><ul><li><strong>Minimum seats</strong>: the quantity at which an order becomes a group order. It starts at 5.</li><li><strong>Maximum seats</strong>: the most tickets one order can hold. 0, the default, allows up to 50.</li><li><strong>Group discount %</strong>: what comes off the tickets in a group order. It starts at 10%.</li><li><strong>Eligible tickets</strong>: <strong>All tickets</strong> (the default), or click the tickets that can be bought as a group.</li></ul><p>Without group purchasing, one order holds up to 10 tickets. With it on, an eligible ticket's quantity goes up to <strong>Maximum seats</strong>. Once the quantity reaches <strong>Minimum seats</strong>, checkout asks who the tickets are for, with a name and a valid email for each attendee. The group discount comes off the tickets at their early-bird price, if any, and shows as a <strong>Group discount</strong> line. Add-ons and donations aren't discounted, and a discount code still applies on top.</p><p>Events records a separate order for each attendee under their email, so each one finds their own ticket in the <a href="/help/events/members-portal">Members portal</a>. Bundles can't be bought as a group.</p>$html$,
      '[]',
      null,
      100
    ),
    (
      'bundles',
      'Event editor',
      'Selling bundles',
      $html$<p>A bundle sells several of an event's tickets together as one purchase, such as a weekend pass. In the event editor, turn on <strong>Bundles</strong> in <strong>Ticket Rules</strong> and choose <strong>Configure</strong> beside it. That's the only way into the Bundles section, which isn't in the event editor's list. Then choose <strong>Add bundle</strong>.</p><ul><li><strong>Bundle name</strong>: required.</li><li><strong>Description</strong>: shown to buyers under the bundle's name. With none, buyers see how many tickets it holds.</li><li><strong>Bundle items</strong>: choose <strong>Add Item</strong>, then pick a <strong>Ticket</strong> and its <strong>Qty</strong>. A bundle lists each ticket once.</li><li><strong>Pricing</strong>: <strong>Fixed price</strong> (the default) with a <strong>Bundle price</strong>, or <strong>Sum of items</strong>, which adds up the tickets' listed prices.</li><li><strong>Bundle available</strong>: on by default. Turn it off to stop selling the bundle without deleting it.</li></ul><p>Choose <strong>Add bundle</strong> to save it. Each bundle in the list has its own available switch, a pencil to edit it, and a trash icon that deletes it straight away, without asking.</p><p>On the event page, each available bundle with at least one item appears in the ticket list with its price. Buying one uses up stock of every ticket in it, so the order fails when any of those tickets has no room left. Bundles get no early-bird price, discount code, group discount or donation. Bundles made under <strong>Tickets → Bundles</strong> in the sidebar aren't attached to events, so build the bundles you sell in the event editor.</p>$html$,
      '[]',
      null,
      110
    ),
    (
      'splitting-into-waves',
      'Event editor',
      'Splitting a ticket into waves',
      $html$<p>Batched releases split one ticket's stock into waves that go on sale in order, such as 100 tickets at first and 100 more once those sell out. In the event editor, open <strong>Batched Releases</strong>, under Tickets. It lists the event's tickets: choose <strong>Split into waves</strong> on one.</p><ul><li>For a ticket with a set quantity, type the <strong>Tickets in wave 1</strong>, and wave 2 gets the rest. For an unlimited ticket, type a size for each wave.</li><li>Under <strong>When does wave 2 open?</strong>, choose <strong>After wave 1 sells out</strong> (the default), <strong>On a specific date</strong> or <strong>When I say so</strong>.</li><li>After a sell-out, <strong>Wait after the sell-out</strong> sets how many days to wait. 0 opens wave 2 straight away.</li><li>On a date, <strong>Wave 2 opens on</strong> takes the date and time.</li></ul><p>Choose <strong>Start selling in waves</strong>. The waves save straight away, and the ticket's quantity becomes the total of its waves. To add more waves or change them, choose <strong>Edit waves</strong> on the ticket.</p><p>When the event has more than one ticket, <strong>Apply to multiple tickets at once</strong> splits every ticket without waves into two halves, with wave 2 opening after wave 1 sells out. The starting size of each wave for unlimited tickets, and the starting wait, come from the <strong>Defaults</strong> on <strong>Tickets → Batched Releases</strong> in the sidebar: 100 tickets and 0 days unless you change them. When <strong>Enable batched releases</strong> is off there, the section shows a warning, but the waves you save still apply at checkout.</p>$html$,
      '[]',
      null,
      120
    ),
    (
      'editing-waves',
      'Event editor',
      'Editing waves',
      $html$<p>To change a ticket's waves, open <strong>Batched Releases</strong> in the event editor and choose <strong>Edit waves</strong> on the ticket. Each wave has a name, a number of tickets, and a gate that decides when it opens:</p><ul><li><strong>On Sale now</strong>: open straight away. Wave 1 starts with it.</li><li><strong>After wave 1 sells out</strong>, numbered for the wave before it: opens once that wave sells out, after the number of days you set.</li><li><strong>On a date</strong>: opens at <strong>Opens on</strong>, and closes at <strong>Closes (optional)</strong> when you set one.</li><li><strong>I'll open it</strong>: hidden until you turn on its switch, and hidden again when you turn it off.</li></ul><p>Each wave also has <strong>Open now</strong>, for a wave that's still waiting, <strong>Pause</strong> and <strong>Resume</strong>, which hide it from buyers for a while, arrows to sell it earlier or later, and a trash icon. <strong>Add another wave</strong> adds 50 tickets that open once the last wave sells out.</p><p>Edits wait, marked <strong>Unsaved edits</strong>, until you choose <strong>Save waves</strong>, and <strong>Discard</strong> drops them. Every wave needs at least 1 ticket, and every dated wave needs its date. Saving sets the ticket's quantity to the total of its waves.</p><p><strong>Remove waves</strong> turns the ticket back into one pool: choose it twice to confirm. <strong>Copy to other tickets</strong> gives the tickets you tick the same waves, replacing theirs. <strong>Apply to multiple tickets at once</strong> copies one ticket's waves, or removes waves, across several tickets.</p>$html$,
      '[]',
      null,
      130
    ),
    (
      'how-waves-go-on-sale',
      'Event page',
      'How waves go on sale',
      $html$<p>Waves sell in order. Every sale of a ticket counts against wave 1 until it's sold out, then against wave 2, and so on. Buyers can buy only from waves that are open, so the quantity they can choose stops at what's left in the open waves.</p><p>On the event page, a ticket with waves shows a line under its name: which wave is on sale and how many are left in it, when the next wave opens, or that all waves have sold out. While nothing is left in its open waves, the ticket shows Paused in place of its price and can't be bought.</p><p>Events checks the waves again when an order is placed and refuses an order the open waves can't cover. For a paid ticket, checkout tells the buyer the wave is sold out, with the next wave's opening date when it has one, before they pay.</p><p>In the event editor's <strong>Batched Releases</strong> section, each wave shows its status: On Sale, Opens with a date, Waits for the wave before it, Not opened yet, Paused, Closed or Sold out. The figures at the top count the event's tickets in waves, the tickets waiting for later waves and the tickets sold so far.</p>$html$,
      '[]',
      null,
      140
    ),
    (
      'discount-code-refused',
      'Troubleshooting',
      'A buyer''s discount code is refused',
      $html$<p>When checkout refuses a discount code, the buyer sees a message that names the reason.</p><ul><li><strong>That code isn't valid</strong>: no active coupon with that code is ticked onto this ticket. The coupon is inactive or deleted, the code is misspelled, or the coupon isn't ticked onto the ticket the buyer chose.</li><li><strong>This code isn't active yet</strong>: it's before the coupon's <strong>Valid from</strong>.</li><li><strong>This code has expired</strong>: it's after <strong>Valid until</strong>.</li><li><strong>This code needs a larger quantity</strong>: the order has fewer tickets than <strong>Min. tickets</strong>.</li><li><strong>This code can't be used on this many tickets</strong>: the order has more than <strong>Max. tickets</strong>.</li></ul><p>To fix it:</p><ol><li>Choose <strong>Tickets → Discounts & Codes</strong> in the sidebar and open the coupon.</li><li>Check its <strong>Code</strong>, the <strong>Active</strong> switch and its <strong>Eligibility</strong>, then choose <strong>Save</strong>.</li><li>In the event editor's <strong>Tickets</strong> section, open the ticket with <strong>Edit</strong> and check the coupon is ticked under <strong>Discount codes</strong>.</li></ol>$html$,
      '[]',
      null,
      150
    ),
    (
      'saved-change-looks-undone',
      'Troubleshooting',
      'A saved change looks undone in the event editor',
      $html$<p>You turn on a feature in <strong>Ticket Rules</strong>, or add or change a ticket in <strong>Tickets</strong>, and another part of the same event doesn't show it. The feature's section is missing from the event editor's list, or the switch shows as off when you come back to <strong>Ticket Rules</strong>, or a ticket is missing from <strong>Access Codes</strong>, <strong>Group Orders</strong>, <strong>Bundles</strong> or <strong>Batched Releases</strong>.</p><p>Each of these sections saves your change straight away, but the rest of the event editor keeps the event as it was when you opened it, until the page reloads. Going back to <strong>All Events</strong> and opening the event again doesn't refresh it. Saving in a section that still shows the old version writes the old version back, so a switch you turned on can turn off again, and edits to tickets or waves can be lost.</p><ol><li>Reload the page in your browser. The event editor reopens on the same event and section.</li><li>Check that your earlier change is there, and redo it if it isn't.</li><li>From then on, reload after each change in <strong>Ticket Rules</strong>, <strong>Tickets</strong> or <strong>Batched Releases</strong> before you save in another of those sections.</li></ol>$html$,
      '[]',
      null,
      160
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"Ticket","label":"Tickets","href":"/help/events/tickets"},{"icon":"CreditCard","label":"Payments & policies","href":"/help/events/payments"},{"icon":"ShoppingBag","label":"Orders","href":"/help/events/orders"},{"icon":"CalendarDays","label":"Events","href":"/help/events/events"},{"icon":"LayoutTemplate","label":"Event page","href":"/help/events/event-page"},{"icon":"CircleUser","label":"Members portal","href":"/help/events/members-portal"}]',
      null,
      170
    )
) as v(anchor_id, eyebrow, title, content, links, showcase, sort_order)
cross join (select id from public.docs_pages where slug = 'events/ticket-rules' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Discounts & ticket rules',
    description = 'Set up discount codes, bundles, early-bird pricing, releases, donations, access codes and resale rules.',
    status = 'draft',
    published_at = null
where slug = 'events/ticket-rules' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'events/ticket-rules' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Discounts and codes</li><li>Bundles</li><li>Batched releases</li><li>Early-bird sales</li><li>Donations</li><li>Group purchasing</li><li>Access-code tickets</li><li>Dynamic pricing</li><li>Anti-scalping and resale</li></ul>',
  10
from public.docs_pages p
where p.slug = 'events/ticket-rules' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
