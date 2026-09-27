-- Hub post: the conference lifecycle, linking every conference-related Events feature page.
-- Re-runnable: fixed UUID, upserts on re-seed. Tags drive "Related reading" on SEO pages.

insert into public.dash_blog_posts (
  id, title, slug, excerpt, content, author_name, category, tags,
  is_published, is_featured, published_at, reading_time_minutes
) values (
  '0bb92f2c-589c-4272-9f58-ddf349cd1733',
  'Conference management software: the whole stack, from call for papers to certificates',
  'conference-management-software-guide',
  'A conference is eight or nine separate jobs that all share one attendee list. Here is each stage, what the software has to do at that stage, and where the handoffs usually break.',
  $html$
<p>Running a conference is rarely hard because any single task is hard. It is hard because there are so many of them — speakers, agenda, registration, sponsors, badges, the door, sessions, leads, certificates — and each one tends to live in a different tool with its own copy of the attendee list. The work is in the handoffs.</p>

<p>This guide walks through a conference in the order it actually happens, and for each stage covers what good software should do. Where we mention <a href="/events">Geiger Events</a>, it is because that stage is built into the same event record as every other stage, which is the point.</p>

<h2>Stage 1: Venue and format</h2>

<p>Before anything is public you need a place and a shape. If you run the same conference every year, keep the venue as a reusable record — capacity, rooms, amenities, contacts — so next year's edition starts from it. <a href="/features/events/venue-management">Venue management</a> covers that; <a href="/features/events/venue-sourcing">venue sourcing</a> covers finding and booking new spaces.</p>

<p>For the room itself, a to-scale <a href="/features/events/event-floor-plans-seating">floor plan</a> answers the question everyone asks the venue three times: how many people fit in theatre style versus cabaret? If you are running a hybrid edition, decide now which sessions will be streamed; <a href="/features/events/livestream-webinar-rooms">livestream and webinar rooms</a> gate online access by ticket type, so the decision affects how you price tickets.</p>

<h2>Stage 2: Call for papers</h2>

<p>Most conferences start content work six to nine months out with a call for proposals. The minimum is a submission form; what you actually need is a pipeline: submissions, reviewers, scoring, accept/decline, and a way for accepted speakers to update their own bio and headshot without emailing you.</p>

<p>The <a href="/features/events/call-for-papers">call for papers</a> feature in Geiger Events handles intake, review and scoring, and gives speakers a portal. If your proposal form needs branching questions — different fields for a talk versus a workshop — the same conditional patterns from our <a href="/blog/conditional-registration-form-examples">registration form examples</a> apply.</p>

<h2>Stage 3: Agenda and speakers</h2>

<p>Accepted proposals become sessions. The agenda needs tracks, rooms and time slots, and it needs to be public early because it is your best marketing. Attendees want to build a personal schedule, and on the day you want to know who actually went to which session. <a href="/features/events/conference-agenda-speakers">Agenda and speakers</a> covers multi-track agendas, speaker profiles, personal schedules and session check-in.</p>

<h2>Stage 4: Registration and tickets</h2>

<p>This is where most of the data you will use for the rest of the event is collected, so it is worth getting right:</p>
<ul>
  <li><strong>Ticket types</strong> for each audience — full pass, day pass, student, speaker, exhibitor — with <a href="/features/events/discount-codes-promo">early-bird pricing, group rates and promo codes</a>.</li>
  <li><strong>Per-ticket questions</strong> asked once per attendee, so a company buying ten passes gives you ten names. See <a href="/blog/per-ticket-registration-questions">per-ticket registration questions</a>.</li>
  <li><strong>Conditional questions</strong> for workshops, dietary needs and accessibility. See our <a href="/blog/event-registration-software-conditional-forms">checklist for registration software with conditional forms</a>.</li>
  <li><strong>Capacity, waitlists and approvals</strong> where they apply — see <a href="/features/events/event-registration-rsvp">registration and RSVP</a>.</li>
</ul>
<p>Put it all on a proper event page — the <a href="/features/events/event-page-builder">page builder</a> and <a href="/features/events/custom-domains-branding">custom domains</a> keep registration on your brand.</p>

<h2>Stage 5: Sponsors and exhibitors</h2>

<p>The commercial side of a conference is its own project: sponsorship tiers, packages, booth assignments and, afterwards, proof that it was worth it. <a href="/features/events/sponsors-exhibitors">Sponsors and exhibitors</a> covers tiers, reusable packages, booth assignment and sponsor reporting. The piece sponsors care about most is leads, which comes in stage 7.</p>

<h2>Stage 6: Badges and the door</h2>

<p>On the morning of day one, everything collected in stage 4 is suddenly urgent. You need:</p>
<ul>
  <li><a href="/features/events/badge-printing">Badge printing</a> from registration data — name, company, job title — printed on demand at check-in rather than pre-printed and alphabetised on a table.</li>
  <li>A <a href="/features/events/event-check-in-app">check-in app</a> that works on any phone, with QR scanning and <a href="/features/events/wallet-passes">Apple and Google Wallet passes</a>.</li>
  <li>For large or multi-day events, <a href="/features/events/rfid-nfc-access">RFID and NFC access</a> for faster entry.</li>
</ul>

<h2>Stage 7: During the event</h2>

<p>Two things matter while the event is running. First, engagement: live Q&amp;A, polls and announcements — see <a href="/features/events/event-community-engagement">community and engagement</a>. Second, <a href="/features/events/lead-retrieval">lead retrieval</a>: exhibitors scan attendee badges at their booth and walk away with a clean, exportable contact list. This is the single feature most likely to decide whether a sponsor comes back next year.</p>

<h2>Stage 8: Certificates and follow-up</h2>

<p>For professional and academic conferences, attendance often has to be proven. <a href="/features/events/certificates-ceu">Certificates and CEU credits</a> are issued from session check-in data you already captured in stage 3, with credit hours and accrediting body attached — no separate sign-in sheet.</p>

<p>Then the follow-up: thank-you emails, recordings, the survey, and the "save the date" for next year, via <a href="/features/events/event-email-sms-marketing">email and SMS</a>. <a href="/features/events/event-automation">Automations</a> can trigger these off check-in or session attendance, and <a href="/features/events/event-analytics">analytics</a> tell you which sessions and ticket types actually worked.</p>

<h2>Stage 9: Next year</h2>

<p>The last stage is the one that makes the next conference easier. Save the setup as an <a href="/features/events/event-templates">event template</a>, or group editions into an <a href="/features/events/event-series-recurring">event series</a>, so year two starts from year one instead of a blank page. For events that repeat far more often than once a year, see <a href="/blog/recurring-events-memberships-guide">running recurring events and memberships</a>.</p>

<h2>Where the handoffs break</h2>

<p>If you are assembling this stack from separate tools, the failures are predictable: speaker details that do not match the agenda, badge names that do not match registration, sponsor leads that cannot be matched back to attendee records, certificates issued from a spreadsheet someone reconciled by hand. Every one of those is a copy of the attendee list that drifted.</p>

<p>That is the case for one system. The <a href="/solutions/events/conference-event-software">conference event software</a> overview shows how the stages fit together in Geiger Events; if you are running an exhibition-heavy event, <a href="/solutions/events/expo-trade-show-management">expo and trade show management</a> goes deeper on booths and leads, and <a href="/solutions/events/corporate-b2b-events">corporate and B2B events</a> covers internal and client-facing formats. Online or hybrid? Start with <a href="/solutions/events/virtual-hybrid-events">virtual and hybrid events</a>.</p>
  $html$,
  'Geiger Team',
  'Guides',
  ARRAY['conference-event-software', 'call-for-papers', 'conference-agenda-speakers', 'badge-printing', 'lead-retrieval', 'sponsors-exhibitors', 'certificates-ceu', 'livestream-webinar-rooms', 'venue-management', 'expo-trade-show-management', 'corporate-b2b-events', 'virtual-hybrid-events', 'geiger-events'],
  true,
  false,
  '2026-09-21 09:00:00+00',
  9
)
on conflict (id) do update set
  title                = excluded.title,
  slug                 = excluded.slug,
  excerpt              = excluded.excerpt,
  content              = excluded.content,
  author_name          = excluded.author_name,
  category             = excluded.category,
  tags                 = excluded.tags,
  is_published         = excluded.is_published,
  is_featured          = excluded.is_featured,
  published_at         = excluded.published_at,
  reading_time_minutes = excluded.reading_time_minutes;
