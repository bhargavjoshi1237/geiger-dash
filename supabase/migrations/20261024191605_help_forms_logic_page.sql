-- Help forms logic page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the forms/logic draft outline (from
-- 20261024191600_help_forms_structure) with the full Logic & scoring guide and publishes it.
-- Written from a survey of C:\Pro\geiger-forms (components/forms/builder/conditions-editor.jsx, formula-editor.jsx,
-- sidebar-sections.jsx (Branches, Triage, Submission), field-settings.jsx, options-editor.jsx, page-break-card.jsx,
-- lib/forms/logic.js, lib/forms/formula.js, lib/forms/schema.js (defaultSettings), lib/server/submit.js (initialStatus),
-- lib/server/public-form.js (publicFieldDefs), components/forms/filler/thank-you.jsx, form-runner.jsx,
-- components/forms/form-field-renderer.jsx, app/api/public/forms/[slug]/results/route.js,
-- components/internal/screens/forms/forms/sections/structure.jsx (LogicSection)).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Logic & scoring',
    description = 'Show fields and pages only when they apply, calculate values, score answers, grade quizzes and send respondents to different endings.',
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'forms/logic' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'forms/logic' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.sort_order
from (
  values
    (
      'showing-a-field-conditionally',
      'Basics',
      'Showing a field only when it applies',
      $html$<p>To show a field only when an earlier answer calls for it, open the field's settings in the builder, choose the <strong>Logic</strong> tab, then <strong>Add condition</strong>.</p><ol><li>Pick the field whose answer decides it. Any field that stores an answer can be picked, hidden fields included.</li><li>Pick an operator, such as <strong>Equals</strong> or <strong>Greater than</strong>.</li><li>Pick or type the value. Choice fields offer their options, and yes/no fields offer Checked or Not checked.</li></ol><p>With two or more conditions, choose <strong>ANY</strong> (the default: one match is enough) or <strong>ALL</strong> (every condition must match). A field with conditions shows a badge with how many it has. Remove a condition with the × beside it.</p><p>Until a field has a condition, every respondent sees it.</p>$html$,
      '[]',
      10
    ),
    (
      'how-conditions-work',
      'Concepts',
      'How conditions work on the live form',
      $html$<p>Forms checks conditions from the top of the form down, as the respondent answers. A field hidden by its conditions counts as unanswered for the fields after it, so one hidden field can hide others that depend on it.</p><ul><li>Answers to hidden fields aren't saved, scored or recalled, and a hidden required field isn't required.</li><li>Text is compared without regard to case.</li><li>For a field with several answers, such as multiple choice, <strong>Equals</strong> and <strong>Contains</strong> match when any selected answer matches, and <strong>Does not equal</strong> matches when none does.</li></ul><p>The operators are <strong>Equals</strong>, <strong>Does not equal</strong>, <strong>Contains</strong>, <strong>Does not contain</strong>, <strong>Starts with</strong>, <strong>Is empty</strong>, <strong>Is not empty</strong>, <strong>Greater than</strong>, <strong>At least</strong>, <strong>Less than</strong> and <strong>At most</strong>. The builder offers only the ones that fit the field: number comparisons for numbers, ratings and scales, and no text matching for choices, dates or numbers.</p><p>If you delete a field that a condition uses, the condition shows "Deleted field" and the builder lists it under problems to check.</p>$html$,
      '[]',
      20
    ),
    (
      'skipping-pages',
      'Logic',
      'Skipping pages',
      $html$<p>A page of a multi-page form can be skipped as a whole. In the builder, click the arrow on the page break that starts the page to open <strong>Show this page only when</strong>, then add conditions the same way as for a field.</p><p>When the conditions don't match, respondents skip straight to the next page, and any answers on the skipped page are ignored. Pages with conditions show a branch icon in the <strong>Pages</strong> list. The <a href="/help/forms/builder#pages">Form builder</a> guide covers adding page breaks.</p>$html$,
      '[]',
      30
    ),
    (
      'calculated-fields',
      'Logic',
      'Calculated fields',
      $html$<p>A calculated field works out a value from other answers, such as a total or a quote, and shows it to respondents as they fill in the form. To add one, choose <strong>Calculated</strong> under the canvas, then write its formula on the <strong>Formula</strong> tab.</p><ul><li>Refer to another field by its name or ID in braces, like <code>{Quantity} * {Unit price}</code>. The field menu next to <strong>Formula</strong> inserts a reference for you.</li><li>Use <code>+ - * / %</code>, comparisons such as <code>></code> and <code>==</code>, <code>&&</code>, <code>||</code> and parentheses. Dividing by zero gives 0.</li><li>Functions: <code>IF</code>, <code>SUM</code>, <code>MIN</code>, <code>MAX</code>, <code>AVG</code>, <code>ROUND</code>, <code>ABS</code>, <code>DAYS</code> (whole days between two dates) and <code>LEN</code> (characters, or how many items were selected). Click a function to insert it.</li><li>A choice counts as its option's points, a checkbox as 1 or 0, and a product as its quantity times its price.</li></ul><p>Under the formula, Forms flags a syntax error, an unknown field or a reference to the field itself. <strong>Live preview</strong> shows the result for sample answers you can change. <strong>Display format</strong> shows the value as a <strong>Number</strong>, <strong>Currency</strong> or <strong>Percent</strong>. <strong>Count in score</strong> adds the value to the response's score when scoring is on.</p>$html$,
      '[]',
      40
    ),
    (
      'scoring-responses',
      'Logic',
      'Scoring responses',
      $html$<p>Scoring adds up points from a response's answers and uses the total to set its priority. In the builder, open <strong>Auto-triage & quiz</strong> in the sidebar and turn on <strong>Score responses</strong>.</p><ul><li>Give points to choices: with scoring on, choice fields show a <strong>Points</strong> column next to their options on the <strong>Question</strong> tab.</li><li>Calculated fields add their value, unless you turn off <strong>Count in score</strong>.</li><li>On a quiz, correct answers add their quiz points.</li></ul><p>Under <strong>Priority thresholds</strong>, a score at or above <strong>High</strong> (80 to start with) makes the response High priority, at or above <strong>Medium</strong> (40) makes it Medium, and anything lower is Low. A response that scores High also gets the status Needs review, unless it's awaiting payment or approval. A matching branch with its own <strong>Priority</strong> overrides the score.</p><p>To show respondents their score on the thank-you screen, turn on <strong>Show score</strong> under <strong>Submission</strong>.</p>$html$,
      '[]',
      50
    ),
    (
      'quizzes',
      'Logic',
      'Quizzes',
      $html$<p>Quiz mode grades answers against the correct answers you mark. In the builder, open <strong>Auto-triage & quiz</strong> and turn on <strong>Quiz mode</strong>.</p><ul><li>On single choice, dropdown, multiple choice and picture choice fields, mark the right options with the <strong>Correct</strong> toggles on the <strong>Question</strong> tab. For a question with several answers, the respondent has to pick exactly the options you marked.</li><li>On short text, number, email and website fields, type the <strong>Correct answer</strong> on the <strong>Validation</strong> tab. It's matched without regard to case.</li><li>Set each question's <strong>Points</strong> on its <strong>Validation</strong> tab. Each is worth 1 to start with.</li></ul><p>A respondent's score is the share of points they earned on the graded questions they saw, and they pass at the <strong>Pass mark (%)</strong> (70 to start with). After submitting, they see their result. Turn on <strong>Show correct answers</strong> to show them the answers too. Correct answers are never sent to respondents' browsers before they submit.</p><p>The <a href="/help/forms/analytics#survey-report">Analytics</a> guide covers the quiz summary in a form's report.</p>$html$,
      '[]',
      60
    ),
    (
      'branches-and-outcomes',
      'Logic',
      'Branches and outcomes',
      $html$<p>Branches give each response a named outcome, such as Qualified lead, and can send respondents to their own ending. In the builder, open <strong>Branches</strong> in the sidebar, turn on <strong>Named outcomes</strong>, then choose <strong>Add branch</strong>.</p><ul><li><strong>Matches when</strong>: the branch's conditions. Besides answers, a branch can test <strong>Score</strong> while scoring or a quiz is on, and <strong>Quiz score (%)</strong> while a quiz is on. A branch without conditions never matches.</li><li><strong>Outcome name</strong>: what the response is tagged with. It's the branch name unless you change it.</li><li><strong>Priority</strong>: <strong>From score</strong> (the default) or a fixed High, Medium or Low.</li><li><strong>Set status</strong>: <strong>Unchanged</strong> (the default) or a response status. It applies unless the response is awaiting payment, pending approval or scored High priority.</li><li><strong>Custom ending</strong>: this outcome's own thank-you screen, with a <strong>Title</strong>, <strong>Message</strong>, an optional button (<strong>Button label</strong> and <strong>Button link</strong>) and an optional <strong>Redirect URL</strong>. Empty texts fall back to the form's own thank-you screen.</li></ul><p>Forms checks branches from the top down and the first match wins, so put the narrowest branches first with the arrows. Without a custom ending, respondents see the outcome name on the thank-you screen. Outcomes appear on each response and can be filtered in the Response Inbox.</p>$html$,
      '[]',
      70
    ),
    (
      'answer-recall',
      'Logic',
      'Answer recall and merge tags',
      $html$<p>Answer recall puts an earlier answer into later text, like "Thanks, {Full name}". Write the field's name in braces, or choose <strong>Recall</strong> in a field's <strong>Question</strong> tab to insert one. Recall only offers fields that come earlier in the form, plus hidden fields.</p><p>Merge tags work in a field's question and help text, text blocks, image captions, the welcome screen and the thank-you title and message. On the thank-you screen and in endings, three more tags work: <code>{score}</code>, <code>{outcome}</code> and <code>{total}</code> (the order total). In a redirect URL, tags are encoded for the address, like <code>?score={score}</code>.</p><p>A field hidden by logic recalls as nothing, and a calculated field recalls its current value. Each field's tag is shown at the bottom of its <strong>Advanced</strong> tab.</p>$html$,
      '[]',
      80
    ),
    (
      'poll-results',
      'Logic',
      'Showing poll results',
      $html$<p>A form can show respondents how everyone else answered, right after they submit. Open the form's settings, go to <strong>Logic & Scoring</strong>, turn on <strong>Show poll results</strong>, then choose <strong>Save changes</strong>.</p><p>The thank-you screen then shows counts for each choice, yes/no and ranking question (first-place picks for ranking), and counts with the average for star ratings, scales, NPS and opinion scales. Fields marked as sensitive and responses marked Spam are left out, and the counts cover the latest 5,000 responses.</p><p>The same <strong>Logic & Scoring</strong> section counts the form's conditional fields, calculated fields, branches and graded questions, lists its rules and flags formula errors. Its scoring, quiz and branching switches change the same settings as the builder.</p>$html$,
      '[]',
      90
    ),
    (
      'related-guides',
      null::text,
      'Related guides',
      '',
      '[{"icon":"PencilRuler","label":"Form builder","href":"/help/forms/builder"},{"icon":"ListChecks","label":"Field types","href":"/help/forms/fields"},{"icon":"Settings2","label":"Form settings","href":"/help/forms/form-settings"},{"icon":"Inbox","label":"Responses","href":"/help/forms/responses"},{"icon":"ChartColumn","label":"Analytics","href":"/help/forms/analytics"},{"icon":"CreditCard","label":"Payments","href":"/help/forms/payments"}]',
      100
    )
) as v(anchor_id, eyebrow, title, content, links, sort_order)
cross join (select id from public.docs_pages where slug = 'forms/logic' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Logic & scoring',
    description = 'Show fields only when they apply, skip pages, calculate values, score answers, and send respondents to different endings.',
    status = 'draft',
    published_at = null
where slug = 'forms/logic' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'forms/logic' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Conditions</li><li>Page skip logic</li><li>Calculated fields</li><li>Branches and outcomes</li><li>Auto-triage and quizzes</li><li>Answer recall</li><li>Validation rules</li></ul>',
  10
from public.docs_pages p
where p.slug = 'forms/logic' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
