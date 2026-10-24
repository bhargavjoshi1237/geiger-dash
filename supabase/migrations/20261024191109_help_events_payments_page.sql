-- Help events payments page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the events/payments draft outline from
-- 20261024191100_help_events_structure with the full Payments & policies guide and publishes it.
-- Written from a survey of C:\Pro\geiger-events (components/internal/sidebar/sidebar_nav.jsx, components/internal/screens/registry.jsx,
-- components/internal/screens/tickets/{payment_methods,payment_plans,payouts,multi_currency,taxes,refunds,transfers,
-- orders_attendees,invoice_profiles,records_kit,settings_kit,controls,constants,event_policies}.js*,
-- components/internal/screens/events/{event_sections.js,event_detail.jsx,payments.jsx}, components/internal/shared/pagination.jsx,
-- lib/supabase/{ticketing,ticketing_settings,refunds,orders}.js, lib/events/{use-event-config,express_checkout}.js,
-- lib/portal/{refunds,reads}.js, app/api/portal/refund/route.js, components/portal/{portal_tickets,portal_shell,portal_orders}.jsx,
-- app/api/checkout/route.js, app/api/stripe/webhook/route.js, lib/stripe/*, components/internal/screens/events/public_page/checkout/*,
-- lib/email/catalog.js, geiger-ui.config.js). The Taxes screen is a placeholder and the event editor's Payments section isn't
-- in its section list, so neither is documented.
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set description = 'See how Events charges for paid tickets, let buyers request refunds and answer them, and find out what each payment, payout and invoice setting does.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'events/payments' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'events/payments' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, showcase, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.showcase, v.sort_order
from (
  values
    (
      'taking-payments',
      'Basics',
      'Taking payments for tickets',
      $html$<p>Events takes payment for paid tickets through Stripe Checkout. When a buyer checks out with paid tickets, Events sends them to a Stripe payment page, and the order is recorded once Stripe confirms the payment. An order whose total comes to zero, such as a free ticket, doesn't go to Stripe.</p><p>Every charge is one payment in US dollars, with no tax added. Buyers pay with the payment methods Stripe offers on its page. <strong>Payments & Methods</strong>, <strong>Payment Plans</strong>, <strong>Payouts</strong> and <strong>Multi-currency</strong> don't change the currency, the amount, the number of payments or where the money goes. What does change the amount, such as discount codes, early-bird prices and donations, is covered in <a href="/help/events/tickets">Tickets</a> and <a href="/help/events/ticket-rules">Discounts & ticket rules</a>.</p><p>By default, <strong>Tickets</strong> appears in the sidebar for the Owner, Admin and Manager roles. To change who sees it, see <a href="/help/events/settings#roles-and-permissions">Roles and permissions</a>.</p>$html$,
      '[]',
      null,
      10
    ),
    (
      'records-and-settings',
      'Concepts',
      'Records, project settings and checkout',
      $html$<p>The payment screens under <strong>Tickets</strong> hold two kinds of thing.</p><ul><li><strong>Records</strong> are reusable entries you create, name and set Active or Inactive: payment methods on <strong>Payments & Methods</strong>, payout accounts on <strong>Payouts</strong>, currencies on <strong>Multi-currency</strong>, order policies on <strong>Orders & Attendees</strong> and invoice profiles on <strong>Invoices & Receipts</strong>. You can attach currencies, order policies and invoice profiles to an event from the event editor.</li><li><strong>Project settings</strong> hold one set of values for every event in the project: <strong>Payment Plans</strong>, <strong>Refunds</strong> and <strong>Transfers</strong>. Each of these screens has a <strong>Save Changes</strong> button.</li></ul><p>Of all these, only the <strong>Allow refunds</strong> switch on <strong>Refunds</strong> changes what buyers can do: it decides whether they can request a refund from the members portal. Everything else is saved for your project, and attaching a record to an event saves the link, but nothing else in Events applies it. The requests list on <strong>Refunds</strong> and the orders list on <strong>Orders & Attendees</strong> show the refund requests and orders buyers actually made.</p>$html$,
      '[]',
      null,
      20
    ),
    (
      'creating-and-editing-records',
      'Tickets',
      'Creating and editing records',
      $html$<p>To create a payment method, payout account, currency, order policy or invoice profile, choose its screen under <strong>Tickets</strong> in the sidebar, then the button at the top: <strong>New method</strong>, <strong>New payout account</strong>, <strong>New currency</strong>, <strong>New policy</strong> or <strong>New invoice profile</strong>. Type a <strong>Name</strong>, which is required, and on <strong>Payments & Methods</strong> pick a <strong>Type</strong>. Choose <strong>Create</strong>, and the record opens on its edit page. New records are Active.</p><p>On the edit page you can rename the record in its title, switch it between Active and Inactive, and change its settings. Nothing is kept until you choose <strong>Save</strong>. <strong>Back</strong> returns to the list without saving.</p><p>Each row's <strong>⋯</strong> menu has <strong>Edit</strong>, <strong>Deactivate</strong> (or <strong>Activate</strong>), which saves straight away, and <strong>Delete</strong>. Events asks you to confirm a delete. A deleted record leaves the list and every event it was attached to, and it can't be restored from Events.</p><p>Narrow a list with the status filter (<strong>All Statuses</strong>, <strong>Active</strong> or <strong>Inactive</strong>) and the search box, which matches names. <strong>Payments & Methods</strong> also has a type filter. Lists are newest first and show 25 records a page; switch to 10, 50 or 100 at the bottom.</p>$html$,
      '[]',
      null,
      30
    ),
    (
      'payment-methods',
      'Payments & Methods',
      'Payment methods',
      $html$<p><strong>Payments & Methods</strong> keeps a list of the ways your project takes money, as records of three types. Checkout doesn't use them: buyers always pay on Stripe's payment page in US dollars, and there's no place to attach a payment method to an event. To add one, choose <strong>Tickets → Payments & Methods</strong> in the sidebar, then <strong>New method</strong>. New methods are Stripe unless you pick another <strong>Type</strong>.</p><ul><li><strong>Stripe</strong>: <strong>Currency</strong> (USD, EUR, GBP, CAD or AUD; USD to start with), <strong>Support email</strong> and <strong>Statement descriptor</strong>, up to 22 characters. Neither the support email nor the descriptor reaches a receipt or a card statement.</li><li><strong>PayPal</strong>: the <strong>PayPal email</strong>.</li><li><strong>Bank transfer</strong>: <strong>Account name</strong>, <strong>Account number / IBAN</strong> and <strong>Payment reference</strong>.</li></ul><p>Under <strong>Settings → Navigation</strong>, <strong>Payments & Methods</strong> can't be hidden while <strong>Payment Plans</strong>, <strong>Payouts</strong> or <strong>Multi-currency</strong> is showing, because they depend on it. See <a href="/help/events/settings#navigation">Sidebar navigation</a>.</p>$html$,
      '[]',
      null,
      40
    ),
    (
      'payout-accounts',
      'Payouts',
      'Payout accounts',
      $html$<p><strong>Payouts</strong> keeps payout accounts: where you want ticket revenue sent, and how often. Events saves them for reference only. It doesn't send payouts to these accounts, and there's no place to attach one to an event. To add one, choose <strong>Tickets → Payouts</strong> in the sidebar, then <strong>New payout account</strong>.</p><ul><li><strong>Destination</strong>: the <strong>Method</strong> (Stripe, Bank transfer or PayPal; Stripe to start with), the <strong>Schedule</strong> (Daily, Weekly or On request; Weekly to start with) and the <strong>Account</strong>. For PayPal, the account field is the <strong>PayPal email</strong>.</li><li><strong>Processing fees</strong>: <strong>Who pays the fee</strong>, either <strong>Absorb fees</strong> (the default) or <strong>Pass to buyer</strong>. Checkout doesn't add a fee to the buyer's total either way.</li></ul>$html$,
      '[]',
      null,
      50
    ),
    (
      'currencies',
      'Multi-currency',
      'Currencies',
      $html$<p><strong>Multi-currency</strong> keeps currencies as records. Checkout doesn't offer them: buyers are charged in US dollars whatever currencies you add here or attach to an event. To add one, choose <strong>Tickets → Multi-currency</strong> in the sidebar, then <strong>New currency</strong>.</p><ul><li><strong>Currency</strong>: the <strong>Code</strong> (USD, EUR, GBP, CAD, AUD, JPY or INR; USD to start with), which fills in the <strong>Symbol</strong>, and the <strong>Rate</strong> from your base currency, 1 to start with. You can type a different symbol.</li><li><strong>Settlement</strong>: the <strong>Stripe account</strong> that funds in this currency would settle to.</li></ul><p>To attach currencies to an event, open the event in the event editor and open <strong>Multi-currency</strong>. Click a currency's name to attach it, and click it again to detach it. Each click saves straight away. The section's <strong>Exchange rates</strong> table lists each active currency attached, with its rate and Stripe account, and marks a currency with a rate of 1 as the base.</p>$html$,
      '[]',
      null,
      60
    ),
    (
      'payment-plans',
      'Payment Plans',
      'Payment plans',
      $html$<p><strong>Payment Plans</strong> holds one installment plan for the whole project. Events saves it, but checkout doesn't offer installments: buyers pay the full amount in one Stripe payment, whether or not <strong>Enable payment plans</strong> is on. To see it, choose <strong>Tickets → Payment Plans</strong> in the sidebar.</p><ul><li><strong>Payment plans</strong>: <strong>Enable payment plans</strong>, off to start with.</li><li><strong>Plan terms</strong>: <strong>Installments</strong>, the number of payments after the deposit (3 to start with); <strong>Deposit</strong>, the share taken at checkout (20% to start with); <strong>Cadence</strong> (Weekly, Every 2 weeks or Monthly; Monthly to start with); and <strong>Late fee</strong>, where 0, the default, means none.</li></ul><p>Choose <strong>Save Changes</strong> at the top to keep your changes.</p>$html$,
      '[]',
      null,
      70
    ),
    (
      'refund-policy',
      'Refunds',
      'Refund policy',
      $html$<p>To let buyers ask for their money back, choose <strong>Tickets → Refunds</strong> in the sidebar, keep <strong>Allow refunds</strong> on, and choose <strong>Save Changes</strong>. Refunds are allowed until you turn the switch off and save. The setting covers every event in the project.</p><p>While <strong>Allow refunds</strong> is off, a buyer who sends a refund request from the members portal is told <strong>Refunds aren't available for this event</strong>, and no request reaches you. Requests you already have stay as they are.</p><p>The rest of the refund policy is saved with the project, but nothing applies it:</p><ul><li><strong>Auto-approve requests</strong>: off to start with. Every request arrives as Requested either way.</li><li><strong>Refund window</strong>: 7 days to start with. Requests aren't closed by date.</li><li><strong>Processing fees</strong>: <strong>Refund in full</strong> (the default) or <strong>Keep processing fees</strong>.</li><li><strong>Policy text</strong>: buyers don't see it on the event page or in the members portal.</li></ul><p>Under <strong>Settings → Navigation</strong>, <strong>Refunds</strong> can't be hidden while <strong>Orders → Refunds & Cancellations</strong> is showing, because it depends on it. See <a href="/help/events/settings#navigation">Sidebar navigation</a>.</p>$html$,
      '[]',
      null,
      80
    ),
    (
      'refund-requests',
      'Refunds',
      'Refund requests',
      $html$<p>Refund requests are how buyers ask for their money back. A buyer sends one from a paid order in the members portal, with an optional reason, and it arrives on <strong>Tickets → Refunds</strong> under <strong>Requests</strong>, for the order's full total. Events doesn't email you when one arrives, so check the list.</p><p>Requests are listed newest first. Each shows the buyer's name (or email), its status, the amount, the reason (<strong>No reason given</strong> when there isn't one) and the date. A request starts as Requested. Each row's <strong>⋯</strong> menu moves it to any other status: <strong>Mark requested</strong>, <strong>Mark approved</strong>, <strong>Mark denied</strong> or <strong>Mark refunded</strong>. Status changes save straight away, without <strong>Save Changes</strong>.</p><p>The buyer sees the status on their order in the members portal, as Refund requested, Refund approved, Refund denied or Refunded. Events doesn't email them when it changes.</p><p>Marking a request refunded only changes its status. It doesn't change the order or send any money back to the buyer. To record a refund on the order itself, see <a href="/help/events/orders">Orders</a>.</p><p><strong>Remove</strong>, in the same menu, deletes the request straight away, without asking, and it can't be restored from Events. The buyer can then send a new request for that order.</p>$html$,
      '[]',
      null,
      90
    ),
    (
      'ticket-transfers',
      'Transfers',
      'Ticket transfers',
      $html$<p><strong>Transfers</strong> holds one set of ticket transfer rules for the whole project. Events saves them, but buyers have no way to transfer or resell a ticket in Events, so none of these settings is applied. To see them, choose <strong>Tickets → Transfers</strong> in the sidebar.</p><ul><li><strong>Ticket transfers</strong>: <strong>Enable transfers</strong>, <strong>Allow resale</strong> and <strong>Require approval</strong>, all off to start with.</li><li><strong>Fees & deadline</strong>: the <strong>Transfer fee</strong>, which is <strong>No fee</strong> (the default), <strong>Flat fee</strong> or <strong>Percentage</strong>, with its <strong>Fee amount</strong> or <strong>Fee percentage</strong>; and the <strong>Transfer deadline</strong> in days before the event, 2 to start with.</li></ul><p>Choose <strong>Save Changes</strong> at the top to keep your changes. Anti-scalping and resale rules are covered in <a href="/help/events/ticket-rules">Discounts & ticket rules</a>.</p>$html$,
      '[]',
      null,
      100
    ),
    (
      'order-policies',
      'Orders & Attendees',
      'Order policies',
      $html$<p>An order policy records what buyers can do with an order after checkout. To create one, choose <strong>Tickets → Orders & Attendees</strong> in the sidebar, stay on the <strong>Policies</strong> tab, and choose <strong>New policy</strong>. Events saves policies and lets you attach them to events, but nothing applies them: a policy set to No refunds doesn't stop refund requests, for example.</p><ul><li><strong>Self-service</strong>: <strong>Let buyers manage their order</strong>, on to start with.</li><li><strong>Refunds</strong>: the <strong>Policy</strong> (No refunds, Partial or Full; Partial to start with). Unless it's No refunds, there's also a <strong>Request window</strong> in days before the event (7 to start with) and an <strong>Approval</strong> mode, <strong>Automatic</strong> or <strong>Manual review</strong> (the default).</li><li><strong>Transfers</strong>: <strong>Allow name changes</strong> (on to start with) and <strong>Allow ticket transfer</strong> (off to start with).</li></ul><p>To attach a policy to an event, use the event editor's <strong>Orders & Attendees</strong> section.</p>$html$,
      '[]',
      null,
      110
    ),
    (
      'orders-list',
      'Orders & Attendees',
      'The orders list',
      $html$<p>To see every ticket order across your events, choose <strong>Tickets → Orders & Attendees</strong> in the sidebar and switch to the <strong>Orders</strong> tab. Orders are listed newest first, each with the buyer's name, the event, the ticket and quantity, the order total and the date. The count beside the tabs shows how many orders there are, or how many match your search.</p><p>Search matches the buyer's name, their email and the event's name. The list shows 25 orders a page; switch to 10, 50 or 100 at the bottom.</p><p>The list includes canceled and refunded orders without marking them, and its rows don't open. To open an order, see its status and work with it, use <a href="/help/events/orders">Orders</a>.</p>$html$,
      '[]',
      null,
      120
    ),
    (
      'invoice-profiles',
      'Invoices & Receipts',
      'Invoice and receipt profiles',
      $html$<p>An invoice profile holds the details for an event's invoices and receipts. To create one, choose <strong>Tickets → Invoices & Receipts</strong> in the sidebar, then <strong>New invoice profile</strong>. Events saves profiles and lets you attach them to events, but doesn't print them on any invoice, receipt or email.</p><ul><li><strong>Invoices</strong>: <strong>Generation</strong>, <strong>Manual</strong> (the default) or <strong>Automatic</strong>; the <strong>Invoice prefix</strong> that leads each invoice number (INV to start with); and the <strong>Business / VAT ID</strong>.</li><li><strong>Receipts</strong>: the <strong>Receipt footer</strong>.</li></ul><p>To attach a profile to an event, open the event in the event editor and open <strong>Invoices & Receipts</strong>. Click a profile's name to attach it, and click it again to detach it. Each click saves straight away. The section sums up the newest active profile attached, and its <strong>Preview</strong> shows how that event's invoices would be headed: the prefix with a sample number, the event's name, today's date, the business ID and the footer.</p>$html$,
      '[]',
      null,
      130
    ),
    (
      'event-orders',
      'Event editor',
      'An event''s orders and order policy',
      $html$<p>To see how an event is selling, open it in the event editor and open <strong>Orders & Attendees</strong>. The figures across the top count the event's orders that aren't canceled:</p><ul><li><strong>Orders</strong>, with the number canceled underneath.</li><li><strong>Tickets</strong>: the tickets in those orders.</li><li><strong>Gross</strong>: their total, before fees and refunds.</li><li><strong>Avg order</strong>: gross divided by orders, rounded to the dollar.</li></ul><p>Under <strong>Attached order policies</strong>, click a policy's name to attach it to the event, and click it again to detach it. Each click saves straight away, and inactive policies are marked inactive. <strong>Manage policies</strong> opens <strong>Tickets → Orders & Attendees</strong>, where policies are created. <strong>What buyers can do</strong> sums up the newest active policy attached, but Events doesn't apply it to the event's orders.</p><p>The event editor opens when you click an event in <strong>Events → All Events</strong>. See <a href="/help/events/events#the-event-editor">The event editor</a>.</p>$html$,
      '[]',
      null,
      140
    ),
    (
      'buyer-cant-request-a-refund',
      'Troubleshooting',
      'A buyer can''t request a refund',
      $html$<p>A buyer can't request a refund from the members portal when one of these is true:</p><ul><li><strong>Allow refunds</strong> is off on <strong>Tickets → Refunds</strong>. Sending the request fails with <strong>Refunds aren't available for this event</strong>. Turn the switch on and choose <strong>Save Changes</strong>.</li><li>The order wasn't paid through Stripe, such as a free order, or it's canceled or fully refunded. The members portal doesn't offer <strong>Request refund</strong> for it.</li><li>The order already has a request. The buyer sees its status instead of the button, whatever the status. If they need to send a new one, remove the old request on <strong>Tickets → Refunds</strong> under <strong>Requests</strong>.</li></ul><p>What buyers see in the members portal is covered in <a href="/help/events/members-portal">Members portal</a>.</p>$html$,
      '[]',
      null,
      150
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"ShoppingBag","label":"Orders","href":"/help/events/orders"},{"icon":"Ticket","label":"Tickets","href":"/help/events/tickets"},{"icon":"Percent","label":"Discounts & ticket rules","href":"/help/events/ticket-rules"},{"icon":"CircleUser","label":"Members portal","href":"/help/events/members-portal"},{"icon":"CalendarDays","label":"Events","href":"/help/events/events"},{"icon":"Settings","label":"Settings","href":"/help/events/settings"}]',
      null,
      160
    )
) as v(anchor_id, eyebrow, title, content, links, showcase, sort_order)
cross join (select id from public.docs_pages where slug = 'events/payments' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Payments & policies',
    description = 'Set up payment methods, payment plans, payouts, currencies, taxes, refunds, transfers and invoices.',
    status = 'draft',
    published_at = null
where slug = 'events/payments' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'events/payments' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Payments and methods</li><li>Payment plans</li><li>Payouts</li><li>Multi-currency</li><li>Taxes</li><li>Refund and transfer policies</li><li>Orders and attendees settings</li><li>Invoices and receipts</li></ul>',
  10
from public.docs_pages p
where p.slug = 'events/payments' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
