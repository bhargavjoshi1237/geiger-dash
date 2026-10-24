-- Help events affiliates page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the events/affiliates draft outline from
-- 20261024191100_help_events_structure with the full Affiliates guide, but keeps the page a DRAFT. The add-on is only
-- partly working (no affiliate invite email or sign-in, inert Affiliate Settings and Automatic tiers, an ignored
-- attribution window, codes that only credit free orders, refunds that don't reverse commissions, and a copied
-- tracked link that misses the /events path), so the guide states those limits and waits for the fixes. Publish it
-- in a later migration once the add-on is fixed and this text is re-checked.
-- Written from a survey of C:\Pro\geiger-events (addons/affiliates/manifest.js, addons/affiliates/screens/*,
-- addons/affiliates/lib/*, addons/index.js, addons/registry.js, context/addons-context.js,
-- components/internal/screens/settings/addons_settings.jsx, app/e/[id]/published_event_page.jsx,
-- components/internal/screens/events/public_page/checkout/use_checkout.js, public_page/use_page_data.js,
-- lib/email/catalog.js, geiger-rbac.config.js, supabase/migrations/20260729104841_affiliates.sql,
-- 20260830120000_ticket_discount_rules.sql).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set description = 'Credit ticket sales to affiliates through tracked links, run a commission program for each event, approve commissions and record payouts.',
    preview = null,
    status = 'draft'
where slug = 'events/affiliates' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'events/affiliates' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, showcase, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.showcase, v.sort_order
from (
  values
    (
      'turning-on-affiliates',
      'Basics',
      'Turning on Affiliates',
      $html$<p>Affiliates is an add-on: people you sign up as affiliates share tracked links to your events, and Events credits them a commission on the ticket sales those links bring in. To turn it on, choose <strong>Settings → Add-ons</strong> and turn on <strong>Affiliates</strong>. It's on for everyone in the project.</p><p>An <strong>Affiliates</strong> section then appears in the sidebar after Orders, holding <strong>Affiliates</strong>, <strong>Programs</strong>, <strong>Commissions</strong>, <strong>Affiliate Payouts</strong>, <strong>Program Templates</strong> and <strong>Affiliate Settings</strong>. To move the section, use <strong>Sidebar position</strong> on the add-on's card.</p><p>Turning Affiliates off hides these screens and keeps their data. It doesn't stop active programs from crediting sales, so set each program to Paused or Ended first.</p><p>By default, <strong>Affiliates</strong> appears in the sidebar for the Owner, Admin and Manager roles once the add-on is on. To change who sees it, see <a href="/help/events/settings#roles-and-permissions">Roles and permissions</a>.</p>$html$,
      '[]',
      null,
      10
    ),
    (
      'how-sales-are-credited',
      'Concepts',
      'How affiliate sales are credited',
      $html$<p>Affiliate sales are credited through four kinds of record:</p><ul><li>An <strong>affiliate</strong> is a person on the project's roster, with a link token such as <code>jamie-rivers</code>.</li><li>A <strong>program</strong> belongs to one event and sets what its affiliates earn. Each event has at most one program, and only an Active program credits sales.</li><li>An affiliate <strong>enrolled</strong> in a program has a tracked link for that event: the event page's address with <code>?ref=</code> and their link token on the end.</li><li>A <strong>commission</strong> is what one order earned an affiliate. Each order earns at most one.</li></ul><p>When someone opens the event page from a tracked link, Events checks the link and remembers it in that browser for 30 days. If they buy a ticket to that event in the same browser within that time, Events credits the affiliate whose link they opened last. A free order is credited when it's placed, and a paid order when Stripe brings the buyer back to the event page after payment.</p><p>Every commission starts as Pending. You approve it, then settle approved commission into a payout. Nothing is approved or paid on its own.</p>$html$,
      '[]',
      null,
      20
    ),
    (
      'adding-affiliates',
      'Affiliates',
      'Adding affiliates',
      $html$<p>To add an affiliate, choose <strong>Affiliates → Affiliates</strong>, then <strong>Invite affiliate</strong>. <strong>Name</strong> and <strong>Email</strong> are required. <strong>Link token</strong> goes into their tracked links; leave it blank and Events builds it from their name. <strong>Notes</strong> are for your team only. Choose <strong>Send invite</strong> to add them.</p><p><strong>Send invite</strong> doesn't email the affiliate, and affiliates can't see their links or earnings anywhere in Events, so send them their tracked links yourself. New affiliates show as Invited, and they can earn once you enrol them in a program.</p><p>Each email and each link token can belong to one affiliate in the project. The roster shows every affiliate's link token, status, <strong>Lifetime earned</strong> (every commission that hasn't been reversed) and <strong>Pending</strong> commission. Filter it by status, or search by name, email or link token.</p><p>Each row's <strong>⋯</strong> menu has <strong>Pause affiliate</strong> (or <strong>Reactivate</strong>) and <strong>Remove</strong>, which acts straight away without asking. Neither one stops the affiliate's tracked links from earning: to do that, remove them from each program they're enrolled in.</p>$html$,
      '[]',
      null,
      30
    ),
    (
      'creating-a-program',
      'Programs',
      'Creating a program',
      $html$<p>To set up affiliates for an event, choose <strong>Affiliates → Programs</strong>, then <strong>New program</strong>. Pick the <strong>Event</strong>: the list holds only events that don't have a program yet, because each event has one. Optionally pick a template under <strong>Start from a template</strong> to copy its tier ladder, and type a <strong>Program name</strong>. Left blank, the name is the event's name followed by <code>affiliates</code>. Choose <strong>Create program</strong>, and the program opens.</p><p>A new program starts as Draft. Set its status at the top of the program: <strong>Draft</strong>, <strong>Active</strong>, <strong>Paused</strong> or <strong>Ended</strong>. Only an Active program credits sales, and Events pauses a program on its own when its budget runs out.</p><p>Everything in a program saves as you change it, so there's no Save button. The program list shows each program's event, status, commission base, window and budget. Filter it by status, or search by program or event name.</p><p><strong>Delete this program</strong>, at the bottom of a program, and <strong>Delete</strong> in a row's <strong>⋯</strong> menu remove the program straight away, without asking. Its tracked links stop crediting sales, and the commissions it already earned stay on Commissions.</p>$html$,
      '[]',
      null,
      40
    ),
    (
      'commission-base-and-budget',
      'Programs',
      'Commission base, budget and caps',
      $html$<p>A program's <strong>Commission</strong> card sets what the rate applies to and how much the program can pay:</p><ul><li><strong>Base</strong>: <strong>Tickets only</strong> (the default) or <strong>Tickets + add-ons</strong>. The ticket amount is the ticket price times the quantity.</li><li><strong>Applied</strong>: <strong>After the discount</strong> (the default) takes any discount off the base first. <strong>Before the discount</strong> ignores it.</li><li><strong>Program budget</strong>: the most commission the program can earn in total, not counting reversed commissions. The order that reaches it earns only what's left, and Events then pauses the program. Leave it blank for no limit.</li><li><strong>Per-affiliate cap</strong>: the most one affiliate can earn in this program, trimmed the same way. Leave it blank for no limit.</li><li><strong>Attribution window (days)</strong>: saved with the program, but Events remembers a tracked link for 30 days whatever it says.</li></ul><p>The defaults on <strong>Affiliate Settings</strong> aren't applied to new programs, so set these options on each program.</p>$html$,
      '[]',
      null,
      50
    ),
    (
      'tiers-and-rates',
      'Programs',
      'Tiers and rates',
      $html$<p>A tier is a named rate. Each program has its own ladder of tiers, and each enrolled affiliate is on one of them. To add a tier, open the program and choose <strong>Add tier</strong> on the <strong>Tier ladder</strong> card. It starts as a 10% tier named after its place in the ladder. Each field saves as you change it, and the trash icon removes a tier straight away.</p><p><strong>Model</strong> sets how the <strong>Rate</strong> is read:</p><ul><li><strong>Percent of ticket revenue</strong>: a percentage of the commission base. It never comes to more than the base.</li><li><strong>Flat amount per ticket</strong>: the rate times the number of tickets in the order.</li><li><strong>Flat amount per order</strong>: the rate once per order.</li></ul><p>An affiliate with no tier, or whose tier was removed, earns nothing. Events doesn't move affiliates between tiers: <strong>Automatic tiers</strong> and <strong>Sales to reach</strong> are saved but have no effect, so change an affiliate's tier yourself under <strong>Enrolled affiliates</strong>.</p>$html$,
      '[]',
      null,
      60
    ),
    (
      'enrolling-affiliates',
      'Programs',
      'Enrolling affiliates and tracked links',
      $html$<p>To let an affiliate earn from an event, open the event's program and choose <strong>Enrol affiliate</strong> on the <strong>Enrolled affiliates</strong> card. Pick the <strong>Affiliate</strong> and a <strong>Tier</strong> (the lowest tier if you leave it), then choose <strong>Enrol</strong>. Each affiliate can be enrolled in a program once.</p><p>Their tracked link is the event page's address with <code>?ref=</code> and their link token on the end, for example <code>?ref=jamie-rivers</code>, and each row shows that ending. Change an affiliate's tier from the menu in their row. The trash icon removes them from the program straight away, and their link stops crediting sales for this event.</p><p>The optional <strong>Discount code</strong> doesn't discount anything by itself: checkout accepts it only if a discount code with the same text exists for the event under <strong>Tickets → Discounts & Codes</strong>. Even then, Events credits a code only on free orders. For paid orders, only the tracked link counts. See <a href="/help/events/ticket-rules">Discounts & ticket rules</a>.</p>$html$,
      '[]',
      null,
      70
    ),
    (
      'program-rules',
      'Programs',
      'Program rules',
      $html$<p>The <strong>Rules & rails</strong> card on a program decides which orders can earn. Events checks these each time it credits a sale, and each one saves as you change it:</p><ul><li><strong>Stop at event start</strong>: nothing is credited from the event's date onward.</li><li><strong>Exclude free tickets</strong>: orders for a ticket priced at zero earn nothing.</li><li><strong>Exclude discounted orders</strong>: orders that used any discount earn nothing.</li><li><strong>Minimum order value</strong>: orders whose total is less than this amount earn nothing.</li></ul><p>An affiliate never earns from an order placed with their own email address, whatever the program says.</p>$html$,
      '[]',
      null,
      80
    ),
    (
      'commissions',
      'Commissions',
      'Approving and reversing commissions',
      $html$<p><strong>Affiliates → Commissions</strong> lists every credited sale, newest first: the affiliate and whether a tracked link or a code earned it, the order's ticket, quantity and buyer, the base, the rate and the commission. The figures across the top total the <strong>Pending</strong>, <strong>Approved</strong>, <strong>Paid</strong> and <strong>Reversed</strong> commission.</p><p>New commissions are Pending. Select rows with their checkboxes, then choose <strong>Approve</strong> to approve the Pending ones, or <strong>Reverse</strong> to cancel any that are Pending or Approved. Both act straight away, without asking. A reversed commission can't be approved again, and a Paid one can't be reversed.</p><p>Refunding or canceling an order doesn't change its commission. When you refund a referred order, reverse its commission here before it's paid.</p><p>Filter the list by state, or search by affiliate, buyer email or ticket.</p>$html$,
      '[]',
      null,
      90
    ),
    (
      'recording-payouts',
      'Affiliate Payouts',
      'Recording payouts',
      $html$<p><strong>Affiliates → Affiliate Payouts</strong> records what you've paid affiliates. It doesn't move money: pay them yourself, by bank transfer for example, then record it here.</p><p><strong>Ready to pay</strong> lists affiliates with approved commission that hasn't been paid. Choose <strong>Pay</strong> beside one, or <strong>Create payout</strong> at the top, pick the <strong>Affiliate</strong>, type the <strong>Method</strong> (<code>manual</code> to start with) and an optional <strong>Reference</strong>, such as your transfer number, then choose <strong>Create payout</strong>.</p><p>A payout takes every approved commission the affiliate has, marks each one Paid, and records the total as a Draft batch. Choose <strong>Mark sent</strong> on the batch once the money has gone. The payout history lists every batch with its amount, method, reference and state; search it by affiliate or reference.</p><p>The figures across the top show what's <strong>Ready to pay</strong>, how many <strong>Affiliates owed</strong> there are, the total <strong>Paid out</strong> in sent batches, and the number of <strong>Draft batches</strong>.</p>$html$,
      '[]',
      null,
      100
    ),
    (
      'program-templates',
      'Program Templates',
      'Program templates',
      $html$<p>A program template is a saved tier ladder to start new programs from. Choose <strong>Affiliates → Program Templates</strong>, then <strong>New template</strong>, type a <strong>Name</strong> and an optional <strong>Description</strong>, and choose <strong>Create template</strong>. It starts with one 10% tier named Standard.</p><p>Edit the ladder on the template's card: choose <strong>Add tier</strong>, then set each tier's <strong>Name</strong>, <strong>Model</strong> and <strong>Rate</strong>. A field saves when you leave it, and a model when you pick it. The trash icon beside a tier removes it, and the one at the top of the card deletes the template, both without asking.</p><p>Creating a program from a template copies its ladder. Later changes to the template don't reach programs already made from it, and a program's changes never go back to the template.</p>$html$,
      '[]',
      null,
      110
    ),
    (
      'sale-not-credited',
      'Troubleshooting',
      'A sale wasn''t credited to an affiliate',
      $html$<p>A buyer used an affiliate's tracked link, but no commission appears on <strong>Affiliates → Commissions</strong>. Events credits a sale only when every check passes:</p><ul><li>The event's program is Active. A program that ran out of budget is Paused.</li><li>The affiliate is still enrolled in that program, has a tier, and hasn't reached the per-affiliate cap.</li><li>The buyer opened the tracked link and bought in the same browser within 30 days. A paid order is credited only when Stripe brings them back to the event page after payment.</li><li>The order passes the program's rules and wasn't placed with the affiliate's own email.</li><li>The commission comes to more than zero. A percentage of a free order is zero.</li></ul><p>Events can't add a commission to an order afterwards, so fix the program for the sales that follow.</p>$html$,
      '[]',
      null,
      120
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"Settings","label":"Settings","href":"/help/events/settings"},{"icon":"ShoppingBag","label":"Orders","href":"/help/events/orders"},{"icon":"Percent","label":"Discounts & ticket rules","href":"/help/events/ticket-rules"}]',
      null,
      130
    )
) as v(anchor_id, eyebrow, title, content, links, showcase, sort_order)
cross join (select id from public.docs_pages where slug = 'events/affiliates' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Affiliates',
    description = 'Pay affiliates commission on the sales they refer, with programs, templates and payouts.',
    status = 'draft',
    published_at = null
where slug = 'events/affiliates' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'events/affiliates' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Turning on Affiliates</li><li>Programs</li><li>Affiliates</li><li>Commissions</li><li>Payouts</li><li>Settings</li></ul>',
  10
from public.docs_pages p
where p.slug = 'events/affiliates' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
