-- Help grey knowledge bases page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the grey/knowledge-bases draft outline
-- (20261024191700_help_grey_structure) with the full Knowledge bases guide and publishes it.
-- Written from a survey of C:\Pro\geiger-grey (components/internal/screens/knowledge/*, lib/supabase/knowledge_bases.js,
-- chunks.js, ingestion_presets.js, repository.js, lib/grey/embedding_models.js, chunker.js, cost.js, billing.js,
-- ocr_routing.js, lib/engine/retrieval.js, worker/ingest/run.mjs, supabase/migrations/20261010120400_ingestion.sql,
-- geiger-rbac.config.js).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Knowledge bases',
    description = 'Create knowledge bases, pick an embedding model and ingestion preset, tune how sources are chunked, and browse the chunks they hold.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'grey/knowledge-bases' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'grey/knowledge-bases' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.sort_order
from (
  values
    (
      'creating-a-knowledge-base',
      'Basics',
      'Creating a knowledge base',
      $html$<p>To create a knowledge base, go to <strong>Knowledge Bases → All Knowledge Bases</strong> and choose <strong>Create knowledge base</strong>. The button appears only if you have the <strong>Manage knowledge bases</strong> permission, which Owners, Admins and Managers have.</p><ul><li><strong>Icon</strong> and <strong>Name</strong>: how the knowledge base appears in lists. The name is required.</li><li><strong>Description</strong>: optional, what goes in it.</li><li><strong>Ingestion preset</strong>: required. It sets how sources are read, chunked and enriched.</li><li><strong>Embedding connection</strong>: required. A model provider connection that can create embeddings. Grey selects the first one, with its first suggested model.</li><li><strong>Embedding model</strong>: the model that turns chunks and questions into vectors. When the model can embed images too, the field says image sources get visual search.</li><li><strong>Dimensions</strong>: the size of the model's vectors. Choose <strong>Detect</strong> to read it from the model, or let Grey detect it when you create the knowledge base. Models that support a choice are asked for 1024.</li></ul><p>The embedding model and its dimensions are locked once the knowledge base exists. To use a different model, create a new knowledge base and add its sources again.</p><p>If no connection can create embeddings yet, the dialog links to <strong>Model Providers</strong> instead. The <a href="/help/grey/pipelines">Pipelines and model providers</a> guide covers adding one.</p>$html$,
      '[]',
      10
    ),
    (
      'knowledge-bases-sources-and-chunks',
      'Concepts',
      'Knowledge bases, sources and chunks',
      $html$<p>A <strong>knowledge base</strong> is a collection of <strong>sources</strong>: documents, web pages, notes, images, audio and video. When you add a source, Grey runs an <strong>ingestion job</strong> that reads it, splits it into <strong>chunks</strong> and embeds each chunk with the knowledge base's embedding model. Pipelines search those chunks to answer questions.</p><p>How a source is read and split comes from the knowledge base's ingestion settings: its preset, plus any changes you saved on top of it. Each job keeps a copy of the settings it ran with, so changing them later doesn't touch sources that are already ingested until you re-ingest them.</p><p>A knowledge base is either <strong>Active</strong> or <strong>Archived</strong>. Pipelines search only active knowledge bases, so archiving one takes it out of every answer without deleting anything.</p>$html$,
      '[]',
      20
    ),
    (
      'knowledge-base-list',
      'Knowledge Bases',
      'The knowledge base list',
      $html$<p><strong>All Knowledge Bases</strong> lists every knowledge base in the project. The figures across the top count the <strong>Knowledge bases</strong> (and how many are active), the <strong>Sources</strong> and <strong>Chunks</strong> across all of them, and the <strong>Presets</strong> you can choose from, system and custom.</p><p>Each row shows the knowledge base's source and chunk counts, preset, embedding model, status and when it was last updated. Filter by status (<strong>All statuses</strong>, <strong>Active</strong> or <strong>Archived</strong>), or search by name and description.</p><p>Click a row to open the knowledge base. Each row's <strong>⋯</strong> menu has <strong>Open</strong>, plus <strong>Archive</strong> or <strong>Restore</strong> if you can manage knowledge bases. The list shows 25 knowledge bases a page; switch to 10, 50 or 100 at the bottom.</p>$html$,
      '[]',
      30
    ),
    (
      'knowledge-base-details',
      'Knowledge Bases',
      'Knowledge base details',
      $html$<p>Opening a knowledge base shows its name, status and description, with its sections listed beside it:</p><ul><li><strong>Sources</strong>: the knowledge base's sources, with the same filters, actions and <strong>Upload</strong> button as the Sources screen, limited to this knowledge base. See <a href="/help/grey/sources">Sources and ingestion</a>.</li><li><strong>Chunks</strong>: the chunks its sources were split into.</li><li><strong>Ingestion settings</strong>: its embedding connection, preset and settings.</li><li><strong>Activity</strong>: its ingestion jobs, newest first, with each job's source, stage, progress, status, estimated and actual cost, and when it was created.</li><li><strong>Danger zone</strong>: archive or delete it.</li></ul><p>The open knowledge base and section are part of the page address, so refreshing or sharing the link opens the same place. Choose <strong>All Knowledge Bases</strong> at the top to go back to the list.</p>$html$,
      '[]',
      40
    ),
    (
      'browsing-chunks',
      'Knowledge Bases',
      'Browsing chunks',
      $html$<p>The <strong>Chunks</strong> section of a knowledge base lists the chunks its sources were split into. Each one shows where it came from (a page number, or a time range for audio and video), its size in tokens, the trail of headings above it and the first lines of its text.</p><p>Only chunks from finished ingestion jobs appear. While a source is re-ingested, its previous chunks stay in place until the new ones are ready. The list shows 25 chunks a page; switch to 10, 50 or 100 at the bottom.</p>$html$,
      '[]',
      50
    ),
    (
      'embedding-connection',
      'Knowledge Bases',
      'Embedding model and connection',
      $html$<p>The <strong>Embeddings</strong> card at the top of a knowledge base's <strong>Ingestion settings</strong> shows what embeds its chunks and the questions asked of it.</p><ul><li><strong>Connection</strong>: you can move the knowledge base to another connection that uses the same embedding format, for example after replacing an API key. Grey won't save a connection with a different format.</li><li><strong>Model</strong>: locked when the knowledge base was created.</li><li><strong>Dimensions</strong>: locked once detected. If a knowledge base has none yet, choose <strong>Detect</strong>; they lock when you save.</li></ul><p>After you change the connection, choose <strong>Save</strong> on the card. Changing it needs the <strong>Manage knowledge bases</strong> permission.</p><p>Vector search uses an index for 256, 384, 512, 768, 1024, 1536, 2048 and 3072 dimensions. Other sizes are searched without one, which is fine for small and medium knowledge bases but slower on very large ones.</p>$html$,
      '[]',
      60
    ),
    (
      'ingestion-settings',
      'Knowledge Bases',
      'Changing ingestion settings',
      $html$<p>A knowledge base's <strong>Ingestion settings</strong> section decides how its sources are processed. Pick a preset from the cards, each showing its price per page, then adjust the settings below them. Picking a preset replaces the settings with that preset's own.</p><p>Choose <strong>Save</strong> to keep your changes. Saved settings apply to sources ingested from then on, and sources already in the knowledge base keep the settings they were ingested with. To apply the settings to everything, choose <strong>Re-ingest all</strong>, which queues a new ingestion job for every source in the knowledge base.</p><p><strong>Save</strong> needs the <strong>Manage knowledge bases</strong> permission and <strong>Re-ingest all</strong> needs <strong>Run ingestion jobs</strong>. Without them the buttons are disabled, and hovering over one says why. The <a href="#settings-reference">ingestion settings reference</a> describes each setting.</p>$html$,
      '[]',
      70
    ),
    (
      'settings-reference',
      'Reference',
      'Ingestion settings reference',
      $html$<p>Knowledge bases and presets share these settings. Everything except <strong>Parser</strong> and <strong>OCR</strong> sits under <strong>Advanced</strong>. Defaults in parentheses are the Balanced preset's, which a new custom preset also starts from.</p><ul><li><strong>Parser</strong> and <strong>OCR</strong>: Grey currently reads every document's text, whatever these are set to. Pages with no text layer, such as scanned pages, are skipped.</li><li><strong>Strategy</strong> (Recursive): <strong>Recursive</strong> splits at headings, then fills each chunk up to the chunk size. <strong>Fixed size</strong> cuts the whole document into equal windows. <strong>Page</strong> makes one chunk per page. <strong>Semantic</strong> runs as Recursive.</li><li><strong>Chunk size (tokens)</strong> (512): from 64 to 4,096, in steps of 32.</li><li><strong>Overlap (tokens)</strong> (64): from 0 to 1,024, in steps of 16, and never more than half the chunk size.</li><li><strong>Atomic tables</strong> (on): keeps each table in one chunk unless it's more than twice the chunk size.</li><li><strong>Heading breadcrumbs</strong> (on): starts each chunk with its trail of section headings.</li><li><strong>Contextual enrichment</strong> (off): adds a model-written summary of the surrounding text to each chunk, using the processing model in <strong>Settings → General</strong>.</li><li><strong>Transcribe</strong> (on): transcribes audio and video. With it off, audio and video sources can't be ingested. <strong>Diarize</strong> (on) splits the transcript by speaker.</li><li><strong>Extract entities and relations</strong> (on): adds the knowledge base to the project's knowledge graph, using the processing model.</li></ul><p><strong>Parent-child chunking</strong> and <strong>Keyframes</strong> can't be turned on.</p>$html$,
      '[]',
      80
    ),
    (
      'ingestion-presets',
      'Ingestion Presets',
      'Ingestion presets',
      $html$<p>An ingestion preset is a saved set of ingestion settings with its prices. <strong>Knowledge Bases → Ingestion Presets</strong> lists two kinds:</p><ul><li><strong>System presets</strong> are built in and read-only: <strong>Fast</strong> ($0.002 a page, without graph extraction or speaker splitting), <strong>Balanced</strong> ($0.006 a page, with both), <strong>High accuracy</strong> ($0.02 a page, adds contextual enrichment) and <strong>Auto</strong> (shown as $0.002 to $0.02 a page).</li><li><strong>Custom presets</strong> are your project's own. Choose <strong>New preset</strong>, or <strong>Duplicate</strong> on a system preset to start from a copy of it.</li></ul><p>The preset editor has a <strong>Name</strong> (required), a <strong>Description</strong>, the ingestion settings and, under <strong>Advanced → Pricing</strong>, prices per page, per media minute, per keyframe minute and per million graph or contextual tokens. Its <strong>Cost preview</strong> estimates 100 pages and an hour of media at those prices. The prices feed the cost estimate shown when you add sources. While Grey reads documents as text, it records each page at no more than the Fast price.</p><p>Each custom preset's <strong>⋯</strong> menu has <strong>Edit</strong>, <strong>Duplicate</strong> and <strong>Delete</strong>. Grey asks you to confirm a delete, which can't be undone, and knowledge bases using the preset keep their current settings. Managing presets needs the <strong>Manage ingestion presets</strong> permission.</p>$html$,
      '[]',
      90
    ),
    (
      'archiving-and-deleting',
      'Knowledge Bases',
      'Archiving and deleting',
      $html$<p>The <strong>Danger zone</strong> section of a knowledge base has <strong>Archive</strong> (or <strong>Restore</strong>) and <strong>Delete</strong>. Both need the <strong>Manage knowledge bases</strong> permission.</p><ul><li><strong>Archive</strong> takes the knowledge base out of every pipeline's searches without deleting its sources or chunks. It happens straight away, and <strong>Restore</strong> makes it active again. The list's <strong>⋯</strong> menu has the same two actions.</li><li><strong>Delete</strong> asks you to confirm first. Its sources and chunks can no longer be retrieved, and a deleted knowledge base can't be restored from Grey.</li></ul>$html$,
      '[]',
      100
    ),
    (
      'detect-fails',
      'Troubleshooting',
      'Detect can''t read the model''s dimensions',
      $html$<p>When Grey can't detect an embedding model's dimensions, the knowledge base isn't created and a message says why. The usual causes and fixes:</p><ul><li>The provider rejected the API key: update the connection's key in <strong>Pipelines → Model Providers</strong>.</li><li>The provider doesn't serve that model: check the name in <strong>Embedding model</strong>.</li><li>The connection can't create embeddings for that model: choose another connection or model.</li><li>The model's vectors are outside the supported range of 64 to 4,000 dimensions: choose another model.</li><li>The provider is rate limiting requests, timed out or is unavailable: wait a moment, then choose <strong>Detect</strong> again.</li></ul>$html$,
      '[]',
      110
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"FileStack","label":"Sources & ingestion","href":"/help/grey/sources"},{"icon":"Network","label":"Knowledge graph","href":"/help/grey/knowledge-graph"},{"icon":"Workflow","label":"Pipelines & model providers","href":"/help/grey/pipelines"},{"icon":"MessagesSquare","label":"Playground","href":"/help/grey/playground"},{"icon":"Gauge","label":"Usage & request logs","href":"/help/grey/usage"},{"icon":"Settings","label":"Project settings","href":"/help/grey/settings"}]',
      120
    )
) as v(anchor_id, eyebrow, title, content, links, sort_order)
cross join (select id from public.docs_pages where slug = 'grey/knowledge-bases' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Knowledge bases',
    nav_label = null,
    description = 'Create knowledge bases, choose how their sources are chunked and embedded, and browse the chunks they hold.',
    status = 'draft',
    published_at = null
where slug = 'grey/knowledge-bases' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'grey/knowledge-bases' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Creating a knowledge base</li><li>Ingestion settings</li><li>Knowledge base details</li><li>Browsing chunks</li><li>Ingestion presets</li></ul>',
  10
from public.docs_pages p
where p.slug = 'grey/knowledge-bases' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
