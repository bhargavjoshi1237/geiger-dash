-- Help pods models responses page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the pods/apis/models-and-responses draft
-- outline (from 20261024191500_help_pods_structure) with the full Models, CORS & gateway responses guide and
-- publishes it. Request-body validation against models is left out: it needs a request validator, and validators
-- can't be created anywhere in Pods. No Pods showcases exist, so the page embeds none.
-- Written from a survey of C:\Pro\geiger-pods (components/internal/screens/apis/tab_panels.jsx,
-- components/internal/screens/processing/models_tab.jsx, cors_editor.jsx, gateway_responses_tab.jsx, method_panels.jsx,
-- components/internal/screens/apis/resources_tab.jsx, lib/control/models.mjs, cors.mjs, enable-cors.mjs,
-- gateway-responses.mjs, lib/gateway/core/gateway-responses.mjs, lib/gateway/core/phases/validate.mjs).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Models, CORS & gateway responses',
    description = 'Describe request and response bodies with models, let browsers call your API with CORS, and shape the errors the gateway returns.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'pods/apis/models-and-responses' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'pods/apis/models-and-responses' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.sort_order
from (
  values
    (
      'creating-a-model',
      'Basics',
      'Creating a model',
      $html$<p>A <strong>model</strong> is a JSON Schema (draft-04) that describes a request or response body. REST and WebSocket APIs have models. To create one, open the API from <strong>APIs</strong>, choose <strong>Models</strong> in the API editor's section list, then <strong>New Model</strong>.</p><ol><li>Type a <strong>Name</strong>: letters and digits only, up to 128, and unique within the API.</li><li>Keep or change the <strong>Content type</strong>. It starts as <code>application/json</code>.</li><li>Write the <strong>Schema</strong>. Or paste an example payload under <strong>Generate from sample JSON</strong> and choose <strong>Generate Schema</strong>: Pods writes a schema with each property's type, and marks every property required.</li><li>Choose <strong>Create Model</strong>.</li></ol><p>The schema has to be a valid JSON object. All of an API's model schemas together can be up to 400 KB. Owners, Admins and Managers can manage models.</p>$html$,
      '[]',
      10
    ),
    (
      'using-models',
      'Models',
      'Using and editing models',
      $html$<p>A REST method uses models in its details under <strong>Resources</strong>: <strong>Request models</strong> and <strong>Response models</strong> map a content type to a model. Besides the API's own models, you can pick the built-in Empty and Error. Generated SDKs also describe payloads from the API's models.</p><p>The <strong>Models</strong> list in the API editor shows each model's name and description, its <strong>Type</strong>, its <strong>Content type</strong> and how many <strong>Properties</strong> it has. Click a model, or choose <strong>Edit</strong> in its <strong>⋯</strong> menu, to change its content type or schema, then choose <strong>Save Changes</strong>. The name can't change. Members see <strong>View schema</strong> instead.</p><p>To delete a model, choose <strong>Delete</strong> in its <strong>⋯</strong> menu and confirm. Methods that referenced it no longer use it, and it can't be undone.</p>$html$,
      '[]',
      20
    ),
    (
      'cors-for-http-apis',
      'CORS',
      'CORS for HTTP APIs',
      $html$<p>CORS settings let web pages on other sites call an HTTP API from the browser. Open the API from <strong>APIs</strong> and choose <strong>CORS</strong> in the API editor's section list.</p><ul><li><strong>Allowed origins</strong>: type an origin such as <code>https://example.com</code> and choose <strong>Add</strong>, or add <code>*</code> for any origin. With no origins, Pods sends no CORS headers.</li><li><strong>Allowed methods</strong>: select GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS or * (any).</li><li><strong>Allowed headers</strong> and <strong>Exposed headers</strong>: comma separated, such as <code>content-type, authorization</code>.</li><li><strong>Max age</strong>: how long browsers can cache a preflight, from 0 to 86400 seconds.</li><li><strong>Allow credentials</strong>: lets browsers send cookies and authorization headers. It can't be on while <code>*</code> is an allowed origin.</li></ul><p>Choose <strong>Save Changes</strong>. Only Owners and Admins can save CORS settings. Pods answers preflight requests itself, without running authorizers.</p>$html$,
      '[]',
      30
    ),
    (
      'enabling-cors-on-a-resource',
      'CORS',
      'Enabling CORS on a REST resource',
      $html$<p>REST APIs set CORS per resource. Open the API's <strong>Resources</strong> section, select the resource, and choose <strong>Enable CORS</strong> next to <strong>Methods</strong>.</p><ul><li><strong>Allow origin</strong>: a quoted value, <code>'*'</code> to start with.</li><li><strong>Allow headers</strong>: starts as <code>Content-Type,X-Amz-Date,Authorization,X-Api-Key</code>.</li><li><strong>Methods</strong>: GET, POST and OPTIONS start selected.</li></ul><p>Choose <strong>Create OPTIONS Mock</strong>. Pods adds an OPTIONS method to the resource that answers 200 with the <code>Access-Control-Allow-*</code> headers, without calling a backend. It also adds the <code>Access-Control-Allow-Origin</code> header to the 200 responses of the methods you selected. Owners, Admins and Managers can do this.</p>$html$,
      '[]',
      40
    ),
    (
      'gateway-responses',
      'Gateway responses',
      'Customizing gateway responses',
      $html$<p>Gateway responses are the errors Pods returns itself, before or instead of calling your backend: a missing API key, a throttled caller, a timed-out integration. REST APIs can change them. Open the API from <strong>APIs</strong> and choose <strong>Gateway Responses</strong> in the API editor's section list.</p><p>Each response type is listed with its status code and whether it's Default or Customized. Click one, or choose <strong>Edit</strong> in its <strong>⋯</strong> menu:</p><ul><li><strong>Status code</strong>: leave it empty to keep the default.</li><li><strong>Response headers</strong>: one per line, such as <code>gatewayresponse.header.Access-Control-Allow-Origin='*'</code>.</li><li><strong>Template content type</strong> and <strong>Body template</strong>: the body to send, which can use <code>$context.error.*</code> values such as <code>$context.error.messageString</code>.</li></ul><p>Choose <strong>Save Changes</strong>. To undo a customization, choose <strong>Reset to default</strong> in its <strong>⋯</strong> menu and confirm. A type you leave alone falls back to your DEFAULT_4XX or DEFAULT_5XX customization, if you made one. Owners, Admins and Managers can edit gateway responses; others can view them.</p>$html$,
      '[]',
      50
    ),
    (
      'gateway-response-types',
      'Reference',
      'Gateway response types',
      $html$<p>The gateway response types and their default status codes:</p><ul><li><code>ACCESS_DENIED</code> 403, <code>EXPIRED_TOKEN</code> 403, <code>INVALID_API_KEY</code> 403, <code>INVALID_SIGNATURE</code> 403, <code>MISSING_AUTHENTICATION_TOKEN</code> 403, <code>WAF_FILTERED</code> 403</li><li><code>UNAUTHORIZED</code> 401</li><li><code>BAD_REQUEST_PARAMETERS</code> 400, <code>BAD_REQUEST_BODY</code> 400</li><li><code>RESOURCE_NOT_FOUND</code> 404</li><li><code>REQUEST_TOO_LARGE</code> 413, <code>UNSUPPORTED_MEDIA_TYPE</code> 415</li><li><code>QUOTA_EXCEEDED</code> 429, <code>THROTTLED</code> 429</li><li><code>API_CONFIGURATION_ERROR</code> 500, <code>AUTHORIZER_CONFIGURATION_ERROR</code> 500, <code>AUTHORIZER_FAILURE</code> 500</li><li><code>INTEGRATION_FAILURE</code> 504, <code>INTEGRATION_TIMEOUT</code> 504</li><li><code>DEFAULT_4XX</code> and <code>DEFAULT_5XX</code>: no status of their own. They apply to any 4xx or 5xx type you haven't customized.</li></ul>$html$,
      '[]',
      60
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"FolderTree","label":"Resources, routes & methods","href":"/help/pods/apis/resources-and-routes"},{"icon":"ShieldCheck","label":"Authorizers & resource policies","href":"/help/pods/apis/authorizers"},{"icon":"BookOpen","label":"Docs, SDKs & OpenAPI","href":"/help/pods/apis/distribution"}]',
      70
    )
) as v(anchor_id, eyebrow, title, content, links, sort_order)
cross join (select id from public.docs_pages where slug = 'pods/apis/models-and-responses' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Models, CORS & gateway responses',
    description = 'Describe request and response bodies, set cross-origin rules, and choose what callers see when the gateway rejects a request.',
    status = 'draft',
    published_at = null
where slug = 'pods/apis/models-and-responses' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'pods/apis/models-and-responses' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Models</li><li>CORS</li><li>Gateway responses</li></ul>',
  10
from public.docs_pages p
where p.slug = 'pods/apis/models-and-responses' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
