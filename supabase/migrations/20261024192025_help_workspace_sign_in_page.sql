-- Help workspace sign-in page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the workspace/sign-in draft outline
-- (created by 20261023112957_help_center_structure) with the full Sign-in & OAuth guide and publishes it. It covers
-- signing up, signing in, passkeys, changing email and password, signing out, and organization SSO (the OAuth tab of
-- Organization Settings) with its troubleshooting.
-- Left out on purpose: the sign-in page's Continue with Apple button (no handler), the unused LogoutButton dialog, the
-- OAuth tab's "None" email-domains state (saving requires a domain), and the sign-up page's Continue with SSO (its form
-- is nested inside the sign-up form, so members are pointed at the sign-in page's SSO instead). There is no forgot or
-- reset password flow in the code, so the page doesn't cover one.
-- Written from a survey of C:\Pro\geiger-dash (app/login/page.js, app/login/auth-form.jsx, app/login/actions.js,
-- app/signup/*, app/auth/callback/route.js, app/onboarding/page.js, components/auth/*, lib/auth/passkeys.js,
-- app/api/oauth/discover/route.js, app/api/oauth/[orgId]/start/route.js, app/api/oauth/[orgId]/callback/route.js,
-- lib/oauth/*, app/org/oauth-actions.js, app/org/organizations-client.jsx (OAuthTab, OrganizationCard),
-- app/profile/[USERID]/profile-client.jsx, app/profile/actions.js, components/user-profile-dropdown.jsx,
-- components/sign-out-menu-item.jsx, lib/product-routes.mjs, lib/billing/entitlements.js, proxy.js,
-- utils/supabase/middleware.js).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Sign-in & OAuth',
    description = 'Sign up, sign in with a password, Google, GitHub, a passkey or SSO, change your email or password, sign out, and set up SSO for your organization.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'workspace/sign-in' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'workspace/sign-in' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, showcase, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.showcase, v.sort_order
from (
  values
    (
      'signing-up',
      'Basics',
      'Signing up',
      $html$<p>To create a Geiger account, open the <a href="/signup">sign-up page</a> and type your email under <strong>Email</strong>. A password field appears below it: type a password of at least 8 characters, then choose <strong>Create account</strong>.</p><p>Dash shows <strong>Check your email</strong> and sends a confirmation link to that address. Open the link to activate your account. Dash signs you in and starts setting up your first organization, which the <a href="/help/quickstart">Quickstart</a> walks through.</p><p>You can also create an account from the <a href="/login">sign-in page</a> with <strong>Continue with Google</strong> or <strong>Continue with GitHub</strong>. If your organization uses SSO, you don't need to sign up first: <a href="/help/workspace/sign-in#signing-in-with-sso">signing in with SSO</a> creates your account.</p>$html$,
      '[]',
      null,
      10
    ),
    (
      'signing-in',
      'Basics',
      'Signing in',
      $html$<p>To sign in, open the <a href="/login">sign-in page</a> and pick one of its options:</p><ul><li>Email and password: type your email under <strong>Email</strong>, then your password in the field that appears, and choose <strong>Continue</strong>.</li><li><strong>Continue with Google</strong> or <strong>Continue with GitHub</strong>: sign in with that account. If it's new to Geiger, Dash creates your Geiger account.</li><li><strong>Sign in with a passkey</strong>: use your fingerprint, face or device screen lock. Set up a passkey first, as <a href="/help/workspace/sign-in#passkeys">Passkeys</a> describes.</li><li><strong>Continue with SSO</strong>: sign in through your organization's identity provider, as <a href="/help/workspace/sign-in#signing-in-with-sso">Signing in with SSO</a> describes.</li></ul><p>If a sign-in fails, the page shows why above the <strong>Email</strong> field. After an email-and-password sign-in, Dash can offer to set up a passkey before it moves on.</p><p>Where you land depends on how you arrived. If Dash sent you to sign in from <strong>Organizations</strong> or from an app, you go back there once you're in, to the top of it rather than the exact page you opened. Otherwise, an email-and-password or passkey sign-in opens the Geiger home page, and Google or GitHub opens <strong>Organizations</strong>. Whenever an account that doesn't belong to an organization yet opens <strong>Organizations</strong> or an app, Dash sends it to set one up first.</p>$html$,
      '[]',
      null,
      20
    ),
    (
      'passkeys',
      'Passkeys',
      'Passkeys',
      $html$<p>A passkey lets you sign in with your fingerprint, face or device screen lock instead of a password. To use one, choose <strong>Sign in with a passkey</strong> on the <a href="/login">sign-in page</a> and confirm in your browser's prompt. Closing the prompt cancels the sign-in without an error.</p><p>After you sign in with your email and password, Dash shows <strong>Sign in faster with a passkey</strong> if your browser supports passkeys, your account has none yet, and you haven't turned the offer off on this browser:</p><ul><li><strong>Set up passkey</strong> creates a passkey through your browser's prompt, then takes you on to where you were going. If setup fails, Dash says why and the dialog stays open.</li><li><strong>Not now</strong> skips it. Dash asks again at your next email-and-password sign-in.</li><li><strong>Don't ask again</strong> turns the offer off for your account on this browser.</li></ul><p>To manage passkeys, choose your avatar at the top right of Dash, then <strong>Profile</strong>, and open the <strong>Security</strong> tab. Under <strong>Passkeys</strong>, <strong>Add Passkey</strong> creates one through your browser's prompt. Each passkey is listed by name, with when it was added and when it was last used. The trash icon beside a passkey removes it straight away, without asking.</p><p>Adding a passkey on a device that already has one for your account fails with <strong>This device already has a passkey for your account.</strong> If the card says <strong>This browser doesn't support passkeys.</strong>, switch to a browser that does to add or use one.</p>$html$,
      '[]',
      null,
      30
    ),
    (
      'password-and-email',
      'Security',
      'Changing your email or password',
      $html$<p>To change the email you sign in with, choose your avatar at the top right of Dash, then <strong>Profile</strong>, and open the <strong>Security</strong> tab. Under <strong>Email Address</strong>, type the new address and choose <strong>Change Email</strong>. Dash sends a confirmation link to the new address, and the change takes effect once you open it. Until then, your current email stays in place, with a <strong>Verified</strong> or <strong>Unverified</strong> badge beside it.</p><p>To set a new password, go to <strong>Password</strong> on the same tab. Type it in <strong>New Password</strong> and again in <strong>Confirm Password</strong>, then choose <strong>Update Password</strong>. It needs at least 8 characters: <strong>Update Password</strong> stays disabled until it has them. If the two don't match, Dash shows <strong>The two passwords do not match.</strong> and changes nothing. Dash doesn't ask for your current password, and you stay signed in.</p><p>Your name, picture and the rest of your profile are covered in <a href="/help/workspace/profile">Profile</a>.</p>$html$,
      '[]',
      null,
      40
    ),
    (
      'signing-out',
      'Security',
      'Signing out',
      $html$<p>To sign out, choose your avatar at the top right of Dash, then <strong>Sign out</strong>. Dash signs you out straight away, without asking, and opens the Geiger home page.</p><p>To end every session on every device at once, including the one you're using, choose your avatar, then <strong>Profile</strong>, open the <strong>Security</strong> tab and choose <strong>Sign Out Everywhere</strong> under <strong>Sessions</strong>. Dash doesn't ask first. It shows <strong>Signed out on every device.</strong> and opens the sign-in page. Use it after signing in on a computer you don't own, or if you think someone else has access to your account.</p>$html$,
      '[]',
      null,
      50
    ),
    (
      'organization-sso',
      'Concepts',
      'Organization SSO',
      $html$<p>Organization SSO lets your members sign in to Geiger through your organization's own identity provider, using OpenID Connect or OAuth 2.0. It needs the <strong>OAuth / SSO Login</strong> add-on on the organization's plan (see <a href="/help/workspace/billing#buying-a-plan">Buying a plan</a>), and each organization connects one provider.</p><p>Only the organization's owner can set it up, on the <strong>OAuth</strong> tab of <strong>Organization Settings</strong>. That tab appears only while the organization's plan includes the add-on.</p><p>The provider covers a list of email domains, like <code>acme.com</code>. While SSO is turned on, anyone who chooses <strong>Continue with SSO</strong> and types an email at one of those domains goes to the provider. Once the provider signs them in, Dash signs them in to the Geiger account with that email, creating the account if there isn't one, and adds them to the organization with the User role (see <a href="/help/workspace/members#roles">Roles</a>). Members who already belong keep their role.</p><p>Everyone your provider signs in joins the organization, so control who has access at the provider. Removing a member in Dash doesn't stop them: their next SSO sign-in adds them back.</p>$html$,
      '[]',
      null,
      60
    ),
    (
      'signing-in-with-sso',
      'SSO',
      'Signing in with SSO',
      $html$<p>To sign in through your organization's identity provider:</p><ol><li>On the <a href="/login">sign-in page</a>, choose <strong>Continue with SSO</strong>.</li><li>Type your work email under <strong>Email</strong> and choose <strong>Sign in</strong>.</li><li>Sign in at your organization's provider.</li></ol><p>Dash finds your organization from your email's domain, so you don't need its ID. Once your provider signs you in, you land on your organization's project list, or back in the app you were opening if Dash sent you to sign in from one. The first time, Dash creates your Geiger account if you don't have one and adds you to the organization. <strong>Back to sign in</strong> returns to the other sign-in options.</p><p>Your organization's owner can also share its <strong>SSO login link</strong>. Opening it goes straight to your provider without asking for your email, whatever your email's domain is.</p>$html$,
      '[]',
      null,
      70
    ),
    (
      'setting-up-sso',
      'SSO',
      'Setting up SSO',
      $html$<p>To connect your organization to an identity provider, you need to be its owner, and its plan needs the OAuth / SSO Login add-on.</p><ol><li>On the <a href="/org">Organizations</a> page, open the organization card's <strong>⋯</strong> menu, choose <strong>Settings</strong>, then the <strong>OAuth</strong> tab.</li><li>Copy the <strong>Redirect URI</strong> with the button beside it, and register it at your provider as an allowed redirect URL. Note the client ID and, if your provider issues one, the client secret.</li><li>Fill in <strong>Provider name</strong>, <strong>Email domains</strong>, <strong>Client ID</strong> and <strong>Client secret</strong>.</li><li>Type your provider's address in <strong>Discovery / issuer URL</strong> and choose <strong>Fetch</strong> to fill in the endpoint URLs, or type the <strong>Authorization URL</strong> and <strong>Token URL</strong> yourself.</li><li>Choose <strong>Save provider</strong>.</li><li>Turn on the switch beside the provider's name. Its badge changes from Disabled to Enabled, and members can sign in with SSO.</li></ol><p>A new provider is saved turned off, so nobody can use it until you turn it on. <strong>Save provider</strong> needs a provider name, a client ID, at least one email domain, and an authorization URL and token URL, typed or read from a discovery URL that works. When one is missing, Dash names it, as in <strong>Add at least one email domain (e.g. acme.com).</strong></p><p>Dash builds the <strong>Redirect URI</strong> from the address you have Dash open at, so open Dash at the address your members sign in at before you copy it.</p>$html$,
      '[]',
      null,
      80
    ),
    (
      'managing-sso',
      'SSO',
      'Managing SSO',
      $html$<p>Once a provider is saved, the <strong>OAuth</strong> tab in <strong>Organization Settings</strong> shows its name and protocol with an Enabled or Disabled badge, its email domains, the <strong>Redirect URI</strong>, the <strong>SSO login link</strong> and the <strong>Client ID</strong>.</p><ul><li>The switch beside the provider's name turns SSO on or off for the whole organization as soon as you change it. While it's off, nobody can sign in through the provider, by email or by link.</li><li><strong>SSO login link</strong>: copy it with the button beside it and share it with members. It starts an SSO sign-in for this organization without the email step.</li><li><strong>Edit provider</strong> opens the setup form with your saved values. Choose <strong>Save provider</strong> to keep your changes, or <strong>Cancel</strong>. Editing doesn't turn SSO on or off.</li><li><strong>Remove</strong> deletes the provider straight away, without asking, and members can no longer sign in through it. To pause SSO, turn it off instead.</li></ul><p>Turning SSO off or removing the provider doesn't remove anyone from the organization. Members who have another way to sign in, such as a password or a passkey, can still use it.</p>$html$,
      '[]',
      null,
      90
    ),
    (
      'sso-provider-settings',
      'Reference',
      'OAuth provider settings',
      $html$<p>The setup form on the <strong>OAuth</strong> tab of <strong>Organization Settings</strong> has these fields:</p><ul><li><strong>Provider name</strong>: the name the tab shows, like <code>Acme SSO</code>. Required.</li><li><strong>Protocol</strong>: OpenID Connect, the default, or OAuth 2.0.</li><li><strong>Email domains</strong>: the domains whose members go to this provider, separated by commas or spaces, like <code>acme.com, acme.io</code>. Dash ignores a leading @ and letter case. At least one is required.</li><li><strong>Discovery / issuer URL</strong>: optional. Takes your provider's issuer address or its full <code>.well-known/openid-configuration</code> address. <strong>Fetch</strong> reads it and fills in the authorization, token and userinfo URLs.</li><li><strong>Authorization URL</strong> and <strong>Token URL</strong>: your provider's sign-in and token endpoints. Both are required.</li><li><strong>Userinfo URL</strong>: optional. Dash reads the member's email, name and picture from it, and otherwise from the ID token, so a provider that doesn't return an ID token needs it.</li><li><strong>Client ID</strong> and <strong>Client secret</strong>: the credentials from your provider. The client ID is required. Dash never shows the secret again once it's saved: when you edit the provider, leave <strong>Client secret</strong> blank to keep the saved one.</li><li><strong>Scopes</strong>: what Dash asks your provider for, separated by spaces. It starts as <code>openid email profile</code>, which Dash also uses if you clear it.</li><li><strong>Email claim</strong>, <strong>Name claim</strong> and <strong>Avatar claim</strong>: the fields in your provider's profile that hold the member's email, name and picture. Leave them blank to use <code>email</code>, <code>name</code> and <code>picture</code>.</li><li><strong>Use PKCE</strong>: on by default, and recommended for OpenID Connect providers.</li></ul>$html$,
      '[]',
      null,
      100
    ),
    (
      'sso-no-provider',
      'Troubleshooting',
      'No SSO provider for your email domain',
      $html$<p>When you choose <strong>Continue with SSO</strong> and the sign-in page shows <strong>No SSO provider is set up for that email domain.</strong>, Dash found no provider that's turned on for the part of your email after the @. Your organization hasn't set up SSO, has turned it off, or hasn't listed your email's domain.</p><ol><li>Check that you typed your work email, at your organization's domain.</li><li>Ask your organization's owner whether SSO is on and covers your domain, or for the organization's <strong>SSO login link</strong>, which doesn't depend on your domain.</li><li>If you're the owner, open the <strong>OAuth</strong> tab of <strong>Organization Settings</strong>, add the domain with <strong>Edit provider</strong>, and turn on the switch beside the provider's name.</li></ol>$html$,
      '[]',
      null,
      110
    ),
    (
      'sso-unavailable',
      'Troubleshooting',
      'SSO isn''t available for your organization',
      $html$<p>The sign-in page shows <strong>SSO isn't available for that organization right now.</strong> when you open an organization's <strong>SSO login link</strong> while its SSO is turned off or its provider has been removed. It also appears when SSO is turned off while you're partway through signing in.</p><p>Ask your organization's owner to turn SSO back on, on the <strong>OAuth</strong> tab of <strong>Organization Settings</strong>. Meanwhile, sign in another way if your account has one, such as a password or a passkey.</p>$html$,
      '[]',
      null,
      120
    ),
    (
      'sso-sign-in-failed',
      'Troubleshooting',
      'SSO sign-in failed',
      $html$<p>The sign-in page shows <strong>SSO sign-in failed. Please try again.</strong> when Dash can't finish a sign-in with your organization's provider. Dash allows 10 minutes between choosing <strong>Sign in</strong> and coming back from the provider, in the same browser, so a sign-in left open longer or finished in another browser fails. It also fails when the provider turns down Dash's request, for example because the client secret is wrong.</p><ol><li>Start again from the <a href="/login">sign-in page</a>, and finish at your provider within 10 minutes in the same browser.</li><li>If it keeps failing, ask your organization's owner to check the <strong>Client ID</strong>, <strong>Client secret</strong> and <strong>Token URL</strong> on the <strong>OAuth</strong> tab, and that the <strong>Redirect URI</strong> is registered at the provider.</li></ol><p><strong>Your provider didn't return an email address.</strong> means the provider signed you in but Dash found no email in your profile. The owner can fix it by adding <code>email</code> to <strong>Scopes</strong>, setting <strong>Email claim</strong> to the field the provider uses, or adding a <strong>Userinfo URL</strong>.</p>$html$,
      '[]',
      null,
      130
    ),
    (
      'sign-in-link-expired',
      'Troubleshooting',
      'Sign-in link invalid or expired',
      $html$<p>The sign-in page shows <strong>That sign-in link was invalid or expired.</strong> when Dash can't sign you in at the end of a link. That happens with an email confirmation link that was already used, has expired or was opened in a different browser from the one you signed up in, and when the last step of a Google, GitHub or SSO sign-in fails.</p><ol><li>If you were confirming a new account, sign in on the <a href="/login">sign-in page</a> with your email and password.</li><li>For Google, GitHub or SSO, start the sign-in again from the sign-in page.</li></ol>$html$,
      '[]',
      null,
      140
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"CircleUser","label":"Profile","href":"/help/workspace/profile"},{"icon":"Users","label":"Members & roles","href":"/help/workspace/members"},{"icon":"Building2","label":"Organizations","href":"/help/workspace/organizations"},{"icon":"PackagePlus","label":"Add-ons","href":"/help/workspace/add-ons"},{"icon":"CreditCard","label":"Billing & usage","href":"/help/workspace/billing"},{"icon":"Rocket","label":"Quickstart","href":"/help/quickstart"}]',
      null,
      150
    )
) as v(anchor_id, eyebrow, title, content, links, showcase, sort_order)
cross join (select id from public.docs_pages where slug = 'workspace/sign-in' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Sign-in & OAuth',
    description = 'Configure how members sign in, including OAuth providers for your organization.',
    status = 'draft',
    published_at = null
where slug = 'workspace/sign-in' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'workspace/sign-in' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Signing in</li><li>OAuth providers for your organization</li><li>Troubleshooting sign-in</li></ul>',
  10
from public.docs_pages p
where p.slug = 'workspace/sign-in' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
