-- Remove events stage badge
--
-- Clears Events' stage badge on public.suite_product_badges now that Events is open to the public, so the Products menu shows no Pre-alpha/Early access label beside it.
-- Relies on 20261101034803_suite_product_badges and 20261105170000_early_access_badge.

-- @up
update public.suite_product_badges set badge = null where href = '/events';

-- @down
update public.suite_product_badges set badge = 'Early access' where href = '/events';
