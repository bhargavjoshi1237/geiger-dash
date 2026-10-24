-- Help comms channels page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the comms/channels draft outline from
-- 20261024191800_help_comms_structure with the full Channels guide (the channel screens and Email). Comms isn't deployed
-- yet, so the page stays a draft. WhatsApp, SMS, Social and Slack are left out: they store settings only (Simulated).
-- Written from a survey of C:\Pro\geiger-comms (components/internal/screens/channels/channel_screen.jsx,
-- channel_detail.jsx, channel_sections.jsx, channel_config_form.jsx, connect_dialog.jsx, email_delivery.jsx,
-- constants.js, lib/supabase/channels.js, lib/email/outbox.js, lib/email/templates.js, lib/email/channel.js,
-- app/api/email/test/route.js, app/api/email/status/route.js, supabase/migrations/20261021103418_email_outbox.sql).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Channels',
    description = 'Connect the channels customers reach you on, manage them, and send your replies to customers by email.'
where slug = 'comms/channels' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'comms/channels' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.sort_order
from (
  values
    (
      'connecting-a-channel',
      'Basics',
      'Connecting a channel',
      $html$<p>A channel is one way customers reach you, such as a support email address or the Messenger on your site. Each type has its own screen under <strong>Channels</strong> in the sidebar.</p><ol><li>Under <strong>Channels</strong>, choose <strong>Email</strong> or <strong>Messenger</strong>.</li><li>Choose <strong>Connect Email</strong> or <strong>Connect Messenger</strong>.</li><li>Type a <strong>Name</strong>. It shows in the inbox and on conversation rows. An email channel also needs its <strong>From address</strong>, and <strong>Connect</strong> stays disabled until the required fields are filled in.</li><li>Choose <strong>Connect</strong>. The channel starts as Connected and opens in its editor.</li></ol><p>A project can have several channels of each type, for example one email address per team.</p>$html$,
      '[]',
      10
    ),
    (
      'how-channels-work',
      'Concepts',
      'What Email and Messenger do',
      $html$<p>The two channel types work differently:</p><ul><li><strong>Messenger</strong> is the chat widget you install on your site or app. Conversations customers start there arrive in your inbox, marked as Chat, and your replies show in their Messenger. See <a href="/help/comms/messenger">Messenger</a>.</li><li><strong>Email</strong> sends your replies to customers by email from a support address. Comms doesn't receive customer email, so customers' email replies go to that address's own mailbox, not into a conversation.</li></ul><p>To start an email conversation yourself, choose <strong>New conversation</strong> in the inbox and pick the email channel; see <a href="/help/comms/inbox#starting-a-conversation">Inbox</a>.</p>$html$,
      '[]',
      20
    ),
    (
      'channel-list',
      'Channels',
      'The channel list',
      $html$<p>Each channel type's screen lists that type's channels. The figures across the top show <strong>Connections</strong> (with how many are connected), <strong>Conversations</strong> (linked to channels of that type), <strong>Needs attention</strong> (channels in an error state) and <strong>Configured</strong> (channels with their settings filled in).</p><p>Each row shows the channel's name and its main setting (or <strong>Not configured</strong>), its status, how many conversations it has and when it was added. Narrow the list by status, or search names and settings. It shows 25 channels a page; switch to 10, 50 or 100 at the bottom.</p><p>Each row's <strong>⋯</strong> menu has <strong>Edit</strong>, <strong>View conversations</strong>, <strong>Disconnect</strong> (or <strong>Connect</strong>), <strong>Duplicate</strong> and <strong>Delete</strong>. <strong>View conversations</strong> opens <strong>All Conversations</strong> filtered to that channel, with a chip you can remove. <strong>Duplicate</strong> copies the channel's settings into a new one named "(copy)".</p>$html$,
      '[]',
      30
    ),
    (
      'editing-a-channel',
      'Channels',
      'Editing a channel',
      $html$<p>Click a channel to open its editor. Its sections are:</p><ul><li><strong>Overview</strong>: its conversation count, status, creation date and last update, with a summary of how it's set up.</li><li><strong>Configuration</strong>: its <strong>Name</strong> and settings.</li><li><strong>Delivery</strong> (Email only) or <strong>Install</strong> and <strong>Preview</strong> (Messenger only).</li><li><strong>Advanced</strong>: the <strong>Connected</strong> switch and <strong>Delete channel</strong>.</li></ul><p>Changes save automatically shortly after you stop typing. A blank required field holds the save, and the editor shows <strong>Not saved</strong> until you fill it in. If you leave the editor with a required field blank, Comms discards the unsaved changes and says so. If a save fails, the channel goes back to its last saved version.</p><p>At the top of the editor, <strong>View conversations</strong> opens the channel's conversations, and <strong>Manage connection</strong> goes to <strong>Advanced</strong>.</p>$html$,
      '[]',
      40
    ),
    (
      'email-settings',
      'Email',
      'Email channel settings',
      $html$<p>An email channel's <strong>Configuration</strong> section has:</p><ul><li><strong>From address</strong>: required. Your replies are sent from this address, and its domain must be verified in the Geiger suite's email service, which sends for every app in the suite.</li><li><strong>From name</strong>: the sender name customers see.</li><li><strong>Signature</strong>: added under every reply sent by email.</li></ul><p>An emailed reply's subject is "Re:" followed by the conversation's subject, so the customer's mail app groups replies by subject. Files you attach go out as download links in the email, not as attachments.</p>$html$,
      '[]',
      50
    ),
    (
      'sending-replies-by-email',
      'Email',
      'Sending replies by email',
      $html$<p>To have Comms email your replies, open the email channel and go to <strong>Delivery</strong>, then turn on <strong>Send replies by email</strong>. It starts off. From then on, teammate and workflow replies on the channel's conversations go to the customer's email address. Internal notes never do.</p><p>A reply is emailed only when the channel is connected, sending is on, and the customer has an email address. The <strong>Delivery status</strong> badge shows <strong>Sending</strong> or <strong>Not sending</strong>. It shows <strong>Not set up</strong> when email can't go out, and <strong>Send replies by email</strong> can't be turned on until it can. Each emailed reply in the thread shows whether it was queued, sent or failed, with the reason.</p><p>To check the setup, choose <strong>Send test email</strong> under <strong>Test email</strong>. Comms sends a real email from the channel's address to your own. Comms can't read the domain's verification status, so this is the check: an unverified domain fails here, with the reason.</p>$html$,
      '[]',
      60
    ),
    (
      'disconnecting-and-deleting',
      'Channels',
      'Disconnecting and deleting',
      $html$<p>To pause a channel, choose <strong>Disconnect</strong> in its row's <strong>⋯</strong> menu, or turn off <strong>Connected</strong> under <strong>Advanced</strong> in its editor. A disconnected email channel stops emailing replies, and a disconnected Messenger stops loading on your site, until you reconnect it.</p><p>To remove a channel, choose <strong>Delete</strong> in its row menu or <strong>Delete channel</strong> in its editor. Comms asks you to confirm first. Existing conversations keep their history, but an email channel's conversations stop getting emailed replies, and a Messenger's installed widget stops loading. A deleted channel can't be restored from Comms.</p>$html$,
      '[]',
      70
    ),
    (
      'customer-email-replies',
      'Troubleshooting',
      'Customer email replies don''t appear in Comms',
      $html$<p>Comms sends email but doesn't receive it. When a customer answers one of your emailed replies, their message goes to the email channel's from address, in that address's own mailbox, and never reaches the conversation. Each email channel's <strong>Delivery</strong> section says so under <strong>Receiving email</strong>.</p><p>Read those replies in the from address's mailbox. To keep the exchange in Comms, ask the customer to write to you through the Messenger, where their messages arrive in the inbox.</p>$html$,
      '[]',
      80
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"MessageCircle","label":"Messenger","href":"/help/comms/messenger"},{"icon":"Inbox","label":"Inbox","href":"/help/comms/inbox"},{"icon":"Workflow","label":"Workflows","href":"/help/comms/workflows"}]',
      90
    )
) as v(anchor_id, eyebrow, title, content, links, sort_order)
cross join (select id from public.docs_pages where slug = 'comms/channels' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Channels',
    description = 'Connect the channels customers reach you on, and send replies by email.'
where slug = 'comms/channels' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'comms/channels' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>The channel list</li><li>Connecting a channel</li><li>Email delivery</li><li>Disconnecting and deleting</li></ul>',
  10
from public.docs_pages p
where p.slug = 'comms/channels' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
