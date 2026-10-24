-- Help flow security page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the flow/security draft outline with the
-- full Security guide (findings, access policies, recent access, keys) and publishes it.
-- Written from a survey of C:\Pro\geiger-flow (components/internal/screens/projects/security/security_screen.jsx,
-- components/internal/dilouges/security/*, features/security/*, components/internal/shared/pagination.jsx).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Security',
    description = 'Log security findings and work them from Open to Resolved, review access policies and recent access, and record the project''s API keys.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'flow/security' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'flow/security' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, showcase, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.showcase, v.sort_order
from (
  values
    (
      'logging-a-finding',
      'Basics',
      'Logging a finding',
      $html$<p>To log a security finding, choose <strong>Security</strong> in the project sidebar, then <strong>Log finding</strong>. Only the title is required: <strong>Create Finding</strong> stays disabled until there is one.</p><ul><li><strong>Title</strong>: what's wrong, like <code>Outdated dependency with known CVE</code>.</li><li><strong>Severity</strong>: Critical, High, Medium or Low. New findings are Medium.</li><li><strong>Status</strong>: Open, Triaged or Resolved. New findings are Open.</li><li><strong>Detected on</strong>: the date it was found. It starts as today's date.</li><li><strong>Affected</strong>: the component, service or file path it affects.</li></ul><p><strong>New finding</strong>, beside the <strong>Risk Queue</strong> heading, opens the same dialog. A new finding goes to the top of the risk queue.</p>$html$,
      '[]',
      null,
      10
    ),
    (
      'severity-and-status',
      'Concepts',
      'Severity and status',
      $html$<p>Every security finding has a severity and a status.</p><ul><li><strong>Severity</strong> is how serious it is: Critical, High, Medium or Low.</li><li><strong>Status</strong> tracks the work on it: Open, Triaged or Resolved. Every finding that isn't Resolved counts toward <strong>Open vulnerabilities</strong>.</li></ul><p>After you log a finding, only its status can change. To correct its title, severity, date or affected area, delete it and log it again.</p>$html$,
      '[]',
      null,
      20
    ),
    (
      'security-screen',
      'Security',
      'The Security screen',
      $html$<p>The figures across the top of <strong>Security</strong> are <strong>Policies enabled</strong> (how many of the project's policies are on, out of all of them), <strong>Open vulnerabilities</strong> (findings that aren't Resolved), <strong>Denied access</strong> (access events with the result Denied) and <strong>Active keys</strong> (keys that aren't revoked). Search and filters don't change them.</p><p>The tabs under the figures choose what the screen shows:</p><ul><li><strong>Overview</strong>: everything, one part after another.</li><li><strong>Access</strong>: <strong>Access Controls</strong> and <strong>Recent Access</strong>.</li><li><strong>Vulnerabilities</strong>: the <strong>Risk Queue</strong>, with its severity and status filters.</li><li><strong>Keys</strong>: <strong>Keys & Tokens</strong>.</li></ul><p>Each list pages on its own, 10 rows a page unless the project's default is changed under <strong>Settings → General → Default rows per page</strong>. Choose 10, 25, 50 or 100 at the bottom of a list to change it there.</p>$html$,
      '[]',
      null,
      30
    ),
    (
      'risk-queue',
      'Vulnerabilities',
      'The risk queue',
      $html$<p>The <strong>Risk Queue</strong> on the <strong>Security</strong> screen lists the project's findings, newest first. Each row shows the title with the first eight characters of its ID, the affected area, severity, status and the date it was detected.</p><p>On the <strong>Vulnerabilities</strong> tab, filter by severity (<strong>All severities</strong>, <strong>Critical</strong>, <strong>High</strong>, <strong>Medium</strong> or <strong>Low</strong>) and by status (<strong>All statuses</strong>, <strong>Open</strong>, <strong>Triaged</strong> or <strong>Resolved</strong>). <strong>Search security items</strong> matches findings by title, affected area, severity and status. It doesn't filter access events or keys.</p><p>Each row's <strong>⋯</strong> menu moves the finding along: <strong>Mark triaged</strong> on an Open finding, <strong>Mark resolved</strong> on any finding that isn't Resolved, and <strong>Reopen</strong>, which sets a Resolved finding back to Open. <strong>Delete</strong> asks you to confirm first, and a deleted finding can't be restored from Flow.</p>$html$,
      '[]',
      null,
      40
    ),
    (
      'access-policies',
      'Access',
      'Access policies',
      $html$<p><strong>Access Controls</strong>, on the <strong>Access</strong> and <strong>Overview</strong> tabs of <strong>Security</strong>, lists the project's security policies. Each one shows its name, the scope it covers and its mode, <strong>Monitor</strong> or <strong>Enforce</strong>. A project without policies shows <strong>No policies yet</strong>.</p><p>The switch on each policy turns it on or off. The change saves straight away and updates <strong>Policies enabled</strong>. Policies can't be added, edited or deleted from Flow, and turning one on doesn't make Flow block or allow anything: the mode and the switch are a record for your team.</p>$html$,
      '[]',
      null,
      50
    ),
    (
      'recent-access',
      'Access',
      'Recent access',
      $html$<p><strong>Recent Access</strong>, on the <strong>Access</strong> and <strong>Overview</strong> tabs of <strong>Security</strong>, lists the project's access events, newest first: who acted, what they did, its target, when, and the result, <strong>Allowed</strong> or <strong>Denied</strong>.</p><p>Flow records one kind of event here: creating a key on the <strong>Keys</strong> tab. The entry names you by your email as the actor, <code>api_key.create</code> as the action, and the key's name and prefix as the target, with the result Allowed. Access events can't be added, edited or deleted from the screen.</p>$html$,
      '[]',
      null,
      60
    ),
    (
      'keys-and-tokens',
      'Keys',
      'Keys and tokens',
      $html$<p>To record a project key, choose <strong>Create key</strong> at the top of <strong>Security</strong>, or <strong>New key</strong> beside the <strong>Keys & Tokens</strong> heading. Only the name is required: <strong>Create Key</strong> stays disabled until there is one.</p><ul><li><strong>Name</strong>: what the key is for, like <code>CI deploy token</code>.</li><li><strong>Scopes</strong>: choose any of <strong>read</strong>, <strong>write</strong>, <strong>deploy</strong> and <strong>admin</strong>. Choose a scope again to remove it.</li><li><strong>Key prefix</strong>: generated by Flow, <code>gfk_</code> followed by six characters. You can't change it.</li><li><strong>Expires</strong>: an optional expiry date.</li></ul><p>Flow stores the name, prefix, scopes and expiry date. It doesn't generate or store a full secret, and nothing in Flow signs in with the key. Keys are listed newest first with their scopes, expiry date and status, <strong>Active</strong> or <strong>Revoked</strong>. A key stays Active after its expiry date until you revoke it.</p><p>Each row's <strong>⋯</strong> menu has <strong>Revoke key</strong> (or <strong>Restore key</strong> on a revoked key) and <strong>Delete</strong>. Delete asks you to confirm first, and a deleted key can't be restored from Flow.</p>$html$,
      '[]',
      null,
      70
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"Users","label":"Team & resources","href":"/help/flow/team"},{"icon":"Activity","label":"Logs","href":"/help/flow/logs"},{"icon":"Settings","label":"Project settings","href":"/help/flow/settings"}]',
      null,
      80
    )
) as v(anchor_id, eyebrow, title, content, links, showcase, sort_order)
cross join (select id from public.docs_pages where slug = 'flow/security' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Security',
    description = 'Security policies, vulnerabilities and access events for the project.',
    status = 'draft',
    published_at = null
where slug = 'flow/security' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'flow/security' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Policies</li><li>Vulnerabilities</li><li>Access events</li></ul>',
  10
from public.docs_pages p
where p.slug = 'flow/security' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
