-- Help flow planning page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the flow/planning draft outline with the
-- full Planning board guide and publishes it. Planning has no section showcases yet, so the page is text only.
-- Written from a survey of C:\Pro\geiger-flow (components/internal/screens/projects/planning/planning_screen.jsx,
-- planning/notes/nodes/*, planning/notes/edges/*, planning/notes/layout/sidebar/**, features/planning/actions.js,
-- features/planning/storage.js). Document, Board and Clock nodes, the unwired palette icons, and the unused
-- Help/Collaborate dialogs are left out because they don't work in the product.
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Planning board',
    description = 'Map out a project on a shared canvas: add notes, links, images, files and calendars, connect them, and keep several planning files.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'flow/planning' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'flow/planning' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, showcase, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.showcase, v.sort_order
from (
  values
    (
      'adding-nodes',
      'Basics',
      'Adding nodes to the canvas',
      $html$<p>Planning is the project's free-form canvas. Open a project in Flow and choose <strong>Planning</strong> in the sidebar. To add something, drag its icon from the insert palette, the strip of icons down the left edge, and drop it on the canvas. The new node lands where you drop it. Clicking an icon doesn't add anything.</p><p>These icons add a node:</p><ul><li>The sticky note adds a <strong>note</strong>, a card of text.</li><li>The chain link adds a <strong>link node</strong>, which holds a web address.</li><li>The speech bubble adds a <strong>comment</strong>.</li><li>The calendar adds a <strong>calendar</strong> that shows today's date.</li><li>The picture adds an <strong>image</strong>.</li><li>The upload arrow adds a <strong>file node</strong> for an attachment.</li></ul><p>The shapes icon at the top right (<strong>Toggle insert palette</strong>) hides and shows the palette.</p>$html$,
      '[]',
      null,
      10
    ),
    (
      'saving-and-sharing',
      'Concepts',
      'Saving and sharing',
      $html$<p>Planning saves the canvas on its own a moment after each change, so there is no Save button. It also keeps where you've moved and zoomed to, and reopens on the planning file you last had open. If a save fails, Flow shows "Couldn't save the board." and tries again with your next change.</p><p>Planning belongs to the project, so everyone in the project works on the same planning files. It doesn't update live: a teammate's changes appear the next time you open Planning.</p><p>Two people editing at the same time can overwrite each other's work, because the later save replaces the earlier one.</p>$html$,
      '[]',
      null,
      20
    ),
    (
      'planning-files',
      'Files',
      'Planning files',
      $html$<p>Planning can hold several planning files, each a separate canvas. The <strong>Files</strong> panel lists them, with how many nodes and links (connections) each has and when it last changed. The header shows the file you're in, after <strong>Planning</strong>.</p><ul><li><strong>Create file</strong>, the + in the panel's header, adds an empty file named Planning file and a number, and opens its name for editing.</li><li>Click a file to open it. The view zooms to fit what's on it.</li><li><strong>Rename file</strong>, the pencil: type the new name, then press <code>Enter</code> or click away. <code>Esc</code> cancels. An empty name keeps the old one, and a name that's already taken gets a number, like <code>Roadmap (2)</code>.</li><li><strong>Duplicate file</strong>, the copy icon, makes a copy with Copy added to its name and opens it.</li><li><strong>Delete file</strong>, the trash icon, removes the file straight away, without asking, and it can't be restored. You can't delete the last file.</li></ul><p>A project's Planning starts with one empty file, Untitled Board. The panel icon at the top right (<strong>Toggle planning files</strong>) hides and shows the panel.</p>$html$,
      '[]',
      null,
      30
    ),
    (
      'moving-around',
      'Canvas',
      'Moving around the canvas',
      $html$<p>Drag an empty part of the canvas to move around it. To zoom, hold <code>Ctrl</code> (<code>⌘</code> on Mac) and scroll, or pinch on a trackpad. Scrolling on its own doesn't move or zoom the canvas.</p><p>The controls at the bottom of the canvas zoom out (the minus) and in (the plus), and show the current zoom between them. Click the percentage to fit everything on the planning file into view. Zoom runs from 10% to 200%.</p>$html$,
      '[]',
      null,
      40
    ),
    (
      'arranging-nodes',
      'Canvas',
      'Selecting, arranging and deleting nodes',
      $html$<p>Click a node to select it, and drag it to move it. When you let go, it snaps to a grid so nodes line up. To resize a note, link node, image, file node or calendar, select it and drag its bottom-right corner. Each kind of node has a minimum size.</p><p>To select several nodes, hold <code>Shift</code> and click each one, or hold <code>Shift</code> and drag across the canvas: the box selects every node it touches. Click an empty part of the canvas to clear the selection.</p><p>Press <code>Delete</code> or <code>Backspace</code> to delete what's selected. Flow doesn't ask first, and Planning has no undo. Deleting a node also deletes its connections. While you're typing in a node, those keys edit the text instead.</p><p>Selecting a node swaps the insert palette for that node's settings. The back arrow at the top of the strip clears the selection and brings the palette back.</p>$html$,
      '[]',
      null,
      50
    ),
    (
      'notes-links-comments',
      'Canvas',
      'Notes, links and comments',
      $html$<p>A <strong>note</strong> is a card of text. Select it and type: the text saves as you write, and line breaks are kept. With a note selected, the strip on the left formats the whole note:</p><ul><li>The B, I and U icons turn bold, italic and underline on and off.</li><li>The alignment icon moves the text from left to center to right, one step per click.</li><li>The color swatch sets the card's color. Pick one of 15 colors, or type a hex code under <strong>Custom Hex</strong>.</li></ul><p>A <strong>link node</strong> holds a web address. Select it and type or paste the address in the box that reads Enter a link URL. The address is kept as text and doesn't open from the canvas. Link nodes take a card color too.</p><p>A <strong>comment</strong> holds one line of text. Type it, then press <code>Enter</code> or choose <strong>Send</strong>. Text you haven't sent isn't kept, and sending again replaces the comment.</p>$html$,
      '[]',
      null,
      60
    ),
    (
      'connecting-nodes',
      'Canvas',
      'Connecting nodes',
      $html$<p>To connect two nodes, select the first one, then drag from the small square at its top-right corner onto the other node. On a comment, hover over it and drag from the dot on its right edge. A connection is a curved line with an arrow at the end. It can start at a calendar but can't end on one.</p><p>Click a connection to select it, and drag the dot in its middle to bend the curve. With a connection selected, the strip on the left styles it:</p><ul><li>The color swatch sets the line's color.</li><li>The right arrow turns the arrowhead at the end on and off.</li><li>The T adds a label, typed in <strong>Label Text</strong>, that shows in the middle of the line.</li><li>The line icon switches between a solid and a dashed line.</li><li>The stacked lines set the thickness: <strong>Thin</strong> (the default), <strong>Medium</strong> or <strong>Thick</strong>.</li><li>The pulse icon animates the line.</li></ul><p>Each change saves as you make it. To remove a connection, select it and press <code>Delete</code> or <code>Backspace</code>.</p>$html$,
      '[]',
      null,
      70
    ),
    (
      'adding-images',
      'Images',
      'Adding images',
      $html$<p>An image node shows a placeholder until you add a picture. Select it, choose the picture icon at the top of the strip on the left, then click the drop area in <strong>Change Image</strong> or drag an image onto it. Set the <strong>Compression Quality</strong> (from 10% to 100%, 80% to start; lower makes a smaller file) and choose <strong>Replace Image</strong>. Images wider or taller than 2048 pixels are scaled down to fit.</p><p>Replacing an uploaded image deletes the old version, so the dialog offers a <strong>Download</strong> button to keep a copy first.</p><p>With an image selected, the strip on the left also has:</p><ul><li>The T, which opens <strong>Edit Caption</strong>: set the <strong>Caption Text</strong>, <strong>Background Opacity</strong>, <strong>Background Color</strong> and <strong>Text Color</strong>, then choose <strong>Save changes</strong>. New images show the caption Untitled Image. Clear the text to hide the caption.</li><li>Two curved arrows, which turn the image 90 degrees left or right.</li><li>Two flip icons, which mirror it horizontally or vertically.</li><li>The crop icon, which opens the image full screen with a crop box. Drag the box's edges and corners, then choose the check mark (<strong>Apply Crop</strong>). The circular arrow (<strong>Reset Crop</strong>) starts over, and the × cancels.</li><li>The pencil, which turns on drawing.</li></ul><p>Replacing or cropping an image removes any drawing on it.</p>$html$,
      '[]',
      null,
      80
    ),
    (
      'drawing-on-images',
      'Images',
      'Drawing on images',
      $html$<p>To draw on an image, select it and choose the pencil in the strip on the left. The image opens full screen with drawing turned on, and these tools down its left side:</p><ul><li><strong>Pencil</strong> draws. Choose it again (<strong>Stop Drawing</strong>) to stop.</li><li><strong>Eraser</strong> rubs out parts of the drawing.</li><li><strong>Brush Size</strong> picks one of four brush sizes.</li><li><strong>Brush Color</strong> picks one of eight colors. The brush starts red.</li><li><strong>Clear All</strong> erases the whole drawing, without asking.</li></ul><p>Each stroke saves when you finish it. The drawing sits on top of the image, so the picture underneath doesn't change.</p><p>Double-click any image to see it full screen, with the same tools. <strong>Download Image</strong> saves it as a PNG with the drawing on it. Close the view with the × or by clicking outside the image.</p>$html$,
      '[]',
      null,
      90
    ),
    (
      'attaching-files',
      'Canvas',
      'Attaching files',
      $html$<p>A file node holds one attachment of any type, and shows No file selected until you add one. Select it, choose the upload icon in the strip on the left, then click the drop area in <strong>Upload File</strong> or drag a file onto it, and choose <strong>Upload File</strong>.</p><p>The node then shows the file's name and size. Its download icon (<strong>Download</strong>) opens the file in a new browser tab, and so does the download icon in the strip. Uploading another file replaces the attachment and deletes the old version, so the dialog offers a <strong>Download</strong> button to keep a copy first.</p><p>The color swatch in the strip sets the node's color.</p>$html$,
      '[]',
      null,
      100
    ),
    (
      'calendars',
      'Canvas',
      'Calendars',
      $html$<p>A calendar node shows today's date. To change how it looks, select it, choose the gear at the top of the strip on the left to open <strong>Calendar Style</strong>, pick a style and a theme, and choose <strong>Save Changes</strong>:</p><ul><li><strong>Day</strong> shows today's weekday and date. New calendars use it.</li><li><strong>Month</strong> shows this month, with today marked.</li><li><strong>Events</strong> shows today's date beside the month.</li><li><strong>Light</strong> or <strong>Dark</strong> sets the theme. New calendars are Light.</li></ul><p>The smiley face in the strip adds a reaction to the calendar: Like, Love, Laugh, Wow, Sad, Angry, Celebrate or Fire. Each reaction shows on the calendar with a count, and clicking it there adds one more.</p>$html$,
      '[]',
      null,
      110
    ),
    (
      'shortcuts',
      'Reference',
      'Keyboard and mouse shortcuts',
      $html$<ul><li><code>Delete</code> or <code>Backspace</code> deletes what's selected</li><li><code>Shift</code> and click adds a node to the selection</li><li><code>Shift</code> and drag selects every node the box touches</li><li><code>Ctrl</code> and scroll (<code>⌘</code> and scroll on Mac) zooms, and so does pinching on a trackpad</li><li>Double-click an image to see it full screen</li><li><code>Enter</code> sends a comment</li><li><code>Enter</code> saves a planning file's new name, and <code>Esc</code> cancels it</li></ul>$html$,
      '[]',
      null,
      120
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"Workflow","label":"Geiger Flow","href":"/help/flow"},{"icon":"ListTodo","label":"Tasks","href":"/help/flow/tasks"},{"icon":"CalendarRange","label":"Projections","href":"/help/flow/projections"},{"icon":"Flag","label":"Milestones & goals","href":"/help/flow/goals"},{"icon":"Images","label":"Assets","href":"/help/flow/assets"},{"icon":"PackagePlus","label":"Add-ons","href":"/help/flow/add-ons"}]',
      null,
      130
    )
) as v(anchor_id, eyebrow, title, content, links, showcase, sort_order)
cross join (select id from public.docs_pages where slug = 'flow/planning' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Planning board',
    description = 'Map out ideas on a free-form canvas of notes, images, files and dates.',
    status = 'draft',
    published_at = null
where slug = 'flow/planning' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'flow/planning' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Adding notes, images and files</li><li>Calendar and clock nodes</li><li>Autosave</li></ul>',
  10
from public.docs_pages p
where p.slug = 'flow/planning' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
