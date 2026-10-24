-- Help assets platform page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the assets/platform draft outline
-- (20261024191200_help_assets_structure) with the full Platform & API guide and publishes it. No section showcases
-- exist for Assets yet. Left out on purpose: Webhooks (endpoints and test events are only recorded, nothing is
-- sent; the workflow Webhook action is the working way to call another system), and every integration card other
-- than Google Drive and the REST API (they can't be connected).
-- Written from a survey of C:\Pro\geiger-assets (components/internal/screens/projects/platform/*, lib/api/auth.js,
-- lib/api/respond.js, app/api/v1/**, app/api/export/**, lib/export/*, lib/supabase/platform.js,
-- lib/delivery/signing.js, lib/image/transform.js, app/d/[projectId]/[assetId]/[...rest]/route.js,
-- lib/integrations/google_drive.js).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Platform & API',
    description = 'Create scoped API keys, call the Assets REST API, set the delivery policy for public addresses, connect Google Drive and export your data.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'assets/platform' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'assets/platform' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, showcase, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.showcase, v.sort_order
from (
  values
    (
      'creating-an-api-key',
      'Basics',
      'Creating an API key',
      $html$<p>An API key lets your own apps and scripts use the project's assets through the Assets REST API. To create one, open a project in Assets, choose <strong>Platform → API → API Keys</strong> in the sidebar, then <strong>Create key</strong>.</p><ol><li>Type a <strong>Key name</strong>, such as the app that will use it. It's required.</li><li>Under <strong>Permissions</strong>, pick <strong>Read</strong> and <strong>Write</strong> for each resource, or use <strong>Read only</strong> (the default), <strong>Full access</strong> or <strong>Clear</strong>. A key needs at least one permission.</li><li>Optional: pick an <strong>Expires</strong> date in the future. Left empty, the key never expires.</li><li>Choose <strong>Create key</strong>.</li></ol><p>Assets then shows the key's secret, which starts with <code>gk_live_</code>, in <strong>Save your secret key</strong>. Copy it with <strong>Copy secret</strong>, or copy the whole <code>Authorization: Bearer …</code> header. Assets shows the secret only once and keeps no readable copy; if you lose it, rotate the key.</p>$html$,
      '[]',
      null,
      10
    ),
    (
      'api-permissions',
      'Concepts',
      'API key permissions',
      $html$<p>Each API key works only in the project it was created in, and only for what its permissions allow:</p><ul><li><strong>Assets</strong>: read lists, searches and fetches assets; write creates, updates and deletes them.</li><li><strong>Collections</strong> and <strong>Folders</strong>: read lists and fetches them; write creates, updates and deletes them.</li><li><strong>Tags</strong>: read lists the project's tags.</li><li><strong>Upload</strong>: write prepares uploads and commits the files.</li><li><strong>Delivery</strong>: read gets an asset's delivery status and signed addresses; write turns delivery on or off.</li></ul><p>Write permission includes read for the same resource. A request with a revoked, expired or deleted key, or one without the permission it needs, is refused.</p>$html$,
      '[]',
      null,
      20
    ),
    (
      'managing-api-keys',
      'API Keys',
      'Managing API keys',
      $html$<p>The figures across the top of API Keys count the project's <strong>API keys</strong> (and how many have been used), and how many are <strong>Active</strong>, <strong>Expired</strong> and <strong>Revoked</strong>. Each row shows the key's name and the start of its secret, its permissions, its status (Active, Expired or Revoked), when it was last used and when it expires. Filter by status, or search by name.</p><p>Each row's <strong>⋯</strong> menu has these actions:</p><ul><li><strong>Rotate secret</strong>: makes a new secret, shown once, and stops the old one immediately. Update your app before you rotate.</li><li><strong>Revoke</strong>: Assets asks first, then apps using the key lose access immediately. The key stays in the list as Revoked.</li><li><strong>Delete</strong>: Assets asks first, then removes the key, which stops working.</li></ul>$html$,
      '[]',
      null,
      30
    ),
    (
      'api-reference',
      'API Reference',
      'The API reference',
      $html$<p><strong>Platform → API → API Reference</strong> lists every endpoint, each with a cURL command you can copy and run. Its <strong>Getting started</strong> panel shows the base URL, which is your Assets address followed by <code>/api/v1</code>, and the header every request needs: <code>Authorization: Bearer</code> and your key's secret.</p><ul><li><strong>Assets</strong>: list, create, get, update and delete assets, and download an original.</li><li><strong>Upload</strong>: presign an upload, then commit it.</li><li><strong>Collections</strong>, <strong>Folders</strong> and <strong>Tags</strong>: list them.</li><li><strong>Delivery</strong>: turn delivery on or off for an asset, and get a delivery address for it, signed when the project requires signed addresses.</li></ul><p>Each endpoint names the permission it needs, and a key without it gets an error.</p>$html$,
      '[]',
      null,
      40
    ),
    (
      'delivery-settings',
      'Delivery Settings',
      'Delivery settings',
      $html$<p><strong>Platform → API → Delivery Settings</strong> is the policy every public delivery address follows in the project. Changes wait for <strong>Save Changes</strong>; <strong>Discard</strong> drops them.</p><ul><li><strong>Output limits</strong>: <strong>Max width</strong> and <strong>Max height</strong> (4000 px each to start) and <strong>Max area</strong> (25 MP to start). Addresses asking for more are refused.</li><li><strong>Formats & effects</strong>: the <strong>Output formats</strong> and <strong>Effects</strong> addresses can use. All are allowed to start; <strong>All</strong> and <strong>None</strong> select or clear a group. At least one format is required.</li><li><strong>Require signed URLs</strong>: every address then needs a signature from the API's delivery endpoint. Existing unsigned links stop working once you save it on.</li><li><strong>Referrer allowlist</strong>: one website per line. Only pages on those sites can load the files; left empty, every site can.</li></ul><p>Whether addresses can transform images at all is the <strong>URL transforms</strong> setting under <strong>Settings → General</strong>. See <a href="/help/assets/delivery">Delivery</a>.</p>$html$,
      '[]',
      null,
      50
    ),
    (
      'integrations',
      'Integrations',
      'Integrations',
      $html$<p><strong>Platform → Integrations</strong> lists the tools Assets works with, by category. Google Drive is the account you connect here: under <strong>Your connections</strong>, choose <strong>Connect</strong> on Google Drive and sign in to Google. Once it's connected, <strong>Import files</strong> opens External Uploads and <strong>Disconnect</strong> unlinks it. The connection belongs to you, so it's the same one External Uploads uses, in every project.</p><p>The <strong>API keys</strong> button at the top opens API Keys. Importing from Drive is covered in <a href="/help/assets/uploads#importing-from-google-drive">Uploads and requests</a>.</p>$html$,
      '[]',
      null,
      60
    ),
    (
      'exporting-data',
      'Data Export',
      'Exporting data',
      $html$<p>To take data out of a project, choose <strong>Platform → Data Export</strong> and set up the export under <strong>Configure export</strong>.</p><ul><li><strong>Scope</strong>: the whole <strong>Project</strong>, one <strong>Collection</strong>, one <strong>Folder</strong>, or a <strong>Search filter</strong> that matches name, format, type and tags.</li><li><strong>Format</strong>: <strong>CSV</strong> for spreadsheet rows, <strong>JSON</strong> for full records, or <strong>ZIP</strong> for the original files with their metadata.</li><li><strong>Fields</strong>: the columns to include, all of them to start: name, type, format, folder, status, tags, description, size, dimensions, created and modified.</li><li><strong>Includes</strong>: add <strong>Versions</strong>, <strong>Comments</strong> and <strong>Rights</strong> records. A ZIP also keeps the <strong>Folder structure</strong> unless you turn it off.</li></ul><p>Choose <strong>Run export</strong>. The file downloads straight away, and the <strong>Summary</strong> shows what's in scope first. A ZIP can hold up to 1,000 files and 500 MB.</p><p><strong>Export history</strong> lists every run, newest first, with failed ones. <strong>Use these settings</strong> in a run's menu loads its setup again.</p>$html$,
      '[]',
      null,
      70
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"Cloud","label":"Delivery","href":"/help/assets/delivery"},{"icon":"Workflow","label":"Workflows","href":"/help/assets/workflows"},{"icon":"Settings","label":"Project settings","href":"/help/assets/settings"}]',
      null,
      80
    )
) as v(anchor_id, eyebrow, title, content, links, showcase, sort_order)
cross join (select id from public.docs_pages where slug = 'assets/platform' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Platform & API',
    description = 'Connect Assets to other tools: integrations, API keys, webhooks and data export.',
    status = 'draft',
    published_at = null
where slug = 'assets/platform' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'assets/platform' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Integrations</li><li>API keys</li><li>Delivery settings</li><li>API reference</li><li>Webhooks</li><li>Data export</li></ul>',
  10
from public.docs_pages p
where p.slug = 'assets/platform' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
