-- Help forms responses page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the forms/responses draft outline (from
-- 20261024191600_help_forms_structure) with the full Responses guide and publishes it.
-- Written from a survey of C:\Pro\geiger-forms (components/internal/screens/forms/responses/* (responses_screen,
-- response_workspace, kanban_board, saved_views_bar, bulk_bar, form_responses_screen, constants),
-- components/forms/response-detail-panel.jsx, components/forms/response/* (response-sections, response-dialogs,
-- tags-editor, mention-input, members), components/internal/screens/forms/partials/partials_screen.jsx,
-- lib/forms/export.js, lib/forms/response-utils.js, lib/supabase/responses.js, saved_views.js, lib/server/flow.js
-- (notifyAssignment, notifyMentions), lib/server/submit.js (initialStatus), app/api/responses/* (assign, comments,
-- reveal, request-edit), app/api/cron/retention/route.js, supabase/migrations/20261008155427_lock_down_rls.sql,
-- 20261021105053_retire_unscoped_access.sql, geiger-rbac.config.js).
-- Left out on purpose: Escalate to Flow (creating the Flow issue fails today; see 20261024191609_help_forms_workflow_page).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Responses',
    description = 'Work through responses in the Response Inbox: filter and save views, assign, tag and comment, act in bulk, export, and follow up on unfinished ones.',
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'forms/responses' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'forms/responses' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.sort_order
from (
  values
    (
      'the-response-inbox',
      'Basics',
      'The Response Inbox',
      $html$<p>To see responses, choose <strong>Responses → Response Inbox</strong> in the Forms sidebar. It lists every response to the project's forms, newest first, 25 to a page (switch to 10, 50 or 100 at the bottom). The figures across the top count the <strong>Total</strong>, how many are <strong>Needs review</strong>, <strong>Pending approval</strong> or <strong>Awaiting payment</strong>, and the <strong>Avg score</strong>.</p><p>Each row shows the respondent and their form, the response's status, priority and score, its tags and outcome, who it's assigned to and when it was submitted. Click a row to open the response's details.</p><p><strong>Data Tables & Views</strong>, <strong>Bulk Actions</strong> and <strong>Export & Sync</strong> in the sidebar open the same inbox. Export & Sync adds <strong>CSV</strong>, <strong>JSON</strong> and <strong>Print / PDF</strong> buttons at the top. To see one form's responses with its charts and survey report, choose <strong>Responses</strong> in its row menu in All Forms.</p><p>Seeing responses needs a role with access to them: Owner, Admin, Manager or Member.</p>$html$,
      '[]',
      10
    ),
    (
      'statuses-and-priority',
      'Concepts',
      'Response statuses and priority',
      $html$<p>Every response has a status that says where it stands. Forms sets the first one when the response arrives:</p><ul><li><strong>Awaiting payment</strong>: the form takes payments and checkout isn't finished.</li><li><strong>Pending</strong>: the form has approval steps and the response is waiting on them. It becomes <strong>Approved</strong> or <strong>Rejected</strong> when they're done.</li><li><strong>Needs review</strong>: the response scored High priority, or looks like a duplicate of an earlier one.</li><li><strong>Complete</strong>: everything else, unless a branch of the form's logic sets another status.</li></ul><p>You can also set <strong>In progress</strong> while you work on a response, or <strong>Spam</strong> to set it aside. Analytics leaves Spam responses out of its counts.</p><p>Priority is <strong>High</strong>, <strong>Medium</strong> or <strong>Low</strong>. Forms sets it from the response's score when the form scores responses, and it's Low otherwise. Changing a response's status, priority or tags needs a role that can edit forms. The <a href="/help/forms/logic#scoring-responses">Logic and scoring</a> guide covers scores and branches.</p>$html$,
      '[]',
      20
    ),
    (
      'filtering-and-sorting',
      'Responses',
      'Filtering, searching and sorting',
      $html$<p>The toolbar at the top of the Response Inbox narrows what it shows:</p><ul><li>The form menu: <strong>All forms</strong> (the default) or one form.</li><li>The status menu: <strong>All statuses</strong> or one status.</li><li><strong>More filters</strong>: <strong>Priority</strong>, <strong>Tag</strong>, <strong>Assignee</strong> (including <strong>Assigned to me</strong> and <strong>Unassigned</strong>), <strong>Outcome</strong>, and a <strong>From</strong> and <strong>To</strong> date. A badge counts the ones in use.</li><li>The sort menu: <strong>Newest first</strong> (the default), <strong>Oldest first</strong>, <strong>Highest score</strong> or <strong>Highest priority</strong>. Ties go newest first.</li><li>The search box matches names, emails, form names, assignees, outcomes, tags and answers. Sensitive answers aren't searched.</li></ul><p><strong>Clear</strong> resets the filters and search. When nothing matches, the inbox says so and offers <strong>Clear filters</strong>.</p>$html$,
      '[]',
      30
    ),
    (
      'table-and-kanban',
      'Responses',
      'Table and kanban layouts',
      $html$<p>Switch the Response Inbox between <strong>Table</strong> and <strong>Kanban</strong> with the tabs at the top right.</p><ul><li><strong>Table</strong> shows a row per response. On one form's responses, it also shows the answers to the form's first three questions, with sensitive answers masked.</li><li><strong>Kanban</strong> shows a column for each status. Drag a card to another column to change its status. The person at the bottom of a card is its assignee: click it to reassign the response, if your role can edit forms. Click the rest of the card to open the response.</li></ul><p>Filters, search and sort apply to both layouts.</p>$html$,
      '[]',
      40
    ),
    (
      'saved-views',
      'Responses',
      'Saved views',
      $html$<p>A saved view keeps a set of filters, a sort and a layout so you can come back to them. To save one, set up the inbox the way you want it, choose the bookmark icon (<strong>Save filters & layout</strong>), type a name, then choose <strong>Save</strong>.</p><p>The views menu at the left of the toolbar switches between <strong>All responses</strong>, <strong>Assigned to me</strong> and your saved views. Changing a filter afterward leaves the view, without changing it. To delete a saved view, hover over it in the menu and choose the × beside it.</p><p>Saved views belong to the project, or to one form when you save them from that form's responses, so everyone who can see responses there sees them. Deleting one deletes it for everyone.</p>$html$,
      '[]',
      50
    ),
    (
      'response-details',
      'Responses',
      'Response details',
      $html$<p>Click a response to open its details beside the inbox. The top shows the respondent's name and email, the form, when it arrived and the response number, then the response's <strong>Status</strong>, <strong>Priority</strong> (with its score), <strong>Assignee</strong>, <strong>Tags</strong> and <strong>Outcome</strong>. Changes here save straight away.</p><p>The tabs hold everything else:</p><ul><li><strong>Answers</strong>: each answer the respondent saw, under the form's section headings, and any countersignature.</li><li><strong>Activity</strong>: a timeline of the submission, changes made to it and your team's comments.</li><li><strong>Approvals</strong>: the approval chain and decisions. See <a href="/help/forms/workflow#approving-a-response">Approvals and automations</a>.</li><li><strong>Payment</strong>: the payment and order. See <a href="/help/forms/payments#payment-status">Payments</a>.</li><li><strong>Details</strong>: when it was submitted and edited, completion time, score, quiz result, outcome and A/B variant; its source, such as device, browser, referrer and UTM tags; and declarations such as an attestation or policy acknowledgement.</li><li><strong>Access</strong>: who viewed, revealed, exported or printed this response, and when.</li></ul><p>The buttons under the properties are <strong>Print / PDF</strong> (see <a href="/help/forms/workflow#printing-responses">Approvals and automations</a>) and <strong>Request edit</strong>. The <strong>⋯</strong> menu has <strong>Countersign</strong>, <strong>Copy as CSV row</strong> and <strong>Delete response</strong>. Opening a response is recorded in its access log.</p>$html$,
      '[]',
      60
    ),
    (
      'assigning-and-tagging',
      'Responses',
      'Assigning and tagging',
      $html$<p>To assign a response, choose its <strong>Assignee</strong> in its details, then pick a member of the project, or unassign it. The person you assign gets a notification in the bell at the top of Forms, unless you assign yourself. Assigning needs a role that can edit forms. Kanban cards and bulk actions assign too.</p><p>To tag a response, type in <strong>Tags</strong> in its details and press <code>Enter</code>. Forms suggests tags already used in the project. Remove a tag with the × beside it. Tags show in the inbox, can be filtered on and appear in exports.</p>$html$,
      '[]',
      70
    ),
    (
      'commenting',
      'Responses',
      'Commenting on a response',
      $html$<p>Comments are internal notes on a response for your team. Respondents never see them. To comment, open the response's <strong>Activity</strong> tab, write in the box at the bottom and press <code>Enter</code> or choose the send button. A comment can be up to 5,000 characters.</p><p>Type <code>@</code> and start a name to mention a teammate, and pick them from the list. Each person you mention gets a notification in the bell at the top of Forms. Comments appear in the timeline with the other activity, oldest first.</p><p>Commenting needs a role with access to responses. To see comments across every form, use <strong>Collaboration → Response Comments</strong>, covered in <a href="/help/forms/collaboration#response-comments">Collaboration</a>.</p>$html$,
      '[]',
      80
    ),
    (
      'sensitive-answers',
      'Responses',
      'Revealing sensitive answers',
      $html$<p>Answers to fields marked as sensitive are encrypted when they're stored and masked wherever they appear: in the inbox, in search, in exports (as [encrypted]) and in printed records. To read one, open the response's <strong>Answers</strong> tab and reveal it there.</p><p>Every reveal is recorded with who did it and which field, in the response's <strong>Access</strong> tab and in the form's access log. Revealing needs a role with access to responses. The <a href="/help/forms/builder#advanced-field-settings">Form builder</a> guide covers marking a field as sensitive.</p>$html$,
      '[]',
      90
    ),
    (
      'requesting-an-edit',
      'Responses',
      'Asking a respondent to edit their response',
      $html$<p>To let a respondent change their answers, open the response's details and choose <strong>Request edit</strong>.</p><ol><li>Optional: write a <strong>Message</strong> for the email.</li><li>Under <strong>Link expires after</strong>, choose <strong>24 hours</strong>, <strong>3 days</strong>, <strong>7 days</strong> (the default) or <strong>30 days</strong>.</li><li>Choose <strong>Send edit link</strong>, or <strong>Create edit link</strong> when the response has no email.</li></ol><p>When the response has an email and email is set up for your deployment, Forms emails the respondent a private link, and replies come back to you. Either way, the dialog shows the link to copy. The respondent's changes update the same response. Approved, Rejected and Spam responses can't be edited, and requesting an edit needs a role that can edit forms.</p>$html$,
      '[]',
      100
    ),
    (
      'bulk-actions',
      'Responses',
      'Bulk actions',
      $html$<p>To act on many responses at once, select them with the checkboxes in the table. The checkbox in the header selects the whole page, and <strong>Select all</strong> in the bar that appears selects every response that matches your filters.</p><p>The bar then offers:</p><ul><li><strong>Status</strong> and <strong>Priority</strong>: set one for all of them.</li><li><strong>Tags</strong>: type a tag, then <strong>Add tag</strong> or <strong>Remove tag</strong>. Other tags are left alone.</li><li><strong>Assign</strong>: assign them all to one member, for roles that can edit forms.</li><li><strong>Export</strong>: <strong>CSV (Excel-ready)</strong>, <strong>JSON</strong> or <strong>Print / PDF</strong>, for roles that can export.</li><li>The delete button, for roles that can delete responses.</li></ul>$html$,
      '[]',
      110
    ),
    (
      'exporting-responses',
      'Responses',
      'Exporting responses',
      $html$<p>To download responses, choose <strong>Export</strong> in the Response Inbox toolbar, then <strong>CSV (Excel-ready)</strong>, <strong>JSON</strong> or <strong>Print / PDF</strong>. The export covers the responses in the current view, with your filters applied. Print / PDF takes up to 100 responses.</p><ul><li>The CSV has a row per response, starting with Response ID, Form, Respondent, Email, Status, Priority, Score, Outcome, Tags, Assignee, Submitted at and the payment columns, then a column per question. Names, addresses and matrix rows are split into separate columns, and a consent answer adds when it was agreed and a fingerprint of the wording.</li><li>The JSON has each response's raw answers and answers labelled by question.</li></ul><p>Sensitive answers export as [encrypted]. Cells that start with <code>=</code>, <code>+</code>, <code>-</code> or <code>@</code> get a leading apostrophe so spreadsheets don't run them as formulas. Every export is recorded in the access log. Exporting needs a role that can export responses: Owner, Admin, Manager or Member. In a response's details, <strong>Copy as CSV row</strong> in the <strong>⋯</strong> menu copies one response.</p>$html$,
      '[]',
      120
    ),
    (
      'deleting-responses',
      'Responses',
      'Deleting responses',
      $html$<p>To delete a response, choose <strong>Delete</strong> in its row menu, <strong>Delete response</strong> in the <strong>⋯</strong> menu of its details, or select several and use the delete button in the bulk bar. Forms asks you to confirm first.</p><p>Deleted responses leave the inbox, and they can't be restored from Forms. Exports you already downloaded keep them. Only the Owner and Admin roles can delete responses.</p><p>To delete everything one person submitted, across every form, use the right to erasure: see <a href="/help/forms/security#erasing-a-respondents-data">Security and compliance</a>.</p>$html$,
      '[]',
      130
    ),
    (
      'partial-and-abandoned',
      'Responses',
      'Partial and abandoned responses',
      $html$<p><strong>Responses → Partial / Abandoned</strong> lists respondents who started a form and haven't submitted it. Forms saves their progress as they go, unless the form asks them to opt in first and they haven't. Each row shows the form, the respondent's email (or Anonymous), how far they got, the last field they touched, the page they were on, the session's state and when it was last updated.</p><ul><li><strong>In progress</strong>: active in the last 30 minutes.</li><li><strong>Abandoned</strong>: no activity for 30 minutes or more.</li><li><strong>Submitted</strong>: the respondent came back and finished.</li></ul><p>The figures across the top show the counts, the share later submitted (<strong>Recovered</strong>) and the average progress of unfinished sessions. Filter by form and state, or search by email or form name. Resume links stay private to respondents and never show here. <strong>Save & Resume settings</strong> opens the form's save and resume settings, covered in <a href="/help/forms/form-settings#save-and-resume">Form settings</a>.</p>$html$,
      '[]',
      140
    ),
    (
      'related-guides',
      null::text,
      'Related guides',
      '',
      '[{"icon":"ClipboardCheck","label":"Approvals & automations","href":"/help/forms/workflow"},{"icon":"ChartColumn","label":"Analytics","href":"/help/forms/analytics"},{"icon":"Users","label":"Collaboration","href":"/help/forms/collaboration"},{"icon":"ShieldCheck","label":"Security & compliance","href":"/help/forms/security"},{"icon":"CreditCard","label":"Payments","href":"/help/forms/payments"},{"icon":"PlugZap","label":"Integrations & API","href":"/help/forms/integrations"}]',
      150
    )
) as v(anchor_id, eyebrow, title, content, links, sort_order)
cross join (select id from public.docs_pages where slug = 'forms/responses' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Responses',
    description = 'Review responses in the Response Inbox: filter, sort and save views, assign and tag them, act in bulk, and export.',
    status = 'draft',
    published_at = null
where slug = 'forms/responses' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'forms/responses' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>The Response Inbox</li><li>Table and board layouts</li><li>Saved views</li><li>Response details</li><li>Bulk actions</li><li>Export and sync</li><li>Partial and abandoned responses</li></ul>',
  10
from public.docs_pages p
where p.slug = 'forms/responses' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
