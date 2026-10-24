-- Help campaign opens chosen project
--
-- One-time content move: Dash now launches Campaign straight into the chosen project (lib/org/product-apps.js
-- projectColumn "id"), so the campaign page's "Opening Campaign" section stops describing the old route through
-- Campaign's home page and the last-used project. Only that section's first paragraph changes.
-- Written from a survey of C:\Pro\geiger-campaign (app/project/[projectId]/[[...rest]]/page.js) and
-- C:\Pro\geiger-dash (lib/org/product-apps.js, app/org/[ORGID]/_components/constants.js launchHref).
-- Push it after the Dash deploy that changes projectColumn. The @down restores the section written by 20261024191320.
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_content_blocks
set content = $html$<p>Campaign works inside a <strong>project</strong>, and everyone in your organization can open its projects there. To open Campaign, choose <strong>Campaign</strong> on a project in your organization in Dash, and Campaign opens on that project. If your organization's plan doesn't include Campaign, it's dimmed on the project in Dash and can't be opened, and hovering over it shows Campaign isn't in your plan.</p><p>The address bar keeps the project and the screen you're on, so a refresh or a link someone shares from it opens that same project and screen. Campaign has no project switcher of its own.</p><p>The first time you open a project, Campaign gives you a role there from your role in the organization, and that role decides which sections you see. See <a href="/help/campaign/team#how-members-get-a-role">How members get their role</a>.</p>$html$
where anchor_id = 'opening-campaign'
  and page_id in (select id from public.docs_pages where slug = 'campaign' and deleted_at is null);

-- @down
update public.docs_content_blocks
set content = $html$<p>Campaign works inside a <strong>project</strong>, and everyone in your organization can open its projects there. To open Campaign, choose <strong>Campaign</strong> on a project in your organization in Dash, then <strong>Continue to Campaign</strong> on Campaign's home page. Campaign opens the project you last opened in it on this browser or, the first time, the oldest of your projects. If your organization's plan doesn't include Campaign, it's dimmed on the project in Dash and can't be opened, and hovering over it shows Campaign isn't in your plan.</p><p>The address bar keeps the project and the screen you're on, so a refresh or a link someone shares from it opens that same project and screen. Campaign has no project switcher of its own.</p><p>The first time you open a project, Campaign gives you a role there from your role in the organization, and that role decides which sections you see. See <a href="/help/campaign/team#how-members-get-a-role">How members get their role</a>.</p>$html$
where anchor_id = 'opening-campaign'
  and page_id in (select id from public.docs_pages where slug = 'campaign' and deleted_at is null);
