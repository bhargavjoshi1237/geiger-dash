-- Help pods monitoring page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the pods/monitoring draft outline (from
-- 20261024191500_help_pods_structure) with the full Monitoring guide (Dashboard, Logs, Alarms, Log Exports) and
-- publishes it. The Email channel type is left out: it only works when a suite mailer is configured on the server.
-- No Pods showcases exist, so the page embeds none.
-- Written from a survey of C:\Pro\geiger-pods (components/internal/screens/monitoring/monitoring_overview.jsx,
-- logs_screen.jsx, alarms_screen.jsx, exports_screen.jsx, lib/control/metrics.mjs, logs.mjs, alarms.mjs, log-sinks.mjs,
-- app/api/internal/jobs/alarms/route.js).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Monitoring',
    description = 'Watch requests, errors and latency across your APIs, search request logs, set alarms with notifications, and export logs to your own systems.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'pods/monitoring' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'pods/monitoring' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.sort_order
from (
  values
    (
      'monitoring-dashboard',
      'Dashboard',
      'The monitoring dashboard',
      $html$<p>To see how your APIs are doing, choose <strong>Monitoring → Dashboard</strong> in the Pods sidebar. Narrow it with the <strong>API</strong> and <strong>Stage</strong> filters, and pick a <strong>Time range</strong>: <strong>Last hour</strong>, <strong>Last 24 hours</strong> (the default), <strong>Last 7 days</strong> or <strong>Last 30 days</strong>. <strong>Refresh</strong> loads the latest numbers.</p><ul><li><strong>Requests</strong>, <strong>4XX errors</strong> and <strong>5XX errors</strong>: totals for the range, with each error type as a share of requests.</li><li><strong>Latency p90</strong>: the time nine in ten requests finish within, with p99 beneath.</li><li><strong>Traffic</strong>: requests and errors per 5 minutes, hour or day, depending on the range.</li><li><strong>Latency</strong>: p50, p90 and p99 over the same intervals.</li><li><strong>Latency and cache</strong>: for the most recent interval, the three latency percentiles, <strong>Integration p90</strong> (time spent waiting on the backend) and the <strong>Cache hit ratio</strong> for REST stages that cache.</li></ul><p>Test invocations from the API editor aren't counted. Each API also has a <strong>Monitoring</strong> section in the API editor that shows the same dashboard for that API alone.</p>$html$,
      '[]',
      10
    ),
    (
      'searching-logs',
      'Logs',
      'Searching request logs',
      $html$<p>Choose <strong>Monitoring → Logs</strong> to see access log lines from live traffic, newest first. Lines appear once a stage with access logging turned on serves requests, as the <a href="/help/pods/apis/deployments-and-stages">Deployments and stages</a> guide describes. Everyone on the project can open Logs.</p><ul><li><strong>Status class</strong>: 2xx success, 4xx client errors or 5xx server errors.</li><li><strong>Stage</strong>: the stages seen in recent lines.</li><li><strong>Search by</strong>: <strong>Request ID</strong>, <strong>Route</strong> or <strong>Source IP</strong>. Search matches the whole value exactly.</li></ul><p>Each line shows the request, its status, stage, source IP and time. The screen loads the latest 50 lines; choose <strong>Live tail</strong> to refresh them every 2 seconds, and again to stop. Click a line, or choose <strong>Open</strong> in its <strong>⋯</strong> menu, to see the request's details. <strong>Copy request ID</strong> copies its ID.</p>$html$,
      '[]',
      20
    ),
    (
      'request-details',
      'Logs',
      'Request details and traces',
      $html$<p>Opening a line in <strong>Monitoring → Logs</strong> shows everything recorded for that request. <strong>All Logs</strong> goes back.</p><ul><li><strong>Access log</strong>: the time, status, stage, route, source IP and request ID.</li><li><strong>Execution log</strong>: each step the gateway took. It's recorded only when the stage's execution logging level is Errors only or Info.</li><li><strong>Trace</strong>: the spans of the request's trace, in start order, when the stage has tracing on and the request was sampled.</li></ul><p>Request and response bodies appear in the execution log only when the stage has data trace on, and only Owners, Admins and Managers can see them. For Members they're hidden.</p>$html$,
      '[]',
      30
    ),
    (
      'creating-an-alarm',
      'Alarms',
      'Creating an alarm',
      $html$<p>An alarm watches one gateway metric and notifies you when it crosses a threshold. Choose <strong>Monitoring → Alarms</strong>, then <strong>New Alarm</strong>. Only Owners and Admins can manage alarms.</p><ul><li><strong>Name</strong>: required, up to 128 characters.</li><li><strong>Metric</strong>: grouped as REST (such as Count, 4XXError, 5XXError, Latency), HTTP (4xx, 5xx, DataProcessed), WebSocket (such as ConnectCount, MessageCount) and Gateway (such as ThrottleCount, QuotaRejectCount, AuthorizerLatency).</li><li><strong>Statistic</strong>: Sum (the default), Average, Minimum, Maximum, SampleCount, p50, p90, p95 or p99.</li><li><strong>Comparison</strong> and <strong>Threshold</strong>: greater than, greater than or equal, less than, or less than or equal to a number. They start at greater than 10.</li><li><strong>Period (seconds)</strong>: a multiple of 60, 300 to start with.</li><li><strong>Evaluation periods (N)</strong> and <strong>Datapoints to alarm (M)</strong>: the alarm breaches when M of the last N periods breach, 2 of 3 to start with. N is 1 to 60.</li><li><strong>Treat missing data as</strong>: Missing (keep state), the default; Not breaching; Breaching; or Ignore.</li></ul><p>Choose <strong>Create Alarm</strong>. The alarm's page opens, where you pick who gets notified.</p>$html$,
      '[]',
      40
    ),
    (
      'alarm-states',
      'Alarms',
      'Alarm states and history',
      $html$<p>Every alarm is in one of three states: <strong>OK</strong> (within the threshold), <strong>In alarm</strong> (breaching) or <strong>Insufficient data</strong> (not enough datapoints to decide). The figures on the Alarms screen count <strong>Total alarms</strong> and each state.</p><p>Filter the list by <strong>State</strong>, or search by name or metric. Each row shows the alarm's state, the reason for it and when it last changed. Its <strong>⋯</strong> menu has <strong>Edit</strong> (or <strong>Open</strong>), <strong>View history</strong>, <strong>Enable</strong> or <strong>Disable</strong>, and <strong>Delete</strong>.</p><p>On the alarm's page, <strong>Condition</strong> holds the settings from when you created it, plus a description, and the switch at the top turns the alarm on or off. Choose <strong>Save Changes</strong> after editing. <strong>History</strong> lists each state change with its reason, newest first. Deleting an alarm asks you to confirm, stops its evaluation and removes its history; it can't be undone.</p>$html$,
      '[]',
      50
    ),
    (
      'alarm-notifications',
      'Alarms',
      'Alarm notifications',
      $html$<p>Alarms notify <strong>notification channels</strong>, which every alarm in the project shares. Open an alarm and choose <strong>Notifications</strong>.</p><ol><li>Under <strong>Notification channels</strong>, choose <strong>New Channel</strong>.</li><li>Type a <strong>Name</strong>, pick the <strong>Type</strong>, <strong>Webhook</strong> or <strong>Slack webhook</strong>, and type its <strong>URL</strong>. It must be an <code>https</code> address.</li><li>Choose <strong>Create Channel</strong>.</li><li>Under <strong>Notify on state change</strong>, select the channels for each change: <strong>Enters alarm</strong>, <strong>Returns to OK</strong> and <strong>Insufficient data</strong>.</li><li>Choose <strong>Save Changes</strong>.</li></ol><p>Each state change notifies its channels once. A webhook receives a JSON POST with the alarm and the reason, and a Slack webhook receives a short message. To remove a channel, choose <strong>Delete</strong> in its <strong>⋯</strong> menu and confirm. Alarms that notified it stop sending there.</p>$html$,
      '[]',
      60
    ),
    (
      'log-exports',
      'Log exports',
      'Exporting logs',
      $html$<p>Log exports send access log lines to your own systems. Each destination is a <strong>sink</strong>. Choose <strong>Monitoring → Log Exports</strong>, then <strong>New Sink</strong>. Only Owners and Admins can manage sinks.</p><ul><li><strong>HTTPS</strong>: signed batches of NDJSON posted to your <strong>URL</strong>. <strong>Signing secret ref</strong> names the secret used to sign them, in the <code>x-pods-signature</code> header.</li><li><strong>S3</strong>: gzipped NDJSON objects in an S3-compatible <strong>Bucket</strong>, under an optional <strong>Prefix</strong>, using the secret in <strong>Credentials ref</strong>.</li><li><strong>OTLP logs</strong>: log records sent to an OpenTelemetry collector's <strong>Endpoint</strong>.</li></ul><p>Secret refs take the form <code>secret:</code> followed by a secret's ID, and optionally <code>@</code> and a version. Choose <strong>Create Sink</strong>. A sink receives nothing until a stage sends to it: add the sink's ID to the stage's access log <strong>Destinations</strong>.</p>$html$,
      '[]',
      70
    ),
    (
      'managing-sinks',
      'Log exports',
      'Managing sinks',
      $html$<p>The Log Exports screen counts <strong>Total sinks</strong> and how many are <strong>Active</strong>, <strong>Failing</strong> (the last delivery failed) or <strong>Disabled</strong>. Filter by <strong>Type</strong> and <strong>Status</strong>, or search by name, destination or ID.</p><p>Each sink's <strong>⋯</strong> menu has <strong>Send test batch</strong> for HTTPS sinks, <strong>Copy sink ID</strong>, <strong>Enable</strong> or <strong>Disable</strong>, and <strong>Delete</strong>. A sink's page shows its destination, a <strong>Deliver logs</strong> switch, its <strong>Last delivery</strong>, its <strong>Last error</strong> and its <strong>Sink ID</strong>. A disabled sink sends nothing, and stages keep pointing at it until you turn it back on.</p><p>Deleting a sink asks you to confirm. Stages that sent logs to it stop exporting there, and it can't be undone.</p>$html$,
      '[]',
      80
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"LayoutDashboard","label":"Project overview","href":"/help/pods/project-overview"},{"icon":"Rocket","label":"Deployments & stages","href":"/help/pods/apis/deployments-and-stages"},{"icon":"Ticket","label":"Usage plans & API keys","href":"/help/pods/usage"}]',
      90
    )
) as v(anchor_id, eyebrow, title, content, links, sort_order)
cross join (select id from public.docs_pages where slug = 'pods/monitoring' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Monitoring',
    description = 'Watch traffic, errors and latency across your APIs, search request logs, set alarms and export logs.',
    status = 'draft',
    published_at = null
where slug = 'pods/monitoring' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'pods/monitoring' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>The monitoring dashboard</li><li>Request logs</li><li>Alarms</li><li>Log exports</li></ul>',
  10
from public.docs_pages p
where p.slug = 'pods/monitoring' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
