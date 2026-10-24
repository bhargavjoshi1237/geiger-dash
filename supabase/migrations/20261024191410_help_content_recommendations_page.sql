-- Help content recommendations page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the content/recommendations draft outline
-- with the Recommendations guide and publishes it. Content has no section showcases yet, so the page is text only.
-- Written from a survey of C:\Pro\geiger-content (components/internal/screens/recommendations/*, lib/supabase/
-- {recommend,variants,semantic}.js, lib/decide-core.js, lib/vector/service.mjs).
-- Left out: Recommendation Models (a static catalog whose descriptions no longer match the screens), User Affinity and
-- Collaborative Ranking (they read topic stages, which nothing creates), Diversity Controls and Real-time Ranking (session
-- demos with nothing stored), and Feed Lab with the live feed it opens (a test harness over a crawled catalog, not the
-- project's entries; its child page stays a draft).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Recommendations',
    description = 'Find related entries, review rankings with your boosts and exclusions applied, set business rules, and test how slot rules react to request context.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'content/recommendations' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'content/recommendations' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, showcase, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.showcase, v.sort_order
from (
  values
    (
      'finding-similar-entries',
      'Basics',
      'Finding similar entries',
      $html$<p>To see which entries are most like a given one, choose <strong>Recommendations → Similar Content</strong> in the sidebar and pick the reference entry from the menu at the top. Content lists up to eight similar entries, each with its type, status and a score, highest first.</p><p>When the project's entries have been indexed for semantic search, the ranking uses their meaning, with your boosts and exclusions applied, and <strong>Method</strong> shows Semantic. Otherwise Content falls back to comparing the words in each entry's title, excerpt and body, <strong>Method</strong> shows Keywords, and a note says why semantic results aren't available. The figures across the top also show how many <strong>Candidates</strong> were compared and the <strong>Top score</strong>.</p>$html$,
      '[]',
      null,
      10
    ),
    (
      'how-rankings-work',
      'Concepts',
      'Rankings and editorial rules',
      $html$<p>The Recommendations screens rank your project's entries so you can review them inside Content. Two kinds of editorial rule adjust those rankings:</p><ul><li>A <strong>boost</strong> multiplies an entry's score by its weight, so it ranks higher.</li><li>An <strong>exclusion</strong> removes the entry from rankings.</li></ul><p>You add them under <strong>Personalization → Boosts & Exclusions</strong> or under <strong>Recommendations → Business Rules</strong>. Both screens edit the same set of rules; Business Rules also records a reason for each one. Paused rules don't apply. Screens that can't measure real traffic label their scores as estimates.</p>$html$,
      '[]',
      null,
      20
    ),
    (
      'content-based-ranking',
      'Content-based Ranking',
      'Content-based ranking',
      $html$<p><strong>Recommendations → Content-based Ranking</strong> shows how the entries most like a reference entry rank once your boosts and exclusions apply. Pick the reference entry from the menu at the top. Content lists up to 10 entries with their final score, and marks the ones a boost lifted as Boosted. Excluded entries don't appear.</p><p>The figures across the top count the entries <strong>Ranked</strong>, how many are <strong>Boosted</strong>, and the active exclusion rules (<strong>Excluded</strong>). If every candidate is excluded, or the project has only one entry, the list shows "Nothing ranked".</p>$html$,
      '[]',
      null,
      30
    ),
    (
      'trending-content',
      'Trending Content',
      'Trending content',
      $html$<p><strong>Recommendations → Trending Content</strong> lists the 10 entries updated most recently, with a trend score that falls as an entry ages. It doesn't measure views: the screen labels every score and age as an estimate, and <strong>Measured traffic</strong> shows None. Use it as a quick look at what's fresh, not at what's popular.</p>$html$,
      '[]',
      null,
      40
    ),
    (
      'context-aware-ranking',
      'Context-aware Ranking',
      'Testing variants against a context',
      $html$<p><strong>Recommendations → Context-aware Ranking</strong> lets you try the slot decision rules without any traffic. It uses the same matching as real slot decisions.</p><ol><li>In <strong>Variants (JSON)</strong>, list the variants to test, each with an <code>id</code>, <code>entryId</code>, <code>priority</code>, <code>weight</code>, <code>status</code> and <code>rules</code>. The box starts with an example.</li><li>In <strong>Context (JSON)</strong>, describe the request, like <code>{ "device": "mobile", "locale": "en" }</code>.</li><li>Choose <strong>Run</strong>.</li></ol><p><strong>Outcome</strong> shows whether each variant matches the context and how many clauses it has, then the winning entry and the reason. Nothing is saved. If either box isn't valid JSON, Content says "One of the JSON blocks is invalid." <a href="/help/content/personalization">Personalization</a> explains how slots decide.</p>$html$,
      '[]',
      null,
      50
    ),
    (
      'business-rules',
      'Business Rules',
      'Business rules',
      $html$<p>Business rules are boosts and exclusions with a recorded reason, such as a sponsorship or a compliance block. To add one, choose <strong>Recommendations → Business Rules</strong>, then <strong>Create rule</strong>:</p><ul><li><strong>Entry</strong>: required.</li><li><strong>Rule type</strong>: Boost (the default) or Exclude.</li><li><strong>Weight</strong>: the boost multiplier, 2 to start. Exclusions don't use it.</li><li><strong>Business reason</strong>: required, like <code>Sponsor Q4</code>.</li></ul><p>Choose <strong>Create rule</strong>. New rules are Active. Each rule's <strong>⋯</strong> menu has <strong>Pause</strong> or <strong>Activate</strong> and <strong>Delete</strong>, which removes it straight away, without asking. The figures across the top count active <strong>Business rules</strong>, <strong>Sponsor boosts</strong> and <strong>Compliance excludes</strong>. Search entries and reasons. Changing rules needs the Manage settings permission, which the Owner and Admin roles have.</p>$html$,
      '[]',
      null,
      60
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"Rss","label":"Geiger Content","href":"/help/content"},{"icon":"Target","label":"Personalization","href":"/help/content/personalization"},{"icon":"ChartNoAxesCombined","label":"Content intelligence","href":"/help/content/intelligence"}]',
      null,
      70
    )
) as v(anchor_id, eyebrow, title, content, links, showcase, sort_order)
cross join (select id from public.docs_pages where slug = 'content/recommendations' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Recommendations',
    description = 'Rank and recommend content with models, similar content, affinity, trending, ranking rules and the Feed Lab.',
    status = 'draft',
    published_at = null
where slug = 'content/recommendations' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'content/recommendations' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Recommendation Models</li><li>Similar Content</li><li>User Affinity</li><li>Trending Content</li><li>Content-based, collaborative and context-aware ranking</li><li>Diversity Controls</li><li>Feed Lab</li><li>Business Rules</li><li>Real-time Ranking</li></ul>',
  10
from public.docs_pages p
where p.slug = 'content/recommendations' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
