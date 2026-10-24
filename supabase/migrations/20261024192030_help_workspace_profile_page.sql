-- Help workspace profile page
--
-- One-time content move, like 20261024142436_help_flow_structure (which creates pages) and
-- 20261024124814_help_flow_tasks_page (which fills one in): adds the Profile guide to the Workspace group, after
-- Sign-in & OAuth, and publishes it. It covers opening the profile, what other members see, the General tab (profile
-- fields, picture, theme), the Organizations and Billing tabs (in brief, linking to the pages that own them), the
-- Security tab's Account details and the Delete Account request. Email, password, passkeys and sessions are left to
-- workspace/sign-in. Left out on purpose: the Product Emails and Product Updates switches (saved to the account but
-- never read when mail is sent), the Organizations tab's Inactive badge (nothing in Dash makes an organization
-- inactive), the contact page's Send message form (it only logs the message), and the Billing tab's "Renews" wording
-- (plans are one-time payments that don't renew on their own).
-- Written from a survey of C:\Pro\geiger-dash (app/profile/page.js, app/profile/[USERID]/page.js,
-- app/profile/[USERID]/profile-client.jsx, app/profile/actions.js, components/user-profile-dropdown.jsx,
-- components/header.jsx, components/account/panel.jsx, lib/avatar-url.js, lib/org/membership.js,
-- lib/billing/plan_state.js, app/org/actions.js, app/org/organizations-client.jsx, app/contact/*,
-- app/layout.js, supabase/migrations/20260708201329_org_members.sql).
-- Later edits happen in Studio, so this must never re-run.

-- @up
-- Create the page only where it's missing (live slugs are unique among non-deleted pages).
insert into public.docs_pages (nav_group_id, slug, title, description, status, sort_order)
select g.id, 'workspace/profile', 'Profile', 'Change your display name, picture and details, pick a light or dark theme, check your organizations and plan, and ask to delete your account.', 'draft', 70
from public.docs_nav_groups g where g.slug = 'workspace'
on conflict (slug) where deleted_at is null do nothing;

-- Page fields. published_at keeps its first value.
update public.docs_pages
set title = 'Profile',
    description = 'Change your display name, picture and details, pick a light or dark theme, check your organizations and plan, and ask to delete your account.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'workspace/profile' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'workspace/profile' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, showcase, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.showcase, v.sort_order
from (
  values
    (
      'opening-your-profile',
      'Basics',
      'Opening your profile',
      $html$<p>To open your profile, choose your picture or initial at the top right of Dash, then <strong>Profile</strong>. Going to <a href="/profile">/profile</a> opens it too, and asks you to sign in first if you're signed out. Your profile has four tabs: <strong>General</strong>, <strong>Organizations</strong>, <strong>Billing</strong> and <strong>Security</strong>.</p><p>The card at the top of your profile shows your display name and your email (marked <strong>Verified</strong> or <strong>Unverified</strong>), plus any job title, company, location, About text and website you've added. Under them are four figures: <strong>Joined</strong>, <strong>Last Signed In</strong>, <strong>Organizations</strong> (how many you belong to) and <strong>Projects</strong> (across all of those organizations).</p><p><strong>Open Workspace</strong>, at the top right of your profile, opens the Organizations page. When an organization has invited you, a line above the tabs says so, and <strong>Review</strong> switches to the <strong>Organizations</strong> tab, where the invitation is waiting.</p>$html$,
      '[]',
      null,
      10
    ),
    (
      'what-other-members-see',
      'Concepts',
      'What other members see',
      $html$<p>Your profile is private: only you can open it, and a link to someone else's profile opens your own instead. Other members see your display name, email and picture in the member list of each organization you share. Invitation emails you send name you by your display name.</p><p>Your job title, company, location, website and About text appear only on your own profile in Dash.</p>$html$,
      '[]',
      null,
      20
    ),
    (
      'editing-your-profile',
      'General',
      'Editing your profile',
      $html$<p>To edit your profile, open the <strong>General</strong> tab, change the fields under <strong>Profile</strong>, and choose <strong>Save Changes</strong>. <strong>Save Changes</strong> stays disabled until something differs from what's saved. <strong>Discard</strong> puts every field back the way it was last saved.</p><ul><li><strong>Display Name</strong>: the name other members see, up to 80 characters. It's required: saving an empty one fails with <strong>Enter a display name.</strong> Until you save one, Dash uses the name from your Google or GitHub account if you signed up with one, or else the part of your email before the @.</li><li><strong>Job Title</strong>, <strong>Company</strong> and <strong>Location</strong>: optional, up to 80 characters each.</li><li><strong>Website</strong>: optional, up to 200 characters. It has to start with <code>http://</code> or <code>https://</code>, and it shows as a link on your profile.</li><li><strong>About</strong>: a short line about what you work on, up to 400 characters. The count under the label shows how many you've used.</li></ul><p>Dash cuts off anything past these limits when you save.</p>$html$,
      '[]',
      null,
      30
    ),
    (
      'profile-picture',
      'General',
      'Changing your profile picture',
      $html$<p>To change your profile picture, choose the picture (or your initials) in the card at the top of your profile, then <strong>Upload a Picture</strong> and pick an image file. The menu suggests a square JPG or PNG. Dash takes any image up to 2 MB and crops it to fill a square or round frame, so a square picture shows in full. A bigger file fails with <strong>Image must be under 2 MB.</strong></p><p>The new picture replaces the old one on your profile, in the menu at the top right of Dash and in the member list of each organization you belong to. Until you upload one, Dash shows the picture from your Google or GitHub account if you signed in with one, or else your initials.</p><p>To go back to your initials, choose the picture, then <strong>Remove Picture</strong>. It's removed straight away, without asking, and Dash doesn't bring back a Google or GitHub picture afterward.</p>$html$,
      '[]',
      null,
      40
    ),
    (
      'preferences',
      'General',
      'Choosing a light or dark theme',
      $html$<p>To switch between light and dark, open the <strong>General</strong> tab and find <strong>Theme</strong> under <strong>Preferences</strong>. Its button shows the theme you're using, <strong>Light</strong> or <strong>Dark</strong>: choose it to switch to the other. The sun and moon button at the top right of Dash does the same.</p><p>The theme changes straight away and is saved in this browser only, not on your account, so another browser or device keeps its own. Until you choose one, Dash follows your device's light or dark setting.</p>$html$,
      '[]',
      null,
      50
    ),
    (
      'your-organizations',
      'Organizations',
      'Your organizations',
      $html$<p>The <strong>Organizations</strong> tab of your profile lists every organization you belong to, newest first, with the count beside the tab's name. Each row shows the organization's name, how many members it has and when it was created. Its badge says <strong>Owner</strong> or <strong>Creator</strong> (with a crown) when you own or created the organization, and <strong>Member</strong> otherwise. The badge doesn't show your <a href="/help/workspace/members#roles">role</a> inside the organization.</p><ul><li><strong>Open</strong> opens the organization's projects.</li><li>The gauge icon opens its <a href="/help/workspace/billing#usage-page">usage page</a>.</li><li>The copy icon copies its Organization ID, which other people use to <a href="/help/workspace/organizations#joining-an-organization">join the organization</a>.</li></ul><p><strong>New Organization</strong> opens the Organizations page, where you <a href="/help/workspace/organizations#creating-an-organization">create an organization</a>. Until you belong to one, the tab shows <strong>Go to Organizations</strong> instead of a list.</p><p>When an organization has invited you, <strong>Pending Invitations</strong> sits at the top of the tab, with the role you're invited as and <strong>Accept</strong>. See <a href="/help/workspace/members#accepting-an-invite">accepting an invite</a>.</p>$html$,
      '[]',
      null,
      60
    ),
    (
      'your-plan',
      'Billing',
      'Your plan and payments',
      $html$<p>The <strong>Billing</strong> tab of your profile summarizes your plan: its name and status (<strong>Trial</strong>, <strong>Active</strong>, <strong>Ended</strong> or <strong>Expired</strong>), when the current period or trial ends, its price, your total spent and number of payments, and the apps it includes under <strong>Product Access</strong>. <strong>Recent Payments</strong> lists your four latest payments with their status. <strong>Manage Billing</strong> opens the <a href="/help/workspace/billing#billing-page">billing page</a>. Without a plan, the tab shows <strong>View Plans</strong>, which opens <a href="/pricing">pricing</a>.</p><p>Once your plan ends, a warning with <strong>Renew Plan</strong> appears above the tabs. See <a href="/help/workspace/billing#when-a-plan-ends">when a plan ends</a>.</p>$html$,
      '[]',
      null,
      70
    ),
    (
      'security-and-account-details',
      'Security',
      'Security and account details',
      $html$<p>The <strong>Security</strong> tab of your profile holds your sign-in settings: <strong>Email Address</strong>, <strong>Password</strong>, <strong>Passkeys</strong> and <strong>Sessions</strong>, which has <strong>Sign Out Everywhere</strong>. To use them, see <a href="/help/workspace/sign-in#password-and-email">changing your password and email</a>, <a href="/help/workspace/sign-in#passkeys">passkeys</a> and <a href="/help/workspace/sign-in#signing-out">signing out</a>.</p><p><strong>Account</strong>, on the same tab, shows details you can't edit:</p><ul><li><strong>Sign-in Method</strong>: each way your account signs in, such as Email & password, Google or GitHub.</li><li><strong>Account Created</strong>: the date you signed up.</li><li><strong>Last Sign-in</strong>: how long ago you last signed in.</li><li><strong>User ID</strong>: your account's ID. The copy icon beside it copies the ID.</li></ul>$html$,
      '[]',
      null,
      80
    ),
    (
      'deleting-your-account',
      'Security',
      'Deleting your account',
      $html$<p>You can't delete your account yourself: Dash handles deletion by request. To ask for it, open the <strong>Security</strong> tab of your profile and choose <strong>Request Deletion</strong> under <strong>Delete Account</strong>. It opens the <a href="/contact">contact page</a>, where <strong>Contact support</strong> starts an email to <a href="mailto:support@geiger.studio">support@geiger.studio</a>.</p>$html$,
      '[]',
      null,
      90
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"KeyRound","label":"Sign-in & OAuth","href":"/help/workspace/sign-in"},{"icon":"Building2","label":"Organizations","href":"/help/workspace/organizations"},{"icon":"CreditCard","label":"Billing & usage","href":"/help/workspace/billing"}]',
      null,
      100
    )
) as v(anchor_id, eyebrow, title, content, links, showcase, sort_order)
cross join (select id from public.docs_pages where slug = 'workspace/profile' and deleted_at is null) p;

-- @down
-- The page goes with its sections (on delete cascade).
delete from public.docs_pages where slug = 'workspace/profile';
