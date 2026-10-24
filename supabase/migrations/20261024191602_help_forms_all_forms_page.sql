-- Help forms all forms page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the forms/all-forms draft outline (from
-- 20261024191600_help_forms_structure) with the full All forms guide and publishes it.
-- Written from a survey of C:\Pro\geiger-forms (components/internal/screens/forms/forms/forms_screen.jsx,
-- new_form_dialog.jsx, constants.js, components/internal/screens/forms/folders/folders_screen.jsx,
-- archived/archived_screen.jsx, no_project.jsx, settings/use_workspace_settings.js, components/internal/shared/pagination.jsx,
-- lib/hooks/use-forms.js, lib/supabase/forms.js, lib/server/forms.js (loadPublishedForm), lib/forms/i18n.js,
-- geiger-rbac.config.js).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'All forms',
    description = 'Create forms and keep them organized: find them by status, folder or tag, then publish, duplicate, archive or delete them.',
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'forms/all-forms' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'forms/all-forms' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.sort_order
from (
  values
    (
      'creating-a-form',
      'Basics',
      'Creating a form',
      $html$<p>To create a form, choose <strong>All Forms</strong> in the Forms sidebar, then <strong>New form</strong>.</p><ul><li><strong>Form name</strong>: optional. Leave it empty and the form takes the template's name, or Untitled form when you start blank.</li><li><strong>Folder</strong>: No folder, unless you're filtering the list by a folder, which then comes preselected.</li><li><strong>Start from</strong>: <strong>Blank form</strong> (the default), one of <strong>Your templates</strong>, or a built-in template from the gallery, grouped by category. A card under the menu describes your choice and counts its fields.</li></ul><p>Choose <strong>Create form</strong>, or press <code>Enter</code> in the name. The form opens in the builder. Its public link is made from its name.</p><p>New forms start as drafts. Forms made from a blank form or a built-in template also take the project's defaults from <strong>Workspace Settings</strong>, such as the starting status, captcha, branding and language. See <a href="/help/forms/settings#how-defaults-apply">Workspace settings</a>.</p>$html$,
      '[]',
      10
    ),
    (
      'form-statuses',
      'Concepts',
      'Form statuses',
      $html$<p>Every form is in one of three statuses:</p><ul><li><strong>Draft</strong>: not live. Its public link shows Form not available.</li><li><strong>Published</strong>: live, and collecting responses at its public link.</li><li><strong>Archived</strong>: no longer collecting responses. Its public link shows Form not available, and the form moves to the <strong>Archived</strong> screen.</li></ul><p>Change a form's status from its row menu in All Forms: <strong>Publish</strong> or <strong>Unpublish</strong> (back to Draft), and <strong>Archive</strong> or <strong>Restore to draft</strong>. Changing the status needs a role that can publish forms: Owner, Admin or Manager. Responses already collected stay with the form whatever its status. The <a href="/help/forms/sharing#publishing-a-form">Publishing and sharing</a> guide covers publishing in full.</p>$html$,
      '[]',
      20
    ),
    (
      'the-forms-list',
      'All Forms',
      'The forms list',
      $html$<p><strong>All Forms</strong> lists every form in the project, the most recently edited first. The figures across the top count <strong>Forms</strong> (with how many are archived), <strong>Published</strong>, <strong>Drafts</strong> and <strong>Responses</strong> across all forms.</p><p>Narrow the list with the two menus and the search box:</p><ul><li>The status menu: <strong>Active forms</strong> (the default, everything except archived forms), <strong>All statuses</strong>, <strong>Published</strong>, <strong>Draft</strong> or <strong>Archived</strong>.</li><li>The folder menu: <strong>All folders</strong> (the default), <strong>No folder</strong>, or one folder.</li><li>The search box matches form names, folders, descriptions and tags.</li></ul><p>Each row shows the form's name, its folder, how many fields it has and its tags, then its status, responses and when it was last edited. Click a row to open the form's settings. <strong>Clear filters</strong> resets the menus and the search. The list shows 25 forms a page; switch to 10, 50 or 100 at the bottom.</p>$html$,
      '[]',
      30
    ),
    (
      'row-actions',
      'All Forms',
      'Row actions',
      $html$<p>Each row's <strong>⋯</strong> menu in All Forms has:</p><ul><li><strong>Edit settings</strong>: opens the form's settings. See <a href="/help/forms/form-settings">Form settings</a>.</li><li><strong>Open builder</strong>: opens the form in the builder. See <a href="/help/forms/builder">Form builder</a>.</li><li><strong>Responses</strong>: opens the form's own responses, with its figures, survey report and CSV export.</li><li><strong>Preview</strong>: opens the form's public link in a new tab. A draft's link shows Form not available, so try a draft with <strong>Preview</strong> in the builder instead.</li><li><strong>Duplicate</strong>: makes a draft copy named after the form with "(copy)" added, in the same project. The list of people the form was shared with isn't copied.</li><li><strong>Save as template</strong>: saves a copy to <strong>Your templates</strong>. See <a href="/help/forms/templates#saving-your-own-templates">Templates</a>.</li><li><strong>Publish</strong> or <strong>Unpublish</strong>, and <strong>Archive</strong> or <strong>Restore to draft</strong>, for roles that can publish forms.</li><li><strong>Delete</strong>, for roles that can delete forms: Owner and Admin.</li></ul>$html$,
      '[]',
      40
    ),
    (
      'deleting-a-form',
      'All Forms',
      'Deleting a form',
      $html$<p>To delete a form, choose <strong>Delete</strong> in its row menu in All Forms, or the trash icon beside it on the <strong>Archived</strong> screen. Forms asks you to confirm first. The form is removed from the project, along with access to its responses, and a deleted form can't be restored from Forms.</p><p>Only the Owner and Admin roles can delete forms. To take a form offline without losing it, archive it instead.</p>$html$,
      '[]',
      50
    ),
    (
      'folders',
      'Folders',
      'Folders',
      $html$<p>Folders group forms by team, client or workflow, and a form is in one folder at a time. Choose <strong>Templates & Admin → Folders</strong> in the sidebar to see a card for each folder, with its number of forms, how many are published and when one was last updated. A <strong>No folder</strong> card collects forms that aren't in one.</p><ul><li>To create a folder, choose <strong>New folder</strong> and type a name. Folder names must be unique, whatever their case.</li><li>To fill a folder, open its <strong>⋯</strong> menu and choose <strong>Add forms</strong>, select the forms, then choose <strong>Move</strong>. Selected forms leave their old folder.</li><li>Click a folder to list its forms. Each row's <strong>Move</strong> menu moves that form to another folder or to No folder, and clicking a row opens the form's settings.</li><li><strong>Rename</strong> renames the folder for all of its forms.</li><li><strong>Delete</strong> asks you to confirm, then removes the folder. Its forms aren't deleted: they move to No folder.</li></ul><p>You can also pick a form's folder in <strong>New form</strong>, or under <strong>Details</strong> in its settings.</p>$html$,
      '[]',
      60
    ),
    (
      'archived-forms',
      'Archived',
      'Archived forms',
      $html$<p><strong>Templates & Admin → Archived</strong> lists the project's archived forms, with each form's folder, its responses and when it was archived. Search it by form name or folder, and click a row to open the form's settings.</p><ul><li><strong>Restore</strong> returns a form to Draft. To restore several at once, select them with the checkboxes, then choose <strong>Restore 2 selected</strong> (the button counts what you picked). Restoring needs a role that can publish forms: Owner, Admin or Manager.</li><li>The trash icon deletes a form, after you confirm. Only the Owner and Admin roles can delete forms.</li></ul><p>A restored form is a draft: publish it again to reopen its public link.</p>$html$,
      '[]',
      70
    ),
    (
      'no-new-form-button',
      'Troubleshooting',
      'There''s no New form button',
      $html$<p>Forms creates forms only inside a project, so <strong>New form</strong> appears only when a project is open. Without a project, Forms shows <strong>No projects yet</strong>.</p><ol><li>Choose <strong>Go to projects</strong> to open your organization in Dash.</li><li>Create a project, or ask a teammate to add you to theirs.</li><li>Open the project, then launch Forms from it.</li></ol><p>If you made forms before Forms worked inside projects, <strong>Open earlier forms</strong> lists them. You can keep editing them there, but creating or copying forms needs a project.</p>$html$,
      '[]',
      80
    ),
    (
      'related-guides',
      null::text,
      'Related guides',
      '',
      '[{"icon":"PencilRuler","label":"Form builder","href":"/help/forms/builder"},{"icon":"Settings2","label":"Form settings","href":"/help/forms/form-settings"},{"icon":"Share2","label":"Publishing & sharing","href":"/help/forms/sharing"},{"icon":"LayoutTemplate","label":"Templates","href":"/help/forms/templates"},{"icon":"Inbox","label":"Responses","href":"/help/forms/responses"},{"icon":"Settings","label":"Workspace settings","href":"/help/forms/settings"}]',
      90
    )
) as v(anchor_id, eyebrow, title, content, links, sort_order)
cross join (select id from public.docs_pages where slug = 'forms/all-forms' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'All forms',
    description = 'Create forms, find them by status, folder or tag, and publish, duplicate, archive or delete them.',
    status = 'draft',
    published_at = null
where slug = 'forms/all-forms' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'forms/all-forms' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Creating a form</li><li>Form statuses</li><li>The forms list</li><li>Row actions</li><li>Folders</li><li>Archived forms</li></ul>',
  10
from public.docs_pages p
where p.slug = 'forms/all-forms' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
