-- Help pods overview page
--
-- One-time content move, like 20261024142451_help_flow_overview_page: replaces the Pods Overview draft outline (the
-- products/pods draft re-homed to pods by 20261024191500_help_pods_structure) with the full Geiger Pods overview and
-- publishes it, with the /pods/playground hero (preview = 'pods'). Each headline area gets a section that links to its
-- guide. Networking (Custom Domains, Trust Stores, Connectors) has no guide yet: its draft stays unpublished.
-- Written from a survey of C:\Pro\geiger-pods (components/internal/sidebar/sidebar_nav.jsx,
-- components/internal/workspace/workspace_shell.jsx and workspace_states.jsx, app/project/page.js,
-- context/project-context.jsx, components/landing/pods_playground.jsx, lib/playground/*) and of C:\Pro\geiger-dash
-- (app/org/[ORGID]/_components/project-row.jsx, lib/org/product-apps.js), plus the area guides' surveys named in their
-- own migration headers (20261024191505 to 20261024191526).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Geiger Pods',
    nav_label = 'Overview',
    description = 'Pods is the suite''s API gateway. Build REST, HTTP and WebSocket APIs, deploy them to stages, control who calls them, and watch their traffic.',
    preview = 'pods',
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'pods' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'pods' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, cards, features, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.cards::jsonb, v.features::jsonb, v.sort_order
from (
  values
    (
      'start-here',
      null,
      'Start here',
      '',
      '[{"icon":"FolderKanban","title":"Open a project","body":"Launch Pods from any project in your organization","href":"/org"},{"icon":"Network","title":"Create an API","body":"Start a REST, HTTP or WebSocket API","href":"/help/pods/apis#creating-an-api"},{"icon":"CirclePlay","title":"Try the playground","body":"Explore a sample gateway without signing up","href":"/pods/playground"}]',
      '[]',
      10
    ),
    (
      'opening-pods',
      'Basics',
      'Opening Pods',
      $html$<p>Pods works inside a Geiger <strong>project</strong>. Open your organization in <a href="/org">Dash</a> and choose <strong>Pods</strong> on one of its projects. If Pods shows a lock, it isn't in your organization's plan. One Geiger account signs you in to Pods and every other app. Everything you create in Pods belongs to that project.</p><p>The sidebar lists Pods' areas: <strong>Overview</strong>, <strong>APIs</strong>, <strong>Usage</strong>, <strong>Security</strong>, <strong>Networking</strong>, <strong>Monitoring</strong>, <strong>Portals</strong> and <strong>Settings</strong>. Usage, Security, Networking, Monitoring and Settings expand to show their screens. To jump to any screen, type its name in <strong>Search Pods</strong> at the top.</p><p>Opening Pods without a project in the address opens the last project you used, or your first one. With no projects at all, Pods says so and links to Dash to create one.</p>$html$,
      '[]',
      '[]',
      20
    ),
    (
      'trying-the-playground',
      'Basics',
      'Trying Pods in the playground',
      $html$<p>The <a href="/pods/playground">Pods playground</a> opens a sample gateway without an account, so you can click through every area before you sign up.</p><p>Changes you make in the playground last until you reload the page. Anything that needs a real account or a live backend says "Not available in the playground".</p>$html$,
      '[]',
      '[]',
      30
    ),
    (
      'whats-in-pods',
      'Areas',
      'What''s in Pods',
      '<p>Each area in the Pods sidebar covers one part of running an API gateway, and each has its own guide. The sections on this page sum them up and link to each one.</p>',
      '[]',
      '[{"icon":"LayoutDashboard","text":"Overview: traffic, API health and what needs attention"},{"icon":"Network","text":"APIs: REST, HTTP and WebSocket APIs in the API editor"},{"icon":"Rocket","text":"Deployments and stages: deploy the draft, roll back, cache and throttle"},{"icon":"Ticket","text":"Usage plans and API keys: throttles and quotas for each caller"},{"icon":"ShieldCheck","text":"Security: secrets, the firewall and signing credentials"},{"icon":"Activity","text":"Monitoring: dashboard, request logs, alarms and log exports"},{"icon":"BookOpen","text":"Developer portals: products, docs pages and publishing"},{"icon":"Settings","text":"Settings: project throttle, roles, access tokens and the audit log"}]',
      40
    ),
    (
      'apis',
      'APIs',
      'APIs and the API editor',
      $html$<p>An API in Pods is <strong>REST</strong> (a tree of resources and methods), <strong>HTTP</strong> (simple routes) or <strong>WebSocket</strong> (a two-way connection). Choose <strong>APIs</strong> in the sidebar to create one, then click it to open the API editor, where you build its resources or routes, integrations to backends, authorizers, models and docs.</p><p>What you edit is the API's draft. <strong>Deploy</strong> snapshots the draft as a deployment and puts it on a stage, such as <code>prod</code>, with its own invoke URL. Stages also carry their own variables, caching, throttling and logging.</p><p>The <a href="/help/pods/apis">APIs</a> guide covers creating and managing APIs, and links to a guide for each part of the API editor. The <a href="/help/pods/project-overview">Project overview</a> guide covers the Overview screen, where traffic for every API is summed up.</p>$html$,
      '[]',
      '[]',
      50
    ),
    (
      'deployments',
      'Releases',
      'Deployments and stages',
      $html$<p>Each deployment is a fixed snapshot, so you can compare two of them, point a stage back at an earlier one, or roll a stage back from its history. Each stage serves its deployment at its invoke URL, with its own stage variables, response cache, throttling and logging.</p><p>The <a href="/help/pods/apis/deployments-and-stages">Deployments and stages</a> guide covers deploying, comparing, rolling back and every stage setting.</p>$html$,
      '[]',
      '[]',
      60
    ),
    (
      'callers-and-security',
      'Access',
      'Controlling who calls your APIs',
      $html$<p>Pods has several layers for deciding who can call an API, and how much.</p><ul><li><strong>Authorizers</strong> check a caller's JWT, or ask your own webhook, before a method or route runs. REST APIs can also have a resource policy. See <a href="/help/pods/apis/authorizers">Authorizers and resource policies</a>.</li><li><strong>API keys</strong> identify each caller, and <strong>usage plans</strong> give their keys throttles and quotas on the stages they cover. See <a href="/help/pods/usage">Usage plans and API keys</a>.</li><li><strong>Security</strong> holds the secrets integrations send to backends, the web application firewall that filters REST stages, and the signing credentials for SigV4-signed calls. See <a href="/help/pods/security">Security</a>.</li></ul>$html$,
      '[]',
      '[]',
      70
    ),
    (
      'monitoring-and-portals',
      'Operations',
      'Monitoring and developer portals',
      $html$<ul><li><strong>Monitoring</strong> shows requests, errors and latency on a dashboard you can narrow by API and stage, searchable request logs with traces, alarms that notify webhooks or Slack, and log exports to HTTPS, S3 or OpenTelemetry. See <a href="/help/pods/monitoring">Monitoring</a>.</li><li><strong>Portals</strong> publish developer portals: products with Markdown docs and endpoint pages, your branding, and optional sign-in. See <a href="/help/pods/portals">Developer portals</a>.</li></ul><p>To document an API, import or export it as OpenAPI, generate a client SDK or serve it to AI agents, see <a href="/help/pods/apis/distribution">Docs, SDKs and OpenAPI</a>.</p>$html$,
      '[]',
      '[]',
      80
    ),
    (
      'roles-and-settings',
      'Settings',
      'Roles and project settings',
      $html$<p>Your role in Pods comes from your role in the organization: Owner, Admin, Manager or Member. Owners and Admins can change everything, Managers build and release APIs, and Members read. The <a href="/help/pods/team#roles">Team and access</a> guide lists what each role can do.</p><p><strong>Settings</strong> holds the project's throttle and log retention, access tokens for scripts, stacks and the audit log of every change. See <a href="/help/pods/settings">Project settings</a>.</p>$html$,
      '[]',
      '[]',
      90
    )
) as v(anchor_id, eyebrow, title, content, cards, features, sort_order)
cross join (select id from public.docs_pages where slug = 'pods' and deleted_at is null) p;

-- @down
-- Restores the Overview as 20261024191500_help_pods_structure left it: a draft with its outline.
update public.docs_pages
set title = 'Geiger Pods',
    nav_label = 'Overview',
    description = 'API gateway.',
    preview = 'pods',
    status = 'draft',
    published_at = null
where slug = 'pods' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'pods' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>What Geiger Pods is for</li><li>Opening it from a project</li><li>Key concepts</li><li>Common workflows</li></ul>',
  10
from public.docs_pages p
where p.slug = 'pods' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
