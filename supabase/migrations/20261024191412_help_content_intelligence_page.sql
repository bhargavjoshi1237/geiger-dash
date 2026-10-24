-- Help content intelligence page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the content/intelligence draft outline with
-- the full Content intelligence guide and publishes it. Content has no section showcases yet, so the page is text only.
-- Written from a survey of C:\Pro\geiger-content (components/internal/screens/intelligence/*, lib/supabase/{semantic,
-- metrics,events}.js, app/api/vector/[operation]/route.js, lib/vector/{auth,insights,service}.mjs, app/api/decide/route.js).
-- Left out: the sample figures the analytics screens show before live data exists (only their "Sample data" label is
-- described), provider, database and quota internals on the Embeddings screen, and Your interests & knowledge.
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Content intelligence',
    description = 'Index your library for semantic search, find duplicates, gaps and tag suggestions, explore the knowledge graph, and read performance and decision reports.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'content/intelligence' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'content/intelligence' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, showcase, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.showcase, v.sort_order
from (
  values
    (
      'indexing-your-library',
      'Basics',
      'Indexing your library',
      $html$<p>Most Intelligence screens work from an index of what your published entries and image assets mean. To build it, choose <strong>Intelligence → Embeddings</strong> in the sidebar, then <strong>Index library</strong>. Content queues every changed source and says how many it queued. Background indexing works through the queue over time; <strong>Run worker</strong> processes a batch straight away, and <strong>Retry jobs</strong> puts failed jobs back in the queue.</p><p>The <strong>Library & jobs</strong> tab lists the <strong>Indexed library</strong>, each source with its type, number of vectors and when it was updated, and the <strong>Background jobs</strong>, each with its status, attempts and details. Images get one vector each, and long entries are split into several chunks. Failed jobs keep their reason, and jobs held back by a limit keep their work and try again later. The figures across the top show the number of <strong>Content vectors</strong> and <strong>Audience vectors</strong>, and how many indexing <strong>Requests today</strong> have been used of the daily budget.</p><p>Indexing and changing its settings need the Manage content types, fields and blocks permission, which the Owner and Admin roles have.</p>$html$,
      '[]',
      null,
      10
    ),
    (
      'where-the-data-comes-from',
      'Concepts',
      'Where intelligence comes from',
      $html$<p>The Intelligence screens draw on three sources:</p><ul><li><strong>The index</strong> of published entries and image assets, built under <strong>Embeddings</strong>. Semantic Search, AI Tag Suggestions, Duplicate Detection, Content Gaps and the Knowledge Graph use it, so they're empty until the library is indexed.</li><li><strong>Your structure</strong>: taxonomy terms and references from <a href="/help/content/architecture">Content architecture</a>.</li><li><strong>Recorded activity</strong>: the events your site sends, covered in <a href="/help/content/audiences">Audiences</a>, and the decisions your content slots make.</li></ul><p>Opening the Intelligence screens that use the index needs a role that can see the Intelligence, Recommendations and Audiences sections, which Owner, Admin and Editor can. Each of these screens has <strong>Refresh</strong>, <strong>Export</strong> to download its rows as JSON, and a box to filter the results. Similarity scores show how alike two things are; they aren't probabilities or predictions.</p>$html$,
      '[]',
      null,
      20
    ),
    (
      'indexing-settings',
      'Embeddings',
      'Indexing settings',
      $html$<p>The <strong>Configuration</strong> tab of <strong>Intelligence → Embeddings</strong> controls what gets indexed. Turn these on or off:</p><ul><li><strong>Background indexing</strong>: off pauses new indexing and keeps existing vectors.</li><li><strong>Images</strong>: index image assets.</li><li><strong>Published content</strong>: index published entries as searchable chunks.</li><li><strong>Audience interests</strong>: build interests only for profiles that granted personalization consent.</li></ul><p>Then set the limits: <strong>Daily ingestion budget</strong>, <strong>Content vector limit</strong> (100 to 50,000), <strong>Topic vectors per user</strong> (0 to 5) and <strong>Interest half-life (days)</strong> (1 to 90). Choose <strong>Save changes</strong>; changes apply to later indexing runs. If the screen says indexing can't run until a key is set up on the server, existing vectors still work for similarity.</p>$html$,
      '[]',
      null,
      30
    ),
    (
      'semantic-search',
      'Semantic Search',
      'Searching by meaning',
      $html$<p><strong>Intelligence → Semantic Search</strong> finds images and published entries by what they mean, even when they don't share your words. Describe what you want, like "a bright product photo on a wooden table", and choose whether to search <strong>All sources</strong>, <strong>Images</strong> or <strong>Content</strong>. Results are ranked by similarity, with editorial adjustments applied, and show "No matching results" when nothing is close. Only indexed sources can be found.</p>$html$,
      '[]',
      null,
      40
    ),
    (
      'ai-tag-suggestions',
      'AI Tag Suggestions',
      'Tag suggestions',
      $html$<p><strong>Intelligence → AI Tag Suggestions</strong> suggests taxonomy terms an entry is missing, based on similar indexed entries that have them. Each suggestion shows the entry, the suggested term and its taxonomy, the similarity and the similar entries it's based on. Pick how close the evidence must be, from <strong>Similarity ≥ 65%</strong> (the default) to 95%.</p><p>The screen reviews 100 sources at a time: <strong>Next sources</strong> and <strong>Previous sources</strong> move through the rest. It uses stored vectors only, so it doesn't use any indexing budget. To accept a suggestion, assign the term under <strong>Architecture → Taxonomies</strong>.</p>$html$,
      '[]',
      null,
      50
    ),
    (
      'duplicate-detection',
      'Duplicate Detection',
      'Finding near-duplicates',
      $html$<p><strong>Intelligence → Duplicate Detection</strong> pairs up published entries that are at least 80% similar, each with its similarity. Raise the bar with the threshold menu, from <strong>At least 80% similar</strong> to 95%; it starts at 90%. The screen reviews 100 sources at a time, with <strong>Next sources</strong> and <strong>Previous sources</strong>. Check intent before you merge or remove anything.</p>$html$,
      '[]',
      null,
      60
    ),
    (
      'content-gaps',
      'Content Gaps',
      'Finding content gaps',
      $html$<p><strong>Intelligence → Content Gaps</strong> lists taxonomy topics with too few indexed published entries. Pick the target, from <strong>Target: 1 per topic</strong> to 10 (3 to start). Each topic shows its taxonomy, how many indexed entries it has, how many it's short of the target, and the entries that cover it. It measures how much you've published on a topic, not how much readers want it. When every topic meets the target, the screen says so.</p>$html$,
      '[]',
      null,
      70
    ),
    (
      'knowledge-graph',
      'Knowledge Graph',
      'The knowledge graph',
      $html$<p><strong>Intelligence → Knowledge Graph</strong> shows how published entries connect: through references, taxonomy terms they're tagged with, and similarity of at least 75%. The diagram draws up to 40 entities; dashed lines are inferred similarity. Click a node to filter the relations to it.</p><p>The <strong>Relations</strong> table lists each connection, its type and its evidence. Filter by relation: <strong>All relations</strong>, <strong>References</strong>, <strong>Tagged</strong>, <strong>Taxonomy</strong> or <strong>Similar</strong>. The screen reviews 100 sources at a time, with <strong>Next sources</strong> and <strong>Previous sources</strong>.</p>$html$,
      '[]',
      null,
      80
    ),
    (
      'decision-explanations',
      'Decision Explanations',
      'Decision explanations',
      $html$<p><strong>Intelligence → Decision Explanations</strong> lists the reasons Content gave when your app asked a content slot what to show: which variant won and why. Pick the period, <strong>Last 7 days</strong>, <strong>Last 30 days</strong> (the default) or <strong>Last 90 days</strong>, and the kind, starting on <strong>All decisions</strong>. Decisions for visitors who denied personalization consent aren't recorded. <a href="/help/content/personalization">Personalization</a> explains how slots decide.</p>$html$,
      '[]',
      null,
      90
    ),
    (
      'performance-reports',
      'Content Performance',
      'Performance reports',
      $html$<p>Four screens report on how content and audiences perform, from the events your site sends and daily totals:</p><ul><li><strong>Content Performance</strong>: a traffic trend of views, engaged sessions and conversions, the channel mix, performance by type, underperforming entries and top content.</li><li><strong>Audience Performance</strong>: engagement by segment, the journey mix, reach against quality, and a segment leaderboard.</li><li><strong>Funnels & Journeys</strong>: the acquisition funnel, drop-off between steps, entries against conversions, and top paths.</li><li><strong>Topic Interest</strong>: interest momentum, maturity by stage, and a topic leaderboard.</li></ul><p>Until the project has recorded data for a report, the screen shows sample figures marked <strong>Sample data</strong>. Don't read anything into them.</p>$html$,
      '[]',
      null,
      100
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"Rss","label":"Geiger Content","href":"/help/content"},{"icon":"DraftingCompass","label":"Content architecture","href":"/help/content/architecture"},{"icon":"UsersRound","label":"Audiences","href":"/help/content/audiences"},{"icon":"Target","label":"Personalization","href":"/help/content/personalization"},{"icon":"BrainCircuit","label":"Recommendations","href":"/help/content/recommendations"},{"icon":"Library","label":"Content library","href":"/help/content/library"}]',
      null,
      110
    )
) as v(anchor_id, eyebrow, title, content, links, showcase, sort_order)
cross join (select id from public.docs_pages where slug = 'content/intelligence' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Content intelligence',
    description = 'Content and audience performance, semantic search, tag suggestions, duplicates, gaps and the knowledge graph.',
    status = 'draft',
    published_at = null
where slug = 'content/intelligence' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'content/intelligence' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Content Performance</li><li>Audience Performance</li><li>Funnels and journeys</li><li>Topic Interest</li><li>Semantic Search</li><li>AI Tag Suggestions</li><li>Embeddings</li><li>Duplicate Detection</li><li>Content Gaps</li><li>Knowledge Graph</li><li>Decision Explanations</li></ul>',
  10
from public.docs_pages p
where p.slug = 'content/intelligence' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
