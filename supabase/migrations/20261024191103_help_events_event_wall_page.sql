-- Help events event wall page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the events/event-wall draft outline from
-- 20261024191100_help_events_structure with the full Event Wall & Discovery guide and publishes it.
-- Written from a survey of C:\Pro\geiger-events (components/internal/screens/events/event_wall/*,
-- components/internal/screens/discovery/*, app/w/[slug]/*, lib/supabase/event_wall.js, lib/supabase/discovery.js,
-- lib/events/use-wall-config.js, components/internal/screens/events/publishing.jsx (List on Event Wall),
-- components/internal/screens/events/page_footer.jsx, supabase/migrations/20260715100714_discovery.sql and
-- 20260726194134_project_access.sql, geiger-rbac.config.js, geiger-ui.config.js).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set description = 'Publish one public page listing your events, choose what it shows, and build the organizer profile visitors follow.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'events/event-wall' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'events/event-wall' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, showcase, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.showcase, v.sort_order
from (
  values
    (
      'opening-the-event-wall',
      'Basics',
      'Opening the Event Wall',
      $html$<p>The Event Wall is your project's public page listing your events. To set it up, choose <strong>Events → Event Wall</strong> in the sidebar. Events creates the wall the first time anyone on your team opens it, so every project has exactly one.</p><p>The wall's address is under the <strong>Event Wall</strong> heading. <strong>Copy link</strong> copies it, and <strong>View live</strong> opens the wall in a new tab. A new wall is called Our Events and its address ends in <code>/w/events-</code> followed by a short code. Change them, and everything else about the wall, from its sections:</p><ul><li><strong>General</strong>: the page name, tagline, logo and a call-to-action button.</li><li><strong>Design</strong>: colors, fonts, layout and the header background.</li><li><strong>Footer</strong>: social buttons, links and a closing line.</li><li><strong>Events</strong>: which list the wall opens on, and which events are featured.</li><li><strong>Custom URL</strong>: the end of the wall's address.</li></ul><p><strong>General</strong>, <strong>Design</strong>, <strong>Footer</strong> and <strong>Custom URL</strong> each keep your changes until you choose their <strong>Save Changes</strong> button. <strong>Events</strong> saves each change as you make it.</p><p>By default, <strong>Event Wall</strong> appears in the sidebar for the Owner, Admin, Manager and Member roles, under <strong>Events</strong>. To change who sees it, see <a href="/help/events/settings#roles-and-permissions">Roles and permissions</a>.</p>$html$,
      '[]',
      null,
      10
    ),
    (
      'which-events-appear',
      'Concepts',
      'Which events appear on the wall',
      $html$<p>The Event Wall lists every event whose <strong>List on Event Wall</strong> switch is on. The switch is in the event editor's <strong>Visibility</strong> section, and it's off for new events. To list an event, open it in the event editor, open <strong>Visibility</strong> and turn on <strong>List on Event Wall</strong>. See <a href="/help/events/events#visibility-and-publishing">Visibility and publishing</a>.</p><ul><li>An event whose visibility is Private never appears, even with the switch on.</li><li>The wall doesn't check an event's status, so turn the switch on once the event is ready for the public.</li><li>An event needs a date to be listed. Events dated today or later are <strong>Upcoming</strong>, and earlier ones are <strong>Past</strong>.</li><li>Upcoming events are ordered by date and start time, soonest first. Past events are ordered most recent first.</li></ul><p>Clicking an event on the wall opens its event page.</p>$html$,
      '[]',
      null,
      20
    ),
    (
      'what-visitors-see',
      'Event Wall',
      'What visitors see on the wall',
      $html$<p>The top of the Event Wall shows your logo, a <strong>Follow</strong> button, the visitor's own local time, and "Events managed by" with your organizer name. Next come the tagline, the bio and social links from your organizer profile, and your call-to-action button if you set one.</p><p>The events section lists your events grouped by date. Visitors can:</p><ul><li>switch between <strong>Cards</strong> and <strong>List</strong>;</li><li>search by event name, venue, city, organizer or summary;</li><li>narrow the list to one event type with the type buttons, which appear once the list holds two or more types;</li><li>pick a day on the calendar beside the list (days with events carry a dot) to see only that day;</li><li>switch between <strong>Upcoming</strong> and <strong>Past</strong>;</li><li>see events that have a map location on a small map.</li></ul><p>Each event shows its start time, name, type, host, venue and city, and its lowest ticket price (or Free). A featured event carries a <strong>Featured</strong> star. Once an event is sold out, it shows <strong>Waitlist</strong> instead of a price. Your footer closes the page.</p>$html$,
      '[]',
      null,
      30
    ),
    (
      'page-details',
      'Event Wall',
      'Page details and call to action',
      $html$<p>The <strong>General</strong> section of the Event Wall holds the wall's identity. Choose <strong>Save Changes</strong> to publish your edits.</p><ul><li><strong>Page name</strong>: Our Events to start with. Link previews use it, and so does "Events managed by" when your organizer profile has no display name.</li><li><strong>Tagline</strong>: a short line under your name. Link previews use it as their description.</li><li><strong>Logo URL</strong>: the image at the top left. Leave it blank and the wall uses the avatar from your organizer profile instead.</li></ul><p>Under <strong>Call to action</strong>, add an extra button under <strong>Follow</strong>, for a venue tour, a sponsor deck or a mailing list. Type a <strong>Button label</strong> and a <strong>Link</strong> (a web address, or <code>mailto:</code> and an email address), and pick a <strong>Style</strong>: Solid or Outline. The button only shows once both the label and the link are filled in. A link without <code>https://</code> gets it added.</p>$html$,
      '[]',
      null,
      40
    ),
    (
      'designing-the-wall',
      'Event Wall',
      'Designing the wall',
      $html$<p>The <strong>Design</strong> section of the Event Wall sets the wall's look. Nothing changes on the live wall until you choose <strong>Save Changes</strong> at the bottom, which saves the whole section at once.</p><ul><li><strong>Brand & logo</strong>: <strong>Import from a site</strong> reads an existing website and applies its colors, fonts and shapes. You can also upload the <strong>Logo</strong> and edit the <strong>Tagline</strong> here: they're the same logo and tagline as in <strong>General</strong>.</li><li><strong>Brand colors</strong>: a <strong>Base</strong> palette, then <strong>Brand / accent</strong>, <strong>Brand text</strong>, <strong>Page background</strong>, <strong>Surface / cards</strong>, <strong>Text</strong> and <strong>Muted text</strong>.</li><li><strong>Typography</strong>: <strong>Heading font</strong>, <strong>Body font</strong>, <strong>Text size</strong>, <strong>Heading weight</strong> and <strong>Uppercase headings</strong>.</li><li><strong>Shape & style</strong>: <strong>Corner radius</strong> (Sharp, Rounded or Pill), <strong>Button style</strong> (Solid, Outline or Soft), <strong>Card shadow</strong>, <strong>Spacing</strong> and <strong>Content width</strong> (Narrow, Standard or Wide).</li><li><strong>Agenda</strong>: the <strong>Default view</strong> (Cards or List; visitors can still switch), and whether each event shows its <strong>Type badge</strong>, <strong>Host</strong>, <strong>Venue</strong> and <strong>Price</strong>.</li><li><strong>Header & background</strong>: the <strong>Page background</strong>; a <strong>Header background</strong> image or a muted, looping video (upload one, or paste a link to an .mp4, .webm or .mov file); and a <strong>Banner image URL</strong> for the wide image above your name. With no banner, the wall uses your organizer profile's banner.</li></ul>$html$,
      '[]',
      null,
      50
    ),
    (
      'footer',
      'Event Wall',
      'The wall''s footer',
      $html$<p>The <strong>Footer</strong> section of the Event Wall sets the bottom of the page. Choose <strong>Save Changes</strong> to publish it.</p><ul><li><strong>Show Geiger branding</strong>: keeps the "Powered by Geiger Events" line. It's on to start with.</li><li><strong>Footer text</strong>: a copyright line, an address or a short note.</li><li><strong>Social links</strong>: choose <strong>Add social link</strong>, pick the platform (Instagram, X / Twitter, Facebook, LinkedIn, YouTube, Twitch, GitHub, Website or Email) and paste the address. Each one shows as an icon button.</li><li><strong>Footer links</strong>: choose <strong>Add link</strong> and type a label and an address.</li></ul><p>If the footer has no social links of its own, the wall shows the website and social links from your organizer profile instead.</p>$html$,
      '[]',
      null,
      60
    ),
    (
      'featured-events',
      'Event Wall',
      'Featuring events and the starting list',
      $html$<p>The <strong>Events</strong> section of the Event Wall saves each change as you make it.</p><ul><li><strong>Show</strong> picks the list the wall opens on. <strong>Past only</strong> opens on past events. <strong>Upcoming only</strong>, the default, and <strong>All listable events</strong> both open on upcoming events. Visitors can switch between the two either way.</li><li><strong>Featured events</strong> marks events with a <strong>Featured</strong> star on the wall. Pick an event under <strong>Add a featured event</strong>; the list offers every event listed on the wall. To unfeature one, click the × beside it.</li></ul><p>When no event has <strong>List on Event Wall</strong> turned on yet, the section says so and there's nothing to feature.</p>$html$,
      '[]',
      null,
      70
    ),
    (
      'custom-url',
      'Event Wall',
      'Changing the wall''s address',
      $html$<p>To change the end of the Event Wall's address, open its <strong>Custom URL</strong> section, type a new <strong>URL slug</strong> (the part after <code>/w/</code>), and choose <strong>Save Changes</strong>. The preview under the field shows the full address.</p><p>Events turns what you type into a slug of lowercase letters, numbers and dashes. Each slug can belong to one wall only, so a slug another project already uses can't be saved. Once you save a new slug, the old address stops working, so update any links you've shared.</p>$html$,
      '[]',
      null,
      80
    ),
    (
      'organizer-profile',
      'Discovery',
      'The organizer profile',
      $html$<p>Your organizer profile is the identity visitors follow on the Event Wall. To edit it, choose <strong>Discovery</strong> in the sidebar, fill in the <strong>Organiser profile</strong> card and choose <strong>Save</strong>. Nothing is required.</p><ul><li><strong>Display name</strong>: shown as "Events managed by" on the wall and in the <strong>Follow</strong> dialog.</li><li><strong>Avatar URL</strong>: the wall's logo when the wall has no logo of its own.</li><li><strong>Banner URL</strong>: the wall's banner when the wall has none of its own.</li><li><strong>Bio</strong>: shown under the wall's tagline.</li><li><strong>Website</strong> and <strong>Social links</strong> (choose <strong>Add link</strong> for each, with a label and an address): shown as icons on the wall. Empty link rows are dropped when you save.</li><li><strong>Tagline</strong>, <strong>Location</strong> and <strong>Public contact email</strong>: kept on the profile, but the wall doesn't show them.</li></ul><p>The figures across the top are <strong>Followers</strong>, <strong>New this week</strong> (people who followed in the last seven days) and <strong>Profile complete</strong>, the share of seven fields you've filled in: display name, tagline, bio, avatar, website, location and contact email. <strong>Copy link</strong> and <strong>View live</strong> work as they do on the Event Wall.</p><p>By default, <strong>Discovery</strong> appears in the sidebar for the Owner, Admin and Manager roles. It depends on the Event Wall, so under <strong>Settings → Navigation</strong>, <strong>Event Wall</strong> can't be hidden while <strong>Discovery</strong> is showing. To change who sees it, see <a href="/help/events/settings#roles-and-permissions">Roles and permissions</a>.</p>$html$,
      '[]',
      null,
      90
    ),
    (
      'followers',
      'Discovery',
      'Followers',
      $html$<p>Visitors follow you by choosing <strong>Follow</strong> on the Event Wall or on one of your event pages, then typing their email (their name is optional). Each email address follows a project once; following again changes nothing.</p><p>The <strong>Followers</strong> card in <strong>Discovery</strong> lists everyone who follows the project, newest first, with their email, name and the date they followed. Type in <strong>Search followers</strong> to match emails and names.</p><ul><li><strong>Export CSV</strong> downloads the whole list as <code>followers.csv</code>, with Email, Name and Followed columns.</li><li>The trash icon on a row removes that follower straight away, without asking. Events can't restore them, but they can follow again.</li></ul><p>Following adds the person to this list and nothing more: Events doesn't email followers when you publish an event. To reach them, export the list and contact them yourself.</p>$html$,
      '[]',
      null,
      100
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"CalendarDays","label":"Events","href":"/help/events/events"},{"icon":"LayoutTemplate","label":"Event page","href":"/help/events/event-page"},{"icon":"Settings","label":"Settings","href":"/help/events/settings"}]',
      null,
      110
    )
) as v(anchor_id, eyebrow, title, content, links, showcase, sort_order)
cross join (select id from public.docs_pages where slug = 'events/event-wall' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Event Wall & Discovery',
    description = 'Publish a public wall of your events and an organizer profile people can follow.',
    status = 'draft',
    published_at = null
where slug = 'events/event-wall' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'events/event-wall' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>The Event Wall</li><li>The organiser profile</li><li>Followers</li></ul>',
  10
from public.docs_pages p
where p.slug = 'events/event-wall' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
