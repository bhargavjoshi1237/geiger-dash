-- Help property settings page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the property/settings draft outline from
-- 20261024191900_help_property_structure with the full Project settings guide (the sidebar's Settings group) and
-- publishes it. Payment Processing is summarized here and covered on property/payments. Integrations is left out: its
-- services all read "Not connected" and webhook delivery isn't connected, so nothing on it does anything yet.
-- Written from a survey of C:\Pro\geiger-property (components/internal/screens/settings/*, lib/rbac.js,
-- context/rbac-context.js, lib/supabase/{settings,team_members}.js, lib/policies.js, lib/email/catalog.js,
-- lib/supabase/chat_roster.js).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Project settings',
    description = 'Set up your company profile, team and roles, custom fields, fees and policies, portal branding and email notifications for a project.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'property/settings' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'property/settings' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.sort_order
from (
  values
    (
      'how-settings-save',
      'Basics',
      'Changing settings',
      $html$<p>The screens under <strong>Settings</strong> in the sidebar apply to the project you have open. Each project keeps its own settings.</p><p>Most settings screens don't save as you type: make your changes, then choose <strong>Save Changes</strong> at the top of the screen. Team &amp; Members is the exception, and works like any other list in Property. Saving needs the <strong>Manage settings</strong> permission (<strong>Create and edit roles</strong> on Roles &amp; Permissions); without it, the button is disabled with "Your role can't change these settings." Until a screen has been saved once, it shows its defaults.</p>$html$,
      '[]',
      10
    ),
    (
      'company-profile',
      'Settings',
      'Company profile',
      $html$<p><strong>Settings → Company Profile</strong> holds your management company's details:</p><ul><li><strong>Business</strong>: legal name, doing business as, and license number.</li><li><strong>Contact</strong>: email, phone and street address, where residents, owners and vendors reach you.</li><li><strong>Regional</strong>: timezone (Eastern to start) and currency (USD to start).</li></ul><p>Lease documents and messages use these details for the landlord's name, address and phone.</p>$html$,
      '[]',
      20
    ),
    (
      'team-and-members',
      'Settings',
      'Team and members',
      $html$<p><strong>Settings → Team &amp; Members</strong> is Property's list of the people who work in the project and the role each one holds. To add someone, choose <strong>New Member</strong>: only <strong>Full name</strong> is required, with their <strong>Email</strong> and, if your role can assign roles, a <strong>Role</strong>. Adding someone needs the <strong>Invite members</strong> permission.</p><p>A member is Invited (to start), Active, Disabled or Draft. Property doesn't email anyone from this list, and the list doesn't give access to the project: people open the project as members of your organization in Dash. What the list does:</p><ul><li>When someone opens Property, the member with their email decides their role. Anyone not on the list gets the <strong>Manager</strong> role, and a Disabled member can't see any page.</li><li>The people on the list are your team in <strong>Communications</strong>.</li></ul>$html$,
      '[]',
      30
    ),
    (
      'roles-and-permissions',
      'Settings',
      'Roles and permissions',
      $html$<p><strong>Settings → Roles &amp; Permissions</strong> defines roles and what each can see and do. Permissions hide pages in the sidebar and disable controls; they don't secure the underlying data.</p><p>The project starts with five roles: <strong>Owner</strong> (everything), <strong>Manager</strong> (everything except billing and managing roles), <strong>Leasing agent</strong> (Marketing &amp; Leads, Leasing and Communications, plus a few pages such as properties, units, tenants and documents), <strong>Maintenance tech</strong> (Maintenance, plus properties, units and vendors) and <strong>Accountant</strong> (Accounting and Reports, with posting, voiding, exporting and scheduling).</p><ul><li>In <strong>Roles</strong>, rename a role, add one by typing its name and choosing <strong>Add Role</strong>, or remove one with its trash icon. At least one role must remain.</li><li>The <strong>Permission matrix</strong> has a row for each sidebar section and page, plus the control permissions such as <strong>Delete records</strong>, <strong>Post charges, payments, bills &amp; journal entries</strong> and <strong>Export reports (CSV / PDF)</strong>. A section row turns every page in that section on or off for a role.</li></ul><p>Choose <strong>Save Changes</strong>; this needs <strong>Create and edit roles</strong>. Until roles are saved for the project, everyone can do everything, and the person who created the project always has full access. A page a role can't see shows <strong>No access</strong> if someone opens a link to it.</p>$html$,
      '[]',
      40
    ),
    (
      'custom-fields',
      'Settings',
      'Custom fields',
      $html$<p><strong>Settings → Custom Fields</strong> adds fields of your own to a record type: Properties, Buildings, Units, Tenants, Leases, Owners, Vendors, Work orders, Applications or Prospects. Pick the record type, type the field's label, pick its type and choose <strong>Add Field</strong>. Types are Text, Long text, Number, Currency, Date, Single choice, Multiple choice, Yes / no, Email, Phone and Link.</p><p>For a choice field, list its choices separated by commas. Each field can have a group, and <strong>Active</strong> and <strong>Required</strong> switches. Every field needs a label, and labels must be unique for the record type. Choose <strong>Save Changes</strong>, and the fields appear in the <strong>Custom Fields</strong> section of every editor of that type.</p>$html$,
      '[]',
      50
    ),
    (
      'fees-and-policies',
      'Settings',
      'Fees and policies',
      $html$<p><strong>Settings → Fees &amp; Policies</strong> sets your company defaults. Properties and leases inherit them and can override any of them from their own rules sections. The groups and their starting values:</p><ul><li><strong>Rent &amp; late fees</strong>: rent due on the 1st, a 5-day grace period, a $50 flat late fee (or a percent of rent, an initial plus daily fee, or none), an optional maximum, a $35 returned payment fee, and first-month proration by actual days.</li><li><strong>Payments</strong>: accepted methods (ACH, card and check to start), partial payments accepted, online payments stopped once an eviction is filed, a 2.9% card fee and $0 ACH fee, and whether autopay is required.</li><li><strong>Leasing defaults</strong>: a $45 application fee, 12-month leases, a deposit of one month's rent (or a fixed amount), pets allowed with a $300 deposit and $25 monthly pet rent, 90 days' renewal lead time and 30 days' move-out notice.</li><li><strong>Security deposits</strong>: returned within 30 days of move-out, 0% interest, held in a trust account.</li><li><strong>Maintenance</strong>: owner approval above $500, entry after calling first, and an after-hours emergency line.</li><li><strong>Management fees</strong>: 8% management fee, 50% of the first month as a leasing fee, a $250 owner reserve and owner distributions on the 15th.</li></ul>$html$,
      '[]',
      60
    ),
    (
      'payment-processing',
      'Settings',
      'Payment processing',
      $html$<p><strong>Settings → Payment Processing</strong> controls online card and ACH payments through Stripe: whether they're accepted, convenience fees, ACH crediting, autopay and returned payments. The <a href="/help/property/payments#payment-processing">Rent &amp; payments</a> guide covers each setting.</p>$html$,
      '[]',
      70
    ),
    (
      'branding-and-portals',
      'Settings',
      'Branding and portals',
      $html$<p><strong>Settings → Branding &amp; Portals</strong> sets how your company looks to residents, owners and vendors, and which portals they can use.</p><ul><li><strong>Brand</strong>: a display name and logo URL, shown on portals, statements and outgoing messages, with a preview.</li><li><strong>Accent color</strong>: Slate, Blue (to start), Sky, Emerald, Violet, Amber or Rose.</li><li><strong>Portals</strong>: switch on the <strong>Resident portal</strong>, <strong>Owner portal</strong> and <strong>Vendor portal</strong>. All three start off, and only invited people can sign in to a portal that's on. <strong>Copy Link</strong> copies the portal sign-in address.</li><li><strong>Portal welcome &amp; support</strong>: a welcome message and the support email and phone shown in the portals.</li></ul><p>Invite people from their own records: tenants, owners and vendors each have a portal invite in their <strong>Actions</strong> menu.</p>$html$,
      '[]',
      80
    ),
    (
      'notifications',
      'Settings',
      'Email notifications',
      $html$<p><strong>Settings → Notifications</strong> controls the email Property sends for this project. <strong>Send automatic email</strong> is the master switch; turning it off stops all automatic email. Under it, each notification has its own switch, grouped by topic. Those that send today are the rent reminder, late rent notice, lease expiring, messages and template sends, announcements, document expiring and team alerts; the others are marked <strong>Not sent automatically yet</strong>.</p><ul><li><strong>Team alert recipients</strong>: the addresses that get renewal windows, expiring documents and automation notifications. With none, team alerts are only logged on the record.</li><li><strong>Reminder timing</strong>: the rent reminder 3 days before rent is due, lease-end reminders at 60 and 30 days, and document expiry warnings 30 days ahead, to start.</li><li><strong>Delivery</strong>: shows whether email delivery and the scheduler are connected.</li></ul><p>Reminders are sent by the scheduled reminder jobs, listed under <strong>Automations → All Workflows → Scheduled Jobs</strong>; see <a href="/help/property/automations#scheduled-jobs">Scheduled jobs</a>.</p>$html$,
      '[]',
      90
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"Users","label":"Tenants, owners & vendors","href":"/help/property/people"},{"icon":"CircleDollarSign","label":"Rent & payments","href":"/help/property/payments"},{"icon":"Workflow","label":"Automations","href":"/help/property/automations"}]',
      200
    )
) as v(anchor_id, eyebrow, title, content, links, sort_order)
cross join (select id from public.docs_pages where slug = 'property/settings' and deleted_at is null) p;

-- @down
-- Restores the draft exactly as 20261024191900_help_property_structure left it.
update public.docs_pages
set title = 'Project settings',
    description = 'Company profile, team, roles, custom fields, policies, branding, integrations and notifications.',
    status = 'draft',
    published_at = null
where slug = 'property/settings' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'property/settings' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Company profile</li><li>Team and members</li><li>Roles and permissions</li><li>Custom fields</li><li>Fees and policies</li><li>Branding and portals</li><li>Integrations</li><li>Notifications</li></ul>',
  10
from public.docs_pages p
where p.slug = 'property/settings' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
