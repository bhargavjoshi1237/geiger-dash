-- Help property maintenance page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the property/maintenance draft outline from
-- 20261024191900_help_property_structure with the full Maintenance guide (the sidebar's Maintenance group) and
-- publishes it.
-- Written from a survey of C:\Pro\geiger-property (components/internal/screens/maintenance/{config,work_orders,
-- work_order_sections,preventive,pm_generate,unit_turns,inventory,shared}.*, maintenance/sections/{wo_actions,
-- wo_approval}.jsx, lib/maintenance/pm.js, lib/jobs/{preventive_work_orders,registry}.js, lib/portal/{owner,resident}.js).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Maintenance',
    description = 'Track work orders from request to completion, schedule preventive work, turn units for the next resident and keep parts in stock.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'property/maintenance' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'property/maintenance' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.sort_order
from (
  values
    (
      'creating-a-work-order',
      'Basics',
      'Creating a work order',
      $html$<p>To log a repair, choose <strong>Maintenance → Work Orders</strong> in the sidebar, then <strong>New Work Order</strong>. Only <strong>Summary</strong> is required. Pick a <strong>Priority</strong> (Low, Medium, High or Urgent; Medium to start), a <strong>Category</strong> (Plumbing, Electrical, HVAC, Appliance, General, Landscaping, Pest control or Cleaning) and a <strong>Due date</strong>, then choose <strong>Create Work Order</strong>. New work orders are Open.</p><p>You can also open one from a unit with <strong>Actions → New work order</strong>. In the work order's editor, set its location (property, unit, tenant, room and equipment) and its entry and access details: permission to enter, keys, codes, pets and preferred times.</p>$html$,
      '[]',
      10
    ),
    (
      'work-orders-and-requests',
      'Concepts',
      'Work orders and requests',
      $html$<p><strong>Work Orders</strong> holds two kinds of record. A <strong>request</strong> is a problem a resident reported from the resident portal, or one you log as a request; it's Submitted, In review, Approved, Rejected or Converted. A <strong>work order</strong> is a job to do; it's Open, Scheduled, In progress, On hold, Completed, Cancelled or Draft.</p><p>To act on a request, open it and go to <strong>Request Triage</strong>: review it, then choose <strong>Convert to work order</strong>. The same record becomes an Open work order, so its history and photos stay with it.</p><p>The view menu offers <strong>All work orders</strong>, <strong>Work orders</strong>, <strong>Requests</strong>, <strong>Field</strong>, <strong>Open</strong>, <strong>Overdue</strong> (open past their due date) and <strong>Awaiting approval</strong>, and you can filter by priority, vendor and property. The figures show open work orders, overdue ones, those awaiting owner approval and this month's cost.</p>$html$,
      '[]',
      20
    ),
    (
      'dispatching-work',
      'Work orders',
      'Assigning, scheduling and holding work',
      $html$<p>An open work order's <strong>Actions</strong> menu moves the job along:</p><ul><li><strong>Assign vendor</strong>: <strong>Vendor</strong> is required. Add a technician, how you dispatched it, a not-to-exceed amount and instructions, and optionally book the visit's date and time window.</li><li><strong>Schedule</strong>: <strong>Date</strong> is required, with a technician, time window and ETA, and the work order becomes Scheduled.</li><li><strong>Start work</strong>: sets In progress.</li><li><strong>Put on hold</strong>: a reason is required, with the date you expect to resume.</li><li><strong>Cancel work order</strong>: a reason is required.</li></ul><p>The editor's <strong>Dispatch</strong> group keeps the assignment, every vendor dispatched to the job and the owner approval.</p>$html$,
      '[]',
      30
    ),
    (
      'owner-approval',
      'Work orders',
      'Owner approval',
      $html$<p>Jobs that cost more than a property's owner approval limit need the owner's sign-off. The limit comes from <strong>Settings → Fees &amp; Policies</strong> ($500 to start; see <a href="/help/property/settings#fees-and-policies">Fees and policies</a>), or the property's own override under <strong>Maintenance Rules</strong>. A work order's <strong>Owner Approval</strong> section shows the limit, the amount (the amount you enter, else the accepted estimate, else the total cost) and whether approval is required.</p><ul><li><strong>Request approval</strong>: <strong>Approver</strong> and <strong>Amount</strong> are required, with how you asked and when you need a decision. Property records the request but doesn't email the owner: contact them yourself.</li><li><strong>Record approval</strong> (who approved, required) and <strong>Record rejection</strong> (who rejected and why, both required) close the request.</li></ul><p>An owner with portal access can approve or reject a pending request from the owner portal. A rejection there needs a reason, and approving a job that was on hold waiting for approval takes it off hold.</p>$html$,
      '[]',
      40
    ),
    (
      'costs-and-completion',
      'Work orders',
      'Costs, billing and completing a job',
      $html$<p>The editor's <strong>Money</strong> group holds vendor <strong>Estimates</strong>, the job's <strong>Costs</strong> (labor, materials and trip line items) and <strong>Billing</strong>: a tenant chargeback, owner billing and vendor bills. To pay the vendor, choose <strong>Actions → Create vendor bill</strong>. <strong>Amount</strong> and <strong>Due date</strong> are required, and the bill is created in <strong>Accounting → Bills &amp; Payables</strong>, linked to the work order.</p><p>On site, the technician's <strong>Checklist</strong>, <strong>Time Log</strong>, <strong>Materials Used</strong>, <strong>Field Report</strong> and before-and-after <strong>Photos</strong> are recorded in the <strong>On site</strong> group.</p><p>To close the job, choose <strong>Actions → Complete…</strong>:</p><ol><li><strong>Resolution</strong>: the resolution and <strong>Completed on</strong> are required, with hours on site, root cause and who signed off.</li><li><strong>Parts used</strong>: ticked parts are deducted from <strong>Inventory &amp; Parts</strong>.</li><li><strong>Close</strong>: flag a follow-up, and optionally ask the tenant for feedback.</li></ol><p><strong>Reopen</strong> brings a completed or cancelled work order back.</p>$html$,
      '[]',
      50
    ),
    (
      'preventive-maintenance',
      'Preventive & recurring',
      'Preventive and recurring schedules',
      $html$<p><strong>Maintenance → Preventive &amp; Recurring</strong> holds schedules for work that repeats, like filter changes or gutter cleaning. Choose <strong>New Schedule</strong>: only <strong>Task</strong> is required. Pick a <strong>Frequency</strong> (Weekly, Biweekly, Monthly, Bimonthly, Quarterly, Semi-annually, Annually or Custom; Monthly to start), the <strong>First due date</strong> and a category.</p><p>In the schedule's editor, set what it applies to: <strong>Property-wide (one work order)</strong>, <strong>A specific unit</strong>, <strong>Every unit in the property</strong> or <strong>Listed assets / equipment</strong>. Set how many days before the due date to create the work order, whether to skip an occurrence while the last one is still open, seasonal months, an end date, and the vendor, cost, priority and instructions the work orders get.</p><p>A schedule is Active, Paused or Ended. Its <strong>Actions</strong> menu has:</p><ul><li><strong>Generate now</strong>: creates this occurrence's work orders and moves the schedule to its next due date.</li><li><strong>Skip this occurrence</strong>: moves to the next due date without creating anything.</li><li><strong>Pause</strong> and <strong>Resume</strong> (which asks for the next due date).</li></ul><p><strong>Generate Due</strong> at the top of the list creates work orders for every schedule that's due. Schedules with <strong>Generate automatically</strong> turned on are also picked up by the <strong>Preventive work orders</strong> scheduled job; see <a href="/help/property/automations#scheduled-jobs">Scheduled jobs</a>.</p>$html$,
      '[]',
      60
    ),
    (
      'unit-turns',
      'Unit turns',
      'Unit turns',
      $html$<p>A unit turn gets a vacated unit ready for the next resident. Start one from a unit with <strong>Actions → Start turn</strong>, when you schedule a move-out, or with <strong>New Unit Turn</strong> on <strong>Maintenance → Unit Turns</strong> (only the turn name is required). A turn is Not started, In progress, Ready or Leased.</p><p>A turn's <strong>Actions</strong> menu:</p><ul><li><strong>Start turn</strong>: sets In progress.</li><li><strong>Add vendor task</strong>: creates a work order linked to the turn. Its costs count toward the turn's actual spend.</li><li><strong>Load standard checklist</strong>: adds the standard make-ready tasks, each To do, In progress, Blocked or Done.</li><li><strong>Mark ready</strong>: <strong>Ready on</strong> is required. Optionally mark the remaining checklist tasks done.</li><li><strong>Mark leased</strong> closes a ready turn, and <strong>Reopen turn</strong> brings it back.</li></ul><p>Switch the screen between <strong>List</strong> and <strong>Board</strong>. On the board, each status is a column, and a card's menu moves it to another. The figures show active turns, ready units not yet leased, turns past their target date and actual spend against budget.</p>$html$,
      '[]',
      70
    ),
    (
      'inventory',
      'Inventory',
      'Inventory and parts',
      $html$<p><strong>Maintenance → Inventory &amp; Parts</strong> tracks the parts and supplies you keep in stock. Choose <strong>New Item</strong>: only <strong>Item name</strong> is required. Set the SKU, category, quantity on hand, reorder level and unit cost.</p><p>An item is <strong>In stock</strong>, <strong>Low</strong> (at or below its reorder level) or <strong>Out of stock</strong> (zero or less), worked out from its quantity. Its <strong>Actions</strong> menu changes the count and logs each change:</p><ul><li><strong>Record restock</strong>: the quantity received is required. A unit cost entered here updates the item's unit cost.</li><li><strong>Record usage</strong>: the quantity used is required. It deducts stock and logs the part on the work order you pick.</li><li><strong>Adjust count</strong>: enter what's physically on the shelf, and the difference is logged as an adjustment.</li></ul><p>Completing a work order also deducts the parts ticked in its <strong>Parts used</strong> step. The item's editor keeps supplier details, the preferred vendor and any open order.</p>$html$,
      '[]',
      80
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"Users","label":"Tenants, owners & vendors","href":"/help/property/people"},{"icon":"Calculator","label":"Accounting","href":"/help/property/accounting"},{"icon":"Building2","label":"Properties & units","href":"/help/property/properties"}]',
      200
    )
) as v(anchor_id, eyebrow, title, content, links, sort_order)
cross join (select id from public.docs_pages where slug = 'property/maintenance' and deleted_at is null) p;

-- @down
-- Restores the draft exactly as 20261024191900_help_property_structure left it.
update public.docs_pages
set title = 'Maintenance',
    description = 'Track work orders, preventive maintenance, unit turns and parts inventory.',
    status = 'draft',
    published_at = null
where slug = 'property/maintenance' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'property/maintenance' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Work orders</li><li>Preventive and recurring work</li><li>Unit turns</li><li>Inventory and parts</li></ul>',
  10
from public.docs_pages p
where p.slug = 'property/maintenance' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
