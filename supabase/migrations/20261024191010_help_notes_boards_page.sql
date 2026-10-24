-- Help notes boards page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the notes/boards draft outline with the
-- full Boards guide and publishes it. Notes has no section showcases yet, so the page is text only.
-- Written from a survey of C:\Pro\geiger-notes (app/page.js, app/[id]/*, app/project/[projectId]/*, context/project-context.js,
-- components/internal/canvas/*, components/internal/layout/{Topbar,Sidebar}.jsx,
-- components/internal/layout/sidebar/{MainSidebar,SidebarPrimitives,EdgeSettingsSidebar,NodeSettingsSidebar}.jsx,
-- sidebar/plugs/{EditBoardNamePlug,BoardIconPlug,DownloadBoardPlug,ManageAccessPlug,PlugControls,ColorPlug,NodeAppearancePlugs}.jsx,
-- sidebar/dialogs/{BoardKeyDialog,DownloadBoardDialog,EditBoardIconDialog,EditBoardNameDialog,ManageAccessDialog}.jsx,
-- components/internal/nodes/{BoardNode,ColumnNode,registry}.js*, components/internal/edges/*,
-- components/internal/settings/{GeneralSettings,CanvasSettings,DefaultsSettings}.jsx, lib/settings/*,
-- lib/wrapers/homepage/HomePage.js, lib/wrapers/edge/EdgeArrow.js, lib/canvas/{edge-style,edge-geometry,node-appearance}.js,
-- lib/accessibility/clipboard.js, lib/supabase/{board-access,project-boards}.js, utils/supabase/*,
-- app/api/{create-board,update-board,load-state,save-state}/route.js, supabase/migrations/* for access rules).
-- Left out because it doesn't work: Download Board (its TXT, PDF and PNG exports fail on personal boards, and every format
-- exports an empty board on project boards), and Rename Board's save toast (it reports a failure on every project board).
-- The top bar's Undo/Redo, help and Mobile App controls are left out as known unwired or placeholder controls.
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Boards',
    description = 'Open your personal and project boards, move around them, add and connect nodes, nest boards inside boards, and control who can open them.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'notes/boards' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'notes/boards' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, showcase, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.showcase, v.sort_order
from (
  values
    (
      'opening-your-boards',
      'Basics',
      'Opening your boards',
      $html$<p>Notes has two kinds of board. Your <strong>personal board</strong> belongs to you. To open it, go to the <a href="/notes">Notes home page</a> and choose <strong>Continue to Your Board</strong>. If you're signed out, the button there takes you to sign in first.</p><p>A <strong>project board</strong> belongs to a project. Open your organization in Dash and launch Notes from one of its projects, and Notes opens that project's board. If you're signed out, Notes asks you to sign in first. If the project doesn't exist or you don't have access to it, Notes shows "Project not found, or you don't have access to it."</p><p>While a board loads, Notes shows its animated logo. The board then opens at the view it was saved with, panned and zoomed the way it was last left. On a project board, that's wherever the last person to save it left the view. With <strong>Fit to content on open</strong> turned on in <a href="/help/notes/settings">Settings</a>, a board opens zoomed to show every node instead.</p>$html$,
      '[]',
      null,
      10
    ),
    (
      'personal-and-project-boards',
      'Concepts',
      'Personal and project boards',
      $html$<p>A <strong>board</strong> is a canvas you fill with nodes: notes, lists, images, files and anything else from the toolbar. A board can also hold other boards, each opened from a Board node (see <a href="#boards-inside-boards">Boards inside boards</a>).</p><p>Boards you create inside your personal board are personal too. A project board is shared: everyone in the project opens the same board, and boards created inside it belong to the project. Only those boards inside a project board can have their access limited, with <a href="#managing-access">Manage Access</a>. The project's top-level board stays open to everyone in the project.</p><p>Boards don't update live. Changes someone else makes to a project board show the next time you open it, and when two people change the same board at once, the later save replaces the earlier one. To work on a board together at the same time, start a <a href="/help/notes/live-sessions">live session</a>.</p>$html$,
      '[]',
      null,
      20
    ),
    (
      'saving-and-syncing',
      'Concepts',
      'Saving and syncing',
      $html$<p>Notes saves each board on its own, so there is no Save button. Any change on the board, including moving or zooming the view, starts a short wait: once 2 seconds pass without another change, Notes saves the whole board. While a save is waiting or in progress, a thin moving bar runs along the top edge of the top bar. It disappears once the board is saved.</p><p>When you leave a board or close the page, Notes first saves any change that's still waiting.</p><p>If a save fails, for example because you're offline, Notes shows "Failed to auto-save". Your changes stay on screen, and Notes tries again with your next change. Once you're back online, make any change, even moving the view, to save the board again. Notes doesn't keep unsaved changes anywhere else, so changes that never saved are lost if you reload or close the page first.</p>$html$,
      '[]',
      null,
      30
    ),
    (
      'moving-around',
      'Canvas',
      'Moving around a board',
      $html$<p>To move around a board, scroll, or drag with the middle mouse button. On Windows, hold <code>Shift</code> while you scroll to move sideways. To zoom, hold <code>Ctrl</code> (<code>⌘</code> on Mac) and scroll, or pinch on a trackpad. The plus (<strong>Zoom In</strong>) and minus (<strong>Zoom Out</strong>) buttons in the bottom-left corner zoom one step at a time. Double-clicking the board doesn't zoom.</p><p>You can zoom out to 10% and in to 200%. In <a href="/help/notes/settings">Settings</a> you can zoom in further (<strong>Max zoom</strong>), make scrolling zoom instead of move (<strong>Scroll wheel</strong>), make dragging an empty part of the board move it (<strong>Default drag tool</strong>) and turn on a minimap (<strong>Show minimap</strong>).</p><p>The minimap sits in the bottom-right corner unless you move it in Settings. Drag inside it to move around the board, and scroll on it to zoom.</p><p>On a touch screen, or in a window narrower than 768 pixels, dragging always moves the board. In a narrow window, the panel icon at the left of the top bar (<strong>Toggle Sidebar</strong>) hides and shows the toolbar.</p>$html$,
      '[]',
      null,
      40
    ),
    (
      'selecting-nodes',
      'Canvas',
      'Selecting several nodes',
      $html$<p>To select several nodes, drag across an empty part of the board. The box selects every node it touches; to select only the nodes fully inside it, change <strong>Box selection</strong> in <a href="/help/notes/settings">Settings</a>. When dragging moves the board instead, hold <code>Shift</code> and drag to draw the box.</p><p>To add a node to the selection or take one out, hold <code>Ctrl</code> (<code>⌘</code> on Mac) and click it. Click an empty part of the board to clear the selection. Drag any selected node to move them all together.</p><p>Press <code>Delete</code> or <code>Backspace</code> to delete the selected nodes and connections. Notes doesn't ask first, but deleted nodes go to <a href="#restoring-deleted-nodes">Recently deleted</a>, where you can restore them. A node locked with <strong>Lock position</strong> isn't deleted. While you're typing in a node, those keys edit the text instead.</p><p>Selecting and editing a single node is covered in <a href="/help/notes/nodes">Nodes</a>.</p>$html$,
      '[]',
      null,
      50
    ),
    (
      'adding-nodes',
      'Toolbar',
      'Adding nodes from the toolbar',
      $html$<p>To add a node, drag its tool from the toolbar, the strip down the left side of the board, and drop it where you want the node. Clicking a tool doesn't add anything. Hover over a tool to see its name.</p><p>The toolbar starts with <strong>Note</strong>, <strong>Link</strong>, <strong>To-do</strong>, <strong>Document</strong>, <strong>Board</strong>, <strong>Column</strong>, <strong>Comment</strong>, <strong>Table</strong>, <strong>Calendar</strong>, <strong>Clock</strong>, <strong>Image</strong>, <strong>Upload</strong>, <strong>Draw</strong>, <strong>Text</strong>, <strong>Shape</strong> and <strong>Sticker</strong>. The other tools are in the <a href="#more-tools">More tools</a> menu. You choose which tools the toolbar shows in <a href="/help/notes/settings">Settings</a>.</p><p>A few drops work differently:</p><ul><li>Drop <strong>Note</strong>, <strong>Link</strong>, <strong>To-do</strong> or <strong>Comment</strong> on a column, and it becomes a card in that column instead of a node of its own.</li><li><strong>Board</strong>, <strong>Document</strong> and <strong>Draw</strong> create a board, a document or a sketch as they land. If that fails, Notes shows "Failed to create board", "Failed to create document" or "Failed to create sketch".</li><li>On a board you can only view, dropping a tool does nothing.</li></ul><p>To add a note by double-clicking an empty part of the board instead, turn on <strong>Double-click to insert</strong> in Settings. What each tool makes is covered in <a href="/help/notes/nodes">Nodes</a>, <a href="/help/notes/documents">Documents</a> and <a href="/help/notes/sketches">Sketches</a>.</p>$html$,
      '[]',
      null,
      60
    ),
    (
      'more-tools',
      'Toolbar',
      'The More tools menu',
      $html$<p>Tools that aren't in your toolbar are in the <strong>More tools</strong> menu, the ⋯ icon at the end of the toolbar's tools. Open it and drag a tool from the menu onto the board, the same way as from the toolbar.</p><p>To start with, the menu holds Embed, Media, Code, Timer, Poll, Progress, Chart, Person, Palette, Mind map, Mermaid diagram, Formula, AI assistant, Mirror and Huddle. Once every tool is in your toolbar, the menu says "Every tool is already in your toolbar."</p><p>To move tools between the toolbar and the menu, choose which tools your toolbar shows in <a href="/help/notes/settings">Settings</a>. The tools themselves are covered in <a href="/help/notes/more-tools">More tools</a> and <a href="/help/notes/meetings">Meetings and huddles</a>.</p>$html$,
      '[]',
      null,
      70
    ),
    (
      'connecting-nodes',
      'Connections',
      'Connecting nodes',
      $html$<p>A <strong>connection</strong> is a line from one node to another. To draw one, select a node, then drag from the small square that appears on its edge and drop on any part of another node. On most nodes the square is at the top-right corner; a document's is on its left edge, and a Board node has squares at more than one corner. The connection runs from the node you started at to the one you dropped on. It takes the default style set under <strong>Connections</strong> in <a href="/help/notes/settings">Settings</a>, which starts as a solid line with an arrow at the end.</p><p>Click a connection to select it. Its settings replace the toolbar (see <a href="#styling-connections">Styling a connection</a>), and the line shows dots you can drag:</p><ul><li>The white dot in the middle (<strong>Drag to bend · double-click to reset</strong>) bends the line. Double-click it to undo the bend. Straight and Bezier connections don't bend.</li><li>The dot at either end (<strong>Drag onto another node to reconnect</strong>) moves that end to the node you drop it on.</li></ul><p>To delete a connection, select it and press <code>Delete</code> or <code>Backspace</code>. Notes doesn't ask first, and a connection you delete on its own can't be restored. Deleting a node deletes its connections too. On a board you can only view, you can't draw, bend, reconnect or delete connections.</p>$html$,
      '[]',
      null,
      80
    ),
    (
      'styling-connections',
      'Connections',
      'Styling a connection',
      $html$<p>With a connection selected, the toolbar becomes the Edge Settings panel. Each change applies straight away and saves with the board. The back arrow at the top clears the selection and brings the toolbar back. Hover over an icon to see its name:</p><ul><li>The color swatch at the top sets the line's color: pick one of 15 colors, or enter your own under <strong>Custom Hex</strong>. The arrowheads take the same color.</li><li><strong>Path</strong>: <strong>Curve</strong>, <strong>Straight</strong>, <strong>Step</strong>, <strong>Rounded</strong> or <strong>Bezier</strong>. Changing the path undoes a bend, and once the line is bent, <strong>Reset bend</strong> appears here to undo it. <strong>Hand-drawn</strong> gives the line a sketchy look.</li><li><strong>Arrowheads</strong>: a shape for the <strong>Start</strong> and the <strong>End</strong> of the line: None, Arrow, Open, Circle, Diamond or Bar. The two-way arrow beside Start (<strong>Swap ends</strong>) swaps the two shapes. <strong>Size</strong> is S, M or L.</li><li><strong>Line</strong>: the <strong>Pattern</strong> (Solid, Dashed, Dotted or Long dash), the <strong>Thickness</strong> (1px, 2px, 3px, 4px or 6px) and the <strong>Opacity</strong>, from 10% to 100% in steps of 5%.</li><li><strong>Animation</strong>: a <strong>Flow</strong> along the line, either None, Flowing dash or Travelling dot.</li><li><strong>Label</strong>, the T, puts text on the line (see <a href="#connection-labels">Connection labels</a>).</li></ul>$html$,
      '[]',
      null,
      90
    ),
    (
      'connection-labels',
      'Connections',
      'Connection labels',
      $html$<p>To put text on a connection, select it and open <strong>Label</strong>, the T in the Edge Settings panel. Type in the <strong>Text</strong> box, which reads Add a label until you do. The label shows on the line, and clearing the text removes it. The rest of the <strong>Label</strong> menu styles it:</p><ul><li><strong>Size</strong>: <strong>Small</strong>, <strong>Medium</strong> (the default) or <strong>Large</strong>.</li><li><strong>Position along edge</strong>: how far along the line the label sits, from 5% to 95% of the way from its start, in steps of 5%. Labels start at 50%, the middle.</li><li><strong>Text colour</strong>: the label's color. <strong>Reset</strong> goes back to the theme's color.</li><li><strong>Background</strong>: the color behind the label, with <strong>Reset</strong> to go back to the theme's. <strong>Hide</strong> removes the background, and <strong>Show</strong> brings it back.</li></ul>$html$,
      '[]',
      null,
      100
    ),
    (
      'boards-inside-boards',
      'Boards',
      'Boards inside boards',
      $html$<p>A <strong>Board node</strong> opens another board, so you can keep boards inside boards. To make one, drag the <strong>Board</strong> tool onto a board. Notes creates an empty board named Untitled Board and places its node where you dropped it, with "Double click to open" under the name. A board you make inside your personal board is personal, and one you make inside a project board belongs to the project.</p><p>Double-click a Board node to open its board. The top bar then shows a breadcrumb trail: <strong>Notes</strong>, followed by each board you opened on the way down. Click a board's name to go back to it, or <strong>Notes</strong> to return to the top-level board. The open board is part of the page's address, so refreshing keeps you on it, but the trail then shows only that board.</p><p>Deleting a Board node removes only the node, not the board it opens. The node is your way back into that board, so if you delete one by mistake, restore it from <a href="#restoring-deleted-nodes">Recently deleted</a>. A copy of a Board node made with <strong>Duplicate</strong> opens the same board as the original, not a copy of it.</p><p>On a project board, opening a Board node can ask for an access key or be refused. See <a href="#opening-a-locked-board">Opening a locked board</a>.</p>$html$,
      '[]',
      null,
      110
    ),
    (
      'renaming-a-board',
      'Boards',
      'Renaming a board and changing its icon',
      $html$<p>To rename a board, select its Board node. The Node Settings panel replaces the toolbar and starts with buttons for the board, including:</p><ul><li>The pencil (<strong>Rename Board</strong>), which opens <strong>Edit Board Name</strong>. Change the <strong>Name</strong> and, optionally, the <strong>Caption</strong>: the line under the name that otherwise reads Double click to open. Choose <strong>Save</strong> or press <code>Enter</code>. The node shows the new name, and so does the top bar's trail when you open the board.</li><li>The palette (<strong>Change Icon & Accents</strong>), which opens <strong>Edit Board Icon & Accent</strong>. Pick an icon under <strong>Select Icon</strong>; hover over one to see its name. Then set the two <strong>Theme Colors</strong>: <strong>Background</strong>, the tile behind the icon, and <strong>Icon Color</strong>. Each offers 15 colors and a <strong>Custom Hex</strong> field, and <strong>Preview</strong> shows the result. Choose <strong>Save</strong> to apply it. New Board nodes have a purple dashboard icon.</li></ul><p>On a project board, the panel can also have <strong>Manage Access</strong> (see <a href="#managing-access">Controlling who can open a board</a>). The rest of the panel holds the controls every node has, such as its color, appearance and arrangement; see <a href="/help/notes/nodes">Nodes</a>.</p>$html$,
      '[]',
      null,
      120
    ),
    (
      'managing-access',
      'Access',
      'Controlling who can open a board',
      $html$<p>On a project board, you can control who in the project can open and edit each board inside it. Select the board's Board node and choose the shield (<strong>Manage Access</strong>) in the Node Settings panel. Only the member who created that board, the project's owners and members given the Manage level see it, and it doesn't appear on personal boards.</p><p>Until someone saves these settings, every member of the project can open and edit the board. In the <strong>Manage Access</strong> dialog:</p><ul><li><strong>Entry</strong>: <strong>Keyless</strong> lets members in according to their level. <strong>Keyed</strong> makes them type an access key first: set it in the box that reads Access key. Without a key, Notes won't save and shows "Set an access key or switch to keyless entry."</li><li><strong>Everyone in the project</strong>: the level for members who don't have their own, either <strong>No access</strong>, <strong>View only</strong> or <strong>Can edit</strong>. It starts at View only, so saving the dialog without changing it makes the board view-only for those members.</li><li><strong>Members</strong>: a level for one person: <strong>No access</strong>, <strong>View only</strong>, <strong>Can edit</strong> or <strong>Manage</strong>, which also lets them open Manage Access. The project's owners are marked <strong>Owner</strong> and keep full access.</li></ul><p>Choose <strong>Save access</strong>. Notes shows "Access settings saved", or "Couldn't save access settings." if the save fails. <strong>Cancel</strong> closes the dialog without saving.</p>$html$,
      '[]',
      null,
      130
    ),
    (
      'opening-a-locked-board',
      'Access',
      'Opening a locked board',
      $html$<p>When you double-click a Board node on a project board, Notes checks your level for that board:</p><ul><li><strong>No access</strong>: the board doesn't open, and Notes shows "You don't have access to this board."</li><li>On a <strong>Keyed</strong> board, Notes asks for the key in <strong>Enter access key</strong>. Type the key and choose <strong>Unlock</strong>, or press <code>Enter</code>. The key must match exactly, including capital letters. A wrong key shows "Incorrect access key." and keeps the dialog open. Notes asks every time you open the board.</li><li><strong>View only</strong>: the board opens, but you can't add, move, connect, paste or delete nodes, or change the board's look. You can still move around it and copy nodes.</li><li><strong>Can edit</strong> and <strong>Manage</strong>: the board opens as usual.</li></ul><p>The member who created the board and the project's owners never need the key and can always edit it.</p>$html$,
      '[]',
      null,
      140
    ),
    (
      'restoring-deleted-nodes',
      'Canvas',
      'Restoring deleted nodes',
      $html$<p>Nodes you delete go to <strong>Recently deleted</strong>, the trash icon at the bottom of the toolbar. Its badge shows how many deletions it holds. Open it to see each one, with the node's text or type, how many nodes went at once, and how long ago. Choose <strong>Restore</strong> to put the nodes back where they were, with their connections. Notes shows "Restored".</p><p>The list belongs to the board you're on and lasts only while you stay there: it empties when you leave the board or reload the page. It keeps the 30 most recent deletions. Connections you delete on their own don't appear in it. While it's empty, it says "Nodes you delete in this session show up here so you can bring them back."</p>$html$,
      '[]',
      null,
      150
    ),
    (
      'copy-and-paste',
      'Canvas',
      'Copying and pasting nodes',
      $html$<p>To copy nodes, select them and press <code>Ctrl C</code> (<code>⌘ C</code> on Mac). Connections between the copied nodes come along. Press <code>Ctrl V</code> (<code>⌘ V</code> on Mac) to paste: the copies land down and to the right of the originals, already selected, so you can drag them into place.</p><p>Notes keeps what you copied in this browser until you copy something else, so you can paste it on another board or in another tab. This is separate from your computer's clipboard: copied nodes don't paste into other apps, and text copied elsewhere doesn't paste onto the board as a node. While you're typing in a node or a field, the keys copy and paste text as usual.</p><p>You can copy from a board you can only view, but not paste into one. To copy one node in place, you can also use <strong>Duplicate</strong>; see <a href="/help/notes/nodes">Nodes</a>.</p>$html$,
      '[]',
      null,
      160
    ),
    (
      'shortcuts',
      'Reference',
      'Keyboard and mouse shortcuts',
      $html$<ul><li><code>Ctrl C</code> (<code>⌘ C</code> on Mac) copies the selected nodes, and <code>Ctrl V</code> (<code>⌘ V</code> on Mac) pastes them</li><li><code>Delete</code> or <code>Backspace</code> deletes the selected nodes and connections</li><li><code>Ctrl</code> and click (<code>⌘</code> and click on Mac) adds a node to the selection or takes it out</li><li>Dragging across an empty part of the board selects with a box, and <code>Shift</code> and drag does the same when dragging moves the board</li><li>Scrolling, or dragging with the middle mouse button, moves around the board, and <code>Shift</code> and scroll moves sideways on Windows</li><li><code>Ctrl</code> and scroll (<code>⌘</code> and scroll on Mac) zooms, and so does pinching on a trackpad</li><li>Double-clicking a Board node opens its board</li><li>Double-clicking the middle dot of a selected connection undoes its bend</li><li><code>Enter</code> saves in <strong>Edit Board Name</strong>, and unlocks the board in <strong>Enter access key</strong></li></ul>$html$,
      '[]',
      null,
      170
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"NotebookPen","label":"Geiger Notes","href":"/help/notes"},{"icon":"StickyNote","label":"Nodes","href":"/help/notes/nodes"},{"icon":"Ellipsis","label":"More tools","href":"/help/notes/more-tools"},{"icon":"PenTool","label":"Sketches","href":"/help/notes/sketches"},{"icon":"Users","label":"Live sessions","href":"/help/notes/live-sessions"},{"icon":"Settings","label":"Settings","href":"/help/notes/settings"}]',
      null,
      180
    )
) as v(anchor_id, eyebrow, title, content, links, showcase, sort_order)
cross join (select id from public.docs_pages where slug = 'notes/boards' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Boards',
    description = 'Open your boards, move around the canvas, add and connect nodes, nest boards inside boards, and control who can open them.',
    status = 'draft',
    published_at = null
where slug = 'notes/boards' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'notes/boards' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Opening your boards</li><li>Moving around the canvas</li><li>Adding nodes from the toolbar</li><li>Connecting nodes</li><li>Boards inside boards</li><li>Renaming and downloading a board</li><li>Board access and access keys</li><li>Saving and syncing</li><li>Recently deleted</li><li>Keyboard shortcuts</li></ul>',
  10
from public.docs_pages p
where p.slug = 'notes/boards' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
