-- Early access badge
--
-- Adds 'Early access' to the stage badges on public.suite_product_badges and moves Events onto it.
-- Search answers were reading Events' 'Pre-alpha' badge as "not ready for paid events".
-- Relies on 20261101034803_suite_product_badges.

-- @up
alter table public.suite_product_badges drop constraint if exists suite_product_badges_badge_check;
alter table public.suite_product_badges add constraint suite_product_badges_badge_check
  check (badge in ('Pre-alpha', 'Alpha', 'Beta', 'Early access'));

update public.suite_product_badges set badge = 'Early access' where href = '/events';

-- @down
update public.suite_product_badges set badge = 'Pre-alpha' where href = '/events';

alter table public.suite_product_badges drop constraint if exists suite_product_badges_badge_check;
alter table public.suite_product_badges add constraint suite_product_badges_badge_check
  check (badge in ('Pre-alpha', 'Alpha', 'Beta'));
