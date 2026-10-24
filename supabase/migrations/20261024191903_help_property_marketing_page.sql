-- Help property marketing page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the property/marketing draft outline from
-- 20261024191900_help_property_structure with the full Marketing & leads guide (the sidebar's Marketing & Leads group)
-- and publishes it.
-- Written from a survey of C:\Pro\geiger-property (components/internal/screens/marketing/{listings,prospects,showings,
-- applications,waitlist,rent_comps}.jsx, marketing/{flows,shared}.js, marketing/sections/*,
-- components/internal/screens/entity/entity_list_screen.jsx, lib/supabase/{listings,prospects,showings,applications,
-- waitlist,rent_comps}.js).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Marketing & leads',
    description = 'List vacant units, work leads from first contact to a tour, take and screen applications, keep a waitlist and track rents nearby.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'property/marketing' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'property/marketing' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.sort_order
from (
  values
    (
      'creating-a-listing',
      'Basics',
      'Creating a listing',
      $html$<p>To market a vacant unit, choose <strong>Marketing &amp; Leads → Listings</strong> in the sidebar, then <strong>New Listing</strong>. Only <strong>Listing title</strong> is required. Pick the <strong>Unit</strong> and the listing takes its property, size and rent. Choose <strong>Create Listing</strong>: new listings start as Draft.</p><p>You can also start one from a unit: open it under <strong>Property → Units</strong> and choose <strong>Actions → Create listing</strong>.</p><p>Fill in the listing's editor before you publish it: <strong>Description</strong> (with a <strong>Fair-housing language reviewed</strong> switch), <strong>Pricing &amp; specials</strong>, <strong>Availability &amp; terms</strong> (lease terms offered and tour options), <strong>Pet policy</strong>, <strong>Features &amp; amenities</strong>, <strong>Furnished &amp; mid-term</strong>, <strong>Photos</strong>, <strong>Virtual tour &amp; video</strong> and <strong>Contact &amp; agent</strong>.</p>$html$,
      '[]',
      10
    ),
    (
      'publishing-a-listing',
      'Concepts',
      'Listing statuses and publishing',
      $html$<p>A listing is Draft, Active, Paused, Leased or Archived. Its <strong>Actions</strong> menu moves it along:</p><ul><li><strong>Publish</strong> sets it Active, and <strong>Unpublish</strong> sets it Paused.</li><li><strong>Mark leased</strong> asks for <strong>Leased on</strong> (required) and, optionally, the lease, then sets it Leased.</li><li><strong>Relist as draft</strong> brings a Leased or Archived listing back to Draft, and <strong>Archive</strong> retires it.</li></ul><p>Publishing doesn't post the listing anywhere. Property tracks each listing site's status in the <strong>Syndication</strong> section, but nothing is sent to Zillow, Apartments.com or any other site: post the listing yourself, then record its status and link there. Leasing, archiving or unpublishing a listing turns its channels off, and a duplicated listing starts unpublished on every channel.</p><p>When an application for the unit becomes a lease, Property marks the unit's Draft, Active and Paused listings Leased.</p>$html$,
      '[]',
      20
    ),
    (
      'listings-list',
      'Listings',
      'The listings list',
      $html$<p>The figures at the top of <strong>Listings</strong> show your <strong>Live listings</strong> (with how many are open and how many are drafts), the <strong>Avg asking rent</strong> across live listings, the <strong>Avg days on market</strong> since each was first published, and <strong>Lead → lease</strong>, the share of prospects that became a lease.</p><p>The view menu offers <strong>All listings</strong>, <strong>Live</strong>, <strong>Draft</strong>, <strong>Furnished / mid-term</strong> and <strong>Leased</strong>. A listing's editor also lists its <strong>Prospects</strong>, <strong>Showings</strong> and <strong>Applications</strong>, and <strong>Lead sources</strong> shows where its leads came from and how they converted.</p>$html$,
      '[]',
      30
    ),
    (
      'leasing-funnel',
      'Concepts',
      'How a lead becomes a lease',
      $html$<p>Marketing &amp; Leads follows one person from first contact to a signed lease. A <strong>prospect</strong> moves through these stages: New, Contacted, Showing scheduled, Toured, Applied and Converted, or Lost.</p><ul><li>Scheduling a showing moves the prospect to Showing scheduled, and completing it moves them to Toured.</li><li>Creating an application from the prospect moves them to Applied.</li><li>Converting the approved application to a lease moves them to Converted.</li></ul><p>These moves happen on their own and only go forward: a prospect who already applied stays at Applied when another showing is booked. Every stage change is logged in the prospect's <strong>Stage &amp; history</strong> section with the date and a note.</p>$html$,
      '[]',
      40
    ),
    (
      'adding-a-prospect',
      'Prospects',
      'Adding a prospect',
      $html$<p>To add a lead, choose <strong>Marketing &amp; Leads → Prospects</strong>, then <strong>New Prospect</strong>. Only <strong>Full name</strong> is required. Add an <strong>Email</strong>, a <strong>Phone</strong>, the <strong>Source</strong> (Website to start; others include Zillow, Apartments.com, Referral, Walk-in and Phone call) and, optionally, the <strong>Listing</strong> they asked about. New prospects start as New.</p><p>The prospect's editor holds their <strong>Contact</strong> details (including <strong>Do not contact</strong> and <strong>Consented to texts</strong>), <strong>Preferences</strong> (beds, budget, move-in date, pets, areas), <strong>Source &amp; attribution</strong>, <strong>Rent quotes</strong> and <strong>Follow-ups</strong>. A follow-up needs a task and a due date, and is Open, Done or Skipped.</p><p>The figures at the top count leads (with showings booked), how many toured, applications and leases, each as a share of the step before. The view menu starts on <strong>Active pipeline</strong>; the others are <strong>New</strong>, <strong>Touring</strong>, <strong>Applied</strong>, <strong>Follow-up due</strong>, <strong>Won</strong>, <strong>Lost</strong> and <strong>All prospects</strong>.</p>$html$,
      '[]',
      50
    ),
    (
      'working-a-prospect',
      'Prospects',
      'Working a prospect',
      $html$<p>An open prospect's <strong>Actions</strong> menu has:</p><ul><li><strong>Mark contacted</strong>: moves a New prospect to Contacted.</li><li><strong>Schedule showing</strong>: books a tour in <strong>Showings</strong>. <strong>Unit</strong>, <strong>Date</strong> and <strong>Time</strong> are required; pick a type, a duration (15 to 90 minutes) and an agent.</li><li><strong>Convert to application</strong>: creates an application linked to the prospect. <strong>Unit</strong> and <strong>Applicant name</strong> are required. An <strong>Application fee</strong> entered here is recorded only, not charged.</li><li><strong>Hold a unit</strong>: reserves a unit for them until a date. The hold is tracked on the prospect only and doesn't change the unit.</li><li><strong>Add to waitlist</strong>: adds them to the waitlist, unless they're already on it.</li><li><strong>Mark lost</strong>: closes the lead with a reason, such as Leased elsewhere, Price too high or Stopped responding, and optionally who they went with and when to re-engage.</li></ul><p><strong>Reopen</strong> puts a lost prospect back at Contacted.</p>$html$,
      '[]',
      60
    ),
    (
      'showings',
      'Showings',
      'Showings',
      $html$<p>A showing is a tour of a unit. Book one from a prospect's <strong>Schedule showing</strong>, or choose <strong>Marketing &amp; Leads → Showings</strong>, then <strong>New Showing</strong>: only <strong>Showing title</strong> is required, and the type is In-person, Self-guided or Virtual (In-person to start). New showings are Scheduled.</p><p>A showing's <strong>Actions</strong> menu:</p><ul><li><strong>Confirm</strong> sets a Scheduled showing to Confirmed.</li><li><strong>Generate access code</strong> (self-guided tours) creates a six-digit code valid from 15 minutes before the tour to 15 minutes after it ends. Property doesn't program the lock: set the code on the keypad yourself and share it.</li><li><strong>Complete</strong> asks for the <strong>Interest level</strong> and <strong>Outcome</strong> (both required), moves the prospect to Toured and expires the access code.</li><li><strong>Reschedule</strong> needs a new date and time. <strong>Mark no-show</strong> and <strong>Cancel showing</strong> (with a required reason) revoke the access code.</li></ul><p><strong>Confirmation sent</strong> and <strong>Reminder sent</strong> are switches you set: Property doesn't send them. The list starts on <strong>Upcoming</strong>; <strong>Needs outcome</strong> shows past showings still open. The figures show upcoming and completed tours, the show rate and the share of tours that led to an application.</p>$html$,
      '[]',
      70
    ),
    (
      'taking-an-application',
      'Applications',
      'Taking an application',
      $html$<p>To start an application, use a prospect's <strong>Convert to application</strong>, or choose <strong>Marketing &amp; Leads → Applications</strong>, then <strong>New Application</strong>. Only <strong>Applicant name</strong> is required; you can link it to a prospect and a unit. New applications start as Submitted.</p><p>The application's editor collects the rest:</p><ul><li><strong>Applicant</strong>: identity, contact and disclosures. Keep only the last four digits of an ID: never store full ID or SSN numbers.</li><li><strong>Co-applicants</strong>: each one is a Co-applicant (on lease), Cosigner, Guarantor or Occupant (not on lease), with income and screening status.</li><li><strong>Household</strong>, <strong>Pets</strong> (an assistance animal isn't a pet) and <strong>Vehicles</strong>.</li><li><strong>Employment &amp; income</strong>, <strong>Rental history</strong> and <strong>References</strong>.</li><li><strong>Screening</strong>, <strong>Fees</strong> and <strong>Decision &amp; lease</strong>.</li></ul><p>The list's figures show applications in review, the approval rate, the average days from applying to a decision and the share of applications that became a lease. The view menu starts on <strong>In review</strong>.</p>$html$,
      '[]',
      80
    ),
    (
      'screening',
      'Applications',
      'Screening and qualifying criteria',
      $html$<p>Screening in Property is a record you keep, not a check Property runs: it doesn't contact a screening company. Choose <strong>Actions → Start screening</strong> on a Submitted application. Its status becomes Screening, and each check is marked Requested. Record each result in the <strong>Screening</strong> section as it comes back:</p><ul><li><strong>Criminal background</strong>: Clear, Records found or Review needed.</li><li><strong>Credit report</strong>: Meets criteria, Below criteria, Thin file or No score, with the score.</li><li><strong>Eviction history</strong>: None found, Eviction found or Review needed.</li><li><strong>Income verification</strong>: Verified, Partially verified or Unverified.</li></ul><p>Your qualifying rules live under <strong>Screening Criteria</strong> at the top of <strong>Applications</strong>: <strong>Income multiple (× rent)</strong> (3 to start), <strong>Minimum credit score</strong> (620), <strong>Eviction lookback (years)</strong> (7), <strong>Count co-applicant income</strong> and <strong>Allow cosigners to qualify</strong> (both on), and the criteria text you share with every applicant.</p><p><strong>Employment &amp; income</strong> compares the household's monthly income with the rent times the income multiple. The rent is the unit's, then the listing's, then the <strong>Rent to qualify against</strong> you enter. One application can use its own <strong>Income multiple override</strong>.</p>$html$,
      '[]',
      90
    ),
    (
      'decisions-and-leases',
      'Applications',
      'Decisions and converting to a lease',
      $html$<p>To decide an application, choose <strong>Actions → Record decision</strong> (<strong>Change decision</strong> once there is one), pick an outcome and choose <strong>Save Decision</strong>:</p><ul><li><strong>Approve</strong> sets it Approved.</li><li><strong>Approve with conditions</strong> sets it Conditionally approved, with any additional deposit, a required cosigner or guarantor, a monthly rent adjustment and other conditions.</li><li><strong>Deny</strong> sets it Denied and requires the adverse-action reasons, with the date the notice went out.</li></ul><p>On an approved application, <strong>Convert to lease</strong> creates the lease. <strong>Lease name</strong> and <strong>Start date</strong> are required. The term is 6 to 24 months (12 to start); a blank end date is the start plus the term. Blank rent uses the unit's rent plus any rent adjustment, and a blank deposit uses your deposit policy plus any extra deposit. The lease starts as Draft unless you pick Pending or Active. Choose <strong>Create Lease</strong>, and Property:</p><ul><li>creates the tenant and the lease, with the applicant as primary tenant and each co-applicant, cosigner, guarantor and occupant as a lease party;</li><li>sets the application to Lease created and the prospect to Converted;</li><li>places the person's waitlist entries and marks the unit's open listings Leased.</li></ul><p><strong>Mark withdrawn</strong> closes an application, and <strong>Reopen</strong> puts a denied or withdrawn one back to Submitted.</p>$html$,
      '[]',
      100
    ),
    (
      'waitlist',
      'Waitlist',
      'The waitlist',
      $html$<p>To add someone to the waitlist, choose <strong>Marketing &amp; Leads → Waitlist</strong>, then <strong>New Waitlist Entry</strong> (or use a prospect's <strong>Add to waitlist</strong>). Only <strong>Full name</strong> is required. An entry is Waiting, Offered, Placed, Converted, Declined or Removed.</p><p>The queue is ordered by position (entries without one come last), then priority (Standard, High, Transfer, Accessibility or Employee), then join date. <strong>Move up</strong> and <strong>Move down</strong> in an entry's <strong>Actions</strong> menu reorder it. <strong>Renumber Queue</strong> at the top of the list renumbers each property's queue from 1, with higher priorities first.</p><p>An entry's <strong>Actions</strong> menu also has:</p><ul><li><strong>Log opening notice</strong>: records that you told them about an opening. Send the message itself from <strong>Communications</strong>.</li><li><strong>Offer unit</strong>: <strong>Unit</strong> and <strong>Respond by</strong> are required; a blank rent uses the unit's. The entry becomes Offered. Property records the offer but doesn't message the person. <strong>Matching units</strong> lists open units that fit.</li><li><strong>Convert to application</strong>, <strong>Mark placed</strong>, <strong>Remove from waitlist</strong> (with a required reason) and <strong>Put back in line</strong>.</li></ul>$html$,
      '[]',
      110
    ),
    (
      'rent-comparables',
      'Rent comparables',
      'Rent comparables',
      $html$<p><strong>Marketing &amp; Leads → Rent Comparables</strong> tracks rents at competing properties. Choose <strong>New Comparable</strong>: only <strong>Comparable</strong> (its name) is required. Pick which of your properties it's <strong>Compared to</strong>, and add its rent, bedrooms and square feet.</p><p>Property works out each comparable's <strong>Effective rent</strong> (the asking rent less the monthly value of its concessions) and its price per square foot. To log a new asking rent, choose <strong>Actions → Record new rent</strong>: <strong>Observed on</strong> and <strong>Asking rent</strong> are required. The observation goes into the comparable's history and becomes its current asking rent. <strong>Archive</strong> and <strong>Restore</strong> retire and bring back a comparable.</p><p>The figures at the top show active comparables, their average effective rent and price per square foot, and <strong>Your avg rent</strong> with how far it sits from the market.</p>$html$,
      '[]',
      120
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"Building2","label":"Properties & units","href":"/help/property/properties"},{"icon":"FilePen","label":"Leasing","href":"/help/property/leasing"},{"icon":"Users","label":"Tenants, owners & vendors","href":"/help/property/people"}]',
      200
    )
) as v(anchor_id, eyebrow, title, content, links, sort_order)
cross join (select id from public.docs_pages where slug = 'property/marketing' and deleted_at is null) p;

-- @down
-- Restores the draft exactly as 20261024191900_help_property_structure left it.
update public.docs_pages
set title = 'Marketing & leads',
    description = 'List vacant units, track prospects and showings, take applications and keep a waitlist.',
    status = 'draft',
    published_at = null
where slug = 'property/marketing' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'property/marketing' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Listings</li><li>Prospects</li><li>Showings</li><li>Applications and decisions</li><li>Waitlist</li><li>Rent comparables</li></ul>',
  10
from public.docs_pages p
where p.slug = 'property/marketing' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
