-- Help events event page page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the events/event-page draft outline from
-- 20261024191100_help_events_structure with the full Event page guide and publishes it.
-- Written from a survey of C:\Pro\geiger-events (components/internal/screens/events/{event_detail,event_sections.js,
-- page_design,page_block_library.js,layout_gallery,layout_preview,theme_controls,brand_import,page_blocks,page_render,
-- page_footer,page_gallery,content_media,event_content,schedule,schedule_item_dialog,schedule_style,page_notes,
-- page_disclaimer,disclaimer_placement,guests,event_conference,infographics,location_time,event_map,publishing,
-- distribution,section_heading,all_events}.jsx, components/internal/screens/events/builder/*,
-- components/internal/screens/events/public_page/*, components/internal/shared/web_clip/clip_dialog.jsx,
-- components/internal/screens/discovery/public_follow.jsx, app/e/[id]/*, lib/events/{theme,page_presets/*,page_tree,
-- page_migrate,custom_code,bindings,section_titles,guests,gallery,richtext,schedule_items,use-event-config}.js,
-- lib/supabase/storage.js, geiger-rbac.config.js, supabase/migrations/20260726194134_project_access.sql).
-- Left out on purpose: the Sharing group (Custom URL, SEO & Sharing, Add to Calendar, Embeddable Widget, Localization),
-- On-demand Video and the Speakers attach list, none of which reach the event page.
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set description = 'Design an event''s page for buyers: choose a mode and layout, set its theme, add cover media, description, schedule, guests and FAQ, and share the link.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'events/event-page' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'events/event-page' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, showcase, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.showcase, v.sort_order
from (
  values
    (
      'setting-up-the-event-page',
      'Basics',
      'Setting up the event page',
      $html$<p>Every event has an event page: the page buyers open to read about the event and get tickets. To work on it, choose <strong>Events → All Events</strong> in the sidebar and click the event. It opens in the event editor, where these sections shape the page:</p><ul><li><strong>Page design</strong>, in the <strong>Design</strong> group, sets how the page looks, from Geiger's ready-made layout to a page you build block by block.</li><li>The <strong>Page</strong> group holds what the page says: <strong>Cover Media</strong>, <strong>Rich Description</strong>, <strong>What to Expect</strong>, <strong>Schedule</strong>, <strong>FAQ</strong>, <strong>Section Notes</strong>, <strong>Disclaimer</strong>, <strong>Guests</strong> and <strong>Infographics</strong>.</li><li><strong>Map & Directions</strong>, in the <strong>Location</strong> group, fills the page's Location section with a map, nearby places and travel notes.</li></ul><p>The Page group sections and Map & Directions save as you work, or with their own <strong>Save</strong> button. Page design is different: its changes wait until you choose <strong>Save Changes</strong> at the top of the event editor, and they're lost if you leave the event editor first.</p><p>To check your work, choose <strong>Preview</strong> at the top of <strong>Page design</strong>. It shows the page with your unsaved changes, and <strong>Back</strong> returns to the editor. The external-link icon at the top of the event editor (<strong>View live page</strong>) opens the live page in a new tab.</p><p>By default, <strong>Events</strong> appears in the sidebar for the Owner, Admin, Manager and Member roles. To change who sees it, see <a href="/help/events/settings#roles-and-permissions">Roles and permissions</a>.</p>$html$,
      '[]',
      null,
      10
    ),
    (
      'page-modes-and-sections',
      'Concepts',
      'Page modes and page sections',
      $html$<p>An event page has a mode, picked at the top of <strong>Page design</strong>, which decides how much of its look you control:</p><ul><li><strong>Standard</strong>: Geiger's own layout, with nothing to set. A page uses it until you pick another mode.</li><li><strong>Themed</strong>: your colors, fonts, layout, header, footer and section order.</li><li><strong>Import</strong>: everything in Themed, starting from the logo, colors and fonts of a website you name.</li><li><strong>Custom</strong>: everything in Themed, plus the page builder for arranging the page block by block.</li></ul><p>Whatever the mode, the page is made of the same sections. By default they run in this order: <strong>About this event</strong>, <strong>What to expect</strong>, <strong>Schedule</strong>, <strong>Location</strong>, <strong>Who's going</strong>, <strong>Guests</strong>, <strong>Sponsors</strong> and <strong>Frequently Asked Questions</strong>, followed by any infographics. Beside them is a column of cards: the tickets card (headed <strong>Select ticket</strong>), <strong>Good To Know</strong> (format, capacity and language), <strong>At registration</strong> and <strong>Dietary & Accessibility</strong>. The cover, gallery, title, date, venue and hosts sit at the top.</p><p>A section with nothing in it stays off the page. About this event needs a description, What to expect a highlight, Schedule an item, Guests a guest and the FAQ a question. Who's going appears once a ticket is sold, and Location always shows. At registration appears when the event has custom questions, and Dietary & Accessibility when it has guidelines.</p><p>In Standard mode the sections keep their default order and none can be hidden. Renamed headings, section notes and the disclaimer apply in every mode.</p><p>Some parts of the page are set up elsewhere: the tickets card in <a href="/help/events/tickets">Tickets</a>, the Sponsors section in <a href="/help/events/sponsors">Sponsors & Expo</a>, and the At registration and Dietary & Accessibility cards in <a href="/help/events/registrations">Registrations</a>.</p>$html$,
      '[]',
      null,
      20
    ),
    (
      'page-design',
      'Page design',
      'Page design',
      $html$<p>To change how the event page looks, open <strong>Page design</strong> in the event editor and pick a mode: <strong>Standard</strong>, <strong>Themed</strong>, <strong>Import</strong> or <strong>Custom</strong>. Standard has nothing to set. The other three show five tabs: <strong>Brand</strong>, <strong>Typography</strong>, <strong>Layout</strong>, <strong>Header & footer</strong> and <strong>Sections</strong>.</p><p>Nothing in Page design saves on its own. Choose <strong>Save Changes</strong> at the top of the event editor to put your changes on the live page, and use <strong>Preview</strong> to check them first. Two things save straight away: a renamed section heading, and a page saved from the page builder, which saves the whole design with it. Switching modes keeps your settings, so a Themed page switched to Standard and back returns as it was.</p><p>On the <strong>Brand</strong> tab:</p><ul><li><strong>Base</strong>: Dark (the default) or Light. Choosing one resets the page background, surface, text, muted text and border colors to match.</li><li><strong>Brand colors</strong>: <strong>Brand / accent</strong> (buttons and highlights), <strong>Brand text</strong> (the text on brand-colored buttons), <strong>Gradient end</strong>, <strong>Secondary</strong>, <strong>Links</strong>, <strong>Page background</strong>, <strong>Surface / cards</strong>, <strong>Text</strong>, <strong>Muted text</strong> and <strong>Border</strong>. Pick from the swatch or type a hex value.</li><li><strong>Tagline</strong>: a short line under the event title. <strong>Favicon URL</strong>: the icon in the browser tab on the live page.</li></ul><p>On the <strong>Typography</strong> tab, set the <strong>Heading font</strong> and <strong>Body font</strong> (Geist Sans by default, or Space Grotesk, Poppins, Playfair Display, Merriweather or Geist Mono), the <strong>Text size</strong> (Small, Medium or Large; Medium is the default), the <strong>Heading weight</strong> (Medium, Semibold, Bold or Black; Bold is the default), <strong>Heading tracking</strong> in em, <strong>Heading line height</strong> (0 keeps the default) and <strong>Uppercase headings</strong>.</p>$html$,
      '[]',
      null,
      30
    ),
    (
      'choosing-a-layout',
      'Page design',
      'Choosing a layout',
      $html$<p>The <strong>Layout</strong> tab of <strong>Page design</strong> opens with a gallery of page layouts. Filter it with the chips across the top: <strong>All</strong>, the four preset groups, <strong>My layouts</strong> and <strong>Classic</strong>.</p><ul><li><strong>Presets</strong> are complete page arrangements in four groups: <strong>Live & music</strong> (Festival, Club night), <strong>Professional</strong> (Conference, Workshop, Launch), <strong>Occasions & causes</strong> (Gala, Retreat, Fundraiser) and <strong>Community</strong> (Exhibition, Meetup). <strong>Use</strong> applies one, <strong>Customize</strong> applies it and opens the page builder, and the eye icon previews it with your event's content. A preset brings its own fonts, shapes and light or dark base, keeps your brand color, and switches the page to Custom mode.</li><li><strong>My layouts</strong> holds arrangements saved from the page builder with <strong>Save as layout</strong>, shared by every event in the project. <strong>Use</strong> applies one, <strong>Edit</strong> applies it and opens the builder, and the trash icon deletes it after you confirm.</li><li><strong>Classic layouts</strong> are fixed layouts that apply at once and take your theme, but can't be edited block by block: Classic (the default), Luma, Anchored nav, Agenda first, App shell, Spotlight, Split stage, Glass panel, Gallery wall, Marquee, Magazine, Poster, Split hero, Landing page, Zigzag, Bento grid, Registration first, Box office and Card stack.</li></ul><p><strong>Start from blank</strong> gives the page an empty layout and opens the page builder.</p><p>A layout rearranges the page, never its content. If the page is already built in the page builder, Events asks you to confirm before replacing it. Picking a classic layout then keeps the built page, and switching back to Custom mode brings it back. A layout applied here still needs <strong>Save Changes</strong>, unless you save it from the page builder.</p>$html$,
      '[]',
      null,
      40
    ),
    (
      'shape-background-and-viewer-theme',
      'Page design',
      'Shape, background and viewer theme',
      $html$<p>Under the layout gallery, the <strong>Layout</strong> tab of <strong>Page design</strong> sets the page's shapes, what sits behind it, and whether it opens light or dark.</p><p><strong>Shape & style</strong>:</p><ul><li><strong>Corner radius</strong>: Sharp, Rounded (the default) or Pill. <strong>Exact corner radius</strong> overrides it in pixels, from 0 to 48; leave it blank to use the choice.</li><li><strong>Button style</strong>: Solid (the default), Outline or Soft. <strong>Button weight</strong>: Default, Medium, Semibold or Bold. <strong>Button corner radius</strong>: pixels from 0 to 48, or blank to match the cards. <strong>Uppercase buttons</strong> sets button labels in capitals.</li><li><strong>Card shadow</strong>: Flat, Subtle (the default) or Lifted. <strong>Border weight</strong>: None, Hairline (the default) or Medium.</li><li><strong>Spacing</strong> between sections: Compact, Comfortable (the default) or Spacious. <strong>Content width</strong>: Narrow, Standard (the default) or Wide.</li></ul><p><strong>Page background</strong> is Base (the page color, the default), Gradient, Image or Video. For an image or video, paste its link or choose <strong>Upload</strong>. A video plays muted and on a loop behind the content. <strong>Overlay</strong> sits between the media and your content: Page color (the default), Dark, Light or None. <strong>Overlay strength</strong> runs from 0% to 100% in steps of 5, starting at 80%.</p><p><strong>Viewer theme</strong> sets the look visitors first see: Light, Dark or Follow system, the default, which uses each visitor's own device setting. Visitors can still switch with the light and dark button at the bottom right of the page, and their choice is remembered on their device for that event.</p>$html$,
      '[]',
      null,
      50
    ),
    (
      'header-hero-and-footer',
      'Page design',
      'Header, hero and footer',
      $html$<p>The <strong>Header & footer</strong> tab of <strong>Page design</strong> has three cards.</p><p><strong>Site header</strong> is a brand bar across the top of the page:</p><ul><li><strong>Show the header bar</strong> and <strong>Bottom rule</strong>, a hairline under the bar, are on by default. <strong>Stick to the top</strong> keeps the bar in view as the page scrolls.</li><li><strong>Layout</strong>: Left (the default) or Centered.</li><li><strong>Nav links</strong>: a label and a link for each, shown beside your logo in order. <strong>Add link</strong> adds one, the arrows reorder them and the trash icon removes one.</li><li><strong>Header button</strong> and <strong>Button links to</strong>: leave the label blank for no button.</li><li><strong>Bar background</strong>: a hex color, or blank to sit on the page background.</li></ul><p>The bar only appears once it has a logo, a nav link or a header button. <strong>Stick to the top</strong> only takes effect when the bar has a background color.</p><p><strong>Hero & cover</strong> arranges the top of the page. <strong>Hero style</strong> is Classic (the default), Banner, Centered or Minimal, and <strong>Ticket sidebar</strong> puts the tickets column on the Right (the default) or Left. Both apply only to the Classic layout, because the other layouts set their own top. <strong>Cover style</strong> (Gradient, Solid or Accent tint) fills the cover area when the event has no cover image, and <strong>Cover overlay</strong> (None, Dark scrim or Brand tint) shades a banner cover so the title on it stays readable.</p><p><strong>Footer</strong> closes the page. <strong>Show Geiger branding</strong> keeps the Powered by Geiger Events line and is on by default. <strong>Footer text</strong> holds a copyright line or address. <strong>Social links</strong> pairs a platform (Instagram, X / Twitter, Facebook, LinkedIn, YouTube, Twitch, GitHub, Website or Email) with a link, and <strong>Footer links</strong> adds labeled links. A Standard page's footer always shows the Powered by Geiger Events line.</p>$html$,
      '[]',
      null,
      60
    ),
    (
      'importing-a-brand',
      'Page design',
      'Importing a brand from a website',
      $html$<p>Import mode starts the page's look from an existing website. In <strong>Page design</strong>, choose <strong>Import</strong>; the first time, the <strong>Import a brand from a website</strong> dialog opens. Type the <strong>Website address</strong>, like <code>acme.com</code>, and choose <strong>Read site</strong>. If reading the site takes too long, Events says so: try again, or try a simpler page.</p><p>Events then shows what it found: logos to pick from, the colors, the fonts, corner and button shapes, the site's nav and footer links, and its tagline. Under <strong>What to apply</strong>, select the parts you want: <strong>Logo</strong>, <strong>Colors</strong>, <strong>Fonts</strong>, <strong>Shape</strong>, <strong>Layout</strong>, <strong>Site header</strong>, <strong>Footer</strong> and <strong>Imagery & text</strong> (hero image, tagline and favicon). A part the site doesn't have can't be selected. When the site has a share image and <strong>Shape</strong> is selected, <strong>Page background</strong> puts that image behind the page. Choose <strong>Apply to page</strong>, then <strong>Save Changes</strong>. Use only a brand you have the right to use.</p><p>Everything imported stays editable on the other tabs, and the site's own font joins the font choices on <strong>Typography</strong>. The <strong>Brand & logo</strong> card on the <strong>Brand</strong> tab, shown in Import mode or once the page has a logo, holds:</p><ul><li><strong>Re-import</strong>, to read the site again.</li><li><strong>Header logo</strong> and <strong>Footer logo</strong>: paste an image link or upload one. An empty footer logo reuses the header logo.</li><li><strong>Logo size</strong> and <strong>Footer logo size</strong>: Small, Medium (the default) or Large. <strong>Logo links to</strong>: a link, or blank for none.</li><li><strong>Imported designs</strong>: every mark found on the site, with <strong>Header</strong> and <strong>Footer</strong> to put it in either place.</li><li><strong>Show in page header</strong> and <strong>Fall back to this logo in the footer</strong>, both on by default.</li></ul>$html$,
      '[]',
      null,
      70
    ),
    (
      'showing-hiding-and-renaming-sections',
      'Page design',
      'Showing, hiding and renaming sections',
      $html$<p>The <strong>Sections</strong> tab of <strong>Page design</strong> lists the page's sections, and the cards in the tickets column, in the order they appear. It's there in Themed, Import and Custom modes.</p><ul><li>The arrows move a section up or down, and the eye icon hides or shows it. <strong>Date & registration</strong>, the tickets card, can't be hidden.</li><li><strong>Photo gallery</strong> turns the gallery from Cover Media on or off.</li><li>The pencil beside an event section renames its heading on the page.</li></ul><p>In Custom mode the lists also take your own blocks. <strong>Add block</strong> inserts a content block, or puts back an event section you removed. The main column takes Heading, Text, Rich text, Two columns, Accordion, Button group, Spacer, Image, Video, Embed and Divider blocks; the tickets column takes Heading, Text, Rich text, Image, Button group, Divider and Spacer. The pencil on a block opens its settings, with <strong>Width</strong> (Full, Wide or Narrow), <strong>Alignment</strong> (Left, Center or Right) and <strong>Background</strong> (None, Card or Brand tint); choose <strong>Save block</strong> to keep them. The trash icon removes a block. Once the page is built in the page builder, the builder takes the place of these lists.</p><p>You can also rename a heading from its own section of the event editor. Under the section's title, <strong>Shown on your page as</strong> names the heading: click it, type the new one, and press <code>Enter</code> to save or <code>Esc</code> to cancel. The reset link beside it puts the default back. Renamed headings save straight away and show in every mode. A heading is up to 60 characters, and a blank one goes back to the default.</p><p>The headings you can rename are About this event, What to expect, Schedule, Location, Who's going, Guests, Frequently Asked Questions, Select ticket, Good To Know, At registration and Dietary & Accessibility.</p>$html$,
      '[]',
      null,
      80
    ),
    (
      'page-builder',
      'Page builder',
      'The page builder',
      $html$<p>The page builder lays out a Custom page visually, with sections, columns and blocks you drag into place. Open it from <strong>Page design</strong>: in Custom mode, choose <strong>Open builder</strong> on the <strong>Sections</strong> tab, or use <strong>Customize</strong>, <strong>Edit</strong> or <strong>Start from blank</strong> in the layout gallery. The first time, the builder turns the page's current sections into an editable layout. Nothing changes on the live page until you save.</p><ul><li><strong>Add</strong> lists section shapes (1 to 4 columns, Narrow / wide, Wide / narrow and Content + sidebar) and blocks in six groups: Hero, Content, Event sections, Convert, Social proof, and Structure & custom. Click one to add it to the selected column, or drag it onto the page. Each block in Event sections, and the Sticky buy bar, can be on the page once.</li><li><strong>Outline</strong> reorders and hides whole sections, <strong>Layers</strong> shows every section, row, column and block, and <strong>Layouts</strong> swaps in a preset or saved layout after you confirm.</li><li>Click anything on the page to select it. Its handles move, duplicate or delete it. Drag a column's edge to resize it in twelfths, or a scale handle to step a section's padding, a row's gap or a block's width.</li><li>The panel on the right edits the selection, on <strong>Content</strong>, <strong>Style</strong>, <strong>Layout</strong> and <strong>Advanced</strong> tabs. <strong>Advanced</strong> holds the <strong>HTML id</strong>, <strong>CSS classes</strong>, a section's <strong>Anchor name</strong> for linking to it as <code>#name</code>, and a switch to hide it.</li><li>Text fields with a <strong>Dynamic</strong> button insert live values, such as <code>{{event.name}}</code> or the lowest ticket price, which fill in on the page.</li></ul><p>The Desktop, Tablet and Mobile buttons at the top switch the canvas size. Desktop is the base: a change made at Tablet applies to tablets and phones, and one made at Mobile to phones only. The reset icon beside a setting goes back to the inherited value.</p><p>Choose <strong>Save</strong> to put the page live, along with the rest of the page design. Closing with the × asks before discarding unsaved changes. <strong>Save as layout</strong> keeps the arrangement and theme for other events in the project: give it a <strong>Name</strong> and choose <strong>Save layout</strong>.</p>$html$,
      '[]',
      null,
      90
    ),
    (
      'custom-code',
      'Page builder',
      'Custom code',
      $html$<p>Custom code adds your own CSS, JavaScript and external files to the event page. In the page builder, choose <strong>Code</strong>. The <strong>Code</strong> button, and the <strong>Raw HTML</strong> block in the builder's <strong>Add</strong> panel, appear only for people whose role has the <strong>Add custom code to a page</strong> permission. By default, that's the Owner and Admin roles.</p><p>The first time, Events explains the risk: the code reaches every visitor exactly as written, and a script can read anything on the page, including what buyers type at registration. Choose <strong>I understand</strong> to continue, and add only code you wrote or trust.</p><ul><li><strong>Run custom code on this page</strong> turns all of it on or off without deleting it.</li><li><strong>CSS</strong> applies on the live page and inside the builder, so your own classes show as you design.</li><li><strong>JavaScript</strong> runs once the live page has loaded. It never runs in the editor, so a mistake can't lock you out. A syntax error shows in red under the box.</li><li><strong>Resources</strong> loads stylesheets and scripts from links, in order, before your own code. <strong>Add</strong> adds a row: pick Script or Stylesheet and paste the link.</li></ul><p>Choose <strong>Done</strong>, then <strong>Save</strong> in the builder to keep the code. It runs on the live page in Themed, Import and Custom modes, and not in Standard mode.</p>$html$,
      '[]',
      null,
      100
    ),
    (
      'cover-image-and-gallery',
      'Cover Media',
      'Cover image and gallery',
      $html$<p>The cover is the large image or video at the top of the event page, and the gallery holds more photos and videos. In the event editor, open <strong>Cover Media</strong>. Everything here saves as you change it.</p><ul><li>Click the empty cover to upload an image or video, or choose <strong>Replace</strong> on an existing one. The upload box asks for 16:9, and images are compressed as they upload. A video cover plays muted and on a loop. <strong>Remove</strong> takes the cover off the page after you confirm, and can't be undone.</li><li>To add to the gallery, choose <strong>Add media</strong>, then <strong>Upload media</strong> to pick several files, or <strong>Add from a link</strong> for an image link, a YouTube link or a direct video file. <strong>Type</strong> is Auto-detect, Image or Video: pick it when a video link has no file extension. Events doesn't add the same link twice.</li><li>Hover over a gallery item for its controls. The star sets it as the cover (not for YouTube videos). The settings icon sets an image's <strong>Fit</strong> (Cover, Fit or Stretch), or a video's <strong>Autoplay</strong>, <strong>Muted</strong> and <strong>Loop</strong>. The × removes it after you confirm.</li><li>The settings icon beside <strong>Add media</strong> opens <strong>Gallery layout</strong>: Grid (the default) or Carousel. A carousel has <strong>Slides across</strong> (1 to 4, default 3), <strong>Arrows</strong>, <strong>Dots</strong>, <strong>Loop</strong> and <strong>Autoplay</strong>, with <strong>Seconds per slide</strong> from 1 to 60 (default 5). Visitors whose device asks for reduced motion never get autoplay.</li></ul><p>On the page, the gallery shows near the cover, and clicking an item opens it full screen: the arrow keys move through the items and <code>Esc</code> closes. To hide the gallery without deleting it, turn off <strong>Photo gallery</strong> on the <strong>Sections</strong> tab of <strong>Page design</strong>.</p><p>Only the person who created the event can upload or change its media. Everyone else sees Cover Media read-only, with <strong>Only the event's creator can upload or change its images</strong>.</p>$html$,
      '[]',
      null,
      110
    ),
    (
      'description-highlights-and-faq',
      'Event editor',
      'Description, highlights and FAQ',
      $html$<p>Three sections of the event editor's <strong>Page</strong> group hold the page's main text.</p><p><strong>Rich Description</strong> is the About this event section. Write in the box, then choose <strong>Save</strong>; the count under the box shows its length in characters. <strong>Saved Blocks</strong> inserts a ready-made passage where your cursor is: What to expect, How to get there, Refund policy or Code of conduct. On the page, a long description is cut short with <strong>Show more</strong>.</p><p><strong>What to Expect</strong> fills a highlights card near the top of the page. Choose <strong>Add highlight</strong>, type the <strong>Highlight</strong> (required) and an optional <strong>Detail</strong>, then choose <strong>Add</strong>.</p><p><strong>FAQ</strong> fills the Frequently Asked Questions section, a list visitors expand one question at a time. Choose <strong>Add question</strong>, type the <strong>Question</strong> (required) and its <strong>Answer</strong>, then choose <strong>Add</strong>.</p><p>In both lists, the arrows reorder items, the pencil edits one and the trash icon deletes it. Every change saves straight away, and a delete happens without asking.</p><p>The description and FAQ answers take simple formatting. Each line is its own paragraph; <code>**bold**</code> and <code>*italic*</code> style text; <code>[text](https://…)</code> makes a link; a line starting <code>##</code> is a heading; and lines starting <code>-</code> or <code>1.</code> make a list.</p>$html$,
      '[]',
      null,
      120
    ),
    (
      'building-the-schedule',
      'Schedule',
      'Building the schedule',
      $html$<p>The Schedule section of the event page lists the event's running order. In the event editor, open <strong>Schedule</strong> and choose <strong>Add Item</strong>. Each item is one of three types:</p><ul><li><strong>Standard</strong>: a <strong>Time</strong>, a <strong>Title</strong> (required), a <strong>Description</strong> and an optional image. Drop an image on the box or click to browse (PNG, JPG, GIF or WebP), then set its <strong>Position</strong> (Left, Right, Top or Behind) and <strong>Fit</strong> (Cover, Fit or Stretch). Times show on the page in 12-hour form, like 9:30 AM.</li><li><strong>Clip From Web</strong>: a piece of another public web page. Choose <strong>Clip a component from a URL</strong>, type the address and choose <strong>Load</strong>. Click the part you want, choose <strong>Use This Element</strong>, adjust how it looks or remove parts, then choose <strong>Use This Clip</strong>. Scripts, forms and embedded frames are always removed. A page that builds itself with JavaScript loads empty, so pick one that shows its content without it. <strong>Internal label</strong> names the item in your list only.</li><li><strong>Custom HTML</strong>: your own markup, shown as written. Scripts never run.</li></ul><p>The preview beside the form shows the item as it will look. Choose <strong>Add Item</strong>, or press <code>Ctrl Enter</code> (<code>⌘ Enter</code> on Mac). Items save straight away. The arrows reorder them, the pencil edits one, and the trash icon deletes one without asking.</p><p><strong>Schedule style</strong>, available once there's an item, applies to the whole section: <strong>Layout</strong> (List, Grid or Timeline), <strong>Gap</strong> (Tight, Normal or Wide), <strong>Frame</strong> (Boxed or Bare), and a <strong>Section note</strong> shown under the heading, such as the time zone. New schedules are a boxed list with normal gaps, and style changes save as you make them.</p>$html$,
      '[]',
      null,
      130
    ),
    (
      'featuring-guests',
      'Guests',
      'Featuring guests',
      $html$<p>The Guests section of the event page features speakers and special guests. In the event editor, open <strong>Guests</strong> and choose <strong>Add guest</strong>.</p><ul><li><strong>Name</strong> is required. <strong>Role / title</strong>, <strong>Company</strong> and <strong>Bio</strong> are optional.</li><li><strong>Upload</strong> adds a photo, and <strong>Replace</strong> and <strong>Remove</strong> change it. A guest without a photo shows their initials.</li></ul><p>Choose <strong>Add guest</strong> to finish. The list saves as you change it: the arrows reorder guests, the pencil edits one, and the trash icon deletes one after you confirm. A deleted guest's photo goes too, and neither can be restored. The Guests section only shows on the page once there's a guest.</p><p>The settings icon beside <strong>Add guest</strong> opens <strong>Guest layout</strong>, with a live preview:</p><ul><li><strong>Layout</strong>: Grid (the default) or List. <strong>Columns</strong>: 2, 3 (the default) or 4, for the grid.</li><li><strong>Shape</strong>: Square (the default), Portrait or Circle. <strong>Framing</strong>: Fill frame (the default) or Fit inside, which shows the whole image on a white tile and suits logos.</li><li><strong>Style</strong>: Plain (the default) or Card. <strong>Text alignment</strong>: Left (the default) or Center, for the grid.</li><li><strong>Show bios</strong>: on by default.</li></ul><p>Guest layout changes save automatically, and <strong>Reset to default</strong> puts every choice back.</p>$html$,
      '[]',
      null,
      140
    ),
    (
      'section-notes-and-disclaimer',
      'Event editor',
      'Section notes and the disclaimer',
      $html$<p>A section note adds a short explanation to one part of the event page. It shows as an "i" button beside the section's heading, which visitors click to read it. In the event editor, open <strong>Section Notes</strong> and choose <strong>Add note</strong>. Pick the <strong>Section</strong> (About this event, What to expect, Schedule, Location, Who's going, Guests, Sponsors, FAQ, Infographics, or the Tickets, Good To Know, At Registration or Dietary & Accessibility card), write the <strong>Note text</strong>, and choose <strong>Save notes</strong>.</p><p>Every note needs text before notes save. The switch on a note hides it without deleting it, and the trash icon deletes it straight away. The last note can't be deleted, so switch it off instead. If two notes point at the same section, only the first one that's switched on shows.</p><p>The <strong>Disclaimer</strong> section adds fine print to the page or to checkout. Turn on <strong>Show disclaimer</strong>, select where it appears, write the <strong>Text</strong> (each line becomes its own paragraph), and choose <strong>Save Disclaimer</strong>. The same text shows in every place you select:</p><ul><li>On the event page: <strong>Top of page</strong>, <strong>Below the hero</strong>, <strong>End of page content</strong>, <strong>Above the footer</strong> (the default) and <strong>Below the footer</strong>. End of page content doesn't show on a page built in the page builder.</li><li>In checkout: <strong>Top of every step</strong>, <strong>Above the order summary</strong>, <strong>Under the pay button</strong> and <strong>On the confirmation</strong>.</li></ul><p>The disclaimer is for reading only. To have buyers acknowledge terms before they pay, use <strong>Purchase Disclaimer</strong>, covered in <a href="/help/events/tickets">Tickets</a>.</p>$html$,
      '[]',
      null,
      150
    ),
    (
      'infographics',
      'Infographics',
      'Infographics',
      $html$<p>Infographics are designed blocks that show on the event page after its other sections. In the event editor, open <strong>Infographics</strong>, choose <strong>Add infographic</strong>, and pick a type:</p><ul><li><strong>Info carousel</strong>: slides, each with a title, text, background image and optional button. <strong>Display</strong> shows a Row of slides or One at a time, and <strong>Auto-advance slides</strong> moves them once the section is in view.</li><li><strong>Split CTA</strong>: a heading, text and button beside an image, on the side you choose.</li><li><strong>Quotes showcase</strong>: testimonials with a quote, name, role and photo, in a grid of 2 to 4 columns or one at a time.</li><li><strong>Footer band</strong>: a closing block of links, optional logos and a note.</li><li><strong>Info showcase</strong>: cards in a grid or flex layout of 1 to 6 columns, or one at a time. <strong>Open full showcase on click</strong> opens a card full screen.</li></ul><p>Every type takes a <strong>Section title</strong> and <strong>Title alignment</strong>. The dialog previews the infographic as you type; choose <strong>Add infographic</strong>, or <strong>Save changes</strong> when editing. Infographics save straight away. The arrows reorder them, the pencil edits one, and the trash icon deletes one after you confirm. A deleted infographic can't be restored.</p><p>Infographics don't show on a page built in the page builder.</p>$html$,
      '[]',
      null,
      160
    ),
    (
      'map-and-directions',
      'Map & Directions',
      'Map and directions',
      $html$<p>The Location section of the event page shows the venue, a map and how to get there. In the event editor, open <strong>Map & Directions</strong> in the Location group.</p><ul><li>The map is pinned where <strong>Location & Time</strong> places the venue, or centered on the venue's address when there's no pin. The <strong>Open in</strong> buttons open the address in Google Maps, Apple Maps or Citymapper.</li><li><strong>Nearby Amenities</strong> looks up public transport, parking, cycling, taxis, EV charging, hotels, and food and drink near the address, puts them on the map and saves them straight away. It needs a venue address first.</li><li>A weather forecast for the event day shows when one is available.</li><li><strong>Extra transport notes</strong> and <strong>Parking notes</strong> cover what the map misses. Choose <strong>Save</strong> to keep them.</li></ul><p>On the page, the Location section shows the venue name and address, the map, the forecast, the nearby places, and your notes under <strong>Getting there</strong> and <strong>Parking</strong>. The venue and its address are set in <strong>Location & Time</strong>; see <a href="/help/events/events">Events</a> and <a href="/help/events/venues">Venues & sourcing</a>.</p>$html$,
      '[]',
      null,
      170
    ),
    (
      'opening-and-sharing-the-event-page',
      'Event page',
      'Opening and sharing the event page',
      $html$<p>The event page's address ends in <code>/events/e/</code> followed by the event's ID. To open it, choose the external-link icon at the top of the event editor (<strong>View live page</strong>), and copy the address from the new tab to share it. Visitors don't need to sign in to open the page.</p><p>Who can open the page depends on the event's visibility, not its status:</p><ul><li>A Public or Unlisted event's page opens for anyone with the link, whatever the event's status, Draft included.</li><li>A Private event's page opens only for your teammates, signed in. Everyone else sees <strong>Event not found</strong>, as they do for a deleted event.</li></ul><p>Visibility is set in the event editor's <strong>Visibility</strong> section; see <a href="/help/events/events#visibility-and-publishing">Visibility and publishing</a>.</p><p>The live page refreshes from your saved event at most every 10 seconds, so a saved change can take a couple of reloads to show.</p><p>On the page, <strong>Share</strong> at the top, or in the site header when the page has one, opens the device's share options or copies the link.</p>$html$,
      '[]',
      null,
      180
    ),
    (
      'what-buyers-see',
      'Event page',
      'What buyers see and how they buy',
      $html$<p>At the top of the event page, buyers see the cover and gallery, the event's title, date, time and venue, and a row of hosts: <strong>Hosted by</strong> the organizer, then any co-hosts from <strong>Co-hosts & Admins</strong>. <strong>Follow</strong> beside them lets a visitor leave an email address to hear about your new events; see <a href="/help/events/event-wall">Event Wall & Discovery</a>. When the event uses a saved venue, clicking the venue opens its details.</p><p>The page's sections follow, with the tickets card beside them. The tickets card shows the date with a countdown, the tickets with their prices (Free for a free ticket), and how many tickets remain, unless <strong>Show tickets remaining</strong> is turned off in <strong>Registration Settings</strong>.</p><p>To buy, a visitor picks a ticket and chooses <strong>Get Tickets</strong>, or <strong>Register</strong> for a free ticket. Checkout opens over the page. The button reads <strong>Sold out</strong> once nothing is left. Some layouts also keep a <strong>Get tickets</strong> bar at the bottom of the screen. Paid orders finish on Stripe and return to the event page to confirm. If the buyer cancels payment, the page tells them they haven't been charged. Ticket choices, the tickets card's buttons and the checkout steps are covered in <a href="/help/events/tickets">Tickets</a>.</p><p>A Themed, Import or Custom page also has a light and dark button at the bottom right, and a visitor's choice is remembered on their device for that event.</p>$html$,
      '[]',
      null,
      190
    ),
    (
      'formatting-shortcuts-and-limits',
      'Reference',
      'Formatting, shortcuts and limits',
      $html$<p>Formatting in Rich Description, FAQ answers and Rich text blocks:</p><ul><li>Each line is its own paragraph</li><li><code>**bold**</code> and <code>*italic*</code></li><li><code>[link text](https://…)</code> for a link starting <code>https://</code>, <code>http://</code>, <code>mailto:</code>, <code>tel:</code>, <code>/</code> or <code>#</code></li><li><code>##</code>, <code>###</code> or <code>####</code> and a space start a heading</li><li><code>-</code> or <code>*</code> and a space start a bullet, and <code>1.</code> a numbered item</li></ul><p>Page builder shortcuts:</p><ul><li><code>Ctrl Z</code> (<code>⌘ Z</code> on Mac) undoes, and <code>Ctrl Shift Z</code> (<code>⌘ Shift Z</code>) redoes</li><li><code>Ctrl D</code> (<code>⌘ D</code>) duplicates the selection</li><li><code>Delete</code> or <code>Backspace</code> deletes the selection</li><li><code>Esc</code> clears the selection</li></ul><p>Other shortcuts: <code>Ctrl Enter</code> (<code>⌘ Enter</code>) saves a schedule item, <code>Enter</code> saves a renamed heading and <code>Esc</code> cancels it, and in the page's full-screen gallery the arrow keys move between items and <code>Esc</code> closes it.</p><p>Limits:</p><ul><li>Section headings: up to 60 characters</li><li>Uploaded images are compressed to under 500 KB; videos and logos upload as they are</li><li>Gallery carousel: 1 to 4 slides across, 1 to 60 seconds per slide</li><li>Page background overlay: 0% to 100% in steps of 5</li><li>Exact corner radius and button corner radius: 0 to 48 pixels</li><li>Page builder canvas: Desktop 1280 px, Tablet 834 px and Mobile 390 px wide; columns resize in twelfths, and undo keeps the last 50 steps</li></ul>$html$,
      '[]',
      null,
      200
    ),
    (
      'images-wont-upload',
      'Troubleshooting',
      'Images won''t upload',
      $html$<p>Uploading a cover, gallery item, guest photo, schedule image or page background fails with a message that only the event's creator can add media, or a logo upload fails with <strong>Couldn't upload that image</strong>.</p><p>Events lets only the person who created an event upload files for it. Everyone else can edit the rest of the page, and sees <strong>Cover Media</strong> read-only.</p><p>To fix it, do one of these:</p><ul><li>Ask the person who created the event to upload the files.</li><li>Where a field takes a link, paste the image's address instead: the <strong>Image URL</strong> or <strong>Video URL</strong> for the page background on the <strong>Layout</strong> tab of <strong>Page design</strong>, the <strong>Header logo</strong> and <strong>Footer logo</strong> on the <strong>Brand</strong> tab, and image fields in infographics and page blocks.</li></ul>$html$,
      '[]',
      null,
      210
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"CalendarDays","label":"Events","href":"/help/events/events"},{"icon":"Ticket","label":"Tickets","href":"/help/events/tickets"},{"icon":"ClipboardList","label":"Registrations","href":"/help/events/registrations"},{"icon":"LayoutGrid","label":"Event Wall & Discovery","href":"/help/events/event-wall"},{"icon":"Handshake","label":"Sponsors & Expo","href":"/help/events/sponsors"},{"icon":"MapPin","label":"Venues & sourcing","href":"/help/events/venues"}]',
      null,
      220
    )
) as v(anchor_id, eyebrow, title, content, links, showcase, sort_order)
cross join (select id from public.docs_pages where slug = 'events/event-page' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Event page',
    description = 'Design the public page buyers see: layout, cover media, description, schedule, FAQ and sharing.',
    status = 'draft',
    published_at = null
where slug = 'events/event-page' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'events/event-page' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Page design and layouts</li><li>Cover media and description</li><li>Schedule, FAQ and highlights</li><li>Guests and speakers on the page</li><li>Custom URL, SEO and sharing</li><li>What buyers see</li></ul>',
  10
from public.docs_pages p
where p.slug = 'events/event-page' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
