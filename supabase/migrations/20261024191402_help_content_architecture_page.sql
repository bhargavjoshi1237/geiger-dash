-- Help content architecture page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the content/architecture draft outline
-- with the full Content architecture guide and publishes it. Content has no section showcases yet, so the page is text only.
-- Written from a survey of C:\Pro\geiger-content (components/internal/screens/architecture/*, editorial/structured_editor.jsx,
-- lib/supabase/{types,blocks,references,taxonomy,locales,sources}.js, lib/delivery/v2/{engine,schema,serialize,parse}.mjs,
-- supabase/migrations/20261009104336_delivery_v2_type_link.sql and 20261001081041_project_scoped_rls.sql).
-- Left out: what a locale's fallback code does (nothing reads it), any delivery of reusable blocks or their pins (nothing
-- delivers them), and imports from external sources (none exist; the status is set by hand, which the page says).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Content architecture',
    description = 'Model your entries with content types and typed fields, validate them, link entries, tag them with taxonomies, and set up locales.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'content/architecture' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'content/architecture' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, showcase, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.showcase, v.sort_order
from (
  values
    (
      'creating-a-content-type',
      'Basics',
      'Creating a content type',
      $html$<p>A content type is the model for a kind of entry: the extra fields its entries carry beyond the title, slug and body. To create one, choose <strong>Architecture → Content Types</strong> in the sidebar, then <strong>New type</strong>. Only the name is required: without one, Content shows "Give the content type a name first." Choose <strong>Create type</strong> to add it.</p><ul><li><strong>Name</strong>: what the type is called, like Article.</li><li><strong>Key</strong>: filled in from the name, in lowercase with underscores. Each key is used once in the project.</li><li><strong>Icon</strong>: the name of a Lucide icon, like <code>FileText</code>.</li><li><strong>API ID</strong>: the type's name in delivery API addresses. Leave it blank and Content makes it from the key, in lowercase with dashes, along with a plural for the type's list, like <code>articles</code>. Changing it later breaks existing API addresses.</li></ul><p>Changing content types needs the Manage content types, fields and blocks permission, which the Owner and Admin roles have.</p>$html$,
      '[]',
      null,
      10
    ),
    (
      'how-entries-match-a-type',
      'Concepts',
      'How entries match a content type',
      $html$<p>Every entry has one of four types: Article, Page, Guide or Doc. An entry follows the content type whose key or name matches its type, ignoring case. So a content type named Article, or with the key <code>article</code>, gives its fields to every Article entry. A content type whose name and key match none of the four has no entries.</p><p>Entries fill in their type's fields in <strong>Editorial → Structured Editor</strong>, which checks each value against the field's rules before it saves. <strong>Architecture → Validation Rules</strong> checks every entry at once. A content type created after its entries exist picks them up straight away.</p>$html$,
      '[]',
      null,
      20
    ),
    (
      'content-type-list',
      'Content Types',
      'The content type list',
      $html$<p><strong>Architecture → Content Types</strong> lists the project's content types by name. Each row shows the type's name, key, number of fields and list name in the delivery API, then its icon. The figures across the top show <strong>Content types</strong>, <strong>With fields</strong> (types with at least one field), <strong>Total fields</strong> and <strong>Avg. fields</strong> per type. Search matches names and keys.</p><p>Each row's <strong>⋯</strong> menu has <strong>Edit</strong>, which opens the same dialog with <strong>Save changes</strong>, and <strong>Delete</strong>. Content asks you to confirm a delete. The type's fields go with it, and a deleted type can't be restored.</p>$html$,
      '[]',
      null,
      30
    ),
    (
      'adding-fields',
      'Field Schemas',
      'Adding fields to a content type',
      $html$<p>Fields are the typed values that entries of a content type carry. Choose <strong>Architecture → Field Schemas</strong>, pick the type from the menu at the top, then choose <strong>New field</strong>. <strong>New field</strong> stays turned off until the project has a content type.</p><ul><li><strong>Label</strong>: the name editors see. It's the only required field.</li><li><strong>Key</strong>: filled in from the label. A key starts with a letter, uses only letters, numbers and underscores, and runs to 64 characters at most. It's used once per type, and these keys are reserved for the delivery API: <code>id</code>, <code>documentId</code>, <code>slug</code>, <code>locale</code>, <code>type</code>, <code>status</code>, <code>publishedAt</code>, <code>createdAt</code>, <code>updatedAt</code>, <code>meta</code> and <code>localizations</code>.</li><li><strong>Data type</strong>: Text (the default), Number, Boolean, Date, Reference, Rich text, Enum, JSON or Media. A Media field holds an asset from <strong>Content → Assets</strong>.</li><li><strong>Position</strong>: the field's place in the type's order. New fields go last.</li><li><strong>Localized</strong>: No or Yes. Yes marks a field whose value varies per locale.</li><li><strong>Options</strong>: for an Enum field, the allowed values separated by commas, like <code>free, pro</code>. At least one is required.</li><li><strong>Delivery</strong>: <strong>Delivered</strong> (the default) or <strong>Private</strong>. Private fields never appear in delivery API responses.</li><li><strong>Validation rules (JSON)</strong>: the field's rules.</li></ul><p>Choose <strong>Create field</strong> to add it.</p>$html$,
      '[]',
      null,
      40
    ),
    (
      'field-validation-rules',
      'Field Schemas',
      'Field validation rules',
      $html$<p>A field's rules are written as JSON in <strong>Validation rules (JSON)</strong>, like <code>{ "required": true, "maxLength": 120 }</code>. Content understands these rules:</p><ul><li><code>required</code>: set to <code>true</code>, the field needs a value.</li><li><code>minLength</code> and <code>maxLength</code>: the fewest and most characters in a text value.</li><li><code>pattern</code>: a regular expression a text value must match.</li><li><code>min</code> and <code>max</code>: the smallest and largest value of a Number field.</li><li><code>multiple</code>: set to <code>true</code>, a Media or Reference field returns a list in the delivery API instead of a single value.</li></ul><p>Boolean fields also have to be true or false, and Enum fields one of their options. JSON and Media values aren't checked for length or pattern. Rules that aren't valid JSON can't be saved: Content shows "Validation rules must be valid JSON."</p>$html$,
      '[]',
      null,
      50
    ),
    (
      'field-list',
      'Field Schemas',
      'The field list',
      $html$<p><strong>Architecture → Field Schemas</strong> shows the fields of the type picked in the menu at the top, in position order. Each row shows the field's label, key, position and flags (required, localized or private), its data type and its rules. The figures across the top describe that type: <strong>Fields</strong>, <strong>Required</strong>, <strong>Localized</strong> and <strong>With rules</strong>. Filter by data type, which starts on <strong>All Data Types</strong>, and search labels and keys.</p><p>Each row's <strong>⋯</strong> menu has <strong>Edit</strong>, which opens the same dialog with <strong>Save changes</strong>, and <strong>Delete</strong>. <strong>Delete</strong> removes the field straight away, without asking. Changing fields needs the Manage content types, fields and blocks permission.</p>$html$,
      '[]',
      null,
      60
    ),
    (
      'reusable-blocks',
      'Reusable Blocks',
      'Reusable blocks',
      $html$<p>Reusable Blocks keeps a library of named content chunks, like a hero, a quote or a call to action. To add one, choose <strong>Architecture → Reusable Blocks</strong>, then <strong>New block</strong>. Only the <strong>Name</strong> is required. The <strong>Key</strong> fills in from the name, and <strong>Schema (JSON)</strong> describes the shape of the block's data. Choose <strong>Create block</strong>.</p><p>To record that an entry uses a block, pick the entry under <strong>Instances on entry</strong>, then pick the block from <strong>Pin a block</strong>. Each pin is listed with its position, and the trash icon beside it removes it straight away. Pinning needs the Edit an entry or page permission.</p><p>The figures across the top count <strong>Reusable blocks</strong>, <strong>Instances here</strong> on the selected entry, <strong>Entries</strong> and blocks <strong>With schema</strong>. Each block's <strong>⋯</strong> menu has <strong>Edit</strong> and <strong>Delete</strong>. Deleting asks you to confirm first, takes the block's pins with it and can't be undone. Changing blocks needs the Manage content types, fields and blocks permission.</p>$html$,
      '[]',
      null,
      70
    ),
    (
      'references',
      'References',
      'Linking entries with references',
      $html$<p>A reference is a one-way link from one entry to another, under a field key such as <code>related</code>. To add one, choose <strong>Architecture → References</strong>, pick the entry in the menu at the top, then choose <strong>Add reference</strong>. Pick the entry to link to in <strong>Link to</strong>, set the <strong>Field key</strong> (it starts as <code>related</code>) and choose <strong>Add reference</strong>. An entry can't reference itself.</p><p>The screen shows two lists for the selected entry: <strong>Outgoing</strong>, the entries it links to, and <strong>Incoming</strong>, the entries that link to it. The trash icon on a row removes that reference straight away. The figures across the top count the project's <strong>Entries</strong>, the selected entry's <strong>Outgoing</strong> and <strong>Incoming</strong> links, and its distinct <strong>Link fields</strong>.</p><p>When the field key matches a Reference field on the entry's content type, the delivery API returns the linked entry in that field when a request asks for it. Adding and removing references needs the Edit an entry or page permission.</p>$html$,
      '[]',
      null,
      80
    ),
    (
      'validation-report',
      'Validation Rules',
      'Checking entries against their rules',
      $html$<p><strong>Architecture → Validation Rules</strong> checks every entry's field values against its content type's rules and lists the problems. It doesn't change anything: fix values in <strong>Editorial → Structured Editor</strong>, then choose <strong>Re-run</strong>.</p><ul><li><strong>Invalid</strong>: a value breaks a rule, with a message such as "Price is required." or "Price must be at least 0."</li><li><strong>No schema</strong>: no content type matches the entry's type, so there's nothing to check.</li></ul><p>The figures across the top count <strong>Entries checked</strong>, <strong>Violations</strong>, <strong>No schema</strong> and <strong>Rules</strong>. Switch between <strong>All</strong>, <strong>Invalid</strong> and <strong>No schema</strong>, and search entries, fields and messages. With no problems, the screen shows "Everything validates". The <strong>Rule catalog</strong> lists every field of every type with its rules.</p>$html$,
      '[]',
      null,
      90
    ),
    (
      'taxonomies',
      'Taxonomies',
      'Taxonomies and terms',
      $html$<p>A taxonomy is a vocabulary, such as topics or tags, whose terms you attach to entries. To create one, choose <strong>Architecture → Taxonomies</strong>, then <strong>New taxonomy</strong>. Only the <strong>Name</strong> is required, and the <strong>Key</strong> fills in from it. <strong>Hierarchical</strong> starts as <strong>Flat (tags)</strong>; pick <strong>Hierarchical (parent / child)</strong> for terms that nest. Choose <strong>Create taxonomy</strong>.</p><p>Pick a taxonomy from the menu at the top to work with its terms. Under <strong>Terms</strong>, type a label, then press <code>Enter</code> or choose <strong>Add</strong>. In a hierarchical taxonomy, pick the parent term first, or leave <strong>No parent</strong>. Content makes each term's slug from its label, and a slug is used once per taxonomy. The trash icon beside a term deletes it straight away.</p><p>To tag an entry, pick it under <strong>Assign to entry</strong>, then pick a term from <strong>Assign a term</strong>. The × on an assigned term removes it from the entry. Topic journey stages in <a href="/help/content/personalization">Personalization</a> use these terms.</p><p>Deleting a taxonomy from its <strong>⋯</strong> menu happens straight away, without asking. Changing taxonomies and terms needs the Manage content types, fields and blocks permission, and tagging entries needs Edit an entry or page.</p>$html$,
      '[]',
      null,
      100
    ),
    (
      'localization',
      'Localization',
      'Locales and coverage',
      $html$<p>Localization lists the languages the project publishes in. To add one, choose <strong>Architecture → Localization</strong>, then <strong>New locale</strong>. <strong>Code</strong>, a language code like <code>de</code> or <code>en-IN</code>, and <strong>Label</strong>, like German, are both required, and each code is used once. Optionally fill in <strong>Fallback code</strong>, and set <strong>Default</strong> to Yes for the project's main locale. Choose <strong>Create locale</strong>.</p><p>Each locale's <strong>⋯</strong> menu has <strong>Edit</strong>, <strong>Make default</strong> and <strong>Delete</strong>, which happens straight away, without asking. The delivery API uses the default locale when a request doesn't name one.</p><p>A locale version of an entry is a separate entry that shares its slug root: the same slug with a different locale, or the slug followed by <code>--</code> and the locale code, like <code>getting-started--de</code>. <strong>Coverage</strong> lists each slug root with the locales it has, and you can search it by slug root. The figures across the top show <strong>Locales</strong>, the <strong>Default</strong> locale, <strong>Missing default</strong> (slug roots without a default-locale version) and <strong>Slug roots</strong>.</p>$html$,
      '[]',
      null,
      110
    ),
    (
      'external-sources',
      'External Sources',
      'External sources',
      $html$<p>External Sources keeps a list of the feeds and APIs your entries come from. To add one, choose <strong>Architecture → External Sources</strong>, then <strong>New source</strong>. Only the <strong>Name</strong> is required. <strong>Type</strong> is API (the default), RSS, CSV or CMS. <strong>URL</strong> holds the endpoint, feed address or connection string, and <strong>Status</strong> starts as Disconnected. Choose <strong>Create source</strong>.</p><p>A source's status is Connected, Syncing, Disconnected or Error, and you set it by hand: in the dialog, or with <strong>Connect</strong> and <strong>Disconnect</strong> in the source's <strong>⋯</strong> menu. The figures across the top count <strong>Sources</strong>, <strong>Connected</strong>, <strong>Syncing</strong> and <strong>Needs attention</strong> (Error or Disconnected). Filter by status, and search names and URLs. <strong>Delete</strong> asks you to confirm first, and a deleted source can't be restored.</p>$html$,
      '[]',
      null,
      120
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"Rss","label":"Geiger Content","href":"/help/content"},{"icon":"Library","label":"Content library","href":"/help/content/library"},{"icon":"FileText","label":"Editorial","href":"/help/content/editorial"},{"icon":"CodeXml","label":"Developer tools","href":"/help/content/developers"},{"icon":"Target","label":"Personalization","href":"/help/content/personalization"},{"icon":"ShieldCheck","label":"Governance","href":"/help/content/governance"}]',
      null,
      130
    )
) as v(anchor_id, eyebrow, title, content, links, showcase, sort_order)
cross join (select id from public.docs_pages where slug = 'content/architecture' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Content architecture',
    description = 'Define content types, fields, reusable blocks, references, validation, taxonomies, locales and external sources.',
    status = 'draft',
    published_at = null
where slug = 'content/architecture' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'content/architecture' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Content Types</li><li>Field Schemas</li><li>Reusable Blocks</li><li>References</li><li>Validation Rules</li><li>Taxonomies</li><li>Localization</li><li>External Sources</li></ul>',
  10
from public.docs_pages p
where p.slug = 'content/architecture' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
