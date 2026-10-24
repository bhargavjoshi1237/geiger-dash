-- Help events members portal page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the events/members-portal draft outline from
-- 20261024191100_help_events_structure with the full Members portal guide and publishes it.
-- Written from a survey of C:\Pro\geiger-events (app/login/page.js, app/members/*, components/portal/*,
-- components/chat/chat_kit.jsx, app/api/portal/*, lib/portal/*, lib/live/{access,state}.js, lib/memberships/entitlements.js,
-- lib/chat/poll.js, lib/email/{catalog,notifications}.js, lib/stripe/fulfill-checkout.js, next.config.mjs,
-- components/internal/screens/tickets/refunds.jsx, components/internal/screens/orders/constants.js,
-- components/internal/screens/settings/notifications.jsx, supabase/migrations/20260726194133_chat.sql,
-- supabase/migrations/20260904090000_ticket_releases.sql (buy_ticket creates portal accounts), mobile/{app.json,eas.json}).
-- The Expo app in mobile/ is left out: it has no store listing or download link attendees can reach.
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set description = 'Sign in to see your tickets and QR codes, orders and refund requests, memberships, live rooms, recordings, event chats and messages.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'events/members-portal' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'events/members-portal' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, showcase, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.showcase, v.sort_order
from (
  values
    (
      'signing-in',
      'Basics',
      'Signing in to the members portal',
      $html$<p>Attendees sign in to the members portal at <a href="/events/login"><code>geiger.studio/events/login</code></a> with the email address they bought their ticket with. Purchase confirmation emails and event pages don't link to the portal, so share that address with your attendees. The only email that links to it is the one that sets a password.</p><p>The first time, there's no password yet:</p><ol><li>Type your email and choose <strong>Continue</strong>.</li><li>Choose <strong>Email me a set-up link</strong>.</li><li>Open the link in the email within one hour. Each link works once.</li><li>Type a password of at least 8 characters and choose <strong>Set password & sign in</strong>. The portal opens on <strong>Home</strong>.</li></ol><p>After that, type your email, choose <strong>Continue</strong>, type your password and choose <strong>Log in</strong>. If you've forgotten it, choose <strong>Forgot password?</strong> on the password step to get a new set-up link. You stay signed in on that browser for 30 days, then sign in again.</p><p>The members portal is for attendees. Your teammates open Events from Dash and never sign in here.</p>$html$,
      '[]',
      null,
      10
    ),
    (
      'who-has-an-account',
      'Concepts',
      'Who has a members portal account',
      $html$<p>Events creates a members portal account the first time someone places an order with their email, for a free ticket as well as a paid one. On a group order, each attendee whose email was entered at checkout gets an account and sees their own ticket. There's nothing to sign up for.</p><p>One account covers every organizer's events on Geiger Events. The portal shows everything recorded under that email address: orders and tickets from any organizer, plan memberships, and the chats, threads and announcements of the projects you've bought from. Your name starts as the name on your first order.</p><p>Accounts are matched by email, so tickets bought with another address don't appear; sign in with that address instead. Someone who is on a guest list or in a membership plan but has no order under their email has no account and can't sign in.</p>$html$,
      '[]',
      null,
      20
    ),
    (
      'home-and-sidebar',
      'Home',
      'Home and the sidebar',
      $html$<p>The members portal's sidebar has <strong>Home</strong>, then four groups: <strong>Tickets & orders</strong> (<strong>Tickets</strong>, <strong>Orders</strong>, <strong>Memberships</strong>), <strong>Content</strong> (<strong>Live</strong>, <strong>Watch</strong>), <strong>Community</strong> (<strong>Community</strong>, <strong>Q&A</strong>) and <strong>Support</strong> (<strong>Messages</strong>, <strong>Notifications</strong>). Counts beside the entries show how many tickets, orders, memberships and recordings you have, and how many conversations and announcements are unread. <strong>Collapse</strong> at the bottom shrinks the sidebar to icons; on a phone, the menu button at the top left opens it.</p><p>At the top right, the bell opens Notifications and shows a dot while something is unread. Your avatar opens the account menu: <strong>Account settings</strong>, <strong>Contact an organiser</strong> (which opens Messages), a <strong>Light</strong> and <strong>Dark</strong> switch for the portal's look, and <strong>Sign out</strong>.</p><p><strong>Home</strong> greets you and, when you hold a ticket to an upcoming event, shows <strong>Your next event</strong>: its date and venue, a countdown to the day (<strong>Happening now</strong> once it arrives), <strong>View ticket</strong>, and the calendar and directions icons described in <a href="#tickets">Tickets and QR codes</a>. Four figures follow: <strong>Upcoming</strong>, <strong>Tickets</strong>, <strong>Memberships</strong> (active ones) and <strong>Total spent</strong>, which leaves out canceled and refunded orders. A <strong>Become a member</strong> banner appears when an organizer you've bought from offers plans and you hold no active one. <strong>Recent orders</strong> lists your four latest orders; <strong>View all</strong> opens Orders.</p>$html$,
      '[]',
      null,
      30
    ),
    (
      'tickets',
      'Tickets',
      'Tickets and QR codes',
      $html$<p><strong>Tickets</strong> has one ticket for each order placed with your email, under <strong>Upcoming</strong> (events today or later, and events without a date) and <strong>Past</strong>. Canceled and refunded orders aren't listed here; they stay in Orders. Each ticket shows the event, the ticket name and quantity, the date and venue, and what you paid, or Free.</p><p>Click a ticket to open it, and show its QR code at the entrance. One code covers every ticket on the order, and the order number under it starts with <code>GE-</code>. The ticket also shows the attendee, when and where (choose the address to see all of it), the event's time zone and the organizer, then the order: purchase date, slot, add-ons, bundle, group size, discount, early-bird saving, donation and <strong>Total paid</strong>.</p><ul><li>The calendar icon downloads the event as a calendar file. With a start time, the entry lasts two hours; without one, it's an all-day entry.</li><li>The arrow icon opens the venue's address in Google Maps.</li><li><strong>Message Organiser</strong> starts a conversation about the order in Messages.</li><li><strong>Request refund</strong> appears on paid orders; see <a href="#requesting-a-refund">Requesting a refund</a>.</li></ul><p>When the organizer hands out items with tickets, <strong>Collect at the event</strong> lists them with how many you've collected. Show the QR code at the desk to pick them up.</p>$html$,
      '[]',
      null,
      40
    ),
    (
      'orders',
      'Orders',
      'Orders and receipts',
      $html$<p><strong>Orders</strong> lists every order placed with your email, newest first, including canceled and refunded ones. Each shows its status, date, order number, total and any refund request. Filter by <strong>All Statuses</strong>, <strong>Confirmed</strong>, <strong>Cancelled</strong> or <strong>Refunded</strong>, or type in <strong>Search orders</strong> to match the event, order number or ticket name.</p><p>Click an order to open its receipt: the ticket and quantity, <strong>Total paid</strong>, the purchase and event dates, the buyer and the city. <strong>Message organiser</strong> starts a conversation about the order, and paid orders that are still confirmed have <strong>Request refund</strong>.</p><p>Order numbers in the portal are <code>GE-</code> and eight characters. In <strong>Orders → All Orders</strong>, organizers see the same order as <code>ORD-</code> (or their own prefix) and six characters, and those six match the first six of the portal's number.</p>$html$,
      '[]',
      null,
      50
    ),
    (
      'requesting-a-refund',
      'Orders',
      'Requesting a refund',
      $html$<p>To ask for a refund, open the ticket in <strong>Tickets</strong> or the order in <strong>Orders</strong> and choose <strong>Request refund</strong>. Optionally tell the organizer why, then choose <strong>Submit request</strong>. The request is for the order's full total.</p><p><strong>Request refund</strong> only appears on paid orders that are still confirmed and have no refund request yet. Free tickets can't be refunded from the portal. If the organizer has turned refunds off, the portal answers that refunds aren't available for this event.</p><p>Once you've asked, the ticket and the order show the request's status in place of the button: Refund requested, Refund approved, Refund denied or Refunded. You can't send a second request from the portal, even after a denial; message the organizer instead.</p><p>Organizers review requests under <strong>Tickets → Refunds</strong>, where the <strong>Allow refunds</strong> switch is too; see <a href="/help/events/payments">Payments & policies</a>. Changing a request's status doesn't send any money back to the buyer, so arrange the refund itself and record it as described in <a href="/help/events/orders">Orders</a>.</p>$html$,
      '[]',
      null,
      60
    ),
    (
      'memberships',
      'Memberships',
      'Memberships in the portal',
      $html$<p><strong>Memberships</strong> shows the membership plans you hold and the ones you can join. <strong>Your memberships</strong> lists each plan you hold with its poster, price, status (Active, Expired or Cancelled), summary, perks and <strong>What's included</strong>, and the dates it started and ends. The card labels the end date <strong>Renews</strong>, but a membership never renews or charges you again on its own.</p><p>Plans you can join are under <strong>Join a membership</strong>, or <strong>Available memberships</strong> once you hold one. The portal offers the active plans of every project where you've placed an order or hold a plan, when that project has <strong>Enable memberships</strong> and <strong>Public join</strong> on. A plan you hold as Active isn't offered again.</p><ul><li><strong>Join for free</strong> enrolls you in a free plan straight away.</li><li>On a paid plan, the button shows the price and period (<code>/mo</code> for monthly, <code>/yr</code> for yearly) and opens a secure checkout page to pay in US dollars. Once you've paid, you're back in Memberships with a confirmation. If you leave checkout without paying, nothing changes and the portal shows <strong>Checkout canceled.</strong></li></ul><p>A plan card can show a member discount or a percentage off tickets, but Events doesn't apply it at checkout. Recordings a plan gives access to are in Watch. Organizers set up plans in <a href="/help/events/memberships">Memberships</a>.</p>$html$,
      '[]',
      null,
      70
    ),
    (
      'live-rooms',
      'Live',
      'Live rooms',
      $html$<p><strong>Live</strong> lists the rooms, webinars and breakouts you can join, soonest first. It only includes rooms from projects where you hold an active membership plan: rooms the organizer made free to watch, rooms limited to a plan you hold, and rooms your plan's VOD content covers. A ticket on its own doesn't add rooms to Live.</p><p>Each room shows its event, how long until it starts, the plan that gives you access, how many people are watching, and its state:</p><ul><li><strong>Scheduled</strong>: more than 15 minutes before the start. It can't be opened yet.</li><li><strong>Opening soon</strong>: the last 15 minutes before the start. You can open it.</li><li><strong>Live</strong>: from the start time to the end time.</li><li><strong>Manual</strong>: the room has no start time. It's open while the organizer has its status set to Live, or Open for a breakout.</li></ul><p>Rooms leave the list when they end. Click a room to watch its stream in the portal, with the room's description underneath. In a breakout, the <strong>Round clock</strong> counts down the round and <strong>From the host</strong> shows the host's latest messages. Live loads its list when you open it, so open it again to see changes. Organizers set up rooms in <a href="/help/events/broadcast">Broadcast & On-demand</a>.</p>$html$,
      '[]',
      null,
      80
    ),
    (
      'watching-recordings',
      'Watch',
      'Watching recordings',
      $html$<p><strong>Watch</strong> is your library of recordings and simulive sessions. Like Live, it only includes projects where you hold an active membership plan. Every plan member sees the project's recordings; a simulive session can also be limited to a plan you hold or to what your plan's VOD content covers. It lists published recordings, and simulive sessions that are available or premiering, once they have a video link.</p><p>Each card shows the recording, its session and event, the plan that gives you access, and <strong>Access until</strong> a date or <strong>Permanent access</strong>. Type in the search box to match titles, sessions and events. Click a recording to play it in the portal, with its description and tags underneath.</p><p>A simulive session limited to plan members leaves Watch when your access ends: when your membership expires, or when the plan's VOD content period runs out, whichever comes first. Everything else stays while your membership is Active. Organizers manage recordings and who can watch them in <a href="/help/events/broadcast">Broadcast & On-demand</a>.</p>$html$,
      '[]',
      null,
      90
    ),
    (
      'event-chats',
      'Community',
      'Event chats',
      $html$<p><strong>Community</strong> holds the group chats of events you have a ticket to. You're in an event's chat if you had a ticket when the organizer opened it; people who buy a ticket after that aren't added. Archived chats, and chats you've been removed from, don't appear.</p><p>Pick a chat to read it. New messages appear as they're posted, chats with unread messages are marked, and the organizer's posts carry an <strong>Organiser</strong> badge. A chat is one of two kinds:</p><ul><li><strong>Group chat</strong>: everyone can post. Type in the message box and press <code>Enter</code> to send, or <code>Shift Enter</code> for a new line. Messages longer than 4,000 characters are cut off.</li><li><strong>Announcements</strong>: only the organizer posts. You can react and vote.</li></ul><p>Hover over a message and choose the smiley to react with Like, Love, Haha, Celebrate, Insightful or Fire; choose the same reaction again to take it back. To vote in a poll, choose an option. In a single-choice poll another choice moves your vote, a poll marked <strong>pick multiple</strong> takes several, and a closed poll takes none. You can't delete messages from the portal. If the organizer mutes you, the message box is replaced by <strong>You've been muted in this thread.</strong> Organizers run chats from <a href="/help/events/community">Community</a>.</p>$html$,
      '[]',
      null,
      100
    ),
    (
      'qa-threads',
      'Q&A',
      'Q&A threads',
      $html$<p><strong>Q&A</strong> lists the discussion threads organizers have added you to. A thread open to everyone at an event includes everyone who had a ticket when the organizer created it. For other threads the organizer chooses who joins, for example by ticket type, and can add more people later. Archived threads don't appear.</p><p>Each thread shows <strong>Open</strong> (everyone can post) or <strong>Announce</strong> (only the organizer posts), how many people are in it, how many messages it has and when it was last active. Unread threads are marked with a dot. Type in <strong>Search threads</strong> to match thread names and latest messages, and click a thread to open it; the back arrow returns to the list. Posting, reactions and polls work the same as in event chats; see <a href="#event-chats">Event chats</a>.</p>$html$,
      '[]',
      null,
      110
    ),
    (
      'messaging-an-organizer',
      'Messages',
      'Messaging an organizer',
      $html$<p>To contact an organizer, choose <strong>Messages</strong>, then <strong>New message</strong>. Write your message, add a <strong>Subject</strong> if you like, and choose <strong>Send message</strong>. Only the message is required. <strong>Message Organiser</strong> on a ticket, or <strong>Message organiser</strong> on an order, opens the same form with the subject filled in and a note of which order it's about.</p><p>A message about an order goes to the organizer of that order's event. A message started from <strong>New message</strong> goes to the organizer of your most recent order, so start from the ticket or order when you're writing about another event. Organizers can also start a conversation with you.</p><p>Conversations are listed by latest activity, with a dot on any that has an unread reply. Open one to read it, and type in <strong>Reply</strong> to answer. Each shows whether it's Open or Closed, and replying to a closed one reopens it. Replies don't arrive live and Events doesn't email you about them: open the conversation, or reload the portal, to see them. Organizers answer from <strong>Community → Messages</strong>; see <a href="/help/events/community">Community</a>.</p>$html$,
      '[]',
      null,
      120
    ),
    (
      'notifications',
      'Notifications',
      'Notifications and announcements',
      $html$<p><strong>Notifications</strong> shows announcements from the organizers of projects where you've placed an order or hold a membership plan, newest first, up to the latest 50. An announcement appears once its organizer sets its <strong>Status</strong> to <strong>Sent</strong>. Unread ones are highlighted, and the bell at the top of the portal shows a dot while any are unread.</p><p>Opening Notifications marks everything in it as read. An announcement the organizer edits afterwards shows as unread again. Organizers write announcements in <strong>Community → Announcements</strong>; see <a href="/help/events/community">Community</a>.</p>$html$,
      '[]',
      null,
      130
    ),
    (
      'account-settings',
      'Account',
      'Profile, password and signing out',
      $html$<p>To change your details, open the menu on your avatar at the top right of the members portal and choose <strong>Account settings</strong>.</p><ul><li><strong>Profile</strong>: your <strong>Full name</strong>, which is how you appear in event chats and Q&A threads, and an optional <strong>Phone</strong>. Your email can't be changed. Choose <strong>Save Changes</strong>, which is available once you've changed something. A new name doesn't change the name on orders you've already placed.</li><li><strong>Password</strong>: type your <strong>Current password</strong>, a <strong>New password</strong> of at least 8 characters and the same again in <strong>Confirm new password</strong>, then choose <strong>Update password</strong>. You stay signed in everywhere.</li><li><strong>Sessions</strong>: <strong>Sign out</strong> ends your session in this browser. <strong>Sign out of all devices</strong> ends every session on your account, this one included. Neither asks first.</li></ul><p><strong>Sign out</strong> in the avatar menu does the same as the one under <strong>Sessions</strong>. If you've forgotten your current password, sign out and choose <strong>Forgot password?</strong> on the sign-in page.</p>$html$,
      '[]',
      null,
      140
    ),
    (
      'setup-email-missing',
      'Troubleshooting',
      'Set-up email didn''t arrive',
      $html$<p>You chose <strong>Email me a set-up link</strong> or <strong>Forgot password?</strong> and no email arrived, or the link didn't work. Check your spam folder first. The other causes:</p><ul><li>The organizer turned the email off. If you've only bought from one organizer, Events sends the set-up email only while that organizer's project has both <strong>Send transactional emails</strong> and <strong>Set or reset your password</strong> on under <strong>Settings → Notifications</strong>. Organizers who turn either one off stop their attendees from setting a password, so keep both on. See <a href="/help/events/settings">Settings</a>.</li><li>The link expired. Each link works once, for one hour, and an old one shows <strong>This link is invalid or expired.</strong> when you set the password.</li></ul><p>To get a new link, go back to <a href="/events/login"><code>geiger.studio/events/login</code></a>, type your email, choose <strong>Continue</strong>, and choose <strong>Email me a set-up link</strong> or <strong>Forgot password?</strong> again.</p>$html$,
      '[]',
      null,
      150
    ),
    (
      'no-account-found',
      'Troubleshooting',
      'No account found for your email',
      $html$<p>After you type your email and choose <strong>Continue</strong>, the sign-in page says it couldn't find an account for it. Events creates accounts only from orders, so there's no order under the address you typed.</p><ol><li>Work out which address you entered at checkout. For a paid order, it's the address your purchase confirmation was sent to.</li><li>Choose <strong>Try another email</strong> and type that address.</li></ol><p>On a group order, each ticket is under the email entered for that attendee, which can differ from the buyer's. If you're on a guest list or in a membership plan but have never placed an order, there's no account to sign in to. Organizers can check the email on an order in <strong>Orders → All Orders</strong>.</p>$html$,
      '[]',
      null,
      160
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"ShoppingBag","label":"Orders","href":"/help/events/orders"},{"icon":"CreditCard","label":"Payments & policies","href":"/help/events/payments"},{"icon":"BadgeCheck","label":"Memberships","href":"/help/events/memberships"},{"icon":"MessagesSquare","label":"Community","href":"/help/events/community"},{"icon":"Radio","label":"Broadcast & On-demand","href":"/help/events/broadcast"},{"icon":"ScanLine","label":"Check-in","href":"/help/events/check-in"}]',
      null,
      170
    )
) as v(anchor_id, eyebrow, title, content, links, showcase, sort_order)
cross join (select id from public.docs_pages where slug = 'events/members-portal' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Members portal',
    description = 'What attendees see when they sign in: tickets, orders, memberships, live rooms, community and messages.',
    status = 'draft',
    published_at = null
where slug = 'events/members-portal' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'events/members-portal' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Signing in</li><li>Tickets and orders</li><li>Memberships</li><li>Live and watch</li><li>Community and Q&A</li><li>Messages and notifications</li><li>The mobile app</li></ul>',
  10
from public.docs_pages p
where p.slug = 'events/members-portal' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
