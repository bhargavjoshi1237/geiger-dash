-- How-to post: worked conditional-logic patterns for event registration forms.
-- Re-runnable: fixed UUID, upserts on re-seed. Tags drive "Related reading" on SEO pages.

insert into public.dash_blog_posts (
  id, title, slug, excerpt, content, author_name, category, tags,
  is_published, is_featured, published_at, reading_time_minutes
) values (
  '9f2732e6-6f40-40c3-9dcc-eff6e5f473d1',
  'Six conditional registration form examples (and when to use each)',
  'conditional-registration-form-examples',
  'Workshop pickers, dietary follow-ups, exhibitor details, plus-ones, accessibility and approvals: six conditional logic patterns that keep an event registration form short without losing the data you need.',
  $html$
<p>A registration form has two jobs that pull against each other. It has to be short enough that people finish it, and complete enough that your team can run the event. Conditional logic is how you do both: every question stays hidden until an earlier answer makes it relevant.</p>

<p>Below are six patterns we see again and again across conferences, workshops, community nights and members' events. Each one lists the fields, the rule, and the mistake to avoid. They all work in the <a href="/features/events/event-registration-rsvp">Geiger Events registration form builder</a>, and the more advanced variants work in <a href="/forms">Geiger Forms</a>.</p>

<h2>A quick note on how rules work</h2>

<p>A conditional rule has three parts: the field it watches, an operator, and a value. "Show <em>Which workshop?</em> when <em>Pass type</em> equals <em>Workshop</em>." In Geiger Events each field can carry one <em>show when</em> rule based on another field's value. In Geiger Forms a field can carry several conditions using <em>Equals</em>, <em>Does not equal</em>, <em>Contains</em> or <em>Is empty</em>, and the field shows when any of them match.</p>

<p>The one rule that matters everywhere: <strong>a required question only counts as required while it is visible.</strong> Both products skip validation on hidden fields, so you can mark a follow-up as required without trapping people who never see it.</p>

<h2>1. The workshop or track picker</h2>

<p><strong>Use it for:</strong> conferences with breakout sessions, training days, <a href="/solutions/events/workshop-class-registration">workshops and classes</a>.</p>
<ul>
  <li><em>Pass type</em> — choice: Main stage only, Main stage + workshop.</li>
  <li><em>Which workshop?</em> — choice, required, shown when Pass type equals "Main stage + workshop".</li>
</ul>
<p><strong>The mistake to avoid:</strong> using the form to cap workshop sizes. A form rule cannot count seats. If each workshop has its own capacity, make each one a ticket type or a slot with its own limit, and keep the form for the information you need about the person. See <a href="/blog/per-ticket-registration-questions">per-ticket questions</a> for how the two combine.</p>

<h2>2. The dietary follow-up</h2>

<p><strong>Use it for:</strong> anything with catering.</p>
<ul>
  <li><em>Any dietary requirements?</em> — choice: No, Vegetarian, Vegan, Halal, Kosher, Allergy, Other.</li>
  <li><em>Tell us about the allergy</em> — long text, required, shown when the answer equals "Allergy".</li>
  <li><em>Please describe</em> — short text, shown when the answer equals "Other".</li>
</ul>
<p><strong>The mistake to avoid:</strong> a single free-text "dietary requirements" box. You get "none", "N/A", "no", "-" and "nope", all of which your caterer has to read. A choice with a targeted follow-up gives you countable data. Geiger Events also rolls these answers up into a single dietary and accessibility report for the venue.</p>

<h2>3. The professional details block</h2>

<p><strong>Use it for:</strong> <a href="/solutions/events/corporate-b2b-events">B2B events</a>, <a href="/solutions/events/expo-trade-show-management">trade shows</a> and anything with printed badges.</p>
<ul>
  <li><em>Attending as</em> — choice: Individual, On behalf of a company, Exhibitor.</li>
  <li><em>Company</em> and <em>Job title</em> — shown when the answer is not "Individual" (in Geiger Forms, a <em>Does not equal</em> condition).</li>
  <li><em>Stand number</em> — shown when the answer equals "Exhibitor".</li>
</ul>
<p><strong>Why it pays off:</strong> company and job title are exactly what <a href="/features/events/badge-printing">badge printing</a> and <a href="/features/events/lead-retrieval">lead retrieval</a> need. Collect them once, at registration, and they flow through instead of being retyped at the badge desk.</p>

<h2>4. The plus-one</h2>

<p><strong>Use it for:</strong> parties, dinners, <a href="/solutions/events/community-event-platform">community events</a>.</p>
<ul>
  <li><em>Bringing a guest?</em> — yes/no.</li>
  <li><em>Guest name</em> — required, shown when the answer is Yes.</li>
</ul>
<p><strong>The mistake to avoid:</strong> treating the guest as a comment on the registrant. If the guest takes a seat, they should count against capacity and appear on the check-in list. Geiger Events has plus-ones and group registration built into registration itself — named guests are stored as a roster on the registration and counted in the party size — so use that rather than a free-text question.</p>

<h2>5. The accessibility follow-up</h2>

<p><strong>Use it for:</strong> every in-person event.</p>
<ul>
  <li><em>Do you have any access requirements?</em> — yes/no, optional.</li>
  <li><em>How can we help?</em> — long text, shown when Yes.</li>
</ul>
<p><strong>Why it is conditional:</strong> most people answer No, and a large empty text box invites people to write "no" in it. The follow-up only appears for the people who need it, and their answer lands on their attendee record so the door team can see it in the <a href="/features/events/event-check-in-app">check-in app</a>.</p>

<h2>6. The application-then-approval flow</h2>

<p><strong>Use it for:</strong> invite-only dinners, vetted professional events, <a href="/solutions/events/membership-organizations">member organisations</a>, speaker or scholarship applications.</p>
<ul>
  <li><em>Why do you want to attend?</em> — long text, required.</li>
  <li><em>Are you a current member?</em> — yes/no.</li>
  <li><em>Membership number</em> — shown when Yes.</li>
</ul>
<p>Turn on an approval gate so each registration arrives as <em>Pending</em>, and approve or decline from the registrations inbox. If the application needs scoring or file uploads (a CV, a portfolio, a proof of eligibility), build it in Geiger Forms with calculated scoring fields, and invite accepted applicants to register in Events. For talks specifically, the <a href="/features/events/call-for-papers">call for papers</a> flow is purpose-built.</p>

<h2>Three rules of thumb</h2>

<ol>
  <li><strong>One question per decision.</strong> If a question only exists to decide which other questions to show, make it a choice, not free text. Rules cannot reliably match "yes", "Yes!" and "yeah".</li>
  <li><strong>Watch one field, not a chain of five.</strong> Deep chains of dependent questions are hard to test and harder to change later. If you need more than two levels, you probably need separate ticket types.</li>
  <li><strong>Test every branch.</strong> Fill the form once per path before publishing. It takes minutes, and it is much cheaper than emailing 300 people for the answer you forgot to ask.</li>
</ol>

<p>If you are still choosing a tool, our <a href="/blog/event-registration-software-conditional-forms">buyer's checklist for registration software with conditional forms</a> covers what to test in a trial. Otherwise, open <a href="/events">Geiger Events</a>, create a registration form, and try the first pattern — it takes about two minutes.</p>
  $html$,
  'Geiger Team',
  'Guides',
  ARRAY['event-registration-rsvp', 'conditional-logic', 'registration-forms', 'geiger-events', 'geiger-forms', 'workshop-class-registration', 'badge-printing', 'membership-organizations'],
  true,
  false,
  '2026-09-25 09:00:00+00',
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
