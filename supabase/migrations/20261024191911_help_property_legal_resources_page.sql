-- Help property legal resources page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the property/legal-resources draft outline
-- from 20261024191900_help_property_structure with the full Legal resources guide (the sidebar's Legal Resources
-- screen) and publishes it. The live database holds 52 jurisdictions and 1,222 resources (checked read-only).
-- Written from a survey of C:\Pro\geiger-property (components/internal/screens/legal/{legal_resources,directory_view,
-- library_view,map_view,jurisdiction_detail,parts,constants}.*, lib/supabase/legal_resources.js).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Legal resources',
    description = 'Find official landlord-tenant sources for every state: statutes, agency guides, court self-help, legal aid and rent rules.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'property/legal-resources' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'property/legal-resources' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.sort_order
from (
  values
    (
      'finding-a-source',
      'Basics',
      'Finding a legal source',
      $html$<p><strong>Legal Resources</strong> in the sidebar collects official landlord-tenant sources for every US state, plus federal agencies and national directories that apply everywhere. Every link opens the original government, court or legal-aid page. These are official sources, not legal advice: laws change, so confirm details on the source and talk to a lawyer about specific situations.</p><p>Switch between three views at the top of the screen: <strong>Directory</strong>, <strong>Library</strong> and <strong>Map</strong>.</p>$html$,
      '[]',
      10
    ),
    (
      'rent-regulation',
      'Concepts',
      'Rent regulation status',
      $html$<p>Each state is labeled by how it regulates rent:</p><ul><li><strong>Statewide Rent Cap</strong>: state law caps yearly rent increases for covered units.</li><li><strong>Local Rent Control Allowed</strong>: no statewide cap, but cities and counties can adopt their own rent rules.</li><li><strong>Partly Preempted</strong>: no statewide cap, and state law limits what cities and counties can regulate.</li><li><strong>Preempted by State</strong>: state law bars cities and counties from controlling rent.</li><li><strong>Not Confirmed</strong>: it couldn't be confirmed whether local rent control is allowed. Check the state's own sources.</li></ul><p>A state's page shows when its rent rules were last reviewed. Confirm them on the source before acting on them.</p>$html$,
      '[]',
      20
    ),
    (
      'directory-library-map',
      'Legal resources',
      'Directory, library and map',
      $html$<ul><li><strong>Directory</strong>: <strong>Where You Operate</strong> lists the states your properties are in, with how many properties each. <strong>All Jurisdictions</strong> lists every state, filtered by rent regulation status or found with <strong>Search states</strong>. Click a state to open its page.</li><li><strong>Library</strong>: pick a state, then a topic, and see its sources for that topic.</li><li><strong>Map</strong>: a map of the states shaded by rent regulation, where a stronger fill means more regulation. Pick a state to preview its rent rules, its count of official links and local programs, and where to start.</li></ul>$html$,
      '[]',
      30
    ),
    (
      'state-pages',
      'Legal resources',
      'A state''s sources',
      $html$<p>A state's page shows its rent regulation and how many of your properties are in it, then its sources in two tabs: <strong>Statewide</strong> (<strong>Federal &amp; National</strong> on the federal page) and <strong>Cities &amp; Counties</strong>. Search by title, publisher or citation, such as a statute number, an agency or a city.</p><p>Sources are grouped by topic: Statutes, Official Guides, Rent Regulation, Court Self-Help, Legal Aid, Fair Housing, File a Complaint, Code Enforcement, Health &amp; Safety and Rental Assistance, among others. Some are tagged <strong>For Tenants</strong> or <strong>For Landlords</strong>. Choose <strong>All Jurisdictions</strong> to go back.</p>$html$,
      '[]',
      40
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"FilePen","label":"Leasing","href":"/help/property/leasing"},{"icon":"FileText","label":"Documents & e-signature","href":"/help/property/documents"},{"icon":"Building2","label":"Properties & units","href":"/help/property/properties"}]',
      200
    )
) as v(anchor_id, eyebrow, title, content, links, sort_order)
cross join (select id from public.docs_pages where slug = 'property/legal-resources' and deleted_at is null) p;

-- @down
-- Restores the draft exactly as 20261024191900_help_property_structure left it.
update public.docs_pages
set title = 'Legal resources',
    description = 'Look up landlord-tenant law and resources by jurisdiction.',
    status = 'draft',
    published_at = null
where slug = 'property/legal-resources' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'property/legal-resources' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Browsing by jurisdiction</li><li>The resource library</li><li>Jurisdiction details</li></ul>',
  10
from public.docs_pages p
where p.slug = 'property/legal-resources' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
