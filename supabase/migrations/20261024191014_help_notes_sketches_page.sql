-- Help notes sketches page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the notes/sketches draft outline with the
-- full Sketches guide and publishes it. The drawing tools themselves belong to the embedded drawing library, so the page
-- covers only what Notes adds around them. Left out: the view-only editor mode (every project member holds every
-- sketch ability today, so nobody reaches it) and deleting a sketch itself (nothing in the UI does it).
-- Written from a survey of C:\Pro\geiger-notes (components/internal/sketch/*, components/internal/nodes/SketchNode.jsx,
-- lib/sketch/*, app/api/sketches/** (route.js, link-targets, push-to-board), lib/supabase/sketch-access.js,
-- components/internal/layout/sidebar/plugs/sketch/*, components/internal/layout/sidebar/dialogs/sketch/*,
-- components/internal/layout/sidebar/{NodeSettingsSidebar,ImageSettingsSidebar}.jsx, components/internal/canvas/BoardCanvas.jsx,
-- app/[id]/home/page.js, app/project/[projectId]/page.js, app/colab/[id]/page.js, supabase/migrations/20260921151902_sketches.sql).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Sketches',
    description = 'Draw freehand on a sketch, link shapes to boards and documents, push shapes onto a board as nodes, sketch with your project team, and download your work.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'notes/sketches' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'notes/sketches' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, showcase, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.showcase, v.sort_order
from (
  values
    (
      'creating-a-sketch',
      'Basics',
      'Creating a sketch',
      $html$<p>To create a sketch, drag the <strong>Draw</strong> tool from the toolbar onto a board. Notes creates a sketch named Untitled Sketch and adds a node for it, which shows a preview of the drawing, or Empty sketch until you draw something. Double-click the node to open the sketch editor.</p><p>A sketch remembers the board you created it on, which is where <strong>Push to board</strong> sends shapes. You need to be signed in to create a sketch, and if Notes can't create one, it says Failed to create sketch. You can't add a sketch during a live session.</p><p>The pencil in an image's Image panel also opens the sketch editor, with the picture as a locked layer to draw over. <a href="/help/notes/nodes#image-tools">Nodes</a> covers the image tools.</p>$html$,
      '[]',
      null,
      10
    ),
    (
      'sketch-editor',
      'Sketches',
      'The sketch editor',
      $html$<p>The sketch editor fills the screen with a drawing canvas and its own drawing tools. It follows the app's light or dark theme. The top bar shows the trail of boards you came through, then the sketch's name. To go back, choose a board's name or <strong>Notes</strong> in that trail. The editor's address includes the sketch, so reloading the page or sharing its link opens the same sketch.</p><p>To rename the sketch, click its name in the top bar (<strong>Click to rename</strong>), type, then press <code>Enter</code> or click away. <code>Esc</code> cancels, and an empty name becomes Untitled Sketch. This changes the sketch's own name, which the editor and link lists show. The label on the sketch's node changes only through its Node Settings panel, described in <a href="#renaming-and-downloading">Renaming and downloading a sketch</a>.</p><p>The <strong>Settings</strong> gear works here as it does on a board. Two buttons sit at the bottom of the editor, <strong>Link to Notes</strong> and <strong>Push to board</strong>, and the top bar shows the save status with a <strong>Save</strong> button.</p>$html$,
      '[]',
      null,
      20
    ),
    (
      'saving-sketches',
      'Sketches',
      'How sketches save',
      $html$<p>Notes saves a sketch on its own, 2.5 seconds after your last change. The top bar shows Unsaved changes, then Saving…, then Saved. To save straight away, choose <strong>Save</strong>.</p><p>Leaving the editor or closing the tab saves any change that's still waiting. If a save fails, Notes says Failed to save sketch and the status stays at Unsaved changes, so choose <strong>Save</strong> to try again.</p><p>While other people have the same project sketch open, the status reads Live instead. Their changes and yours reach each other as you draw, and one person's editor saves the sketch for everyone.</p>$html$,
      '[]',
      null,
      30
    ),
    (
      'linking-shapes',
      'Links',
      'Linking a shape to a board, sketch or document',
      $html$<p>A shape in a sketch can link to a board, another sketch or a document, so the sketch works as a map of your notes.</p><ol><li>In the sketch editor, select a single shape. <strong>Link to Notes</strong> stays unavailable until exactly one shape is selected.</li><li>Choose <strong>Link to Notes</strong> at the bottom of the editor.</li><li>Find the target under <strong>Boards</strong>, <strong>Sketches</strong> or <strong>Documents</strong>, or type in the search box to narrow the lists by name.</li><li>Choose the target. The dialog closes and the shape keeps the link.</li></ol><p>A project sketch lists the project's boards and sketches, and the documents on its boards. A personal sketch lists your personal boards, starting with Home, your personal sketches and the documents on those boards. Documents appear under the name on their node.</p><p>Open a shape's link to go there inside Notes: a board or sketch opens in place of the editor, and a document opens in the <strong>Document Editor</strong> over its board. Links to other sites open in a new tab.</p><p>To change a link, select the shape and choose <strong>Edit link</strong>. To take it off, choose <strong>Remove link</strong> in the same dialog.</p>$html$,
      '[]',
      null,
      40
    ),
    (
      'pushing-to-a-board',
      'Push to board',
      'Pushing shapes onto a board',
      $html$<p><strong>Push to board</strong> copies the shapes you've selected in a sketch onto the board the sketch was created on, as nodes. Select one or more shapes, then choose <strong>Push to board</strong> at the bottom of the editor. Notes saves the sketch first, adds the nodes to the right of the sketch's node, and says how many nodes and connections it added. The sketch itself doesn't change.</p><ul><li>Rectangles, diamonds and ellipses become notes, with the text inside them as their label. Loose text becomes a note too.</li><li>A frame becomes a column, with the shapes and text inside it as the column's items.</li><li>Images become image nodes.</li><li>An arrow becomes a connection when both its ends are attached to shapes that were pushed.</li></ul><p>Lines, freehand strokes, embeds and arrows with a loose end have nothing to become, so Notes skips them and says how many it skipped. Rotated shapes land straight. Notes converts at most 200 shapes in one push.</p><p><strong>Push to board</strong> is unavailable, marked No host board, on a sketch that wasn't created on a board, such as an image annotation. If the board has been deleted, Notes says That board no longer exists.</p>$html$,
      '[]',
      null,
      50
    ),
    (
      'sketching-together',
      'Collaboration',
      'Sketching together',
      $html$<p>A project sketch is shared with the project. When other members open the same sketch, you see each person's cursor in their own color and their drawing as it happens, and a laser pointer trail shows for everyone. A personal sketch is only yours, so it has none of this.</p><p>The top bar shows the people in the sketch as avatars, up to five and then a count. To follow someone, click their avatar (<strong>Follow</strong> and their name): your view then moves with theirs, and the top bar says Following and their name. To stop, choose <strong>Stop</strong>, click the avatar again, or move the canvas yourself. Following stops three seconds after that person leaves the sketch.</p><p>When people follow you, the top bar says so. You can't follow someone who's already following you.</p>$html$,
      '[]',
      null,
      60
    ),
    (
      'renaming-and-downloading',
      'Sketches',
      'Renaming and downloading a sketch',
      $html$<p>Select a sketch's node on its board to see these at the top of its Node Settings panel:</p><ul><li>The pen (<strong>Edit Sketch</strong> and the sketch's name, on hover) opens <strong>Edit Sketch</strong>, with a <strong>Name</strong> and a <strong>Description</strong> that shows under the name on the board. Choose <strong>Save</strong>, or press <code>Enter</code> in the name. This renames both the node and the sketch.</li><li>The download icon (<strong>Download Sketch</strong>) exports the drawing as <strong>PNG</strong> (an image on white, the default), <strong>SVG</strong> (a scalable vector) or <strong>Excalidraw</strong> (an editable .excalidraw file). Pick a format, then choose <strong>Download</strong>. Exports use the light theme on a white background, and an empty sketch can't be exported.</li></ul><p>Deleting a sketch's node takes it off the board. While you're still on that board, <strong>Recently deleted</strong> in the toolbar can bring it back, as <a href="/help/notes/boards">Boards</a> explains.</p>$html$,
      '[]',
      null,
      70
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"LayoutDashboard","label":"Boards","href":"/help/notes/boards"},{"icon":"FileText","label":"Documents","href":"/help/notes/documents"},{"icon":"StickyNote","label":"Nodes","href":"/help/notes/nodes"}]',
      null,
      80
    )
) as v(anchor_id, eyebrow, title, content, links, showcase, sort_order)
cross join (select id from public.docs_pages where slug = 'notes/sketches' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Sketches',
    description = 'Draw freehand sketches, link them to boards and documents, push them onto a board, and sketch together.',
    status = 'draft',
    published_at = null
where slug = 'notes/sketches' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'notes/sketches' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Creating a sketch</li><li>Drawing in the sketch editor</li><li>Linking elements to boards and documents</li><li>Pushing a sketch to a board</li><li>Sketching together</li><li>Downloading a sketch</li></ul>',
  10
from public.docs_pages p
where p.slug = 'notes/sketches' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
