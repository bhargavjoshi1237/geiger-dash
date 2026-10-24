-- Help notes settings page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the notes/settings draft outline with the
-- full Settings guide and publishes it. Left out: the Account tab's "Pro Plan" badge (hard-coded, not read from billing)
-- and the top bar's Mobile App dialog (a "Coming Soon" placeholder).
-- Written from a survey of C:\Pro\geiger-notes (components/internal/settings/*, lib/settings/*, app/api/settings/route.js,
-- components/internal/canvas/appearance/*, lib/canvas/{appearance,useBoardAppearance,upload-backdrop,edge-style}.js,
-- app/api/board-appearance/route.js, components/internal/edges/CenterEdge.jsx, components/internal/layout/Topbar.jsx,
-- components/internal/layout/sidebar/MainSidebar.jsx, components/internal/canvas/BoardCanvas.jsx, app/colab/[id]/page.js).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Settings',
    description = 'Set how boards behave and look, give a board its own background, choose default styles and toolbar tools, and manage your account.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'notes/settings' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'notes/settings' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, showcase, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.showcase, v.sort_order
from (
  values
    (
      'opening-settings',
      'Basics',
      'Opening settings',
      $html$<p>To change how Notes works for you, choose the gear icon (<strong>Settings</strong>) at the right of the top bar. The <strong>Settings</strong> dialog has four tabs: <strong>General</strong>, <strong>Canvas</strong>, <strong>Defaults</strong> and <strong>Account</strong>.</p><p>Changes on <strong>General</strong>, <strong>Canvas</strong> and <strong>Defaults</strong> show on the board as you make them, but Notes keeps them only when you choose <strong>Save changes</strong>. Until then the dialog says Unsaved changes, and <strong>Cancel</strong> puts your saved settings back.</p><p>These settings belong to your account, not to a board. They apply on every board you open, personal or project, and in the sketch editor, and they don't change what anyone else sees. The exception is <strong>This board</strong> on the <strong>Canvas</strong> tab, which saves straight away and changes the open board for everyone. The <strong>Account</strong> tab has no Save button: each action there happens as soon as you choose it.</p><p>In a live session, the dialog has <strong>Done</strong> instead of <strong>Save changes</strong>, and nothing you change there is saved.</p>$html$,
      '[]',
      null,
      10
    ),
    (
      'general-settings',
      'General',
      'General settings',
      $html$<p>The <strong>General</strong> tab in <strong>Settings</strong> starts with two counts for the open board, its <strong>Nodes</strong> and its <strong>Connections</strong>. Your editing and interface options follow.</p><ul><li><strong>Double-click to insert</strong>: double-click an empty part of the board to add a note there. Off by default.</li><li><strong>Snap to grid</strong>: nodes line up with the board's grid while you drag them. Off by default. The grid's spacing is <strong>Grid size</strong> on the <strong>Canvas</strong> tab.</li><li><strong>Default drag tool</strong>: what dragging across an empty part of the board does. <strong>Select</strong> (the default) draws a box that selects nodes, and <strong>Hand</strong> moves the board. On a touch screen or in a narrow window, dragging always moves the board.</li><li><strong>Box selection</strong>: <strong>Touch</strong> (the default) selects every node the box touches, and <strong>Inside</strong> selects only the nodes fully inside it.</li><li><strong>Scroll wheel</strong>: <strong>Pan</strong> (the default) moves the board when you scroll, and <strong>Zoom</strong> zooms it.</li><li><strong>Show clock</strong>: shows the current time in the top bar. On by default.</li><li><strong>Clock animation</strong>: a shimmer on that clock. On by default, and available only while <strong>Show clock</strong> is on.</li></ul>$html$,
      '[]',
      null,
      20
    ),
    (
      'restoring-defaults',
      'General',
      'Restoring default settings',
      $html$<p>To put every option on the <strong>General</strong>, <strong>Canvas</strong> and <strong>Defaults</strong> tabs back to how Notes starts, open <strong>Settings → General</strong>, choose <strong>Reset</strong> under <strong>Restore defaults</strong>, then choose <strong>Save changes</strong>. Until you save, <strong>Cancel</strong> undoes the reset.</p><p>The reset includes your toolbar, which goes back to its starting set of tools. It doesn't change any board's own background, pattern or theme. To clear those for the open board, use <strong>Reset board</strong> on the <strong>Canvas</strong> tab.</p>$html$,
      '[]',
      null,
      30
    ),
    (
      'board-background',
      'Canvas',
      'Changing a board''s background',
      $html$<p>To change the background of the open board, open <strong>Settings → Canvas</strong> and use <strong>This board</strong>. Each change applies straight away and is saved with the board, so everyone who opens it sees it, and there's nothing to save. Only people who can edit the board can change it; anyone else sees "Only editors can change this board's look." If a change can't be saved, Notes says Couldn't save the board background.</p><p><strong>Background</strong> is what sits behind your nodes:</p><ul><li><strong>None</strong> (the default): the board and its pattern only.</li><li><strong>Color</strong>: pick a swatch or enter a color of your own.</li><li><strong>Gradient</strong>: Dusk, Ocean, Meadow, Peach, Graphite, Paper, Sunset, Mint or Mesh. <strong>Custom</strong> takes your own <strong>From</strong> and <strong>To</strong> colors, a <strong>Linear</strong> or <strong>Radial</strong> shape and, for a linear gradient, an <strong>Angle</strong>.</li><li><strong>Image</strong>: one of six photos, an image you upload (up to 12 MB) or an image URL you paste. Notes shrinks an uploaded image to at most 2,560 pixels on its longest side. <strong>Fit</strong> is Cover, Contain or Tile, and <strong>Move with the board</strong> makes the image pan and zoom with your nodes.</li><li><strong>Video</strong>: a video you upload (up to 25 MB), a YouTube link, or an .mp4 or .webm URL. It plays muted on a loop, pauses while its tab is in the background, and stays still when your device asks for reduced motion.</li><li><strong>Live</strong>: an animated backdrop, Aurora, Drift or Grain.</li></ul><p>Images and videos also have <strong>Blur</strong>, from 0 to 20 px, and <strong>Dim for readability</strong>, up to 85%, to keep nodes easy to read on top of them.</p><p><strong>This board</strong> appears only on a board. The sketch editor and live sessions don't have it.</p>$html$,
      '[]',
      null,
      40
    ),
    (
      'board-pattern-and-theme',
      'Canvas',
      'Board pattern and theme',
      $html$<p><strong>Pattern</strong>, under <strong>This board</strong> on the <strong>Settings → Canvas</strong> tab, is the grid drawn over the board's background. Like the background, it saves straight away for everyone. <strong>Default</strong> (where boards start) follows each person's own <strong>Default pattern</strong> from <strong>All boards</strong>, while Dots, Lines, Cross and None set one pattern for everyone.</p><p>While the board shows a pattern, you can also set its <strong>Colour</strong>, its <strong>Opacity</strong> from 10% to 100%, its <strong>Dot size</strong>, <strong>Line width</strong> or <strong>Cross size</strong> from 1 to 8, and its <strong>Spacing</strong> from 8 to 96 px. Until you set a spacing, it follows each person's <strong>Grid size</strong>, and <strong>Use grid size</strong> goes back to that. <strong>Major grid line</strong> draws a heavier line every 4, 5, 8 or 10 cells, or none with <strong>Off</strong>.</p><p><strong>Canvas theme</strong> forces the board light or dark whatever theme the app uses. <strong>App</strong> (the default) follows the app, and <strong>Light</strong> and <strong>Dark</strong> fix it for everyone.</p><p>To clear the board's background, pattern and theme in one go, choose <strong>Reset board</strong> beside <strong>This board</strong>. It happens straight away, without asking.</p>$html$,
      '[]',
      null,
      50
    ),
    (
      'all-boards',
      'Canvas',
      'Canvas settings for all boards',
      $html$<p><strong>All boards</strong>, on the <strong>Settings → Canvas</strong> tab, sets how every board looks and moves for you. Like the other tabs, it's kept when you choose <strong>Save changes</strong>, and it changes only your own view.</p><ul><li><strong>Default pattern</strong>: Dots (the default), Lines, Cross or None, used by boards whose own pattern is Default.</li><li><strong>Grid size</strong>: S (the default), M or L, which are 15, 30 and 45 px. It sets the spacing of the pattern and of <strong>Snap to grid</strong>.</li><li><strong>Show minimap</strong>: a small map of the whole board in a corner, which you can drag and zoom. Off by default.</li><li><strong>Minimap position</strong>: bottom right (the default), top right or top left.</li><li><strong>Max zoom</strong>: how far you can zoom in, 2× (the default), 4× or 8×.</li><li><strong>Fit to content on open</strong>: when a board opens, show every node instead of restoring the last view. Off by default.</li></ul>$html$,
      '[]',
      null,
      60
    ),
    (
      'connection-style',
      'Defaults',
      'Default connection style',
      $html$<p>To set how new connections look, open <strong>Settings → Defaults</strong> and expand <strong>Connections</strong>. A preview at the top shows the result as you go. The style applies to connections you draw after you save. Existing connections keep their style, and you change one of them in its Edge Settings panel, as <a href="/help/notes/boards#styling-connections">Boards</a> describes.</p><ul><li><strong>Color</strong>: the line's color.</li><li><strong>Thickness</strong>: Thin, Medium (the default) or Thick.</li><li><strong>Path</strong>: Curve (the default), Straight, Step, Rounded or Bezier.</li><li><strong>Line style</strong>: Solid (the default), Dashed, Dotted or Long.</li><li><strong>End arrow</strong> and <strong>Start arrow</strong>: None, Arrow, Open, Circle, Diamond or Bar. New connections start with an Arrow at the end and None at the start.</li><li><strong>Animation</strong>: motion along the line. None (the default), dash for a flowing dash, or dot for a travelling dot.</li><li><strong>Hand-drawn</strong>: sketchy strokes that match your drawings. Off by default.</li></ul>$html$,
      '[]',
      null,
      70
    ),
    (
      'node-style',
      'Defaults',
      'Node style',
      $html$<p><strong>Node style</strong>, under <strong>Settings → Defaults</strong>, sets how every node looks on your screen, including the nodes already on a board. It's your own choice: everyone else sees nodes in the style they picked. Each tile shows a preview.</p><ul><li><strong>Classic</strong> (the default): flat square cards</li><li><strong>Soft</strong>: rounded, bordered, light shadow</li><li><strong>Outline</strong>: hollow wireframe boxes</li><li><strong>Sketch</strong>: hand-drawn edges and lettering</li><li><strong>Sticky</strong>: paper sticky notes</li><li><strong>Brutalist</strong>: heavy borders, hard shadow</li><li><strong>Elevated</strong>: borderless floating cards</li><li><strong>Glass</strong>: frosted, translucent panels</li><li><strong>Bubble</strong>: extra-round, friendly cards</li><li><strong>Accent</strong>: thin border, bold left stripe</li><li><strong>Neon</strong>: glowing cyan outlines</li><li><strong>Blueprint</strong>: dashed lines on drafting blue</li><li><strong>Terminal</strong>: green monospace on black</li></ul>$html$,
      '[]',
      null,
      80
    ),
    (
      'choosing-toolbar-tools',
      'Defaults',
      'Choosing toolbar tools',
      $html$<p>To choose which tools your toolbar shows, open <strong>Settings → Defaults</strong>, expand <strong>Toolbar</strong>, choose a tool to show or hide it, then choose <strong>Save changes</strong>. The count at the top says how many of the 31 tools are visible, and <strong>Show all</strong> turns every one of them on.</p><p>A tool you hide isn't gone. It moves to <strong>More tools</strong>, the ⋯ button in the toolbar, where you can still drag it onto a board. Your toolbar starts with 16 tools, and these start under <strong>More tools</strong>: Embed, Media, Code, Timer, Poll, Progress, Chart, Person, Palette, Mind map, Mermaid diagram, Formula, AI assistant, Mirror and Huddle.</p><p>Your toolbar choice is part of your settings, so it follows you to every board and changes only your own toolbar.</p>$html$,
      '[]',
      null,
      90
    ),
    (
      'account',
      'Account',
      'Your account',
      $html$<p>The <strong>Account</strong> tab, in <strong>Settings</strong>, shows your name, your email address and the date you joined, after Member since. Each action here happens as soon as you choose it.</p><ul><li>To change your name, hover over it and choose the pencil (<strong>Edit name</strong>). Type up to 60 characters, then press <code>Enter</code> or choose the check mark. <code>Esc</code> cancels.</li><li><strong>Password</strong>: <strong>Reset</strong> emails you a link to set a new password.</li><li><strong>Support</strong>: <strong>Contact</strong> starts an email to Geiger support, for questions about billing or your plan.</li><li><strong>Sign out</strong> signs you out and takes you to the Notes home page.</li></ul>$html$,
      '[]',
      null,
      100
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"LayoutDashboard","label":"Boards","href":"/help/notes/boards"},{"icon":"StickyNote","label":"Nodes","href":"/help/notes/nodes"},{"icon":"Ellipsis","label":"More tools","href":"/help/notes/more-tools"}]',
      null,
      110
    )
) as v(anchor_id, eyebrow, title, content, links, showcase, sort_order)
cross join (select id from public.docs_pages where slug = 'notes/settings' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Settings',
    description = 'Set how the canvas behaves and looks, the default style for new connections and nodes, which tools your toolbar shows, and your account.',
    status = 'draft',
    published_at = null
where slug = 'notes/settings' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'notes/settings' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Opening settings</li><li>General</li><li>Canvas and board appearance</li><li>Defaults: connections, node style and toolbar</li><li>Account</li></ul>',
  10
from public.docs_pages p
where p.slug = 'notes/settings' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
