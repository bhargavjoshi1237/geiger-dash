-- Help property overview page
--
-- One-time content move, like 20261024142451_help_flow_overview_page: replaces the Property Overview draft outline
-- (re-homed to slug property by 20261024191900_help_property_structure) with the full Geiger Property overview and
-- publishes it. Each headline area gets a section that links to its guide (20261024191901 to 20261024191915). Property
-- isn't in SANDBOX_APP_IDS, so the page sets no preview; the playground is linked instead.
-- Written from a survey of C:\Pro\geiger-property (components/internal/sidebar/sidebar_nav.jsx,
-- components/internal/screens/registry.jsx, app/project/*, context/{project-context,rbac-context}.js,
-- components/landing/playground/property_playground.jsx, lib/sandbox/sandbox_mode.js, lib/messaging/api.js) and
-- C:\Pro\geiger-dash (lib/org/product-apps.js, app/org/[ORGID]/_components/project-row.jsx), plus the area guides'
-- surveys named in their own migration headers.
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Geiger Property',
    nav_label = 'Overview',
    description = 'Property runs property management in one place: properties and units, leasing, tenants, maintenance, rent and accounting, reports and portals.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'property' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'property' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, cards, features, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.cards::jsonb, v.features::jsonb, v.sort_order
from (
  values
    (
      'start-here',
      null,
      'Start here',
      '',
      '[{"icon":"FolderKanban","title":"Open a project","body":"Launch Property from any project in your organization","href":"/org"},{"icon":"Building2","title":"Add your properties","body":"Set up properties, units and buildings","href":"/help/property/properties"},{"icon":"CirclePlay","title":"Try the playground","body":"Explore a sample portfolio without signing in","href":"/property/playground"}]',
      '[]',
      10
    ),
    (
      'opening-property',
      'Basics',
      'Opening Geiger Property',
      $html$<p>Geiger Property works inside a <strong>project</strong>. Open your organization in Dash and choose <strong>Property</strong> on one of its projects. Everything you add in Property belongs to that project, and everyone in your organization can open it.</p><p>The sidebar lists Property's areas in this order: Overview, Property, Marketing &amp; Leads, Leasing, People, Maintenance, Accounting, Communications, Documents, Legal Resources, Reports, Automations and Settings. Groups expand to show their screens. <strong>Overview</strong> is the home screen, summing up occupancy, rent, leasing and maintenance and listing what needs attention; the <a href="/help/property/property-overview">Property overview</a> guide covers it.</p><p>What each person sees depends on their role. A page their role doesn't include is missing from their sidebar. Roles are set in <strong>Settings → Roles &amp; Permissions</strong>, covered in <a href="/help/property/settings">Project settings</a>.</p>$html$,
      '[]',
      '[]',
      20
    ),
    (
      'trying-the-playground',
      'Basics',
      'Trying Property in the playground',
      $html$<p>The <a href="/property/playground">Property playground</a> opens the full Property workspace on a sample portfolio, without signing in, so you can click through every area before you start.</p><p>Changes you make in the playground stay in your browser tab and are gone when you reload. Things that need a live connection, such as sending messages, show "Sending isn't available in the playground."</p>$html$,
      '[]',
      '[]',
      30
    ),
    (
      'whats-in-property',
      'Areas',
      'What''s in Property',
      '<p>Each area in the sidebar covers one part of running your properties, and each has its own guide. The sections on this page sum them up and link to each one.</p>',
      '[]',
      '[{"icon":"LayoutDashboard","text":"Property overview: occupancy, rent, leasing and what needs attention"},{"icon":"Building2","text":"Properties & units: buildings, portfolios, floor plans, amenities and media"},{"icon":"Megaphone","text":"Marketing & leads: listings, prospects, showings, applications and the waitlist"},{"icon":"FilePen","text":"Leasing: leases, renewals, moves, inspections, deposits and notices"},{"icon":"Users","text":"Tenants, owners & vendors: records, W-9s, insurance and portal access"},{"icon":"Wrench","text":"Maintenance: work orders, preventive schedules, unit turns and parts"},{"icon":"CircleDollarSign","text":"Rent & payments: rent, charges, online payments and autopay"},{"icon":"Calculator","text":"Accounting: the general ledger, bills, banking, budgets and CAM"},{"icon":"ChartColumn","text":"Reports: financial, leasing, operations and compliance reports"},{"icon":"MessagesSquare","text":"Communications: team chat, channels and calls"},{"icon":"FileText","text":"Documents & e-signature: the library, lease templates and signatures"},{"icon":"Scale","text":"Legal resources: official landlord-tenant sources for every state"},{"icon":"Workflow","text":"Automations: workflows, templates and scheduled jobs"},{"icon":"Settings","text":"Settings: team, roles, policies, branding and notifications"}]',
      40
    ),
    (
      'properties-and-leasing',
      'Portfolio',
      'Properties, marketing and leasing',
      $html$<ul><li><strong>Property</strong> holds your properties and their units, plus buildings, portfolios, floor plans, unit types, amenities with their reservations and community calendar, and the media library. See <a href="/help/property/properties">Properties &amp; units</a>.</li><li><strong>Marketing &amp; Leads</strong> takes a vacant unit from listing to lease: listings, prospects, showings, applications with screening and decisions, the waitlist and rent comparables. See <a href="/help/property/marketing">Marketing &amp; leads</a>.</li><li><strong>Leasing</strong> runs each lease from draft to end: activation, renewals, move-ins and move-outs, inspections, security deposits, notices and evictions. See <a href="/help/property/leasing">Leasing</a>.</li></ul>$html$,
      '[]',
      '[]',
      50
    ),
    (
      'people-and-portals',
      'People',
      'Tenants, owners and vendors',
      $html$<p><strong>People</strong> keeps a record for each tenant, owner and vendor: households and leases, ownership shares and W-9s, insurance certificates, licenses and payment rules. See <a href="/help/property/people">Tenants, owners &amp; vendors</a>.</p><p>From those records you also invite people to the resident, owner and vendor portals, where residents pay rent and request repairs, owners read statements and approve work, and vendors update jobs and send invoices.</p>$html$,
      '[]',
      '[]',
      60
    ),
    (
      'maintenance',
      'Maintenance',
      'Maintenance',
      $html$<p><strong>Maintenance</strong> tracks work orders from a resident's request to completion, with vendor assignment, owner approval, costs and vendor bills. It also holds preventive and recurring schedules, unit turns that get vacated units ready, and the parts inventory work orders draw on. See <a href="/help/property/maintenance">Maintenance</a>.</p>$html$,
      '[]',
      '[]',
      70
    ),
    (
      'money-and-reports',
      'Money',
      'Rent, accounting and reports',
      $html$<ul><li><strong>Rent &amp; payments</strong>: post rent and charges, record payments, collect card and bank payments online, set up autopay and bill back utilities. See <a href="/help/property/payments">Rent &amp; payments</a>.</li><li><strong>Accounting</strong>: a double-entry general ledger with the chart of accounts, transactions, bills and payables, bank reconciliation, budgets, CAM reconciliation and job costing. See <a href="/help/property/accounting">Accounting</a>.</li><li><strong>Reports</strong>: financial statements, rent roll, delinquency, owner statements, and leasing, operations and compliance reports, which you can print, export or email on a schedule. See <a href="/help/property/reports">Reports</a>.</li></ul>$html$,
      '[]',
      '[]',
      80
    ),
    (
      'communications-and-documents',
      'Team',
      'Communications, documents and legal resources',
      $html$<ul><li><strong>Communications</strong> is your team's chat for the project: direct messages, channels, threads, files, and audio and video calls. See <a href="/help/property/communications">Communications</a>.</li><li><strong>Documents</strong> brings every file into one library, holds lease templates with merge fields, and tracks e-signatures. See <a href="/help/property/documents">Documents &amp; e-signature</a>.</li><li><strong>Legal Resources</strong> collects official landlord-tenant sources for every state, with each state's rent regulation status. See <a href="/help/property/legal-resources">Legal resources</a>.</li></ul>$html$,
      '[]',
      '[]',
      90
    ),
    (
      'automations-and-settings',
      'Settings',
      'Automations and settings',
      $html$<ul><li><strong>Automations</strong> builds workflows that send messages, notify the team, open work orders or update records when something happens or on a schedule, from scratch or from templates, and lists Property's scheduled jobs. See <a href="/help/property/automations">Automations</a>.</li><li><strong>Settings</strong> holds the project's company profile, team, roles and permissions, custom fields, fees and policies, payment processing, branding and portals, and email notifications. See <a href="/help/property/settings">Project settings</a>.</li></ul>$html$,
      '[]',
      '[]',
      100
    )
) as v(anchor_id, eyebrow, title, content, cards, features, sort_order)
cross join (select id from public.docs_pages where slug = 'property' and deleted_at is null) p;

-- @down
-- Restores the draft exactly as 20261024191900_help_property_structure left it.
update public.docs_pages
set title = 'Geiger Property',
    nav_label = 'Overview',
    description = 'Real estate and property management.',
    status = 'draft',
    published_at = null
where slug = 'property' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'property' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>What Geiger Property is for</li><li>Opening it from a project</li><li>Key concepts</li><li>Common workflows</li></ul>',
  10
from public.docs_pages p
where p.slug = 'property' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
