-- Pillar post for the "registration software with conditional/custom forms" query cluster.
-- Re-runnable: fixed UUID, upserts on re-seed. Tags drive the "Related reading" block on
-- matching /features and /solutions pages, so keep feature slugs in the tag list.

insert into public.dash_blog_posts (
  id, title, slug, excerpt, content, author_name, category, tags,
  is_published, is_featured, published_at, reading_time_minutes
) values (
  '88613ba6-bda8-4402-9c99-2b3a01193f98',
  'Event registration software with conditional forms: a buyer''s checklist',
  'event-registration-software-conditional-forms',
  'Most registration tools let you add custom questions. Far fewer let those questions react to each other, change per ticket, and feed the rest of the event. Here is what to check before you pick one.',
  $html$
<p>Almost every event platform advertises "custom registration forms". In practice that phrase covers a very wide range: at one end, a fixed list of extra text boxes bolted onto checkout; at the other, a real form engine where questions appear and disappear based on earlier answers, differ per ticket type, and write their answers somewhere your team can actually use.</p>

<p>If your events are simple — one ticket, one question about dietary needs — the difference barely matters. The moment you run a conference with workshop tracks, a members' event with approval, or a paid event where each attendee in a group needs their own details, it matters a lot. This checklist is what we look for, and what we built <a href="/events">Geiger Events</a> and <a href="/forms">Geiger Forms</a> around.</p>

<h2>1. Can a question depend on another answer?</h2>

<p>This is what "conditional forms" should mean: a question is shown only when an earlier answer makes it relevant. Pick "Workshop day" and you are asked which workshop; pick "Standard" and you are not. Answer "Yes" to accessibility requirements and a follow-up text box appears.</p>

<p>Things to check:</p>
<ul>
  <li><strong>Which operators exist.</strong> "Equals" is the minimum. You will quickly want "does not equal", "contains" (for multi-select or free text) and "is empty".</li>
  <li><strong>Whether hidden questions are still required.</strong> A required question that is hidden must not block submission. This sounds obvious; plenty of tools get it wrong and attendees get stuck on an error for a field they cannot see.</li>
  <li><strong>Whether hidden answers are discarded.</strong> If someone picks a workshop, changes their mind, and switches to a standard pass, the old workshop answer should not end up in your export.</li>
</ul>

<p>In Geiger Events, each registration-form field can carry a <em>show when</em> rule — show this field when another field equals a value. Geiger Forms goes further with <em>Equals</em>, <em>Does not equal</em>, <em>Contains</em> and <em>Is empty</em> conditions, and it skips required-field validation for anything the respondent cannot see. We walk through concrete patterns in <a href="/blog/conditional-registration-form-examples">six conditional registration form examples</a>.</p>

<h2>2. Can questions change per ticket type?</h2>

<p>Event-level questions are asked of everyone. Real events need more than that: VIPs get asked their T-shirt size, exhibitors get asked for a stand number, students get asked for their institution. If the only option is one shared form, you end up with a long form full of "skip if not applicable" instructions — the exact problem conditional logic was meant to solve.</p>

<p>Look for per-ticket questions that are <strong>additive</strong> (they appear on top of the event's shared questions) and, for group purchases, asked <strong>once per attendee</strong> rather than once per order. Otherwise a buyer purchasing five seats gives you one name and four blanks. We cover this in depth in <a href="/blog/per-ticket-registration-questions">collecting attendee data before payment</a>.</p>

<h2>3. Are answers collected before payment?</h2>

<p>If the form runs after checkout, some attendees will pay and never finish it. Your badge list then has holes you will be chasing by email the week before the event. Questions should be collected <em>before</em> the handoff to the payment provider — for free and paid tickets alike — and stored so they survive the round trip to checkout.</p>

<h2>4. Does registration handle capacity, waitlists and approvals?</h2>

<p>The form is only half of registration. The other half is deciding who gets in:</p>
<ul>
  <li><strong>Capacity limits</strong> that stop sign-ups when the room is full.</li>
  <li><strong>A waitlist with auto-promotion</strong>, so a cancellation is filled without you watching the list.</li>
  <li><strong>Approval gates</strong> for invite-only or vetted events, with approve/decline and a clear "pending" state for applicants.</li>
  <li><strong>Plus-ones and group registration</strong>, with every guest counted against capacity individually.</li>
  <li><strong>Registration windows</strong> — open and close dates — and member-only access.</li>
</ul>

<p>All of these live in the <a href="/features/events/event-registration-rsvp">Geiger Events registration and RSVP</a> flow. If you are evaluating tools, test the waitlist specifically: register past capacity, cancel one confirmed attendee, and see whether the next person is promoted without a manual step.</p>

<h2>5. Where do the answers go?</h2>

<p>A dietary answer that sits in a CSV export is a dietary answer that nobody reads until the caterer calls. Check whether answers attach to the attendee record, whether there is an aggregated view (for example, a single dietary and accessibility report for the venue), and whether they flow into the rest of the tooling:</p>
<ul>
  <li>Your <a href="/features/events/attendee-crm">attendee CRM</a>, so the person's answers are visible next to their history.</li>
  <li><a href="/features/events/badge-printing">Badge printing</a>, so a job title or company collected at registration ends up on the badge.</li>
  <li>The <a href="/features/events/event-check-in-app">check-in app</a>, so staff at the door can see flags like accessibility needs.</li>
  <li><a href="/features/events/event-email-sms-marketing">Email and SMS</a>, so you can message only the people who picked a given workshop.</li>
  <li><a href="/features/events/api-webhooks">Webhooks and the API</a>, if another system needs the data.</li>
</ul>

<h2>6. Does the form look like your event?</h2>

<p>Registration usually sits on the event page, so it should inherit the page's design. A form hosted on someone else's domain, styled with someone else's brand, costs you conversions. Check for a proper <a href="/features/events/event-page-builder">event page builder</a> and <a href="/features/events/custom-domains-branding">custom domains and branding</a>, and make sure the confirmation page after submission is editable — it is where you tell people what happens next.</p>

<h2>7. Do you need an event platform, a form builder, or both?</h2>

<p>This is the question most checklists skip. There are two legitimate shapes of "registration software":</p>
<ul>
  <li><strong>An event platform with a form built in.</strong> Best when registration is tied to tickets, capacity, check-in and badges. That is <a href="/events">Geiger Events</a>.</li>
  <li><strong>A general form builder.</strong> Best for applications, sign-ups and intake that are not really events — a course application, a volunteer roster, a grant submission — or when you need calculated fields, scoring or file uploads. That is <a href="/forms">Geiger Forms</a>.</li>
</ul>

<p>Because both are part of the same suite, you do not have to pick one forever. A common pattern is an application in Forms (with scoring and file uploads) followed by registration in Events for the people you accept.</p>

<h2>A quick test script</h2>

<p>Whatever tool you are evaluating, build this form in a trial account. It takes about fifteen minutes and exposes most weaknesses:</p>
<ol>
  <li>A required "Ticket type" choice: Standard, Workshop, Exhibitor.</li>
  <li>A required "Which workshop?" choice shown only for Workshop.</li>
  <li>A required "Company" field shown only for Exhibitor.</li>
  <li>An optional "Accessibility needs?" yes/no, with a follow-up text box shown only for Yes.</li>
  <li>Register as Standard and confirm you are not blocked by the hidden required fields.</li>
  <li>Buy three Workshop seats and confirm each attendee gets their own workshop question.</li>
  <li>Set capacity to two and check the third registration lands on the waitlist.</li>
</ol>

<p>If a tool passes all seven, it will handle most real events. If you want to try it on ours, <a href="/pricing">Geiger Events comes with a 15-day free trial</a>, and the <a href="/solutions/events/workshop-class-registration">workshop and class registration</a> and <a href="/solutions/events/conference-event-software">conference</a> guides show the same flows in context.</p>
  $html$,
  'Geiger Team',
  'Guides',
  ARRAY['event-registration-rsvp', 'geiger-events', 'geiger-forms', 'registration-forms', 'conditional-logic', 'workshop-class-registration', 'conference-event-software'],
  true,
  true,
  '2026-09-24 09:00:00+00',
  8
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
