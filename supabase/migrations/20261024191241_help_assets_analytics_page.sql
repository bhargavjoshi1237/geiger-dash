-- Help assets analytics page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the assets/analytics draft outline
-- (20261024191200_help_assets_structure) with the full Analytics guide and publishes it. No section showcases exist
-- for Assets yet. Reports & Exports is left out: nothing in Assets creates saved reports, so it stays empty.
-- Written from a survey of C:\Pro\geiger-assets (components/internal/screens/projects/analytics/* (analytics_screen,
-- models.js, constants.js, analytics_kit.jsx, analytics_chart.jsx, storage_treemap.jsx, use_search_tracking.js),
-- lib/supabase/analytics.js, lib/supabase/delivery.js, lib/storage/delivery_log.js).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Analytics',
    description = 'See how a project''s assets are served, searched, viewed in galleries, sold and licensed, check library health and storage, and export the data.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'assets/analytics' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'assets/analytics' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, showcase, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.showcase, v.sort_order
from (
  values
    (
      'reading-analytics',
      'Basics',
      'Reading analytics',
      $html$<p>The <strong>Analytics</strong> group in a project's sidebar has a screen for each part of Assets, and they all work the same way. Open a project in Assets and choose one under <strong>Analytics</strong>, such as <strong>Analytics → Asset Analytics</strong>.</p><ul><li>Four figures across the top. Each one's footnote says what it covers: the selected period, or the library as it is now.</li><li>A period menu: <strong>Last 7 days</strong>, <strong>Last 30 days</strong> (the default) or <strong>Last 90 days</strong>.</li><li>Charts of trends, rankings and mixes for that period.</li><li><strong>Export</strong>: <strong>Export CSV</strong> saves the numbers behind every chart, and <strong>Export PNG</strong> saves an image of the first chart that has data.</li></ul><p>Until there's data, a screen shows "No analytics yet" with what it's waiting for. Figures are worked out from the project's records each time you open the screen.</p>$html$,
      '[]',
      null,
      10
    ),
    (
      'asset-analytics',
      'Asset Analytics',
      'Asset analytics',
      $html$<p><strong>Analytics → Asset Analytics</strong> shows how assets are used.</p><ul><li>Figures: <strong>Delivery requests</strong> and <strong>Gallery item views</strong> in the period, <strong>Recorded downloads</strong> over each asset's lifetime, and the number of <strong>Assets</strong>.</li><li>Charts: <strong>Delivery trend</strong> (requests each day), <strong>Most delivered assets</strong>, <strong>Most downloaded assets</strong>, and <strong>Gallery engagement</strong> (item views, downloads and favorites in galleries).</li></ul><p>Delivery requests are the times Assets served the project's files, such as previews and downloads.</p>$html$,
      '[]',
      null,
      20
    ),
    (
      'search-analytics',
      'Search Analytics',
      'Search analytics',
      $html$<p><strong>Analytics → Search Analytics</strong> shows how people search the library, so you can see what they can't find.</p><ul><li>Figures: <strong>Searches</strong>, the <strong>Zero result rate</strong>, the <strong>Click through</strong> rate (searches where someone opened a result) and <strong>Unique queries</strong>.</li><li>Charts: <strong>Search activity</strong> (searches and zero-result searches each day), <strong>Top queries</strong>, <strong>Queries with no results</strong> and <strong>Filter usage</strong>.</li></ul><p>A search counts when someone types in the search box on the Asset Library or All Media and pauses, and opening a result from it marks that search as clicked. Queries are compared in lowercase with extra spaces removed. The <strong>Queries with no results</strong> chart is a list of terms that need better tags or descriptions.</p>$html$,
      '[]',
      null,
      30
    ),
    (
      'portal-analytics',
      'Portal Analytics',
      'Portal analytics',
      $html$<p><strong>Analytics → Portal Analytics</strong> shows how visitors use your published galleries.</p><ul><li>Figures: <strong>Gallery views</strong>, <strong>Active visitors</strong> (distinct visitors recorded), <strong>Downloads</strong> and the <strong>Download rate</strong> (downloads per gallery view).</li><li>Charts: <strong>Visitor activity</strong> (views and downloads each day), <strong>Most viewed galleries</strong>, <strong>Visitor actions</strong> and <strong>Most downloaded galleries</strong>.</li></ul><p>Per-gallery totals, favorites and download requests are on Showcase Galleries; see <a href="/help/assets/galleries#showcase-galleries">Galleries</a>.</p>$html$,
      '[]',
      null,
      40
    ),
    (
      'library-health',
      'Library Health',
      'Library health',
      $html$<p><strong>Analytics → Library Health</strong> points out where the library needs tidying.</p><ul><li><strong>Metadata complete</strong>: the share of assets with both a description and tags. <strong>Needs metadata</strong> counts the rest.</li><li><strong>Expired rights</strong>: rights records still marked Active whose window has ended.</li><li>Charts: <strong>Asset status</strong> across the library, <strong>Metadata gaps by type</strong>, <strong>Assets added</strong> each day, and <strong>Rights status</strong>.</li></ul><p>To fill in metadata, open the asset in the Asset Library; to fix a rights record, open it in Rights Inventory. See <a href="/help/assets/library#editing-details">Asset library</a> and <a href="/help/assets/licensing#rights-inventory">Licensing</a>.</p>$html$,
      '[]',
      null,
      50
    ),
    (
      'storage-and-usage',
      'Storage & Usage',
      'Storage and usage',
      $html$<p><strong>Analytics → Storage & Usage</strong> shows what the library stores and how much it serves.</p><ul><li>Figures: <strong>Stored</strong> (the library's current size), <strong>Bandwidth</strong> and <strong>Delivery requests</strong> in the period, and <strong>Transformed serves</strong>.</li><li>Charts: <strong>Bandwidth trend</strong>, <strong>Storage by media type</strong>, <strong>Largest assets</strong> and <strong>Transform formats</strong>.</li><li><strong>Storage map</strong>: each folder's size as an area. Click a folder to see its assets, and use the path at the top to go back.</li></ul><p>The project's storage quota and limits are set under <strong>Settings → Usage & Storage</strong>, a different screen; see <a href="/help/assets/settings">Project settings</a>.</p>$html$,
      '[]',
      null,
      60
    ),
    (
      'commerce-analytics',
      'Commerce Analytics',
      'Commerce analytics',
      $html$<p><strong>Analytics → Commerce Analytics</strong> shows gallery sales.</p><ul><li>Figures: <strong>Net paid value</strong> (paid orders less refunds), <strong>Paid orders</strong>, the <strong>Average order</strong> and the amount <strong>Refunded</strong>.</li><li>Charts: <strong>Paid value</strong> by day, <strong>Top products</strong>, <strong>Order status</strong> and <strong>Order flow</strong> (orders created and paid each day).</li></ul><p>Money figures use the currency of the period's first paid order, and a footnote counts any orders in another currency. Orders themselves are on Orders & Invoices; see <a href="/help/assets/galleries/store#orders-and-invoices">Store and orders</a>.</p>$html$,
      '[]',
      null,
      70
    ),
    (
      'license-analytics',
      'License Analytics',
      'License analytics',
      $html$<p><strong>Analytics → License Analytics</strong> shows the value and risk in your issued licenses.</p><ul><li>Figures: <strong>Issued fee value</strong> and licenses <strong>Issued</strong> in the period, <strong>Active licenses</strong>, and those <strong>Expiring in 30 days</strong>.</li><li>Charts: <strong>Issued fee trend</strong>, <strong>Territory mix</strong> of active licenses, <strong>License status</strong>, and <strong>Licensed assets</strong> (how often each asset appears on licenses issued in the period).</li></ul><p>Like commerce, fee figures use the currency of the period's first issued license. See <a href="/help/assets/licensing">Licensing</a>.</p>$html$,
      '[]',
      null,
      80
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"Cloud","label":"Delivery","href":"/help/assets/delivery"},{"icon":"Store","label":"Store & orders","href":"/help/assets/galleries/store"},{"icon":"BadgeCheck","label":"Licensing","href":"/help/assets/licensing"}]',
      null,
      90
    )
) as v(anchor_id, eyebrow, title, content, links, showcase, sort_order)
cross join (select id from public.docs_pages where slug = 'assets/analytics' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Analytics',
    description = 'See how assets are found, used, delivered and sold, and export reports.',
    status = 'draft',
    published_at = null
where slug = 'assets/analytics' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'assets/analytics' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Asset analytics</li><li>Search analytics</li><li>Portal analytics</li><li>Library health</li><li>Storage and usage</li><li>Commerce analytics</li><li>License analytics</li><li>Reports and exports</li></ul>',
  10
from public.docs_pages p
where p.slug = 'assets/analytics' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
