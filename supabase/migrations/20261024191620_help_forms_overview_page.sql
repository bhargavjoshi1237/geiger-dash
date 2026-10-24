-- Help forms overview page
--
-- One-time content move, like 20261024142451_help_flow_overview_page: replaces the Forms Overview's draft outline
-- (re-homed from products/forms by 20261024191600_help_forms_structure) with the product overview and publishes it,
-- now that every Forms area has its own guide (20261024191601 to 20261024191616). Each headline area gets a section
-- that links to its guide. Forms isn't in SANDBOX_APP_IDS, so the page has no whole-app preview.
-- Written from a survey of C:\Pro\geiger-forms (components/internal/sidebar/sidebar_nav.js, components/forms/forms-workspace.jsx,
-- components/internal/topbar/topbar.jsx, components/layout/profile-dropdown.jsx, app/project/[projectId]/[[...rest]]/page.js,
-- context/project-context.js, components/internal/screens/forms/no_project.jsx, lib/forms/field-types.js, lib/forms/i18n.js,
-- C:\Pro\geiger-ui\src\ui\topbar.jsx) and C:\Pro\geiger-dash (lib/org/product-apps.js, app/org/[ORGID]/_components/*),
-- plus the area guides' surveys named in their own migration headers.
-- Left out on purpose: the landing page's embedded "playground" (it renders the real workspace, not a sandbox) and the
-- topbar's help button and the account menu's Documentation link (neither points at the Help Center).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Geiger Forms',
    nav_label = 'Overview',
    description = 'Forms is where your team builds forms and surveys, publishes them and works through the responses, with logic, payments, approvals and analytics.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'forms' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'forms' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, cards, features, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.cards::jsonb, v.features::jsonb, v.sort_order
from (
  values
    (
      'start-here',
      null::text,
      'Start here',
      '',
      '[{"icon":"FolderKanban","title":"Open a project","body":"Launch Forms from any project in your organization","href":"/org"},{"icon":"PencilRuler","title":"Build a form","body":"Add fields, pages and logic in the builder","href":"/help/forms/builder"},{"icon":"Inbox","title":"Work through responses","body":"Review, assign and export what comes in","href":"/help/forms/responses"}]',
      '[]',
      10
    ),
    (
      'opening-forms',
      'Basics',
      'Opening Forms',
      $html$<p>Forms works inside a <strong>project</strong>. Open your organization in Dash and launch Forms from one of its projects. The forms you create there, and their responses, belong to that project. The first time you open a project in Forms, you get a role in it: see <a href="/help/forms/collaboration#how-teammates-join">Collaboration</a>.</p><p>Forms opens on the project's <strong>Overview</strong>. The sidebar lists the rest in groups that expand when you click them: <strong>Form Builder</strong>, <strong>Responses</strong>, <strong>Analytics</strong>, <strong>Integrations</strong>, <strong>Collaboration</strong>, <strong>Security & Compliance</strong>, <strong>Templates & Admin</strong> and <strong>Developer</strong>.</p><p>To jump to any screen, press <code>Ctrl K</code> (<code>⌘ K</code> on Mac) or choose the search box at the top, and type its name. The bell at the top holds your notifications, such as responses assigned to you and mentions in comments. If you don't belong to a project yet, Forms shows <strong>No projects yet</strong>, covered in <a href="/help/forms/all-forms#no-new-form-button">All forms</a>.</p>$html$,
      '[]',
      '[]',
      20
    ),
    (
      'whats-in-forms',
      'Areas',
      'What''s in Forms',
      '<p>Each area of Forms has its own guide. The sections on this page sum them up and link to each one.</p>',
      '[]',
      '[{"icon":"LayoutDashboard","text":"Project overview: responses, completion and the work waiting"},{"icon":"FileText","text":"All forms: create, organize, publish and archive forms"},{"icon":"PencilRuler","text":"Form builder: fields, pages, preview and versions"},{"icon":"ListChecks","text":"Field types: from short text to bookings and signatures"},{"icon":"GitFork","text":"Logic & scoring: conditions, formulas, quizzes and outcomes"},{"icon":"Settings2","text":"Form settings: design, schedules, emails and access"},{"icon":"Share2","text":"Publishing & sharing: links, QR codes, embeds and invitations"},{"icon":"CreditCard","text":"Payments: Stripe Checkout, products and coupons"},{"icon":"ClipboardCheck","text":"Approvals & automations: approval steps, rules and documents"},{"icon":"Inbox","text":"Responses: the inbox, saved views, bulk actions and exports"},{"icon":"ChartColumn","text":"Analytics: funnels, sources, A/B tests and reports"},{"icon":"PlugZap","text":"Integrations & API: webhooks, Slack and the REST API"},{"icon":"Users","text":"Collaboration: roles, sharing, comments and activity"},{"icon":"ShieldCheck","text":"Security & compliance: spam, retention, GDPR and HIPAA"},{"icon":"LayoutTemplate","text":"Templates: 42 ready-made forms, plus your own"},{"icon":"Settings","text":"Workspace settings: defaults for new forms"}]',
      30
    ),
    (
      'building-forms',
      'Build',
      'Building forms',
      $html$<p>Create a form with <strong>New form</strong> on <strong>All Forms</strong>, starting blank, from one of 42 templates or from one of your own. All Forms also sorts forms into folders and archives the ones you're done with. See <a href="/help/forms/all-forms">All forms</a> and <a href="/help/forms/templates">Templates</a>.</p><p>A new form opens in the builder, where you add fields from eight groups: Basic, Choice, Date & time, Survey, Contact, Advanced, Payments and Layout. Split the form into pages, preview it and save versions to go back to. The builder saves as you work. See <a href="/help/forms/builder">Form builder</a> and <a href="/help/forms/fields">Field types</a>.</p><p>Logic shows fields and pages only when they apply, calculates values, scores answers, grades quizzes and sends respondents to different endings. See <a href="/help/forms/logic">Logic and scoring</a>.</p><p>Each form's settings hold its design and themes, welcome and thank-you screens, schedule and response limit, emails, and who can respond. See <a href="/help/forms/form-settings">Form settings</a>, and <a href="/help/forms/settings">Workspace settings</a> for the defaults new forms start with.</p>$html$,
      '[]',
      '[]',
      40
    ),
    (
      'publishing-and-collecting',
      'Collect',
      'Publishing and collecting responses',
      $html$<p>A form collects responses once it's published. Share its public link or QR code, embed it on your own site as an inline form, popup, slider, side tab or popover, or email it with personal signed links. See <a href="/help/forms/sharing">Publishing and sharing</a>.</p><p>Respondents can move through pages or answer one question at a time, save and finish later, and see the form's built-in text in one of seven languages. To charge for a form, add products and take one-off or recurring payments through Stripe Checkout, with coupon codes. See <a href="/help/forms/payments">Payments</a>.</p>$html$,
      '[]',
      '[]',
      50
    ),
    (
      'working-with-responses',
      'Responses',
      'Working with responses',
      $html$<p>Every response lands in the <strong>Response Inbox</strong>, with a status, a priority and its answers. Filter and sort it, save views, switch between a table and a kanban board, assign responses to teammates, tag them and comment on them, act on many at once, and export them as CSV or JSON. Unfinished responses show under <strong>Partial / Abandoned</strong>. See <a href="/help/forms/responses">Responses</a>.</p><p>Approval steps make responses wait for one or more approvers, automations act on new responses that match your conditions, and a document template prints each response as a formatted document. See <a href="/help/forms/workflow">Approvals and automations</a>.</p>$html$,
      '[]',
      '[]',
      60
    ),
    (
      'measuring-performance',
      'Analytics',
      'Measuring how forms perform',
      $html$<p>The project's <strong>Overview</strong> sums up new responses, views, completion and the work waiting on your team. See <a href="/help/forms/project-overview">Project overview</a>.</p><p>The <strong>Analytics</strong> screens go deeper: views, starts and submissions for every form, where respondents drop off, which sources and campaigns bring them, A/B tests of a form's title and description, per-question survey reports and weekly digest emails. See <a href="/help/forms/analytics">Analytics</a>.</p>$html$,
      '[]',
      '[]',
      70
    ),
    (
      'team-security-and-integrations',
      'Team',
      'Team, security and integrations',
      $html$<ul><li><strong>Collaboration</strong>: give teammates roles (Owner, Admin, Manager, Member or Viewer, or your own), share forms, and follow comments and the activity log. See <a href="/help/forms/collaboration">Collaboration</a>.</li><li><strong>Security & Compliance</strong>: block spam, set how long responses are kept, answer GDPR access and erasure requests, and check HIPAA safeguards. See <a href="/help/forms/security">Security and compliance</a>.</li><li><strong>Integrations</strong>: send responses to other tools with signed webhooks and Slack, copy uploads into Geiger Assets, and work with forms from code through the REST API. See <a href="/help/forms/integrations">Integrations and API</a>.</li></ul>$html$,
      '[]',
      '[]',
      80
    )
) as v(anchor_id, eyebrow, title, content, cards, features, sort_order)
cross join (select id from public.docs_pages where slug = 'forms' and deleted_at is null) p;

-- @down
-- Restores the draft the structure migration left (the products/forms outline, re-homed to the forms slug).
update public.docs_pages
set title = 'Geiger Forms',
    nav_label = 'Overview',
    description = 'Intake and feedback.',
    preview = null,
    status = 'draft',
    published_at = null
where slug = 'forms' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'forms' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>What Geiger Forms is for</li><li>Opening it from a project</li><li>Key concepts</li><li>Common workflows</li></ul>',
  10
from public.docs_pages p
where p.slug = 'forms' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
