-- Help assets add-ons page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the assets/add-ons draft outline
-- (20261024191200_help_assets_structure) with the full Add-ons guide and publishes it. No section showcases exist
-- for Assets yet. Watermark presets are documented as presets only: nothing in Assets applies them to files or
-- share links yet, although the screen says so.
-- Written from a survey of C:\Pro\geiger-assets (addons/registry.js, addons/index.js, addons/brand-kit/*,
-- addons/watermark/*, addons/contact-sheets/*, components/internal/screens/projects/settings/addons_settings.jsx,
-- components/internal/screens/projects/settings/constants.js, lib/supabase/project_settings.js,
-- lib/hooks/use-visible-project-nav.js).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Add-ons',
    description = 'Turn on optional screens for a project: Brand Kit for logos, colors and type, Watermarks presets, and printable Contact Sheets.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'assets/add-ons' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'assets/add-ons' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, showcase, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.showcase, v.sort_order
from (
  values
    (
      'turning-add-ons-on',
      'Basics',
      'Turning add-ons on',
      $html$<p>Add-ons are optional screens you turn on per project. To manage them, open a project in Assets and choose <strong>Settings → Add-ons</strong> in the sidebar. Each add-on has a card with its name, version, category and what it does.</p><p>To turn an add-on on, turn on the switch on its card. The card shows <strong>Active</strong>, and the add-on's entry appears in the sidebar: Watermarks after Media, Brand Kit after Galleries and Contact Sheets right before Settings. <strong>More details</strong> on a card lists the add-on's features.</p><p>Changes save as you make them, for the whole project. Brand Kit starts turned on; Watermarks and Contact Sheets start off. Turning an add-on off hides its entry, and what you saved in it stays for when you turn it on again.</p><p>The button at the top right switches the cards between a list and a grid.</p>$html$,
      '[]',
      null,
      10
    ),
    (
      'brand-kit',
      'Brand Kit',
      'Brand Kit',
      $html$<p><strong>Brand Kit</strong> keeps the project's logos, colors, type and usage rules in one place. Text fields save when you leave them or press <code>Enter</code>; adding and removing items saves straight away.</p><ul><li><strong>Logo lockups</strong>: choose <strong>Add lockup</strong>, then give it a <strong>Label</strong>, a logo image URL or a file from <strong>Upload a file</strong> (under 500 KB), and notes for <strong>Clear space</strong> and <strong>Minimum size</strong>.</li><li><strong>Colour palette</strong>: choose <strong>Add swatch</strong>, then set its name, hex value (<code>#rgb</code> or <code>#rrggbb</code>) and role, such as Primary.</li><li><strong>Typography scale</strong>: choose <strong>Add row</strong>, then set its name, size and usage, such as Headlines.</li><li><strong>Usage notes</strong>: type a rule under <strong>Dos</strong> or <strong>Don'ts</strong> and choose <strong>Add</strong>.</li></ul><p>Remove a lockup, swatch or type row with <strong>Remove</strong> in its <strong>⋯</strong> menu, and a note with the × beside it. Removing happens straight away, without asking.</p>$html$,
      '[]',
      null,
      20
    ),
    (
      'watermarks',
      'Watermarks',
      'Watermark presets',
      $html$<p><strong>Watermarks</strong> keeps the project's watermark presets. To add one, choose <strong>New preset</strong>.</p><ul><li><strong>Preset name</strong>: required.</li><li><strong>Text</strong> or <strong>Image</strong>: a text mark (<code>© Project</code> to start) or an image from a web address. An image mark needs its <strong>Image URL</strong>.</li><li><strong>Position</strong>: one of nine spots, from Top left to Bottom right. New presets sit Bottom right.</li><li><strong>Opacity</strong> (60% to start), <strong>Scale</strong> (100) and <strong>Margin</strong> (16 px).</li><li><strong>Blend</strong>: Normal, Multiply, Screen, Overlay, Darken or Lighten.</li></ul><p>Choose <strong>Create preset</strong>. Click a preset to preview it over a sample image. Each row's <strong>⋯</strong> menu has <strong>Edit</strong>, <strong>Duplicate</strong>, <strong>Set as default</strong>, which marks the preset Default, and <strong>Delete</strong>, which removes it straight away.</p><p>To stamp a watermark onto an image, use <strong>Add watermark layer</strong> on the image editor's Canvas tab. See <a href="/help/assets/media">Media</a>.</p>$html$,
      '[]',
      null,
      30
    ),
    (
      'contact-sheets',
      'Contact Sheets',
      'Contact sheets',
      $html$<p><strong>Contact Sheets</strong> prints a collection as a grid of thumbnails with captions, for reviews on paper. To set one up, choose <strong>New layout</strong>.</p><ul><li><strong>Layout name</strong> and <strong>Source collection</strong>: both required.</li><li><strong>Columns</strong> (1 to 8, 4 to start) and <strong>Rows</strong> (1 to 10, 5 to start).</li><li><strong>Caption fields</strong>: what prints under each thumbnail, from File name, Type, Format, Size and Status. File name is on to start, and at least one is needed.</li><li><strong>Header text</strong> and <strong>Footer text</strong>: optional.</li><li><strong>Page size</strong>: A4 (the default), Letter, A3 or Tabloid.</li></ul><p>Choose <strong>Create layout</strong>. Click a layout to preview it with the collection's assets, then choose <strong>Export</strong> to download it as a web page you can open and print from your browser. Each row's <strong>⋯</strong> menu has <strong>Edit</strong>, <strong>Duplicate</strong> and <strong>Delete</strong>, which removes the layout straight away. See <a href="/help/assets/collections">Collections and folders</a>.</p>$html$,
      '[]',
      null,
      40
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"Settings","label":"Project settings","href":"/help/assets/settings"},{"icon":"Image","label":"Media","href":"/help/assets/media"},{"icon":"Layers","label":"Collections & folders","href":"/help/assets/collections"}]',
      null,
      50
    )
) as v(anchor_id, eyebrow, title, content, links, showcase, sort_order)
cross join (select id from public.docs_pages where slug = 'assets/add-ons' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Add-ons',
    description = 'Optional screens you turn on per project: Brand Kit, Watermarks and Contact Sheets.',
    status = 'draft',
    published_at = null
where slug = 'assets/add-ons' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'assets/add-ons' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Turning add-ons on</li><li>Brand Kit</li><li>Watermarks</li><li>Contact Sheets</li></ul>',
  10
from public.docs_pages p
where p.slug = 'assets/add-ons' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
