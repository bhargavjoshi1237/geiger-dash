-- Help grey usage page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the grey/usage draft outline
-- (20261024191700_help_grey_structure) with the full Usage & request logs guide and publishes it.
-- Alert emails and the ingestion half of "Pause ingestion, keep retrieval" are left out: nothing sends the emails,
-- and that option stops answer generation rather than ingestion (lib/engine/turn.js, grey.ingestion_paused).
-- Written from a survey of C:\Pro\geiger-grey (components/internal/screens/usage/*, lib/supabase/usage.js,
-- project_settings.js, lib/engine/usage.js, turn.js, lib/grey/cost.js, billing.js, lib/server/delivery_log.js,
-- app/api/chat/route.js, supabase/migrations/20261018120100_worker_queue.sql, geiger-rbac.config.js).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Usage & request logs',
    description = 'See what a Grey project costs by day and by kind of work, set a monthly soft cap, and trace each request through the request logs.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'grey/usage' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'grey/usage' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.sort_order
from (
  values
    (
      'what-grey-charges',
      'Concepts',
      'What Grey records as cost',
      $html$<p>Grey records the work done in a project as usage, and puts a cost only on the work it does itself:</p><ul><li><strong>Pages ingested</strong>: each page Grey parses, at the ingestion preset's price per page. While Grey reads documents as text, a page costs no more than the Fast preset's $0.002.</li><li><strong>Retrievals</strong>: $0.001 for each answered question that retrieved passages, from the Playground, the API, MCP servers or widgets.</li></ul><p>Work that runs on your own model provider accounts is counted but recorded at no cost, because your provider bills you for it directly: <strong>LLM tokens</strong> for answers, <strong>Media minutes</strong> of transcription, <strong>Graph extraction</strong> and <strong>Contextual enrichment</strong>.</p>$html$,
      '[]',
      10
    ),
    (
      'usage-and-costs',
      'Usage & Costs',
      'Usage and costs',
      $html$<p><strong>Usage → Usage & Costs</strong> shows the project's spending. The figures across the top are <strong>Spend MTD</strong> (this calendar month so far), the <strong>Soft cap</strong>, and the <strong>Pages ingested</strong>, <strong>Media minutes</strong> and <strong>Retrievals</strong> of the last 30 days.</p><ul><li><strong>Daily cost</strong>: a chart of the last 30 days, stacked by kind of usage. Hover over a day for its breakdown.</li><li><strong>Breakdown by kind</strong>: each kind's quantity and cost over the last 30 days.</li></ul><p>Days follow your own time zone. Everyone who can see Usage can read this screen; the built-in Viewer role can't.</p>$html$,
      '[]',
      20
    ),
    (
      'soft-cap',
      'Usage & Costs',
      'Monthly soft cap',
      $html$<p>A monthly soft cap warns you, or limits Grey, once the project's spending for the month reaches an amount. Set it under <strong>Monthly soft cap</strong> on <strong>Usage & Costs</strong>:</p><ol><li>In <strong>Monthly soft cap (USD)</strong>, enter the amount. Leave it empty for no cap.</li><li>In <strong>When the cap is reached</strong>, choose what happens.</li><li>Choose <strong>Save changes</strong>.</li></ol><ul><li><strong>Alert only</strong> (the default): everything keeps running.</li><li><strong>Pause ingestion</strong>: new ingestion jobs wait until the next month or a higher cap. Questions keep being answered.</li><li><strong>Pause ingestion, keep retrieval</strong>: questions get the most relevant passages instead of a written answer.</li></ul><p>A bar shows this month's spending against the cap. Once it passes 80%, <strong>Usage & Costs</strong> shows a warning banner; close it and it stays hidden in your browser for the rest of the month. Changing the cap needs the <strong>Manage usage & costs</strong> permission, which Owners and Admins have.</p>$html$,
      '[]',
      30
    ),
    (
      'request-logs',
      'Request Logs',
      'Request logs',
      $html$<p><strong>Usage → Request Logs</strong> lists every question a pipeline was asked, newest first: from the Playground, widgets, the API and MCP servers. Each row shows the time, channel, pipeline, question, status (OK or Error), latency, tokens and cost. Filter by channel, status and pipeline. When nothing matches, <strong>Clear filters</strong> resets them.</p><p>Click a request to open its trace: the question, each retrieved chunk with its source, rank, retrieval score and how it was found (Vector, Text, Hybrid or Graph), plus latency, tokens and cost. <strong>Open conversation</strong> opens the Playground or widget conversation it came from.</p><p>To keep questions out of the logs, turn off <strong>Log queries</strong> in <a href="/help/grey/settings">Project settings</a>. Requests are still logged with their figures, but without the question or the retrieved chunks. The list shows 25 requests a page; switch to 10, 50 or 100 at the bottom.</p>$html$,
      '[]',
      40
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"LayoutDashboard","label":"Project overview","href":"/help/grey/project-overview"},{"icon":"Send","label":"API keys, MCP servers & widgets","href":"/help/grey/delivery"},{"icon":"Library","label":"Knowledge bases","href":"/help/grey/knowledge-bases"}]',
      50
    )
) as v(anchor_id, eyebrow, title, content, links, sort_order)
cross join (select id from public.docs_pages where slug = 'grey/usage' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Usage & request logs',
    nav_label = null,
    description = 'Track usage and costs across the project, and inspect each request in the logs.',
    status = 'draft',
    published_at = null
where slug = 'grey/usage' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'grey/usage' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Usage and costs</li><li>Request logs</li></ul>',
  10
from public.docs_pages p
where p.slug = 'grey/usage' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
