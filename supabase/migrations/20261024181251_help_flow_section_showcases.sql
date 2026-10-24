-- Help flow section showcases
--
-- One-time content move: puts a live Flow showcase on the section of each published Flow guide that describes its screen,
-- the way flow/tasks already does. Only `showcase` changes; every section's text, title and anchor stay as they are.
-- A screen showcase goes on the section that describes the screen's layout, or on its create section when the
-- playground's demo data leaves that layout empty (Projections, Vault). The flow overview keeps its whole-app preview.
-- Written from a survey of C:\Pro\geiger-flow (components/landing/playground/flow_component_embed.jsx,
-- components/internal/screens/it/*, components/internal/screens/projects/*, addons/*).
-- The showcase ids must be registered in lib/docs/showcases.js before this is pushed.
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_content_blocks b
set showcase = v.showcase
from (
  values
    ('flow/project-overview', 'opening-the-overview', 'flow/overview'),
    ('flow/issues', 'issue-list', 'flow/issues'),
    ('flow/issues', 'issue-details', 'flow/issue-details'),
    ('flow/issues', 'inbox', 'flow/issues-inbox'),
    ('flow/issues', 'triage', 'flow/issues-triage'),
    ('flow/issues', 'views', 'flow/issues-views'),
    ('flow/issues', 'members', 'flow/issues-members'),
    ('flow/issues', 'tracker-settings', 'flow/issues-settings'),
    ('flow/issues/cycles-and-divisions', 'cycles', 'flow/issues-cycles'),
    ('flow/issues/cycles-and-divisions', 'divisions', 'flow/issues-divisions'),
    ('flow/issues/cycles-and-divisions', 'initiatives', 'flow/issues-initiatives'),
    ('flow/grounding', 'opening-grounding', 'flow/grounding'),
    ('flow/planning', 'adding-nodes', 'flow/planning'),
    ('flow/projections', 'creating-an-event', 'flow/projections'),
    ('flow/goals', 'milestone-list', 'flow/milestones'),
    ('flow/goals', 'goal-list', 'flow/goals'),
    ('flow/goals', 'objectives-list', 'flow/objectives'),
    ('flow/reporting', 'summary-figures', 'flow/reporting'),
    ('flow/assets', 'asset-library', 'flow/assets'),
    ('flow/logs', 'reading-the-log', 'flow/logs'),
    ('flow/team', 'team-list', 'flow/team'),
    ('flow/team', 'allocations-list', 'flow/resource-allocation'),
    ('flow/vault', 'adding-a-secret', 'flow/vault'),
    ('flow/security', 'security-screen', 'flow/security'),
    ('flow/settings', 'project-name', 'flow/settings-general'),
    ('flow/settings', 'hiding-sidebar-sections', 'flow/settings-navigation'),
    ('flow/settings', 'add-ons-tab', 'flow/settings-add-ons'),
    ('flow/settings', 'usage', 'flow/settings-usage'),
    ('flow/add-ons', 'turning-add-ons-on', 'flow/settings-add-ons'),
    ('flow/add-ons', 'system-architecture', 'flow/system-architecture'),
    ('flow/add-ons', 'budget-tracker', 'flow/budget-tracker')
) as v(slug, anchor_id, showcase)
join public.docs_pages p on p.slug = v.slug and p.deleted_at is null
where b.page_id = p.id and b.anchor_id = v.anchor_id;

-- @down
update public.docs_content_blocks b
set showcase = null
from (
  values
    ('flow/project-overview', 'opening-the-overview'),
    ('flow/issues', 'issue-list'),
    ('flow/issues', 'issue-details'),
    ('flow/issues', 'inbox'),
    ('flow/issues', 'triage'),
    ('flow/issues', 'views'),
    ('flow/issues', 'members'),
    ('flow/issues', 'tracker-settings'),
    ('flow/issues/cycles-and-divisions', 'cycles'),
    ('flow/issues/cycles-and-divisions', 'divisions'),
    ('flow/issues/cycles-and-divisions', 'initiatives'),
    ('flow/grounding', 'opening-grounding'),
    ('flow/planning', 'adding-nodes'),
    ('flow/projections', 'creating-an-event'),
    ('flow/goals', 'milestone-list'),
    ('flow/goals', 'goal-list'),
    ('flow/goals', 'objectives-list'),
    ('flow/reporting', 'summary-figures'),
    ('flow/assets', 'asset-library'),
    ('flow/logs', 'reading-the-log'),
    ('flow/team', 'team-list'),
    ('flow/team', 'allocations-list'),
    ('flow/vault', 'adding-a-secret'),
    ('flow/security', 'security-screen'),
    ('flow/settings', 'project-name'),
    ('flow/settings', 'hiding-sidebar-sections'),
    ('flow/settings', 'add-ons-tab'),
    ('flow/settings', 'usage'),
    ('flow/add-ons', 'turning-add-ons-on'),
    ('flow/add-ons', 'system-architecture'),
    ('flow/add-ons', 'budget-tracker')
) as v(slug, anchor_id)
join public.docs_pages p on p.slug = v.slug and p.deleted_at is null
where b.page_id = p.id and b.anchor_id = v.anchor_id;
