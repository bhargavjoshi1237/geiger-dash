-- Help property leasing page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the property/leasing draft outline from
-- 20261024191900_help_property_structure with the full Leasing guide (the sidebar's Leasing group) and publishes it.
-- Templates and E-signature (sidebar Documents) are covered on property/documents.
-- Written from a survey of C:\Pro\geiger-property (components/internal/screens/leasing/{config,lease_actions,renewals,
-- moves,inspections,security_deposits,notices,shared}.*, leasing/sections/*, lib/leasing/workflows.js,
-- components/internal/screens/accounting/ledger_section.jsx, lib/supabase/{leases,renewals,moves,inspections,
-- security_deposits,notices}.js).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Leasing',
    description = 'Create and activate leases, then run renewals, move-ins and move-outs, inspections, security deposits, notices and evictions.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'property/leasing' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'property/leasing' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.sort_order
from (
  values
    (
      'creating-a-lease',
      'Basics',
      'Creating a lease',
      $html$<p>To create a lease, choose <strong>Leasing → Leases</strong> in the sidebar, then <strong>New Lease</strong>. Only <strong>Lease name</strong> is required. Pick the <strong>Unit</strong>, the <strong>Primary tenant</strong> (from <strong>People → Tenants</strong>), the <strong>Term start</strong> and <strong>Term end</strong>, an optional <strong>Lease template</strong>, and a status of Draft or Pending (Draft to start). Choose <strong>Create Lease</strong>.</p><p>Leases are also created for you in two places: converting an approved application in <strong>Marketing &amp; Leads → Applications</strong>, and accepting a renewal. Either way the lease starts as a draft or pending lease that you finish in its editor, then activate.</p>$html$,
      '[]',
      10
    ),
    (
      'lease-statuses',
      'Concepts',
      'Lease statuses',
      $html$<p>A lease's status says where it is in its life. Draft and Pending leases are being prepared. Five statuses mean the lease is <strong>in force</strong>, so rent is owed and the unit is occupied: Active, Expiring soon, Month-to-month, Notice given and Eviction. Renewed, Terminated and Ended are closed.</p><p>The <strong>Actions</strong> menu sets most of them for you:</p><ul><li><strong>Activate lease</strong> sets Active.</li><li><strong>Record notice to vacate</strong> and <strong>Move out</strong> set Notice given.</li><li><strong>Convert to month-to-month</strong> sets Month-to-month.</li><li><strong>Start eviction</strong> sets Eviction.</li><li><strong>Terminate early</strong> sets Terminated, and <strong>End lease</strong> sets Ended.</li><li>Accepting a renewal sets the old lease to Renewed.</li></ul>$html$,
      '[]',
      20
    ),
    (
      'lease-list',
      'Leases',
      'The lease list and editor',
      $html$<p>The figures at the top of <strong>Leases</strong> show <strong>Leases in force</strong>, their total <strong>Monthly rent</strong>, leases <strong>In progress</strong> (drafts and pending), and those <strong>Ending ≤60 days</strong>, with how many are on notice. The view menu offers <strong>All leases</strong>, <strong>In force</strong>, <strong>Drafts</strong>, <strong>Ending soon</strong>, <strong>Notice &amp; move-out</strong>, <strong>Month-to-month</strong> and <strong>Closed</strong>. Search matches the lease name, unit and tenant.</p><p>A lease's editor groups its sections:</p><ul><li><strong>General</strong>: Terms, and Unit &amp; Premises.</li><li><strong>Money</strong>: Ledger, Online Payments, Rent &amp; Escalations, Recurring Charges, Benefits Package, Move-in Costs, Concessions, Deposits, Deposit Alternative, Payment Settings and Lease Policies.</li><li><strong>People</strong>: People (tenants, co-signers, guarantors and occupants), Pets, and Vehicles &amp; Parking.</li><li><strong>Coverage &amp; access</strong>: Renters Insurance, Utilities and Access Codes.</li><li><strong>Agreement</strong>: Template &amp; Document, Preview, Clauses, Addenda and E-signature.</li><li><strong>Lifecycle</strong>: Move-in, Renewal, Notices &amp; Violations and Move-out, plus Eviction and Early Termination once either has started.</li></ul><p><strong>Lease Policies</strong> and <strong>Payment Settings</strong> show the rules the lease inherits from its property and your company defaults, and let you override them for this lease.</p>$html$,
      '[]',
      30
    ),
    (
      'activating-a-lease',
      'Leases',
      'Activating a lease',
      $html$<p>To put a draft or pending lease in force, open it and choose <strong>Actions → Activate lease</strong>. The first step checks the lease is ready: it needs a unit, a term start and a rent above zero before you can continue. Then:</p><ol><li>In <strong>Dates</strong>, set <strong>Signed on</strong> and <strong>Move-in date</strong>. Both are required.</li><li>In <strong>Follow-ups</strong>, choose what else Property does. Each starts on: <strong>Mark the unit occupied</strong>, <strong>Mark the tenant current</strong>, <strong>Schedule the move-in and inspection</strong>, and, when the lease has a deposit, recording that deposit as held.</li><li>Choose <strong>Activate</strong>.</li></ol><p>The lease becomes Active. Recording the deposit creates a Held entry in <strong>Leasing → Security Deposits</strong>, unless the lease already has one. Rent, charges and payments for the lease are handled in its <strong>Ledger</strong> section; see <a href="/help/property/payments#posting-rent-and-payments">Rent &amp; payments</a>.</p>$html$,
      '[]',
      40
    ),
    (
      'renewals',
      'Renewals',
      'Renewals',
      $html$<p>To offer a renewal, open the lease and choose <strong>Actions → Offer renewal</strong>. The new term starts the day after the current one ends and runs 12 months; <strong>New term starts</strong>, <strong>New term ends</strong> and <strong>Proposed rent</strong> are required. Add a renewal incentive and notes, and turn on <strong>Mark the offer as sent</strong> if it's already gone out. You can also start one from <strong>Leasing → Renewals</strong> with <strong>New Renewal</strong>.</p><p>A renewal is Not started, Offer sent, Negotiating, Accepted, Declined or Moving out. Its <strong>Actions</strong> menu:</p><ul><li><strong>Mark offer sent</strong>: sets Offer sent, with a response due date 30 days out if none is set.</li><li><strong>Record counter-offer</strong>: the tenant's counter rent is required. It sets Negotiating; turn on the agree switch to make the counter the proposed rent.</li><li><strong>Accept renewal</strong>: creates the renewed lease as Pending with the new term and rent, copies its people, and marks the current lease Renewed. Two switches, both on, move the recurring charges and carry held deposits to the new lease.</li><li><strong>Decline renewal</strong>: sets Declined, or Moving out when you turn on <strong>Tenant is moving out</strong>. Start the move-out from the lease.</li></ul><p>The renewal's editor can draft an offer letter from its terms for you to edit. The list's figures show open renewals, those expiring within 60 days, the acceptance rate and the average proposed increase.</p>$html$,
      '[]',
      50
    ),
    (
      'ending-a-lease',
      'Leases',
      'Notice, month-to-month and early termination',
      $html$<p>The lease's <strong>Actions</strong> menu covers each way a lease can wind down:</p><ul><li><strong>Record notice to vacate</strong>: the tenant told you they're leaving. <strong>Notice received</strong> and <strong>Move-out date</strong> are required, and the move-out can't be before the notice. By default Property also logs the notice in <strong>Notices &amp; Violations</strong> and marks the unit on notice.</li><li><strong>Convert to month-to-month</strong>: <strong>Month-to-month from</strong> is required (the day after the term ends, to start). An optional premium is added to the rent unless you turn that off.</li><li><strong>Terminate early</strong>: <strong>Termination date</strong> (30 days out, to start) and <strong>Reason</strong> are required. The fee starts at one month's rent, and <strong>Charge the fee to the lease ledger</strong> (on to start) posts it as a charge on the lease. The lease becomes Terminated; start the move-out when you're ready.</li><li><strong>End lease</strong> (for leases on notice, terminated, month-to-month or in eviction): <strong>Ended on</strong> is required. It closes the lease and, by default, marks the unit vacant and the tenant past.</li></ul>$html$,
      '[]',
      60
    ),
    (
      'moving-out',
      'Move-ins & move-outs',
      'Scheduling a move-out',
      $html$<p>To plan a tenant's departure, open the lease and choose <strong>Actions → Move out</strong>. In three steps, Property schedules the move-out, the move-out inspection and, optionally, a unit turn, and sets the deposit's return deadline:</p><ol><li><strong>Dates</strong>: <strong>Move-out date</strong> is required, along with the notice date, reason and forwarding address.</li><li><strong>Inspection &amp; turn</strong>: the inspection date and inspector. <strong>Create a unit turn</strong> starts on, with a target ready date and budget.</li><li><strong>Deposit</strong>: the deposit to return, <strong>Return within (days)</strong> (blank uses your deposit policy, or 30 days without one) and the refund method. The deadline counts from the move-out date.</li></ol><p>Choose <strong>Schedule Move-Out</strong>. An Active lease becomes Notice given.</p>$html$,
      '[]',
      70
    ),
    (
      'moves',
      'Move-ins & move-outs',
      'Move-ins and move-outs',
      $html$<p><strong>Leasing → Move-ins &amp; Move-outs</strong> lists every scheduled move, starting on <strong>Move-ins</strong>; switch to <strong>Move-outs</strong> or <strong>All moves</strong>. Moves are usually created by activating a lease or scheduling a move-out, and you can add one with <strong>New Move</strong> (only the label is required). A move is Scheduled, In progress, Complete or Cancelled.</p><p>Each move has a checklist. A move-in's starts with items such as lease signed, deposit and first month's rent received, renters insurance on file, keys handed over and portal invitation sent; a move-out's covers notice, forwarding address, keys returned, final meter readings, deposit disposition and unit turn. The move also records keys and devices (Handed over, Returned or Missing), utility transfers and meter readings.</p><p><strong>Start move</strong> sets In progress. <strong>Complete move</strong> asks for <strong>Completed on</strong> (required) and, with its switches:</p><ul><li>updates the lease: the move-in date, or Ended (with the tenant marked past) after a move-out;</li><li>updates the unit: Occupied after a move-in, Make-ready or Vacant after a move-out;</li><li>after a move-out, starts the deposit's return clock: the deposit becomes Awaiting disposition, due back after your deposit policy's days (30 without one).</li></ul><p><strong>Cancel move</strong> cancels it.</p>$html$,
      '[]',
      80
    ),
    (
      'inspections',
      'Inspections',
      'Inspections',
      $html$<p><strong>Leasing → Inspections</strong> records the condition of a unit. Move-in and move-out inspections are created with their moves; add others with <strong>New Inspection</strong>. Only the label is required. The type is Move-in, Move-out, Routine, Annual or Drive-by, and picking a lease fills in the unit and tenant. An inspection is Scheduled, In progress, Complete or Failed.</p><p>In the inspection, add rooms one at a time or from a standard layout, then rate each item New, Good, Fair, Poor or Damaged (5 down to 1), with notes and photos. The inspector, tenant and landlord or manager sign by typing their full name. A move-out inspection is compared with the unit's move-in report.</p><p>Its <strong>Actions</strong> menu has <strong>Start inspection</strong>, <strong>Mark complete</strong> (which warns how many items aren't rated yet), <strong>Mark failed</strong> for routine, annual and drive-by inspections, and <strong>Save report to Documents</strong>. The list's figures count inspections, those scheduled in the next 14 days, those in progress and those with at least one damaged item.</p>$html$,
      '[]',
      90
    ),
    (
      'security-deposits',
      'Security deposits',
      'Security deposits',
      $html$<p><strong>Leasing → Security Deposits</strong> tracks each deposit from receipt to refund. Deposits are created when you activate a lease with its deposit recorded, or with <strong>New Deposit</strong> (only the label is required; new ones are Held). A deposit is Pending, Held, Awaiting disposition, Partially returned, Returned or Forfeited, and its kind is a security, pet or key deposit, last month's rent, or other.</p><ul><li><strong>Interest</strong>: whether it's in an interest-bearing account, a rate override (blank uses the policy rate), and the interest recorded so far.</li><li><strong>Deductions</strong>: itemized charges such as cleaning, damage repair, painting or unpaid rent. Each needs a description and amount.</li><li><strong>Set return deadline</strong>: a move-out date (required) and the days allowed, counted from move-out. It sets Awaiting disposition.</li><li><strong>Return deposit</strong>: <strong>Refund amount</strong> and <strong>Returned on</strong> are required. A full refund of the deposit plus interest sets Returned, less than that sets Partially returned, and zero sets Forfeited. Optionally save the itemized disposition letter to Documents.</li></ul><p>Recording or returning a deposit here doesn't post to the general ledger. The list's figures show deposits held, the total held, those awaiting disposition and those past their return deadline.</p>$html$,
      '[]',
      100
    ),
    (
      'notices-and-violations',
      'Notices & violations',
      'Notices and violations',
      $html$<p><strong>Leasing → Notices &amp; Violations</strong> keeps notices you serve and notices tenants give you. Serve one from a lease with <strong>Actions → Serve a notice</strong> (type required; the cure date starts 10 days out), or choose <strong>New Notice</strong> here. Types include Late rent, Pay or quit, Cure or quit, Lease violation, Entry notice, Notice to vacate, Non-renewal, Rent increase and Eviction notice.</p><p>A notice is Draft, Served, Received, Cured, Escalated or Closed. Its <strong>Actions</strong> menu:</p><ul><li><strong>Mark served</strong>: <strong>Served on</strong> and <strong>Delivery</strong> (hand delivered, posted, certified or first-class mail, email or portal) are required. Property records how it was served; it doesn't deliver the notice.</li><li><strong>Mark cured</strong> and <strong>Close notice</strong>.</li><li><strong>Escalate to eviction</strong>: on a served notice linked to a lease, with a required eviction reason. It marks the notice Escalated and starts an eviction on the lease.</li></ul><p>A notice is overdue once its cure date passes while it's still open. In the notice's text section, <strong>Fill from … Template</strong> drafts the wording for its type, and <strong>Save as Document</strong> stores it with the notice's documents. The figures show open and overdue notices, notices served this month and the cure rate.</p>$html$,
      '[]',
      110
    ),
    (
      'evictions',
      'Leases',
      'Evictions',
      $html$<p>To start an eviction, open an in-force lease and choose <strong>Actions → Start eviction</strong>. <strong>Reason</strong> is required (Nonpayment of rent, to start), with the amount owed. <strong>Record the notice served</strong> (on to start) also saves the notice: Pay or quit to start, served today, with a cure date three days out. The lease becomes Eviction, and its <strong>Eviction</strong> section tracks the case. Depending on your payment policy, online payments can be blocked for leases in eviction.</p><p>To finish, choose <strong>Close eviction</strong> and pick the outcome and date (both required). If the case settled with the tenant staying, or was dismissed, the lease returns to its status before the eviction. <strong>Possession recovered</strong> and <strong>Tenant moved out</strong> end the lease.</p>$html$,
      '[]',
      120
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"Megaphone","label":"Marketing & leads","href":"/help/property/marketing"},{"icon":"Users","label":"Tenants, owners & vendors","href":"/help/property/people"},{"icon":"FileText","label":"Documents & e-signature","href":"/help/property/documents"},{"icon":"CircleDollarSign","label":"Rent & payments","href":"/help/property/payments"},{"icon":"Wrench","label":"Maintenance","href":"/help/property/maintenance"},{"icon":"Building2","label":"Properties & units","href":"/help/property/properties"}]',
      200
    )
) as v(anchor_id, eyebrow, title, content, links, sort_order)
cross join (select id from public.docs_pages where slug = 'property/leasing' and deleted_at is null) p;

-- @down
-- Restores the draft exactly as 20261024191900_help_property_structure left it.
update public.docs_pages
set title = 'Leasing',
    description = 'Create and manage leases, renewals, moves, inspections, security deposits and notices.',
    status = 'draft',
    published_at = null
where slug = 'property/leasing' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'property/leasing' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Leases</li><li>Renewals</li><li>Move-ins and move-outs</li><li>Inspections</li><li>Security deposits</li><li>Notices and violations</li></ul>',
  10
from public.docs_pages p
where p.slug = 'property/leasing' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
