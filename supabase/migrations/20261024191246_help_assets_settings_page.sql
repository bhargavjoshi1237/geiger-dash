-- Help assets settings page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the assets/settings draft outline
-- (20261024191200_help_assets_structure) with the full Project settings guide and publishes it. No section showcases
-- exist for Assets yet. Left out on purpose because nothing applies them: General's Visibility, Region, Default rows
-- per page and Default landing tab; Usage & Storage's Max upload size, Auto-archive after and Trash retention; the
-- whole Security policy tab; and Advanced's Operations switches, Environment variables and Cache actions.
-- Written from a survey of C:\Pro\geiger-assets (components/internal/screens/projects/settings/* (general_settings,
-- addons_settings, usage_storage_screen, permissions_security_screen, advanced_settings, settings_kit, constants),
-- lib/supabase/project_settings.js, lib/supabase/rbac.js, lib/rbac.js, geiger-rbac.config.js, lib/storage/auth.js,
-- lib/workflows/engine.js (storage threshold), supabase/migrations/20260906010000_adopt_rbac.sql,
-- 20260906020000_rbac_org_role_mapping.sql, 20260927110602_governance.sql).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Project settings',
    description = 'Rename the project, choose how delivery addresses behave, turn on add-ons, set the storage quota, manage roles, and transfer or delete the project.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'assets/settings' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'assets/settings' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, showcase, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.showcase, v.sort_order
from (
  values
    (
      'renaming-the-project',
      'Basics',
      'Renaming the project',
      $html$<p>To change the project's name, open a project in Assets and choose <strong>Settings → General</strong> in the sidebar. Under <strong>Identity</strong>, edit the <strong>Project name</strong>, <strong>Slug</strong> (lowercase letters, numbers and hyphens) or <strong>Description</strong>. Each one saves when you leave the field or press <code>Enter</code>.</p><p>These belong to the project itself, which your organization shares across the suite, so a new name shows in Dash and every app that opens the project.</p><p><strong>Identifiers</strong> lists the read-only <strong>Project ID</strong> and <strong>DAM project ID</strong>, with copy buttons, for API and support use.</p>$html$,
      '[]',
      null,
      10
    ),
    (
      'delivery-defaults',
      'General',
      'Delivery defaults',
      $html$<p>The <strong>Delivery</strong> section of <strong>Settings → General</strong> has two switches for the project's public delivery addresses. Both save as you change them.</p><ul><li><strong>URL transforms</strong>: lets delivery addresses resize, crop, convert and apply effects to images. Off, the default, serves originals only and refuses transform addresses.</li><li><strong>Deliver new assets by default</strong>: new uploads start with delivery turned on, so their addresses work straight away. Existing assets keep their own setting. On by default.</li></ul><p>The limits on transforms and who can load addresses are in <strong>Platform → API → Delivery Settings</strong>. See <a href="/help/assets/delivery">Delivery</a>.</p>$html$,
      '[]',
      null,
      20
    ),
    (
      'add-ons-tab',
      'Add-ons',
      'Add-ons',
      $html$<p><strong>Settings → Add-ons</strong> lists the optional screens you can turn on for the project, such as Brand Kit, Watermarks and Contact Sheets, each with a switch. Turning one on adds its entry to the sidebar. See <a href="/help/assets/add-ons#turning-add-ons-on">Add-ons</a>.</p>$html$,
      '[]',
      null,
      30
    ),
    (
      'usage-and-storage',
      'Usage & Storage',
      'Usage and storage',
      $html$<p><strong>Settings → Usage & Storage</strong> shows what the project uses. The figures across the top show <strong>Storage used</strong> against the quota, the number of <strong>Assets</strong>, <strong>Bandwidth</strong> over the last 30 days and recent <strong>Transforms</strong>. Charts show <strong>Storage growth</strong> over 30 days, storage <strong>By file type</strong> and the <strong>Largest folders</strong>.</p><p>Under <strong>Limits & retention</strong>:</p><ul><li><strong>Storage quota</strong>: the project's storage in GB, 500 to start. The project overview's Storage Usage gauge and Storage available check measure against it.</li><li><strong>Quota alert threshold</strong>: a percentage of the quota, 80% to start. When an upload takes the project past it, workflows with the Storage threshold crossed trigger run.</li></ul><p>The quota is a target for these figures and workflows; Assets doesn't stop uploads when you pass it. See <a href="/help/assets/workflows">Workflows</a>.</p>$html$,
      '[]',
      null,
      40
    ),
    (
      'permissions-and-security',
      'Permissions & Security',
      'Roles and permissions',
      $html$<p>Roles decide what each person on the project's team can do in Assets. To see them, choose <strong>Settings → Permissions & Security</strong>; the <strong>Roles</strong> tab lists each role with its description, permissions and how many people hold it. Governance → Permissions opens the same screen.</p><p>Five built-in roles come with every project, marked <strong>System role</strong>:</p><ul><li><strong>Owner</strong>: everything, including billing.</li><li><strong>Admin</strong>: everything except billing, including deleting assets and managing settings, the team and roles.</li><li><strong>Manager</strong>: memberships and assets, and inviting and assigning people, but can't delete assets or edit roles.</li><li><strong>Member</strong>: day-to-day work, including editing and uploading assets.</li><li><strong>Viewer</strong>: the project overview and analytics only.</li></ul><p>People get the role matching their organization role: Owner, Admin or Manager, and Member for everyone else. Change someone's role on <strong>Collaboration → Team</strong>; see <a href="/help/assets/collaboration#team">Collaboration</a>.</p>$html$,
      '[]',
      null,
      50
    ),
    (
      'custom-roles',
      'Permissions & Security',
      'Creating a custom role',
      $html$<p>To make your own role, choose <strong>New role</strong> on the Roles tab, or <strong>Duplicate</strong> on an existing one to start from its permissions.</p><ol><li>Type a <strong>Name</strong> and a <strong>Key</strong>, a short unique ID. Both are required.</li><li>Optional: add a <strong>Description</strong> and pick a <strong>Colour</strong>.</li><li>Select the permissions it grants. Each group has a box that selects or clears the whole group.</li><li>Choose <strong>Create role</strong>.</li></ol><p>Assets checks these permissions when someone acts:</p><ul><li><strong>Edit an asset</strong>: uploading and replacing files.</li><li><strong>Delete an asset</strong>: deleting assets and deleting them permanently from the trash.</li><li><strong>Manage settings</strong>: creating and changing retention policies and legal holds.</li><li><strong>Governance</strong>, under the view permissions: seeing retention policies and legal holds.</li></ul><p>Built-in roles can't be edited or deleted, only duplicated. A custom role can be deleted once nobody holds it.</p>$html$,
      '[]',
      null,
      60
    ),
    (
      'resetting-transferring-deleting',
      'Advanced',
      'Resetting, transferring and deleting',
      $html$<p>The bottom of <strong>Settings → Advanced</strong> holds three actions, and Assets asks you to confirm each one.</p><ul><li><strong>Reset settings to defaults</strong>: returns the project's Assets settings to their defaults, including the storage quota and add-ons, which go back to Brand Kit only. It also empties Brand Kit, Watermarks and Contact Sheets.</li><li><strong>Transfer project</strong>: moves the project to another <strong>Target organization</strong>, chosen from the organizations among your projects.</li><li><strong>Delete project</strong>: deletes the whole project, which Dash and the other apps share, not only its assets. Type the project's name to confirm. Assets then takes you out of the project.</li></ul><p>Transferring and deleting change the project for every app in the suite, so check with your organization's admins first. Managing projects is otherwise done in Dash.</p>$html$,
      '[]',
      null,
      70
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"PackagePlus","label":"Add-ons","href":"/help/assets/add-ons"},{"icon":"ShieldCheck","label":"Governance","href":"/help/assets/governance"},{"icon":"MessagesSquare","label":"Collaboration","href":"/help/assets/collaboration"}]',
      null,
      80
    )
) as v(anchor_id, eyebrow, title, content, links, showcase, sort_order)
cross join (select id from public.docs_pages where slug = 'assets/settings' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Project settings',
    description = 'Project details, add-ons, storage usage, roles and advanced options for Assets.',
    status = 'draft',
    published_at = null
where slug = 'assets/settings' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'assets/settings' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>General</li><li>Add-ons</li><li>Usage and storage</li><li>Permissions and security</li><li>Advanced</li></ul>',
  10
from public.docs_pages p
where p.slug = 'assets/settings' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
