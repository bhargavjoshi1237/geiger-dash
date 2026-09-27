-- Deep-dive post: per-ticket, per-attendee custom questions collected before payment.
-- Re-runnable: fixed UUID, upserts on re-seed. Tags drive "Related reading" on SEO pages.

insert into public.dash_blog_posts (
  id, title, slug, excerpt, content, author_name, category, tags,
  is_published, is_featured, published_at, reading_time_minutes
) values (
  '859617a2-6dfa-4e65-8db5-6c8691e3a6fb',
  'Per-ticket registration questions: collecting attendee details before payment',
  'per-ticket-registration-questions',
  'One buyer, five tickets, one name. Here is why custom questions belong on the ticket type, why they should be asked once per attendee, and why they must be collected before checkout.',
  $html$
<p>Here is a situation most organisers have lived through. A company buys eight tickets to your conference. The order has one name and one email — the person who paid. Two weeks before the event you need eight badge names, eight dietary answers and eight session choices, and you are chasing an office manager who has moved on to other things.</p>

<p>The fix is not a better follow-up email. It is asking the right questions, for the right ticket, for each attendee, before anyone reaches the payment page. This post explains how we approached that in <a href="/events">Geiger Events</a> and what to look for in any <a href="/features/events/event-ticketing-payments">ticketing and payments</a> tool.</p>

<h2>Event questions vs. ticket questions</h2>

<p>Most registration tools have one set of custom questions per event. Everyone gets asked the same things. That works until ticket types start meaning different things:</p>
<ul>
  <li>A <strong>VIP</strong> ticket includes a T-shirt, so you need a size.</li>
  <li>An <strong>Exhibitor</strong> ticket needs a company and a stand number.</li>
  <li>A <strong>Student</strong> ticket needs an institution for eligibility.</li>
  <li>A <strong>Workshop</strong> add-on needs a session choice.</li>
</ul>

<p>With one shared form, every buyer sees every question with "if applicable" in brackets. With conditional logic you can hide some of them, but only if the form knows which ticket was picked. The cleaner answer is to attach questions to the ticket type itself.</p>

<p>In Geiger Events, questions can be defined on a ticket type, and they are <strong>additive</strong>: a buyer sees the event's shared questions plus the ones for the ticket they chose. Supported answer types are short text, long text, number, email, a choice list and a checkbox, each optionally required.</p>

<h2>Once per attendee, not once per order</h2>

<p>The second decision is cardinality. If someone buys three VIP tickets, do you ask for one T-shirt size or three?</p>

<p>Three, obviously — but plenty of checkouts ask once, because the form is attached to the order rather than the seat. Geiger Events repeats the ticket's question set for every seat in the purchase, grouped as "Attendee 1 of 3", "Attendee 2 of 3" and so on. Required questions must be answered for every attendee before the buyer can continue, and the error tells them which question and which attendee they missed.</p>

<p>This is what makes downstream tools work. <a href="/features/events/badge-printing">Badge printing</a> needs one name per badge. The <a href="/features/events/event-check-in-app">check-in app</a> needs one record per person at the door. <a href="/features/events/certificates-ceu">Certificates and CEU credits</a> need to know who actually attended, not who paid.</p>

<h2>Before payment, not after</h2>

<p>The third decision is timing. There are two common approaches:</p>
<ol>
  <li><strong>Ask after checkout.</strong> Payment first, then a "complete your registration" step or email. Checkout is shorter, but a meaningful share of buyers never come back to finish, and you end up with paid seats and no attendee data.</li>
  <li><strong>Ask before checkout.</strong> Questions are part of the details step, and the buyer only reaches payment once they are answered. Slightly longer checkout, but complete data for every ticket sold.</li>
</ol>

<p>We chose the second, for both free and paid tickets. The engineering detail that makes it work for paid tickets is worth knowing if you are evaluating tools: answers are saved <em>before</em> the handoff to the payment provider, tagged with a reference, and linked to the registration when the buyer returns from checkout. The answers never have to ride along inside the payment session, so there is no size limit on how much you can ask, and nothing is lost if the buyer takes a while to pay.</p>

<h2>Store answers as data, not a blob</h2>

<p>The last decision is invisible to attendees but matters a lot to you. Many tools store custom answers as a single block of text or JSON keyed by the question label. Rename "T-shirt size" to "Shirt size" and your old answers are orphaned. Export them and you get one unreadable column.</p>

<p>Geiger Events stores ticket questions in their own table and each answer as its own row, referencing the question by ID, the ticket type, the event and the attendee's seat. Renaming a question does not break anything, and reporting on "how many medium shirts do we need" is a query, not a spreadsheet exercise.</p>

<h2>Where conditional logic still fits</h2>

<p>Per-ticket questions and conditional logic are complementary, not alternatives:</p>
<ul>
  <li>Use <strong>ticket questions</strong> when the question depends on <em>what was bought</em>.</li>
  <li>Use <strong>conditional logic</strong> when the question depends on <em>another answer</em> — "tell us about the allergy" only after someone selects "Allergy".</li>
</ul>
<p>We collected six common patterns for the second case in <a href="/blog/conditional-registration-form-examples">conditional registration form examples</a>.</p>

<h2>A checklist for your next event</h2>
<ul>
  <li>List your ticket types and write down what you need to know for each one.</li>
  <li>Move anything that only applies to one ticket off the shared form and onto that ticket.</li>
  <li>Mark as required only what you genuinely cannot run the event without.</li>
  <li>Buy a multi-seat order yourself in test mode and check every attendee is asked.</li>
  <li>Check the answers show up where your team will use them — the <a href="/features/events/attendee-crm">attendee CRM</a>, badges and check-in.</li>
</ul>

<p>Running a <a href="/solutions/events/conference-event-software">conference</a>, an <a href="/solutions/events/expo-trade-show-management">expo</a> or a <a href="/solutions/events/festival-ticketing">festival</a>? Per-ticket questions are available on every ticket type in <a href="/events">Geiger Events</a>.</p>
  $html$,
  'Geiger Team',
  'Guides',
  ARRAY['event-ticketing-payments', 'event-registration-rsvp', 'registration-forms', 'geiger-events', 'conference-event-software', 'badge-printing', 'expo-trade-show-management'],
  true,
  false,
  '2026-09-26 09:00:00+00',
  7
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
