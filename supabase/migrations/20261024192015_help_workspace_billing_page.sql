-- Help workspace billing page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the workspace/billing draft outline (created by
-- 20261023112957_help_center_structure) with the Billing & usage guide and publishes it. It covers buying a plan on the
-- pricing page, the free trial, the payment confirmation page, upgrading, the billing page and its payment history, what
-- shows when a plan ends, an organization's Usage page, and checkout troubleshooting.
-- Left out on purpose: Own Domain (coming soon, can't be bought); the Refunded and Canceled payment statuses (nothing
-- sets them, and refunds aren't handled); the Usage page's used figures other than Active Projects (nothing meters them,
-- so they always read 0) and its "metering rolls out soon" note; the setup-only "Payments aren't enabled yet" toast; the
-- pricing FAQ's "downgrade at any time" and "next monthly cycle" claims, the Beta Tester plan it mentions, and the
-- "estimate excludes taxes" footnote, none of which the checkout code backs. Also held back by the lead: the free trial
-- (it records no apps, so nothing unlocks, and it can overwrite an organization's paid plan), the grace banner's data
-- deletion warning (no code deletes anything) and buying extra Active projects (the limit stays at the plan's allowance).
-- Written from a survey of C:\Pro\geiger-dash (app/pricing/page.js, app/pricing/actions.js, app/pricing/trial-actions.js,
-- app/pricing/success/page.js, components/pricing/plan_cards.jsx, lib/pricing/plans.js, lib/billing/*,
-- app/api/stripe/webhook/route.js, app/billing/page.js, components/billing/*, app/layout.js, app/org/[ORGID]/usage/*,
-- app/org/organizations-client.jsx, app/profile/[USERID]/profile-client.jsx, components/user-profile-dropdown.jsx,
-- supabase/migrations/20260629212507_org_abilities_rls.sql).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Billing & usage',
    description = 'Buy or upgrade a plan for your organization, and read your billing page, payment history and an organization''s usage.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'workspace/billing' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'workspace/billing' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, showcase, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.showcase, v.sort_order
from (
  values
    (
      'buying-a-plan',
      'Basics',
      'Buying a plan',
      $html$<p>To buy a plan, go to the <a href="/pricing">pricing page</a>, build the plan in the calculator, pick the organization it's for and pay through Stripe. You need to be signed in: choosing <strong>Pay for</strong> while signed out opens the sign-in page, then brings you back.</p><ol><li>At the top of the plan cards, set the switch to <strong>Monthly</strong> or <strong>Yearly</strong>. Yearly pays for a year at once (see <a href="/help/plans-pricing#monthly-or-yearly">Plans and pricing</a>).</li><li>On the plan you want, choose <strong>Configure this plan</strong>. The calculator opens with it selected under <strong>Choose a foundation</strong>.</li><li>Under <strong>Choose products for your projects</strong>, click each app and add-on you want.</li><li>Optional: under <strong>Set your scale</strong>, raise <strong>Collaborators</strong> and drag the sliders for storage, bandwidth, edge serving, AI credits and monthly emails.</li><li>In <strong>Apply to organization</strong>, pick the organization the plan is for.</li><li>Choose <strong>Pay for</strong> and the plan's name, such as <strong>Pay for Plus</strong>. Stripe's checkout page opens with your email filled in.</li><li>Pay on Stripe. Stripe returns you to Dash's payment confirmation page.</li></ol><p>The total at the top of the calculator's summary, <strong>Estimated monthly cost</strong> (or <strong>Estimated yearly cost</strong>), is what you pay, in US dollars, as one payment. It covers one month or one year, and Dash never charges you again on its own: to keep the plan after it ends, buy it again. If the organization already has a plan, checkout charges only the upgrade (see <a href="/help/workspace/billing#upgrading">Upgrading a plan</a>). What each plan includes, and every rate, is on <a href="/help/plans-pricing#plans">Plans and pricing</a>.</p><p>Any member of an organization can buy a plan for it. If you aren't in one yet, the summary says <strong>You'll need an organization to apply this plan to</strong>, and <strong>Create one</strong> opens your organizations.</p>$html$,
      '[]',
      null,
      10
    ),
    (
      'plan-and-organization',
      'Concepts',
      'Your plan and your organization''s plan',
      $html$<p>A plan you buy goes on the organization you pick at checkout, and it also becomes your own plan. Dash keeps the two apart, and each screen shows one of them.</p><ul><li><strong>The organization's plan</strong> sets which apps its projects can use, which add-ons it has and how many projects it can have, for every member. The organization's <a href="/help/workspace/billing#usage-page">Usage page</a> and the calculator on the pricing page show it.</li><li><strong>Your own plan</strong> is the one from your latest purchase or trial, whichever organization it was for. Your billing page, the <strong>Billing</strong> tab of your <a href="/help/workspace/profile">profile</a> and the plan banner at the bottom of Dash's pages show it, and they list only payments you made.</li></ul><p>So a member who didn't pay sees <strong>No plan yet</strong> on their billing page even when their organization has a plan. If you buy plans for two organizations, your billing page shows the one you bought last. Any member of an organization can buy, upgrade or renew its plan.</p>$html$,
      '[]',
      null,
      30
    ),
    (
      'payment-confirmation',
      'Checkout',
      'Payment confirmation',
      $html$<p>After you pay, Stripe returns you to Dash's payment confirmation page. <strong>Payment successful</strong> means Stripe has confirmed the payment, and the plan is now on the organization you picked and on your billing page. The page lists the <strong>Plan</strong>, the <strong>Amount</strong> charged and <strong>Receipt to</strong>, the email address on the payment.</p><p>If it says <strong>Thanks for your order</strong> instead, Stripe hasn't confirmed the payment yet. Reload the page: Dash checks with Stripe each time it loads, and applies the plan once the payment is confirmed.</p><p><strong>Go to your workspace</strong> opens your organizations, and <strong>Back to pricing</strong> returns to the pricing page. If you go back from Stripe's checkout page without paying, you land on the pricing page and nothing is charged.</p>$html$,
      '[]',
      null,
      40
    ),
    (
      'upgrading',
      'Checkout',
      'Upgrading a plan',
      $html$<p>To upgrade an organization's plan, go to the <a href="/pricing">pricing page</a> and pick the organization in <strong>Apply to organization</strong>. When it has a plan, the calculator opens on that plan:</p><ul><li>Its plan card shows <strong>Current plan</strong> and <strong>Manage this plan</strong>. Higher plans offer <strong>Upgrade to</strong> and their name. Lower plans read <strong>Not available as a downgrade</strong> and can't be picked.</li><li>Apps and add-ons the organization already has are locked on and show a lock icon.</li><li><strong>Active projects</strong>, <strong>Collaborators</strong> and the sliders can't go below what the organization has.</li></ul><p>Add what you need, then check <strong>Due today (upgrade)</strong> in the summary. It's the difference between the new monthly total and what the current plan costs a month, or 10 times that with <strong>Yearly</strong> on. Choose <strong>Upgrade to</strong> and the plan's name, then pay on Stripe. The button keeps the current plan's name when you only add apps or capacity. The organization moves to the new plan once Stripe confirms the payment. If the organization is on the free trial, the new plan costs its full price.</p><p>While the selection matches what the organization has, the button reads <strong>No changes to purchase</strong> and can't be chosen. You can't downgrade, remove an app or add-on, or lower the scale: checkout refuses with <strong>Downgrading a plan or removing owned products isn't allowed</strong>.</p>$html$,
      '[]',
      null,
      50
    ),
    (
      'billing-page',
      'Billing',
      'The billing page',
      $html$<p>To open your billing page, choose your avatar at the top right of a Dash page, then <strong>Billing</strong>. It shows your own plan, the apps and add-ons on it and your payments. <strong>Change plan</strong>, or <strong>Choose a plan</strong> before you have one, opens the pricing page.</p><p>The plan panel shows:</p><ul><li>The plan's name and state: <strong>Trial plan</strong>, <strong>Active plan</strong>, <strong>Ended plan</strong> or <strong>Expired plan</strong>.</li><li>The first three apps and add-ons it includes, and how many more.</li><li>Its full price for a month or a year, not what you last paid. When more than one part costs something, a line splits it into the plan, its apps and usage.</li><li>While the plan runs, a bar with the days left and the end date, labeled <strong>trial ends</strong> or <strong>renews on</strong>. Nothing renews automatically: Dash doesn't charge you on that date, and the plan ends unless you buy it again. <strong>Member since</strong> is the date of your latest purchase or trial.</li></ul><p>Once the plan has ended, the panel says when, counts its apps and add-ons as locked until you renew, and offers <strong>Renew plan</strong> (see <a href="/help/workspace/billing#when-a-plan-ends">When a plan ends</a>). Without a plan, it says <strong>No plan yet</strong> and offers <strong>View plans</strong>.</p><p><strong>Products</strong> lists everything on the plan, grouped as Core, Add-ons, Cherry, Security, Domains and Email. Click an app to open it, or choose <strong>Add products</strong> to open the pricing page. Your profile's <strong>Billing</strong> tab shows a shorter summary (see <a href="/help/workspace/profile">Profile</a>).</p>$html$,
      '[]',
      null,
      60
    ),
    (
      'payment-history',
      'Billing',
      'Payment history',
      $html$<p><strong>Payment history</strong> on your billing page lists every checkout you've started, newest first. Its heading counts your paid checkouts and the total you've paid. Each row shows:</p><ul><li><strong>Date</strong>: when you started the checkout.</li><li><strong>Description</strong>: the plan, monthly or yearly, and the apps and add-ons it covered.</li><li><strong>Amount</strong>: what that checkout charged, in US dollars. An upgrade shows only the difference you paid.</li><li><strong>Status</strong>: <strong>Paid</strong> once Stripe confirms the payment, and <strong>Pending</strong> until then. A checkout you left without paying stays <strong>Pending</strong>, and nothing was charged for it.</li></ul><p>The list holds only payments you made yourself, for any organization, and doesn't say which organization each was for. Before your first checkout it reads <strong>No payments yet</strong>. Dash has no invoice download.</p>$html$,
      '[]',
      null,
      70
    ),
    (
      'when-a-plan-ends',
      'Billing',
      'When a plan ends',
      $html$<p>A plan ends on its end date. That's 15 days after a trial starts, 30 days after a monthly payment or 365 days after a yearly one (see <a href="/help/plans-pricing#plan-period-and-expiry">Plans and pricing</a>). Dash doesn't charge you automatically and doesn't email a reminder. Here's what you see:</p><ul><li>During a trial, a banner at the bottom of Dash's pages says <strong>Your Basic trial ends in</strong> and the days left, with <strong>Upgrade</strong>, which opens the pricing page. A paid plan gets no banner before it ends: its end date is on your billing page.</li><li>For 30 days after the end date, the banner says your plan ended, counts down the days and offers <strong>Renew</strong>. Your billing page shows <strong>Ended plan</strong> and the date it ended, with <strong>Renew plan</strong>, and your profile shows the same warning.</li><li>After those 30 days, your billing page shows <strong>Expired plan</strong> with <strong>Renew plan</strong>, and the banner no longer appears.</li></ul><p>The banner and your billing page follow your own plan, the one from your latest purchase or trial. When it ends, the organization loses the plan too: its apps lock (see <a href="/help/workspace/projects#locked-apps-and-limits">Projects</a>), and its Usage page shows <strong>No Allowance Purchased Yet</strong>.</p><p>To renew, buy a plan for the organization again once it has ended (see <a href="/help/workspace/billing#buying-a-plan">Buying a plan</a>). You pay the full price, and the plan runs for a new month or year. Before the end date, the same plan and apps count as no change, so the checkout button reads <strong>No changes to purchase</strong>.</p>$html$,
      '[]',
      null,
      80
    ),
    (
      'usage-page',
      'Usage',
      'The Usage page',
      $html$<p>An organization's Usage page shows its plan, the allowance it bought and everything it can add. To open it, go to your <a href="/org">organizations</a> and choose <strong>Usage</strong> in the organization card's <strong>⋯</strong> menu. Only the organization's owner has that menu item, but any member can open the page from the gauge button beside the organization on their profile's <strong>Organizations</strong> tab.</p><p>The header names the organization and its plan, such as <strong>Plus plan</strong> or <strong>Basic trial</strong>. <strong>Add Capacity</strong> opens the pricing page, where you add to the plan (see <a href="/help/workspace/billing#upgrading">Upgrading a plan</a>).</p><ul><li><strong>Allowance</strong>: a tile each for <strong>Active Projects</strong>, <strong>Collaborators</strong>, <strong>Storage</strong>, <strong>Bandwidth</strong>, <strong>Edge / CDN</strong>, <strong>AI Credits</strong> and <strong>Email Purse</strong>. Each gives the amount set at checkout: what the plan includes plus any extra bought. Only <strong>Active Projects</strong> counts what's in use: the organization's projects, with a percentage and a bar. <strong>Email Purse</strong> is the organization's shared monthly emails (see <a href="/help/workspace/add-ons#monthly-emails">Add-ons</a>).</li><li><strong>Products</strong>: every app and add-on you can buy, with its monthly rate. Those the organization has are marked <strong>Owned</strong>.</li><li><strong>Scale & Capacity</strong>: the extra capacity you can buy, with its rate (see <a href="/help/plans-pricing#usage-charges">Plans and pricing</a>).</li></ul><p>When the organization has no plan, or its plan has ended, <strong>Allowance</strong> is replaced by <strong>No Allowance Purchased Yet</strong> and the button reads <strong>Choose a Plan</strong>.</p>$html$,
      '[]',
      null,
      90
    ),
    (
      'checkout-didnt-start',
      'Troubleshooting',
      'Checkout didn''t start',
      $html$<p>When choosing <strong>Pay for</strong> or <strong>Upgrade to</strong> on the pricing page doesn't open Stripe, Dash shows a message with the reason:</p><ul><li><strong>Create an organization first to purchase a plan</strong>: you aren't in an organization yet. Dash opens your organizations so you can create one (see <a href="/help/workspace/organizations#creating-an-organization">Organizations</a>).</li><li><strong>Select an organization for this plan</strong>: pick one in <strong>Apply to organization</strong>.</li><li><strong>You don't have access to that organization</strong>: you're no longer a member of it, or it was deleted. Reload the pricing page and pick another.</li><li><strong>Downgrading a plan or removing owned products isn't allowed</strong>: the selection is below what the organization has, which happens when its plan changed after you opened the page. Reload the pricing page to start from the current plan.</li><li><strong>There's nothing new to purchase for this configuration</strong>: the selection matches the organization's plan. Add something, or wait until the plan ends to renew it.</li><li><strong>That total is below the minimum charge amount</strong>: the upgrade comes to less than $0.50. Add more to it.</li><li><strong>Couldn't start checkout</strong>: Dash couldn't open Stripe's checkout. Try again, and if it keeps happening, <a href="/contact">contact support</a>.</li></ul>$html$,
      '[]',
      null,
      100
    ),
    (
      'payment-still-pending',
      'Troubleshooting',
      'Payment still shows as Pending',
      $html$<p>A checkout shows as <strong>Pending</strong> in <strong>Payment history</strong> on your billing page until Stripe confirms its payment.</p><ul><li>If you left Stripe's checkout page without paying, nothing was charged and the row stays <strong>Pending</strong>. Start a new checkout from the pricing page when you're ready.</li><li>If you paid and the payment confirmation page said <strong>Thanks for your order</strong>, reload that page. Dash checks with Stripe each time it loads, then marks the payment <strong>Paid</strong> and applies the plan once Stripe confirms it.</li><li>If you paid and the row still reads <strong>Pending</strong> later, <a href="/contact">contact support</a> with the date and amount.</li></ul>$html$,
      '[]',
      null,
      110
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"BadgeDollarSign","label":"Plans & pricing","href":"/help/plans-pricing"},{"icon":"PackagePlus","label":"Add-ons","href":"/help/workspace/add-ons"},{"icon":"FolderKanban","label":"Projects","href":"/help/workspace/projects"},{"icon":"Building2","label":"Organizations","href":"/help/workspace/organizations"},{"icon":"CircleUser","label":"Profile","href":"/help/workspace/profile"},{"icon":"Users","label":"Members & roles","href":"/help/workspace/members"}]',
      null,
      120
    )
) as v(anchor_id, eyebrow, title, content, links, showcase, sort_order)
cross join (select id from public.docs_pages where slug = 'workspace/billing' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Billing & usage',
    description = 'Manage your plan, payments and usage.',
    status = 'draft',
    published_at = null
where slug = 'workspace/billing' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'workspace/billing' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Your current plan</li><li>Checkout and payments</li><li>The usage page</li><li>Changing plans</li></ul>',
  10
from public.docs_pages p
where p.slug = 'workspace/billing' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
