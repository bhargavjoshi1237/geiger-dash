-- Help pods structure
--
-- One-time content move, like 20261023200049_help_flow_guide: graduates Pods into its own sidebar group (sort 32). The
-- products/pods draft is re-homed as the Pods Overview (slug pods, with the /pods/playground hero, still a draft;
-- 20261024191550 fills it in), and each area in Pods' workspace sidebar starts as a draft outline at pods/<area>.
-- The API editor's sections get child pages under pods/apis, in the editor's order (Build, Release, Distribute).
-- The page migrations that follow (20261024191505 to 20261024191526) fill each page in.
-- Written from a survey of C:\Pro\geiger-pods (components/internal/sidebar/sidebar_nav.jsx,
-- components/internal/screens/registry.jsx, components/internal/screens/apis/tabs.js and api_detail.jsx,
-- lib/workspace/screens.mjs, geiger-rbac.config.js).
-- Later edits happen in Studio, so this must never re-run.

-- @up
insert into public.docs_nav_groups (title, slug, sort_order)
values ('Pods', 'pods', 32)
on conflict (slug) do update set
  title = excluded.title,
  sort_order = excluded.sort_order;

-- Pods Overview: re-home the products/pods draft, or create it on a database that never had one.
update public.docs_pages
set nav_group_id = (select id from public.docs_nav_groups where slug = 'pods'),
    slug = 'pods',
    title = 'Geiger Pods',
    nav_label = 'Overview',
    preview = 'pods',
    sort_order = 10
where slug = 'products/pods' and deleted_at is null;

insert into public.docs_pages (nav_group_id, slug, title, nav_label, description, preview, status, sort_order)
select g.id, 'pods', 'Geiger Pods', 'Overview', 'API gateway.', 'pods', 'draft', 10
from public.docs_nav_groups g
where g.slug = 'pods'
on conflict (slug) where deleted_at is null do nothing;

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>What Geiger Pods is for</li><li>Opening it from a project</li><li>Key concepts</li><li>Common workflows</li></ul>',
  10
from public.docs_pages p
where p.slug = 'pods' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;

-- Pods' areas, in its sidebar order: Overview, APIs, Usage, Security, Networking, Monitoring, Portals, Settings.
-- Settings splits into two guides: Project settings, and Team & access (Team & Access, Roles & Permissions).
insert into public.docs_pages (nav_group_id, slug, title, nav_label, description, status, sort_order)
select g.id, v.slug, v.title, v.nav_label, v.description, 'draft', v.sort_order
from (
  values
    ('pods/project-overview', 'Project overview', null, 'The project''s home screen in Pods: traffic, errors and latency across its APIs, and what needs attention.', 20),
    ('pods/apis', 'APIs', null, 'Create REST, HTTP and WebSocket APIs, find them in the API list, and work on each one in the API editor.', 30),
    ('pods/usage', 'Usage plans & API keys', null, 'Meter and limit who calls your APIs: create API keys, attach them to usage plans with throttles and quotas, and track usage.', 40),
    ('pods/security', 'Security', null, 'Keep credentials in secrets, filter traffic with the web application firewall, and manage signing credentials.', 50),
    ('pods/networking', 'Networking', null, 'Serve APIs on your own domains, check client certificates with trust stores, and reach private backends through connectors.', 60),
    ('pods/monitoring', 'Monitoring', null, 'Watch traffic, errors and latency across your APIs, search request logs, set alarms and export logs.', 70),
    ('pods/portals', 'Developer portals', null, 'Publish developer portals that present your APIs and their docs to the people who use them.', 80),
    ('pods/settings', 'Project settings', null, 'Edit the project''s Pods settings, issue access tokens, manage stacks and review the audit log.', 90),
    ('pods/team', 'Team & access', null, 'See who can work on the project in Pods, what each role allows, and grant roles to members.', 100)
) as v(slug, title, nav_label, description, sort_order)
cross join (select id from public.docs_nav_groups where slug = 'pods') g
on conflict (slug) where deleted_at is null do nothing;

-- The API editor's sections, as child pages of APIs (one level deep, same group).
insert into public.docs_pages (nav_group_id, parent_id, slug, title, nav_label, description, status, sort_order)
select parent.nav_group_id, parent.id, v.slug, v.title, v.nav_label, v.description, 'draft', v.sort_order
from (
  values
    ('pods/apis/resources-and-routes', 'Resources, routes & methods', 'Resources & routes', 'Model a REST API''s resources and methods, or an HTTP or WebSocket API''s routes.', 10),
    ('pods/apis/integrations', 'Integrations', null, 'Connect an API''s methods and routes to the backends they call.', 20),
    ('pods/apis/authorizers', 'Authorizers & resource policies', 'Authorizers', 'Control who can call an API with authorizers, method authorization and resource policies.', 30),
    ('pods/apis/models-and-responses', 'Models, CORS & gateway responses', 'Models & CORS', 'Describe request and response bodies, set cross-origin rules, and choose what callers see when the gateway rejects a request.', 40),
    ('pods/apis/deployments-and-stages', 'Deployments & stages', null, 'Deploy an API''s draft as a snapshot, serve it from stages, and manage canaries, caching, throttling and logging.', 50),
    ('pods/apis/distribution', 'Docs, SDKs & OpenAPI', null, 'Document an API, import or export it as OpenAPI, generate client SDKs, and expose it as tools for AI agents.', 60)
) as v(slug, title, nav_label, description, sort_order)
cross join (select id, nav_group_id from public.docs_pages where slug = 'pods/apis' and deleted_at is null) parent
on conflict (slug) where deleted_at is null do nothing;

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview', '<p><em>Draft outline. Replace before publishing.</em></p><ul>' || v.outline || '</ul>', 10
from (
  values
    ('pods/project-overview', '<li>Opening the overview</li><li>Traffic and outcome figures</li><li>Top APIs and what needs attention</li>'),
    ('pods/apis', '<li>Creating an API</li><li>REST, HTTP and WebSocket</li><li>The API list</li><li>The API editor</li><li>API settings and deleting</li>'),
    ('pods/apis/resources-and-routes', '<li>Resources and methods (REST)</li><li>Routes (HTTP and WebSocket)</li><li>Method request and response settings</li>'),
    ('pods/apis/integrations', '<li>Creating an integration</li><li>Integration types</li><li>Mapping requests and responses</li><li>Client certificates</li>'),
    ('pods/apis/authorizers', '<li>Creating an authorizer</li><li>Testing an authorizer</li><li>Choosing authorization for a method or route</li><li>Resource policies</li>'),
    ('pods/apis/models-and-responses', '<li>Models</li><li>CORS</li><li>Gateway responses</li>'),
    ('pods/apis/deployments-and-stages', '<li>Deploying an API</li><li>Deployments</li><li>Stages</li><li>Canary releases</li><li>Caching and throttling</li><li>Stage logging</li><li>Testing a method</li>'),
    ('pods/apis/distribution', '<li>Documentation parts and versions</li><li>Importing and exporting OpenAPI</li><li>Generating SDKs</li><li>Agent tools</li>'),
    ('pods/usage', '<li>Creating a usage plan</li><li>Throttling and quotas</li><li>Creating and managing API keys</li><li>Tracking usage</li>'),
    ('pods/security', '<li>Secrets</li><li>Web application firewall</li><li>Signing credentials</li>'),
    ('pods/networking', '<li>Custom domains</li><li>API mappings and routing rules</li><li>Trust stores</li><li>Connectors</li>'),
    ('pods/monitoring', '<li>The monitoring dashboard</li><li>Request logs</li><li>Alarms</li><li>Log exports</li>'),
    ('pods/portals', '<li>Creating a portal</li><li>Products and pages</li><li>Publishing</li>'),
    ('pods/settings', '<li>General settings</li><li>Access tokens</li><li>Stacks</li><li>Audit log</li>'),
    ('pods/team', '<li>Team members</li><li>Roles</li><li>Granting a role</li><li>Custom roles and permissions</li>')
) as v(slug, outline)
join public.docs_pages p on p.slug = v.slug and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;

-- @down
-- Area drafts go with their outline blocks (on delete cascade). Child pages first.
delete from public.docs_pages
where slug in (
  'pods/apis/resources-and-routes', 'pods/apis/integrations', 'pods/apis/authorizers', 'pods/apis/models-and-responses',
  'pods/apis/deployments-and-stages', 'pods/apis/distribution'
);

delete from public.docs_pages
where slug in (
  'pods/project-overview', 'pods/apis', 'pods/usage', 'pods/security', 'pods/networking', 'pods/monitoring',
  'pods/portals', 'pods/settings', 'pods/team'
);

update public.docs_pages
set nav_group_id = (select id from public.docs_nav_groups where slug = 'products'),
    slug = 'products/pods',
    title = 'Geiger Pods',
    nav_label = 'Pods',
    preview = null,
    sort_order = 120
where slug = 'pods' and deleted_at is null;

delete from public.docs_nav_groups where slug = 'pods';
