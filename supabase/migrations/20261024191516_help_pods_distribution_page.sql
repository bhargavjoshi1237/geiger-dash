-- Help pods distribution page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the pods/apis/distribution draft outline
-- (from 20261024191500_help_pods_structure) with the full Docs, SDKs & OpenAPI guide and publishes it.
-- Left out on purpose: the Java, Android, Swift, Ruby, Go and Kotlin SDK choices (they produce placeholder stubs,
-- lib/sdk/extended.mjs), and the MCP URL the Agent Tools section displays (it points at an unrouted /gw/ path; the
-- gateway serves MCP at the stage's invoke URL plus /_mcp, which the page states). No Pods showcases exist, so the
-- page embeds none.
-- Written from a survey of C:\Pro\geiger-pods (components/internal/screens/distribution/docs_tab.jsx,
-- import_wizard.jsx, export_dialog.jsx, sdk_panel.jsx, agent_tools_panel.jsx, components/internal/screens/apis/tabs.js,
-- lib/control/documentation.mjs, openapi-import.mjs, openapi-export.mjs, sdks.mjs, agent-tools.mjs, lib/sdk/*,
-- lib/gateway/distribution/mcp.mjs, gateway/server.mjs).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Docs, SDKs & OpenAPI',
    description = 'Document a REST API, import or export it as OpenAPI, generate client SDKs from a stage, and serve its operations to AI agents as MCP tools.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'pods/apis/distribution' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'pods/apis/distribution' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.sort_order
from (
  values
    (
      'importing-openapi',
      'Basics',
      'Importing an OpenAPI document',
      $html$<p>To build an API from an existing description, import it. Open the API from <strong>APIs</strong> and choose <strong>Import / Export</strong> in the API editor's section list. REST and HTTP APIs have it, and only Owners and Admins can import.</p><ol><li>Under <strong>Import OpenAPI</strong>, paste a Swagger 2.0 or OpenAPI 3.x document in JSON or YAML into <strong>Document</strong>, or choose a file under <strong>Upload a file</strong>. Documents can be up to 6 MB.</li><li>Pick the <strong>Import mode</strong>: <strong>Overwrite draft</strong>, the default, replaces the draft with the document; <strong>Merge into draft</strong> combines the two.</li><li>Optional: turn on <strong>Fail on warnings</strong> to stop the import if the document produces any warning.</li><li>Optional: choose <strong>Preview Warnings</strong> for a dry run. It lists up to 50 warnings and changes nothing.</li><li>Choose <strong>Confirm Import</strong>. For an overwrite, Pods asks you to confirm.</li></ol><p>An overwrite replaces the draft's routes or resources, integrations, models and authorizers. Integrations described in the document are created and connected to their routes or methods. The import changes only the draft, so deploy afterwards to serve it.</p>$html$,
      '[]',
      10
    ),
    (
      'exporting-openapi',
      'Import / Export',
      'Exporting an API',
      $html$<p>To download an API's description, open it from <strong>APIs</strong>, choose <strong>Import / Export</strong> in the API editor's section list and go to <strong>Export</strong>. The file is built from what a stage serves, never the draft, so the API needs at least one stage. Only Owners and Admins can export.</p><ul><li><strong>Stage</strong>: the stage to export.</li><li><strong>Type</strong>: OpenAPI 3.0, the default, or Swagger 2.0.</li><li><strong>Format</strong>: JSON or YAML.</li><li><strong>Extensions</strong>: AWS, the default, which lets the file round-trip into AWS API Gateway; Pods; None; or Postman v2.1 for a Postman collection.</li><li><strong>Include documentation</strong>: on by default. Embeds the stage's documentation in the file.</li></ul><p>Choose <strong>Download</strong>. The file is named after the API and the stage.</p>$html$,
      '[]',
      20
    ),
    (
      'documentation-parts',
      'Docs',
      'Documenting a REST API',
      $html$<p>Documentation in Pods is a set of <strong>documentation parts</strong>, each attached to one place in a REST API. Open the API from <strong>APIs</strong>, choose <strong>Docs</strong> in the API editor's section list, then <strong>Add Part</strong>.</p><ul><li><strong>Location type</strong>: API, AUTHORIZER, MODEL, RESOURCE, METHOD (the default), PATH_PARAMETER, QUERY_PARAMETER, REQUEST_HEADER, REQUEST_BODY, RESPONSE, RESPONSE_HEADER or RESPONSE_BODY.</li><li><strong>Path</strong>, <strong>Method</strong> and <strong>Status code</strong>: where it applies, such as <code>/pets</code>, <code>GET</code> and <code>200</code>. Use <code>*</code> for the method or status code to cover every match.</li><li><strong>Properties</strong>: a JSON object, such as a description and summary.</li></ul><p>Choose <strong>Add Part</strong>. A part with a <code>*</code>, or on a parent path, applies to everything beneath it until a more specific part overrides it; the list marks these with <strong>Inherits</strong>. To remove a part, choose <strong>Delete</strong> in its <strong>⋯</strong> menu and confirm. Owners, Admins and Managers can edit documentation.</p>$html$,
      '[]',
      30
    ),
    (
      'documentation-versions',
      'Docs',
      'Documentation versions',
      $html$<p>A <strong>documentation version</strong> freezes the current documentation parts under a name, so later edits don't change it. In the API editor's Docs section:</p><ol><li>Choose <strong>Freeze Version</strong>, type a <strong>Version name</strong> such as <code>v1</code>, and choose <strong>Freeze Version</strong>.</li><li>To show a version on a stage, choose <strong>Pin to Stage</strong>, or <strong>Pin to stage</strong> in the version's <strong>⋯</strong> menu. Pick the <strong>Stage</strong> and the <strong>Version</strong>, then choose <strong>Pin Version</strong>.</li></ol><p>To unpin, pick <strong>No version (unpin)</strong> and choose <strong>Unpin</strong>. Deleting a documentation part leaves frozen versions as they were. The versions list shows how many parts each one holds and when it was frozen.</p>$html$,
      '[]',
      40
    ),
    (
      'generating-sdks',
      'SDKs',
      'Generating a client SDK',
      $html$<p>Pods can generate a client library for a REST API from what a stage serves. Open the API from <strong>APIs</strong> and choose <strong>SDKs</strong> in the API editor's section list. The API needs a stage first, and only Owners and Admins can generate SDKs.</p><ol><li>Pick the <strong>Stage</strong> to build from.</li><li>Pick a <strong>Language</strong>: JavaScript, TypeScript (the default) or Python.</li><li>Optional: change the <strong>Package name</strong> (<code>pods-client</code> to start with) and <strong>Version</strong> (<code>0.1.0</code>).</li><li>Choose <strong>Generate & Download</strong>.</li></ol><p>Pods downloads the SDK as a ZIP file. The client calls the stage's invoke URL, and describes request and response bodies from the API's models.</p>$html$,
      '[]',
      50
    ),
    (
      'agent-tools',
      'Agent tools',
      'Agent tools for AI agents',
      $html$<p>Agent tools serve a REST API's operations to AI agents as MCP tools, one tool per operation. Open the API from <strong>APIs</strong> and choose <strong>Agent Tools</strong> in the API editor's section list. Agent tools are set per stage, and the API needs a stage first.</p><ol><li>Pick the <strong>Stage</strong>.</li><li>Turn on <strong>Serve agent tools</strong>. It saves straight away.</li><li>Optional: under <strong>Allowed operations</strong>, list the operations to offer, one per line, as an operation name or a method and path such as <code>GET /pets/{id}</code>, then choose <strong>Save Allow-List</strong>. Leave it empty to offer every operation.</li></ol><p>Agents connect over MCP's Streamable HTTP at the stage's invoke URL followed by <code>/_mcp</code>. Each tool call runs through the stage like a normal request, so authorizers, API keys, throttling, the firewall and logs all apply: give the agent's client the same <code>Authorization</code> and <code>x-api-key</code> headers a normal caller sends. Tool descriptions come from the API's documentation parts. Owners, Admins and Managers can change agent tools.</p>$html$,
      '[]',
      60
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"Network","label":"APIs","href":"/help/pods/apis"},{"icon":"Rocket","label":"Deployments & stages","href":"/help/pods/apis/deployments-and-stages"},{"icon":"BookOpen","label":"Developer portals","href":"/help/pods/portals"}]',
      70
    )
) as v(anchor_id, eyebrow, title, content, links, sort_order)
cross join (select id from public.docs_pages where slug = 'pods/apis/distribution' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Docs, SDKs & OpenAPI',
    description = 'Document an API, import or export it as OpenAPI, generate client SDKs, and expose it as tools for AI agents.',
    status = 'draft',
    published_at = null
where slug = 'pods/apis/distribution' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'pods/apis/distribution' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Documentation parts and versions</li><li>Importing and exporting OpenAPI</li><li>Generating SDKs</li><li>Agent tools</li></ul>',
  10
from public.docs_pages p
where p.slug = 'pods/apis/distribution' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
