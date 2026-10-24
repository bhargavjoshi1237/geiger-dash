-- Help comms inbox page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the comms/inbox draft outline from
-- 20261024191800_help_comms_structure with the full Inbox guide (Your Inbox, All Conversations, Mentions and Views).
-- Comms isn't deployed yet, so the page stays a draft.
-- Written from a survey of C:\Pro\geiger-comms (components/internal/screens/inbox/inbox_shell.jsx, use_inbox_shell.js,
-- conversation_list.jsx, conversation_row.jsx, conversation_thread.jsx, composer.jsx, copilot.jsx, use_thread_copilot.js,
-- message_bubble.jsx, contact_panel.jsx, tag_picker.jsx, bulk_bar.jsx, merge_dialog.jsx, custom_snooze_dialog.jsx,
-- new_conversation_dialog.jsx, availability_toggle.jsx, views.jsx, view_detail.jsx, view_sections.jsx, constants.js,
-- components/internal/sidebar/use_mention_badge.js, lib/supabase/comms.js, views.js, mentions.js,
-- app/api/ai/inbox/translate/route.js, supabase/migrations/20261021103241_inbox_message_search.sql,
-- 20261021103242_conversation_merge.sql, 20261021103418_email_outbox.sql, geiger-rbac.config.js).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Inbox',
    description = 'Answer customer conversations: reply or add notes, assign, snooze and close, act on many at once, use the copilot, and save filters as views.'
where slug = 'comms/inbox' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'comms/inbox' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.sort_order
from (
  values
    (
      'opening-the-inbox',
      'Basics',
      'Opening the inbox',
      $html$<p>The inbox is where your team reads and answers customer conversations. Under <strong>Inbox</strong> in the sidebar, choose a queue:</p><ul><li><strong>Your Inbox</strong>: the conversations assigned to you. It opens on the <strong>Open</strong> tab.</li><li><strong>All Conversations</strong>: every conversation in the project. It also opens on <strong>Open</strong>.</li><li><strong>Mentions</strong>: the conversations where a teammate mentioned you in an internal note. It opens on <strong>All</strong>.</li></ul><p>Each queue has three panes: the conversation list, the open conversation's thread and the details panel. Click a conversation in the list to open it. On a narrow screen you see one pane at a time: <strong>Back to list</strong> returns to the list, and the panel icon at the top of the thread opens the details.</p>$html$,
      '[]',
      10
    ),
    (
      'starting-a-conversation',
      'Basics',
      'Starting a conversation',
      $html$<p>Most conversations start when a customer writes in through the Messenger. To open one yourself on a customer's behalf, choose the pencil icon at the top of the conversation list (<strong>New conversation</strong>), or <strong>New conversation</strong> on an empty list.</p><ul><li><strong>Subject</strong> and <strong>Contact name</strong>: required. <strong>Create</strong> stays disabled until both are filled in.</li><li><strong>Contact email</strong>: optional. If a contact with this email already exists in the project, Comms uses it. Otherwise it adds a new contact to <strong>People</strong>.</li><li><strong>Channel</strong>: one of the project's channels, or a channel type. It starts on the first connected channel.</li><li><strong>First message</strong>: optional. It's recorded as the customer's message, not yours.</li></ul><p>The new conversation starts as Open with Normal priority, and it's assigned to you if you're allowed to assign conversations. It shows in All Conversations for every teammate straight away, and opens in the thread.</p>$html$,
      '[]',
      20
    ),
    (
      'status-priority-unread',
      'Concepts',
      'Status, priority and unread',
      $html$<p>Every conversation has a status and a priority, and each teammate has their own read state for it.</p><ul><li><strong>Status</strong>: Open, Snoozed or Closed. A snoozed conversation returns to Open at the time you chose. A closed one stays on the <strong>Closed</strong> tab until someone reopens it.</li><li><strong>Priority</strong>: Urgent, Normal or Low. Conversations start as Normal, and Urgent ones carry an <strong>Urgent</strong> flag in the list and the thread.</li><li><strong>Waiting</strong>: when the latest message is from the customer, the conversation shows <strong>Waiting</strong> and for how long, until a reply goes out. Internal notes don't count as a reply.</li><li><strong>Unread</strong>: a conversation shows in bold with a dot until you open it. A new message from the customer or a teammate makes it unread again; your own replies and internal notes don't. Read state is yours alone, so opening a conversation doesn't mark it read for anyone else.</li></ul><p>To change your read state by hand, choose <strong>Mark as read</strong> or <strong>Mark as unread</strong> in the thread's <strong>⋯</strong> menu.</p>$html$,
      '[]',
      30
    ),
    (
      'conversation-list',
      'Inbox',
      'The conversation list',
      $html$<p>Each row in the conversation list shows the customer, how long ago the last message came in, the subject and the latest message. Under that come the status (on the All tab), the <strong>Urgent</strong> flag, how long the customer has been waiting, the first tag with a count of the others and the assignee's initials. A dashed circle means nobody is assigned. A small badge on the customer's avatar shows the channel.</p><p>The tabs at the top filter by status: <strong>Open</strong>, <strong>Snoozed</strong>, <strong>Closed</strong> and <strong>All</strong>. The arrows icon sorts the list:</p><ul><li><strong>Newest activity</strong> (the default): the most recent message first.</li><li><strong>Oldest activity</strong>: the conversation that's been quiet longest first.</li><li><strong>Priority</strong>: Urgent, then Normal, then Low, with the newest activity first within each.</li></ul><p>The list loads 50 conversations at a time and fetches more as you scroll down, or when you choose <strong>Load more conversations</strong>. It stays live: new conversations appear as they arrive, and a conversation that no longer matches the tab or filters drops out, except the one you have open.</p>$html$,
      '[]',
      40
    ),
    (
      'searching-and-filtering',
      'Inbox',
      'Searching and filtering',
      $html$<p>The search box at the top of the conversation list (press <code>/</code> to jump to it) matches subjects, message text (internal notes included) and the customer's name and email. When the match is in an older message, the row shows that message instead of the latest one, with <strong>Note:</strong> in front of a matching note.</p><p>The filter icon next to the search box narrows the list further. Picking several values in one group widens that group, and the groups combine:</p><ul><li><strong>Channel</strong>: Chat for Messenger conversations, Email for conversations on an email channel.</li><li><strong>Priority</strong>: Urgent, Normal or Low.</li><li><strong>Assignee</strong>: <strong>Anyone</strong>, <strong>Assigned to me</strong>, <strong>Unassigned</strong> or one teammate.</li><li><strong>Tags</strong>: conversations with any of the tags you pick.</li><li><strong>Unread only</strong>: conversations you haven't read.</li></ul><p>Each filter you turn on shows as a chip under the search box, with an × to remove it, and the filter icon shows how many are on. <strong>Clear all</strong> in the filter menu removes them. When nothing matches, <strong>Clear filters</strong> clears the filters and the search together and keeps your status tab and sort.</p>$html$,
      '[]',
      50
    ),
    (
      'replying',
      'Inbox',
      'Replying to a customer',
      $html$<p>To reply, write in the box at the bottom of the thread on the <strong>Reply</strong> tab, then choose <strong>Send</strong> or press <code>Ctrl Enter</code> (<code>⌘ Enter</code> on Mac). The line at the top of the composer says where the reply goes, such as "To Maya Chen in chat" or "To Maya Chen by email". If sending fails, Comms shows "Message not sent." and keeps your draft.</p><p>In a Messenger conversation, your reply shows in the customer's Messenger. In a conversation on an email channel, Comms emails the reply to the customer's address while that channel has <strong>Send replies by email</strong> turned on; see <a href="/help/comms/channels">Channels</a>. Each emailed reply shows its delivery under it: <strong>Queued for email</strong>, <strong>Sent via email</strong>, or <strong>Failed</strong> or <strong>Delivery uncertain</strong> followed by the reason.</p><p>Replying and adding notes need the <strong>Reply to a conversation</strong> permission, which the Owner, Admin, Manager and Member roles have. Without it, the composer shows why instead of a text box.</p>$html$,
      '[]',
      60
    ),
    (
      'notes-and-mentions',
      'Inbox',
      'Internal notes and mentions',
      $html$<p>Internal notes are for your team only, and customers never see them. To add one, switch the composer to the <strong>Note</strong> tab, write the note and choose <strong>Add note</strong>. Notes show in the thread with an <strong>Internal note</strong> label, and they don't change the conversation's latest message or how long the customer has been waiting.</p><p>To mention a teammate, type <code>@</code> in a note (or choose <strong>Mention</strong>) and pick them from the list. The conversation then shows in their <strong>Mentions</strong> queue, and the number of mentions they haven't read shows next to <strong>Mentions</strong> in their sidebar. Opening the conversation marks their mentions in it as read.</p><p>Mentions work only in notes, and you can't mention yourself.</p>$html$,
      '[]',
      70
    ),
    (
      'attaching-files',
      'Inbox',
      'Attaching files',
      $html$<p>To attach files to a reply or a note, choose the paperclip, drag files onto the composer, or paste a screenshot into it. You can attach images (PNG, JPEG, GIF and WebP) and PDFs, up to 10 MB each and five per message. Each file uploads as soon as you add it, and <strong>Send</strong> waits until the uploads finish. To remove a file before sending, choose the × beside its name.</p><p>Attachments show under their message in the thread. Click one to open it.</p>$html$,
      '[]',
      80
    ),
    (
      'using-macros',
      'Inbox',
      'Using macros',
      $html$<p>Macros are saved replies, written under <strong>Automation → Macros</strong>. To use one, type <code>#</code> in the composer or choose <strong>Macro</strong>, then keep typing to narrow the list. It matches macro names first, then their text. Press <code>Enter</code> or <code>Tab</code> to insert the highlighted macro, or click it. A lock icon marks a personal macro, which only its owner sees.</p><p>Comms fills the macro's variables, such as the customer's name or the conversation's subject, from the open conversation. A variable it can't fill stays in the text, and Comms won't send until you replace it: for example, "Fill in <code>{{contact.company}}</code> before sending."</p><p>A macro can also carry actions, such as assigning the conversation or adding a tag. They show as <strong>On send</strong> chips under the draft and run once your message is saved; remove one with its ×. A macro with no text runs its actions as soon as you pick it. Comms then confirms the macro was applied, or lists each action it couldn't apply and why. See <a href="/help/comms/macros">Macros</a> to create and edit them.</p>$html$,
      '[]',
      90
    ),
    (
      'conversation-details',
      'Inbox',
      'Conversation details',
      $html$<p>The details panel beside the thread shows the customer's name and email. The external-link icon beside their name (<strong>Open profile</strong>) opens their contact in <strong>People</strong>. Under <strong>Conversation</strong>, it lists:</p><ul><li><strong>Status</strong>: Open, Snoozed or Closed.</li><li><strong>Assignee</strong>: choose it to assign the conversation.</li><li><strong>Priority</strong>: choose Urgent, Normal or Low.</li><li><strong>Tags</strong>: choose <strong>Add tag</strong> to search the project's tags and turn each one on or off. To create a tag, type a new name and press <code>Enter</code>.</li><li><strong>Channel</strong> and <strong>Started</strong>: where and when the conversation began.</li></ul><p>Each change saves as you make it. Under <strong>Ticket</strong>, <strong>Create ticket</strong> turns the conversation into a ticket; see <a href="/help/comms/tickets">Tickets</a>.</p>$html$,
      '[]',
      100
    ),
    (
      'assigning',
      'Inbox',
      'Assigning conversations',
      $html$<p>To assign the open conversation, choose the assignee button at the top of the thread (or press <code>A</code>), then <strong>Assign to me</strong>, <strong>Unassign</strong> or a teammate. The <strong>Assignee</strong> field in the details panel does the same. The conversation then shows in that teammate's <strong>Your Inbox</strong>.</p><p>Assigning needs the <strong>Assign a conversation</strong> permission, which the Owner, Admin, Manager and Member roles have. Without it, the assign controls are disabled and say why.</p><p>Your availability, at the top of the conversation list, tells automatic assignment whether to give you new conversations:</p><ul><li><strong>Available</strong>: gets new conversations.</li><li><strong>Away</strong>: gets new conversations only during your office hours.</li><li><strong>Offline</strong>: gets no new conversations.</li></ul><p>Availability doesn't stop anyone assigning you a conversation by hand. Routing rules decide who gets new conversations automatically; see <a href="/help/comms/routing-and-slas">Routing rules and SLAs</a>.</p>$html$,
      '[]',
      110
    ),
    (
      'snoozing-and-closing',
      'Inbox',
      'Snoozing, closing and reopening',
      $html$<p>To close a conversation when it's done, choose <strong>Close</strong> at the top of the thread, or press <code>E</code>. It moves to the <strong>Closed</strong> tab, where <strong>Reopen</strong> (or <code>E</code>) brings it back to Open.</p><p>To set a conversation aside until later, choose the alarm-clock icon at the top of the thread (or press <code>S</code>) and pick a time:</p><ul><li><strong>In 1 hour</strong> or <strong>In 3 hours</strong></li><li><strong>Tomorrow 9am</strong></li><li><strong>Next week</strong>: 9am, seven days from today</li><li><strong>Custom…</strong>: any future date and time</li></ul><p>The conversation moves to the <strong>Snoozed</strong> tab, shows "Snoozed until" and the time, and returns to Open when that time comes. Reopening it ends the snooze early. A closed conversation can't be snoozed.</p><p>Closing, reopening and snoozing need the <strong>Close a conversation</strong> permission. The Owner, Admin and Manager roles have it, and Member doesn't.</p>$html$,
      '[]',
      120
    ),
    (
      'merging-conversations',
      'Inbox',
      'Merging duplicate conversations',
      $html$<p>When a customer starts two conversations about the same thing, merge the duplicate into the one you're keeping. In the duplicate, open the <strong>⋯</strong> menu at the top of the thread and choose <strong>Merge into another conversation…</strong>. The dialog lists the customer's other conversations, and the search box finds any other conversation. Pick one and choose <strong>Merge</strong>.</p><p>Comms closes the duplicate, links it to the conversation you picked and adds an internal note to both. Messages, tags and ticket links stay where they are. The duplicate then shows "This conversation was merged into another one and closed.", and <strong>Open it</strong> takes you to the other one.</p><p>A merge can't be undone in Comms, and a conversation that's already been merged can't be merged again. Merging needs the <strong>Close a conversation</strong> permission.</p>$html$,
      '[]',
      130
    ),
    (
      'acting-on-several',
      'Inbox',
      'Acting on several conversations',
      $html$<p>To select conversations, hover over a row's avatar and select the checkbox that appears, or press <code>X</code> on the focused row. Shift-click a checkbox to select every row between it and the last one you selected. While anything is selected, a bar at the top of the list shows how many and offers:</p><ul><li><strong>Assign</strong>: to you, to a teammate, or to nobody.</li><li><strong>Snooze</strong>, <strong>Close</strong> and <strong>Reopen</strong>, depending on the status tab you're on.</li><li><strong>Add a tag</strong>: an existing tag or a new one.</li><li><strong>Set priority</strong>: Urgent, Normal or Low.</li></ul><p>The checkbox at the left of the bar selects every loaded conversation. When more conversations match than are loaded, the bar offers to select them all, for example <strong>Select all 120 matching</strong>. Comms reports how many it updated, and any it couldn't update stay selected so you can try again. Press <code>Esc</code> to clear the selection.</p><p>Assigning, snoozing, closing and reopening in bulk need the same permissions as doing it one conversation at a time.</p>$html$,
      '[]',
      140
    ),
    (
      'copilot',
      'Inbox',
      'Summaries, rewrites and translation',
      $html$<p>The inbox copilot uses your project's AI provider to help with the open conversation. Nothing it writes goes to the customer until you send it.</p><ul><li><strong>Summarize conversation</strong>: the sparkles icon at the top of the thread opens a <strong>Conversation summary</strong> for whoever picks the conversation up. It draws on internal notes, so keep it within the team: <strong>Insert as note</strong> puts it in the composer as a note, and <strong>Regenerate</strong> writes a new one.</li><li><strong>AI</strong>, in the composer on the Reply tab: <strong>Rephrase</strong>, <strong>Make friendlier</strong>, <strong>Make more formal</strong>, <strong>Shorten</strong>, <strong>Expand</strong> and <strong>Fix spelling & grammar</strong> rewrite your draft, up to 5,000 characters. <strong>Translate to the customer's language</strong> uses the language on the customer's profile, or the language they write in.</li><li><strong>Translate</strong>, under a customer message written in another language, shows it in your browser's language. <strong>Show original</strong> switches back.</li></ul><p>AI text in the composer is marked <strong>AI-generated</strong>, and <strong>Undo</strong> (or <code>Ctrl Z</code>, <code>⌘ Z</code> on Mac) puts back what it replaced. Summaries and rewrites use the Inbox copilot feature, and translations use Inbox translation. When one can't run, its control says why; see <a href="/help/comms/ai-providers">AI providers</a>.</p>$html$,
      '[]',
      150
    ),
    (
      'saved-views',
      'Views',
      'Saved views',
      $html$<p>A view is a saved conversation filter. Choose <strong>Views</strong> under Inbox to see the views you can use, with each one's filters, owner, sharing and how many conversations match it right now. Click a view to open <strong>All Conversations</strong> with its filter applied.</p><p>To create one, choose <strong>New view</strong>. Only <strong>Name</strong> is required:</p><ul><li><strong>Status</strong>, <strong>Channel type</strong>, <strong>Priority</strong> and <strong>Tags (any of)</strong>: leave a group empty to put no limit on it.</li><li><strong>Assignee</strong>: Anyone, Assigned to me, Unassigned or a teammate. Assigned to me means whoever applies the view.</li><li><strong>Channel</strong>: one connected channel.</li><li><strong>Search</strong>: text to match, the same way the inbox search box does.</li><li><strong>Unread only</strong> and <strong>Sort</strong>, which starts as Newest activity.</li></ul><p>A new view is private to you. Narrow the Views list to <strong>All views</strong>, <strong>Owned by me</strong>, <strong>Shared</strong> or <strong>Private</strong>, or search it. It shows 25 views a page; switch to 10, 50 or 100 at the bottom.</p>$html$,
      '[]',
      160
    ),
    (
      'managing-views',
      'Views',
      'Editing, sharing and deleting views',
      $html$<p>Each view's <strong>⋯</strong> menu has <strong>Apply</strong>, <strong>Edit</strong>, <strong>Duplicate</strong>, <strong>Share with team</strong> (or <strong>Stop sharing</strong>) and <strong>Delete</strong>. A shared view shows up for every teammate in the project. <strong>Duplicate</strong> makes a private copy that you own, with "copy" added to its name.</p><p><strong>Edit</strong> opens the view's editor, with <strong>Overview</strong> (its name, sort and a summary), <strong>Filters</strong>, <strong>Sharing</strong> and <strong>Advanced</strong>. Changes save automatically as you make them, and <strong>Apply view</strong> opens it in All Conversations. <strong>Delete</strong> asks you to confirm first. Deleting a view removes only the saved filter, never the conversations.</p><p>You can edit, share and delete the views you own. Changing a teammate's view needs the <strong>Manage settings</strong> permission, which the Owner and Admin roles have.</p>$html$,
      '[]',
      170
    ),
    (
      'shortcuts',
      'Reference',
      'Keyboard shortcuts',
      $html$<p>In the inbox, these keys work anywhere except while you're typing in a field or a menu is open:</p><ul><li><code>J</code> and <code>K</code>, or the down and up arrows, move through the list, and <code>Enter</code> opens the focused conversation</li><li><code>X</code> selects or clears the focused conversation</li><li><code>E</code> closes the focused or open conversation, or reopens it</li><li><code>A</code> opens the assign menu, and <code>S</code> the snooze menu</li><li><code>/</code> jumps to the search box</li><li><code>Esc</code> clears the selection, then the focus, then closes the open conversation</li></ul><p>In the composer:</p><ul><li><code>Ctrl Enter</code> (<code>⌘ Enter</code> on Mac) sends the reply or adds the note</li><li><code>@</code> mentions a teammate in a note, and <code>#</code> inserts a macro. The arrow keys move through the list, <code>Enter</code> or <code>Tab</code> picks, and <code>Esc</code> closes it</li><li><code>Ctrl Z</code> (<code>⌘ Z</code> on Mac) undoes an AI change to the draft</li></ul>$html$,
      '[]',
      180
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"Ticket","label":"Tickets","href":"/help/comms/tickets"},{"icon":"Zap","label":"Macros","href":"/help/comms/macros"},{"icon":"Route","label":"Routing rules & SLAs","href":"/help/comms/routing-and-slas"},{"icon":"Users","label":"Customers","href":"/help/comms/customers"},{"icon":"Radio","label":"Channels","href":"/help/comms/channels"},{"icon":"Cpu","label":"AI providers","href":"/help/comms/ai-providers"}]',
      190
    )
) as v(anchor_id, eyebrow, title, content, links, sort_order)
cross join (select id from public.docs_pages where slug = 'comms/inbox' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Inbox',
    description = 'Work customer conversations in your inbox, all conversations, mentions and saved views.'
where slug = 'comms/inbox' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'comms/inbox' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Your Inbox, All Conversations and Mentions</li><li>The conversation list and filters</li><li>Replying and internal notes</li><li>Assigning, snoozing and closing</li><li>Bulk actions and merging</li><li>Copilot</li><li>Views</li></ul>',
  10
from public.docs_pages p
where p.slug = 'comms/inbox' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
