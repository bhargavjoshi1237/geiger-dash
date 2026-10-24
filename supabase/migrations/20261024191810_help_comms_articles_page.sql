-- Help comms articles page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the comms/articles draft outline from
-- 20261024191800_help_comms_structure with the full Articles guide. Comms isn't deployed yet, so the page stays a draft.
-- Left out: the Use in AI answers switch and the bulk AI answers toggle (no AI answers ship in the Messenger), the
-- Insights "Was It Helpful?" figures (the Messenger's vote isn't recorded), and the Brand field (Brands is a coming-soon
-- screen).
-- Written from a survey of C:\Pro\geiger-comms (components/internal/screens/knowledge_base/articles.jsx,
-- article_editor.jsx, article_sections.jsx, markdown_editor.jsx, markdown_toolbar.js, ai_assist_menu.jsx,
-- ai_suggestion_dialog.jsx, translations_section.jsx, history_section.jsx, insights_section.jsx, publish_dialog.jsx,
-- delete_article_dialog.jsx, constants.js, use_articles.js, lib/kb/prompts.js, lib/supabase/articles.js,
-- supabase/migrations/20261021102424_knowledge_base_authoring.sql).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Articles',
    description = 'Write help articles, draft and edit them with AI, translate them, publish them to a help center and the Messenger, and restore earlier versions.'
where slug = 'comms/articles' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'comms/articles' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.sort_order
from (
  values
    (
      'creating-an-article',
      'Basics',
      'Creating an article',
      $html$<p>Articles are your self-serve help content. To write one, go to <strong>Knowledge Base → Articles</strong> and choose <strong>New article</strong>. Comms creates a draft and opens it in the editor.</p><ol><li>Type the title at the top, where it says <strong>Untitled article</strong>.</li><li>Optional: write a <strong>Description</strong>, the one-line summary shown under the title in the Messenger.</li><li>Write the body in the editor.</li><li>Choose <strong>Publish</strong>.</li></ol><p>Everything saves automatically as you type, so there is no Save button. An article needs a title before it can be published.</p>$html$,
      '[]',
      10
    ),
    (
      'article-states',
      'Concepts',
      'Article states and the Messenger',
      $html$<p>An article is in one of four states:</p><ul><li><strong>Draft</strong>: not published.</li><li><strong>Published</strong>: live.</li><li><strong>Changes unpublished</strong>: published, with edits saved but not live. The published version stays live until you choose <strong>Publish changes</strong>.</li><li><strong>Archived</strong>: put away, and hidden from the default list.</li></ul><p>A published article appears in the Messenger's <strong>Help</strong> space when it's in your default help center, that help center is live and public, and the article's audience is Everyone. Only the source language shows in the Messenger, not translations. When a published article isn't in the Messenger, the top of its editor says why, such as "Not in the default help center" or "Audience isn't Everyone".</p><p>In the Messenger, headings, numbered lists, link text, callouts, code blocks and images show as plain text.</p>$html$,
      '[]',
      20
    ),
    (
      'the-editor',
      'Articles',
      'Writing in the editor',
      $html$<p>The article body is Markdown. Switch the editor between <strong>Write</strong>, <strong>Preview</strong> and <strong>Split</strong>. The toolbar adds <strong>Bold</strong>, <strong>Italic</strong>, <strong>Inline code</strong>, <strong>Heading 2</strong>, <strong>Heading 3</strong>, <strong>Bulleted list</strong>, <strong>Numbered list</strong>, <strong>Link</strong>, <strong>Callout</strong>, <strong>Code block</strong>, <strong>Divider</strong> and <strong>Image</strong>.</p><p><strong>Link</strong> takes an https, http or mailto address. <strong>Image</strong> takes an <code>https://</code> image address and alt text that describes the image for screen readers.</p><p>Leave yourself a note with <code>[TODO: …]</code> in the body. When you publish an article that still has TODO notes, Comms asks you to confirm first.</p>$html$,
      '[]',
      30
    ),
    (
      'ai-writing-assistant',
      'Articles',
      'Writing with AI',
      $html$<p>The <strong>AI</strong> menu at the top of the editor uses your project's AI provider to help write the article:</p><ul><li><strong>Draft article</strong>: writes a first draft, offered while the body is empty.</li><li><strong>Improve writing</strong>, <strong>Shorten</strong>, <strong>Expand</strong> and <strong>Fix spelling & grammar</strong>.</li><li><strong>Change tone</strong>: <strong>Friendly</strong> or <strong>Formal</strong>.</li><li><strong>Write description</strong> and <strong>Suggest titles</strong>.</li></ul><p>The rewrites work on the text you've selected, or on the whole body when nothing is selected. Each one opens a suggestion first, and nothing changes until you apply it: <strong>Replace selection</strong> (or <strong>Replace body</strong>), <strong>Insert below</strong>, <strong>Use as description</strong>, <strong>Use title</strong> or <strong>Use this draft</strong>.</p><p>The AI menu uses the Article writing assistant feature. When it can't run, the menu says why; see <a href="/help/comms/ai-providers">AI providers</a>.</p>$html$,
      '[]',
      40
    ),
    (
      'article-settings',
      'Articles',
      'Help centers and details',
      $html$<p>Besides <strong>Content</strong>, an article's editor has these sections:</p><ul><li><strong>Help centers</strong>: turn on <strong>Show in</strong> for each help center the article belongs in, and pick its collection there. An article sits in one collection per help center.</li><li><strong>Details</strong>: <strong>Written by</strong> (the byline in the Messenger, or <strong>No author</strong>), <strong>Audience</strong> (Everyone, Users, Leads, Visitors, Users and leads, or Visitors and leads) and the source <strong>Language</strong>, with the article's ID, creation and update times and slug.</li><li><strong>Insights</strong>: how many times the Messenger opened the article and how many people viewed it over the last 30 days, a daily chart, and the knowledge gaps it answers.</li></ul>$html$,
      '[]',
      50
    ),
    (
      'publishing',
      'Articles',
      'Publishing and unpublishing',
      $html$<p>To publish an article, choose <strong>Publish</strong> at the top of its editor, or in its row's <strong>⋯</strong> menu. The first time you publish an article that isn't in any help center, Comms asks where to put it: pick a <strong>Help center</strong> (your default is selected) and, optionally, a <strong>Collection</strong>. With no help center at all, Comms creates one named "Help Center" as your default.</p><p>After that, the top of the editor changes with the article's state:</p><ul><li>Published: <strong>Unpublish</strong> turns it back into a draft.</li><li>Changes unpublished: <strong>Publish changes</strong> makes your edits live, and <strong>Discard changes</strong> drops them after you confirm. The published version stays live.</li><li>Archived: <strong>Restore to draft</strong>.</li></ul><p>Publishing, unpublishing, and archiving or deleting a published article need the <strong>Publish a help-centre article</strong> permission, which the Owner, Admin and Manager roles have. Without it, you can still write and edit drafts.</p>$html$,
      '[]',
      60
    ),
    (
      'translations',
      'Articles',
      'Translating articles',
      $html$<p>Each article can have one translation per language. Open the article's <strong>Translations</strong> section to see every language with its status: Missing, Draft, Published, Changes unpublished, Archived, or <strong>Out of date</strong> when the source has changed since the translation was made.</p><ul><li>To offer another language, pick it in <strong>Add language</strong>. It's added to your default help center's languages, which needs the <strong>Publish a help-centre article</strong> permission.</li><li>For a missing language, choose <strong>Add translation</strong> to start a blank draft, or <strong>Translate with AI</strong> to have your AI provider translate the source. An AI translation is marked "Machine translated" until it's published, so review it first.</li><li>Each translation's <strong>⋯</strong> menu has <strong>Open</strong>, <strong>Mark as up to date</strong> (for an out-of-date one) and <strong>Delete translation</strong>.</li></ul><p>Switch between languages from the language control at the top of the editor. Translate with AI uses the Article translation feature.</p>$html$,
      '[]',
      70
    ),
    (
      'version-history',
      'Articles',
      'Version history',
      $html$<p>Every time you publish, Comms records a version. To keep a snapshot of a draft as well, choose <strong>Save version</strong> in the editor's <strong>⋯</strong> menu, or press <code>Ctrl S</code> (<code>⌘ S</code> on Mac).</p><p>The <strong>Version history</strong> section lists the published versions and snapshots. Click one to see its changes against the current text, or a preview of it. <strong>Restore this version</strong> copies it back as a draft, and the published article stays as it is until you publish.</p>$html$,
      '[]',
      80
    ),
    (
      'article-list',
      'Articles',
      'The article list',
      $html$<p>The figures across the top of <strong>Articles</strong> count published articles (with how many are in the Messenger), drafts (with how many have unpublished changes), views over the last 30 days and translations.</p><p>Each row shows the article's title, status, languages, help centers, collection, author, 30-day views and when it was updated. Narrow the list by status (it starts on <strong>All except archived</strong>), help center, collection or language, or search it.</p><p>Select rows to <strong>Publish</strong>, <strong>Unpublish</strong>, archive or delete several articles at once. Each row's <strong>⋯</strong> menu has the actions for its state, plus <strong>Duplicate</strong>, <strong>Copy article ID</strong>, <strong>Archive</strong> and <strong>Delete</strong>.</p>$html$,
      '[]',
      90
    ),
    (
      'archiving-and-deleting',
      'Articles',
      'Archiving and deleting',
      $html$<p><strong>Archive</strong> puts an article away without deleting it: it leaves the Messenger and the default list, and <strong>Restore to draft</strong> brings it back.</p><p><strong>Delete</strong> asks you to confirm first. Deleting an article deletes its translations too, and removes it from the Messenger if it was published. To delete one language only, use <strong>Delete translation</strong>; the other languages are kept. Comms has no way to restore a deleted article.</p>$html$,
      '[]',
      100
    ),
    (
      'shortcuts',
      'Reference',
      'Keyboard shortcuts',
      $html$<p>In the article editor:</p><ul><li><code>Ctrl B</code> (<code>⌘ B</code> on Mac) bold</li><li><code>Ctrl I</code> (<code>⌘ I</code>) italic</li><li><code>Ctrl K</code> (<code>⌘ K</code>) link</li><li><code>Ctrl Shift 8</code> (<code>⌘ Shift 8</code>) bulleted list</li><li><code>Ctrl Shift 7</code> (<code>⌘ Shift 7</code>) numbered list</li><li><code>Ctrl S</code> (<code>⌘ S</code>) save a version</li></ul>$html$,
      '[]',
      110
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"BookOpen","label":"Help centers","href":"/help/comms/help-centers"},{"icon":"FileQuestionMark","label":"Knowledge gaps","href":"/help/comms/knowledge-gaps"},{"icon":"MessageCircle","label":"Messenger","href":"/help/comms/messenger"}]',
      120
    )
) as v(anchor_id, eyebrow, title, content, links, sort_order)
cross join (select id from public.docs_pages where slug = 'comms/articles' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Articles',
    description = 'Write, translate and publish help articles for your help centers and the Messenger.'
where slug = 'comms/articles' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'comms/articles' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Creating an article</li><li>The editor</li><li>AI writing assistant</li><li>Translations</li><li>Publishing and history</li></ul>',
  10
from public.docs_pages p
where p.slug = 'comms/articles' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
