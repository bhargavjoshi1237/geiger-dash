-- Help property portals page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the property/portals draft outline from
-- 20261024191900_help_property_structure with the full Portals guide (the resident, owner and vendor portals at
-- /property/portal, and how members give people access). It stays a draft: Dash's proxy gates /property/portal and
-- /property/api/portal for signed-out visitors, so residents, owners and vendors can't reach the portal yet. Portal announcements are left out: members
-- have no screen to write them.
-- Written from a survey of C:\Pro\geiger-property (app/portal/*, components/portal/* (portal_nav.js, login_screen,
-- resident/*, owner/*, vendor/*, shared/*), lib/portal/{auth,invite,session,constants,common,resident,owner,vendor}.js,
-- components/internal/screens/tenants/{actions.js,sections/portal.jsx}, owners/config.jsx, vendors/config.jsx,
-- components/internal/screens/settings/branding_portals.jsx).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Portals',
    description = 'Let residents, owners and vendors sign in to their own portal to pay rent, request repairs, approve work, read statements and invoice jobs.',
    preview = null
where slug = 'property/portals' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'property/portals' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.sort_order
from (
  values
    (
      'turning-on-portals',
      'Basics',
      'Turning on a portal',
      $html$<p>Geiger Property has three portals for people outside your team: a <strong>Resident portal</strong> for tenants, an <strong>Owner portal</strong> and a <strong>Vendor portal</strong>. Each one is off until you switch it on in <strong>Settings → Branding &amp; Portals</strong>, then choose <strong>Save Changes</strong>.</p><p>The same screen shows the portal sign-in address, with <strong>Copy Link</strong> to share it, and sets the brand, accent color, welcome message and support contacts people see in the portals. Only people you invite can sign in, and only while their portal is switched on.</p>$html$,
      '[]',
      10
    ),
    (
      'inviting-people',
      'Basics',
      'Inviting residents, owners and vendors',
      $html$<p>Invite someone from their record's <strong>Actions</strong> menu. The record needs an email first.</p><ul><li><strong>Tenant</strong>: <strong>Invite to portal</strong>, and <strong>Disable portal access</strong> to turn it off.</li><li><strong>Owner</strong>: <strong>Toggle portal access</strong> turns access on (sending the invite) or off, and <strong>Resend portal invite</strong> sends it again.</li><li><strong>Vendor</strong>: <strong>Invite to vendor portal</strong> and <strong>Disable vendor portal</strong>.</li></ul><p>Property emails the person a link to sign in. If the email can't be sent, the invite is still recorded, and they can sign in from the portal address with the same email.</p><p>A tenant's <strong>Resident Portal</strong> section shows their access status, when they were invited and when they were last seen. Its <strong>Permissions</strong> decide what they can do: <strong>Pay rent online</strong>, <strong>Submit maintenance requests</strong>, <strong>View documents</strong>, <strong>Message the office</strong> and <strong>Show ledger &amp; balance</strong>. You can also set a different <strong>Login email</strong>.</p>$html$,
      '[]',
      20
    ),
    (
      'signing-in',
      'Basics',
      'Signing in to a portal',
      $html$<p>Portals don't use passwords. On the portal sign-in page, the person enters their email. Property sends a sign-in link and a six-digit code: they open the link on the same device, or type the code. Only invited emails get a sign-in email.</p><p>Someone who signs in without an invitation, or whose portal is switched off, sees <strong>No portal access yet</strong>. Someone invited to more than one portal or project switches between them with <strong>Switch portal</strong> in the account menu.</p>$html$,
      '[]',
      30
    ),
    (
      'resident-portal',
      'Resident portal',
      'The resident portal',
      $html$<p>Residents see <strong>Home</strong>, <strong>Payments</strong>, <strong>Maintenance</strong>, <strong>Lease &amp; documents</strong>, <strong>Renters insurance</strong>, <strong>Messages</strong> and <strong>Profile</strong>.</p><ul><li><strong>Home</strong>: their balance, open requests, lease end date and insurance status.</li><li><strong>Payments</strong>: the balance due, open charges, their ledger, and paying online through a secure checkout, with autopay. Online payment needs a linked lease and Stripe connected in Payment Processing.</li><li><strong>Maintenance</strong>: <strong>New Maintenance Request</strong> asks what's wrong, the category and where, details, whether it's an emergency, entry permission, pets and access notes, with photos. Each request shows its status and lets them add updates.</li><li><strong>Lease &amp; documents</strong>: their lease terms, lease history and shared documents.</li><li><strong>Renters insurance</strong>: upload a policy with its declarations page. The office reviews it.</li><li><strong>Messages</strong>: send a message to the office.</li></ul><p>A request arrives in <strong>Maintenance → Work Orders</strong> as a Submitted request, and a resident's message is logged in their tenant record's <strong>Notifications Log</strong>. Each permission that's turned off hides or blocks its part of the portal.</p>$html$,
      '[]',
      40
    ),
    (
      'owner-portal',
      'Owner portal',
      'The owner portal',
      $html$<p>Owners see <strong>Portfolio</strong>, <strong>Statements</strong>, <strong>Maintenance &amp; approvals</strong>, <strong>Documents</strong>, <strong>Messages</strong> and <strong>Profile</strong>.</p><ul><li><strong>Portfolio</strong>: the properties linked to them as an owner, with their units.</li><li><strong>Statements</strong>: income, expenses and distributions for their share of each property, and the distributions paid out to them.</li><li><strong>Maintenance &amp; approvals</strong>: work on their properties, and jobs above their approval limit waiting for a decision. They can approve or reject; rejecting needs a reason. The decision is recorded on the work order, and approving a job that was on hold waiting for approval takes it off hold.</li><li><strong>Documents</strong>: management agreements, property records and other files you share with them.</li></ul><p>Owners see every work order on their properties except drafts.</p>$html$,
      '[]',
      50
    ),
    (
      'vendor-portal',
      'Vendor portal',
      'The vendor portal',
      $html$<p>Vendors see <strong>Work orders</strong>, <strong>Invoices</strong>, <strong>Insurance &amp; licenses</strong>, <strong>Messages</strong> and <strong>Profile</strong>.</p><ul><li><strong>Work orders</strong>: the jobs assigned to them. They accept or decline a job (declining needs a reason), schedule it, put it on hold, and mark it complete with the work performed and photos. Each change updates the work order's status in Property.</li><li><strong>Invoices</strong>: bill the office for completed work. A submitted invoice arrives in <strong>Accounting → Bills &amp; Payables</strong> as a bill waiting for approval.</li><li><strong>Insurance &amp; licenses</strong>: upload certificates of insurance and licenses for the office to verify.</li></ul>$html$,
      '[]',
      60
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"Users","label":"Tenants, owners & vendors","href":"/help/property/people"},{"icon":"Settings","label":"Project settings","href":"/help/property/settings"},{"icon":"CircleDollarSign","label":"Rent & payments","href":"/help/property/payments"},{"icon":"Wrench","label":"Maintenance","href":"/help/property/maintenance"},{"icon":"Calculator","label":"Accounting","href":"/help/property/accounting"},{"icon":"FilePen","label":"Leasing","href":"/help/property/leasing"}]',
      200
    )
) as v(anchor_id, eyebrow, title, content, links, sort_order)
cross join (select id from public.docs_pages where slug = 'property/portals' and deleted_at is null) p;

-- @down
-- Restores the draft exactly as 20261024191900_help_property_structure left it.
update public.docs_pages
set title = 'Portals',
    description = 'The portals where residents, owners and vendors sign in to pay, request and follow their work.',
    status = 'draft',
    published_at = null
where slug = 'property/portals' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'property/portals' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Inviting residents, owners and vendors</li><li>Signing in</li><li>The resident portal</li><li>The owner portal</li><li>The vendor portal</li></ul>',
  10
from public.docs_pages p
where p.slug = 'property/portals' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
