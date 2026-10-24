-- Help comms messenger page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the comms/messenger draft outline from
-- 20261024191800_help_comms_structure with the full Messenger guide: setting up the channel, installing the widget,
-- identifying customers, and what customers see. Comms isn't deployed yet, so the page stays a draft.
-- Left out as unshipped or unreachable: the Ask space and AI answers (the widget config never names an assistant, and
-- the Answers in the Messenger switch reads "Arrives with the Messenger update."), the News space (posts can't be
-- written in Comms), the away/offline form (the config never reports team presence), order topics (no orders source),
-- the article "Did this answer your question?" vote (not recorded), and the React SDK (its package isn't published).
-- Written from a survey of C:\Pro\geiger-comms (components/internal/screens/channels/install_section.jsx,
-- messenger_preview.jsx, channel_sections.jsx, constants.js, components/internal/widget/widget_test_launcher.jsx,
-- components/widget/widget_app.jsx, home_space.jsx, messages_space.jsx, new_conversation.jsx, help_space.jsx,
-- tickets_space.jsx, rating.jsx, composer.jsx, lib/widget/apps.js, embed.js, loader.js, session.js, jwt.js, secrets.js,
-- origins.js, workspace_auth.js, app/api/widget/**, app/api/widget-apps/**).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Messenger',
    description = 'Set up the Messenger chat widget, install it on your site, identify signed-in customers, and see what customers get when they write in.'
where slug = 'comms/messenger' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'comms/messenger' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.sort_order
from (
  values
    (
      'setting-up-messenger',
      'Basics',
      'Setting up the Messenger',
      $html$<p>The Messenger is the chat widget customers use on your site or app. Conversations they start there arrive in your inbox. To set it up:</p><ol><li>Under <strong>Channels</strong> in the sidebar, choose <strong>Messenger</strong>, then <strong>Connect Messenger</strong>.</li><li>Type a <strong>Name</strong> and choose <strong>Connect</strong>. The channel opens in its editor.</li><li>Optional: under <strong>Configuration</strong>, set its color, greeting and position.</li><li>Under <strong>Install</strong>, choose <strong>New widget app</strong>, list the sites it runs on, and choose <strong>Create app</strong>.</li><li>Save the signing secret Comms shows you, then choose <strong>I've saved it</strong>.</li><li>Choose <strong>Copy snippet</strong> and paste the snippet into every page where you want the Messenger.</li></ol><p>The launcher then shows on those pages. Creating widget apps needs the <strong>Manage settings</strong> permission, which the Owner and Admin roles have.</p>$html$,
      '[]',
      10
    ),
    (
      'messenger-settings',
      'Messenger',
      'Messenger settings',
      $html$<p>A Messenger channel's <strong>Configuration</strong> section sets how the widget looks to customers:</p><ul><li><strong>Launcher colour</strong>: the launcher button's color, also used for the customer's message bubbles and buttons in the panel. It starts as white.</li><li><strong>Greeting</strong>: the welcome line at the top of the Messenger's home screen, up to 200 characters. It starts as "Hi there 👋 How can we help?".</li><li><strong>Position</strong>: <strong>Bottom right</strong> (the default) or <strong>Bottom left</strong>.</li><li><strong>Show avatars</strong>: on by default.</li><li><strong>Office-hours note</strong>: a line about when your team replies, shown under <strong>Send us a message</strong>, up to 300 characters. Without one, the Messenger says "We'll reply here as soon as we can."</li></ul><p>Changes save automatically. The <strong>Preview</strong> section shows the launcher and greeting as a mock-up, not a working widget.</p>$html$,
      '[]',
      20
    ),
    (
      'installing-the-widget',
      'Messenger',
      'Installing the widget',
      $html$<p>A widget app connects your site to a Messenger channel. In the channel's <strong>Install</strong> section, choose <strong>New widget app</strong> and list its <strong>Allowed origins</strong>, one per line. Each must be an exact <code>scheme://host[:port]</code> value, like <code>https://acme.com</code>, with no paths or wildcards. List every site separately, such as <code>https://app.acme.com</code> as well.</p><p>Choose <strong>Create app</strong>. Comms shows the app's public id and its signing secret once, in "Save your signing secret now". Store the secret somewhere safe: after you close the dialog, only its last four characters are ever shown again.</p><p>Each widget app then shows its public id (starting <code>wg_</code>), its allowed origins, whether it has loaded anywhere (<strong>never booted</strong>, or the time of the last boot), and its install snippet. <strong>Copy snippet</strong> copies the script, which already holds the app's id. The Messenger loads only on the allowed origins; anywhere else it shows "Chat isn't enabled for this site."</p>$html$,
      '[]',
      30
    ),
    (
      'identifying-customers',
      'Messenger',
      'Identifying signed-in customers',
      $html$<p>By default the Messenger treats everyone as an anonymous visitor. Each browser keeps its own conversations, and the inbox shows the customer as <strong>Unknown visitor</strong> until you know their name or email.</p><p>To link conversations to your own customer accounts, have your server sign a token for each signed-in customer with the widget app's signing secret, and pass it when the Messenger starts: <code>GeigerComms('boot', { appId: 'wg_…', jwt: token })</code>.</p><ul><li>Sign the token with HS256.</li><li>Include <code>user_id</code>, your own id for the customer, and <code>exp</code>, no more than 24 hours ahead.</li><li>Optional: include <code>email</code> and <code>name</code>.</li></ul><p>Comms then finds or creates the matching contact in <strong>People</strong>, and the customer sees their conversations wherever they sign in. A token that doesn't verify stops the Messenger with "Your sign-in has expired. Refresh the page to keep chatting."</p>$html$,
      '[]',
      40
    ),
    (
      'rotating-and-revoking',
      'Messenger',
      'Rotating secrets and revoking apps',
      $html$<p>Each widget app in the <strong>Install</strong> section has two actions:</p><ul><li><strong>Rotate secret</strong> creates a new signing secret and shows it once. The previous secret keeps working for 24 hours, so customers who are already chatting aren't cut off while you update your server.</li><li><strong>Revoke</strong> removes the widget app straight away, without asking. Its snippet stops loading the Messenger.</li></ul><p>Creating, rotating and revoking widget apps need the <strong>Manage settings</strong> permission, which the Owner and Admin roles have. Seeing them needs access to <strong>Channels</strong>.</p>$html$,
      '[]',
      50
    ),
    (
      'what-customers-see',
      'Messenger',
      'What customers see',
      $html$<p>Customers open the Messenger from its launcher button, which shows a count of unread replies. The panel has these spaces, with a tab bar to move between them:</p><ul><li><strong>Home</strong>: your greeting, <strong>Send us a message</strong> with your office-hours note, their most recent conversation with <strong>See all</strong> and a <strong>Search for help</strong> box when you have published articles.</li><li><strong>Messages</strong>: their conversations, on <strong>Open</strong> and <strong>Closed</strong> tabs, with <strong>New</strong> to start another.</li><li><strong>Help</strong>: shown when you have published articles. Customers search them, browse collections and popular articles, and read them in the panel. See <a href="/help/comms/articles">Articles</a>.</li><li><strong>Tickets</strong>: shown when the customer has customer tickets, with each one's state. Waiting shows to them as "Waiting on you". See <a href="/help/comms/tickets">Tickets</a>.</li></ul><p>Once a customer has opened the Messenger, the page plays a short chime when a new reply arrives.</p>$html$,
      '[]',
      60
    ),
    (
      'customer-conversations',
      'Messenger',
      'Conversations from the Messenger',
      $html$<p>To write in, a customer chooses <strong>Send us a message</strong> or <strong>New</strong>, picks what it's about (<strong>Billing</strong>, <strong>Account</strong> or <strong>Something else</strong>), writes their message and chooses <strong>Send message</strong>. They can attach images and PDFs, up to 10 MB each and five per message.</p><p>The conversation arrives in your inbox on the Messenger's channel, marked as Chat. Its subject is the topic and the start of the message, such as "Billing: I was charged twice", or the start of the message for Something else. Your replies show in the customer's thread, and internal notes never do.</p><p>When you close a conversation, the customer sees "Conversation closed" and <strong>Start a new conversation</strong> instead of a reply box.</p>$html$,
      '[]',
      70
    ),
    (
      'ratings',
      'Messenger',
      'Conversation ratings',
      $html$<p>When a conversation is closed, the customer's thread asks "How did we do?" (or how the teammate who answered did). They pick one to five stars, from Poor, Fair, Okay and Good to Great, can add a comment of up to 1,000 characters, and choose <strong>Send rating</strong>. <strong>Skip</strong> hides the card.</p><p>Ratings and comments show in <strong>Reports → Quality & CSAT</strong>; see <a href="/help/comms/reports">Reports</a>.</p>$html$,
      '[]',
      80
    ),
    (
      'testing-in-comms',
      'Messenger',
      'Testing the Messenger in Comms',
      $html$<p>Comms runs your project's Messenger inside Comms itself, so you can click the launcher and try it without leaving. For it to start, add your Comms address (the origin in your browser's address bar while you use Comms) to the widget app's <strong>Allowed origins</strong>.</p><p>When the project has no widget app yet, a "No test widget yet" card appears in the corner of Comms instead, with a button that opens the Messenger screen. Closing the card hides it.</p>$html$,
      '[]',
      90
    ),
    (
      'messenger-doesnt-load',
      'Troubleshooting',
      'The Messenger doesn''t show on my site',
      $html$<p>The Messenger starts only when its site, its widget app and its channel all allow it. Check what the panel says:</p><ul><li><strong>Chat isn't enabled for this site.</strong> The page's origin isn't in the widget app's <strong>Allowed origins</strong>. Add it exactly, including <code>https://</code> and any port, under <strong>Install</strong>.</li><li><strong>Chat isn't available right now.</strong> The widget app was revoked, or its Messenger channel was disconnected or deleted. Reconnect the channel, or create a new widget app and replace the snippet.</li><li><strong>Your sign-in has expired.</strong> The customer's token didn't verify. Check that your server signs it with the current signing secret and an <code>exp</code> no more than 24 hours ahead.</li></ul><p>If no launcher appears at all, check that the snippet is on the page.</p>$html$,
      '[]',
      100
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"Radio","label":"Channels","href":"/help/comms/channels"},{"icon":"Inbox","label":"Inbox","href":"/help/comms/inbox"},{"icon":"FileText","label":"Articles","href":"/help/comms/articles"},{"icon":"Ticket","label":"Tickets","href":"/help/comms/tickets"},{"icon":"Users","label":"Customers","href":"/help/comms/customers"},{"icon":"ChartColumn","label":"Reports","href":"/help/comms/reports"}]',
      110
    )
) as v(anchor_id, eyebrow, title, content, links, sort_order)
cross join (select id from public.docs_pages where slug = 'comms/messenger' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Messenger',
    description = 'Set up and install the Messenger chat widget on your site or app.'
where slug = 'comms/messenger' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'comms/messenger' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Setting up Messenger</li><li>Installing the widget</li><li>What customers see</li><li>Testing it in Comms</li></ul>',
  10
from public.docs_pages p
where p.slug = 'comms/messenger' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
