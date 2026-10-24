-- Help comms overview page
--
-- One-time content move, like 20261024142451_help_flow_overview_page: replaces the Comms Overview's draft outline
-- (re-homed from products/comms by 20261024191800_help_comms_structure) with the product overview. Each area gets a
-- section that sums it up and links to its guide (20261024191801 to 20261024191816). No whole-app preview: comms isn't
-- in SANDBOX_APP_IDS. Comms isn't deployed yet, so the page stays a draft.
-- Written from a survey of C:\Pro\geiger-comms (components/internal/sidebar/sidebar_nav.jsx, sidebar.jsx,
-- components/internal/screens/registry.jsx, components/internal/topbar/topbar.jsx,
-- components/internal/workspace/workspace_states.jsx, app/project/**, context/project-context.js, rbac-context.js,
-- geiger-ui.config.js, geiger-rbac.config.js) and the area guides' surveys named in their own migration headers.
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set description = 'Comms is your team''s shared inbox for customer conversations, with the Messenger, a customer directory, automation, help articles and reports.'
where slug = 'comms' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'comms' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, cards, features, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.cards::jsonb, v.features::jsonb, v.sort_order
from (
  values
    (
      'start-here',
      null,
      'Start here',
      '',
      '[{"icon":"FolderKanban","title":"Open a project","body":"Launch Comms from any project in your organization","href":"/org"},{"icon":"MessageCircle","title":"Set up the Messenger","body":"Put the chat widget on your site","href":"/help/comms/messenger"},{"icon":"Inbox","title":"Answer conversations","body":"Reply, assign and close in the inbox","href":"/help/comms/inbox"}]',
      '[]',
      10
    ),
    (
      'opening-comms',
      'Basics',
      'Opening Comms',
      $html$<p>Comms works inside a <strong>project</strong>. Open your organization in Dash and launch Comms from one of its projects. Everything you create in Comms belongs to that project, and everyone in your organization can open it with the role Comms gives them; see <a href="/help/comms/teammates#how-access-works">Teammates and roles</a>.</p><p>Comms opens the project you used last. If you have no project, it asks you to name one and choose <strong>Create</strong>.</p><p>The sidebar lists the project's areas: Overview, Inbox, Channels, Customers, Automation, Knowledge Base, Reports and Settings. It shows only the areas your role grants. To hide screens you don't use, go to <strong>Settings → Navigation</strong>, which changes only your own sidebar. To jump to any screen by name, press <code>Ctrl K</code> (<code>⌘ K</code> on Mac) or click the search box at the top.</p>$html$,
      '[]',
      '[]',
      20
    ),
    (
      'setting-up-comms',
      'Basics',
      'Setting up Comms',
      $html$<p>A typical setup for a new project:</p><ol><li>Connect the Messenger and install it on your site, so customers can write in. See <a href="/help/comms/messenger">Messenger</a>.</li><li>Optional: add an email channel and turn on <strong>Send replies by email</strong>. See <a href="/help/comms/channels">Channels</a>.</li><li>Invite your teammates and give them roles. See <a href="/help/comms/teammates">Teammates and roles</a>.</li><li>Add routing rules so new conversations reach someone, and SLA policies for your response targets. See <a href="/help/comms/routing-and-slas">Routing rules and SLAs</a>.</li><li>Write and publish help articles for the Messenger's Help space. See <a href="/help/comms/articles">Articles</a>.</li><li>Optional: connect an AI provider to turn on the AI features. See <a href="/help/comms/ai-providers">AI providers</a>.</li></ol>$html$,
      '[]',
      '[]',
      30
    ),
    (
      'whats-in-comms',
      'Areas',
      'What''s in Comms',
      '<p>Each area of Comms has its own guide. The sections on this page sum them up and link to each one.</p>',
      '[]',
      '[{"icon":"LayoutDashboard","text":"Project overview: volume, backlog and what needs attention"},{"icon":"Inbox","text":"Inbox: your inbox, all conversations, mentions and views"},{"icon":"Ticket","text":"Tickets: customer, back-office and tracker tickets"},{"icon":"Radio","text":"Channels: email channels and replies sent by email"},{"icon":"MessageCircle","text":"Messenger: the chat widget for your site or app"},{"icon":"Users","text":"Customers: people, companies, segments and imports"},{"icon":"Workflow","text":"Workflows: triggers, conditions and actions"},{"icon":"Zap","text":"Macros: saved replies with actions"},{"icon":"Route","text":"Routing rules and SLA policies"},{"icon":"FileText","text":"Articles: write, translate and publish help content"},{"icon":"BookOpen","text":"Help centers: collections and the Messenger''s Help space"},{"icon":"FileQuestionMark","text":"Knowledge gaps: questions your articles don''t answer"},{"icon":"ChartColumn","text":"Reports: analytics and customer satisfaction"},{"icon":"UserCog","text":"Teammates and roles: invitations, groups and permissions"},{"icon":"Cpu","text":"AI providers: your own models for the AI features"},{"icon":"Settings","text":"Settings: your sidebar and business hours"}]',
      40
    ),
    (
      'inbox',
      'Inbox',
      'Conversations and the inbox',
      $html$<p>Every customer conversation lands in the inbox. <strong>Your Inbox</strong> holds the conversations assigned to you, <strong>All Conversations</strong> holds every one in the project, and <strong>Mentions</strong> holds the ones where a teammate mentioned you in an internal note. Conversations are Open, Snoozed or Closed, with Urgent, Normal or Low priority.</p><p>From a conversation you reply to the customer or add internal notes, assign it, tag it, snooze or close it, merge duplicates and turn it into a ticket. Saved <strong>Views</strong> keep the filters you use often, and <strong>Tickets</strong> track the work behind a request. See <a href="/help/comms/inbox">Inbox</a> and <a href="/help/comms/tickets">Tickets</a>.</p>$html$,
      '[]',
      '[]',
      50
    ),
    (
      'channels',
      'Channels',
      'Channels and the Messenger',
      $html$<p>Customers reach you through the <strong>Messenger</strong>, the chat widget you install on your site or app. Their conversations arrive in the inbox, they see your replies in the Messenger, and they can browse your help articles and rate closed conversations there. See <a href="/help/comms/messenger">Messenger</a>.</p><p><strong>Email</strong> channels send your replies to customers from a support address. Comms doesn't receive customer email. See <a href="/help/comms/channels">Channels</a>.</p>$html$,
      '[]',
      '[]',
      60
    ),
    (
      'customers',
      'Customers',
      'Customers',
      $html$<p><strong>People</strong> keeps a contact record for everyone who writes in, with their details, a timeline of their conversations, tickets, notes and tasks, and custom attributes. <strong>Companies</strong> groups people into accounts, and <strong>Segments</strong> saves audiences built from rules. You can import and export people and companies as CSV files. See <a href="/help/comms/customers">Customers</a>.</p>$html$,
      '[]',
      '[]',
      70
    ),
    (
      'automation',
      'Automation',
      'Automation',
      $html$<ul><li><strong>Workflows</strong> run steps automatically when something happens, such as a new conversation, a reply, a tag or a customer going quiet. See <a href="/help/comms/workflows">Workflows</a>.</li><li><strong>Macros</strong> are saved replies, with optional actions, that teammates insert from the inbox. See <a href="/help/comms/macros">Macros</a>.</li><li><strong>Routing Rules</strong> decide who gets each new conversation, and <strong>SLA Policies</strong> set first response and resolution targets. See <a href="/help/comms/routing-and-slas">Routing rules and SLAs</a>.</li></ul><p>Changing workflows, routing rules and SLA policies needs the <strong>Manage settings</strong> permission.</p>$html$,
      '[]',
      '[]',
      80
    ),
    (
      'knowledge-base',
      'Knowledge Base',
      'Knowledge Base',
      $html$<ul><li><strong>Articles</strong> are your help content: written in the editor, drafted or translated with AI, published and versioned. See <a href="/help/comms/articles">Articles</a>.</li><li><strong>Help Centers</strong> group articles into collections. Your default help center is what customers browse in the Messenger. See <a href="/help/comms/help-centers">Help centers</a>.</li><li><strong>Knowledge Gaps</strong> finds the questions customers ask that no article answers, ranked by impact. See <a href="/help/comms/knowledge-gaps">Knowledge gaps</a>.</li></ul>$html$,
      '[]',
      '[]',
      90
    ),
    (
      'reports',
      'Reports',
      'Overview and reports',
      $html$<p><strong>Overview</strong>, where Comms opens, sums up the project's conversations: totals, unread and waiting counts, channel mix, resolution rate, backlog and what needs attention. See <a href="/help/comms/project-overview">Project overview</a>.</p><p><strong>Reports</strong> covers a date range you choose: conversation volume, response times, SLA hit rates, customer satisfaction and teammate performance. See <a href="/help/comms/reports">Reports</a>.</p>$html$,
      '[]',
      '[]',
      100
    ),
    (
      'ai-features',
      'AI',
      'AI features',
      $html$<p>Comms's AI features run on your own AI provider, connected under <strong>Settings → AI Providers</strong>: conversation summaries, reply rewrites and translation in the inbox, drafting and translation in articles, and grouping of knowledge gaps. Each feature has a switch and a daily limit, and nothing is sent to your provider until someone confirms data sharing. See <a href="/help/comms/ai-providers">AI providers</a>.</p>$html$,
      '[]',
      '[]',
      110
    ),
    (
      'team-and-settings',
      'Settings',
      'Teammates, roles and settings',
      $html$<p>Under <strong>Settings</strong>, <strong>Teammates</strong> is where you invite people and organize them into groups, and <strong>Roles & Permissions</strong> decides what each role can do. Comms has five built-in roles: Owner, Admin, Manager, Member and Viewer. See <a href="/help/comms/teammates">Teammates and roles</a>.</p><p><strong>Navigation</strong> chooses what your own sidebar shows, and <strong>Business Hours</strong> sets when your team is open, for SLA targets, workflows and routing. See <a href="/help/comms/settings">Settings</a>.</p>$html$,
      '[]',
      '[]',
      120
    ),
    (
      'shortcuts',
      'Reference',
      'Keyboard shortcuts',
      $html$<ul><li><code>Ctrl K</code> (<code>⌘ K</code> on Mac) opens search, to jump to any screen</li><li>In the inbox, <code>J</code> and <code>K</code> move through the list, <code>E</code> closes or reopens, <code>A</code> assigns, <code>S</code> snoozes, <code>X</code> selects and <code>/</code> searches</li><li><code>Ctrl Enter</code> (<code>⌘ Enter</code> on Mac) sends a reply or note</li></ul><p>The <a href="/help/comms/inbox#shortcuts">Inbox</a> and <a href="/help/comms/articles#shortcuts">Articles</a> guides list every shortcut in their area.</p>$html$,
      '[]',
      '[]',
      130
    )
) as v(anchor_id, eyebrow, title, content, cards, features, sort_order)
cross join (select id from public.docs_pages where slug = 'comms' and deleted_at is null) p;

-- @down
-- Restores the Overview's outline exactly as 20261023112957_help_center_structure wrote it (never edited in Studio).
update public.docs_pages
set description = 'Customer messaging and support.'
where slug = 'comms' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'comms' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>What Geiger Comms is for</li><li>Opening it from a project</li><li>Key concepts</li><li>Common workflows</li></ul>',
  10
from public.docs_pages p
where p.slug = 'comms' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
