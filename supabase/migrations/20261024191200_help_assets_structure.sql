-- Help assets structure
--
-- One-time content move, like 20261023200049_help_flow_guide: gives Assets its own sidebar group (sort 28, between
-- Flow and Products). The products/assets draft is re-homed as the Assets Overview (slug assets, with the
-- /assets/playground hero), and every area of the Assets project sidebar starts as a draft outline, following the
-- sidebar's order. The page migrations that follow (20261024191205 to 20261024191259) fill each page in.
-- Written from a survey of C:\Pro\geiger-assets (components/internal/sidebar/projects/sidebar_data.js,
-- components/internal/sidebar/projects/feature_registry.js, components/internal/screens/registry.jsx,
-- addons/*/manifest.js).
-- Later edits happen in Studio, so this must never re-run.

-- @up
insert into public.docs_nav_groups (title, slug, sort_order)
values ('Assets', 'assets', 28)
on conflict (slug) do update set
  title = excluded.title,
  sort_order = excluded.sort_order;

-- Assets Overview: re-home the products/assets draft, or create it on a database that never had one.
update public.docs_pages
set nav_group_id = (select id from public.docs_nav_groups where slug = 'assets'),
    slug = 'assets',
    title = 'Geiger Assets',
    nav_label = 'Overview',
    preview = 'assets',
    sort_order = 10
where slug = 'products/assets' and deleted_at is null;

insert into public.docs_pages (nav_group_id, slug, title, nav_label, description, preview, status, sort_order)
select g.id, 'assets', 'Geiger Assets', 'Overview', 'Creative asset control.', 'assets', 'draft', 10
from public.docs_nav_groups g
where g.slug = 'assets'
on conflict (slug) where deleted_at is null do nothing;

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>What Geiger Assets is for</li><li>Opening it from a project</li><li>Key concepts</li><li>Common workflows</li></ul>',
  10
from public.docs_pages p
where p.slug = 'assets' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;

-- Assets' areas, in the project sidebar's order: Overview, All Media, Assets, Media, Collaboration, Workflows,
-- Delivery, Galleries, Membership, Licensing, Governance, Platform, Analytics, Settings, then the add-ons.
insert into public.docs_pages (nav_group_id, slug, title, description, status, sort_order)
select g.id, v.slug, v.title, v.description, 'draft', v.sort_order
from (
  values
    ('assets/project-overview', 'Project overview', 'The project''s home screen in Assets.', 20),
    ('assets/library', 'Asset library', 'Browse, search and manage every asset in the project, and open an asset''s details.', 30),
    ('assets/uploads', 'Uploads & requests', 'Bring files into Assets, collect them from people outside your team, and request missing work.', 40),
    ('assets/collections', 'Collections & folders', 'Group assets into collections and organize where they''re stored with folders.', 50),
    ('assets/archive', 'Archive & trash', 'Archive what you no longer use, and restore or permanently delete what you''ve deleted.', 60),
    ('assets/media', 'Media', 'Work with each kind of media: images, video, audio, documents, design files and 3D, plus editing and renditions.', 70),
    ('assets/collaboration', 'Collaboration', 'Share assets through links, run approvals, follow comments and activity, and manage the team.', 80),
    ('assets/workflows', 'Workflows', 'Automate repeatable asset work with workflows, start from templates, and check each run.', 90),
    ('assets/delivery', 'Delivery', 'Serve assets to websites and apps through the CDN, image transforms, video, embeds and connected channels.', 100),
    ('assets/galleries', 'Galleries', 'Turn collections into hosted galleries, present them as showcases, and put them on your own domain.', 110),
    ('assets/membership', 'Membership', 'Run a membership business from a public creator page: tiers, members, subscriptions, billing and access.', 120),
    ('assets/licensing', 'Licensing', 'Record the rights you hold, issue licenses from templates and prices, and track renewals and royalties.', 130),
    ('assets/governance', 'Governance', 'Control access, apply retention policies and preserve assets under legal hold.', 140),
    ('assets/platform', 'Platform & API', 'Connect Assets to other tools: integrations, API keys, webhooks and data export.', 150),
    ('assets/analytics', 'Analytics', 'See how assets are found, used, delivered and sold, and export reports.', 160),
    ('assets/settings', 'Project settings', 'Project details, add-ons, storage usage, roles and advanced options for Assets.', 170),
    ('assets/add-ons', 'Add-ons', 'Optional screens you turn on per project: Brand Kit, Watermarks and Contact Sheets.', 180)
) as v(slug, title, description, sort_order)
cross join (select id from public.docs_nav_groups where slug = 'assets') g
on conflict (slug) where deleted_at is null do nothing;

-- Child pages: the store under Galleries, and posts and messages under Membership.
insert into public.docs_pages (nav_group_id, parent_id, slug, title, description, status, sort_order)
select parent.nav_group_id, parent.id, v.slug, v.title, v.description, 'draft', v.sort_order
from (
  values
    ('assets/galleries/store', 'assets/galleries', 'Store & orders', 'Sell from your galleries: products and prices, checkout, digital downloads, orders and customers.', 10),
    ('assets/membership/posts', 'assets/membership', 'Posts, messages & tips', 'Publish posts, message members, sell bundles and paid messages, and track tips and payouts.', 10)
) as v(slug, parent_slug, title, description, sort_order)
join public.docs_pages parent on parent.slug = v.parent_slug and parent.deleted_at is null
on conflict (slug) where deleted_at is null do nothing;

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview', '<p><em>Draft outline. Replace before publishing.</em></p><ul>' || v.outline || '</ul>', 10
from (
  values
    ('assets/project-overview', '<li>The Overview screen</li><li>Summary figures</li><li>Recent activity</li>'),
    ('assets/library', '<li>All Media</li><li>The Asset Library</li><li>Asset details</li><li>Tags and metadata</li><li>Versions and relationships</li>'),
    ('assets/uploads', '<li>Upload Center</li><li>External Uploads</li><li>Asset Requests</li>'),
    ('assets/collections', '<li>Collections</li><li>Folders</li>'),
    ('assets/archive', '<li>Archive</li><li>Trash</li><li>Restoring and deleting permanently</li>'),
    ('assets/media', '<li>Images</li><li>Video and transcripts</li><li>Audio</li><li>Documents and OCR</li><li>Design and raw files</li><li>3D and immersive</li><li>Image editing</li><li>Video processing</li><li>Renditions and formats</li>'),
    ('assets/collaboration', '<li>Shared links</li><li>Approvals</li><li>Approval pipelines</li><li>Comments and activity</li><li>Team</li>'),
    ('assets/workflows', '<li>Building a workflow</li><li>Workflow templates</li><li>Run history</li>'),
    ('assets/delivery', '<li>CDN delivery</li><li>Dynamic images</li><li>Video delivery</li><li>Embeds and headless</li><li>Channel publishing</li><li>Delivery analytics</li>'),
    ('assets/galleries', '<li>Gallery builder</li><li>Showcase galleries</li><li>Gallery domains</li>'),
    ('assets/galleries/store', '<li>Storefront</li><li>Products and pricing</li><li>Digital downloads</li><li>Cart and checkout</li><li>Orders and invoices</li><li>Customers</li>'),
    ('assets/membership', '<li>Creator page</li><li>Membership tiers</li><li>Members</li><li>Subscriptions and recurring billing</li><li>Access control</li><li>Promo codes and perks</li>'),
    ('assets/membership/posts', '<li>Posts</li><li>Inbox</li><li>Bundles</li><li>Paid messages</li><li>Tips</li><li>Payouts</li>'),
    ('assets/licensing', '<li>Rights inventory</li><li>License templates</li><li>License pricing</li><li>Issued licenses</li><li>Expirations and renewals</li><li>Revenue and royalties</li>'),
    ('assets/governance', '<li>Permissions</li><li>Identity and provisioning</li><li>Retention policies</li><li>Legal holds</li>'),
    ('assets/platform', '<li>Integrations</li><li>API keys</li><li>Delivery settings</li><li>API reference</li><li>Webhooks</li><li>Data export</li>'),
    ('assets/analytics', '<li>Asset analytics</li><li>Search analytics</li><li>Portal analytics</li><li>Library health</li><li>Storage and usage</li><li>Commerce analytics</li><li>License analytics</li><li>Reports and exports</li>'),
    ('assets/settings', '<li>General</li><li>Add-ons</li><li>Usage and storage</li><li>Permissions and security</li><li>Advanced</li>'),
    ('assets/add-ons', '<li>Turning add-ons on</li><li>Brand Kit</li><li>Watermarks</li><li>Contact Sheets</li>')
) as v(slug, outline)
join public.docs_pages p on p.slug = v.slug and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;

-- @down
-- Assets drafts go with their outline blocks (on delete cascade); children first, then the top-level areas.
delete from public.docs_pages where slug in ('assets/galleries/store', 'assets/membership/posts');
delete from public.docs_pages where slug like 'assets/%';

update public.docs_pages
set nav_group_id = (select id from public.docs_nav_groups where slug = 'products'),
    slug = 'products/assets',
    title = 'Geiger Assets',
    nav_label = 'Assets',
    description = 'Creative asset control.',
    preview = null,
    status = 'draft',
    published_at = null,
    sort_order = 30
where slug = 'assets' and deleted_at is null;

delete from public.docs_nav_groups where slug = 'assets';
