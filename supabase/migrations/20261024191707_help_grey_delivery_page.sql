-- Help grey delivery page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the grey/delivery draft outline
-- (20261024191700_help_grey_structure) with the full API keys, MCP servers & widgets guide and publishes it.
-- Lookup tools (Tools scope, published tool MCP tools) are left out: the Tools screen isn't in the registry yet.
-- Written from a survey of C:\Pro\geiger-grey (components/internal/screens/delivery/*, components/internal/shared/copy_block.jsx,
-- lib/supabase/api_keys.js, mcp_servers.js, widgets.js, lib/grey/api_keys.js, api_key_eval.js, domains.js,
-- openai_frames.js, lib/server/api_key_auth.js, cors.js, lib/server/mcp/tools.js, lib/engine/pipeline_config.js,
-- app/api/api-keys/route.js, app/api/v1/pipelines/*, app/api/mcp/[serverId]/route.js, app/api/widget/[widgetId]/*,
-- public/widget.js, geiger-ui.config.js, geiger-rbac.config.js).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'API keys, MCP servers & widgets',
    nav_label = 'Delivery',
    description = 'Serve published pipelines outside Grey: create API keys for your own apps, connect AI clients through MCP servers, and embed a chat widget on your site.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'grey/delivery' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'grey/delivery' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.sort_order
from (
  values
    (
      'creating-an-api-key',
      'Basics',
      'Creating an API key',
      $html$<p>API keys let your own apps and AI clients call Grey. To create one, go to <strong>Delivery → API Keys</strong> and choose <strong>New API Key</strong>.</p><ul><li><strong>Name</strong>: required, up to 80 characters.</li><li><strong>Scopes</strong>: what the key can call. <strong>Retrieve</strong> (the retrieve endpoint) and <strong>Chat</strong> (chat completions) are selected to start with; <strong>MCP</strong> lets MCP clients connect with it. Pick at least one.</li><li><strong>Pipelines</strong>: leave it empty to allow every pipeline in the project, or select the ones the key can use.</li><li><strong>Rate limit (per minute)</strong>: a whole number from 1 to 10,000. It starts at 60.</li><li><strong>Expires</strong>: optional, and it must be a future date.</li></ul><p>Choose <strong>Create Key</strong>. The full key, starting with <code>gk_live_</code>, is shown once: copy it before you choose <strong>Done</strong>. Grey keeps only a fingerprint of it, so a lost key can't be shown again: revoke it and create a new one.</p><p>Managing keys needs the <strong>Manage API keys</strong> permission, which Owners and Admins have. Without it, <strong>New API Key</strong> is disabled, and hovering over it says why.</p>$html$,
      '[]',
      10
    ),
    (
      'serving-pipelines',
      'Concepts',
      'How pipelines are served',
      $html$<p>Grey serves a pipeline outside the app in three ways: the <strong>API</strong>, for your own code; <strong>MCP servers</strong>, for AI clients such as Claude Desktop and Cursor; and <strong>widgets</strong>, a chat bubble on your website.</p><p>All three answer with the pipeline's latest published version, so publish the pipeline first; see <a href="/help/grey/pipelines#publishing-versions">Publishing a version</a>. Unlike the Playground, they always answer from the knowledge bases only.</p><p>Each request is recorded in <strong>Usage → Request Logs</strong> with its channel (API, MCP or Widget), and each answered request that retrieved passages counts as a retrieval in <strong>Usage & Costs</strong>. See <a href="/help/grey/usage">Usage and request logs</a>.</p><p><strong>MCP Servers</strong> and <strong>Widgets</strong> depend on <strong>API Keys</strong>, so hiding API Keys from your sidebar hides them too.</p>$html$,
      '[]',
      20
    ),
    (
      'managing-api-keys',
      'API Keys',
      'Managing API keys',
      $html$<p><strong>Delivery → API Keys</strong> lists the project's keys with their scopes, pipelines, rate limit, when each was last used, when it expires and its status: <strong>Active</strong>, <strong>Revoked</strong> or <strong>Expired</strong>. Search by name or by the key's first characters.</p><p>Each key's <strong>⋯</strong> menu has:</p><ul><li><strong>Revoke</strong>: asks you to confirm with <strong>Revoke Key</strong>. Requests using the key start failing straight away, and a revoked key can't be turned back on.</li><li><strong>Delete</strong>: asks you to confirm, then removes the key from the list for good.</li></ul><p>Both need the <strong>Manage API keys</strong> permission.</p>$html$,
      '[]',
      30
    ),
    (
      'calling-the-api',
      'API Keys',
      'Calling the API',
      $html$<p>Each pipeline's <strong>Endpoints</strong> section shows its <strong>Chat completions</strong> and <strong>Retrieve</strong> addresses, with copyable code samples. Send the key in the <code>Authorization</code> header as <code>Bearer</code> followed by the key.</p><ul><li><strong>Chat completions</strong> works with OpenAI SDKs and tools: set the SDK's base URL to the pipeline's <strong>OpenAI base URL</strong>. The <code>model</code> you send is ignored, answers include their citations, and <code>stream</code> is supported. Only text messages work, and the last message must be the user's question.</li><li><strong>Retrieve</strong> returns matching passages without an answer. Send a <code>query</code> of up to 8,000 characters, and optionally <code>topK</code> (1 to 50), <code>threshold</code> (0 to 1) and <code>kbIds</code>, a subset of the pipeline's knowledge bases.</li></ul><p>Calls fail when the key lacks the scope, isn't allowed on that pipeline, or is revoked or expired; when the pipeline isn't published yet; and when the key's rate limit is used up, in which case the response says how many seconds to wait.</p>$html$,
      '[]',
      40
    ),
    (
      'creating-an-mcp-server',
      'MCP Servers',
      'Creating an MCP server',
      $html$<p>An MCP server lets AI clients such as Claude Desktop and Cursor search your knowledge bases and ask your pipeline questions. To create one, go to <strong>Delivery → MCP Servers</strong> and choose <strong>New MCP Server</strong>.</p><ul><li><strong>Name</strong>: required.</li><li><strong>Knowledge bases</strong>: the ones the server can search.</li><li><strong>Pipeline</strong>: required. It answers the server's questions.</li><li><strong>API key</strong>: optional. Clients connect with a key that has the <strong>MCP</strong> scope. Pick one here to accept only that key, or leave it empty to accept any of the project's keys with that scope. Only active keys are listed.</li><li><strong>Tools</strong>: what clients can call. <strong>search</strong> (search the knowledge bases) and <strong>ask</strong> (ask the pipeline) are on to start with; <strong>get_entity</strong> (look up a knowledge graph entity) and <strong>list_sources</strong> (list the sources) are off.</li></ul><p>Choose <strong>Create Server</strong>. Managing MCP servers needs the <strong>Manage MCP servers</strong> permission, which Owners and Admins have.</p>$html$,
      '[]',
      50
    ),
    (
      'connecting-a-client',
      'MCP Servers',
      'Connecting an MCP client',
      $html$<p>Click a server in <strong>Delivery → MCP Servers</strong> to open its details. They show its <strong>Server URL</strong>, the tools it has turned on, and under <strong>Connect a client</strong>, a ready-made configuration on the <strong>Claude Desktop</strong> and <strong>Cursor</strong> tabs. Add it to <code>claude_desktop_config.json</code> or <code>.cursor/mcp.json</code>, and put your API key in place of the placeholder in its <code>Authorization</code> header.</p><p>The <strong>Status</strong> switch turns the server off without deleting it: clients are refused until you turn it back on. The list's <strong>⋯</strong> menu has <strong>Edit</strong> and <strong>Delete</strong>. Deleting asks you to confirm, connected clients stop working straight away, and it can't be undone. Each pipeline's <strong>Endpoints</strong> section also lists the MCP servers that use it.</p>$html$,
      '[]',
      60
    ),
    (
      'creating-a-widget',
      'Widgets',
      'Creating a widget',
      $html$<p>A widget is a chat bubble you embed on your own website, answering visitors with one pipeline. To create one, go to <strong>Delivery → Widgets</strong> and choose <strong>New Widget</strong>.</p><ul><li><strong>Name</strong> and <strong>Pipeline</strong>: required.</li><li><strong>API key</strong>: optional. Revoking the key turns the widget off, and the widget answers up to the key's rate limit each minute, or 60 without a key. The key is never sent to visitors' browsers.</li><li><strong>Allowed domains</strong>: the sites that can show the widget, like <code>docs.example.com</code>, or <code>*.example.com</code> for every subdomain (not the bare domain). Pages must use https. With no domains, the widget works nowhere.</li><li><strong>Title</strong>, <strong>Greeting</strong> and <strong>Placeholder</strong>: the text visitors see. They start as Chat with us, a greeting, and Type your question.</li><li><strong>Position</strong>: <strong>Left</strong> or <strong>Right</strong> (the default) corner of the page.</li><li><strong>White-label</strong>: hides the Powered by Grey footer.</li></ul><p>The <strong>Preview</strong> shows the bubble and chat panel as you change them. Choose <strong>Create Widget</strong>. Managing widgets needs the <strong>Manage widgets</strong> permission, which Owners and Admins have.</p>$html$,
      '[]',
      70
    ),
    (
      'embedding-a-widget',
      'Widgets',
      'Embedding and managing widgets',
      $html$<p>Once a widget is saved, its <strong>Embed snippet</strong> appears in the widget's form. Paste it into your page before the closing <code>body</code> tag. Every site that embeds the widget must be in <strong>Allowed domains</strong>; other sites are refused.</p><p>Visitors' conversations appear in <strong>Playground → Conversations</strong> on the Widget channel. A visitor can send messages of up to 2,000 characters, up to 10 a minute, and a conversation can run to 50 turns before the widget asks them to start a new one.</p><p>Click a widget in the list to edit it. Each widget's <strong>⋯</strong> menu has <strong>Edit</strong>, <strong>Disable</strong> or <strong>Enable</strong>, and <strong>Delete</strong>. A disabled widget tells visitors it's turned off. Deleting asks you to confirm and can't be undone.</p>$html$,
      '[]',
      80
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"Workflow","label":"Pipelines & model providers","href":"/help/grey/pipelines"},{"icon":"Gauge","label":"Usage & request logs","href":"/help/grey/usage"},{"icon":"MessagesSquare","label":"Playground","href":"/help/grey/playground"},{"icon":"Users","label":"Team & roles","href":"/help/grey/team"},{"icon":"Library","label":"Knowledge bases","href":"/help/grey/knowledge-bases"},{"icon":"Settings","label":"Project settings","href":"/help/grey/settings"}]',
      90
    )
) as v(anchor_id, eyebrow, title, content, links, sort_order)
cross join (select id from public.docs_pages where slug = 'grey/delivery' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Delivery',
    nav_label = null,
    description = 'Serve pipelines to apps and people through API keys, MCP servers and embeddable chat widgets.',
    status = 'draft',
    published_at = null
where slug = 'grey/delivery' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'grey/delivery' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>API keys</li><li>MCP servers</li><li>Widgets</li></ul>',
  10
from public.docs_pages p
where p.slug = 'grey/delivery' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
