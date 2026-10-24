-- Help events memberships page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the events/memberships draft outline from
-- 20261024191100_help_events_structure with the full Memberships guide and publishes it.
-- Written from a survey of C:\Pro\geiger-events (components/internal/screens/memberships/*,
-- components/internal/screens/tickets/{records_kit,settings_kit,constants}.js*, components/internal/screens/events/event_memberships.jsx,
-- lib/memberships/entitlements.js, lib/supabase/memberships.js, lib/portal/{memberships,grants}.js, lib/live/access.js,
-- app/api/portal/membership/*, components/internal/shared/pagination.jsx, geiger-rbac.config.js, geiger-ui.config.js).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set description = 'Create membership plans, let people join them from the members portal, and keep the roster of plan members up to date.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'events/memberships' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'events/memberships' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, showcase, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.showcase, v.sort_order
from (
  values
    (
      'creating-a-plan',
      'Basics',
      'Creating a membership plan',
      $html$<p>To create a membership plan, choose <strong>Memberships → Membership Plans</strong> in the sidebar, then <strong>New plan</strong>. Type a <strong>Name</strong> and choose <strong>Create</strong>. The plan opens on its edit page, where everything else is set. New plans are Active.</p><p>The edit page has three sections. Nothing is saved until you choose <strong>Save</strong> at the top, and the plan needs a name to save.</p><ul><li><strong>Pricing</strong>: the <strong>Price</strong> in US dollars (0 shows as Free) and <strong>Billing</strong>: One-time, Monthly or Yearly, the default. Billing sets how long a membership bought in the members portal lasts: one month, one year, or no end date for One-time.</li><li><strong>Benefits</strong>: <strong>Perks</strong>, one per line, listed on the plan's card in the members portal, and <strong>What's attached</strong>, the content the plan unlocks.</li><li><strong>Details</strong>: a <strong>Poster background</strong> for the plan's card (upload an image, or paste a link and choose <strong>Use link</strong>; 16:9 works best) and a <strong>Summary</strong> shown to people deciding whether to join.</li></ul><p>By default, <strong>Memberships</strong> appears in the sidebar for the Owner, Admin and Manager roles. Under <strong>Settings → Navigation</strong>, <strong>Tickets</strong> can't be hidden while <strong>Memberships</strong> is showing, and <strong>Membership Plans</strong> can't be hidden while <strong>Members</strong> or <strong>Membership Settings</strong> is showing. To change who sees it, see <a href="/help/events/settings#roles-and-permissions">Roles and permissions</a>.</p>$html$,
      '[]',
      null,
      10
    ),
    (
      'what-a-plan-unlocks',
      'Concepts',
      'What a plan unlocks',
      $html$<p>A membership plan is what opens the members portal's <strong>Live</strong> and <strong>Watch</strong> areas. They show a project's rooms and recordings only to people who hold an Active membership on one of its active plans, and they're empty for everyone else.</p><p>Rooms, webinars, breakouts and simulive broadcasts can also be restricted in their own <strong>Access</strong> settings; see <a href="/help/events/broadcast">Broadcast & On-demand</a>. A plan opens restricted items through <strong>VOD content</strong>, under <strong>Benefits → What's attached</strong>:</p><ul><li><strong>None</strong>: the plan opens no restricted items. This is where new plans start.</li><li><strong>Selected</strong>: restricted items linked to the events you pick under <strong>Specific events</strong>.</li><li><strong>Full catalogue</strong>: every restricted item in the project.</li></ul><p>Then set the <strong>Duration</strong>: <strong>Permanent</strong> keeps access for as long as the membership lasts, and <strong>Time-based</strong> ends it a set number of days, weeks, months or years after the person joined. Recordings have no access setting, so every plan member sees every published recording.</p><p>The plan's other settings are saved with it but don't change anything for plan members: <strong>Member discount</strong>, <strong>Apply to all events</strong>, and the <strong>Special access</strong> and <strong>Event perks & discounts</strong> items. Events doesn't apply them at checkout or at the door. The same goes for the event editor's <strong>Memberships</strong> section: its switches record which plans an event offers, and ticket prices stay as they are.</p>$html$,
      '[]',
      null,
      20
    ),
    (
      'managing-plans',
      'Membership Plans',
      'Managing plans',
      $html$<p><strong>Membership Plans</strong> lists every plan with its price and billing, its discount, what it unlocks, and its status. Click a plan to open its edit page. Filter by status (<strong>All Statuses</strong>, <strong>Active</strong> or <strong>Inactive</strong>), or type in the search box to match plan names. The list shows 25 plans a page; switch to 10, 50 or 100 at the bottom.</p><p>Each row's <strong>⋯</strong> menu has <strong>Edit</strong>, <strong>Deactivate</strong> (or <strong>Activate</strong>) and <strong>Delete</strong>. An inactive plan can't be bought in the members portal, and people who already hold it lose what it unlocked until you activate it again. <strong>Delete</strong> asks you to confirm first, and a deleted plan can't be restored.</p>$html$,
      '[]',
      null,
      30
    ),
    (
      'membership-settings',
      'Membership Settings',
      'Letting people join',
      $html$<p>Whether people can buy your plans is set under <strong>Memberships → Membership Settings</strong>. Choose <strong>Save Changes</strong> to apply your changes.</p><ul><li><strong>Enable memberships</strong> and <strong>Public join</strong>: both have to be on before your active plans are offered in the members portal. Both start off.</li><li><strong>Auto-renew</strong>: saved with your settings, but memberships don't renew on their own. Events never charges a plan member again, so someone whose membership runs out buys it again.</li><li><strong>Internal note</strong>: context for your team. Plan members never see it.</li></ul>$html$,
      '[]',
      null,
      40
    ),
    (
      'joining-a-plan',
      'Members portal',
      'How people join a plan',
      $html$<p>People join a membership plan from the <strong>Memberships</strong> area of the members portal, once they've signed in. The portal offers the active plans of every project where they've placed an order or already hold a plan, as long as that project has <strong>Enable memberships</strong> and <strong>Public join</strong> on. Each plan shows its poster, price, summary, perks and what it unlocks.</p><ul><li>A free plan enrolls them straight away.</li><li>A paid plan takes them to a secure checkout page to pay the plan's price, in US dollars. Once it's paid, they're enrolled.</li></ul><p>Either way they appear in <strong>Memberships → Members</strong> as Active, starting that day. A monthly plan expires a month later and a yearly plan a year later; a one-time plan doesn't expire. Someone who already holds a plan as Active can't buy it again. See <a href="/help/events/members-portal">Members portal</a> for what attendees see there.</p>$html$,
      '[]',
      null,
      50
    ),
    (
      'adding-a-member',
      'Members',
      'Adding a plan member yourself',
      $html$<p>To enroll someone without them buying, choose <strong>Memberships → Members</strong>, then <strong>New member</strong>. Type their name and choose <strong>Create</strong>. The member opens on their edit page; choose <strong>Save</strong> when you're done.</p><ul><li><strong>Profile</strong>: their <strong>Email</strong>, which is how the members portal matches them to the plan.</li><li><strong>Membership</strong>: the <strong>Plan</strong> they hold, their <strong>Status</strong> (Active, Expired or Cancelled; new members are Active), <strong>Member since</strong> (the day you created them) and <strong>Expires</strong>. Leave <strong>Expires</strong> empty for a membership that never ends.</li><li><strong>Access</strong>: what their plan unlocks and until when, worked out from the day they joined.</li></ul><p>Adding someone here doesn't give them a members portal sign-in. Events creates that when a person places an order, so someone who has never bought a ticket from you can't sign in to use their plan until they do.</p>$html$,
      '[]',
      null,
      60
    ),
    (
      'members-list',
      'Members',
      'The Members list and expiry',
      $html$<p><strong>Members</strong> lists every plan member with their plan, email, and when they joined or when their membership expires. Filter by <strong>Active</strong> or <strong>Inactive</strong> (Expired and Cancelled members), or search by name. Each row's <strong>⋯</strong> menu has <strong>Edit</strong>, <strong>Deactivate</strong>, which sets the member to Cancelled, <strong>Activate</strong>, and <strong>Delete</strong>, which asks you to confirm and can't be undone.</p><p>When a membership's expiry date passes, the restricted items its plan opened close for that person, but their status stays Active until you change it, so the rest of <strong>Live</strong> and <strong>Watch</strong> stays open to them. While they're Active, they also can't buy the same plan again in the members portal, so set them to Expired when their membership runs out.</p>$html$,
      '[]',
      null,
      70
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"CircleUser","label":"Members portal","href":"/help/events/members-portal"},{"icon":"Radio","label":"Broadcast & On-demand","href":"/help/events/broadcast"},{"icon":"Ticket","label":"Tickets","href":"/help/events/tickets"}]',
      null,
      80
    )
) as v(anchor_id, eyebrow, title, content, links, showcase, sort_order)
cross join (select id from public.docs_pages where slug = 'events/memberships' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Memberships',
    description = 'Sell membership plans that unlock pricing and access, and manage who''s enrolled.',
    status = 'draft',
    published_at = null
where slug = 'events/memberships' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'events/memberships' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Membership plans</li><li>Members</li><li>Membership settings</li><li>Attaching plans to events</li></ul>',
  10
from public.docs_pages p
where p.slug = 'events/memberships' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
