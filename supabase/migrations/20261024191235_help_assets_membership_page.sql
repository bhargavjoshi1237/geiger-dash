-- Help assets membership page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the assets/membership draft outline
-- (20261024191200_help_assets_structure) with the full Membership guide and publishes it. No section showcases exist
-- for Assets yet. Left out on purpose: Access Control (its gallery, collection and folder rules aren't checked by
-- any page), and a tier's Downloads / cycle and Grace period (saved, but nothing applies them).
-- Written from a survey of C:\Pro\geiger-assets (components/internal/screens/projects/creator/* (creator_page_screen,
-- page_builder/*, tiers_screen, members_screen, member_detail, subscriptions_screen, subscription_dialog,
-- recurring_billing_screen, promos_screen, access_control_screen, constants), creator/public/*, app/c/[handle]/**,
-- app/fan/**, app/api/fans/**, app/api/creator/**, lib/creator/* (server, fan_auth, page_config, engagement),
-- lib/supabase/creator.js, lib/commerce/stripe.js).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Membership',
    description = 'Run a membership from a public creator page: design the page, set up tiers and promo codes, and manage members, subscriptions and renewals.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'assets/membership' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'assets/membership' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, showcase, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.showcase, v.sort_order
from (
  values
    (
      'setting-up-your-creator-page',
      'Basics',
      'Setting up your creator page',
      $html$<p>A creator page is a public page where fans follow you, join a membership tier, read your posts, tip and message you. To start one, open a project in Assets, choose <strong>Membership → Creator Page</strong> in the sidebar, then <strong>Create creator page</strong>. Assets creates it with a handle from the project's name, ready to edit and not live yet.</p><p>The builder has four tabs on the left: <strong>Sections</strong>, <strong>Design</strong>, <strong>Profile</strong> and <strong>Settings</strong>. The preview on the right shows the page as you edit; under <strong>View as</strong>, see it as a Visitor, a Follower, a Former member or a member of any tier, on Desktop or Phone.</p><ul><li><strong>Save draft</strong> keeps your work without changing what fans see.</li><li><strong>Publish</strong> makes the page live; after that, <strong>Publish changes</strong> updates it. Fans keep seeing the last published version until you do.</li></ul><p>The status beside the buttons reads Unsaved changes, Not live, Draft not published or Live. Once it's live, the button at the top opens your page, at an address ending in <code>/c/</code> and your handle.</p>$html$,
      '[]',
      null,
      10
    ),
    (
      'members-and-tiers',
      'Concepts',
      'Members, followers and tiers',
      $html$<p>On the Membership screens, <strong>members</strong> are the people who join your creator page, not the people on your project team. Fans sign up on the page with their email and a password; they don't need a Geiger account.</p><ul><li>A <strong>follower</strong> follows the page for free.</li><li>A <strong>tier</strong> is a membership plan: free or paid, billed monthly, annually or once, with perks and an optional trial.</li><li>A <strong>subscription</strong> attaches a member to a tier, with its own status: Trialing, Active, Past due, Cancelled or Expired.</li></ul><p>Each post decides who sees it: everyone (Public), All members, members on a Minimum tier or higher, or fans who pay to unlock it (Pay-per-view). Everyone else sees its teaser. Posts are covered in <a href="/help/assets/membership/posts">Posts, messages and tips</a>.</p>$html$,
      '[]',
      null,
      20
    ),
    (
      'page-sections',
      'Creator Page',
      'Page sections',
      $html$<p>The <strong>Sections</strong> tab of the creator page builder lists the blocks on your page's Home tab, top to bottom. Add one from <strong>Add to your Home tab</strong>, drag sections to reorder them, and click one to edit its options, such as its layout, heading and animation.</p><ul><li><strong>Hero</strong>: a headline, pitch, image or video and a call to action.</li><li><strong>Featured posts</strong>: pinned, hand-picked or most-liked posts.</li><li><strong>Membership tiers</strong>: your tiers side by side, with a monthly or annual switch.</li><li><strong>Post feed</strong> and <strong>Media grid</strong>: your posts as a list or grid, and the photos and videos from them. Locked media stays blurred.</li><li><strong>Bundles</strong>: post bundles for sale.</li><li><strong>Text</strong>, <strong>Links</strong> and <strong>FAQ</strong>: words, link buttons, and questions and answers.</li><li><strong>Countdown</strong>: a timer to your next drop or launch.</li><li><strong>Follow</strong> and <strong>Tip jar</strong>: a free follow, and one-tap tips.</li><li><strong>Embed</strong>: a YouTube, Vimeo, Spotify or SoundCloud player.</li></ul>$html$,
      '[]',
      null,
      30
    ),
    (
      'profile-design-settings',
      'Creator Page',
      'Profile, design and settings',
      $html$<p>The other three tabs of the creator page builder cover everything around the sections.</p><ul><li><strong>Profile</strong>: your <strong>Display name</strong>, <strong>Handle</strong> (3 to 32 lowercase letters, numbers, <code>-</code> or <code>_</code>, and not taken), <strong>Tagline</strong> and <strong>About</strong>; an <strong>Avatar</strong> and a <strong>Banner</strong> picked from the project's library; and your <strong>Links</strong>.</li><li><strong>Design</strong>: the theme's colors, typography, shape and layout, the header, the tab navigation, the join button and mobile join bar, and motion and effects.</li><li><strong>Settings</strong>: whether the page is live; <strong>Accept tips</strong>, with a <strong>Minimum tip</strong> and up to four <strong>Suggested tips</strong>; the <strong>Empty inbox message</strong> members see before you've written to them; <strong>Promo links</strong> for your promo codes; the <strong>Page title</strong> and <strong>Description</strong> for search and sharing; and the footer, including <strong>Show "Powered by Geiger"</strong>.</li></ul><p>Changing your handle changes your page's address, so links to the old one stop working.</p>$html$,
      '[]',
      null,
      40
    ),
    (
      'how-fans-join-and-pay',
      'Concepts',
      'How fans join and pay',
      $html$<p>On your creator page, a fan creates an account with their email and a password, then follows you, joins a tier, tips, or unlocks a post, bundle or message. Paid actions go through checkout: Stripe once it's set up for Assets, or a built-in test checkout that charges nothing until then.</p><p>A paid or free signup becomes a member with a subscription, and a tier with a trial starts in Trialing. Tips and unlocks are recorded against the member, and their lifetime spend adds up.</p><p>Assets doesn't charge renewals by itself. When a subscription's period ends, <strong>Run renewals</strong> on Recurring Billing creates its renewal invoice, and paying that invoice moves the subscription on to its next period; see <a href="#recurring-billing">Recurring billing</a>.</p>$html$,
      '[]',
      null,
      50
    ),
    (
      'membership-tiers',
      'Membership Tiers',
      'Membership tiers',
      $html$<p>To add a tier, choose <strong>Membership → Membership Tiers</strong>, then <strong>New tier</strong>.</p><ul><li><strong>Tier name</strong>: required.</li><li><strong>Description</strong> and <strong>Perks</strong>: shown on the tier card fans see at signup.</li><li><strong>Price (USD)</strong>: 0 for a free tier.</li><li><strong>Billing interval</strong>: Monthly, Annual or One-time, with an optional <strong>Annual price (USD)</strong>.</li><li><strong>Trial days</strong>: free days before the first charge.</li><li><strong>Open for signups</strong>: whether new fans can join.</li></ul><p>The figures across the top count <strong>Tiers</strong>, <strong>Paid tiers</strong>, <strong>Members on tiers</strong> and <strong>Tier MRR</strong>, the monthly value of paid tiers. Use <strong>Move up</strong> and <strong>Move down</strong> to set the order fans see. <strong>Archive</strong> takes a tier off signup but keeps its members; <strong>Reopen for signups</strong> brings it back. A tier with members can't be deleted, only archived.</p>$html$,
      '[]',
      null,
      60
    ),
    (
      'members',
      'Members',
      'Members',
      $html$<p><strong>Membership → Members</strong> lists every subscriber and free follower, with their tier, status, lifetime spend and when they were last seen. The figures across the top count <strong>Members</strong>, those <strong>Paying</strong>, those <strong>At risk</strong> and their total <strong>Lifetime value</strong>. Filter by status and tier, or search.</p><p>A member's status is Active, Trialing, Past due, Cancelled or Blocked. Each row's <strong>⋯</strong> menu has <strong>Suspend</strong> or <strong>Reactivate</strong>, and <strong>Delete</strong>, which removes the member straight away, without asking. A suspended member sees only your public posts and can't join, buy, comment or message until you reactivate them. A member with a live subscription can't be deleted, only suspended.</p><p>Fans who sign up are added automatically. To add one by hand, choose <strong>Add member</strong> and enter a display name or email.</p>$html$,
      '[]',
      null,
      70
    ),
    (
      'member-details',
      'Members',
      'Member details',
      $html$<p>Click a member to open their details.</p><ul><li><strong>Profile</strong>: their display name, email and status, with private <strong>Notes</strong> for your team. <strong>Password reset link</strong> copies a link you can send them; it works once, within 24 hours.</li><li><strong>Subscriptions</strong>: their tiers. Assign a tier to start their first period or trial, or set a subscription to cancel at the end of its period.</li><li><strong>Billing</strong>: their renewal invoices, tips and paid messages.</li><li><strong>Access</strong>: <strong>Suspend this member</strong>. Their subscriptions stay on file, so cancel those separately.</li></ul>$html$,
      '[]',
      null,
      80
    ),
    (
      'subscriptions',
      'Subscriptions',
      'Subscriptions',
      $html$<p><strong>Membership → Subscriptions</strong> lists every member's tier, with its status, when it started and when it renews. The figures across the top show <strong>Live subscriptions</strong>, <strong>MRR</strong>, how many are <strong>Past due</strong> and the <strong>Churn</strong>. Filter by status and tier, or search.</p><p>To attach a member to a tier by hand, add a subscription, pick the <strong>Member</strong> and <strong>Tier</strong>, and set <strong>Trial days</strong> (0 starts the first period today). A member can have only one live subscription on a tier.</p><p>Each row's <strong>⋯</strong> menu has <strong>Cancel at period end</strong>, <strong>Cancel now</strong>, <strong>Resume renewal</strong> for one set to cancel, <strong>Reactivate</strong> for a cancelled one, and <strong>Delete</strong>, which removes it straight away, without asking.</p>$html$,
      '[]',
      null,
      90
    ),
    (
      'recurring-billing',
      'Recurring Billing',
      'Recurring billing',
      $html$<p><strong>Membership → Recurring Billing</strong> keeps the renewal invoices for paid tiers. The figures across the top show <strong>MRR</strong>, the amount <strong>Collected (30d)</strong>, subscriptions <strong>Renewing in 7 days</strong> and those in <strong>Dunning</strong> after a failed payment.</p><ol><li>Choose <strong>Run renewals</strong>. The button counts the subscriptions whose period has ended, and Assets creates a renewal invoice for each, with any promo discount still running.</li><li>Collect the payment, then choose <strong>Mark paid</strong> on the invoice. The subscription becomes Active and moves on to its next period.</li></ol><p>If a payment fails, <strong>Mark payment failed</strong> sets the subscription to Past due and schedules a retry date. An invoice's menu also has <strong>Void</strong>, and <strong>Refund</strong> for a paid one; both only change the invoice's record. To bill outside a renewal, create a <strong>New invoice</strong> for a subscription; its amount defaults to the tier price. Paid and refunded invoices can't be deleted.</p>$html$,
      '[]',
      null,
      100
    ),
    (
      'promo-codes',
      'Promo Codes & Perks',
      'Promo codes and perks',
      $html$<p><strong>Membership → Promo Codes & Perks</strong> holds codes that bring fans in or win them back. To add one, create a <strong>New promo code</strong>.</p><ul><li><strong>Code</strong>: required and unique.</li><li><strong>Kind</strong>: <strong>Discount</strong> (a <strong>Percent off</strong> at checkout), <strong>Trial</strong> or <strong>Free month</strong>. Trial and free-month codes start without a card.</li><li><strong>Max redemptions</strong> and <strong>Expires</strong>: optional limits.</li></ul><p>The figures across the top count <strong>Promo codes</strong>, <strong>Redemptions</strong>, <strong>Trials</strong> and <strong>Free months</strong>. Share a code through the <strong>Promo links</strong> in the creator page's Settings tab.</p>$html$,
      '[]',
      null,
      110
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"SquarePen","label":"Posts, messages & tips","href":"/help/assets/membership/posts"},{"icon":"GalleryHorizontalEnd","label":"Galleries","href":"/help/assets/galleries"},{"icon":"ChartColumn","label":"Analytics","href":"/help/assets/analytics"}]',
      null,
      120
    )
) as v(anchor_id, eyebrow, title, content, links, showcase, sort_order)
cross join (select id from public.docs_pages where slug = 'assets/membership' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Membership',
    description = 'Run a membership business from a public creator page: tiers, members, subscriptions, billing and access.',
    status = 'draft',
    published_at = null
where slug = 'assets/membership' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'assets/membership' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Creator page</li><li>Membership tiers</li><li>Members</li><li>Subscriptions and recurring billing</li><li>Access control</li><li>Promo codes and perks</li></ul>',
  10
from public.docs_pages p
where p.slug = 'assets/membership' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
