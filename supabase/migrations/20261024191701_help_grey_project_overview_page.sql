-- Help grey project overview page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the grey/project-overview draft outline
-- (20261024191700_help_grey_structure) with the full Project overview guide and publishes it.
-- Written from a survey of C:\Pro\geiger-grey (components/internal/screens/overview/*, lib/grey/overview_metrics.js,
-- lib/supabase/usage.js, components/internal/screens/sources/constants.js, lib/workspace/nav_tree.js,
-- geiger-rbac.config.js).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Project overview',
    description = 'Read a Grey project at a glance: queries, spending and ingestion over time, how each pipeline is doing, and what needs your attention.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'grey/project-overview' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'grey/project-overview' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.sort_order
from (
  values
    (
      'opening-the-overview',
      'Basics',
      'Opening the overview',
      $html$<p><strong>Overview</strong> is the first entry in Grey's sidebar and the screen a project opens on. Its heading, <strong>Knowledge Overview</strong>, sits beside the project's totals: <strong>Knowledge Bases</strong>, <strong>Sources</strong> and <strong>Chunks</strong>.</p><p>Every figure covers the whole project and is read when you open the screen. To see newer activity, open the screen again. Every built-in role can see the overview.</p>$html$,
      '[]',
      10
    ),
    (
      'summary-figures',
      'Overview',
      'Summary figures',
      $html$<p>The row of figures under the heading covers the last 30 days:</p><ul><li><strong>Queries</strong>: questions asked of any pipeline, through any channel.</li><li><strong>Spend</strong>: the cost Grey recorded. See <a href="/help/grey/usage#what-grey-charges">What Grey records as cost</a>.</li><li><strong>Sources Added</strong>: sources added to any knowledge base.</li><li><strong>Conversations</strong>: Playground and widget conversations started.</li></ul><p>Each figure compares itself with the 30 days before, as a percentage up or down. There's no comparison when the earlier period had none.</p>$html$,
      '[]',
      20
    ),
    (
      'activity-and-channels',
      'Overview',
      'Activity and query channels',
      $html$<p><strong>Activity Over Time</strong> charts the last 12 weeks, one point a week. Switch the menu between <strong>Queries</strong>, <strong>Tokens</strong> and <strong>Avg latency</strong>, and narrow it to some pipelines with the pipeline picker; with none selected it covers all of them.</p><p><strong>Query Channels</strong> shows where the last 12 weeks of questions came from: the Playground, widgets, the API or MCP servers. Pick a channel from its menu to see its count and its share of all queries.</p>$html$,
      '[]',
      30
    ),
    (
      'ingestion-and-answers',
      'Overview',
      'Ingestion and answer rates',
      $html$<p>Three panels show how well sources and questions are handled:</p><ul><li><strong>Ingestion Funnel</strong>: of all sources added, how many were processed, how many were indexed into chunks, and how many are verified fresh. The headline is the share that made it from added to indexed.</li><li><strong>Ingestion Success</strong>: the share of finished ingestion jobs that succeeded, rather than failed. Narrow it to some knowledge bases with its picker.</li><li><strong>Answer Rate</strong>: the share of questions from the last 12 weeks that were answered without an error. Narrow it to some pipelines with its picker.</li></ul><p>The <a href="/help/grey/sources">Sources and ingestion</a> guide explains statuses, jobs and freshness.</p>$html$,
      '[]',
      40
    ),
    (
      'top-pipelines',
      'Overview',
      'Top pipelines',
      $html$<p><strong>Top Pipelines</strong> ranks up to five pipelines over the last 30 days, by <strong>Queries</strong> or by <strong>Answer rate</strong>; choose which from its menu. The knowledge base picker narrows it to pipelines that search the knowledge bases you select.</p><p>Each row shows the pipeline's model and average latency, its status (Draft or Live), its answer rate, its number of queries and its trend against the 30 days before:</p><ul><li><strong>Growing</strong>: at least 10% more queries, or its first queries.</li><li><strong>Steady</strong>: within 10% either way.</li><li><strong>Declining</strong>: at least 10% fewer.</li><li><strong>No traffic</strong>: no queries in either period.</li></ul><p>The arrow at the end of a row opens the pipeline.</p>$html$,
      '[]',
      50
    ),
    (
      'needs-attention',
      'Overview',
      'What needs attention',
      $html$<p><strong>Overall Stats</strong>, at the bottom of the overview, counts what needs attention, most urgent first. Click a row to open the screen where you deal with it.</p><ul><li><strong>Failed sources</strong> (Urgent): sources whose ingestion failed, and across how many knowledge bases. Opens Ingestion Jobs.</li><li><strong>Provider connection errors</strong> (Urgent): model provider connections whose last test failed. Opens Model Providers.</li><li><strong>Unanswered questions</strong> and <strong>Unhelpful answers</strong> (Soon): unresolved questions marked unanswered and answers rated not helpful. Open Feedback.</li><li><strong>Sources due for review</strong> (Soon): sources whose review date is past or within 7 days. Opens Sources.</li><li><strong>Unpublished pipelines</strong> (Routine): pipelines that aren't live yet. Opens All Pipelines.</li></ul>$html$,
      '[]',
      60
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"Gauge","label":"Usage & request logs","href":"/help/grey/usage"},{"icon":"FileStack","label":"Sources & ingestion","href":"/help/grey/sources"},{"icon":"Workflow","label":"Pipelines & model providers","href":"/help/grey/pipelines"},{"icon":"ShieldCheck","label":"Evaluations & feedback","href":"/help/grey/quality"},{"icon":"Library","label":"Knowledge bases","href":"/help/grey/knowledge-bases"},{"icon":"MessagesSquare","label":"Playground","href":"/help/grey/playground"}]',
      70
    )
) as v(anchor_id, eyebrow, title, content, links, sort_order)
cross join (select id from public.docs_pages where slug = 'grey/project-overview' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Project overview',
    nav_label = null,
    description = 'The project''s home screen in Grey: activity, usage and what needs attention.',
    status = 'draft',
    published_at = null
where slug = 'grey/project-overview' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'grey/project-overview' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Opening the overview</li><li>Summary figures and charts</li><li>Top pipelines</li><li>What needs attention</li></ul>',
  10
from public.docs_pages p
where p.slug = 'grey/project-overview' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
