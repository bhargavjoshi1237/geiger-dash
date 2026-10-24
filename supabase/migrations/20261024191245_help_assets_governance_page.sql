-- Help assets governance page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the assets/governance draft outline
-- (20261024191200_help_assets_structure) with the full Governance guide and publishes it. No section showcases exist
-- for Assets yet. Identity & Provisioning's "SSO and SCIM" card is left out: it can't be connected.
-- Written from a survey of C:\Pro\geiger-assets (components/internal/screens/projects/governance/* (permissions_screen,
-- identity_provisioning_screen, retention_policies_screen, legal_holds_screen, use_governance_manage, constants),
-- app/api/governance/retention/apply/route.js, lib/supabase/governance.js,
-- supabase/migrations/20260927110602_governance.sql, 20260927113039_governance_read_access.sql).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Governance',
    description = 'Archive or trash old assets with retention policies, preserve assets under legal hold, and find roles and team access in one place.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'assets/governance' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'assets/governance' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, showcase, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.showcase, v.sort_order
from (
  values
    (
      'creating-a-retention-policy',
      'Basics',
      'Creating a retention policy',
      $html$<p>A retention policy finds assets old enough to retire, so you can archive or trash them in one go. To create one, open a project in Assets, choose <strong>Governance → Retention Policies</strong> in the sidebar, then <strong>New policy</strong>.</p><ul><li><strong>Policy name</strong>: required.</li><li><strong>Description</strong>: optional.</li><li><strong>Asset type</strong>: <strong>All asset types</strong>, or one type, such as Images or PDFs.</li><li><strong>Age in days</strong>: at least 1. Age counts from when the asset was created.</li><li><strong>Action</strong>: <strong>Move to archive</strong> or <strong>Move to trash</strong>.</li></ul><p>Creating, changing and applying policies needs a role with <strong>Manage settings</strong>, which the built-in Owner and Admin roles have. Seeing policies and legal holds at all needs <strong>Manage settings</strong> or the <strong>Governance</strong> view permission, so of the built-in roles, Owner, Admin and Manager can see them.</p>$html$,
      '[]',
      null,
      10
    ),
    (
      'applying-a-retention-policy',
      'Retention Policies',
      'Applying a retention policy',
      $html$<p>Retention policies don't run on a schedule: nothing happens until you review the matches and apply a policy yourself.</p><ol><li>On <strong>Retention Policies</strong>, click a policy, or choose <strong>Review matches</strong> in its <strong>⋯</strong> menu.</li><li>Check the assets it lists: the oldest 100 that match, oldest first. For an archive policy, assets already archived aren't listed.</li><li>Choose <strong>Apply to</strong>, which counts the assets, like <strong>Apply to 12 assets</strong>. Assets moves them to the archive or the trash and tells you how many moved.</li></ol><p>Apply again to review the next batch of 100. Assets under an active legal hold can't move to the trash, and Assets reports how many couldn't be moved. Applying a trash policy also needs a role with <strong>Delete an asset</strong>.</p><p>Archived and trashed assets can be restored from <strong>Assets → Archive & Trash</strong>; see <a href="/help/assets/archive">Archive and trash</a>.</p>$html$,
      '[]',
      null,
      20
    ),
    (
      'legal-holds',
      'Legal Holds',
      'Placing a legal hold',
      $html$<p>A legal hold preserves assets for a legal or regulatory review. To create one, choose <strong>Governance → Legal Holds</strong>, then <strong>New hold</strong>, and enter a <strong>Hold name</strong>, the <strong>Matter reference</strong>, the <strong>Custodian</strong> and the <strong>Reason for preservation</strong>.</p><p>Then open the hold and add assets under <strong>Add assets</strong>, searching the project's assets by name. Only live assets can be added, not ones already in the trash.</p><p>While a hold is active, its assets can't be moved to the trash or deleted permanently, from any screen or the API. An asset can sit in several holds, and it stays protected while any of them is active. Creating and changing holds needs a role with <strong>Manage settings</strong>.</p>$html$,
      '[]',
      null,
      30
    ),
    (
      'releasing-a-hold',
      'Legal Holds',
      'Releasing a hold',
      $html$<p>To end a hold, open it, choose <strong>Release hold</strong>, type the hold's name and confirm. A released hold no longer protects its assets, unless another active hold also covers them, and it can't be changed or reopened afterwards.</p><p>To take one asset out of an active hold, use the remove button beside it and confirm. Each hold's <strong>History</strong> records when it was created and released, and every asset added or removed.</p><p>The list on Legal Holds shows each hold's custodian, status (Active or Released), number of assets and creation date. The figures across the top count <strong>Active holds</strong>, <strong>Protected assets</strong> and <strong>Released holds</strong>.</p>$html$,
      '[]',
      null,
      40
    ),
    (
      'permissions-and-identity',
      'Governance',
      'Permissions and identity',
      $html$<p>Two entries in the <strong>Governance</strong> group of the sidebar open screens covered elsewhere:</p><ul><li><strong>Permissions</strong> opens the project's roles, the same screen as <strong>Settings → Permissions & Security</strong>. See <a href="/help/assets/settings#permissions-and-security">Project settings</a>.</li><li><strong>Identity & Provisioning</strong> opens the project's team, the same as <strong>Collaboration → Team</strong>, with a note on how people get access: synced from your organization or added to the team. See <a href="/help/assets/collaboration#team">Collaboration</a>.</li></ul>$html$,
      '[]',
      null,
      50
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"Settings","label":"Project settings","href":"/help/assets/settings"},{"icon":"Archive","label":"Archive & trash","href":"/help/assets/archive"},{"icon":"MessagesSquare","label":"Collaboration","href":"/help/assets/collaboration"}]',
      null,
      60
    )
) as v(anchor_id, eyebrow, title, content, links, showcase, sort_order)
cross join (select id from public.docs_pages where slug = 'assets/governance' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Governance',
    description = 'Control access, apply retention policies and preserve assets under legal hold.',
    status = 'draft',
    published_at = null
where slug = 'assets/governance' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'assets/governance' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Permissions</li><li>Identity and provisioning</li><li>Retention policies</li><li>Legal holds</li></ul>',
  10
from public.docs_pages p
where p.slug = 'assets/governance' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
