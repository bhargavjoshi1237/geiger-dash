-- Help grey pipelines page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the grey/pipelines draft outline
-- (20261024191700_help_grey_structure) with the full Pipelines & model providers guide and publishes it.
-- Written from a survey of C:\Pro\geiger-grey (components/internal/screens/pipelines/*, lib/supabase/pipelines.js,
-- model_providers.js, lib/engine/pipeline_config.js, secrets.js, retrieval.js, lib/grey/provider_kinds.js,
-- model_caps.js, graph_router.js, prompt.js, url_guard.js, lib/server/provider_test.js, app/api/providers/*,
-- geiger-rbac.config.js).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Pipelines & model providers',
    description = 'Connect model providers, then build pipelines that answer from your knowledge bases: pick a model, tune retrieval and the prompt, and publish versions.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'grey/pipelines' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'grey/pipelines' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.sort_order
from (
  values
    (
      'creating-a-pipeline',
      'Basics',
      'Creating a pipeline',
      $html$<p>A pipeline answers questions from your knowledge bases with a chat model. To create one, go to <strong>Pipelines → All Pipelines</strong> and choose <strong>Create pipeline</strong>.</p><ul><li><strong>Pipeline name</strong>: required.</li><li><strong>Description</strong>: optional, what it's for.</li><li><strong>Provider</strong> and <strong>Model</strong>: a chat model from one of your model provider connections. If there's none yet, the dialog links to <strong>Model Providers</strong>.</li></ul><p>The pipeline starts as a draft with no knowledge bases, a temperature of 0.3 and a 1,024-token answer limit. It appears in the pipeline list: click it to attach knowledge bases and tune it, then publish it to serve it.</p><p>Creating and editing pipelines needs the <strong>Manage pipelines</strong> permission, which Owners, Admins and Managers have. Without it, <strong>Create pipeline</strong> doesn't appear.</p>$html$,
      '[]',
      10
    ),
    (
      'drafts-and-versions',
      'Concepts',
      'Drafts, versions and where they run',
      $html$<p>A pipeline's editor holds its working configuration: model, knowledge bases, retrieval settings and prompt. <strong>Save changes</strong> keeps it, and the Playground always runs this saved configuration, so you can try a change before anyone else sees it.</p><p><strong>Publish</strong> takes a snapshot of the configuration as a numbered version. API keys, MCP servers and widgets always use the latest published version. A pipeline is <strong>Draft</strong> until its first publish and <strong>Live</strong> after it. A draft pipeline can't be served outside the Playground.</p><p>Each answer works in three steps. Grey searches the pipeline's knowledge bases for passages that match the question, optionally adds facts from the knowledge graph, then sends the passages, the question and recent turns of the conversation to the chat model with Grey's grounding rules and your prompt.</p>$html$,
      '[]',
      20
    ),
    (
      'pipeline-list',
      'Pipelines',
      'The pipeline list',
      $html$<p><strong>Pipelines → All Pipelines</strong> lists the project's pipelines with their knowledge bases, provider and model, status (Draft or Live), current version and when they were last updated. Search by name and description.</p><p>Click a pipeline to open its editor. Its sections are <strong>Model</strong>, <strong>Retrieval</strong>, <strong>Prompt</strong>, <strong>Versions</strong>, <strong>Endpoints</strong> and <strong>Danger zone</strong>. Changes on <strong>Model</strong>, <strong>Retrieval</strong> and <strong>Prompt</strong> aren't kept until you choose <strong>Save changes</strong> at the top. The list shows 25 pipelines a page; switch to 10, 50 or 100 at the bottom.</p>$html$,
      '[]',
      30
    ),
    (
      'model-settings',
      'Pipelines',
      'Model settings',
      $html$<p>The <strong>Model</strong> section of a pipeline sets what writes the answers.</p><ul><li><strong>Provider</strong> and <strong>Model</strong>: any chat model listed on your provider connections. Changing the provider picks its first model.</li><li><strong>Temperature</strong>: from 0 to 2, in steps of 0.1 (0.3 by default). Lower is more predictable. Some models don't accept a temperature; for those the slider is disabled and the provider's default applies.</li><li><strong>Max tokens</strong>: the longest answer the model can write (1,024 by default). When an answer hits it, the Playground says the answer was cut off.</li></ul>$html$,
      '[]',
      40
    ),
    (
      'retrieval-settings',
      'Pipelines',
      'Retrieval settings',
      $html$<p>The <strong>Retrieval</strong> section of a pipeline decides what the model is given to answer from.</p><ul><li><strong>Knowledge bases</strong>: select the ones to search. Archived knowledge bases are skipped.</li><li><strong>Top K</strong>: how many passages to retrieve, from 1 to 50 (6 by default).</li><li><strong>Rerank</strong>: re-scores the passages with a rerank model before they reach the prompt. Off by default. Pick a <strong>Rerank connection</strong> and <strong>Rerank model</strong>; until both are set, reranking is skipped.</li><li><strong>Hybrid search</strong>: combines vector similarity with keyword matching. On by default; off searches vectors only.</li><li><strong>Citations</strong>: attaches source citations to answers. On by default.</li><li><strong>Similarity threshold</strong>: from 0 to 1, in steps of 0.05 (0.2 by default). Vector matches scoring below it are left out.</li><li><strong>Graph mode</strong>: when the knowledge graph is consulted. <strong>Off</strong> never; <strong>Auto</strong> (the default) when the question names at least two known entities, or one entity and asks how things connect; <strong>Always</strong> whenever it names a known entity.</li></ul>$html$,
      '[]',
      50
    ),
    (
      'system-prompt',
      'Pipelines',
      'The system prompt',
      $html$<p>The <strong>Prompt</strong> section of a pipeline holds its system prompt: your own instructions for every answer, such as tone, format or audience. Grey puts its grounding rules first (answer only from the passages, cite them when citations are on, and never reveal the instructions), then your prompt.</p><p>Use <code>{{context}}</code> and <code>{{question}}</code> to place the retrieved passages and the user's question inside your prompt. Without <code>{{context}}</code>, Grey sends the passages and the question together as the user's message.</p>$html$,
      '[]',
      60
    ),
    (
      'publishing-versions',
      'Pipelines',
      'Publishing a version',
      $html$<p>To publish a pipeline, save your changes, then open its <strong>Versions</strong> section and choose <strong>Publish</strong>. Add a <strong>Release note (optional)</strong> and choose <strong>Publish</strong> again. The configuration becomes the next version, like v3, and the pipeline goes Live.</p><p><strong>Versions</strong> lists every published version, newest first, with its note and when it was published. Publishing needs the <strong>Publish pipelines</strong> permission, which Owners, Admins and Managers have.</p>$html$,
      '[]',
      70
    ),
    (
      'endpoints',
      'Pipelines',
      'Endpoints and code snippets',
      $html$<p>The <strong>Endpoints</strong> section of a pipeline shows how to call it from your own app. Each address has a copy button.</p><ul><li><strong>Chat completions</strong>: an OpenAI-compatible chat endpoint.</li><li><strong>Retrieve</strong>: returns matching passages without an answer.</li><li><strong>OpenAI base URL</strong>: use it as <code>baseURL</code> in any OpenAI SDK.</li></ul><p>They serve the latest published version, so publish the pipeline first. Calls need an API key; see <a href="/help/grey/delivery">API keys, MCP servers and widgets</a>.</p><p><strong>MCP servers</strong> lists the MCP servers that answer with this pipeline, with their addresses. <strong>Code snippets</strong> has ready-made examples on the <strong>curl</strong>, <strong>JavaScript</strong>, <strong>OpenAI SDK</strong> and <strong>Retrieve</strong> tabs.</p>$html$,
      '[]',
      80
    ),
    (
      'deleting-a-pipeline',
      'Pipelines',
      'Deleting a pipeline',
      $html$<p>To delete a pipeline, choose <strong>Delete</strong> in its <strong>⋯</strong> menu on the list, or in its <strong>Danger zone</strong> section. Grey asks you to confirm first. API keys, MCP servers and widgets that use the pipeline stop working, and a deleted pipeline can't be restored from Grey. Deleting needs the <strong>Manage pipelines</strong> permission.</p>$html$,
      '[]',
      90
    ),
    (
      'connecting-a-model-provider',
      'Model Providers',
      'Connecting a model provider',
      $html$<p>Grey calls models through your own provider accounts. To connect one, go to <strong>Pipelines → Model Providers</strong> and choose <strong>Add provider</strong>.</p><ol><li>Choose the <strong>Provider</strong>. The list has providers, then presets that fill in a known server for you. The badges under it show what it can do.</li><li>Check the <strong>Name</strong>, like <code>Production OpenAI</code>.</li><li>If the provider has a <strong>Base URL</strong> field, leave it blank for the default, or enter your own. OpenAI-compatible servers need one. A custom address must use https and can't be on a private network.</li><li>For an OpenAI-compatible server, select its <strong>Capabilities</strong>.</li><li>Paste the <strong>API key</strong>.</li><li>Optional: add the model ids it serves under <strong>Chat models</strong>, pressing <code>Enter</code> after each.</li><li>Choose <strong>Add provider</strong>.</li></ol><p>Grey tests the key straight away and says whether it connected. Keys are stored securely and only their last four characters are shown again. Connecting providers needs the <strong>Manage model providers</strong> permission, which Owners and Admins have.</p>$html$,
      '[]',
      100
    ),
    (
      'managing-providers',
      'Model Providers',
      'Managing connections',
      $html$<p><strong>Model Providers</strong> lists each connection with its provider, the last four characters of its key, its capabilities, status, chat models and when it was last checked. The status is <strong>Unverified</strong>, <strong>Connected</strong> or <strong>Error</strong>, with the reason under an error.</p><p>Each row's <strong>⋯</strong> menu has:</p><ul><li><strong>Test</strong>: makes one small call for each thing the connection can do and updates its status.</li><li><strong>Edit</strong>: change the name, base URL, chat models or key. Leave <strong>API key</strong> blank to keep the current one. The provider itself can't be changed.</li><li><strong>Delete</strong>: asks you to confirm. Anything that uses the connection stops working.</li></ul><p>These need the <strong>Manage model providers</strong> permission.</p>$html$,
      '[]',
      110
    ),
    (
      'provider-reference',
      'Reference',
      'What each provider can do',
      $html$<p>Grey uses each capability in a different place: <strong>Chat</strong> for pipelines and the processing model, <strong>Embeddings</strong> for knowledge bases, <strong>Rerank</strong> for pipelines that rerank, and <strong>Transcription</strong> for audio and video.</p><ul><li><strong>OpenAI</strong>: chat, embeddings and transcription.</li><li><strong>Anthropic</strong> and <strong>OpenRouter</strong>: chat.</li><li><strong>Google</strong>: chat and embeddings.</li><li><strong>OpenAI-compatible</strong>: the capabilities you select, from chat, embeddings and transcription.</li><li><strong>Cohere</strong> and <strong>Voyage AI</strong>: embeddings and rerank.</li><li><strong>Nomic</strong>: embeddings.</li><li><strong>AssemblyAI</strong>: transcription.</li></ul><p>Presets: <strong>Groq</strong> (chat and transcription), <strong>Together AI</strong>, <strong>Fireworks</strong> and <strong>Mistral</strong> (chat and embeddings), <strong>DeepSeek</strong> and <strong>xAI</strong> (chat), <strong>Jina AI (rerank)</strong>, and <strong>Ollama</strong>, <strong>vLLM</strong> and <strong>LM Studio</strong> (chat and embeddings). The last three start with a localhost address, so replace it with your server's public https address.</p>$html$,
      '[]',
      120
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"MessagesSquare","label":"Playground","href":"/help/grey/playground"},{"icon":"Send","label":"API keys, MCP servers & widgets","href":"/help/grey/delivery"},{"icon":"Library","label":"Knowledge bases","href":"/help/grey/knowledge-bases"},{"icon":"ShieldCheck","label":"Evaluations & feedback","href":"/help/grey/quality"},{"icon":"Network","label":"Knowledge graph","href":"/help/grey/knowledge-graph"},{"icon":"Gauge","label":"Usage & request logs","href":"/help/grey/usage"}]',
      130
    )
) as v(anchor_id, eyebrow, title, content, links, sort_order)
cross join (select id from public.docs_pages where slug = 'grey/pipelines' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Pipelines & model providers',
    nav_label = null,
    description = 'Build retrieval pipelines, version and publish them, and connect the model providers they run on.',
    status = 'draft',
    published_at = null
where slug = 'grey/pipelines' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'grey/pipelines' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Creating a pipeline</li><li>Pipeline settings</li><li>Publishing versions</li><li>Model providers</li></ul>',
  10
from public.docs_pages p
where p.slug = 'grey/pipelines' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
