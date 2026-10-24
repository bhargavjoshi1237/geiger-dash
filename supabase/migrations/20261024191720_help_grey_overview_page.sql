-- Help grey overview page
--
-- One-time content move, like 20261024142451_help_flow_overview_page: replaces the Grey Overview's draft outline
-- (re-homed from products/grey by 20261024191700_help_grey_structure) with the full overview and publishes it, now
-- that every Grey area has its own guide (20261024191701 to 20261024191711). Each headline area gets a section that
-- links to its guide. Grey isn't in SANDBOX_APP_IDS, so the page has no preview hero.
-- Written from a survey of C:\Pro\geiger-grey (lib/workspace/nav_tree.js, components/internal/screens/registry.jsx,
-- components/internal/topbar/topbar.jsx, components/internal/workspace/*, context/project-context.js,
-- lib/engine/turn.js, geiger-rbac.config.js; @geiger/ui 258dd6a src/ui/topbar.jsx and src/ui/command-palette.jsx)
-- and the area guides' surveys named in their own migration headers.
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Geiger Grey',
    nav_label = 'Overview',
    description = 'Grey turns your documents into knowledge bases and a knowledge graph, and answers questions from them through pipelines you can test, call and embed.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'grey' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'grey' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, cards, features, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.cards::jsonb, v.features::jsonb, v.sort_order
from (
  values
    (
      'start-here',
      null,
      'Start here',
      '',
      '[{"icon":"FolderKanban","title":"Open a project","body":"Launch Grey from a project in your organization","href":"/org"},{"icon":"Library","title":"Create a knowledge base","body":"Add the documents Grey answers from","href":"/help/grey/knowledge-bases"},{"icon":"Workflow","title":"Build a pipeline","body":"Answer questions with your own models","href":"/help/grey/pipelines"}]',
      '[]',
      10
    ),
    (
      'opening-grey',
      'Basics',
      'Opening Grey',
      $html$<p>Grey works inside a <strong>project</strong>. Open your organization in Dash and choose Grey on one of its projects. Everything you create in Grey belongs to the project you have open: its knowledge bases, pipelines, keys, conversations and settings. Everyone in the project's organization can open it, with a role based on their organization role.</p><p>Grey opens on the project's <strong>Overview</strong>. The sidebar lists its areas, from Overview and Knowledge Bases down to Usage and Settings. Sections your role can't see aren't shown, and you can hide the ones you don't use under <strong>Settings → Navigation</strong>.</p><p>To jump to any screen, use <strong>Search Grey</strong> in the top bar, or press <code>Ctrl K</code> (<code>⌘ K</code> on Mac). If you have no projects yet, Grey shows <strong>No projects yet</strong> with <strong>Create project</strong>: name the project and Grey switches to it.</p>$html$,
      '[]',
      '[]',
      20
    ),
    (
      'setting-up-a-project',
      'Basics',
      'Setting up a project',
      $html$<p>A new project needs a few things in place before it can answer questions. In order:</p><ol><li>Connect your model provider accounts in <strong>Pipelines → Model Providers</strong>: at least one that can create embeddings and one with chat models.</li><li>Pick a processing model in <strong>Settings → General</strong>, so Grey can build the knowledge graph and describe images.</li><li>Create a knowledge base in <strong>Knowledge Bases → All Knowledge Bases</strong>, with an embedding model and an ingestion preset.</li><li>Add sources to it: upload files, import from Assets and Notes, or add web pages.</li><li>Create a pipeline in <strong>Pipelines → All Pipelines</strong> and select the knowledge base under its <strong>Retrieval</strong> settings.</li><li>Ask it questions in <strong>Playground → Chat</strong>.</li><li>Publish the pipeline, then serve it through an API key, an MCP server or a widget.</li></ol><p>Connecting providers, picking the processing model and setting up API keys, MCP servers or widgets need an Owner or Admin. Managers can do the other steps.</p>$html$,
      '[]',
      '[]',
      30
    ),
    (
      'project-areas',
      'Areas',
      'What''s in a project',
      '<p>Each section of the sidebar covers one part of running Grey, and each has its own guide. The sections on this page sum them up and link to each one.</p>',
      '[]',
      '[{"icon":"LayoutDashboard","text":"Overview: queries, spending, ingestion and what needs attention"},{"icon":"Library","text":"Knowledge bases: embedding models, ingestion settings and presets"},{"icon":"FileStack","text":"Sources: uploads, imports, web pages and ingestion jobs"},{"icon":"Network","text":"Knowledge graph: entities, relations and the ontology"},{"icon":"MessagesSquare","text":"Playground: chat with a pipeline and review conversations"},{"icon":"Workflow","text":"Pipelines: models, retrieval, prompts, versions and providers"},{"icon":"Send","text":"Delivery: API keys, MCP servers and chat widgets"},{"icon":"ShieldCheck","text":"Quality: evaluations and answer feedback"},{"icon":"Gauge","text":"Usage: costs, a monthly soft cap and request logs"},{"icon":"Settings","text":"Settings: models, team, roles, navigation and data export"}]',
      40
    ),
    (
      'knowledge-bases-and-sources',
      'Knowledge',
      'Knowledge bases and sources',
      $html$<p>A <strong>knowledge base</strong> holds the documents, web pages, notes, images, audio and video Grey answers from. Each source is ingested in the background: read, split into chunks and embedded with the knowledge base's embedding model, which is fixed when you create it. An ingestion preset decides how sources are chunked and enriched.</p><p>Add sources by uploading files, importing from Geiger Assets and Notes, or adding web pages. Track them on <strong>Sources</strong> and <strong>Ingestion Jobs</strong>, and mark them verified to keep them fresh.</p><p>The <a href="/help/grey/knowledge-bases">Knowledge bases</a> and <a href="/help/grey/sources">Sources and ingestion</a> guides cover both.</p>$html$,
      '[]',
      '[]',
      50
    ),
    (
      'knowledge-graph',
      'Graph',
      'Knowledge graph',
      $html$<p>While it ingests your sources, Grey can pick out the people, organizations, products and other entities they mention, and how they relate. They form one knowledge graph per project, which you explore in <strong>Graph Explorer</strong>, edit and merge in <strong>Entities</strong>, and shape in <strong>Ontology</strong>. Pipelines can draw on it when a question is about how things connect.</p><p>The <a href="/help/grey/knowledge-graph">Knowledge graph</a> guide covers building and editing it.</p>$html$,
      '[]',
      '[]',
      60
    ),
    (
      'pipelines-and-playground',
      'Pipelines',
      'Pipelines and the Playground',
      $html$<p>A <strong>pipeline</strong> answers questions from your knowledge bases. It finds the passages that match a question, then has a chat model from your own provider write the answer, with citations. You choose its model, knowledge bases, retrieval settings and prompt, and publish numbered versions.</p><p>The <strong>Playground</strong> is where you try a pipeline: chat with it, see the passages behind each answer, and rate answers. It runs the pipeline's saved settings, so you can test changes before you publish them.</p><p>See <a href="/help/grey/pipelines">Pipelines and model providers</a> and <a href="/help/grey/playground">Playground</a>.</p>$html$,
      '[]',
      '[]',
      70
    ),
    (
      'serving-answers',
      'Delivery',
      'Serving answers outside Grey',
      $html$<p>A published pipeline can answer outside Grey in three ways: an OpenAI-compatible API you call with an <strong>API key</strong>, an <strong>MCP server</strong> for AI clients such as Claude Desktop and Cursor, and a chat <strong>widget</strong> you embed on your website. All three use the pipeline's latest published version.</p><p>The <a href="/help/grey/delivery">API keys, MCP servers and widgets</a> guide covers setting each one up.</p>$html$,
      '[]',
      '[]',
      80
    ),
    (
      'quality-and-usage',
      'Quality',
      'Quality, usage and costs',
      $html$<ul><li><strong>Evaluations</strong> score a pipeline against sets of test questions for faithfulness, relevance, precision and recall, and <strong>Feedback</strong> gathers the answers people rated or marked unanswered. See <a href="/help/grey/quality">Evaluations and feedback</a>.</li><li><strong>Usage & Costs</strong> shows what Grey recorded as cost by day and kind, with an optional monthly soft cap, and <strong>Request Logs</strong> traces every question asked. See <a href="/help/grey/usage">Usage and request logs</a>.</li><li><strong>Overview</strong> sums it all up: queries, spending, ingestion, top pipelines and what needs attention. See <a href="/help/grey/project-overview">Project overview</a>.</li></ul>$html$,
      '[]',
      '[]',
      90
    ),
    (
      'team-and-settings',
      'Settings',
      'Team, roles and settings',
      $html$<p>Each Grey project has its own roles: Owner, Admin, Manager, Member and Viewer, plus any you create. <strong>Settings → Team & Members</strong> manages who has which, and <strong>Roles & Permissions</strong> decides what each role can do. See <a href="/help/grey/team">Team and roles</a>.</p><p><strong>Settings → General</strong> holds the project's processing and transcription models and query logging, <strong>Navigation</strong> your own sidebar, and <strong>Data Export</strong> JSON downloads of the project's data. See <a href="/help/grey/settings">Project settings</a>.</p>$html$,
      '[]',
      '[]',
      100
    ),
    (
      'shortcuts',
      'Reference',
      'Keyboard shortcuts',
      $html$<ul><li><code>Ctrl K</code> or <code>Ctrl /</code> (<code>⌘ K</code> or <code>⌘ /</code> on Mac) opens <strong>Search Grey</strong>, to jump to any screen you can see</li><li>In Chat, <code>Enter</code> sends a message, <code>Shift Enter</code> starts a new line and <code>Esc</code> stops a reply</li><li>In fields that take a list, like aliases, chat models or allowed domains, <code>Enter</code> or <code>,</code> adds each item, and <code>Backspace</code> in the empty field removes the last one</li></ul>$html$,
      '[]',
      '[]',
      110
    )
) as v(anchor_id, eyebrow, title, content, cards, features, sort_order)
cross join (select id from public.docs_pages where slug = 'grey' and deleted_at is null) p;

-- @down
-- Restores the draft outline exactly as 20261024191700_help_grey_structure left it.
update public.docs_pages
set title = 'Geiger Grey',
    nav_label = 'Overview',
    description = 'Managed RAG and knowledge graphs.',
    status = 'draft',
    published_at = null
where slug = 'grey' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'grey' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>What Geiger Grey is for</li><li>Opening it from a project</li><li>Key concepts</li><li>Common workflows</li></ul>',
  10
from public.docs_pages p
where p.slug = 'grey' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
