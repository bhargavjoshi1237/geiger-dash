-- Help assets archive page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the assets/archive draft outline
-- (20261024191200_help_assets_structure) with the full Archive & trash guide and publishes it. No section showcases
-- exist for Assets yet. Duplicate Review is left out: nothing in Assets creates duplicate groups, so the screen stays
-- empty for every real project.
-- Written from a survey of C:\Pro\geiger-assets (components/internal/screens/projects/archive/*,
-- components/internal/screens/projects/duplicates/*, lib/supabase/archive.js, lib/supabase/duplicates.js,
-- lib/storage/service.js (softDeleteAssetFile, purgeAssetFile), app/api/storage/object/route.js, lib/storage/auth.js,
-- supabase/migrations/20260927110602_governance.sql).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Archive & trash',
    description = 'Retire assets to the archive, find what was deleted in the trash, restore either, and delete assets permanently when you''re sure.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'assets/archive' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'assets/archive' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, showcase, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.showcase, v.sort_order
from (
  values
    (
      'archiving-an-asset',
      'Basics',
      'Archiving an asset',
      $html$<p>To archive an asset you no longer use, set its status to Archived: in the Asset Library, click the asset and pick <strong>Archived</strong> in <strong>Status</strong> in its quick view, which saves straight away. You can also change <strong>Status</strong> in the asset editor and choose <strong>Save Changes</strong>.</p><p>An archived asset keeps its file, folder, tags and collections, and it stays in the Asset Library with the Archived label. It's also listed under <strong>Assets → Archive & Trash</strong>, where you can restore it or move it to the trash. See <a href="/help/assets/library">Asset library</a>.</p>$html$,
      '[]',
      null,
      10
    ),
    (
      'archive-and-trash',
      'Concepts',
      'Archive and trash',
      $html$<p>Assets has two ways to take an asset out of use, and you can undo both.</p><ul><li><strong>Archived</strong> assets are retired but still live: they stay in the library, search and folders, marked Archived. Restoring one sets its status back to Draft.</li><li><strong>Trashed</strong> assets are deleted: they leave the library, its search and the folders, and wait in the trash. Restoring one puts it back where it was, with the status it had.</li></ul><p>Nothing leaves the trash on its own; an asset stays there until someone restores it or deletes it permanently. Its file keeps using storage until then.</p><p>An asset under an active legal hold can't be moved to the trash or deleted permanently. See <a href="/help/assets/governance">Governance</a>.</p>$html$,
      '[]',
      null,
      20
    ),
    (
      'archive-and-trash-screen',
      'Archive & Trash',
      'The Archive & Trash screen',
      $html$<p>Open a project in Assets and choose <strong>Assets → Archive & Trash</strong> in the sidebar. The buttons at the top right switch between <strong>Archived</strong> and <strong>Trash</strong>; it opens on Archived.</p><p>The figures across the top count both: <strong>Archived</strong>, <strong>In Trash</strong>, <strong>Trash Size</strong> (the space trashed files still use) and <strong>Recoverable</strong> (everything in either list).</p><p>Each row shows the asset's name and up to three tags, its type, size and folder, and the date it was archived or trashed. Filter by type, search by name, format and tags, and sort by <strong>Newest First</strong> (the default), <strong>Oldest First</strong>, <strong>Name A–Z</strong>, <strong>Name Z–A</strong>, <strong>Largest Size</strong> or <strong>Smallest Size</strong>. Switching between Archived and Trash clears the search and filter and sorts by Newest First again.</p><p>Click a row, or choose <strong>View</strong> in its <strong>⋯</strong> menu, to see the asset's preview, details, retention dates and a timeline of when it was created, last updated and archived or trashed.</p>$html$,
      '[]',
      null,
      30
    ),
    (
      'restoring-assets',
      'Archive & Trash',
      'Restoring assets',
      $html$<p>To restore an asset, choose <strong>Restore</strong> in its <strong>⋯</strong> menu on Archive & Trash, or at the top of its page when you view it. It happens straight away.</p><ul><li>From <strong>Archived</strong>, the asset's status goes back to Draft.</li><li>From <strong>Trash</strong>, the asset goes back to the library with the folder, tags, collections and status it had.</li></ul><p>On the Archived list, <strong>Move to Trash</strong> in the same menu trashes an archived asset without asking. Restoring it from the trash returns it to the archive.</p>$html$,
      '[]',
      null,
      40
    ),
    (
      'deleting-permanently',
      'Archive & Trash',
      'Deleting permanently',
      $html$<p>To free an asset's storage for good, open <strong>Trash</strong> on Archive & Trash and choose <strong>Delete permanently</strong> in the asset's <strong>⋯</strong> menu, or at the top of its page. Assets asks you to confirm, then removes the asset, its file, every earlier version and any converted copies. This can't be undone.</p><p>Deleting permanently needs a role that includes <strong>Delete an asset</strong>; of the built-in roles, Owner and Admin have it. It fails for an asset under an active legal hold. Roles are covered in <a href="/help/assets/settings#permissions-and-security">Project settings</a>.</p>$html$,
      '[]',
      null,
      50
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"FolderOpen","label":"Asset library","href":"/help/assets/library"},{"icon":"ShieldCheck","label":"Governance","href":"/help/assets/governance"},{"icon":"Layers","label":"Collections & folders","href":"/help/assets/collections"}]',
      null,
      60
    )
) as v(anchor_id, eyebrow, title, content, links, showcase, sort_order)
cross join (select id from public.docs_pages where slug = 'assets/archive' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Archive & trash',
    description = 'Archive what you no longer use, and restore or permanently delete what you''ve deleted.',
    status = 'draft',
    published_at = null
where slug = 'assets/archive' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'assets/archive' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Archive</li><li>Trash</li><li>Restoring and deleting permanently</li></ul>',
  10
from public.docs_pages p
where p.slug = 'assets/archive' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
