-- Help forms settings page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the forms/settings draft outline (from
-- 20261024191600_help_forms_structure) with the full Workspace settings guide and publishes it.
-- Written from a survey of C:\Pro\geiger-forms (components/internal/screens/forms/settings/settings_screen.jsx,
-- service_status.jsx, use_workspace_settings.js, lib/supabase/workspace_settings.js, lib/hooks/use-workspace-settings.js,
-- app/api/workspace/config/route.js, components/internal/screens/forms/forms/forms_screen.jsx,
-- templates/templates_screen.jsx, geiger-rbac.config.js).
-- Left out on purpose: Workspace name, Timezone, Notify me on new responses, Weekly digest recipients and the Embedding
-- domain list are saved but nothing in Forms reads them yet.
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Workspace settings',
    description = 'Set the defaults new forms start with in a project, from language and status to captcha, privacy, retention and branding.',
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'forms/settings' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'forms/settings' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.sort_order
from (
  values
    (
      'changing-workspace-settings',
      'Basics',
      'Changing workspace settings',
      $html$<p>To change Forms' settings for a project, choose <strong>Templates & Admin → Workspace Settings</strong> in the Forms sidebar. The settings belong to the open project, and only the Owner and Admin roles can change them. For everyone else the controls are disabled, and the save button explains "Only workspace admins can change settings."</p><p>Nothing saves until you choose <strong>Save settings</strong>. While you have changes, Forms shows "You have unsaved changes." and a <strong>Discard</strong> button that puts the saved settings back. Once everything is saved, the button reads <strong>Saved</strong>.</p><p>Most settings on this screen are defaults for new forms. To change one form, use its own settings instead. See <a href="/help/forms/form-settings">Form settings</a>.</p>$html$,
      '[]',
      10
    ),
    (
      'how-defaults-apply',
      'Concepts',
      'How defaults apply to new forms',
      $html$<p>Workspace defaults are copied into a form when it's created, and only then. They apply to forms you create with <strong>New form</strong> from a blank form or a built-in template, and to forms made with <strong>Use</strong> in the template gallery.</p><p>They don't apply to duplicates, to forms made from <strong>Your templates</strong> or to forms that already exist. Changing a default later never changes an existing form.</p><p>A default only fills in what the new form doesn't set itself. A built-in template that has its own accent color, logo or retention period keeps it.</p>$html$,
      '[]',
      20
    ),
    (
      'new-form-defaults',
      'Workspace Settings',
      'New form defaults',
      $html$<ul><li><strong>Default form language</strong>: the language of the built-in text on new forms, such as buttons and error messages. Choose English (the default), Español, Français, Deutsch, Português, हिन्दी (Hindi) or العربية (Arabic).</li><li><strong>Starting status</strong>: <strong>Draft</strong> (the default) or <strong>Published</strong>. Published only applies to forms created with New form in All Forms, and only when your role can publish forms. Other new forms start as drafts.</li><li><strong>Require CAPTCHA</strong>: turns on the captcha challenge for new forms.</li><li><strong>Anonymous by default</strong>: new forms don't store the respondent's IP hash, browser details or signed-in account.</li><li><strong>Delete responses after (days)</strong>: how long new forms keep responses before they're deleted. Leave it empty to keep responses until someone deletes them.</li></ul><p>Each form can change these afterward in its own settings. The <a href="/help/forms/security">Security and compliance</a> guide covers captcha and retention.</p>$html$,
      '[]',
      30
    ),
    (
      'default-branding',
      'Workspace Settings',
      'Default branding',
      $html$<p>The <strong>Branding</strong> card sets the look new forms start with.</p><ul><li><strong>Accent colour</strong>: pick a color, or type a 6-digit hex value like <code>#6366f1</code>. Forms won't save any other format. <strong>Clear</strong> removes it.</li><li><strong>Logo URL</strong>: the address of an image to show as new forms' logo.</li><li><strong>Hide Geiger branding</strong>: removes the "Powered by Geiger Forms" footer from new forms.</li></ul><p>To change the look of a form that already exists, open its settings and go to <strong>Themes & Colors</strong> or <strong>Branding</strong>.</p>$html$,
      '[]',
      40
    ),
    (
      'folders-api-keys-and-erasure',
      'Workspace Settings',
      'Folders, API keys and erasure',
      $html$<p>Three more cards on Workspace Settings link to tools covered in other guides.</p><ul><li><strong>Folders</strong> counts the project's folders. <strong>Manage folders</strong> opens the Folders screen, covered in <a href="/help/forms/all-forms#folders">All forms</a>.</li><li><strong>API keys</strong> creates and revokes the keys that other tools use to reach the project's forms through the REST API. Only the Owner and Admin roles can manage them. See <a href="/help/forms/integrations#api-keys">Integrations and API</a>.</li><li><strong>Right to erasure (GDPR)</strong> permanently deletes everything a respondent submitted with one email address, after you confirm. See <a href="/help/forms/security#erasing-a-respondents-data">Security and compliance</a>.</li></ul>$html$,
      '[]',
      50
    ),
    (
      'configuration',
      'Workspace Settings',
      'Configuration',
      $html$<p>The <strong>Configuration</strong> card shows which server services are set up for your deployment of Forms. It shows only whether each one is set up, never its value, and its badge reads All configured or the number not configured. When a service isn't set up, the features that need it don't work, and their settings in a form show a warning that starts "Not configured on this deployment."</p><ul><li><strong>Server database access</strong>: without it, public forms, submissions, uploads and webhooks are unavailable.</li><li><strong>Email (Resend)</strong>: without it, no email is sent, from confirmations and alerts to approvals, resume links, invitations, follow-ups and reports.</li><li><strong>Stripe Checkout</strong>: without it, respondents aren't sent to checkout, so payments aren't collected.</li><li><strong>Stripe webhooks</strong>: without it, payments are never confirmed, so paid responses stay Awaiting payment.</li><li><strong>Captcha (Cloudflare Turnstile)</strong>: without it, captcha challenges aren't shown or checked.</li><li><strong>Field encryption</strong>: without it, sensitive answers are stored unencrypted, and answers encrypted earlier can't be revealed.</li><li><strong>Link signing</strong>: without it, signed, expiring respondent links can't be created or checked.</li><li><strong>Scheduled jobs</strong>: without it, retention clean-up, reminders, follow-up emails and weekly reports don't run.</li></ul><p>Whoever runs your deployment sets these up.</p>$html$,
      '[]',
      60
    ),
    (
      'related-guides',
      null::text,
      'Related guides',
      '',
      '[{"icon":"FileText","label":"All forms","href":"/help/forms/all-forms"},{"icon":"Settings2","label":"Form settings","href":"/help/forms/form-settings"},{"icon":"LayoutTemplate","label":"Templates","href":"/help/forms/templates"},{"icon":"PlugZap","label":"Integrations & API","href":"/help/forms/integrations"},{"icon":"ShieldCheck","label":"Security & compliance","href":"/help/forms/security"},{"icon":"Users","label":"Collaboration","href":"/help/forms/collaboration"}]',
      70
    )
) as v(anchor_id, eyebrow, title, content, links, sort_order)
cross join (select id from public.docs_pages where slug = 'forms/settings' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Workspace settings',
    description = 'Set defaults for new forms in the project, along with branding, notifications, embedding and API access.',
    status = 'draft',
    published_at = null
where slug = 'forms/settings' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'forms/settings' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Defaults for new forms</li><li>Branding</li><li>Notifications</li><li>Embedding</li><li>API access</li><li>Configuration</li></ul>',
  10
from public.docs_pages p
where p.slug = 'forms/settings' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
