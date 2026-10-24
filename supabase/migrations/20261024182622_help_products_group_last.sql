-- Help products group last
--
-- One-time content move: moves the "Products" sidebar group to the end (sort_order 30 -> 90), so the product groups that
-- graduate out of it (Flow 25, then 26 to 36) sit above it. Products keeps any app that has no group of its own yet.
-- Later edits happen in Studio, so this must never re-run.

-- @up
update public.docs_nav_groups set sort_order = 90 where slug = 'products';

-- @down
update public.docs_nav_groups set sort_order = 30 where slug = 'products';
