-- Help forms project overview page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the forms/project-overview draft outline
-- (from 20261024191600_help_forms_structure) with the full guide to Forms' Overview screen and publishes it.
-- Written from a survey of C:\Pro\geiger-forms (components/internal/screens/forms/overview/overview_screen.jsx,
-- components/forms/filler/form-runner.jsx, lib/forms/draft.js, lib/supabase/responses.js, lib/server/submit.js,
-- app/api/public/forms/[slug]/event/route.js, lib/workspace/views.js).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Project overview',
    description = 'See how your forms are doing: new responses, views and completion, weekly trends, your top forms, and the work waiting on your team.',
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'forms/project-overview' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'forms/project-overview' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.sort_order
from (
  values
    (
      'opening-the-overview',
      'Basics',
      'Opening the project overview',
      $html$<p><strong>Overview</strong> is the first entry in the Forms sidebar, and the screen a project opens on in Forms. Its heading reads <strong>Forms Overview</strong>. It sums up every form in the project and is read-only: you change forms and responses on their own screens. The figures load each time you open the screen.</p><p>Beside the heading, three counts cover the whole project: <strong>Forms</strong> (every form that isn't archived), <strong>Live</strong> (published forms) and <strong>Responses</strong> (every response the project's forms have received).</p><p>If the data can't load, Forms shows "Couldn't load the overview data." and the screen stays at zero. Reload the page to try again.</p>$html$,
      '[]',
      10
    ),
    (
      'views-starts-submissions',
      'Concepts',
      'Views, starts and submissions',
      $html$<p>Forms counts three steps for every published form. A <strong>view</strong> is recorded the first time someone opens the form's public link in a browser tab. A <strong>start</strong> is recorded when they answer their first field. A <strong>submission</strong> is recorded when the response is saved. Reloading the form in the same tab doesn't add another view or start.</p><p>The <strong>completion rate</strong> is submissions divided by starts. A response's <strong>completion time</strong> runs from the moment the form's fields appear to the moment the respondent submits.</p><p>Each part of the overview covers its own window:</p><ul><li>The headline figures cover the last 30 days and compare them with the 30 days before.</li><li>Responses Over Time, Completion Funnel and Completion Rate cover the last 12 weeks, in weeks that start on Monday.</li><li>Top Performing Forms covers the last 30 days.</li><li>Response Status Mix and Resolution Rate cover every response, whatever its date.</li></ul>$html$,
      '[]',
      20
    ),
    (
      'headline-figures',
      'Overview',
      'Headline figures',
      $html$<p>Four figures run across the top of the project overview:</p><ul><li><strong>New Responses</strong>: responses submitted in the last 30 days.</li><li><strong>Form Views</strong>: views in the last 30 days.</li><li><strong>Completion Rate</strong>: submissions divided by starts in the last 30 days.</li><li><strong>Avg. Completion Time</strong>: the average completion time of the responses submitted in the last 30 days.</li></ul><p>The first three also show how much they changed from the 30 days before, as a percentage marked <strong>VS Last Period</strong>. When the 30 days before had nothing to compare with, no change is shown.</p>$html$,
      '[]',
      30
    ),
    (
      'responses-over-time',
      'Overview',
      'Responses over time and status mix',
      $html$<p><strong>Responses Over Time</strong> plots a weekly total for each of the last 12 weeks. Its menus switch the measure between <strong>Submissions</strong> (the default), <strong>Starts</strong> and <strong>Views</strong>, and narrow the chart to the forms you pick. The form menu starts at <strong>All Forms</strong>: select one or more forms to show only them, or choose <strong>All Forms</strong> again to include every form. Until a form has a view, start or submission, the chart shows No activity yet.</p><p><strong>Response Status Mix</strong> groups every response in the project by status, such as Complete, Needs review or Spam. Pick a status from its menu to see how many responses have it and their share of the total, for example "12 of 40 responses are complete". Until the project has a response, it shows No responses yet.</p>$html$,
      '[]',
      40
    ),
    (
      'completion-funnel-and-rates',
      'Overview',
      'Completion funnel and rates',
      $html$<p>Three charts on the project overview show how far respondents get.</p><ul><li><strong>Completion Funnel</strong>: views, starts and submissions across every form in the last 12 weeks, each as a share of views. The figure at its top right is the share of views that ended in a submission (<strong>view → submit</strong>).</li><li><strong>Completion Rate</strong>: the share of starts in the last 12 weeks that were submitted, with the counts under it, like "8 of 10 Starts Submitted".</li><li><strong>Resolution Rate</strong>: the share of all responses that are handled, meaning their status is Complete, Approved, Rejected or Spam.</li></ul><p>Completion Rate and Resolution Rate each have a form menu that narrows them to the forms you pick. Resolution Rate counts every response, whatever its date.</p>$html$,
      '[]',
      50
    ),
    (
      'top-performing-forms',
      'Overview',
      'Top performing forms',
      $html$<p><strong>Top Performing Forms</strong> ranks up to five forms that aren't archived. Its sort menu ranks them by <strong>Responses</strong> (the default: responses in the last 30 days, then all-time responses) or <strong>Completion</strong> (the share of starts in the last 30 days that were submitted). Its form menu narrows the ranking to the forms you pick.</p><p>Each row shows the form's name and all-time responses, its status, its completion (or No starts yet), <strong>Responses (30d)</strong> and its momentum:</p><ul><li><strong>Rising</strong>: more responses in the last 7 days than in the 7 days before.</li><li><strong>Steady</strong>: at least one response in the last 7 days, but no more than the week before.</li><li><strong>Quiet</strong>: no responses in the last 7 days.</li><li><strong>Not live</strong>: the form isn't published.</li></ul><p>The arrow at the end of a row opens the form's settings.</p>$html$,
      '[]',
      60
    ),
    (
      'work-waiting',
      'Overview',
      'Work waiting on your team',
      $html$<p><strong>Overall Stats</strong>, at the bottom of the project overview, counts the work waiting across your forms. Each item shows a count and an urgency badge, and the items run from Urgent to Soon to Routine.</p><ul><li><strong>Responses to review</strong> (Urgent): responses with the status Needs review.</li><li><strong>Pending approval</strong> (Urgent): responses waiting on an approver, or with the status Pending.</li><li><strong>Awaiting payment</strong> (Soon): responses whose checkout wasn't completed.</li><li><strong>Closing this week</strong> (Soon): published forms whose close date falls between yesterday and seven days from now.</li><li><strong>Near response limit</strong> (Soon): published forms that have reached 90% of their response limit.</li><li><strong>Marked as spam</strong> (Routine): responses with the status Spam.</li><li><strong>Unpublished drafts</strong> (Routine): forms that are still drafts.</li></ul><p>Click an item to act on it. Response items open the <strong>Response Inbox</strong>, and form items open <strong>All Forms</strong>. When exactly one form is closing this week or near its limit, the item opens that form's <strong>Submission Rules</strong> settings instead.</p>$html$,
      '[]',
      70
    ),
    (
      'related-guides',
      null::text,
      'Related guides',
      '',
      '[{"icon":"ChartColumn","label":"Analytics","href":"/help/forms/analytics"},{"icon":"Inbox","label":"Responses","href":"/help/forms/responses"},{"icon":"FileText","label":"All forms","href":"/help/forms/all-forms"},{"icon":"Settings2","label":"Form settings","href":"/help/forms/form-settings"},{"icon":"Share2","label":"Publishing & sharing","href":"/help/forms/sharing"},{"icon":"ClipboardCheck","label":"Approvals & automations","href":"/help/forms/workflow"}]',
      80
    )
) as v(anchor_id, eyebrow, title, content, links, sort_order)
cross join (select id from public.docs_pages where slug = 'forms/project-overview' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Project overview',
    description = 'The home screen of Forms: response and completion figures, charts across your forms, and the work waiting for your team.',
    status = 'draft',
    published_at = null
where slug = 'forms/project-overview' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'forms/project-overview' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Headline figures</li><li>Responses over time</li><li>Response status mix and completion funnel</li><li>Top performing forms</li><li>Work waiting for your team</li></ul>',
  10
from public.docs_pages p
where p.slug = 'forms/project-overview' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
