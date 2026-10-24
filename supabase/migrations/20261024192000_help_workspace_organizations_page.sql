-- Help workspace organizations page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the workspace/organizations draft outline
-- (created by 20261023112957_help_center_structure) with the full Organizations guide and publishes it. It covers the
-- Organizations page and its cards, creating and joining an organization, the card menu, who can manage an
-- organization, Organization Settings (General tab and the tab overview), the organization icon and the subdomain view.
-- Left out as placeholders: the card menu's Edit (Edit organization dialog only toasts), Archive and Deactivate (only
-- toast), the context menu's first Edit (calls an undefined startEdit), Organization Settings → General's Workspace name,
-- Country and Phone inputs and the dialog's Save Changes (never saved), and the Security tab's Workspace Active and
-- Require Approval For New Joins switches (not wired). Also held back: viewing an organization on its custom
-- subdomain, because *.geiger.studio doesn't resolve in DNS yet (the section text is kept in the docs-dash scratchpad
-- as held_organizations_viewing_on_a_subdomain.sql.txt).
-- Written from a survey of C:\Pro\geiger-dash (app/org/page.js, app/org/organizations-client.jsx, app/org/actions.js,
-- app/org/[ORGID]/page.js, lib/org/membership.js, lib/billing/entitlements.js, lib/pricing/plans.js,
-- lib/notifications/send.js, lib/notifications/types.js, lib/domains/store.js, proxy.js, utils/supabase/middleware.js,
-- app/onboarding/page.js, app/profile/[USERID]/profile-client.jsx, components/user-profile-dropdown.jsx,
-- supabase/migrations/20260629212507_org_abilities_rls.sql, 20260708201329_org_members.sql,
-- 20261010114631_notify_notifications.sql).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Organizations',
    description = 'Create or join an organization, open it from the Organizations page, share its ID and manage its settings and icon as the owner.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'workspace/organizations' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'workspace/organizations' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, showcase, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.showcase, v.sort_order
from (
  values
    (
      'creating-an-organization',
      'Basics',
      'Creating an organization',
      $html$<p>To create an organization, choose <strong>Create</strong> at the top of the <a href="/org">Organizations page</a>, fill in the <strong>Create organization</strong> dialog and choose <strong>Create</strong>. Name and description are both required.</p><ul><li><strong>Name</strong>: what the organization is called.</li><li><strong>Description</strong>: what the organization is for.</li><li><strong>Deployment location</strong>: an AWS region. It starts as Asia Pacific (Mumbai), and the list has 18 regions in the US, Canada, Europe, Asia Pacific, South America, the Middle East and Africa. Dash shows the region as a flag on the organization's card.</li></ul><p>Dash shows <strong>Organization created.</strong> and the new organization's card appears at the top of the list, with you as its owner. A new organization starts without a plan; to buy one, see <a href="/help/workspace/billing#buying-a-plan">Billing and usage</a>. There's no limit on how many organizations you can create or belong to.</p><p>If you don't belong to any organization yet, Dash takes you to a setup wizard instead of the Organizations page, where you create your first organization or join one. See <a href="/help/quickstart">Quickstart</a>.</p>$html$,
      '[]',
      null,
      10
    ),
    (
      'joining-an-organization',
      'Basics',
      'Joining an organization',
      $html$<p>To join an organization, you need its ID from someone who already belongs to it. They copy it with <strong>Copy ID</strong> in the organization's <strong>⋯</strong> menu.</p><ol><li>On the <a href="/org">Organizations page</a>, choose the person-and-plus icon next to <strong>Create</strong>.</li><li>In the <strong>Join organization</strong> dialog, paste the ID into <strong>Organization ID</strong>.</li><li>Choose <strong>Join organization</strong>.</li></ol><p>You join straight away, with no approval step, as a member with the User role. Dash shows <strong>Organization joined.</strong> and the organization's card appears in your list. Its owner and any members with the Manager role get a notification that you joined. If the ID doesn't match an organization, Dash shows <strong>No organization was found for that ID.</strong></p><p>Joining by ID always gives the User role. To bring someone in with a different role, the owner invites them by email instead: see <a href="/help/workspace/members#inviting-members">Members and roles</a>.</p>$html$,
      '[]',
      null,
      20
    ),
    (
      'organization-owners',
      'Concepts',
      'Organization owners',
      $html$<p>Only an organization's owner can manage it. The owner is the person who created it, and their card shows the Owner role. Everyone else who belongs to the organization is a member, and their card shows Member whatever role the owner gives them on the Members tab.</p><ul><li>The owner's <strong>⋯</strong> menu on the card has <strong>Settings</strong> and <strong>Usage</strong>. In <strong>Organization Settings</strong>, the owner changes the icon, invites and removes members, sets their roles and manages the organization's add-ons.</li><li>A member's <strong>⋯</strong> menu has only <strong>Open</strong> and <strong>Copy ID</strong>. Members open the organization and its projects, and can share its ID.</li></ul><p>The owner can't be removed from the organization, and their role can't be changed. Each organization has its own owner, members, projects, plan and add-ons, so owning one organization gives you no rights in another. For the member roles, see <a href="/help/workspace/members#roles">Members and roles</a>.</p>$html$,
      '[]',
      null,
      30
    ),
    (
      'organizations-page',
      'Organizations',
      'The Organizations page',
      $html$<p>The Organizations page lists every organization you belong to, newest first. To get there, choose your avatar in the header, then <strong>Dashboard</strong>. Each card shows:</p><ul><li>The organization's icon, or the first letter of its name if it has none.</li><li>Its name and status. New organizations are Active.</li><li>The flag of its deployment location, with the region's name when you hover over it. An organization without a location shows Workspace instead.</li><li>Your role in it: Owner if you created it, Member otherwise.</li><li>How many people belong to it. Pending invites aren't counted.</li></ul><p>Click a card to open the organization's page, which lists its projects (see <a href="/help/workspace/projects">Projects</a>). To switch to another organization, choose <strong>All Organizations</strong> at the top of that page and click a different card.</p><p>The Organizations tab of your <a href="/help/workspace/profile">profile</a> lists the same organizations.</p>$html$,
      '[]',
      null,
      40
    ),
    (
      'organization-menu',
      'Organizations',
      'The organization menu',
      $html$<p>Each organization card has a <strong>⋯</strong> menu at its top right, and right-clicking the card opens the same items. Everyone sees <strong>Open</strong> and <strong>Copy ID</strong>; only the organization's owner sees <strong>Settings</strong> and <strong>Usage</strong>.</p><ul><li><strong>Open</strong>: opens the organization's page and its projects.</li><li><strong>Settings</strong>: opens <strong>Organization Settings</strong>.</li><li><strong>Usage</strong>: opens the organization's Usage page. See <a href="/help/workspace/billing#usage-page">Billing and usage</a>.</li><li><strong>Copy ID</strong>: copies the organization's ID, and Dash shows <strong>ID copied.</strong></li></ul><p>The ID is what someone pastes into <strong>Join organization</strong> to join. Anyone signed in who has it joins straight away as a member with the User role, without approval, so share it only with people who belong in the organization. To choose someone's role yourself, invite them by email instead (see <a href="/help/workspace/members#inviting-members">Members and roles</a>).</p>$html$,
      '[]',
      null,
      50
    ),
    (
      'organization-settings',
      'Organization Settings',
      'Organization settings',
      $html$<p>To open an organization's settings, choose <strong>Settings</strong> in its card's <strong>⋯</strong> menu. Only the organization's owner sees it. <strong>Organization Settings</strong> opens on the <strong>General</strong> tab.</p><ul><li><strong>General</strong>: the organization's icon. See <a href="/help/workspace/organizations#organization-icon">Changing the organization icon</a>.</li><li><strong>Members</strong>: invite people by email, change their roles and remove them. See <a href="/help/workspace/members">Members and roles</a>.</li><li><strong>Domain</strong>: the organization's own subdomain. It appears only while the organization has the Custom Subdomain add-on. See <a href="/help/workspace/add-ons#custom-subdomain">Add-ons</a>.</li><li><strong>Emails</strong>: the organization's email templates. It appears only while the organization has the Custom Email Templates add-on. See <a href="/help/workspace/add-ons#email-templates">Add-ons</a>.</li><li><strong>OAuth</strong>: the organization's own sign-in provider. It appears only while the organization has the OAuth / SSO Login add-on. See <a href="/help/workspace/sign-in#setting-up-sso">Sign-in and OAuth</a>.</li></ul><p>Each tab saves its own changes (the icon as soon as you upload it), so closing the dialog doesn't undo them.</p>$html$,
      '[]',
      null,
      60
    ),
    (
      'organization-icon',
      'Organization Settings',
      'Changing the organization icon',
      $html$<p>To change an organization's icon, open <strong>Organization Settings</strong> from its card's <strong>⋯</strong> menu and choose <strong>Upload</strong> on the <strong>General</strong> tab. Clicking the icon itself does the same. Pick a PNG, JPG or WebP image of up to 2 MB. Only the organization's owner can change its icon.</p><p>The icon saves as soon as you pick the file, and Dash shows <strong>Icon updated.</strong> Choosing <strong>Cancel</strong> in the dialog afterward doesn't undo it. A file over 2 MB fails with <strong>File must be under 2 MB.</strong></p><p>The icon appears on the organization's card, at the top of its page and in the Organizations tab of each member's profile. Until there's one, the card shows the first letter of the organization's name. You can replace the icon but not remove it.</p>$html$,
      '[]',
      null,
      70
    ),
    (
      'leaving-or-deleting',
      'Organizations',
      'Leaving or deleting an organization',
      $html$<p>Dash has no option to leave, rename or delete an organization, or to hand one to a new owner. An organization's description and deployment location can't be changed after it's created either.</p><p>To leave an organization, ask its owner to remove you on the <strong>Members</strong> tab of Organization Settings (see <a href="/help/workspace/members#removing-a-member">Members and roles</a>). You then lose access to its projects, and Dash sends you a notification that you were removed. The owner can't be removed, so an organization always keeps the person who created it.</p>$html$,
      '[]',
      null,
      90
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"Users","label":"Members & roles","href":"/help/workspace/members"},{"icon":"FolderKanban","label":"Projects","href":"/help/workspace/projects"},{"icon":"CreditCard","label":"Billing & usage","href":"/help/workspace/billing"},{"icon":"PackagePlus","label":"Add-ons","href":"/help/workspace/add-ons"},{"icon":"KeyRound","label":"Sign-in & OAuth","href":"/help/workspace/sign-in"},{"icon":"CircleUser","label":"Profile","href":"/help/workspace/profile"}]',
      null,
      100
    )
) as v(anchor_id, eyebrow, title, content, links, showcase, sort_order)
cross join (select id from public.docs_pages where slug = 'workspace/organizations' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Organizations',
    description = 'Create an organization, manage its settings, and switch between organizations.',
    status = 'draft',
    published_at = null
where slug = 'workspace/organizations' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'workspace/organizations' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Creating an organization</li><li>Organization settings</li><li>Switching between organizations</li><li>Leaving or deleting an organization</li></ul>',
  10
from public.docs_pages p
where p.slug = 'workspace/organizations' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
