-- Help assets media page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the assets/media draft outline
-- (20261024191200_help_assets_structure) with the full Media guide and publishes it. No section showcases exist for
-- Assets yet. Only Images and Image Editing are documented: Video & Transcripts, Audio, Documents & OCR,
-- Design & Raw Files, 3D & Immersive, Video Processing and Renditions & Formats show generated sample transcripts,
-- waveforms, page counts and jobs, and their actions only show a message. The Images screen's focal point and
-- color profile aren't saved, so they're left out too.
-- Written from a survey of C:\Pro\geiger-assets (components/internal/screens/projects/media/** (images, editing and
-- editor/*, shared.jsx, and the other media screens for what they don't do), lib/storage/client.js,
-- lib/supabase/assets.js).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Media',
    description = 'Browse a project''s images, then edit them in the image editor: crop, adjust, add text, shapes and watermarks, and save a version or a new asset.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'assets/media' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'assets/media' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, showcase, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.showcase, v.sort_order
from (
  values
    (
      'editing-an-image',
      'Basics',
      'Editing an image',
      $html$<p>To edit an image, open a project in Assets and choose <strong>Media → Image Editing</strong> in the sidebar. The editor opens the project's image that changed last.</p><ol><li>To edit a different image, choose the image's name at the top left, or <strong>Open image</strong>. Pick one of the project's images, or choose <strong>Open from computer</strong>.</li><li>Pick a tool on the left, and change the image with the panels on the right.</li><li>Choose <strong>Save</strong>, or press <code>Ctrl S</code> (<code>⌘ S</code> on Mac), and save the edit as a new asset, a new version or a download.</li></ol><p>Nothing you do in the editor changes the stored image until you save it as a new version. The top bar shows <strong>Unsaved changes</strong> while you have edits, and your browser asks before you leave the page. Opening another image with unsaved edits asks first, with <strong>Keep editing</strong> or <strong>Discard & open</strong>.</p><p>Very large images are edited as a working copy at most 4096 px on the longest side; the <strong>Canvas</strong> tab says so when that happens.</p>$html$,
      '[]',
      null,
      10
    ),
    (
      'editor-tools',
      'Image Editing',
      'Editor tools',
      $html$<p>The tools run down the left edge of the image editor. Each one shows its options in the bar across the top of the canvas.</p><ul><li><strong>Move</strong> (<code>V</code>): select, move, scale and rotate layers. The arrow keys nudge the selected layer by 1 px, or 10 px with <code>Shift</code>.</li><li><strong>Hand</strong> (<code>H</code>): drag to pan. Holding <code>Space</code> pans with any tool.</li><li><strong>Crop</strong> (<code>C</code>): drag the frame, pick a ratio (Free, Original, 1:1, 4:5, 3:2, 16:9 or 9:16), then press <code>Enter</code> to apply or <code>Esc</code> to cancel.</li><li><strong>Text</strong> (<code>T</code>): click the canvas to add text.</li><li><strong>Shape</strong> (<code>U</code>): drag to draw a Rectangle, Ellipse or Line. <code>Shift</code> keeps it square.</li><li><strong>Brush</strong> (<code>B</code>): paint freehand strokes, with a size and color.</li><li><strong>Eyedropper</strong> (<code>I</code>): click the image to sample a color.</li></ul><p>Undo and redo are at the top, and the editor keeps up to 60 steps. Hold <strong>Compare</strong>, or the <code>\</code> key, to see the original; <strong>Reset all edits</strong> starts over.</p>$html$,
      '[]',
      null,
      20
    ),
    (
      'adjustments-and-looks',
      'Image Editing',
      'Adjustments and looks',
      $html$<p>With the image itself selected, the panel on the right of the image editor has three tabs: <strong>Adjust</strong>, <strong>Looks</strong> and <strong>Canvas</strong>.</p><p><strong>Adjust</strong> has a slider for each setting, all starting at 0:</p><ul><li><strong>Light</strong>: Exposure, Brightness and Contrast, from -100 to 100.</li><li><strong>Color</strong>: Saturation, Vibrance, Temperature and Tint, from -100 to 100, and Hue, from -180° to 180°.</li><li><strong>Detail</strong>: Sharpen, Blur, Grain, Pixelate and Vignette, from 0 to 100.</li></ul><p><strong>Looks</strong> applies a ready-made style, each shown as a small preview: Original, Mono, Noir, Sepia, Vintage, Kodachrome, Technicolor, Polaroid, Brownie or Invert. Choose Original to remove it. A look and your adjustments work together.</p>$html$,
      '[]',
      null,
      30
    ),
    (
      'canvas-and-watermarks',
      'Image Editing',
      'Canvas, watermarks and placed images',
      $html$<p>The <strong>Canvas</strong> tab of the image editor works on the whole image.</p><ul><li><strong>Artboard</strong>: shows the image's size in pixels, with <strong>Rotate left</strong>, <strong>Rotate right</strong>, <strong>Flip H</strong>, <strong>Flip V</strong> and <strong>Crop</strong>.</li><li><strong>Watermark</strong>: type the text (<code>© Studio</code> to start), pick a position (Bottom right, Bottom left, Top right, Top left or Center) and an opacity (70% to start), then choose <strong>Add watermark layer</strong>.</li><li><strong>Place image</strong>: <strong>Library</strong> adds one of the project's images as a new layer, and <strong>Computer</strong> adds one from your computer. You can also paste an image, or drop one on the canvas.</li></ul><p>Select a text, shape or placed image to edit it instead: the panel then shows its position and rotation, opacity and blend mode, fill and stroke, and for text its font, size, letter spacing and line height, with buttons to align it to the canvas, duplicate it or delete it.</p>$html$,
      '[]',
      null,
      40
    ),
    (
      'layers-history-variants',
      'Image Editing',
      'Layers, history and variants',
      $html$<p>The panel under the properties in the image editor has three tabs.</p><ul><li><strong>Layers</strong>: every text, shape, brush stroke, watermark and placed image, on top of the locked background image. Click a layer to select it, rename it, or duplicate or delete it with its buttons. <strong>Add text</strong> and <strong>Place image</strong> add new ones. <code>Ctrl ]</code> and <code>Ctrl [</code> move the selected layer forward and back, and <code>Delete</code> removes it.</li><li><strong>History</strong>: the steps you've taken since opening the image.</li><li><strong>Variants</strong>: the new assets saved from this image, with their count on the tab. Click one to open it. An image opened from your computer has no variants until you save it as a new asset.</li></ul>$html$,
      '[]',
      null,
      50
    ),
    (
      'saving-an-edit',
      'Image Editing',
      'Saving an edit',
      $html$<p>To save your edit, choose <strong>Save</strong> at the top right of the image editor (<code>Ctrl S</code>). <strong>Export</strong> opens the same dialog, set to download.</p><ul><li><strong>Save as</strong>: <strong>New asset</strong>, <strong>New version</strong> or <strong>Download</strong>. New version is offered only for an image from the project.</li><li><strong>Name</strong>: for a new asset, the image's name plus <code>(edited)</code> to start.</li><li><strong>Format</strong>: WebP (the default), JPEG or PNG.</li><li><strong>Quality</strong>: for WebP and JPEG, from 10% to 100%, 90% to start.</li><li><strong>Size</strong>: width and height, linked so the shape stays the same unless you unlink them, with <strong>25%</strong>, <strong>50%</strong> and <strong>100%</strong> shortcuts and <strong>Source size</strong> for a downscaled working copy. Up to 16384 px a side.</li></ul><p>A <strong>new asset</strong> is a Draft in the same folder with the same tags, linked to the original as a variant; an image opened from your computer goes in Project root. A <strong>new version</strong> becomes the image's current file, and the previous file stays in its version history. <strong>Download</strong> saves the file to your computer and uploads nothing.</p>$html$,
      '[]',
      null,
      60
    ),
    (
      'images',
      'Images',
      'Browsing images',
      $html$<p><strong>Media → Images</strong> lists the project's images and camera RAW files. The figures across the top count <strong>Images</strong>, <strong>RAW sources</strong>, the <strong>Storage</strong> they use and those with no recorded dimensions (<strong>Missing dims</strong>).</p><p>Filter by orientation (<strong>All orientations</strong>, Landscape, Portrait, Square or Unknown), by source (<strong>All sources</strong>, <strong>RAW only</strong> or <strong>Non-RAW</strong>) and by status, or search by name, format, tags and dimensions. The list shows 25 images a page.</p><p>Click an image to see it larger, with its dimensions, orientation, format, size, folder, last update, tags and file type, and a download button. To add images, upload them in the Asset Library or Upload Center; see <a href="/help/assets/uploads">Uploads and requests</a>.</p>$html$,
      '[]',
      null,
      70
    ),
    (
      'shortcuts',
      'Reference',
      'Image editor shortcuts',
      $html$<p>These keys work in the image editor except while you're typing in a field. The <strong>Keyboard shortcuts</strong> button in the top bar lists them too. On a Mac, use <code>⌘</code> where the list says <code>Ctrl</code>.</p><ul><li><code>V</code> Move, <code>H</code> Hand, <code>C</code> Crop, <code>T</code> Text, <code>U</code> Shape, <code>B</code> Brush, <code>I</code> Eyedropper</li><li><code>Ctrl Z</code> undo, <code>Ctrl Shift Z</code> or <code>Ctrl Y</code> redo</li><li><code>Ctrl J</code> duplicate the layer, <code>Delete</code> or <code>Backspace</code> delete it</li><li><code>Ctrl ]</code> bring forward, <code>Ctrl [</code> send backward</li><li><code>Ctrl S</code> save</li><li><code>Space</code> (hold) pan, <code>\</code> (hold) compare with the original</li><li><code>Ctrl 0</code> fit to screen, <code>Ctrl 1</code> actual pixels, <code>Ctrl +</code> and <code>Ctrl -</code> zoom</li><li><code>Enter</code> apply the crop, <code>Esc</code> cancel the crop or deselect</li><li>Arrow keys nudge by 1 px, or 10 px with <code>Shift</code></li></ul>$html$,
      '[]',
      null,
      80
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"FolderOpen","label":"Asset library","href":"/help/assets/library"},{"icon":"Cloud","label":"Delivery","href":"/help/assets/delivery"},{"icon":"PackagePlus","label":"Add-ons","href":"/help/assets/add-ons"}]',
      null,
      90
    )
) as v(anchor_id, eyebrow, title, content, links, showcase, sort_order)
cross join (select id from public.docs_pages where slug = 'assets/media' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Media',
    description = 'Work with each kind of media: images, video, audio, documents, design files and 3D, plus editing and renditions.',
    status = 'draft',
    published_at = null
where slug = 'assets/media' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'assets/media' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Images</li><li>Video and transcripts</li><li>Audio</li><li>Documents and OCR</li><li>Design and raw files</li><li>3D and immersive</li><li>Image editing</li><li>Video processing</li><li>Renditions and formats</li></ul>',
  10
from public.docs_pages p
where p.slug = 'assets/media' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
