-- Help forms builder page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the forms/builder draft outline (from
-- 20261024191600_help_forms_structure) with the full Form builder guide and publishes it.
-- Written from a survey of C:\Pro\geiger-forms (components/forms/form-builder.jsx, form-builder-shell.jsx,
-- components/forms/builder/* (builder-canvas, builder-sidebar, builder-topbar, builder-preview, field-card, field-palette,
-- field-settings, page-break-card, design-section, cover-picker, history-section, doc-history.js, doc-checks.js,
-- use-autosave.js, use-builder-presence.js, presence-avatars), lib/forms/field-types.js, lib/forms/logic.js,
-- lib/supabase/versions.js, lib/hooks/use-versions.js, components/internal/screens/forms/catalog/*, geiger-rbac.config.js).
-- Left out on purpose: the topbar's favourite star (local state only, never saved).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Form builder',
    description = 'Build a form on the canvas: add and arrange fields, set them up, split the form into pages, preview it and keep versions.',
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'forms/builder' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'forms/builder' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.sort_order
from (
  values
    (
      'opening-the-builder',
      'Basics',
      'Opening the builder',
      $html$<p>The builder is where you add and arrange a form's fields. Open it with <strong>Open builder</strong> in a form's row menu in All Forms or at the top of its settings. A form you create with <strong>New form</strong> opens there straight away.</p><p>The canvas in the middle shows the form's fields in order. On a wide screen, a sidebar on the right holds <strong>Add fields</strong>, <strong>Fields</strong>, <strong>Pages</strong>, <strong>Branches</strong>, <strong>Auto-triage & quiz</strong>, <strong>Design</strong>, <strong>Schedule & limits</strong>, <strong>Submission</strong> and <strong>History</strong>. On a narrow screen the sidebar is hidden, and you add fields with the buttons under the canvas.</p><p>The bar along the top shows the form's name, whether your changes are saved and any problems to check. It also has undo and redo, the people editing with you, a button to copy the public link, <strong>Preview</strong> and <strong>Publish</strong> (or <strong>Live</strong> once the form is published). The arrow at the left goes back to All Forms.</p>$html$,
      '[]',
      10
    ),
    (
      'adding-fields',
      'Builder',
      'Adding and arranging fields',
      $html$<p>To add a field, click a field type under <strong>Add fields</strong> in the sidebar. The new field goes after the field you have selected, or at the end. You can also drag a field type onto the canvas and drop it where you want it. Type in the search box to find a type, and press <code>Enter</code> to add the first match.</p><p>Under the canvas, <strong>Add field</strong> opens the same list, <strong>Calculated</strong> adds a calculated field and <strong>Add page</strong> adds a page break. An empty form also offers one-click starters: Short text, Email, Single choice, Long text, Date and Star rating. The <a href="/help/forms/fields">Field types</a> guide covers every type.</p><ul><li>To move a field, hover over it and drag the handle at its left edge to a new spot.</li><li>The copy icon on a field, or <strong>Duplicate</strong> in its <strong>⋯</strong> menu, adds a copy right after it.</li><li><strong>Exclude from form</strong> hides a field from respondents but keeps it in the builder. Excluded fields move to an <strong>Excluded</strong> list under <strong>Fields</strong> in the sidebar, where the eye icon brings them back.</li><li><strong>Delete</strong> removes the field at once, and the message that follows has an <strong>Undo</strong> button.</li></ul><p>The <strong>Fields</strong> section lists every field. Click one to jump to it on the canvas.</p>$html$,
      '[]',
      20
    ),
    (
      'field-settings',
      'Builder',
      'Field settings',
      $html$<p>Click a field on the canvas to open its settings, and the arrow at its right to close them. Type in the name at the top of the card to rename the field. The name identifies the field in the builder, in responses and in merge tags.</p><p>The <strong>Question</strong> tab holds what respondents see:</p><ul><li><strong>Field type</strong>: switch the field to another type.</li><li><strong>Question</strong>: the wording respondents see. Until you change it, it follows the field's name.</li><li><strong>Placeholder</strong> (for text, email, phone, website, number, currency and dropdown fields), <strong>Help text</strong> under the question, and an <strong>Info tooltip</strong> behind an (i) icon.</li><li><strong>Required</strong>: respondents can't continue without an answer. <strong>Read-only</strong> shows the default or prefilled value without letting respondents change it.</li><li>The type's own settings, such as a choice field's options, covered in <a href="/help/forms/fields">Field types</a>.</li></ul><p>The <strong>Validation</strong> tab sets extra rules: <strong>Minimum</strong> and <strong>Maximum</strong> for numbers and currency; <strong>Min length</strong>, <strong>Max length</strong>, a <strong>Pattern (regex)</strong> and its <strong>Error message</strong> for text, email, website and phone fields; and <strong>Min selections</strong> and <strong>Max selections</strong> for multiple choice. The <strong>Logic</strong> tab shows the field only when conditions match, covered in <a href="/help/forms/logic#showing-a-field-conditionally">Logic and scoring</a>.</p>$html$,
      '[]',
      30
    ),
    (
      'advanced-field-settings',
      'Builder',
      'Advanced field settings',
      $html$<p>The <strong>Advanced</strong> tab of a field's settings holds:</p><ul><li><strong>Width</strong>: <strong>Full</strong> (the default), <strong>Half</strong> or <strong>Third</strong>, so fields sit side by side. On a phone, fields stack.</li><li><strong>Default value</strong>: the answer a field starts with.</li><li><strong>Prefill key</strong>: a name that fills the field from the form's link. With the key <code>email</code>, a link ending in <code>?email=ana@example.com</code> fills in that address.</li><li><strong>Browser autofill</strong> (short text fields): which saved detail browsers and password managers offer, such as First name, Company or Postal code. <strong>Auto</strong> guesses from the field's name, and <strong>Off</strong> turns it off.</li><li><strong>Sensitive data (ePHI)</strong>: encrypts the answer when it's stored and masks it in the Response Inbox, exports and notifications. A teammate has to reveal it on purpose, and every reveal is logged.</li></ul><p>The bottom of the tab shows the field's merge tag, like <code>{Full name}</code>, and its ID.</p>$html$,
      '[]',
      40
    ),
    (
      'pages',
      'Builder',
      'Pages',
      $html$<p>A page break splits a form into steps that respondents move through one page at a time. To add one, choose <strong>Add page</strong> under the canvas or under <strong>Pages</strong> in the sidebar. The break goes after the selected field, and every field after it, up to the next break, is on the new page.</p><ul><li>Type a title on the page break's divider to name the page.</li><li>Drag the break's handle to move where the page starts.</li><li>The trash icon on the divider removes the break. Its fields stay and join the page before.</li><li>The arrow on the divider opens <strong>Show this page only when</strong>, which skips the whole page when its conditions don't match. See <a href="/help/forms/logic#skipping-pages">Logic and scoring</a>.</li></ul><p>The <strong>Pages</strong> section lists each page with its number of fields. Click a page to jump to its break. A form with more than one page shows a progress bar to respondents, unless you turn off <strong>Progress bar</strong> under <strong>Design</strong>.</p>$html$,
      '[]',
      50
    ),
    (
      'previewing-a-form',
      'Builder',
      'Previewing a form',
      $html$<p>To try a form the way respondents will, choose <strong>Preview</strong> in the builder's top bar. The preview runs the form's logic, pages and validation and ends on the thank-you screen respondents would see, with the score and outcome when the form uses them. Nothing you enter is saved.</p><p>Switch between <strong>Desktop width</strong> and <strong>Mobile width</strong> with the icons at the top right. <strong>Restart</strong> clears your answers, and <strong>Exit preview</strong> or <strong>Edit</strong> returns to the canvas.</p><p>The preview works on drafts too. A form's public link only opens once the form is published.</p>$html$,
      '[]',
      60
    ),
    (
      'saving-and-undo',
      'Concepts',
      'Saving and undo',
      $html$<p>The builder saves on its own, a second after you stop making changes, so there is no Save button. The icon next to the form's name shows where things stand: hover over it to see whether all changes are saved, a save is in progress or a save failed and is being retried. After a failed save, the builder tries again every 5 seconds. If you try to leave while a change is still unsaved, your browser asks you to confirm.</p><p>Undo and redo cover every change in the builder: fields, pages, branches, design and settings. Use the arrows in the top bar, or press <code>Ctrl Z</code> to undo and <code>Ctrl Shift Z</code> or <code>Ctrl Y</code> to redo (<code>⌘ Z</code>, <code>⌘ Shift Z</code> or <code>⌘ Y</code> on Mac). Typing in one box counts as a single step, and the builder keeps the last 100 steps. Undo history starts fresh each time you open the builder.</p><p>The <strong>Design</strong>, <strong>Schedule & limits</strong> and <strong>Submission</strong> sections in the sidebar change the same settings as the form's settings, and here they save on their own. See <a href="/help/forms/form-settings">Form settings</a>.</p>$html$,
      '[]',
      70
    ),
    (
      'problems-to-check',
      'Builder',
      'Problems to check',
      $html$<p>When something in a form would trip up respondents, the builder's top bar shows a badge such as <strong>3 to check</strong>. Hover over it to read the list, and click it to jump to the first field involved. It flags, for example:</p><ul><li>A form with no questions.</li><li>A choice field with no choices, a matrix with no rows or a repeating group with no sub-fields.</li><li>A calculated field with no formula, a formula error or a reference to a field that doesn't exist.</li><li>A product with no price, or a picture choice without a picture.</li><li>An image or video block with no usable link, which is hidden from respondents.</li><li>A condition on a deleted field, or with no field selected.</li><li>A redirect or ending link that doesn't start with <code>http://</code> or <code>https://</code>, which is ignored.</li><li>A branch with no conditions, which never matches.</li></ul><p>The same list appears when you publish. The <a href="/help/forms/sharing#publishing-a-form">Publishing and sharing</a> guide covers publishing.</p>$html$,
      '[]',
      80
    ),
    (
      'version-history',
      'Builder',
      'Version history',
      $html$<p>A version is a snapshot of a form's fields, logic and settings that you can go back to. To save one, open <strong>History</strong> in the builder's sidebar and choose <strong>Save version</strong>, then add optional <strong>Change notes</strong>. Versions are numbered v1.0, v2.0 and so on, and the builder doesn't save them for you.</p><p>History lists versions newest first, with who saved each one and when. The newest is marked <strong>Latest</strong>. To go back to a version:</p><ol><li>Choose <strong>Preview & restore</strong> on the version.</li><li>Read what would change: fields that come back, fields that are removed or changed, settings that change and whether the order changes.</li><li>Choose <strong>Restore version</strong>.</li></ol><p>Before restoring, Forms saves the current form as a new version named after the restore, so you can always undo it. Restoring changes the form's fields and settings, not its name.</p><p><strong>Form Builder → Version History</strong> in the Forms sidebar lists every form in the project, with when each was last edited. <strong>Open builder</strong> opens a form in the builder, where <strong>History</strong> holds its versions.</p>$html$,
      '[]',
      90
    ),
    (
      'editing-with-teammates',
      'Builder',
      'Editing with teammates',
      $html$<p>When teammates have the same form open in the builder, their avatars appear in the top bar. Hover over them to see who is also editing.</p><p>Changes aren't merged. When a teammate's change saves, Forms shows "Updated by" and their name, with a <strong>Reload</strong> button that loads their version of the form. If you have unsaved edits of your own, reloading replaces them. Whichever change saves last is what the form keeps, so agree on who edits what.</p><p><strong>Collaboration → Live Presence</strong> in the Forms sidebar lists the project's forms and shows which ones are shared with collaborators. <strong>Open builder</strong> opens a form in the builder.</p>$html$,
      '[]',
      100
    ),
    (
      'form-not-found',
      'Troubleshooting',
      'The builder says Form not found',
      $html$<p>The builder shows <strong>Form not found</strong> when its link doesn't match a form, for example because the form was deleted or the address is wrong.</p><ol><li>Choose <strong>Back to forms</strong>.</li><li>Find the form in All Forms, and open it from its row menu with <strong>Open builder</strong>.</li></ol><p><strong>Create this form</strong> makes a new, empty form at that address instead. It needs a project open and a role that can edit forms.</p>$html$,
      '[]',
      110
    ),
    (
      'related-guides',
      null::text,
      'Related guides',
      '',
      '[{"icon":"ListChecks","label":"Field types","href":"/help/forms/fields"},{"icon":"GitFork","label":"Logic & scoring","href":"/help/forms/logic"},{"icon":"Settings2","label":"Form settings","href":"/help/forms/form-settings"},{"icon":"Share2","label":"Publishing & sharing","href":"/help/forms/sharing"},{"icon":"FileText","label":"All forms","href":"/help/forms/all-forms"},{"icon":"LayoutTemplate","label":"Templates","href":"/help/forms/templates"}]',
      120
    )
) as v(anchor_id, eyebrow, title, content, links, sort_order)
cross join (select id from public.docs_pages where slug = 'forms/builder' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Form builder',
    description = 'Build a form on the canvas: add and arrange fields, split it into pages, preview it, and publish it.',
    status = 'draft',
    published_at = null
where slug = 'forms/builder' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'forms/builder' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Opening the builder</li><li>Adding and arranging fields</li><li>Field settings</li><li>Pages</li><li>Preview</li><li>Autosave and version history</li><li>Live presence</li><li>Publishing from the builder</li></ul>',
  10
from public.docs_pages p
where p.slug = 'forms/builder' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
