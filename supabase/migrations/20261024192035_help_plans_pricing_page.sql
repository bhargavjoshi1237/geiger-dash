-- Help plans pricing page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the plans-pricing draft outline (created by
-- 20261023112957_help_center_structure) with the Plans & pricing reference page and publishes it. published_at was
-- already set before this move, so neither direction touches it beyond the coalesce.
-- Left out on purpose: the Beta Tester plan (only named in the pricing FAQ, never offered or purchasable), Own Domain
-- (coming soon, stripped at checkout), usage metering (only projects are counted; everything else reads 0), the data
-- deletion the grace countdown warns about (no job deletes anything), switching an existing plan between monthly and
-- yearly (the upgrade charge mixes intervals), and what the free trial unlocks (it records no apps). Comms, Office and
-- Docs are left out of the app lists (they can't be added to a project). Also held back by the lead: the free trial
-- (it records no apps, so nothing unlocks, and it can overwrite an organization's paid plan) and the Active projects
-- rate (extra projects are charged but the project limit stays at the plan's allowance).
-- Written from a survey of C:\Pro\geiger-dash (lib/pricing/plans.js, components/pricing/plan_cards.jsx, app/pricing/page.js,
-- app/pricing/actions.js, app/pricing/trial-actions.js, lib/billing/store.js, lib/billing/plan_state.js,
-- lib/billing/entitlements.js, lib/billing/actions.js, components/billing/plan_banner.jsx, app/billing/page.js,
-- app/org/[ORGID]/page.js, app/org/[ORGID]/actions.js, app/org/[ORGID]/_components/*, app/org/[ORGID]/usage/*,
-- app/org/organizations-client.jsx, lib/org/product-apps.js, app/api/stripe/webhook/route.js).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Plans & pricing',
    description = 'What each plan includes and costs, how apps, add-ons and extra capacity are priced, monthly or yearly billing, and when a plan ends.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'plans-pricing' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'plans-pricing' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, showcase, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.showcase, v.sort_order
from (
  values
    (
      'plans',
      'Plans',
      'Plans and what they include',
      $html$<p>A plan sets what one organization can use across the suite. You buy it on <a href="/pricing">Pricing</a> for one organization at a time, and its apps and limits are shared by every member of that organization. There are three plans:</p><ul><li><strong>Basic</strong>, $19 a month: Notes plus 1 Core app and 1 Add-on app, with 1 active project, 5 collaborators, 5 GB of storage, 25 GB of bandwidth and 50 AI credits.</li><li><strong>Plus</strong>, $79 a month: Notes plus 2 Core apps and 2 Add-on apps, with 3 active projects, 12 collaborators, 50 GB of storage, 250 GB of bandwidth and 200 AI credits.</li><li><strong>Pro</strong>, $119 a month: Notes plus 3 Core apps and 4 Add-on apps, with 10 active projects, 25 collaborators, 100 GB of storage, 500 GB of bandwidth and 300 AI credits.</li></ul><p>Core and Add-on are app categories, listed in <a href="/help/plans-pricing#apps-and-add-ons">apps and add-ons</a>. The plan's price is the starting point. Apps, add-ons and capacity beyond its allowance are added on top, and the calculator on Pricing shows the total as <strong>Estimated monthly cost</strong> while you choose. Collaborators are the plan's seats: the number of people the price covers, with extra seats added in the calculator. No plan includes organization add-ons, Edge / CDN Serving or monthly emails.</p><p>The calculator starts on Plus, or on what the organization already owns when it has a live plan.</p>$html$,
      '[]',
      null,
      10
    ),
    (
      'apps-and-add-ons',
      'Plans',
      'Apps and add-ons',
      $html$<p>The calculator on Pricing groups the apps into three categories, and each plan includes a number of apps from each. You pick which apps fill the allowance, and every app beyond it costs its category's rate:</p><ul><li><strong>Core Products</strong>, $10 a month for each extra app: Campaign, Flow, Events, Assets and Property.</li><li><strong>Add-on Products</strong>, $5 a month for each extra app: Forms, Grey, Content and Pods.</li><li><strong>Cherry Products</strong>, $3 a month for each extra app: Notes, which every plan includes.</li></ul><p>Each app the organization owns can be in only one of its projects at a time: see <a href="/help/workspace/projects#locked-apps-and-limits">locked apps and limits</a>.</p><p>Add-on Products are apps, despite the name. The organization add-ons are separate: each has a category of its own, no plan includes them, and they cost the same on every plan.</p><ul><li><strong>OAuth / SSO Login</strong>, under <strong>Security & SSO</strong>: $10 a month.</li><li><strong>Custom Subdomain</strong>, under <strong>Domains & Branding</strong>: $5 a month.</li><li><strong>Custom Email Templates</strong>, under <strong>Email & Messaging</strong>: $10 a month.</li></ul><p>Add-ons are bought with a plan, in the same checkout. What each one does is on the <a href="/help/workspace/add-ons">Add-ons</a> page.</p>$html$,
      '[]',
      null,
      20
    ),
    (
      'usage-charges',
      'Reference',
      'Extra collaborators, storage and usage',
      $html$<p>Collaborators, storage and usage are set in the <strong>Set your scale</strong> step of the calculator on Pricing, before you pay. Each one starts at the plan's allowance and can't go lower, and only the amount above the allowance is charged, at these monthly rates:</p><ul><li><strong>Collaborators</strong>: $1 for each seat beyond the allowance, up to 100.</li><li><strong>Storage</strong>: $0.50 per GB beyond the allowance, up to 1,000 GB in steps of 3 GB.</li><li><strong>Bandwidth</strong>: each GB of storage you choose includes 5 GB of bandwidth, shown as <strong>Bandwidth included now</strong>. Beyond that, it's $0.25 per GB, up to 5,000 GB.</li><li><strong>Edge / CDN Serving</strong>: none is included, and it's $0.10 per GB from the first GB, up to 5,000 GB.</li><li><strong>AI credits</strong>: $10 per 1,000 credits beyond the allowance, up to 5,000 credits in steps of 10.</li><li><strong>Monthly emails</strong>: none are included, and it's $0.35 per 1,000 emails, up to 200,000 in steps of 1,000. It's one balance for the whole organization, not tied to an app: see <a href="/help/workspace/add-ons#monthly-emails">monthly emails</a>.</li></ul><p>These are amounts you choose up front, not metered usage. They're paid with the plan in the same payment, and nothing is measured and billed afterward. With yearly billing, each rate is 10 times the monthly one.</p>$html$,
      '[]',
      null,
      30
    ),
    (
      'monthly-or-yearly',
      'Plans',
      'Monthly or yearly billing',
      $html$<p>The <strong>Monthly</strong> and <strong>Yearly</strong> switch at the top of Pricing sets the billing period. A yearly plan costs 10 times the monthly price, which the switch shows as <strong>Save 17%</strong>: Basic is $190 a year, Plus $790 and Pro $1,190. Extra apps, add-ons, capacity and usage cost 10 times their monthly rates too.</p><p>Either way, you pay once for the whole period at checkout. A monthly plan runs for 30 days from the day you pay, and a yearly plan for 365 days. Neither one renews or charges you again on its own: see <a href="/help/plans-pricing#plan-period-and-expiry">plan period and expiry</a>.</p>$html$,
      '[]',
      null,
      40
    ),
    (
      'plan-period-and-expiry',
      'Concepts',
      'Plan period and expiry',
      $html$<p>A plan lasts one period from the day it starts: 30 days for a monthly plan, 365 days for a yearly plan and 15 days for the free trial. Plans don't renew on their own, and nothing is charged when one ends.</p><p>When the period ends, the organization loses its apps, add-ons and project allowance straight away, with no extra days of access. Its projects show their apps as locked, so you can't open them from Dash until the organization has a plan again. For the next 30 days, the person who bought the plan or started the trial sees a banner counting down the days left to renew, and the Billing page marks the plan Ended. After that, it shows as Expired.</p><p>To keep a plan, buy it again on Pricing once its period has ended. While a plan is still live, checkout only accepts changes that cost more, so the same configuration shows <strong>No changes to purchase</strong>. What you see on screen when a plan ends is in <a href="/help/workspace/billing#when-a-plan-ends">when a plan ends</a>.</p>$html$,
      '[]',
      null,
      60
    ),
    (
      'upgrades-and-downgrades',
      'Concepts',
      'Upgrades and downgrades',
      $html$<p>While an organization has a live plan, you can add to it but not take anything away. Choose the organization under <strong>Apply to organization</strong> on Pricing, and the calculator opens on what it already owns:</p><ul><li>Higher plans offer <strong>Upgrade to Plus</strong> or <strong>Upgrade to Pro</strong>. Lower plans show <strong>Not available as a downgrade</strong> and can't be chosen.</li><li>Apps and add-ons the organization owns are locked on, with a lock icon.</li><li>Projects, collaborators, storage and usage can't go below what it already bought.</li></ul><p><strong>Due today (upgrade)</strong> shows what the change costs: the new total minus the price of the plan the organization has now. When nothing costs more, the button reads <strong>No changes to purchase</strong>, and an upgrade under $0.50 can't be charged. An upgrade starts a new period from the day you pay.</p><p>To move to a lower plan, drop an app or lower an amount, wait for the current plan to end, then buy the smaller configuration.</p>$html$,
      '[]',
      null,
      70
    ),
    (
      'without-a-plan',
      'Concepts',
      'Organizations without a plan',
      $html$<p>An organization without a live plan has no apps and no project allowance. That covers every new organization, and any organization whose plan or trial has ended. In Dash:</p><ul><li><strong>New Project</strong> shows every app as Not in your plan, so you can't create a project.</li><li>Projects the organization already has stay in its list, with their apps locked.</li><li>The <strong>Domain</strong>, <strong>Emails</strong> and <strong>OAuth</strong> tabs in <strong>Organization Settings</strong> don't appear, because they come with add-ons.</li></ul><p>You can still invite members and manage the organization. To use apps, buy a plan for it on Pricing: see <a href="/help/workspace/billing#buying-a-plan">buying a plan</a>.</p>$html$,
      '[]',
      null,
      80
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"CreditCard","label":"Billing & usage","href":"/help/workspace/billing"},{"icon":"PackagePlus","label":"Add-ons","href":"/help/workspace/add-ons"},{"icon":"FolderKanban","label":"Projects","href":"/help/workspace/projects"}]',
      null,
      90
    )
) as v(anchor_id, eyebrow, title, content, links, showcase, sort_order)
cross join (select id from public.docs_pages where slug = 'plans-pricing' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Plans & pricing',
    description = 'How plans, seats, add-ons and usage are billed.',
    status = 'draft'
where slug = 'plans-pricing' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'plans-pricing' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Plans and what they include</li><li>Seats</li><li>Add-ons</li><li>Usage-based charges</li><li>Trials and plan expiry</li></ul>',
  10
from public.docs_pages p
where p.slug = 'plans-pricing' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
