-- Help flow tasks related guides
--
-- One-time content move: adds a "Related guides" row to the end of the published flow/tasks page, now that the
-- other Flow guides are published (20261024142437 to 20261024142451). The page's other sections are untouched.
-- Written from a survey of C:\Pro\geiger-flow (components/internal/sidebar/projects/sidebar_data.js).
-- Later edits happen in Studio, so this must never re-run.

-- @up
insert into public.docs_content_blocks (page_id, anchor_id, eyebrow, title, content, links, sort_order)
select p.id, 'related-guides', null, 'Related guides', '',
  '[{"icon":"GitBranch","label":"Issue tracker","href":"/help/flow/issues"},{"icon":"Flag","label":"Milestones & goals","href":"/help/flow/goals"},{"icon":"ChartColumn","label":"Reporting","href":"/help/flow/reporting"},{"icon":"CalendarRange","label":"Projections","href":"/help/flow/projections"},{"icon":"LayoutDashboard","label":"Project overview","href":"/help/flow/project-overview"},{"icon":"Settings","label":"Project settings","href":"/help/flow/settings"}]'::jsonb,
  90
from public.docs_pages p
where p.slug = 'flow/tasks' and p.deleted_at is null
on conflict (page_id, anchor_id) do nothing;

-- @down
delete from public.docs_content_blocks
where anchor_id = 'related-guides'
  and page_id in (select id from public.docs_pages where slug = 'flow/tasks' and deleted_at is null);
