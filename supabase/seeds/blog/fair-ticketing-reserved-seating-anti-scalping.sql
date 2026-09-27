-- Hub post: ticket selling and entry, linking the seating, anti-scalping, pricing and access feature pages.
-- Re-runnable: fixed UUID, upserts on re-seed. Tags drive "Related reading" on SEO pages.

insert into public.dash_blog_posts (
  id, title, slug, excerpt, content, author_name, category, tags,
  is_published, is_featured, published_at, reading_time_minutes
) values (
  'e31c7eab-6c05-4331-83ef-b8d33749a703',
  'Selling tickets fairly: reserved seating, anti-scalping and faster entry',
  'fair-ticketing-reserved-seating-anti-scalping',
  'A good on-sale gets tickets to real fans at a fair price and gets them through the door quickly. Here is how seat maps, ticket binding, resale caps, pricing rules and tap-to-enter fit together.',
  $html$
<p>Ticketing looks like a solved problem until your event is popular. Then the questions arrive all at once: why did it sell out in four minutes, why are tickets on a resale site at three times face value, why did two people end up with the same seat, and why is there a forty-minute queue at the door?</p>

<p>None of these is fixed by one feature. They are fixed by a handful of settings that work together. This post goes through them in the order a ticket experiences them — priced, chosen, bought, possibly resold, and finally scanned — and links to the <a href="/events">Geiger Events</a> feature page for each one.</p>

<h2>1. Pricing that matches demand</h2>

<p>Most pricing problems come from a single flat price that is either too low (instant sell-out, resale markup) or too high (a half-empty room). A few tools cover almost every case:</p>
<ul>
  <li><strong>Early-bird tiers and promo codes</strong> reward the people who commit early and give partners a way to share access. See <a href="/features/events/discount-codes-promo">discount codes and promotions</a>.</li>
  <li><strong>Private access codes</strong> let members, past attendees or a mailing list buy before the public on-sale.</li>
  <li><strong><a href="/features/events/dynamic-ticket-pricing">Dynamic pricing</a></strong> lets the price rise as the event fills, so early buyers get a deal and the value that would otherwise go to resellers goes to you.</li>
</ul>

<h2>2. Choosing a seat</h2>

<p>General admission is simplest, but for theatres, comedy clubs, galas and banquet rooms people expect to pick their seat. The two things that matter are the map and the hold:</p>
<ul>
  <li><strong>The map</strong> should be yours — sections, rows, tables, accessible seating — drawn once and reused. <a href="/features/events/event-floor-plans-seating">Floor plans and seating charts</a> cover the layout; <a href="/features/events/reserved-seating">reserved seating</a> puts it into checkout.</li>
  <li><strong>The hold</strong> is what prevents double-booking: when a buyer selects a seat it is held while they pay, and released if they abandon checkout.</li>
</ul>
<p>Reserved seating is often sold as an enterprise add-on. In Geiger Events it is part of ticketing.</p>

<h2>3. Asking the right questions at checkout</h2>

<p>Checkout is also where you collect attendee details. For group purchases, ask per attendee rather than per order, and do it before payment so no ticket is sold without a name. We covered this in <a href="/blog/per-ticket-registration-questions">per-ticket registration questions</a>, and conditional follow-ups in our <a href="/blog/conditional-registration-form-examples">conditional form examples</a>.</p>

<h2>4. Keeping tickets with real fans</h2>

<p>Scalping is an economics problem: if a ticket is worth more than its price, someone will try to capture the difference. You can reduce the incentive (pricing, above) and you can reduce the opportunity:</p>
<ul>
  <li><strong>Bind tickets to the buyer</strong>, so a ticket is tied to a named person rather than being a bearer QR code anyone can screenshot.</li>
  <li><strong>Control transfers</strong> — allow them, restrict them, or turn them off.</li>
  <li><strong>Cap resale at face value</strong>, so a fan who cannot go can pass the ticket on without it becoming a profit opportunity.</li>
  <li><strong>Check identity at the door</strong> for high-demand events.</li>
</ul>
<p>All four are on the <a href="/features/events/anti-scalping-resale">anti-scalping and resale</a> page. Which combination you use depends on the event: a club night might allow face-value transfers; a sold-out headline show might bind tickets and check ID.</p>

<h2>5. Getting through the door</h2>

<p>The last impression is the queue. Three entry methods cover almost every venue:</p>
<ul>
  <li><strong>QR tickets</strong> scanned with the <a href="/features/events/event-check-in-app">check-in app</a> on any phone — no dedicated hardware required.</li>
  <li><strong><a href="/features/events/wallet-passes">Apple and Google Wallet passes</a></strong>, so the ticket is one tap away instead of buried in an email.</li>
  <li><strong><a href="/features/events/rfid-nfc-access">RFID and NFC</a></strong> wristbands, cards or badges for high-volume and multi-day events, where a tap is faster than a scan and re-entry is common.</li>
</ul>

<h2>Recipes by event type</h2>

<h3>Club nights and parties</h3>
<p>Early-bird tiers, a guest list, face-value transfers allowed, QR or wallet entry. More in <a href="/solutions/events/nightlife-club-ticketing">nightlife and club ticketing</a>.</p>

<h3>Theatre, comedy and galas</h3>
<p>A reserved seat map with held seats during checkout, accessible seating marked on the map, wallet passes for entry.</p>

<h3>Festivals</h3>
<p>Tiered pricing that rises as capacity fills, tickets bound to the buyer, face-value resale only, and RFID wristbands for entry and re-entry. More in <a href="/solutions/events/festival-ticketing">festival ticketing</a>.</p>

<h3>Conferences</h3>
<p>Ticket types per audience, group purchases with per-attendee questions, and badges printed at check-in. The full picture is in our <a href="/blog/conference-management-software-guide">conference management guide</a>.</p>

<p>If you are moving from a ticketing platform that charges more as your audience grows, our <a href="/blog/event-platform-alternatives-buyers-guide">guide to choosing an event platform</a> is a good next read. Everything above is part of the <a href="/features/events/event-ticketing-payments">Geiger Events ticketing and payments</a> flow.</p>
  $html$,
  'Geiger Team',
  'Guides',
  ARRAY['reserved-seating', 'anti-scalping-resale', 'rfid-nfc-access', 'wallet-passes', 'dynamic-ticket-pricing', 'discount-codes-promo', 'event-floor-plans-seating', 'event-ticketing-payments', 'festival-ticketing', 'nightlife-club-ticketing', 'geiger-events'],
  true,
  false,
  '2026-09-23 09:00:00+00',
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
