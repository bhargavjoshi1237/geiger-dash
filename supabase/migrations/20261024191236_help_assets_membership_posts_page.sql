-- Help assets membership posts page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the assets/membership/posts draft
-- outline (20261024191200_help_assets_structure) with the full Posts, messages & tips guide and publishes it. No
-- section showcases exist for Assets yet. Payouts is left out: it only records amounts you type, adds a fixed fee
-- to them, and moves no money.
-- Written from a survey of C:\Pro\geiger-assets (components/internal/screens/projects/creator/posts_screen.jsx,
-- post_comments_dialog.jsx, media_picker_dialog.jsx, inbox_screen.jsx, bundles_screen.jsx, messages_screen.jsx,
-- tips_screen.jsx, payouts_screen.jsx, creator/public/* (post_card, fan_inbox, tip_dialog), lib/creator/server.js,
-- lib/creator/engagement.js, lib/supabase/creator.js).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Posts, messages & tips',
    description = 'Publish posts for your members, sell pay-per-view posts and bundles, message members one to one or all at once, and track tips.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'assets/membership/posts' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'assets/membership/posts' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, showcase, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.showcase, v.sort_order
from (
  values
    (
      'creating-a-post',
      'Basics',
      'Creating a post',
      $html$<p>Posts make up the feed on your creator page. To write one, open a project in Assets, choose <strong>Membership → Posts</strong> in the sidebar, then <strong>New post</strong>.</p><ul><li><strong>Title</strong>, <strong>Teaser</strong> and <strong>Body</strong>: the teaser shows to everyone; the body and media show only to fans who can see the post.</li><li><strong>Media</strong>: images, video, audio or files from the project's library. Several show as a carousel, and the first is the cover.</li><li><strong>Who can see it</strong>: Public, All members (the default), Minimum tier, or Pay-per-view.</li><li><strong>Minimum tier</strong>: for a tier post, the lowest tier that sees it.</li><li><strong>Unlock price (USD)</strong>: for a pay-per-view post, the price to unlock it. It's required, and starts at 5.00.</li><li><strong>Status</strong>: Draft (the default), Published or Archived.</li><li><strong>Pin to top</strong>: pinned posts lead the feed.</li></ul><p>Choose <strong>Create post</strong>. Members are the people who join your creator page; see <a href="/help/assets/membership#members-and-tiers">Membership</a>.</p>$html$,
      '[]',
      null,
      10
    ),
    (
      'post-list',
      'Posts',
      'Managing posts',
      $html$<p>The post list on <strong>Posts</strong> shows each post's access, status, engagement, unlocks and publish date. The figures across the top count <strong>Posts</strong>, <strong>Members-only</strong> posts (with how many are public), <strong>PPV unlocks</strong> and <strong>PPV revenue</strong>.</p><p>Each row's <strong>⋯</strong> menu has these actions:</p><ul><li><strong>Edit</strong>: change anything about the post.</li><li><strong>Comments</strong>: read the post's comments, reply as the creator, or delete a comment. Fans who can see a post can comment on it.</li><li><strong>Publish</strong> or <strong>Archive</strong>, and <strong>Pin to top</strong> or <strong>Unpin</strong>.</li><li><strong>Delete</strong>: removes the post straight away, without asking.</li></ul><p>Fans who can't see a post get its teaser, with the body and media locked. A suspended member sees only public posts.</p>$html$,
      '[]',
      null,
      20
    ),
    (
      'inbox',
      'Inbox',
      'Messaging members',
      $html$<p><strong>Membership → Inbox</strong> is your one-to-one chat with members. The figures across the top count <strong>Conversations</strong>, <strong>Unread</strong> ones, <strong>Locked DMs</strong> and <strong>DM revenue</strong>.</p><ol><li>To start a conversation, choose <strong>New message</strong>, pick the <strong>Member</strong> and choose <strong>Open conversation</strong>. Or click an existing conversation.</li><li>Write your message.</li><li>Optional: attach a file from the library and set an <strong>Unlock price</strong>, so the member pays to see it.</li><li>Choose <strong>Send</strong>.</li></ol><p>Members read and reply from the inbox on your creator page, and their replies land here. A locked message stays locked for them until they pay.</p>$html$,
      '[]',
      null,
      30
    ),
    (
      'paid-messages',
      'Paid Messages',
      'Paid messages',
      $html$<p><strong>Membership → Paid Messages</strong> sends a locked message to one member or to everyone at once. Choose <strong>New message</strong>.</p><ul><li><strong>Audience</strong>: all members, with the <strong>Mass DM</strong> option, or one member.</li><li><strong>Message</strong>: required.</li><li><strong>Unlock price (USD)</strong>: what members pay to unlock it, or 0 for a free message.</li></ul><p>Choose <strong>Send PPV message</strong>. It appears in the recipients' inbox on your creator page. A mass message reaches the members who had joined when you sent it.</p><p>The list shows each message's audience, lock price, status (Draft, Locked, Unlocked or Expired) and when it was sent. The figures across the top count <strong>Paid messages</strong>, <strong>Mass drops</strong>, how many were <strong>Unlocked</strong>, and their <strong>Locked value</strong>.</p>$html$,
      '[]',
      null,
      40
    ),
    (
      'bundles',
      'Bundles',
      'Bundles',
      $html$<p>A bundle sells several pay-per-view posts together at one price. To create one, choose <strong>Membership → Bundles</strong>, then <strong>New bundle</strong>.</p><ul><li><strong>Title</strong>, and a <strong>Description</strong> shown on the bundle card to everyone.</li><li><strong>Cover</strong>: an image from the project's library.</li><li><strong>Bundle price (USD)</strong>.</li><li>The posts it includes. Only pay-per-view posts count toward the unlock; others can be included for context.</li><li><strong>On sale</strong>: whether fans can buy it now.</li></ul><p>Choose <strong>Create bundle</strong>. Buying a bundle unlocks every pay-per-view post in it. <strong>Pause sales</strong> takes a bundle off your page, and buyers keep what they unlocked; <strong>Put on sale</strong> brings it back. The figures across the top count <strong>Bundles</strong>, <strong>Sales</strong>, <strong>Revenue</strong> and the <strong>Avg discount</strong> against buying the posts one by one.</p>$html$,
      '[]',
      null,
      50
    ),
    (
      'tips',
      'Tips',
      'Tips',
      $html$<p><strong>Membership → Tips</strong> lists every tip fans have sent, with the tipper, the amount, what they tipped, such as a post, a message or your profile, its status and the date. It's a read-only record. The figures across the top include <strong>Tip revenue</strong> and the <strong>Avg tip</strong>; filter by what was tipped.</p><p>A tip's status is Pending, Succeeded or Refunded. Fans tip from your creator page, where you set whether tips are on, the minimum and up to four suggested amounts, in the creator page's Settings tab. See <a href="/help/assets/membership#profile-design-settings">Membership</a>.</p>$html$,
      '[]',
      null,
      60
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"CreditCard","label":"Membership","href":"/help/assets/membership"},{"icon":"Store","label":"Store & orders","href":"/help/assets/galleries/store"},{"icon":"ChartColumn","label":"Analytics","href":"/help/assets/analytics"}]',
      null,
      70
    )
) as v(anchor_id, eyebrow, title, content, links, showcase, sort_order)
cross join (select id from public.docs_pages where slug = 'assets/membership/posts' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Posts, messages & tips',
    description = 'Publish posts, message members, sell bundles and paid messages, and track tips and payouts.',
    status = 'draft',
    published_at = null
where slug = 'assets/membership/posts' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'assets/membership/posts' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Posts</li><li>Inbox</li><li>Bundles</li><li>Paid messages</li><li>Tips</li><li>Payouts</li></ul>',
  10
from public.docs_pages p
where p.slug = 'assets/membership/posts' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
