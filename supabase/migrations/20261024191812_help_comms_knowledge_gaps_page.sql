-- Help comms knowledge gaps page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the comms/knowledge-gaps draft outline from
-- 20261024191800_help_comms_structure with the full Knowledge gaps guide. Comms isn't deployed yet, so the page stays a
-- draft. Left out: the Messenger questions and Negative reactions sources, which the screen hides until the Messenger
-- records them (MESSENGER_RICH_ARTICLES is false).
-- Written from a survey of C:\Pro\geiger-comms (components/internal/screens/knowledge_base/knowledge_gaps.jsx,
-- gap_drawer.jsx, dismiss_gap_dialog.jsx, link_article_dialog.jsx, ai_suggestion_dialog.jsx, use_gaps.js, constants.js,
-- lib/server/kb_gaps.js, lib/kb/gap_cluster.js, gap_thresholds.js, app/api/kb/gaps/refresh/route.js).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Knowledge gaps',
    description = 'Find the questions customers ask that your articles don''t answer, ranked by impact, and close each gap with a new or updated article.'
where slug = 'comms/knowledge-gaps' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'comms/knowledge-gaps' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.sort_order
from (
  values
    (
      'finding-gaps',
      'Basics',
      'Finding knowledge gaps',
      $html$<p>A knowledge gap is a topic customers ask about that your published articles don't answer. To find them, go to <strong>Knowledge Base → Knowledge Gaps</strong> and choose <strong>Refresh</strong>. The button shows its progress as a percentage, and the screen says when it was last refreshed.</p><p>A refresh reads the customer questions in conversations from the last 90 days and checks each one against your published articles. It uses your AI provider's embedding model when one is set up, and a text search when it isn't. Questions no article answers well are grouped into topics: by your AI provider when the Knowledge gap clustering feature is available, and by shared keywords when it isn't.</p><p>Comms refreshes only when someone chooses <strong>Refresh</strong>, and only one refresh runs at a time in a project.</p>$html$,
      '[]',
      10
    ),
    (
      'gap-states',
      'Concepts',
      'Gap states and impact',
      $html$<p>Each gap has a state:</p><ul><li><strong>Open</strong>: waiting for an article.</li><li><strong>In progress</strong>: linked to an article that isn't published.</li><li><strong>Resolved</strong>: linked to a published article.</li><li><strong>Dismissed</strong>: set aside by a teammate.</li><li><strong>Expired</strong>: an open gap with no new questions for 28 days.</li></ul><p><strong>Impact</strong> ranks gaps by how much they matter: the conversations asking about the topic in the last 30 days, plus half of those from the 60 days before, plus a quarter of the days it came up in the last 30. <strong>Trend</strong> compares the last 14 days with the 14 before: <strong>Rising</strong> or <strong>Falling</strong> when the change is more than 20%, otherwise <strong>Steady</strong>.</p><p>Some gaps are marked <strong>Edit existing article</strong>: most of their questions almost matched one article.</p>$html$,
      '[]',
      20
    ),
    (
      'gap-list',
      'Knowledge Gaps',
      'The gap list',
      $html$<p>The figures across the top show the <strong>Open gaps</strong>, <strong>Questions (30 days)</strong>, the <strong>Unanswered rate</strong> (the share of scanned conversations no article answered) and the gaps <strong>Resolved (30 days)</strong>.</p><p>Each row shows the topic, its questions in the last 30 days, impact, trend, sources, when it was last seen and its state. The list starts on <strong>Open</strong> gaps, sorted by impact. Narrow it by state, source or trend, sort it by <strong>Impact</strong>, <strong>Questions</strong> or <strong>Newest</strong>, or search it.</p><p>Click a gap, or choose <strong>View questions</strong>, to open its details: what customers asked, a weekly volume chart for the last 90 days, when it was first seen, and the articles that almost answer it.</p>$html$,
      '[]',
      30
    ),
    (
      'closing-a-gap',
      'Knowledge Gaps',
      'Writing or linking an article',
      $html$<p>An open gap's <strong>⋯</strong> menu offers two ways to close it:</p><ul><li><strong>Create article</strong>: when the Article writing assistant feature is available, Comms drafts an article from the customers' questions for you to review, and <strong>Create draft article</strong> saves it. Otherwise it creates a draft at once, with a <code>[TODO: answer]</code> placeholder and the questions customers asked. Either way, the draft opens in the editor.</li><li><strong>Link existing article</strong>: pick an article that answers it. A published article resolves the gap straight away; a draft keeps it In progress until it's published.</li></ul><p>In a gap's details, <strong>Suggest edit</strong> beside an article that almost answers it has your AI provider propose an edit. <strong>Accept as draft</strong> saves it to the article, as unpublished changes if the article is published, and links the article to the gap.</p><p>Once a gap is In progress or Resolved, its menu has <strong>Open article</strong> and <strong>Reopen</strong>. If its article is deleted or archived, the gap reopens on the next refresh.</p>$html$,
      '[]',
      40
    ),
    (
      'dismissing-a-gap',
      'Knowledge Gaps',
      'Dismissing a gap',
      $html$<p>To set aside a gap that doesn't need an article, choose <strong>Dismiss…</strong> in its menu and pick a reason: <strong>Not relevant</strong>, <strong>Already covered</strong>, <strong>Duplicate topic</strong> or <strong>Other</strong>, which needs a reason in words. Then choose <strong>Dismiss</strong>.</p><p>A dismissed gap comes back on its own when customers ask about it twice as often as when you dismissed it. To bring it back yourself, choose <strong>Reopen</strong>.</p>$html$,
      '[]',
      50
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"FileText","label":"Articles","href":"/help/comms/articles"},{"icon":"BookOpen","label":"Help centers","href":"/help/comms/help-centers"},{"icon":"Cpu","label":"AI providers","href":"/help/comms/ai-providers"}]',
      60
    )
) as v(anchor_id, eyebrow, title, content, links, sort_order)
cross join (select id from public.docs_pages where slug = 'comms/knowledge-gaps' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Knowledge gaps',
    description = 'Find the questions your articles don''t answer, ranked by how often they come up.'
where slug = 'comms/knowledge-gaps' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'comms/knowledge-gaps' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>How gaps are found</li><li>Reviewing a gap</li><li>Writing or linking an article</li><li>Dismissing a gap</li></ul>',
  10
from public.docs_pages p
where p.slug = 'comms/knowledge-gaps' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
