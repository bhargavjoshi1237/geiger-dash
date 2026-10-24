-- Help flow guide
--
-- One-time content move, like 20261023112957_help_center_structure: rewrites the Welcome page and gives Flow its
-- own sidebar group. The products/flow draft is re-homed as the published Flow Overview (with the /flow/playground
-- hero), and Flow's other areas start as draft outlines. Later edits happen in Studio, so this must never re-run.
-- Written from a survey of C:\Pro\geiger-flow (components/internal/sidebar/projects/sidebar_data.js, components/internal/screens/it/*,
-- components/internal/screens/projects/grounding/*, settings/navigation/*).

-- @up
insert into public.docs_nav_groups (title, slug, sort_order)
values ('Flow', 'flow', 25)
on conflict (slug) do update set
  title = excluded.title,
  sort_order = excluded.sort_order;

-- Welcome: a cleaner home page.
update public.docs_pages
set description = 'Guides for Geiger, the connected suite for running your team''s work. Set up your organization and projects, then go deeper into each app.'
where slug = 'welcome' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'welcome' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, cards, features, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.cards::jsonb, v.features::jsonb, v.sort_order
from (
  values
    (
      'start-here',
      null,
      'Start here',
      '',
      '[{"icon":"UserPlus","title":"Create an account","body":"Sign up and set up your organization","href":"/signup"},{"icon":"Workflow","title":"Geiger Flow","body":"Plan and track work across your projects","href":"/help/flow"},{"icon":"Sparkles","title":"Changelog","body":"See what shipped across the suite","href":"/changelog"}]',
      '[]',
      10
    ),
    (
      'how-it-fits',
      'Concepts',
      'How Geiger fits together',
      $html$<p>Everything starts with an <strong>organization</strong>. It holds your members, billing and settings, along with the <strong>projects</strong> your team works on.</p><p>Projects are shared across the suite. Plan one in Flow, keep its files in Assets and run its events in Events, and the work stays tied to the same project wherever it happens.</p>$html$,
      '[]',
      '[{"icon":"Building2","text":"Organization: members, billing, add-ons and settings"},{"icon":"FolderKanban","text":"Projects: one home for the work, shared by every app"},{"icon":"Users","text":"Members: invite your team and give them roles"},{"icon":"LayoutGrid","text":"Apps: open a project in whichever apps it needs"}]',
      20
    ),
    (
      'apps',
      'Apps',
      'Apps in the suite',
      '<p>Each app runs on its own and opens from the same organization and project. One account signs you in to all of them.</p>',
      '[]',
      '[{"icon":"Workflow","text":"Flow: projects, issues and delivery"},{"icon":"NotebookPen","text":"Notes: docs and knowledge"},{"icon":"Images","text":"Assets: creative asset control"},{"icon":"CalendarDays","text":"Events: event operations and registration"},{"icon":"ClipboardList","text":"Forms: intake and feedback"},{"icon":"BrainCircuit","text":"Grey: managed RAG and knowledge graphs"},{"icon":"Rss","text":"Content: personalized content feeds"},{"icon":"Megaphone","text":"Campaign: campaign planning and delivery"},{"icon":"MessagesSquare","text":"Comms: customer messaging and support"},{"icon":"Building","text":"Office: workspace operations"},{"icon":"Signature","text":"Docs: document signing and agreements"},{"icon":"Plug","text":"Pods: API gateway"},{"icon":"House","text":"Property: real estate and property management"}]',
      30
    ),
    (
      'get-help',
      'Support',
      'Getting help',
      $html$<p>Search every guide with <code>Ctrl K</code> (<code>⌘ K</code> on Mac). Once you're signed in, <strong>Ask AI</strong> (<code>Ctrl I</code>) answers questions from these guides.</p><p>For what changed recently, see the <a href="/changelog">changelog</a>.</p>$html$,
      '[]',
      '[]',
      40
    )
) as v(anchor_id, eyebrow, title, content, cards, features, sort_order)
cross join (select id from public.docs_pages where slug = 'welcome' and deleted_at is null) p;

-- Flow Overview: re-home the products/flow draft, or create it on a database that never had one.
update public.docs_pages
set nav_group_id = (select id from public.docs_nav_groups where slug = 'flow'),
    slug = 'flow',
    title = 'Geiger Flow',
    nav_label = 'Overview',
    description = 'Flow is where your team plans and tracks work. Each project gets tasks, milestones and goals, a fast issue tracker, and Grounding, its built-in chat.',
    preview = 'flow',
    status = 'published',
    published_at = coalesce(published_at, now()),
    sort_order = 10,
    has_children = false
where slug = 'products/flow' and deleted_at is null;

insert into public.docs_pages (nav_group_id, slug, title, nav_label, description, preview, status, published_at, sort_order)
select g.id, 'flow', 'Geiger Flow', 'Overview',
  'Flow is where your team plans and tracks work. Each project gets tasks, milestones and goals, a fast issue tracker, and Grounding, its built-in chat.',
  'flow', 'published', now(), 10
from public.docs_nav_groups g
where g.slug = 'flow'
on conflict (slug) where deleted_at is null do nothing;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'flow' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, cards, features, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.cards::jsonb, v.features::jsonb, v.sort_order
from (
  values
    (
      'start-here',
      null,
      'Start here',
      '',
      '[{"icon":"FolderKanban","title":"Open a project","body":"Launch Flow from any project in your organization","href":"/org"},{"icon":"SquareKanban","title":"Track issues","body":"Triage, prioritize and ship from the issue tracker","href":"#issue-tracker"},{"icon":"CirclePlay","title":"Try the playground","body":"Explore a sample project without signing up","href":"/flow/playground"}]',
      '[]',
      10
    ),
    (
      'opening-flow',
      'Basics',
      'Opening Flow',
      $html$<p>Flow works inside a <strong>project</strong>. Open your organization in Dash and launch Flow from one of its projects. Everything you create there belongs to that project.</p><p>The sidebar lists the project's areas, from Overview and Tasks to Milestones, Goals and Reporting. If your team doesn't use some of them, hide them under <strong>Settings → Navigation</strong>. That only changes your own sidebar.</p>$html$,
      '[]',
      '[]',
      20
    ),
    (
      'project-areas',
      'Workspace',
      'What''s in a project',
      '<p>Each area in the sidebar covers one part of running the project.</p>',
      '[]',
      '[{"icon":"ListTodo","text":"Tasks: status, priority, type and delivery stage"},{"icon":"Flag","text":"Milestones, goals and objectives with health tracking"},{"icon":"CalendarRange","text":"Projections: releases, reviews and deadlines on a calendar"},{"icon":"Shapes","text":"Planning: a free-form canvas for notes, images and files"},{"icon":"ChartColumn","text":"Reporting: time entries and progress across tasks and issues"},{"icon":"Users","text":"Team: invite members as Admin, Member or Viewer"},{"icon":"KeyRound","text":"Vault: passwords, API keys and other shared secrets"},{"icon":"ShieldCheck","text":"Security: policies, vulnerabilities and access events"}]',
      30
    ),
    (
      'issue-tracker',
      'Issues',
      'Issue tracker',
      $html$<p>Issues have their own fast tracker. Choosing <strong>Issues</strong> in the project sidebar opens it in a new tab, with Inbox, My Issues, and your team's Issues, Triage, Cycles, Divisions and Views.</p><ul><li><strong>Status:</strong> Backlog, Todo, In Progress, In Review, Done, Canceled or Duplicate</li><li><strong>Priority:</strong> Urgent, High, Medium, Low or No priority</li><li><strong>Properties:</strong> assignees, labels, division, cycle, estimate and due date</li></ul><p>Show issues as a list or a board, group them by status, assignee, priority, division, cycle or label, and filter on the same fields. Assigning someone sends them an email, and overdue issues are flagged.</p><p><strong>Cycles</strong> group issues toward a target date, <strong>Divisions</strong> track a body of work with a lead, health and progress, and <strong>Initiatives</strong> lay out the roadmap by quarter or month.</p>$html$,
      '[]',
      '[]',
      40
    ),
    (
      'shortcuts',
      'Issues',
      'Keyboard shortcuts',
      $html$<ul><li><code>Ctrl K</code> (<code>⌘ K</code> on Mac) opens the command palette</li><li><code>C</code> creates an issue</li><li><code>G</code> then a letter jumps to a view: <code>I</code> Inbox, <code>M</code> My Issues, <code>A</code> all issues, <code>T</code> Triage, <code>C</code> Cycles, <code>D</code> Divisions, <code>V</code> Views, <code>R</code> Initiatives, <code>S</code> Settings</li><li><code>J</code> / <code>K</code> or the arrow keys move through a list, <code>X</code> selects, <code>Enter</code> opens and <code>Esc</code> closes</li></ul>$html$,
      '[]',
      '[]',
      50
    ),
    (
      'grounding',
      'Chat',
      'Grounding',
      $html$<p>Grounding is the project's own chat. Choosing <strong>Grounding</strong> in the sidebar opens direct messages and channels, with threaded replies, reactions, mentions and attachments.</p><p>It also has audio calls and video meetings, a shared files view, and external contacts for talking with people outside your team.</p>$html$,
      '[]',
      '[]',
      60
    )
) as v(anchor_id, eyebrow, title, content, cards, features, sort_order)
cross join (select id from public.docs_pages where slug = 'flow' and deleted_at is null) p;

-- Flow's other areas: drafts with a writing outline, visible to editors in preview only.
insert into public.docs_pages (nav_group_id, slug, title, description, status, sort_order)
select g.id, v.slug, v.title, v.description, 'draft', v.sort_order
from (
  values
    ('flow/issues', 'Issue tracker', 'Triage, prioritize and ship issues with lists, boards, cycles and views.', 20),
    ('flow/tasks', 'Tasks', 'Plan project work with statuses, priorities, types and delivery stages.', 30),
    ('flow/planning', 'Planning board', 'Map out ideas on a free-form canvas of notes, images, files and dates.', 40),
    ('flow/goals', 'Milestones & goals', 'Set milestones, goals and objectives, and track their health and progress.', 50),
    ('flow/projections', 'Projections', 'Plan releases, reviews and deadlines on the project calendar.', 60),
    ('flow/grounding', 'Grounding', 'Chat, channels, calls and meetings for the project team.', 70),
    ('flow/reporting', 'Reporting', 'Time entries and progress across tasks and issues.', 80),
    ('flow/team', 'Team & access', 'Invite members, set roles, and manage the vault and security.', 90),
    ('flow/settings', 'Project settings', 'Custom fields, navigation, add-ons, usage and advanced options.', 100)
) as v(slug, title, description, sort_order)
cross join (select id from public.docs_nav_groups where slug = 'flow') g
on conflict (slug) where deleted_at is null do nothing;

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview', '<p><em>Draft outline. Replace before publishing.</em></p><ul>' || v.outline || '</ul>', 10
from (
  values
    ('flow/issues', '<li>Opening the tracker</li><li>Statuses and priorities</li><li>List and board layouts</li><li>Grouping, ordering and filters</li><li>Issue properties</li><li>Cycles, divisions and initiatives</li><li>Inbox and My Issues</li><li>Keyboard shortcuts</li>'),
    ('flow/tasks', '<li>Creating a task</li><li>Status, priority and type</li><li>Delivery stages</li><li>Comments</li><li>The Work Queue</li>'),
    ('flow/planning', '<li>Adding notes, images and files</li><li>Calendar and clock nodes</li><li>Autosave</li>'),
    ('flow/goals', '<li>Milestones</li><li>Goals and how progress is measured</li><li>Objectives and their goal board</li><li>Health: Not Started, On Track, At Risk, Completed</li>'),
    ('flow/projections', '<li>Milestones, releases, reviews and deadlines</li><li>Public and shared items</li>'),
    ('flow/grounding', '<li>Direct messages and channels</li><li>Threads, reactions and mentions</li><li>Attachments and files</li><li>Audio calls and video meetings</li><li>External contacts</li>'),
    ('flow/reporting', '<li>Time entries</li><li>Task and issue reports</li>'),
    ('flow/team', '<li>Inviting members</li><li>Roles: Admin, Member, Viewer</li><li>Vault secrets</li><li>Security policies, vulnerabilities and access events</li>'),
    ('flow/settings', '<li>General</li><li>Connections</li><li>Custom fields</li><li>Navigation</li><li>Add-ons and usage</li><li>Advanced: visibility, read-only mode, webhooks, environment variables</li>')
) as v(slug, outline)
join public.docs_pages p on p.slug = v.slug and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;

-- @down
-- Flow drafts go with their outline blocks (on delete cascade).
delete from public.docs_pages where slug like 'flow/%';

update public.docs_pages
set nav_group_id = (select id from public.docs_nav_groups where slug = 'products'),
    slug = 'products/flow',
    title = 'Geiger Flow',
    nav_label = 'Flow',
    description = 'Projects and delivery.',
    preview = null,
    status = 'draft',
    published_at = null,
    sort_order = 10
where slug = 'flow' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'products/flow' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>What Geiger Flow is for</li><li>Opening it from a project</li><li>Key concepts</li><li>Common workflows</li></ul>',
  10
from public.docs_pages p
where p.slug = 'products/flow' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;

delete from public.docs_nav_groups where slug = 'flow';

update public.docs_pages
set description = 'Guides for the Geiger suite: setting up your organization, running projects, and getting the most out of each product.'
where slug = 'welcome' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'welcome' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, cards, features, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.cards::jsonb, v.features::jsonb, v.sort_order
from (
  values
    (
      'start-here',
      null,
      'Start here',
      '',
      '[{"icon":"UserPlus","title":"Create an account","body":"Sign up and set up your organization","href":"/signup"},{"icon":"CircleDollarSign","title":"Plans & pricing","body":"Compare plans, seats and add-ons","href":"/pricing"},{"icon":"Sparkles","title":"Changelog","body":"See what shipped across the suite","href":"/changelog"}]',
      '[]',
      10
    ),
    (
      'how-it-fits',
      'Concepts',
      'How Geiger is organized',
      '<p>Everything in Geiger belongs to an <strong>organization</strong>. Your organization holds its members, billing and settings, along with the <strong>projects</strong> your team works on.</p><p>Each project can be opened in the products it uses: planning in Flow, files in Assets, event operations in Events. The work stays connected to the same project wherever it happens.</p>',
      '[]',
      '[]',
      20
    ),
    (
      'products',
      'Products',
      'The suite',
      '<p>Each product is its own app, opened from the same organization and project.</p>',
      '[]',
      '[{"icon":"Workflow","text":"Flow: projects and delivery"},{"icon":"NotebookPen","text":"Notes: docs and knowledge"},{"icon":"Images","text":"Assets: creative asset control"},{"icon":"CalendarDays","text":"Events: event operations and registration"},{"icon":"ClipboardList","text":"Forms: intake and feedback"},{"icon":"BrainCircuit","text":"Grey: managed RAG and knowledge graphs"},{"icon":"Rss","text":"Content: personalized content feeds"},{"icon":"Megaphone","text":"Campaign: campaign planning and delivery"},{"icon":"MessagesSquare","text":"Comms: customer messaging and support"},{"icon":"Building2","text":"Office: workspace operations"},{"icon":"Signature","text":"Docs: document signing and agreements"},{"icon":"Plug","text":"Pods: API gateway"},{"icon":"House","text":"Property: real estate and property management"}]',
      30
    )
) as v(anchor_id, eyebrow, title, content, cards, features, sort_order)
cross join (select id from public.docs_pages where slug = 'welcome' and deleted_at is null) p;
