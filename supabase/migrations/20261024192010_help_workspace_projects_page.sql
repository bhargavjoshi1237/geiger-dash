-- Help workspace projects page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the workspace/projects draft outline
-- (created by 20261023112957_help_center_structure) with the full Projects guide and publishes it. It covers an
-- organization's project screen in Dash: creating a project, the apps it can hold, locked apps and the project
-- limit, the project list, opening a project in an app, editing, the project icon and deleting.
-- Left out on purpose: Comms, Office and Docs (available: false, so they can't be picked or launched); the unused
-- renameProjectAction and its "Project renamed." toast (renaming happens through Edit); the organization's
-- Active/Inactive badge (owned by the organizations guide, and Deactivate is a placeholder); where apps other than
-- Flow, Notes and Property land when opened (their launch links use per-app id columns the apps don't all resolve,
-- and Campaign opens at its start page); the Edit dialog failing to save a project that holds a locked app; and the
-- grace banner's data deletion warning (no code deletes anything).
-- Written from a survey of C:\Pro\geiger-dash (app/org/[ORGID]/page.js, organization-projects-client.jsx,
-- new-project-button.jsx, actions.js, _components/*, lib/org/projects.js, lib/org/product-apps.js,
-- lib/billing/entitlements.js, lib/billing/actions.js, lib/billing/plan_state.js, lib/pricing/plans.js,
-- components/billing/plan_banner.jsx, app/org/organizations-client.jsx, app/layout.js,
-- supabase/migrations/20260629212507_org_abilities_rls.sql, 20260718044514_organization_projects.sql).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Projects',
    description = 'Create a project, choose its apps and open it in them, then rename it, change its icon or delete it. Your plan sets which apps you can add.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'workspace/projects' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'workspace/projects' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, showcase, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.showcase, v.sort_order
from (
  values
    (
      'creating-a-project',
      'Basics',
      'Creating a project',
      $html$<p>To create a project, open your organization from the <a href="/org">Organizations</a> page in Dash and choose <strong>New Project</strong> at the top right. While the organization has no projects, <strong>Create project</strong> in the middle of the page does the same. Any member of the organization can create projects, not only its owner.</p><ol><li>Optional: type a <strong>Project name</strong>. Leave it blank and the project is called Untitled project. You can rename it later.</li><li>Choose <strong>Continue</strong>, or press <code>Enter</code>.</li><li>Pick the apps the project uses. Flow starts selected when your plan includes it and no other project has it. Type in <strong>Search products</strong> to narrow the list, or choose <strong>Select all</strong> to pick every app you can.</li><li>Choose <strong>Create project</strong>. It stays disabled until at least one app is selected.</li></ol><p>The project appears at the top of the list and Dash shows <strong>Project created</strong>. <strong>Back</strong> returns to the name, and closing the dialog discards what you entered. Which apps you can pick depends on your plan and on your organization's other projects, as <a href="/help/workspace/projects#apps-in-a-project">Apps in a project</a> explains.</p>$html$,
      '[]',
      null,
      10
    ),
    (
      'apps-in-a-project',
      'Concepts',
      'Apps in a project',
      $html$<p>A project holds one or more apps. You choose them when you create the project and change them any time with <strong>Edit</strong>. The project dialogs list the apps in this order:</p><ul><li><strong>Campaign</strong>: campaign planning and delivery</li><li><strong>Flow</strong>: projects and delivery</li><li><strong>Events</strong>: event operations and registration</li><li><strong>Assets</strong>: creative asset control</li><li><strong>Forms</strong>: intake and feedback</li><li><strong>Grey</strong>: managed RAG and knowledge graphs</li><li><strong>Content</strong>: personalized content feeds</li><li><strong>Pods</strong>: API gateway</li><li><strong>Notes</strong>: docs and knowledge</li><li><strong>Property</strong>: real estate and property management</li></ul><p>In an organization, each app can be in only one project at a time. An app that another project already has is grayed out, reads <strong>Already in another project</strong> and can't be picked. To move it, turn it off in the other project's <strong>Edit</strong> dialog, or delete that project.</p><p>An app that your organization's plan doesn't include reads <strong>Not in your plan</strong> and can't be picked either. <a href="/help/workspace/projects#locked-apps-and-limits">Locked apps and the project limit</a> explains why.</p>$html$,
      '[]',
      null,
      20
    ),
    (
      'locked-apps-and-limits',
      'Concepts',
      'Locked apps and the project limit',
      $html$<p>Your organization's plan decides which apps its projects can use and how many projects it can have. The plans, the apps each one covers and their project limits are explained in <a href="/help/plans-pricing#plans">plans and pricing</a>. To buy or upgrade a plan, see <a href="/help/workspace/billing#buying-a-plan">buying a plan</a>.</p><p>An app is <strong>locked</strong> when the plan doesn't include it. In the project dialogs, a locked app shows a lock, reads <strong>Not in your plan</strong> and can't be picked. On a project's row in Dash, it's dimmed with a lock and doesn't open.</p><p>Dash checks the project limit when you choose <strong>Create project</strong>. Once the organization has as many projects as its plan allows, the project isn't created and Dash shows <strong>You've reached your plan's project limit. Upgrade to add more</strong>. Deleting a project frees a place.</p><p>An organization with no live plan, because it never had one or its plan or trial has ended, has no apps in its plan and a project limit of 0. Its projects stay on the list with every app locked, and <strong>Create project</strong> stays disabled because no app can be picked.</p><p>The person who bought the plan or started the trial also sees a banner at the bottom of every page in Dash. While the trial runs, it counts down the days left and offers <strong>Upgrade</strong>. Once the plan has ended, it counts down 30 days and offers <strong>Renew</strong>. Both open the <a href="/pricing">pricing</a> page. For the details, see <a href="/help/workspace/billing#when-a-plan-ends">what happens when a plan ends</a>.</p>$html$,
      '[]',
      null,
      30
    ),
    (
      'project-list',
      'Projects',
      'The project list',
      $html$<p>Each organization's page in Dash lists all of its projects, and every member of the organization sees the same list. To get there, click the organization's card on the <a href="/org">Organizations</a> page. <strong>All Organizations</strong> at the top takes you back.</p><p>The header shows the organization's name and how many projects it has. Projects are listed newest first, and the order can't be changed. Each row shows the project's icon and name, how many apps it has and when it was added, then its apps.</p><p>The <strong>⋯</strong> menu at the end of each row has <strong>Copy ID</strong>, <strong>Edit</strong> and <strong>Delete</strong>. <strong>Copy ID</strong> copies the project's ID to your clipboard.</p><p>To find a project, choose the search icon at the top right of the list and type. The search matches project names, app names and project IDs, and the list shows how many projects match. <code>Esc</code> or <strong>Clear filters</strong> clears the search.</p>$html$,
      '[]',
      null,
      40
    ),
    (
      'opening-a-project-in-an-app',
      'Projects',
      'Opening a project in an app',
      $html$<p>To open a project in an app, go to your organization's project list in Dash and choose the app's name on the project's row. The app opens in the same tab. Flow, Notes and Property open straight on that project. To learn what you can do in Flow, see <a href="/help/flow">Geiger Flow</a>.</p><p>When a row is too narrow for all of its apps, it ends with a button such as <strong>3 More</strong> that opens a menu with the rest. The pencil at the bottom of that menu opens the project's <strong>Edit project</strong> dialog.</p><p>A locked app, one your organization's plan doesn't include, is dimmed with a lock instead of its icon and doesn't open. <a href="/help/workspace/projects#locked-apps-and-limits">Locked apps and the project limit</a> explains what to do.</p>$html$,
      '[]',
      null,
      50
    ),
    (
      'editing-a-project',
      'Projects',
      'Editing a project',
      $html$<p>To rename a project or change its apps, choose <strong>Edit</strong> from the <strong>⋯</strong> menu on the project's row in Dash. Any member of the organization can edit its projects. The <strong>Edit project</strong> dialog has:</p><ul><li><strong>Project name</strong>: the name is shared with the project's apps, so renaming it here renames it in them too. Clear it and the project is called Untitled project.</li><li><strong>Products</strong>: a switch for each app, with the project's current apps turned on. Turn an app on to add it or off to remove it. The search icon beside <strong>Products</strong> narrows the list.</li></ul><p>Choose <strong>Save Changes</strong> to keep your changes, and Dash shows <strong>Project updated</strong>. A project needs at least one app, so <strong>Save Changes</strong> stays disabled while every switch is off. Turning an app off takes it off the project's row and frees it for another project. Dash doesn't delete anything stored in that app.</p><p>The same dialog holds the project's icon, which saves on its own, as <a href="/help/workspace/projects#project-icon">Changing the project icon</a> explains.</p>$html$,
      '[]',
      null,
      60
    ),
    (
      'project-icon',
      'Projects',
      'Changing the project icon',
      $html$<p>A project's icon is the first letter of its name on a colored tile until you upload an image. To upload one, choose <strong>Edit</strong> from the <strong>⋯</strong> menu on the project's row, click the icon at the top left of the <strong>Edit project</strong> dialog (the dialog calls it the avatar), and pick a PNG, JPEG or WebP image under 2 MB.</p><p>The image saves as soon as you pick it, without <strong>Save Changes</strong>, and Dash shows <strong>Avatar updated</strong>. A larger file fails with <strong>File must be under 2 MB</strong>. To change the image, upload another one. There's no way to remove an uploaded image and go back to the letter.</p>$html$,
      '[]',
      null,
      70
    ),
    (
      'deleting-a-project',
      'Projects',
      'Deleting a project',
      $html$<p>To delete a project, choose <strong>Delete</strong> from the <strong>⋯</strong> menu on its row in Dash, then <strong>Delete project</strong> in the dialog. Any member of the organization can delete its projects.</p><p>Deleting is permanent. Dash asks you to confirm first: the dialog warns that this permanently removes the project and unlinks its apps, and that it can't be undone. A deleted project can't be restored, so choose <strong>Cancel</strong> if you're not sure.</p><p>Once it's deleted, Dash shows <strong>Project deleted</strong> and the project leaves the list. Its apps can then be added to another project, and it no longer counts toward your plan's project limit.</p>$html$,
      '[]',
      null,
      80
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"Building2","label":"Organizations","href":"/help/workspace/organizations"},{"icon":"Users","label":"Members & roles","href":"/help/workspace/members"},{"icon":"CreditCard","label":"Billing & usage","href":"/help/workspace/billing"},{"icon":"BadgeDollarSign","label":"Plans & pricing","href":"/help/plans-pricing"},{"icon":"Shapes","label":"Core concepts","href":"/help/core-concepts"},{"icon":"Workflow","label":"Geiger Flow","href":"/help/flow"}]',
      null,
      90
    )
) as v(anchor_id, eyebrow, title, content, links, showcase, sort_order)
cross join (select id from public.docs_pages where slug = 'workspace/projects' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Projects',
    description = 'Create projects and open them in the products your team uses.',
    status = 'draft',
    published_at = null
where slug = 'workspace/projects' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'workspace/projects' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Creating a project</li><li>Opening a project in a product</li><li>Project settings</li><li>Managing projects</li></ul>',
  10
from public.docs_pages p
where p.slug = 'workspace/projects' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
