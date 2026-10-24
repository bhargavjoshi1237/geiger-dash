-- Help assets project overview page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the assets/project-overview draft outline
-- (20261024191200_help_assets_structure) with the full Project overview guide and publishes it. No section
-- showcases exist for Assets yet.
-- Written from a survey of C:\Pro\geiger-assets (components/internal/screens/projects/home/home_screen.jsx,
-- components/internal/workspace/*, components/internal/sidebar/*, lib/hooks/use-workspace-url.js,
-- lib/storage/delivery_log.js, components/internal/screens/projects/collaboration/constants.js, and the shared search
-- palette in C:\Pro\geiger-ui at 258dd6aa, src/ui/command-palette.jsx).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Project overview',
    description = 'See a project at a glance in Assets: uploads, downloads, shared links, reviews, storage and CDN traffic, and the checks that need attention.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'assets/project-overview' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'assets/project-overview' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, showcase, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.showcase, v.sort_order
from (
  values
    (
      'opening-the-overview',
      'Basics',
      'Opening the project overview',
      $html$<p><strong>Overview</strong> is the first entry in a project's sidebar in Assets, and the screen a project opens on. It sums up the project's library, sharing, reviews, licenses and storage, and it's read-only: you change things on their own screens.</p><p>Assets works out every figure from the project's own data each time you open the overview, so there's nothing to set up. A panel with no data yet shows a short message instead of a chart.</p><p>Beside the <strong>Assets Overview</strong> title, three totals cover the whole project: <strong>Assets</strong> (every asset in the library, archived ones included, but not those in the trash), <strong>Collections</strong> and <strong>Storage</strong> (the combined size of those assets' files).</p>$html$,
      '[]',
      null,
      10
    ),
    (
      'moving-around',
      'Basics',
      'Moving around a project',
      $html$<p>Choose an entry in a project's sidebar to open that screen. Most entries, such as <strong>Assets</strong>, <strong>Media</strong> and <strong>Galleries</strong>, are groups: choose one to expand it, then choose a screen inside it. <strong>Settings</strong> expands to General, Add-ons, Usage & Storage, Permissions & Security and Advanced.</p><p>The page address keeps the screen you're on and the asset you have open, so refreshing the page or sharing the link opens the same place. Anyone you send the link to still has to sign in with access to the project.</p><p>To jump to any screen, open the search in the top bar with <code>Ctrl K</code> or <code>Ctrl /</code> (<code>⌘ K</code> or <code>⌘ /</code> on Mac), type part of the screen's name and press <code>Enter</code>. The search lists every screen in the sidebar, grouped the same way, and before you type it shows the screens you picked last.</p><p>The button at the bottom of the sidebar collapses it to icons. Hover over an icon to see its name. Each add-on you turn on adds its own entry; see <a href="/help/assets/add-ons">Add-ons</a>.</p>$html$,
      '[]',
      null,
      20
    ),
    (
      'activity-figures',
      'Overview',
      'Uploads, downloads, links and reviews',
      $html$<p>Four figures across the top of the project overview track day-to-day activity.</p><ul><li><strong>Uploads</strong>: assets added to the library in the last 30 days. When there were uploads in the 30 days before that, it also shows the change as a percentage.</li><li><strong>Downloads</strong>: how many times the library's assets have been downloaded, all time.</li><li><strong>Shared Links</strong>: share links that are active now. Its footnote counts the ones that expire within 7 days.</li><li><strong>Needs Review</strong>: approval requests that are Pending or In Review. Its footnote counts the ones past their due date.</li></ul><p>Share links and approvals are covered in <a href="/help/assets/collaboration">Collaboration</a>.</p>$html$,
      '[]',
      null,
      30
    ),
    (
      'library-activity',
      'Overview',
      'Library activity and file types',
      $html$<p><strong>Library Activity</strong> charts the last 12 months of the project. Its menu switches between three measures, and it starts on Uploads each time you open the overview:</p><ul><li><strong>Uploads</strong>: assets added each month.</li><li><strong>CDN Requests</strong>: how many times the project's files were served.</li><li><strong>Bandwidth (GB)</strong>: how much data those requests sent.</li></ul><p><strong>File Type Mix</strong> shows how many assets the library holds of each type, such as Image, Video or Document. It draws up to five slices: the four largest types, and Other for the rest. Hover over a slice, or click a type in the legend, to show that type's count in the middle of the chart.</p>$html$,
      '[]',
      null,
      40
    ),
    (
      'traffic-and-storage',
      'Overview',
      'Traffic, cache and storage',
      $html$<p>Three panels in the middle of the project overview cover delivery over the last 30 days and the project's storage.</p><ul><li><strong>Overall Traffic</strong>: CDN requests for the project's files by country, for the four countries with the most requests.</li><li><strong>Edge CDN Hit Ratio</strong>: the share of those requests answered from cache instead of sending the file again, with the counts under the gauge.</li><li><strong>Storage Usage</strong>: the combined size of the library's files against the project's storage quota. With no quota set, it shows only the space used.</li></ul><p>Set the storage quota under <strong>Settings → Usage & Storage</strong>, covered in <a href="/help/assets/settings">Project settings</a>. How files are served is covered in <a href="/help/assets/delivery">Delivery</a>.</p>$html$,
      '[]',
      null,
      50
    ),
    (
      'top-collections',
      'Overview',
      'Top collections',
      $html$<p><strong>Top Collections</strong> lists the project's five largest collections by number of assets, with each one's description, visibility, asset count and last update. Click a row to open the <strong>Collections</strong> screen.</p><p>When the project has no collections, <strong>Open Collections</strong> takes you there to create one. See <a href="/help/assets/collections">Collections and folders</a>.</p>$html$,
      '[]',
      null,
      60
    ),
    (
      'workflow-attention',
      'Overview',
      'Workflow attention',
      $html$<p><strong>Workflow Attention</strong>, at the bottom of the project overview, lists checks with a count each. Click a check to open the screen where you deal with it. The badge in its corner shows how many checks have something waiting, or <strong>All clear</strong>.</p><ul><li><strong>Awaiting review</strong>: open approval requests, and how many are past due. Opens Approvals.</li><li><strong>Licenses expiring</strong>: issued licenses that end within the next 30 days, leaving out perpetual, renewed and terminated ones. Opens Expirations & Renewals.</li><li><strong>Missing metadata</strong>: assets with no tags and no description. Opens the Asset Library.</li><li><strong>Active share links</strong>: share links that are active, and how many expire within 7 days. Opens Shared Links.</li><li><strong>Storage available</strong>: how much of the storage quota is left. Opens Usage & Storage.</li></ul><p>Each check is marked <strong>Urgent</strong>, <strong>Soon</strong> or <strong>Routine</strong>, and urgent checks come first. Reviews and expiring licenses are urgent, and missing metadata is soon, but a check with nothing waiting drops to routine. Storage available turns urgent once the library uses 90% of the quota.</p>$html$,
      '[]',
      null,
      70
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"FolderOpen","label":"Asset library","href":"/help/assets/library"},{"icon":"CloudUpload","label":"Uploads & requests","href":"/help/assets/uploads"},{"icon":"ChartColumn","label":"Analytics","href":"/help/assets/analytics"}]',
      null,
      80
    )
) as v(anchor_id, eyebrow, title, content, links, showcase, sort_order)
cross join (select id from public.docs_pages where slug = 'assets/project-overview' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Project overview',
    description = 'The project''s home screen in Assets.',
    status = 'draft',
    published_at = null
where slug = 'assets/project-overview' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'assets/project-overview' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>The Overview screen</li><li>Summary figures</li><li>Recent activity</li></ul>',
  10
from public.docs_pages p
where p.slug = 'assets/project-overview' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
