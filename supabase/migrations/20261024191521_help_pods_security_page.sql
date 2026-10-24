-- Help pods security page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the pods/security draft outline (from
-- 20261024191500_help_pods_structure) with the full Security guide (Secrets, Web Application Firewall, Signing
-- Credentials) and publishes it. No Pods showcases exist, so the page embeds none.
-- Written from a survey of C:\Pro\geiger-pods (components/internal/screens/secrets/secrets_screen.jsx,
-- components/internal/screens/waf/waf_screen.jsx, components/internal/screens/auth/credentials_screen.jsx,
-- lib/control/secrets.mjs, waf.mjs, signing-credentials.mjs, lib/vault/secrets.mjs,
-- lib/gateway/core/edge/waf-engine.mjs, lib/gateway/core/gateway-responses.mjs).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Security',
    description = 'Store backend credentials as secrets, filter traffic with the web application firewall, and issue signing credentials for SigV4-signed calls.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'pods/security' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'pods/security' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.sort_order
from (
  values
    (
      'creating-a-secret',
      'Basics',
      'Creating a secret',
      $html$<p>A <strong>secret</strong> holds a credential your integrations send to their backends, such as a token or a password. Choose <strong>Security → Secrets</strong> in the Pods sidebar, then <strong>New Secret</strong>. Only Owners and Admins can open Secrets; others see "Access unavailable".</p><ol><li>Type a <strong>Name</strong>: up to 128 letters, digits, dots, dashes and underscores.</li><li>Pick a <strong>Kind</strong>. Bearer token is selected to start with.</li><li>Optional: add a <strong>Description</strong>.</li><li>Fill in the value fields for that kind. Fields marked * are required.</li><li>Choose <strong>Create Secret</strong>.</li></ol><p>Pods encrypts the value when you save it. Values are write-only: no one can view them again, in Pods or in logs. An integration uses a secret through its <strong>Backend auth</strong>, as the <a href="/help/pods/apis/integrations">Integrations</a> guide describes.</p>$html$,
      '[]',
      10
    ),
    (
      'secret-kinds',
      'Concepts',
      'Secret kinds',
      $html$<p>A secret's <strong>Kind</strong> decides which values it holds. Pick the kind that matches how the backend expects the credential.</p><ul><li><strong>Generic</strong>: a single <strong>Value</strong>.</li><li><strong>Header</strong>: a <strong>Header name</strong> and a <strong>Header value</strong>.</li><li><strong>Basic auth</strong>: a <strong>Username</strong> and a <strong>Password</strong>.</li><li><strong>Bearer token</strong>: a <strong>Token</strong>.</li><li><strong>AWS credentials</strong>: an <strong>Access key ID</strong> and a <strong>Secret access key</strong>, with an optional session token and region.</li><li><strong>Client certificate</strong>: a <strong>Certificate PEM</strong> and a <strong>Private key PEM</strong>, with an optional passphrase.</li><li><strong>Private key</strong>: a <strong>Private key PEM</strong>, with an optional passphrase.</li><li><strong>OAuth client</strong>: a <strong>Token URL</strong>, a <strong>Client ID</strong> and a <strong>Client secret</strong>, with an optional scope and audience.</li></ul><p>A secret's kind can't change. To store a different kind, create a new secret.</p>$html$,
      '[]',
      20
    ),
    (
      'secret-list',
      'Secrets',
      'The secret list',
      $html$<p>The <strong>Secrets</strong> screen counts your <strong>Secrets</strong>, how many are <strong>In use</strong> by integrations or authorizers, how many are <strong>Unused</strong>, and how many were <strong>Never rotated</strong>.</p><p>Filter by <strong>Kind</strong>, or search by name, description or fingerprint. Each row shows the secret's <strong>Kind</strong>, its <strong>Fingerprint</strong> (a short trace of the value, such as "ending 4f2a", so you can tell values apart without seeing them), its current <strong>Version</strong>, when it was <strong>Last rotated</strong> and how many settings it's <strong>Used by</strong>. The list shows 25 a page.</p><p>Click a secret to open its page. Each row's <strong>⋯</strong> menu has <strong>Rotate</strong>, <strong>Versions</strong> and <strong>Delete</strong>.</p>$html$,
      '[]',
      30
    ),
    (
      'rotating-a-secret',
      'Secrets',
      'Rotating a secret and its versions',
      $html$<p>Rotating stores a new value as the secret's next version. Choose <strong>Rotate</strong> in the secret's <strong>⋯</strong> menu, or at the top of its page, fill in the value fields and choose <strong>Save New Version</strong>. Integrations use the new version from then on. The previous version stays valid until you disable it.</p><p>A secret's page shows its <strong>Kind</strong>, <strong>Fingerprint</strong>, <strong>Current version</strong>, when it was <strong>Last rotated</strong>, when it <strong>Expires</strong> and what it's <strong>Used by</strong>. Under <strong>Versions</strong>, each version is Current, Enabled or Disabled.</p><p>To stop an older version working, choose <strong>Disable</strong> in its <strong>⋯</strong> menu and confirm. Anything still using that version stops working, and it can't be undone. The current version can't be disabled: rotate first.</p>$html$,
      '[]',
      40
    ),
    (
      'deleting-a-secret',
      'Secrets',
      'Deleting a secret',
      $html$<p>Deleting a secret destroys every version of it. Choose <strong>Delete</strong> in its <strong>⋯</strong> menu, or under <strong>Danger zone</strong> on its page, and confirm. It can't be undone.</p><p>Pods won't delete a secret that integrations or authorizers still use. The message says how many settings refer to it: change them to another secret first.</p>$html$,
      '[]',
      50
    ),
    (
      'creating-a-web-acl',
      'Firewall',
      'Creating a web ACL',
      $html$<p>The web application firewall filters requests to REST API stages. Its rules live in a <strong>web ACL</strong>, which you attach to one or more stages. Choose <strong>Security → Web Application Firewall</strong> in the sidebar. The screen has three tabs: <strong>Web ACLs</strong>, <strong>IP Sets</strong> and <strong>Regex Sets</strong>. Only Owners and Admins can make changes.</p><ol><li>On the <strong>Web ACLs</strong> tab, choose <strong>New Web ACL</strong>.</li><li>Type a <strong>Name</strong> and choose <strong>Create Web ACL</strong>.</li></ol><p>The new web ACL opens with no rules and a default action of Allow, which applies when no rule decides. Its sections are <strong>Rules</strong>, <strong>Managed Rule Sets</strong>, <strong>Associations</strong> and <strong>Sampled Requests</strong>. The list shows each web ACL's default action, number of rules and last update, and can be filtered by <strong>Default action</strong>.</p>$html$,
      '[]',
      60
    ),
    (
      'firewall-rules',
      'Firewall',
      'Writing firewall rules',
      $html$<p>A web ACL's <strong>Rules</strong> section lists its rules in a table and holds them as JSON in <strong>Rules JSON</strong>. Edit the JSON, then choose <strong>Save Changes</strong> at the top; "Unsaved changes" shows until you do. Each rule has:</p><ul><li><code>name</code>: 1 to 128 characters.</li><li><code>priority</code>: a whole number, unique within the web ACL. Lower numbers run first.</li><li><code>action</code>: <code>ALLOW</code>, <code>BLOCK</code> or <code>COUNT</code>.</li><li><code>statement</code>: what the rule matches, by <code>type</code>, such as <code>IPSetReferenceStatement</code>, <code>RegexPatternSetReferenceStatement</code>, <code>GeoMatchStatement</code>, <code>ByteMatchStatement</code>, <code>SizeConstraintStatement</code>, <code>SqliMatchStatement</code>, <code>XssMatchStatement</code>, <code>RateBasedStatement</code>, or <code>AndStatement</code>, <code>OrStatement</code> and <code>NotStatement</code> to combine others.</li></ul><p>For example, <code>{"name": "block-bad-ips", "priority": 10, "action": "BLOCK", "statement": {"type": "IPSetReferenceStatement", "ipSetId": "…"}}</code> blocks the addresses in an IP set.</p><p>Pods checks rules in priority order: the first rule that allows or blocks a request decides it, and <code>COUNT</code> only records a match. When no rule decides, the default action applies. A blocked caller gets 403 Forbidden.</p>$html$,
      '[]',
      70
    ),
    (
      'managed-rule-sets',
      'Firewall',
      'Managed rule sets',
      $html$<p>Managed rule sets are groups of rules Pods maintains. Open a web ACL and choose <strong>Managed Rule Sets</strong>, then <strong>Add</strong> beside a set:</p><ul><li><strong>PodsCommonRuleSet</strong>: size limits, path traversal, file inclusion, bad user agents and metadata-SSRF strings.</li><li><strong>PodsSQLiRuleSet</strong>: SQL injection in the path, query string and body.</li><li><strong>PodsKnownBadInputsRuleSet</strong>: Log4j JNDI, Java deserialization, localhost host headers and XSS.</li><li><strong>PodsAdminProtectionRuleSet</strong>: blocks outside access to <code>/admin</code> paths.</li></ul><p>Adding a set appends a BLOCK rule after your last priority, and the set shows as Added. Choose <strong>Save Changes</strong> to apply it.</p>$html$,
      '[]',
      80
    ),
    (
      'ip-and-regex-sets',
      'Firewall',
      'IP sets and regex sets',
      $html$<p>IP sets and regex sets are lists that rules match against, so one list can serve many rules. On the Web Application Firewall screen, open the <strong>IP Sets</strong> or <strong>Regex Sets</strong> tab and choose <strong>New IP Set</strong> or <strong>New Regex Set</strong>.</p><ul><li><strong>IP set</strong>: a <strong>Name</strong> and IPv4 <strong>CIDRs</strong> such as <code>203.0.113.0/24</code>, one per line or comma separated, up to 10,000.</li><li><strong>Regex set</strong>: a <strong>Name</strong> and <strong>Patterns</strong> such as <code>^/admin</code>, one per line or comma separated. Patterns must be safe to run in linear time.</li></ul><p>Choose <strong>Create IP Set</strong> or <strong>Create Regex Set</strong>. To use a set in a rule, choose <strong>Copy ID</strong> in its <strong>⋯</strong> menu and put the ID in the rule's statement, as <code>ipSetId</code> or <code>regexSetId</code>.</p>$html$,
      '[]',
      90
    ),
    (
      'firewall-associations',
      'Firewall',
      'Protecting a stage and sampled requests',
      $html$<p>A web ACL filters traffic only on the stages it's associated with. Open the web ACL and choose <strong>Associations</strong>. Under <strong>Associate a stage</strong>, type the <strong>API ID</strong> and the <strong>Stage</strong> name, then choose <strong>Associate</strong>. A stage can have only one web ACL. <strong>Associated stages</strong> lists each one with when it was added.</p><p><strong>Sampled Requests</strong> shows requests the web ACL blocked or counted in the last 3 hours, up to 100 per rule per stage: the time, the action, the method and path, the source IP, the rule and the stage. Filter them by <strong>Stage</strong> and <strong>Rule</strong>.</p>$html$,
      '[]',
      100
    ),
    (
      'creating-a-signing-credential',
      'Signing credentials',
      'Creating a signing credential',
      $html$<p>A <strong>signing credential</strong> is an access key pair that callers use to sign requests with AWS Signature Version 4 (SigV4). Methods and routes whose authorization is <strong>Signed requests (SigV4)</strong> accept only requests signed this way. Choose <strong>Security → Signing Credentials</strong> in the sidebar, then <strong>New Credential</strong>. Only Owners and Admins can manage credentials.</p><ol><li>Type a <strong>Name</strong>.</li><li>Optional: pick an <strong>Expires at</strong> date.</li><li>Choose <strong>Create Credential</strong>.</li></ol><p>Pods shows the <strong>Access key ID</strong> (it starts with <code>PKIA</code>) and the <strong>Secret access key</strong>. The secret is shown once, so copy it before you choose <strong>Done</strong>. The dialog also has example signing code for <strong>@smithy/signature-v4</strong> and <strong>Python botocore</strong>. Sign with the service <code>execute-api</code> and the region <code>auto</code>.</p>$html$,
      '[]',
      110
    ),
    (
      'credential-policies',
      'Signing credentials',
      'Credential policies',
      $html$<p>A new signing credential can't call anything until a policy allows it. Open the credential and choose <strong>Policies</strong>.</p><ol><li>Under <strong>Attach policy</strong>, type a <strong>Name</strong>.</li><li>In <strong>Policy document (JSON)</strong>, write an identity policy with <code>Version</code> and <code>Statement</code>, such as one that allows <code>execute-api:Invoke</code> on your API's methods.</li><li>Choose <strong>Attach Policy</strong>.</li></ol><p>A credential holds up to 10 policies. An explicit Deny beats any Allow, and anything not allowed is denied. To remove a policy, choose <strong>Detach</strong> in its <strong>⋯</strong> menu and confirm.</p><p>The credential's <strong>Overview</strong> shows its <strong>Principal</strong>, the ARN a REST API's resource policy uses to allow it.</p>$html$,
      '[]',
      120
    ),
    (
      'managing-signing-credentials',
      'Signing credentials',
      'Deactivating and deleting credentials',
      $html$<p>The <strong>Signing Credentials</strong> list shows each credential's status, Active or Inactive, when it was <strong>Last used</strong> and when it <strong>Expires</strong>. Filter by <strong>Status</strong>, or search by name or access key ID.</p><p>Each row's <strong>⋯</strong> menu has <strong>Open</strong>, <strong>Copy access key ID</strong>, <strong>Deactivate</strong> or <strong>Activate</strong>, and <strong>Delete</strong>. An inactive credential stays in the list, and you can activate it again; the switch at the top of a credential's page does the same.</p><p>Deleting asks you to confirm. Requests signed with the credential are rejected straight away, and it can't be undone.</p>$html$,
      '[]',
      130
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"Plug","label":"Integrations","href":"/help/pods/apis/integrations"},{"icon":"ShieldCheck","label":"Authorizers & resource policies","href":"/help/pods/apis/authorizers"},{"icon":"Rocket","label":"Deployments & stages","href":"/help/pods/apis/deployments-and-stages"}]',
      140
    )
) as v(anchor_id, eyebrow, title, content, links, sort_order)
cross join (select id from public.docs_pages where slug = 'pods/security' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Security',
    description = 'Keep credentials in secrets, filter traffic with the web application firewall, and manage signing credentials.',
    status = 'draft',
    published_at = null
where slug = 'pods/security' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'pods/security' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Secrets</li><li>Web application firewall</li><li>Signing credentials</li></ul>',
  10
from public.docs_pages p
where p.slug = 'pods/security' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
