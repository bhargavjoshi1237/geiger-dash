-- Imported from organisition/organization_avatar.sql by geiger-orm.
-- No @down section — this migration cannot be rolled back.

-- @up
-- Adds avatar_url to organizations for org icons / profile pictures.
-- Idempotent: safe to run multiple times.

alter table public.organizations
  add column if not exists avatar_url text null;
