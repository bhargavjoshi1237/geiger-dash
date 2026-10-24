-- Help events guests page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the events/guests draft outline from
-- 20261024191100_help_events_structure with the full Guests guide and publishes it.
-- Written from a survey of C:\Pro\geiger-events (components/internal/screens/guests/*,
-- components/internal/shared/audience/audience_builder.jsx, lib/audience/resolve.js,
-- lib/supabase/{contacts,segments,tags,data_requests,attendees,registrations}.js,
-- components/internal/screens/registrations/{csv.js,registrations.jsx},
-- components/internal/screens/{messages/organiser_inbox,community/qa_threads,inventory/event_allocations}.jsx,
-- components/internal/screens/events/public_page/checkout/use_checkout.js, lib/stripe/fulfill-checkout.js,
-- supabase/migrations/{20260715100710_contact_tags,20260715100711_contacts}.sql,
-- components/internal/shared/pagination.jsx, components/internal/sidebar/sidebar_nav.jsx,
-- components/internal/screens/registry.jsx, geiger-rbac.config.js, geiger-ui.config.js,
-- context/nav-visibility-context.js) and of @geiger/ui's nav rules (C:\Pro\geiger-ui\src\nav\resolve.js).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set description = 'Keep a Contact Book of everyone with tags, notes and consent, see who''s attending, export attendee lists, build segments, and track data requests.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'events/guests' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'events/guests' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, showcase, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.showcase, v.sort_order
from (
  values
    (
      'adding-a-contact',
      'Basics',
      'Adding a contact',
      $html$<p>To add someone to the Contact Book, choose <strong>Guests → Contact Book</strong> in the sidebar, then <strong>Add contact</strong>. Only <strong>Full name</strong> is required: Events won't add a contact without one. Choose <strong>Add contact</strong> in the dialog, and the contact appears at the top of the list.</p><ul><li><strong>Email</strong> and <strong>Phone</strong>: how to reach the person. Events matches contacts to registrations by email, so add one for anyone who attends your events.</li><li><strong>Company</strong>: optional.</li><li><strong>Status</strong>: Lead, Active, VIP or Archived. New contacts are Active.</li><li><strong>Tags</strong>: separate them with commas, like <code>VIP, Speaker</code>.</li></ul><p>New contacts start with consent off and aren't blocked. Add a job title, location, notes and consent from the contact's details once it exists. Registering or buying a ticket doesn't add anyone to the Contact Book: contacts come only from <strong>Add contact</strong>, <strong>Import CSV</strong>, <strong>Block an email</strong> and the <strong>Add</strong> button on the Guest List.</p><p>By default, <strong>Guests</strong> appears in the sidebar for the Owner, Admin, Manager and Member roles. To change who sees it, see <a href="/help/events/settings#roles-and-permissions">Roles and permissions</a>. Guest List, Segments, Tags, Notes and Data Requests are built on the Contact Book, and Who's Going and Attendee Export on the Guest List. To hide one of these from your own sidebar under <strong>Settings → Navigation</strong>, hide the entries built on it first; see <a href="/help/events/settings#navigation">Sidebar navigation</a>.</p>$html$,
      '[]',
      null,
      10
    ),
    (
      'contacts-and-guests',
      'Concepts',
      'Contacts and guests',
      $html$<p>The Guests area works with two kinds of record, both kept per project.</p><ul><li>A <strong>contact</strong> is a person in the Contact Book, kept by your team: their details, a status, tags, notes, an activity log, consent and a blocked flag. The status (Lead, Active, VIP or Archived) is a label you set, and Events doesn't change it on its own.</li><li>A <strong>guest</strong> is anyone with at least one registration for one of the project's events. People get a registration when they register or buy a ticket on an event page (a ticket purchase files one in the buyer's name and email), and when your team adds them under <a href="/help/events/registrations">Registrations</a>.</li></ul><p>Events links the two by email address, ignoring capitals. A contact whose email has a registration shows an <strong>Attending</strong> badge and lists those events in its details, and a guest with a matching contact shows <strong>In contacts</strong> on the Guest List. A guest never becomes a contact automatically: add them from the Guest List.</p><p>The Guest List has one row per person across every event, past and upcoming. Who's Going and Attendee Export have one row per registration, so someone registered for two events appears twice.</p>$html$,
      '[]',
      null,
      20
    ),
    (
      'contact-list',
      'Contact Book',
      'The contact list',
      $html$<p>The figures across the top of <strong>Contact Book</strong> count every contact in the project: <strong>Contacts</strong>, <strong>Active</strong>, <strong>VIP</strong>, and <strong>Email consent</strong>, the number opted in to marketing email with its share of the total. Search and filters don't change them.</p><p>Contacts are listed newest first, with their company, up to three tags (and how many more) and their status. Two badges can sit beside the status: <strong>Attending</strong> when the contact's email has a registration for one of the project's events, and <strong>Blocked</strong> when the contact is blocked.</p><p>Narrow the list with four filters: status (<strong>All Statuses</strong>, <strong>Lead</strong>, <strong>Active</strong>, <strong>VIP</strong> or <strong>Archived</strong>), consent (<strong>Any consent</strong>, <strong>Email opted-in</strong>, <strong>SMS opted-in</strong> or <strong>No consent</strong>), tag (<strong>All tags</strong> or any tag in use), and blocking (<strong>Everyone</strong>, <strong>Not blocked</strong> or <strong>Blocked only</strong>). The search box matches names, emails and companies. When nothing matches, <strong>Clear filters</strong> resets the filters and the search.</p><p>Click a contact to open its details. Each row's <strong>⋯</strong> menu has <strong>Open</strong>, <strong>Block</strong> or <strong>Unblock</strong>, and <strong>Delete</strong>. The <strong>Actions</strong> menu at the top holds <strong>Import CSV</strong>, <strong>Find duplicates</strong>, <strong>Block an email</strong> and <strong>Export CSV</strong>, which downloads the contacts the list is showing.</p>$html$,
      '[]',
      null,
      30
    ),
    (
      'contact-details',
      'Contact Book',
      'Contact details',
      $html$<p>Click a contact in the Contact Book to open its details panel. The top shows the contact's name, email and status, and the tabs are <strong>Overview</strong>, <strong>Tags & Notes</strong>, <strong>Activity</strong>, <strong>Consent</strong> and <strong>Events</strong>.</p><ul><li><strong>Overview</strong>: <strong>Status</strong> saves when you pick it. <strong>Full name</strong>, <strong>Email</strong>, <strong>Phone</strong>, <strong>Company</strong>, <strong>Job title</strong> and <strong>Location</strong> save when you choose <strong>Save changes</strong>, which stays disabled until you change one of them. A contact needs a name to save.</li><li><strong>Events</strong>: every registration for the contact's email, latest event date first, with the registration's status.</li></ul><p>The bar at the bottom has <strong>Add to segment</strong>, <strong>Note</strong> (a quick way to add a note), <strong>Block</strong> or <strong>Unblock</strong>, and <strong>Delete</strong>.</p><p>To delete a contact, choose <strong>Delete</strong> there or in its row's <strong>⋯</strong> menu. Events asks you to confirm first, and a deleted contact can't be restored from Events. The person's registrations and orders stay, so they remain on the Guest List. The same details panel opens from the Guest List and from Notes, but there <strong>Delete</strong> only reminds you to delete contacts from the Contact Book, and Notes doesn't offer <strong>Add to segment</strong>.</p>$html$,
      '[]',
      null,
      40
    ),
    (
      'tags-notes-activity',
      'Contact Book',
      'Tags, notes and activity',
      $html$<p>A contact's <strong>Tags & Notes</strong> tab holds its tags and your team's internal notes. Each change saves straight away.</p><ul><li><strong>Tags</strong>: type a tag in <strong>Add a tag</strong> and press <code>Enter</code> or choose the + button. A tag the contact already has, in any capitals, isn't added twice. Click the × on a tag to remove it.</li><li><strong>Notes</strong>: write in the box and choose <strong>Add note</strong>. Notes are listed newest first with their date. <strong>Remove</strong> deletes a note straight away, without asking. The <strong>Note</strong> button at the bottom of the details panel adds a note the same way.</li></ul><p>Every note also appears in <strong>Guests → Notes</strong>. To rename, recolor or merge a tag on every contact at once, use <strong>Guests → Tags</strong>.</p><p>The <strong>Activity</strong> tab is a log of your dealings with the person. Pick a channel (<strong>Note</strong>, the default, <strong>Email</strong>, <strong>SMS</strong>, <strong>Call</strong> or <strong>System</strong>), type a <strong>Subject</strong> and what happened, and choose <strong>Log interaction</strong>. A subject or a description is required. Logging only records the interaction: Events doesn't send anything. Entries are listed newest first, can't be edited or deleted, and don't appear in the Notes feed.</p>$html$,
      '[]',
      null,
      50
    ),
    (
      'consent-and-blocking',
      'Contact Book',
      'Consent and blocking',
      $html$<p>A contact's <strong>Consent</strong> tab records whether the person agreed to hear from you. Turn on <strong>Marketing email</strong> (email campaigns and newsletters) or <strong>SMS messages</strong> (transactional and marketing SMS). Each switch saves straight away, and the tab shows when consent last changed. New and imported contacts start with both off.</p><p>Events keeps consent as a record and doesn't apply it on its own. To work with only the people who opted in, use the Contact Book's consent filter, or add an <strong>Email consent</strong> or <strong>SMS consent</strong> rule to a segment.</p><p>To block a contact, choose <strong>Block</strong> in its row's <strong>⋯</strong> menu or at the bottom of its details panel. To block an address that isn't in the Contact Book, choose <strong>Actions → Block an email</strong>, type the <strong>Email</strong> and an optional <strong>Reason</strong>, then choose <strong>Block</strong>. If a contact already has that email, ignoring capitals, Events blocks that contact; otherwise it adds a blocked contact with no name and the Archived status. <strong>Unblock</strong> lifts a block.</p><p>A block is a flag on the contact: it shows as a <strong>Blocked</strong> badge and feeds the <strong>Blocked only</strong> filter and the <strong>Blocked</strong> segment rule. Events doesn't check it at registration or checkout, so a blocked email can still register and buy tickets. The reason is saved with the contact but isn't shown in Events.</p>$html$,
      '[]',
      null,
      60
    ),
    (
      'importing-contacts',
      'Contact Book',
      'Importing contacts from a CSV',
      $html$<p>To bring in a list of contacts, open <strong>Contact Book</strong> and choose <strong>Actions → Import CSV</strong>. The import has four steps: <strong>Upload</strong>, <strong>Map columns</strong>, <strong>Preview</strong> and <strong>Done</strong>.</p><ol><li>Drop a CSV file on the upload area, or click the area to pick one. The first row must hold the column headings.</li><li>Under <strong>Map columns</strong>, match each contact field to a column in your file: <strong>Name</strong>, <strong>Email</strong>, <strong>Phone</strong>, <strong>Company</strong>, <strong>Job title</strong>, <strong>Location</strong> and <strong>Tags</strong>. Events guesses from the headings; choose <strong>Not imported</strong> to skip a field. <strong>Preview</strong> stays disabled until Name or Email is mapped.</li><li>Check the preview, which shows the first eight rows and counts what will be imported, then choose the <strong>Import</strong> button, which shows how many contacts it adds.</li></ol><p>Each row needs a name or an email. Rows with neither are skipped, and a row with only an email uses it as the name. Separate several tags in one cell with commas or semicolons. Imported contacts start as Active, with consent off.</p><p>The import doesn't merge anything: a row whose email is already in the Contact Book becomes a second contact, and the preview counts how many match an existing email. Merge them afterwards with <strong>Find duplicates</strong>. The last step shows how many rows were imported and how many failed. <strong>Import another file</strong> starts over, and <strong>Back to contacts</strong> returns to the list.</p>$html$,
      '[]',
      null,
      70
    ),
    (
      'finding-duplicates',
      'Contact Book',
      'Finding and merging duplicates',
      $html$<p>To merge duplicate contacts, open <strong>Contact Book</strong> and choose <strong>Actions → Find duplicates</strong>. Events groups contacts that share an email address, then groups the rest by name. Both comparisons ignore capitals and extra spaces. Each group says why it matched (<strong>Same email</strong> or <strong>Same name</strong>), and the figures at the top count <strong>Duplicate groups</strong>, <strong>Contacts affected</strong> and <strong>Removable</strong> records.</p><p>In each group, one record is marked <strong>Keep</strong> and the others <strong>Merge in</strong>. The most complete record, with the most details and tags filled in, starts as Keep; click another record to keep it instead. Then choose <strong>Merge</strong>, which shows how many records the group holds. The merge happens straight away, without asking.</p><ul><li>The kept record keeps its own name, email, phone, company, job title, location and status.</li><li>Tags and notes from every record in the group are combined onto it, and so are their activity logs and data requests.</li><li>Consent is on if any record had it on, and the contact is blocked if any record was blocked.</li><li>The other records are deleted and can't be restored from Events. Segments they were added to by hand don't carry over to the kept record.</li></ul><p>When there's nothing to merge, the screen shows <strong>No duplicates found</strong>. Run it again after an import. <strong>Back to contacts</strong> returns to the list.</p>$html$,
      '[]',
      null,
      80
    ),
    (
      'guest-list',
      'Guest List',
      'The Guest List',
      $html$<p><strong>Guests → Guest List</strong> lists everyone who has registered for, or bought a ticket to, any of the project's events, past or upcoming. People are grouped by email, so each person has one row however many events they've registered for, and the person with the latest registration comes first. Registrations without an email aren't listed.</p><p>The figures across the top are <strong>Guests</strong>, <strong>Going</strong> (people with at least one Confirmed or Checked-in registration), <strong>Repeat guests</strong> (registered for more than one event) and <strong>Events covered</strong>. The event filter and search don't change them.</p><p>Each row shows the person's name and email, how many events they've registered for (hover over the number to see which), and <strong>Latest status</strong>, the status of their most recent registration. Choose an event in the filter to see only its guests, or search by name or email.</p><p>A guest who is also a contact shows <strong>In contacts</strong>: click the row to open their contact details. For anyone else, <strong>Add</strong> creates a contact straight away from their name, email and phone, with the Active status. <strong>Export attendees</strong> downloads the guests the list is showing as a CSV file.</p>$html$,
      '[]',
      null,
      90
    ),
    (
      'whos-going',
      'Who''s Going',
      'Who''s Going',
      $html$<p><strong>Guests → Who's Going</strong> lists every registration for an event dated today or later. Each row is one registration, with the person's name and email, the event, its date and the registration's status, soonest event first. Someone registered for two upcoming events appears twice, and every registration status is listed, including Pending, Waitlisted and Declined.</p><p>Narrow the list by time with <strong>All upcoming</strong> (the default), <strong>Today</strong>, <strong>Next 7 days</strong> or <strong>Next 30 days</strong>, and by event (each event that has upcoming registrations). The search box matches names, emails and event names.</p><p>The figures across the top follow the filters and search: <strong>Upcoming events</strong>, <strong>Attendees</strong> (different people), <strong>Tickets</strong> (rows) and <strong>Going</strong> (rows that are Confirmed or Checked-in). <strong>Export</strong> downloads the rows you're looking at as a CSV file. Rows don't open anything: to work with a person, find them on the Guest List or in the Contact Book.</p>$html$,
      '[]',
      null,
      100
    ),
    (
      'attendee-export',
      'Attendee Export',
      'Exporting attendees',
      $html$<p>To export an attendee list, choose <strong>Guests → Attendee Export</strong>. Pick who to include and which fields to export, check the preview, then choose <strong>Export CSV</strong>. Your browser downloads the file, named after what you included, like <code>attendees-upcoming-events.csv</code>. Events doesn't keep or email a copy, and your choices reset when you leave the screen.</p><p>The export has one row per registration. <strong>Include</strong> decides which:</p><ul><li><strong>All attendees</strong> (the default), <strong>Today's events</strong>, <strong>Upcoming events</strong> (today or later) or <strong>Past events</strong>.</li><li><strong>Specific event</strong>, <strong>By venue / location</strong> (the event's venue, or its city when it has no venue) or <strong>By status</strong> (one registration status): pick the event, location or status in the field that appears. Until you do, everyone is included.</li><li><strong>Date range</strong>: events dated from <strong>From</strong> to <strong>To</strong>, both included. Leave one empty for an open range.</li></ul><p>Under <strong>Fields</strong>, select the columns: <strong>Attendee</strong> (Name, Email, Phone, Tags, Company, Title, Location), <strong>Event</strong> (Event, Date, Time, Venue, City) and <strong>Registration</strong> (Status, Party size, Dietary, Accessibility, Registered). Name, Email, Phone, Event, Date and Status start selected, and <strong>Select all</strong> or <strong>Clear</strong> changes them all. Tags, Company, Title and Location come from the Contact Book record with the same email, and stay empty for people who aren't contacts.</p><p>The preview shows the first 12 rows and 6 columns. <strong>Copy emails</strong> copies every email address in the selection to your clipboard, once each and one per line.</p>$html$,
      '[]',
      null,
      110
    ),
    (
      'building-a-segment',
      'Segments',
      'Building a segment',
      $html$<p>A <strong>segment</strong> is a saved audience filter over the Contact Book. To create one, choose <strong>Guests → Segments</strong>, then <strong>New segment</strong>. Give it a <strong>Name</strong> (left empty, it's called Untitled segment), a <strong>Color</strong> (Slate by default, or Emerald, Sky, Amber, Violet or Rose) and an optional <strong>Description</strong>, set its rules, and choose <strong>Create segment</strong>.</p><p>A contact is a member when it matches every rule. A new segment starts with one rule, Status is Active. <strong>Add rule</strong> adds another, and the × on a rule removes it, as long as one is left. The rules are:</p><ul><li><strong>Status</strong> is or is not Lead, Active, VIP or Archived.</li><li><strong>Tag</strong> is or is not a tag you type, ignoring capitals.</li><li><strong>Attending an event</strong> is Yes or No: whether the contact's email has a registration for any of the project's events, in any status.</li><li><strong>Attending event</strong> is an event you pick: a registration for that event.</li><li><strong>Email consent</strong>, <strong>SMS consent</strong> and <strong>Blocked</strong> are Yes or No.</li><li><strong>Company</strong> and <strong>Location</strong> match when the contact's company or location contains the text you type, ignoring capitals.</li></ul><p>Events doesn't store a list of members. It works them out from the rules each time a screen uses the segment, so membership follows your contacts as they change. Blocked contacts and people without consent are included unless a rule leaves them out.</p>$html$,
      '[]',
      null,
      120
    ),
    (
      'segment-members',
      'Segments',
      'Segment members and audiences',
      $html$<p>The <strong>Segments</strong> screen lists each segment with its rules and its <strong>Members</strong> count. The figures across the top are <strong>Segments</strong>, <strong>Largest</strong>, <strong>Reachable</strong> (contacts in at least one segment) and <strong>Avg size</strong>. Search matches names and descriptions. The list shows 25 segments a page; choose 10, 25, 50 or 100 at the bottom.</p><p>Click a segment, or choose <strong>View members</strong> in its <strong>⋯</strong> menu, to list its members. <strong>Edit rules</strong> opens the segment's settings, saved with <strong>Save segment</strong>. <strong>Delete</strong> asks you to confirm first, and removes only the segment, never the contacts in it.</p><p>To add a contact by hand, open its details from the Contact Book or the Guest List, choose <strong>Add to segment</strong> and pick the segment. A hand-added contact is a member even when it doesn't match the rules, and a check mark shows it in the menu. Pick the segment again to take the contact back out; a contact that matches the rules stays a member.</p><p>A segment also narrows an audience where Events asks for one, such as <strong>New broadcast</strong> in <strong>Community → Messages</strong> or <strong>Who can join</strong> in <strong>Community → Q&A</strong>. Choose <strong>Filtered</strong>, then pick the segment under <strong>Segment</strong>. Those audiences start from the project's guests, or from one event's ticket buyers when they're tied to an event, so they reach only the segment's members who are also guests or buyers. Events works out who's in when you send the broadcast or create the thread. See <a href="/help/events/community">Community</a>.</p>$html$,
      '[]',
      null,
      130
    ),
    (
      'managing-tags',
      'Tags',
      'Managing tags',
      $html$<p><strong>Guests → Tags</strong> lists every tag in the project: each tag on a contact, plus any created here. Each row shows the tag with its color, how many <strong>Contacts</strong> carry it, and its <strong>Description</strong>. The figures across the top are <strong>Tags</strong>, <strong>Applications</strong> (tags across all contacts), <strong>Most used</strong> and <strong>Unused</strong>. Sort by <strong>Most used</strong> (the default) or <strong>Least used</strong>, or by name, A to Z or Z to A. The search box matches tag names.</p><p>To create a tag ahead of time, choose <strong>New tag</strong>, type a <strong>Name</strong>, pick a <strong>Color</strong> and add an optional <strong>Description</strong>, then choose <strong>Create tag</strong>. The name is required and can't match another tag, ignoring capitals. A new tag isn't on any contact until you add it to one, for example on a contact's <strong>Tags & Notes</strong> tab. The color marks the tag on the Tags screen; elsewhere tags show as plain labels.</p><p>Click a tag to see its description and the contacts that carry it. The buttons there, and each row's <strong>⋯</strong> menu, change the tag on every contact at once:</p><ul><li><strong>Edit</strong>: change the name, color or description and choose <strong>Save tag</strong>. A new name can't match another tag, and it replaces the old one on every contact that carries it.</li><li><strong>Merge into</strong>: pick another tag and choose <strong>Merge</strong>. Every contact with this tag gets the other one instead, and this tag goes. It needs at least two tags.</li><li><strong>Delete</strong>: asks you to confirm first, then removes the tag from every contact. The contacts stay.</li></ul><p>Tags that differ only in capitals, like <code>VIP</code> and <code>vip</code>, are listed as two tags. Merge one into the other to make them one.</p>$html$,
      '[]',
      null,
      140
    ),
    (
      'notes-feed',
      'Notes',
      'The Notes feed',
      $html$<p><strong>Guests → Notes</strong> gathers every note left on a contact into one feed, one row per contact. Each row shows the contact's name, their latest note, how many notes they have and the date of the latest. The figures across the top count <strong>Notes</strong>, <strong>Contacts with notes</strong> and the <strong>Latest</strong> note's date.</p><p>Sort by <strong>Recently noted</strong> (the default), <strong>Oldest first</strong> or <strong>Most notes</strong>, or by name, A to Z. The search box matches names, emails and the text of the notes.</p><p>Click a row to read all of that contact's notes, newest first. The trash icon on a note deletes it straight away, without asking. The person icon at the top opens the contact's details panel. To clear a contact's notes in one go, choose <strong>Delete all notes</strong> in the row's <strong>⋯</strong> menu: Events asks you to confirm first, and deleted notes can't be restored.</p><p>You add notes from a contact's details, with the <strong>Note</strong> button or on the <strong>Tags & Notes</strong> tab. Interactions logged on the <strong>Activity</strong> tab don't appear in the Notes feed.</p>$html$,
      '[]',
      null,
      150
    ),
    (
      'data-requests',
      'Data Requests',
      'Data requests',
      $html$<p><strong>Guests → Data Requests</strong> tracks privacy requests, such as a person asking for a copy of their data or for it to be erased. To log one, choose <strong>New request</strong>, type the <strong>Requester email</strong>, pick the <strong>Type</strong> and choose <strong>Log request</strong>. The email is required.</p><ul><li><strong>Type</strong>: Export (the default), Erasure or Rectification.</li><li><strong>Note</strong>: optional context for your team. It's saved with the request, but the list doesn't show it.</li></ul><p>When the email matches a contact, ignoring capitals, the request is linked to that contact and shows <strong>Linked contact</strong>; otherwise it shows <strong>No contact record</strong>. New requests start as New, due 30 days after you log them, and one past its due date that isn't Completed or Rejected is marked overdue. The figures across the top count <strong>Open</strong> (New and In Progress), <strong>Overdue</strong> and <strong>Completed</strong> requests. Filter by status or search by email.</p><p>Each row's <strong>⋯</strong> menu moves the request to another status (<strong>Mark New</strong>, <strong>Mark In Progress</strong>, <strong>Mark Completed</strong> or <strong>Mark Rejected</strong>) and has <strong>Delete</strong>, which asks you to confirm first.</p><p>Data Requests is a tracking list: changing a status doesn't touch any data. Do the work yourself, then mark the request Completed. For an export, use the Contact Book's <strong>Export CSV</strong> with a search for the person, or Attendee Export. For a rectification, edit the contact's details. For an erasure, delete the contact in the Contact Book; that leaves the person's registrations and orders, which hold their name and email (see <a href="/help/events/registrations">Registrations</a> and <a href="/help/events/orders">Orders</a>).</p>$html$,
      '[]',
      null,
      160
    ),
    (
      'csv-exports',
      'Reference',
      'CSV exports',
      $html$<p>Every export in Guests is a CSV file that your browser downloads. Each one holds what the screen is showing after its filters and search, and when there's nothing to export, Events says so instead of downloading a file.</p><ul><li><strong>Contact Book → Actions → Export CSV</strong> (<code>contacts.csv</code>): Name, Email, Phone, Company, Status, Tags (separated by semicolons), Email consent and SMS consent (Yes or No), and Added, the date the contact was created.</li><li><strong>Guest List → Export attendees</strong> (<code>guest-list.csv</code>): Name, Email, Phone, Events (how many), Latest status, In contacts (Yes or No) and Last seen, the date of the person's latest registration.</li><li><strong>Who's Going → Export</strong> (<code>whos-going.csv</code>): Name, Email, Phone, Event, Date, Venue and Status.</li><li><strong>Attendee Export → Export CSV</strong> (named after the <strong>Include</strong> choice): the fields you select, in this order: Name, Email, Phone, Event, Date, Time, Venue, City, Status, Party size, Dietary, Accessibility, Tags, Company, Title, Location and Registered.</li></ul>$html$,
      '[]',
      null,
      170
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"UserCheck","label":"Registrations","href":"/help/events/registrations"},{"icon":"MessagesSquare","label":"Community","href":"/help/events/community"},{"icon":"Receipt","label":"Orders","href":"/help/events/orders"},{"icon":"ScanLine","label":"Check-in","href":"/help/events/check-in"},{"icon":"CalendarDays","label":"Events","href":"/help/events/events"},{"icon":"Settings","label":"Settings","href":"/help/events/settings"}]',
      null,
      180
    )
) as v(anchor_id, eyebrow, title, content, links, showcase, sort_order)
cross join (select id from public.docs_pages where slug = 'events/guests' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Guests',
    description = 'Keep every contact in one book, with guest lists, segments, tags, notes, exports and data requests.',
    status = 'draft',
    published_at = null
where slug = 'events/guests' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'events/guests' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Contact Book</li><li>Importing and finding duplicates</li><li>Guest List and Who''s Going</li><li>Attendee export</li><li>Segments and tags</li><li>Notes</li><li>Data requests</li></ul>',
  10
from public.docs_pages p
where p.slug = 'events/guests' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
