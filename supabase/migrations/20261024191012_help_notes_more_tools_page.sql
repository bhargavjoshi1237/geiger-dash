-- Help notes more tools page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the notes/more-tools draft outline with the
-- full More tools guide and publishes it. It covers the node types that start under the toolbar's More tools menu;
-- Huddle is on the Meetings & huddles page (20261024191016). Left out: timers and progress nodes as formula inputs
-- (the formula reads fields those nodes don't keep, so they come through as 0) and the AI assistant's setup message.
-- Written from a survey of C:\Pro\geiger-notes (components/internal/nodes/{embed,media,code,timer,poll,progress,chart,
-- person,palette,mindmap,mermaid,formula,ai,mirror}/*, components/internal/nodes/{registry.js,shared/*},
-- components/internal/layout/sidebar/{MainSidebar,NodeSettingsSidebar,SidebarPrimitives}.jsx, lib/settings/{defaults,tools}.js,
-- components/internal/colab/live/SessionContext.jsx, app/api/ai/node/route.js, app/api/sketches/link-targets/route.js).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'More tools',
    description = 'Add embeds, audio and video, code, timers, polls, progress bars, charts, formulas, people, palettes, mind maps, Mermaid diagrams, the AI assistant and mirrors.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'notes/more-tools' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'notes/more-tools' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, showcase, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.showcase, v.sort_order
from (
  values
    (
      'adding-from-more-tools',
      'Basics',
      'Adding a node from More tools',
      $html$<p>To add one of these nodes, open <strong>More tools</strong>, the ⋯ button in the toolbar, and drag a tool from it onto the board. It holds the tools that aren't in your toolbar, starting with Embed, Media, Code, Timer, Poll, Progress, Chart, Person, Palette, Mind map, Mermaid diagram, Formula, AI assistant, Mirror and Huddle. To keep a tool in the toolbar instead, turn it on in <a href="/help/notes/settings#choosing-toolbar-tools">Settings</a>. Huddle is covered in <a href="/help/notes/meetings">Meetings and huddles</a>.</p><p>Select one of these nodes to edit it. Its own controls appear at the top of the Node Settings panel, where hovering over an icon shows its name, and the controls every node shares follow them, as <a href="/help/notes/nodes">Nodes</a> describes. All of them have the card color swatch except code and mind map nodes. Every change saves with the board as you make it, so there's no Save button.</p><p>Several of these nodes read other nodes through connections: charts read a table, formulas and progress bars add up what's connected to them, and the AI assistant reads the text of what's connected. To connect two nodes, see <a href="/help/notes/boards">Boards</a>.</p>$html$,
      '[]',
      null,
      10
    ),
    (
      'embeds',
      'Embeds',
      'Embedding a web page or video',
      $html$<p>An <strong>Embed</strong> node shows a live web page on the board. A new one asks you to <strong>Embed a link</strong>: paste a URL, then choose <strong>Embed</strong> or press <code>Enter</code>. If Notes can't use the link, it says That link can't be embedded.</p><p>These sites get a player or viewer sized to fit, and the node resizes to match: YouTube (videos, Shorts, playlists and links with a start time), Vimeo, Loom, Figma, Google Docs, Sheets and Slides, Google Maps, Spotify, CodePen, CodeSandbox and Miro. Any other https address embeds as a <strong>Website</strong>. Addresses that start with http are opened as https.</p><p>Select the node to use what's inside it, such as playing a video or scrolling a document. Its top bar shows the site and has the pencil (<strong>Change link</strong>) and <strong>Open in new tab</strong>. Its panel has:</p><ul><li><strong>Embed link</strong>: paste a different URL and choose <strong>Save</strong>. The box names the site it recognizes, or says Not embeddable.</li><li><strong>Reset to provider size</strong>: puts back the size that suits the site.</li><li><strong>Open in new tab</strong>.</li><li><strong>Remove embed</strong>: clears the link so the node asks for a new one.</li></ul>$html$,
      '[]',
      null,
      20
    ),
    (
      'audio-and-video',
      'Media',
      'Audio and video',
      $html$<p>A <strong>Media</strong> node plays audio or video. A new one shows <strong>Add audio or video</strong>, with three ways to fill it:</p><ul><li><strong>Upload</strong>: pick an audio or video file of up to 5 MB.</li><li><strong>Record</strong>: records a voice memo from your microphone, for up to 3 minutes, with the time shown as you go. Choose <strong>Stop</strong> to keep it or <strong>Discard</strong> to throw it away. Your browser asks for the microphone first.</li><li>Paste an mp4 or mp3 address that starts with http or https, then choose <strong>Add</strong>. Addresses ending in an audio format, such as .mp3, .wav or .m4a, play as audio, and anything else plays as video.</li></ul><p>Audio shows a play button, its name and a bar you drag to move through it. Video shows the video with its own controls: select the node to use them. Uploaded files and recordings are stored in the board, so everyone who can open the board can play them.</p><p>The panel has <strong>Replace source</strong>, which empties the node so you can add something else, <strong>Loop playback</strong>, and <strong>Download</strong>, which saves an uploaded file or recording. For a pasted address, <strong>Download</strong> reads <strong>Open source</strong> and opens it in a new tab, and <strong>Play as video</strong> or <strong>Play as audio</strong> switches how it plays.</p>$html$,
      '[]',
      null,
      30
    ),
    (
      'code',
      'Code',
      'Code snippets',
      $html$<p>A <strong>Code</strong> node holds a snippet of code with syntax highlighting and line numbers. Select it, click inside and type. <code>Tab</code> indents by two spaces, <code>Shift Tab</code> removes them, and <code>Esc</code> stops editing. An empty snippet shows <code>// Empty snippet</code>.</p><p>While the node is selected, its top bar has a file name box and a language menu. The languages are JavaScript (the default), TypeScript, JSX, Python, JSON, HTML, CSS, SQL, Bash, Go, Rust, Java and Plain text. Its top bar also has <strong>Wrap lines</strong> and <strong>Copy code</strong>, which says Code copied.</p><p>The panel has the same <strong>Language</strong> menu, plus <strong>Hide line numbers</strong> or <strong>Show line numbers</strong>, <strong>Wrap lines</strong>, <strong>Copy code</strong> and <strong>Download as file</strong>. The download uses the file name you typed, or <code>snippet</code> with the language's extension. Code nodes have no card color.</p>$html$,
      '[]',
      null,
      40
    ),
    (
      'timers',
      'Timers',
      'Timers, pomodoros and countdowns',
      $html$<p>A <strong>Timer</strong> node counts time on the board, in one of four modes you pick under <strong>Mode</strong> in its panel:</p><ul><li><strong>Timer</strong> (the default): counts down a duration, 5 minutes to start.</li><li><strong>Pomodoro</strong>: focus and break cycles. Focus lasts 25 minutes, a short break 5 and a long break 15, with a long break after every 4 focus sessions.</li><li><strong>Stopwatch</strong>: counts up from zero.</li><li><strong>Countdown</strong>: shows the days, hours, minutes and seconds until a date and time.</li></ul><p>Use <strong>Start</strong>, <strong>Pause</strong> and <strong>Reset</strong> on the node. A paused timer shows <strong>Resume</strong>, and a finished one shows <strong>Restart</strong>. A pomodoro stops at the end of each phase and starts the next one on <strong>Start</strong>; <strong>Skip phase</strong> moves on early. A countdown has no buttons: it runs until its date.</p><p><strong>Duration</strong> in the panel sets the time: hours, minutes and seconds for a timer, with shortcuts from 1 to 60 minutes, or the four pomodoro lengths and <strong>Reset cycles</strong>, or the date and time for a countdown. Changing the mode or duration resets the timer. <strong>Label</strong> names it, <strong>Accent color</strong> colors its ring, and <strong>Mute chime</strong> silences the sound it plays when time is up.</p><p>The timer is saved with the board, so it keeps counting after a reload and everyone who opens the board sees the same time. In a live session, a host can keep timers to the hosts, and the node then reads The host runs this timer.</p>$html$,
      '[]',
      null,
      50
    ),
    (
      'polls',
      'Polls',
      'Polls and dot voting',
      $html$<p>A <strong>Poll</strong> node asks a question and counts votes. Select it to type the question and its options: a new poll has Option A and Option B. <strong>Add option</strong>, or <code>Enter</code> in an option, adds one, and the × beside an option removes it.</p><p>To vote, click an option. <strong>Voting mode</strong> in the panel sets how votes work:</p><ul><li><strong>Single choice</strong> (the default): one vote each. Click your option again to take the vote back.</li><li><strong>Multiple choice</strong>: pick any number of options.</li><li><strong>Dot voting</strong>: spend a number of dots, 3 to start (from 1 to 20 under <strong>Dots per voter</strong>), and stack them on any options. The minus beside your dots takes one back, and the poll shows how many you have left.</li></ul><p>Changing the mode resets the votes. Each option shows its count and percentage and, unless the poll is anonymous, the initials of up to three voters. Votes are saved with the board, so everyone who opens it sees the same results.</p><p>The panel also has <strong>Anonymous</strong>, which stops recording voters' names, and these controls, which also appear on the selected node: <strong>Hide results</strong> until you reveal them, <strong>Close poll</strong> to stop voting until you reopen it, and <strong>Reset votes</strong>. In a live session, hidden results stay visible to hosts, a host can keep these controls to the hosts, and viewers see Voting is paused by the host.</p>$html$,
      '[]',
      null,
      60
    ),
    (
      'progress',
      'Progress',
      'Progress bars',
      $html$<p>A <strong>Progress</strong> node shows how far along a goal is, as a percentage. Select it to type the goal's title. In its panel:</p><ul><li><strong>Style</strong>: <strong>Bar</strong> (the default) or <strong>Ring</strong>.</li><li><strong>Source</strong>: <strong>Manual</strong> (the default) tracks a value against a target, and <strong>Connected</strong> rolls up the nodes connected to it.</li><li><strong>Target</strong>: for a manual goal, the <strong>Current</strong> value and the <strong>Target</strong>, which start at 0 and 10. With the node selected, the minus and plus beside the value change it by one.</li><li><strong>Bar color</strong>, and <strong>Show milestones</strong>, which marks 25%, 50% and 75% and counts how many the goal has passed.</li></ul><p>A connected goal counts the to-do lists, columns and other progress nodes connected to it. Each to-do item, and each to-do card in a column, counts as one step that's done once it's checked, and each connected progress node counts as one step at its own percentage. The caption shows what it counted, like 3 of 8 done. With nothing connected, it reads Connect to-dos, columns or goals.</p>$html$,
      '[]',
      null,
      70
    ),
    (
      'charts',
      'Charts',
      'Charts',
      $html$<p>A <strong>Chart</strong> node draws a bar, line, area, pie or donut chart from a table. Its panel has:</p><ul><li><strong>Chart type</strong>: Bar (the default), Line, Area, Pie or Donut.</li><li><strong>Data source</strong>: <strong>Connected table</strong> (the default) reads a table node you connect to the chart. <strong>Inline data</strong> keeps a small dataset on the chart itself: choose <strong>Edit data</strong> to fill in the <strong>Chart data</strong> dialog, using <strong>Add row</strong> and the plus to add a column, then choose <strong>Save data</strong>.</li><li><strong>Title</strong>, <strong>Show legend</strong> or <strong>Hide legend</strong>, and for bar and area charts, <strong>Stack series</strong>.</li></ul><p>In the data, the first column labels each category, and every column of numbers becomes a series, up to eight. Numbers can include commas and symbols such as $, € and %. A pie or donut chart uses the first series and shows up to six slices, grouping the rest as Other.</p><p>A new chart with no table connected reads Connect a table, with <strong>Use sample data</strong> to start from example figures. Hover over the chart to see values, and use the table icon in its corner (<strong>Show data table</strong>) to see the numbers it's drawing.</p>$html$,
      '[]',
      null,
      80
    ),
    (
      'formulas',
      'Formulas',
      'Formulas',
      $html$<p>A <strong>Formula</strong> node calculates a number from the nodes connected to it. It reads:</p><ul><li>a table: every number in it, or only the column named in its <strong>Table column</strong> setting;</li><li>a to-do list: how many items are checked;</li><li>a column: how many cards it holds;</li><li>a note, text node or comment: the first number in its text;</li><li>another formula: its result, when the connection runs from that formula into this one.</li></ul><p>The function icon in the panel opens <strong>Operation</strong>: <strong>Sum</strong> (the default), <strong>Average</strong>, <strong>Minimum</strong>, <strong>Maximum</strong>, <strong>Count</strong>, <strong>Percent done</strong> (checked to-dos out of all to-dos, across connected to-do lists and columns) and <strong>Custom expression</strong>. A custom expression names the connected nodes A, B, C and so on, in the order they were connected, and can use <code>+ - * / % ^</code> and round, floor, ceil, abs, min, max and sqrt, like <code>(A + B) / C</code>. While the node is selected, it lists each input with its letter.</p><p>The # icon opens <strong>Format</strong>: <strong>Number</strong>, <strong>Currency</strong> (US dollars) or <strong>Percent</strong>, with 0 to 6 <strong>Decimals</strong> and a <strong>Unit</strong> of up to 12 characters, like <code>hrs</code>. Select the node to rename it (Total to start). When it can't calculate, it says why: Connect nodes to compute, No numbers found, or Circular reference when formulas feed into each other in a loop.</p>$html$,
      '[]',
      null,
      90
    ),
    (
      'people',
      'People',
      'People cards',
      $html$<p>A <strong>Person</strong> node is a contact card. Select it to type a name, role and team, and an email address, which becomes a mail link. On an empty card, <strong>Use me</strong> fills it from your own profile: your name, email, picture and time zone. The panel's <strong>Fill from my profile</strong> does the same, and needs you to be signed in.</p><ul><li><strong>Status</strong>: Available (the default), Busy, Away or Out of office. You can also click the status on the selected card.</li><li><strong>Avatar</strong>: the address of a picture. Leave it empty to show initials.</li><li><strong>Timezone</strong>: pick or type a time zone, like <code>Europe/Berlin</code>, or choose <strong>Use my timezone</strong>. The card then shows the person's local time and its offset.</li><li><strong>Links</strong>: <strong>Add link</strong> adds a label and URL, shown on the card and opened in a new tab.</li></ul>$html$,
      '[]',
      null,
      100
    ),
    (
      'palettes',
      'Palettes',
      'Color palettes',
      $html$<p>A <strong>Palette</strong> node keeps a set of colors, starting with five. Click a color to copy its hex code. Select the node to name the palette and each color, and to change the colors: each one has arrows to move it left or right, a pipette (<strong>Edit color</strong>) and an × to remove it, and the plus adds a color.</p><p>The panel has:</p><ul><li><strong>Switch to strip</strong> or <strong>Switch to grid</strong>: shows the colors as a strip of bands or a grid of swatches.</li><li><strong>Add color</strong>.</li><li><strong>Generate shades</strong>: pick a base color, an optional name prefix and 5, 7, 9 or 11 shades, then choose <strong>Append</strong> to add them or <strong>Replace</strong> to replace the palette.</li><li><strong>Copy all colors</strong>: copies every color as a line of text, with its name if it has one.</li></ul>$html$,
      '[]',
      null,
      110
    ),
    (
      'mind-maps',
      'Mind maps',
      'Mind maps',
      $html$<p>A <strong>Mind map</strong> node starts a mind map with a Central topic. Each topic is a node of its own, joined to its parent by a connection. To build the map, select a topic and press:</p><ul><li><code>Tab</code> to add a child topic,</li><li><code>Enter</code> to add a topic beside it, under the same parent,</li><li><code>F2</code>, or start typing, to edit it. Double-clicking also edits it. <code>Enter</code> or <code>Esc</code> finishes, and <code>Tab</code> finishes and adds a child.</li></ul><p>Each first-level branch gets its own color, and deeper topics take their branch's color. A topic with children shows a minus to collapse them, and a collapsed topic shows how many it hides, like +3. The panel has:</p><ul><li><strong>Branch color</strong>: recolors the topic and everything under it. On the central topic, it recolors that topic only.</li><li><strong>Add child topic</strong>, <strong>Collapse children</strong> or <strong>Expand children</strong>.</li><li><strong>Auto-layout subtree</strong>: lines up the topic's visible branches in a tidy tree, leaving the topic where it is.</li></ul><p>Topics size themselves to their text, can't be resized and have no card color.</p>$html$,
      '[]',
      null,
      120
    ),
    (
      'mermaid-diagrams',
      'Diagrams',
      'Mermaid diagrams',
      $html$<p>A <strong>Mermaid diagram</strong> node draws a diagram from text written in Mermaid, a diagram language documented at <a href="https://mermaid.js.org">mermaid.js.org</a>. A new one starts with a sample. Select it to edit the code: the node shows <strong>Split</strong> (code beside the diagram, the default), <strong>Code</strong> or <strong>Preview</strong>, chosen from its top bar or <strong>Editor layout</strong> in the panel. When it isn't selected, it shows the diagram only.</p><p>The diagram redraws as you type and follows the app's light or dark theme. If the code has a mistake, the node shows the error and keeps the last diagram that worked. <code>Tab</code> in the code adds two spaces.</p><p><strong>Templates</strong> in the panel replaces the code with a starter diagram: Flowchart, Sequence, Gantt, Class, State, ER, Pie, Mind map or Timeline. Notes confirms it, with <strong>Undo</strong> to put your code back.</p>$html$,
      '[]',
      null,
      130
    ),
    (
      'ai-assistant',
      'AI',
      'AI assistant',
      $html$<p>An <strong>AI assistant</strong> node reads the text of the nodes connected to it, such as notes, to-do lists, tables, columns, comments and links, and writes a result. Its header counts how many nodes are connected. To use it:</p><ol><li>Connect the nodes you want it to read to the AI assistant node.</li><li>Select the node and pick an action: <strong>Summarize</strong> (the default), <strong>Cluster</strong> into themes, <strong>Brainstorm</strong> new ideas, list <strong>Action items</strong>, or <strong>Custom</strong>, where you write your own prompt.</li><li>Choose the button in the node's header, which is named after the action. For a custom prompt, you can press <code>Ctrl Enter</code> (<code>⌘ Enter</code> on Mac) instead.</li></ol><p>The result appears in the node, in the language of what it read, often with a list of Themes, Action items or other items. <strong>Spawn as notes</strong> adds each item as a note to the right of the node, connected to it. <strong>Clear output</strong> in the panel removes the result. Running again replaces it.</p><p>The assistant reads up to 20,000 characters from the connected nodes, and a custom prompt can be up to 2,000 characters. Without connected nodes, only a custom prompt runs. You need to be signed in and able to edit the board, and if a run fails, the node shows why.</p>$html$,
      '[]',
      null,
      140
    ),
    (
      'mirrors',
      'Mirrors',
      'Mirrors',
      $html$<p>A <strong>Mirror</strong> node shows a live, read-only copy of a node from another board, or from elsewhere on the same board. To set it up, choose <strong>Choose source</strong>, pick a board, then pick a node on it. Both lists have a search box. On a project board you pick from the project's boards, and on a personal board from your personal boards, starting with Home. A mirror can't show another mirror.</p><p>The mirror shows the source's content: a note or text, a to-do list, a table (its first 12 rows), a link, an image, a comment, a column or code. A board, document, sketch or file shows its name. Notes checks the source every 30 seconds and whenever you come back to the tab, and the footer says when it last synced. <strong>Refresh</strong> checks straight away. If the source node is deleted, the footer says Source node was removed.</p><p><strong>Go to board</strong> opens the source board. With the node selected, <strong>Change</strong> picks a different source. The panel has <strong>Mirror source</strong>, <strong>Go to source board</strong> and <strong>Unlink source</strong>, which empties the mirror.</p>$html$,
      '[]',
      null,
      150
    ),
    (
      'shortcuts',
      'Reference',
      'Keyboard shortcuts',
      $html$<ul><li><code>Tab</code> adds a child topic to the selected mind map topic, and <code>Enter</code> adds a topic beside it</li><li><code>F2</code> edits the selected mind map topic, and <code>Enter</code> or <code>Esc</code> finishes</li><li><code>Tab</code> indents in a code or Mermaid node, and <code>Shift Tab</code> removes the indent in a code node</li><li><code>Esc</code> stops editing a code node</li><li><code>Ctrl Enter</code> (<code>⌘ Enter</code> on Mac) runs an AI assistant's custom prompt</li><li><code>Enter</code> in a poll option adds another option</li><li><code>Enter</code> embeds the link you pasted in an Embed node, and <code>Esc</code> cancels a change of link</li></ul>$html$,
      '[]',
      null,
      160
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"StickyNote","label":"Nodes","href":"/help/notes/nodes"},{"icon":"LayoutDashboard","label":"Boards","href":"/help/notes/boards"},{"icon":"Settings","label":"Settings","href":"/help/notes/settings"},{"icon":"Users","label":"Live sessions","href":"/help/notes/live-sessions"},{"icon":"Video","label":"Meetings & huddles","href":"/help/notes/meetings"},{"icon":"FileText","label":"Documents","href":"/help/notes/documents"}]',
      null,
      170
    )
) as v(anchor_id, eyebrow, title, content, links, showcase, sort_order)
cross join (select id from public.docs_pages where slug = 'notes/more-tools' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'More tools',
    description = 'Add embeds, media, code, timers, polls, charts, mind maps, Mermaid diagrams, formulas, the AI assistant and mirrors to a board.',
    status = 'draft',
    published_at = null
where slug = 'notes/more-tools' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'notes/more-tools' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Turning on more tools</li><li>Embeds and media</li><li>Code</li><li>Timers, polls and progress</li><li>Charts and formulas</li><li>People and palettes</li><li>Mind maps and Mermaid diagrams</li><li>AI assistant</li><li>Mirrors</li></ul>',
  10
from public.docs_pages p
where p.slug = 'notes/more-tools' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
