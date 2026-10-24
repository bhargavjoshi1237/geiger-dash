-- Help assets library page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the assets/library draft outline
-- (20261024191200_help_assets_structure) with the full Asset library guide and publishes it. No section showcases
-- exist for Assets yet.
-- Written from a survey of C:\Pro\geiger-assets (components/internal/screens/projects/library/* and sections/*,
-- components/internal/shared/asset_preview.jsx, asset_thumbnail.jsx, folder_explorer.jsx, pagination.jsx,
-- unsaved_changes.jsx, editor_shell.jsx, lib/supabase/assets.js, lib/supabase/archive.js, lib/storage/client.js,
-- lib/storage/service.js, lib/storage/auth.js, lib/s3/config.js, lib/delivery/url.js, lib/delivery/copy_link.js,
-- app/api/storage/object/route.js, geiger-rbac.config.js, supabase/migrations/20260906020000_rbac_org_role_mapping.sql).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Asset library',
    description = 'Browse every asset in a project, find them by type, status and tags, and open an asset to edit its details, versions, links and delivery.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'assets/library' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'assets/library' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, showcase, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.showcase, v.sort_order
from (
  values
    (
      'adding-an-asset',
      'Basics',
      'Adding an asset',
      $html$<p>To add one file, open a project in Assets, choose <strong>Assets → Asset Library</strong> in the sidebar, then <strong>Upload</strong>. <strong>All Media</strong> has the same <strong>Upload</strong> button.</p><ol><li>In <strong>Upload assets</strong>, drop a file on the box or click it to choose one. The dialog takes one file at a time.</li><li>Check <strong>Asset name</strong>. Assets fills it in from the file name, and you can change it.</li><li>Optional: in <strong>Destination folder</strong>, choose a folder. Without one, the asset goes in <strong>Project root</strong>.</li><li>Optional: change <strong>Type</strong>, which Assets picks from the file, and <strong>Status</strong>, which starts as Draft.</li><li>Optional: turn on <strong>Upload lossless</strong> to store the file exactly as it is. With it off, Assets converts images to WebP at up to 2048 px to save storage and bandwidth. PSD, TIFF and RAW files always upload untouched.</li><li>Choose <strong>Upload</strong>. A bar shows each step, and the asset appears in the library when it's done.</li></ol><p>Uploading needs a role that includes <strong>Edit an asset</strong>, which every built-in role except Viewer has. To upload many files at once, or from a link or another service, use the Upload Center, covered in <a href="/help/assets/uploads#uploading-files">Uploads and requests</a>.</p>$html$,
      '[]',
      null,
      10
    ),
    (
      'statuses-and-types',
      'Concepts',
      'Statuses and types',
      $html$<p>Every asset has a status and a type, shown as colored labels across the library.</p><ul><li><strong>Status</strong> is where the asset is in its life: Approved, Draft, In Review, Processing or Archived. Assets uploaded from the library start as Draft unless you pick another status.</li><li><strong>Type</strong> is the kind of file: Image, Video, Audio, Document, PDF, 3D Model, Raw or Archive. Assets picks it from the file when you upload, and you can change it.</li></ul><p>Archived assets stay in the library with the Archived label, and they're also listed under <strong>Archive & Trash</strong>, where restoring one sets it back to Draft. Deleted assets are different: they leave the library for the trash. See <a href="/help/assets/archive">Archive and trash</a>.</p><p>Changing an asset's status, for example to Approved, can also start a workflow that watches for it. See <a href="/help/assets/workflows">Workflows</a>.</p>$html$,
      '[]',
      null,
      20
    ),
    (
      'all-media',
      'All Media',
      'Browsing all media',
      $html$<p><strong>All Media</strong>, right under Overview in the sidebar, shows every asset in the project as a grid of thumbnails that keep each file's own shape. Click a thumbnail to open the asset's quick view.</p><ul><li><strong>Type filter</strong>: <strong>All Types</strong> by default, or one type, such as Image or Video.</li><li><strong>Sort</strong>: <strong>Last Modified</strong> (the default), <strong>Oldest Modified</strong>, <strong>Name A–Z</strong>, <strong>Name Z–A</strong>, <strong>Largest Size</strong>, <strong>Smallest Size</strong> or <strong>Most Downloaded</strong>.</li><li><strong>Search</strong>: matches asset names, file formats and tags.</li></ul><p>The grid shows 50 assets a page; switch to 10, 25 or 100 at the bottom. When nothing matches, <strong>Clear filters</strong> resets the search and the type filter.</p>$html$,
      '[]',
      null,
      30
    ),
    (
      'asset-library',
      'Asset Library',
      'The asset library',
      $html$<p><strong>Assets → Asset Library</strong> lists every asset in the project, newest change first. The figures across the top count the whole library: <strong>Total assets</strong>, <strong>Storage used</strong>, <strong>Approved</strong> and <strong>Processing</strong>. Search and filters don't change them.</p><p>Each row shows the asset's thumbnail, name, format, size and folder, then its <strong>Status</strong>, <strong>Type</strong>, <strong>Modified</strong> date and <strong>Downloads</strong>. Narrow the list with the type filter (<strong>All Types</strong>) and the status filter (<strong>All Statuses</strong>), or search by name, format and tags.</p><p>The list shows 25 assets a page; switch to 10, 50 or 100 at the bottom. Searches you run here and in All Media, and the results you open from them, are counted in Search Analytics. See <a href="/help/assets/analytics">Analytics</a>.</p>$html$,
      '[]',
      null,
      40
    ),
    (
      'quick-view',
      'Asset Library',
      'Quick view',
      $html$<p>Click an asset in the Asset Library or All Media to open its quick view, a panel on the right. Changes here save as you make them.</p><ul><li><strong>Status</strong>: pick a new status.</li><li><strong>Tags</strong>: type a tag and press <code>Enter</code> or a comma. The × on a tag removes it.</li><li><strong>Description</strong>: shown when the asset has one. Edit it in the asset editor.</li><li><strong>Details</strong>: type, dimensions, folder, downloads, number of versions and relationships, and when it was modified.</li></ul><p>At the bottom, <strong>Edit</strong> opens the asset editor, the download icon saves the file, the copy icon duplicates the asset, and <strong>Delete</strong> moves it to the trash after you confirm.</p>$html$,
      '[]',
      null,
      50
    ),
    (
      'asset-menu',
      'Asset Library',
      'The asset menu',
      $html$<p>Each row's <strong>⋯</strong> menu in the Asset Library has every action for that asset.</p><ul><li><strong>Open</strong> shows the quick view, and <strong>Edit</strong> opens the asset editor.</li><li><strong>Open Containing Folder</strong> opens <strong>Folders</strong> at the asset's folder.</li><li><strong>Download → Original file</strong> saves the stored file. For images, <strong>As WebP</strong>, <strong>As JPG</strong> and <strong>As PNG</strong> save a converted copy; they need delivery turned on for the asset and URL transforms turned on for the project.</li><li><strong>Share → Copy delivery link</strong> copies the asset's public delivery address, and only works once delivery is on for it. <strong>Create share link</strong> makes a private share link that allows downloads, expires in 30 days and is copied for you. <strong>Manage shared links</strong> opens <strong>Shared Links</strong>.</li><li><strong>Copy URL</strong> copies a delivery address for the <strong>Original</strong> file and, for images, an <strong>Optimized</strong> copy or a <strong>Thumbnail (512px)</strong>. These need delivery on for the asset too.</li><li><strong>Rename</strong>, <strong>Replace</strong>, <strong>Duplicate</strong> and <strong>Add to Collection</strong> change or copy the asset.</li><li><strong>Delete</strong> moves the asset to the trash after you confirm.</li></ul><p>Delivery is covered in <a href="/help/assets/delivery">Delivery</a> and share links in <a href="/help/assets/collaboration">Collaboration</a>.</p>$html$,
      '[]',
      null,
      60
    ),
    (
      'renaming-replacing-duplicating',
      'Asset Library',
      'Renaming, replacing and duplicating',
      $html$<p>All four actions are in each asset's <strong>⋯</strong> menu in the Asset Library.</p><ul><li><strong>Rename</strong> changes the name shown across the project; the stored file isn't touched. <strong>Rename</strong> needs a name.</li><li><strong>Replace</strong> asks for a new file and makes it the asset's current version. The previous file stays in the asset's version history, where you can restore it.</li><li><strong>Duplicate</strong> asks first, then creates a Draft copy with the same name plus <code>(copy)</code>, tags and details. The file itself isn't copied, so use <strong>Replace</strong> on the copy to give it one.</li><li><strong>Add to Collection</strong> lists the project's collections with their asset counts. Click one to add the asset; it stays where it is in the library. Adding an asset to a collection that already holds it shows an error.</li></ul>$html$,
      '[]',
      null,
      70
    ),
    (
      'deleting-an-asset',
      'Asset Library',
      'Deleting an asset',
      $html$<p>To delete an asset, choose <strong>Delete</strong> in its <strong>⋯</strong> menu or at the bottom of its quick view, then <strong>Delete</strong> again to confirm. The asset leaves the library and moves to the trash.</p><p>From the trash, under <strong>Assets → Archive & Trash</strong>, you can restore the asset or delete it permanently, which removes its file and every version for good. See <a href="/help/assets/archive">Archive and trash</a>.</p><p>Deleting needs a role that includes <strong>Delete an asset</strong>. Of the built-in roles, Owner and Admin have it; Manager, Member and Viewer don't. Roles are covered in <a href="/help/assets/settings#permissions-and-security">Project settings</a>.</p>$html$,
      '[]',
      null,
      80
    ),
    (
      'asset-editor',
      'Asset details',
      'The asset editor',
      $html$<p>To open an asset's editor, choose <strong>Edit</strong> in its <strong>⋯</strong> menu or its quick view. The editor fills the screen, with <strong>Asset Library</strong> at the top left to go back. Its sections are listed on the left: <strong>Overview</strong>, then <strong>Asset details</strong>, <strong>Relationships</strong>, <strong>Versions</strong>, <strong>Delivery</strong> and <strong>Technical</strong>. The search box there finds a section by name.</p><p><strong>Overview</strong> previews the file with its status, format, size, dimensions and folder, counts its downloads, versions and links, and has <strong>Open file</strong> and <strong>Download</strong>.</p><p>Edits to the details, tags, accent color and delivery switch wait for <strong>Save Changes</strong> at the top, or <code>Ctrl S</code> (<code>⌘ S</code> on Mac). <strong>Discard</strong> drops them. If you leave the editor or switch sections with unsaved edits, Assets asks whether to <strong>Save</strong>, <strong>Discard</strong> or <strong>Keep editing</strong>. Relationships, version restores and file replacements save straight away.</p>$html$,
      '[]',
      null,
      90
    ),
    (
      'editing-details',
      'Asset details',
      'Editing details and tags',
      $html$<p>The <strong>Asset details</strong> section of the asset editor holds what people search and filter by. Save your edits with <strong>Save Changes</strong>.</p><ul><li><strong>Name</strong>: required. Assets won't save an empty name.</li><li><strong>Description</strong>: free text. An asset with no description and no tags counts as missing metadata on the project overview.</li><li><strong>Status</strong> and <strong>Type</strong>: the same options as everywhere in the library.</li><li><strong>Folder</strong>: pick an existing folder, or type a new name and choose <strong>Create</strong> to start one.</li><li><strong>Tags</strong>: type a tag and press <code>Enter</code> or a comma. Tags are saved in lowercase, and a tag the asset already has is ignored. <code>Backspace</code> in the empty box removes the last tag.</li></ul><p>The <strong>Technical</strong> section shows the file as it was stored: original file name, MIME type, format, dimensions, size, storage status, checksum, and the asset's ID, creator and dates. Its <strong>Accent colour</strong> sets the color behind the asset's type icon across the library.</p>$html$,
      '[]',
      null,
      100
    ),
    (
      'relationships',
      'Asset details',
      'Relationships',
      $html$<p>Relationships link an asset to its originals, variants and the work it belongs to. In the asset editor, open <strong>Relationships</strong> and choose <strong>Add relationship</strong>.</p><ol><li>In <strong>Relation</strong>, choose Parent, Child, Derived, Variant, Source, Campaign or Product. It starts on Derived.</li><li>In <strong>Asset</strong>, search the project's other assets and pick one. Assets already linked aren't offered. To link something that isn't an asset, such as a campaign or a product, choose <strong>Link by name instead</strong> and type its name.</li><li>Choose <strong>Add link</strong>.</li></ol><p>Links save straight away. Each one shows the linked asset or name and its relation; links made by name are marked <em>Linked by name</em>. The × beside a link removes it at once, without asking.</p>$html$,
      '[]',
      null,
      110
    ),
    (
      'versions',
      'Asset details',
      'Versions',
      $html$<p>Every file uploaded to an asset is kept as a version. The <strong>Versions</strong> section of the asset editor lists them as v1, v2 and so on, each labeled with its file name, size and date, and marks the one in use as <strong>Current</strong>.</p><ul><li><strong>Replace file</strong> uploads a new file and makes it the current version. The same happens with <strong>Replace</strong> in the asset's <strong>⋯</strong> menu.</li><li><strong>Restore</strong>, beside an older version, makes that file current again. Nothing is deleted, so you can switch back the same way.</li></ul><p>A duplicated asset starts with no versions until you replace its file.</p>$html$,
      '[]',
      null,
      120
    ),
    (
      'delivery-and-transforms',
      'Asset details',
      'Delivery and transforms',
      $html$<p>Delivery gives an asset a public address that websites and apps can load it from. Turn it on in the asset editor's <strong>Delivery</strong> section with <strong>Enable delivery</strong>, then choose <strong>Save Changes</strong>. While it's off, every delivery address for the asset returns not found. New uploads start with delivery on when the project's <strong>Deliver new assets by default</strong> setting is on.</p><p>Once delivery is saved, the asset has a file and the project's <strong>URL transforms</strong> setting is on under <strong>Settings → General</strong>, the <strong>Playground</strong> previews a transformed copy:</p><ul><li><strong>Width</strong> (800 to start) and <strong>Height</strong>, in pixels.</li><li><strong>Crop</strong>: Fill (the default), Fit, Cover, Contain, Pad, Crop or Thumb.</li><li><strong>Format</strong>: Auto (the default), WebP, AVIF, JPEG or PNG.</li><li><strong>Quality</strong>: Auto (the default), 60, 70, 80 or 90.</li><li><strong>Effect</strong>: None, Blur, Sharpen, Grayscale, Sepia, Negate, Brightness, Contrast, Saturation or Tint.</li></ul><p>The copy icon copies the transformed copy's address. Anyone with a delivery address can load the file without signing in, unless the project's delivery settings limit it. See <a href="/help/assets/delivery">Delivery</a>.</p>$html$,
      '[]',
      null,
      130
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"CloudUpload","label":"Uploads & requests","href":"/help/assets/uploads"},{"icon":"Layers","label":"Collections & folders","href":"/help/assets/collections"},{"icon":"Image","label":"Media","href":"/help/assets/media"}]',
      null,
      140
    )
) as v(anchor_id, eyebrow, title, content, links, showcase, sort_order)
cross join (select id from public.docs_pages where slug = 'assets/library' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Asset library',
    description = 'Browse, search and manage every asset in the project, and open an asset''s details.',
    status = 'draft',
    published_at = null
where slug = 'assets/library' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'assets/library' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>All Media</li><li>The Asset Library</li><li>Asset details</li><li>Tags and metadata</li><li>Versions and relationships</li></ul>',
  10
from public.docs_pages p
where p.slug = 'assets/library' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
