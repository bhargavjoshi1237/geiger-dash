-- Help grey knowledge graph page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the grey/knowledge-graph draft outline
-- (20261024191700_help_grey_structure) with the full Knowledge graph guide and publishes it.
-- Written from a survey of C:\Pro\geiger-grey (components/internal/screens/graph/*, lib/supabase/graph.js,
-- lib/grey/graph_schema.js, graph_router.js, duplicates.js, lib/engine/graph_extract.js, worker/ingest/run.mjs,
-- components/internal/screens/playground/chat.jsx, supabase/migrations/20261018120300_graph_extraction.sql,
-- geiger-rbac.config.js).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Knowledge graph',
    description = 'See the people, organizations and other entities Grey finds in your sources, edit and merge them, and shape the types it extracts.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'grey/knowledge-graph' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'grey/knowledge-graph' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.sort_order
from (
  values
    (
      'building-the-graph',
      'Basics',
      'Building the knowledge graph',
      $html$<p>The knowledge graph holds the <strong>entities</strong> found in your sources (people, organizations, products, places and more) and the <strong>relations</strong> between them. Each project has one graph, fed by all its knowledge bases.</p><p>Grey builds it during ingestion, in each job's Graph stage, for knowledge bases whose ingestion settings have <strong>Extract entities and relations</strong> turned on. It's on in the Balanced, High accuracy and Auto presets. To build the graph:</p><ol><li>Set a processing model in <strong>Settings → General</strong>. Extraction runs on it.</li><li>Make sure <strong>Extract entities and relations</strong> is on in the knowledge base's <a href="/help/grey/knowledge-bases#settings-reference">ingestion settings</a>.</li><li>Add sources, or re-ingest the ones already there.</li></ol><p>Without a processing model, ingestion still finishes, but the graph isn't updated. Re-ingesting a source replaces what Grey found in it earlier.</p>$html$,
      '[]',
      10
    ),
    (
      'entities-relations-and-types',
      'Concepts',
      'Entities, relations and types',
      $html$<p>Every entity has a name, a type, optional aliases and a description, a source and a confidence. The source says where it came from: <strong>Grey</strong> (extracted from your sources), <strong>Forms</strong> (added from Geiger Forms submissions) or <strong>Manual</strong> (added by hand). The confidence is how sure the extraction was, as a percentage.</p><p>A relation joins two entities with a relation type, such as works_at or part_of. A <strong>mention</strong> records that a source talks about an entity, with the page when Grey knows it.</p><p>The project's ontology lists the types. Grey extracts only those entity and relation types, guided by each type's description, and keeps entities it's at least 50% confident about. Anything that fits no type is filed as Other or related_to.</p><p>Pipelines can use the graph when they answer. A pipeline's <strong>Graph</strong> setting decides when; see <a href="/help/grey/pipelines">Pipelines and model providers</a>.</p>$html$,
      '[]',
      20
    ),
    (
      'graph-explorer',
      'Graph Explorer',
      'Exploring the graph',
      $html$<p><strong>Knowledge Graph → Graph Explorer</strong> draws the graph. Each dot is an entity, colored by its type and sized by how many relations it has, and each line is a relation. Click an entity to open its details, and click empty space to close them.</p><ul><li>The type chips narrow the graph to the types you select; select several to combine them.</li><li>The knowledge base filter keeps entities mentioned in that knowledge base's sources.</li><li><strong>Search entities</strong> matches names and aliases and lists up to eight matches. Click one to select it and center the view on it.</li><li><strong>2D</strong> and <strong>3D</strong> at the top left switch the view. 3D is the default.</li><li>The + and − buttons at the bottom left zoom, and the button at the top right fits the whole graph in view.</li><li><strong>Graph forces</strong> opens sliders for <strong>Center force</strong>, <strong>Repel force</strong>, <strong>Link force</strong> and <strong>Link distance</strong>, with a button that restores their defaults.</li></ul><p>The graph draws at most 500 entities, keeping the most connected ones, and says how many it's showing when it hides some.</p>$html$,
      '[]',
      30
    ),
    (
      'entity-details',
      'Entities',
      'Entity details',
      $html$<p>Click an entity in Graph Explorer or the Entities list to open its details: its type, description, aliases, source and confidence.</p><ul><li><strong>Relations</strong>: every relation to or from the entity. To add one, pick a <strong>Relation</strong> type and a <strong>Target entity</strong>, then choose the + button beside them. Remove a relation with the trash icon beside it.</li><li><strong>Mentioned in</strong>: the sources that mention the entity. Click one to open it in Sources.</li></ul><p><strong>Ask about this</strong> opens Chat with a question about the entity already typed in the message box, ready to send or change. <strong>Edit</strong> opens the entity's form.</p><p>Adding or removing relations and editing need the <strong>Edit the knowledge graph</strong> permission, which every built-in role except Viewer has. Without it, those controls don't appear.</p>$html$,
      '[]',
      40
    ),
    (
      'entity-list',
      'Entities',
      'The entity list',
      $html$<p><strong>Knowledge Graph → Entities</strong> lists the graph's entities. The figures across the top count the <strong>Entities</strong>, <strong>Entity types</strong>, <strong>Relations</strong> and <strong>Possible duplicates</strong>.</p><p>Each row shows the entity's name and type, how many relations and mentions it has, its source, its confidence and when it was last updated. Search by name or alias, and click a row to open the entity's details. Each row's <strong>⋯</strong> menu has <strong>Edit</strong> and <strong>Delete</strong> if you can edit the graph.</p><p>The list shows 25 entities a page; switch to 10, 50 or 100 at the bottom. The <strong>Possible duplicates</strong> tab lists entities that look like the same thing.</p>$html$,
      '[]',
      50
    ),
    (
      'adding-and-editing-entities',
      'Entities',
      'Adding, editing and deleting entities',
      $html$<p>To add an entity by hand, choose <strong>Add entity</strong> on Graph Explorer or Entities, fill in the form and choose <strong>Create entity</strong>.</p><ul><li><strong>Name</strong> and <strong>Type</strong>: required.</li><li><strong>Aliases</strong>: other names for the entity. Press <code>Enter</code> after each one.</li><li><strong>Description</strong>: optional notes.</li></ul><p>Entities you add show <strong>Manual</strong> as their source. To change one, choose <strong>Edit</strong> in its <strong>⋯</strong> menu or its details, then <strong>Save changes</strong>.</p><p>To delete an entity, choose <strong>Delete</strong> in its <strong>⋯</strong> menu. Grey asks you to confirm first. The entity leaves the graph, its relations and mentions are left pointing at nothing, and it can't be restored from Grey. To combine two entities instead, merge them.</p><p>All of these need the <strong>Edit the knowledge graph</strong> permission.</p>$html$,
      '[]',
      60
    ),
    (
      'merging-duplicates',
      'Entities',
      'Merging duplicates',
      $html$<p>Grey flags entities as possible duplicates when they have the same type and their names match, or one's name matches the other's alias. Names are compared without case, accents, punctuation or a trailing Inc, Ltd, LLC, Corp or Co.</p><p>To merge a group:</p><ol><li>In <strong>Knowledge Graph → Entities</strong>, open the <strong>Possible duplicates</strong> tab.</li><li>Choose <strong>Merge</strong> on the group.</li><li>Click the entity to keep. It's marked <strong>Keep</strong>, and <strong>Aliases after merge</strong> shows the aliases it will have.</li><li>Choose <strong>Merge</strong> to confirm. The button names how many entities merge into which one.</li></ol><p>The other entities' names become aliases of the one you kept, their relations and mentions move to it, and they leave the graph. Merging needs the <strong>Edit the knowledge graph</strong> permission.</p>$html$,
      '[]',
      70
    ),
    (
      'ontology',
      'Ontology',
      'Entity and relation types',
      $html$<p><strong>Knowledge Graph → Ontology</strong> lists the project's <strong>Entity types</strong> and <strong>Relation types</strong>. A project starts with the entity types Person, Organization, Product, Location, Event, Concept, Document and Other, and the relation types works_at, part_of, mentions, related_to, located_in and created.</p><p>To add a type, choose <strong>Add type</strong> on either list. <strong>Name</strong> is required; pick one of five <strong>Colour</strong> options and add a <strong>Description</strong> if you like, then choose <strong>Create type</strong>. Grey reads each type's description when it extracts entities, so say what belongs in it. The pencil beside a type edits it.</p><p>The trash icon deletes a type that nothing uses yet, after you confirm. A type in use can't be deleted: hovering over its trash icon says how many records use it. Changes to the ontology apply to sources ingested from then on.</p><p>Managing the ontology needs the <strong>Manage the ontology</strong> permission, which Owners, Admins and Managers have.</p>$html$,
      '[]',
      80
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"FileStack","label":"Sources & ingestion","href":"/help/grey/sources"},{"icon":"Library","label":"Knowledge bases","href":"/help/grey/knowledge-bases"},{"icon":"Workflow","label":"Pipelines & model providers","href":"/help/grey/pipelines"},{"icon":"MessagesSquare","label":"Playground","href":"/help/grey/playground"},{"icon":"Settings","label":"Project settings","href":"/help/grey/settings"},{"icon":"Users","label":"Team & roles","href":"/help/grey/team"}]',
      90
    )
) as v(anchor_id, eyebrow, title, content, links, sort_order)
cross join (select id from public.docs_pages where slug = 'grey/knowledge-graph' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Knowledge graph',
    nav_label = null,
    description = 'Explore the entities and relationships Grey extracts from your sources, and shape the ontology behind them.',
    status = 'draft',
    published_at = null
where slug = 'grey/knowledge-graph' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'grey/knowledge-graph' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Graph Explorer</li><li>Entities</li><li>Merging entities</li><li>Ontology</li></ul>',
  10
from public.docs_pages p
where p.slug = 'grey/knowledge-graph' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
