-- Help content publishing page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the content/publishing draft outline with
-- the full Publishing guide and publishes it. Content has no section showcases yet, so the page is text only.
-- Written from a survey of C:\Pro\geiger-content (components/internal/screens/publishing/*, components/internal/screens/
-- operations_ui.jsx, lib/supabase/{publishing,versions,webhooks,environments,delivery_ops,content}.js,
-- app/api/cron/publish-due/route.js, supabase/migrations/20261001081041_project_scoped_rls.sql).
-- Left out: the Delivery APIs screen's Test live fetch and its endpoint paths (they miss the /content prefix, so they
-- don't resolve in production), the webhook Secret (stored but never sent), the entry.scheduled event (nothing sends it),
-- and any scoping of entries to environments (no screen sets it and delivery doesn't read it).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Publishing',
    description = 'Publish and unpublish entries from the queue, restore earlier releases, call webhooks on publish, refresh cached delivery and record your sites.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'content/publishing' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'content/publishing' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, showcase, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.showcase, v.sort_order
from (
  values
    (
      'publishing-from-the-queue',
      'Basics',
      'Publishing an entry from the queue',
      $html$<p>To publish an entry, choose <strong>Publishing → Publishing Queue</strong> in the sidebar, then <strong>Publish now</strong> in the entry's <strong>⋯</strong> menu. Content sets the entry to Published with today's publish date, saves a version of it and calls your webhooks for <code>entry.published</code>. It confirms that the entry "is live".</p><p>To take a published entry down, choose <strong>Unpublish</strong> in its <strong>⋯</strong> menu. The entry goes back to Draft, leaves the queue and its public page, and Content calls your webhooks for <code>entry.unpublished</code>. Neither action asks you to confirm first.</p><p>A published entry's <strong>⋯</strong> menu also has <strong>View page</strong>, which opens its public page in a new tab. Publishing and unpublishing need the Publish an entry or page permission, which the Owner, Admin and Editor roles have.</p>$html$,
      '[]',
      null,
      10
    ),
    (
      'ways-to-publish',
      'Concepts',
      'Ways an entry goes live',
      $html$<p>An entry is live when its status is Published. Only published entries reach the delivery APIs and have a public page. There are four ways to publish one:</p><ul><li><strong>Publish now</strong> in the Publishing Queue. It saves a version and calls your webhooks.</li><li><strong>Approve</strong> in <strong>Editorial → Review Queue</strong>, for an entry that's In review.</li><li>Setting <strong>Status</strong> to Published in the entry editor's <strong>Visibility</strong> tab and saving.</li><li>A scheduled date: Content publishes a Scheduled entry once its date arrives, and saves a version of it.</li></ul><p>Webhooks are called only when you publish or unpublish from the Publishing Queue. Each way needs the Publish an entry or page permission. <a href="/help/content/library">Content library</a> covers the entry editor and scheduling, and <a href="/help/content/editorial">Editorial</a> covers the Review Queue.</p>$html$,
      '[]',
      null,
      20
    ),
    (
      'publishing-queue',
      'Publishing Queue',
      'The publishing queue',
      $html$<p><strong>Publishing → Publishing Queue</strong> lists every entry that's Scheduled, In review or Published. Each row shows the entry's slug and type, its go-live date if it's scheduled, its status, and a date: the scheduled date, the publish date or the last update, in that order of preference.</p><p>The figures across the top show how many entries are <strong>In queue</strong> (with how many scheduled entries are due now), then <strong>Scheduled</strong>, <strong>In review</strong> and <strong>Published</strong>. Filter by status, which starts on <strong>All Statuses</strong>, and search titles, slugs and excerpts. The list shows 25 entries a page; switch to 10, 50 or 100 at the bottom.</p>$html$,
      '[]',
      null,
      30
    ),
    (
      'releases-and-history',
      'Releases',
      'Releases and publishing history',
      $html$<p>Two screens list the project's 100 most recent versions, across every entry, newest first. A version is taken when you publish from the Publishing Queue, when a scheduled entry goes live, and when you save in the Structured Editor.</p><ul><li><strong>Publishing → Releases</strong> shows each version's entry and date, its version number and the title it saved. Search entries and version numbers. The figures across the top show <strong>Total versions</strong>, <strong>Versioned entries</strong> and the <strong>Latest snapshot</strong>.</li><li><strong>Publishing → Publishing History</strong> shows the same versions with the entry's slug. Narrow it to one entry with the entry filter (<strong>All entries</strong> to start), and search titles and slugs. The figures across the top show <strong>Snapshots</strong>, <strong>Entries</strong> and the <strong>Latest publish</strong>.</li></ul><p>On either screen, <strong>Restore as draft</strong> in a version's <strong>⋯</strong> menu puts that version's title, slug, type, excerpt, body, author, locale and cover back on the entry and sets it to Draft. It happens straight away, without asking, and never publishes. Restoring a published entry takes it out of delivery, so it needs the Publish an entry or page permission.</p>$html$,
      '[]',
      null,
      40
    ),
    (
      'environments',
      'Environments',
      'Environments',
      $html$<p>An environment is a named delivery target, such as production, staging or preview. To add one, choose <strong>Publishing → Environments</strong>, then <strong>Create environment</strong>. Only the <strong>Name</strong> is required; the <strong>Key</strong> fills in from it, in lowercase with underscores. The project's first environment becomes its default.</p><p>Each environment's <strong>⋯</strong> menu has <strong>Rename</strong>, which keeps the key, <strong>Duplicate</strong>, which adds "_copy" to the key, <strong>Set as default</strong> and <strong>Delete</strong>, which asks you to confirm first. The figures across the top show <strong>Total environments</strong>, the <strong>Default</strong> one and the <strong>Others</strong>. Search names and keys.</p><p>Sites in <strong>Publishing → Sites & Brands</strong> can name an environment. Changing environments needs the Manage settings permission, which the Owner and Admin roles have.</p>$html$,
      '[]',
      null,
      50
    ),
    (
      'delivery-and-caching',
      'Edge Delivery',
      'Delivery endpoints and caching',
      $html$<p>Your apps read published entries through the project's public delivery API, which needs no sign-in and never returns drafts. <strong>Publishing → Edge Delivery</strong> shows the project's <strong>Public REST endpoint</strong>; the copy icon beside it copies the full address. It also lists the project's environments and its 100 most recently published entries, each with a <strong>View</strong> link to its public page.</p><p>Public responses and public entry pages are cached for up to 60 seconds, so a change can take up to a minute to show. To refresh an entry sooner, use Cache Invalidation. <strong>Publishing → Delivery APIs</strong> lists the public endpoints with their cache rules. <a href="/help/content/developers">Developer tools</a> covers querying the delivery APIs.</p>$html$,
      '[]',
      null,
      60
    ),
    (
      'cache-invalidation',
      'Cache Invalidation',
      'Refreshing cached content',
      $html$<p>To make the next read of an entry fetch fresh content, choose <strong>Publishing → Cache Invalidation</strong>, pick the entry in <strong>Published entry</strong> and choose <strong>Invalidate cache</strong>. Content expires the cached delivery data for that entry and the project. It doesn't purge outside CDNs, so their copies can last until their 60-second limit runs out.</p><p><strong>Invalidation history</strong> lists every request with its path, its status and when it was made, and each request is also recorded in the project's audit log. The figures across the top count <strong>Published entries</strong>, <strong>Requests</strong> and the <strong>Last request</strong>. Invalidating needs the Publish an entry or page permission.</p>$html$,
      '[]',
      null,
      70
    ),
    (
      'creating-a-webhook',
      'Webhooks',
      'Creating a webhook',
      $html$<p>A webhook tells another system when an entry is published or unpublished, for example to rebuild a site. To add one, choose <strong>Publishing → Webhooks</strong>, then <strong>Create webhook</strong>:</p><ul><li><strong>Name</strong>: required, like Site rebuild.</li><li><strong>URL</strong>: required, and it has to start with <code>http://</code> or <code>https://</code>.</li><li><strong>Events</strong>: pick at least one. Content sends <code>entry.published</code>, which starts selected, and <code>entry.unpublished</code>.</li></ul><p>Choose <strong>Create webhook</strong>. New webhooks are Active. When you publish or unpublish from the Publishing Queue, Content sends a POST request with a JSON body to every Active webhook that subscribes to that event, like <code>{ "event": "entry.published", "payload": { "entryId": "…", "slug": "…", "title": "…" }, "sentAt": "…" }</code>.</p><p>Each webhook's <strong>⋯</strong> menu has <strong>Edit</strong>, <strong>Send test</strong>, <strong>Duplicate</strong> (a Paused copy), <strong>Pause</strong> or <strong>Resume</strong>, and <strong>Delete</strong>, which asks you to confirm first and keeps the webhook's past deliveries in the log. Changing webhooks needs the Manage settings permission, which the Owner and Admin roles have.</p>$html$,
      '[]',
      null,
      80
    ),
    (
      'webhook-delivery-log',
      'Webhooks',
      'Testing webhooks and the delivery log',
      $html$<p><strong>Send test</strong> in a webhook's <strong>⋯</strong> menu sends an <code>entry.published</code> request whose payload is <code>{ "test": true, "webhookId": "…" }</code>, and Content says whether it succeeded or failed, with the HTTP status.</p><p>The <strong>Delivery log</strong> under the webhooks lists the 50 most recent attempts, newest first: the event and its time, the webhook, the status (Delivered or Failed) and the response code. Content tries each delivery once and doesn't retry a failed one. The figures across the top count <strong>Total webhooks</strong> (with how many are active), recent <strong>Deliveries</strong> and <strong>Failed</strong> ones. Search webhooks by name and URL.</p>$html$,
      '[]',
      null,
      90
    ),
    (
      'sites-and-brands',
      'Sites & Brands',
      'Sites and brands',
      $html$<p><strong>Publishing → Sites & Brands</strong> records the sites the project publishes to. To add one, fill in <strong>Add site</strong>: <strong>Site name</strong> and <strong>Hostname</strong> are required, <strong>Brand name</strong> is optional, <strong>Environment</strong> starts as <strong>No environment</strong>, and <strong>Status</strong> is Draft, Active or Paused (Draft to start). Choose <strong>Add site</strong>. Each hostname is used once, and the environment has to belong to the project.</p><p>A site's <strong>⋯</strong> menu has <strong>Edit</strong>, which loads it into the form with <strong>Save changes</strong> and <strong>Cancel edit</strong>, and <strong>Archive</strong>, which hides it from the list straight away. Sites are records for your team: hosting and DNS stay with your deployment provider. Only project owners can add or change sites.</p>$html$,
      '[]',
      null,
      100
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"Rss","label":"Geiger Content","href":"/help/content"},{"icon":"Library","label":"Content library","href":"/help/content/library"},{"icon":"FileText","label":"Editorial","href":"/help/content/editorial"},{"icon":"CodeXml","label":"Developer tools","href":"/help/content/developers"},{"icon":"ShieldCheck","label":"Governance","href":"/help/content/governance"},{"icon":"Settings","label":"Project settings","href":"/help/content/settings"}]',
      null,
      110
    )
) as v(anchor_id, eyebrow, title, content, links, showcase, sort_order)
cross join (select id from public.docs_pages where slug = 'content/publishing' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Publishing',
    description = 'Publish and deliver content through the queue, releases, environments, delivery APIs and webhooks.',
    status = 'draft',
    published_at = null
where slug = 'content/publishing' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'content/publishing' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Publishing Queue</li><li>Releases</li><li>Environments</li><li>Delivery APIs</li><li>Webhooks</li><li>Edge Delivery</li><li>Cache Invalidation</li><li>Publishing History</li><li>Sites and brands</li></ul>',
  10
from public.docs_pages p
where p.slug = 'content/publishing' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
