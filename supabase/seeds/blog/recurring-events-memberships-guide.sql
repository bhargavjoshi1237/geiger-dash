-- Hub post: recurring events, memberships and community, linking the related Events feature/solution pages.
-- Re-runnable: fixed UUID, upserts on re-seed. Tags drive "Related reading" on SEO pages.

insert into public.dash_blog_posts (
  id, title, slug, excerpt, content, author_name, category, tags,
  is_published, is_featured, published_at, reading_time_minutes
) values (
  'a81eef1f-9be2-4c50-92d8-5cdcef756c75',
  'Running recurring events and memberships without rebuilding everything each week',
  'recurring-events-memberships-guide',
  'Weekly classes, monthly meetups and member programmes all share one problem: the setup work repeats. Here is how series, templates, memberships and automations take the repetition out.',
  $html$
<p>A one-off event is a project. A recurring event is a process, and processes break differently. The first edition of a weekly class takes an afternoon to set up. The fortieth should take thirty seconds — but with most tools it still takes the afternoon, because every edition is a fresh event with a fresh page, fresh tickets and a fresh guest list that knows nothing about the last one.</p>

<p>This guide covers the four things that turn recurring events from a chore into a system: series, templates, memberships and automations. It is written for anyone running <a href="/solutions/events/recurring-events">recurring events</a> — classes, meetups, clubs, run groups, <a href="/solutions/events/workshop-class-registration">workshops</a> — and for <a href="/solutions/events/membership-organizations">membership organisations</a> whose events are part of what members pay for.</p>

<h2>1. Series: one event, many editions</h2>

<p>An <a href="/features/events/event-series-recurring">event series</a> groups editions together and applies a recurrence rule — every Tuesday, the first Thursday of the month — so the next edition is created for you and inherits the last one's settings. Edit the series and every future edition follows; edit one edition and only that one changes.</p>

<p>The less obvious benefit is continuity of data. When all the editions belong to one series, you can see who comes every week, who came three times and stopped, and which editions sold out. That is the information you need to decide whether to add a second weekly slot.</p>

<h2>2. Templates: for events that repeat but not on a schedule</h2>

<p>Not everything recurs on a fixed rhythm. A quarterly workshop, a pop-up dinner or a launch party happens whenever it happens, but the setup is the same each time. <a href="/features/events/event-templates">Event templates</a> save the format, capacity, visibility, tickets and defaults so the next one starts from a known-good setup rather than from memory. If your registration form uses conditional questions, the template keeps those too — see our <a href="/blog/conditional-registration-form-examples">conditional registration form examples</a> for patterns worth saving.</p>

<h2>3. Memberships: pay once, come often</h2>

<p>For regulars, buying a ticket every week is friction. <a href="/features/events/memberships">Memberships</a> let you sell a plan — one-time, monthly or yearly — that unlocks:</p>
<ul>
  <li><strong>Member pricing</strong> on tickets, or free entry.</li>
  <li><strong>Member-only registration</strong> for events that are part of the membership.</li>
  <li><strong>A managed roster</strong>, with public join pages and auto-renewal, so you are not reconciling a spreadsheet against payments.</li>
</ul>
<p>Membership also works as an access rule on registration: an event can be limited to members, or members can register before everyone else. Combined with approval gates, it covers most "members and invited guests" formats. The <a href="/features/events/event-registration-rsvp">registration and RSVP</a> page covers those gates.</p>

<h2>4. Audience: people who follow you, not just one event</h2>

<p>For a recurring programme, the audience is the asset. An <a href="/features/events/organizer-profiles-followers">organiser profile with followers</a> means your next event reaches people who already opted in, rather than depending on a marketplace to surface it. Between events, <a href="/features/events/event-community-engagement">community features</a> — announcements, polls, discussion boards, chat — keep people engaged, and <a href="/features/events/event-email-sms-marketing">email and SMS</a> handle the "this week's session" reminder.</p>

<p>Every attendee lands in your <a href="/features/events/attendee-crm">attendee CRM</a> with their history across editions, so you can segment regulars from first-timers and treat them differently.</p>

<h2>5. Automations: the jobs you do every single week</h2>

<p>List the things you do manually for each edition. It usually looks like: send a reminder the day before, send a thank-you afterwards, nudge people who registered but did not show up, welcome first-timers, and tell the waitlist when a spot opens. Each of those is a trigger and an action, which is exactly what <a href="/features/events/event-automation">event automations</a> are for: a registration submitted, an event starting soon, an attendee checked in or marked a no-show — each can kick off emails, SMS or tags, with run history so you can see what fired.</p>

<p>Waitlist promotion in particular should never be manual for a recurring event. With a capacity limit and an auto-promoting waitlist, a cancellation on Monday fills itself before Tuesday's class.</p>

<h2>A setup that runs itself</h2>

<p>Put together, a weekly class looks like this:</p>
<ol>
  <li>A series with a weekly recurrence and a capacity limit.</li>
  <li>A short registration form with one conditional question (first time? show "anything we should know?").</li>
  <li>A monthly membership that makes each class free for members, with drop-in tickets for everyone else.</li>
  <li>Automations for the day-before reminder, the first-timer welcome and the post-class thank-you.</li>
  <li>An organiser profile, so followers hear about new series and one-off specials.</li>
</ol>
<p>After the first afternoon of setup, the weekly work is showing up and teaching the class.</p>

<h2>Where to go next</h2>
<p>If you run a community rather than a class, <a href="/solutions/events/community-event-platform">community event platform</a> is the better starting point; creators selling to their own audience should read <a href="/solutions/events/creator-events">events for creators</a>; and if your events raise money, see <a href="/solutions/events/nonprofit-fundraising-events">nonprofit and fundraising events</a>. Choosing a platform in the first place? Our <a href="/blog/event-platform-alternatives-buyers-guide">buyer's guide</a> covers the five questions to ask.</p>
  $html$,
  'Geiger Team',
  'Guides',
  ARRAY['event-series-recurring', 'recurring-events', 'memberships', 'membership-organizations', 'event-templates', 'event-automation', 'organizer-profiles-followers', 'event-community-engagement', 'community-event-platform', 'workshop-class-registration', 'creator-events', 'nonprofit-fundraising-events', 'geiger-events'],
  true,
  false,
  '2026-09-20 09:00:00+00',
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
