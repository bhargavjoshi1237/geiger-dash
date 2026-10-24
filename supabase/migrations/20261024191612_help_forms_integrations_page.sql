-- Help forms integrations page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the forms/integrations draft outline (from
-- 20261024191600_help_forms_structure) with the full Integrations & API guide and publishes it.
-- Written from a survey of C:\Pro\geiger-forms (components/internal/screens/forms/forms/sections/integrations.jsx,
-- form_detail.jsx (validate), constants.js (WEBHOOK_EVENTS, DELIVERY_STATE_MAP), components/internal/screens/forms/developer/*
-- (developer_screen, api_keys_tab, deliveries_tab, reference_tabs, code_block), settings/settings_screen.jsx (ApiKeysCard),
-- lib/server/webhooks.js, lib/server/side-effects.js (sendSlack, syncAssets, dispatchEvent calls), lib/server/api-keys.js,
-- lib/server/crypto.js (maskEncrypted), lib/server/http.js (isSafeOutboundUrl), lib/supabase/api_keys.js,
-- app/api/v1/forms/*, app/api/forms/[id]/deliveries/*, app/api/forms/[id]/test-webhook/route.js,
-- app/api/responses/[id]/approve/route.js, app/api/stripe/webhook/route.js, public/embed.js, vercel.json).
-- Left out on purpose: the Geiger Flow card (escalation can't create a Flow issue today: Forms writes it under
-- projects.flow_project_id, which flow.issues' project foreign key rejects). The developer hub's claim that team status,
-- tag and assignee changes send response.updated isn't documented, because nothing sends it for those changes.
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Integrations & API',
    description = 'Send responses to other tools with signed webhooks, Slack and Geiger Assets, and work with forms from code through API keys and the REST API.',
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'forms/integrations' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'forms/integrations' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.sort_order
from (
  values
    (
      'connecting-other-tools',
      'Basics',
      'Connecting a form to other tools',
      $html$<p>Each form connects to other tools from its settings: open the form's settings and go to <strong>Settings → Integrations</strong>. There you can add webhooks, post new responses to Slack and copy uploads into Geiger Assets. Choose <strong>Save changes</strong> when you're done.</p><p>Forms has no built-in Zapier, Make or Google Sheets connectors. Connect them with a webhook instead: in Zapier or Make, add a "Catch hook" trigger and add its address as a webhook. You can also pull responses on a schedule from the REST API, whose address for this form's responses is shown at the bottom of Integrations.</p><p>For the whole project, <strong>Integrations → Webhooks</strong> and <strong>Integrations → REST / API</strong> in the Forms sidebar open the developer screens, covered at the end of this guide.</p>$html$,
      '[]',
      10
    ),
    (
      'adding-a-webhook',
      'Integrations',
      'Adding a webhook',
      $html$<p>A webhook sends each response to an address you choose, as soon as it happens. To add one, open the form's settings, go to <strong>Settings → Integrations</strong> and choose <strong>Add webhook</strong>.</p><ul><li><strong>Endpoint URL</strong>: the address that receives the data, starting with <code>https://</code> or <code>http://</code>. Forms won't save a webhook without a valid one, and it never sends to private or local network addresses.</li><li><strong>Signing secret</strong>: a secret is generated for you, starting <code>whsec_</code>. <strong>Generate</strong> makes a new one. Use it to check that deliveries come from Forms.</li><li><strong>Events</strong>: <strong>Response created</strong> (selected to start with), <strong>Response updated</strong> and <strong>Response approved</strong>.</li><li>The switch at the top pauses the webhook (<strong>Paused</strong>) or turns it back on (<strong>Active</strong>).</li></ul><p><strong>Send test</strong> sends a test delivery straight away and tells you the HTTP status your endpoint returned. The trash icon removes the webhook. Add as many webhooks as you need, then choose <strong>Save changes</strong>.</p>$html$,
      '[]',
      20
    ),
    (
      'webhook-events-and-payloads',
      'Concepts',
      'Webhook events and payloads',
      $html$<p>Forms sends three events:</p><ul><li><code>response.created</code>: a new response, after it's been checked and scored and its automations have run.</li><li><code>response.updated</code>: a respondent edits their response, a payment is confirmed or the approval chain rejects the response.</li><li><code>response.approved</code>: the last approval step approves the response.</li></ul><p>Each delivery is a <code>POST</code> with a JSON body: <code>event</code>, <code>createdAt</code> and <code>data</code>. <code>data.form</code> holds the form's ID, slug and title. <code>data.response</code> holds the response's ID, status, priority, score, outcome, tags, respondent name and email, approval and payment, when it was submitted and edited, and <code>answers</code>, keyed by field ID. Answers to sensitive fields are sent as <code>[protected]</code>.</p><p>A field's ID is shown at the bottom of its <strong>Advanced</strong> tab in the builder.</p>$html$,
      '[]',
      30
    ),
    (
      'verifying-deliveries',
      'Integrations',
      'Verifying webhook deliveries',
      $html$<p>Every delivery carries three headers:</p><ul><li><code>X-Geiger-Event</code>: the event name, such as <code>response.created</code>.</li><li><code>X-Geiger-Delivery</code>: the delivery's ID. It stays the same on every retry and replay, so store it and skip IDs you've already handled.</li><li><code>X-Geiger-Signature</code>: <code>sha256=</code> followed by the hex HMAC-SHA256 of the raw request body, made with the webhook's signing secret.</li></ul><p>To check a delivery, compute the same HMAC over the raw body with your secret and compare it with the header. Each attempt is signed again with a fresh <code>createdAt</code>, so you can also reject old timestamps. Your endpoint should answer with a 2xx status within 8 seconds.</p><p><strong>Developer → Hooks & Events</strong> shows an example payload and a Node.js example of the check.</p>$html$,
      '[]',
      40
    ),
    (
      'retries-and-the-delivery-log',
      'Integrations',
      'Retries and the delivery log',
      $html$<p>When a delivery times out, can't connect or gets a 408, 425, 429 or 5xx status, Forms tries again twice within seconds, then backs off from 5 minutes up to a day between tries, for up to 8 attempts. A <code>Retry-After</code> header is honored. Any other status fails at once. Delayed retries run the next time Forms sweeps for them, within minutes while deliveries are flowing and at least once a day, or as soon as the endpoint accepts a new delivery.</p><p>When a delivery fails for good, the form's creator gets a notification in the bell and an email headed "Webhook failing", at most once a day per endpoint.</p><p>The form's <strong>Integrations</strong> settings list its 20 most recent deliveries. The <strong>Deliveries</strong> tab of the developer screens lists every delivery for the form you pick, with when it was sent, its event, endpoint, status (<strong>Delivered</strong>, <strong>Retrying</strong> or <strong>Failed</strong>, with the HTTP code), each attempt and any error. Search it, or choose <strong>Refresh</strong>.</p><p><strong>Replay</strong> sends a delivery's original data again with a fresh signature, for up to 30 days. Test deliveries, and deliveries for a webhook that's been removed or paused, can't be replayed. Seeing deliveries needs a role that can edit forms, and replaying also needs access to responses.</p>$html$,
      '[]',
      50
    ),
    (
      'slack-and-assets',
      'Integrations',
      'Slack and Geiger Assets',
      $html$<p>Under <strong>Settings → Integrations</strong> in a form's settings:</p><ul><li><strong>Slack</strong>: paste a Slack <strong>Incoming webhook URL</strong> (in Slack, under Apps → Incoming Webhooks → Add to channel). Each new response then posts a message to that channel with who responded, up to 12 answers, a High priority flag when it applies and a link to open the response in Forms. Sensitive answers show as [protected].</li><li><strong>Geiger Assets</strong>: turn on <strong>Sync uploads to Assets</strong> to add the files respondents upload to the project's library in Geiger Assets, tagged forms.</li></ul><p>Choose <strong>Save changes</strong> to keep them.</p>$html$,
      '[]',
      60
    ),
    (
      'api-keys',
      'API',
      'API keys',
      $html$<p>API keys let your own code reach a project's forms through the REST API. Each key belongs to one project and only sees that project's forms. Manage them on the <strong>API keys</strong> tab of <strong>Integrations → REST / API</strong>, or in the <strong>API keys</strong> card of <strong>Workspace Settings</strong>. Only the Owner and Admin roles can create or revoke keys.</p><ol><li>Choose <strong>Create key</strong> and give the key a name, so you know where it's used.</li><li>Pick its scopes: <strong>Read</strong> lists forms and fetches responses, and <strong>Write</strong> submits responses (and includes read).</li><li>Copy the key from <strong>Copy your API key</strong>. It's shown only this once, so store it somewhere safe.</li></ol><p>The list shows each key's name, the start of the key, its scopes, and when it was created and last used. To revoke a key, choose the trash icon and confirm. Anything using it stops working at once, and it can't be undone.</p>$html$,
      '[]',
      70
    ),
    (
      'rest-api',
      'API',
      'REST API',
      $html$<p>Send your key as <code>Authorization: Bearer gf_…</code>. The <strong>REST API</strong> tab of the developer screens shows each endpoint with full example addresses for your deployment.</p><ul><li><code>GET /api/v1/forms</code>: the project's forms, up to 500, the most recently edited first.</li><li><code>GET /api/v1/forms/{id}</code>: one form, with its fields and public settings.</li><li><code>GET /api/v1/forms/{id}/responses</code>: the form's responses, oldest first. <code>limit</code> sets the page size (50 to start with, up to 200), <code>since</code> takes an ISO date and <code>cursor</code> takes the <code>nextCursor</code> from the previous page. Sensitive answers come back empty and are listed in <code>encryptedFields</code>.</li><li><code>POST /api/v1/forms/{id}/responses</code>: submits a response, with a body like <code>{"answers": {"FIELD_ID": "value"}}</code>. It needs the Write scope and goes through the same checks, scoring, automations and webhooks as the public form. It skips access rules and spam checks, but the response limit still applies. It returns 201 with the new response.</li></ul><p>Every reply is JSON. A failed request returns an error status and message: 401 means the key is missing, wrong or revoked, and 403 means it lacks the scope.</p>$html$,
      '[]',
      80
    ),
    (
      'public-endpoints',
      'API',
      'Building your own front-end',
      $html$<p>To show a form in your own design, or show response data in your own dashboard, use these endpoints. They need no key, and work only for published forms:</p><ul><li><code>GET /api/public/forms/{slug}</code>: the form's fields and public settings, for drawing the form yourself.</li><li><code>POST /api/public/forms/{slug}/submit</code>: submits answers from your page. The form's honeypot, captcha and rate limit apply.</li><li><code>GET /api/public/forms/{slug}/results</code>: poll results, when the form shows them to respondents.</li></ul><p>To read responses, call the REST API from your server with a Read key. Never put an API key in code that runs in the browser. The <strong>Data Front-end</strong> and <strong>Headless / API-first</strong> screens open this reference.</p>$html$,
      '[]',
      90
    ),
    (
      'developer-screens',
      'Reference',
      'The developer screens',
      $html$<p>Five sidebar entries open the same developer screens on different tabs: <strong>Integrations → Webhooks</strong> and <strong>Developer → Hooks & Events</strong> open <strong>Webhooks</strong>, <strong>Integrations → REST / API</strong> opens <strong>API keys</strong>, and <strong>Developer → Headless / API-first</strong> and <strong>Developer → Data Front-end</strong> open <strong>REST API</strong>.</p><ul><li><strong>API keys</strong>: create and revoke keys.</li><li><strong>REST API</strong>: the endpoints, with example requests.</li><li><strong>Webhooks</strong>: the events, headers, an example payload, a signature check example and the project's forms that have webhooks. <strong>Configure</strong> opens a form's Integrations settings.</li><li><strong>Deliveries</strong>: the delivery log for one form.</li><li><strong>Embed</strong>: embed code examples and every embed option. Its script also has a small JavaScript API: <code>GeigerForms.open()</code> opens a form in a popup, slider, popover or full screen, a <code>geiger-form:submitted</code> event fires on your page when someone submits, and <code>GeigerForms.mount()</code> sets up embeds added after the page loads.</li></ul><p>The <a href="/help/forms/sharing#embedding-a-form">Publishing and sharing</a> guide covers embedding a form step by step.</p>$html$,
      '[]',
      100
    ),
    (
      'related-guides',
      null::text,
      'Related guides',
      '',
      '[{"icon":"ClipboardCheck","label":"Approvals & automations","href":"/help/forms/workflow"},{"icon":"Share2","label":"Publishing & sharing","href":"/help/forms/sharing"},{"icon":"Settings","label":"Workspace settings","href":"/help/forms/settings"},{"icon":"Inbox","label":"Responses","href":"/help/forms/responses"},{"icon":"Settings2","label":"Form settings","href":"/help/forms/form-settings"},{"icon":"ShieldCheck","label":"Security & compliance","href":"/help/forms/security"}]',
      110
    )
) as v(anchor_id, eyebrow, title, content, links, sort_order)
cross join (select id from public.docs_pages where slug = 'forms/integrations' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Integrations & API',
    description = 'Send responses to other tools with webhooks, Slack, Geiger Flow and Assets, and work with forms through the REST API.',
    status = 'draft',
    published_at = null
where slug = 'forms/integrations' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'forms/integrations' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Per-form integrations</li><li>Webhooks and deliveries</li><li>API keys</li><li>REST API</li><li>Hooks and events</li></ul>',
  10
from public.docs_pages p
where p.slug = 'forms/integrations' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
