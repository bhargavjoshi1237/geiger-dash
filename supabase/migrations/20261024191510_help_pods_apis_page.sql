-- Help pods apis page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the pods/apis draft outline (from
-- 20261024191500_help_pods_structure) with the full APIs guide and publishes it. Pods has no section showcases, so
-- the page embeds none. The disabled Import OpenAPI button on the API list is left out (importing lives in the API
-- editor, covered by pods/apis/distribution).
-- Written from a survey of C:\Pro\geiger-pods (components/internal/screens/apis/api_list.jsx, api_detail.jsx, tabs.js,
-- overview_tab.jsx, settings_tab.jsx, components/internal/screens/admin/tags_editor.jsx,
-- components/internal/shared/editor_shell.jsx and pagination.jsx, components/internal/screens/releases/deploy_dialog.jsx,
-- lib/control/apis.mjs, tags.mjs, deployments.mjs (auto-deploy), app/api/v1/projects/[projectId]/apis/**).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'APIs',
    description = 'Create REST, HTTP and WebSocket APIs, find them in the API list, and work on each one in the API editor: its overview, settings and deletion.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'pods/apis' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'pods/apis' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.sort_order
from (
  values
    (
      'creating-an-api',
      'Basics',
      'Creating an API',
      $html$<p>To create an API, choose <strong>APIs</strong> in the Pods sidebar, then <strong>New API</strong>. Only Owners and Admins see the button.</p><ol><li>Pick a protocol: <strong>REST</strong>, <strong>HTTP</strong> or <strong>WebSocket</strong>. REST is selected to start with.</li><li>In <strong>Name</strong>, type up to 128 characters. Names are unique within the project, so Pods refuses a name another API already uses.</li><li>Optional: write a <strong>Description</strong> of up to 1,024 characters.</li><li>Optional, for an HTTP API: in <strong>Backend URL</strong>, type an <code>http://</code> or <code>https://</code> address.</li><li>Choose <strong>Create API</strong>.</li></ol><p>The new API appears in the list with its own API ID. A REST API starts with an empty root resource, <code>/</code>.</p><p>When you give an HTTP API a <strong>Backend URL</strong>, Pods also sets it up to serve traffic straight away: it adds a <code>$default</code> route that forwards every request to that address, creates a <code>$default</code> stage with auto-deploy turned on, and deploys the API to it.</p>$html$,
      '[]',
      10
    ),
    (
      'rest-http-websocket',
      'Concepts',
      'REST, HTTP and WebSocket APIs',
      $html$<p>Every API has one protocol, chosen when you create it. It can't be changed later: to switch, create a new API. The protocol decides what you build in the API editor.</p><ul><li><strong>REST</strong>: full-featured APIs built from a tree of resources and the methods on each path, with models, gateway responses, documentation, SDKs and agent tools. Only REST APIs can use the EDGE and PRIVATE endpoint types and resource policies.</li><li><strong>HTTP</strong>: lighter APIs built from routes, such as <code>GET /pets</code>, with their own CORS settings.</li><li><strong>WebSocket</strong>: APIs that keep a two-way connection open, built from routes such as <code>$connect</code>, <code>$disconnect</code> and your own route keys, with models.</li></ul><p>API keys and usage plans work with REST and WebSocket APIs.</p><p>The <a href="/help/pods/apis/resources-and-routes">Resources, routes and methods</a> guide covers building each kind.</p>$html$,
      '[]',
      20
    ),
    (
      'draft-deployments-stages',
      'Concepts',
      'The draft, deployments and stages',
      $html$<p>What you edit in the API editor is the API's <strong>draft</strong>: its resources or routes, integrations, authorizers and settings. Callers never reach the draft directly.</p><ul><li>A <strong>deployment</strong> is an immutable snapshot of the draft, taken when you deploy.</li><li>A <strong>stage</strong>, such as <code>prod</code>, is a named environment that serves one deployment at its own invoke URL.</li></ul><p>So a change to the draft reaches callers only once you deploy it to a stage. The exception is a stage with auto-deploy on, such as the <code>$default</code> stage Pods creates for an HTTP API given a <strong>Backend URL</strong>: Pods redeploys it about a second after each change to the draft. If the draft has an error, auto-deploy leaves live traffic as it was.</p><p>The <a href="/help/pods/apis/deployments-and-stages">Deployments and stages</a> guide covers deploying, stages and rolling back.</p>$html$,
      '[]',
      30
    ),
    (
      'api-list',
      'APIs',
      'The API list',
      $html$<p>Choose <strong>APIs</strong> in the sidebar to see every API in the project. The figures across the top count <strong>Total APIs</strong> and how many are <strong>REST</strong>, <strong>HTTP</strong> and <strong>WebSocket</strong>. Search and filters don't change them.</p><p>Each row shows the API's name and description, its <strong>Protocol</strong>, its <strong>Endpoint</strong> type, its <strong>API ID</strong> and when it was last <strong>Updated</strong>. Narrow the list with the <strong>Protocol</strong> filter, or search by name, description or API ID.</p><p>The list shows 25 APIs a page. Switch to 10, 50 or 100 at the bottom.</p><p>Click a row to open the API in the API editor. Each row's <strong>⋯</strong> menu has <strong>Open</strong>, <strong>Copy API ID</strong> and, for Owners and Admins, <strong>Delete</strong>.</p>$html$,
      '[]',
      40
    ),
    (
      'api-editor',
      'API editor',
      'The API editor',
      $html$<p>Click an API in the list to open it in the API editor. The header shows the API's name, its protocol and endpoint type, and its API ID. <strong>All APIs</strong>, at the top left, goes back to the list.</p><p>The editor's sections are listed beside it, in groups. Click one to open it, or type in <strong>Search screens</strong> to find it. Which sections appear depends on the protocol.</p><ul><li><strong>Overview</strong>: a summary of the API and its stages.</li><li><strong>Build</strong>: Resources (REST), Routes (HTTP and WebSocket), Integrations, Authorizers, Models (REST and WebSocket), CORS (HTTP) and Gateway Responses (REST).</li><li><strong>Release</strong>: Deployments and Stages.</li><li><strong>Observe</strong>: Monitoring, the API's requests, latency and errors.</li><li><strong>Distribute</strong>: Docs, SDKs and Agent Tools (REST), and Import / Export (REST and HTTP).</li><li><strong>Configure</strong>: Settings.</li></ul><p><strong>Deploy</strong>, at the top right, snapshots the draft onto a stage. Owners, Admins and Managers see it.</p>$html$,
      '[]',
      50
    ),
    (
      'api-overview',
      'API editor',
      'The API''s overview',
      $html$<p>An API opens on its <strong>Overview</strong> section in the API editor. The figures across the top show the <strong>Protocol</strong> and endpoint type, how many <strong>Stages</strong> it has and how many of them serve a deployment, whether its <strong>Default endpoint</strong> is on, and its <strong>Version</strong> label.</p><p><strong>At a glance</strong> lists the API ID, the IP address type, what callers get for a path that doesn't exist (<strong>Missing route</strong>) and the description. <strong>Copy API ID</strong> copies the ID.</p><p><strong>Stages</strong> lists each stage with its invoke URL, the address callers use. A stage can carry an <strong>Auto-deploy</strong> or <strong>Canary</strong> badge. Click the copy icon beside an invoke URL to copy it, or choose <strong>Manage</strong> to open the Stages section. Before anything is deployed, the box offers to open Deployments instead.</p><p><strong>Next steps</strong> has three shortcuts, in the order you build an API: <strong>Resources</strong> (or <strong>Routes</strong>), <strong>Integrations</strong> and <strong>Deploy</strong>, which opens Deployments.</p>$html$,
      '[]',
      60
    ),
    (
      'api-settings',
      'API editor',
      'API settings',
      $html$<p>The <strong>Settings</strong> section of the API editor holds the API's own settings. Only Owners and Admins can change them. Make your changes, then choose <strong>Save Changes</strong>.</p><ul><li><strong>Name</strong> (up to 128 characters), <strong>Version label</strong> (up to 64, such as <code>v1</code>) and <strong>Description</strong>. The protocol is fixed.</li><li><strong>Endpoint type</strong>: REGIONAL, the default, or EDGE or PRIVATE for a REST API. A PRIVATE API is reachable only through a Pods connector in ingress mode, with a resource policy that allows it.</li><li><strong>IP address type</strong>: IPv4 only, the default, or Dual-stack (IPv4 + IPv6).</li><li><strong>Disable default endpoint</strong>: stops serving the API at its invoke URLs from the next deployment, so it's reached only through custom domains. Mutual TLS needs it on.</li></ul><p>REST APIs also have <strong>Request handling</strong>:</p><ul><li><strong>API key source</strong>: HEADER, the default, or AUTHORIZER.</li><li><strong>Missing route behavior</strong>: 403 Missing Authentication Token (AWS), the default, or 404 Not Found.</li><li><strong>Binary media types</strong>: one per line, such as <code>image/png</code>.</li><li><strong>Minimum compression size</strong>: in bytes, from 0 to 10485760. Leave it empty to turn compression off.</li></ul><p>Further down are the <a href="/help/pods/apis/authorizers#resource-policies">resource policy</a> (REST) and tags. Managers and Members see "Access unavailable" here instead.</p>$html$,
      '[]',
      70
    ),
    (
      'tags',
      'API editor',
      'Tags',
      $html$<p>Tags are key and value pairs that label an API. They're in the <strong>Tags</strong> card of the API editor's <strong>Settings</strong> section. Choose <strong>Add Tag</strong>, type a <strong>Key</strong> and a <strong>Value</strong>, then choose <strong>Add Tag</strong> again.</p><ul><li>Keys are 1 to 128 characters of letters, numbers, spaces and <code>_ . : / = + - @</code>. Keys that start with <code>aws:</code> or <code>pods:</code> are reserved.</li><li>Values are up to 256 characters, and can be empty.</li><li>An API holds up to 50 tags. Each key is unique, so saving an existing key replaces its value.</li></ul><p>Click a tag to change its value. To remove one, choose <strong>Remove</strong> in its <strong>⋯</strong> menu and confirm. Each change saves straight away.</p>$html$,
      '[]',
      80
    ),
    (
      'deleting-an-api',
      'API editor',
      'Deleting an API',
      $html$<p>Deleting an API removes its draft and everything defined under it, and its stages stop serving traffic. It can't be undone in Pods. Only Owners and Admins can delete an API.</p><p>In the API editor, open <strong>Settings</strong> and choose <strong>Delete API</strong> under <strong>Danger zone</strong>. Type the API's name exactly to turn on <strong>Delete</strong>, then choose it. Pods returns to the API list.</p><p>You can also choose <strong>Delete</strong> in the API's <strong>⋯</strong> menu in the list. Pods asks you to confirm there too, without typing the name.</p>$html$,
      '[]',
      90
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"FolderTree","label":"Resources, routes & methods","href":"/help/pods/apis/resources-and-routes"},{"icon":"Plug","label":"Integrations","href":"/help/pods/apis/integrations"},{"icon":"ShieldCheck","label":"Authorizers & resource policies","href":"/help/pods/apis/authorizers"},{"icon":"Braces","label":"Models, CORS & gateway responses","href":"/help/pods/apis/models-and-responses"},{"icon":"Rocket","label":"Deployments & stages","href":"/help/pods/apis/deployments-and-stages"},{"icon":"BookOpen","label":"Docs, SDKs & OpenAPI","href":"/help/pods/apis/distribution"}]',
      100
    )
) as v(anchor_id, eyebrow, title, content, links, sort_order)
cross join (select id from public.docs_pages where slug = 'pods/apis' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'APIs',
    description = 'Create REST, HTTP and WebSocket APIs, find them in the API list, and work on each one in the API editor.',
    status = 'draft',
    published_at = null
where slug = 'pods/apis' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'pods/apis' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Creating an API</li><li>REST, HTTP and WebSocket</li><li>The API list</li><li>The API editor</li><li>API settings and deleting</li></ul>',
  10
from public.docs_pages p
where p.slug = 'pods/apis' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
