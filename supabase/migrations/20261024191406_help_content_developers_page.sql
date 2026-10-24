-- Help content developers page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the content/developers draft outline with
-- the full Developer tools guide and publishes it. Content has no section showcases yet, so the page is text only.
-- Written from a survey of C:\Pro\geiger-content (components/internal/screens/developers/*, app/api/content/v1/*,
-- app/api/content/v2/*, lib/delivery/v2/{server,auth,parse,engine,schema,serialize,errors,typegen}.mjs,
-- lib/supabase/{tokens,content}.js, next.config.mjs for the /content base path).
-- Left out: API Explorer, the GraphQL API screen's runner, Preview Tools and the REST API screen's paths (they call
-- addresses without the /content prefix, so they don't resolve in production), SDKs & CLI (the packages it names aren't
-- published), Apps & Plugins (session-only toggles), and what the content:read, content:write and webhooks:write scopes allow (nothing checks them).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Developer tools',
    description = 'Read published entries through Content''s v1 and v2 delivery APIs and GraphQL, generate TypeScript types, manage API tokens, and import or export entries.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'content/developers' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'content/developers' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, showcase, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.showcase, v.sort_order
from (
  values
    (
      'reading-published-entries',
      'Basics',
      'Reading published entries over the API',
      $html$<p>Your website or app reads a project's published entries over HTTP. To list them, send a GET request to the v1 entries endpoint with your project's id:</p><p><code>GET /content/api/content/v1/entries?project=PROJECT_ID</code></p><p>Replace <code>PROJECT_ID</code> with your project's id, which <strong>Settings → Workspace</strong> shows. Addresses start with the domain you open Content on, followed by the path. To get the full address for your project, choose <strong>Publishing → Edge Delivery</strong> in the sidebar and use the copy icon beside <strong>Public REST endpoint</strong>.</p><p>The delivery APIs return published entries only, never drafts, and the v1 and GraphQL endpoints need no token. Responses are cached for up to 60 seconds, so a change can take a minute to show.</p>$html$,
      '[]',
      null,
      10
    ),
    (
      'v1-and-v2',
      'Concepts',
      'The v1 and v2 delivery APIs',
      $html$<p>Content has two delivery APIs, and both return published entries only.</p><ul><li><strong>v1</strong> returns every entry with the same fixed fields: title, slug, type, excerpt, body, author and so on. Use it when you don't use content types.</li><li><strong>v2</strong> works per content type. Each content type has its own address, named after its plural API ID, like <code>articles</code>, and its entries carry their typed fields. It supports filters, sorting, field selection, populating references and media, paging and locales.</li></ul><p>There's also a small GraphQL endpoint with the same fixed fields as v1. Content types and fields are set up in <a href="/help/content/architecture">Content architecture</a>.</p>$html$,
      '[]',
      null,
      20
    ),
    (
      'v1-entries',
      'REST API',
      'v1 entries endpoints',
      $html$<p>The v1 API has two endpoints. Both need the project's id in <code>project</code>; without it they answer with an error and status 400.</p><ul><li><code>GET /content/api/content/v1/entries?project=PROJECT_ID</code> lists published entries, the most recently published first. Add <code>type=Article</code> (or Page, Guide or Doc) to keep one type, and <code>limit</code> for how many to return: 50 by default, 100 at most.</li><li><code>GET /content/api/content/v1/entries/SLUG?project=PROJECT_ID</code> returns one published entry by its slug, or status 404 if there isn't one.</li></ul><p>Each entry has <code>id</code>, <code>title</code>, <code>slug</code>, <code>status</code>, <code>type</code>, <code>excerpt</code>, <code>body</code>, <code>author</code>, <code>locale</code>, <code>coverUrl</code>, <code>environmentId</code>, <code>projectId</code>, <code>scheduledAt</code>, <code>publishedAt</code>, <code>createdAt</code> and <code>updatedAt</code>. The list returns a JSON array of entries. The <code>body</code> is a JSON string of blocks, each with a <code>type</code> (paragraph or heading) and its <code>text</code>.</p>$html$,
      '[]',
      null,
      30
    ),
    (
      'v2-requests',
      'REST API',
      'Querying a content type with the v2 API',
      $html$<p>Each content type has two v2 endpoints, named after its plural API ID:</p><ul><li><code>GET /content/api/content/v2/projects/PROJECT_ID/PLURAL</code> lists the type's published entries.</li><li><code>GET /content/api/content/v2/projects/PROJECT_ID/PLURAL/ID_OR_SLUG</code> returns one.</li></ul><p>A list answers with <code>{ "data": [...], "meta": { "pagination": {...} } }</code> and a single entry with <code>{ "data": {...}, "meta": {} }</code>. Each entry has <code>id</code>, <code>slug</code>, <code>locale</code>, <code>type</code>, <code>publishedAt</code>, <code>createdAt</code> and <code>updatedAt</code>, the built-in <code>title</code>, <code>excerpt</code>, <code>body</code>, <code>author</code> and <code>coverUrl</code>, and the type's delivered fields. Private fields are never included. A Media field returns the asset's <code>id</code>, <code>url</code>, <code>name</code>, <code>mime</code>, <code>width</code>, <code>height</code> and <code>alt</code>.</p><p>Requests without a token read the project's public entries. To use a token, send it in an <code>Authorization: Bearer TOKEN</code> header: a token in the query string is rejected. A token has to be active and belong to the project.</p>$html$,
      '[]',
      null,
      40
    ),
    (
      'v2-query-parameters',
      'Reference',
      'v2 filters, sorting and paging',
      $html$<p>v2 list requests take these query parameters, written in bracket syntax:</p><ul><li><code>filters</code>: <code>filters[title][$containsi]=guide</code>. Text, Rich text and Enum fields take <code>$eq</code>, <code>$eqi</code>, <code>$ne</code>, <code>$nei</code>, <code>$in</code>, <code>$notIn</code>, <code>$lt</code>, <code>$lte</code>, <code>$gt</code>, <code>$gte</code>, <code>$between</code>, <code>$contains</code>, <code>$notContains</code>, <code>$containsi</code>, <code>$notContainsi</code>, <code>$startsWith</code>, <code>$startsWithi</code>, <code>$endsWith</code>, <code>$endsWithi</code>, <code>$null</code> and <code>$notNull</code>. Numbers and dates take the comparisons, <code>$in</code>, <code>$between</code> and the null checks; Booleans take <code>$eq</code>, <code>$ne</code> and the null checks; JSON and Media fields take only the null checks. Combine conditions with <code>$and</code>, <code>$or</code> and <code>$not</code>. Reference fields can't be filtered.</li><li><code>sort</code>: up to three keys, like <code>sort=publishedAt:desc</code>. The default is <code>publishedAt</code>, newest first.</li><li><code>fields</code>: the fields to return.</li><li><code>populate</code>: Reference fields to fill in with the linked entries, one level deep. Media fields are always filled in.</li><li><code>pagination</code>: <code>page</code> and <code>pageSize</code>, or <code>start</code> and <code>limit</code>, but not both. Pages hold 25 entries by default and 100 at most. <code>withCount=false</code> skips the total.</li><li><code>locale</code>: the locale to return. Without it, v2 uses the project's default locale.</li></ul><p>Single-entry requests take <code>fields</code>, <code>populate</code> and <code>locale</code>. <code>status</code> only accepts <code>published</code>.</p>$html$,
      '[]',
      null,
      50
    ),
    (
      'v2-limits-and-errors',
      'Reference',
      'v2 limits, caching and errors',
      $html$<ul><li>A request can have up to 200 query parameters, nested six brackets deep, with up to 20 filter conditions, logic nested five levels deep, 100 values in a list and 1,000 characters in a value.</li><li>Responses without a token are cached for up to 60 seconds; responses to a token aren't shared. Every response has an <code>ETag</code>, and a request whose <code>If-None-Match</code> matches gets status 304 with no body.</li><li>Errors answer with <code>{ "data": null, "error": { "status": …, "name": …, "message": … } }</code>, with status 400 for a bad query, 401 or 403 for a token problem and 404 for an unknown project, type or entry.</li></ul>$html$,
      '[]',
      null,
      60
    ),
    (
      'type-generation',
      'Type Generation',
      'Generating TypeScript types',
      $html$<p><strong>Developers → Type Generation</strong> turns the project's content types into a TypeScript file, <code>geiger-content.d.ts</code>, with an interface for each type's entries, filter types and a map from each plural API ID to its type. Private fields are left out. Choose <strong>Copy</strong> or <strong>Download .d.ts</strong>, and <strong>Regenerate</strong> after you change content types. The figures across the top count <strong>Content types</strong>, <strong>Fields</strong> and <strong>Lines</strong>.</p><p>To fetch the same file in a build, request <code>/content/api/content/v2/projects/PROJECT_ID/_schema?format=ts</code> with a token that has the <code>schema:read</code> scope. Without <code>format</code>, the endpoint returns the schema as JSON. The screen's <strong>Fetch in CI</strong> card shows the full command.</p>$html$,
      '[]',
      null,
      70
    ),
    (
      'graphql',
      'GraphQL API',
      'The GraphQL endpoint',
      $html$<p>Content's GraphQL endpoint, <code>/content/api/content/v1/graphql</code>, answers two queries about published entries. Send the query as JSON in a POST body, <code>{ "query": "…" }</code>, or as a <code>query</code> parameter on a GET request.</p><ul><li><code>{ entries(projectId: "PROJECT_ID") { id title slug } }</code> returns up to 50 entries, the most recently published first.</li><li><code>{ entry(slug: "…", projectId: "PROJECT_ID") { id title body } }</code> returns one entry, or null.</li></ul><p>You can ask for <code>id</code>, <code>title</code>, <code>slug</code>, <code>status</code>, <code>type</code>, <code>excerpt</code>, <code>body</code>, <code>author</code>, <code>locale</code>, <code>coverUrl</code> and <code>publishedAt</code>. Any other query returns an error listing the supported ones.</p>$html$,
      '[]',
      null,
      80
    ),
    (
      'api-tokens',
      'API Tokens',
      'Creating and revoking API tokens',
      $html$<p>To create a token for the v2 API, choose <strong>Developers → API Tokens</strong>, then <strong>Mint token</strong>. Only the <strong>Name</strong> is required. Pick its <strong>Scopes</strong> (<code>delivery:read</code> is selected to start), optionally set <strong>Expires at (optional)</strong>, and choose <strong>Mint token</strong>.</p><p>The token, which starts with <code>gct_</code>, is shown once, in the <strong>Copy your token</strong> dialog. Copy it then: Content keeps only a hash, so a lost token can't be shown again and you have to mint a new one.</p><p>The list shows each token's scopes, its state (Active, Expired or Revoked) and when it was last used. To stop a token working, choose <strong>Revoke</strong> in its <strong>⋯</strong> menu and confirm. It stops at once and can't be undone. Of the scopes, the v2 API checks <code>schema:read</code> for the schema endpoint and <code>delivery:read</code> for private entries.</p><p>Creating and revoking tokens needs the Create and revoke delivery tokens permission, which the Owner and Admin roles have.</p>$html$,
      '[]',
      null,
      90
    ),
    (
      'service-accounts',
      'Service Accounts',
      'Service accounts',
      $html$<p><strong>Developers → Service Accounts</strong> keeps a list of named identities for automations, such as a nightly sync job, each with a role. To add one, choose <strong>Create account</strong>, type a <strong>Name</strong> (required), pick a <strong>Role</strong>, which is Viewer (the default), Editor or Admin, and choose <strong>Create account</strong>.</p><p>Each account's <strong>⋯</strong> menu has <strong>Edit</strong> and <strong>Delete</strong>, which asks you to confirm first. The figures across the top count <strong>Accounts</strong>, <strong>Admins</strong>, <strong>Editors</strong> and <strong>Viewers</strong>. Search names and roles.</p>$html$,
      '[]',
      null,
      100
    ),
    (
      'logs-and-usage',
      'Logs & Usage',
      'Logs and usage',
      $html$<p><strong>Developers → Logs & Usage</strong> merges the project's latest webhook deliveries and audit events into one list, newest first, up to 100 rows. Each row shows its kind (Webhook or Audit), what happened and its status, and when. Filter by kind, which starts on <strong>All kinds</strong>, and search the list. The screen only reads; <a href="/help/content/publishing">Publishing</a> covers webhooks and <a href="/help/content/governance">Governance</a> covers the audit log.</p>$html$,
      '[]',
      null,
      110
    ),
    (
      'import-and-export',
      'Import & Export',
      'Exporting and importing entries',
      $html$<p><strong>Developers → Import & Export</strong> downloads the project's data as files. Choose <strong>Download</strong> beside the one you want:</p><ul><li><strong>Full workspace</strong>: entries, collections and slots, as JSON.</li><li><strong>Entries</strong>, <strong>Collections</strong> or <strong>Slots</strong>, each as JSON.</li><li><strong>Entries spreadsheet</strong>: entries as CSV, with id, title, slug, status, type, author and locale.</li></ul><p>To import entries, choose a JSON file under <strong>Entries JSON file</strong>. It can hold an array of entries, or an object with an <code>entries</code> array, like an <strong>Entries</strong> or <strong>Full workspace</strong> export. Every row becomes a new entry with a new id, so importing the same file twice makes copies. Each row needs a title, and rows without a status become Drafts. A failed row doesn't stop the rest: Content reports how many were imported and lists the first failures.</p><p>Importing needs the Edit an entry or page permission, and Publish an entry or page for rows that are Published or Scheduled.</p>$html$,
      '[]',
      null,
      120
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"Rss","label":"Geiger Content","href":"/help/content"},{"icon":"DraftingCompass","label":"Content architecture","href":"/help/content/architecture"},{"icon":"Rocket","label":"Publishing","href":"/help/content/publishing"},{"icon":"Library","label":"Content library","href":"/help/content/library"},{"icon":"ShieldCheck","label":"Governance","href":"/help/content/governance"},{"icon":"Settings","label":"Project settings","href":"/help/content/settings"}]',
      null,
      130
    )
) as v(anchor_id, eyebrow, title, content, links, showcase, sort_order)
cross join (select id from public.docs_pages where slug = 'content/developers' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Developer tools',
    description = 'Explore the delivery APIs, generate types, manage tokens and service accounts, and import or export content.',
    status = 'draft',
    published_at = null
where slug = 'content/developers' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'content/developers' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>API Explorer</li><li>REST API</li><li>GraphQL API</li><li>SDKs and CLI</li><li>Type Generation</li><li>Preview Tools</li><li>API Tokens</li><li>Service Accounts</li><li>Apps and plugins</li><li>Logs and usage</li><li>Import and export</li></ul>',
  10
from public.docs_pages p
where p.slug = 'content/developers' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
