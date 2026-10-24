-- Help forms workflow page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the forms/workflow draft outline (from
-- 20261024191600_help_forms_structure) with the full Approvals & automations guide and publishes it.
-- Written from a survey of C:\Pro\geiger-forms (components/internal/screens/forms/forms/sections/workflow.jsx,
-- form_detail.jsx (validate), constants.js (AUTOMATION_ACTIONS), lib/server/side-effects.js (runAutomations,
-- sendApprovalRequest, sendDecision), lib/server/submit.js (initialStatus), app/api/responses/[id]/approve/route.js,
-- app/api/responses/[id]/countersign/route.js, app/api/stripe/webhook/route.js, components/forms/response-detail-panel.jsx,
-- components/forms/response/response-sections.jsx (ApprovalsSection), response-dialogs.jsx (CountersignDialog),
-- print-document.jsx, app/print/response/[id]/page.js, app/print/responses/page.js).
-- Left out on purpose: the "Create Geiger Flow issue" automation action and Escalate to Flow, which can't create an
-- issue today (Forms writes the issue under projects.flow_project_id, which flow.issues' project foreign key rejects).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Approvals & automations',
    description = 'Route responses through approval steps, act on new responses automatically, countersign them and print them as documents.',
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'forms/workflow' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'forms/workflow' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.sort_order
from (
  values
    (
      'setting-up-approvals',
      'Basics',
      'Setting up approvals',
      $html$<p>Approvals make each response wait for one or more people to approve it. To set them up, open the form's settings and go to <strong>Workflow → Approvals</strong>.</p><ol><li>Turn on <strong>Require approval</strong>. A first step called Manager is added for you.</li><li>Give each step a <strong>Step name</strong>, and under <strong>Approvers</strong> type the email addresses of the people who can decide it. Any one of them can decide. Leave it empty to let anyone who can edit forms decide.</li><li>Optional: choose <strong>Add step</strong> for more steps, and use the arrows to put them in order. The trash icon removes a step.</li><li>Choose <strong>Save changes</strong>.</li></ol><p>An approval chain needs at least one step: Forms won't save until it has one.</p>$html$,
      '[]',
      10
    ),
    (
      'how-approvals-work',
      'Concepts',
      'How approval steps work',
      $html$<p>A new response to a form with approvals starts with the status Pending, and the first step's approvers get an email titled "Approval needed" with a <strong>Review response</strong> button. A response that's awaiting payment waits until it's paid, and then its approval starts.</p><ul><li>Each approval moves the response to the next step, and that step's approvers get the same email.</li><li>When the last step approves, the response becomes Approved.</li><li>A rejection at any step closes the chain, and the response becomes Rejected.</li></ul><p>After the final decision, the respondent gets an email saying their response was approved or declined, with any note you added. Approvers named on the step can decide it, and so can anyone whose role can edit forms: Owner, Admin, Manager or Member.</p><p>Pending responses are counted under <strong>Pending approval</strong> on the project overview.</p>$html$,
      '[]',
      20
    ),
    (
      'approving-a-response',
      'Approvals',
      'Approving or rejecting a response',
      $html$<p>To decide on a response, open it in the Response Inbox and choose the <strong>Approvals</strong> tab in its details. A dot on the tab means a decision is waiting.</p><ol><li>Check <strong>Approval chain</strong>: each step with its approvers, with the current step marked.</li><li>Optional: under <strong>Decision</strong>, add a note.</li><li>Choose <strong>Approve</strong> or <strong>Reject</strong>.</li></ol><p><strong>History</strong> lists each decision with who made it, the step and the note. A decided response can't be decided again. Until the form has approvals turned on, the tab says so.</p>$html$,
      '[]',
      30
    ),
    (
      'automations',
      'Workflow',
      'Automations',
      $html$<p>Automations act on each new response that matches your conditions. To add one, open the form's settings, go to <strong>Workflow → Automations</strong> and choose <strong>Add automation</strong>.</p><ol><li>Name the automation. The switch next to the name turns it on or off.</li><li>Under <strong>When</strong>, choose <strong>All match</strong> or <strong>Any matches</strong>, and add conditions with <strong>Condition</strong>: a field, an operator and a value. An automation without conditions runs on every new response.</li><li>Under <strong>Then</strong>, add one or more actions with <strong>Action</strong>.</li><li>Choose <strong>Save changes</strong>.</li></ol><p>The actions are:</p><ul><li><strong>Set status</strong> and <strong>Set priority</strong>. A response awaiting payment keeps that status.</li><li><strong>Add tag</strong>: one tag, or several separated by commas.</li><li><strong>Assign to</strong>: a teammate's email or name. When it matches a member of the project, they get a notification in the bell.</li><li><strong>Send email to</strong>: emails the response's answers and a link to it to the addresses you type.</li><li><strong>Call webhook URL</strong>: sends the response to another tool. See <a href="/help/forms/integrations#webhook-events-and-payloads">Integrations and API</a>.</li></ul><p>The trash icon removes an automation. Each run is recorded in the project's activity log.</p>$html$,
      '[]',
      40
    ),
    (
      'countersigning',
      'Approvals',
      'Countersigning a response',
      $html$<p>A countersignature adds your signature to a response someone signed, such as an agreement. Open the response in the Response Inbox, open the <strong>⋯</strong> menu in its details and choose <strong>Countersign</strong>.</p><ol><li>Draw your signature in the box.</li><li>Type your <strong>Full name</strong>.</li><li>Choose <strong>Countersign</strong>.</li></ol><p>Your signature, name and the time are stamped onto the response and its printed record. Choose <strong>Countersign again</strong> to replace it. Countersigning needs a role that can edit forms.</p><p>To collect the respondent's signature first, add a Signature field (see <a href="/help/forms/fields#files-signatures-and-consent">Field types</a>) and send the form with personal signed links (see <a href="/help/forms/sharing#sending-a-form-by-email">Publishing and sharing</a>).</p>$html$,
      '[]',
      50
    ),
    (
      'document-template',
      'Workflow',
      'Document template',
      $html$<p>A document template turns each response into a formatted document, such as a contract or certificate, when you print it. Open the form's settings, go to <strong>Workflow → Document Template</strong> and turn on <strong>Use a document template</strong>.</p><ul><li><strong>Document title</strong>: the heading, like <code>Agreement: {Full name}</code>.</li><li><strong>Body</strong>: plain text with merge tags such as <code>{Full name}</code>, <code>{score}</code>, <code>{outcome}</code> and <code>{total}</code>. A blank line starts a new paragraph.</li></ul><p>The respondent's signatures and any countersignature are added under the text for you. The document prints as its own page, before the response's full record. Choose <strong>Save changes</strong> to keep it. With the template off, printing gives the full record only.</p>$html$,
      '[]',
      60
    ),
    (
      'printing-responses',
      'Workflow',
      'Printing a response and saving a PDF',
      $html$<p>To print a response or save it as a PDF, open it in the Response Inbox and choose <strong>Print / PDF</strong> in its details. The printable record opens in a new tab, and your browser's print dialog opens once it's ready. Choose to save as PDF there, or use <strong>Print / Save as PDF</strong> at the top of the tab. To print several responses at once, select them in the Response Inbox and choose <strong>Export → Print / PDF</strong>, up to 100 at a time.</p><p>Each printed record has:</p><ul><li>The form's name, the respondent, the response number, when it was submitted and its status.</li><li>The answers the respondent saw. Sensitive answers stay hidden.</li><li>The countersignature, and a receipt or invoice when the response has a payment.</li><li>An <strong>Audit trail</strong>: when it was submitted and edited, its score, priority, outcome and quiz result, browser details, who it was submitted on behalf of, the attestation, policy and consent records, and each approval decision.</li></ul><p>Every print is recorded in the form's access log.</p>$html$,
      '[]',
      70
    ),
    (
      'related-guides',
      null::text,
      'Related guides',
      '',
      '[{"icon":"Inbox","label":"Responses","href":"/help/forms/responses"},{"icon":"Settings2","label":"Form settings","href":"/help/forms/form-settings"},{"icon":"GitFork","label":"Logic & scoring","href":"/help/forms/logic"},{"icon":"CreditCard","label":"Payments","href":"/help/forms/payments"},{"icon":"PlugZap","label":"Integrations & API","href":"/help/forms/integrations"},{"icon":"Share2","label":"Publishing & sharing","href":"/help/forms/sharing"}]',
      80
    )
) as v(anchor_id, eyebrow, title, content, links, sort_order)
cross join (select id from public.docs_pages where slug = 'forms/workflow' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Approvals & automations',
    description = 'Route responses through approval steps, run automations on new responses, and set up a printable document template.',
    status = 'draft',
    published_at = null
where slug = 'forms/workflow' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'forms/workflow' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Approvals</li><li>Automations</li><li>Document template</li><li>Signatures and countersigning</li></ul>',
  10
from public.docs_pages p
where p.slug = 'forms/workflow' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
