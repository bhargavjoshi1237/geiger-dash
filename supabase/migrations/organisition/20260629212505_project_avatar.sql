-- Imported from organisition/project_avatar.sql by geiger-orm.
-- No @down section — this migration cannot be rolled back.

-- @up
alter table public.projects
  add column if not exists avatar_url text null;
