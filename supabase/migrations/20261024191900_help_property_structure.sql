-- Help property structure
--
-- One-time content move, like 20261023200049_help_flow_guide: graduates Property into its own sidebar group. The
-- products/property draft is re-homed as the Property Overview (slug property, still a draft; 20261024191920 fills it
-- in), and each area of Property's workspace sidebar starts as a draft outline at property/<area>. The page migrations
-- that follow (20261024191901 to 20261024191915) fill each page in. Property isn't in SANDBOX_APP_IDS, so no page
-- sets a preview. AI Assistant has no page: its sidebar entry still opens a "Coming soon" screen.
-- Written from a survey of C:\Pro\geiger-property (components/internal/sidebar/sidebar_nav.jsx,
-- components/internal/screens/registry.jsx, components/portal/portal_nav.js).
-- Later edits happen in Studio, so this must never re-run.

-- @up
insert into public.docs_nav_groups (title, slug, sort_order)
values ('Property', 'property', 36)
on conflict (slug) do update set
  title = excluded.title,
  sort_order = excluded.sort_order;

-- Property Overview: re-home the products/property draft, or create it on a database that never had one.
update public.docs_pages
set nav_group_id = (select id from public.docs_nav_groups where slug = 'property'),
    slug = 'property',
    title = 'Geiger Property',
    nav_label = 'Overview',
    preview = null,
    sort_order = 10
where slug = 'products/property' and deleted_at is null;

insert into public.docs_pages (nav_group_id, slug, title, nav_label, description, status, sort_order)
select g.id, 'property', 'Geiger Property', 'Overview', 'Real estate and property management.', 'draft', 10
from public.docs_nav_groups g
where g.slug = 'property'
on conflict (slug) where deleted_at is null do nothing;

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>What Geiger Property is for</li><li>Opening it from a project</li><li>Key concepts</li><li>Common workflows</li></ul>',
  10
from public.docs_pages p
where p.slug = 'property' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;

-- Property's areas, in its sidebar order: Overview, Property, Marketing & Leads, Leasing, People, Maintenance,
-- Accounting, Communications, Documents, Legal Resources, Reports, Automations, Settings. Accounting splits into two
-- guides, and the resident, owner and vendor portals get a guide of their own.
insert into public.docs_pages (nav_group_id, slug, title, description, status, sort_order)
select g.id, v.slug, v.title, v.description, 'draft', v.sort_order
from (
  values
    ('property/property-overview', 'Property overview', 'The workspace home screen: occupancy, rent collection, leasing and maintenance across your portfolio.', 20),
    ('property/properties', 'Properties & units', 'Set up properties, units, buildings and portfolios, with floor plans, unit types, amenities and media.', 30),
    ('property/marketing', 'Marketing & leads', 'List vacant units, track prospects and showings, take applications and keep a waitlist.', 40),
    ('property/leasing', 'Leasing', 'Create and manage leases, renewals, moves, inspections, security deposits and notices.', 50),
    ('property/people', 'Tenants, owners & vendors', 'Keep records for the tenants, owners and vendors you work with.', 60),
    ('property/maintenance', 'Maintenance', 'Track work orders, preventive maintenance, unit turns and parts inventory.', 70),
    ('property/payments', 'Rent & payments', 'Collect rent, take online payments and post recurring and utility charges.', 80),
    ('property/accounting', 'Accounting', 'Keep the books: transactions, bills, the general ledger, budgets and bank reconciliation.', 90),
    ('property/communications', 'Communications', 'Chat, channels, calls and files for the people who run your properties.', 100),
    ('property/documents', 'Documents & e-signature', 'Store documents, build templates and send documents for e-signature.', 110),
    ('property/legal-resources', 'Legal resources', 'Look up landlord-tenant law and resources by jurisdiction.', 120),
    ('property/reports', 'Reports', 'Run, export and schedule financial, leasing and operations reports.', 130),
    ('property/automations', 'Automations', 'Build workflows that run on their own, start from templates and review every run.', 140),
    ('property/settings', 'Project settings', 'Company profile, team, roles, custom fields, policies, branding, integrations and notifications.', 150),
    ('property/portals', 'Portals', 'The portals where residents, owners and vendors sign in to pay, request and follow their work.', 160)
) as v(slug, title, description, sort_order)
cross join (select id from public.docs_nav_groups where slug = 'property') g
on conflict (slug) where deleted_at is null do nothing;

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview', '<p><em>Draft outline. Replace before publishing.</em></p><ul>' || v.outline || '</ul>', 10
from (
  values
    ('property/property-overview', '<li>Portfolio figures</li><li>Rent over time and unit status mix</li><li>Leasing funnel, occupancy and collection rates</li><li>Top performing properties</li><li>Needs attention</li>'),
    ('property/properties', '<li>Properties</li><li>Units</li><li>Buildings</li><li>Portfolios</li><li>Floor plans</li><li>Unit types</li><li>Amenities and the community calendar</li><li>Media library</li>'),
    ('property/marketing', '<li>Listings</li><li>Prospects</li><li>Showings</li><li>Applications and decisions</li><li>Waitlist</li><li>Rent comparables</li>'),
    ('property/leasing', '<li>Leases</li><li>Renewals</li><li>Move-ins and move-outs</li><li>Inspections</li><li>Security deposits</li><li>Notices and violations</li>'),
    ('property/people', '<li>Tenants</li><li>Owners</li><li>Vendors</li>'),
    ('property/maintenance', '<li>Work orders</li><li>Preventive and recurring work</li><li>Unit turns</li><li>Inventory and parts</li>'),
    ('property/payments', '<li>Rent collection</li><li>Online payments and autopay</li><li>Recurring charges</li><li>Utility billing</li><li>Payment processing</li>'),
    ('property/accounting', '<li>Transactions</li><li>Bills and payables</li><li>Chart of accounts</li><li>Budgets</li><li>Bank accounts</li><li>General ledger</li><li>Bank reconciliation</li><li>CAM reconciliation</li><li>Job costing</li>'),
    ('property/communications', '<li>Messages and channels</li><li>Contacts</li><li>Calls</li><li>Files</li><li>Inbox</li><li>Chat settings</li>'),
    ('property/documents', '<li>Document library</li><li>Templates</li><li>E-signature</li>'),
    ('property/legal-resources', '<li>Browsing by jurisdiction</li><li>The resource library</li><li>Jurisdiction details</li>'),
    ('property/reports', '<li>Running a report</li><li>Exporting and printing</li><li>Scheduled reports</li><li>The reports</li>'),
    ('property/automations', '<li>Workflows</li><li>Workflow templates</li><li>Run history</li>'),
    ('property/settings', '<li>Company profile</li><li>Team and members</li><li>Roles and permissions</li><li>Custom fields</li><li>Fees and policies</li><li>Branding and portals</li><li>Integrations</li><li>Notifications</li>'),
    ('property/portals', '<li>Inviting residents, owners and vendors</li><li>Signing in</li><li>The resident portal</li><li>The owner portal</li><li>The vendor portal</li>')
) as v(slug, outline)
join public.docs_pages p on p.slug = v.slug and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;

-- @down
-- Area drafts go with their outline blocks (on delete cascade).
delete from public.docs_pages
where slug in (
  'property/property-overview', 'property/properties', 'property/marketing', 'property/leasing', 'property/people',
  'property/maintenance', 'property/payments', 'property/accounting', 'property/communications', 'property/documents',
  'property/legal-resources', 'property/reports', 'property/automations', 'property/settings', 'property/portals'
);

update public.docs_pages
set nav_group_id = (select id from public.docs_nav_groups where slug = 'products'),
    slug = 'products/property',
    title = 'Geiger Property',
    nav_label = 'Property',
    preview = null,
    sort_order = 130
where slug = 'property' and deleted_at is null;

delete from public.docs_nav_groups where slug = 'property';
