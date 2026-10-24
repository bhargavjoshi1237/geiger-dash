-- Help forms structure
--
-- One-time content move, like 20261023200049_help_flow_guide: graduates Forms into its own sidebar group (sort 33).
-- The products/forms draft is re-homed as the Forms Overview (slug forms, still a draft; 20261024191620 writes and
-- publishes it), and each area of Forms' sidebar and form settings starts as a draft outline. The page migrations
-- that follow (20261024191601 to 20261024191616) fill each page in. Forms isn't in SANDBOX_APP_IDS, so no preview.
-- Written from a survey of C:\Pro\geiger-forms (components/internal/sidebar/sidebar_nav.js,
-- components/forms/forms-workspace.jsx, components/internal/screens/forms/forms/form_sections.jsx).
-- Later edits happen in Studio, so this must never re-run.

-- @up
insert into public.docs_nav_groups (title, slug, sort_order)
values ('Forms', 'forms', 33)
on conflict (slug) do update set
  title = excluded.title,
  sort_order = excluded.sort_order;

-- Forms Overview: re-home the products/forms draft, or create it on a database that never had one.
update public.docs_pages
set nav_group_id = (select id from public.docs_nav_groups where slug = 'forms'),
    slug = 'forms',
    title = 'Geiger Forms',
    nav_label = 'Overview',
    preview = null,
    sort_order = 10
where slug = 'products/forms' and deleted_at is null;

insert into public.docs_pages (nav_group_id, slug, title, nav_label, description, status, sort_order)
select g.id, 'forms', 'Geiger Forms', 'Overview', 'Intake and feedback.', 'draft', 10
from public.docs_nav_groups g
where g.slug = 'forms'
on conflict (slug) where deleted_at is null do nothing;

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>What Geiger Forms is for</li><li>Opening it from a project</li><li>Key concepts</li><li>Common workflows</li></ul>',
  10
from public.docs_pages p
where p.slug = 'forms' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;

-- Forms' areas, in the order of its sidebar and form settings: drafts with a writing outline.
insert into public.docs_pages (nav_group_id, slug, title, description, status, sort_order)
select g.id, v.slug, v.title, v.description, 'draft', v.sort_order
from (
  values
    ('forms/project-overview', 'Project overview', 'The home screen of Forms: response and completion figures, charts across your forms, and the work waiting for your team.', 20),
    ('forms/all-forms', 'All forms', 'Create forms, find them by status, folder or tag, and publish, duplicate, archive or delete them.', 30),
    ('forms/builder', 'Form builder', 'Build a form on the canvas: add and arrange fields, split it into pages, preview it, and publish it.', 40),
    ('forms/fields', 'Field types', 'Every field you can add to a form, from short text and choices to ratings, file uploads, signatures and layout blocks.', 50),
    ('forms/logic', 'Logic & scoring', 'Show fields only when they apply, skip pages, calculate values, score answers, and send respondents to different endings.', 60),
    ('forms/form-settings', 'Form settings', 'Change a form''s details, design, pages, submission rules, notifications and access from its settings.', 70),
    ('forms/sharing', 'Publishing & sharing', 'Publish a form, then share its link or QR code, embed it on your site, or send personal links and email invites.', 80),
    ('forms/payments', 'Payments', 'Take one-off or recurring payments with Stripe, build an order from products and quantities, and offer coupon codes.', 90),
    ('forms/workflow', 'Approvals & automations', 'Route responses through approval steps, run automations on new responses, and set up a printable document template.', 100),
    ('forms/responses', 'Responses', 'Review responses in the Response Inbox: filter, sort and save views, assign and tag them, act in bulk, and export.', 110),
    ('forms/analytics', 'Analytics', 'See how forms perform: views, starts and submissions, where respondents drop off, where they come from, and reports.', 120),
    ('forms/integrations', 'Integrations & API', 'Send responses to other tools with webhooks, Slack, Geiger Flow and Assets, and work with forms through the REST API.', 130),
    ('forms/collaboration', 'Collaboration', 'Invite teammates, give them roles, comment on responses, and see who changed what in the activity log.', 140),
    ('forms/security', 'Security & compliance', 'Block spam, control who sees response data, keep responses only as long as you need, and handle GDPR requests.', 150),
    ('forms/templates', 'Templates', 'Start a form from the template gallery, or save your own forms as templates for your team to reuse.', 160),
    ('forms/settings', 'Workspace settings', 'Set defaults for new forms in the project, along with branding, notifications, embedding and API access.', 170)
) as v(slug, title, description, sort_order)
cross join (select id from public.docs_nav_groups where slug = 'forms') g
on conflict (slug) where deleted_at is null do nothing;

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview', '<p><em>Draft outline. Replace before publishing.</em></p><ul>' || v.outline || '</ul>', 10
from (
  values
    ('forms/project-overview', '<li>Headline figures</li><li>Responses over time</li><li>Response status mix and completion funnel</li><li>Top performing forms</li><li>Work waiting for your team</li>'),
    ('forms/all-forms', '<li>Creating a form</li><li>Form statuses</li><li>The forms list</li><li>Row actions</li><li>Folders</li><li>Archived forms</li>'),
    ('forms/builder', '<li>Opening the builder</li><li>Adding and arranging fields</li><li>Field settings</li><li>Pages</li><li>Preview</li><li>Autosave and version history</li><li>Live presence</li><li>Publishing from the builder</li>'),
    ('forms/fields', '<li>Basic fields</li><li>Choice fields</li><li>Date and time</li><li>Survey fields</li><li>Contact fields</li><li>Advanced fields</li><li>Payment fields</li><li>Layout blocks</li>'),
    ('forms/logic', '<li>Conditions</li><li>Page skip logic</li><li>Calculated fields</li><li>Branches and outcomes</li><li>Auto-triage and quizzes</li><li>Answer recall</li><li>Validation rules</li>'),
    ('forms/form-settings', '<li>Opening and saving form settings</li><li>Details</li><li>Themes and colors</li><li>Welcome and ending screens</li><li>Branding and language</li><li>Multi-step pages</li><li>Save and resume</li><li>Submission rules</li><li>Notifications</li><li>Access</li><li>Security and compliance</li>'),
    ('forms/sharing', '<li>Publishing a form</li><li>The public link</li><li>Embedding a form</li><li>QR code</li><li>Signed links and email invites</li>'),
    ('forms/payments', '<li>Turning on payments</li><li>Order builder</li><li>Coupons</li><li>Payment status on responses</li><li>Receipts and invoices</li>'),
    ('forms/workflow', '<li>Approvals</li><li>Automations</li><li>Document template</li><li>Signatures and countersigning</li>'),
    ('forms/responses', '<li>The Response Inbox</li><li>Table and board layouts</li><li>Saved views</li><li>Response details</li><li>Bulk actions</li><li>Export and sync</li><li>Partial and abandoned responses</li>'),
    ('forms/analytics', '<li>Analytics dashboard</li><li>Funnel and drop-off</li><li>Source and attribution</li><li>A/B testing</li><li>Reports</li><li>Survey reporting</li>'),
    ('forms/integrations', '<li>Per-form integrations</li><li>Webhooks and deliveries</li><li>API keys</li><li>REST API</li><li>Hooks and events</li>'),
    ('forms/collaboration', '<li>Inviting teammates</li><li>Roles and permissions</li><li>Response comments</li><li>Activity and audit</li><li>Live presence</li>'),
    ('forms/security', '<li>Spam and abuse</li><li>Access control</li><li>Retention</li><li>GDPR requests</li><li>HIPAA readiness</li>'),
    ('forms/templates', '<li>Browsing the gallery</li><li>Using a template</li><li>Saving your own templates</li><li>Managing your templates</li>'),
    ('forms/settings', '<li>Defaults for new forms</li><li>Branding</li><li>Notifications</li><li>Embedding</li><li>API access</li><li>Configuration</li>')
) as v(slug, outline)
join public.docs_pages p on p.slug = v.slug and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;

-- @down
-- Forms area drafts go with their outline blocks (on delete cascade).
delete from public.docs_pages where slug like 'forms/%';

update public.docs_pages
set nav_group_id = (select id from public.docs_nav_groups where slug = 'products'),
    slug = 'products/forms',
    title = 'Geiger Forms',
    nav_label = 'Forms',
    description = 'Intake and feedback.',
    preview = null,
    status = 'draft',
    published_at = null,
    sort_order = 50
where slug = 'forms' and deleted_at is null;

delete from public.docs_nav_groups where slug = 'forms';
