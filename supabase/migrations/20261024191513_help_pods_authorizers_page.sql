-- Help pods authorizers page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the pods/apis/authorizers draft outline
-- (from 20261024191500_help_pods_structure) with the full Authorizers & resource policies guide and publishes it.
-- No Pods showcases exist, so the page embeds none.
-- Written from a survey of C:\Pro\geiger-pods (components/internal/screens/auth/authorizers_tab.jsx, auth_picker.jsx,
-- resource_policy_editor.jsx, components/internal/screens/apis/settings_tab.jsx, lib/workspace/auth-ui.mjs,
-- lib/control/authorizers.mjs, resource-policies.mjs, lib/gateway/core/auth/jwt.mjs and custom.mjs,
-- lib/gateway/capabilities.mjs).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Authorizers & resource policies',
    description = 'Decide who can call an API: JWT and custom authorizers, authorization on each method or route, API key requirements and REST resource policies.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'pods/apis/authorizers' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'pods/apis/authorizers' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.sort_order
from (
  values
    (
      'creating-an-authorizer',
      'Basics',
      'Creating an authorizer',
      $html$<p>An <strong>authorizer</strong> checks each caller before a method or route runs. To create one, open the API from <strong>APIs</strong>, choose <strong>Authorizers</strong> in the API editor's section list, then <strong>New Authorizer</strong>. Owners, Admins and Managers can manage authorizers.</p><ol><li>Type a <strong>Name</strong> and pick a <strong>Type</strong>. The type can't be changed later.</li><li>Under <strong>Identity sources</strong>, keep the suggested source or type another and choose <strong>Add</strong>. At least one is required.</li><li>For JWT, fill in <strong>Issuer</strong>. For a custom authorizer, pick the <strong>Function</strong> and its address.</li><li>Optional: set <strong>Result cache TTL (seconds)</strong> and <strong>Timeout (ms)</strong>.</li><li>Choose <strong>Create Authorizer</strong>.</li></ol><p>An authorizer does nothing until a method or route uses it: pick it in the method's or route's authorization settings.</p>$html$,
      '[]',
      10
    ),
    (
      'authorizer-types',
      'Concepts',
      'Authorizer types',
      $html$<p>Pods offers three types of authorizer. Which ones an API can use depends on its protocol.</p><ul><li><strong>JWT (OIDC issuer)</strong>: verifies a signed token from your identity provider. REST and HTTP APIs.</li><li><strong>Custom token</strong>: sends one token from the request to your own function, which decides. REST, HTTP and WebSocket APIs.</li><li><strong>Custom request</strong>: sends the request's identity sources, such as headers, query strings and stage variables, to your function. REST, HTTP and WebSocket APIs.</li></ul><p>On a WebSocket API, an authorizer checks the <code>$connect</code> route, when a client opens its connection.</p><p>The list under <strong>Configured authorizers</strong> shows each one's type, issuer or function address, identity sources, cache TTL and timeout.</p>$html$,
      '[]',
      20
    ),
    (
      'jwt-authorizers',
      'Authorizers',
      'JWT authorizers',
      $html$<p>A JWT authorizer verifies tokens issued by an OpenID Connect provider. In the authorizer dialog:</p><ul><li><strong>Issuer</strong>: required, such as <code>https://issuer.example.com</code>. Pods finds the provider's signing keys from its <code>/.well-known/openid-configuration</code> document.</li><li><strong>Audiences</strong>: optional, comma or space separated, up to 50.</li><li><strong>Identity sources</strong>: where the token comes from, by default the <code>Authorization</code> header. A leading <code>Bearer</code> is removed.</li></ul><p>A token passes when its signature checks out, its <code>iss</code> matches the issuer exactly, it carries an <code>exp</code> that hasn't passed, and its <code>aud</code> or <code>client_id</code> contains one of the audiences, if you set any. Tokens signed with <code>none</code> or an <code>HS</code> algorithm are always rejected.</p><p>A missing or invalid token gets 401. When the method or route lists scopes, a valid token without any of them gets 403.</p><p>To check a token, choose <strong>Debug token</strong> in the authorizer's <strong>⋯</strong> menu, paste it and choose <strong>Decode</strong>. The token is decoded in your browser only, and each check (algorithm, issuer, audience and expiry) shows pass or fail.</p>$html$,
      '[]',
      30
    ),
    (
      'custom-authorizers',
      'Authorizers',
      'Custom authorizers',
      $html$<p>A custom authorizer calls your own function to decide. In the authorizer dialog, leave <strong>Function</strong> on <strong>Webhook (any HTTPS endpoint)</strong> and type its <strong>Webhook URL</strong>. Pods sends each check to that address as a POST with a JSON body, and a 401 from it rejects the caller with 401.</p><ul><li><strong>Custom token</strong>: one identity source. On a REST API it must be a single header, such as <code>method.request.header.Authorization</code>. Optional: an <strong>Identity validation regex</strong>; a token that doesn't match is rejected with 401 before your function runs.</li><li><strong>Custom request</strong>: one or more identity sources, such as <code>method.request.header.Authorization</code> and <code>context.identity.sourceIp</code>, or <code>$request.querystring.version</code> on HTTP and WebSocket APIs.</li><li>On HTTP APIs, choose the <strong>Payload format version</strong> your function receives, 1.0 or 2.0 (the default), and turn on <strong>Simple responses</strong> to have it return <code>{ isAuthorized: true | false }</code> instead of a policy.</li></ul><p>Otherwise your function returns a policy: a <code>principalId</code>, a <code>policyDocument</code> that allows or denies the call, and an optional <code>context</code>. When an identity source is missing, the caller gets 401 and your function isn't called. A denial gets 403, and a timeout or malformed answer gets 500.</p>$html$,
      '[]',
      40
    ),
    (
      'caching-and-timeouts',
      'Authorizers',
      'Caching and timeouts',
      $html$<p>Every authorizer has two limits, set in its dialog.</p><ul><li><strong>Result cache TTL (seconds)</strong>: from 0 to 3600. Pods remembers each result for that long, keyed by the identity values, so repeat calls skip the check. 0 turns caching off. JWT authorizers and custom authorizers on HTTP APIs start at 0; other custom authorizers start at 300.</li><li><strong>Timeout (ms)</strong>: from 1000 to 29000, 10000 by default. A function that takes longer fails the call with 500.</li></ul><p>A cached policy is still checked against each method, so a policy cached from <code>GET /pets</code> can deny <code>POST /pets</code>. Denials and 401s are cached too; errors aren't.</p>$html$,
      '[]',
      50
    ),
    (
      'testing-an-authorizer',
      'Authorizers',
      'Testing an authorizer',
      $html$<p>To test a custom authorizer on a REST API, choose <strong>Test</strong> in its <strong>⋯</strong> menu in the API editor's Authorizers section.</p><ol><li>Fill in <strong>Headers (JSON)</strong>, and optionally <strong>Query string (JSON)</strong> and <strong>Stage variables (JSON)</strong>. Each must be a JSON object.</li><li>Optional: type a <strong>Method ARN</strong> to test against, such as one ending in <code>/prod/GET/pets</code>.</li><li>Choose <strong>Run Test</strong>.</li></ol><p><strong>Result</strong> shows whether the call was allowed, the principal, how long it took, and the policy and context your function returned. <strong>Log</strong> traces the call, with secret values masked. Tests skip the result cache and never touch live traffic. Owners, Admins and Managers can run them.</p>$html$,
      '[]',
      60
    ),
    (
      'editing-and-deleting',
      'Authorizers',
      'Editing and deleting authorizers',
      $html$<p>Click an authorizer, or choose <strong>Edit</strong> in its <strong>⋯</strong> menu, to change it, then choose <strong>Save Changes</strong>. Everything except the type can change.</p><p>To delete one, choose <strong>Delete</strong> in its <strong>⋯</strong> menu. Pods asks you to confirm. Methods and routes that used it lose their authorization check, and it can't be undone. Like other changes to the API, edits and deletions reach callers when you next deploy.</p>$html$,
      '[]',
      70
    ),
    (
      'method-and-route-authorization',
      'Authorization',
      'Authorization on a method or route',
      $html$<p>Each REST method has an <strong>Authorization</strong> card in its details under <strong>Resources</strong>. For an HTTP or WebSocket route, choose <strong>Authorization</strong> in the route's <strong>⋯</strong> menu under <strong>Routes</strong>.</p><ul><li><strong>Authorization type</strong>: None (open), the default; Signed requests (SigV4), where callers sign each request with one of the project's signing credentials; JWT, not on WebSocket APIs; or Custom authorizer.</li><li><strong>Authorizer</strong>: for JWT and Custom authorizer, pick one of the API's authorizers. Pods won't save the type without one.</li><li><strong>Scopes</strong>: for JWT, space separated, such as <code>read:pets write:pets</code>. The token must carry at least one.</li><li><strong>API key required</strong>: on REST methods and WebSocket routes. Callers must also send a valid API key.</li></ul><p>Choose <strong>Save Authorization</strong>. Owners, Admins and Managers can change it; others see it read-only. Signing credentials are covered in <a href="/help/pods/security">Security</a>, and API keys in <a href="/help/pods/usage">Usage plans and API keys</a>.</p>$html$,
      '[]',
      80
    ),
    (
      'resource-policies',
      'Resource policies',
      'Resource policies',
      $html$<p>A <strong>resource policy</strong> filters calls to a REST API by IP address, connector or signing principal, before any authorizer runs. An explicit Deny always wins. It's in the <strong>Resource policy</strong> card of the API editor's <strong>Settings</strong> section, and only Owners and Admins can edit it.</p><ol><li>Optional: under <strong>Start from a template</strong>, choose <strong>IP allow-list</strong>, <strong>Deny IP range</strong>, <strong>Connector-only private API</strong> or <strong>Cross-project principal allow</strong>. The template replaces the editor's text.</li><li>Edit the JSON in <strong>Policy document</strong>, up to 8192 characters, with <code>Version</code> and <code>Statement</code>.</li><li>Choose <strong>Save Policy</strong>.</li></ol><p>A saved policy takes effect on the API's next deployment. <strong>Clear</strong> removes the policy after you confirm, and from the next deployment callers are no longer filtered.</p>$html$,
      '[]',
      90
    ),
    (
      'policy-simulator',
      'Resource policies',
      'Simulating a resource policy',
      $html$<p>The <strong>Policy simulator</strong>, under the resource policy in a REST API's Settings section, checks the saved policy against a sample call. It doesn't need a deployment.</p><ol><li>In <strong>Method ARN</strong>, type the call to check, in the form <code>arn:pods:execute-api:auto:{project ID}:{API ID}/{stage}/{method}/{path}</code>.</li><li>Type a <strong>Source IP</strong>, and optionally a <strong>Principal ARN</strong>.</li><li>Choose <strong>Simulate</strong>.</li></ol><p>The result shows Allow or Deny, and which statements matched.</p>$html$,
      '[]',
      100
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"FolderTree","label":"Resources, routes & methods","href":"/help/pods/apis/resources-and-routes"},{"icon":"Ticket","label":"Usage plans & API keys","href":"/help/pods/usage"},{"icon":"KeySquare","label":"Security","href":"/help/pods/security"},{"icon":"Network","label":"APIs","href":"/help/pods/apis"},{"icon":"Rocket","label":"Deployments & stages","href":"/help/pods/apis/deployments-and-stages"},{"icon":"Braces","label":"Models, CORS & gateway responses","href":"/help/pods/apis/models-and-responses"}]',
      110
    )
) as v(anchor_id, eyebrow, title, content, links, sort_order)
cross join (select id from public.docs_pages where slug = 'pods/apis/authorizers' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Authorizers & resource policies',
    description = 'Control who can call an API with authorizers, method authorization and resource policies.',
    status = 'draft',
    published_at = null
where slug = 'pods/apis/authorizers' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'pods/apis/authorizers' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Creating an authorizer</li><li>Testing an authorizer</li><li>Choosing authorization for a method or route</li><li>Resource policies</li></ul>',
  10
from public.docs_pages p
where p.slug = 'pods/apis/authorizers' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
