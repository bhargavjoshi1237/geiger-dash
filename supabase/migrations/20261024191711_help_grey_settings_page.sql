-- Help grey settings page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the grey/settings draft outline
-- (20261024191700_help_grey_structure) with the full Project settings guide and publishes it.
-- General's Default ingestion preset and Retention period are left out: both save, but nothing reads them yet.
-- Written from a survey of C:\Pro\geiger-grey (components/internal/screens/settings/general.jsx,
-- navigation_settings.jsx, data_export.jsx, lib/supabase/project_settings.js, nav_prefs.js,
-- context/nav-visibility-context.js, lib/hooks/use-visible-nav.js, geiger-ui.config.js, lib/engine/transcribe.js,
-- lib/engine/usage.js, worker/ingest/image.mjs, worker/ingest/run.mjs, lib/engine/eval_runner.js,
-- geiger-rbac.config.js; @geiger/ui 258dd6a src/nav/nav-visibility-settings.jsx and src/nav/resolve.js).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Project settings',
    description = 'Set a Grey project''s processing and transcription models and query logging, choose which sections your sidebar shows, and export the project''s data.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'grey/settings' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'grey/settings' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.sort_order
from (
  values
    (
      'opening-settings',
      'Basics',
      'Opening project settings',
      $html$<p>Choose <strong>Settings</strong> in Grey's sidebar to open the project's settings: <strong>General</strong>, <strong>Team & Members</strong>, <strong>Roles & Permissions</strong>, <strong>Navigation</strong> and <strong>Data Export</strong>. Settings apply to the current project only.</p><p>The Settings section appears for Owners, Admins and Managers. Changing <strong>General</strong> needs the <strong>Manage workspace settings</strong> permission, which Owners and Admins have; everyone else sees it read-only. <strong>Team & Members</strong> and <strong>Roles & Permissions</strong> are covered in <a href="/help/grey/team">Team and roles</a>.</p>$html$,
      '[]',
      10
    ),
    (
      'processing-and-transcription-models',
      'General',
      'Processing and transcription models',
      $html$<p>The <strong>Models</strong> card in <strong>Settings → General</strong> picks the models Grey uses behind the scenes. They run on your own model provider connections.</p><ul><li><strong>Processing connection</strong> and <strong>Processing model</strong>: a chat model for knowledge graph extraction, contextual enrichment, image descriptions and judging evaluations. A small, fast model works well. It starts as <strong>None</strong>, and those features don't run until you set one. Image descriptions need a model that can see images.</li><li><strong>Transcription connection</strong> and <strong>Transcription model</strong>: what transcribes audio and video sources. <strong>Automatic</strong> uses your only transcription connection, so with two or more, pick one. Leave the model on the provider's default, or choose one.</li></ul><p>If you have no suitable connection yet, the card links to <strong>Model Providers</strong>; see <a href="/help/grey/pipelines#connecting-a-model-provider">Connecting a model provider</a>. Choose <strong>Save changes</strong> at the top to keep your choices.</p>$html$,
      '[]',
      20
    ),
    (
      'general-settings',
      'General',
      'Project details and query logging',
      $html$<p>The <strong>Project</strong> card in <strong>Settings → General</strong> shows the project's <strong>Name</strong> and <strong>Project ID</strong>. Both are read-only here; rename projects in Dash.</p><p><strong>Log queries</strong>, under <strong>Retention & logging</strong>, is on by default. Turned off, requests still appear in <strong>Usage → Request Logs</strong> with their channel, status, timing, tokens and cost, but without the question or the retrieved chunks. Choose <strong>Save changes</strong> at the top after changing it.</p>$html$,
      '[]',
      30
    ),
    (
      'hiding-sidebar-sections',
      'Navigation',
      'Hiding sidebar sections',
      $html$<p><strong>Settings → Navigation</strong> lets you hide the parts of Grey's sidebar you don't use. It changes only your own sidebar, in this project; teammates keep theirs. Hidden screens also drop out of the top bar's search.</p><p>Turn a section's switch off to hide it with everything under it, or open the section and hide single screens. Each change saves straight away. <strong>Overview</strong>, <strong>Knowledge Bases</strong>, <strong>All Knowledge Bases</strong>, <strong>Settings</strong> and <strong>Navigation</strong> are always on and have no switch.</p><p>The figures across the top count the <strong>Sections</strong> and <strong>Screens</strong> you're showing, how many are <strong>Hidden</strong> and how many are <strong>Always on</strong>. Filter the list by <strong>All</strong>, <strong>Shown</strong>, <strong>Hidden</strong> or <strong>Always on</strong>, or search it. <strong>Show all</strong> brings every section back. Sections your role can't see aren't listed.</p>$html$,
      '[]',
      40
    ),
    (
      'section-dependencies',
      'Navigation',
      'Sections that depend on others',
      $html$<p>Some screens need another one to be useful, so Grey won't let you hide what a visible screen depends on, or show a screen while what it needs is hidden. The switch is disabled and explains why, with a link to the screen in the way.</p><ul><li><strong>Playground</strong>, <strong>Evaluations</strong> and <strong>Request Logs</strong> need <strong>Pipelines</strong>.</li><li><strong>MCP Servers</strong> and <strong>Widgets</strong> need <strong>API Keys</strong>.</li><li><strong>Knowledge Graph</strong> needs <strong>Knowledge Bases</strong>.</li></ul><p>To hide Pipelines, for example, hide Playground, Evaluations and Request Logs first.</p>$html$,
      '[]',
      50
    ),
    (
      'exporting-data',
      'Data Export',
      'Exporting project data',
      $html$<p><strong>Settings → Data Export</strong> downloads the project's data as JSON files, built in your browser. Choose <strong>Export</strong> on a card for one part, or <strong>Full export</strong> at the top for everything in one file:</p><ul><li><strong>Knowledge bases & sources</strong>: every knowledge base and its sources' details, without the files themselves.</li><li><strong>Chunks</strong>: each chunk's text, order and position.</li><li><strong>Knowledge graph</strong>: entity and relation types, entities, relations and mentions.</li><li><strong>Conversations</strong>: Playground and widget conversations with their messages.</li><li><strong>Eval sets</strong>: evaluation sets and their cases.</li></ul><p>If part of an export comes back incomplete, Grey still downloads the file and says what's missing. Exporting needs the <strong>Run data exports</strong> permission, which Owners, Admins and Managers have.</p>$html$,
      '[]',
      60
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"Users","label":"Team & roles","href":"/help/grey/team"},{"icon":"Workflow","label":"Pipelines & model providers","href":"/help/grey/pipelines"},{"icon":"Gauge","label":"Usage & request logs","href":"/help/grey/usage"}]',
      70
    )
) as v(anchor_id, eyebrow, title, content, links, sort_order)
cross join (select id from public.docs_pages where slug = 'grey/settings' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Settings',
    nav_label = null,
    description = 'Project details, your sidebar and data exports.',
    status = 'draft',
    published_at = null
where slug = 'grey/settings' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'grey/settings' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>General</li><li>Navigation</li><li>Data export</li></ul>',
  10
from public.docs_pages p
where p.slug = 'grey/settings' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
