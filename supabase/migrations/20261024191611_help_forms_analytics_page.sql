-- Help forms analytics page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the forms/analytics draft outline (from
-- 20261024191600_help_forms_structure) with the full Analytics guide and publishes it.
-- Written from a survey of C:\Pro\geiger-forms (components/internal/screens/forms/analytics/*,
-- components/internal/screens/forms/responses/survey_report.jsx, form_responses_screen.jsx, lib/forms/response-utils.js,
-- lib/server/public-form.js (pickVariant), lib/server/submit.js, components/forms/filler/form-runner.jsx, session.js,
-- app/api/public/forms/[slug]/event/route.js, app/api/public/forms/[slug]/partial/route.js, app/api/cron/reports/route.js,
-- vercel.json).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Analytics',
    description = 'See how your forms perform: views, starts and submissions, where respondents drop off, which sources bring them, A/B tests and reports.',
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'forms/analytics' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'forms/analytics' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.sort_order
from (
  values
    (
      'opening-analytics',
      'Basics',
      'Opening analytics',
      $html$<p>Expand <strong>Analytics</strong> in the Forms sidebar to reach its six screens: <strong>Dashboard</strong>, <strong>Funnel & Drop-off</strong>, <strong>Source & Attribution</strong>, <strong>A/B Testing</strong>, <strong>Reports</strong> and <strong>Survey Reporting</strong>. Each one covers the forms in the open project.</p><p>Dashboard, Funnel & Drop-off, Source & Attribution and A/B Testing have a time range menu at the top right: <strong>Last 7 days</strong>, <strong>Last 30 days</strong> (the default) or <strong>Last 90 days</strong>. A range starts at midnight on its first day, and each screen goes back to Last 30 days when you open it again.</p><p>Views and starts are recorded on a form's public link, so a form only gathers them while it's published.</p>$html$,
      '[]',
      10
    ),
    (
      'how-analytics-counts',
      'Concepts',
      'How analytics counts views, starts and submissions',
      $html$<ul><li>A <strong>view</strong> is one browser session opening the form. Reloading the form in the same tab doesn't count again.</li><li>A <strong>start</strong> is recorded when the respondent answers their first field.</li><li>A <strong>submission</strong> is a saved response. Analytics leaves out responses marked Spam.</li></ul><p>The rates divide one step by another:</p><ul><li><strong>Conversion</strong>: submissions divided by views.</li><li><strong>Start rate</strong>: starts divided by views.</li><li><strong>Completion</strong>: submissions divided by starts.</li><li><strong>Avg completion time</strong>: the average time respondents spent from the form's fields appearing to submitting.</li></ul><p>A rate shows a dash when there's nothing to divide by, for example a form with no views in the range.</p>$html$,
      '[]',
      20
    ),
    (
      'analytics-dashboard',
      'Analytics',
      'Analytics dashboard',
      $html$<p>Choose <strong>Analytics → Dashboard</strong> to see every form's activity in the time range.</p><ul><li>The figures across the top show <strong>Views</strong>, <strong>Starts</strong>, <strong>Submissions</strong> and <strong>Conversion</strong>, then <strong>Start rate</strong>, <strong>Completion</strong> and <strong>Avg completion time</strong>.</li><li><strong>Trend</strong> plots views, starts and submissions for each day of the range.</li><li><strong>Status mix</strong> lists the statuses of the responses submitted in the range, each with its count and share.</li><li><strong>Per-form performance</strong> lists each form with its status, views, starts, submits, conversion and average time, most submissions first (then most views). Search it by form name, and click a form to open its settings.</li></ul><p>The list shows 25 forms a page; switch to 10, 50 or 100 at the bottom.</p>$html$,
      '[]',
      30
    ),
    (
      'funnel-and-drop-off',
      'Analytics',
      'Funnel and drop-off',
      $html$<p><strong>Funnel & Drop-off</strong> shows where respondents leave one form. Pick the form from the form menu at the top right, next to the time range.</p><p>The <strong>Funnel</strong> card shows how many respondents <strong>Viewed</strong>, <strong>Started</strong> and <strong>Submitted</strong> the form, each as a share of views, with the start rate and the completion rate of starts.</p><p>While someone fills in a form, Forms saves their progress two seconds after each change, once they've answered a first field. A form that asks respondents to opt in before their progress is saved keeps nothing until they opt in. A saved session counts as <strong>abandoned</strong> when it was never submitted and has had no activity for 30 minutes, and its last activity falls in the time range.</p><ul><li><strong>Abandoned sessions</strong>, <strong>Median time to abandon</strong> (from the first save to the last activity), <strong>Avg progress at exit</strong> (how much of the form was answered) and <strong>Conversion</strong> run across the top.</li><li><strong>Field drop-off</strong> lists the form's fields in order, with the share of abandoned sessions whose last touched field was each one.</li><li><strong>Page drop-off</strong> appears when the form has more than one page, and shows which page abandoned sessions were on.</li></ul>$html$,
      '[]',
      40
    ),
    (
      'abandoned-sessions',
      'Analytics',
      'Abandoned sessions',
      $html$<p>The <strong>Abandoned sessions</strong> list on <strong>Funnel & Drop-off</strong> shows each abandoned session of the chosen form, most recent first. Each row shows the respondent's email (or Anonymous), their progress, the last field they touched, the page they were on, the time they spent and when they were last active.</p><p>Search the list by respondent email or field name. It shows 25 sessions a page. Until a session is abandoned in the time range, it shows Nothing abandoned.</p><p>To follow up on unfinished responses, use <strong>Responses → Partial / Abandoned</strong>, covered in <a href="/help/forms/responses#partial-and-abandoned">Responses</a>.</p>$html$,
      '[]',
      50
    ),
    (
      'source-and-attribution',
      'Analytics',
      'Source and attribution',
      $html$<p><strong>Source & Attribution</strong> shows which channels, campaigns and referring sites bring views and submissions. To track a channel, add UTM parameters to the form's public link, like <code>?utm_source=newsletter&utm_campaign=spring</code>. Forms stores <code>utm_source</code>, <code>utm_medium</code> and <code>utm_campaign</code> with every view, start and submission from that link. It also records the referring site's address when the browser sends one, and an embedded form reports the page it's embedded in.</p><p>The tabs group the activity by <strong>Source</strong>, <strong>Medium</strong>, <strong>Campaign</strong> or <strong>Referrer</strong>. Activity without a value is grouped as (direct) for Source and Referrer, and (none) for Medium and Campaign. Each row shows views, starts, submissions and conversion, most submissions first.</p><p>The figures across the top show <strong>Attributed submissions</strong> (the share of submissions that carry a UTM value or a referrer), the number of distinct <strong>Sources</strong> and <strong>Campaigns</strong>, and the <strong>Top source</strong>. The form menu narrows everything to one form, and starts at <strong>All forms</strong>. Responses marked Spam aren't counted.</p>$html$,
      '[]',
      60
    ),
    (
      'setting-up-an-ab-test',
      'Analytics',
      'Setting up an A/B test',
      $html$<p>An A/B test shows respondents different versions of a form's title and description, so you can see which version gets more submissions. You need permission to edit forms: the buttons are disabled for roles that can't.</p><ol><li>Choose <strong>Analytics → A/B Testing</strong>.</li><li>Under <strong>Start a test</strong>, choose <strong>Add variants</strong> next to the form. For a form that already has variants, choose <strong>Variants</strong>.</li><li>Name each variant, and write its <strong>Title override</strong> and <strong>Description override</strong>. Leave either blank to keep the form's own text. The first variant is the <strong>Control</strong>.</li><li>Optional: choose <strong>Add variant</strong> for more versions, or the trash icon to remove one.</li><li>Turn on <strong>Run this test</strong>, then choose <strong>Save variants</strong>.</li></ol><p>A running test needs at least two variants, and every variant needs a name. The variants save as soon as you choose Save variants. Turn off Run this test to pause it: the variants are kept but not shown.</p><p>While a test runs, Forms picks one variant at random each time someone opens the form, so visits split roughly evenly. That variant's title and description replace the form's own for the visit.</p>$html$,
      '[]',
      70
    ),
    (
      'reading-ab-test-results',
      'Analytics',
      'Reading A/B test results',
      $html$<p>Each form with variants gets a card on <strong>A/B Testing</strong>, marked Running or Paused. Its table lists each variant with its views, submissions, conversion (submissions divided by views) and lift: how much higher or lower its conversion is than the control's, as a percentage.</p><p>The <strong>Significance</strong> column compares each variant with the control using a two-proportion test at 95% confidence:</p><ul><li><strong>Winning</strong> or <strong>Losing</strong>: the difference is significant (p below 0.05).</li><li><strong>Not significant</strong>: the difference could be chance, with its p-value.</li><li><strong>Not enough data</strong>: the variant or the control has no views yet.</li></ul><p>Visits from before the test, or from while it was paused, appear as <strong>Original (no variant)</strong>. The figures across the top show <strong>Running tests</strong>, forms with variants (<strong>Configured</strong>), <strong>Significant winners</strong> and <strong>Variant views</strong>. <strong>Open form</strong> opens the form's settings.</p>$html$,
      '[]',
      80
    ),
    (
      'reports',
      'Analytics',
      'Reports',
      $html$<p><strong>Reports</strong> and <strong>Survey Reporting</strong> open the same list of the project's forms, the most responses first. Search it by name, and click a form to open its report. The figures across the top count <strong>Forms</strong>, <strong>Responses</strong>, the forms that send a <strong>Weekly digest</strong> and the <strong>Digest recipients</strong>.</p><p>A form's report shows:</p><ul><li><strong>Total responses</strong> (with how many need review), <strong>Resolved</strong> (the share that are Complete or Approved), <strong>Avg score</strong> and <strong>High priority</strong>.</li><li><strong>Response volume</strong> for each of the last 7 days, and a <strong>Status breakdown</strong> of all responses.</li><li>The <strong>Responses</strong> tab, with the same tools as the Response Inbox for this form only. See the <a href="/help/forms/responses">Responses</a> guide.</li><li>The <strong>Survey report</strong> tab, with a summary of every question.</li><li>The <strong>Acknowledgements</strong> tab, when the form asks respondents to acknowledge a policy: who acknowledged, the name they typed, whether they read to the end and when.</li></ul><p><strong>Export CSV</strong> downloads all of the form's responses, for roles that can export responses. <strong>Open builder</strong> opens the form in the builder, and <strong>Back</strong> returns to the list.</p>$html$,
      '[]',
      90
    ),
    (
      'survey-report',
      'Analytics',
      'Survey report',
      $html$<p>The <strong>Survey report</strong> tab of a form's report summarizes each question across all of its responses, with how many responses answered it.</p><ul><li>Choice, picture choice, yes/no and consent questions: a count and share for each option.</li><li>Star ratings and linear scales: the average, lowest and highest answer, and a count for each value.</li><li>Opinion scales: the average out of the scale's steps, and a count for each step.</li><li>NPS: the score (the share of promoters, who answer 9 or 10, minus the share of detractors, who answer 0 to 6), the split of detractors, passives and promoters, and a count for each value.</li><li>Matrix questions: a grid counting each answer in each row.</li><li>Ranking questions: each option's average rank, best first.</li><li>Number, currency, product and calculated fields: the minimum, average and maximum.</li><li>Text, contact, date and booking questions: the eight latest answers.</li></ul><p>On a quiz, a <strong>Quiz summary</strong> comes first: the average score, the pass rate against the quiz's pass mark and the share of correct answers for each question. Until the form has responses, the tab shows No data yet.</p>$html$,
      '[]',
      100
    ),
    (
      'weekly-digests',
      'Analytics',
      'Weekly digest emails',
      $html$<p>A weekly digest emails a form's figures for the last 7 days to the people you choose: its responses, views and starts, its completion rate, how many responses are High priority, and a count for each status, with an <strong>Open responses</strong> button. Digests go out on Mondays (UTC), and archived forms don't send one.</p><p>Add the recipients in the form's settings under <strong>Notifications</strong>, covered in <a href="/help/forms/form-settings#notifications">Form settings</a>. The <strong>Weekly digest emails</strong> list at the bottom of <strong>Reports</strong> shows each form that has recipients, and its <strong>Configure</strong> button opens that form's Notifications settings. When no form has recipients, <strong>Set up a digest</strong> opens the first form's.</p><p>Digests need both email and scheduled jobs to be set up for your deployment. <strong>Workspace Settings → Configuration</strong> shows whether they are.</p>$html$,
      '[]',
      110
    ),
    (
      'related-guides',
      null::text,
      'Related guides',
      '',
      '[{"icon":"LayoutDashboard","label":"Project overview","href":"/help/forms/project-overview"},{"icon":"Inbox","label":"Responses","href":"/help/forms/responses"},{"icon":"Share2","label":"Publishing & sharing","href":"/help/forms/sharing"},{"icon":"GitFork","label":"Logic & scoring","href":"/help/forms/logic"},{"icon":"Settings2","label":"Form settings","href":"/help/forms/form-settings"},{"icon":"ListChecks","label":"Field types","href":"/help/forms/fields"}]',
      120
    )
) as v(anchor_id, eyebrow, title, content, links, sort_order)
cross join (select id from public.docs_pages where slug = 'forms/analytics' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Analytics',
    description = 'See how forms perform: views, starts and submissions, where respondents drop off, where they come from, and reports.',
    status = 'draft',
    published_at = null
where slug = 'forms/analytics' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'forms/analytics' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Analytics dashboard</li><li>Funnel and drop-off</li><li>Source and attribution</li><li>A/B testing</li><li>Reports</li><li>Survey reporting</li></ul>',
  10
from public.docs_pages p
where p.slug = 'forms/analytics' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
