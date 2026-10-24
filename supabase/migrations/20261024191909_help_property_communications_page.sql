-- Help property communications page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the property/communications draft outline
-- from 20261024191900_help_property_structure with the full Communications guide (the team chat on the sidebar's
-- Communications screen) and publishes it.
-- Written from a survey of C:\Pro\geiger-property (components/internal/screens/communications/{communications,nav,
-- constants,chat_screen,calls_screen,contacts_screen,files_screen,inbox_screen,settings_screen}.*,
-- communications/parts/{composer,message_group,conversation_dialogs,conversation_list,thread_header,details_sheet,
-- call_dialogs}.jsx, lib/supabase/chat_roster.js).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Communications',
    description = 'Chat with your team in direct messages and channels, reply in threads, share files, and make or schedule audio and video calls.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'property/communications' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'property/communications' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.sort_order
from (
  values
    (
      'opening-communications',
      'Basics',
      'Opening Communications',
      $html$<p><strong>Communications</strong> in the sidebar opens the project's team chat. It has its own rail: <strong>Messages</strong> (direct messages), <strong>Channels</strong>, <strong>Contacts</strong>, <strong>Calls</strong>, <strong>Files</strong>, <strong>Inbox</strong> and <strong>Settings</strong>. Messages, Channels and Inbox show how many unread items they have.</p><p>Your team in chat is the people listed under <strong>Settings → Team &amp; Members</strong> (see <a href="/help/property/settings#team-and-members">Team and members</a>). Anyone else you talk to is marked <strong>Ext.</strong>, short for outside this project's team.</p>$html$,
      '[]',
      10
    ),
    (
      'direct-messages',
      'Conversations',
      'Starting a direct message',
      $html$<p>To message someone, open <strong>Messages</strong> and choose the pencil (<strong>New message</strong>). Search by name, email or username and pick a teammate. To reach someone outside the team, type their exact email or username and choose <strong>Look up this exact email or username</strong>. They must have used chat before; otherwise Property shows "No one with that email or username has used chat yet."</p><p>You can also start a conversation from <strong>Contacts</strong>, which lists your team with their status (Active, Away or Offline) and buttons to message, audio call or video call each person. A teammate who hasn't opened Communications yet shows as <strong>Not on chat yet</strong>.</p>$html$,
      '[]',
      20
    ),
    (
      'channels',
      'Conversations',
      'Creating a channel',
      $html$<p>A channel keeps a team conversation in one place, such as a building, a unit turn or a vendor. To create one, open <strong>Channels</strong> and choose the plus (<strong>Create channel</strong>). Give it a <strong>Name</strong> (shown as <code>#name</code>) and an optional <strong>Topic</strong>, pick its visibility, add people, and create it. Names must be unique in the project.</p><ul><li><strong>Public</strong>: everyone on the project joins.</li><li><strong>Private</strong>: only the people you add.</li></ul><p>To add people later, choose <strong>Add people</strong> in the channel. They see the channel's history and get an Inbox notification. The channel's details show its topic, visibility and members, and let you rename it or change its topic.</p>$html$,
      '[]',
      30
    ),
    (
      'messages',
      'Conversations',
      'Writing, editing and reacting',
      $html$<p>Type in the box at the bottom of a conversation and press <code>Enter</code> to send. <code>Shift Enter</code> adds a new line. Type <code>@</code> and a name to mention someone: pick them with the arrow keys and <code>Enter</code> or <code>Tab</code>.</p><p>To attach files, choose the paperclip or drop them on the box. Each file can be up to 25 MB.</p><p>Hover over a message to react (Like, Love, Haha, Celebrate, Insightful or Fire), <strong>Reply</strong>, or <strong>Reply in thread</strong>. Its <strong>⋯</strong> menu has <strong>Copy text</strong> and <strong>Message info</strong>, plus <strong>Edit</strong> and <strong>Delete</strong> on your own messages. When editing, <code>Enter</code> saves and <code>Esc</code> cancels. Deleting a message happens straight away; choose <strong>Undo</strong> in the confirmation to bring it back.</p><p>The conversation header opens its <strong>Threads</strong> and <strong>Files</strong> panels, starts an audio or video call, and shows the channel or contact details, where you can mute it.</p><p>Right-click a conversation in the list for <strong>Pin to top</strong>, <strong>Mute notifications</strong>, and <strong>Leave channel</strong> or <strong>Remove from list</strong>.</p>$html$,
      '[]',
      40
    ),
    (
      'calls',
      'Calls',
      'Calls',
      $html$<p>To call someone, choose the phone or camera in a conversation's header, or open <strong>Calls</strong> and choose <strong>New call</strong>. Pick audio or video, and ring a teammate or everyone in a channel.</p><p>To plan a call, choose <strong>Schedule</strong> on <strong>Calls</strong>. Give it a title, date and time, pick audio or video, and choose who it's <strong>With</strong>. Everyone invited sees it under <strong>Upcoming</strong> and gets a reminder 15 minutes before. Cancel a scheduled call from the same list.</p><p>Below that, the call history lists every call in this project. Filter it by <strong>Missed</strong>, <strong>Incoming</strong> or <strong>Outgoing</strong>, search it, call someone back, or open the conversation.</p>$html$,
      '[]',
      50
    ),
    (
      'files-and-inbox',
      'Files & inbox',
      'Files and the inbox',
      $html$<p><strong>Files</strong> lists everything shared in this project's conversations, such as photos, leases and invoices. Filter by type (PDF, Image, Archive, Spreadsheet, Slides or Document) or search, then download a file, open its conversation, or remove it.</p><p><strong>Inbox</strong> collects your mentions, channel invites, missed calls, scheduled calls and call reminders. Show <strong>All</strong> or <strong>Unread</strong>, search it, and choose <strong>Mark all read</strong> to clear the unread count. Each item's menu marks it read or unread, or deletes it. The Inbox records these even when a conversation is muted.</p>$html$,
      '[]',
      60
    ),
    (
      'chat-settings',
      'Settings',
      'Chat settings',
      $html$<p><strong>Settings</strong> in the chat rail holds your own chat preferences for this project.</p><ul><li><strong>Profile</strong>: your <strong>Display name</strong> (required) and <strong>Role</strong>, such as Property manager or Leasing agent. Choose <strong>Save profile</strong>.</li><li><strong>Notifications</strong>: turn on <strong>Desktop notifications</strong> in your browser, then choose what notifies you: <strong>Direct messages</strong>, <strong>Mentions</strong> and <strong>All channel messages</strong>. Muted conversations never notify.</li><li><strong>Status</strong>: <strong>Do not disturb</strong> pauses desktop notifications and turns away incoming calls; teammates see you as busy.</li></ul>$html$,
      '[]',
      70
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"Settings","label":"Project settings","href":"/help/property/settings"},{"icon":"Users","label":"Tenants, owners & vendors","href":"/help/property/people"},{"icon":"Radio","label":"Grounding","href":"/help/flow/grounding"}]',
      200
    )
) as v(anchor_id, eyebrow, title, content, links, sort_order)
cross join (select id from public.docs_pages where slug = 'property/communications' and deleted_at is null) p;

-- @down
-- Restores the draft exactly as 20261024191900_help_property_structure left it.
update public.docs_pages
set title = 'Communications',
    description = 'Chat, channels, calls and files for the people who run your properties.',
    status = 'draft',
    published_at = null
where slug = 'property/communications' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'property/communications' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Messages and channels</li><li>Contacts</li><li>Calls</li><li>Files</li><li>Inbox</li><li>Chat settings</li></ul>',
  10
from public.docs_pages p
where p.slug = 'property/communications' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
