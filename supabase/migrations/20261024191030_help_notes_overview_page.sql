-- Help notes overview page
--
-- One-time content move, like 20261024142451_help_flow_overview_page: writes and publishes the Notes Overview that
-- 20261024191000_help_notes_structure re-homed at /help/notes (with the /notes/playground hero). Each headline area
-- gets a section that links to its guide (20261024191010 to 20261024191017).
-- Written from a survey of C:\Pro\geiger-notes (app/page.js, app/project/[projectId]/*, app/[id]/home/page.js,
-- components/landing/NotesPlayground.jsx, lib/playground/{mode,api_routes}.js, components/internal/layout/Topbar.jsx,
-- lib/settings/{tools,defaults}.js, utils/supabase/middleware.js) and of C:\Pro\geiger-dash (lib/org/product-apps.js,
-- app/org/[ORGID]/_components/constants.js), plus the area guides' surveys named in their own migration headers.
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Geiger Notes',
    nav_label = 'Overview',
    description = 'Notes is a canvas for ideas. Fill boards with notes, lists, images and widgets, write documents, draw sketches, and work together live or on a call.',
    preview = 'notes',
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'notes' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'notes' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, cards, features, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.cards::jsonb, v.features::jsonb, v.sort_order
from (
  values
    (
      'start-here',
      null,
      'Start here',
      '',
      '[{"icon":"FolderKanban","title":"Open a project","body":"Launch Notes from any project in your organization","href":"/org"},{"icon":"LayoutDashboard","title":"Build a board","body":"Add, connect and nest nodes on a board","href":"/help/notes/boards"},{"icon":"CirclePlay","title":"Try the playground","body":"Explore a sample board without signing up","href":"/notes/playground"}]',
      '[]',
      10
    ),
    (
      'opening-notes',
      'Basics',
      'Opening Notes',
      $html$<p>Notes works on <strong>boards</strong>, and there are two kinds. Your <strong>personal board</strong> is yours alone: go to the <a href="/notes">Notes home page</a> and choose <strong>Continue to Your Board</strong>. A <strong>project board</strong> belongs to a project: open your organization in Dash and launch Notes from one of its projects, and everyone in the project opens the same board.</p><p>You need to be signed in to open a board. If a project doesn't exist or you don't have access to it, Notes says so instead of opening the board.</p><p>Boards can hold other boards, so a personal or project board can grow into a tree of boards. The <a href="/help/notes/boards#opening-your-boards">Boards</a> guide covers opening and moving around them.</p>$html$,
      '[]',
      '[]',
      20
    ),
    (
      'trying-the-playground',
      'Basics',
      'Trying Notes in the playground',
      $html$<p>The <a href="/notes/playground">Notes playground</a> opens a sample project's boards in Notes without an account, so you can try the canvas, documents and sketches before you sign up.</p><p>Changes you make in the playground last until you reload the page. Live sessions, meetings and huddles need a Geiger account, so they aren't available there.</p>$html$,
      '[]',
      '[]',
      30
    ),
    (
      'whats-in-notes',
      'Areas',
      'What''s in Notes',
      '<p>Each part of Notes has its own guide. The sections on this page sum them up and link to each one.</p>',
      '[]',
      '[{"icon":"LayoutDashboard","text":"Boards: canvases of nodes, boards inside boards and access control"},{"icon":"StickyNote","text":"Nodes: notes, to-do lists, tables, images, files and more"},{"icon":"Ellipsis","text":"More tools: embeds, polls, charts, formulas, mind maps and AI"},{"icon":"FileText","text":"Documents: long-form text that lives on a board"},{"icon":"PenTool","text":"Sketches: freehand drawings linked to your boards"},{"icon":"Users","text":"Live sessions: work on a copy of a board together in real time"},{"icon":"Video","text":"Meetings and huddles: video calls started from any board"},{"icon":"Settings","text":"Settings: how boards behave and look, your toolbar and your account"}]',
      40
    ),
    (
      'boards-and-nodes',
      'Boards',
      'Boards and nodes',
      $html$<p>A board is a canvas you fill with <strong>nodes</strong>. To add one, drag a tool from the <strong>toolbar</strong> down the left side of the board, such as <strong>Note</strong>, <strong>To-do</strong>, <strong>Table</strong>, <strong>Image</strong> or <strong>Board</strong>. More tools, like polls, charts, formulas, mind maps and the AI assistant, are in the toolbar's <strong>More tools</strong> menu. Draw <strong>connections</strong> between nodes to show how ideas relate, and add a Board node to open a board inside the board.</p><p>Notes saves each board on its own, 2 seconds after your last change, so there's no Save button. Deleted nodes can be brought back from <strong>Recently deleted</strong> while you stay on the board.</p><ul><li><a href="/help/notes/boards">Boards</a> covers moving around, connections, boards inside boards and who can open them.</li><li><a href="/help/notes/nodes">Nodes</a> covers each everyday node and the controls every node shares.</li><li><a href="/help/notes/more-tools">More tools</a> covers embeds, media, code, timers, polls, progress bars, charts, formulas, people, palettes, mind maps, Mermaid diagrams, the AI assistant and mirrors.</li></ul>$html$,
      '[]',
      '[]',
      50
    ),
    (
      'documents-and-sketches',
      'Documents',
      'Documents and sketches',
      $html$<p>Two kinds of node open full editors of their own.</p><ul><li>A <strong>document</strong>, from the <strong>Document</strong> tool, is a page of rich text with headings, lists and quotes. Double-click its node to write in the document editor, which saves as you type. See <a href="/help/notes/documents">Documents</a>.</li><li>A <strong>sketch</strong>, from the <strong>Draw</strong> tool, is a freehand drawing. Double-click its node to draw in the sketch editor. Shapes in a sketch can link to boards, sketches and documents, and <strong>Push to board</strong> turns shapes into nodes on the board. See <a href="/help/notes/sketches">Sketches</a>.</li></ul>$html$,
      '[]',
      '[]',
      60
    ),
    (
      'working-together',
      'Collaboration',
      'Working together',
      $html$<p>Everyone in a project opens the same project board, but boards don't update live: changes show the next time someone opens the board, and when two people change it at once, the later save wins. To work on a board at the same moment, use one of these:</p><ul><li><strong>Live sessions</strong>: choose the people icon (<strong>Collaborate</strong>) in the top bar to put a copy of the board online. Others join with its code, you admit them as editors or viewers, and everyone sees each other's cursors and changes. Afterwards, <strong>Merge</strong> brings the work back into your board. See <a href="/help/notes/live-sessions">Live sessions</a>.</li><li><strong>Meetings</strong>: the <strong>Meeting</strong> tab of the same dialog starts a video call with audio and screen sharing, and a <strong>Huddle</strong> node starts one from the board itself. See <a href="/help/notes/meetings">Meetings and huddles</a>.</li><li><strong>Sketches</strong>: project members who open the same sketch see each other's cursors and drawing as it happens.</li></ul>$html$,
      '[]',
      '[]',
      70
    ),
    (
      'settings',
      'Settings',
      'Settings',
      $html$<p>The gear icon (<strong>Settings</strong>) in the top bar holds your own preferences: how dragging, scrolling and selecting work, the board's grid and minimap, the default style for new connections, the look of every node, which tools your toolbar shows, and your account. They're saved to your account when you choose <strong>Save changes</strong>, and apply on every board you open.</p><p>The <strong>Canvas</strong> tab also has <strong>This board</strong>, which changes the open board's background, pattern and theme for everyone, straight away. See <a href="/help/notes/settings">Settings</a>.</p>$html$,
      '[]',
      '[]',
      80
    ),
    (
      'shortcuts',
      'Reference',
      'Keyboard shortcuts',
      $html$<p>These work on any board, except while you're typing in a node or field:</p><ul><li><code>Ctrl C</code> and <code>Ctrl V</code> (<code>⌘ C</code> and <code>⌘ V</code> on Mac) copy and paste the selected nodes</li><li><code>Delete</code> or <code>Backspace</code> deletes the selected nodes and connections</li><li><code>Ctrl</code> and scroll (<code>⌘</code> and scroll on Mac) zooms, and so does pinching on a trackpad</li><li><code>Ctrl</code> and click (<code>⌘</code> and click on Mac) adds a node to the selection or takes it out</li></ul><p>The <a href="/help/notes/boards#shortcuts">Boards</a>, <a href="/help/notes/documents#writing-a-document">Documents</a> and <a href="/help/notes/more-tools#shortcuts">More tools</a> guides list the rest.</p>$html$,
      '[]',
      '[]',
      90
    )
) as v(anchor_id, eyebrow, title, content, cards, features, sort_order)
cross join (select id from public.docs_pages where slug = 'notes' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Geiger Notes',
    nav_label = 'Overview',
    description = 'Docs and knowledge.',
    preview = 'notes',
    status = 'draft',
    published_at = null
where slug = 'notes' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'notes' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>What Geiger Notes is for</li><li>Opening it from a project</li><li>Key concepts</li><li>Common workflows</li></ul>',
  10
from public.docs_pages p
where p.slug = 'notes' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
