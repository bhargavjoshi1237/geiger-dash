-- Help notes nodes page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the notes/nodes draft outline with the
-- full Nodes guide and publishes it. Notes has no section showcases yet, so the page is text only.
-- Written from a survey of C:\Pro\geiger-notes (components/internal/nodes/{CustomNode,CommentNode,LinkNode,
-- CheckboxNode,TableNode,ColumnNode,ImageNode,FileNode}.jsx, nodes/image-node/*, nodes/clock/*, nodes/calendar/**,
-- nodes/text/*, nodes/shape/*, nodes/sticker/*, nodes/link/*, nodes/shared/*, nodes/traits/*, nodes/registry.js,
-- components/internal/layout/Sidebar.jsx, layout/sidebar/{NodeSettingsSidebar,ImageSettingsSidebar,FileSettingsSidebar,
-- CalendarSettingsSidebar,SidebarPrimitives}.jsx, sidebar/plugs/*, sidebar/dialogs/{FileChangeDialog,ImageCaptionDialog,
-- ImageChangeDialog,ImageCropDialog}.jsx, sidebar/dialogs/calendar/*, sidebar/dialogs/clock/*,
-- components/internal/ui/{CommentComposer,Reactions}.jsx, components/internal/edges/ColorePicker.jsx,
-- components/internal/canvas/BoardCanvas.jsx, lib/canvas/node-appearance.js, app/globals.css, lib/settings/tools.js,
-- lib/settings/defaults.js, app/api/link-preview/route.js, database/init/image_storage_bucket_policy.sql).
-- Left out because they do nothing visible: the calendar's Card Color (paints only a 2px edge), the Events style's fixed
-- "No events today" line, the unused StrokeWidthPlug, and reactions on text nodes, stickers, clocks, images and file nodes.
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Nodes',
    description = 'Write notes, to-do lists, tables and columns, add links, images, files, calendars and clocks, and style any node from the Node Settings panel.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'notes/nodes' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'notes/nodes' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, showcase, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.showcase, v.sort_order
from (
  values
    (
      'selecting-and-editing',
      'Basics',
      'Selecting and editing a node',
      $html$<p>Click a node to select it. While it's selected, the <strong>Node Settings</strong> panel takes the place of the toolbar down the left side of the board and shows that node's controls. Images, file nodes and calendars have panels of their own: the Image, File and Calendar Settings panels. To go back to the toolbar, choose the back arrow at the top of the panel or click an empty part of the board.</p><p>To move a node, drag it. Fields you type in, like a to-do item or a table cell, don't start a drag, so grab the node outside them. To resize a node, hover over it or select it, then drag the handle at its bottom-right corner. Most nodes snap to the nearest 15 pixels when you let go. A text node resizes from the bar on its right edge instead. Each type's sizes are listed in <a href="#sizes-and-limits">Node sizes and limits</a>.</p><p>To change the words in a note, a text node or a shape, select it, then click inside it and type. To-do items, table cells, column titles, column cards and comments are fields you can click into and type in straight away.</p><p>Notes saves the board on its own a moment after each change, so there's no Save button. Settings you change in a dialog, such as <strong>Clock Settings</strong>, apply when you choose <strong>Save Changes</strong>.</p><p>To add nodes from the toolbar, connect them or delete them from the keyboard, see <a href="/help/notes/boards">Boards</a>, which also covers Board nodes. The <strong>Document</strong> and <strong>Draw</strong> tools and the tools under <strong>More tools</strong> have their own guides: <a href="/help/notes/documents">Documents</a>, <a href="/help/notes/sketches">Sketches</a> and <a href="/help/notes/more-tools">More tools</a>.</p>$html$,
      '[]',
      null,
      10
    ),
    (
      'node-settings-panel',
      'Node Settings',
      'The Node Settings panel',
      $html$<p>The Node Settings panel shows the selected node's own controls first, then a short divider, then the controls every node shares. Hover over an icon to see its name, where it has one. Each change applies and saves as you make it.</p><p>For notes, link nodes, to-do lists, columns, comments and tables, the color swatch at the top of the panel sets the card color. Pick one of 15 colors, or type a hex code, like <code>#3b82f6</code>, under <strong>Custom Hex</strong>. Text nodes, shapes and stickers have color controls of their own instead, and a clock has a gear that opens <strong>Clock Settings</strong>.</p><p>The shared controls, in order:</p><ul><li><strong>Appearance</strong> (the paintbrush): border, corner radius, shadow and opacity.</li><li><strong>Text style</strong> (the T): the font, size and color of the node's text. Clocks, calendars, images and stickers don't have it.</li><li><strong>Arrange</strong> (the stacked layers): bring the node to the front or send it to the back, duplicate it, delete it or set its exact size.</li><li><strong>Lock position</strong> (the padlock): stops the node from being moved or deleted.</li><li><strong>Add reaction</strong> (the smiley with a plus): adds an emoji reaction.</li></ul><p>On an image, the shared controls sit under <strong>More options</strong> (the ⋯ button) → <strong>Node</strong>. <a href="#appearance-and-text-style">Appearance and text style</a> and <a href="#arranging-and-locking">Arranging, locking and reactions</a> describe each one.</p>$html$,
      '[]',
      null,
      20
    ),
    (
      'appearance-and-text-style',
      'Node Settings',
      'Appearance and text style',
      $html$<p>To change how a node's card is drawn, select it and choose <strong>Appearance</strong>, the paintbrush in the Node Settings panel:</p><ul><li><strong>Border</strong>: <strong>None</strong> (the default), <strong>1px</strong>, <strong>2px</strong> or <strong>4px</strong>. With a border, choose <strong>Solid</strong>, <strong>Dashed</strong> or <strong>Dotted</strong>, and a color. Until you pick a color, the border uses the text color (<strong>Foreground</strong>), and <strong>Reset</strong> goes back to it.</li><li><strong>Corner radius</strong>: from 0px to 40px. Once you've set it, <strong>Style default</strong> goes back to the corners of your node style.</li><li><strong>Shadow</strong>: <strong>Style</strong> (your node style's own shadow, the default), <strong>None</strong>, <strong>Soft</strong>, <strong>Medium</strong>, <strong>Deep</strong> or <strong>Glow</strong>.</li><li><strong>Opacity</strong>: from 10% to 100%, in steps of 5%.</li></ul><p>On clocks and calendars, only <strong>Opacity</strong> changes anything.</p><p>To change a node's text, choose <strong>Text style</strong>, the T:</p><ul><li><strong>Font</strong>: <strong>Default</strong>, <strong>Sans</strong>, <strong>Serif</strong>, <strong>Mono</strong> or <strong>Hand</strong>, each shown in its own typeface.</li><li><strong>Size</strong>: <strong>Auto</strong> (the default), <strong>SM</strong>, <strong>MD</strong>, <strong>LG</strong> or <strong>XL</strong>, which are 12, 14, 17 and 22 pixels.</li><li><strong>Colour</strong>: one of 15 colors or a hex code. <strong>Reset</strong> goes back to the theme's text color.</li></ul><p>Your node style, the look every card starts from, is your own choice under <strong>Settings → Defaults → Node style</strong>. See <a href="/help/notes/settings">Settings</a>.</p>$html$,
      '[]',
      null,
      30
    ),
    (
      'arranging-and-locking',
      'Node Settings',
      'Arranging, locking and reactions',
      $html$<p>To place a node or delete it, select it and choose <strong>Arrange</strong>, the stacked layers in the Node Settings panel:</p><ul><li><strong>To front</strong> and <strong>To back</strong> put the node over or under every other node.</li><li><strong>Duplicate</strong> places a copy 30 pixels down and to the right, and selects the copy.</li><li><strong>Delete</strong> removes the node straight away, without asking. It goes to Recently deleted, which <a href="/help/notes/boards">Boards</a> covers.</li><li><strong>Size</strong>: type a width in <strong>W</strong> and a height in <strong>H</strong>, in pixels, at least 20. The new size applies when you press <code>Enter</code> or click away.</li></ul><p>The padlock (<strong>Lock position</strong>) locks the node: it can't be moved or deleted, <strong>Delete</strong> is unavailable, and a small padlock shows at its top-left corner. You can still change what's in it. Choose the padlock again (<strong>Unlock position</strong>) to unlock it. In a live session, a host's padlock reads <strong>Lock for everyone</strong>, and only a host can undo that lock: everyone else sees <strong>Locked by the host</strong>. See <a href="/help/notes/live-sessions">Live sessions</a>.</p><p><strong>Add reaction</strong>, the smiley with a plus, offers 10 emoji. Each one you pick shows at the node's bottom-right corner with a count, and clicking it there adds one more. Reactions can't be removed. They show on notes, link nodes, to-do lists, columns, comments, tables, shapes and calendars.</p>$html$,
      '[]',
      null,
      40
    ),
    (
      'notes-and-text',
      'Text',
      'Notes and text',
      $html$<p>A <strong>note</strong>, from the <strong>Note</strong> tool, is a card of plain text. Select it, click inside and type. An empty note reads Start typing, and line breaks are kept. With a note selected, the Node Settings panel has the card color swatch and four icons that format the whole note:</p><ul><li>B, I and U turn bold, italic and underline on and off.</li><li>The alignment icon moves the text from left to center to right, one step per click, and shows the current alignment.</li></ul><p>A <strong>text node</strong>, from the <strong>Text</strong> tool, puts words straight on the board, with no card behind them. It starts as a Heading 2, 360 pixels wide. Select it, click inside and type. Its panel has:</p><ul><li><strong>Text Style</strong> (the heading icon): <strong>Heading 1</strong>, <strong>Heading 2</strong>, <strong>Heading 3</strong>, <strong>Body</strong> or <strong>Caption</strong>, a smaller, dimmed size.</li><li><strong>Alignment</strong>: <strong>Left</strong>, <strong>Center</strong> or <strong>Right</strong>.</li><li><strong>Text Color</strong>: <strong>Default</strong> (the theme's text color), one of 15 colors, or a hex code under <strong>Custom Hex</strong>.</li><li><strong>Highlight</strong>: a color behind the words, like a marker pen. <strong>Default</strong> removes it.</li></ul><p><strong>Text Style</strong> sets the heading level. The shared <strong>Text style</strong>, the T further down the panel, changes the font, size and color of any node's text. To make a text node wider or narrower, drag the bar on its right edge. It grows taller as you type.</p>$html$,
      '[]',
      null,
      50
    ),
    (
      'links',
      'Links',
      'Links and link previews',
      $html$<p>A <strong>link node</strong>, from the <strong>Link</strong> tool, holds one web address and shows a preview of the page. A new one opens with a box that reads Enter a link URL. Type or paste the address, then press <code>Enter</code> or <code>Esc</code>, or click away. If you leave out <code>https://</code>, Notes adds it. The address needs a domain, like <code>example.com</code>, and the box stays open until it has one.</p><p>Notes then fetches the page's title, description, site name, icon and image:</p><ul><li>Under 110 pixels tall, the node is a compact row with the icon, title and site name.</li><li>Taller, it's a card that adds the description, and from 230 pixels tall it also shows the page's image.</li><li>The arrow out of a box (<strong>Open link</strong>) opens the page in a new browser tab.</li><li>To change the address, double-click the node, or select it and choose the pencil (<strong>Edit link</strong>).</li></ul><p>With a link node selected, the Node Settings panel has its card color and three controls:</p><ul><li><strong>Refresh preview</strong> (the circular arrows) fetches the preview again.</li><li>One button switches between <strong>Show expanded card</strong>, which makes the node 300 pixels tall, and <strong>Show compact row</strong>, which makes it 68 pixels tall.</li><li><strong>Open link</strong> opens the page in a new browser tab.</li></ul><p>Previews only work for public web pages. If a page doesn't answer within 5 seconds, sits on a private network or returns an error, the node shows the address alone. Notes tries again after 6 hours, or when you choose <strong>Refresh preview</strong>. YouTube and Vimeo links take their title and thumbnail from those sites.</p>$html$,
      '[]',
      null,
      60
    ),
    (
      'to-do-lists',
      'To-do lists',
      'To-do lists',
      $html$<p>A <strong>to-do list</strong>, from the <strong>To-do</strong> tool, is a checklist on a card. It starts with one empty item that reads Add a task. Click an item and type.</p><ul><li>Press <code>Enter</code> in an item to add an empty one at the end of the list.</li><li>Select an item's box (<strong>Mark as done</strong>) to tick it off, and its text is struck through. Clear the box (<strong>Mark as not done</strong>) to undo it.</li><li>Hover over an item and choose the × (<strong>Remove</strong>) to delete it. It goes straight away, without asking. Removing the last item leaves one empty item, so a list is never empty.</li></ul><p>With a to-do list selected, the Node Settings panel has its card color and the shared controls. To turn a list into separate cards, drag it onto a column, as <a href="#columns">Columns</a> describes.</p>$html$,
      '[]',
      null,
      70
    ),
    (
      'columns',
      'Columns',
      'Columns',
      $html$<p>A <strong>column</strong>, from the <strong>Column</strong> tool, stacks cards under a title, like a list on a kanban board. A new column is titled New Column: click the title to rename it. The count under the title says how many cards it holds.</p><p>To add cards to a column:</p><ul><li>Drag the <strong>Note</strong>, <strong>Link</strong>, <strong>To-do</strong> or <strong>Comment</strong> tool onto the column. It becomes a card of that kind at the bottom. Other tools drop onto the board as usual.</li><li>Drag a note, link node, to-do list or comment that's already on the board onto the column. When you let go with its center over the column, the node turns into a card there and keeps its color. A to-do list becomes one card per item.</li><li>With the column selected, choose <strong>Add card</strong> to add an empty note card.</li></ul><p>Cards work like the nodes they came from. A note card reads Start typing, a link card reads Paste a link and, once it has an address, shows an <strong>Open link</strong> icon, a to-do card has its own box, and a comment card has a comment box. Hover over a card and choose the × (<strong>Remove card</strong>) to delete it, straight away and without asking. Cards can't be dragged back out of a column or put in a different order.</p><p>A column holds up to 100 cards, and anything past that isn't added. It grows as cards are added, and when you make it shorter, its cards scroll inside it. With a column selected, the Node Settings panel has its card color and the shared controls.</p>$html$,
      '[]',
      null,
      80
    ),
    (
      'comments',
      'Comments',
      'Comments',
      $html$<p>A <strong>comment</strong>, from the <strong>Comment</strong> tool, holds one line of text beside the profile picture of the person who wrote it, or their initials when they have no picture. Type in the box that reads Write a comment, then press <code>Enter</code> or choose the paper plane (<strong>Send comment</strong>).</p><p>Text you haven't sent isn't kept. Until a comment is sent, it shows your own picture. Sending again replaces the comment's text, and the comment then shows you as its author.</p><p>With a comment selected, the Node Settings panel has its card color and the shared controls. In a column, a comment card keeps its text as you type, and sending it marks you as its author.</p>$html$,
      '[]',
      null,
      90
    ),
    (
      'tables',
      'Tables',
      'Tables',
      $html$<p>A <strong>table</strong>, from the <strong>Table</strong> tool, is a grid of plain text. A new table has two columns, Column 1 and Column 2, and two empty rows. Click a header or a cell and type. Each cell holds one line.</p><ul><li><strong>Row</strong>, at the bottom of the table, adds an empty row at the end.</li><li><strong>Column</strong>, beside it, adds a column on the right, named Column and its number, such as Column 3.</li><li>Hover over a header and choose the × over it (<strong>Delete column</strong>) to remove that column and its cells.</li><li>Hover over a row and choose the × at its left end (<strong>Delete row</strong>) to remove the row.</li></ul><p>Deleting a row or column happens straight away, without asking. A table always keeps at least one column and one row, so the × doesn't appear on the last one. When the table outgrows the node, scroll inside it. With a table selected, the Node Settings panel has its card color and the shared controls.</p>$html$,
      '[]',
      null,
      100
    ),
    (
      'calendars',
      'Calendars',
      'Calendars',
      $html$<p>A <strong>calendar</strong>, from the <strong>Calendar</strong> tool, shows today's date. Selecting one opens the Calendar Settings panel. To change how it looks, choose the gear at the top of the panel to open <strong>Calendar Style</strong>, pick a style and a theme, and choose <strong>Save Changes</strong>. The dialog previews your choice, and <strong>Cancel</strong> or the × closes it without changes.</p><ul><li><strong>Day</strong>, the default: today's weekday and date.</li><li><strong>Month</strong>: this month, with weeks starting on Monday and today circled in red.</li><li><strong>Events</strong>: today's weekday and date beside this month, with weeks starting on Sunday.</li><li><strong>Light</strong> (the default) or <strong>Dark</strong>: the calendar's theme.</li></ul><p>The rest of the Calendar Settings panel:</p><ul><li>The T opens a box headed <strong>Calendar Label</strong>, where you name the calendar. The name doesn't show on the calendar itself. It names the calendar in Recently deleted.</li><li>The first smiley adds a named reaction: <strong>Like</strong>, <strong>Love</strong>, <strong>Laugh</strong>, <strong>Wow</strong>, <strong>Sad</strong>, <strong>Angry</strong>, <strong>Celebrate</strong> or <strong>Fire</strong>. It shows on the calendar as its name and a count. The shared <strong>Add reaction</strong>, further down, adds emoji instead.</li><li>The shared controls follow, without <strong>Text style</strong>.</li></ul><p>When you resize a calendar, it snaps to steps of 50 pixels, and its text scales to fit.</p>$html$,
      '[]',
      null,
      110
    ),
    (
      'clocks',
      'Clocks',
      'Clocks',
      $html$<p>A <strong>clock</strong>, from the <strong>Clock</strong> tool, shows the time on your device, as an analog clock to start. To change it, select the clock and choose the gear at the top of the Node Settings panel to open <strong>Clock Settings</strong>. Pick the <strong>Analog</strong> or <strong>Digital</strong> tab, set the options, which the preview shows as you go, and choose <strong>Save Changes</strong>. <strong>Cancel</strong> or the × closes the dialog without changes.</p><ul><li><strong>Square Node</strong>: on (the default), the clock sits on a square background. Off, it has no background.</li><li><strong>Smooth Movement / Qwertz</strong> (analog): on (the default), the second hand sweeps. Off, it ticks once a second.</li><li><strong>Show Seconds</strong>: each tab has its own, on by default.</li><li><strong>Markers</strong> and <strong>Numbers</strong> (analog): <strong>None</strong> (the default), <strong>4</strong> (at 12, 3, 6 and 9) or <strong>All</strong> 12.</li><li><strong>Show Date</strong> (digital): on by default, under the time.</li></ul><p>The colors at the bottom of the dialog depend on the tab. Analog has <strong>Background</strong>, <strong>Clock Face</strong>, <strong>Border</strong>, <strong>Hour Hand</strong>, <strong>Minute Hand</strong>, <strong>Second Hand</strong> and <strong>Center Dot</strong>. Digital has <strong>Background</strong>, <strong>Time Text</strong> and <strong>Date Text</strong>. <strong>Background</strong> only appears while <strong>Square Node</strong> is on, and <strong>Second Hand</strong> only while <strong>Show Seconds</strong> is on.</p><p>An analog clock stays square when you resize it. Clocks have no card color and no <strong>Text style</strong>.</p>$html$,
      '[]',
      null,
      120
    ),
    (
      'images',
      'Images',
      'Adding and changing images',
      $html$<p>An <strong>image</strong>, from the <strong>Image</strong> tool, starts with a placeholder picture and the caption Untitled Image. Selecting it opens the Image panel. The picture stretches to fill the node, so resize the node to match the picture's shape.</p><p>To use your own picture, choose the picture icon at the top of the Image panel to open <strong>Change Image</strong>:</p><ol><li>Click the drop area, or drag a JPG, PNG or WEBP image onto it.</li><li>Optional: set <strong>Compression Quality</strong>, from 10% to 100% (80% to start). A lower percentage makes a smaller file.</li><li>Choose <strong>Replace Image</strong>.</li></ol><p>Pictures wider or taller than 2048 pixels are scaled down to fit. Uploading needs you to be signed in. Replacing a picture deletes the old version, so the dialog warns you and offers <strong>Download</strong> to keep a copy first. Anyone who has an uploaded picture's link can open it, without signing in.</p><p>To change the caption, choose the T in the Image panel to open <strong>Edit Caption</strong>. Set the <strong>Caption Text</strong>, <strong>Background Opacity</strong> (0% to 100%), <strong>Background Color</strong> and <strong>Text Color</strong>, then choose <strong>Save changes</strong>. Clear the text to hide the caption.</p>$html$,
      '[]',
      null,
      130
    ),
    (
      'image-tools',
      'Images',
      'Cropping, rotating and downloading images',
      $html$<p>With an image selected, the Image panel has these tools after the picture icon and the T:</p><ul><li>The crop icon opens the picture full screen under Crop Image. Drag the box's edges and corners to resize it, or drag inside it to move it. The size of the result shows in pixels under the picture. Choose the check mark (<strong>Apply Crop</strong>) to crop, the circular arrow (<strong>Reset Crop</strong>) to start over, or the × (<strong>Cancel</strong>).</li><li>The pencil opens the picture in the sketch editor, so you can draw on it. Your marks show on the image. See <a href="/help/notes/sketches">Sketches</a>.</li><li><strong>More options</strong> (the ⋯ button) → <strong>Transform</strong> has <strong>Rotate left</strong> and <strong>Rotate right</strong>, which turn the picture 90 degrees, and <strong>Flip H</strong> and <strong>Flip V</strong>, which mirror it horizontally or vertically. The same menu's <strong>Node</strong> part holds the shared controls.</li></ul><p>Double-click an image to see it full screen with its caption. The download icon (<strong>Download Image</strong>) saves it as a PNG, with its rotation, flips and drawn marks. Close the view with the × (<strong>Close</strong>) or by clicking outside the picture.</p>$html$,
      '[]',
      null,
      140
    ),
    (
      'files',
      'Files',
      'Attaching files',
      $html$<p>A <strong>file node</strong>, from the <strong>Upload</strong> tool, holds one file of any type. It reads No file selected until you add one, and selecting it opens the File panel.</p><ol><li>Choose the upload arrow at the top of the File panel to open <strong>Upload File</strong>.</li><li>Click the drop area, or drag a file onto it.</li><li>Choose <strong>Upload File</strong>.</li></ol><p>Uploading needs you to be signed in. The node then shows the file's name and size. Its download icon (<strong>Download</strong>) opens the file in a new browser tab, and so does the download arrow in the File panel. Uploading another file replaces the attachment and deletes the old version, so the dialog warns you and offers <strong>Download</strong> to keep a copy first. Anyone who has the file's link can open it, without signing in.</p><p>The color swatch in the File panel sets the node's color. The shared controls follow, including <strong>Text style</strong>.</p>$html$,
      '[]',
      null,
      150
    ),
    (
      'shapes-and-stickers',
      'Shapes and stickers',
      'Shapes and stickers',
      $html$<p>A <strong>shape</strong>, from the <strong>Shape</strong> tool, is an outlined figure that can hold text. It starts as a rounded rectangle with a Medium outline. Select it, click inside and type: the text is centered and stays inside the outline. Its panel has:</p><ul><li><strong>Shape</strong>: <strong>Rectangle</strong>, <strong>Rounded</strong>, <strong>Pill</strong>, <strong>Ellipse</strong>, <strong>Diamond</strong>, <strong>Triangle</strong>, <strong>Hexagon</strong>, <strong>Parallelogram</strong>, <strong>Cylinder</strong> or <strong>Star</strong>.</li><li><strong>Fill</strong>: <strong>Default</strong>, <strong>Transparent</strong>, one of 15 colors or a hex code.</li><li><strong>Stroke</strong>: the outline's color.</li><li><strong>Stroke Weight</strong>: <strong>None</strong>, <strong>Thin</strong>, <strong>Medium</strong>, <strong>Thick</strong> or <strong>Heavy</strong>.</li><li><strong>Text Color</strong>: the color of the shape's text.</li></ul><p>A <strong>sticker</strong>, from the <strong>Sticker</strong> tool, is one large emoji or icon. It starts as a star emoji, grows with the node and keeps its proportions when you resize it. Its panel has:</p><ul><li><strong>Emoji</strong>: pick one of 60 emoji, or paste any emoji into the box that reads Paste any emoji and choose <strong>Use</strong>.</li><li><strong>Icon</strong>: pick one of 32 icons, or find any other under <strong>Search all icons</strong>.</li><li><strong>Icon Color</strong>: only for an icon sticker. <strong>Default</strong> uses the theme's text color.</li></ul>$html$,
      '[]',
      null,
      160
    ),
    (
      'sizes-and-limits',
      'Reference',
      'Node sizes and limits',
      $html$<ul><li>Note: 338 × 68 pixels to start, and no smaller.</li><li>Text node: 360 pixels wide to start, at least 80. Its height follows its text.</li><li>Link node: 338 × 68 to start, and no smaller.</li><li>To-do list and table: sized to fit their contents. A to-do list is at least 338 × 68, a table at least 338 × 120.</li><li>Column: 374 pixels wide to start, and no narrower. Its height follows its cards, and it holds up to 100 cards.</li><li>Comment: 338 × 68 to start, at least 300 × 68.</li><li>Calendar: 200 × 200 to start, at least 100 × 100. Resizing snaps to steps of 50 pixels.</li><li>Clock: 156 × 156 to start, at least 100 × 100. An analog clock stays square.</li><li>Image: 200 × 250 to start, at least 100 × 200. Resizing doesn't snap, and uploaded pictures are scaled to at most 2048 pixels on their longer side.</li><li>File node: at least 338 × 68. Resizing doesn't snap.</li><li>Shape: 210 × 120 to start, at least 60 × 45.</li><li>Sticker: 120 × 120 to start, at least 45 × 45, and it keeps its proportions.</li></ul><p>Unless a type says otherwise, resizing snaps to the nearest 15 pixels when you let go. <strong>Arrange → Size</strong> takes an exact size of at least 20 pixels, but a node is never drawn smaller than its minimum.</p>$html$,
      '[]',
      null,
      170
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"LayoutDashboard","label":"Boards","href":"/help/notes/boards"},{"icon":"Ellipsis","label":"More tools","href":"/help/notes/more-tools"},{"icon":"FileText","label":"Documents","href":"/help/notes/documents"},{"icon":"PenTool","label":"Sketches","href":"/help/notes/sketches"},{"icon":"Users","label":"Live sessions","href":"/help/notes/live-sessions"},{"icon":"Settings","label":"Settings","href":"/help/notes/settings"}]',
      null,
      180
    )
) as v(anchor_id, eyebrow, title, content, links, showcase, sort_order)
cross join (select id from public.docs_pages where slug = 'notes/nodes' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Nodes',
    description = 'Write notes, to-do lists and tables, add images, files, calendars and clocks, and style any node from the Node Settings panel.',
    preview = null,
    status = 'draft',
    published_at = null
where slug = 'notes/nodes' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'notes/nodes' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Selecting and editing a node</li><li>The Node Settings panel</li><li>Notes and text</li><li>To-do lists</li><li>Tables and columns</li><li>Comments and links</li><li>Images and files</li><li>Calendars and clocks</li><li>Shapes and stickers</li></ul>',
  10
from public.docs_pages p
where p.slug = 'notes/nodes' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
