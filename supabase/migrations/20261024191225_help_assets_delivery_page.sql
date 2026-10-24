-- Help assets delivery page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the assets/delivery draft outline
-- (20261024191200_help_assets_structure) with the full Delivery guide and publishes it. No section showcases exist
-- for Assets yet. Left out on purpose: CDN Delivery's edge configuration, delivery domains and cache invalidation
-- (saved or simulated only; nothing serves or purges from them), and the Dynamic Images, Video Delivery,
-- Embeds & Headless and Channel Publishing screens (their links and destinations have nothing serving or sending
-- them).
-- Written from a survey of C:\Pro\geiger-assets (components/internal/screens/projects/delivery/*,
-- components/internal/screens/projects/library/sections/delivery_section.jsx,
-- components/internal/screens/projects/analytics/analytics_kit.jsx, constants.js,
-- app/d/[projectId]/[assetId]/[...rest]/route.js, lib/image/transform.js, lib/delivery/*,
-- lib/storage/delivery_log.js, app/api/assets/[id]/file/route.js, lib/supabase/delivery.js,
-- supabase/migrations/20260921000000_delivery.sql).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Delivery',
    description = 'Serve assets to websites and apps from public delivery addresses, resize and convert images in the address, and follow file traffic.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'assets/delivery' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'assets/delivery' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, showcase, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.showcase, v.sort_order
from (
  values
    (
      'delivering-an-asset',
      'Basics',
      'Delivering an asset',
      $html$<p>Delivery gives an asset a public address that a website or app can load it from, without signing in. To turn it on, open the asset in the Asset Library, choose <strong>Edit</strong>, open the <strong>Delivery</strong> section, turn on <strong>Enable delivery</strong> and choose <strong>Save Changes</strong>.</p><p>To copy the address, choose <strong>Share → Copy delivery link</strong> in the asset's <strong>⋯</strong> menu in the Asset Library, or <strong>Copy URL</strong> for an optimized copy or a 512 px thumbnail of an image. The Delivery section also builds transformed addresses for you.</p><ul><li>New uploads start with delivery on while the project's <strong>Deliver new assets by default</strong> setting is on under <strong>Settings → General</strong>, as it is to start. Turn that setting off to make delivery something you turn on asset by asset.</li><li>While delivery is off, or once the asset is in the trash, its addresses return not found.</li></ul><p>The asset editor's Delivery section is covered in <a href="/help/assets/library#delivery-and-transforms">Asset library</a>.</p>$html$,
      '[]',
      null,
      10
    ),
    (
      'delivery-addresses',
      'Concepts',
      'Delivery addresses and transforms',
      $html$<p>A delivery address ends in <code>/d/</code>, the project's ID, the asset's ID and the file name. To get a transformed image, add transform steps before the file name, like <code>/d/…/w_800,h_600,c_fill,f_auto,q_auto/hero.jpg</code>.</p><ul><li><code>w_</code> and <code>h_</code>: width and height in pixels.</li><li><code>c_</code>: how the image fits the size: <code>fill</code>, <code>fit</code>, <code>cover</code>, <code>contain</code>, <code>pad</code>, <code>crop</code> or <code>thumb</code>.</li><li><code>f_</code>: the format: <code>auto</code>, <code>webp</code>, <code>avif</code>, <code>jpg</code> or <code>png</code>.</li><li><code>q_</code>: quality, <code>auto</code> or 1 to 100.</li><li><code>e_</code>: an effect: <code>blur</code>, <code>sharpen</code>, <code>grayscale</code>, <code>sepia</code>, <code>negate</code>, <code>brightness</code>, <code>contrast</code>, <code>saturation</code> or <code>tint</code>, with an optional value after a colon, like <code>e_blur:400</code>.</li></ul><p>Separate steps with commas, and add another <code>/</code> segment to apply more steps after the first. Transforms work on images, and only when the project's <strong>URL transforms</strong> setting is on under <strong>Settings → General</strong>; with it off, Assets serves originals only and refuses transform addresses.</p><p>The largest size, the formats and the effects an address can ask for are set in <strong>Platform → API → Delivery Settings</strong>; by default up to 4000 px a side and 25 megapixels. See <a href="/help/assets/platform">Platform and API</a>.</p>$html$,
      '[]',
      null,
      20
    ),
    (
      'who-can-load-addresses',
      'Concepts',
      'Who can load delivery addresses',
      $html$<p>Delivery addresses are public: anyone with the address can load the file, without signing in. Two settings in <strong>Platform → API → Delivery Settings</strong> narrow that for the whole project.</p><ul><li><strong>Referrer allowlist</strong>: only pages on the websites you list can load the files. Left empty, every site can.</li><li><strong>Require signed URLs</strong>: every address needs a signature, which you get through the Assets API. Once you save it on, addresses without a valid signature stop working.</li></ul><p>Settings in <strong>Shared Links</strong> don't affect delivery addresses; a shared link is a separate page. See <a href="/help/assets/platform">Platform and API</a> and <a href="/help/assets/collaboration">Collaboration</a>.</p>$html$,
      '[]',
      null,
      30
    ),
    (
      'cdn-delivery',
      'CDN Delivery',
      'CDN Delivery',
      $html$<p><strong>Delivery → CDN Delivery</strong> lists the project's assets with the traffic Assets has logged for each. The figures across the top show <strong>CDN storage</strong> (the size of assets with CDN switched on, and how many of all assets that is), <strong>Requests</strong>, <strong>Bandwidth</strong> and the <strong>Cache-hit ratio</strong>.</p><p>Each row shows the asset's format and size, its requests and bandwidth, and a <strong>CDN</strong> switch. Filter by <strong>All assets</strong>, <strong>CDN on</strong> or <strong>CDN off</strong>, or search by name and format.</p><p>The CDN switch marks an asset as published to the CDN, saves straight away, and starts any workflow with the Asset published trigger. It doesn't decide whether the asset's delivery address works; that's the asset's own <strong>Enable delivery</strong> setting.</p><p>Requests are the times Assets served the project's files, such as previews and downloads. A request counts as a cache hit when the browser already had the current file.</p>$html$,
      '[]',
      null,
      40
    ),
    (
      'delivery-analytics',
      'Delivery Analytics',
      'Delivery Analytics',
      $html$<p><strong>Delivery → Delivery Analytics</strong> charts the project's file traffic over <strong>Last 7 days</strong>, <strong>Last 30 days</strong> (the default) or <strong>Last 90 days</strong>.</p><ul><li>Figures: <strong>Delivery requests</strong>, <strong>Bandwidth</strong>, <strong>Cache hit ratio</strong> and <strong>CDN coverage</strong> (assets with CDN on, out of all assets).</li><li>Charts: bandwidth over time, cache hits and misses each day, top delivered assets, requests by country, transform formats, and CDN coverage.</li></ul><p><strong>Export</strong> has <strong>Export CSV</strong>, which saves the numbers behind every chart, and <strong>Export PNG</strong>, which saves an image of the first chart with data. Until files have been served, the screen shows "No delivery data yet".</p>$html$,
      '[]',
      null,
      50
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"Image","label":"Media","href":"/help/assets/media"},{"icon":"Code","label":"Platform & API","href":"/help/assets/platform"},{"icon":"ChartColumn","label":"Analytics","href":"/help/assets/analytics"}]',
      null,
      60
    )
) as v(anchor_id, eyebrow, title, content, links, showcase, sort_order)
cross join (select id from public.docs_pages where slug = 'assets/delivery' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Delivery',
    description = 'Serve assets to websites and apps through the CDN, image transforms, video, embeds and connected channels.',
    status = 'draft',
    published_at = null
where slug = 'assets/delivery' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'assets/delivery' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>CDN delivery</li><li>Dynamic images</li><li>Video delivery</li><li>Embeds and headless</li><li>Channel publishing</li><li>Delivery analytics</li></ul>',
  10
from public.docs_pages p
where p.slug = 'assets/delivery' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
