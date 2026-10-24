-- Help events community page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the events/community draft outline from
-- 20261024191100_help_events_structure with the full Community guide and publishes it. Polls and Surveys are left out:
-- their records reach no attendee (polls posted inside a chat are covered). Meeting Scheduler and Discussion Boards
-- open a Coming soon screen.
-- Written from a survey of C:\Pro\geiger-events (components/internal/sidebar/sidebar_nav.jsx,
-- components/internal/screens/registry.jsx, components/internal/screens/community/*,
-- components/internal/screens/messages/*, components/internal/screens/events/event_communication.jsx and
-- event_sections.js, components/chat/chat_kit.jsx, components/internal/shared/records/*,
-- components/internal/shared/audience/*, lib/chat/poll.js, lib/supabase/chat.js, messages.js, community.js, records.js,
-- lib/audience/resolve.js, lib/portal/chat.js, support.js, notifications.js, memberships.js, push_fanout.js,
-- lib/email/catalog.js, components/portal/portal_shell.jsx, portal_sidebar.jsx, portal_notifications.jsx,
-- app/api/portal/threads/*, app/api/portal/push/announce/route.js, geiger-rbac.config.js, and
-- supabase/migrations/20260726194133_chat.sql, 20260726194134_project_access.sql, 20260726194119_portal_support.sql,
-- 20260726194137_portal_broadcast.sql, 20260904090000_ticket_releases.sql).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set description = 'Run each event''s group chat and Q&A threads, answer attendee messages, and post announcements to the members portal.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'events/community' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'events/community' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, showcase, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.showcase, v.sort_order
from (
  values
    (
      'opening-an-event-chat',
      'Basics',
      'Opening an event chat',
      $html$<p>Each event can have one group chat for its attendees, and you open it from the event editor. In the sidebar, choose <strong>Events → All Events</strong>, click the event, then open <strong>Communication</strong> in the event editor. Under <strong>Open the event chat</strong>, choose how attendees take part:</p><ul><li><strong>Open discussion</strong>: attendees can post, react and vote in polls.</li><li><strong>Announce-only</strong>: only you and your teammates post. Attendees can react and vote in polls.</li></ul><p>The chat opens straight away, named after the event, and Events adds everyone who has bought a ticket to the event so far. People who buy a ticket after that aren't added on their own, and an event chat has no way to add them later, so the chat reaches the most attendees when you open it after most tickets have sold. Events doesn't open a chat by itself when you publish the event or sell a ticket.</p><p>Attendees read and post in the chat from <strong>Community</strong> in their members portal. See <a href="/help/events/members-portal">Members portal</a>.</p><p>By default, <strong>Community</strong> appears in the sidebar for the Owner, Admin, Manager and Member roles. To change who sees it, see <a href="/help/events/settings#roles-and-permissions">Roles and permissions</a>.</p>$html$,
      '[]',
      null,
      10
    ),
    (
      'chats-threads-messages-and-announcements',
      'Concepts',
      'Chats, threads, messages and announcements',
      $html$<p>Community gives you four ways to reach attendees, and each one reaches a different set of people.</p><ul><li><strong>Event chat</strong>: one group chat per event, for the people who had bought a ticket when it opened. You read and post in it under <strong>Community → Event Chat</strong>; attendees use <strong>Community</strong> in their members portal.</li><li><strong>Q&A threads</strong>: topic chats for an event, as many as you need, each open to all of the event's attendees or a group you pick. You run them under <strong>Community → Q&A</strong>; attendees use <strong>Q&A</strong> in their members portal.</li><li><strong>Messages</strong>: private conversations between your team and one attendee, under <strong>Community → Messages</strong>.</li><li><strong>Announcements</strong>: updates that appear under <strong>Notifications</strong> in attendees' members portal once you mark them Sent.</li></ul><p>Chats and threads have a posting mode, Open discussion or Announce-only, and a status, Active or Archived. An archived chat or thread disappears from attendees' members portal and takes no new messages until you reopen it. Everyone on your team who can open Community can read and post in every chat, thread and conversation, and team posts in chats carry an <strong>Organiser</strong> badge.</p>$html$,
      '[]',
      null,
      20
    ),
    (
      'posting-and-archiving',
      'Event editor',
      'Posting and archiving an event chat',
      $html$<p>Once an event's chat is open, the event editor's <strong>Communication</strong> section shows its <strong>Chat settings</strong>. Both switches save as you change them, so there's no Save button.</p><ul><li><strong>Allow attendees to post</strong>: on for an open discussion, off for announce-only. With it off, only your team posts, and attendees can still react and vote in polls.</li><li><strong>Archive chat</strong>: on closes the chat. It disappears from attendees' members portal, nobody can post in it, and its messages are kept. Turn it off to reopen the chat.</li></ul><p><strong>Open chat</strong> at the top of the section, and <strong>Open in Community</strong>, take you to <strong>Community → Event Chat</strong>, where you read and post. You change an event chat's posting mode and archive it only here, and an event chat can't be deleted.</p>$html$,
      '[]',
      null,
      30
    ),
    (
      'event-chat-list',
      'Event Chat',
      'The Event Chat list',
      $html$<p>Choose <strong>Community → Event Chat</strong> in the sidebar to see the project's event chats, with the most recent activity first. Each row shows the chat's name, its posting mode (<strong>Open</strong> or <strong>Announce</strong>), its latest message, how many attendees are in it, how many messages it has, and how long ago someone last posted.</p><p>The list starts on Active chats. Filter by posting mode (<strong>All Types</strong>, <strong>Open discussion</strong> or <strong>Announce-only</strong>) and status (<strong>Active</strong>, <strong>Archived</strong> or <strong>All Statuses</strong>), and sort by <strong>Recent activity</strong>, by name from A to Z, or by <strong>Most attendees</strong> or <strong>Most messages</strong>. Search matches chat names and latest messages. When nothing matches, <strong>Clear filters</strong> puts the search and filters back to how the list starts and leaves the sort as it is.</p><p>Event Chat has no button for creating a chat: open one from the event's <strong>Communication</strong> section in the event editor. Click a chat to open it.</p>$html$,
      '[]',
      null,
      40
    ),
    (
      'posting-reacting-and-deleting',
      'Event Chat',
      'Posting, reacting and deleting messages',
      $html$<p>To post in an event chat, open it from <strong>Community → Event Chat</strong>, type in the box at the bottom and press <code>Enter</code>. <code>Shift Enter</code> starts a new line. Your team can post in Announce-only chats too. Messages from attendees and teammates appear as they're posted, without reloading, and the arrow at the top left goes back to the list.</p><p>Hover over a message to act on it:</p><ul><li>The smiley icon reacts with <strong>Like</strong>, <strong>Love</strong>, <strong>Haha</strong>, <strong>Celebrate</strong>, <strong>Insightful</strong> or <strong>Fire</strong>. Each reaction shows its count under the message. Click a reaction under the message to add yours or take it back.</li><li>The <strong>⋯</strong> menu has <strong>Delete</strong>, which removes any message, an attendee's or your own, straight away without asking. Everyone then sees <em>Message removed</em> in its place, and it can't be restored.</li></ul><p>Messages can't be edited once they're sent. When a chat is archived, the message box closes and nobody can post. Q&A threads work the same way.</p>$html$,
      '[]',
      null,
      50
    ),
    (
      'polls-in-a-chat',
      'Event Chat',
      'Polls in a chat',
      $html$<p>To ask attendees a question they vote on, open a chat and choose the chart icon beside the message box. In <strong>New poll</strong>, type the <strong>Question</strong> and at least two <strong>Options</strong>. <strong>Add option</strong> adds another, up to 6, and the × beside an option removes it while there are more than two. Turn on <strong>Allow multiple choices</strong> to let people pick more than one option; it's off to start with. <strong>Post poll</strong> stays disabled until there's a question and two filled-in options.</p><p>The poll appears in the chat as a message. Attendees vote from their members portal, in Announce-only chats too, and you and your teammates can vote as well. Click an option to vote and click it again to take the vote back. In a single-choice poll, choosing another option moves your vote. Each option shows its votes and its share, the total at the bottom counts each voter once, and the results update as votes come in.</p><p>A poll can't be edited or closed once it's posted. To take it down, delete it from its <strong>⋯</strong> menu like any other message. The chart icon is hidden in an archived chat, and polls work the same way in Q&A threads.</p>$html$,
      '[]',
      null,
      60
    ),
    (
      'muting-and-removing-attendees',
      'Event Chat',
      'Muting and removing attendees',
      $html$<p>The people button at the top right of an open chat shows how many attendees are in it. Choose it to open <strong>Participants</strong>, which lists every attendee in the chat. Rows are labeled Attendee and don't show names or emails.</p><ul><li>The speaker icon mutes an attendee, and choosing it again unmutes them. A muted attendee is marked <strong>Muted</strong> and can't post, but can still read, react and vote in polls.</li><li>The remove icon takes the attendee out of the chat straight away, without asking, and the chat disappears from their members portal. An event chat has no way to add them back.</li></ul><p>Both changes save as you make them. Your teammates aren't listed, and they can't be muted or removed.</p>$html$,
      '[]',
      null,
      70
    ),
    (
      'creating-a-qa-thread',
      'Q&A',
      'Creating a Q&A thread',
      $html$<p>A Q&A thread is a topic chat for one event, such as one for parking and travel, and an event can have as many as you need. To create one, choose <strong>Community → Q&A</strong> in the sidebar, then <strong>New thread</strong>.</p><ol><li>Under <strong>Event</strong>, choose the event the thread belongs to.</li><li>Type a <strong>Thread name</strong>. Optional: add a <strong>Description</strong> of what the thread is for.</li><li>Optional: turn on <strong>Announce-only</strong> so only your team posts. It's off to start with, so attendees can post.</li><li>Under <strong>Who can join</strong>, choose <strong>All attendees</strong> or <strong>Filtered</strong>.</li><li>Choose <strong>Create thread</strong>. The thread opens, ready for a first message.</li></ol><p>The event and the name are required. <strong>All attendees</strong> adds everyone who has bought a ticket to the event so far. People who buy later aren't added on their own: add them under <strong>Participants → Add members</strong>.</p><p><strong>Filtered</strong> narrows the event's buyers by <strong>Ticket</strong>, <strong>Offering</strong>, <strong>Add-on</strong>, <strong>Tag</strong>, <strong>Status</strong> or <strong>Segment</strong>, and you can click people in the list to include or exclude them one by one. It needs at least one filter or person, and the count beside the choice shows how many people match. A filtered thread keeps its rule: each time a teammate opens the thread in Q&A, Events adds anyone who now matches, and it never removes anyone. Tags, statuses and segments come from <a href="/help/events/guests">Guests</a>.</p><p>Attendees find the thread under <strong>Q&A</strong> in their members portal.</p>$html$,
      '[]',
      null,
      80
    ),
    (
      'managing-qa-threads',
      'Q&A',
      'Managing Q&A threads',
      $html$<p><strong>Community → Q&A</strong> lists the project's threads, with the most recent activity first. Each row shows the thread's name, its posting mode, its audience when it's filtered, its latest message (or its event, before anyone posts), and its member and message counts. The filters, sort and search work as they do in Event Chat, with <strong>Most members</strong> in place of Most attendees, and search also matches thread descriptions and event names.</p><p>Click a thread to open it. You post, react, run polls and delete messages there the same way as in an event chat. The gear icon at the top right holds the thread's settings, which save straight away:</p><ul><li><strong>Switch to announce-only</strong> or <strong>Switch to open discussion</strong>.</li><li><strong>Archive thread</strong> hides the thread from attendees and stops new posts, and <strong>Reopen thread</strong> undoes it.</li><li><strong>Delete thread</strong> asks you to confirm first. Members lose access, the messages go with it, and it can't be restored.</li></ul><p>The people button opens <strong>Participants</strong>, where you mute and remove members the same way as in an event chat. <strong>Add members</strong> lists the event's ticket buyers: narrow them with the same filters, select people or choose <strong>Select all</strong>, then choose <strong>Add</strong>. Someone you remove from a filtered thread is added back the next time a teammate opens it, if they still match its rule.</p>$html$,
      '[]',
      null,
      90
    ),
    (
      'answering-attendee-messages',
      'Messages',
      'Answering attendee messages',
      $html$<p><strong>Community → Messages</strong> is your team's inbox for private conversations with attendees. An attendee starts one from <strong>Messages</strong> in their members portal, or from one of their orders or tickets, which links it to that order and its event. A conversation that isn't about an order goes to the project of the attendee's most recent order. See <a href="/help/events/members-portal">Members portal</a>.</p><p>Conversations are listed with the latest activity first. Each shows its subject, the attendee, a preview, the event (marked order when it's about one), its status and the time. Unread conversations are bold with a dot, and a line at the top of the list counts them. Filter by <strong>All threads</strong>, <strong>Open</strong> or <strong>Closed</strong>, or search by subject, attendee name or email, event or the latest message.</p><p>Click a conversation to read it. Opening it marks it read for your whole team. Type your reply and choose the send button: <code>Enter</code> starts a new line. The attendee sees your reply under <strong>Messages</strong> in their members portal, marked unread. Events doesn't email them about it, and doesn't email you when they write.</p><p><strong>Mark resolved</strong> closes the conversation and <strong>Reopen</strong> opens it again. A new reply from either side reopens a closed conversation. An open conversation doesn't update by itself: go back to <strong>Messages</strong> and open it again to see new replies. Conversations and their messages can't be deleted.</p>$html$,
      '[]',
      null,
      100
    ),
    (
      'sending-a-broadcast',
      'Messages',
      'Sending a broadcast',
      $html$<p>A broadcast sends the same message to many attendees at once, as a separate private conversation with each one. In <strong>Community → Messages</strong>, choose <strong>New broadcast</strong>.</p><ul><li><strong>Subject</strong>: optional. It becomes each conversation's title. Without one, the title is <code>Message from the organiser</code>.</li><li><strong>Audience</strong>: leave <strong>Scope</strong> on <strong>All guests (project-wide)</strong> to choose from the people in <strong>Guests → Guest List</strong>, or pick an event to choose from its ticket buyers. Keep everyone, or choose <strong>Filtered</strong> to narrow them by tag, status or segment (and by ticket, offering or add-on when you picked an event), and click people to include or exclude them.</li><li><strong>Message</strong>: required.</li></ul><p>Choose <strong>Send broadcast</strong>. Each person gets the message straight away as an unread conversation under <strong>Messages</strong> in their members portal. The conversations also appear in your inbox, and each person's reply comes back in their own conversation. Only people with a members-portal account receive a broadcast: Events tells you how many it reached, or that no one received it. A sent broadcast can't be recalled.</p>$html$,
      '[]',
      null,
      110
    ),
    (
      'creating-an-announcement',
      'Announcements',
      'Creating an announcement',
      $html$<p>To post an update to attendees' members portal, choose <strong>Community → Announcements</strong> in the sidebar, then <strong>Add announcement</strong>. Only the <strong>Title</strong> is required. Choose <strong>Add announcement</strong> in the dialog, and the announcement joins the list as a Draft.</p><p>Click it to open its editor and write the <strong>Message</strong>, which attendees read under the title. Changes in the editor need <strong>Save Changes</strong>. To show the announcement to attendees, set <strong>Status</strong> to Sent and save: attendees never see a Draft or Scheduled announcement. The <strong>Channel</strong>, <strong>Scheduled for</strong> and <strong>Audience</strong> fields don't change who sees it or how it's delivered.</p><p>The figures across the top count <strong>Announcements</strong>, <strong>Sent</strong>, <strong>Scheduled</strong> and <strong>Draft</strong>, and the list shows the newest first. Filter by status or channel, or search titles and messages. Each row's <strong>⋯</strong> menu has <strong>Edit</strong>, <strong>Duplicate</strong> and <strong>Delete</strong>. Events asks you to confirm a delete, and a deleted announcement can't be restored.</p>$html$,
      '[]',
      null,
      120
    ),
    (
      'who-sees-an-announcement',
      'Announcements',
      'Who sees an announcement',
      $html$<p>An announcement reaches attendees only once its <strong>Status</strong> is Sent. It then appears under <strong>Notifications</strong> in the members portal of everyone who has an order for any of the project's events or holds one of its membership plans. They see its title, its message and the time it was last saved, marked unread until they open Notifications. The portal loads announcements when it opens and shows the last 50 saved.</p><p>The other fields don't change that:</p><ul><li><strong>Audience</strong> doesn't narrow it. Everyone with an order or a plan in the project sees a Sent announcement, whoever you picked.</li><li><strong>Channel</strong> doesn't change delivery. Events sends no email or text message for an announcement, whichever channel you choose.</li><li><strong>Scheduled for</strong> doesn't send anything. A Scheduled announcement stays hidden from attendees until you set it to Sent yourself.</li></ul><p>Saving a change to a Sent announcement, even a typo fix, moves it to the top of attendees' Notifications and marks it unread again. Setting it back to Draft or Scheduled, or deleting it, takes it out of their Notifications. <strong>Duplicate</strong> keeps the status, so a copy of a Sent announcement shows to attendees straight away.</p>$html$,
      '[]',
      null,
      130
    ),
    (
      'limits-and-options',
      'Reference',
      'Limits and options',
      $html$<ul><li>Chat, thread and conversation messages: up to 4,000 characters. Events cuts off anything longer.</li><li>Polls: 2 to 6 options, single or multiple choice.</li><li>Reactions: Like, Love, Haha, Celebrate, Insightful and Fire.</li><li>Q&A threads: names up to 120 characters and descriptions up to 500.</li><li>Broadcast subjects: up to 160 characters.</li><li>Members portal Notifications: the last 50 Sent announcements saved.</li><li>In chats and threads, <code>Enter</code> sends and <code>Shift Enter</code> starts a new line. In Messages, <code>Enter</code> starts a new line and the send button sends.</li></ul>$html$,
      '[]',
      null,
      140
    ),
    (
      'attendee-cant-see-a-chat',
      'Troubleshooting',
      'An attendee can''t see a chat or thread',
      $html$<p>When an attendee says an event chat or Q&A thread is missing from their members portal, check these causes:</p><ul><li>They bought their ticket after the event chat opened, or after an All attendees thread was created. Events doesn't add later buyers on its own. For a Q&A thread, add them under <strong>Participants → Add members</strong>. An event chat has no way to add them.</li><li>The chat or thread is archived. To reopen an event chat, turn off <strong>Archive chat</strong> in the event editor's <strong>Communication</strong> section. To reopen a thread, choose <strong>Reopen thread</strong> from its gear icon.</li><li>Someone on your team removed them under <strong>Participants</strong>.</li><li>They signed in to the members portal with a different email from the one on their order. Chats and threads go to the account with the order's email.</li></ul>$html$,
      '[]',
      null,
      150
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"CircleUserRound","label":"Members portal","href":"/help/events/members-portal"},{"icon":"CalendarDays","label":"Events","href":"/help/events/events"},{"icon":"Users","label":"Guests","href":"/help/events/guests"},{"icon":"ShoppingBag","label":"Orders","href":"/help/events/orders"},{"icon":"BadgeCheck","label":"Memberships","href":"/help/events/memberships"},{"icon":"Settings","label":"Settings","href":"/help/events/settings"}]',
      null,
      200
    )
) as v(anchor_id, eyebrow, title, content, links, showcase, sort_order)
cross join (select id from public.docs_pages where slug = 'events/community' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Community',
    description = 'Run event chat, answer attendee messages, and engage attendees with polls, surveys, Q&A and announcements.',
    status = 'draft',
    published_at = null
where slug = 'events/community' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'events/community' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Event chat</li><li>Messages</li><li>Polls</li><li>Surveys</li><li>Q&A</li><li>Announcements</li></ul>',
  10
from public.docs_pages p
where p.slug = 'events/community' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
