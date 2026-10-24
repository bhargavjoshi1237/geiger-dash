-- Help events venues page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the events/venues draft outline from
-- 20261024191100_help_events_structure with the full Venues & sourcing guide and publishes it.
-- Written from a survey of C:\Pro\geiger-events (components/internal/screens/venues/*, lib/supabase/venues.js,
-- lib/supabase/seat_maps.js, lib/supabase/hall_maps.js, lib/supabase/storage.js, lib/seating/bowl.js, csv.js and
-- generate.js, components/internal/shared/editor_shell.jsx, map_floor_panel.jsx, map_field.jsx, map_canvas.jsx,
-- venue_chart.jsx, guideline_editor.jsx and records/*, components/internal/screens/events/location_time.jsx,
-- location_picker.jsx, event_map.jsx, event_seating.jsx, event_expo.jsx, seat_offers.jsx, public_page/use_page_data.js,
-- public_page/venue_dialog.jsx, public_page/hero.jsx and public_page/sidebar_cards.jsx, lib/map/geo.js,
-- components/internal/screens/conference/venue_sourcing.jsx, housing_travel.jsx, constants.js and
-- modules/venue_lead.jsx and housing.jsx, lib/venues/*, lib/housing/*, app/api/venues/search, app/api/housing/search,
-- supabase/migrations/20260726194130_venues.sql, 20260726194141_seating.sql and 20260805160757_expo_booths.sql,
-- components/internal/sidebar/sidebar_nav.jsx, geiger-rbac.config.js and geiger-ui.config.js).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set description = 'Keep a book of reusable venues with seat maps and exhibitor halls, use them on events, and find venues, stays and travel options to shortlist.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'events/venues' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'events/venues' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, showcase, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.showcase, v.sort_order
from (
  values
    (
      'adding-a-venue',
      'Basics',
      'Adding a venue',
      $html$<p>To add a venue, choose <strong>Venues</strong> in the sidebar, then <strong>Add venue</strong>. Only <strong>Venue name</strong> is required: without one, Events shows "Give your venue a name first." and keeps the dialog open.</p><ul><li><strong>Venue name</strong>: what the venue is called.</li><li><strong>Type</strong>: Indoor, Outdoor, Hybrid or Virtual. New venues are Indoor.</li><li><strong>City</strong>: optional.</li></ul><p>Choose <strong>Add venue</strong> to save it. The venue joins the top of the list as Active, with its time zone set to London and no capacity yet. Click it to open the venue editor, where you add its address, capacity, amenities, contacts, photos, seat maps and exhibitor halls.</p><p>Venues belong to the project you're in, and your whole team sees the same venues there. By default, <strong>Venues</strong> appears in the sidebar for the Owner, Admin and Manager roles. To change who sees it, see <a href="/help/events/settings#roles-and-permissions">Roles and permissions</a>. Under <strong>Settings → Navigation</strong>, Venues can't be hidden while <strong>Venue Sourcing</strong> still shows in your sidebar, so hide Venue Sourcing first. See <a href="/help/events/settings#navigation">Sidebar navigation</a>.</p>$html$,
      '[]',
      null,
      10
    ),
    (
      'venues-and-events',
      'Concepts',
      'How venues connect to events',
      $html$<p>A <strong>venue</strong> is a reusable record of a place you hold events at: its address, map pin, capacity, amenities, contacts, photos and guidelines. A venue also holds <strong>seat maps</strong> (layouts of sections, rows and seats) and <strong>exhibitor halls</strong> (booth floor plans), built once and reused by every event held there.</p><p>An event uses a venue once you pick it in the event editor's <strong>Location & Time</strong> section. Part of the venue is copied into the event, and part is read from the venue every time:</p><ul><li><strong>Copied when you pick it</strong>: the name, full address, city, time zone, map pin, parking and transit notes, and nearby places. Later changes to the venue don't reach events that already use it, and changing these fields on an event doesn't change the venue.</li><li><strong>Read from the venue</strong>: the venue details attendees open from the event page, the venue's dietary and accessibility guidelines, and the seat maps and exhibitor halls the event's <strong>Seating</strong> and <strong>Exhibitor Floor</strong> sections offer. Changes to these reach every event linked to the venue.</li></ul><p>A venue's status (Active, Inactive or Archived) is a label for your own use: it filters the list and counts toward the figures at the top, and a venue of any status can be picked for an event. Its type is a label too, except that a Virtual venue has no map or pin.</p>$html$,
      '[]',
      null,
      20
    ),
    (
      'venue-list',
      'Venues',
      'The venue list',
      $html$<p>The figures across the top of <strong>Venues</strong> count every venue in the project: <strong>Total venues</strong> (with how many are active), <strong>Total capacity</strong>, <strong>Active</strong> and <strong>Cities</strong> (distinct city names). A venue's capacity is the larger of its seated and standing capacity. Search and filters don't change the figures.</p><p>Venues are listed newest first, with their city, type, capacity and status. Narrow the list with <strong>All Statuses</strong> (Active, Inactive or Archived) and <strong>All Types</strong> (Indoor, Outdoor, Hybrid or Virtual), or type in <strong>Search venues, cities</strong> to match names, addresses, cities and regions. Click a venue to open it in the venue editor.</p><p>Each row's <strong>⋯</strong> menu has <strong>Edit</strong>, <strong>Duplicate</strong> and <strong>Delete</strong>.</p><ul><li><strong>Duplicate</strong> adds a copy with "(copy)" after the name, and makes you its creator. The copy keeps the details, status, address, map pin, notes, capacity, amenities and contacts. It doesn't get the cover image, gallery, guidelines, nearby places, seat maps or exhibitor halls.</li><li><strong>Delete</strong> asks you to confirm first, and a deleted venue can't be restored from Events. Events already linked to it keep the details they copied. On their event pages, the venue details show only the name and address the event saved, and the venue's guidelines no longer appear.</li></ul>$html$,
      '[]',
      null,
      30
    ),
    (
      'the-venue-editor',
      'Venue editor',
      'The venue editor and saving',
      $html$<p>Click a venue in <strong>Venues</strong> to open the venue editor. Its sections are listed on the right on a wide screen, and at the top on a narrow one: <strong>Details</strong>, <strong>Location</strong>, <strong>Capacity & amenities</strong>, <strong>Seat maps</strong>, <strong>Exhibitor halls</strong>, <strong>Contact</strong>, <strong>Dietary & Accessibility</strong> and <strong>Media</strong>. <strong>All venues</strong> at the top takes you back to the list.</p><p>How a change saves depends on where you make it:</p><ul><li><strong>Save Changes</strong>, at the top, saves the fields in Details, Location, Capacity & amenities and Contact. Your edits stay while you move between sections, but leaving the editor without saving discards them, and Events doesn't warn you.</li><li>Amenities save on their own two seconds after your last click, or when you leave the section. Uploading or removing images, and <strong>Nearby amenities</strong> in Location, save straight away. Each of these also saves every other change waiting in the editor.</li><li><strong>Dietary & Accessibility</strong> has its own <strong>Save guidelines</strong> button, and guidelines you haven't saved are lost when you switch sections.</li><li>Seat maps and exhibitor halls save each change as you make it.</li></ul>$html$,
      '[]',
      null,
      40
    ),
    (
      'details-capacity-contact',
      'Venue editor',
      'Details, capacity and contact',
      $html$<p>The venue editor's <strong>Details</strong>, <strong>Capacity & amenities</strong> and <strong>Contact</strong> sections hold the venue's basic facts. Choose <strong>Save Changes</strong> at the top to save them. Amenities are the exception: they save on their own.</p><ul><li><strong>Venue name</strong>, <strong>Type</strong> (Indoor, Outdoor, Hybrid or Virtual) and <strong>Status</strong> (Active, Inactive or Archived).</li><li><strong>Description</strong>: a short summary of the space. Attendees see it in the venue details on the event page.</li><li><strong>Seated capacity</strong> and <strong>Standing capacity</strong>. The venue list uses the larger of the two, and the event page shows both when both are set.</li><li><strong>Spaces / rooms</strong>: how many rooms the venue has. New venues have 1.</li><li><strong>Amenities</strong>: click Wi-Fi, Parking, Wheelchair accessible, Catering, AV / Sound, Stage, Bar, Air conditioning or Outdoor space to turn it on or off. Attendees see the ones that are on in the venue details on the event page.</li><li><strong>Contact name</strong>, <strong>Website</strong>, <strong>Email</strong> and <strong>Phone</strong>. The event page shows the phone, email and website as links, and leaves out the contact name.</li></ul><p>Capacity is information about the room. It doesn't limit how many tickets an event sells.</p>$html$,
      '[]',
      null,
      50
    ),
    (
      'location-and-directions',
      'Venue editor',
      'Location, map and directions',
      $html$<p>The venue editor's <strong>Location</strong> section sets where the venue is. Set the address and pin with one of the three tabs at the top:</p><ul><li><strong>Search</strong>: type an address and pick a result. It fills in the address and drops the pin.</li><li><strong>Drop a pin</strong>: click the map to drop a pin, then drag it to fine-tune. Events fills in the address from the pin.</li><li><strong>Coordinates</strong>: type the <strong>Latitude</strong> and <strong>Longitude</strong>.</li></ul><p>Under <strong>Address</strong>, fill in <strong>City</strong>, <strong>Region / state</strong>, <strong>Postcode</strong>, <strong>Country</strong> and <strong>Timezone</strong>. The time zone is London (GMT+1), the default, New York (GMT-4), Los Angeles (GMT-7), Berlin (GMT+2) or Singapore (GMT+8).</p><p>In <strong>Map & directions</strong>, choose <strong>Nearby amenities</strong> to look up the full address, move the pin to it, and list what's within 800 meters, closest first: public transport, parking, cycling, taxis, EV charging, hotels, and food and drink. It needs an address, saves straight away, and replaces the pin and the previous list. <strong>Parking notes</strong> and <strong>Transit notes</strong> are free text, for permits, nearby stations or step-free access.</p><p>Everything else in Location needs <strong>Save Changes</strong>. An event copies the pin, notes and nearby places when you pick the venue, so set them before you use the venue on events. A Virtual venue has no pin, map or directions, only the address fields.</p>$html$,
      '[]',
      null,
      60
    ),
    (
      'dietary-and-accessibility',
      'Venue editor',
      'Dietary and accessibility guidelines',
      $html$<p>A venue's guidelines are notes for attendees, such as a step-free entrance or an allergen policy, shown on the event page of every event linked to the venue. To add one, open <strong>Dietary & Accessibility</strong> in the venue editor and choose <strong>Add guideline</strong>.</p><ul><li><strong>Category</strong>: Dietary (the default) or Accessibility.</li><li><strong>Guideline</strong>: the note itself. A guideline left empty doesn't appear on the event page.</li><li>The box underneath holds optional detail, shown beneath the guideline.</li></ul><p>Use the arrows beside a guideline to move it up or down, and the trash icon to remove it. Choose <strong>Save guidelines</strong> to save the list. <strong>Save Changes</strong> doesn't save guidelines, and changes you haven't saved are lost when you switch sections.</p><p>On the event page, the venue's guidelines appear on the <strong>Dietary & Accessibility</strong> card, before the event's own guidelines. They're read from the venue each time the page opens, so a change here reaches every linked event.</p>$html$,
      '[]',
      null,
      70
    ),
    (
      'cover-image-and-gallery',
      'Venue editor',
      'Cover image and gallery',
      $html$<p>The venue editor's <strong>Media</strong> section holds the venue's photos. Choose <strong>Upload a cover image</strong> for the main image, or <strong>Add photos</strong> to add one or more photos to the gallery. Only image files upload, and Events shrinks images over 500 KB before uploading them.</p><p>Uploads save straight away. Once a cover is set, <strong>Replace</strong> swaps it and <strong>Remove</strong> clears it. To remove a gallery photo, hover over it and click the trash icon. Removing happens straight away, without asking.</p><p>Only the teammate who created a venue can upload its images, including the floor plan images of its exhibitor halls. For everyone else the cover and gallery buttons are disabled. Duplicating a venue makes you the creator of the copy, which starts without photos.</p><p>Attendees see the cover image at the top of the venue details on the event page. The event page doesn't show the gallery.</p>$html$,
      '[]',
      null,
      80
    ),
    (
      'seat-maps',
      'Seat maps',
      'Seat map configurations',
      $html$<p>A <strong>seat map configuration</strong> is one layout of a venue's room, such as an end-stage concert or banquet rounds, made of sections, rows and seats. A venue can have several, and an event's <strong>Seating</strong> section sells from one of them. To create one, open <strong>Seat maps</strong> in the venue editor and choose <strong>New configuration</strong>.</p><ul><li><strong>Name</strong>: required. Without one, Events shows "Give the configuration a name first."</li><li><strong>Status</strong>: Draft (the default), Active or Archived.</li></ul><p>Choose <strong>Create</strong>, and the configuration opens in its floor editor, with a stage across the top and no sections yet. <strong>All configurations</strong> takes you back to the list.</p><p>Configurations are listed newest first. Click one to open it. Its <strong>⋯</strong> menu has <strong>Open Editor</strong>, <strong>Mark draft</strong>, <strong>Mark active</strong> or <strong>Mark archived</strong> (whichever it isn't already), and <strong>Delete</strong>, which removes the configuration straight away, without asking. A deleted configuration is no longer offered in events' <strong>Seating</strong> sections.</p><p>The status is a label: an event's <strong>Seating</strong> section offers every configuration on its venue, whatever its status. For choosing a configuration, pricing its sections and holding seats on an event, see <a href="/help/events/tickets">Tickets</a>.</p>$html$,
      '[]',
      null,
      90
    ),
    (
      'drawing-a-seat-map',
      'Seat maps',
      'Drawing sections, rows and seats',
      $html$<p>In a seat map's floor editor, choose <strong>Add section</strong> to add a block of seats. It starts as a seated section named Section 1, Section 2 and so on, with 8 rows of 12 seats. Drag a section to move it, and drag the handle at its bottom-right corner to resize it. Events lays its chairs out again to fit.</p><p>Click a section to edit it in the panel beside the floor, and click an empty part of the floor to go back to the floor settings. Every change saves on its own:</p><ul><li><strong>Name</strong>, and <strong>Type</strong>: Seated (individual chairs) or General admission zone. A GA zone has a <strong>Capacity</strong> instead of chairs.</li><li><strong>Facing</strong>: the section's rotation in degrees clockwise. 0 faces up.</li><li><strong>Rows</strong>, <strong>Seats per row</strong>, <strong>Row labels</strong> (A, B, C… or 1, 2, 3…) and <strong>First row</strong>, the label to start from.</li><li><strong>Seat numbering</strong>: <strong>Continental (1 → N across)</strong>, or <strong>Odd / even from centre</strong>, with odd numbers on one side and even on the other, counting out from the middle.</li><li><strong>Curve</strong> (0 to 90 degrees of bow), <strong>Rake</strong> (0 to 100, more space between rows toward the back) and <strong>Aisles after seat</strong> (seat numbers separated by commas, like <code>4, 8</code>).</li></ul><p>Rows, seats, first row, curve, rake, aisles and facing apply when you click away from the field, and <strong>Row labels</strong> and <strong>Seat numbering</strong> apply the moment you pick one. Events then rebuilds the section's chairs. The trash icon at the top of the panel deletes the section and its seats straight away, without asking.</p><p>With a section selected, its chairs show on the floor. Click a chair to change its type: standard, wheelchair, companion, obstructed, house, then back to standard. The figures at the top show <strong>Seats</strong>, <strong>GA capacity</strong>, <strong>Accessible</strong> (wheelchair and companion seats) and <strong>Total capacity</strong>. When buyers choose seats, their <strong>Accessible</strong> filter shows only wheelchair and companion seats.</p>$html$,
      '[]',
      null,
      100
    ),
    (
      'generating-a-bowl',
      'Seat maps',
      'Generating a bowl or importing seats',
      $html$<p>To lay out a whole room at once, choose <strong>Generate bowl</strong> in a seat map's floor editor. Pick a <strong>Shape</strong>, set its sizes, check the preview and the count of sections and seats, then choose <strong>Generate</strong>. On a map that already has sections, generating replaces all of them, and the dialog warns you first.</p><ul><li><strong>Oval stadium</strong>, <strong>Rectangular arena</strong> and <strong>Theatre horseshoe</strong> ring the central feature with sections. Set <strong>Tiers</strong>, <strong>Per side</strong>, <strong>Tier depth %</strong>, <strong>Rows per section</strong> and <strong>Seats per row</strong>. Sections are numbered by tier: 101, 102 and on in the first, 201 and on in the second. The horseshoe leaves the top open for the stage.</li><li><strong>Banquet rounds</strong> sets out <strong>Tables</strong> in a grid around the central floor, named Table 1, Table 2 and on, each with <strong>Seats per table</strong>.</li></ul><p>A box in the dialog places a central feature that suits the shape, such as a pitch for an oval stadium. It's selected for you when the current feature leaves no room for the shape. When fewer tiers fit than you asked for, the dialog says how many and suggests a smaller tier depth.</p><p>To bring in real row and seat labels, choose <strong>Import CSV</strong> and paste a CSV whose header row has <code>section</code>, <code>row</code> and <code>seat</code> columns. An optional <code>kind</code> column marks wheelchair, companion, obstructed or house seats. Events adds a section for each section name, stacked down the floor, and places the seats. Existing sections stay. Lines missing a value, and repeated seats, are skipped, and without all three columns nothing imports.</p><p><strong>Rebuild seats</strong> lays every seated section's chairs out again from its position and layout. Once a section has seats sold, comped or held off sale on an event, Events doesn't rebuild its chairs: changes to its layout, facing or position, <strong>Rebuild seats</strong> and <strong>Generate bowl</strong> stop with a message to release those seats from the event's box office first.</p>$html$,
      '[]',
      null,
      110
    ),
    (
      'exhibitor-halls',
      'Exhibitor halls',
      'Exhibitor halls and booths',
      $html$<p>An <strong>exhibitor hall</strong> is a booth floor plan of a venue, such as one hall or two halls combined. An event's <strong>Exhibitor Floor</strong> section sells booths from one of them. To create one, open <strong>Exhibitor halls</strong> in the venue editor and choose <strong>New hall</strong>. Only the <strong>Name</strong> is required, and the <strong>Status</strong> is Draft (the default), Active or Archived. Choose <strong>Create</strong> to open the hall's floor editor.</p><p>Halls are listed newest first. Each one's <strong>⋯</strong> menu has <strong>Open editor</strong>, options to mark it draft, active or archived, and <strong>Delete</strong>, which removes it straight away, without asking. The status is a label: an event's <strong>Exhibitor Floor</strong> section offers every hall on its venue.</p><p>In the floor editor, choose <strong>Add booth</strong> to place a booth, coded B1, B2 and so on. Drag a booth to move it, and drag its bottom-right handle to resize it. Click a booth to edit it. Every change saves on its own:</p><ul><li><strong>Type</strong>: Booth (sellable), Zone, or Feature (entrance, cafe…). Zones and features mark the floor and never sell.</li><li><strong>Code</strong>, <strong>Hall / zone</strong> and <strong>Name</strong>. Each code can be used once in a hall.</li><li><strong>Size class</strong> (Standard, Large, Premium, Island or Corner) and <strong>Price</strong>, for booths. An event uses the price when its Exhibitor Floor is set to each booth's own price.</li><li><strong>Facing</strong>: rotation in degrees clockwise.</li><li><strong>On the floor</strong>: Visible or Hidden. Hidden booths are neither shown nor sold.</li></ul><p>The trash icon deletes the booth straight away, without asking. The figures at the top count visible sellable <strong>Booths</strong>, <strong>Halls</strong> (distinct hall or zone names), their <strong>Floor value</strong> if every booth sells, and <strong>Furniture</strong> (zones and features). For selling booths on an event, see <a href="/help/events/sponsors">Sponsors & Expo</a>.</p>$html$,
      '[]',
      null,
      120
    ),
    (
      'adding-a-block-of-booths',
      'Exhibitor halls',
      'Adding a block of booths',
      $html$<p>To lay out rows of identical booths at once, choose <strong>Add block</strong> in an exhibitor hall's floor editor. Set up the block, check the number of booths and their total value at the bottom, then choose the button that adds them, such as <strong>Add 24 booths</strong>.</p><ul><li><strong>Rows</strong> and <strong>Columns</strong>: 4 and 6 to start with.</li><li><strong>Code prefix</strong> and <strong>Numbers start at</strong>: codes run A1, A2, A3 and on, along each row and then down. To continue an earlier block, start the numbers where it left off.</li><li><strong>Size</strong>, <strong>Price</strong> and <strong>Hall / zone</strong>: set on every booth in the block.</li><li><strong>Width %</strong> and <strong>Height %</strong>: each booth's size, 8 and 6 to start with.</li><li><strong>Aisle X %</strong> and <strong>Aisle Y %</strong>: the gaps between columns and between rows, 3 and 4 to start with.</li></ul><p>The block lands near the top-left corner of the floor. Drag booths afterwards to match the real hall. Codes must be unique within a hall: if any code in the block is already used, Events adds none of the booths and asks you to check the codes.</p>$html$,
      '[]',
      null,
      130
    ),
    (
      'using-a-venue-on-an-event',
      'Event editor',
      'Using a venue on an event',
      $html$<p>To hold an event at a saved venue, open the event in the event editor, open <strong>Location & Time</strong>, and choose the venue under <strong>Saved venue</strong>. That card appears once the project has a venue, and lists every venue in the project. Events saves the choice straight away and copies the venue's details into the event:</p><ul><li>The venue's name, full address, city and time zone.</li><li>Its map pin, nearby places, and parking and transit notes, which fill the event's <strong>Map & Directions</strong> section. The transit notes become <strong>Extra transport notes</strong>.</li></ul><p>Change any copied field to override it for this event only. Choosing <strong>Detach</strong>, or typing a different <strong>Venue name</strong>, unlinks the venue and keeps the copied details. Copied fields don't follow later changes to the venue. To copy its current details, choose <strong>Detach</strong>, then pick the venue again.</p><p>While the event is linked to the venue, its <strong>Seating</strong> section offers the venue's seat maps and its <strong>Exhibitor Floor</strong> section offers the venue's exhibitor halls. Without a linked venue, both sections ask you to pick one first. For selling seats see <a href="/help/events/tickets">Tickets</a>, for selling booths see <a href="/help/events/sponsors">Sponsors & Expo</a>, and for the rest of <strong>Location & Time</strong> see <a href="/help/events/events">Events</a>.</p>$html$,
      '[]',
      null,
      140
    ),
    (
      'venue-on-the-event-page',
      'Event page',
      'What attendees see of a venue',
      $html$<p>When an event is linked to a saved venue, the venue name beside the date and time at the top of its event page is a link. Clicking it opens the venue's details, read from the venue each time it opens:</p><ul><li>The name, type, and city with region or country.</li><li>The cover image and description.</li><li>The address, city, postcode and country.</li><li>The capacity: seated and standing separately when both are set, otherwise the larger one.</li><li>The amenities that are turned on.</li><li>The transit notes, under <strong>Getting there</strong>, and the parking notes.</li><li>The phone, email and website, as links.</li><li><strong>Get directions</strong>, which opens Google Maps at the venue's pin, or at its address when it has no pin.</li></ul><p>These details come from the venue, so an address you changed on the event itself doesn't show here. The venue's dietary and accessibility guidelines appear on the event page's <strong>Dietary & Accessibility</strong> card, before the event's own. An event that isn't linked to a venue shows its venue name as plain text, with no details to open.</p>$html$,
      '[]',
      null,
      150
    ),
    (
      'venue-sourcing',
      'Venue Sourcing',
      'Finding and shortlisting venues',
      $html$<p>To find new venues, choose <strong>Sourcing → Venue Sourcing</strong> in the sidebar. On the <strong>Discover</strong> tab, type a city or area, pick a type and a distance, and choose <strong>Search</strong>. Before your first search, buttons search London, Amsterdam, New York, Austin, Berlin or Paris in one click.</p><ul><li>Types: All Venue Types (the default), Conference & convention, Hotel & resort, Theatre & arts, Stadium & arena, Community & hall or Restaurant & banquet.</li><li>Distance: within 2 km, 5 km (the default), 10 km or 25 km of the place you searched.</li></ul><p>Results come from OpenStreetMap, up to 40 at a time, listed beside a map with their category, address, phone and website where OpenStreetMap has them. Hover over a result to highlight its pin, or click a pin to highlight its result. <strong>Shortlist</strong> saves a venue's name and city as a lead on the <strong>Pipeline</strong> tab, with the Shortlisted status. Events doesn't check for leads you already have, so shortlisting a place again in a later visit adds a second lead.</p><p>The <strong>Pipeline</strong> lists leads newest first, with figures for <strong>Leads</strong>, <strong>Shortlisted</strong>, <strong>Booked</strong> and <strong>Avg quote</strong>. <strong>Add venue lead</strong> adds one by hand. Click a lead to edit its <strong>Status</strong> (Shortlisted, Contacted, Quoted, Booked or Rejected), <strong>City</strong>, <strong>Capacity</strong>, <strong>Quoted price</strong>, <strong>Rating</strong> (1 to 5), contact and notes, then choose <strong>Save Changes</strong>. Each row's <strong>⋯</strong> menu has <strong>Edit</strong>, <strong>Duplicate</strong> and <strong>Delete</strong>, and Events asks before deleting.</p><p>The pipeline is a record for your team. Events doesn't contact or book venues, and a lead never becomes a venue in <strong>Venues</strong>, even once it's Booked: add it there yourself. By default, <strong>Sourcing</strong> appears in the sidebar for the Owner, Admin and Manager roles. To change who sees it, see <a href="/help/events/settings#roles-and-permissions">Roles and permissions</a>.</p>$html$,
      '[]',
      null,
      160
    ),
    (
      'housing-and-travel',
      'Housing & Travel',
      'Finding stays and tracking room blocks',
      $html$<p>To find places for attendees to stay, choose <strong>Sourcing → Housing & Travel</strong> in the sidebar. On the <strong>Discover</strong> tab, type a city or area, pick a type and a distance, and choose <strong>Search</strong>.</p><ul><li>Types: All Stays (the default), Hotels & Motels, Hostels & Guesthouses, Apartments & chalets, Airports or Rail stations. Airport searches reach at least 120 km, and rail station searches at least 20 km.</li><li>Distance: within 2 km, 5 km (the default), 10 km, 25 km or 50 km.</li></ul><p>Results come from OpenStreetMap, up to 60 at a time, listed beside a map with their address, star rating, airport code, phone and website where OpenStreetMap has them. <strong>Shortlist</strong> saves a result as an option on the <strong>Pipeline</strong> tab, with the Available status and its website, or its OpenStreetMap page, as the booking link.</p><p>The <strong>Pipeline</strong> lists options newest first. <strong>Add option</strong> adds one by hand. Click an option to edit its <strong>Type</strong> (Hotel, Apartment or Transport), <strong>Status</strong> (Available, Booked or Full), <strong>City</strong>, <strong>Address</strong>, <strong>Rate / night</strong>, <strong>Rooms blocked</strong>, <strong>Rooms booked</strong>, <strong>Booking link</strong> and <strong>Notes</strong>, then choose <strong>Save Changes</strong>. Filter by status or type, and use each row's <strong>⋯</strong> menu to edit, duplicate or delete an option. Events asks before deleting.</p><p>The figures at the top add up <strong>Rooms blocked</strong> and <strong>Rooms booked</strong> across all options, and <strong>Occupancy</strong> is booked rooms as a share of blocked ones. Every figure is one you type: Events doesn't book rooms, update the counts or show options to attendees. By default, <strong>Sourcing</strong> appears in the sidebar for the Owner, Admin and Manager roles. To change who sees it, see <a href="/help/events/settings#roles-and-permissions">Roles and permissions</a>.</p>$html$,
      '[]',
      null,
      170
    ),
    (
      'floor-and-canvas',
      'Reference',
      'Floor settings and canvas controls',
      $html$<p>The seat map and exhibitor hall floor editors share their floor settings. They show in the panel beside the floor when nothing is selected, as <strong>Floor</strong> for a seat map and <strong>Hall floor</strong> for a hall. Each change saves straight away.</p><ul><li><strong>Canvas shape</strong>: Wide (16:10), Widescreen (16:9), Classic (4:3), Square or Portrait. Match the real room so the plan isn't distorted. Seat maps start Wide and halls start Classic.</li><li><strong>Central feature</strong>: Stage, Pitch, Court, Rink, Ring, Runway, Open floor or None, with a <strong>Label</strong> and its <strong>Left %</strong>, <strong>Top %</strong>, <strong>Width %</strong> and <strong>Height %</strong>. Seat maps start with a stage across the top, and halls with none.</li><li><strong>Floor plan image</strong>: upload the venue's own plan. In an exhibitor hall, it's drawn under the booths so you can place them on top, and <strong>Plan opacity</strong> fades it from 5% to 100% (60% to start with). The trash icon beside it removes it.</li></ul><p>To move around the floor, drag an empty area to pan, and scroll or pinch to zoom. The buttons in the bottom-right corner zoom in, zoom out and fit the whole floor back in view. A section is at least 4% of the floor wide and tall, and a booth at least 2%. With a section or booth focused, <code>Enter</code> or <code>Space</code> selects it.</p>$html$,
      '[]',
      null,
      180
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"CalendarDays","label":"Events","href":"/help/events/events"},{"icon":"PanelsTopLeft","label":"Event page","href":"/help/events/event-page"},{"icon":"Ticket","label":"Tickets","href":"/help/events/tickets"},{"icon":"Store","label":"Sponsors & Expo","href":"/help/events/sponsors"},{"icon":"ClipboardList","label":"Registrations","href":"/help/events/registrations"},{"icon":"Settings","label":"Settings","href":"/help/events/settings"}]',
      null,
      190
    )
) as v(anchor_id, eyebrow, title, content, links, showcase, sort_order)
cross join (select id from public.docs_pages where slug = 'events/venues' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Venues & sourcing',
    description = 'Keep a book of reusable venues, source new ones, and plan housing and travel.',
    status = 'draft',
    published_at = null
where slug = 'events/venues' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'events/venues' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Adding a venue</li><li>The venue editor</li><li>Using a venue on an event</li><li>Venue sourcing</li><li>Housing and travel</li></ul>',
  10
from public.docs_pages p
where p.slug = 'events/venues' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
