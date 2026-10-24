-- Help content editorial page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the content/editorial draft outline with
-- the full Editorial guide and publishes it. Content has no section showcases yet, so the page is text only.
-- Written from a survey of C:\Pro\geiger-content (components/internal/screens/editorial/*, components/internal/screens/
-- operations_ui.jsx, lib/supabase/{content,comments,workflow,versions,publishing,assistant}.js, app/api/assistant/route.js,
-- app/api/cron/publish-due/route.js, supabase/migrations/20261001075342_delivery_settings_and_decisions.sql and
-- 20261001081041_project_scoped_rls.sql).
-- Left out: @mention notifications (mentions are stored, but nothing notifies anyone) and any link between workflow
-- states and entry statuses (there is none; the page says statuses are set separately).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Editorial',
    description = 'Fill in structured fields, discuss entries in comment threads, assign owners, approve or reject entries in review, and restore earlier versions.',
    preview = null,
    status = 'published',
    published_at = coalesce(published_at, now())
where slug = 'content/editorial' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'content/editorial' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, showcase, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.showcase, v.sort_order
from (
  values
    (
      'editing-structured-fields',
      'Basics',
      'Editing an entry''s fields',
      $html$<p>To fill in an entry's fields, choose <strong>Editorial → Structured Editor</strong> in the sidebar and pick the entry from the menu at the top, which lists each entry with its type. The editor shows the fields of the entry's content type, with a * after required ones, and then the entry's <strong>Body</strong>, built from paragraph and heading blocks.</p><p>Choose <strong>Save</strong> when you're done. Content checks every value against its field's rules first. If any fail, it shows how many fields need attention and puts the message under each field, and nothing is saved. Otherwise it saves the fields and the body together, takes a new version and confirms with "saved as version" and the version number.</p><p>The figures across the top count the type's <strong>Fields</strong>, how many are <strong>Filled</strong>, and the <strong>Issues</strong> found on the last save. If no content type matches the entry's type, the editor shows "No schema for type" and the type name: create a matching type in <a href="/help/content/architecture">Content architecture</a>.</p><p>Saving needs the Edit an entry or page permission, and saving an entry that's Published or Scheduled also needs Publish an entry or page.</p>$html$,
      '[]',
      null,
      10
    ),
    (
      'review-and-versions',
      'Concepts',
      'Review, versions and history',
      $html$<p>An entry goes through review by its status. A writer sets the entry to In review in its <strong>Visibility</strong> tab, and someone with the Publish an entry or page permission approves it in the Review Queue, which publishes it, or rejects it back to Draft.</p><p>A version is a saved copy of an entry's title, slug, body and other details at one moment. Content takes a version each time you save in the Structured Editor, each time you publish from the Publishing Queue, and when it publishes a Scheduled entry on its date. Versions taken at publish time are marked published. Version History shows them, and Compare and Rollback compares two of them and can restore the older one.</p><p>Changing an entry anywhere else, such as in the entry editor or with Bulk Editing, doesn't take a version.</p>$html$,
      '[]',
      null,
      20
    ),
    (
      'field-inputs',
      'Structured Editor',
      'Field inputs by data type',
      $html$<p>The Structured Editor gives each field an input that matches its data type:</p><ul><li><strong>Text</strong>: a one-line box.</li><li><strong>Number</strong>: a number box.</li><li><strong>Boolean</strong>: a menu of True and False.</li><li><strong>Date</strong>: a date picker.</li><li><strong>Enum</strong>: a menu of the field's options.</li><li><strong>Media</strong>: a menu of the project's assets.</li><li><strong>Reference</strong>: a box for the linked entry's id or slug.</li><li><strong>Rich text</strong> and <strong>JSON</strong>: a larger text box. A JSON field keeps its last valid value while you type, and shows "Not valid JSON yet; the last valid value is kept." until the text is valid.</li></ul><p>Localized fields say "Localized · varies per locale." under the input. Switching to another entry in the menu at the top discards changes you haven't saved.</p>$html$,
      '[]',
      null,
      30
    ),
    (
      'visual-editor',
      'Visual Editor',
      'Previewing a published entry',
      $html$<p><strong>Editorial → Visual Editor</strong> shows a published entry the way readers see it: the cover image, the excerpt, the body and the author. Pick the entry from the menu at the top, which lists published entries only, and pick a width with the three device buttons: Desktop (full width), Tablet (768 pixels) or Mobile (390 pixels).</p><p>The preview doesn't change anything. To edit what it shows, open the entry from <strong>Content → All Content</strong>. If nothing is published yet, the screen shows "Nothing published yet".</p>$html$,
      '[]',
      null,
      40
    ),
    (
      'comment-threads',
      'Comments & Mentions',
      'Comment threads',
      $html$<p>To start a discussion about an entry, choose <strong>Editorial → Comments & Mentions</strong>, then <strong>New thread</strong>. Pick the <strong>Entry</strong>, optionally name the field it's about in <strong>Field key</strong>, write the <strong>Comment</strong> and choose <strong>Start thread</strong>. The entry and the comment are required.</p><p>Threads are listed with the most recent activity first. Each one shows its entry, its field key, whether it's Open or Resolved, and every reply with its date and time. <strong>Reply</strong> opens a box under the thread: type the reply, then press <code>Enter</code> or choose <strong>Post</strong>. <strong>Resolve</strong> closes the thread, and <strong>Reopen</strong> opens it again.</p><p>Switch between <strong>All</strong>, <strong>Open</strong> and <strong>Resolved</strong> threads, and search entry titles, field keys and comment text. The figures across the top count <strong>Threads</strong>, <strong>Open</strong> threads and <strong>Replies</strong>. Comments can't be edited or deleted. Posting needs the Edit an entry or page permission.</p>$html$,
      '[]',
      null,
      50
    ),
    (
      'assignments',
      'Assignments',
      'Assigning entries',
      $html$<p>An assignment names who owns an entry through review, and by when. To create one, choose <strong>Editorial → Assignments</strong>, then <strong>New assignment</strong>:</p><ul><li><strong>Entry</strong> and <strong>Assignee</strong> are required. The assignee is free text, such as a name or an email address.</li><li><strong>Due date</strong> is optional.</li><li><strong>Status</strong>: Open (the default), In progress or Done.</li><li><strong>Priority</strong>: Low, Normal (the default), High or Urgent.</li></ul><p>Choose <strong>Create assignment</strong>. Each row shows the entry, the assignee and the due date, which turns red once it has passed on an assignment that isn't Done. The figures across the top count <strong>Assignments</strong>, <strong>Open</strong> ones (anything not Done), <strong>Overdue</strong> ones and <strong>High priority</strong> ones (open and High or Urgent).</p><p>Filter by status, and search assignees and entry titles. Each row's <strong>⋯</strong> menu has <strong>Edit</strong>, <strong>Mark done</strong> and <strong>Delete</strong>, which removes the assignment straight away, without asking. Assignments need the Edit an entry or page permission.</p>$html$,
      '[]',
      null,
      60
    ),
    (
      'review-queue',
      'Review Queue',
      'Approving and rejecting entries',
      $html$<p><strong>Editorial → Review Queue</strong> lists every entry that's In review, most recently updated first. Each row shows the entry's slug, type, author and last update, with two buttons:</p><ul><li><strong>Approve</strong> publishes the entry straight away. It needs the Publish an entry or page permission, which the Owner, Admin and Editor roles have.</li><li><strong>Reject</strong> sends the entry back to Draft.</li></ul><p>Neither asks you to confirm first. The figures across the top show how many entries are <strong>Awaiting review</strong>, the <strong>Oldest wait</strong> (the last update date of the longest-waiting entry) and how many <strong>Types</strong> are in the queue. Filter by type, and search titles, slugs and authors. When nothing is waiting, the queue shows "Queue is clear".</p>$html$,
      '[]',
      null,
      70
    ),
    (
      'approval-workflows',
      'Approval Workflows',
      'Workflow states',
      $html$<p><strong>Editorial → Approval Workflows</strong> records the steps of your team's review process, such as Legal review, in order. To add a step, choose <strong>New state</strong>. Only the <strong>Label</strong> is required, and the <strong>Key</strong> fills in from it. <strong>Position</strong> sets its place in the order, and new states go last. <strong>Terminal</strong> is No to start (the flow continues); pick Yes for a state that ends the flow. Choose <strong>Create state</strong>.</p><p>The <strong>Flow</strong> card shows the states in position order. In the list, each state is a <strong>Gate</strong> or <strong>Terminal</strong>, and its <strong>⋯</strong> menu has <strong>Edit</strong> and <strong>Delete</strong>, which removes it straight away, without asking.</p><p>Workflow states describe your process; they don't change entries. An entry's status stays one of Draft, In review, Scheduled, Published or Archived, set in its <strong>Visibility</strong> tab or by the Review Queue. Changing states needs the Edit an entry or page permission.</p>$html$,
      '[]',
      null,
      80
    ),
    (
      'version-history',
      'Version History',
      'Version history',
      $html$<p><strong>Editorial → Version History</strong> lists an entry's versions, newest first. Pick the entry from the menu at the top. Each row shows the version number, a published tag if it was taken at publish time, when it was taken, and its title and number of fields. Click a version to see everything it saved.</p><p>The figures across the top show the number of <strong>Versions</strong>, the <strong>Latest</strong> one and how many are <strong>Published snapshots</strong>. Version History only reads; to restore a version, use <strong>Editorial → Compare & Rollback</strong>.</p>$html$,
      '[]',
      null,
      90
    ),
    (
      'compare-and-rollback',
      'Compare & Rollback',
      'Comparing and restoring versions',
      $html$<p>To compare two versions of an entry, choose <strong>Editorial → Compare & Rollback</strong> and pick the entry from the menu at the top. Content starts with the second-newest version on the left, as the baseline, and the newest on the right; change either one with the version menus. The table lists every difference with its path, whether it was <strong>Added</strong>, <strong>Removed</strong> or <strong>Changed</strong>, and the value in each version. An entry needs at least two versions to compare.</p><p>To restore the baseline, choose the restore button at the top, which names the baseline version (like <strong>Restore v3</strong>), then <strong>Restore</strong> in the dialog. It overwrites the entry's title, slug, excerpt, body and field values with the baseline's, and the entry's current state isn't saved as a version first. Restoring needs the Edit an entry or page permission, and Publish an entry or page too when the entry is Published or Scheduled.</p>$html$,
      '[]',
      null,
      100
    ),
    (
      'bulk-editing',
      'Bulk Editing',
      'Changing many entries at once',
      $html$<p><strong>Editorial → Bulk Editing</strong> sets the status or type of many entries in one go:</p><ol><li>Select entries with the checkbox on each row, or click the row. <strong>Select all in view</strong> selects every entry that matches the filters and search.</li><li>Under <strong>Batch action</strong>, pick a new status, a new type, or both. <strong>Keep status</strong> and <strong>Keep type</strong> leave that part as it is.</li><li>Choose <strong>Apply</strong>, which shows how many entries are selected.</li></ol><p>Selections are kept when you change the filters, and <strong>Clear</strong> empties them. If some updates fail, Content says how many and reloads the list. Setting entries to Published or Scheduled, or changing entries that already are, needs the Publish an entry or page permission.</p>$html$,
      '[]',
      null,
      110
    ),
    (
      'ai-assistant',
      'AI Assistant',
      'Asking the AI Assistant',
      $html$<p>The AI Assistant writes editorial suggestions, such as a summary, a clearer introduction or a better title. To ask, choose <strong>Editorial → AI Assistant</strong>, optionally pick an entry in <strong>Entry context</strong> (the menu lists the 100 most recently updated entries), type up to 4,000 characters in <strong>Request</strong> and choose <strong>Ask assistant</strong>. With an entry picked, the assistant reads its title, excerpt and body.</p><p>Suggestions don't change or publish anything. Your requests and responses are saved and private to you, and the table shows your last 20. Each person can ask up to five times a minute in a project; after that, Content says "Wait a minute before asking again." Asking needs the Edit an entry or page permission.</p><p>If the screen shows "Generation provider unavailable", the assistant hasn't been set up on the server, and only your saved history is available.</p>$html$,
      '[]',
      null,
      120
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"Rss","label":"Geiger Content","href":"/help/content"},{"icon":"Library","label":"Content library","href":"/help/content/library"},{"icon":"DraftingCompass","label":"Content architecture","href":"/help/content/architecture"},{"icon":"Rocket","label":"Publishing","href":"/help/content/publishing"},{"icon":"ShieldCheck","label":"Governance","href":"/help/content/governance"},{"icon":"ChartNoAxesCombined","label":"Content intelligence","href":"/help/content/intelligence"}]',
      null,
      130
    )
) as v(anchor_id, eyebrow, title, content, links, showcase, sort_order)
cross join (select id from public.docs_pages where slug = 'content/editorial' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Editorial',
    description = 'Write, review and approve content with editors, comments, assignments, workflows and version history.',
    status = 'draft',
    published_at = null
where slug = 'content/editorial' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'content/editorial' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Structured Editor</li><li>Visual Editor</li><li>Comments and mentions</li><li>Assignments</li><li>Review Queue</li><li>Approval Workflows</li><li>Version History</li><li>Compare and rollback</li><li>Bulk Editing</li><li>AI Assistant</li></ul>',
  10
from public.docs_pages p
where p.slug = 'content/editorial' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
