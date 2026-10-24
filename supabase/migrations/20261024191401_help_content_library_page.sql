-- Help content library page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the content/library draft outline with the
-- full Content library guide and publishes it. Content has no section showcases yet, so the page is text only.
-- Written from a survey of C:\Pro\geiger-content (components/internal/screens/content/*, components/internal/shared/
-- editor_shell.jsx and pagination.jsx, components/internal/screens/editorial/body_blocks.jsx and body_doc.js,
-- lib/supabase/{content,collections,assets,slots,storage}.js, lib/delivery/core.mjs, app/c/[id]/*, app/api/decide/route.js,
-- app/api/cron/publish-due/route.js, supabase/migrations/20261001081041_project_scoped_rls.sql).
-- Left out: a slot's Eligible entries list and its Paused or Archived status (stored, but delivery doesn't read them),
-- the delete dialog's claim that entries using an asset's URL break (the file stays in storage), and page-view tracking
-- on public pages (its beacon posts to /api/... without the /content prefix, so it fails in production).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Content library',
    description = 'Create, edit, publish and archive entries, group them into collections, keep media in assets, and set up content slots for your apps.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'content/library' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'content/library' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, showcase, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.showcase, v.sort_order
from (
  values
    (
      'creating-an-entry',
      'Basics',
      'Creating an entry',
      $html$<p>To create an entry, open a project in Content, choose <strong>Content → All Content</strong> in the sidebar, then <strong>Create content</strong>. Only the title is required: without one, Content shows "Give your content a title first." Press <code>Enter</code> in the title, or choose <strong>Create content</strong>, to add the entry.</p><ul><li><strong>Title</strong>: the entry's name. Content makes the slug from it, in lowercase with dashes, and you can change the slug later.</li><li><strong>Type</strong>: Article, Page, Guide or Doc. New entries are an Article.</li><li><strong>Locale</strong>: en (English, the default), en-IN or de (German).</li><li><strong>Excerpt</strong>: an optional one-line summary for cards and previews.</li></ul><p>New entries start as Draft and appear at the top of the list. You add the body, the cover and the publishing settings in the entry editor. <strong>Create content</strong> only shows for roles with the Edit an entry or page permission.</p>$html$,
      '[]',
      null,
      10
    ),
    (
      'statuses-and-types',
      'Concepts',
      'Entry statuses and types',
      $html$<p>Every entry has a status, and the status decides whether the entry is live.</p><ul><li><strong>Draft</strong>: being written and not yet submitted. New entries start here.</li><li><strong>In review</strong>: waiting for approval.</li><li><strong>Scheduled</strong>: queued to go live. Content publishes a Scheduled entry once its scheduled date arrives.</li><li><strong>Published</strong>: live. Only published entries reach the delivery APIs and have a public page.</li><li><strong>Archived</strong>: out of delivery, and kept so you can restore it.</li></ul><p>The type says what kind of entry it is: Article, Page, Guide or Doc. Entries of the Page type also have their own screen, <strong>Content → Pages</strong>.</p><p>Setting an entry to Published or Scheduled, or changing an entry that's already Published or Scheduled, needs the Publish an entry or page permission. The Owner, Admin and Editor roles have it. Writers can create and edit entries that aren't Published or Scheduled. <a href="/help/content/governance">Governance</a> covers roles and permissions.</p>$html$,
      '[]',
      null,
      20
    ),
    (
      'entry-list',
      'All Content',
      'The entry list',
      $html$<p><strong>Content → All Content</strong> lists every entry in the project, newest first. Each row shows the entry's title, its slug, type and last update date, then its status and type.</p><p>The figures across the top count the entries on the screen: <strong>Total entries</strong> (with how many are published), <strong>Published</strong>, <strong>In review</strong> and <strong>Drafts</strong>. Search and filters don't change them.</p><p>Narrow the list with the status filter, which starts on <strong>All Statuses</strong>, and the type filter, which starts on <strong>All Types</strong>. The search box matches titles, slugs and excerpts. When nothing matches, the list shows "No entries match your filters".</p><p>The list shows 25 entries a page; switch to 10, 50 or 100 at the bottom. Click an entry to open it in the editor, or use its <strong>⋯</strong> menu: <strong>Edit</strong>, <strong>Duplicate</strong>, <strong>View page</strong> (published entries only) and <strong>Delete</strong>.</p>$html$,
      '[]',
      null,
      30
    ),
    (
      'drafts-pages-scheduled-archived',
      'Content',
      'Drafts, Pages, Scheduled and Archived',
      $html$<p>Four more screens under <strong>Content</strong> in the sidebar each show part of the entry list, with the same search, filters, paging and <strong>⋯</strong> menu as <strong>All Content</strong>:</p><ul><li><strong>Drafts</strong> shows Draft entries. <strong>Create draft</strong> adds a new Draft.</li><li><strong>Pages</strong> shows entries of the Page type. <strong>Create page</strong> adds a Page, as a Draft.</li><li><strong>Scheduled</strong> shows Scheduled entries, with their scheduled date in the <strong>Scheduled</strong> column. <strong>Schedule content</strong> adds an entry that's already Scheduled, so set its date in the editor's <strong>Visibility</strong> tab. Creating a Scheduled entry needs the Publish an entry or page permission.</li><li><strong>Archived</strong> shows Archived entries, and each row's <strong>⋯</strong> menu adds <strong>Restore as draft</strong>. It sets the entry back to Draft straight away.</li></ul><p>An entry moves between these screens when its status or type changes. To schedule or archive an entry, open it and change <strong>Status</strong> in its <strong>Visibility</strong> tab.</p>$html$,
      '[]',
      null,
      40
    ),
    (
      'editing-an-entry',
      'All Content',
      'Editing an entry',
      $html$<p>Click an entry in any entry list to open it in the editor. The tabs down the side group its fields:</p><ul><li><strong>Overview</strong>: <strong>Excerpt</strong>, <strong>Author</strong> and <strong>Locale</strong>.</li><li><strong>Basics</strong>: <strong>Title</strong>, <strong>Slug</strong> and <strong>Type</strong>.</li><li><strong>Body</strong>: the entry's text, as headings and paragraphs.</li><li><strong>Media</strong>: the <strong>Cover URL</strong>, the web address of the cover image. To use an uploaded file, copy its URL from <strong>Content → Assets</strong>.</li><li><strong>Visibility</strong>: <strong>Status</strong> and <strong>Scheduled date</strong>.</li><li><strong>Team</strong>: the same <strong>Author</strong> field as <strong>Overview</strong>.</li></ul><p>Nothing saves until you choose <strong>Save Changes</strong>, and Content confirms with "Changes saved." Changes you haven't saved are lost when you go back to the list with the back link at the top, which is named after the list you came from.</p>$html$,
      '[]',
      null,
      50
    ),
    (
      'writing-the-body',
      'All Content',
      'Writing the body',
      $html$<p>The <strong>Body</strong> tab in the entry editor builds the entry's body from blocks. Each block is a <strong>Paragraph</strong> or a <strong>Heading</strong>: pick the kind from the menu beside it, then type the text. <strong>Add paragraph</strong> and <strong>Add heading</strong> add a block at the end, and the trash icon beside a block removes it. Removing the only block leaves one empty paragraph.</p><p>Blocks hold plain text, without bold, links or images. Choose <strong>Save Changes</strong> to keep the body. The <strong>Structured Editor</strong> under <strong>Editorial</strong> edits the same body; see <a href="/help/content/editorial">Editorial</a>.</p>$html$,
      '[]',
      null,
      60
    ),
    (
      'publishing-an-entry',
      'All Content',
      'Publishing an entry and its public page',
      $html$<p>To publish an entry, open it, set <strong>Status</strong> to Published in the <strong>Visibility</strong> tab and choose <strong>Save Changes</strong>. To publish it later, set <strong>Status</strong> to Scheduled, pick a <strong>Scheduled date</strong> and save: Content publishes the entry once that date arrives. Both need the Publish an entry or page permission.</p><p>A published entry has a public page that anyone with its link can open, without signing in. The page shows the entry's type and date, title, excerpt, author, cover image and body. To open it in a new tab, choose the arrow icon beside <strong>Save Changes</strong> (<strong>View live page</strong>), or <strong>View page</strong> in the entry's <strong>⋯</strong> menu. Both work only once the entry is saved as Published.</p><p>An entry's public page goes away when the entry stops being Published or is deleted.</p>$html$,
      '[]',
      null,
      70
    ),
    (
      'duplicating-archiving-deleting',
      'All Content',
      'Duplicating, archiving and deleting entries',
      $html$<p><strong>Duplicate</strong> in an entry's <strong>⋯</strong> menu makes a copy with "(copy)" after the title and "-copy" after the slug. The copy starts as a Draft.</p><p>To take an entry out of delivery without losing it, set its <strong>Status</strong> to Archived in the <strong>Visibility</strong> tab and save. It moves to <strong>Content → Archived</strong>, where <strong>Restore as draft</strong> brings it back.</p><p><strong>Delete</strong> in the <strong>⋯</strong> menu removes the entry from every list. Content asks you to confirm first, and a deleted entry can't be restored from Content. Deleting needs the Delete an entry or page permission, which the Owner, Admin and Editor roles have.</p>$html$,
      '[]',
      null,
      80
    ),
    (
      'creating-a-collection',
      'Collections',
      'Creating a collection',
      $html$<p>A collection groups entries into a set, such as the features on a home page. To create one, choose <strong>Content → Collections</strong>, then <strong>Create collection</strong>. Only the <strong>Name</strong> is required, and the <strong>Description</strong> is optional. New collections start as Draft, with a slug made from the name.</p><p>The figures across the top show <strong>Total collections</strong>, <strong>Published</strong>, <strong>Drafts</strong> and <strong>Linked entries</strong>, the number of entries across all collections. Filter the list by status (Published, Draft or Archived), and search names, slugs and descriptions.</p><p>Each row's <strong>⋯</strong> menu has <strong>Edit</strong>, <strong>Duplicate</strong> and <strong>Delete</strong>. A duplicate is an empty Draft copy, without the original's entries. Deleting asks you to confirm first and removes only the grouping: the entries stay as they are.</p><p>Creating, changing and deleting collections needs the Create, edit and delete collections permission. Of the built-in roles, only Owner has it.</p>$html$,
      '[]',
      null,
      90
    ),
    (
      'editing-a-collection',
      'Collections',
      'Editing a collection',
      $html$<p>Click a collection to open it. Its tabs are:</p><ul><li><strong>Overview</strong>: <strong>Description</strong> and <strong>Status</strong> (Published, Draft or Archived).</li><li><strong>Basics</strong>: <strong>Name</strong>, <strong>Slug</strong> and <strong>Cover URL</strong>. The <strong>Settings</strong> tab shows the same fields.</li><li><strong>Items</strong>: the entries in the collection.</li></ul><p>Changes on <strong>Overview</strong> and <strong>Basics</strong> save when you choose <strong>Save Changes</strong>. The <strong>Items</strong> tab saves as you go. Under <strong>Add entries</strong>, search for an entry and choose <strong>Add</strong> beside it; the list shows up to 30 matches. Under <strong>Included entries</strong>, <strong>Remove</strong> takes an entry out again. Entries stay in the order you added them.</p>$html$,
      '[]',
      null,
      100
    ),
    (
      'adding-assets',
      'Assets',
      'Adding assets',
      $html$<p>Assets is the project's media library. To add a file, choose <strong>Content → Assets</strong>, then <strong>Add asset</strong>, and pick how to add it:</p><ul><li><strong>Upload</strong>: drop a file on the box, or click the box to browse. It takes images, video and PDFs. Then choose <strong>Upload asset</strong>.</li><li><strong>URL</strong>: type the web address of a file that's already online in <strong>File URL</strong>, then choose <strong>Add asset</strong>.</li></ul><p>A <strong>Name</strong> is required, and Content fills it in from the file name when you upload. <strong>Type</strong> is Image, Video, Document, Audio or Other, and Content sets it from the file you pick. <strong>Folder</strong> is an optional label, like <code>hero</code>, that you can search for.</p><p>Before uploading, Content shrinks images over 500 KB, other than SVG and GIF files, to at most 1920 pixels on their longest side and saves them as JPEG. Uploaded files are public: anyone with a file's URL can open it. Adding assets needs the Upload assets permission. Of the built-in roles, only Owner has it.</p>$html$,
      '[]',
      null,
      110
    ),
    (
      'browsing-and-editing-assets',
      'Assets',
      'Browsing and editing assets',
      $html$<p>The asset library opens as a <strong>Grid</strong> of thumbnails; switch to <strong>List</strong> for a table. The figures across the top show <strong>Total assets</strong>, with their combined size, then <strong>Images</strong>, <strong>Video</strong> and <strong>Documents</strong>. Filter by type, and search names, folders and file types.</p><p>Each asset's <strong>⋯</strong> menu has <strong>Edit</strong>, <strong>Copy URL</strong>, <strong>Open file</strong> (in a new tab) and <strong>Delete</strong>. To use an asset in an entry, copy its URL into the entry's <strong>Cover URL</strong>. Deleting asks you to confirm first, and a deleted asset can't be restored from Content.</p><p>Click an asset to open its details, with a preview and its type, size and status. <strong>Overview</strong> holds <strong>Name</strong>, <strong>Folder</strong> and <strong>Alt text</strong>. <strong>File</strong>, and <strong>Settings</strong>, which shows the same fields, hold <strong>URL</strong>, <strong>Type</strong>, <strong>MIME</strong>, <strong>Size (bytes)</strong> and <strong>Status</strong>: Ready, Processing or Archived. An upload shows Processing until it finishes. Choose <strong>Save Changes</strong> to keep your edits.</p>$html$,
      '[]',
      null,
      120
    ),
    (
      'creating-a-content-slot',
      'Content Slots',
      'Creating a content slot',
      $html$<p>A content slot is a named place in your website or app that asks Content what to show, such as a home page hero. Your app requests a slot by its key. To create one, choose <strong>Content → Content Slots</strong>, then <strong>Create slot</strong>. Only the <strong>Name</strong> is required. Content makes the key from the name, in lowercase with underscores (<code>homepage_hero</code>), and shows it before you create the slot. New slots are Active.</p><p>The figures across the top count <strong>Total slots</strong>, <strong>Active</strong>, <strong>Paused</strong> and <strong>Archived</strong>. Filter by status, and search names, keys and descriptions. Each row's <strong>⋯</strong> menu has <strong>Edit</strong>, <strong>Duplicate</strong> and <strong>Delete</strong>. A duplicate gets "_copy" after its key and starts as Paused. Deleting asks you to confirm first; after that, requests for the slot's key no longer find it.</p><p>Creating, changing and deleting slots needs the Manage settings permission, which the Owner and Admin roles have.</p>$html$,
      '[]',
      null,
      130
    ),
    (
      'editing-a-slot',
      'Content Slots',
      'Editing a slot and its fallback',
      $html$<p>Click a content slot to open it. Its tabs are:</p><ul><li><strong>Overview</strong>: <strong>Description</strong> and <strong>Status</strong> (Active, Paused or Archived).</li><li><strong>Basics</strong>: <strong>Name</strong> and <strong>Key</strong>. Changing the name updates the key until you edit the key yourself. Keys keep to lowercase letters, numbers and underscores.</li><li><strong>Delivery</strong>: the <strong>Fallback entry</strong>, which starts as <strong>No fallback</strong>. The menu lists up to 100 entries.</li></ul><p>Choose <strong>Save Changes</strong> to keep your edits.</p><p>The variants you attach to a slot under <strong>Personalization → Content Variants</strong> decide what it shows. When no variant matches the visitor, the slot serves its fallback entry, as long as that entry is Published. <a href="/help/content/personalization">Personalization</a> covers variants and targeting.</p>$html$,
      '[]',
      null,
      140
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"Rss","label":"Geiger Content","href":"/help/content"},{"icon":"DraftingCompass","label":"Content architecture","href":"/help/content/architecture"},{"icon":"FileText","label":"Editorial","href":"/help/content/editorial"},{"icon":"Rocket","label":"Publishing","href":"/help/content/publishing"},{"icon":"Target","label":"Personalization","href":"/help/content/personalization"},{"icon":"ShieldCheck","label":"Governance","href":"/help/content/governance"}]',
      null,
      150
    )
) as v(anchor_id, eyebrow, title, content, links, showcase, sort_order)
cross join (select id from public.docs_pages where slug = 'content/library' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Content library',
    description = 'Create and manage entries, pages, collections, assets and content slots.',
    status = 'draft',
    published_at = null
where slug = 'content/library' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'content/library' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>All Content and the entry list</li><li>Drafts, Pages, Scheduled and Archived</li><li>Editing an entry</li><li>Collections</li><li>Assets</li><li>Content Slots</li></ul>',
  10
from public.docs_pages p
where p.slug = 'content/library' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
