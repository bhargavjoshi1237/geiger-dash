-- Help comms help centers page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the comms/help-centers draft outline from
-- 20261024191800_help_comms_structure with the full Help centers guide. Comms isn't deployed yet, so the page stays a
-- draft. Comms serves no help-center website (WEBSITE_NOTICE in knowledge_base/constants.js), so the website-only
-- settings (Domain, search indexing and analytics, Branding, Layout, the private login page) get one sentence, not a
-- walkthrough; the Brand field is left out (Brands is a coming-soon screen).
-- Written from a survey of C:\Pro\geiger-comms (components/internal/screens/knowledge_base/help_centers.jsx,
-- help_center_detail.jsx, help_center_sections.jsx, help_center_preview.jsx, new_help_center_dialog.jsx,
-- collections_section.jsx, add_articles_dialog.jsx, publish_dialog.jsx, constants.js, use_help_centers.js,
-- lib/supabase/help_centers.js, lib/widget/data.js).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Help centers',
    description = 'Group your articles into help centers and collections, choose which help center the Messenger shows, and set its languages.'
where slug = 'comms/help-centers' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'comms/help-centers' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.sort_order
from (
  values
    (
      'creating-a-help-center',
      'Basics',
      'Creating a help center',
      $html$<p>A help center groups your articles into collections, and your default help center is what customers browse in the Messenger's <strong>Help</strong> space. To create one, go to <strong>Knowledge Base → Help Centers</strong> and choose <strong>New help center</strong>.</p><ul><li><strong>Name</strong>: required, and unique in the project.</li><li><strong>URL identifier</strong>: lowercase letters, numbers and hyphens, 1 to 64 characters, unique in the project.</li><li><strong>Default language</strong>: the language new articles are written in.</li><li><strong>Set live</strong>: starts on for your first help center and off for later ones.</li></ul><p>Choose <strong>Create help center</strong>. Your first help center becomes the default. Publishing your first article also creates one, named "Help Center", if you don't have any.</p><p>Creating and changing help centers needs the <strong>Publish a help-centre article</strong> permission, which the Owner, Admin and Manager roles have. Without it, you can view them.</p>$html$,
      '[]',
      10
    ),
    (
      'default-help-center',
      'Concepts',
      'The default help center and the Messenger',
      $html$<p>The Messenger shows one help center: your <strong>default</strong>. Its published articles appear in the Messenger's Help space, grouped by its collections, when all of these are true:</p><ul><li>The help center is <strong>Live</strong>. Not live hides its articles from the Messenger.</li><li>Its <strong>Visibility</strong> is <strong>Public</strong>. A private help center's articles stay out of the Messenger.</li><li>The article is published, in the source language, with the audience Everyone.</li></ul><p>Articles in other help centers don't appear in the Messenger. To change which help center it shows, choose <strong>Set as default</strong> on another one.</p><p>Comms doesn't serve help centers as websites. The website settings, such as <strong>Domain</strong>, search indexing, <strong>Branding</strong> and <strong>Layout</strong>, are saved and shown in <strong>Preview</strong> only.</p>$html$,
      '[]',
      20
    ),
    (
      'collections',
      'Help Centers',
      'Collections and articles',
      $html$<p>Open a help center and go to <strong>Collections & articles</strong> to organize what it holds.</p><ul><li><strong>Add articles</strong>: search your articles and add them to the help center, optionally into a collection.</li><li><strong>New collection</strong>: give it a <strong>Name</strong> and an optional <strong>Description</strong>, then <strong>Create collection</strong>. Each collection's menu has <strong>Add sub-collection</strong>, <strong>Edit</strong>, <strong>Move to</strong> and <strong>Delete</strong>. Collections nest up to three levels deep, and the arrows move a collection up or down.</li><li>Each article's menu has <strong>Open article</strong>, <strong>Move to collection</strong> and <strong>Remove from help center</strong>. An article sits in one collection per help center, and articles without one are listed under <strong>Unassigned</strong>.</li></ul><p>Deleting a collection asks you to confirm first. Its sub-collections are deleted too, and its articles move to Unassigned and stay in the help center.</p>$html$,
      '[]',
      30
    ),
    (
      'help-center-settings',
      'Help Centers',
      'Help center settings',
      $html$<p>Click a help center to open it. <strong>Overview</strong> shows whether it's the default, its live state, visibility and languages, with how many of its articles are in the Messenger, its collections and its views over the last 30 days. The other sections are:</p><ul><li><strong>General</strong>: the name, URL identifier, <strong>Default help center</strong> and <strong>Live</strong>.</li><li><strong>Languages</strong>: the languages its articles can be translated into, and its <strong>Default language</strong>.</li><li><strong>Visibility & SEO</strong>: <strong>Public</strong> (anyone can read it) or <strong>Private</strong>, which keeps its articles out of the Messenger.</li><li><strong>Preview</strong>: how the help center would look as a website.</li><li><strong>Danger zone</strong>: <strong>Delete help center</strong>.</li></ul><p>The help center list shows each one's status, visibility, languages, articles, collections and last update. Each row's <strong>⋯</strong> menu has <strong>Edit</strong>, <strong>Set as default</strong>, <strong>Set live</strong> or <strong>Set not live</strong>, and <strong>Delete</strong>.</p>$html$,
      '[]',
      40
    ),
    (
      'deleting-a-help-center',
      'Help Centers',
      'Deleting a help center',
      $html$<p>To delete a help center, choose <strong>Delete</strong> in its row's <strong>⋯</strong> menu or <strong>Delete help center</strong> under <strong>Danger zone</strong>. Comms asks you to confirm first. Deleting removes its collections and takes its articles out of the help center, and the articles themselves are kept.</p><p>The default help center can't be deleted. Make another one the default first.</p>$html$,
      '[]',
      50
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"FileText","label":"Articles","href":"/help/comms/articles"},{"icon":"MessageCircle","label":"Messenger","href":"/help/comms/messenger"},{"icon":"FileQuestionMark","label":"Knowledge gaps","href":"/help/comms/knowledge-gaps"}]',
      60
    )
) as v(anchor_id, eyebrow, title, content, links, sort_order)
cross join (select id from public.docs_pages where slug = 'comms/help-centers' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Help centers',
    description = 'Publish articles as help centers, organized into collections.'
where slug = 'comms/help-centers' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'comms/help-centers' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Creating a help center</li><li>Collections</li><li>Appearance and settings</li><li>The default help center</li></ul>',
  10
from public.docs_pages p
where p.slug = 'comms/help-centers' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
