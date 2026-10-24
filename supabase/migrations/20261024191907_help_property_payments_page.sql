-- Help property payments page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the property/payments draft outline from
-- 20261024191900_help_property_structure with the full Rent & payments guide (Accounting → Rent Collection, Online
-- Payments, Recurring Charges and Utility Billing, plus Settings → Payment Processing) and publishes it.
-- Written from a survey of C:\Pro\geiger-property (components/internal/screens/accounting/{rent_collection,
-- recurring_charges,utility_billing,ledger_section,ledger_dialogs,shared}.*, components/internal/screens/payments/*,
-- lib/payments/{constants,context,checkout}.js, lib/ledger/postings.js, lib/jobs/{financial,autopay,registry}.js,
-- components/internal/screens/settings/settings_kit.jsx).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Rent & payments',
    description = 'Track what each lease owes, post rent and charges, record and collect payments online, set up autopay and bill back utilities.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'property/payments' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'property/payments' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.sort_order
from (
  values
    (
      'rent-accounts',
      'Basics',
      'Setting up a rent account',
      $html$<p>A rent account is one lease's rent obligation. To add one, choose <strong>Accounting → Rent Collection</strong> in the sidebar, then <strong>New Rent Account</strong>. Only <strong>Account label</strong> is required. Pick the <strong>Lease</strong> (which fills in the tenant, unit and rent), the <strong>Monthly rent</strong> and the <strong>Due day of month</strong> (the 1st to start), then choose <strong>Create Rent Account</strong>.</p><p>A rent account's balance is what its lease owes in the general ledger: every charge, payment, credit and late fee posted to the lease counts. The account's <strong>Rent &amp; Schedule</strong> section sets the rent, frequency (Monthly, Weekly, Biweekly or Quarterly) and due day, and <strong>Autopay &amp; Method</strong> records the default payment method.</p>$html$,
      '[]',
      10
    ),
    (
      'rent-collection-list',
      'Rent collection',
      'The rent collection list',
      $html$<p>The figures at the top of <strong>Rent Collection</strong> show the <strong>Monthly rent roll</strong> across all accounts, the <strong>Outstanding</strong> balance (with how many accounts owe), <strong>Tenant credits</strong> (prepaid or unapplied money), and <strong>Accounts current</strong>, the share with a zero or credit balance.</p><p>An account is Current, Due, Partial, Overdue, In collections or Draft. The view menu offers <strong>All rent accounts</strong>, <strong>Owing</strong>, <strong>In credit</strong> and <strong>Autopay</strong>.</p>$html$,
      '[]',
      20
    ),
    (
      'posting-rent-and-payments',
      'Rent collection',
      'Posting rent, charges and payments',
      $html$<p>To charge this month's rent, open the rent account and choose <strong>Actions → Post this month's rent</strong>. It posts the rent for this month's due day to the lease's ledger.</p><p>Every lease, tenant and rent account has a <strong>Ledger</strong> section with a running balance. Its buttons post entries by hand:</p><ul><li><strong>Charge</strong>: an amount owed, against an income account (Rental Income to start).</li><li><strong>Payment</strong>: money received, with the date, amount, bank account, method (ACH, Check, Card, Cash, Money order or Wire) and a reference such as a check number. Property applies it to the open charges oldest first; choose <strong>Choose charges</strong> to apply it yourself. With no open charges, the payment is held as a credit.</li><li><strong>Credit</strong>: reduces what's owed, applied the same way.</li></ul><p>The ledger can be narrowed by date (last 30 or 90 days, 12 months or a custom range) and entry type. Its summary shows the balance owed, total charged, total paid and credited, and deposits held.</p><p>Posting needs the <strong>Post charges, payments, bills &amp; journal entries</strong> permission. Without it, the buttons are disabled with "Your role can't post to the ledger."</p>$html$,
      '[]',
      30
    ),
    (
      'voiding-an-entry',
      'Rent collection',
      'Correcting a ledger entry',
      $html$<p>Ledger entries are never edited or deleted. To correct one, choose the void icon on its row in a <strong>Ledger</strong> section. The <strong>Void entry</strong> dialog asks for a <strong>Void date</strong> and a <strong>Reason</strong>, then posts an equal and opposite entry, so the books stay auditable. Then post the right entry.</p><p>Voided entries and their reversals are hidden until you turn on <strong>Show voided</strong>. Voiding needs the <strong>Void ledger entries</strong> permission.</p>$html$,
      '[]',
      40
    ),
    (
      'late-fees',
      'Rent collection',
      'Late fees',
      $html$<p>A rent account's <strong>Late Fees</strong> section shows the late fee rule in force for its lease, the grace period, how many days late the rent is and the fee owed now. To charge it, choose <strong>Post Late Fee</strong>; the button is disabled when no fee is owed.</p><p>The rule comes from your company default in <strong>Settings → Fees &amp; Policies</strong> (see <a href="/help/property/settings#fees-and-policies">Fees and policies</a>), unless the property or the lease overrides it. Late fees are also posted by the <strong>Assess late fees</strong> scheduled job, listed under <strong>Automations → All Workflows → Scheduled Jobs</strong>; see <a href="/help/property/automations#scheduled-jobs">Scheduled jobs</a>.</p>$html$,
      '[]',
      50
    ),
    (
      'recurring-charges',
      'Recurring charges',
      'Recurring charges',
      $html$<p><strong>Accounting → Recurring Charges</strong> holds charges beyond base rent, such as parking, pet rent or storage. Choose <strong>New Recurring Charge</strong>: only <strong>Charge</strong> (its name) is required. Pick the <strong>Lease</strong> (which fills in the tenant, unit and property), the <strong>Amount</strong>, the <strong>Frequency</strong> (Monthly, Quarterly, Annually or One-time; Monthly to start), the <strong>Next charge date</strong> and an <strong>Income account</strong> (Rental Income when empty). A charge is Active, Paused, Ended or Draft.</p><p>To post the next occurrence, open the charge's <strong>Posting</strong> section and choose <strong>Post Next Charge</strong>. It posts to the lease's ledger and moves the next charge date on by the frequency; a one-time charge becomes Ended. Charges with <strong>Post automatically</strong> turned on are also posted when they come due by the <strong>Post recurring charges</strong> scheduled job.</p><p>The figures show the monthly recurring total, active charges, charges due in the next 30 days and charges not linked to a lease or tenant, which can't be posted.</p>$html$,
      '[]',
      60
    ),
    (
      'utility-billing',
      'Utility billing',
      'Utility billing',
      $html$<p><strong>Accounting → Utility Billing</strong> splits a property's utility bill across its leases and charges each one a share. Choose <strong>New Utility Allocation</strong>: only the name is required. Pick the <strong>Property</strong>, the <strong>Utility</strong>, the <strong>Bill total</strong> and how to <strong>Split by</strong>: Square footage (to start), Occupants or Equal share. In the editor you can also pick the source bill (which copies its total), the service period, the charge date and the income account (Utility Reimbursements when empty).</p><p>The allocation lists every in-force lease on the property with its share. Leave a lease out, change its occupants, or override its amount, then choose <strong>Save Allocation</strong>. When the shares add up to the bill total, <strong>Post Charges</strong> posts each share as a charge on its lease's ledger and sets the allocation Posted. <strong>Void Posted Charges</strong> reverses them.</p>$html$,
      '[]',
      70
    ),
    (
      'online-payments',
      'Online payments',
      'Collecting payments online',
      $html$<p>Online payments take card and bank (ACH) payments through Stripe and post them to the lease's ledger. To collect one, choose <strong>Collect Payment</strong> on <strong>Accounting → Online Payments</strong> and pick the lease, or use <strong>Collect payment</strong> in a lease's <strong>Online Payments</strong> section or <strong>Actions → Collect payment online</strong> on a tenant. Then choose:</p><ul><li><strong>Send payment link</strong>: Property creates a secure Stripe checkout link you can copy, and optionally emails it to the payer. The link stays open for 14 days and re-checks the balance rules each time it's used.</li><li><strong>Take payment now</strong>: opens the Stripe checkout in place, so the payer can pay on your device.</li></ul><p>Set the amount, method and description. Card payments post when they succeed; ACH payments post when they settle, unless Payment Processing credits them on submission. Residents can also pay from the resident portal.</p><p>Online payment is refused when it's turned off, when the tenant has a <strong>No online payments</strong> restriction, when the lease is in eviction and your policy blocks it, or when the amount is over your limit. With partial payments not allowed, the payment must cover the full balance. Collecting needs the <strong>Post charges, payments, bills &amp; journal entries</strong> permission.</p>$html$,
      '[]',
      80
    ),
    (
      'online-payments-screen',
      'Online payments',
      'The online payments screen',
      $html$<p><strong>Accounting → Online Payments</strong> has four tabs: <strong>Payments</strong>, <strong>Autopay</strong>, <strong>Payouts</strong> and <strong>Webhook log</strong>. A payment is Link sent, Pending, Processing, Paid, Partly refunded, Refunded, Failed, Returned, Disputed or Canceled.</p><p>Each payment's menu has <strong>View details</strong> (payer, method, convenience fee, Stripe fee, refunds and payout date), <strong>Copy payment link</strong>, <strong>Refresh from Stripe</strong>, <strong>Open lease</strong>, <strong>Refund</strong> and <strong>Cancel link</strong>. A refund can be any amount up to what's left of the payment, with an optional reason. Refunding needs the posting permission.</p><p>A returned ACH payment voids its ledger entry and charges the returned payment (NSF) fee from your fees and policies. After a set number of returns, online payments stop for that resident.</p><p>The figures show what was collected in the last 30 days (with Stripe fees), ACH payments still settling, failed and returned payments in the last 30 days, and autopay enrollments.</p>$html$,
      '[]',
      90
    ),
    (
      'autopay',
      'Online payments',
      'Autopay',
      $html$<p>To enroll a resident in autopay, open their lease's <strong>Online Payments</strong> section and choose <strong>Set Up Autopay</strong> in the <strong>Autopay</strong> card. Enter the resident's email and what to charge: the <strong>Full open balance</strong> or a <strong>Fixed amount</strong>, an optional maximum per charge, and a <strong>Charge day</strong> from 1 to 28 (blank uses the rent due day). Property creates a setup link where the resident saves a card or bank account, and can email it to them.</p><p>Autopay charges are made by the <strong>Autopay charges</strong> scheduled job. Autopay pauses after the number of failed attempts in a row set in Payment Processing (2 to start), and the card shows the last error. <strong>Turn Off</strong> ends it; it needs the <strong>Void ledger entries</strong> permission, and setting autopay up needs the posting permission.</p>$html$,
      '[]',
      100
    ),
    (
      'payment-processing',
      'Settings',
      'Payment processing settings',
      $html$<p><strong>Settings → Payment Processing</strong> controls online payments for the project. Its <strong>Stripe connection</strong> card shows whether Stripe is connected: the keys are set on the server, not in Property. Until it's connected, residents can't pay online and autopay is skipped.</p><ul><li><strong>Collection</strong>: <strong>Accept online payments</strong>, <strong>Pass convenience fees to the payer</strong> (adds the card or ACH fee from Fees &amp; Policies as its own line), <strong>Offer to save the payment method</strong> and <strong>Email receipts</strong>, all on to start. Pick the bank account payments deposit to, a statement descriptor of up to 22 characters, and the largest online payment (0 for no limit).</li><li><strong>ACH</strong>: <strong>Credit ACH payments when submitted</strong> (off to start) credits the ledger right away and reverses it if the payment is returned; otherwise the ledger is credited when it settles.</li><li><strong>Autopay</strong>: <strong>Allow autopay</strong> (on), the charge offset in days after the due day (0), and pausing after failed attempts (2).</li><li><strong>Returned payments</strong>: how many returns before online payments stop for a resident (2; 0 never).</li></ul><p>Choose <strong>Save Changes</strong> to keep your changes. Saving needs the <strong>Manage settings</strong> permission.</p>$html$,
      '[]',
      110
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"Calculator","label":"Accounting","href":"/help/property/accounting"},{"icon":"FilePen","label":"Leasing","href":"/help/property/leasing"},{"icon":"Users","label":"Tenants, owners & vendors","href":"/help/property/people"},{"icon":"ChartColumn","label":"Reports","href":"/help/property/reports"},{"icon":"Settings","label":"Project settings","href":"/help/property/settings"},{"icon":"Workflow","label":"Automations","href":"/help/property/automations"}]',
      200
    )
) as v(anchor_id, eyebrow, title, content, links, sort_order)
cross join (select id from public.docs_pages where slug = 'property/payments' and deleted_at is null) p;

-- @down
-- Restores the draft exactly as 20261024191900_help_property_structure left it.
update public.docs_pages
set title = 'Rent & payments',
    description = 'Collect rent, take online payments and post recurring and utility charges.',
    status = 'draft',
    published_at = null
where slug = 'property/payments' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'property/payments' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Rent collection</li><li>Online payments and autopay</li><li>Recurring charges</li><li>Utility billing</li><li>Payment processing</li></ul>',
  10
from public.docs_pages p
where p.slug = 'property/payments' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
