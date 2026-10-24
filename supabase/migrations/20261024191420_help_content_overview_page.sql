-- Help content overview page
--
-- One-time content move, like 20261024142451_help_flow_overview_page: replaces the Content Overview's draft outline with
-- the full Geiger Content overview and publishes it, with the /content/playground hero set by
-- 20261024191400_help_content_structure. Each headline area gets a section that links to its guide (20261024191401 to
-- 20261024191413). Experiments and the live feed have no published guide, so nothing here links to them.
-- Written from a survey of C:\Pro\geiger-content (components/internal/sidebar/sidebar_nav.jsx, sidebar.jsx,
-- components/internal/workspace/workspace_shell.jsx, components/internal/screens/overview/*, components/ContentPlayground.jsx,
-- geiger-rbac.config.js, the pinned @geiger/ui command-palette.jsx) and C:\Pro\geiger-dash (lib/org/product-apps.js,
-- app/org/[ORGID]/_components/project-row.jsx), plus the area guides' surveys named in their own migration headers.
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Geiger Content',
    nav_label = 'Overview',
    description = 'Content is where your team models, writes, reviews and publishes entries for your sites and apps, delivers them through APIs, and tailors them to each visitor.',
    preview = 'content',
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'content' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'content' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, cards, features, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.cards::jsonb, v.features::jsonb, v.sort_order
from (
  values
    (
      'start-here',
      null,
      'Start here',
      '',
      '[{"icon":"FolderKanban","title":"Open a project","body":"Launch Content from any project in your organization","href":"/org"},{"icon":"Library","title":"Create entries","body":"Write, publish and archive your entries","href":"/help/content/library"},{"icon":"CirclePlay","title":"Try the playground","body":"Explore a sample project without signing up","href":"/content/playground"}]',
      '[]',
      10
    ),
    (
      'opening-content',
      'Basics',
      'Opening Content',
      $html$<p>Content works inside a <strong>project</strong>. Open your organization in Dash and choose <strong>Content</strong> on one of its projects. Everything you create there belongs to that project, and everyone in the project's organization can open it.</p><p>Content opens on the <strong>Overview</strong> screen. The sidebar lists its sections in this order: Overview, Content, Architecture, Editorial, Publishing, Governance, Developers, Audiences, Personalization, Experiments, Recommendations, Intelligence and Settings. Click a section to expand it, then pick one of its screens. The screen you're on is part of the page address, so reloading keeps you there.</p><p>To jump to a screen by name, press <code>Ctrl K</code> (<code>⌘ K</code> on Mac) or use the search box in the top bar.</p><p>Which sections you see depends on your role. Writers see Overview, Content, Architecture and Editorial, Viewers see Overview and Intelligence, and Owners, Admins and Editors see every section. The <a href="/help/content/governance">Governance</a> guide covers roles.</p>$html$,
      '[]',
      '[]',
      20
    ),
    (
      'trying-the-playground',
      'Basics',
      'Trying Content in the playground',
      $html$<p>The <a href="/content/playground">Content playground</a> opens a sample project in Content without an account, with entries, collections, assets and the rest already filled in, so you can click through its sections before you sign up.</p><p>Changes you make in the playground last until you reload the page.</p>$html$,
      '[]',
      '[]',
      30
    ),
    (
      'whats-in-content',
      'Areas',
      'What''s in Content',
      '<p>Each part of the sidebar covers one job, and each has its own guide in this Help Center.</p>',
      '[]',
      '[{"icon":"LayoutDashboard","text":"Overview: entry counts, activity and what needs attention"},{"icon":"Library","text":"Content library: entries, pages, collections, assets and slots"},{"icon":"DraftingCompass","text":"Content architecture: content types, fields, taxonomies and locales"},{"icon":"FileText","text":"Editorial: structured editing, comments, review and versions"},{"icon":"Rocket","text":"Publishing: the publishing queue, releases, webhooks and caching"},{"icon":"CodeXml","text":"Developer tools: delivery APIs, GraphQL, types and API tokens"},{"icon":"UsersRound","text":"Audiences: profiles, traits, events and segments"},{"icon":"Target","text":"Personalization: variants and targeting rules for content slots"},{"icon":"BrainCircuit","text":"Recommendations: similar content, rankings and business rules"},{"icon":"ChartNoAxesCombined","text":"Content intelligence: semantic search, duplicates, gaps and reports"},{"icon":"ShieldCheck","text":"Governance: members, roles, permissions, consent and audit logs"},{"icon":"Settings","text":"Project settings: locale, branding, integrations and security"}]',
      40
    ),
    (
      'overview-screen',
      'Overview',
      'The Overview screen',
      $html$<p>The <strong>Overview</strong> screen sums up the project. Across the top it counts the project's <strong>Collections</strong>, <strong>Slots</strong> and <strong>Assets</strong>, then <strong>Total entries</strong> (with the share published), <strong>Published</strong>, <strong>Drafts & in review</strong> and <strong>Updated (30d)</strong>, the entries edited in the last 30 days.</p><ul><li><strong>Content activity</strong> charts the last 12 weeks. Its menu switches between <strong>Entries created</strong>, <strong>Entries by latest update</strong> and <strong>Entries published</strong>, and it compares the last four completed weeks with the four before.</li><li><strong>Status mix</strong> shows each status's share of all entries.</li><li><strong>Publishing stages</strong> counts Draft, In review, Scheduled and Published entries.</li><li><strong>Content types</strong> counts entries of each type.</li><li><strong>Recent entries</strong> lists the six most recently updated. Click one to open it, or choose <strong>View all</strong>.</li><li><strong>Needs attention</strong> counts entries In review, Scheduled, Drafts, <strong>Stale drafts</strong> untouched for 30 days or more, entries with a <strong>Missing excerpt</strong>, and Archived entries. Click a count to open the matching screen.</li></ul><p>A project without entries shows "No content yet" and a button to <strong>Go to All Content</strong>.</p>$html$,
      '[]',
      '[]',
      50
    ),
    (
      'entries-structure-review',
      'Content',
      'Entries, structure and review',
      $html$<p>An <strong>entry</strong> is one piece of content: an Article, Page, Guide or Doc, with a title, slug, excerpt, body and cover. Entries move through the statuses Draft, In review, Scheduled, Published and Archived, and only published entries reach your sites. <strong>Collections</strong> group entries, <strong>Assets</strong> holds your media, and <strong>Content Slots</strong> are named places in your apps that ask Content what to show. The <a href="/help/content/library">Content library</a> guide covers them.</p><p><strong>Architecture</strong> defines content types and their typed fields, references between entries, taxonomies and locales; see <a href="/help/content/architecture">Content architecture</a>. <strong>Editorial</strong> is where you fill in those fields, discuss entries, assign owners, approve or reject entries in review, and restore earlier versions; see <a href="/help/content/editorial">Editorial</a>.</p>$html$,
      '[]',
      '[]',
      60
    ),
    (
      'publishing-and-delivery',
      'Publishing',
      'Publishing and delivery',
      $html$<p><strong>Publishing</strong> puts entries live. The Publishing Queue publishes and unpublishes entries and calls your webhooks, Releases and Publishing History keep earlier versions you can restore, and Cache Invalidation refreshes cached delivery. See <a href="/help/content/publishing">Publishing</a>.</p><p>Your sites and apps read published entries through the delivery APIs: a v1 REST API, a v2 API for each content type with filters and paging, and a GraphQL endpoint. API tokens, type generation and import and export are under <strong>Developers</strong>. See <a href="/help/content/developers">Developer tools</a>.</p>$html$,
      '[]',
      '[]',
      70
    ),
    (
      'audiences-and-personalization',
      'Personalization',
      'Audiences, personalization and recommendations',
      $html$<ul><li><strong>Audiences</strong> holds profiles of the people who read your content, their traits, the events your site sends and the segments that group them. See <a href="/help/content/audiences">Audiences</a>.</li><li><strong>Personalization</strong> gives a content slot several variants with targeting rules, so each visitor gets the entry meant for them, with a reason for every decision. See <a href="/help/content/personalization">Personalization</a>.</li><li><strong>Recommendations</strong> finds similar entries and shows rankings with your boosts, exclusions and business rules applied. See <a href="/help/content/recommendations">Recommendations</a>.</li></ul>$html$,
      '[]',
      '[]',
      80
    ),
    (
      'intelligence',
      'Intelligence',
      'Content intelligence',
      $html$<p><strong>Intelligence</strong> indexes your published entries and images by meaning, then uses the index for semantic search, tag suggestions, duplicate detection, content gaps and a knowledge graph. It also reports on content and audience performance and lists the reasons behind your content slots' decisions. See <a href="/help/content/intelligence">Content intelligence</a>.</p>$html$,
      '[]',
      '[]',
      90
    ),
    (
      'governance-and-settings',
      'Governance',
      'Governance and settings',
      $html$<p><strong>Governance</strong> controls who can do what: members and their roles, custom roles built from permissions, recorded consent and the audit log. See <a href="/help/content/governance">Governance</a>.</p><p><strong>Settings</strong> holds the project's default locale and timezone, its brand details, its integrations and your session and the project's credentials. See <a href="/help/content/settings">Project settings</a>.</p>$html$,
      '[]',
      '[]',
      100
    ),
    (
      'shortcuts',
      'Reference',
      'Keyboard shortcuts',
      $html$<ul><li><code>Ctrl K</code> or <code>Ctrl /</code> (<code>⌘ K</code> or <code>⌘ /</code> on Mac) opens screen search, which lists your recent screens first</li><li>In screen search, the up and down arrows move through the results and <code>Enter</code> opens one</li><li><code>Enter</code> in the title or name field of the <strong>Create content</strong>, <strong>Create collection</strong>, <strong>Add asset</strong> and <strong>Create slot</strong> dialogs creates the item</li></ul>$html$,
      '[]',
      '[]',
      110
    )
) as v(anchor_id, eyebrow, title, content, cards, features, sort_order)
cross join (select id from public.docs_pages where slug = 'content' and deleted_at is null) p;

-- @down
-- Restores the Overview draft exactly as 20261024191400_help_content_structure left it.
update public.docs_pages
set title = 'Geiger Content',
    nav_label = 'Overview',
    description = 'Personalized content feeds.',
    preview = 'content',
    status = 'draft',
    published_at = null
where slug = 'content' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'content' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>What Geiger Content is for</li><li>Opening it from a project</li><li>Key concepts</li><li>Common workflows</li></ul>',
  10
from public.docs_pages p
where p.slug = 'content' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
