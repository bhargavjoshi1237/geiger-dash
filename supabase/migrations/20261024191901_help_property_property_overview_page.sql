-- Help property property overview page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the property/property-overview draft
-- outline from 20261024191900_help_property_structure with the full Property overview guide (the sidebar's Overview
-- screen) and publishes it.
-- Written from a survey of C:\Pro\geiger-property (components/internal/screens/overview/{property_overview,
-- filter_dropdown}.jsx, components/internal/screens/reports/shared.js, lib/reports/maps.js).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Property overview',
    description = 'Read the Overview screen: occupancy, rent, leasing and maintenance figures, charts by property, and the list of what needs attention.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'property/property-overview' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'property/property-overview' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.sort_order
from (
  values
    (
      'opening-the-overview',
      'Basics',
      'Opening the overview',
      $html$<p><strong>Overview</strong>, at the top of the sidebar, is the project's home screen in Property. Its heading reads <strong>Property Overview</strong>, and it sums up occupancy, rent, leasing and maintenance across every property in the project. Everything on it is read-only: open the screen an item points to when you want to act on it.</p><p>Beside the heading, three counts show your <strong>Properties</strong>, <strong>Units</strong> and <strong>Active Leases</strong>. Units in Draft aren't counted on this screen. A lease counts as active when it's Active, Expiring soon, Month-to-month, Notice given or Eviction.</p>$html$,
      '[]',
      10
    ),
    (
      'key-figures',
      'Overview',
      'Key figures',
      $html$<p>The figures bar under the heading shows four numbers:</p><ul><li><strong>Occupancy</strong>: the share of units that are Occupied or on Notice, with how many units that is.</li><li><strong>Rent Collected</strong>: rent collected this month, with the change from last month.</li><li><strong>Delinquent Balance</strong>: the total owed on rent accounts with a balance, and how many accounts owe.</li><li><strong>Open Work Orders</strong>: work orders that aren't completed, cancelled, rejected, converted, closed or drafts, with how many are Urgent or High priority.</li></ul>$html$,
      '[]',
      20
    ),
    (
      'charts',
      'Overview',
      'Charts and rates',
      $html$<ul><li><strong>Rent Over Time</strong>: the last 12 months, by month. Switch between <strong>Rent collected</strong>, <strong>Rent billed</strong> and <strong>Work orders</strong> (work orders created each month).</li><li><strong>Unit Status Mix</strong>: how your units split by status. Pick a status to highlight it.</li><li><strong>Leasing Funnel</strong>: the share of prospects reaching each step toward a signed lease: prospects, showings held or booked (not cancelled), applications and leases signed (any lease past Draft).</li><li><strong>Occupancy Rate</strong>: occupied or on-notice units against the total.</li><li><strong>Collection Rate</strong>: rent collected against rent billed this month.</li></ul><p>Rent Over Time and both rates have a property picker, so you can look at one property, several, or all of them.</p>$html$,
      '[]',
      30
    ),
    (
      'top-properties',
      'Overview',
      'Top performing properties',
      $html$<p><strong>Top Performing Properties</strong> ranks your five leading properties, by <strong>Monthly rent</strong> (the rent on their occupied units) or by <strong>Occupancy</strong>. Pick which properties to include with its property picker.</p><p>Each row shows the property's occupied units out of its total, its rent and a health label:</p><ul><li><strong>Fully leased</strong>: 95% or more of its units occupied.</li><li><strong>Healthy</strong>: 80% to 95%.</li><li><strong>Vacancy risk</strong>: under 80%.</li><li><strong>No units yet</strong>: the property has no units.</li></ul><p>Open a property from its row to go to it in <strong>Property → Properties</strong>.</p>$html$,
      '[]',
      40
    ),
    (
      'needs-attention',
      'Overview',
      'Needs attention',
      $html$<p><strong>Needs Attention</strong> lists open items across rent, maintenance, leasing and payables, each marked Urgent, Soon or Routine. Click an item to open the screen where you deal with it.</p><ul><li><strong>Overdue rent</strong> (Urgent): rent accounts that are Overdue or In collections, or have charges over 30 days old still unpaid, with the amount and who owes it. Opens <strong>Rent Collection</strong>.</li><li><strong>Urgent work orders</strong> (Urgent): open work orders with Urgent or High priority. Opens <strong>Work Orders</strong>.</li><li><strong>Overdue bills</strong> (Urgent): bills past their due date with money still owed. Opens <strong>Bills &amp; Payables</strong>.</li><li><strong>Expiring leases</strong> (Soon): active leases ending within 60 days that have no renewal. Opens <strong>Renewals</strong>.</li><li><strong>Upcoming moves</strong> (Soon): move-ins and move-outs in the next 30 days that aren't complete. Opens <strong>Move-ins &amp; Move-outs</strong>.</li><li><strong>Pending applications</strong> (Routine): applications Submitted or in Screening. Opens <strong>Applications</strong>.</li></ul>$html$,
      '[]',
      50
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"Building2","label":"Properties & units","href":"/help/property/properties"},{"icon":"CircleDollarSign","label":"Rent & payments","href":"/help/property/payments"},{"icon":"ChartColumn","label":"Reports","href":"/help/property/reports"}]',
      200
    )
) as v(anchor_id, eyebrow, title, content, links, sort_order)
cross join (select id from public.docs_pages where slug = 'property/property-overview' and deleted_at is null) p;

-- @down
-- Restores the draft exactly as 20261024191900_help_property_structure left it.
update public.docs_pages
set title = 'Property overview',
    description = 'The workspace home screen: occupancy, rent collection, leasing and maintenance across your portfolio.',
    status = 'draft',
    published_at = null
where slug = 'property/property-overview' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'property/property-overview' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Portfolio figures</li><li>Rent over time and unit status mix</li><li>Leasing funnel, occupancy and collection rates</li><li>Top performing properties</li><li>Needs attention</li></ul>',
  10
from public.docs_pages p
where p.slug = 'property/property-overview' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
