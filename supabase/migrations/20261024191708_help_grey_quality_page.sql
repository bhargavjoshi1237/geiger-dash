-- Help grey quality page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the grey/quality draft outline
-- (20261024191700_help_grey_structure) with the full Evaluations & feedback guide and publishes it.
-- Written from a survey of C:\Pro\geiger-grey (components/internal/screens/quality/*, lib/supabase/evals.js,
-- conversations.js, lib/engine/eval_runner.js, lib/engine/pipeline_config.js, lib/grey/eval_metrics.js,
-- components/internal/screens/playground/chat.jsx, geiger-ui.config.js, geiger-rbac.config.js).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Evaluations & feedback',
    description = 'Build eval sets of questions and expected answers, score pipelines on them, and triage the feedback people leave on answers.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'grey/quality' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'grey/quality' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.sort_order
from (
  values
    (
      'creating-an-eval-set',
      'Basics',
      'Creating an eval set',
      $html$<p>An eval set is a named group of test questions, called cases, that you score pipelines against. To create one, go to <strong>Quality → Evaluations</strong> and choose <strong>New set</strong>. Give it a <strong>Name</strong> (required) and an optional <strong>Description</strong>, then choose <strong>Create set</strong>.</p><p>Click the set to open it, then choose <strong>Add case</strong>:</p><ul><li><strong>Question</strong>: required, what the evaluation asks the pipeline.</li><li><strong>Expected answer</strong>: optional, a reference answer to compare against.</li><li><strong>Expected source IDs</strong>: optional, the sources a good answer draws on. Press <code>Enter</code> or a comma after each one.</li></ul><p><strong>Add from feedback</strong> lists answers that were rated not helpful or marked unanswered and aren't resolved yet. <strong>Use</strong> fills in the question, the answer given as the expected answer, and the sources it cited, for you to correct.</p><p>Each case's <strong>⋯</strong> menu has <strong>Edit case</strong> and <strong>Delete</strong>, which asks you to confirm. Managing eval sets needs the <strong>Manage evaluations</strong> permission, which every built-in role except Viewer has.</p>$html$,
      '[]',
      10
    ),
    (
      'how-scoring-works',
      'Concepts',
      'How evaluations are scored',
      $html$<p>An evaluation run asks the pipeline every question in the set, two at a time, then has the processing model set in <strong>Settings → General</strong> judge each answer. Without a processing model, runs fail. Each run gets four scores, from 0% to 100%:</p><ul><li><strong>Faithfulness</strong>: the share of the answer's claims that the retrieved passages support.</li><li><strong>Relevance</strong>: how directly and completely the answer addresses the question, whether or not it's correct.</li><li><strong>Precision</strong>: whether the passages that ranked highest were the useful ones. With expected sources, a passage counts when it comes from one of them; otherwise the judge decides.</li><li><strong>Recall</strong>: the share of expected sources that were retrieved. A case without expected sources uses the share of its expected answer that the passages support instead, and a case with neither gets no recall score.</li></ul><p>A run's scores are averages over its cases, skipping cases without that score. Runs don't appear in Request Logs, but the pipeline's and the judge's model calls use your provider accounts.</p>$html$,
      '[]',
      20
    ),
    (
      'running-an-evaluation',
      'Evaluations',
      'Running an evaluation',
      $html$<p>To run one, go to <strong>Quality → Evaluations</strong> and choose <strong>Run evaluation</strong>. Pick the <strong>Eval set</strong> and the <strong>Pipeline</strong>, then choose <strong>Queue run</strong>. The run uses the pipeline's latest published version, or its saved draft if it hasn't been published.</p><p>The <strong>Runs</strong> tab lists every run with its set, pipeline and version, status (Queued, Running, Completed or Failed), the four scores and when it was created. Scores fill in when the run completes. Hover over <strong>Failed</strong> to see why a run stopped. Filter by status, or search by set or pipeline name. Run a set again after changing a pipeline to compare the scores.</p><p>The <strong>Sets</strong> tab lists your eval sets with their number of cases. Each set's <strong>⋯</strong> menu has <strong>Edit set</strong> and <strong>Delete</strong>, which removes the set and its cases after you confirm and can't be undone.</p>$html$,
      '[]',
      30
    ),
    (
      'feedback',
      'Feedback',
      'Reviewing feedback',
      $html$<p><strong>Quality → Feedback</strong> collects the answers people rated in the Playground and the questions they marked unanswered. The figures across the top count <strong>Thumbs up</strong>, <strong>Thumbs down</strong> and <strong>Unanswered</strong>, and <strong>Satisfaction</strong>: the share of rated answers that were rated helpful.</p><p>Three tabs sort the list: <strong>Negative</strong> (thumbs down, the default), <strong>Unanswered</strong> and <strong>All</strong>. Negative and Unanswered show only items that aren't resolved yet. Each row shows the question, the answer, the pipeline, the note left with a thumbs down, and the date. Search the questions and answers, or filter by pipeline.</p><p>Each row's <strong>⋯</strong> menu has:</p><ul><li><strong>Open conversation</strong>: reads the whole conversation in Conversations.</li><li><strong>Add to eval set</strong>: turns the item into a case in an existing set, or in a new one with <strong>+ New set</strong>. The answer given becomes a draft <strong>Expected answer</strong> and its citations the <strong>Expected source IDs</strong>; edit them, then choose <strong>Add case</strong>.</li><li><strong>Resolve</strong> or <strong>Reopen</strong>: marks the item handled, or brings it back.</li></ul><p>Adding to an eval set and resolving need the <strong>Manage evaluations</strong> permission.</p>$html$,
      '[]',
      40
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"MessagesSquare","label":"Playground","href":"/help/grey/playground"},{"icon":"Workflow","label":"Pipelines & model providers","href":"/help/grey/pipelines"},{"icon":"Settings","label":"Project settings","href":"/help/grey/settings"}]',
      50
    )
) as v(anchor_id, eyebrow, title, content, links, sort_order)
cross join (select id from public.docs_pages where slug = 'grey/quality' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Evaluations & feedback',
    nav_label = null,
    description = 'Score pipeline versions against eval sets, and review the feedback people leave on answers.',
    status = 'draft',
    published_at = null
where slug = 'grey/quality' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'grey/quality' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Eval sets</li><li>Running evaluations</li><li>Feedback</li></ul>',
  10
from public.docs_pages p
where p.slug = 'grey/quality' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
