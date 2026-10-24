-- Help plans pricing basic price
--
-- One-time content update: Basic went from $19 to $29 a month (lib/pricing/plans.js), so the plans-pricing page's
-- "plans" and "monthly-or-yearly" sections now say $29 a month and $290 a year. Only those two phrases change.
-- Live page snapshotted first (written_by 20261024192035_help_plans_pricing_page, no Studio edits).
-- Written from a survey of C:\Pro\geiger-dash (lib/pricing/plans.js: Basic price, YEARLY_MULTIPLIER).
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_content_blocks
set content = replace(content, '<strong>Basic</strong>, $19 a month', '<strong>Basic</strong>, $29 a month')
where anchor_id = 'plans'
  and page_id in (select id from public.docs_pages where slug = 'plans-pricing' and deleted_at is null);

update public.docs_content_blocks
set content = replace(content, 'Basic is $190 a year', 'Basic is $290 a year')
where anchor_id = 'monthly-or-yearly'
  and page_id in (select id from public.docs_pages where slug = 'plans-pricing' and deleted_at is null);

-- @down
update public.docs_content_blocks
set content = replace(content, 'Basic is $290 a year', 'Basic is $190 a year')
where anchor_id = 'monthly-or-yearly'
  and page_id in (select id from public.docs_pages where slug = 'plans-pricing' and deleted_at is null);

update public.docs_content_blocks
set content = replace(content, '<strong>Basic</strong>, $29 a month', '<strong>Basic</strong>, $19 a month')
where anchor_id = 'plans'
  and page_id in (select id from public.docs_pages where slug = 'plans-pricing' and deleted_at is null);
