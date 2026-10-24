-- Help events sponsors page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the events/sponsors draft outline from
-- 20261024191100_help_events_structure with the full Sponsors & Expo guide and publishes it.
-- Written from a survey of C:\Pro\geiger-events (components/internal/sidebar/sidebar_nav.jsx,
-- components/internal/screens/registry.jsx, components/internal/screens/conference/{screens.jsx,floor_plan.jsx,constants.js},
-- components/internal/screens/conference/modules/{index.js,shared.jsx,sponsor.jsx,package.jsx,booth.jsx,sponsor_room.jsx},
-- components/internal/screens/conference/detail_fields.jsx, components/internal/shared/records/*,
-- components/internal/screens/events/sponsorship/* (prospectus/*), lib/events/sponsorship.js, lib/events/use-event-config.js,
-- lib/supabase/{records,conference,event_sponsorship,sponsor_enquiries,hall_maps,expo,orders,order_refunds,storage}.js,
-- components/internal/screens/events/{event_sections.js,event_expo.jsx,booth_picker.jsx,hall_map_view.jsx,location_time.jsx},
-- components/internal/screens/events/public_page/checkout/{booths_step.jsx,use_checkout.js}, app/e/[id]/sponsor/page.js,
-- components/internal/screens/venues/hall_maps.jsx, components/internal/shared/form_fields_editor.jsx, lib/forms/fields.js,
-- lib/passes/{attendees,roles}.js, lib/email/catalog.js, geiger-ui.config.js, geiger-rbac.config.js,
-- supabase/migrations/{20260805160757_expo_booths,20260929120000_sponsor_enquiries,20260930150932_private_sponsorship_fills}.sql).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set description = 'Record sponsorship deals for each event, show sponsors on the event page, collect inquiries from a public sponsorship page and sell exhibitor booths.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'events/sponsors' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'events/sponsors' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, showcase, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.showcase, v.sort_order
from (
  values
    (
      'adding-a-sponsor',
      'Basics',
      'Adding a sponsor',
      $html$<p>A sponsor is a company backing your events. Sponsors belong to the project, so one sponsor can take spots at several events. To add one, choose <strong>Sponsors & Expo → Sponsors</strong> in the sidebar, then <strong>Add sponsor</strong>. Only <strong>Company name</strong> is required: Events won't add a sponsor without one.</p><ul><li><strong>Company name</strong>: the event page shows it in place of a missing logo, and under the logo when you turn names on.</li><li><strong>Description</strong>: what the company does. The event page's List layout shows it.</li><li><strong>Logo</strong>: an image for the event page. It uploads once the sponsor is saved.</li></ul><p>Choose <strong>Add sponsor</strong> to save it. The amount, contact details and benefits are set in the sponsor's details afterward. You can also add a new sponsor while filling a spot in an event's <strong>Sponsor Spots</strong> section.</p><p>By default, <strong>Sponsors & Expo</strong> appears in the sidebar for the Owner, Admin and Manager roles. To change who sees it, see <a href="/help/events/settings#roles-and-permissions">Roles and permissions</a>. <strong>Sponsorship Packages</strong>, <strong>Sponsor Rooms</strong> and <strong>Expo Booths</strong> are built on <strong>Sponsors</strong>, and <strong>Floor Plan & Booths</strong> is built on <strong>Expo Booths</strong>. To hide one of these from your own sidebar under <strong>Settings → Navigation</strong>, hide the entries built on it first; see <a href="/help/events/settings#navigation">Sidebar navigation</a>.</p>$html$,
      '[]',
      null,
      10
    ),
    (
      'how-sponsorship-works',
      'Concepts',
      'How sponsorship and booths fit together',
      $html$<p>Sponsorship in Events has four parts, and none of them takes payment from a sponsor. You agree each deal yourself, outside Events, then record it.</p><ul><li><strong>Sponsors</strong> are the companies, kept once for the whole project.</li><li><strong>Spots</strong> are what one event offers sponsors, such as a title sponsor or three Gold places. Each event has its own spots, in the event editor's <strong>Sponsor Spots</strong> section.</li><li>A <strong>fill</strong> puts a sponsor in a spot, with the agreed amount and a status: Pending (agreed, not yet settled) or Confirmed (settled). Confirmed sponsors show on the event page.</li><li>The <strong>sponsorship page</strong> is a public page for one event that lists its open spots, with your contact details and an interest form. What prospects send arrives in the event's <strong>Sponsor Enquiries</strong> section.</li></ul><p><strong>Sponsorship Packages</strong> are reusable templates: copying one into an event creates a spot, once.</p><p>Exhibitor booths work differently, because they're sold. A booth belongs to an exhibitor hall drawn on a venue, and an event sells the hall's booths through its normal checkout, so a booth sale is an order like a ticket sale. The <strong>Expo Booths</strong> list is a separate record of exhibitors and isn't the floor events sell from.</p>$html$,
      '[]',
      null,
      20
    ),
    (
      'sponsors-list',
      'Sponsors',
      'The sponsors list and sponsor details',
      $html$<p>The <strong>Sponsors</strong> screen lists the project's sponsors, newest first, with each one's logo, description, contact and amount. The figures across the top count the <strong>Sponsors</strong>, add up every sponsor's amount as <strong>Sponsorship</strong>, and show the <strong>Average</strong> per sponsor and how many have a logo. Search matches names, contacts and descriptions, and the <strong>Sort: Amount donated</strong> menu sorts by amount, high to low or low to high.</p><p>Click a sponsor to open its details:</p><ul><li><strong>Details</strong>: <strong>Company name</strong>, <strong>Amount</strong> and <strong>Description</strong>.</li><li><strong>Contact</strong>: <strong>Contact name</strong>, <strong>Email</strong> and <strong>Website</strong>.</li><li><strong>Benefits</strong>: type a benefit and press <code>Enter</code> or choose <strong>Add</strong>. Remove one with the × beside it.</li><li><strong>Logo</strong>: upload, replace or remove the logo. Only the teammate who added the sponsor can upload or replace it.</li></ul><p>Choose <strong>Save Changes</strong> to keep edits to the fields. Logo changes save straight away.</p><p>The amount and benefits are notes for your team: each event's deals and amounts are recorded in its <strong>Sponsor Spots</strong>. The name, logo, website and description reach the event page through those spots, where the logo can link to the website. In <strong>Check-in → Badge Printing</strong>, each sponsor with a <strong>Contact name</strong> gets a Sponsor badge in that person's name, in every event's list.</p><p>Each row's <strong>⋯</strong> menu has <strong>Edit</strong>, <strong>Duplicate</strong> (a copy named with "(copy)" added, without the logo) and <strong>Delete</strong>, which asks you to confirm first. A deleted sponsor can't be restored from Events, and it stays in any event spots it fills until you remove it there.</p>$html$,
      '[]',
      null,
      30
    ),
    (
      'sponsorship-packages',
      'Sponsorship Packages',
      'Sponsorship packages',
      $html$<p>Sponsorship packages are reusable spot templates, such as a Gold package with its price and benefits, that you copy into events. To add one, choose <strong>Sponsors & Expo → Sponsorship Packages</strong>, then <strong>Add package</strong>. Only <strong>Package name</strong> is required. <strong>Tier</strong> is Platinum, Gold (the default), Silver, Bronze or Community, and <strong>Price</strong> starts at 0.</p><p>Click a package to open its details, and choose <strong>Save Changes</strong> after editing:</p><ul><li><strong>Status</strong>: Available, Sold out or Draft. New packages are Draft.</li><li><strong>Total slots</strong> and <strong>Slots sold</strong>: numbers you type. The list shows them as sold out of total.</li><li><strong>Description</strong> and <strong>Benefits</strong>: what the package includes.</li></ul><p>Events doesn't sell packages or count their sales, and a package's status changes nothing outside this screen. Its one use is <strong>From package</strong> in an event's <strong>Sponsor Spots</strong> section, which copies the name, tier, description, benefits, price and total slots into a new spot. A price of 0 copies as On request. The spot doesn't change when you edit the package later.</p><p>The figures across the top show the number of <strong>Packages</strong>, their <strong>Total value</strong> (each price times its total slots), <strong>Slots sold</strong> and how many are <strong>Available</strong>. Filter by status or tier, or search by name or tier. Each row's <strong>⋯</strong> menu has <strong>Edit</strong>, <strong>Duplicate</strong> and <strong>Delete</strong>, which asks you to confirm first.</p><p>Sponsorship packages are separate from the VIP packages sold from an event's packages page; see <a href="/help/events/packages">Packages</a>.</p>$html$,
      '[]',
      null,
      40
    ),
    (
      'sponsor-spots',
      'Event editor',
      'Adding sponsor spots to an event',
      $html$<p>A spot is something a sponsor can take at one event: a tier, a naming right or a placement. To add one, open the event in the event editor, open <strong>Sponsor Spots</strong> and choose <strong>Add spot</strong>. Only <strong>Name</strong> is required.</p><ul><li><strong>Tier</strong>: No tier (the default), Platinum, Gold, Silver, Bronze or Community.</li><li><strong>Price</strong>: leave it empty to show On request.</li><li><strong>Sponsors</strong>: how many sponsors can take the spot. It starts at 1.</li><li><strong>Description</strong>: optional.</li><li><strong>What's included</strong>: type each item and press <code>Enter</code>. The sponsorship page shows them as a checklist.</li><li><strong>Open to requests</strong>: on by default, which lists the spot on the sponsorship page. Turn it off for a spot you fill privately; the spot then shows a Private badge.</li></ul><p>Choose <strong>Add spot</strong> to save it. To start from a template instead, choose <strong>From package</strong> and pick one of the project's sponsorship packages. The button appears once the project has one.</p><p>Everything in <strong>Sponsor Spots</strong> saves as you do it, so there's no Save button. Each spot shows its price and how many of its places are filled. Use the arrows beside a spot to move it up or down: the top spot leads the sponsor strip on the event page. The figures across the top show <strong>Spots filled</strong>, <strong>Still open</strong> and <strong>Committed</strong>, the agreed amounts added up.</p><p>A spot's <strong>⋯</strong> menu has <strong>Edit spot</strong> and <strong>Delete spot</strong>. You can't set <strong>Sponsors</strong> lower than the number of sponsors already in the spot. Deleting asks you to confirm first, and the spot's sponsors stay in your <strong>Sponsors</strong> list.</p>$html$,
      '[]',
      null,
      50
    ),
    (
      'filling-a-spot',
      'Event editor',
      'Filling a spot with a sponsor',
      $html$<p>When you agree a deal, record it by filling the spot. In the event editor's <strong>Sponsor Spots</strong> section, choose <strong>Fill spot</strong> on the spot. The button reads <strong>Full</strong> once every place is taken.</p><ol><li>Check <strong>Spot</strong>. It lists the spots with places left.</li><li>Choose <strong>Existing sponsor</strong> and pick one under <strong>Sponsor</strong>, or choose <strong>New sponsor</strong> and fill in <strong>Company name</strong> (required), <strong>Website</strong>, <strong>Contact name</strong> and <strong>Contact email</strong>. Optional: choose <strong>Upload logo</strong>. A project with no sponsors yet goes straight to a new sponsor.</li><li>Optional: type the <strong>Agreed amount</strong>.</li><li>Pick a <strong>Status</strong>: <strong>Pending</strong> (agreed, not yet settled) or <strong>Confirmed</strong> (settled), the default.</li><li>Optional: write a <strong>Note</strong>. Only your team sees it.</li><li>Choose <strong>Fill spot</strong>.</li></ol><p>A new sponsor is added to the project's <strong>Sponsors</strong> list too, with the agreed amount. Confirmed sponsors appear on the event page; pending ones appear only when <strong>Include pending sponsors</strong> is on in <strong>Sponsor Display</strong>. Amounts and notes never appear publicly. A pending sponsor still takes one of the spot's places.</p><p>Each sponsor in a spot has a <strong>⋯</strong> menu with <strong>Edit</strong>, to change its spot, amount, status or note, and <strong>Remove from spot</strong>, which removes it straight away without asking. Events doesn't email the sponsor when you fill, confirm or remove a spot.</p><p>The event page keeps its own copy of each sponsor's name, logo, website and description, refreshed whenever the event's spots are saved. After you change a sponsor on the <strong>Sponsors</strong> screen, open any spot in the event with <strong>Edit spot</strong> and choose <strong>Save spot</strong> to bring the event page up to date.</p>$html$,
      '[]',
      null,
      60
    ),
    (
      'sponsor-page',
      'Event editor',
      'Setting up the sponsorship page',
      $html$<p>Each event can have a sponsorship page: a public prospectus with its open spots, how to reach you and an interest form. It's at the event page's address followed by <code>/sponsor</code>. To set it up, open the event in the event editor and open <strong>Sponsor Page</strong>.</p><ul><li><strong>Publish</strong>: until <strong>Sponsorship page is live</strong> is on, the page says <strong>Sponsorship isn't open</strong>, even to someone with the link. This switch saves on its own.</li><li><strong>Page copy</strong>: a <strong>Title</strong> (blank uses Sponsor followed by the event's name), a <strong>Subtitle</strong> and an <strong>Introduction</strong>. Turn off <strong>Show prices</strong> to show every spot as On request. <strong>Show taken spots</strong>, on by default, keeps full spots on the page, marked Taken.</li><li><strong>Contact methods</strong>: a <strong>Heading</strong> (Talk to us to start with), <strong>Email</strong>, <strong>Phone</strong>, <strong>WhatsApp</strong> (the number with its country code), a <strong>Booking link</strong> with its <strong>Booking button label</strong> (Book a call), and a <strong>Note</strong>. Anything left blank is hidden.</li><li><strong>Interest form</strong>: <strong>Show the interest form</strong> is on by default. Set the <strong>Form heading</strong> (Register your interest), <strong>Thank-you message</strong>, <strong>Form introduction</strong> and <strong>Consent text</strong>, which adds a checkbox prospects must tick.</li><li><strong>Form questions</strong>: Company, Your name and Email are always asked. Choose <strong>Add question</strong> for more, then set its <strong>Question label</strong> and <strong>Type</strong> (Short text, Email, Paragraph, Dropdown, Checkbox or Number). Separate a dropdown's <strong>Options</strong> with commas. Turn on <strong>Required</strong>, or use <strong>Show when</strong> to ask it only when another answer equals a value.</li></ul><p>Choose <strong>Save page</strong> to keep everything except the live switch. Once the page is live, <strong>View page</strong> opens it in a new tab. The page uses the event's cover image and its page design's fonts and colors.</p>$html$,
      '[]',
      null,
      70
    ),
    (
      'what-prospects-see',
      'Sponsorship page',
      'What prospects see and how they inquire',
      $html$<p>The sponsorship page opens with the title, subtitle and event date over the event's cover image, and a link back to the event page. Then come your introduction, the open spots under <strong>Sponsorship opportunities</strong>, your contact details and the interest form. Spots with <strong>Open to requests</strong> turned off aren't listed. Each spot shows its price, how many places are available, its description and what's included. Prices are shown in US dollars.</p><p>A spot's <strong>Request this spot</strong> button picks that spot in the interest form and scrolls to it. With the form turned off, the button opens an email to your contact <strong>Email</strong> instead, and with neither, there's no button. Full spots show <strong>Taken</strong>.</p><p>On the form, prospects pick a spot under <strong>Spot you're interested in</strong> (or <strong>Not sure yet</strong>), answer the questions and choose <strong>Send</strong>. They then see your thank-you message, and the inquiry arrives in the event's <strong>Sponsor Enquiries</strong> section.</p><p>The page doesn't take payment or reserve a spot: you fill spots yourself in <strong>Sponsor Spots</strong>. Events doesn't email you or the prospect when an inquiry arrives.</p><p>The form only accepts inquiries while the event's visibility isn't Private. On a Private event, the page still shows, but sending fails with <strong>That didn't send. Please try again in a moment.</strong> See <a href="/help/events/events#visibility-and-publishing">Visibility and publishing</a>.</p>$html$,
      '[]',
      null,
      80
    ),
    (
      'sponsor-inquiries',
      'Event editor',
      'Handling sponsor inquiries',
      $html$<p>The event editor's <strong>Sponsor Enquiries</strong> section lists what prospects have sent from the event's sponsorship page, newest first. Each inquiry shows the company, the contact's name and email, the spot they asked about (or Any spot), the date and their answers to your questions. The filter starts on <strong>Open (new + contacted)</strong>; switch it to <strong>All enquiries</strong>, <strong>New</strong>, <strong>Contacted</strong>, <strong>Converted</strong> or <strong>Declined</strong>.</p><ul><li><strong>Reply</strong> opens an email to the prospect and marks a New inquiry Contacted.</li><li><strong>Fill spot</strong> opens the fill dialog with the spot they asked about picked, if it still exists. If a sponsor with the same company name exists, it's picked; otherwise the company, contact name and email are filled in as a new sponsor. Choosing <strong>Fill spot</strong> in the dialog fills the spot and marks the inquiry Converted.</li><li>The <strong>⋯</strong> menu has <strong>Mark contacted</strong>, <strong>Decline</strong>, <strong>Reopen as new</strong> and <strong>Delete</strong>. A converted inquiry keeps only <strong>Delete</strong>.</li></ul><p>Status changes save straight away. <strong>Delete</strong> removes the inquiry at once, without asking, and it can't be restored from Events. Events doesn't notify you of new inquiries, so check this section.</p>$html$,
      '[]',
      null,
      90
    ),
    (
      'sponsor-display',
      'Event editor',
      'Showing sponsors on the event page',
      $html$<p>Confirmed sponsors appear in a Sponsors section on the event page, in spot order. To change how it looks, open the event in the event editor and open <strong>Sponsor Display</strong>. The preview at the top uses sample sponsors until you fill a spot.</p><ul><li><strong>Heading</strong>: Our sponsors to start with. Leave it blank to hide the heading.</li><li><strong>Layout</strong>: <strong>Logo wall</strong> (the default), <strong>Cards</strong>, <strong>Scrolling</strong> (a continuous band) or <strong>List</strong>, which also shows each sponsor's description.</li><li><strong>Grouping</strong>: <strong>By spot</strong> (the default) labels each spot's sponsors; <strong>All together</strong> doesn't.</li><li><strong>Logo size</strong>: Small, Medium (the default) or Large. <strong>Logo colour</strong>: <strong>Full colour</strong> or <strong>Muted until hover</strong>.</li><li><strong>Columns</strong> (3, 4 or 5) for Cards, <strong>Card style</strong> (Plain or Card) for Cards and List, and <strong>Alignment</strong> (Left or Center) for every layout except List.</li><li>Switches: <strong>Feature the top spot</strong> (on: when grouped by spot, the first spot's logos are a size larger), <strong>Show sponsor names</strong> (off), <strong>Show spot names</strong> (on), <strong>Link to sponsors' websites</strong> (on) and <strong>Include pending sponsors</strong> (off).</li></ul><p><strong>Become a sponsor</strong> adds a link under the sponsors, and it's on by default. Pick its <strong>Style</strong> (<strong>Text link</strong>, <strong>Button</strong>, or <strong>Banner</strong> with its own heading and text), where it <strong>Goes to</strong> (<strong>Sponsorship page</strong>, <strong>Contact email</strong> or <strong>Custom link</strong>) and its <strong>Label</strong>. It stays hidden until its destination is set up: a live sponsorship page, a contact email in <strong>Sponsor Page</strong>, or a link. <strong>Show before any sponsor signs</strong> (on) shows it on an event with no sponsors yet.</p><p>Choose <strong>Save display</strong> to keep your changes. <strong>Reset</strong> puts back the defaults, which also need saving. The event page's standard layout includes the Sponsors section; on a customized layout, add the Sponsors block in the page design (see <a href="/help/events/event-page#page-design">Page design</a>).</p>$html$,
      '[]',
      null,
      100
    ),
    (
      'selling-booths',
      'Event editor',
      'Selling exhibitor booths',
      $html$<p>An event sells exhibitor booths from an exhibitor hall drawn on its venue. First choose the event's venue under <strong>Saved venue</strong> in the event editor's <strong>Location & Time</strong> section, and give that venue a hall (see <a href="/help/events/venues">Venues & sourcing</a>). Then open <strong>Exhibitor Floor</strong> in the event editor.</p><ul><li><strong>Exhibitor hall</strong>: one of the venue's halls, or <strong>Not selling booths</strong> (the default).</li><li><strong>Pricing</strong>: <strong>Map each booth to a ticket</strong> (the default) sells each booth at the price of one of the event's tickets. <strong>Use each booth's own price</strong> uses the price set on the hall.</li><li><strong>Order line</strong>: with the booths' own prices, the ticket each exhibitor's order is recorded against. Until you pick one, exhibitors can't buy.</li><li><strong>Hold booths for</strong>: how many minutes a booth stays reserved while an exhibitor checks out, from 1 to 120. It starts at 15.</li></ul><p>With <strong>Map each booth to a ticket</strong>, the <strong>Booth pricing</strong> card lists every booth: pick a ticket for each one. Booths left on <strong>Not sellable</strong> can't be bought. Add the tickets first; see <a href="/help/events/tickets#adding-tickets-to-an-event">Adding tickets to an event</a>.</p><p><strong>Box office</strong> shows the hall with each booth's state and price, and counts the booths sold, held off sale and in total. Click an open booth to hold it off sale, for a sponsor or a deal made elsewhere, and click it again to release it. Sold booths can't be changed here. <strong>Refresh</strong> loads the latest state.</p><p>Everything in <strong>Exhibitor Floor</strong> saves as you change it, and <strong>Hold booths for</strong> saves when you leave the field. Zones and features drawn on the hall show on the map but aren't for sale.</p>$html$,
      '[]',
      null,
      110
    ),
    (
      'buying-a-booth',
      'Checkout',
      'How exhibitors buy a booth',
      $html$<p>Once an event has an exhibitor hall on its <strong>Exhibitor Floor</strong>, checkout on its event page starts with a <strong>Booth</strong> step that shows the hall map. That applies to every checkout from the event page except Express Lane, so a buyer can't continue without picking a booth. If the event also sells seats from a seat map in <strong>Seating</strong>, checkout shows the seat map instead and no booths are sold.</p><p>On the map, the buyer clicks booths to select them. Booths that are sold, held off sale, held by another buyer or not sellable can't be picked. Selected booths are held for the event's <strong>Hold booths for</strong> time, with a countdown. When it runs out, they're released and the buyer picks again. When booths are mapped to tickets, all the booths in one order have to be mapped to the same ticket.</p><p>The buyer chooses <strong>Continue</strong>, fills in their details and pays like any ticket buyer. Going on to payment extends the hold to 40 minutes. The order is recorded against the booth's ticket, one ticket per booth, and appears in <a href="/help/events/orders">Orders</a>. The booth then shows as sold in the event's <strong>Box office</strong>.</p><p>Canceling the order, or refunding it in full, puts its booths back on sale. A partial refund doesn't.</p>$html$,
      '[]',
      null,
      120
    ),
    (
      'floor-plan-and-booths',
      'Floor Plan & Booths',
      'Arranging booths on the floor plan',
      $html$<p><strong>Floor Plan & Booths</strong>, under <strong>Sponsors & Expo</strong>, shows an exhibitor hall's booths on a floor you can rearrange, colored by status. It opens on your newest hall; when there's more than one, pick another from the list at the top. With no hall yet, <strong>Create a hall</strong> makes one named Exhibitor hall, but it isn't attached to a venue, so no event can sell from it. Build halls you want to sell on a venue instead (see <a href="/help/events/venues">Venues & sourcing</a>).</p><ul><li><strong>Add booth</strong> asks for <strong>Booth name / number</strong> (required), <strong>Hall / zone</strong> and <strong>Size</strong> (Standard, Large or Premium). A new booth waits under <strong>Unplaced booths</strong>; click it there to put it on the floor.</li><li>Drag a booth to move it. Click it to edit its <strong>Status</strong> (Available, Reserved or Occupied), <strong>Exhibitor</strong>, <strong>Hall / zone</strong>, <strong>Size</strong>, <strong>Price</strong> and <strong>Notes</strong>.</li><li><strong>Remove from floor</strong> moves the booth back to <strong>Unplaced booths</strong>. <strong>Delete</strong> asks you to confirm first and can't be undone.</li></ul><p>Changes save as you make them: a move when you let go, a text field when you leave it. The figures across the top count the <strong>Booths</strong>, how many are <strong>Placed</strong> and <strong>Occupied</strong>, and the <strong>Floor value</strong> of occupied booths.</p><p>These are the booths events sell, so a booth's name, position, hall, size and price change what exhibitors see on every event selling the hall. Its status and exhibitor don't: a booth marked Reserved or Occupied here, or removed from the floor, is still for sale. To stop an event selling a booth, hold it off sale in that event's <strong>Box office</strong>. Deleting a booth removes it from every event that sells the hall.</p>$html$,
      '[]',
      null,
      130
    ),
    (
      'expo-booths',
      'Expo Booths',
      'The Expo Booths list',
      $html$<p><strong>Expo Booths</strong> is a list of booths and the exhibitors in them, kept for the whole project. It isn't the floor events sell from: those booths belong to exhibitor halls, arranged in <strong>Floor Plan & Booths</strong> or on a venue, and nothing in <strong>Expo Booths</strong> changes them.</p><p>To add a booth, choose <strong>Add booth</strong>. Only <strong>Booth name / number</strong> is required. <strong>Hall / zone</strong> is optional, and <strong>Size</strong> is Standard (the default), Large or Premium. Click a booth to set its <strong>Status</strong> (Available, Reserved or Occupied; new booths are Available), <strong>Exhibitor</strong>, <strong>Price</strong> and <strong>Notes</strong>, then choose <strong>Save Changes</strong>.</p><p>The figures across the top count the <strong>Booths</strong>, how many are <strong>Occupied</strong> and <strong>Available</strong>, and the <strong>Revenue</strong> of occupied booths, worked out from the prices you type. Filter by status or size, or search by booth, hall or exhibitor. Each row's <strong>⋯</strong> menu has <strong>Edit</strong>, <strong>Duplicate</strong> and <strong>Delete</strong>, which asks you to confirm first.</p><p>Outside this screen, the list is used in one place: in <strong>Check-in → Badge Printing</strong>, each booth with an <strong>Exhibitor</strong> gets an Exhibitor badge in that name, in every event's list.</p>$html$,
      '[]',
      null,
      140
    ),
    (
      'sponsor-rooms',
      'Sponsor Rooms',
      'Sponsor rooms',
      $html$<p><strong>Sponsor Rooms</strong> keeps a record of the virtual rooms you plan for sponsors: a virtual booth, lounge, demo room or meeting room. Events doesn't host these rooms or show them to attendees, and a room's status doesn't open or close anything. Its leads and visits are numbers you type.</p><p>To add a room, choose <strong>Add sponsor room</strong>. Only <strong>Room Name</strong> is required. You can also type the <strong>Sponsor</strong>'s name (it isn't linked to <strong>Sponsors</strong>) and pick a <strong>Tier</strong>, Gold to start with. New rooms are Draft, and their type is Virtual booth. Click a room to edit it:</p><ul><li><strong>Details</strong>: <strong>Status</strong> (Draft, Scheduled, Live or Archived), <strong>Sponsor</strong>, <strong>Tier</strong> and <strong>Type</strong>.</li><li><strong>Booth content</strong>: <strong>Description</strong>, <strong>Resources</strong>, <strong>CTA label</strong> and <strong>CTA link</strong>.</li><li><strong>Reps & leads</strong>: <strong>Reps on hand</strong>, <strong>Leads captured</strong> and <strong>Visits</strong>.</li><li><strong>Video</strong>, <strong>Event</strong> and <strong>Banner</strong>: a video link with a preview, the event the room is for, and a banner image. These save straight away. Only the teammate who added the room can upload its banner.</li></ul><p>Choose <strong>Save Changes</strong> to keep edits to the other fields. The list shows each room's sponsor, tier, type, leads and status, and filters by status or tier.</p>$html$,
      '[]',
      null,
      150
    ),
    (
      'hall-missing-from-exhibitor-floor',
      'Troubleshooting',
      'An exhibitor hall isn''t listed on the Exhibitor Floor',
      $html$<p>If the hall you want isn't in the <strong>Exhibitor hall</strong> list of an event's <strong>Exhibitor Floor</strong>, it's because that list only shows halls built on the event's own venue. The section says <strong>Pick a venue first</strong> when the event has no venue, and <strong>This venue has no exhibitor halls</strong> when its venue has none.</p><ol><li>In the event editor's <strong>Location & Time</strong> section, check that <strong>Saved venue</strong> is the venue the hall belongs to. Typing a venue name into <strong>Venue name</strong> instead detaches the saved venue.</li><li>Check that the hall is in that venue's <strong>Exhibitor halls</strong>, under <strong>Venues</strong>.</li><li>A hall made with <strong>Create a hall</strong> on <strong>Floor Plan & Booths</strong> isn't attached to any venue, so no event can sell from it. Build the hall on the venue instead (see <a href="/help/events/venues">Venues & sourcing</a>).</li></ol>$html$,
      '[]',
      null,
      160
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"CalendarDays","label":"Events","href":"/help/events/events"},{"icon":"LayoutTemplate","label":"Event page","href":"/help/events/event-page"},{"icon":"Building2","label":"Venues & sourcing","href":"/help/events/venues"},{"icon":"Ticket","label":"Tickets","href":"/help/events/tickets"},{"icon":"ShoppingBag","label":"Orders","href":"/help/events/orders"},{"icon":"QrCode","label":"Check-in","href":"/help/events/check-in"}]',
      null,
      170
    )
) as v(anchor_id, eyebrow, title, content, links, showcase, sort_order)
cross join (select id from public.docs_pages where slug = 'events/sponsors' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Sponsors & Expo',
    description = 'Sell sponsorship packages, manage sponsors, rooms and expo booths, and lay out the floor.',
    status = 'draft',
    published_at = null
where slug = 'events/sponsors' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'events/sponsors' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Sponsors</li><li>Sponsorship packages</li><li>Sponsor rooms</li><li>Expo booths</li><li>Floor plan and booths</li><li>Sponsorship on an event</li></ul>',
  10
from public.docs_pages p
where p.slug = 'events/sponsors' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
