-- Help grey sources page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the grey/sources draft outline
-- (20261024191700_help_grey_structure) with the full Sources & ingestion guide and publishes it.
-- Written from a survey of C:\Pro\geiger-grey (components/internal/screens/sources/*, components/internal/shared/dropzone.jsx,
-- lib/supabase/sources.js, ingestion_jobs.js, suite_imports.js, lib/grey/url_guard.js, ingest_errors.js, file_analysis.js,
-- lib/engine/transcribe.js, worker/ingest/run.mjs, fetch.mjs, image.mjs, parse/index.mjs, worker/env.mjs,
-- supabase/migrations/20261018120100_worker_queue.sql, geiger-rbac.config.js).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Sources & ingestion',
    description = 'Upload files, import from Assets and Notes, or add web pages to a knowledge base, then track ingestion, keep sources fresh and fix failures.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'grey/sources' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'grey/sources' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.sort_order
from (
  values
    (
      'adding-sources',
      'Basics',
      'Adding sources',
      $html$<p>To add sources to a knowledge base, go to <strong>Knowledge Bases → Sources</strong> and choose <strong>Upload</strong>, or choose <strong>Upload</strong> in a knowledge base's <strong>Sources</strong> section. The <strong>Add sources</strong> dialog has three tabs: <strong>Upload</strong>, <strong>Import</strong> and <strong>Add URL</strong>.</p><ol><li>Choose the <strong>Knowledge base</strong>. When you start from a knowledge base, it's already set.</li><li>Check the <strong>Ingestion preset</strong>. It starts as the knowledge base's own preset, including the settings saved on the knowledge base. Another preset applies its own settings as they are, to these sources only.</li><li>Add files, select items to import, or type a URL.</li><li>Choose <strong>Start ingestion</strong>, <strong>Import selected</strong> or <strong>Add URL</strong>.</li></ol><p>Each source gets its own ingestion job and joins the list as Queued. Adding sources needs the <strong>Upload sources</strong> permission, which every built-in role except Viewer has. Without it, <strong>Upload</strong> is disabled.</p>$html$,
      '[]',
      10
    ),
    (
      'statuses-and-ingestion',
      'Concepts',
      'Source statuses and ingestion',
      $html$<p>Grey ingests each source in the background, in four stages: <strong>Parse</strong> reads it, <strong>Chunk</strong> splits it, <strong>Embed</strong> turns the chunks into vectors and <strong>Graph</strong> extracts entities for the knowledge graph when the settings ask for it. A source's status shows where it is:</p><ul><li><strong>Queued</strong>: waiting for its ingestion job to start.</li><li><strong>Processing</strong>: being ingested.</li><li><strong>Ready</strong>: its chunks can be searched.</li><li><strong>Failed</strong>: its last job didn't finish. See <a href="#source-failed">A source shows Failed</a>.</li><li><strong>Pending</strong>: its job was canceled before it started, and it has no chunks yet.</li></ul><p>When a failure is temporary, such as a provider timeout, Grey tries the job again on its own, up to three attempts in all. The source list and Ingestion Jobs don't update on their own: open the screen again to see the latest status.</p>$html$,
      '[]',
      20
    ),
    (
      'uploading-files',
      'Sources',
      'Uploading files',
      $html$<p>On the <strong>Upload</strong> tab of <strong>Add sources</strong>, drop files on the box or click it to choose them. You can add several files at once.</p><p>Grey looks at each file as you add it, then shows its size, kind, page count or length, and an estimated ingestion cost from the preset's prices. The total appears under the list. Remove a file with the × beside it. <strong>Start ingestion</strong> uploads the files one at a time and queues each one; a file that fails to upload is reported and skipped.</p><p>Grey reads PDF, Word (.docx), Excel (.xlsx), PowerPoint (.pptx), OpenDocument (.odt, .ods and .odp), RTF, EPUB, HTML, Markdown, CSV, TSV, JSON and plain text files, as well as images, audio and video. Older Office files (.doc, .xls and .ppt) can't be read: save them as .docx, .xlsx or .pptx and upload them again.</p>$html$,
      '[]',
      30
    ),
    (
      'importing-from-assets-and-notes',
      'Sources',
      'Importing from Assets and Notes',
      $html$<p>The <strong>Import</strong> tab of <strong>Add sources</strong> lists what the same project holds in other Geiger apps, so you can ingest it without downloading and uploading it again:</p><ul><li><strong>Assets</strong>: the project's stored documents, PDFs, images, audio and video in Geiger Assets. Other asset types aren't offered.</li><li><strong>Notes</strong>: the project's boards in Geiger Notes.</li></ul><p>Select the items you want, then choose <strong>Import selected</strong>. Each one becomes a source whose origin is Assets or Notes, and Grey reads it from that app when the job runs. If you delete the board in Notes, re-ingesting its source fails.</p>$html$,
      '[]',
      40
    ),
    (
      'adding-a-web-page',
      'Sources',
      'Adding a web page',
      $html$<p>On the <strong>Add URL</strong> tab of <strong>Add sources</strong>, type the page's address, like <code>https://example.com/article</code>, and choose <strong>Add URL</strong>. Grey fetches the page when the job runs and indexes its main content. The source is named after the address.</p><ul><li>Only <code>http</code> and <code>https</code> addresses work, and they can't include a username or password.</li><li>Addresses on a private network are refused.</li><li>A page can be up to 20 MB.</li><li>Links to audio or video files don't work: upload the file, or import it from Assets.</li></ul><p>Grey keeps what it fetched. To pick up changes to the page, re-ingest the source.</p>$html$,
      '[]',
      50
    ),
    (
      'source-list',
      'Sources',
      'The source list',
      $html$<p><strong>Knowledge Bases → Sources</strong> lists the sources in every knowledge base in the project. The figures across the top count all <strong>Sources</strong>, then those that are <strong>Ready</strong>, <strong>In progress</strong> (queued or processing) and in <strong>Needs review</strong>, whose review date is near or past.</p><p>Each row shows the source's name and origin (Upload, Assets, Notes or URL), its knowledge base, its size (pages, length or file size), status, freshness and when it was added. Filter by status, kind (Document, Audio, Video, Image, Web page or Note), origin and knowledge base, or search by source or knowledge base name.</p><p>Click a row to open the source's details. Each row's <strong>⋯</strong> menu has <strong>Open</strong>, <strong>Re-ingest</strong>, <strong>Mark verified</strong>, <strong>Owner & review date</strong>, <strong>Download</strong> and <strong>Delete</strong>; actions you don't have permission for don't appear. The list shows 25 sources a page; switch to 10, 50 or 100 at the bottom.</p>$html$,
      '[]',
      60
    ),
    (
      'source-details',
      'Sources',
      'Source details',
      $html$<p>Click a source to open its details beside the list. The top shows its kind, origin, status and freshness.</p><ul><li>Audio and video from uploads or Assets play right there.</li><li><strong>Metadata</strong>: size, file size, tokens, chunks, file type, when it was uploaded and verified, its review date and owner.</li><li><strong>Ingestion jobs</strong>: every job run for the source, with its stage and status.</li><li><strong>Mentioned entities</strong>: the knowledge graph entities found in it.</li></ul><p>The buttons at the bottom are <strong>Download</strong> (uploaded files only), <strong>Re-ingest</strong>, <strong>Mark verified</strong>, <strong>Owner & review date</strong> and <strong>Delete</strong>. Buttons you don't have permission for are disabled.</p>$html$,
      '[]',
      70
    ),
    (
      'freshness',
      'Sources',
      'Freshness and review dates',
      $html$<p>Freshness tracks whether someone has checked that a source is still current. Each source shows one of four badges:</p><ul><li><strong>Verified</strong>: it was marked verified, and no review is due in the next 7 days.</li><li><strong>Review due</strong>: its review date is within the next 7 days.</li><li><strong>Stale</strong>: its review date has passed.</li><li><strong>Not verified</strong>: nobody has verified it, and no review is due in the next 7 days.</li></ul><p>Marking a source verified on or after its review date clears <strong>Stale</strong> and <strong>Review due</strong>.</p><p>To record a check, choose <strong>Mark verified</strong> in the source's <strong>⋯</strong> menu or details. To set when it's next due, choose <strong>Owner & review date</strong>, pick a <strong>Review due</strong> date and choose <strong>Save</strong>; clear the date to remove it. <strong>Owner (user ID)</strong> is optional. Both actions need the <strong>Upload sources</strong> permission.</p><p>Freshness is for your team's own tracking: it doesn't change what pipelines search.</p>$html$,
      '[]',
      80
    ),
    (
      're-ingesting-and-deleting',
      'Sources',
      'Re-ingesting and deleting a source',
      $html$<p><strong>Re-ingest</strong>, in a source's <strong>⋯</strong> menu or details, queues a new ingestion job with the knowledge base's current preset and settings. The source keeps its existing chunks until the new ones are ready. Re-ingesting needs the <strong>Run ingestion jobs</strong> permission. To re-ingest every source in a knowledge base at once, use <strong>Re-ingest all</strong> in its <a href="/help/grey/knowledge-bases#ingestion-settings">ingestion settings</a>.</p><p><strong>Delete</strong> asks you to confirm first. The source's chunks and ingestion history are removed from retrieval, and a deleted source can't be restored from Grey. Deleting needs the <strong>Delete sources</strong> permission, which Owners, Admins and Managers have.</p>$html$,
      '[]',
      90
    ),
    (
      'ingestion-jobs',
      'Ingestion Jobs',
      'Ingestion jobs',
      $html$<p><strong>Knowledge Bases → Ingestion Jobs</strong> lists every ingestion job in the project, newest first. The figures across the top count jobs <strong>Queued</strong> and <strong>Running</strong>, jobs that failed in the last 7 days, and the estimated spend on jobs from the last 30 days.</p><p>Each row shows the job's source, knowledge base, preset tier, current stage, progress, status and cost: the actual cost once it's known, or the estimate marked with ~ until then. Filter by status (Queued, Running, Succeeded, Failed or Cancelled) and by knowledge base.</p><p>Each row's <strong>⋯</strong> menu has <strong>Retry (new job)</strong>, which queues a fresh job with the same settings, and <strong>Cancel</strong> for a job that's queued or running. A running job stops at its next checkpoint. Both need the <strong>Run ingestion jobs</strong> permission. The list shows 25 jobs a page; switch to 10, 50 or 100 at the bottom.</p>$html$,
      '[]',
      100
    ),
    (
      'source-failed',
      'Troubleshooting',
      'A source shows Failed',
      $html$<p>A source fails when its ingestion job can't finish after its attempts. These are the usual causes, by kind:</p><ul><li><strong>Images</strong>: Grey needs a vision-capable processing model in <strong>Settings → General</strong>, or a knowledge base whose embedding model can embed images.</li><li><strong>Audio and video</strong>: Grey needs a transcription connection (set in <strong>Settings → General</strong>, or your only one), and <strong>Transcribe</strong> turned on in the knowledge base's settings. Speech-free files fail too.</li><li><strong>PDFs</strong>: a scanned PDF with no text layer can't be read.</li><li><strong>Other files</strong>: older Office formats, and damaged or password-protected files, can't be read.</li><li><strong>Web pages</strong>: the page couldn't be reached, timed out, returned an error, or is over 20 MB.</li><li><strong>Any source</strong>: the knowledge base has no embedding connection, or the connection's API key stopped working.</li></ul><p>Fix the cause, then choose <strong>Re-ingest</strong> on the source. The <a href="/help/grey/settings">Project settings</a> guide covers the processing and transcription models.</p>$html$,
      '[]',
      110
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"Library","label":"Knowledge bases","href":"/help/grey/knowledge-bases"},{"icon":"Network","label":"Knowledge graph","href":"/help/grey/knowledge-graph"},{"icon":"Settings","label":"Project settings","href":"/help/grey/settings"},{"icon":"Workflow","label":"Pipelines & model providers","href":"/help/grey/pipelines"},{"icon":"Gauge","label":"Usage & request logs","href":"/help/grey/usage"},{"icon":"LayoutDashboard","label":"Project overview","href":"/help/grey/project-overview"}]',
      120
    )
) as v(anchor_id, eyebrow, title, content, links, sort_order)
cross join (select id from public.docs_pages where slug = 'grey/sources' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Sources & ingestion',
    nav_label = null,
    description = 'Add files and links to a knowledge base, keep them fresh, and follow ingestion jobs.',
    status = 'draft',
    published_at = null
where slug = 'grey/sources' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'grey/sources' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Adding sources</li><li>The source list</li><li>Source details</li><li>Freshness</li><li>Ingestion jobs</li></ul>',
  10
from public.docs_pages p
where p.slug = 'grey/sources' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
