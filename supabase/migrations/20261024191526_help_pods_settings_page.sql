-- Help pods settings page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the pods/settings draft outline (from
-- 20261024191500_help_pods_structure) with the full Project settings guide (General, Access Tokens, Stacks, Audit Log)
-- and publishes it. Left out on purpose: the Routing section's Default region (nothing reads it) and the CLI sign-in
-- command the token dialog shows (the CLI isn't distributed). No Pods showcases exist, so the page embeds none.
-- Written from a survey of C:\Pro\geiger-pods (components/internal/screens/settings/project_settings.jsx,
-- components/internal/screens/project_details.jsx, components/internal/shared/settings_screen.jsx,
-- components/internal/screens/admin/tokens_screen.jsx, stacks_panel.jsx, components/internal/screens/audit/audit_screen.jsx,
-- lib/control/settings.mjs, access-tokens.mjs, actor.mjs, stacks.mjs, audit.mjs).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Project settings',
    description = 'Set the project''s throttle and log retention, create access tokens, apply stack files, and review every change in the audit log.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'pods/settings' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'pods/settings' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.sort_order
from (
  values
    (
      'general-settings',
      'General',
      'General settings',
      $html$<p>Choose <strong>Settings → General</strong> in the Pods sidebar for the project's settings. Its sections are <strong>Project</strong>, <strong>Throttling</strong>, <strong>Logs & Retention</strong> and <strong>Routing</strong>. Change what you need, then choose <strong>Save Changes</strong> at the top. Only Owners and Admins can save; others see the settings read-only.</p><p><strong>Project</strong> shows the Geiger project behind Pods: its name, slug, <strong>Project ID</strong>, <strong>Organization ID</strong>, status and your <strong>Inherited role</strong>. The project and its members are managed in Dash: <strong>Manage in Geiger</strong> opens your organization there.</p>$html$,
      '[]',
      10
    ),
    (
      'throttling-and-retention',
      'General',
      'Project throttle and log retention',
      $html$<p>Two sections of <strong>Settings → General</strong> set limits for the whole project.</p><ul><li><strong>Throttling → Account throttle</strong>: <strong>Throttle rate</strong> (requests per second across the project) and <strong>Throttle burst</strong> (requests allowed over the rate in a short spike), 10,000 and 5,000 to start with. Every stage and usage plan limit sits under them.</li><li><strong>Throttling → Limit store outage</strong>: what the gateway does if it can't reach the store that counts requests. <strong>Fail open (allow traffic)</strong>, the default, keeps traffic flowing unthrottled; <strong>Fail closed (reject traffic)</strong> rejects requests until the store is back.</li><li><strong>Logs & Retention</strong>: <strong>Log retention (days)</strong>, how long access and execution logs are kept, from 1 to 3650 (30 to start with), and <strong>Full-payload trace retention (days)</strong>, how long request and response bodies are kept, from 1 to 30 (3 to start with).</li></ul>$html$,
      '[]',
      20
    ),
    (
      'access-tokens',
      'Access tokens',
      'Access tokens',
      $html$<p>Access tokens let scripts and tools act on the project through Pods' API, with <code>Authorization: Bearer</code> and the token. Choose <strong>Settings → Access Tokens</strong>, then <strong>New Token</strong>. Only Owners and Admins can manage tokens.</p><ul><li><strong>Name</strong>: up to 128 characters.</li><li><strong>Kind</strong>: <strong>Personal</strong> tokens act as you, with your current permissions or a subset of them, and need an <strong>Expires on</strong> date within a year. <strong>Service</strong> tokens carry exactly the scopes you pick, never more than you hold yourself.</li><li><strong>Scopes</strong>: permissions grouped as APIs, Build, Release, Consumers, Security and Operations. Leave them empty on a personal token to use all your permissions.</li></ul><p>Choose <strong>Create Token</strong>. The token's value is shown once, so copy it before you close the dialog. The list shows each token's kind, scopes, status (Active, Expired or Revoked), when it was last used and when it expires. To stop a token working, choose <strong>Revoke</strong> in its <strong>⋯</strong> menu and confirm. Anything still using it stops working at once, and it can't be undone.</p>$html$,
      '[]',
      30
    ),
    (
      'stacks',
      'Stacks',
      'Stacks',
      $html$<p>A <strong>stack</strong> describes some of the project's APIs as a JSON file, so the same configuration can be checked and applied in one step. Choose <strong>Settings → Stacks</strong>.</p><ol><li>Type the <strong>Stack name</strong>. It must match the <code>stack</code> named inside the file.</li><li>Paste the file into <strong>Definition</strong>, starting from <code>{"version":1,"stack":"payments","apis":[]}</code>. Secret values aren't accepted in it.</li><li>Choose <strong>Plan</strong> to preview the changes: each resource with its kind and whether it would be created, updated or deleted, in the order apply runs them.</li><li>Choose <strong>Apply</strong> to make the changes.</li></ol><p><strong>Check Drift</strong> compares live resources with the file and shows In sync or Drift detected, with when it was last applied. Deletes are skipped when you apply from this screen. Planning and applying need the Create APIs permission, which Owners and Admins have.</p>$html$,
      '[]',
      40
    ),
    (
      'audit-log',
      'Audit log',
      'The audit log',
      $html$<p>The audit log records every management change in the project, newest first, with sensitive values redacted. Choose <strong>Settings → Audit Log</strong>. Everyone on the project can read it.</p><p>Each entry shows the event, the resource type, who made it, the API it touched and when. Narrow the list with <strong>Time range</strong> (All Time, Last 24 Hours, Last 7 Days, Last 30 Days or Custom Range) and <strong>Resource type</strong>, or search by action, resource or actor. <strong>Filters</strong> adds exact-match filters on <strong>Actor ID</strong>, <strong>Action</strong> (such as <code>deployment.create</code>), <strong>Resource type</strong>, <strong>Resource ID</strong>, <strong>API ID</strong> and a date range.</p><p>Click an entry, or choose <strong>View details</strong> in its <strong>⋯</strong> menu, to see its details and the values <strong>Before</strong> and <strong>After</strong> the change. The list loads 100 entries at a time; choose <strong>Load Older Entries</strong> for more. <strong>Export CSV</strong> downloads the entries, with the same filters.</p>$html$,
      '[]',
      50
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"Users","label":"Team & access","href":"/help/pods/team"},{"icon":"Ticket","label":"Usage plans & API keys","href":"/help/pods/usage"},{"icon":"Activity","label":"Monitoring","href":"/help/pods/monitoring"}]',
      60
    )
) as v(anchor_id, eyebrow, title, content, links, sort_order)
cross join (select id from public.docs_pages where slug = 'pods/settings' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Project settings',
    description = 'Edit the project''s Pods settings, issue access tokens, manage stacks and review the audit log.',
    status = 'draft',
    published_at = null
where slug = 'pods/settings' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'pods/settings' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>General settings</li><li>Access tokens</li><li>Stacks</li><li>Audit log</li></ul>',
  10
from public.docs_pages p
where p.slug = 'pods/settings' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
