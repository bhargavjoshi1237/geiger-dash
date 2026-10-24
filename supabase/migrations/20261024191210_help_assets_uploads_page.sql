-- Help assets uploads page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the assets/uploads draft outline
-- (20261024191200_help_assets_structure) with the full Uploads & requests guide and publishes it. No section
-- showcases exist for Assets yet. Upload portals (links and forms for outside contributors) and the Dropbox,
-- OneDrive, S3, R2 and FTP source cards are left out: portal links have no public page to land on, and those
-- source cards only toggle on screen.
-- Written from a survey of C:\Pro\geiger-assets (components/internal/screens/projects/uploads/*,
-- components/internal/screens/projects/external_uploads/*, components/internal/screens/projects/requests/*,
-- components/internal/shared/file_dropzone.jsx, folder_explorer.jsx, lib/storage/client.js, lib/storage/presets.js,
-- lib/storage/optimize-client.js, lib/storage/service.js, lib/s3/config.js, lib/integrations/google_drive.js,
-- lib/integrations/google_server.js, lib/supabase/uploads.js, lib/supabase/requests.js, lib/share.js,
-- app/api/storage/*).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Uploads & requests',
    description = 'Upload files in bulk, import them from links, a CSV or Google Drive, and request missing creative work from your team.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'assets/uploads' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'assets/uploads' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, showcase, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.showcase, v.sort_order
from (
  values
    (
      'uploading-files',
      'Basics',
      'Uploading files',
      $html$<p>To upload files in bulk, open a project in Assets and choose <strong>Assets → Upload Center</strong> in the sidebar.</p><ol><li>Drag files onto the drop area, or choose <strong>browse your device</strong>. You can add several at once, and <strong>Add more</strong> adds others.</li><li>Optional: remove a file with the × beside it, or choose <strong>Clear all</strong> to start over. The area counts the files and their total size.</li><li>Optional: at the top right, choose a destination folder (<strong>Project root</strong> to start) and a quality preset (<strong>Original</strong> to start).</li><li>Choose <strong>Upload</strong>. The button counts the files, like <strong>Upload 3 files</strong>.</li></ol><p>Assets uploads three files at a time and lists each one in the queue under the drop area as it goes. Each file becomes a Draft asset named after the file, in the folder you picked. When they finish, Assets tells you how many uploaded and how many failed.</p><p>Uploading needs a role that includes <strong>Edit an asset</strong>, which every built-in role except Viewer has. To add a single file with its name, type and status set up front, use <strong>Upload</strong> in the Asset Library, covered in <a href="/help/assets/library">Asset library</a>.</p>$html$,
      '[]',
      null,
      10
    ),
    (
      'file-types-and-limits',
      'Concepts',
      'Supported files and limits',
      $html$<p>Assets accepts images, video, audio and these files:</p><ul><li><strong>Documents</strong>: PDF, Word, Excel, PowerPoint, TXT, CSV and Markdown.</li><li><strong>Archives</strong>: ZIP, RAR, 7Z, TAR and GZ.</li><li><strong>3D models</strong>: GLB, glTF, OBJ, FBX, BLEND, USDZ and STL.</li><li><strong>Camera RAW</strong>: ARW, CR2, CR3, NEF, DNG and RAF.</li></ul><p>Any other file is refused with "That file type isn't supported." A file over the size limit is refused with "That file exceeds the size limit."</p><p>Assets sets each asset's type from its file: Image, Video, Audio, Document, PDF, 3D Model, Raw or Archive. Change it later in the asset's details if it's wrong.</p>$html$,
      '[]',
      null,
      20
    ),
    (
      'quality-presets',
      'Concepts',
      'Quality presets',
      $html$<p>A quality preset decides whether Assets shrinks images before storing them. The Upload Center and External Uploads both offer three, and both start on Original:</p><ul><li><strong>Original</strong>: files are stored exactly as uploaded.</li><li><strong>Web</strong>: still images are converted to WebP, at most 2048 px on their longest side.</li><li><strong>Compressed</strong>: still images get the smallest files, at most 1600 px on their longest side.</li></ul><p>Only still images that your browser can open are converted. SVG, GIF and icon files stay as they are, and so does any image the conversion wouldn't make smaller. Video, audio, documents and other files are never changed.</p><p>The Asset Library's <strong>Upload</strong> dialog works the other way round: it converts images like Web unless you turn on <strong>Upload lossless</strong>.</p>$html$,
      '[]',
      null,
      30
    ),
    (
      'upload-queue',
      'Upload Center',
      'The upload queue',
      $html$<p>The queue under the drop area in the Upload Center lists every upload in the project, with its file, type, size, progress, status and the date it was created. An upload's status is Queued, Uploading, Processing, Completed or Failed.</p><p>Filter the queue by status, search it by file name, and sort it by <strong>Newest First</strong> (the default), <strong>Oldest First</strong>, <strong>Name A–Z</strong>, <strong>Name Z–A</strong>, <strong>Largest Size</strong>, <strong>Smallest Size</strong> or <strong>Most Progress</strong>. It shows 25 uploads a page; switch to 10, 50 or 100 at the bottom.</p><p>Each row's <strong>⋯</strong> menu has three actions:</p><ul><li><strong>View</strong> opens the upload's record: its file, source, status, progress and any error, the asset it produced under <strong>Output</strong>, and when it was created and last updated.</li><li><strong>Retry</strong> uploads a failed file again. Assets holds on to the file only while you stay on the Upload Center, so after you leave, drop the file in again instead.</li><li><strong>Delete</strong> removes the row from the queue straight away. The asset it created stays in the library.</li></ul>$html$,
      '[]',
      null,
      40
    ),
    (
      'importing-from-links',
      'External Uploads',
      'Importing from links',
      $html$<p>To import files from public web addresses, open a project in Assets and choose <strong>Assets → External Uploads</strong> in the sidebar.</p><ol><li>Paste links into the box, one per line. Spaces and commas between links work too.</li><li>Choose <strong>Add links</strong>, or press <code>Ctrl Enter</code> (<code>⌘ Enter</code> on Mac). The links join a list that marks any <strong>Invalid link</strong> and any link <strong>Already imported</strong>; Assets skips those.</li><li>Optional: under <strong>Import options</strong>, pick a <strong>Destination folder</strong>, add <strong>Tags</strong> and choose a <strong>Quality preset</strong>. They apply to every link in the batch.</li><li>Choose <strong>Import</strong>. The button counts the links that are ready, like <strong>Import 4 links</strong>.</li></ol><p>Assets downloads two links at a time and adds each file to the library as a Draft asset. Each file can be up to 4 MB, and each link has to be a web address (http or https). A link that fails shows why, such as "Couldn't download from that link." or "The source took too long to respond."</p>$html$,
      '[]',
      null,
      50
    ),
    (
      'importing-from-a-csv',
      'External Uploads',
      'Importing links from a CSV',
      $html$<p>To bring in a column of links from a spreadsheet export, choose the spreadsheet icon (<strong>Import links from CSV</strong>) beside the link box in External Uploads.</p><ol><li>Drop a CSV file on the dialog, or click to choose one.</li><li>Check <strong>First row is a header</strong>. Assets turns it on unless the first row holds a link; with it on, Assets skips that row and names the columns from it.</li><li>In <strong>Link column</strong>, pick the column that holds the links. Assets starts on the column with the most links in it.</li><li>Choose <strong>Add</strong>. The button counts the links found, like <strong>Add 120 links</strong>.</li></ol><p>Rows whose cell isn't a link are skipped, and each link is added once. The links join the list in External Uploads, where you set the import options and choose <strong>Import</strong>. Assets reads up to 10,000 rows from one file.</p>$html$,
      '[]',
      null,
      60
    ),
    (
      'importing-from-google-drive',
      'External Uploads',
      'Importing from Google Drive',
      $html$<p>To import files from Google Drive, choose <strong>Connect Google Drive</strong> at the top of External Uploads, sign in to Google and allow access. The connection belongs to you, not to the project, so it works in every project you open. If you don't see the button, Google Drive import isn't set up for Assets.</p><p>Once you're connected, the button reads <strong>Import from Drive</strong>:</p><ol><li>Optional: set the <strong>Import options</strong> first. The destination folder, tags and quality preset apply to Drive files too.</li><li>Choose <strong>Import from Drive</strong> and pick files in Google's file picker.</li><li>Confirm in the picker. Assets imports two files at a time and counts them on the button as it goes.</li></ol><p>Google Docs, Sheets and Slides come in as PDF files, and Google Drawings as PNG. Folders and other Google items are skipped. To disconnect, choose <strong>Sources & Portals</strong>, then the disconnect button on the <strong>Google Drive</strong> card.</p>$html$,
      '[]',
      null,
      70
    ),
    (
      'import-list',
      'External Uploads',
      'The import list',
      $html$<p>The list at the bottom of External Uploads shows every link and Google Drive import in the project, with its file name and source address, type, status, size and the date it was added.</p><p>Filter it by <strong>Importing</strong>, <strong>Imported</strong> or <strong>Failed</strong>, search it by file name or address, and sort it by <strong>Newest First</strong> (the default), <strong>Oldest First</strong>, <strong>Name A-Z</strong>, <strong>Name Z-A</strong> or <strong>Largest Size</strong>.</p><p>Each row's <strong>⋯</strong> menu has <strong>View details</strong>, <strong>Retry import</strong> for a failed import, <strong>Copy link</strong> and <strong>Open source</strong> for a link, and <strong>Remove</strong>. Remove takes the row off the list straight away; the asset it created stays in the library.</p>$html$,
      '[]',
      null,
      80
    ),
    (
      'requesting-an-asset',
      'Asset Requests',
      'Requesting an asset',
      $html$<p>Asset requests track creative work that the library is missing until someone delivers it. Open a project in Assets, choose <strong>Assets → Asset Requests</strong> in the sidebar, then <strong>New Request</strong>.</p><ul><li><strong>Title</strong>: required.</li><li><strong>Description</strong>: what's needed.</li><li><strong>Requester</strong> and <strong>Assignee</strong>: who is asking and who will deliver, typed as names.</li><li><strong>Priority</strong>: Low, Medium, High or Urgent. New requests are Medium.</li><li><strong>Status</strong>: Open, In Progress, Submitted, Approved or Closed. New requests are Open.</li><li><strong>Due date</strong>: optional.</li></ul><p>Choose <strong>Create Request</strong>. The requester and assignee are names on the request, not accounts, so nobody is notified; tell them yourself.</p>$html$,
      '[]',
      null,
      90
    ),
    (
      'tracking-requests',
      'Asset Requests',
      'Tracking requests',
      $html$<p>The figures across the top of Asset Requests count every request: <strong>Open</strong>, <strong>In Progress</strong>, <strong>Overdue</strong> and <strong>Closed</strong>. A request is overdue once its due date has passed and it isn't Approved or Closed; its date shows in red.</p><p>Filter the list by status and priority, search it by title, requester or assignee, and sort it by <strong>Last Updated</strong> (the default), <strong>Oldest Updated</strong>, <strong>Due Soonest</strong>, <strong>Due Latest</strong>, <strong>Title A–Z</strong> or <strong>Title Z–A</strong>. Due Soonest puts requests without a due date first.</p><p>Each row's <strong>⋯</strong> menu has <strong>Open</strong>, <strong>Mark In Progress</strong>, <strong>Mark Approved</strong> and <strong>Delete</strong>. Delete removes the request straight away, without asking, and it can't be restored from Assets.</p>$html$,
      '[]',
      null,
      100
    ),
    (
      'request-details',
      'Asset Requests',
      'Request details',
      $html$<p>Click a request to open its details. <strong>Request details</strong> has the same fields as a new request, plus <strong>Reference asset</strong>, where you link an asset from the library, such as the delivered file. Choose <strong>Save Changes</strong> to keep your edits; a request needs a title to save.</p><p><strong>Deliverables</strong> shows the linked asset, and <strong>Activity</strong> shows when the request was created and last updated. <strong>Requests</strong> at the top left goes back to the list, and Assets asks first if you have unsaved edits.</p>$html$,
      '[]',
      null,
      110
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"FolderOpen","label":"Asset library","href":"/help/assets/library"},{"icon":"Layers","label":"Collections & folders","href":"/help/assets/collections"},{"icon":"Workflow","label":"Workflows","href":"/help/assets/workflows"}]',
      null,
      120
    )
) as v(anchor_id, eyebrow, title, content, links, showcase, sort_order)
cross join (select id from public.docs_pages where slug = 'assets/uploads' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Uploads & requests',
    description = 'Bring files into Assets, collect them from people outside your team, and request missing work.',
    status = 'draft',
    published_at = null
where slug = 'assets/uploads' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'assets/uploads' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Upload Center</li><li>External Uploads</li><li>Asset Requests</li></ul>',
  10
from public.docs_pages p
where p.slug = 'assets/uploads' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
