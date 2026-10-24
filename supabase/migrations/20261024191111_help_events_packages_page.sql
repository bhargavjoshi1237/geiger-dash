-- Help events packages page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the events/packages draft outline from
-- 20261024191100_help_events_structure with the full Packages guide and publishes it.
-- Written from a survey of C:\Pro\geiger-events (components/internal/screens/packages/packages_settings.jsx,
-- components/internal/screens/events/{event_packages,packages_page_editor,packages_shared}.jsx,
-- components/internal/screens/events/packages_page/*, app/e/[id]/packages/page.js, lib/events/packages.js,
-- lib/events/use-event-config.js, lib/supabase/package_enquiries.js, public_page/checkout/{use_checkout.js,pricing.js},
-- app/api/checkout/route.js, lib/stripe/fulfill-checkout.js, supabase/migrations/20260823230000_package_enquiries.sql,
-- components/internal/screens/events/event_sections.js, geiger-rbac.config.js).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set description = 'Sell VIP packages for an event from their own sales page, or collect inquiries for them, and publish that page when it''s ready.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'events/packages' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'events/packages' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, showcase, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.showcase, v.sort_order
from (
  values
    (
      'turning-packages-on',
      'Basics',
      'Turning packages on',
      $html$<p>Packages are premium bundles, such as VIP experiences, that you sell for an event from their own sales page. To turn them on for the project, choose <strong>Packages</strong> in the sidebar and turn on the <strong>Packages</strong> switch. The setting covers the whole project, so everyone on your team sees the same answer.</p><p>While packages are on, every event's editor has two extra sections under Tickets: <strong>Packages</strong>, where you build the tiers, and <strong>Packages Page</strong>, where you set up and publish the page they sell from.</p><p>Turning packages off hides those two sections again and keeps everything you've written. It doesn't take down a packages page that's already live: to do that, turn off <strong>Packages page is live</strong> in the event's <strong>Packages Page</strong> section first.</p><p>By default, <strong>Packages</strong> appears in the sidebar for the Owner, Admin and Manager roles. To change who sees it, see <a href="/help/events/settings#roles-and-permissions">Roles and permissions</a>.</p>$html$,
      '[]',
      null,
      10
    ),
    (
      'how-packages-sell',
      'Concepts',
      'How packages sell',
      $html$<p>Packages sell from an event's packages page, never from its event page, which keeps selling tickets as before. Each package is bought one of two ways:</p><ul><li><strong>Sell directly</strong>: its button opens the same checkout as a ticket. The sale is recorded as an order named after the package, and it shows in <a href="/help/events/orders">Orders</a> with your ticket sales.</li><li><strong>Collect enquiries</strong>: its button doesn't take payment. It points the buyer to the packages page's inquiry form, and you follow up with them yourself.</li></ul><p>The packages page shows the packages in the order you set, side by side, each with its image, inclusions, price and button.</p>$html$,
      '[]',
      null,
      20
    ),
    (
      'adding-packages',
      'Event editor',
      'Adding packages to an event',
      $html$<p>To add a package, open the event in the event editor, open <strong>Packages</strong>, and choose <strong>Add package</strong>. Only the name is required: the dialog won't add a package without one.</p><ul><li><strong>Cover image</strong>: upload an image for the top of the card. Only the person who created the event can upload images to it.</li><li><strong>Name</strong> and <strong>Tagline</strong>: the card's heading and the line under it.</li><li><strong>What's included</strong>: choose <strong>Add inclusion</strong> for each thing the buyer gets, pick its icon (Ticket, Seating, Location, Food & drink, Photo opportunity, Meet & greet, Gift or merchandise, Access & entry, or Premium extra, the default) and type the line. Use the arrows to reorder lines and the trash icon to remove one.</li><li><strong>More details</strong>: text behind the card's <strong>More details</strong> expander. Each line becomes a paragraph.</li><li><strong>Price</strong> and <strong>Price suffix</strong>: the amount, and what follows it. The suffix starts as <code>/pp</code>.</li><li><strong>Stock</strong>: how many are available. Leave it blank for unlimited.</li><li><strong>How it's bought</strong>: <strong>Sell directly</strong> (the default) or <strong>Collect enquiries</strong>.</li><li><strong>Button label</strong>: leave it blank to use Buy package or Enquire.</li></ul><p>Choose <strong>Add package</strong> to add it to the list. <strong>Intro</strong>, at the top of the section, is a short line the packages page shows before the packages.</p><p>Nothing reaches the packages page until you choose <strong>Save packages</strong> at the top of the section, which saves the intro and every package at once.</p>$html$,
      '[]',
      null,
      30
    ),
    (
      'managing-packages',
      'Event editor',
      'Ordering, editing and removing packages',
      $html$<p>The <strong>Tiers</strong> list in an event's <strong>Packages</strong> section shows each package with its tagline, how many inclusions it has, its stock and price, and Enquiry only for packages that collect inquiries. The packages page shows them in the same order, left to right.</p><ul><li>Use the arrows on a row to move a package up or down.</li><li>The pencil opens the package's dialog. Choose <strong>Save package</strong> to keep your edits.</li><li>The trash icon removes a package from the list straight away, without asking.</li></ul><p>All of these, removals included, reach the packages page only when you choose <strong>Save packages</strong>.</p><p>A package with a stock of 0 shows <strong>Sold out</strong> and can't be bought. Sales don't count the stock down, so lower it yourself as packages sell, or set it to 0 to stop sales.</p>$html$,
      '[]',
      null,
      40
    ),
    (
      'packages-page',
      'Event editor',
      'Setting up the packages page',
      $html$<p>Each event has its own packages page, at the event page's address followed by <code>/packages</code>. To set it up, open the event in the event editor and open <strong>Packages Page</strong>. Choose <strong>Save page</strong> to keep your changes.</p><ul><li><strong>Publish</strong>: until <strong>Packages page is live</strong> is on, the page tells visitors that packages aren't available, even if they have the link.</li><li><strong>Hero</strong>: a <strong>Title</strong> (blank uses the event's name) and a <strong>Subtitle</strong>, shown over the event's cover image with the event date.</li><li><strong>Intro</strong>: a <strong>Heading</strong>, a <strong>Body</strong> and an optional link (<strong>Link label</strong> and <strong>Link address</strong>) between the hero and the packages. With no body, the page uses the intro from the <strong>Packages</strong> section.</li><li><strong>Packages band</strong>: the <strong>Heading</strong> over the package cards. It starts as VIP Packages.</li><li><strong>Why choose us</strong>: turn on <strong>Show this band</strong> for an image-and-text band under the packages, with a <strong>Heading</strong>, <strong>Body</strong>, <strong>Image address</strong> and a <strong>Button label</strong> for a button that scrolls back up to the packages.</li><li><strong>Enquiry form</strong>: turn on <strong>Show the enquiry form</strong> to add the form at the bottom, with its <strong>Heading</strong> and an optional <strong>Consent line</strong>.</li><li><strong>Design</strong>: the page's own layout, theme and blocks, separate from the event page. It uses the same controls as the event page's <a href="/help/events/event-page#page-design">Page design</a>, and design changes save on their own.</li></ul><p>Once the page is live, <strong>View page</strong> opens it in a new tab. Share its address wherever you promote the packages.</p>$html$,
      '[]',
      null,
      50
    ),
    (
      'package-inquiries',
      'Event editor',
      'Package inquiries',
      $html$<p>Package inquiries come from the inquiry form at the bottom of a packages page. The form is the only way to buy a package set to <strong>Collect enquiries</strong>, so turn on <strong>Show the enquiry form</strong> in <strong>Packages Page</strong> for any event that has one. Choosing such a package's button fills in the form's <strong>Package</strong> field.</p><p>On the form, <strong>First name</strong> and <strong>Email</strong> are required. <strong>Last name</strong>, <strong>Phone</strong>, <strong>Package</strong> (Any package to start with), <strong>Number of tickets</strong> and <strong>Message</strong> are optional. When you've written a <strong>Consent line</strong>, the buyer has to tick it before the form sends.</p><p>While the form is on, an <strong>Enquiries</strong> card in <strong>Packages Page</strong> lists what has arrived, newest first, with the 20 most recent shown. Each shows the person's name, email (click it to write to them), phone, package, number of tickets, date and message. Events doesn't email you when an inquiry arrives, so check the card.</p>$html$,
      '[]',
      null,
      60
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"Ticket","label":"Tickets","href":"/help/events/tickets"},{"icon":"ShoppingBag","label":"Orders","href":"/help/events/orders"},{"icon":"LayoutTemplate","label":"Event page","href":"/help/events/event-page"}]',
      null,
      70
    )
) as v(anchor_id, eyebrow, title, content, links, showcase, sort_order)
cross join (select id from public.docs_pages where slug = 'events/packages' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Packages',
    description = 'Sell VIP packages for an event on their own sales page.',
    status = 'draft',
    published_at = null
where slug = 'events/packages' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'events/packages' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Turning packages on</li><li>Building packages for an event</li><li>The packages page</li></ul>',
  10
from public.docs_pages p
where p.slug = 'events/packages' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
