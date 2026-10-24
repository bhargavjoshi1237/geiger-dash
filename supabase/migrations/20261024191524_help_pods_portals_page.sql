-- Help pods portals page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the pods/portals draft outline (from
-- 20261024191500_help_pods_structure) with the full Developer portals guide and publishes it.
-- Left out on purpose: the endpoint page's "Try it" switch (the public page only shows a note, there is no console)
-- and shared products (nothing in the UI shares one). No Pods showcases exist, so the page embeds none.
-- Written from a survey of C:\Pro\geiger-pods (components/internal/screens/distribution/portals_list.jsx,
-- app/portal/[slug]/page.jsx, app/portal/[slug]/products/[productId]/page.jsx, lib/control/portals.mjs).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Developer portals',
    description = 'Publish a developer portal for your APIs: products, Markdown docs and endpoint pages, branding, sign-in rules, and publishing or disabling it.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'pods/portals' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'pods/portals' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.sort_order
from (
  values
    (
      'creating-a-portal',
      'Basics',
      'Creating a portal',
      $html$<p>A <strong>developer portal</strong> is a public site that presents your APIs to the people who call them. To create one, choose <strong>Portals</strong> in the Pods sidebar, then <strong>New Portal</strong>. Owners, Admins and Managers can create and edit portals.</p><ol><li>Type a <strong>Name</strong>, up to 128 characters.</li><li>Check the <strong>Slug</strong>. Pods fills it in from the name; it's 2 to 128 lowercase letters, digits and dashes, and it can't change later. The hint shows the public address, <code>/pods/portal/</code> followed by the slug.</li><li>Choose <strong>Create Portal</strong>.</li></ol><p>The portal starts as a Draft, so nobody can see it yet. It opens in its editor, with the sections <strong>General</strong>, <strong>Products & APIs</strong>, <strong>Pages</strong> and <strong>Publish</strong>.</p>$html$,
      '[]',
      10
    ),
    (
      'portal-settings',
      'Portals',
      'Branding and access',
      $html$<p>A portal's <strong>General</strong> section sets how it looks and who can open it. Make your changes, then choose <strong>Save Changes</strong>. Saved changes reach the public portal the next time you publish.</p><ul><li><strong>Name</strong>, and the <strong>Public URL</strong> with a copy icon.</li><li><strong>Theme</strong>: Match visitor (the default), Light or Dark.</li><li><strong>Primary color</strong> and <strong>Accent color</strong>: hex values such as <code>#4f46e5</code>.</li><li><strong>Footer (Markdown)</strong>: text for the bottom of every page.</li><li><strong>Require sign-in</strong>: visitors must sign in with a Geiger account before they see anything. <strong>Allowed email domains</strong>, such as <code>acme.com, partner.io</code>, limits it to those addresses; leave it empty to let any signed-in visitor in.</li></ul><p>A visitor who isn't signed in sees "Sign in required", and one whose email domain isn't allowed sees "Not allowed".</p>$html$,
      '[]',
      20
    ),
    (
      'products',
      'Portals',
      'Products',
      $html$<p>A <strong>product</strong> groups the docs and endpoint pages a portal shows, such as everything about one API. Open a portal and choose <strong>Products & APIs</strong>.</p><ol><li>Choose <strong>New Product</strong>, type a <strong>Name</strong> (up to 128 characters) and an optional <strong>Description</strong>, then choose <strong>Create Product</strong>.</li><li>Choose <strong>Link</strong> beside the product to put it on this portal.</li></ol><p>The list shows every product the project owns, and whether each is Linked or Not linked to this portal, so one product can appear on several portals. A linked product appears on the public portal after the next publish.</p>$html$,
      '[]',
      30
    ),
    (
      'pages',
      'Portals',
      'Docs pages and endpoint pages',
      $html$<p>Pages belong to a product. Open a portal and choose <strong>Pages</strong>. Create a product first if there's none.</p><ul><li><strong>Docs page</strong>: a Markdown page. Pick the <strong>Product</strong>, type a <strong>Title</strong> (up to 256 characters) and a <strong>Slug</strong>, write the <strong>Body (Markdown)</strong>, and choose <strong>Add Page</strong>.</li><li><strong>Endpoint page</strong>: a reference page for one operation of a deployed REST API. Pick the <strong>Product</strong> and the <strong>API</strong>, type the <strong>Stage</strong>, pick the <strong>Method</strong>, type the <strong>Resource path</strong> such as <code>/pets/{id}</code> and, optionally, an <strong>Operation name</strong>. Choose <strong>Add Endpoint</strong>.</li></ul><p>New pages appear on the public portal after the next publish. Members see this section read-only.</p>$html$,
      '[]',
      40
    ),
    (
      'publishing',
      'Portals',
      'Publishing and disabling a portal',
      $html$<p>Publishing freezes the portal's products, pages and branding into a snapshot that its public page serves. Later edits don't show until you publish again. Only Owners and Admins can publish.</p><p>Open the portal, choose <strong>Publish</strong>, then <strong>Publish</strong> (or <strong>Publish again</strong>). <strong>Public page</strong> shows the address, and <strong>Open</strong> opens it. You can also choose <strong>Publish</strong> or <strong>View public page</strong> in the portal's <strong>⋯</strong> menu in the list.</p><p>To take a portal offline, choose <strong>Disable Portal</strong> under <strong>Danger zone</strong>, or <strong>Disable</strong> in its <strong>⋯</strong> menu, and confirm. Its public address stops serving straight away. Publish again to bring it back.</p>$html$,
      '[]',
      50
    ),
    (
      'portal-list',
      'Portals',
      'The portal list',
      $html$<p>The <strong>Portals</strong> screen counts the project's <strong>Portals</strong>, how many are <strong>Published</strong>, how many are <strong>Drafts</strong>, and its <strong>Products</strong>. Filter by <strong>Status</strong>: Draft, Published or Disabled. Each row shows the portal's status and public URL.</p><ul><li><strong>Draft</strong>: not public yet.</li><li><strong>Published</strong>: visitors see the last published snapshot.</li><li><strong>Disabled</strong>: the public address returns a not-found page.</li></ul><p>Click a portal, or choose <strong>Edit</strong> (or <strong>Open</strong>) in its <strong>⋯</strong> menu, to open its editor.</p>$html$,
      '[]',
      60
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"BookOpen","label":"Docs, SDKs & OpenAPI","href":"/help/pods/apis/distribution"},{"icon":"Ticket","label":"Usage plans & API keys","href":"/help/pods/usage"},{"icon":"Network","label":"APIs","href":"/help/pods/apis"}]',
      70
    )
) as v(anchor_id, eyebrow, title, content, links, sort_order)
cross join (select id from public.docs_pages where slug = 'pods/portals' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Developer portals',
    description = 'Publish developer portals that present your APIs and their docs to the people who use them.',
    status = 'draft',
    published_at = null
where slug = 'pods/portals' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'pods/portals' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Creating a portal</li><li>Products and pages</li><li>Publishing</li></ul>',
  10
from public.docs_pages p
where p.slug = 'pods/portals' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
