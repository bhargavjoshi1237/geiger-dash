-- Help assets collections page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the assets/collections draft outline
-- (20261024191200_help_assets_structure) with the full Collections & folders guide and publishes it. No section
-- showcases exist for Assets yet. Left out on purpose: a collection's Share link (it points at an address that
-- serves the creator page instead), folder storage locations (a label that moves nothing), and renaming or moving
-- folders (files keep the old folder path and drop to the project root).
-- Written from a survey of C:\Pro\geiger-assets (components/internal/screens/projects/collections/*,
-- components/internal/screens/projects/folders/*, components/internal/shared/folder_explorer.jsx,
-- components/internal/screens/projects/library/use_asset_actions.jsx, lib/supabase/collections.js,
-- lib/supabase/folders.js, lib/share.js, lib/delivery/copy_link.js).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Collections & folders',
    description = 'Group assets into collections without moving them, and organize where files live with folders: create, browse, move files and tidy up.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'assets/collections' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'assets/collections' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, showcase, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.showcase, v.sort_order
from (
  values
    (
      'creating-a-collection',
      'Basics',
      'Creating a collection',
      $html$<p>A collection groups assets for a purpose, such as a launch or a brand kit, without moving them: an asset stays in its folder and can sit in any number of collections. To create one, open a project in Assets, choose <strong>Assets → Collections</strong> in the sidebar, then <strong>New Collection</strong>.</p><ul><li><strong>Name</strong>: required. <strong>Create Collection</strong> stays disabled until there is one.</li><li><strong>Description</strong>: what the collection is for.</li><li><strong>Type</strong>: Manual, Smart, Album or Board. New collections are Manual.</li><li><strong>Visibility</strong>: Private, Team or Public. New collections are Private.</li><li><strong>Favorite</strong>: turn it on to star the collection.</li></ul><p>Choose <strong>Create Collection</strong>, then click the collection to add assets to it.</p>$html$,
      '[]',
      null,
      10
    ),
    (
      'types-and-visibility',
      'Concepts',
      'Collection types and visibility',
      $html$<p>A collection's type, visibility and status are labels that help you sort and find collections. They don't change what the collection holds or who can open it.</p><ul><li><strong>Type</strong>: Manual, Smart, Album or Board. Assets doesn't fill any type automatically, so you add assets to every collection yourself.</li><li><strong>Visibility</strong>: Private, Team or Public, shown on the collection list and the project overview. Everyone who can open the project can open its collections, whatever their visibility.</li><li><strong>Status</strong>: Active or Archived. New collections are Active.</li></ul><p>To show a collection to people outside the project, turn it into a gallery or create a share link for it. See <a href="/help/assets/galleries">Galleries</a> and <a href="/help/assets/collaboration">Collaboration</a>.</p>$html$,
      '[]',
      null,
      20
    ),
    (
      'collection-list',
      'Collections',
      'The collection list',
      $html$<p>The figures across the top of Collections count every collection in the project: <strong>Total Collections</strong>, <strong>Smart</strong>, <strong>Favorites</strong> and <strong>Shared</strong> (Team or Public). Search and filters don't change them.</p><p>Each row shows the collection's name and description, a star if it's a favorite, its type, visibility, number of assets and last update. Filter the list by type and visibility, search it by name and description, and sort it by <strong>Last Modified</strong> (the default), <strong>Oldest Modified</strong>, <strong>Name A–Z</strong>, <strong>Name Z–A</strong>, <strong>Most Assets</strong> or <strong>Fewest Assets</strong>. It shows 25 collections a page; switch to 10, 50 or 100 at the bottom.</p><p>Each row's <strong>⋯</strong> menu has <strong>Open</strong>, <strong>Favorite</strong> (or <strong>Unfavorite</strong>) and <strong>Delete</strong>. Delete removes the collection straight away, without asking, and it can't be restored from Assets. The assets in it stay in the library.</p>$html$,
      '[]',
      null,
      30
    ),
    (
      'adding-and-removing-assets',
      'Collections',
      'Adding and removing assets',
      $html$<p>Click a collection to open it. Its <strong>Assets</strong> section shows every asset in it as a thumbnail.</p><ol><li>Choose <strong>Add assets</strong>. The dialog lists the library's assets that aren't in the collection yet.</li><li>Optional: search by name or file format.</li><li>Click an asset to add it. It's added straight away, and you can keep clicking to add more.</li></ol><p>To take an asset out, use the × on its thumbnail. That only removes it from the collection; the asset stays in the library.</p><p>You can also add an asset from the library: choose <strong>Add to Collection</strong> in its <strong>⋯</strong> menu in the Asset Library and click a collection. See <a href="/help/assets/library">Asset library</a>.</p>$html$,
      '[]',
      null,
      40
    ),
    (
      'collection-details',
      'Collections',
      'Collection details',
      $html$<p>In an open collection, <strong>Collection details</strong> holds its <strong>Name</strong>, <strong>Description</strong>, <strong>Type</strong>, <strong>Visibility</strong>, <strong>Status</strong> and <strong>Favorite</strong> switch. The <strong>Sharing</strong> section has the same Visibility setting.</p><p>Changes here wait for <strong>Save Changes</strong> at the top, or <code>Ctrl S</code> (<code>⌘ S</code> on Mac), and a collection needs a name to save. <strong>Discard</strong> drops your edits. If you go back to <strong>Collections</strong> or switch sections with unsaved edits, Assets asks whether to save them first. Adding and removing assets saves straight away and doesn't wait for Save Changes.</p>$html$,
      '[]',
      null,
      50
    ),
    (
      'browsing-folders',
      'Folders',
      'Browsing folders',
      $html$<p>Folders decide where each asset lives in the project: every asset sits in exactly one folder, or at the top level, <strong>Project root</strong>. To browse them, open a project in Assets and choose <strong>Assets → Folders</strong> in the sidebar.</p><p>The figures across the top show <strong>Total Folders</strong> and <strong>Storage Used</strong>. The explorer under them shows where you are as a path that starts at Project root; click any part of the path to go back up. Inside a folder you see its subfolders, then its files with their format and size.</p><ul><li>Click a folder to select it, and double-click it to open it.</li><li>Search folders by name with the box at the top of the explorer.</li><li><strong>Open Containing Folder</strong> in an asset's menu in the Asset Library opens Folders at that asset's folder.</li></ul><p>An asset's folder is also its <strong>Folder</strong> field in the asset editor, and where uploads land when you pick a destination folder.</p>$html$,
      '[]',
      null,
      60
    ),
    (
      'creating-folders',
      'Folders',
      'Creating folders',
      $html$<p>To create a folder, open the folder you want it in (or stay at Project root) and choose <strong>New Folder</strong>. Type a name and press <code>Enter</code> or choose <strong>Create</strong>; <code>Esc</code> cancels. In an empty folder, <strong>New folder here</strong> does the same.</p><p>To create a folder inside another one without opening it first, choose <strong>New subfolder</strong> in that folder's <strong>⋯</strong> menu. You can nest folders as deep as you need.</p><p>You can also create folders while you work elsewhere: in the <strong>Choose a folder</strong> dialog when you pick an upload's destination folder, and in an asset's <strong>Folder</strong> field, where typing a new name offers <strong>Create</strong>.</p>$html$,
      '[]',
      null,
      70
    ),
    (
      'moving-files',
      'Folders',
      'Moving files between folders',
      $html$<p>To move a file to another folder, drag it onto that folder in the explorer, or onto <strong>Project root</strong> in the path. You can also choose <strong>Move to…</strong> in the file's <strong>⋯</strong> menu, pick the destination and choose <strong>Move</strong>. Assets confirms where the file went.</p><p>Each file's <strong>⋯</strong> menu also has:</p><ul><li><strong>Copy link</strong>: copies the file's public delivery address. It works only once delivery is turned on for that asset.</li><li><strong>Copy name</strong>: copies the asset's name.</li><li><strong>Delete</strong>: moves the asset to the trash straight away, without asking. Restore it from <strong>Archive & Trash</strong>; see <a href="/help/assets/archive">Archive and trash</a>.</li></ul>$html$,
      '[]',
      null,
      80
    ),
    (
      'folder-details',
      'Folders',
      'Folder details and deleting folders',
      $html$<p>Each folder's <strong>⋯</strong> menu has <strong>Open</strong>, <strong>New subfolder</strong>, <strong>Details</strong>, <strong>Copy path</strong> and <strong>Delete</strong>.</p><ul><li><strong>Details</strong> opens the folder's page: its subfolders and storage use, and the <strong>Color</strong> of its icon, which you pick from eight swatches and keep with <strong>Save Changes</strong>.</li><li><strong>Copy path</strong> copies the folder's path, such as <code>/Campaigns/Spring</code>.</li><li><strong>Delete</strong> removes the folder straight away, without asking. The files that were in it aren't deleted: they show under Project root.</li></ul>$html$,
      '[]',
      null,
      90
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"FolderOpen","label":"Asset library","href":"/help/assets/library"},{"icon":"GalleryHorizontalEnd","label":"Galleries","href":"/help/assets/galleries"},{"icon":"Archive","label":"Archive & trash","href":"/help/assets/archive"}]',
      null,
      100
    )
) as v(anchor_id, eyebrow, title, content, links, showcase, sort_order)
cross join (select id from public.docs_pages where slug = 'assets/collections' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Collections & folders',
    description = 'Group assets into collections and organize where they''re stored with folders.',
    status = 'draft',
    published_at = null
where slug = 'assets/collections' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'assets/collections' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Collections</li><li>Folders</li></ul>',
  10
from public.docs_pages p
where p.slug = 'assets/collections' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
