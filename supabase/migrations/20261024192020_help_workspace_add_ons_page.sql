-- Help workspace add-ons page
--
-- One-time content move, like 20261024142450_help_flow_add_ons_page: replaces the workspace/add-ons draft outline
-- (created by 20261023112957_help_center_structure) with the Add-ons guide and publishes it. It covers opening add-on
-- settings, the add-ons on sale, Custom Subdomain (Domain tab), Custom Email Templates (Emails tab), the monthly emails
-- balance and a short OAuth / SSO Login section that hands setup to workspace/sign-in#setting-up-sso.
-- Left out on purpose: Own Domain (comingSoon, can't be bought); the Organization Settings dialog's own Save Changes
-- (only toasts); the Domain tab's Visit workspace button (opens the subdomain's root, which serves the Geiger home page,
-- not the organization); the Emails form's merge-field hint, its "Sends draw from your organization's shared email
-- purse" line and what a template's Active status does (no Geiger email reads org templates, and nothing meters the
-- purse); the Events app's own Custom Domains screen, which edits the same subdomain; and visiting an organization
-- on its subdomain, because *.geiger.studio doesn't resolve in DNS yet (the section text is kept in the docs-dash
-- scratchpad as held_add_ons_visiting_a_subdomain.sql.txt).
-- Written from a survey of C:\Pro\geiger-dash (app/org/organizations-client.jsx, app/org/domain-actions.js,
-- app/org/email-actions.js, app/org/oauth-actions.js, app/org/page.js, app/org/[ORGID]/usage/*, lib/domains/store.js,
-- lib/email/*, app/api/email/send/route.js, lib/pricing/plans.js, lib/billing/entitlements.js, lib/billing/store.js,
-- app/pricing/actions.js, components/pricing/plan_cards.jsx, proxy.js, utils/supabase/middleware.js).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Add-ons',
    description = 'Claim a custom subdomain, keep branded email templates, check your monthly emails and set up SSO sign-in for an organization that owns the add-ons.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'workspace/add-ons' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'workspace/add-ons' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, showcase, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.showcase, v.sort_order
from (
  values
    (
      'opening-add-on-settings',
      'Basics',
      'Opening add-on settings',
      $html$<p>Each add-on an organization owns adds a tab to its <strong>Organization Settings</strong> dialog in Dash: <strong>Domain</strong> for Custom Subdomain, <strong>Emails</strong> for Custom Email Templates and <strong>OAuth</strong> for OAuth / SSO Login. To open one:</p><ol><li>Go to <a href="/org">Organizations</a>.</li><li>On the organization's card, open the <strong>⋯</strong> menu and choose <strong>Settings</strong>. You can also right-click the card and choose <strong>Settings</strong>.</li><li>Choose the add-on's tab.</li></ol><p>Only the organization's owner has <strong>Settings</strong> in that menu, so other members never see these tabs. A tab appears only while the organization's plan is active and includes the add-on. If the plan ends, the tabs are hidden until a plan with the add-on is active again, and nothing you set up on them is deleted.</p><p>Each tab saves with its own buttons, such as <strong>Claim subdomain</strong> or <strong>Create template</strong>.</p>$html$,
      '[]',
      null,
      10
    ),
    (
      'available-add-ons',
      'Concepts',
      'Available add-ons',
      $html$<p>Add-ons are extras an organization buys with its plan. Each one belongs to a single organization, so buying it for one doesn't add it to your others.</p><ul><li><strong>Custom Subdomain</strong>, $5 a month: the organization's own address, like <code>yourname.geiger.studio</code>, set up on the <strong>Domain</strong> tab.</li><li><strong>Custom Email Templates</strong>, $10 a month: a library of the organization's own email templates, kept on the <strong>Emails</strong> tab.</li><li><strong>OAuth / SSO Login</strong>, $10 a month: sign-in through the organization's own identity provider, set up on the <strong>OAuth</strong> tab.</li></ul><p>To buy one, pick it on the <a href="/pricing">Pricing</a> page while you configure the organization's plan. It's listed under <strong>Domains & Branding</strong>, <strong>Email & Messaging</strong> or <strong>Security & SSO</strong>, and the steps are in <a href="/help/workspace/billing#buying-a-plan">Buying a plan</a>. No plan includes an add-on, so each one adds its price to the plan's, and the free trial includes none.</p><p>Once the organization owns an add-on, the Pricing page marks it as owned and keeps it in every later checkout, so it can't be dropped from the plan. Every price is listed in <a href="/help/plans-pricing#apps-and-add-ons">Apps and add-ons</a>.</p>$html$,
      '[]',
      null,
      20
    ),
    (
      'custom-subdomain',
      'Domain',
      'Claiming a custom subdomain',
      $html$<p>The <strong>Custom Subdomain</strong> add-on lets an organization claim its own name under geiger.studio, like <code>yourname.geiger.studio</code>. To claim one, open the organization's <strong>Settings</strong> from the <strong>⋯</strong> menu on its card (only its owner has it), choose the <strong>Domain</strong> tab, type a name in <strong>Subdomain</strong> and choose <strong>Claim subdomain</strong>. Dash saves it straight away and shows the address as <strong>Active</strong>.</p><p>An organization has one subdomain at a time, and a name can belong to only one organization. The name must be:</p><ul><li>3 to 63 characters long.</li><li>Letters, numbers and hyphens, without a hyphen at either end. As you type, Dash turns capitals into lowercase and drops any other character.</li><li>Not reserved. Names Geiger uses itself, such as <code>www</code>, <code>app</code>, <code>api</code>, <code>admin</code>, <code>help</code>, <code>billing</code> and <code>geiger</code>, can't be claimed.</li></ul><p>When you pause typing, Dash checks the name and shows whether the address is available, or why it isn't, such as <strong>That subdomain is already taken</strong>. <strong>Claim subdomain</strong> stays disabled until the name is available.</p>$html$,
      '[]',
      null,
      30
    ),
    (
      'changing-or-removing-a-subdomain',
      'Domain',
      'Changing or removing a subdomain',
      $html$<p>Once an organization has a subdomain, the <strong>Domain</strong> tab in its <strong>Organization Settings</strong> shows the address under <strong>Custom Subdomain</strong>, marked <strong>Active</strong>, with a copy icon beside it.</p><ul><li>To change the address, choose <strong>Change</strong>, edit the name and choose the <strong>Save Changes</strong> button directly under it. The name follows the same rules and availability check as a first claim, and <strong>Save Changes</strong> stays disabled until the name is different and available. <strong>Cancel</strong> keeps the current address.</li><li>To give the address up, choose <strong>Remove</strong>. Dash removes it straight away, without asking, and the tab goes back to <strong>Claim your subdomain</strong>.</li></ul><p>Either way, the old name is released at once, and any organization can claim it, yours included.</p>$html$,
      '[]',
      null,
      40
    ),
    (
      'email-templates',
      'Emails',
      'Creating an email template',
      $html$<p>The <strong>Custom Email Templates</strong> add-on gives an organization a library of its own email templates, kept on the <strong>Emails</strong> tab of its <strong>Organization Settings</strong>. Only the organization's owner can open it. To create a template, choose <strong>New template</strong>, fill in the form and choose <strong>Create template</strong>.</p><ul><li><strong>Template name</strong>: the only required field. Without one, Dash shows <strong>Give the template a name</strong> and saves nothing.</li><li><strong>Event / purpose</strong>: what the email is for, like an event's name.</li><li><strong>Subject line</strong>: the email's subject.</li><li><strong>Body</strong>: the email itself, as plain text or HTML.</li><li><strong>Status</strong>: Draft or Active. New templates start as Draft.</li></ul><p>Dash keeps the first 120 characters of a name, 160 of an event or purpose and 300 of a subject. Nothing saves until you choose <strong>Create template</strong>, and <strong>Cancel</strong> drops the draft and returns to the list.</p>$html$,
      '[]',
      null,
      60
    ),
    (
      'editing-and-deleting-templates',
      'Emails',
      'Editing and deleting templates',
      $html$<p>The <strong>Emails</strong> tab in <strong>Organization Settings</strong> lists the organization's email templates, newest first. Each row shows the template's name and status, with its event or purpose and its subject underneath. Before the first template exists, the tab shows <strong>No templates yet</strong>.</p><ul><li>To edit a template, choose the pencil on its row, make your changes and choose <strong>Save template</strong>. <strong>Cancel</strong> returns to the list without saving.</li><li>To delete a template, choose the trash icon on its row. It's deleted straight away, without asking, and can't be restored from Dash.</li></ul>$html$,
      '[]',
      null,
      70
    ),
    (
      'monthly-emails',
      'Concepts',
      'Monthly emails',
      $html$<p>Monthly emails is one email balance for the whole organization, not tied to any single app. You set it with the <strong>Monthly emails</strong> slider when you configure the organization's plan on the <a href="/pricing">Pricing</a> page: from 0 to 200,000 emails, in steps of 1,000, at $0.35 per 1,000 emails a month. No plan includes any, so it starts at 0. Once the organization has bought some, a later checkout can't set it lower.</p><p>The amount the organization bought appears as <strong>Email Purse</strong> under <strong>Allowance</strong> on its <a href="/help/workspace/billing#usage-page">Usage page</a>, which the organization's owner opens with <strong>Usage</strong> in the organization card's <strong>⋯</strong> menu. Dash doesn't count sent emails against the balance, so the tile shows 0 emails used.</p>$html$,
      '[]',
      null,
      80
    ),
    (
      'oauth-sso',
      'OAuth',
      'OAuth and SSO sign-in',
      $html$<p>The <strong>OAuth / SSO Login</strong> add-on lets members sign in to Geiger through your organization's own identity provider, over OpenID Connect or OAuth 2.0. Once the organization owns it, its owner sees an <strong>OAuth</strong> tab in <strong>Organization Settings</strong>. There they connect the provider, turn SSO sign-in on or off and copy the <strong>SSO login link</strong> to share with members. Other members don't see the tab.</p><p>For the setup steps, see <a href="/help/workspace/sign-in#setting-up-sso">Setting up SSO</a>. For what members do, see <a href="/help/workspace/sign-in#signing-in-with-sso">Signing in with SSO</a>.</p>$html$,
      '[]',
      null,
      90
    ),
    (
      'add-on-tab-missing',
      'Troubleshooting',
      'An add-on tab is missing',
      $html$<p>If <strong>Organization Settings</strong> has no <strong>Domain</strong>, <strong>Emails</strong> or <strong>OAuth</strong> tab for an add-on you expect, check these:</p><ul><li>You opened the right organization. Each add-on belongs to one organization, and its tab shows only in that organization's settings.</li><li>You're the organization's owner. Nobody else has <strong>Settings</strong> in the card's <strong>⋯</strong> menu, so ask the owner.</li><li>The organization owns the add-on. In the card's <strong>⋯</strong> menu, choose <strong>Usage</strong>: owned add-ons are marked <strong>Owned</strong> under <strong>Products</strong>. If it isn't there, buy it with the organization's plan, as described in <a href="/help/workspace/billing#buying-a-plan">Buying a plan</a>.</li><li>The plan is active. The free trial includes no add-ons, and once a plan ends, the tabs stay hidden until a plan with the add-on is active again.</li></ul>$html$,
      '[]',
      null,
      100
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"CreditCard","label":"Billing & usage","href":"/help/workspace/billing"},{"icon":"BadgeDollarSign","label":"Plans & pricing","href":"/help/plans-pricing"},{"icon":"KeyRound","label":"Sign-in & OAuth","href":"/help/workspace/sign-in"}]',
      null,
      110
    )
) as v(anchor_id, eyebrow, title, content, links, showcase, sort_order)
cross join (select id from public.docs_pages where slug = 'workspace/add-ons' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Add-ons',
    description = 'Extend your organization with add-ons such as a custom subdomain and email templates.',
    status = 'draft',
    published_at = null
where slug = 'workspace/add-ons' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'workspace/add-ons' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Custom subdomain</li><li>Email templates</li><li>Email sending credits</li><li>OAuth sign-in</li></ul>',
  10
from public.docs_pages p
where p.slug = 'workspace/add-ons' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
