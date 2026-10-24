-- Help pods deployments stages page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the pods/apis/deployments-and-stages draft
-- outline (from 20261024191500_help_pods_structure) with the full Deployments & stages guide and publishes it.
-- Left out on purpose: the stage's Canary tab (a canary can only start at the stage's current deployment, and
-- nothing in the UI deploys a new revision to it), and the Deploy dialog's "Create the stage if it doesn't exist"
-- switch (it isn't sent; a new stage name is always created). Testing a method lives on
-- pods/apis/resources-and-routes, where the Test request panel is. No Pods showcases exist, so the page embeds none.
-- Written from a survey of C:\Pro\geiger-pods (components/internal/screens/releases/deploy_dialog.jsx,
-- deployments_tab.jsx, stages_tab.jsx, cache_tab.jsx, canary_tab.jsx, components/internal/screens/usage/stage_throttle_tab.jsx,
-- components/internal/screens/monitoring/stage_logging_tab.jsx, lib/control/deployments.mjs, stages.mjs, canary.mjs,
-- stage-cache.mjs, stage-observability.mjs, lib/gateway/artifact/stage-variables.mjs).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Deployments & stages',
    description = 'Deploy an API''s draft to a stage, compare and roll back deployments, and set each stage''s variables, caching, throttling and logging.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'pods/apis/deployments-and-stages' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'pods/apis/deployments-and-stages' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.sort_order
from (
  values
    (
      'deploying-an-api',
      'Basics',
      'Deploying an API',
      $html$<p>Deploying takes a snapshot of the API's draft, called a <strong>deployment</strong>, and points a stage at it. Callers only see changes once they're deployed. Owners, Admins and Managers can deploy.</p><ol><li>Open the API from <strong>APIs</strong> and choose <strong>Deploy</strong> at the top of the API editor.</li><li>Optional: in <strong>Description</strong>, write release notes for the deployments list, up to 1,024 characters.</li><li>In <strong>Stage</strong>, pick an existing stage or type a new name, such as <code>prod</code>.</li><li>Choose <strong>Deploy</strong>.</li></ol><p>A new stage name creates the stage, serving this deployment. An existing stage switches to it straight away. If the draft can't be deployed as it is, the dialog shows why and nothing changes.</p><p>Stage names are 1 to 128 letters, digits, <code>_</code> and <code>-</code>. HTTP and WebSocket APIs can also use <code>$default</code>. Pods allows one deployment every 2 seconds per API.</p>$html$,
      '[]',
      10
    ),
    (
      'deployments-list',
      'Deployments',
      'The deployments list',
      $html$<p>Choose <strong>Deployments</strong> in the API editor's section list to see the API's deployments, newest first. Each row shows the deployment's short ID and digest, its <strong>Description</strong>, when it was <strong>Created</strong>, and which stages it's <strong>Serving</strong>.</p><p>Each row's <strong>⋯</strong> menu has:</p><ul><li><strong>Deploy to</strong> each stage, such as <strong>Deploy to prod</strong>. Pods asks you to confirm, then the stage's live traffic switches to that deployment at once. Use it to go back to an earlier deployment too.</li><li><strong>Compare</strong>, to see what changed between two deployments.</li><li><strong>Copy deployment ID</strong>.</li></ul><p>Deployments can't be edited, because each one is a fixed snapshot. The list shows 25 a page; switch to 10, 50 or 100 at the bottom.</p>$html$,
      '[]',
      20
    ),
    (
      'comparing-deployments',
      'Deployments',
      'Comparing deployments',
      $html$<p>To compare two deployments, choose <strong>Compare</strong> in one deployment's <strong>⋯</strong> menu in the API editor's Deployments section, then <strong>Compare</strong> in another's. The first one is marked Comparing while you pick the second.</p><p><strong>Changes</strong> then lists each setting that differs, with its old value and its new value, up to 50 changes. "No differences" means the two snapshots are identical. Choose <strong>Clear</strong> to close the comparison.</p>$html$,
      '[]',
      30
    ),
    (
      'stages',
      'Stages',
      'Stages and invoke URLs',
      $html$<p>A <strong>stage</strong> is a named environment, such as <code>dev</code> or <code>prod</code>, that serves one deployment at its own <strong>invoke URL</strong>: the address callers use. You create a stage by deploying to a new stage name.</p><p>Choose <strong>Stages</strong> in the API editor's section list to see each stage, which deployment it's <strong>Serving</strong> (or No deployment yet), and its <strong>Invoke URL</strong>, with a copy icon beside it. A stage Pods redeploys on every draft change carries an <strong>Auto-deploy</strong> badge.</p><p>Click a stage, or choose <strong>Open</strong> in its <strong>⋯</strong> menu, to open it. Its tabs are <strong>Settings</strong>, <strong>Cache</strong>, <strong>Throttling</strong>, <strong>Logs & tracing</strong> and <strong>History</strong>. <strong>All stages</strong> goes back to the list.</p>$html$,
      '[]',
      40
    ),
    (
      'stage-variables',
      'Stages',
      'Stage variables',
      $html$<p>Stage variables are name and value pairs that integrations and mapping templates read on that stage, so one deployment can call a different backend on each stage. For example, an integration's URI can use <code>${stageVariables.backend}</code>.</p><p>To set them, open the stage from the API editor's Stages section and edit <strong>Variables (JSON)</strong> on its <strong>Settings</strong> tab, such as <code>{"backend": "api.example.com"}</code>. Then choose <strong>Save Changes</strong>.</p><ul><li>Names are up to 64 letters, digits and underscores.</li><li>Values are up to 512 characters of letters, digits and <code>- . _ ~ : / ? # & = ,</code>.</li><li>A stage holds up to 100 variables.</li></ul><p>Owners, Admins and Managers can change stage variables; others see them read-only.</p>$html$,
      '[]',
      50
    ),
    (
      'history-and-rollback',
      'Stages',
      'Stage history and rolling back',
      $html$<p>A stage's <strong>History</strong> tab lists every time it moved to a different deployment: when it was Created, each Deploy, Rollback and Auto-deploy, which deployment it moved from and to, and when. You can also open it with <strong>Deployment history</strong> in the stage's <strong>⋯</strong> menu. <strong>Reload</strong> fetches it again.</p><p>To undo a change, choose <strong>Roll back to previous</strong> in that entry's <strong>⋯</strong> menu. Pods asks you to confirm, then points the stage back at the deployment it served before that change, and live traffic switches immediately. Owners, Admins and Managers can roll back.</p>$html$,
      '[]',
      60
    ),
    (
      'caching',
      'Stages',
      'Caching responses',
      $html$<p>A REST API stage can cache GET responses for up to an hour. Open the stage from the API editor's Stages section and choose its <strong>Cache</strong> tab.</p><ul><li><strong>Enable cache</strong>: off by default.</li><li><strong>Capacity (GB)</strong>: 0.5, 1.6, 6.1, 13.5, 28.4, 58.2, 118 or 237.</li><li><strong>Default TTL (seconds)</strong>: from 0 to 3600, 300 to start with.</li><li><strong>Encrypt cached responses</strong>: stores cached bodies encrypted.</li><li><strong>Require authorization to bypass the cache</strong>: on by default, so only authorized callers can force a fresh response with <code>Cache-Control: max-age=0</code>. <strong>When an unauthorized caller tries to bypass</strong> sets what happens to the rest: reject with 403, serve from cache with a warning header (the default), or serve from cache silently.</li><li><strong>Per-method overrides</strong>: choose <strong>Add Override</strong> and type a method such as <code>/pets/GET</code>, or <code>*/*</code> for all, with its own TTL and <strong>Cache</strong> switch.</li></ul><p>Choose <strong>Save Changes</strong>. Responses to authenticated requests are cached per caller. To empty the cache, choose <strong>Flush Cache</strong>, type the stage name and confirm; it can't be undone. Owners, Admins and Managers can change and flush the cache.</p>$html$,
      '[]',
      70
    ),
    (
      'throttling',
      'Stages',
      'Throttling a stage',
      $html$<p>A stage's <strong>Throttling</strong> tab limits how many requests it accepts. Open the stage from the API editor's Stages section.</p><ul><li><strong>Default rate (requests/sec)</strong> and <strong>Default burst</strong>: the stage-wide limits. Set both, or leave both empty for no stage limit. A rate or burst of 0 blocks all traffic.</li><li><strong>Method overrides (JSON)</strong> on REST APIs, or <strong>Route overrides (JSON)</strong> on HTTP and WebSocket APIs: up to 20 limits for single methods or routes, such as <code>{"/pets/GET": {"rateLimit": 50, "burstLimit": 100}}</code>.</li></ul><p>Choose <strong>Save Throttling</strong>. Gateways apply it within a minute. A stage's limits can't exceed the project's own throttle. Owners, Admins and Managers can change throttling. Limits per caller come from usage plans, covered in <a href="/help/pods/usage">Usage plans and API keys</a>.</p>$html$,
      '[]',
      80
    ),
    (
      'stage-logging',
      'Stages',
      'Stage logging and tracing',
      $html$<p>A stage's <strong>Logs & tracing</strong> tab sets what Pods records for its traffic. Open the stage from the API editor's Stages section.</p><ul><li><strong>Access logging</strong>: writes one line per request. The <strong>Format</strong> must include <code>$context.requestId</code> or <code>$context.extendedRequestId</code>; start from the <strong>CLF</strong> or <strong>JSON</strong> preset, and check the <strong>Preview</strong>.</li><li><strong>Destinations</strong>: comma separated. <code>pods</code> sends lines to Pods' own log search, and a log export's ID sends them there too.</li><li><strong>Execution logging level</strong>: Off, Errors only or Info.</li><li><strong>Data trace</strong>: also stores request and response bodies, cut to 1 KB. Only Owners, Admins and Managers can view them.</li><li><strong>Detailed metrics</strong>: records metrics per route for this stage.</li><li><strong>Tracing</strong>: samples one request a second plus 5% of the rest.</li></ul><p>Choose <strong>Save Changes</strong>. Owners, Admins and Managers can change these settings. Logs, traces and exports are covered in <a href="/help/pods/monitoring">Monitoring</a>.</p>$html$,
      '[]',
      90
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"Network","label":"APIs","href":"/help/pods/apis"},{"icon":"FolderTree","label":"Resources, routes & methods","href":"/help/pods/apis/resources-and-routes"},{"icon":"Activity","label":"Monitoring","href":"/help/pods/monitoring"},{"icon":"Ticket","label":"Usage plans & API keys","href":"/help/pods/usage"},{"icon":"BookOpen","label":"Docs, SDKs & OpenAPI","href":"/help/pods/apis/distribution"},{"icon":"Plug","label":"Integrations","href":"/help/pods/apis/integrations"}]',
      100
    )
) as v(anchor_id, eyebrow, title, content, links, sort_order)
cross join (select id from public.docs_pages where slug = 'pods/apis/deployments-and-stages' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Deployments & stages',
    description = 'Deploy an API''s draft as a snapshot, serve it from stages, and manage canaries, caching, throttling and logging.',
    status = 'draft',
    published_at = null
where slug = 'pods/apis/deployments-and-stages' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'pods/apis/deployments-and-stages' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Deploying an API</li><li>Deployments</li><li>Stages</li><li>Canary releases</li><li>Caching and throttling</li><li>Stage logging</li><li>Testing a method</li></ul>',
  10
from public.docs_pages p
where p.slug = 'pods/apis/deployments-and-stages' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
