-- Help flow grounding page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the flow/grounding draft outline with
-- the full Grounding guide and publishes it. Grounding has no section showcases yet, so every section is text only.
-- Written from a survey of C:\Pro\geiger-flow (components/internal/screens/projects/grounding/**, features/grounding/*,
-- lib/chat/*, app/chat/[id]/page.js, supabase/migrations/20260915182652_chat_workspace.sql).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Grounding',
    description = 'Chat with your project team in direct messages and channels, reply in threads, share files, and start audio or video calls.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'flow/grounding' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'flow/grounding' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, showcase, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.showcase, v.sort_order
from (
  values
    (
      'opening-grounding',
      'Basics',
      'Opening Grounding',
      $html$<p>Grounding is the project's own chat. Open a project in Flow and choose <strong>Grounding</strong> in the sidebar. Everything in it belongs to that project, so each project has its own conversations and channels.</p><p>The rail on the left switches between <strong>Messages</strong> (where Grounding opens), <strong>Channels</strong>, <strong>Contacts</strong>, <strong>Calls</strong>, <strong>Files</strong>, <strong>Inbox</strong> and <strong>Settings</strong>. The panel icon at the bottom of the rail collapses it to icons. The screen you're on is part of the page address, so a refresh or a shared link reopens it.</p><p>To give the chat a browser tab of its own, choose <strong>Open in a new tab</strong> (the arrow icon at the top right). It opens the same Grounding without the rest of the project.</p><p>Everyone in your organization can read and post in a project's Grounding.</p>$html$,
      '[]',
      null,
      10
    ),
    (
      'conversations-channels-threads',
      'Concepts',
      'Direct messages, channels and threads',
      $html$<p>Grounding has three kinds of conversation.</p><ul><li><strong>Direct messages</strong> are one-to-one conversations. You have one with each person in a project, so starting a new message with someone you've already talked to reopens it with its history.</li><li><strong>Channels</strong> are group conversations around a topic, named like <code>#design</code>. A <strong>Public</strong> channel includes everyone who uses Grounding in the project: Flow adds each person to every public channel when they open Messages or Channels. A <strong>Private</strong> channel includes only the people added to it. Every project starts with a public <code>#general</code> channel.</li><li><strong>Threads</strong> are side discussions started from one message in a direct message or channel. Their replies stay in the thread instead of the main conversation.</li></ul><p>A person who isn't a member of the project is <strong>external</strong>. You can still message them, and Flow marks them with an <strong>External</strong> badge in the conversation's header (<strong>Ext.</strong> in the conversation list).</p>$html$,
      '[]',
      null,
      20
    ),
    (
      'starting-a-direct-message',
      'Messages',
      'Starting a direct message',
      $html$<p>To start a direct message, choose <strong>Messages</strong> in the rail, then <strong>New message</strong> (the pencil icon at the top of the list).</p><ol><li>In <strong>Name, email or username</strong>, type part of a teammate's name, email or username.</li><li>Click the person. The conversation opens with them.</li></ol><p>The list shows people who use Grounding in the project. When nobody matches, type the person's full email address or username and choose <strong>Start chat with</strong>. Flow looks for an exact match and tells you when there's no user with that email or username.</p><p>When the person isn't a member of the project, Flow asks first with <strong>Start an external conversation?</strong>. Choose <strong>Message anyway</strong> to go ahead. The conversation then shows a banner saying the person is outside the project.</p>$html$,
      '[]',
      null,
      30
    ),
    (
      'creating-a-channel',
      'Channels',
      'Creating a channel',
      $html$<p>To create a channel, choose <strong>Channels</strong> in the rail, then <strong>Create channel</strong> (the plus icon at the top of the list).</p><ul><li><strong>Name</strong>: required, and <strong>Create channel</strong> stays disabled until there is one. A leading <code>#</code> is dropped. Names are unique within a project, ignoring case, so a name that's taken shows "Couldn't create the channel."</li><li><strong>Topic</strong>: optional. It shows under the channel's name.</li><li><strong>Public</strong> (Anyone can join) or <strong>Private</strong> (Invite only). New channels are Public.</li><li><strong>Add people</strong>: optional. Search by name, username or email and select everyone to add.</li></ul><p>You're added to the channel you create, and it opens straight away. A channel's name, topic and visibility can't be changed afterward.</p><p>To add people later, open the channel and choose <strong>Add people</strong> (the person icon with a plus in its header), select them, then choose <strong>Add</strong>. People already in the channel aren't listed. There's no way to remove someone else from a channel.</p><p>To leave a private channel, right-click it in the list and choose <strong>Leave channel</strong>. It happens straight away, and someone in the channel has to add you back.</p>$html$,
      '[]',
      null,
      40
    ),
    (
      'conversation-list',
      'Messages',
      'The conversation list',
      $html$<p>Messages and Channels each list your conversations, most recently active first. A new message moves its conversation to the top, and a number shows how many of its messages you haven't read. Opening a conversation marks it read.</p><p>The search box at the top of the list matches the names of people and channels, not the text of messages.</p><p>Right-click a conversation for more options:</p><ul><li><strong>Pin to top</strong> moves it into a <strong>Pinned</strong> group at the top of the list, and <strong>Unpin</strong> puts it back. Pins only change your own list.</li><li><strong>Mark as read</strong> clears its unread count without opening it.</li><li>On a channel, <strong>Channel settings</strong> and <strong>View members</strong> open the channel's details.</li><li>On a direct message, <strong>Delete conversation</strong> removes it from your list straight away, without asking. The other person keeps it, and messaging them again brings the history back.</li></ul><p>The × at the top right of an open conversation closes it.</p>$html$,
      '[]',
      null,
      50
    ),
    (
      'sending-messages',
      'Messages',
      'Sending messages and files',
      $html$<p>To send a message, write in the box at the bottom of a conversation and press <code>Enter</code>. Messages are plain text, and a sent message can't be edited or deleted.</p><p>To attach files, choose <strong>Add attachment</strong> (the plus at the left of the box) or the paperclip, and pick one or more files. Each file can be up to 25 MB, and a larger one is left out with a message saying so. Attached files wait above the box until you send, and the × on each one removes it. You can send files without any text. Images show as previews in the conversation, and other files as cards you click to download. Anyone who has a shared file's link can open it.</p><p>Type <code>/</code> at the start of an empty box for commands: <code>/call</code> starts an audio call, <code>/video</code> starts a video call, and <code>/shrug</code> and <code>/tableflip</code> fill the box with ¯\_(ツ)_/¯ and (╯°□°）╯︵ ┻━┻.</p><p>A conversation loads its latest 25 messages, and scrolling up loads older ones. In a direct message, your last message shows <strong>Sent</strong>, then <strong>Seen</strong> once the other person has read it.</p>$html$,
      '[]',
      null,
      60
    ),
    (
      'replies-reactions',
      'Messages',
      'Replies, reactions and message info',
      $html$<p>Hover over a message to see its actions: <strong>React</strong>, <strong>Reply</strong>, <strong>Start thread</strong>, <strong>Copy text</strong> and <strong>Info</strong>.</p><ul><li><strong>React</strong> offers six reactions: Like, Love, Haha, Celebrate, Insightful and Fire. Reactions show under the message with a count, and yours are highlighted. Click a reaction under a message to add or remove your own.</li><li><strong>Reply</strong> quotes the message above the box until you send or choose the × beside the quote. The sent reply carries the quote, and clicking the quote jumps to the original message.</li><li><strong>Start thread</strong> opens a side discussion on the message, as described in <a href="/help/flow/grounding#threads">Threads</a>.</li><li><strong>Copy text</strong> copies the message's text.</li><li><strong>Info</strong> opens <strong>Message info</strong>: who sent it, the full date and time, its reactions, and for your own direct messages whether it's Sent or Seen.</li></ul>$html$,
      '[]',
      null,
      70
    ),
    (
      'threads',
      'Messages',
      'Threads',
      $html$<p>A thread keeps a side discussion out of the main conversation. To start one, hover over a message and choose <strong>Start thread</strong>. Flow names the thread after the first 60 characters of the message (or its attachment's name) and opens it in a panel on the right.</p><p>Replies written in the thread's own box stay in the thread. The message it started from shows how many replies it has: click that to open the thread. Inside a thread you can attach files, react and reply to a message.</p><p>The <strong>Threads</strong> button in a conversation's header shows how many threads the conversation has and lists them, each with its reply count and latest activity. Hover over a thread and open its <strong>⋯</strong> menu to <strong>Rename</strong> it (press <code>Enter</code> to save or <code>Esc</code> to cancel) or <strong>Delete</strong> it. Deleting happens straight away, without asking.</p>$html$,
      '[]',
      null,
      80
    ),
    (
      'shared-files',
      'Files',
      'Shared files',
      $html$<p>The <strong>Files</strong> button in a conversation's header lists what's been shared there, newest first: images as thumbnails, and other files with their size, who shared them and when. Click a file to open or download it.</p><p><strong>Files</strong> in the rail lists shared files in one table, newest first, with each file's <strong>Type</strong>, where it was <strong>Shared in</strong> and its <strong>Size</strong>. Search by file name, or narrow the table to <strong>PDFs</strong>, <strong>Images</strong> or <strong>Docs</strong>. To get a file, hover over its row and choose the download icon.</p><p><strong>Upload</strong> adds one file at a time to the table without posting it in a conversation. Files added this way show <strong>Direct upload</strong> under Shared in.</p>$html$,
      '[]',
      null,
      90
    ),
    (
      'calls',
      'Calls',
      'Audio and video calls',
      $html$<p>To call from a conversation, choose <strong>Start audio call</strong> (the phone icon) or <strong>Start video meeting</strong> (the camera icon) in its header. The <code>/call</code> and <code>/video</code> commands, and <strong>Audio</strong> and <strong>Video</strong> in the conversation's details, do the same. Your browser asks for your microphone, and for a video call your camera. If you don't allow it, the call doesn't start.</p><p>A direct message rings the other person, and a channel rings everyone in it. They see the incoming call only while they have Messages or Channels open in Grounding, and choose <strong>Accept</strong> or <strong>Decline</strong>. Someone already on a call can't be reached, and Flow tells you they're on another call.</p><p>During a call, the screen shows Ringing… and Connecting…, then a timer. <strong>Mute</strong> and <strong>Unmute</strong> switch your microphone, <strong>Stop video</strong> and <strong>Start video</strong> switch your camera in a video call, and <strong>Leave</strong> ends your part. A call in a direct message ends when either person leaves.</p><p>When the caller leaves, the conversation gets a card: <strong>Call ended</strong> with how long it lasted, or <strong>Missed call</strong> if nobody answered. Its <strong>Call back</strong> button starts the same kind of call again. <strong>Calls</strong> in the rail opens <strong>Calls & Meetings</strong>, where <strong>Recent calls</strong> lists the calls you've joined with their <strong>Direction</strong>, <strong>Type</strong>, <strong>Duration</strong> and <strong>When</strong>.</p>$html$,
      '[]',
      null,
      100
    ),
    (
      'contacts-presence',
      'Contacts',
      'Contacts and presence',
      $html$<p><strong>Contacts</strong> in the rail is the team directory: each person's name and email, <strong>Role</strong>, <strong>Status</strong> and <strong>Last active</strong>. Search by name or role, and narrow the list to <strong>Everyone</strong>, <strong>Online</strong> (people showing as Active), <strong>Away</strong> or <strong>Offline</strong>. The message icon on a row switches to Messages, where <strong>New message</strong> starts the conversation.</p><p>A person's status shows as a colored dot on their picture:</p><ul><li><strong>Active</strong> while they have Messages or Channels open in Grounding.</li><li><strong>Away</strong> after 5 minutes without using the page.</li><li><strong>Offline</strong> once they've closed Grounding, or about 2 minutes after they leave Messages and Channels.</li></ul><p>To see someone's details, open your conversation with them and choose <strong>Conversation details</strong> (the i icon in the header): their email, role, when they were last active and their status. A channel's <strong>Channel details</strong> shows its topic and each member with their status. Both have <strong>Audio</strong> and <strong>Video</strong> buttons that start a call.</p>$html$,
      '[]',
      null,
      110
    ),
    (
      'notifications',
      'Notifications',
      'Notifications and the Inbox',
      $html$<p>Grounding can show a desktop notification when a message arrives in one of your conversations while its browser tab is in the background. The notification names the sender and the conversation, and clicking it brings you back to the tab. Notifications come only while Grounding is open in a tab, and never for your own messages.</p><p>To turn them on or off, choose <strong>Settings</strong> in the rail and use <strong>Desktop notifications</strong>. Turning it on asks your browser for permission. If your browser blocks notifications for the site, the switch is disabled until you allow them in the browser's site settings. The setting applies to this browser only.</p><p>The number on <strong>Inbox</strong> in the rail counts messages that arrived in your conversations, and it clears when you come back to the browser tab.</p>$html$,
      '[]',
      null,
      120
    ),
    (
      'shortcuts',
      'Reference',
      'Keyboard shortcuts',
      $html$<ul><li><code>Enter</code> sends a message</li><li><code>/</code> at the start of the message box opens commands: <code>↑</code> and <code>↓</code> move, <code>Enter</code> or <code>Tab</code> runs one, and <code>Esc</code> closes the list</li><li><code>Enter</code> in a new channel's name creates the channel</li><li><code>Enter</code> saves a thread's new name, and <code>Esc</code> cancels it</li></ul>$html$,
      '[]',
      null,
      130
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"Workflow","label":"Geiger Flow","href":"/help/flow"},{"icon":"GitBranch","label":"Issue tracker","href":"/help/flow/issues"},{"icon":"ListTodo","label":"Tasks","href":"/help/flow/tasks"},{"icon":"Users","label":"Team & resources","href":"/help/flow/team"},{"icon":"Images","label":"Assets","href":"/help/flow/assets"},{"icon":"Settings","label":"Project settings","href":"/help/flow/settings"}]',
      null,
      140
    )
) as v(anchor_id, eyebrow, title, content, links, showcase, sort_order)
cross join (select id from public.docs_pages where slug = 'flow/grounding' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Grounding',
    description = 'Chat, channels, calls and meetings for the project team.',
    status = 'draft',
    published_at = null
where slug = 'flow/grounding' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'flow/grounding' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Direct messages and channels</li><li>Threads, reactions and mentions</li><li>Attachments and files</li><li>Audio calls and video meetings</li><li>External contacts</li></ul>',
  10
from public.docs_pages p
where p.slug = 'flow/grounding' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
