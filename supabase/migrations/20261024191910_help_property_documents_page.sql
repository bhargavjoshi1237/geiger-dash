-- Help property documents page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the property/documents draft outline from
-- 20261024191900_help_property_structure with the full Documents & e-signature guide (the sidebar's Documents group:
-- Document Library, Templates, E-signature) and publishes it.
-- Written from a survey of C:\Pro\geiger-property (components/internal/screens/documents/*,
-- components/internal/screens/leasing/{lease_templates,esignature}.jsx, leasing/sections/lease_document.jsx,
-- lib/leasing/{merge,workflows}.js, components/internal/screens/entity/shared_sections/documents_section.jsx,
-- lib/supabase/property_storage.js).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Documents & e-signature',
    description = 'Find every file in one library, write lease templates with merge fields, generate lease documents and track signatures.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'property/documents' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'property/documents' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.sort_order
from (
  values
    (
      'uploading-a-document',
      'Basics',
      'Uploading a document',
      $html$<p>To add a file to the library, choose <strong>Documents → Document Library</strong> in the sidebar, then <strong>Upload</strong>. Choose the <strong>File</strong>, give it a <strong>Name</strong>, pick a <strong>Kind</strong> (Lease, Inspection, Insurance, Invoice, Notice or Other) and choose <strong>Upload</strong>. Images are compressed; PDFs and other files are stored as they are.</p><p>Most records also have a <strong>Documents</strong> section of their own, such as a property, unit, tenant, lease or vendor. Files you add there are kept with that record and also appear in the library.</p>$html$,
      '[]',
      10
    ),
    (
      'document-library',
      'Document library',
      'The document library',
      $html$<p><strong>Document Library</strong> lists every file in the project in one place: library uploads, documents on properties and other records, tenant documents, and maintenance attachments. Each row shows which record it belongs to, such as <strong>Property · Maple Court</strong>.</p><p>Filter by source (<strong>Library</strong>, <strong>Property records</strong>, <strong>Tenant</strong> or <strong>Maintenance</strong>) and by kind, or search by name. Each row's <strong>⋯</strong> menu has <strong>Open</strong>. Files uploaded to the library itself also have <strong>Delete</strong>, which asks you to confirm and can't be undone; delete other files from the record they belong to.</p><p>The figures at the top count all documents (with how many were added in the last 30 days), library uploads, files attached to records and tenants, and work order files.</p>$html$,
      '[]',
      20
    ),
    (
      'lease-templates',
      'Templates',
      'Lease templates',
      $html$<p>A lease template is the agreement text a lease's document is built from. To create one, choose <strong>Documents → Templates</strong>, then <strong>New Template</strong>. Only <strong>Template name</strong> is required. Its <strong>Scope</strong> is Generic or State-specific, with a two-letter <strong>State</strong> for state-specific templates. A template is Draft, Published or Archived.</p><p>In the template's editor:</p><ul><li><strong>Template Body</strong>: the lease text, with merge fields written as <code>{{group.field}}</code>, like <code>{{tenant.name}}</code> or <code>{{lease.rent}}</code>.</li><li><strong>Merge Field Catalog</strong>: every merge field you can use, by group (Lease, Rent, Deposits, People, Premises, Terms and Other). Click one to copy it.</li><li><strong>Custom Fields</strong>: extra placeholders of your own, with sample values.</li><li><strong>Clause Library</strong>: reusable clauses with a title and wording (both required), a category, and whether they're required in every lease.</li><li><strong>Preview</strong>: the template merged with sample values or a real lease.</li><li><strong>State Requirements</strong> and <strong>Required Disclosures</strong>, <strong>Leases Using It</strong>, and <strong>Versions</strong>.</li></ul><p><strong>Actions → Publish new version</strong> asks for the version number and what changed (both required). Leases and documents already generated don't change. <strong>Archive</strong> retires a template; leases already using it keep it.</p>$html$,
      '[]',
      30
    ),
    (
      'generating-a-lease-document',
      'Templates',
      'Generating a lease document',
      $html$<p>A lease's agreement is built from its template. Open the lease in <strong>Leasing → Leases</strong> and go to its <strong>Template &amp; Document</strong> section. Pick the <strong>Lease template</strong>: without one, Property uses its built-in starter agreement. Then choose <strong>Generate Lease Document</strong>, or <strong>Actions → Generate lease document</strong>.</p><p>Property fills each merge field from the lease, its people, unit, property and policies, and saves the result to the lease's documents as a text file. <strong>Preview</strong> shows the merged agreement before you generate it, and the section lists every merge field with this lease's current value.</p><p>The lease's <strong>Clauses</strong> section adds clauses from the template's clause library, in the order they appear, and <strong>Addenda</strong> holds addenda such as a pet agreement, each Draft, Attached or Signed.</p>$html$,
      '[]',
      40
    ),
    (
      'e-signature',
      'E-signature',
      'Tracking signatures',
      $html$<p>E-signature in Property tracks signing by hand: no e-signature provider is connected, so Property doesn't send documents for signature. Send the document yourself, then record each step as it happens.</p><p>To track one, open the lease's <strong>E-signature</strong> section and choose <strong>Create Signing Request</strong>, which lists the lease's people as signers. Or choose <strong>Documents → E-signature</strong>, then <strong>New Signing Request</strong>: only <strong>Document name</strong> is required, with an optional lease and primary signer.</p><p>A request is Draft, Sent, Viewed, Partially signed, Signed, Declined or Voided. Its <strong>Actions</strong> menu has <strong>Mark sent</strong>, <strong>Mark viewed</strong>, <strong>Mark signed</strong>, <strong>Mark declined</strong> and <strong>Void request</strong>, and each one is added to the request's <strong>Audit Trail</strong>. Marking a request signed also sets its lease's signed date, if the lease doesn't have one yet.</p><p>In the request's editor, tick each signer in <strong>Signers</strong> as they sign, and keep a document link, signing order, expiry date and reminder cadence. The list's figures count requests, those awaiting signatures, signed and declined.</p>$html$,
      '[]',
      50
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"FilePen","label":"Leasing","href":"/help/property/leasing"},{"icon":"Users","label":"Tenants, owners & vendors","href":"/help/property/people"},{"icon":"Scale","label":"Legal resources","href":"/help/property/legal-resources"}]',
      200
    )
) as v(anchor_id, eyebrow, title, content, links, sort_order)
cross join (select id from public.docs_pages where slug = 'property/documents' and deleted_at is null) p;

-- @down
-- Restores the draft exactly as 20261024191900_help_property_structure left it.
update public.docs_pages
set title = 'Documents & e-signature',
    description = 'Store documents, build templates and send documents for e-signature.',
    status = 'draft',
    published_at = null
where slug = 'property/documents' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'property/documents' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Document library</li><li>Templates</li><li>E-signature</li></ul>',
  10
from public.docs_pages p
where p.slug = 'property/documents' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
