-- Help forms templates page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the forms/templates draft outline (from
-- 20261024191600_help_forms_structure) with the full Templates guide and publishes it.
-- Written from a survey of C:\Pro\geiger-forms (components/internal/screens/forms/templates/templates_screen.jsx,
-- components/internal/screens/forms/forms/forms_screen.jsx, new_form_dialog.jsx, lib/forms/templates.js,
-- lib/supabase/forms.js (duplicateForm, listForms), settings/use_workspace_settings.js, geiger-rbac.config.js).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Templates',
    description = 'Start a form from one of 42 ready-made templates, or save your own forms as templates for your team to reuse.',
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'forms/templates' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'forms/templates' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.sort_order
from (
  values
    (
      'using-a-template',
      'Basics',
      'Using a template',
      $html$<p>To start a form from a template, choose <strong>Templates & Admin → Template Gallery</strong> in the Forms sidebar, then <strong>Use</strong> on a template's card. Forms creates a draft form with the template's name, fields and settings, adds the project's defaults from <strong>Workspace Settings</strong>, and opens it in the builder. The new form isn't in a folder.</p><p>You can also pick a template under <strong>Start from</strong> when you create a form with <strong>New form</strong> in All Forms, which lets you name the form and choose its folder first. See <a href="/help/forms/all-forms#creating-a-form">All forms</a>.</p><p>A form made from a template is a separate copy. Editing the form never changes the template, and editing or deleting a template never changes forms already made from it.</p>$html$,
      '[]',
      10
    ),
    (
      'the-gallery',
      'Templates',
      'The template gallery',
      $html$<p>The <strong>Gallery</strong> tab of the Templates screen holds 42 ready-made forms in 12 categories: Lead generation, Payments, Registration, Surveys, Assessment, HR, Support, Healthcare & legal, Education, Finance, Operations and Community. Pick a category from the menu, or search the gallery by name, description or category.</p><p>Each card shows the template's description, category and number of fields, with badges for what it turns on: Payments or Subscription, Approvals, Quiz, Scoring, E-signature, Booking, Sensitive data or Policy.</p><p>Choose <strong>Preview</strong> to see every field in order, with its type and whether it's required, before you choose <strong>Use template</strong>. The gallery shows 25 templates a page.</p>$html$,
      '[]',
      20
    ),
    (
      'saving-your-own-templates',
      'Templates',
      'Saving your own templates',
      $html$<p>Your own templates hold a form's fields and settings so your team can start from them. They belong to the project, so your teammates there can use them too.</p><ul><li>From All Forms: open a form's <strong>⋯</strong> menu and choose <strong>Save as template</strong>. The copy appears under <strong>Your templates</strong> with the form's name.</li><li>From the Templates screen: choose <strong>Create template</strong>, type a <strong>Template name</strong> and under <strong>Start from</strong> pick <strong>Blank template</strong> or a copy of one of your forms. A blank template opens in the builder so you can add its fields.</li></ul><p>A template doesn't keep the list of people its form was shared with.</p>$html$,
      '[]',
      30
    ),
    (
      'managing-your-templates',
      'Templates',
      'Managing your templates',
      $html$<p>The <strong>Your templates</strong> tab of the Templates screen lists the project's saved templates, with their number of fields and when each was last updated. Search them by name or description.</p><ul><li><strong>Use</strong> creates a draft form from the template and opens it in the builder.</li><li>The pencil opens the template itself in the builder, so you can change what new forms start with.</li><li>The trash icon deletes the template after you confirm. Forms already made from it aren't affected. Only the Owner and Admin roles can delete templates.</li></ul><p>Your templates also appear at the top of <strong>Start from</strong> in the New form dialog.</p>$html$,
      '[]',
      40
    ),
    (
      'related-guides',
      null::text,
      'Related guides',
      '',
      '[{"icon":"FileText","label":"All forms","href":"/help/forms/all-forms"},{"icon":"PencilRuler","label":"Form builder","href":"/help/forms/builder"},{"icon":"Settings","label":"Workspace settings","href":"/help/forms/settings"}]',
      50
    )
) as v(anchor_id, eyebrow, title, content, links, sort_order)
cross join (select id from public.docs_pages where slug = 'forms/templates' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Templates',
    description = 'Start a form from the template gallery, or save your own forms as templates for your team to reuse.',
    status = 'draft',
    published_at = null
where slug = 'forms/templates' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'forms/templates' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Browsing the gallery</li><li>Using a template</li><li>Saving your own templates</li><li>Managing your templates</li></ul>',
  10
from public.docs_pages p
where p.slug = 'forms/templates' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
