-- Help notes documents page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the notes/documents draft outline with the
-- full Documents guide and publishes it. Left out: the node's outline badge (no control sets it) and who may open a
-- document (documents carry no access rules of their own; reported to the user rather than documented).
-- Written from a survey of C:\Pro\geiger-notes (components/internal/dialogs/DocumentDialog.jsx,
-- components/internal/nodes/DocumentNode.jsx, app/api/documents/route.js, components/internal/canvas/BoardCanvas.jsx,
-- app/[id]/home/page.js, app/project/[projectId]/page.js, app/colab/[id]/page.js, app/api/sketches/link-targets/route.js,
-- lib/accessibility/clipboard.js, components/internal/layout/sidebar/NodeSettingsSidebar.jsx) and the Tiptap StarterKit
-- extensions the editor loads.
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Documents',
    description = 'Write long-form documents that live on a board: add a Document node, format text in the document editor, and let Notes save as you type.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'notes/documents' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'notes/documents' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, showcase, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.showcase, v.sort_order
from (
  values
    (
      'creating-a-document',
      'Basics',
      'Creating a document',
      $html$<p>To create a document, drag the <strong>Document</strong> tool from the toolbar onto a board. Notes creates an empty document and adds a node for it where you drop the tool. The node reads Untitled Document, with "Double-click to edit" under it.</p><p>A document is a separate page of rich text, while its node is what sits on the board. You need to be signed in to create one, and you can only add one to a board you can edit. If Notes can't create it, it says Failed to create document.</p><p>You can't add a document during a live session.</p>$html$,
      '[]',
      null,
      10
    ),
    (
      'writing-a-document',
      'Documents',
      'Writing and formatting',
      $html$<p>To open a document, double-click its node. The <strong>Document Editor</strong> fills most of the screen, with a row of formatting buttons along its top: bold, italic, strikethrough and inline code, then bulleted list, numbered list and quote. Each button turns its format on or off for the selected text or the current line, and shows as pressed while the cursor is inside that format.</p><p>The editor also formats as you type:</p><ul><li><code>#</code> to <code>######</code> followed by a space start a heading, from the largest to the smallest.</li><li><code>-</code>, <code>+</code> or <code>*</code> followed by a space start a bulleted list, and <code>1.</code> followed by a space starts a numbered list. <code>Tab</code> indents a list item and <code>Shift Tab</code> moves it back out.</li><li><code>></code> followed by a space starts a quote, and <code>```</code> followed by a space starts a code block.</li><li>Text wrapped in <code>**</code> turns bold, in <code>*</code> italic, in <code>~~</code> struck through, and in backticks inline code.</li><li>A web address becomes a link once you type a space after it.</li></ul><p>These keyboard shortcuts work in the editor. On a Mac, press <code>⌘</code> in place of <code>Ctrl</code>.</p><ul><li><code>Ctrl B</code> bold, <code>Ctrl I</code> italic and <code>Ctrl U</code> underline</li><li><code>Ctrl Shift S</code> strikethrough and <code>Ctrl E</code> inline code</li><li><code>Ctrl Z</code> undo and <code>Ctrl Shift Z</code> redo</li></ul>$html$,
      '[]',
      null,
      20
    ),
    (
      'saving-documents',
      'Documents',
      'How documents save',
      $html$<p>Notes saves a document on its own, one second after you stop typing, so there's no Save button. The top of the <strong>Document Editor</strong> shows where it stands: Unsaved changes while you type, Saving while it writes, and Synced once the document is saved.</p><p>If a save fails, the status stays at Unsaved changes, and Notes tries again the next time you type. Before you leave the board or close the tab, check that the status reads Synced.</p><p>Close the editor with the × in its corner or <code>Esc</code>. If the document can't be opened, Notes says Failed to load document.</p>$html$,
      '[]',
      null,
      30
    ),
    (
      'document-nodes',
      'Documents',
      'Document nodes and copies',
      $html$<p>A document's node always reads Untitled Document: Notes has no way to rename it. Select the node to style it from the Node Settings panel, which <a href="/help/notes/nodes">Nodes</a> describes.</p><p>Copies of a document node point to the same document. A node you duplicate, or copy and paste with <code>Ctrl C</code> and <code>Ctrl V</code> (<code>⌘ C</code> and <code>⌘ V</code> on Mac), opens the same text as the original, so a change made through one shows in all of them.</p><p>Deleting a document node takes it off the board. While you're still on that board, <strong>Recently deleted</strong> in the toolbar can bring it back, as <a href="/help/notes/boards">Boards</a> explains.</p><p>A shape in a sketch can link to a document. Clicking that link opens the document in the <strong>Document Editor</strong> over the board it's on. <a href="/help/notes/sketches">Sketches</a> covers adding links.</p>$html$,
      '[]',
      null,
      40
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"LayoutDashboard","label":"Boards","href":"/help/notes/boards"},{"icon":"StickyNote","label":"Nodes","href":"/help/notes/nodes"},{"icon":"PenTool","label":"Sketches","href":"/help/notes/sketches"}]',
      null,
      50
    )
) as v(anchor_id, eyebrow, title, content, links, showcase, sort_order)
cross join (select id from public.docs_pages where slug = 'notes/documents' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Documents',
    description = 'Write long-form documents that live on a board, and format them in the document editor.',
    status = 'draft',
    published_at = null
where slug = 'notes/documents' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'notes/documents' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Creating a document</li><li>Writing and formatting</li><li>Opening a document from a sketch</li></ul>',
  10
from public.docs_pages p
where p.slug = 'notes/documents' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
