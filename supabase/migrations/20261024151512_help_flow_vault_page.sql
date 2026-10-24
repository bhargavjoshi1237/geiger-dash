-- Help flow vault page
--
-- One-time content move: replaces the flow/vault draft outline (20261024142436_help_flow_structure) with the full
-- Vault & externals guide and publishes it, now that Flow's vault encrypts secrets, checks PINs, passwords and passkeys
-- on the server and enforces per-secret access (geiger-flow 20261024145712_vault_secure_storage). Also updates the Logs
-- page's "What gets logged" for the new vault events, and restores the links to this page from the Flow overview, Logs
-- and Security that 20261024142445/142448/142451 left out while it was a draft.
-- Written from a survey of C:\Pro\geiger-flow (components/internal/screens/projects/vault/*, externals/externals_screen.jsx,
-- features/vault/*, app/api/vault/*, lib/webauthn.js, supabase/migrations/20261024145712_vault_secure_storage.sql,
-- 20261024145713_vault_purge_plaintext.sql, components/internal/topbar/projects/topbar.jsx, features/external_links/*).
-- Push only after the Flow deploy that ships the secure vault. Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Vault & externals',
    description = 'Keep a project''s passwords, API keys and other secrets encrypted, open them with a PIN, password or passkey, and link outside services.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'flow/vault' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'flow/vault' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, showcase, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.showcase, v.sort_order
from (
  values
    (
      'adding-a-secret',
      'Basics',
      'Adding a secret',
      $html$<p>To add a secret to the vault, open a project in Flow, choose <strong>Vault</strong> in the sidebar, then <strong>Add Secret</strong>. <strong>Add Secret</strong> in the dialog stays disabled until the secret has a name, a value and, for a PIN or password, a valid one.</p><ul><li><strong>Secret Name</strong>: what the secret is for, like <code>Production API Key</code>.</li><li><strong>Type</strong>: Password, API Key, Database, OAuth, SMTP, Certificate, SSH Key or Other. New secrets are a Password.</li><li><strong>Secret Value</strong>: the secret itself. For an API Key the field is called <strong>API Key</strong>. It's hidden as you type, and the eye icon shows what you typed.</li><li><strong>URL / Endpoint</strong> and <strong>Notes</strong>: optional. Everyone in the project can read them, so keep secrets out of them.</li><li><strong>Unlock With</strong>: <strong>PIN</strong> (the default, 4 to 8 digits), <strong>Password</strong> (at least 8 characters) or <strong>Passkey</strong>, where each person confirms with a passkey of their own.</li></ul><p>Flow can't show a PIN or password again once it's set, so share it with the people who need it some other way.</p>$html$,
      '[]',
      null,
      10
    ),
    (
      'how-secrets-are-protected',
      'Concepts',
      'How secrets are protected',
      $html$<p>Flow encrypts a secret's value as soon as you save it. The vault list never includes the value: Flow decrypts it only for someone who is allowed to open the secret and passes its check, and shows it only in that person's <strong>Access Secret</strong> dialog.</p><ul><li><strong>PIN</strong> and <strong>Password</strong> are checked by Flow's server, not in your browser, and Flow keeps only a scrambled form of them.</li><li><strong>Passkey</strong> asks each person to confirm with a passkey registered to their own account, so there's no shared code to pass around.</li><li>After 5 wrong PIN or password attempts in a row, that person can't try that secret again for 15 minutes. Nobody else is affected.</li><li>Every open, wrong attempt and lockout is recorded in the secret's <strong>Access History</strong> and in the project's <a href="/help/flow/logs">Logs</a>.</li><li>Removing a secret destroys its stored value.</li></ul>$html$,
      '[]',
      null,
      20
    ),
    (
      'opening-a-secret',
      'Vault',
      'Opening a secret',
      $html$<p>To open a secret, choose <strong>Access</strong> on its card.</p><ul><li>For a PIN or password, enter it and choose <strong>Access Secret</strong>. A wrong one shows how many attempts are left before the secret locks for you.</li><li>For a passkey, choose <strong>Use passkey</strong> and confirm on your device. If you don't have a passkey yet, Flow offers <strong>Add a passkey</strong>.</li></ul><p>The value appears in the dialog, and the copy icon beside it copies it. Closing the dialog hides it again.</p><p><strong>Access</strong> is unavailable when you aren't allowed to open the secret, when it has no saved value, or when no PIN or password is set yet. Hover over it to see which. Your browser needs passkey support to open a passkey secret.</p>$html$,
      '[]',
      null,
      30
    ),
    (
      'who-can-open',
      'Vault',
      'Choosing who can open a secret',
      $html$<p>Each secret has <strong>managers</strong>: the person who added it, the person who created the project, and your organization's owners. Only managers can edit, duplicate, remove or change access to a secret. Someone who leaves the organization stops being a manager.</p><p>To choose who can open a secret, choose <strong>Access Control</strong> in its <strong>⋯</strong> menu, pick an option under <strong>Who Can Open It</strong>, then choose <strong>Save Changes</strong>:</p><ul><li><strong>Everyone in the project</strong>: the default.</li><li><strong>Managers only</strong>.</li><li><strong>Specific people</strong>: managers, plus the people you add by email under <strong>People</strong>. Type an address and press <code>Enter</code> or choose <strong>Add</strong>, and the × beside an address removes it. You need at least one address to save.</li></ul><p>Everyone in the project still sees the secret's card, but <strong>Access</strong> stays unavailable to people it doesn't include. Whoever opens it still needs its PIN, password or their own passkey. A restricted secret shows <strong>Managers only</strong> or <strong>Specific people</strong> on its card.</p><p><strong>Access History</strong>, in the same dialog, lists the latest 50 opens, wrong attempts and lockouts, with each person's email, how they unlocked it and when. Only managers see it, and it can't be edited or deleted.</p>$html$,
      '[]',
      null,
      40
    ),
    (
      'passkeys',
      'Vault',
      'Adding a passkey',
      $html$<p>To add a passkey, choose <strong>Passkeys</strong> at the top of the Vault. In <strong>Your Passkeys</strong>, optionally type a <strong>New passkey name</strong>, like the device it's on, then choose <strong>Add passkey</strong> and follow your browser's prompt.</p><p>For your security, you can add a passkey only within 15 minutes of signing in. If Flow says to sign in again, sign out, sign back in, then add it.</p><p>A passkey belongs to your account, so it works for every passkey secret you're allowed to open, in any project. <strong>Your Passkeys</strong> lists each one with when you added it and last used it. To remove one, choose the trash icon beside it, then <strong>Remove</strong>.</p>$html$,
      '[]',
      null,
      50
    ),
    (
      'vault-list',
      'Vault',
      'The vault list',
      $html$<p>The figures across the top of the vault count the project's secrets: <strong>Total secrets</strong>, <strong>Passwords</strong>, <strong>API keys</strong> and <strong>Restricted</strong> (secrets not open to everyone in the project, with how many are opened by passkey). Search and filters don't change them.</p><p>Narrow the list with the type filter (<strong>All Types</strong> by default), or search secret names and notes. Each card shows the secret's name, its URL, the start of its notes, and how it's unlocked: <strong>PIN</strong>, <strong>Password</strong> or <strong>Passkey</strong>. When you open the vault, the most recently changed secrets come first.</p><p>The vault shows the project's default number of secrets a page, 10 unless someone changed it under <strong>Settings → General → Default rows per page</strong>. Switch to 10, 25, 50 or 100 at the bottom.</p>$html$,
      '[]',
      null,
      60
    ),
    (
      'editing-and-removing',
      'Vault',
      'Editing, duplicating and removing secrets',
      $html$<p>A secret's managers see a <strong>⋯</strong> menu on its card:</p><ul><li><strong>Edit</strong> opens the secret's form. The stored value and PIN or password are never shown: leave <strong>Secret Value</strong> blank to keep the value, and the PIN or password blank to keep it. Switching <strong>Unlock With</strong> to a PIN or password needs a new one. Choose <strong>Save Changes</strong> to keep your edits.</li><li><strong>Duplicate</strong> adds a copy with <code>(Copy)</code> after its name, with the same value, unlock method, PIN or password, and access. You become a manager of the copy.</li><li><strong>Access Control</strong> sets who can open it.</li><li><strong>Remove</strong> asks you to confirm, then destroys the secret and its value. A removed secret can't be restored from Flow.</li></ul><p>Adding, changing and removing a secret is recorded in the project's <a href="/help/flow/logs">Logs</a>. The entry never includes the value, PIN or password.</p>$html$,
      '[]',
      null,
      70
    ),
    (
      'adding-an-external-link',
      'Externals',
      'Adding an external link',
      $html$<p><strong>Externals</strong>, in the project sidebar, holds links to the outside services the project uses, like its docs, status page or repository. To add an external link, choose <strong>Create external</strong>. <strong>Name</strong> and <strong>URL</strong> are required, and Flow adds <code>https://</code> to an address that doesn't start with <code>http://</code> or <code>https://</code>.</p><ul><li><strong>Icon</strong>: External link (the default), Link, Docs, Status, Support, File, GitHub, Database or Help.</li><li><strong>Text color</strong>: the color of the link's icon and name. It starts gray.</li><li><strong>Show on top bar</strong>: puts the link's icon in the project's top bar. On by default.</li><li><strong>Open in new tab</strong>: opens the link in a new browser tab instead of in place of Flow. On by default.</li></ul><p>Choose <strong>Save external</strong> to add the link.</p>$html$,
      '[]',
      null,
      80
    ),
    (
      'using-external-links',
      'Externals',
      'Using external links',
      $html$<p>The project's top bar shows the icons of up to 4 external links that have <strong>Show on top bar</strong> on, the most recently added ones. Hover over an icon to see the link's name, and click it to open the link. On narrow windows, the top bar leaves them out.</p><p>On the <strong>Externals</strong> page, click a link's row to open it. The figures across the top count every link, and how many show on the top bar or open in a new tab. Search matches names and URLs, and the <strong>All Placements</strong> filter narrows the list to links on the top bar or links that open in a new tab.</p><p>External links can't be edited. To change one, delete it and add it again. To delete a link, choose <strong>Delete</strong> in its <strong>⋯</strong> menu. Flow asks you to confirm first, and a deleted link can't be restored from Flow.</p>$html$,
      '[]',
      null,
      90
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"Activity","label":"Logs","href":"/help/flow/logs"},{"icon":"ShieldCheck","label":"Security","href":"/help/flow/security"},{"icon":"Users","label":"Team & resources","href":"/help/flow/team"}]',
      null,
      100
    )
) as v(anchor_id, eyebrow, title, content, links, showcase, sort_order)
cross join (select id from public.docs_pages where slug = 'flow/vault' and deleted_at is null) p;

-- Logs: the vault now records opens, wrong codes and lockouts.
update public.docs_content_blocks
set content = $html$<p>Flow writes an entry to the activity log when someone creates, changes or deletes one of these. The entry's <strong>Source</strong> names where it happened:</p><ul><li><code>issues</code>: issues, an issue's parent, and links between issues</li><li><code>tasks</code>: tasks</li><li><code>goals</code>, <code>milestones</code> and <code>objectives</code>: goals, milestones and objectives</li><li><code>time</code>: time entries from Reporting</li><li><code>vault</code>: vault secrets, plus each time someone opens a secret, enters a wrong PIN or password, or locks a secret after 5 wrong attempts</li><li><code>architecture</code>, <code>credits</code> and <code>forms</code>: saving a System Architecture diagram, creating a Credited Resources allocation and creating a form, in the add-ons of those names</li></ul><p>Creating, changing or opening something is logged at the <strong>Info</strong> level, and deleting it as a <strong>Warning</strong>. A wrong PIN or password is a <strong>Warning</strong>, and a vault lockout an <strong>Error</strong>. A change names the field and its new value, like <code>Updated task status → Done</code>. Changing several fields at once also names the item.</p><p>Other activity isn't logged, including projection events, comments, Grounding messages and uploads to Assets.</p>$html$
where anchor_id = 'what-gets-logged'
  and page_id in (select id from public.docs_pages where slug = 'flow/logs' and deleted_at is null);

-- Links back to this page, now that it's published.
update public.docs_content_blocks
set links = '[{"icon":"GitBranch","label":"Issue tracker","href":"/help/flow/issues"},{"icon":"ListTodo","label":"Tasks","href":"/help/flow/tasks"},{"icon":"Flag","label":"Milestones & goals","href":"/help/flow/goals"},{"icon":"ChartColumn","label":"Reporting","href":"/help/flow/reporting"},{"icon":"KeyRound","label":"Vault & externals","href":"/help/flow/vault"},{"icon":"PackagePlus","label":"Add-ons","href":"/help/flow/add-ons"}]'::jsonb
where anchor_id = 'related-guides'
  and page_id in (select id from public.docs_pages where slug = 'flow/logs' and deleted_at is null);

update public.docs_content_blocks
set links = '[{"icon":"Users","label":"Team & resources","href":"/help/flow/team"},{"icon":"KeyRound","label":"Vault & externals","href":"/help/flow/vault"},{"icon":"Activity","label":"Logs","href":"/help/flow/logs"}]'::jsonb
where anchor_id = 'related-guides'
  and page_id in (select id from public.docs_pages where slug = 'flow/security' and deleted_at is null);

update public.docs_content_blocks
set content = $html$<ul><li><strong>Team</strong> records who works on the project and their role, and <strong>Resource Allocation</strong> plans how much of each person's time the project takes. See <a href="/help/flow/team">Team and resources</a>.</li><li><strong>Assets</strong> holds the project's uploaded files and media, up to 25 MB each. See <a href="/help/flow/assets">Assets</a>.</li><li><strong>Vault</strong> keeps the project's passwords, API keys and other secrets encrypted, each opened with a PIN, password or passkey, and <strong>Externals</strong> links the outside services the project uses. See <a href="/help/flow/vault">Vault and externals</a>.</li><li><strong>Security</strong> tracks security findings, access policies and the project's keys. See <a href="/help/flow/security">Security</a>.</li></ul>$html$
where anchor_id = 'team-files-and-access'
  and page_id in (select id from public.docs_pages where slug = 'flow' and deleted_at is null);

-- @down
update public.docs_content_blocks
set content = $html$<ul><li><strong>Team</strong> records who works on the project and their role, and <strong>Resource Allocation</strong> plans how much of each person's time the project takes. See <a href="/help/flow/team">Team and resources</a>.</li><li><strong>Assets</strong> holds the project's uploaded files and media, up to 25 MB each. See <a href="/help/flow/assets">Assets</a>.</li><li><strong>Vault</strong> keeps the project's passwords, API keys and other secrets, and <strong>Externals</strong> links the outside services the project uses.</li><li><strong>Security</strong> tracks security findings, access policies and the project's keys. See <a href="/help/flow/security">Security</a>.</li></ul>$html$
where anchor_id = 'team-files-and-access'
  and page_id in (select id from public.docs_pages where slug = 'flow' and deleted_at is null);

update public.docs_content_blocks
set links = '[{"icon":"Users","label":"Team & resources","href":"/help/flow/team"},{"icon":"Activity","label":"Logs","href":"/help/flow/logs"},{"icon":"Settings","label":"Project settings","href":"/help/flow/settings"}]'::jsonb
where anchor_id = 'related-guides'
  and page_id in (select id from public.docs_pages where slug = 'flow/security' and deleted_at is null);

update public.docs_content_blocks
set links = '[{"icon":"GitBranch","label":"Issue tracker","href":"/help/flow/issues"},{"icon":"ListTodo","label":"Tasks","href":"/help/flow/tasks"},{"icon":"Flag","label":"Milestones & goals","href":"/help/flow/goals"},{"icon":"ChartColumn","label":"Reporting","href":"/help/flow/reporting"},{"icon":"LayoutDashboard","label":"Project overview","href":"/help/flow/project-overview"},{"icon":"PackagePlus","label":"Add-ons","href":"/help/flow/add-ons"}]'::jsonb
where anchor_id = 'related-guides'
  and page_id in (select id from public.docs_pages where slug = 'flow/logs' and deleted_at is null);

update public.docs_content_blocks
set content = $html$<p>Flow writes an entry to the activity log when someone creates, changes or deletes one of these. The entry's <strong>Source</strong> names where it happened:</p><ul><li><code>issues</code>: issues, an issue's parent, and links between issues</li><li><code>tasks</code>: tasks</li><li><code>goals</code>, <code>milestones</code> and <code>objectives</code>: goals, milestones and objectives</li><li><code>time</code>: time entries from Reporting</li><li><code>vault</code>: vault items</li><li><code>architecture</code>, <code>credits</code> and <code>forms</code>: saving a System Architecture diagram, creating a Credited Resources allocation and creating a form, in the add-ons of those names</li></ul><p>Creating or changing something is logged at the <strong>Info</strong> level, and deleting it as a <strong>Warning</strong>. A change names the field and its new value, like <code>Updated task status → Done</code>. Changing several fields at once also names the item.</p><p>Other activity isn't logged, including projection events, comments, Grounding messages and uploads to Assets.</p>$html$
where anchor_id = 'what-gets-logged'
  and page_id in (select id from public.docs_pages where slug = 'flow/logs' and deleted_at is null);

update public.docs_pages
set title = 'Vault & externals',
    description = 'Keep shared credentials in the vault and link the external services the project uses.',
    status = 'draft',
    published_at = null
where slug = 'flow/vault' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'flow/vault' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Adding vault items</li><li>Access control</li><li>External links</li></ul>',
  10
from public.docs_pages p
where p.slug = 'flow/vault' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
