-- Help property properties page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the property/properties draft outline from
-- 20261024191900_help_property_structure with the full Properties & units guide (the sidebar's Property group) and
-- publishes it.
-- Written from a survey of C:\Pro\geiger-property (components/internal/screens/{properties,units,buildings,portfolios,
-- floor_plans,unit_types,amenities,media}/*, components/internal/screens/entity/{entity_list_screen,entity_detail_screen,
-- fields_form}.jsx, entity/shared_sections/*, entity/sections/policy_section.jsx, components/internal/shared/wizard_dialog.jsx,
-- lib/supabase/{property_storage,amenity_reservations}.js, lib/image/compress.js).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Properties & units',
    description = 'Set up properties and their units, group them into buildings and portfolios, and keep floor plans, unit types, amenities and media in one place.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'property/properties' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'property/properties' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.sort_order
from (
  values
    (
      'creating-a-property',
      'Basics',
      'Creating a property',
      $html$<p>To create a property, choose <strong>Property → Properties</strong> in the sidebar, then <strong>New Property</strong>. Only <strong>Property name</strong> is required: if it's empty, Property shows "Give this property a name." and keeps the dialog open.</p><ul><li><strong>Type</strong>: Single-family, Multi-family, Apartment, Condo, Townhome, HOA community, Commercial, Mixed-use, Student housing, Senior living or Manufactured housing. New properties are Multi-family, or Commercial when the list is showing <strong>Commercial &amp; mixed</strong>.</li><li><strong>Street address</strong> and <strong>City</strong>.</li><li><strong>Status</strong>: Draft, Active or Vacant. New properties start as Draft.</li></ul><p>Choose <strong>Create Property</strong>. A new property has no units. Add them in bulk with <strong>Actions → Add units</strong> in the property's editor, or one at a time from <strong>Property → Units</strong>. Everything else, such as the state, size, owners and rules, is set in the editor.</p>$html$,
      '[]',
      10
    ),
    (
      'statuses-and-types',
      'Concepts',
      'Property statuses and types',
      $html$<p>A property's status is one of Active, Vacant, Maintenance, Draft, Off-market, Inactive or Archived. Set it in the editor's <strong>Settings</strong> section, or with the <strong>Actions</strong> menu: <strong>Activate</strong>, <strong>Deactivate</strong> (sets Inactive), <strong>Archive</strong> and <strong>Restore</strong> (sets Active).</p><p>Archiving asks for an optional reason. Archived properties keep their history but drop out of the figures at the top of the list, so use it for a property you sold or stopped managing rather than deleting it.</p><p>The type decides two things. Condo, Townhome and HOA community properties carry an association, which adds an <strong>Association</strong> section to the editor (you can also turn one on for other types). Commercial and Mixed-use properties appear in the list's <strong>Commercial &amp; mixed</strong> view; every other type is residential.</p>$html$,
      '[]',
      20
    ),
    (
      'property-list',
      'Properties',
      'The property list',
      $html$<p>The figures at the top of <strong>Properties</strong> leave out archived properties.</p><ul><li><strong>Properties</strong>: how many there are, and how many are Active.</li><li><strong>Units</strong>: their units, and how many aren't occupied.</li><li><strong>Occupancy</strong>: the share of units that are Occupied or on Notice.</li><li><strong>Rent roll</strong>: monthly rent. For each property it's the rent on its active leases, or the market rent of its occupied units when it has no active lease.</li></ul><p>Narrow the list with the view menu (<strong>All properties</strong>, <strong>Residential</strong>, <strong>Commercial &amp; mixed</strong>, <strong>Associations</strong> or <strong>Archived</strong>) and the status filter, or search by name, address, city, state, ZIP code, type and portfolio. <strong>Clear</strong> resets them all.</p><p>Each row shows the property's address, status, type, portfolio, units, occupancy and rent roll. Lists show 25 rows a page; switch to 10, 50 or 100 at the bottom. Click a row to open the property.</p>$html$,
      '[]',
      30
    ),
    (
      'property-editor',
      'Properties',
      'The property editor',
      $html$<p>A property's editor lists its sections on the right, in groups. Type in <strong>Search sections</strong> to find one.</p><ul><li><strong>Property</strong>: Details, Construction &amp; Systems, Units, Buildings, Amenities, Floor Plans, Photos &amp; Media and Marketing.</li><li><strong>Money</strong>: Ledger (every posting tagged to the property), Banking &amp; Accounting, Rent &amp; Market, Rent &amp; Payment Rules, and Leasing &amp; Deposits.</li><li><strong>People</strong>: Owners, Management Agreement, Team &amp; Contacts, Preferred Vendors, and Association for association types.</li><li><strong>Operations</strong>: Leases, Work Orders and Listings on the property, Maintenance Rules, Assets, Keys &amp; Access, and Meters &amp; Utilities.</li><li><strong>Risk &amp; compliance</strong>: Insurance and Compliance.</li><li><strong>Files &amp; history</strong>: Documents, Notes, Activity, Custom Fields and Settings.</li></ul><p>Text, number and date fields save when you leave the field, and choices save as soon as you pick them. <strong>Save Changes</strong> at the top saves anything you're still typing, and reads <strong>Saved</strong> when nothing is waiting. If a save fails, Property shows "Couldn't save that change." and puts the old value back.</p><p><strong>Activity</strong> records each change, and you can add a note to the timeline there. <strong>Custom Fields</strong> shows the fields your team defines in <strong>Settings → Custom Fields</strong>.</p>$html$,
      '[]',
      40
    ),
    (
      'rules-and-policies',
      'Properties',
      'Rent, leasing and maintenance rules',
      $html$<p>A property's rules (due dates, late fees and payment methods, leasing and deposit defaults, maintenance approval limits and management fees) start from your company defaults in <strong>Settings → Fees &amp; Policies</strong> (see <a href="/help/property/settings#fees-and-policies">Fees and policies</a>). The editor's <strong>Rent &amp; Payment Rules</strong>, <strong>Leasing &amp; Deposits</strong> and <strong>Maintenance Rules</strong> sections show each rule's current value and where it comes from: <strong>Inherited · Company default</strong>, or <strong>Overridden</strong>.</p><p>To change a rule for one property, choose <strong>Override</strong> beside it. That copies the company value into the property so you can edit it. The reset arrow beside an overridden rule drops the override, and the property follows the company default again. A lease can override its property's rules the same way.</p>$html$,
      '[]',
      50
    ),
    (
      'property-actions',
      'Properties',
      'Property actions and owners',
      $html$<p>The <strong>Actions</strong> menu at the top of a property's editor holds:</p><ul><li><strong>Add units</strong>: creates units in bulk (see "Adding units" on this page).</li><li><strong>Assign owner</strong>: links an owner from <strong>People → Owners</strong>. <strong>Owner</strong> and <strong>Ownership</strong> (a percentage above 0 and up to 100) are required. <strong>Primary owner (receives statements)</strong> starts on, and <strong>Owned since</strong> starts at today. Leave <strong>Owned until</strong> blank while they still own it.</li><li><strong>Sync unit count</strong>: recounts the property's units and saves the number.</li><li><strong>Activate</strong>, <strong>Deactivate</strong>, <strong>Archive</strong> and <strong>Restore</strong>, depending on the current status.</li><li><strong>Duplicate</strong> and <strong>Delete</strong>.</li></ul><p>A property has one primary owner: making someone primary takes it from the others. The <strong>Owners</strong> section adds, edits and removes ownership shares, and its <strong>Allocation</strong> meter warns when the active shares don't add up to 100%.</p><p><strong>Duplicate</strong> makes a copy named "(copy)" that starts as Draft. <strong>Delete</strong> appears only if your role includes <strong>Delete records</strong>. Property asks you to confirm, and a deleted property can't be restored from Property. The same <strong>Duplicate</strong> and <strong>Delete</strong> are in each row's <strong>⋯</strong> menu on the list, along with <strong>Edit</strong>.</p>$html$,
      '[]',
      60
    ),
    (
      'adding-units',
      'Units',
      'Adding units',
      $html$<p>To add one unit, choose <strong>Property → Units</strong>, then <strong>New Unit</strong>. Only <strong>Unit label</strong> is required. Pick its <strong>Property</strong>, and optionally a <strong>Unit type</strong>, which fills in that type's bedrooms, bathrooms, size, market rent, deposit and floor plan. New units start as Vacant.</p><p>To add many at once, open a property (or a building) and choose <strong>Actions → Add units</strong>. The dialog has three steps:</p><ol><li><strong>Numbering</strong>: <strong>How many units</strong> (1 to 200, 10 to start), <strong>Start number</strong> (101 to start), an optional <strong>Label prefix</strong> and <strong>Label suffix</strong>, <strong>Increment by</strong>, <strong>Floor</strong> and, from a property, the <strong>Building</strong>. Labels are prefix, number and suffix, like <code>A-101</code>.</li><li><strong>Specs</strong>: an optional unit type, then bedrooms and bathrooms (1 each to start), square feet, market rent, deposit and <strong>Initial status</strong> (Vacant to start).</li><li><strong>Review</strong>: the labels Property will create. Choose <strong>Create Units</strong>.</li></ol><p>Labels that already exist on the property are skipped, and the property's unit count updates to match. Adding units from a building requires the building to belong to a property first.</p>$html$,
      '[]',
      70
    ),
    (
      'unit-statuses',
      'Concepts',
      'Unit statuses',
      $html$<p>A unit's status is one of these:</p><ul><li><strong>Occupied</strong> and <strong>Notice</strong>: someone lives there; Notice means they're leaving. Both count as occupied.</li><li><strong>Vacant</strong>: empty. Its ready status (Not ready, In progress or Ready) says whether it can be shown.</li><li><strong>Make-ready</strong>: being turned for the next resident.</li><li><strong>Down</strong>: offline, with a reason such as Renovation, Damage, Pest treatment, Legal hold or Code violation.</li><li><strong>Non-revenue</strong>: used as a model, office, storage, employee unit or guest suite.</li><li><strong>Draft</strong>: not set up yet.</li></ul><p>Non-revenue units are left out of occupancy and rent roll everywhere they're added up. Most status changes come from the unit's <strong>Actions</strong> menu or from leasing and maintenance work, and you can also set the status in the editor's <strong>Revenue Status</strong> or <strong>Settings</strong> section.</p>$html$,
      '[]',
      80
    ),
    (
      'units-list',
      'Units',
      'The units list',
      $html$<p>The figures at the top of <strong>Units</strong> count every unit across your properties.</p><ul><li><strong>Units</strong>: the total, with how many are offline or non-revenue.</li><li><strong>Occupancy</strong>: Occupied and Notice units as a share of revenue units.</li><li><strong>Vacant</strong>: Vacant and Make-ready revenue units, with the average days they've been empty.</li><li><strong>Market rent roll</strong>: market rent across revenue units, and the rent on their live leases each month.</li></ul><p>The view menu offers <strong>All units</strong>, <strong>Vacant &amp; make-ready</strong>, <strong>Occupied</strong>, <strong>Offline &amp; non-revenue</strong> and <strong>Furnished / mid-term</strong>. Search matches the unit label, occupant, floor and property.</p><p>Each row shows the unit's property and size, its status, and either the occupant and lease end date or when it's available and how long it's been vacant. The last column shows market rent and the leased rent.</p>$html$,
      '[]',
      90
    ),
    (
      'unit-actions',
      'Units',
      'Unit actions',
      $html$<p>A unit's <strong>Actions</strong> menu shows what fits its status:</p><ul><li><strong>Change market rent</strong>: a new rent above zero, an effective date and a reason. The change is kept in the unit's rent history under <strong>Rent &amp; Pricing</strong>.</li><li><strong>Mark ready</strong>: sets the unit Vacant and Ready. <strong>Mark vacant</strong> clears the occupant; ended leases stay in its occupancy history.</li><li><strong>Start turn</strong>: creates a unit turn in <strong>Maintenance → Unit Turns</strong> and sets the unit to Make-ready. A turn name and target ready date are required.</li><li><strong>Create listing</strong>, <strong>New work order</strong> and <strong>Schedule inspection</strong>: create that record for the unit in its own area.</li><li><strong>Apply unit type specs</strong>: copies the unit type's bedrooms, bathrooms, deposit, size and floor plan, and its market rent if the unit has none.</li><li><strong>Take offline (down)</strong> and <strong>Bring back online</strong>, which returns the unit as Make-ready.</li><li><strong>Make non-revenue</strong> and <strong>Return to revenue</strong>, which sets it Vacant.</li></ul>$html$,
      '[]',
      100
    ),
    (
      'keys-codes-meters',
      'Units',
      'Keys, access codes, meters and assets',
      $html$<p>Units, buildings and properties keep lists of the physical things you manage. Each list has its own add button, and every entry can be edited or removed.</p><ul><li><strong>Smart-lock Codes</strong> (on a unit): a label, a six-digit code Property generates (edit it if your lock needs a set code), who it's for (Lease, Showing, Vendor or Staff), valid dates and a status of Active, Expired or Revoked. An Active code past its end date shows as Expired. Property stores the code; it doesn't program the lock.</li><li><strong>Keys</strong>: a key tag, type, copies, who holds it and when it's due back, with a status of In office, Checked out, Lost or Retired.</li><li><strong>Meters</strong>: the utility, meter and account numbers, provider, last reading and who it's billed to (Tenant, Owner, RUBS allocation or Included in rent).</li><li><strong>Assets</strong>: appliances and equipment with brand, model, serial number, warranty and service dates, and a status of In service, Needs repair or Retired.</li></ul><p>A unit's <strong>Access &amp; Instructions</strong> section holds entry instructions for residents and vendors, lockbox, gate and alarm codes, and its permission-to-enter rule.</p>$html$,
      '[]',
      110
    ),
    (
      'buildings',
      'Buildings',
      'Buildings',
      $html$<p><strong>Property → Buildings</strong> holds the buildings and blocks within your properties. Choose <strong>New Building</strong>: only <strong>Building name</strong> is required. Pick its <strong>Property</strong>, a <strong>Block code</strong>, a <strong>Structure</strong> (Low-rise, Mid-rise, High-rise, Townhome, Garden, Detached or Podium) and a <strong>Status</strong> (Active, Under construction or Draft; Active to start).</p><p>A building's <strong>Actions</strong> menu has <strong>Add units</strong>, which puts the new units in that building, <strong>Mark under construction</strong>, and the same <strong>Activate</strong>, <strong>Deactivate</strong>, <strong>Archive</strong> and <strong>Restore</strong> as a property. Its editor adds <strong>Floors</strong>, for each level's use, units and area, and <strong>Inspections &amp; Compliance</strong> for elevator, fire, boiler and other inspections.</p><p>The figures at the top count buildings (with how many are under construction), floors, units with their monthly rent roll and occupancy. Archived buildings are left out.</p>$html$,
      '[]',
      120
    ),
    (
      'portfolios',
      'Portfolios',
      'Portfolios',
      $html$<p><strong>Property → Portfolios</strong> groups properties so you can manage and report on them together. Choose <strong>New Portfolio</strong>: only <strong>Portfolio name</strong> is required. You can add a <strong>Manager</strong>, a <strong>Region</strong>, an <strong>Accent color</strong> (Emerald to start) and a <strong>Status</strong> (Active or Draft; Active to start).</p><p>To fill a portfolio, open it and choose <strong>Actions → Add properties</strong>, select at least one property, then <strong>Add to Portfolio</strong>. A property belongs to one portfolio at a time, so adding one that's already elsewhere moves it. Remove a property with the × beside it in the portfolio's <strong>Properties</strong> section.</p><p>A portfolio's <strong>Overview</strong> rolls up figures across its properties, and its editor adds <strong>Targets &amp; Reporting</strong>, plus the owners and work orders across its properties. The list's figures count portfolios and regions, properties assigned to a portfolio, occupancy and monthly rent roll.</p>$html$,
      '[]',
      130
    ),
    (
      'floor-plans-and-unit-types',
      'Floor plans',
      'Floor plans and unit types',
      $html$<p><strong>Floor plans</strong> and <strong>unit types</strong> are reusable templates you link to units. A floor plan is a layout with its drawing; a unit type is a set of specs and pricing. For both, choose <strong>New Floor Plan</strong> or <strong>New Unit Type</strong>, and only the name is required.</p><ul><li><strong>Floor Plans</strong>: upload the drawing (an image or a PDF) under <strong>Plan File</strong>, and set pricing, features and marketing copy. <strong>Starting rent</strong> left blank uses the lowest rent among its units. <strong>Linked</strong> shows the units and properties using the plan. Statuses are Active, Draft and Archived. The views include <strong>With availability</strong> and <strong>Missing drawing</strong>.</li><li><strong>Unit Types</strong>: layout, market rent and range, deposit, features, default charges and amenities. Statuses are Active, Inactive and Draft. The views include <strong>With availability</strong> and <strong>No units</strong>.</li></ul><p>To reprice every unit of a type, choose <strong>Actions → Push rent to units</strong> in the unit type, pick <strong>Vacant &amp; make-ready units only</strong> or <strong>All assigned units</strong>, and finish. Each unit's market rent changes to the type's rent and the change goes into its rent history. The type needs a market rent first.</p>$html$,
      '[]',
      140
    ),
    (
      'amenities',
      'Amenities',
      'Amenities and reservations',
      $html$<p><strong>Property → Amenities</strong> is your library of amenities, attached to properties and units. Choose <strong>New Amenity</strong>: only <strong>Amenity name</strong> is required. Categories are Community, Unit, Building, Outdoor, Fitness, Parking, Security, Utilities and Accessibility. Statuses are Active, Temporarily closed, Inactive and Draft.</p><p>To take reservations, choose <strong>Actions → Enable booking</strong>, then set <strong>Booking Rules</strong>: whether it <strong>Requires staff approval</strong>, how many bookings can overlap, slot length, the longest booking, how far ahead and with how much notice, bookings per resident a month, fees, deposits, guests and open hours for each weekday.</p><p>You record reservations for residents with <strong>New Reservation</strong> in the amenity's <strong>Reservations</strong> section. Resident name, date, start and end are required, and Property checks the booking rules, closures and overlapping bookings before saving. With approval required, a reservation starts as Requested until you choose <strong>Approve</strong> or <strong>Decline</strong>; otherwise it's Approved straight away. <strong>Cancel</strong> cancels an upcoming approved booking.</p><p><strong>Close temporarily</strong> asks for a reason and date, marks the amenity closed and blocks that date. <strong>Reopen</strong> sets it Active again.</p>$html$,
      '[]',
      150
    ),
    (
      'community-calendar',
      'Amenities',
      'The community calendar',
      $html$<p>To see every booking in one place, switch <strong>Amenities</strong> from <strong>Library</strong> to <strong>Calendar</strong> at the top of the screen. The calendar shows a month at a time, with arrows to move between months. Show <strong>Everything</strong>, only <strong>Reservations</strong> or only <strong>Events</strong>.</p><p>The figures at the top count approved bookings this month, requests awaiting approval, events scheduled this month and booking fees. Approve or decline requests from the calendar too.</p><p><strong>New Reservation</strong> books any bookable amenity that isn't Inactive. <strong>New Event</strong> adds a community event: <strong>Event name</strong>, <strong>Date</strong>, <strong>Starts</strong> and <strong>Ends</strong> are required, and you can add a location, an amenity, a property, a capacity and a description.</p>$html$,
      '[]',
      160
    ),
    (
      'media-library',
      'Media library',
      'Media library and photos',
      $html$<p>Every property, unit, building, floor plan and unit type has a <strong>Photos &amp; Media</strong> section. Upload images there, set one as the cover with the star, or delete one with the trash icon. Property compresses each uploaded image, aiming for 500 KB or less and at most 2,000 pixels on a side.</p><p><strong>Property → Media Library</strong> holds all of these together, plus files you add on their own. Choose <strong>New Media</strong>: only <strong>Asset name</strong> is required. Pick a <strong>Kind</strong> (Photo, Video, 360° tour, Floor plan or Document; Photo to start) and a <strong>Status</strong> (Published, Draft or Archived; Published to start). Then in its editor:</p><ul><li><strong>File</strong>: upload or replace the file.</li><li><strong>Details</strong>: alt text, caption, tags and display order (lower shows first).</li><li><strong>Placement</strong>: attach it to a property, unit or building, or leave it <strong>Unassigned (library)</strong>.</li><li><strong>Usage</strong>, <strong>Publishing</strong> and <strong>Rights &amp; Licensing</strong>: where it appears, its status, channels and dates, and its ownership and license.</li></ul><p>The views include <strong>Unassigned</strong> and <strong>Missing alt text</strong>, and the figures count assets, unassigned assets, photos missing alt text and the library's total size.</p>$html$,
      '[]',
      170
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"FilePen","label":"Leasing","href":"/help/property/leasing"},{"icon":"Megaphone","label":"Marketing & leads","href":"/help/property/marketing"},{"icon":"Wrench","label":"Maintenance","href":"/help/property/maintenance"},{"icon":"Users","label":"Tenants, owners & vendors","href":"/help/property/people"},{"icon":"CircleDollarSign","label":"Rent & payments","href":"/help/property/payments"},{"icon":"Settings","label":"Project settings","href":"/help/property/settings"}]',
      180
    )
) as v(anchor_id, eyebrow, title, content, links, sort_order)
cross join (select id from public.docs_pages where slug = 'property/properties' and deleted_at is null) p;

-- @down
-- Restores the draft exactly as 20261024191900_help_property_structure left it.
update public.docs_pages
set title = 'Properties & units',
    description = 'Set up properties, units, buildings and portfolios, with floor plans, unit types, amenities and media.',
    status = 'draft',
    published_at = null
where slug = 'property/properties' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'property/properties' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Properties</li><li>Units</li><li>Buildings</li><li>Portfolios</li><li>Floor plans</li><li>Unit types</li><li>Amenities and the community calendar</li><li>Media library</li></ul>',
  10
from public.docs_pages p
where p.slug = 'property/properties' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
