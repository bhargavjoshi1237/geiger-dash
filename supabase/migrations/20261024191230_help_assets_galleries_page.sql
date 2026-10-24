-- Help assets galleries page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the assets/galleries draft outline
-- (20261024191200_help_assets_structure) with the full Galleries guide and publishes it. No section showcases exist
-- for Assets yet. Gallery Domains is left out: its verification is simulated (no DNS lookup, no certificate) and
-- nothing serves a gallery from the domains it records.
-- Written from a survey of C:\Pro\geiger-assets (components/internal/screens/projects/galleries/** including
-- public/*, app/g/[slug]/** (page, unlock, download), lib/supabase/galleries.js, gallery_server.js,
-- gallery_audience.js, gallery_shape.js, supabase/migrations/20260920200000_galleries.sql).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Galleries',
    description = 'Publish a collection or a hand-picked set as a hosted gallery: design it, control who sees it, collect favorites and download requests.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'assets/galleries' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'assets/galleries' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, showcase, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.showcase, v.sort_order
from (
  values
    (
      'creating-a-gallery',
      'Basics',
      'Creating a gallery',
      $html$<p>A gallery is a public web page that presents a set of assets, for clients, partners or anyone with the link. To create one, open a project in Assets, choose <strong>Galleries → Gallery Builder</strong> in the sidebar, then <strong>New gallery</strong>.</p><ul><li><strong>Name</strong>: required.</li><li><strong>Headline</strong> and <strong>Description</strong>: the headline shows at the top of the public page.</li><li><strong>Source</strong>: <strong>Collection (live)</strong>, the default, shows a collection and stays in step with it as it changes. <strong>Curated selection</strong> starts empty and keeps its own list.</li><li><strong>Collection</strong>: required for a collection gallery.</li><li><strong>Layout</strong>: Grid to start; see <a href="#layout-and-theme">Layout and theme</a>.</li><li><strong>Visibility</strong>: Private to start.</li></ul><p>Choose <strong>Create gallery</strong>. The gallery is a Draft until you publish it, so nobody outside the project can see it yet.</p>$html$,
      '[]',
      null,
      10
    ),
    (
      'status-and-visibility',
      'Concepts',
      'Gallery status and visibility',
      $html$<p>Two settings decide whether a gallery's public page opens.</p><ul><li><strong>Status</strong>: Draft, Published or Unpublished. Only a Published gallery has a public page. Unpublishing takes the page down without deleting anything.</li><li><strong>Visibility</strong>: <strong>Public</strong> pages can show up in search engines. <strong>Unlisted</strong> pages open for anyone with the link but are never indexed. <strong>Private</strong> galleries don't open publicly at all.</li></ul><p>A published gallery's page lives at an address ending in <code>/g/</code> and its URL slug. Visitors to a private, unpublished or expired gallery, or a slug that doesn't exist, all see the same not-found page, so a guessed address reveals nothing.</p>$html$,
      '[]',
      null,
      20
    ),
    (
      'gallery-list',
      'Gallery Builder',
      'The gallery list',
      $html$<p>The figures across the top of Gallery Builder count <strong>Galleries</strong>, <strong>Published</strong>, <strong>Drafts</strong> and <strong>Gated</strong> ones (with a password or asking for visitors' details). Each row shows the gallery's name, layout, visibility, status and last update.</p><p>Filter by status, visibility and layout, search by name, and sort by <strong>Last Modified</strong> (the default), <strong>Oldest Modified</strong>, <strong>Name A–Z</strong> or <strong>Name Z–A</strong>.</p><p>Each row's <strong>⋯</strong> menu has <strong>Quick view</strong>, <strong>Edit</strong>, <strong>Copy public link</strong> (once the gallery has a URL slug), <strong>Duplicate</strong>, <strong>Publish</strong> or <strong>Unpublish</strong>, and <strong>Delete</strong>. Delete removes the gallery straight away, without asking; the assets it showed stay in the library.</p>$html$,
      '[]',
      null,
      30
    ),
    (
      'gallery-content',
      'Gallery Builder',
      'Choosing what a gallery shows',
      $html$<p>Click a gallery, or choose <strong>Edit</strong>, to open its editor. The <strong>Content</strong> section decides what the page shows.</p><ul><li>A <strong>collection</strong> gallery lists the collection's assets read-only. To change what it shows, change the collection.</li><li>A <strong>curated</strong> gallery has its own list. Add assets from the library with the search, drag them to reorder, add a caption to each, and remove any with <strong>Remove from gallery</strong>. These changes save straight away.</li></ul><p>Everything else in the editor waits for <strong>Save Changes</strong> at the top, or <code>Ctrl S</code> (<code>⌘ S</code> on Mac). <strong>Discard</strong> drops your edits, and Assets asks before you leave with unsaved changes. A gallery needs a name to save.</p>$html$,
      '[]',
      null,
      40
    ),
    (
      'layout-and-theme',
      'Gallery Builder',
      'Layout and theme',
      $html$<p>The <strong>Layout & theme</strong> section of the gallery editor sets how the page looks.</p><ul><li><strong>Layout</strong>: Grid (even tiles), Masonry (columns that keep each image's height), Justified rows, Mosaic (every sixth tile featured large), Slideshow (one asset at a time) or Single column.</li><li><strong>Columns</strong> (Auto, 2, 3, 4 or 5 on wide screens; phones always show two), <strong>Spacing</strong> (Tight, Comfortable or Airy), <strong>Tile shape</strong>, <strong>Corners</strong> and <strong>Page width</strong> (Contained, Wide or Full bleed).</li><li><strong>Captions</strong> (Below, Overlay or Hidden), <strong>Hover</strong> (Zoom, Lift, Mono to color or None) and <strong>Entrance</strong> (None, Fade in or Rise up).</li><li><strong>Theme</strong>: <strong>Ground</strong> (Suite, which follows the app theme, or Midnight, Light or Paper), <strong>Typography</strong> (Sans, Serif or Mono), <strong>Accent</strong> color, <strong>Backdrop</strong> texture, <strong>Title size</strong>, <strong>Title alignment</strong>, and <strong>Accent on buttons</strong>.</li></ul><p>New galleries start as a Grid with Auto columns, Comfortable spacing, square tiles, captions below, Zoom on hover and the Suite ground. The <strong>Preview</strong> in the section shows the page with the same renderer visitors see.</p>$html$,
      '[]',
      null,
      50
    ),
    (
      'poster-header-footer',
      'Gallery Builder',
      'Poster, header and footer',
      $html$<p>The <strong>Poster</strong> section of the gallery editor sets the cover image under the gallery's title. <strong>Poster image</strong> is any image from the library; Automatic uses the gallery's first image. Set its <strong>Crop</strong> (21:9, 16:9, 3:2 or Original), <strong>Focus</strong>, <strong>Motion</strong> and a <strong>Frame</strong> with border, corners and depth. Turn on <strong>Show text overlay</strong> to set an eyebrow, title, subtitle and a button over the image.</p><p>The <strong>Header & footer</strong> section has:</p><ul><li><strong>Show top bar</strong>: a bar above the title with your brand name or logo, <strong>Header links</strong> and a call-to-action button.</li><li><strong>Show footer</strong>: the closing line of the page, with its own links. It defaults to a copyright line.</li><li><strong>Show gallery details</strong>: the item count, publish date and expiry beside the title.</li><li><strong>Show the Geiger Assets credit</strong>: a small note beside the footer text.</li></ul>$html$,
      '[]',
      null,
      60
    ),
    (
      'gallery-access',
      'Gallery Builder',
      'Who can see a gallery and download from it',
      $html$<p>The <strong>Access</strong> section of the gallery editor controls the public page.</p><ul><li><strong>Visibility</strong>: Public, Unlisted or Private.</li><li><strong>Password</strong>: visitors type it before the gallery opens, and stay unlocked for 12 hours. Leave it empty for no password.</li><li><strong>Access expires</strong>: after this date the page stops opening. Leave it empty to keep it open.</li><li><strong>Ask visitors for their details</strong>: visitors give their name and email before the gallery opens, so you can see who picked what. Off to start.</li><li><strong>Allow favorites</strong>: visitors can mark assets, and their picks land in Proofing on Showcase Galleries. On to start.</li><li><strong>Downloads</strong>: <strong>Open</strong> lets anyone viewing the gallery download, <strong>On request</strong> lets visitors ask, and <strong>Disabled</strong>, the default, offers no downloads.</li></ul><p>Selling from a gallery is set in its <strong>Selling</strong> section; see <a href="/help/assets/galleries/store">Store and orders</a>.</p>$html$,
      '[]',
      null,
      70
    ),
    (
      'publishing-a-gallery',
      'Gallery Builder',
      'Publishing a gallery',
      $html$<p>To publish a gallery, open its editor and go to the <strong>Publish</strong> section.</p><ol><li>Check the <strong>URL slug</strong>, the last part of the gallery's address. A gallery needs one to publish.</li><li>Choose <strong>Save Changes</strong> if you changed anything.</li><li>Under <strong>Publish state</strong>, choose <strong>Publish gallery</strong>. You can also choose <strong>Publish</strong> in its <strong>⋯</strong> menu on Gallery Builder.</li></ol><p><strong>Public address</strong> shows the full link, with <strong>Copy public link</strong>. Make sure Visibility isn't Private, or the page won't open.</p><p>The <strong>SEO & social</strong> section sets the <strong>Page title</strong> and <strong>Meta description</strong> used by search engines and link previews, and a <strong>Social preview image URL</strong>. Without one, link previews use the gallery's cover image when the gallery is open to visitors. Unlisted and private galleries are never indexed, whatever this section says.</p>$html$,
      '[]',
      null,
      80
    ),
    (
      'showcase-galleries',
      'Showcase Galleries',
      'Visits, favorites and download requests',
      $html$<p><strong>Galleries → Showcase Galleries</strong> shows what visitors did with your published galleries over <strong>Last 7 days</strong>, <strong>Last 30 days</strong> or <strong>Last 90 days</strong>, for all galleries or one.</p><ul><li><strong>Published galleries</strong>: visits, visitors, favorites and downloads for each one, with <strong>Most engaged</strong> ranking them by views, favorites and downloads.</li><li><strong>Proofing</strong>: the assets each visitor favorited, grouped by person. Names and emails show when the gallery asks visitors for their details.</li><li><strong>Download requests</strong>: what visitors asked to download from galleries set to On request, with their message. Approve or deny each one.</li></ul><p>Approving or denying a download request only records your answer. Assets doesn't email the visitor or send the file, so follow up with them yourself.</p>$html$,
      '[]',
      null,
      90
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"Store","label":"Store & orders","href":"/help/assets/galleries/store"},{"icon":"Layers","label":"Collections & folders","href":"/help/assets/collections"},{"icon":"CreditCard","label":"Membership","href":"/help/assets/membership"}]',
      null,
      100
    )
) as v(anchor_id, eyebrow, title, content, links, showcase, sort_order)
cross join (select id from public.docs_pages where slug = 'assets/galleries' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Galleries',
    description = 'Turn collections into hosted galleries, present them as showcases, and put them on your own domain.',
    status = 'draft',
    published_at = null
where slug = 'assets/galleries' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'assets/galleries' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Gallery builder</li><li>Showcase galleries</li><li>Gallery domains</li></ul>',
  10
from public.docs_pages p
where p.slug = 'assets/galleries' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
