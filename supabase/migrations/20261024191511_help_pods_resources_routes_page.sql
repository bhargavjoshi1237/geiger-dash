-- Help pods resources routes page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the pods/apis/resources-and-routes draft
-- outline (from 20261024191500_help_pods_structure) with the full Resources, routes & methods guide and publishes it.
-- Left out on purpose: the Request validator picker and the "Validate request body/parameters" switches (validators
-- can't be created in Pods and the switches aren't saved), and "Test Template" in mapping templates (always fails in
-- this view). No Pods showcases exist, so the page embeds none.
-- Written from a survey of C:\Pro\geiger-pods (components/internal/screens/apis/resources_tab.jsx, routes_tab.jsx,
-- method_view.jsx, components/internal/screens/processing/method_panels.jsx, parameter_mapping_editor.jsx,
-- template_editor.jsx, components/internal/screens/releases/test_tab.jsx, lib/control/rest-resources.mjs,
-- http-routes.mjs, test-invoke.mjs, apis.mjs (matchDraft), lib/gateway/core/match/http-routes.mjs,
-- lib/gateway/capabilities.mjs).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Resources, routes & methods',
    description = 'Build a REST API from resources and methods, or an HTTP or WebSocket API from routes, then map requests, declare responses and test a method.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'pods/apis/resources-and-routes' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'pods/apis/resources-and-routes' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.sort_order
from (
  values
    (
      'adding-resources-and-methods',
      'Basics',
      'Adding resources and methods',
      $html$<p>A REST API is a tree of <strong>resources</strong>, one per path segment, with <strong>methods</strong> such as GET and POST on each. Open the API from <strong>APIs</strong>, then choose <strong>Resources</strong> in the API editor's section list. Every REST API starts with the root resource, <code>/</code>.</p><ol><li>In <strong>Resource tree</strong>, choose <strong>New Resource</strong>.</li><li>In <strong>Parent</strong>, pick the resource to add under. It starts as the one selected in the tree.</li><li>In <strong>Path part</strong>, type one segment: a literal such as <code>pets</code>, a path parameter such as <code>{id}</code>, or a catch-all <code>{proxy+}</code>.</li><li>Choose <strong>Create Resource</strong>.</li></ol><p>Each parent holds one resource per path part, and at most one variable part (<code>{id}</code> or <code>{proxy+}</code>). A <code>{proxy+}</code> resource matches everything beneath it, so it can't have children.</p><p>To add a method, click a resource in the tree, pick GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS or ANY next to <strong>Methods</strong>, then choose <strong>Add Method</strong>. An exact method wins over ANY, and HEAD never falls back to GET. Until a resource has a method, requests to it get 403 Missing Authentication Token.</p><p>Owners, Admins and Managers can add and delete resources and methods.</p>$html$,
      '[]',
      10
    ),
    (
      'method-details',
      'Resources',
      'Method details',
      $html$<p>Click a method under <strong>Methods</strong> in the API editor's Resources section to open its details beneath. Each row shows its authorization, <strong>API key required</strong> when the method needs one, and its operation name.</p><ul><li><strong>Authorization</strong>: who can call the method. The <a href="/help/pods/apis/authorizers">Authorizers and resource policies</a> guide covers it.</li><li><strong>Method request</strong>: under <strong>Request parameters</strong>, declare the headers, query strings and path parameters the method takes, such as <code>method.request.querystring.page</code>, and mark each one required or optional. Under <strong>Request models</strong>, add a content type such as <code>application/json</code> and pick the model its body follows: Empty, Error or one of the API's models. <code>$default</code> applies when no other content type matches. Choose <strong>Save Method Request</strong>.</li><li><strong>Method responses</strong>: the status codes the method returns. Click a status code, or type a new one, then declare its <strong>Response headers</strong>, such as <code>method.response.header.X-Reply</code>, and its <strong>Response models</strong>. Choose <strong>Save</strong> for that code, such as <strong>Save 200 Response</strong>.</li></ul><p>Each card saves on its own button. Models themselves are covered in <a href="/help/pods/apis/models-and-responses">Models, CORS and gateway responses</a>.</p>$html$,
      '[]',
      20
    ),
    (
      'integration-request',
      'Resources',
      'Integration request',
      $html$<p>A method's <strong>Integration request</strong> card sets how an incoming call becomes the request to its backend. It appears in the method's details once the method has an integration; until then the <strong>Integration</strong> card says none is attached. The <a href="/help/pods/apis/integrations">Integrations</a> guide covers the backends themselves.</p><ul><li><strong>Request mapping</strong>: set a backend header, query string or path value, such as <code>integration.request.header.X-Target</code>, from <code>method.request.*</code>, <code>context.*</code>, <code>stageVariables.*</code> or a fixed value. Wrap fixed values in single quotes, like <code>'v2'</code>.</li><li><strong>Passthrough behavior</strong>: what happens to a body whose content type has no template. When no template matches, pass the body through (the default); only when no templates exist; or never, which rejects the request with 415.</li><li><strong>Content handling</strong>: pass the body through unchanged (the default), convert binary to base64 text, or convert base64 text to binary.</li><li><strong>Mapping templates</strong>: in <strong>New template content type</strong>, type a content type, choose <strong>Add template</strong>, then write a Velocity-compatible template that builds the backend body. The trash icon removes a template.</li></ul><p>Choose <strong>Save Integration Request</strong> to keep your changes. Integration settings are shared by every method that uses the same integration.</p>$html$,
      '[]',
      30
    ),
    (
      'integration-responses',
      'Resources',
      'Integration responses',
      $html$<p>A method's <strong>Integration responses</strong> card turns what the backend returns into the method's response. Each integration response has a status code and a <strong>Selection pattern</strong>: a regular expression matched against the backend's status code, or against a function's error message. The one with an empty pattern is the default.</p><ol><li>Under <strong>New integration response</strong>, type a <strong>Status</strong> and, optionally, a <strong>Selection pattern</strong> such as <code>5\d\d</code>.</li><li>Choose <strong>Add response</strong>.</li><li>Click the new response to edit its <strong>Response mapping</strong> (for example <code>method.response.header.X-Reply</code> from <code>integration.response.header.*</code>), its <strong>Content handling</strong> and its templates. <strong>application/json template</strong> adds a template for JSON.</li><li>Choose <strong>Save</strong> for that status, such as <strong>Save 200 Response</strong>.</li></ol><p>A header you map has to be declared on the method response first, under <strong>Method responses</strong>. <strong>Delete response</strong> removes the selected integration response after you confirm, and it can't be undone.</p>$html$,
      '[]',
      40
    ),
    (
      'testing-a-method',
      'Resources',
      'Testing a method',
      $html$<p>To test a REST method, open it under <strong>Methods</strong> in the API editor's Resources section and scroll to <strong>Test request</strong>. A test runs against the draft, so you can check a change before deploying it.</p><ol><li>In <strong>Path with query string</strong>, type the path to call, such as <code>/pets?limit=10</code>.</li><li>Optional: fill in <strong>Headers (JSON)</strong>, <strong>Body</strong> and <strong>Stage variables (JSON)</strong>. Headers and stage variables must be JSON objects.</li><li>Choose <strong>Test Invoke</strong>.</li></ol><p><strong>Response</strong> shows the status code, how long the call took and the body. <strong>Execution log</strong> traces each step of the call, with tokens and secret values masked.</p><p>A test skips authorizers, API keys, throttling, quotas and caching. It doesn't touch any stage, and it isn't counted in metrics or usage. Owners, Admins and Managers can run tests; others see "Access unavailable".</p>$html$,
      '[]',
      50
    ),
    (
      'deleting-resources-and-methods',
      'Resources',
      'Deleting methods and resources',
      $html$<p>To delete a method, choose <strong>Delete method</strong> in its <strong>⋯</strong> menu under <strong>Methods</strong>. Its request, response and integration settings go with it.</p><p>To delete a resource, select it in <strong>Resource tree</strong> and choose <strong>Delete branch</strong>. This removes the resource and every resource and method beneath it. The root resource, <code>/</code>, can't be deleted.</p><p>Pods asks you to confirm both, and neither can be undone. Deleting changes the draft only: stages keep serving their current deployment until you deploy again.</p>$html$,
      '[]',
      60
    ),
    (
      'adding-routes',
      'Routes',
      'Adding routes',
      $html$<p>HTTP and WebSocket APIs are built from <strong>routes</strong>. Open the API from <strong>APIs</strong>, choose <strong>Routes</strong> in the API editor's section list, then <strong>New Route</strong>. Type a <strong>Route key</strong> and choose <strong>Create Route</strong>. Owners, Admins and Managers can add routes.</p><ul><li><strong>HTTP APIs</strong>: a method and a path, such as <code>GET /pets/{id}</code> or <code>ANY /{proxy+}</code>, or <code>$default</code> for requests no other route matches. The method is GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS or ANY, and the path starts with <code>/</code>. A greedy <code>{name+}</code> part has to come last.</li><li><strong>WebSocket APIs</strong>: any key, such as <code>$connect</code>, <code>$disconnect</code> or a custom action like <code>sendmessage</code>, chosen from each message.</li></ul><p>Route keys are up to 512 characters and unique within the API. In an HTTP API an exact method beats ANY, a greedy route needs the longest matching prefix, and a request that matches no route gets 404 Not Found.</p><p>The route list shows each route with its <strong>Integration</strong> (or Not connected) and its <strong>Authorization</strong>: None, IAM, JWT or Custom. It shows 25 routes a page; switch to 10, 50 or 100 at the bottom.</p>$html$,
      '[]',
      70
    ),
    (
      'route-actions',
      'Routes',
      'Route authorization and deleting routes',
      $html$<p>Each route's <strong>⋯</strong> menu in the API editor's Routes section has <strong>Authorization</strong>, which opens <strong>Route Authorization</strong> to set who can call the route. The <a href="/help/pods/apis/authorizers">Authorizers and resource policies</a> guide covers the options.</p><p>Owners, Admins and Managers also see <strong>Delete</strong>. Pods asks you to confirm, then removes the route from the draft. It can't be undone, and live stages keep serving it until you deploy again.</p>$html$,
      '[]',
      80
    ),
    (
      'route-tester',
      'Routes',
      'Testing which route matches',
      $html$<p>The <strong>Route tester</strong>, under the route list of an HTTP API, shows which draft route a request would hit. Pick a <strong>Method</strong> and type a <strong>Path</strong> such as <code>/pets/1</code>, then choose <strong>Test Route</strong>.</p><p>The result names the matching route key and any path parameters it captured, such as <code>{"id":"1"}</code>. When nothing matches, it says why, and that requests there return 404 Not Found. The tester only reads the draft: it doesn't call your backend or change anything.</p>$html$,
      '[]',
      90
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"Network","label":"APIs","href":"/help/pods/apis"},{"icon":"Plug","label":"Integrations","href":"/help/pods/apis/integrations"},{"icon":"ShieldCheck","label":"Authorizers & resource policies","href":"/help/pods/apis/authorizers"},{"icon":"Braces","label":"Models, CORS & gateway responses","href":"/help/pods/apis/models-and-responses"},{"icon":"Rocket","label":"Deployments & stages","href":"/help/pods/apis/deployments-and-stages"},{"icon":"Ticket","label":"Usage plans & API keys","href":"/help/pods/usage"}]',
      100
    )
) as v(anchor_id, eyebrow, title, content, links, sort_order)
cross join (select id from public.docs_pages where slug = 'pods/apis/resources-and-routes' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Resources, routes & methods',
    description = 'Model a REST API''s resources and methods, or an HTTP or WebSocket API''s routes.',
    status = 'draft',
    published_at = null
where slug = 'pods/apis/resources-and-routes' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'pods/apis/resources-and-routes' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Resources and methods (REST)</li><li>Routes (HTTP and WebSocket)</li><li>Method request and response settings</li></ul>',
  10
from public.docs_pages p
where p.slug = 'pods/apis/resources-and-routes' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
