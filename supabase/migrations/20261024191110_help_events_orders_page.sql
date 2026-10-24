-- Help events orders page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the events/orders draft outline from
-- 20261024191100_help_events_structure with the full Orders guide and publishes it. Order Settings is left out: it
-- saves its options, but nothing in Events reads them yet.
-- Written from a survey of C:\Pro\geiger-events (components/internal/sidebar/sidebar_nav.jsx,
-- components/internal/screens/registry.jsx, components/internal/screens/orders/*,
-- components/internal/screens/tickets/refunds.jsx, components/internal/shared/pagination.jsx,
-- lib/supabase/{orders,order_refunds,order_events,order_disputes}.js, lib/portal/{refunds,reads}.js,
-- app/api/portal/refund/route.js, components/portal/{portal_tickets,portal_orders}.jsx, app/api/stripe/webhook/route.js,
-- lib/stripe/{server,fulfill-checkout}.js, lib/email/catalog.js, lib/events/packages.js, app/e/[id]/packages/page.js,
-- components/internal/screens/events/public_page/checkout/use_checkout.js,
-- supabase/migrations/20260726194136_orders_management.sql (events.issue_order_refund),
-- supabase/migrations/20260904090000_ticket_releases.sql, geiger-rbac.config.js, geiger-ui.config.js).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set description = 'Find any order, record full and partial refunds, cancel orders, and keep track of transactions, receipts and disputes across your events.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'events/orders' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'events/orders' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, showcase, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.showcase, v.sort_order
from (
  values
    (
      'finding-an-order',
      'Basics',
      'Finding an order',
      $html$<p>To find an order, choose <strong>Orders → All Orders</strong> in the sidebar. The list holds every order placed for your project's events, newest first. Type in <strong>Search name, email, order, event</strong> to match a buyer's name or email, an event's name or an order reference. Search isn't case-sensitive.</p><p>Narrow the list with the two filters beside the search: status (<strong>All Statuses</strong>, <strong>Paid</strong>, <strong>Partially refunded</strong>, <strong>Refunded</strong> or <strong>Cancelled</strong>) and event (<strong>All Events</strong> or one of your events). Changing the search or a filter goes back to the first page. Click an order to open its details, where you refund or cancel it and follow its timeline.</p><p>By default, <strong>Orders</strong> appears in the sidebar for the Owner, Admin and Manager roles. To change who sees it, see <a href="/help/events/settings#roles-and-permissions">Roles and permissions</a>. Orders depends on <strong>Tickets</strong>, and <strong>Refunds & Cancellations</strong> on <strong>Tickets → Refunds</strong>, so in your own sidebar those can't be hidden while the Orders entries that need them are showing. See <a href="/help/events/settings#navigation">Sidebar navigation</a>.</p>$html$,
      '[]',
      null,
      10
    ),
    (
      'orders-and-statuses',
      'Concepts',
      'Orders and their statuses',
      $html$<p>An <strong>order</strong> is one purchase at checkout: a ticket, a quantity and a total, with the buyer's name and email, for one event. Paid tickets, free tickets (with a total of $0) and package sales all become orders. A package sale is named after the package, so it shows under the package's event with your ticket sales. A group purchase becomes one order per attendee, each under that attendee's email.</p><p>Each order has a reference made of <code>ORD-</code> and six letters and digits. Events builds it from the order's ID, so it never changes.</p><p>An order's status follows what has happened to it:</p><ul><li><strong>Paid</strong>: nothing refunded and not canceled. Free orders show as Paid too.</li><li><strong>Partially refunded</strong>: part of the total has been refunded.</li><li><strong>Refunded</strong>: the whole total has been refunded.</li><li><strong>Cancelled</strong>: the order was canceled. This status wins over the other three.</li></ul><p>You don't set a status yourself: issuing a refund or canceling the order changes it. Logging a dispute doesn't.</p>$html$,
      '[]',
      null,
      20
    ),
    (
      'orders-list',
      'All Orders',
      'The orders list',
      $html$<p>The figures across the top of <strong>All Orders</strong> cover every order in the project. Search and filters don't change them.</p><ul><li><strong>Gross revenue</strong>: the total of every order that isn't canceled, before refunds.</li><li><strong>Net revenue</strong>: gross revenue minus everything refunded.</li><li><strong>Orders</strong>: how many orders aren't canceled, with the all-time count under it.</li><li><strong>Refunded</strong>: everything refunded so far, with <strong>AOV</strong>, the average order value (net revenue divided by orders, rounded to the dollar), under it.</li></ul><p>Each row shows the buyer's name, the order reference and email, the event, the ticket and quantity, the status, the total (with any refunded amount under it) and the date the order was placed. The list shows 25 orders a page: choose 10, 25, 50 or 100 under <strong>Per Page</strong> at the bottom.</p><p>Each row's <strong>⋯</strong> menu has <strong>Edit Order</strong>, <strong>View Order</strong>, <strong>Issue Refund</strong> and <strong>Cancel Order</strong>. <strong>Issue Refund</strong> opens the order's details, where you start the refund. <strong>Cancel Order</strong> is unavailable once an order is canceled.</p>$html$,
      '[]',
      null,
      30
    ),
    (
      'order-details',
      'All Orders',
      'Order details',
      $html$<p>Click an order in <strong>All Orders</strong> or <strong>Billing & Receipts</strong>, or a refund in <strong>Refunds & Cancellations</strong>, to open the order's details. The top shows the order reference and status, the buyer's name and email, the event, when the order was placed, and either <strong>Card · Stripe</strong> or <strong>No payment ref</strong>, depending on whether a Stripe payment is attached.</p><p><strong>Items</strong> lists the ticket and quantity, any assigned seats, a donation and a discount code, then the <strong>Total</strong>. Once something is refunded, it also shows <strong>Refunded</strong> and the <strong>Net</strong> left.</p><p>For an order paid through Stripe checkout, <strong>Stripe payment</strong> shows what Stripe recorded: the amount received, the card brand and last four digits, the <strong>Processing fee</strong> and <strong>Net</strong>, billing details, card checks and risk level, a <strong>View Stripe receipt</strong> link, and the Stripe references. An older order with Stripe references but no stored payment details says so instead.</p><p>The buttons are <strong>Issue refund</strong>, <strong>Resend receipt</strong> and <strong>Cancel</strong>. <strong>Resend receipt</strong> adds <strong>Receipt sent</strong> to the timeline, but Events doesn't email the buyer from it.</p><p>The panel then lists the order's refunds, each with its reason, method and amount, and the <strong>Timeline</strong>, newest first: refunds, cancellation, receipts and invoices recorded, edits and notes. To add a note for your team, type in <strong>Add an internal note</strong> and press <code>Enter</code>, or choose the <strong>+</strong> beside it. Timeline entries can't be edited or removed.</p>$html$,
      '[]',
      null,
      40
    ),
    (
      'issuing-a-refund',
      'All Orders',
      'Issuing a refund',
      $html$<p>To refund an order, open it from <strong>All Orders</strong> and choose <strong>Issue refund</strong>. In the <strong>Issue a refund</strong> dialog:</p><ol><li>Optional: change <strong>Amount</strong>. It starts at everything still refundable. Enter less for a partial refund.</li><li>Pick a <strong>Method</strong>: <strong>Original payment</strong> (the default), <strong>Store credit</strong> or <strong>Manual / cash</strong>.</li><li>Pick a <strong>Reason</strong>: <strong>Duplicate</strong>, <strong>Requested by customer</strong> (the default), <strong>Event cancelled</strong>, <strong>Fraudulent</strong> or <strong>Other</strong>.</li><li>Optional: write a <strong>Note</strong>. It shows on the order's timeline.</li><li>Choose <strong>Refund</strong>, which shows the amount.</li></ol><p>The amount has to be more than zero and no more than what's left to refund. You can refund an order in several parts until its whole total is refunded.</p><p>Issuing a refund records it: no money goes back to the buyer, whichever method you pick. Events doesn't refund the payment through Stripe and doesn't email the buyer, so returning the money and telling the buyer happen outside Events.</p><p>The refund adds to the order's refunded amount, sets its status to Partially refunded or Refunded, takes the amount off the event's revenue and adds <strong>Refund issued</strong> to the timeline. It also appears in <strong>Refunds & Cancellations</strong> and <strong>Transactions</strong>. A full refund puts the order's assigned seats and exhibitor booths back on sale; a partial one leaves them with the buyer. Other tickets stay counted as sold. Once the whole total is refunded, the order leaves the attendee's tickets in the members portal.</p>$html$,
      '[]',
      null,
      50
    ),
    (
      'canceling-an-order',
      'All Orders',
      'Canceling an order',
      $html$<p>To cancel an order, open it and choose <strong>Cancel</strong>, or choose <strong>Cancel Order</strong> in its row's <strong>⋯</strong> menu in <strong>All Orders</strong>. Events asks you to confirm first, and a cancellation can't be undone.</p><p>Canceling sets the order's status to <strong>Cancelled</strong>, adds <strong>Order cancelled</strong> to its timeline and puts any assigned seats and exhibitor booths back on sale. Other tickets stay counted as sold. The order drops out of the attendee's tickets in the members portal, and the attendee can't request a refund for it.</p><p>A canceled order stays in <strong>All Orders</strong> (filter by <strong>Cancelled</strong>), but it leaves the <strong>Gross revenue</strong> and <strong>Orders</strong> figures and isn't listed in <strong>Billing & Receipts</strong>. The event's own revenue figure doesn't change.</p><p>Canceling doesn't refund anything, and once an order is canceled you can't issue a refund on it. If the buyer is owed money, issue the refund first, then cancel. Events doesn't email the buyer about the cancellation.</p>$html$,
      '[]',
      null,
      60
    ),
    (
      'editing-an-order',
      'All Orders',
      'Editing an order',
      $html$<p>To correct an order after checkout, choose <strong>Edit Order</strong> in its row's <strong>⋯</strong> menu in <strong>All Orders</strong>. The order opens full screen, with four sections:</p><ul><li><strong>Buyer</strong>: <strong>Name</strong> and <strong>Email</strong>. The members portal finds orders by email, so changing the email moves the order to whoever signs in with the new address.</li><li><strong>Tickets</strong>: <strong>Ticket</strong> (left empty, it saves as General Admission), <strong>Unit price</strong>, <strong>Quantity</strong> (at least 1) and <strong>Total</strong>. With <strong>Total mode</strong> on <strong>Auto</strong>, the total follows unit price × quantity; on <strong>Manual</strong>, it stays where you put it. It starts on Auto when the total already equals unit price × quantity.</li><li><strong>Payment</strong>: the Stripe <strong>Checkout Session</strong> and <strong>Payment intent</strong> references, to fix one that was recorded wrong. It also shows <strong>Refunded to date</strong> and when the order was canceled, which you can't change here.</li><li><strong>Notes</strong>: an <strong>Internal note</strong> for your team. Buyers never see it.</li></ul><p>Nothing saves until you choose <strong>Save</strong>, and leaving without it drops your changes. Events checks that the email looks valid and adds <strong>Order edited</strong> to the timeline. The figures in Orders are added up from order totals, so they follow a changed total. <strong>View order</strong> opens the order's details, and <strong>All Orders</strong> at the top takes you back to the list.</p>$html$,
      '[]',
      null,
      70
    ),
    (
      'refunds-list',
      'Refunds & Cancellations',
      'The refunds list',
      $html$<p>Choose <strong>Orders → Refunds & Cancellations</strong> to see every refund issued from an order in the project, newest first, all on one page. Each row shows the buyer, the order reference and event, the reason and method, the status, the amount and the date. Click a refund to open its order's details.</p><p>The figures across the top are <strong>Refunds</strong> (with how many are Requested), <strong>Issued</strong>, <strong>Refunded</strong> (the total of Issued refunds) and <strong>Refund rate</strong> (that total as a share of all orders' totals). Search and filters don't change them. Filter by status, event and ticket, or search by buyer, email, event or order reference.</p><p>Every refund you issue is recorded as Issued. Each row's <strong>⋯</strong> menu has <strong>View order</strong>, then <strong>Mark requested</strong>, <strong>Mark approved</strong>, <strong>Mark denied</strong> and <strong>Mark issued</strong> (all but the current status), then <strong>Remove</strong>. Marking a refund changes only its label and the figures on this screen: the order keeps its refunded amount and status. <strong>Remove</strong> asks you to confirm, then takes the refund off this list and <strong>Transactions</strong> for good, while the order still counts it as refunded.</p><p>Canceled orders aren't listed here: filter <strong>All Orders</strong> by <strong>Cancelled</strong> instead. Refund requests that attendees send from the members portal arrive in <strong>Tickets → Refunds</strong>, not here.</p>$html$,
      '[]',
      null,
      80
    ),
    (
      'refund-requests',
      'Refunds',
      'Refund requests from attendees',
      $html$<p>Attendees request a refund for a paid order from the members portal, with an optional reason. Each request arrives in <strong>Tickets → Refunds</strong>, under <strong>Requests</strong>, with the attendee's name, the order total, their reason and the date. It doesn't appear in Orders, and Events doesn't email you or the attendee about it.</p><p>The members portal turns a request away when <strong>Allow refunds</strong> is off in <strong>Tickets → Refunds</strong>, when the order is canceled or fully refunded, or when the order already has a request that's Requested or Approved.</p><p>To act on a request:</p><ol><li>Choose <strong>Orders → All Orders</strong>, search for the attendee's email and open the order.</li><li>Choose <strong>Issue refund</strong> and record the refund. Events doesn't send the money back for you.</li><li>In <strong>Tickets → Refunds</strong>, open <strong>Requests</strong> and choose <strong>Mark refunded</strong> in the request's <strong>⋯</strong> menu. To turn it down instead, choose <strong>Mark denied</strong>.</li></ol><p>Marking a request changes only the request: it doesn't refund or change the order. The attendee sees its status on their order in the members portal: Refund requested, Refund approved, Refund denied or Refunded. For the attendee's side, see <a href="/help/events/members-portal">Members portal</a>. For your refund policy, see <a href="/help/events/payments">Payments & policies</a>.</p>$html$,
      '[]',
      null,
      90
    ),
    (
      'transactions',
      'Transactions',
      'The transactions ledger',
      $html$<p>Choose <strong>Orders → Transactions</strong> for one line per money movement Events has recorded: a <strong>Charge</strong> for every order and a <strong>Refund</strong> for every refund, newest first, 25 a page. Every order counts as a charge, including free and canceled ones.</p><p>The figures across the top are <strong>Gross charged</strong>, <strong>Refunded</strong>, <strong>Est. fees</strong> and <strong>Net</strong> (after refunds and fees). <strong>Est. fees</strong> is an estimate of 2.9% + $0.30 a charge, not what Stripe took: for that, check <strong>Processing fee</strong> in the order's details. Search and filters don't change the figures.</p><p><strong>Method</strong> shows <strong>Original payment</strong> for a charge with a Stripe payment and <strong>Manual / cash</strong> for one without. A refund shows the method picked when it was issued. Filter by type (<strong>All transactions</strong>, <strong>Charges</strong> or <strong>Refunds</strong>), event and ticket, or search by buyer, ticket, event or order reference.</p><p>Click a line, or choose <strong>View transaction</strong> in its <strong>⋯</strong> menu, to see its details: the amount and method, the estimated fee and net for a charge, the order it belongs to, and a refund's status, reason and note. The details are read-only. Transactions lists what Events recorded, not what reached your bank.</p>$html$,
      '[]',
      null,
      100
    ),
    (
      'receipts-and-invoices',
      'Billing & Receipts',
      'Receipts and invoices',
      $html$<p>Choose <strong>Orders → Billing & Receipts</strong> for one receipt line per order that isn't canceled, newest first, 25 a page. Each line shows the order reference, the buyer's name and email, the event, the status, the date and the amount. The figures across the top count the <strong>Receipts</strong>, the amount <strong>Billed</strong> and the unique <strong>Buyers</strong> by email.</p><p>Filter by status (<strong>All Statuses</strong>, <strong>Paid</strong>, <strong>Partially refunded</strong> or <strong>Refunded</strong>) and event, or search by buyer, email, event or order reference. Click a line to open the order's details.</p><p>Each line's <strong>⋯</strong> menu has <strong>View order</strong>, <strong>Resend receipt</strong> and <strong>Generate invoice</strong>. <strong>Resend receipt</strong> and <strong>Generate invoice</strong> only add <strong>Receipt sent</strong> or <strong>Invoice generated</strong> to the order's timeline: Events doesn't email a receipt or create an invoice document from this screen. For invoice profiles, see <a href="/help/events/payments">Payments & policies</a>.</p>$html$,
      '[]',
      null,
      110
    ),
    (
      'logging-a-dispute',
      'Disputes & Chargebacks',
      'Logging a dispute',
      $html$<p>When a buyer disputes a payment with their bank, log it so your team can follow it. Choose <strong>Orders → Disputes & Chargebacks</strong>, then <strong>Log dispute</strong>. In the <strong>Log a dispute</strong> dialog:</p><ul><li><strong>Order</strong>: required. Pick the disputed order from every order in the project.</li><li><strong>Amount</strong>: fills in with the order's total when you pick the order. Change it if less is disputed.</li><li><strong>Evidence due</strong>: optional, the date your evidence is due.</li><li><strong>Reason</strong>: optional, the reason the bank gave.</li></ul><p>Choose <strong>Log dispute</strong> to add it. New disputes start as Needs response. A dispute's order, amount, date and reason can't be changed once it's logged.</p><p>Disputes here are your own record. Events doesn't receive disputes from Stripe and doesn't send evidence anywhere. Logging or resolving a dispute doesn't change the order, its status or any refund.</p>$html$,
      '[]',
      null,
      120
    ),
    (
      'tracking-disputes',
      'Disputes & Chargebacks',
      'Tracking disputes',
      $html$<p>The figures across the top of <strong>Disputes & Chargebacks</strong> are <strong>Open</strong> (disputes not yet Won or Lost, with how many need a response), <strong>At stake</strong> (the amount of the open ones), <strong>Won</strong> and <strong>Total</strong>. Search and filters don't change them.</p><p>Each row shows the buyer, the order reference and event, the reason, the status, <strong>Evidence due</strong> and the amount, newest first, 25 a page. Filter by status (<strong>All disputes</strong>, <strong>Needs response</strong>, <strong>Under review</strong>, <strong>Won</strong> or <strong>Lost</strong>) and event, or search by buyer, event, order reference or reason.</p><p>Move a dispute along from its row's <strong>⋯</strong> menu: <strong>Mark needs response</strong>, <strong>Mark under review</strong>, <strong>Mark won</strong> or <strong>Mark lost</strong>. Each change saves straight away. <strong>Remove</strong> asks you to confirm first, and a removed dispute can't be restored.</p>$html$,
      '[]',
      null,
      130
    ),
    (
      'issue-refund-unavailable',
      'Troubleshooting',
      'Issue refund is grayed out',
      $html$<p>The <strong>Issue refund</strong> button in an order's details is unavailable when the order is canceled, or when there's nothing left to refund because the order is fully refunded or its total is $0.</p><p>A canceled order can't be refunded from Events. When a buyer is owed money on an order you're about to cancel, issue the refund first, then cancel the order.</p>$html$,
      '[]',
      null,
      140
    ),
    (
      'order-code-not-found',
      'Troubleshooting',
      'A buyer''s order code doesn''t match any order',
      $html$<p>Attendees see a different reference for the same order. In the members portal, an order shows as <code>GE-</code> and eight characters; in Orders, it's <code>ORD-</code> and six. Both come from the same order ID, so the first six characters after <code>GE-</code> are the six after <code>ORD-</code>.</p><p>To find the order, type those six characters in the <strong>All Orders</strong> search, or search for the attendee's email.</p>$html$,
      '[]',
      null,
      150
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"Ticket","label":"Tickets","href":"/help/events/tickets"},{"icon":"CreditCard","label":"Payments & policies","href":"/help/events/payments"},{"icon":"UserRound","label":"Members portal","href":"/help/events/members-portal"},{"icon":"Gem","label":"Packages","href":"/help/events/packages"},{"icon":"ClipboardList","label":"Registrations","href":"/help/events/registrations"},{"icon":"Settings","label":"Settings","href":"/help/events/settings"}]',
      null,
      160
    )
) as v(anchor_id, eyebrow, title, content, links, showcase, sort_order)
cross join (select id from public.docs_pages where slug = 'events/orders' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Orders',
    description = 'Find any order, issue refunds and cancellations, and handle transactions, receipts and disputes.',
    status = 'draft',
    published_at = null
where slug = 'events/orders' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'events/orders' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>All orders</li><li>Order details</li><li>Refunds and cancellations</li><li>Transactions</li><li>Billing and receipts</li><li>Disputes and chargebacks</li><li>Order settings</li></ul>',
  10
from public.docs_pages p
where p.slug = 'events/orders' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
