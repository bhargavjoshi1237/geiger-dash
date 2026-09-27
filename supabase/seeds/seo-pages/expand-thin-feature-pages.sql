-- Append a setup walkthrough and FAQ, taken from shipped and enforced Events settings, to thin Events feature pages.
-- Re-runnable: the <!-- expanded:2026-09 --> marker stops a section being appended twice.

update public.dash_seo_pages set content = content || $html$
<!-- expanded:2026-09 -->
<h2>Four kinds of code</h2>
<ul>
  <li><strong>Coupon</strong> — a code buyers type at checkout, like SAVE10.</li>
  <li><strong>Early-bird rule</strong> — a limited-time discount before a cut-off date.</li>
  <li><strong>Group rule</strong> — rewards buyers who bring a crowd, either automatically once an order reaches a quantity, or through a group code you hand out.</li>
  <li><strong>Affiliate code</strong> — a tracked code that attributes sales to a partner, such as a radio station or a newsletter, with a commission recorded per sale.</li>
</ul>

<h2>How to set up a code</h2>
<ol>
  <li><strong>Create it once.</strong> Codes are reusable, created under Tickets → Discounts and attached to any event.</li>
  <li><strong>Set the base discount</strong> and whether it applies once per order or to every ticket bought, plus an optional maximum discount.</li>
  <li><strong>Set the conditions</strong> for when the code works at all: valid from and until dates, a usage limit (0 is unlimited), and minimum or maximum tickets. If a buyer fails a condition they are told the code does not apply — it never silently falls back to a smaller discount.</li>
  <li><strong>Add tiered rules</strong> (optional) so the discount changes by quantity or date. Rules are checked top to bottom and the first match wins, so drag the most specific rule to the top.</li>
  <li><strong>Tick it onto a ticket</strong> from the event's Tickets tab. That is what makes it redeemable for that ticket.</li>
</ol>

<h2>Project-wide settings</h2>
<ul>
  <li><strong>Early-bird sales</strong>: a default discount, when early-bird closes (a number of days before the event), and whether early-bird stacks with coupon codes.</li>
  <li><strong>Group purchasing</strong>: the minimum seats that count as a group, the group discount, and an optional approval step so you review each group order before it is confirmed.</li>
  <li><strong>Access-code tickets</strong>: hidden ticket types unlocked by a code on the event page, with your own prompt text ("Have an access code?") and optional case-sensitive codes.</li>
</ul>

<h2>Questions organisers ask</h2>
<h3>How do I know which code sold the most?</h3>
<p>Every redemption is tied to its order, and affiliate codes carry the partner's name and commission, so you can see which code and which partner drove sales.</p>
<h3>Can early-bird and a coupon both apply?</h3>
<p>Only if you allow it. The <em>Stack with coupons</em> setting decides whether buyers can combine early-bird pricing with a code.</p>
<h3>What is the difference between an access code and a coupon?</h3>
<p>A coupon changes the price of a visible ticket. An access code reveals a ticket that is otherwise hidden — ideal for member pre-sales, VIP allocations and comps.</p>
$html$
where product = 'geiger-events' and page_type = 'feature' and slug = 'discount-codes-promo'
  and content not like '%<!-- expanded:2026-09 -->%';

update public.dash_seo_pages set content = content || $html$
<!-- expanded:2026-09 -->
<h2>How to set it up</h2>
<ol>
  <li><strong>Build the seat map</strong> on the venue — sections, rows, seats per row, tables, GA zones and accessible seats — or import a seat list from CSV. See <a href="/features/events/event-floor-plans-seating">seat maps and floor plans</a>.</li>
  <li><strong>Turn on reserved seating</strong> for the project under Tickets → Reserved Seating, choose the default seat map events start from, and set the <strong>seat hold</strong> — the number of minutes a seat is held while a buyer checks out.</li>
  <li><strong>Enable it per event</strong> from the event's edit page, and choose which ticket types are pick-your-seat and which stay general admission.</li>
  <li><strong>Publish.</strong> Buyers choose their seat on the map during checkout; the Reserved Seating screen lists which of your events use it.</li>
</ol>

<h2>Seat maps built for real rooms</h2>
<p>The seat map editor handles the details real venues have: row labels and a starting row, odd/even seat numbering counted outward from a centre aisle, aisles after given seats, curved and raked sections, tiers, sections that face a stage or a field, round tables with a set number of seats, and GA zones sold by capacity with no chairs. Each venue can keep several configurations — end-stage, in the round, banquet rounds — and every event picks the one it needs.</p>

<h2>Questions organisers ask</h2>
<h3>How long is a seat held?</h3>
<p>As long as you set. The seat hold is configured in minutes; if the buyer does not complete checkout in that window, the seat returns to the map.</p>
<h3>Can one event sell reserved and standing tickets?</h3>
<p>Yes. Mark some ticket types as pick-your-seat and keep others general admission, or add a GA zone to the map itself for a standing floor.</p>
<h3>Can I import our existing seating plan?</h3>
<p>Yes. The editor imports seats from CSV, and exports from most box-office systems work as-is.</p>
<h3>Is reserved seating an add-on?</h3>
<p>No, it is part of ticketing, alongside <a href="/features/events/discount-codes-promo">early-bird pricing and promo codes</a>. Read <a href="/blog/fair-ticketing-reserved-seating-anti-scalping">selling tickets fairly</a> for seating recipes by event type.</p>
$html$
where product = 'geiger-events' and page_type = 'feature' and slug = 'reserved-seating'
  and content not like '%<!-- expanded:2026-09 -->%';

update public.dash_seo_pages set content = content || $html$
<!-- expanded:2026-09 -->
<h2>Two ways to get your own address</h2>
<h3>Claim a subdomain</h3>
<p>The quickest option: choose a subdomain name — letters, numbers and hyphens — and your event pages are served from it instead of the default URL. No DNS changes needed.</p>
<h3>Point your own domain</h3>
<p>For a fully branded address such as <code>events.yourcompany.com</code>, add the domain in Settings → Custom Domains. Geiger Events shows you the DNS record to create: a CNAME pointing at the target it gives you, with the name, type and TTL spelled out and a button to copy the target. Add that record at your DNS provider.</p>

<h2>Verification and security</h2>
<p>Once the record is in place, Geiger Events verifies the domain and secures it with an SSL certificate. Each domain shows its status — <strong>Pending</strong> while it waits for DNS or SSL, <strong>Connected</strong> once it is verified and live, or <strong>Failed</strong> if the record is wrong — so you know exactly where setup stands. You can connect more than one domain and remove any you no longer use.</p>

<h2>Questions organisers ask</h2>
<h3>Why a subdomain rather than my root domain?</h3>
<p>Your root domain usually hosts your main website. A subdomain such as <code>events.</code> or <code>tickets.</code> keeps event pages on your brand without touching the site you already run.</p>
<h3>How long does verification take?</h3>
<p>It depends on how quickly your DNS provider publishes the record — often minutes, occasionally longer. The domain stays Pending until the record is visible and the certificate is issued.</p>
<h3>Does it change how the pages look?</h3>
<p>The address changes; the design comes from the <a href="/features/events/event-page-builder">page builder</a> and your <a href="/features/events/organizer-event-page">organiser page</a>. Together they keep the whole journey, from link to checkout, on your brand.</p>
$html$
where product = 'geiger-events' and page_type = 'feature' and slug = 'custom-domains-branding'
  and content not like '%<!-- expanded:2026-09 -->%';
