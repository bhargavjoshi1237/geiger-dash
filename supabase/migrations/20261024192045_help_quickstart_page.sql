-- Help quickstart page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the quickstart draft outline (created by
-- 20261023112957_help_center_structure) with the Quickstart guide and publishes it: creating an account, the setup
-- wizard (create or join an organization, invite the team), buying a plan, creating the first project and opening it
-- in an app. Each step links to the Workspace guide that owns the full procedure. published_at was already set before
-- this move, so neither direction touches it beyond the coalesce.
-- Left out on purpose: the free trial (it records no apps, so nothing unlocks, and it can overwrite an organization's
-- paid plan), the wizard's "geiger.app/<slug>" preview under the name (no such address exists), and joining by
-- "workspace URL" (the lookup only matches an organization ID or an internal slug no screen shows).
-- Written from a survey of C:\Pro\geiger-dash (app/signup/*, app/login/auth-form.jsx, app/auth/callback/route.js,
-- app/onboarding/page.js, app/onboarding/onboarding-wizard.jsx, app/onboarding/actions.js, utils/supabase/middleware.js,
-- lib/billing/entitlements.js, lib/billing/store.js, components/pricing/plan_cards.jsx, app/pricing/actions.js,
-- app/org/[ORGID]/*, lib/org/product-apps.js, supabase/migrations/20260704070748_fix_org_member_count.sql) and the
-- Workspace guides' surveys named in their own migration headers (20261024192000 to 20261024192035).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Quickstart',
    description = 'Create your account, set up or join an organization, invite your team, buy a plan, then create your first project and open it in an app.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'quickstart' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'quickstart' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, showcase, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.showcase, v.sort_order
from (
  values
    (
      'creating-your-account',
      'Account',
      'Creating your account',
      $html$<p>To create a Geiger account, open the <a href="/signup">sign-up page</a>, type your email under <strong>Email</strong>, then a password of at least 8 characters in the field that appears, and choose <strong>Create account</strong>. Dash shows <strong>Check your email</strong>: open the confirmation link it sends to finish creating your account.</p><p>You can also use <strong>Continue with Google</strong> or <strong>Continue with GitHub</strong> on the <a href="/login">sign-in page</a>, which creates your account the first time. One account signs you in to Dash and every app in the suite.</p><p>Once you're signed in, Dash opens a short setup wizard, because your account doesn't belong to an organization yet. <a href="/help/workspace/sign-in#signing-up">Signing up</a> covers every way to create an account.</p>$html$,
      '[]',
      null,
      10
    ),
    (
      'setting-up-your-organization',
      'Organization',
      'Setting up your organization',
      $html$<p>Everything you do in Geiger belongs to an organization: its members, its plan and its projects. The setup wizard opens on <strong>Welcome to Geiger</strong> with two choices, <strong>Create a new organization</strong> and <strong>Join an existing organization</strong>. If your team already uses Geiger, join theirs instead, as <a href="/help/quickstart#joining-your-teams-organization">Joining your team's organization</a> describes. To create one:</p><ol><li>Choose <strong>Create a new organization</strong>, then <strong>Continue</strong>.</li><li>Type the <strong>Organization name</strong>, up to 60 characters. It's the only required field.</li><li>Optional: add a <strong>Description</strong>, and pick an answer under <strong>How many people will use this?</strong></li><li>Choose <strong>Create organization</strong>.</li></ol><p>You become the organization's owner, the only person who can change its settings, manage its members and set up its add-ons. The wizard moves on to inviting your team. Later, you create more organizations from the Organizations page, as <a href="/help/workspace/organizations#creating-an-organization">Creating an organization</a> describes.</p>$html$,
      '[]',
      null,
      20
    ),
    (
      'inviting-your-team',
      'Members',
      'Inviting your team',
      $html$<p>The wizard's last step, <strong>Invite your team</strong>, invites people to your new organization by email. Type their addresses under <strong>Email addresses</strong>, separated by commas, spaces or new lines, and choose <strong>Send invites</strong>. Each person gets an email with a link to accept, and joins with the User role once they do. To invite people later instead, choose <strong>Skip for now</strong>.</p><p>Either way, the wizard shows <strong>You're all set</strong> and opens the Organizations page. To invite more people, choose their roles or check pending invites, see <a href="/help/workspace/members#inviting-members">Inviting members</a>.</p>$html$,
      '[]',
      null,
      30
    ),
    (
      'joining-your-teams-organization',
      'Organization',
      'Joining your team''s organization',
      $html$<p>To join an organization your team already uses, accept the invitation email if someone sent you one: see <a href="/help/workspace/members#accepting-an-invite">Accepting an invite</a>. Otherwise, ask a member for the organization's ID. They copy it with <strong>Copy ID</strong> in the organization card's <strong>⋯</strong> menu. Then, in the setup wizard:</p><ol><li>Choose <strong>Join an existing organization</strong>, then <strong>Continue</strong>.</li><li>Paste the ID under <strong>Organization ID or URL</strong> and choose <strong>Find organization</strong>.</li><li>Check the organization's name and member count, then choose <strong>Join</strong> followed by its name.</li></ol><p>You join straight away with the User role, and the wizard opens the Organizations page. Your organization's plan and projects are already in place, so you can go on to <a href="/help/quickstart#opening-a-project-in-an-app">opening a project in an app</a>.</p>$html$,
      '[]',
      null,
      40
    ),
    (
      'buying-a-plan',
      'Billing',
      'Buying a plan',
      $html$<p>A new organization has no plan, so its projects can't use any app and you can't create a project yet. A plan includes the apps you pick for the organization and sets how many projects it can have. To buy one:</p><ol><li>Go to the <a href="/pricing">pricing page</a> and choose <strong>Configure this plan</strong> on Basic, Plus or Pro.</li><li>Under <strong>Choose products for your projects</strong>, click each app your team will use.</li><li>In <strong>Apply to organization</strong>, pick your organization.</li><li>Choose <strong>Pay for</strong> followed by the plan's name, and pay on Stripe.</li></ol><p>The plan is one payment for 30 days, or for 365 days with <strong>Yearly</strong>, and it doesn't renew on its own. Any member of the organization can buy it. <a href="/help/workspace/billing#buying-a-plan">Buying a plan</a> has every step, and <a href="/help/plans-pricing#plans">Plans and pricing</a> lists what each plan includes and costs.</p>$html$,
      '[]',
      null,
      50
    ),
    (
      'creating-your-first-project',
      'Projects',
      'Creating your first project',
      $html$<p>A project is the shared home for a piece of work: you create it in Dash, then open it in the apps it uses. To create your first one:</p><ol><li>On the <a href="/org">Organizations page</a>, click your organization's card.</li><li>Choose <strong>Create project</strong> in the middle of the page, or <strong>New Project</strong> at the top right.</li><li>Optional: type a <strong>Project name</strong>. Then choose <strong>Continue</strong>.</li><li>Pick the apps the project uses, then choose <strong>Create project</strong>.</li></ol><p>In an organization, each app can be in only one project at a time, and an app the plan doesn't include reads <strong>Not in your plan</strong>. <a href="/help/workspace/projects#creating-a-project">Creating a project</a> covers the details.</p>$html$,
      '[]',
      null,
      60
    ),
    (
      'opening-a-project-in-an-app',
      'Apps',
      'Opening a project in an app',
      $html$<p>To open a project in an app, go to your organization's project list in Dash and choose the app's name on the project's row. The app opens in the same tab. Every member of the organization sees the same projects and opens them the same way.</p><p>Each app has its own guide. To start with Flow, where your team plans and tracks its work, see <a href="/help/flow">Geiger Flow</a>.</p>$html$,
      '[]',
      null,
      70
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"Shapes","label":"Core concepts","href":"/help/core-concepts"},{"icon":"Building2","label":"Organizations","href":"/help/workspace/organizations"},{"icon":"Users","label":"Members & roles","href":"/help/workspace/members"},{"icon":"FolderKanban","label":"Projects","href":"/help/workspace/projects"},{"icon":"CreditCard","label":"Billing & usage","href":"/help/workspace/billing"},{"icon":"Workflow","label":"Geiger Flow","href":"/help/flow"}]',
      null,
      80
    )
) as v(anchor_id, eyebrow, title, content, links, showcase, sort_order)
cross join (select id from public.docs_pages where slug = 'quickstart' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Quickstart',
    description = 'Create an account, set up your organization, and open your first project.',
    status = 'draft'
where slug = 'quickstart' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'quickstart' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Create an account</li><li>Set up your organization</li><li>Create your first project</li><li>Open a product from the project</li><li>Invite your team</li></ul>',
  10
from public.docs_pages p
where p.slug = 'quickstart' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
