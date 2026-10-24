-- Help pods project overview page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the pods/project-overview draft outline
-- (from 20261024191500_help_pods_structure) with the full Project overview guide and publishes it. The playground's
-- sample data (DEMO_* in overview_data.mjs) is never described. No Pods showcases exist, so the page embeds none.
-- Written from a survey of C:\Pro\geiger-pods (components/internal/screens/overview/pods_overview.jsx,
-- overview_data.mjs, filter_dropdown.jsx, lib/control/metrics.mjs (getDashboard)).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Project overview',
    description = 'Read the project''s Overview in Pods: two weeks of requests, errors, latency and throttling, how each API is doing, and what needs attention.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'pods/project-overview' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'pods/project-overview' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.sort_order
from (
  values
    (
      'opening-the-overview',
      'Basics',
      'Opening the overview',
      $html$<p>A project opens in Pods on its <strong>Overview</strong>, the first entry in the sidebar. It sums up traffic across every API in the project over the last 14 days. All its numbers come from live gateway traffic; until a deployed stage serves requests, the charts say there's no traffic yet.</p><p>The top right counts the project's <strong>APIs</strong>, its <strong>API Keys</strong> and the alarms <strong>In Alarm</strong>. Beneath, four figures cover the last 14 days, each with its change from the 14 days before:</p><ul><li><strong>Requests</strong>: every request the gateway answered.</li><li><strong>Errors</strong>: 4XX and 5XX responses together.</li><li><strong>p90 Latency</strong>: the time nine in ten requests finished within.</li><li><strong>Throttled</strong>: requests turned away by a throttle or quota.</li></ul><p>A rise in errors, latency or throttling counts as a change for the worse.</p>$html$,
      '[]',
      10
    ),
    (
      'traffic-charts',
      'Overview',
      'Traffic charts',
      $html$<p>The Overview's charts break the last 14 days of traffic down by day, by API and by outcome.</p><ul><li><strong>Traffic Over Time</strong>: a daily line for the metric you pick in <strong>Trend metric</strong>: Requests (the default), Errors or Throttled. Use the API filter beside it to show all APIs or only the ones you select.</li><li><strong>Traffic by API</strong>: each API's share of requests, for the five busiest APIs plus Other. Pick one in <strong>Highlighted API</strong> to see its number.</li><li><strong>Request Outcomes</strong>: the share of requests that Succeeded (2XX and 3XX), got a 4XX or a 5XX, were Throttled or over quota, or were served from the stage cache.</li><li><strong>Availability</strong>: the share of requests answered without a 5XX.</li><li><strong>Cache Hit Rate</strong>: the share of stage cache lookups that found a cached response.</li></ul><p>The Availability and Cache Hit Rate gauges each have their own API filter too.</p>$html$,
      '[]',
      20
    ),
    (
      'top-apis',
      'Overview',
      'Top APIs and their health',
      $html$<p><strong>Top APIs</strong> ranks the project's APIs over the last 14 days. Sort it in <strong>Sort APIs by</strong>: Requests, Error rate or Latency. Each row shows the API's protocol, error rate, requests, p90 latency and health, and the arrow at the end opens the API in the API editor.</p><ul><li><strong>Healthy</strong>: under both thresholds for Degraded.</li><li><strong>Degraded</strong>: 1% or more of requests got a 5XX, or 10% or more got any error.</li><li><strong>Failing</strong>: 5% or more of requests got a 5XX.</li><li><strong>No traffic</strong>: no requests in the 14 days.</li></ul>$html$,
      '[]',
      30
    ),
    (
      'needs-attention',
      'Overview',
      'What needs attention',
      $html$<p><strong>Needs Attention</strong> counts the things worth a look, most urgent first. Click one to go to the screen that deals with it.</p><ul><li><strong>Alarms firing</strong>, with the names of the first two, and <strong>Awaiting data</strong>, alarms with no datapoints yet: both open <strong>Monitoring → Alarms</strong>.</li><li><strong>Failing APIs</strong> and <strong>Degraded APIs</strong>, by the health rules in Top APIs: open the monitoring dashboard.</li><li><strong>Throttled</strong>: requests that hit a rate limit or quota, which opens <strong>Usage → Usage Plans</strong>.</li><li><strong>Idle APIs</strong>: APIs with no traffic in the last 14 days, which opens <strong>APIs</strong>.</li></ul>$html$,
      '[]',
      40
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"Activity","label":"Monitoring","href":"/help/pods/monitoring"},{"icon":"Network","label":"APIs","href":"/help/pods/apis"},{"icon":"Ticket","label":"Usage plans & API keys","href":"/help/pods/usage"}]',
      50
    )
) as v(anchor_id, eyebrow, title, content, links, sort_order)
cross join (select id from public.docs_pages where slug = 'pods/project-overview' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Project overview',
    description = 'The project''s home screen in Pods: traffic, errors and latency across its APIs, and what needs attention.',
    status = 'draft',
    published_at = null
where slug = 'pods/project-overview' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'pods/project-overview' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Opening the overview</li><li>Traffic and outcome figures</li><li>Top APIs and what needs attention</li></ul>',
  10
from public.docs_pages p
where p.slug = 'pods/project-overview' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
