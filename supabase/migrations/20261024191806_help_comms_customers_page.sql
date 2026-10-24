-- Help comms customers page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the comms/customers draft outline from
-- 20261024191800_help_comms_structure with the full Customers guide (People, Companies, Segments, CSV import and export).
-- Comms isn't deployed yet, so the page stays a draft.
-- Written from a survey of C:\Pro\geiger-comms (components/internal/screens/customers/people.jsx, person_detail.jsx,
-- person_sections.jsx, companies.jsx, company_detail.jsx, segments.jsx, segment_detail.jsx, import_dialog.jsx,
-- import_plan.js, constants.js, use_customers.js, lib/supabase/customers.js, companies.js, segments.js, imports.js).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Customers',
    description = 'Keep a record of everyone who writes in: people and their timelines, the companies they belong to, segments, and CSV import and export.'
where slug = 'comms/customers' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'comms/customers' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.sort_order
from (
  values
    (
      'adding-people',
      'Basics',
      'Adding people',
      $html$<p>Everyone who writes in gets a contact record in <strong>People</strong>, under <strong>Customers</strong> in the sidebar. Comms adds one when a signed-in customer starts the Messenger, and when you start a conversation for someone new. To add one yourself, choose <strong>Add person</strong>:</p><ul><li><strong>Name</strong> and <strong>Email</strong>: give at least one. Without a name, Comms uses the part of the email before the @.</li><li><strong>Company</strong>: one of your companies, or <strong>No company</strong>.</li></ul><p>Choose <strong>Add person</strong> to save. New contacts start at the Lead lifecycle stage, and the record opens. To add many at once, choose <strong>Import</strong>; see <a href="#importing-from-csv">Importing from CSV</a>.</p>$html$,
      '[]',
      10
    ),
    (
      'how-records-connect',
      'Concepts',
      'Lifecycle stages and linked records',
      $html$<p>Each contact has a <strong>lifecycle stage</strong>: Lead, Trial, Customer, VIP or Churned. It says where the person is in their relationship with you, and you set it on their record.</p><p>A contact's conversations are the ones linked to their record, plus any conversation with the same email address. Their tickets are the tickets linked to those conversations. A contact can belong to one company, and a company's conversations and tickets are those of everyone linked to it.</p><p>A <strong>segment</strong> is a saved audience: everyone whose record matches its rules right now. Its members change as records change.</p>$html$,
      '[]',
      20
    ),
    (
      'people-list',
      'People',
      'The people list',
      $html$<p>The figures across the top of <strong>People</strong> show how many <strong>People</strong> there are (with how many are new this week), <strong>VIP</strong> (tagged VIP or at the VIP stage), <strong>In conversation</strong> (with an open conversation) and <strong>Tickets</strong> linked to people.</p><p>Each row shows the person's name and email, company, lifecycle stage, open conversations, tickets and when they were last seen. Narrow the list by lifecycle stage or company, or search names, emails, companies and locations. It shows 25 people a page; switch to 10, 50 or 100 at the bottom.</p><p>Each row's <strong>⋯</strong> menu has <strong>Open</strong>, <strong>Open conversation</strong> and <strong>Open ticket</strong> (their latest, when they have one) and <strong>Delete</strong>. <strong>Export</strong> downloads the people in the current list, with your filters applied, as a CSV file.</p>$html$,
      '[]',
      30
    ),
    (
      'a-persons-record',
      'People',
      'A person''s record',
      $html$<p>Click a person to open their record. Its <strong>Overview</strong> holds:</p><ul><li><strong>Personal info</strong>: <strong>Name</strong>, <strong>Title</strong>, <strong>Phone</strong>, <strong>Lifecycle</strong> and <strong>Owner</strong>. Their email shows here too, but you can't change it on the record.</li><li><strong>Contact points</strong>: <strong>Location</strong>, <strong>Timezone</strong>, <strong>Language</strong> and <strong>Company</strong>. The inbox copilot translates replies into the language set here.</li><li><strong>Tags</strong>: the person's own tags, plus the tags on their conversations. Add one by typing a name and pressing <code>Enter</code>.</li><li><strong>Segments</strong>: every segment the person matches right now.</li><li><strong>Subscription</strong>: switches for <strong>Email</strong> and <strong>SMS</strong>.</li><li><strong>Recent activities</strong>: the latest events from their timeline.</li></ul><p>Each field saves when you leave it or press <code>Enter</code>, so there is no Save button. At the top, <strong>Message</strong> opens their latest conversation, and <strong>New ticket</strong> creates a customer ticket on it. New ticket stays disabled until the person has a conversation.</p>$html$,
      '[]',
      40
    ),
    (
      'timeline',
      'People',
      'Timeline, conversations and tickets',
      $html$<p>A person's <strong>Timeline</strong> puts everything about them in one list, newest first: their conversations, the tags on those conversations, their tickets, notes and tasks, and when the contact was created. Filter it to <strong>All</strong>, <strong>Conversations</strong>, <strong>Tickets</strong>, <strong>Notes</strong> or <strong>Tasks</strong>.</p><p><strong>Conversations</strong> lists every conversation they've had, newest first, and <strong>Tickets</strong> lists the tickets linked through those conversations. Click one to open it in the inbox or in Tickets.</p>$html$,
      '[]',
      50
    ),
    (
      'notes-and-tasks',
      'People',
      'Notes and tasks',
      $html$<p>Under <strong>Notes & tasks</strong> in a person's record, keep internal context and follow-ups. Customers never see them.</p><ul><li><strong>Notes</strong>: write in the note box and choose <strong>Add note</strong>. Each note shows who wrote it and when, and <strong>Delete</strong> removes it straight away.</li><li><strong>Tasks</strong>: type in the task box and press <code>Enter</code>. Select a task's checkbox to mark it done; the trash icon deletes it straight away.</li></ul><p>Notes and tasks also show on the person's timeline.</p>$html$,
      '[]',
      60
    ),
    (
      'custom-attributes',
      'People',
      'Custom attributes',
      $html$<p>Custom attributes are fields your team defines, such as a plan or a seat count. They appear on every record of that kind: people's attributes are separate from companies'.</p><p>To add one, open any person (or company), go to <strong>Attributes</strong>, type the attribute's name, choose its type and choose <strong>Add attribute</strong>. The types are <strong>Text</strong>, <strong>Number</strong>, <strong>Date</strong>, <strong>True / false</strong> and <strong>List</strong>. A list needs at least one option, separated by commas. Two attributes can't share a name.</p><p>Then set each record's value under <strong>Custom attributes</strong>. Standard attributes, such as email, user ID, phone and company, have their own list in the same section, filled in from conversations, the Messenger and imports. People's custom attributes can also be segment rules.</p>$html$,
      '[]',
      70
    ),
    (
      'companies',
      'Companies',
      'Companies',
      $html$<p><strong>Companies</strong> holds the accounts your contacts belong to. To add one, choose <strong>Add company</strong> and fill in <strong>Company name</strong> (required), <strong>Domain</strong> and <strong>Owner</strong>. Two companies can't share a domain.</p><p>The list shows each company's people, open conversations, plan, owner, last activity and creation date. Filter it by owner, or search names and domains. The figures across the top count companies (with how many people are linked), open conversations, tickets and companies with no owner.</p><p>When people have a company name but no company record, a banner offers <strong>Link to companies</strong>. It links them to the companies with those names, and creates the ones that don't exist.</p>$html$,
      '[]',
      80
    ),
    (
      'a-companys-record',
      'Companies',
      'A company''s record',
      $html$<p>Click a company to open its record. <strong>Overview</strong> shows its people, conversations, open conversations and tickets, with its <strong>Account</strong> fields: <strong>Name</strong>, <strong>Domain</strong>, <strong>Company ID</strong>, <strong>Website</strong>, <strong>Industry</strong>, <strong>Company size</strong>, <strong>Plan</strong>, <strong>Monthly spend</strong> and <strong>Owner</strong>. Each field saves as you leave it, and a company always needs a name.</p><p>The other sections are <strong>Attributes</strong>, <strong>People</strong> (everyone linked to the company), <strong>Conversations</strong> and <strong>Tickets</strong> across the whole account, and <strong>Activity</strong>, the combined timeline of everyone there. To link a person to a company, set <strong>Company</strong> on their record.</p>$html$,
      '[]',
      90
    ),
    (
      'creating-a-segment',
      'Segments',
      'Creating a segment',
      $html$<p>To create a segment, go to <strong>Segments</strong> and describe the audience in <strong>Describe an audience</strong>, such as <code>trial customers at Acme</code> or <code>unsubscribed</code>, then press <code>Enter</code>. Comms turns the words it recognizes (a lifecycle stage, "unsubscribed", "new", one of your companies or tags, or "in" a place) into rules for you to check. Or choose <strong>Start from scratch instead</strong>.</p><p>In the <strong>New segment</strong> dialog, give it a <strong>Name</strong> (required) and an optional <strong>Description</strong>, and adjust the rules. A person must match every rule. The dialog counts how many people match right now. Choose <strong>Add rule</strong> for another rule. The rules can test:</p><ul><li><strong>Lifecycle stage</strong>: is or is not a stage.</li><li><strong>Tag</strong>, <strong>Company</strong> and <strong>Location</strong>: is, is not or contains some text.</li><li><strong>Email subscription</strong>: Subscribed or Unsubscribed.</li><li><strong>Created</strong>: within the last number of days you choose.</li><li>Any custom attribute on people.</li></ul>$html$,
      '[]',
      100
    ),
    (
      'managing-segments',
      'Segments',
      'Built-in segments and editing segments',
      $html$<p>Five segments are built in and can't be changed: <strong>All people</strong>, <strong>VIPs</strong>, <strong>New this week</strong>, <strong>Trials</strong> and <strong>Unsubscribed from email</strong>. To change one, duplicate it and edit the copy.</p><p>The list shows each segment's size, type (built-in or saved) and when it was last edited. Sort it by <strong>Recently edited</strong>, <strong>Name (A–Z)</strong> or <strong>Largest first</strong>, or search it.</p><p>Open a segment to see its <strong>Definition</strong> and the people who match. Edits show as unsaved until you choose <strong>Save</strong>, and the matches update as you edit. <strong>Refresh</strong> recounts, and <strong>Duplicate</strong> makes a copy named "copy". <strong>Delete</strong> asks you to confirm; deleting a segment removes only the saved audience, never the people in it.</p>$html$,
      '[]',
      110
    ),
    (
      'importing-from-csv',
      'Import',
      'Importing from CSV',
      $html$<p>To import people or companies, choose <strong>Import</strong> on <strong>People</strong> or <strong>Companies</strong>.</p><ol><li>Choose a CSV file: UTF-8, separated by commas, semicolons or tabs, with a header row. It can be up to 10 MB and 10,000 rows.</li><li>Match each column to a field, a custom attribute, a new text attribute named after the column, or <strong>Don't import</strong>. Comms matches columns by name for you.</li><li>Choose <strong>Preview</strong>. Comms shows how many rows are <strong>New</strong>, <strong>Updates</strong>, <strong>Unchanged</strong> and <strong>Rejected</strong>, and why each rejected row was rejected.</li><li>Choose what happens when a row matches an existing record: <strong>Update it with the file's values</strong> or <strong>Leave it unchanged</strong>.</li><li>Choose <strong>Import</strong>. When it finishes, <strong>Download</strong> saves the rejected rows and their reasons as a CSV file.</li></ol>$html$,
      '[]',
      120
    ),
    (
      'import-matching',
      'Reference',
      'Import fields and matching',
      $html$<p>A people import needs an <strong>Email</strong> or <strong>User ID</strong> column. Rows match existing people by user ID, then by email. A companies import needs a <strong>Company name</strong>, <strong>Domain</strong> or <strong>Company ID</strong> column, and rows match by company ID, then domain, then name.</p><ul><li>Blank cells never overwrite existing values.</li><li><strong>Name</strong> can come from <strong>First name</strong> and <strong>Last name</strong> columns.</li><li><strong>Lifecycle stage</strong> must be Lead, Trial, Customer, VIP or Churned.</li><li><strong>Tags</strong> are separated by commas, semicolons or bars.</li><li><strong>Unsubscribed from email</strong> takes true, yes, 1, false, no or 0.</li><li>A <strong>Company name</strong> with no matching company creates one, and the person is linked to it.</li></ul><p>A row is rejected when it has neither email nor user ID, has an invalid email, repeats an earlier row in the file, or has an email and user ID that belong to two different people.</p>$html$,
      '[]',
      130
    ),
    (
      'deleting-records',
      'People',
      'Deleting people and companies',
      $html$<p>To delete a person, choose <strong>Delete</strong> in their row's <strong>⋯</strong> menu or at the top of their record. Comms asks you to confirm first. Their conversations keep their history.</p><p>To delete a company, choose <strong>Delete</strong> in its row menu or its record. Comms asks you to confirm first, and its people stay in People without a company. Deleted people and companies can't be restored from Comms.</p>$html$,
      '[]',
      140
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"Inbox","label":"Inbox","href":"/help/comms/inbox"},{"icon":"Ticket","label":"Tickets","href":"/help/comms/tickets"},{"icon":"MessageCircle","label":"Messenger","href":"/help/comms/messenger"}]',
      150
    )
) as v(anchor_id, eyebrow, title, content, links, sort_order)
cross join (select id from public.docs_pages where slug = 'comms/customers' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Customers',
    description = 'Keep the people, companies and segments behind each conversation.'
where slug = 'comms/customers' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'comms/customers' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>People</li><li>Person details and timeline</li><li>Companies</li><li>Segments</li><li>Importing from CSV</li></ul>',
  10
from public.docs_pages p
where p.slug = 'comms/customers' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
