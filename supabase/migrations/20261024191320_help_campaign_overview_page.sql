-- Help campaign overview page
--
-- One-time content move, like 20261024142451_help_flow_overview_page: replaces the Campaign Overview's draft outline
-- (re-homed from products/campaign by 20261024191300_help_campaign_structure) with the full overview and publishes it,
-- with the /campaign/playground hero. It links to the Team & Roles guide that 20261024191310 publishes.
-- Only what ships is described: the workspace shell, section access and Team & Roles. Campaign's other screens run on
-- sample data held in each screen (lib/playground/db.js says so), and some sidebar entries are "coming soon"
-- placeholders, so they're named as sidebar entries only. The notifications bell (reads an empty legacy table), the
-- topbar search and help buttons (not wired) and the account menu's Documentation item (points at /docs) are left out.
-- Dash launches Campaign without a project id (lib/org/product-apps.js: projectColumn null), so "Opening Campaign"
-- describes the home page and Continue to Campaign route rather than promising the chosen project opens.
-- Written from a survey of C:\Pro\geiger-campaign (components/internal/sidebar/projects/*, components/internal/sidebar/sidebar_option.jsx,
-- components/internal/topbar/*, app/project/*, app/org/page.js, app/page.js, context/project-context.js,
-- lib/hooks/use-workspace-url.js, components/campaign-playground/*, lib/playground/*, geiger-rbac.config.js)
-- and C:\Pro\geiger-dash (app/org/[ORGID]/_components/project-row.jsx, lib/org/product-apps.js).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Geiger Campaign',
    nav_label = 'Overview',
    description = 'Campaign is the suite''s app for marketing campaigns. Open it from any project, try it in the playground, and choose who sees each section with Team & Roles.',
    preview = 'campaign',
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'campaign' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'campaign' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, cards, features, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.cards::jsonb, v.features::jsonb, v.sort_order
from (
  values
    (
      'start-here',
      null,
      'Start here',
      '',
      '[{"icon":"FolderKanban","title":"Open Campaign","body":"Launch it from your organization in Dash","href":"/org"},{"icon":"UsersRound","title":"Manage your team","body":"Add members and set what each role sees","href":"/help/campaign/team"},{"icon":"CirclePlay","title":"Try the playground","body":"Explore a sample project without signing up","href":"/campaign/playground"}]',
      '[]',
      10
    ),
    (
      'opening-campaign',
      'Basics',
      'Opening Campaign',
      $html$<p>Campaign works inside a <strong>project</strong>, and everyone in your organization can open its projects there. To open Campaign, choose <strong>Campaign</strong> on a project in your organization in Dash, then <strong>Continue to Campaign</strong> on Campaign's home page. Campaign opens the project you last opened in it on this browser or, the first time, the oldest of your projects. If your organization's plan doesn't include Campaign, it's dimmed on the project in Dash and can't be opened, and hovering over it shows Campaign isn't in your plan.</p><p>The address bar keeps the project and the screen you're on, so a refresh or a link someone shares from it opens that same project and screen. Campaign has no project switcher of its own.</p><p>The first time you open a project, Campaign gives you a role there from your role in the organization, and that role decides which sections you see. See <a href="/help/campaign/team#how-members-get-a-role">How members get their role</a>.</p>$html$,
      '[]',
      '[]',
      20
    ),
    (
      'trying-the-playground',
      'Basics',
      'Trying Campaign in the playground',
      $html$<p>The <a href="/campaign/playground">Campaign playground</a> opens a sample project in Campaign without an account, so you can click through it, Team & Roles included, before you sign up.</p><p>Everything in the playground is sample data, and nothing you change there is saved: reloading the page starts it over. The account menu's links don't go anywhere in the playground.</p>$html$,
      '[]',
      '[]',
      30
    ),
    (
      'the-sidebar',
      'Navigation',
      'The Campaign sidebar',
      $html$<p>The Campaign sidebar starts with Overview and ends with Settings. In between are Audience, Campaigns, Automations, Channels, Chat Automation, Broadcasts, Social, Communities, Ads, Creators, Transactional, Deliverability, CRM, Inbox, Acquisition, Commerce, Content, Reporting, AI Assistant, Data and Integrations.</p><p>Choosing a section that has screens expands it, and choosing a screen opens it. <strong>Settings</strong> expands to General, Team & Roles, Approvals, Branding, Billing, Connections and Advanced. The button at the bottom of the sidebar shrinks it to icons; hover over an icon to see its name. On a narrow screen, the sidebar button at the top left opens it.</p><p>The sidebar lists only the sections your role includes, so two people in the same project can see different sidebars. See <a href="/help/campaign/team#built-in-roles">Built-in roles</a>.</p>$html$,
      '[]',
      '[]',
      40
    ),
    (
      'team-and-roles',
      'Team',
      'Team and roles',
      $html$<p>Each person in a project holds one role there, and the role decides which sidebar sections they see and whether they can manage the team. Every project has five built-in roles:</p><ul><li><strong>Owner</strong>: everything, including billing</li><li><strong>Admin</strong>: every section, and managing the team and roles, but not billing</li><li><strong>Manager</strong>: every section, adding members and assigning roles</li><li><strong>Member</strong>: Overview, Audience, Campaigns, Automations, Channels, Inbox, Content, Reporting and AI Assistant</li><li><strong>Viewer</strong>: Overview and Reporting</li></ul><p>Manage people and roles under <strong>Settings → Team & Roles</strong>: add members from your organization, change their roles or remove them, create your own roles, and switch each role's permissions on or off. The <a href="/help/campaign/team">Team & Roles</a> guide covers all of it.</p>$html$,
      '[]',
      '[{"icon":"UserPlus","text":"Members: add people from your organization to a project"},{"icon":"ShieldCheck","text":"Roles: Owner, Admin, Manager, Member, Viewer and your own"},{"icon":"PanelLeft","text":"Section access: each role sees only its sidebar sections"},{"icon":"ToggleRight","text":"Permissions: switches for sections and team controls"}]',
      50
    ),
    (
      'account-menu',
      'Account',
      'The account menu',
      $html$<p>Your picture or initials at the top right of Campaign open the account menu, with your name and email at the top.</p><ul><li><strong>Profile</strong>, <strong>Organization Settings</strong> and <strong>Billing & Plans</strong> open your profile, the project's organization and the billing page in Dash.</li><li>The sun and moon buttons switch Campaign between light and dark themes. Until you pick one, Campaign follows your device.</li><li><strong>Settings</strong> and <strong>Security</strong> open the project's <strong>Settings → General</strong> and <strong>Settings → Team & Roles</strong>.</li><li><strong>Send Feedback</strong> starts an email to feedback@geiger.studio, and <strong>Help & Support</strong> one to help@geiger.studio.</li><li><strong>Sign out</strong> signs you out of Geiger and opens the sign-in page.</li></ul>$html$,
      '[]',
      '[]',
      60
    )
) as v(anchor_id, eyebrow, title, content, cards, features, sort_order)
cross join (select id from public.docs_pages where slug = 'campaign' and deleted_at is null) p;

-- @down
-- Restores the Overview as 20261024191300_help_campaign_structure left it: a draft with the outline it carried as products/campaign.
update public.docs_pages
set description = 'Campaign planning and delivery.',
    status = 'draft',
    published_at = null
where slug = 'campaign' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'campaign' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>What Geiger Campaign is for</li><li>Opening it from a project</li><li>Key concepts</li><li>Common workflows</li></ul>',
  10
from public.docs_pages p
where p.slug = 'campaign' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
