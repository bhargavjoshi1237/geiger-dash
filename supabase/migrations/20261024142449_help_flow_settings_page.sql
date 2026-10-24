-- Help flow settings page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the flow/settings draft outline with the
-- full Project settings guide and publishes it. Connections, Customs, Advanced and Enterprise are left out: their
-- controls are stored but nothing in Flow acts on them, as is General's Pause project and Transfer project.
-- Written from a survey of C:\Pro\geiger-flow (components/internal/screens/projects/settings/*,
-- components/internal/sidebar/projects/project_sidebar.jsx, components/internal/shared/pagination.jsx,
-- geiger-ui.config.js, context/nav-visibility-context.jsx, features/project_settings/*) and of C:\Pro\geiger-ui
-- (src/nav/nav-visibility-settings.jsx, src/nav/resolve.js).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Project settings',
    description = 'Rename the project, set how many rows lists show, choose what''s in your sidebar, turn on add-ons, read usage figures, and delete a project.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'flow/settings' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'flow/settings' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, showcase, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.showcase, v.sort_order
from (
  values
    (
      'opening-settings',
      'Basics',
      'Opening project settings',
      $html$<p>Project settings are under <strong>Settings</strong>, at the end of the project sidebar. Choose <strong>Settings</strong> to expand its tabs, then choose one, such as <strong>General</strong> or <strong>Navigation</strong>. Choose <strong>Settings</strong> again to collapse them.</p><p>What you change on <strong>General</strong> and <strong>Add-ons</strong> applies to the whole project, for everyone in it. <strong>Navigation</strong> is the exception: it only changes your own sidebar.</p>$html$,
      '[]',
      null,
      10
    ),
    (
      'project-name',
      'General',
      'Project name and description',
      $html$<p>To rename the project, open <strong>Settings → General</strong>, change <strong>Project Name</strong>, then choose <strong>Save Changes</strong>. The name appears throughout Flow. <strong>Project Description</strong>, up to 500 characters, shows under the project name on the <a href="/help/flow/project-overview">project overview</a>.</p><p><strong>Save Changes</strong> stays disabled until you change something, and while the name is empty. <strong>Project ID</strong> can't be changed; the button beside it copies the ID.</p>$html$,
      '[]',
      null,
      20
    ),
    (
      'rows-per-page',
      'General',
      'Default rows per page',
      $html$<p>Project lists, such as Tasks, Work Queue, Goals, Milestones, Logs and Team, show 10 rows a page to start with. To change that for the whole project, open <strong>Settings → General → Default rows per page</strong> and pick 10, 25, 50 or 100 per page. It saves as soon as you pick it.</p><p>A list picks up the new size the next time it loads. Anyone can still change the size at the bottom of a list while they're on it.</p>$html$,
      '[]',
      null,
      30
    ),
    (
      'deleting-a-project',
      'General',
      'Deleting a project',
      $html$<p>To delete the project, open <strong>Settings → General</strong> and choose <strong>Delete project</strong>. Flow asks you to confirm in a dialog: choose <strong>Delete project</strong> again to go ahead, or <strong>Cancel</strong>. Flow then takes you out of the project.</p><p>A deleted project can't be restored from Flow. <strong>Delete Project</strong> under <strong>Settings → Advanced</strong> does the same thing.</p>$html$,
      '[]',
      null,
      40
    ),
    (
      'hiding-sidebar-sections',
      'Navigation',
      'Hiding sidebar sections',
      $html$<p>To choose which sections appear in your project sidebar, open <strong>Settings → Navigation</strong>. It's personal: it changes only your own sidebar, in this project, and your teammates keep theirs. Add-on screens are listed too.</p><p>Each section has a switch. Turn it off to hide the section, or on to show it again. Each change saves straight away. A section with screens under it, like Settings, shows how many of them are in your sidebar; expand it to switch each screen on its own. Hiding a section hides everything under it, and the screens' own switches are kept for when you show it again.</p><p>Overview, Issues, Settings, General and Navigation are always available, so they show a lock marked On instead of a switch.</p><p>The tabs at the top narrow the list to <strong>All</strong>, <strong>Shown</strong>, <strong>Hidden</strong> or <strong>Always on</strong>, each with its count, and the search icon finds a section by name. Once anything is hidden, <strong>Show all</strong> appears and brings every section back.</p>$html$,
      '[]',
      null,
      50
    ),
    (
      'section-dependencies',
      'Navigation',
      'Sections that depend on others',
      $html$<p>Some sections in <strong>Settings → Navigation</strong> need another section, so Flow won't hide a section that a shown one needs, or show a section whose requirement is hidden. The switch is unavailable instead, and a note under it names the sections involved, after <strong>Needs</strong> or <strong>Needed by</strong>. Click a name to jump to it, or hover over the switch to see why.</p><ul><li>Tasks needs Issues, and Work Queue needs Issues and Tasks.</li><li>Projections and Milestones need Planning.</li><li>Goals needs Objectives.</li><li>Grounding, Reporting and Logs need Issues.</li><li>Resource Allocation and Security need Team.</li><li>Externals needs Vault.</li><li>Connections, Customs, Add-ons, Usage and Advanced need General, and Enterprise needs Advanced.</li></ul><p>For example, to hide Planning, hide Projections and Milestones first. To show Work Queue again, show Tasks first.</p>$html$,
      '[]',
      null,
      60
    ),
    (
      'add-ons-tab',
      'Add-ons',
      'The Add-ons tab',
      $html$<p><strong>Settings → Add-ons</strong> lists the optional screens you can turn on for the project, each on a card with its version and category. The switch on a card turns that add-on on or off for the whole project, and <strong>More details</strong> lists what it does. While an add-on is on, <strong>More details</strong> also has <strong>Accent color</strong>, which sets the color of its icon in the sidebar.</p><p>For the steps, and what each add-on does, see <a href="/help/flow/add-ons">Add-ons</a>.</p>$html$,
      '[]',
      null,
      70
    ),
    (
      'usage',
      'Usage',
      'Usage figures',
      $html$<p><strong>Settings → Usage</strong> shows figures worked out from the project's own records. Nothing on it can be changed.</p><ul><li><strong>API Requests</strong>: the number of events in the project's <a href="/help/flow/logs">activity log</a>, from every source.</li><li><strong>Storage Used</strong>: the total size of the project's <a href="/help/flow/assets">assets</a>. <strong>Bandwidth</strong> shows the same figure, because downloads aren't metered.</li><li><strong>Compute Time</strong>: the hours logged as <a href="/help/flow/reporting">time entries</a>.</li><li><strong>Active Users</strong>: how many different people appear in the activity log.</li><li><strong>Database Rows</strong>: the project's tasks, issues, assets, activity log events and time entries, added together. <strong>Database Usage</strong> lists the count for each.</li></ul><p>The charts break the same records down day by day for the last 7 days: events, uploaded file size, total storage and active people. <strong>Storage & Compute</strong> also shows the average and busiest day's logged hours, and the share of logged time for the three people who logged the most. <strong>User Activity</strong> counts this month's events, splits them by source, and counts <strong>New Users</strong> whose first activity was this month.</p>$html$,
      '[]',
      null,
      80
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"PackagePlus","label":"Add-ons","href":"/help/flow/add-ons"},{"icon":"Activity","label":"Logs","href":"/help/flow/logs"},{"icon":"ListTodo","label":"Tasks","href":"/help/flow/tasks"}]',
      null,
      90
    )
) as v(anchor_id, eyebrow, title, content, links, showcase, sort_order)
cross join (select id from public.docs_pages where slug = 'flow/settings' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Project settings',
    description = 'Custom fields, navigation, add-ons, usage and advanced options.',
    status = 'draft',
    published_at = null
where slug = 'flow/settings' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'flow/settings' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>General</li><li>Connections</li><li>Custom fields</li><li>Navigation</li><li>Add-ons and usage</li><li>Advanced: visibility, read-only mode, webhooks, environment variables</li></ul>',
  10
from public.docs_pages p
where p.slug = 'flow/settings' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
