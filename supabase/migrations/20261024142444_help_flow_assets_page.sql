-- Help flow assets page
--
-- One-time content move: replaces the flow/assets draft outline (20261024142436_help_flow_structure) with the
-- full Assets guide and publishes it. No section showcases exist for the Assets screen yet.
-- Written from a survey of C:\Pro\geiger-flow (components/internal/screens/projects/assets/*,
-- features/assets/actions.js, features/assets/constants.js, components/internal/shared/pagination.jsx).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Assets',
    description = 'Upload the project''s files, preview images, video and audio, tag and rename them, and download or share them from one library.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'flow/assets' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'flow/assets' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, showcase, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.showcase, v.sort_order
from (
  values
    (
      'uploading-files',
      'Basics',
      'Uploading files',
      $html$<p>To upload files, open a project in Flow, choose <strong>Assets</strong> in the sidebar, then <strong>Upload</strong>. You can also drag files from your computer onto the Assets page, which opens the same dialog with them already added.</p><ol><li>In <strong>Upload assets</strong>, drop files on the box or click it to choose them. You can add several at once.</li><li>Optional: remove a file with the × beside it, or choose <strong>Clear all</strong> to start over.</li><li>Choose <strong>Upload</strong>. The button counts the files, like <strong>Upload 3 files</strong>.</li></ol><p>Each file can be up to 25 MB. Flow skips empty files and anything larger, and tells you which file it skipped. Files upload one at a time, exactly as they are, with no compression, and the dialog stays open until they finish. A file that fails stays in the list, and the button changes to <strong>Retry</strong> so you can try it again.</p><p>Flow sorts each file into a type from its format: Image, Video, Audio, Document (PDF, Word, Excel, PowerPoint, TXT, CSV and Markdown files), Archive (ZIP, RAR, 7Z, TAR and GZ files) or Other. The person who uploads a file is its owner, shown by email address.</p>$html$,
      '[]',
      null,
      10
    ),
    (
      'asset-library',
      'Assets',
      'The asset library',
      $html$<p>The figures across the top of the asset library count every asset in the project: <strong>Total assets</strong> (with how many were added in the last 7 days), <strong>Storage used</strong> (with the average file size), <strong>Media files</strong> (images, video and audio) and the <strong>Largest file</strong>. Search and filters don't change them.</p><p><strong>Storage by type</strong> splits the space used by type, largest first. Click a type there to show only that type, and click it again to show everything.</p><p>Switch between <strong>Grid view</strong>, with a thumbnail for each file, and <strong>List view</strong>, with columns for name, type, size and upload date. Assets opens in Grid view each time.</p><p>Narrow the library with the type filter (<strong>All types</strong> by default), and sort it by <strong>Newest first</strong> (the default), <strong>Oldest first</strong>, <strong>Largest first</strong> or <strong>Name A–Z</strong>. The search box matches file names, tags and owners. When nothing matches, <strong>Clear filters</strong> resets the search and the type filter and leaves the sort as it is.</p><p>The library shows the project's default number of rows a page, 10 unless someone changed it under <strong>Settings → General → Default rows per page</strong>. Switch to 10, 25, 50 or 100 at the bottom.</p>$html$,
      '[]',
      null,
      20
    ),
    (
      'asset-details',
      'Assets',
      'Asset details',
      $html$<p>Click an asset, or choose <strong>View details</strong> in its <strong>⋯</strong> menu, to open its details. Images show in full, and video and audio play in the details. Other files have no preview, so open or download them to view them.</p><ul><li><strong>Download</strong> saves the file under its current name.</li><li><strong>Open</strong> shows the file in a new browser tab.</li><li><strong>Copy link</strong> copies the file's web address. Anyone who has the link can open the file, without signing in.</li></ul><p><strong>Details</strong> lists the file's type, size, owner, upload date and when it was last updated.</p><p>In <strong>Tags</strong>, type a tag and press <code>Enter</code> or a comma. <code>Backspace</code> in the empty box removes the last tag, and the × on a tag removes that one. Tags save as you change them, and the library's search finds assets by their tags.</p><p>Each asset's <strong>⋯</strong> menu has the same actions without opening the details: <strong>Open in new tab</strong>, <strong>Download</strong> and <strong>Copy link</strong>.</p>$html$,
      '[]',
      null,
      30
    ),
    (
      'renaming-and-deleting',
      'Assets',
      'Renaming and deleting',
      $html$<p>To rename an asset, choose <strong>Rename</strong> in its <strong>⋯</strong> menu or at the bottom of its details. In <strong>File name</strong>, Flow selects the name before the extension, so what you type keeps the extension. Choose <strong>Rename</strong> to save; it stays disabled while the name is empty. <strong>Download</strong> then saves the file under the new name.</p><p>To delete an asset, choose <strong>Delete</strong> in the same places. Flow asks you to confirm, then removes the asset and its stored file from the project. A deleted asset can't be restored from Flow.</p><p>Assets have no folders. To group related files, give them the same tag and search for it.</p>$html$,
      '[]',
      null,
      40
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"Waypoints","label":"Planning board","href":"/help/flow/planning"},{"icon":"Radio","label":"Grounding","href":"/help/flow/grounding"},{"icon":"Settings","label":"Project settings","href":"/help/flow/settings"}]',
      null,
      50
    )
) as v(anchor_id, eyebrow, title, content, links, showcase, sort_order)
cross join (select id from public.docs_pages where slug = 'flow/assets' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Assets',
    description = 'Upload, preview and organize the project''s files and media.',
    status = 'draft',
    published_at = null
where slug = 'flow/assets' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'flow/assets' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Uploading files</li><li>Previewing and downloading</li><li>Storage</li></ul>',
  10
from public.docs_pages p
where p.slug = 'flow/assets' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
