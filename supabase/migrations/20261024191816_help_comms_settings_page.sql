-- Help comms settings page
--
-- One-time content move, like 20261024124814_help_flow_tasks_page: replaces the comms/settings draft outline from
-- 20261024191800_help_comms_structure with the full Settings guide (Settings → Navigation and Settings → Business Hours,
-- with pointers to the Teammates & roles and AI providers guides). Comms isn't deployed yet, so the page stays a draft.
-- The Settings entries that still render the coming-soon screen are left out.
-- Written from a survey of C:\Pro\geiger-comms (components/internal/screens/settings/navigation_settings.jsx,
-- business_hours.jsx, business_hours_dialog.jsx, business_hours_constants.js, geiger-ui.config.js,
-- lib/hooks/use-visible-nav.js, context/nav-visibility-context.js, lib/supabase/nav_prefs.js, business_hours.js,
-- node_modules/@geiger/ui/src/nav/nav-visibility-settings.jsx, resolve.js,
-- supabase/migrations/20261021103039_adopt_business_hours_and_sla.sql, 20261021103040_adopt_routing_engine.sql).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_pages
set title = 'Settings',
    description = 'Choose which screens appear in your own sidebar, and set the business hours that SLA targets, workflows and routing follow.'
where slug = 'comms/settings' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'comms/settings' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, sort_order)
select p.id, v.anchor_id, v.eyebrow, v.title, v.content, v.links::jsonb, v.sort_order
from (
  values
    (
      'hiding-sidebar-sections',
      'Basics',
      'Choosing what your sidebar shows',
      $html$<p>To hide screens you don't use, go to <strong>Settings → Navigation</strong> and turn off the switch beside each one. Each change saves straight away and shows a confirmation. It changes only your own sidebar, in this project: your teammates keep theirs.</p><p>Search the list, or filter it to <strong>All</strong>, <strong>Shown</strong>, <strong>Hidden</strong> or <strong>Always on</strong>. Turning off a whole section hides every screen in it. While anything is hidden, <strong>Show all</strong> puts every screen back.</p><p>Your role still decides which sections you can see at all: Navigation only hides screens your role already grants.</p>$html$,
      '[]',
      10
    ),
    (
      'screens-that-cant-be-hidden',
      'Navigation',
      'Screens that can''t be hidden',
      $html$<p><strong>Overview</strong>, <strong>Inbox</strong>, <strong>All Conversations</strong>, <strong>Settings</strong> and <strong>Navigation</strong> are always on, and their switches are disabled.</p><p>Some screens need another one. You can't show a screen while something it needs is hidden, or hide a screen while a shown one needs it. The disabled switch says why, such as "Views needs All Conversations. Show it first." For example:</p><ul><li><strong>Your Inbox</strong>, <strong>Mentions</strong>, <strong>Views</strong> and <strong>Quality & CSAT</strong> need <strong>All Conversations</strong>.</li><li><strong>Segments</strong> needs <strong>People</strong>.</li><li><strong>Workflow Templates</strong> and <strong>Run History</strong> need <strong>Workflows</strong>.</li><li><strong>Help Centers</strong> and <strong>Knowledge Gaps</strong> need <strong>Articles</strong>.</li><li><strong>Roles & Permissions</strong> needs <strong>Teammates</strong>.</li></ul>$html$,
      '[]',
      20
    ),
    (
      'creating-business-hours',
      'Business Hours',
      'Setting business hours',
      $html$<p>Business hours say when your team is open. To add a schedule, go to <strong>Settings → Business Hours</strong> and choose <strong>New schedule</strong>.</p><ul><li><strong>Name</strong>: such as <code>US support hours</code>.</li><li><strong>Applies to</strong>: <strong>Whole workspace</strong>, meaning the whole project, or one of your teammate groups. A group without its own hours follows the project's.</li><li><strong>Timezone</strong>: starts as your browser's. Opening times are read in this time zone.</li><li><strong>Weekly hours</strong>: an opening and closing time for each day, or closed. It starts as Monday to Friday, 09:00 to 17:00, closed at weekends. Closing time must be after opening time.</li><li><strong>Holidays</strong>: pick a date, name it and choose <strong>Add holiday</strong>. A holiday closes the whole day, in the schedule's time zone.</li><li><strong>Enabled</strong>: on by default.</li></ul><p>Choose <strong>Create hours</strong>.</p>$html$,
      '[]',
      30
    ),
    (
      'how-business-hours-are-used',
      'Concepts',
      'What business hours affect',
      $html$<p>Business hours are used in three places:</p><ul><li><strong>SLA policies</strong> linked to a schedule count only its open time toward their targets. See <a href="/help/comms/routing-and-slas">Routing rules and SLAs</a>.</li><li><strong>Workflows</strong> can branch on <strong>Inside office hours</strong> or <strong>Outside office hours</strong>, using the project's hours. See <a href="/help/comms/workflows">Workflows</a>.</li><li><strong>Routing</strong>: a teammate set to Away gets new conversations only while their group's hours, or the project's, are open.</li></ul><p>Without business hours, the project counts as always open, and SLA targets run on calendar time.</p>$html$,
      '[]',
      40
    ),
    (
      'managing-business-hours',
      'Business Hours',
      'Managing schedules',
      $html$<p>The list shows each schedule with who it applies to, its time zone, its weekly hours, whether it's open right now (<strong>Open now</strong>, <strong>Closed now</strong>, <strong>Holiday</strong> or <strong>Disabled</strong>), its holidays and whether it's enabled. The figures across the top count schedules, how many are open now, the SLA policies linked to them and the holidays ahead.</p><p>Each row's <strong>⋯</strong> menu has <strong>Edit</strong>, <strong>Duplicate</strong>, <strong>Disable</strong> (or <strong>Enable</strong>) and <strong>Delete</strong>. Deleting asks you to confirm first and says how many SLA policies use the schedule; those policies count calendar time instead.</p>$html$,
      '[]',
      50
    ),
    (
      'other-settings',
      'Settings',
      'Teammates, roles and AI providers',
      $html$<p>The other Settings screens have guides of their own:</p><ul><li><strong>Teammates</strong> and <strong>Roles & Permissions</strong>: invite people, organize groups and decide what each role can do. See <a href="/help/comms/teammates">Teammates and roles</a>.</li><li><strong>AI Providers</strong>: connect your own AI provider and turn AI features on or off. See <a href="/help/comms/ai-providers">AI providers</a>.</li></ul>$html$,
      '[]',
      60
    ),
    (
      'related-guides',
      null,
      'Related guides',
      '',
      '[{"icon":"UserCog","label":"Teammates & roles","href":"/help/comms/teammates"},{"icon":"Cpu","label":"AI providers","href":"/help/comms/ai-providers"},{"icon":"Route","label":"Routing rules & SLAs","href":"/help/comms/routing-and-slas"}]',
      70
    )
) as v(anchor_id, eyebrow, title, content, links, sort_order)
cross join (select id from public.docs_pages where slug = 'comms/settings' and deleted_at is null) p;

-- @down
update public.docs_pages
set title = 'Settings',
    description = 'Choose what your sidebar shows and set your business hours.'
where slug = 'comms/settings' and deleted_at is null;

delete from public.docs_content_blocks
where page_id in (select id from public.docs_pages where slug = 'comms/settings' and deleted_at is null);

insert into public.docs_content_blocks (page_id, anchor_id, title, content, sort_order)
select p.id, 'overview', 'Overview',
  '<p><em>Draft outline. Replace before publishing.</em></p><ul><li>Navigation</li><li>Business hours</li><li>Holidays</li></ul>',
  10
from public.docs_pages p
where p.slug = 'comms/settings' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;
