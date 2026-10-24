-- Help welcome suite guides
--
-- One-time content move: rewrites the welcome page's sections now that every available app and the Workspace and Get Started
-- guides are published (20261024182622 to 20261024192045). "Start here" points at Quickstart, Core concepts and Plans & pricing;
-- "How Geiger fits together" and "Apps in the suite" now state in their text every fact their tiles show (DOCUMENTATION_CONVENTIONS
-- §2.3), and each app links to its guide. Comms, Office and Docs are left out: lib/org/product-apps.js marks them unavailable.
-- Written from the published guides' own surveys and C:\Pro\geiger-dash (lib/org/product-apps.js).
-- The page row (title, description, preview) is unchanged. The @down restores the sections written by 20261023200049_help_flow_guide.
-- Later edits happen in Studio, so this must never re-run.

-- @up
delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'welcome' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, cards, features, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.cards::jsonb, v.features::jsonb, v.sort_order
from (
  values
    ('start-here', null, 'Start here', '',
      '[{"icon":"Rocket","title":"Quickstart","body":"Set up your organization and first project","href":"/help/quickstart"},{"icon":"Network","title":"Core concepts","body":"How organizations, projects and apps fit together","href":"/help/core-concepts"},{"icon":"CreditCard","title":"Plans & pricing","body":"What each plan includes and costs","href":"/help/plans-pricing"}]',
      '[]', 10),
    ('how-it-fits', 'Concepts', 'How Geiger fits together',
      $html$<p>Everything in Geiger starts with an <strong>organization</strong>. It holds your members, your projects, your plan and your add-ons, and its owner manages its settings. See <a href="/help/workspace/organizations">Organizations</a>.</p><p><strong>Members</strong> are the people in an organization. They join through an email invite, the organization's ID or its SSO sign-in, and each one has a role. See <a href="/help/workspace/members">Members and roles</a>.</p><p>A <strong>project</strong> is the shared home for a piece of work. You create it in Dash and choose the apps it uses, so one project can keep its plans in Flow and its files in Assets. See <a href="/help/workspace/projects">Projects</a>.</p><p>The organization's <strong>plan</strong> decides which apps its projects can use and how many projects it can have. <a href="/help/core-concepts">Core concepts</a> explains how the pieces relate.</p>$html$,
      '[]',
      '[{"icon":"Building2","text":"Organization: members, projects, plan and add-ons"},{"icon":"Users","text":"Members: join by invite, ID or SSO, each with a role"},{"icon":"FolderKanban","text":"Projects: one home for the work, opened in its apps"},{"icon":"CreditCard","text":"Plan: which apps and how many projects"}]',
      20),
    ('apps', 'Apps', 'Apps in the suite',
      $html$<p>Each app runs on its own and opens from a project in Dash, and one account signs you in to all of them. These are the apps you can add to a project:</p><ul><li><a href="/help/flow">Flow</a>: plan and track work with an issue tracker, tasks, milestones and goals, a planning board, reporting and chat.</li><li><a href="/help/notes">Notes</a>: boards of notes, lists, images and widgets, plus documents and sketches you can work on together live.</li><li><a href="/help/events">Events</a>: build events and their pages, sell tickets, take registrations and check people in.</li><li><a href="/help/assets">Assets</a>: upload, organize, review, share and deliver a project's files, and sell them.</li><li><a href="/help/campaign">Campaign</a>: marketing campaigns, with control over which roles see each section.</li><li><a href="/help/content">Content</a>: model, write, review and publish entries for your sites and apps, and deliver them through APIs.</li><li><a href="/help/pods">Pods</a>: build REST, HTTP and WebSocket APIs, deploy them to stages and watch their traffic.</li><li><a href="/help/forms">Forms</a>: build forms and surveys, publish them and work through the responses.</li><li><a href="/help/grey">Grey</a>: turn your documents into knowledge bases and a knowledge graph that answer questions.</li><li><a href="/help/property">Property</a>: properties and units, leasing, tenants, maintenance, rent and accounting.</li></ul>$html$,
      '[]',
      '[{"icon":"Workflow","text":"Flow: projects, issues and delivery"},{"icon":"NotebookPen","text":"Notes: boards, documents and sketches"},{"icon":"CalendarDays","text":"Events: event pages, tickets and check-in"},{"icon":"Images","text":"Assets: files, review and delivery"},{"icon":"Megaphone","text":"Campaign: marketing campaigns"},{"icon":"Rss","text":"Content: structured content and delivery"},{"icon":"Plug","text":"Pods: API gateway"},{"icon":"ClipboardList","text":"Forms: forms, surveys and responses"},{"icon":"BrainCircuit","text":"Grey: knowledge bases and graphs"},{"icon":"House","text":"Property: property management"}]',
      30),
    ('get-help', 'Support', 'Getting help',
      $html$<p>Search every guide with <code>Ctrl K</code> (<code>⌘ K</code> on Mac). Once you're signed in, <strong>Ask AI</strong> (<code>Ctrl I</code>) answers questions from these guides.</p><p>For what changed recently, see the <a href="/changelog">changelog</a>.</p>$html$,
      '[]', '[]', 40)
) as v(anchor_id, eyebrow, title, content, cards, features, sort_order)
cross join (select id from public.docs_pages where slug = 'welcome' and deleted_at is null) p;

-- @down
delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'welcome' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, cards, features, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.cards::jsonb, v.features::jsonb, v.sort_order
from (
  values
    ('start-here', null, 'Start here', '',
      '[{"body":"Sign up and set up your organization","href":"/signup","icon":"UserPlus","title":"Create an account"},{"body":"Plan and track work across your projects","href":"/help/flow","icon":"Workflow","title":"Geiger Flow"},{"body":"See what shipped across the suite","href":"/changelog","icon":"Sparkles","title":"Changelog"}]',
      '[]', 10),
    ('how-it-fits', 'Concepts', 'How Geiger fits together',
      $html$<p>Everything starts with an <strong>organization</strong>. It holds your members, billing and settings, along with the <strong>projects</strong> your team works on.</p><p>Projects are shared across the suite. Plan one in Flow, keep its files in Assets and run its events in Events, and the work stays tied to the same project wherever it happens.</p>$html$,
      '[]',
      '[{"icon":"Building2","text":"Organization: members, billing, add-ons and settings"},{"icon":"FolderKanban","text":"Projects: one home for the work, shared by every app"},{"icon":"Users","text":"Members: invite your team and give them roles"},{"icon":"LayoutGrid","text":"Apps: open a project in whichever apps it needs"}]',
      20),
    ('apps', 'Apps', 'Apps in the suite',
      $html$<p>Each app runs on its own and opens from the same organization and project. One account signs you in to all of them.</p>$html$,
      '[]',
      '[{"icon":"Workflow","text":"Flow: projects, issues and delivery"},{"icon":"NotebookPen","text":"Notes: docs and knowledge"},{"icon":"Images","text":"Assets: creative asset control"},{"icon":"CalendarDays","text":"Events: event operations and registration"},{"icon":"ClipboardList","text":"Forms: intake and feedback"},{"icon":"BrainCircuit","text":"Grey: managed RAG and knowledge graphs"},{"icon":"Rss","text":"Content: personalized content feeds"},{"icon":"Megaphone","text":"Campaign: campaign planning and delivery"},{"icon":"MessagesSquare","text":"Comms: customer messaging and support"},{"icon":"Building","text":"Office: workspace operations"},{"icon":"Signature","text":"Docs: document signing and agreements"},{"icon":"Plug","text":"Pods: API gateway"},{"icon":"House","text":"Property: real estate and property management"}]',
      30),
    ('get-help', 'Support', 'Getting help',
      $html$<p>Search every guide with <code>Ctrl K</code> (<code>⌘ K</code> on Mac). Once you're signed in, <strong>Ask AI</strong> (<code>Ctrl I</code>) answers questions from these guides.</p><p>For what changed recently, see the <a href="/changelog">changelog</a>.</p>$html$,
      '[]', '[]', 40)
) as v(anchor_id, eyebrow, title, content, cards, features, sort_order)
cross join (select id from public.docs_pages where slug = 'welcome' and deleted_at is null) p;
