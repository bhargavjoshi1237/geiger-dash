-- Help flow add-ons page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the flow/add-ons draft outline (created by
-- 20261024142436_help_flow_structure) with the Add-ons guide and publishes it. It covers turning add-ons on, System
-- Architecture and Budget Tracker. SQL Explorer, Forms, Credited Resources and the other Project Plus add-ons (Risk
-- Register, Decision Log, Release Readiness, Customer Feedback Hub, Experiment Tracker, Incident Center) are left out:
-- their screens are empty shells, can't collect anything, or don't do what their labels say.
-- Written from a survey of C:\Pro\geiger-flow (addons/registry.js, addons/index.js, addons/*/manifest.js,
-- addons/system-architecture/*, addons/project-plus/screens/product_addon_screens.jsx, addons/sql/screens/*,
-- addons/forms/screens/*, addons/credited-resources/screens/*,
-- components/internal/screens/projects/settings/addons/addons_settings.jsx, context/project-budget-context.jsx,
-- features/project_budgets/*, features/architecture/*).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Add-ons',
    description = 'Turn on extra screens for a project: map its systems on the System Architecture canvas and track spend against a monthly budget in Budget Tracker.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'flow/add-ons' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'flow/add-ons' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, showcase, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.showcase, v.sort_order
from (
  values
    (
      'turning-add-ons-on',
      'Basics',
      'Turning on an add-on',
      $html$<p>Add-ons are optional screens you turn on for a project. To turn one on:</p><ol><li>In the project sidebar, choose <strong>Settings → Add-ons</strong>.</li><li>Find the add-on's card and turn on its switch. The card is marked <strong>Active</strong>.</li></ol><p>The add-on's screen appears in the project sidebar, and the choice is saved for the whole project. System Architecture sits after Planning, and Budget sits near the end, above Settings. Turning an add-on off removes its screen from the sidebar and keeps what you made in it, so it's all there when you turn it back on.</p><p>Each card shows the add-on's version and category, and <strong>More details</strong> lists its features. While an add-on is on, <strong>More details</strong> also has <strong>Accent color</strong>, eight colors for its sidebar icon. The button at the top right switches the cards between a list and a grid. To hide an add-on from only your own sidebar, use <a href="/help/flow/settings#hiding-sidebar-sections">Settings → Navigation</a>.</p>$html$,
      '[]',
      null,
      10
    ),
    (
      'system-architecture',
      'System Architecture',
      'Mapping your architecture',
      $html$<p>System Architecture is a full-screen canvas for drawing how a project's systems fit together. Once the add-on is on, choose <strong>System Architecture</strong> in the project sidebar. The first time, the canvas holds an example architecture to build from. Flow saves the canvas as you work, so there is no Save button.</p><ul><li>To add a node, click it in the <strong>Node Catalogue</strong> panel to place it in the middle of the canvas, or drag it to where you want it. Search the catalogue by name, or narrow it by category. It has two groups: <strong>Architecture entities</strong>, from apps and services to data stores, security and AI, and <strong>Cloud and service logos</strong>.</li><li>To connect two nodes, drag from the dot on one node's right or bottom edge to the dot on another node's left or top edge. Connections are drawn as arrows.</li><li>To delete nodes or connections, select them and press <code>Backspace</code> or <code>Delete</code>. Hold <code>Shift</code> and click to select more than one.</li><li>The zoom controls at the bottom right zoom out and in, and the percentage between them fits the whole canvas on screen.</li></ul><p>The chevrons at the top of the catalogue hide it, and <strong>Catalogue</strong> brings it back.</p>$html$,
      '[]',
      null,
      20
    ),
    (
      'node-costs',
      'System Architecture',
      'Node costs',
      $html$<p>Each node on the System Architecture canvas carries a monthly cost that feeds the project's budget. Flow fills in an estimate based on the kind of node. To change it, select the node and choose <strong>Expense</strong> at the bottom left.</p><ul><li><strong>Track as infrastructure expense</strong>: whether the node counts toward the budget. Nodes without a cost start switched off.</li><li><strong>Monthly infrastructure cost</strong>: type an amount in dollars, or use the minus and plus buttons, which step by $100 a month. Switch <strong>Month</strong> to <strong>Year</strong> to enter a yearly figure instead (the buttons then step by $1,200); Flow still stores it as a monthly cost.</li><li><strong>Node description</strong>: a note about the node. Choose <strong>Save description</strong> to keep it.</li></ul><p>Cost changes save as you make them, and the panel shows the node's monthly and annual cost. The × at the top closes the panel. Tracked nodes appear under <strong>Infrastructure expense</strong> in Budget Tracker, grouped by category.</p>$html$,
      '[]',
      null,
      30
    ),
    (
      'budget-tracker',
      'Budget Tracker',
      'Setting a monthly budget',
      $html$<p>Budget Tracker compares the project's monthly spend with an approved budget. Once the add-on is on, choose <strong>Budget</strong> in the project sidebar, then type the amount in <strong>Approved monthly budget</strong>. It saves as you type, for the whole project.</p><ul><li><strong>Remaining</strong>: the budget minus the monthly cost of every cost line.</li><li><strong>Health</strong>: Healthy, Tight once more than 85% of the budget is used, or Over forecast once the forecast passes the budget.</li><li><strong>Budget used</strong>: the cost lines as a share of the budget.</li><li><strong>Forecast</strong> and <strong>Variance</strong>: the projected monthly spend, and how far it is above or below the budget.</li><li><strong>Watch items</strong>: cost lines marked Watch or Over, along with the annual run-rate, 12 times the monthly spend.</li></ul><p><strong>Budget mix</strong> splits the budget into infrastructure, manual expenses and what remains. <strong>PM finance memo</strong> sums up the numbers in a paragraph you can copy.</p>$html$,
      '[]',
      null,
      40
    ),
    (
      'cost-lines',
      'Budget Tracker',
      'Cost lines',
      $html$<p>Budget Tracker adds up two kinds of cost lines.</p><ul><li><strong>Infrastructure expense</strong> comes from the System Architecture canvas: one line for each node tracked as an expense, grouped by category, with the monthly total, the number of <strong>Costed nodes</strong> and the <strong>Annual run-rate</strong>. The button with the monthly total expands or collapses the lines. Change these costs on the canvas, not here.</li><li><strong>Manual cost lines</strong> cover everything else, such as vendors, licenses and services. Fill in <strong>Expense name</strong>, <strong>Category</strong>, <strong>Monthly</strong> and <strong>Owner</strong>, then choose <strong>Add</strong>. Only the name is required. Category starts as Operations, Monthly as 1200 and Owner as Project, and new lines are On Track.</li></ul><p>Narrow the manual lines with <strong>All</strong>, <strong>On Track</strong>, <strong>Watch</strong>, <strong>Security</strong>, <strong>Quality</strong> or <strong>Software</strong>. To remove a manual line, choose the trash icon on its row. It goes straight away, without asking. A manual line can't be edited once it's added, so to change one, remove it and add it again.</p>$html$,
      '[]',
      null,
      50
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"Settings","label":"Project settings","href":"/help/flow/settings"},{"icon":"Waypoints","label":"Planning board","href":"/help/flow/planning"},{"icon":"Workflow","label":"Geiger Flow","href":"/help/flow"}]',
      null,
      60
    )
) as v(anchor_id, eyebrow, title, content, links, showcase, sort_order)
cross join (select id from public.docs_pages where slug = 'flow/add-ons' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Add-ons',
    description = 'Extra project screens you turn on per project, from System Architecture to SQL and Forms.',
    status = 'draft',
    published_at = null
where slug = 'flow/add-ons' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'flow/add-ons' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Turning add-ons on</li><li>System Architecture</li><li>SQL Explorer</li><li>Forms</li><li>Credited Resources</li><li>Project add-ons: risks, decisions and more</li></ul>',
  10
from public.docs_pages p
where p.slug = 'flow/add-ons' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
