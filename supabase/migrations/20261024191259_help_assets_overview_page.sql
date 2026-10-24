-- Help assets overview page
--
-- One-time content move, like 20261024142451_help_flow_overview_page: replaces the re-homed Assets Overview's draft
-- outline (20261024191200_help_assets_structure) with the full Geiger Assets overview and publishes it, with the
-- /assets/playground hero. Each headline area gets a section that links to its guide (20261024191205 to
-- 20261024191246).
-- Written from a survey of C:\Pro\geiger-assets (components/internal/sidebar/projects/sidebar_data.js,
-- feature_registry.js, components/internal/workspace/*, components/AssetsPlayground.jsx, addons/*,
-- components/internal/shared/unsaved_changes.jsx, supabase/migrations/20260906020000_rbac_org_role_mapping.sql),
-- C:\Pro\geiger-dash (lib/org/product-apps.js, app/org/[ORGID]/_components/project-row.jsx), and the area guides'
-- surveys named in their own migration headers.
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Geiger Assets',
    nav_label = 'Overview',
    description = 'Assets is where your team keeps a project''s files: upload and organize them, review and share them, deliver them to sites and apps, and sell them.',
    preview = 'assets',
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'assets' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'assets' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, cards, features, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.cards::jsonb, v.features::jsonb, v.sort_order
from (
  values
    (
      'start-here',
      null,
      'Start here',
      '',
      '[{"icon":"FolderKanban","title":"Open a project","body":"Launch Assets from any project in your organization","href":"/org"},{"icon":"CloudUpload","title":"Upload files","body":"Bring in files from your computer, links or Drive","href":"/help/assets/uploads"},{"icon":"CirclePlay","title":"Try the playground","body":"Explore a sample project without signing up","href":"/assets/playground"}]',
      '[]',
      10
    ),
    (
      'opening-assets',
      'Basics',
      'Opening Assets',
      $html$<p>Assets works inside a <strong>project</strong>. Open your organization in Dash and launch Assets from one of its projects. Everything you upload and create there belongs to that project, and people in your organization can open it with the role that matches their organization role.</p><p>The project sidebar starts with <strong>Overview</strong> and <strong>All Media</strong>, then groups the rest: <strong>Assets</strong>, <strong>Media</strong>, <strong>Collaboration</strong>, <strong>Workflows</strong>, <strong>Delivery</strong>, <strong>Galleries</strong>, <strong>Membership</strong>, <strong>Licensing</strong>, <strong>Governance</strong>, <strong>Platform</strong>, <strong>Analytics</strong> and <strong>Settings</strong>. Choose a group to expand it. Each add-on you turn on adds its own entry.</p><p>To jump to any screen, press <code>Ctrl K</code> (<code>⌘ K</code> on Mac) and type part of its name. Getting around is covered in <a href="/help/assets/project-overview#moving-around">Project overview</a>.</p>$html$,
      '[]',
      '[]',
      20
    ),
    (
      'trying-the-playground',
      'Basics',
      'Trying Assets in the playground',
      $html$<p>The <a href="/assets/playground">Assets playground</a> opens a sample project in Assets without an account, with every screen filled with sample files and records, so you can click through it before you sign up.</p><p>Changes you make in the playground last until you reload the page. The Brand Kit, Watermarks and Contact Sheets add-ons start turned on there.</p>$html$,
      '[]',
      '[]',
      30
    ),
    (
      'project-areas',
      'Areas',
      'What''s in a project',
      '<p>Each area in the project sidebar covers one part of working with assets, and each has its own guide in the Help Center.</p>',
      '[]',
      '[{"icon":"LayoutDashboard","text":"Project overview: uploads, reviews, storage and what needs attention"},{"icon":"FolderOpen","text":"Asset library: browse, edit, version and deliver every asset"},{"icon":"CloudUpload","text":"Uploads and requests: bulk uploads, link and Drive imports"},{"icon":"Layers","text":"Collections and folders: group assets and organize where they live"},{"icon":"Archive","text":"Archive and trash: retire assets and bring them back"},{"icon":"Image","text":"Media: browse images and edit them in the image editor"},{"icon":"MessagesSquare","text":"Collaboration: shared links, approvals, comments and the team"},{"icon":"Workflow","text":"Workflows: automations that run on uploads, approvals and sales"},{"icon":"Cloud","text":"Delivery: public addresses that resize and convert images"},{"icon":"GalleryHorizontalEnd","text":"Galleries and store: hosted galleries that can sell"},{"icon":"CreditCard","text":"Membership: a creator page with tiers, posts and messages"},{"icon":"BadgeCheck","text":"Licensing: rights, licenses, renewals and royalties"},{"icon":"ShieldCheck","text":"Governance: retention policies and legal holds"},{"icon":"Code","text":"Platform and API: API keys, delivery policy and data export"},{"icon":"ChartColumn","text":"Analytics: usage, search, sales and license figures"},{"icon":"Settings","text":"Settings and add-ons: project details, quota and roles"}]',
      40
    ),
    (
      'library-and-uploads',
      'Library',
      'Library, uploads and folders',
      $html$<ul><li><strong>Overview</strong>, where a project opens, sums up uploads, downloads, shared links, reviews, storage and the checks that need attention. See <a href="/help/assets/project-overview">Project overview</a>.</li><li><strong>All Media</strong> and the <strong>Asset Library</strong> list every asset. Open one to edit its details and tags, link it to related assets, restore earlier versions and turn on delivery. See <a href="/help/assets/library">Asset library</a>.</li><li>The <strong>Upload Center</strong> uploads files in bulk, and <strong>External Uploads</strong> imports them from web links, a CSV or Google Drive. <strong>Asset Requests</strong> tracks work the library is missing. See <a href="/help/assets/uploads">Uploads and requests</a>.</li><li><strong>Collections</strong> group assets without moving them, and <strong>Folders</strong> decide where each one lives. See <a href="/help/assets/collections">Collections and folders</a>.</li><li><strong>Archive & Trash</strong> holds retired and deleted assets until you restore them or delete them permanently. See <a href="/help/assets/archive">Archive and trash</a>.</li></ul>$html$,
      '[]',
      '[]',
      50
    ),
    (
      'media-and-editing',
      'Media',
      'Media and image editing',
      $html$<p><strong>Images</strong> lists the project's images and camera RAW files, filtered by orientation and source. <strong>Image Editing</strong> is a full image editor: crop, adjust, apply looks, add text, shapes, brush strokes and watermarks in layers, then save the result as a new asset, a new version or a download. See <a href="/help/assets/media">Media</a>.</p>$html$,
      '[]',
      '[]',
      60
    ),
    (
      'sharing-and-approvals',
      'Collaboration',
      'Sharing, approvals and workflows',
      $html$<ul><li><strong>Shared Links</strong> share an asset or a collection with people outside the project, until the link expires or you revoke it.</li><li><strong>Approvals</strong> route work through <strong>Approval Pipelines</strong>, stage by stage, and approving assets marks them Approved.</li><li><strong>Comments & Activity</strong> collects review discussions and a log of what happened, and <strong>Team</strong> sets each person's role. See <a href="/help/assets/collaboration">Collaboration</a>.</li><li><strong>Workflows</strong> run steps on their own when something happens, such as tagging new uploads or requesting approval, and <strong>Run History</strong> records every run. See <a href="/help/assets/workflows">Workflows</a>.</li></ul>$html$,
      '[]',
      '[]',
      70
    ),
    (
      'delivery-and-api',
      'Delivery',
      'Delivery and the API',
      $html$<p>Turning on delivery gives an asset a public address that websites and apps can load, and the address can resize, crop and convert images on the way. <strong>CDN Delivery</strong> and <strong>Delivery Analytics</strong> show the traffic. See <a href="/help/assets/delivery">Delivery</a>.</p><p>Under <strong>Platform</strong>, API keys let your own apps use the Assets REST API, <strong>Delivery Settings</strong> limits what delivery addresses can do and who can load them, and <strong>Data Export</strong> takes metadata out as CSV or JSON, or originals as a ZIP. See <a href="/help/assets/platform">Platform and API</a>.</p>$html$,
      '[]',
      '[]',
      80
    ),
    (
      'galleries-and-store',
      'Galleries',
      'Galleries and the store',
      $html$<p>A gallery turns a collection or a hand-picked set into a hosted web page, with your layout, theme and access rules: public, unlisted or private, with an optional password and expiry. Visitors can favorite assets and ask to download them. See <a href="/help/assets/galleries">Galleries</a>.</p><p>A gallery can also sell: downloads, licenses, prints, bundles or the whole gallery, with a cart, checkout, discount codes, orders, invoices and download links. See <a href="/help/assets/galleries/store">Store and orders</a>.</p>$html$,
      '[]',
      '[]',
      90
    ),
    (
      'membership',
      'Membership',
      'Membership',
      $html$<p>Membership runs a public creator page where fans follow you, join paid or free tiers, read posts, tip and message you. You design the page, set up tiers and promo codes, and manage members, subscriptions and renewal invoices. See <a href="/help/assets/membership">Membership</a>.</p><p>Posts can be public, for members, for a minimum tier or pay-per-view, and you can sell bundles and send locked messages. See <a href="/help/assets/membership/posts">Posts, messages and tips</a>.</p>$html$,
      '[]',
      '[]',
      100
    ),
    (
      'licensing-and-governance',
      'Licensing',
      'Licensing and governance',
      $html$<p>Licensing records the rights you hold, prices licenses from a rate card, issues them from templates with a printable certificate, warns about conflicts, and tracks renewals and the royalties owed to rights holders. See <a href="/help/assets/licensing">Licensing</a>.</p><p>Governance applies retention policies that archive or trash old assets after you review them, and legal holds that stop assets from being deleted. See <a href="/help/assets/governance">Governance</a>.</p>$html$,
      '[]',
      '[]',
      110
    ),
    (
      'analytics-and-settings',
      'Settings',
      'Analytics, settings and add-ons',
      $html$<ul><li><strong>Analytics</strong> has a screen each for assets, search, galleries, library health, storage, sales and licenses, over the last 7, 30 or 90 days, with CSV and PNG exports. See <a href="/help/assets/analytics">Analytics</a>.</li><li><strong>Settings</strong> holds the project's name, delivery defaults, storage quota and roles, and the actions to transfer or delete the project. See <a href="/help/assets/settings">Project settings</a>.</li><li>Add-ons are optional screens you turn on under <strong>Settings → Add-ons</strong>: Brand Kit, Watermarks and Contact Sheets. See <a href="/help/assets/add-ons">Add-ons</a>.</li></ul>$html$,
      '[]',
      '[]',
      120
    ),
    (
      'shortcuts',
      'Reference',
      'Keyboard shortcuts',
      $html$<ul><li><code>Ctrl K</code> or <code>Ctrl /</code> (<code>⌘ K</code> or <code>⌘ /</code> on Mac) opens the search, which jumps to any screen</li><li><code>Ctrl S</code> (<code>⌘ S</code> on Mac) saves in editors with a <strong>Save Changes</strong> button, such as the asset, collection and gallery editors</li><li><code>Enter</code> or <code>,</code> adds a tag, and <code>Backspace</code> in an empty tag box removes the last one</li></ul><p>The image editor has its own shortcuts, listed in <a href="/help/assets/media#shortcuts">Media</a>.</p>$html$,
      '[]',
      '[]',
      130
    )
) as v(anchor_id, eyebrow, title, content, cards, features, sort_order)
cross join (select id from public.docs_pages where slug = 'assets' and deleted_at is null) p;

-- @down
-- Restores the draft the structure migration left (the products/assets draft's own outline).
update public.docs_pages
set title = 'Geiger Assets',
    nav_label = 'Overview',
    description = 'Creative asset control.',
    preview = 'assets',
    status = 'draft',
    published_at = null
where slug = 'assets' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'assets' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>What Geiger Assets is for</li><li>Opening it from a project</li><li>Key concepts</li><li>Common workflows</li></ul>',
  10
from public.docs_pages p
where p.slug = 'assets' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
