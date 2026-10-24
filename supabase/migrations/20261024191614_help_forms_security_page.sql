-- Help forms security page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the forms/security draft outline (from
-- 20261024191600_help_forms_structure) with the full Security & compliance guide and publishes it.
-- Written from a survey of C:\Pro\geiger-forms (components/internal/screens/forms/security/* (spam_screen,
-- retention_screen, hipaa_screen, security_shared), roles/roles_screen.jsx (access focus), forms/sections/access.jsx,
-- forms/sections/security.jsx, settings/settings_screen.jsx (EraseCard), app/api/workspace/erase/route.js,
-- app/api/workspace/export/route.js, lib/server/respondent.js, app/api/cron/retention/route.js,
-- supabase/migrations/20261008155426_platform_expansion.sql (purge_expired_responses), lib/server/submit.js (honeypot,
-- captcha, rate limit, duplicates, anonymous), lib/server/crypto.js, vercel.json, geiger-rbac.config.js).
-- Left out on purpose: the Data residency card (hosting internals) and the screen's claim that anonymous forms skip the
-- respondent's email (an email typed into an Email field is still stored).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Security & compliance',
    description = 'Keep spam out, keep responses only as long as you need, answer GDPR access and erasure requests, and check your HIPAA safeguards.',
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'forms/security' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'forms/security' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.sort_order
from (
  values
    (
      'where-security-settings-live',
      'Basics',
      'Where security settings live',
      $html$<p>Forms keeps security settings in two places.</p><ul><li><strong>Each form's settings</strong>: <strong>Access & Sharing</strong> sets who can respond, spam protection, anonymous responses and how long responses are kept, and <strong>Security & Compliance</strong> shows the form's sensitive fields and access log. See <a href="/help/forms/form-settings">Form settings</a>.</li><li><strong>Project-wide screens</strong>: <strong>Security & Compliance</strong> in the Forms sidebar holds <strong>Spam & Abuse</strong>, <strong>Data Protection & GDPR</strong>, <strong>Access Control</strong> and <strong>HIPAA Readiness</strong>. <strong>Responses → Retention & GDPR</strong> opens the same screen as Data Protection & GDPR.</li></ul><p>The project-wide screens show every form's settings side by side, and their <strong>Configure</strong> buttons open the matching section of a form's settings.</p>$html$,
      '[]',
      10
    ),
    (
      'spam-and-abuse',
      'Security',
      'Spam and abuse',
      $html$<p><strong>Security & Compliance → Spam & Abuse</strong> lists every form with its protections: whether the honeypot and captcha are on, its rate limit, whether it flags or blocks duplicates (and over how many days), and how many of its responses are marked Spam. The figures across the top count the forms using each protection and the share of responses flagged as spam. <strong>Review responses</strong> opens the Response Inbox.</p><ul><li><strong>Honeypot</strong>: a hidden field that bots fill in and people never see. Forms quietly drops those submissions. It's on for new forms.</li><li><strong>Captcha</strong>: a check respondents pass before submitting. It only works when captcha is set up for your deployment.</li><li><strong>Rate limit</strong>: the most submissions per hour from one network. Past it, respondents are asked to try again later.</li><li><strong>Duplicate detection</strong>: flags a repeat response as Needs review, or blocks it.</li></ul><p>Forms doesn't mark responses as Spam on its own: you do, in the Response Inbox or with an automation. Analytics leaves Spam responses out. To change a form's protections, choose <strong>Configure</strong> in its row.</p>$html$,
      '[]',
      20
    ),
    (
      'retention',
      'Security',
      'Keeping responses only as long as you need',
      $html$<p>A retention period deletes a form's responses once they're older than a number of days. Set it for every form on <strong>Security & Compliance → Data Protection & GDPR</strong>, under <strong>Retention by form</strong>: type a whole number of days in a form's row, then press <code>Enter</code> or click away. It saves straight away. Leave it empty to keep responses until someone deletes them. Changing it needs a role that can edit forms.</p><p>Once a day, Forms permanently deletes responses and saved partials older than each form's period, along with their uploaded files. This needs scheduled jobs set up for your deployment.</p><p>The figures across the top count the forms with a retention period, the shortest one and the forms that are anonymous or have sensitive fields. Each row also shows the form's privacy settings, such as <strong>Anonymous</strong>, <strong>Sensitive fields</strong> or <strong>Policy ack</strong>. New forms can start with a retention period from <a href="/help/forms/settings#new-form-defaults">Workspace settings</a>.</p>$html$,
      '[]',
      30
    ),
    (
      'exporting-a-respondents-data',
      'Security',
      'Exporting a respondent''s data',
      $html$<p>To answer a request to see someone's data (GDPR right of access), go to <strong>Security & Compliance → Data Protection & GDPR</strong> and find <strong>Right of access</strong>. Type the <strong>Respondent email</strong> and choose <strong>Export data</strong>.</p><p>Forms downloads a JSON file with everything held about that email address, across every form you can export responses from, in any of your projects:</p><ul><li>Their responses, with sensitive answers readable</li><li>Their saved partial responses and bookings</li><li>Their payments</li><li>Links to their uploaded files, which stop working after an hour</li><li>Your team's comments on their responses</li></ul><p>Forms finds data by the email address given with each response, so responses without an email can't be found. If nothing matches, it says "No data found". Exporting needs the Export responses permission, and each export is recorded in the activity log.</p>$html$,
      '[]',
      40
    ),
    (
      'erasing-a-respondents-data',
      'Security',
      'Erasing a respondent''s data',
      $html$<p>To answer a request to delete someone's data (GDPR right to erasure), go to <strong>Security & Compliance → Data Protection & GDPR</strong> and find <strong>Right to erasure</strong>.</p><ol><li>Type the <strong>Respondent email</strong>.</li><li>Choose <strong>Erase data</strong>.</li><li>Read the warning, then choose <strong>Erase permanently</strong>.</li></ol><p>Forms deletes every response, saved partial, booking and uploaded file submitted with that email address, across every form you can delete responses from. This can't be undone. Forms then says how many responses and partials it erased, and records the erasure in the activity log without the email address itself.</p><p>Erasing needs the Delete responses permission: Owner or Admin. The same tool is under <strong>Right to erasure (GDPR)</strong> in Workspace Settings.</p>$html$,
      '[]',
      50
    ),
    (
      'anonymous-responses',
      'Concepts',
      'Anonymous responses',
      $html$<p>An anonymous form doesn't store the respondent's IP hash, browser details or signed-in account with their response. Turn it on per form with <strong>Anonymous responses</strong> under <strong>Access & Sharing</strong> in the form's settings, or for every new form with <strong>Anonymous by default</strong> in Workspace Settings.</p><p>Anything respondents type into the form itself, such as an email address in an Email field, is still saved as an answer. To keep a form truly anonymous, don't ask for identifying details.</p>$html$,
      '[]',
      60
    ),
    (
      'access-control',
      'Security',
      'Access control',
      $html$<p><strong>Security & Compliance → Access Control</strong> opens the project's roles and members, the same screen as <strong>Collaboration → Roles & Permissions</strong>. Use it to give each person the least access they need. The <a href="/help/forms/collaboration#roles">Collaboration</a> guide covers roles and permissions.</p><p>Sign-in, single sign-on and passkeys aren't set in Forms: they come from your Geiger account and your organization's settings. Who can open and submit a form is set per form under <strong>Access & Sharing</strong>: anyone with the link, a password, signed-in accounts, one email domain or signed links only.</p>$html$,
      '[]',
      70
    ),
    (
      'hipaa-readiness',
      'Security',
      'HIPAA readiness',
      $html$<p><strong>Security & Compliance → HIPAA Readiness</strong> helps you check the safeguards around forms that collect protected health information. It lists every form with fields marked sensitive, with how many it has, its access setting, its retention period (or Forever) and whether its email alerts send answers. The figures across the top count those forms, their sensitive fields, how many delete responses automatically and how many need sign-in. <strong>Configure</strong> opens a form's <strong>Security & Compliance</strong> settings, and <strong>Access log</strong> opens Activity & Audit.</p><p>The <strong>Safeguards checklist</strong> marks what's in place:</p><ul><li><strong>Field-level encryption</strong>: whether encryption is set up for your deployment.</li><li><strong>Masking & reveal logging</strong>: sensitive answers are masked, and revealing, exporting or printing them is logged.</li><li><strong>Retention limits</strong>: whether every form with sensitive fields has a retention period.</li><li><strong>Least-privilege access</strong>: limit who can view, export or delete responses with roles.</li><li><strong>Keep PHI out of email</strong>: whether those forms send team alert emails.</li></ul><p>Forms provides these controls but isn't a certified product. Compliance also depends on Business Associate Agreements with your hosting and email providers, and on your own processes.</p>$html$,
      '[]',
      80
    ),
    (
      'related-guides',
      null::text,
      'Related guides',
      '',
      '[{"icon":"Settings2","label":"Form settings","href":"/help/forms/form-settings"},{"icon":"Users","label":"Collaboration","href":"/help/forms/collaboration"},{"icon":"Inbox","label":"Responses","href":"/help/forms/responses"},{"icon":"Settings","label":"Workspace settings","href":"/help/forms/settings"},{"icon":"PencilRuler","label":"Form builder","href":"/help/forms/builder"},{"icon":"PlugZap","label":"Integrations & API","href":"/help/forms/integrations"}]',
      90
    )
) as v(anchor_id, eyebrow, title, content, links, sort_order)
cross join (select id from public.docs_pages where slug = 'forms/security' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Security & compliance',
    description = 'Block spam, control who sees response data, keep responses only as long as you need, and handle GDPR requests.',
    status = 'draft',
    published_at = null
where slug = 'forms/security' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'forms/security' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Spam and abuse</li><li>Access control</li><li>Retention</li><li>GDPR requests</li><li>HIPAA readiness</li></ul>',
  10
from public.docs_pages p
where p.slug = 'forms/security' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
