-- Help content settings page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the content/settings draft outline with the
-- full Project settings guide and publishes it. Content has no section showcases yet, so the page is text only.
-- Written from a survey of C:\Pro\geiger-content (components/internal/screens/settings/*, components/internal/screens/
-- operations_ui.jsx, lib/supabase/{settings,enterprise_settings}.js, lib/supabase/webhooks.js, lib/delivery/v2/engine.mjs,
-- supabase/migrations/20261001081041_project_scoped_rls.sql).
-- Left out: Billing & Plans (a placeholder screen), and any effect of Timezone, Brand name or the Branding fields
-- (they're stored, but nothing reads them).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Project settings',
    description = 'Set a Content project''s default locale, timezone and brand details, pause integrations, and review your session and the project''s credentials.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'content/settings' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'content/settings' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, showcase, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.showcase, v.sort_order
from (
  values
    (
      'general-settings',
      'Basics',
      'Setting the default locale and timezone',
      $html$<p>To change a project's general settings, choose <strong>Settings → General</strong> in the sidebar, change the values and choose <strong>Save changes</strong>. Nothing saves until you do, and Content confirms with "General settings saved".</p><ul><li><strong>Default locale</strong>: en (the default), en-IN or de. The delivery API uses it for requests that don't name a locale, unless a default locale is set under <strong>Architecture → Localization</strong>, which takes precedence.</li><li><strong>Timezone</strong>: UTC (the default), Asia/Kolkata, Europe/Berlin or America/New_York.</li></ul><p>Settings apply to the whole project, for everyone in it. Only project owners can save them: the person who created the project, or anyone whose role has full access.</p>$html$,
      '[]',
      null,
      10
    ),
    (
      'workspace-settings',
      'Workspace',
      'Project name and brand name',
      $html$<p><strong>Settings → Workspace</strong> shows the project's name and id, which you change in Dash. It also holds the project's <strong>Brand name</strong>. Type it and choose <strong>Save changes</strong>; Content confirms with "Workspace settings saved".</p><p>The brand name is the same value as <strong>Brand name</strong> under <strong>Settings → Branding</strong>, so changing it in one place changes it in both. Only project owners can save it.</p>$html$,
      '[]',
      null,
      20
    ),
    (
      'branding',
      'Branding',
      'Branding',
      $html$<p><strong>Settings → Branding</strong> keeps the project's brand details in one place: <strong>Brand name</strong>, <strong>Tagline</strong>, <strong>Logo URL</strong> and <strong>Support email</strong>. The logo's address has to start with <code>https://</code>; otherwise Content shows "Could not save branding. Use an HTTPS URL for the logo." Choose <strong>Save branding</strong> to keep your changes.</p><p>Only project owners can edit branding. Everyone else sees the fields turned off, with the note "Only project owners can edit these settings."</p>$html$,
      '[]',
      null,
      30
    ),
    (
      'integrations',
      'Integrations',
      'Pausing integrations',
      $html$<p><strong>Settings → Integrations</strong> lists the project's data connections and webhooks together, with each one's kind, its source or events, its status (Active or Paused) and when it last changed. You create them elsewhere: data connections under <strong>Audiences → Data Connections</strong> and webhooks under <strong>Publishing → Webhooks</strong>.</p><p>To stop one for a while, choose <strong>Pause</strong> on its row; <strong>Activate</strong> turns it back on. A paused webhook isn't called when entries are published or unpublished. Only project owners can pause and activate integrations. The list's search box finds a connection or webhook by name.</p>$html$,
      '[]',
      null,
      40
    ),
    (
      'your-session',
      'Security',
      'Your session',
      $html$<p><strong>Settings → Security</strong> opens with <strong>Your session</strong>: the account you're signed in with, your <strong>Last sign-in</strong>, your <strong>Authentication assurance</strong> (MFA verified for this session, or a single-factor session) and how many <strong>Verified MFA factors</strong> you have.</p><p>To sign out everywhere else, choose <strong>Sign out others</strong>. It ends your other sessions; access they already hold keeps working until it expires. This affects only your own account.</p>$html$,
      '[]',
      null,
      50
    ),
    (
      'project-credentials',
      'Security',
      'Delivery tokens, service accounts and recent events',
      $html$<p>Further down, <strong>Settings → Security</strong> lists the project's credentials:</p><ul><li><strong>Delivery tokens</strong>: each token's name, scopes, when it was last used and its status (Active, Expired or Revoked). <strong>Revoke</strong> stops a token working straight away, without asking. Only project owners can revoke here.</li><li><strong>Service accounts</strong>: each account's name and role.</li><li><strong>Recent security context</strong>: the 20 most recent events in the project's audit log.</li></ul><p>You create tokens and service accounts under <strong>Developers</strong>; see <a href="/help/content/developers">Developer tools</a>. The refresh icon at the top reloads the screen.</p>$html$,
      '[]',
      null,
      60
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"Rss","label":"Geiger Content","href":"/help/content"},{"icon":"ShieldCheck","label":"Governance","href":"/help/content/governance"},{"icon":"CodeXml","label":"Developer tools","href":"/help/content/developers"},{"icon":"Rocket","label":"Publishing","href":"/help/content/publishing"},{"icon":"UsersRound","label":"Audiences","href":"/help/content/audiences"},{"icon":"DraftingCompass","label":"Content architecture","href":"/help/content/architecture"}]',
      null,
      70
    )
) as v(anchor_id, eyebrow, title, content, links, showcase, sort_order)
cross join (select id from public.docs_pages where slug = 'content/settings' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Project settings',
    description = 'General, workspace, branding, integrations and security settings for the project.',
    status = 'draft',
    published_at = null
where slug = 'content/settings' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'content/settings' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>General</li><li>Workspace</li><li>Branding</li><li>Integrations</li><li>Security</li></ul>',
  10
from public.docs_pages p
where p.slug = 'content/settings' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
