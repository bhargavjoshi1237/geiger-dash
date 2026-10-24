-- Help workspace members page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the workspace/members draft outline with
-- the full Members & roles guide (Organization Settings → Members, the invite email and accepting it, roles, pending
-- invites, removing members) and publishes it. Left out on purpose: the Organization Settings dialog's Save Changes
-- button (it only shows a toast), the invite email's "expires in 7 days" line (nothing enforces an expiry), and the
-- member notifications (the bell isn't on Dash's own screens).
-- Written from a survey of C:\Pro\geiger-dash (app/org/organizations-client.jsx (MembersTab, OrganizationCard),
-- app/org/actions.js, lib/org/membership.js, app/invite/[token]/route.js, utils/supabase/middleware.js,
-- app/profile/[USERID]/page.js, app/profile/[USERID]/profile-client.jsx, app/onboarding/actions.js,
-- app/onboarding/onboarding-wizard.jsx, mails/registry.js, mails/templates/geiger-flow/org-invite.jsx, lib/email/send.js,
-- lib/oauth/session.js, app/api/oauth/[orgId]/callback/route.js, supabase/migrations/20260629212507_org_abilities_rls.sql,
-- 20260629212509_org_invites.sql, 20260708201329_org_members.sql), plus how the apps read the organization role:
-- C:\Pro\geiger-events (supabase/migrations/20260809135817_rbac_org_role_mapping.sql), C:\Pro\geiger-assets
-- (20260906020000_rbac_org_role_mapping.sql), C:\Pro\geiger-campaign (20261010172149_rbac_team_access.sql),
-- C:\Pro\geiger-grey (20261010120200_team.sql), C:\Pro\geiger-pods (lib/workspace/access.mjs, lib/control/authz.mjs),
-- C:\Pro\geiger-flow and C:\Pro\geiger-notes (*_abilities.sql: no role grants are seeded).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Members & roles',
    description = 'Invite people to your organization by email, accept invites and set each member''s role. Revoke pending invites or remove members.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'workspace/members' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'workspace/members' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, showcase, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.showcase, v.sort_order
from (
  values
    (
      'inviting-members',
      'Basics',
      'Inviting members',
      $html$<p>To invite someone to an organization, go to the <a href="/org">Organizations</a> page, open the organization card's <strong>⋯</strong> menu and choose <strong>Settings</strong>, then the <strong>Members</strong> tab. Only the organization's owner sees <strong>Settings</strong>, so only the owner can invite people.</p><ol><li>Under <strong>Invite a teammate</strong>, type the person's email address.</li><li>In the list beside it, choose their role. New invites are User.</li><li>Choose <strong>Invite</strong>. It stays disabled until there's an address.</li></ol><p>You invite one address at a time. Dash emails the person an invite with an <strong>Accept invitation</strong> button and lists it under <strong>Pending invites</strong> until they accept it. If the confirmation reads <strong>Invite created for</strong> instead of <strong>Invite sent to</strong>, the invite was saved but the email couldn't be sent. The person can still accept it from their profile once they sign in with that address.</p><p>Inviting an address that already has a pending invite sends the same invite again, with the role it was first sent with. To invite them with a different role, revoke the pending invite first.</p><p>When you set up your first organization, Dash's setup ends with an <strong>Invite your team</strong> step. Type several addresses in <strong>Email addresses</strong>, separated by commas, spaces or new lines, and choose <strong>Send invites</strong>, or <strong>Skip for now</strong>. Everyone you invite there gets the User role. The <a href="/help/quickstart">Quickstart</a> walks through the whole setup.</p>$html$,
      '[]',
      null,
      10
    ),
    (
      'roles',
      'Concepts',
      'Roles',
      $html$<p>Every member of an organization has a role: Manager, User, Leader, Technical Officer or Financial Officer. You choose it when you invite someone, and new invites are User. People who join with the <a href="/help/workspace/organizations#joining-an-organization">organization ID</a> or through the organization's <a href="/help/workspace/sign-in#signing-in-with-sso">SSO sign-in</a> also start as User.</p><p>The organization's owner, the person who created it, is listed as Owner. That role is fixed, and the owner can't be removed from the organization.</p><p>In Dash, a member's role doesn't change what they can do. Only the owner can open <strong>Organization Settings</strong>, so only the owner invites people, changes roles and removes members. Every member, whatever their role, can open the organization and work in its <a href="/help/workspace/projects">projects</a>.</p><p>Some apps read the role when a member works in a project. In Events, Assets, Campaign, Grey and Pods, a Manager starts with the app's manager role, and every other role starts as an ordinary member. Each app decides what its roles allow. The other apps don't use the organization role.</p>$html$,
      '[]',
      null,
      20
    ),
    (
      'accepting-an-invite',
      'Invites',
      'Accepting an invite',
      $html$<p>To accept an invite to an organization, choose <strong>Accept invitation</strong> in the invite email. The email names the organization, who invited you and your role. If you're signed in, Dash adds you to the organization with that role and opens your Organizations page with <strong>Organization joined</strong>.</p><p>If you aren't signed in, the link opens the sign-in page. Sign in, or <a href="/help/workspace/sign-in#signing-up">sign up</a> if you don't have an account yet, and Dash adds you as soon as you're signed in. That works for 30 minutes in the same browser. After that, open the link again.</p><p>Invites sent to your account's email address also wait on your <a href="/profile">profile</a>. A line at the top of your profile tells you about them. Choose <strong>Review</strong>, then <strong>Accept</strong> beside the invite under <strong>Pending Invitations</strong> on the <strong>Organizations</strong> tab. Each invite there shows the role you were invited as.</p><p>An invite works once. After it's accepted or revoked, its link no longer adds anyone.</p>$html$,
      '[]',
      null,
      30
    ),
    (
      'pending-invites',
      'Invites',
      'Pending invites',
      $html$<p>To see which invites to an organization haven't been accepted yet, open the <strong>Members</strong> tab in <strong>Organization Settings</strong> and look under <strong>Pending invites</strong> at the bottom. Invites are listed newest first, with the email address and the role each was sent with. The section appears only while there's at least one. Once someone accepts, their invite leaves the list and they show up under <strong>Members</strong>.</p><p>To cancel an invite, choose <strong>Revoke</strong> beside it. Dash revokes it straight away, without asking, and its link stops working. To invite the same person later, send a new invite.</p>$html$,
      '[]',
      null,
      40
    ),
    (
      'member-list',
      'Members',
      'The member list',
      $html$<p>The <strong>Members</strong> tab in <strong>Organization Settings</strong> lists everyone in the organization, with the number of members and your own role at the top. Only the organization's owner can open it.</p><p>The owner comes first, then everyone else in the order they joined. Each row shows the member's name and email, and (you) marks your own row. The owner's row and your own row show the role as plain text. Every other member has a role list and a <strong>⋯</strong> menu beside their name.</p>$html$,
      '[]',
      null,
      50
    ),
    (
      'changing-a-role',
      'Members',
      'Changing a member''s role',
      $html$<p>To change a member's role, open the <strong>Members</strong> tab in <strong>Organization Settings</strong> and choose a new role in the list beside their name. The change saves as soon as you choose it, and Dash shows <strong>Role updated</strong>. If it fails, Dash shows an error and puts the old role back.</p><p>Only the organization's owner can change roles. The owner's role is fixed, so the owner's row has no role list.</p>$html$,
      '[]',
      null,
      60
    ),
    (
      'removing-a-member',
      'Members',
      'Removing a member',
      $html$<p>To remove someone from an organization, open the <strong>Members</strong> tab in <strong>Organization Settings</strong>, open the <strong>⋯</strong> menu beside their name and choose <strong>Remove from workspace</strong>. Dash asks you to confirm first: choose <strong>Remove</strong> in the dialog. Only the owner can remove members, and the owner can't be removed.</p><p>A removed member loses access to the organization and all of its projects straight away. What they made in those projects stays where it is.</p><p>Removing someone doesn't stop them from coming back. A new invite adds them again, and so does the organization ID (see <a href="/help/workspace/organizations#joining-an-organization">Joining an organization</a>) or signing in through the organization's SSO, if it has one.</p><p>There's no way to leave an organization yourself. To leave, ask its owner to remove you.</p>$html$,
      '[]',
      null,
      70
    ),
    (
      'invite-email-didnt-arrive',
      'Troubleshooting',
      'Invite email didn''t arrive',
      $html$<p>If someone you invited can't find the invite email, check the message Dash showed when you sent it. <strong>Invite sent to</strong> means the email went out. <strong>Invite created for</strong> means the invite was saved but the email couldn't be sent.</p><ol><li>Open the <strong>Members</strong> tab in <strong>Organization Settings</strong> and check the address under <strong>Pending invites</strong>. If it's wrong, choose <strong>Revoke</strong> and invite the right one.</li><li>To send the email again, invite the same address again. Dash resends the same invite instead of creating a second one.</li></ol><p>The invite also waits on the person's profile. Once they sign in, or sign up, with exactly that address, they can accept it under <strong>Pending Invitations</strong> on their profile's <strong>Organizations</strong> tab.</p>$html$,
      '[]',
      null,
      80
    ),
    (
      'invite-link-doesnt-work',
      'Troubleshooting',
      'Invite link doesn''t work',
      $html$<p>If an invite link doesn't add you to the organization, the invite has already been accepted or was revoked. Dash then shows an error, or opens organization setup if you aren't in any organization yet. To join, ask the organization's owner to send you a new invite.</p><p>If you opened the link while signed out and weren't added after you signed in, more than 30 minutes passed or you signed in from another browser. Open the link again while you're signed in, or accept the invite from your <a href="/profile">profile</a> under <strong>Pending Invitations</strong>.</p>$html$,
      '[]',
      null,
      90
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"Building2","label":"Organizations","href":"/help/workspace/organizations"},{"icon":"FolderKanban","label":"Projects","href":"/help/workspace/projects"},{"icon":"CircleUser","label":"Profile","href":"/help/workspace/profile"},{"icon":"KeyRound","label":"Sign-in & OAuth","href":"/help/workspace/sign-in"},{"icon":"Rocket","label":"Quickstart","href":"/help/quickstart"},{"icon":"Shapes","label":"Core concepts","href":"/help/core-concepts"}]',
      null,
      100
    )
) as v(anchor_id, eyebrow, title, content, links, showcase, sort_order)
cross join (select id from public.docs_pages where slug = 'workspace/members' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Members & roles',
    description = 'Invite teammates, assign roles, and manage who can access what.',
    status = 'draft',
    published_at = null
where slug = 'workspace/members' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'workspace/members' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Inviting members</li><li>Roles and permissions</li><li>Pending invites</li><li>Removing a member</li></ul>',
  10
from public.docs_pages p
where p.slug = 'workspace/members' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
