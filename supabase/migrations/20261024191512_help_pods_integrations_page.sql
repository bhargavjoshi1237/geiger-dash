-- Help pods integrations page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the pods/apis/integrations draft outline
-- (from 20261024191500_help_pods_structure) with the full Integrations guide and publishes it.
-- Left out on purpose: the Function proxy, Function and AWS service types (the dialog has no fields to configure
-- them), the Backend client certificates card (a certificate can't be selected on a stage anywhere in the UI), and
-- connecting an integration to a method or route (there is no control for it in the API editor). No Pods showcases
-- exist, so the page embeds none.
-- Written from a survey of C:\Pro\geiger-pods (components/internal/screens/integrations/integrations_tab.jsx,
-- client_certificates.jsx, components/internal/screens/processing/parameter_mapping_editor.jsx, method_view.jsx,
-- routes_tab.jsx, lib/control/integrations.mjs, lib/gateway/capabilities.mjs,
-- lib/gateway/core/integrations/backend-auth.mjs, lib/gateway/core/processing/param-mapping.mjs, lib/vault/secrets.mjs).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Integrations',
    description = 'Set up the backends an API calls: HTTP proxy, mapped HTTP and mock integrations, timeouts, private connectors, TLS, backend credentials and mapping.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'pods/apis/integrations' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'pods/apis/integrations' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.sort_order
from (
  values
    (
      'creating-an-integration',
      'Basics',
      'Creating an integration',
      $html$<p>An <strong>integration</strong> is a backend that an API's methods or routes call. To create one, open the API from <strong>APIs</strong>, choose <strong>Integrations</strong> in the API editor's section list, then <strong>New Integration</strong>.</p><ol><li>Under <strong>Backend</strong>, pick a <strong>Type</strong>. HTTP proxy is selected to start with.</li><li>Pick a <strong>Connection</strong>: Internet, the default, or Private connector.</li><li>For an HTTP type, type the backend address in <strong>URI template</strong>.</li><li>Optional: set the <strong>Timeout</strong>, the <strong>Security</strong> options and, for some protocols, the mapping or caching options.</li><li>Optional: under <strong>Notes</strong>, write a <strong>Description</strong>.</li><li>Choose <strong>Create Integration</strong>.</li></ol><p>Owners, Admins and Managers can manage integrations. Members see "Access unavailable" in the Integrations section.</p>$html$,
      '[]',
      10
    ),
    (
      'integration-types',
      'Concepts',
      'Integration types',
      $html$<p>The <strong>Type</strong> of an integration decides what Pods does with a request. Which types an API can use depends on its protocol, and Pods refuses a type the protocol doesn't support.</p><ul><li><strong>HTTP proxy</strong>: forwards the request to the backend address as it is, and returns the backend's response. Works with REST, HTTP and WebSocket APIs.</li><li><strong>HTTP (mapped)</strong>: calls the backend address, with the request and response shaped by mappings and templates on each method. Works with REST and WebSocket APIs.</li><li><strong>Mock</strong>: answers without calling any backend. The status code comes from <code>statusCode</code> in the method's request template (200 when there's none), and the integration responses build the rest. Works with REST and WebSocket APIs.</li></ul><p>An HTTP API created with a <strong>Backend URL</strong> starts with an HTTP proxy integration on its <code>$default</code> route. Importing an OpenAPI document that describes integrations also creates them and connects them to their routes or methods, as the <a href="/help/pods/apis/distribution">Docs, SDKs and OpenAPI</a> guide describes.</p>$html$,
      '[]',
      20
    ),
    (
      'backend-and-timeout',
      'Integrations',
      'Backend address, connection and timeout',
      $html$<p>The <strong>Backend</strong> part of the integration dialog sets where Pods sends requests.</p><ul><li><strong>URI template</strong>: required for HTTP proxy and HTTP (mapped). It must be an <code>http://</code> or <code>https://</code> address, such as <code>https://backend.example.com/{proxy}</code>. It can include <code>{param}</code> path parameters, <code>${stageVariables.name}</code> and <code>${request.path.name}</code>.</li><li><strong>Connection</strong>: Internet sends requests over the public internet. Private connector sends them through one of the project's connectors, which you pick in <strong>Connector</strong>; the URI template is then the backend's private address.</li><li><strong>Timeout</strong>: drag the slider in steps of 50 ms, from 50 ms up to 29,000 ms for REST and WebSocket APIs or 30,000 ms for HTTP APIs. New integrations start at the maximum.</li></ul>$html$,
      '[]',
      30
    ),
    (
      'tls-and-backend-auth',
      'Integrations',
      'TLS and backend credentials',
      $html$<p>The <strong>Security</strong> part of the integration dialog controls the connection to the backend and the credential Pods adds to each call.</p><ul><li><strong>Skip certificate validation</strong>: accepts self-signed or mismatched certificates. It's off by default, and meant for testing only.</li><li><strong>SNI override</strong>: optional. A hostname to verify instead of the URI's host.</li><li><strong>Backend auth</strong>: None, Header, Bearer token, Basic auth, Query parameter, OAuth client credentials, AWS SigV4 or Client certificate.</li></ul><p>Every option except None takes a <strong>Vault secret</strong>: a reference to a secret kept under <strong>Security → Secrets</strong>, written as <code>secret:</code> followed by the secret's ID. Add <code>@</code> and a version number to pin one version; without it Pods uses the latest enabled version. Header and Query parameter also need the <strong>Header name</strong> or <strong>Query param name</strong> to send it as, such as <code>X-Api-Key</code>.</p><p>Pods reads the secret only when it calls the backend. Its value never appears in logs, test output or errors, and it replaces any header of the same name the caller sent. The <a href="/help/pods/security">Security</a> guide covers secrets.</p>$html$,
      '[]',
      40
    ),
    (
      'http-parameter-mapping',
      'Integrations',
      'Parameter mapping for HTTP APIs',
      $html$<p>Integrations in an HTTP API have <strong>Parameter mapping</strong>, which changes the request on its way to the backend and the response on its way back.</p><ul><li><strong>Request mapping</strong>: each row has a key and a value. The key is <code>append:</code>, <code>overwrite:</code> or <code>remove:</code> followed by <code>header.</code> or <code>querystring.</code> and a name, such as <code>overwrite:header.X-Name</code>, or <code>overwrite:path</code> to replace the path. The value can come from <code>$request.header.</code>, <code>$request.querystring.</code>, <code>$request.body.</code>, <code>$request.path</code>, <code>$context.</code> or <code>$stageVariables.</code>, or be a fixed value in single quotes.</li><li><strong>Response mapping</strong>: one table per backend status code. Type a code such as <code>500</code> and choose <strong>Add status</strong>, then add rows such as <code>overwrite:statuscode</code> or <code>append:header.X-Reply</code>, with values from <code>$response.header.</code>, <code>$response.body.</code>, <code>$context.</code> or <code>$stageVariables.</code>.</li></ul><p>Pods applies removals first, then overwrites, then appends. REST methods have their own request and response mapping instead, covered in <a href="/help/pods/apis/resources-and-routes">Resources, routes and methods</a>.</p>$html$,
      '[]',
      50
    ),
    (
      'streaming-and-caching',
      'Integrations',
      'Streaming and caching for REST APIs',
      $html$<p>Integrations in a REST API have <strong>Streaming and caching</strong> options.</p><ul><li><strong>Transfer mode</strong>: Buffered, the default, or Stream for HTTP proxy integrations. A streamed method can't also use stage caching, response compression or response mapping templates: deploying fails and names the conflict.</li><li><strong>Cache key parameters</strong>: one per line, such as <code>method.request.querystring.page</code> or <code>method.request.header.Accept</code>. When a stage caches responses, query parameters outside this list don't change the cache key. For <code>{proxy+}</code> resources, the proxy path is always part of the key.</li><li><strong>Cache namespace</strong>: optional, such as <code>v1</code>.</li></ul><p>Caching itself is turned on per stage, as the <a href="/help/pods/apis/deployments-and-stages">Deployments and stages</a> guide describes. WebSocket integrations have a <strong>Template selection expression</strong> instead.</p>$html$,
      '[]',
      60
    ),
    (
      'editing-and-deleting',
      'Integrations',
      'The integration list, editing and deleting',
      $html$<p>The <strong>Backends</strong> list in the API editor's Integrations section shows each integration's <strong>Type</strong>, its <strong>Target</strong> address (or Mock response) and description, its <strong>Connection</strong>, its <strong>Backend auth</strong> and its <strong>Timeout</strong>.</p><p>Click a row, or choose <strong>Edit</strong> in its <strong>⋯</strong> menu, to change it, then choose <strong>Save Changes</strong>. An integration's settings are shared by every method and route that uses it.</p><p>To delete one, choose <strong>Delete</strong> in its <strong>⋯</strong> menu. Pods asks you to confirm. Routes and methods that used it stop reaching a backend once you deploy, and it can't be undone.</p>$html$,
      '[]',
      70
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"FolderTree","label":"Resources, routes & methods","href":"/help/pods/apis/resources-and-routes"},{"icon":"Rocket","label":"Deployments & stages","href":"/help/pods/apis/deployments-and-stages"},{"icon":"KeySquare","label":"Security","href":"/help/pods/security"},{"icon":"ShieldCheck","label":"Authorizers & resource policies","href":"/help/pods/apis/authorizers"},{"icon":"Network","label":"APIs","href":"/help/pods/apis"},{"icon":"BookOpen","label":"Docs, SDKs & OpenAPI","href":"/help/pods/apis/distribution"}]',
      80
    )
) as v(anchor_id, eyebrow, title, content, links, sort_order)
cross join (select id from public.docs_pages where slug = 'pods/apis/integrations' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Integrations',
    description = 'Connect an API''s methods and routes to the backends they call.',
    status = 'draft',
    published_at = null
where slug = 'pods/apis/integrations' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'pods/apis/integrations' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Creating an integration</li><li>Integration types</li><li>Mapping requests and responses</li><li>Client certificates</li></ul>',
  10
from public.docs_pages p
where p.slug = 'pods/apis/integrations' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
