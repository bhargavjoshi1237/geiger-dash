-- Help property people page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the property/people draft outline from
-- 20261024191900_help_property_structure with the full Tenants, owners & vendors guide (the sidebar's People group)
-- and publishes it.
-- Written from a survey of C:\Pro\geiger-property (components/internal/screens/{tenants,owners,vendors,people}/*,
-- lib/compliance.js, lib/payments/context.js, lib/portal/resident.js, lib/supabase/options.js,
-- components/internal/screens/entity/entity_list_screen.jsx).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Tenants, owners & vendors',
    description = 'Keep records for your tenants, owners and vendors: households, leases, payment rules, ownership, W-9s, insurance and portal access.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'property/people' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'property/people' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.sort_order
from (
  values
    (
      'adding-a-tenant',
      'Basics',
      'Adding a tenant',
      $html$<p>To add a tenant, choose <strong>People → Tenants</strong> in the sidebar, then <strong>New Tenant</strong>. Only <strong>Full name</strong> is required. Add an <strong>Email</strong> (needed later for the resident portal), a <strong>Unit</strong> and a <strong>Status</strong>: Applicant, Future, Current or Past (Applicant to start). Choose <strong>Create Tenant</strong>.</p><p>Converting an approved application to a lease creates the tenant for you, as Current. A tenant record can also stand for a company: the editor's <strong>Profile</strong> section holds either a person's or a company's details.</p>$html$,
      '[]',
      10
    ),
    (
      'tenant-statuses',
      'Concepts',
      'Tenant statuses and renters insurance',
      $html$<p>A tenant is Applicant, Future, Current, Late, On notice, Past or Draft. Current, Late and On notice tenants are <strong>residents</strong>: they live in one of your units.</p><p>Residents need renters insurance unless it's waived for them. Each tenant's <strong>Renters Insurance</strong> section holds their policies, and Property rates them Compliant, Expiring soon (within 30 days), Expired, Missing or Not required. The tenant list's <strong>Insurance gaps</strong> view shows residents who are missing coverage or whose policy expires soon.</p>$html$,
      '[]',
      20
    ),
    (
      'tenant-list',
      'Tenants',
      'The tenant list and editor',
      $html$<p>The figures at the top of <strong>Tenants</strong> show current tenants (with how many applicants), the total <strong>Balance due</strong> and how many tenants owe, those <strong>Missing insurance</strong> (with policies expiring within 30 days), and how many are on the portal. The view menu offers <strong>All tenants</strong>, <strong>Current</strong>, <strong>Applicants</strong>, <strong>Insurance gaps</strong> and <strong>Past</strong>.</p><p>A tenant's editor groups everything about them:</p><ul><li><strong>Profile</strong>: contact details, communication preferences, employment and income, identification (the ID type and last four digits only) and recorded screening.</li><li><strong>Household</strong>: household contacts (who gets notices and statements), occupants, emergency contacts in call order, pets and vehicles.</li><li><strong>Leasing &amp; Money</strong>: Ledger, Online Payments, Lease &amp; Unit, every lease they're on, Payments &amp; Balance, Payment Restrictions, and Move-out once they're on notice or past.</li><li><strong>Compliance &amp; Operations</strong>: Renters Insurance, Notices &amp; Violations and Work Orders.</li><li><strong>Portal &amp; Messages</strong>: Resident Portal and the Notifications Log.</li></ul>$html$,
      '[]',
      30
    ),
    (
      'tenant-actions',
      'Tenants',
      'Tenant actions and payment restrictions',
      $html$<p>A tenant's <strong>Actions</strong> menu has:</p><ul><li><strong>Invite to portal</strong>: emails the tenant an invitation to the resident portal. The tenant needs an email first. <strong>Disable portal access</strong> turns it off again.</li><li><strong>Add to lease</strong>: <strong>Lease</strong> and <strong>Role</strong> are required. The role is Tenant (financially responsible), Co-signer, Guarantor or Occupant; tenants and co-signers get a rent responsibility share, and a tenant can be made the lease's primary tenant and this person's current lease.</li><li><strong>Record payment restriction</strong> and <strong>Clear payment restrictions</strong>.</li><li><strong>Move to past tenant</strong>: <strong>Move-out date</strong> is required. Optionally set the lease end to that date, disable portal access, and record a forwarding address for the final statement and deposit refund.</li><li><strong>Collect payment online</strong>: sends the tenant a payment link or takes a card or bank payment now.</li></ul><p>A payment restriction turns on any of <strong>No online payments</strong>, <strong>Certified funds only</strong>, <strong>No partial payments</strong> and <strong>No personal checks</strong>, with a required reason and effective date. <strong>No online payments</strong> stops the tenant paying online, including in the resident portal, and <strong>No partial payments</strong> means online payments must cover the full balance.</p>$html$,
      '[]',
      40
    ),
    (
      'owners',
      'Owners',
      'Owners',
      $html$<p><strong>People → Owners</strong> holds the people and entities who own your properties. Choose <strong>New Owner</strong>: only <strong>Owner name</strong> is required. Pick an <strong>Entity type</strong> (Individual to start; also Joint, LLC, Corporation, Partnership, Trust, Estate or Non-profit), an optional company or legal name and email, and a status of Active, Onboarding or Inactive (Onboarding to start).</p><p>An owner's editor covers their profile and contacts, <strong>Ownerships</strong> (each property they hold and their share), <strong>Ledger</strong>, <strong>Payout Settings</strong>, <strong>Management Agreement</strong>, <strong>Tax &amp; 1099</strong>, <strong>Statements &amp; Reports</strong>, <strong>Maintenance Approvals</strong> and <strong>Owner Portal</strong>. Its <strong>Actions</strong> menu has:</p><ul><li><strong>Add ownership</strong>: links a property and the owner's share of it. Ownership can also be set from a property's <strong>Actions → Assign owner</strong>.</li><li><strong>Hold payouts</strong> (with a required reason) and <strong>Release payouts</strong>.</li><li><strong>Record W-9</strong>: <strong>Received</strong>, <strong>Taxpayer name</strong> and <strong>TIN (last 4)</strong> are required. Property keeps only the last four digits of the TIN.</li><li><strong>Toggle portal access</strong> and <strong>Resend portal invite</strong> for the owner portal, which need the owner's email.</li><li><strong>Deactivate owner</strong> and <strong>Reactivate owner</strong>.</li></ul><p>The view menu includes <strong>Needs attention</strong>: owners with payouts on hold or no W-9. The figures count owners, properties owned, payouts on hold and missing W-9s.</p>$html$,
      '[]',
      50
    ),
    (
      'vendors',
      'Vendors',
      'Vendors',
      $html$<p><strong>People → Vendors</strong> holds the contractors and service companies you hire. Choose <strong>New Vendor</strong>: only <strong>Vendor name</strong> is required. Pick a <strong>Primary trade</strong> (General contractor to start; others include Plumbing, Electrical, HVAC, Landscaping, Pest control and Locksmith) and a status: Active, Onboarding, Inactive or Do not use (Active to start).</p><p>A vendor's editor covers contacts, trades and service areas, availability (including 24/7 emergency service), rates, payment terms, tax and 1099, compliance, work orders, bills, ratings and reviews, and <strong>Vendor Portal</strong>. Its <strong>Actions</strong> menu has:</p><ul><li><strong>Add insurance certificate</strong> and <strong>Add license</strong>, each with an expiry date.</li><li><strong>Record W-9</strong>: received date, taxpayer name and the TIN's last four digits are required, with <strong>1099 eligible</strong>.</li><li><strong>Mark as preferred</strong> and <strong>Remove preferred</strong>.</li><li><strong>Hold payments</strong> (with a required reason) and <strong>Release payments</strong>.</li><li><strong>Mark do not use</strong> (with a required reason) and <strong>Reactivate vendor</strong>.</li><li><strong>Invite to vendor portal</strong> and <strong>Disable vendor portal</strong>.</li></ul><p>A vendor's compliance is the worst of its insurance and licenses: Compliant, Expiring soon (within 30 days), Expired or Missing. The views include <strong>Preferred</strong>, <strong>Non-compliant</strong>, <strong>Expiring soon</strong>, <strong>24/7</strong> and <strong>Inactive</strong>, and the figures count active vendors, expired or missing insurance certificates, items expiring within 30 days and the average rating.</p>$html$,
      '[]',
      60
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"FilePen","label":"Leasing","href":"/help/property/leasing"},{"icon":"FileText","label":"Documents & e-signature","href":"/help/property/documents"},{"icon":"Wrench","label":"Maintenance","href":"/help/property/maintenance"},{"icon":"CircleDollarSign","label":"Rent & payments","href":"/help/property/payments"},{"icon":"Calculator","label":"Accounting","href":"/help/property/accounting"},{"icon":"Building2","label":"Properties & units","href":"/help/property/properties"}]',
      200
    )
) as v(anchor_id, eyebrow, title, content, links, sort_order)
cross join (select id from public.docs_pages where slug = 'property/people' and deleted_at is null) p;

-- @down
-- Restores the draft exactly as 20261024191900_help_property_structure left it.
update public.docs_pages
set title = 'Tenants, owners & vendors',
    description = 'Keep records for the tenants, owners and vendors you work with.',
    status = 'draft',
    published_at = null
where slug = 'property/people' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'property/people' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Tenants</li><li>Owners</li><li>Vendors</li></ul>',
  10
from public.docs_pages p
where p.slug = 'property/people' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
