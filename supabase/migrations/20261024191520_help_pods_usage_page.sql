-- Help pods usage page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the pods/usage draft outline (from
-- 20261024191500_help_pods_structure) with the full Usage plans & API keys guide and publishes it. No Pods showcases
-- exist, so the page embeds none.
-- Written from a survey of C:\Pro\geiger-pods (components/internal/screens/usage/plans_screen.jsx, keys_screen.jsx,
-- index.js, lib/control/usage-plans.mjs, api-keys.mjs, lib/gateway/core/phases/api-key.mjs,
-- lib/gateway/core/usage/quota.mjs and throttle.mjs, lib/gateway/core/gateway-responses.mjs,
-- lib/gateway/capabilities.mjs).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Usage plans & API keys',
    description = 'Give callers API keys, then limit them with usage plans: throttles, quotas, the stages each plan covers, and the usage of every key.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'pods/usage' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'pods/usage' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.sort_order
from (
  values
    (
      'how-usage-plans-work',
      'Concepts',
      'How usage plans and API keys work',
      $html$<p>An <strong>API key</strong> identifies a caller, such as one customer's app. A <strong>usage plan</strong> lists the API stages its keys can call, with the throttle and quota each key gets. Both work with REST and WebSocket APIs.</p><p>API keys identify callers but don't authenticate them: pair them with an authorizer for that. A REST method checks keys only when its <strong>API key required</strong> switch is on, as the <a href="/help/pods/apis/authorizers">Authorizers and resource policies</a> guide describes; on a WebSocket API the key is checked when a client connects.</p><p>Callers send the key in the <code>x-api-key</code> header. A REST API can instead take it from a custom authorizer, when its <strong>API key source</strong> is AUTHORIZER. Pods rejects a call with 403 Forbidden when the key is missing, unknown or disabled, or isn't in a plan that covers the stage. A caller over its throttle gets 429 Too Many Requests, and one over its quota gets 429 Limit Exceeded.</p><p>Changes to keys and plans reach the gateway without a redeploy, usually within a minute.</p>$html$,
      '[]',
      10
    ),
    (
      'creating-a-usage-plan',
      'Basics',
      'Creating a usage plan',
      $html$<p>To create a usage plan, choose <strong>Usage → Usage Plans</strong> in the Pods sidebar, then <strong>New Usage Plan</strong>. Owners, Admins and Managers can manage plans.</p><ol><li>Type a <strong>Name</strong>, up to 128 characters. It's required.</li><li>Optional: write a <strong>Description</strong>, up to 1,024 characters.</li><li>Optional: set a throttle, <strong>Rate (requests/sec)</strong> and <strong>Burst</strong>. Leave both empty for no plan throttle.</li><li>Optional: set a quota, <strong>Limit (requests)</strong>, <strong>Period</strong> (Day, Week or Month) and <strong>Offset</strong>. Leave the limit empty for no quota.</li><li>Choose <strong>Create Usage Plan</strong>.</li></ol><p>The plan opens on its edit page, where you add API stages and keys. Its limits can't exceed the project's throttle, which is 10,000 requests a second with a burst of 5,000 unless it's changed under <strong>Settings → General</strong>.</p>$html$,
      '[]',
      20
    ),
    (
      'usage-plan-list',
      'Usage plans',
      'The usage plan list',
      $html$<p>Choose <strong>Usage → Usage Plans</strong> in the sidebar to see every plan in the project. The figures across the top count <strong>Total plans</strong> and how many are <strong>Throttled</strong>, have a quota (<strong>With quota</strong>) or have <strong>No limits</strong>.</p><p>Narrow the list with the <strong>Limits</strong> filter, or search by name, description or plan ID. Each row shows the plan's <strong>Throttle</strong>, <strong>Quota</strong>, <strong>Plan ID</strong> and when it was last <strong>Updated</strong>. The list shows 25 plans a page; switch to 10, 50 or 100 at the bottom.</p><p>Click a plan to open it. Each row's <strong>⋯</strong> menu has <strong>Edit</strong> (or <strong>Open</strong> for Members), <strong>Copy plan ID</strong> and <strong>Delete</strong>.</p>$html$,
      '[]',
      30
    ),
    (
      'plan-settings',
      'Usage plans',
      'Throttles and quotas',
      $html$<p>A usage plan's <strong>Settings</strong> section holds its <strong>Name</strong>, <strong>Description</strong>, <strong>Throttle</strong> and <strong>Quota</strong>. Change them, then choose <strong>Save Changes</strong> at the top. Gateways pick the change up without a redeploy.</p><ul><li><strong>Throttle</strong>: the steady rate and the burst each key in the plan gets. Leave both empty for no plan throttle.</li><li><strong>Quota</strong>: how many requests each key can make per period. Day periods start at 00:00 UTC, Week periods on Sunday at 00:00 UTC, and Month periods on the 1st. The <strong>Offset</strong> is taken off the limit in the first period.</li></ul><p>To delete a plan, choose <strong>Delete Usage Plan</strong> under <strong>Danger zone</strong>, or <strong>Delete</strong> in the plan's <strong>⋯</strong> menu in the list, and confirm. Its keys lose access to the plan's stages, and it can't be undone.</p>$html$,
      '[]',
      40
    ),
    (
      'plan-stages',
      'Usage plans',
      'Adding stages to a plan',
      $html$<p>A usage plan covers the API stages listed in its <strong>Stages</strong> section. Keys in the plan can call those stages. To add one, open the plan, choose <strong>Stages</strong>, then <strong>Add Stage</strong>. Pick the <strong>API</strong> (REST and WebSocket APIs only) and the <strong>Stage</strong>, and confirm.</p><p>To give single methods their own limits, choose <strong>Method throttles</strong> in the stage's <strong>⋯</strong> menu. Enter JSON whose keys are <code>/path/METHOD</code>, such as <code>{"/pets/GET": {"rateLimit": 10, "burstLimit": 20}}</code>, up to 20 entries. They replace the plan throttle for the methods listed, and can't exceed the project throttle.</p><p><strong>Remove</strong> in the stage's <strong>⋯</strong> menu takes the stage out of the plan after you confirm.</p>$html$,
      '[]',
      50
    ),
    (
      'plan-keys',
      'Usage plans',
      'Adding API keys to a plan',
      $html$<p>To let a key use a plan, open the plan, choose <strong>API Keys</strong>, then <strong>Add API Key</strong>. Pick the <strong>API key</strong> and confirm.</p><p>A key can be in up to 10 plans, but not in two plans that cover the same API stage. Each key in the list shows the last characters of its value and whether it's Enabled or Disabled. Its <strong>⋯</strong> menu has <strong>Copy key ID</strong> and <strong>Remove from plan</strong>, which asks you to confirm.</p>$html$,
      '[]',
      60
    ),
    (
      'plan-usage',
      'Usage plans',
      'Usage and quota adjustments',
      $html$<p>A plan's <strong>Usage</strong> section shows how many requests each of its keys made per day, and how much quota was left. Pick a <strong>Start</strong> and <strong>End</strong> date (the last seven days to begin with, up to 366 days), then choose <strong>Load Usage</strong>. Today's numbers are live; earlier days come from daily totals. <strong>Export CSV</strong> downloads the report.</p><p>When the plan has a quota, <strong>Adjust Quota</strong> changes one key's allowance for the current period only:</p><ul><li><strong>Extend</strong>: adds requests to this period.</li><li><strong>Set</strong>: sets the requests remaining this period.</li><li><strong>Reset</strong>: goes back to the plan's quota.</li></ul><p>Pick the <strong>API key</strong> and the <strong>Operation</strong>, type the number of <strong>Requests</strong> for Extend or Set, and confirm. The next period starts from the plan's quota again.</p>$html$,
      '[]',
      70
    ),
    (
      'creating-an-api-key',
      'API keys',
      'Creating an API key',
      $html$<p>To create an API key, choose <strong>Usage → API Keys</strong> in the sidebar, then <strong>New API Key</strong>. Owners, Admins and Managers can manage keys.</p><ol><li>Type a <strong>Name</strong>, up to 128 characters. It's required.</li><li>Optional: in <strong>Custom value</strong>, type the key yourself: 20 to 128 letters, digits, dashes or underscores. Leave it empty and Pods generates 40 random characters.</li><li>Optional: add a <strong>Description</strong> and a <strong>Customer ID</strong>, your own identifier for whoever holds the key.</li><li>Choose <strong>Create API Key</strong>.</li></ol><p>Pods shows the key's value once. Copy it then: it's never stored in readable form, and only Owners and Admins can reveal it later. Then add the key to a usage plan so it can call an API stage.</p>$html$,
      '[]',
      80
    ),
    (
      'managing-api-keys',
      'API keys',
      'Managing API keys',
      $html$<p>The <strong>API Keys</strong> list counts <strong>Total keys</strong>, <strong>Enabled</strong> and <strong>Disabled</strong>. Filter by <strong>Status</strong>, or search by name, customer or the end of the value. Each row shows the last characters of the value, the customer, the status and when the key was <strong>Last used</strong>. Each key's <strong>⋯</strong> menu has:</p><ul><li><strong>Edit</strong> (or <strong>Open</strong>): the key's page, with its <strong>Name</strong>, <strong>Description</strong>, <strong>Customer ID</strong>, an <strong>Enabled</strong> switch and the usage plans it's in. Choose <strong>Save Changes</strong> after editing.</li><li><strong>Reveal value</strong>: shows the full value. Owners and Admins only, and each reveal is recorded in the audit log.</li><li><strong>Copy key ID</strong>.</li><li><strong>Rotate</strong>: creates a new key with a new value, shown once, in the same usage plans. The old key stays enabled until you disable it.</li><li><strong>Disable</strong> or <strong>Enable</strong>: Pods asks before disabling. Callers using a disabled key are rejected within a minute.</li><li><strong>Delete</strong>: after you confirm, callers using the key are rejected and it leaves every usage plan. It can't be undone.</li></ul>$html$,
      '[]',
      90
    ),
    (
      'importing-api-keys',
      'API keys',
      'Importing API keys',
      $html$<p>To bring in keys you already use, choose <strong>Import CSV</strong> on the API Keys screen and paste a CSV with the header <code>Name,Key,Description,Enabled,UsagePlanIds</code>, the format AWS API Gateway exports.</p><p>Choose <strong>Import</strong> to skip rows with problems and list them as warnings, or <strong>Import (Fail on Warnings)</strong> to import nothing if any row has a problem. An <strong>Enabled</strong> value that isn't true or false is treated as true, with a warning. Owners, Admins and Managers can import keys.</p>$html$,
      '[]',
      100
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"ShieldCheck","label":"Authorizers & resource policies","href":"/help/pods/apis/authorizers"},{"icon":"Rocket","label":"Deployments & stages","href":"/help/pods/apis/deployments-and-stages"},{"icon":"Activity","label":"Monitoring","href":"/help/pods/monitoring"}]',
      110
    )
) as v(anchor_id, eyebrow, title, content, links, sort_order)
cross join (select id from public.docs_pages where slug = 'pods/usage' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Usage plans & API keys',
    description = 'Meter and limit who calls your APIs: create API keys, attach them to usage plans with throttles and quotas, and track usage.',
    status = 'draft',
    published_at = null
where slug = 'pods/usage' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'pods/usage' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Creating a usage plan</li><li>Throttling and quotas</li><li>Creating and managing API keys</li><li>Tracking usage</li></ul>',
  10
from public.docs_pages p
where p.slug = 'pods/usage' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
