-- Allow playbook driver
--
-- Adds 'playbook' to filestore.providers.driver. Playbook is a built-in, dev-only
-- pool member configured from env (PLAYBOOK_*) and toggled on/off from
-- /admin/storage; it is never created through the provider form.

-- @up
alter table filestore.providers drop constraint if exists providers_driver_check;
alter table filestore.providers add constraint providers_driver_check
  check (driver in ('s3', 'rest', 'supabase', 'vercel_blob', 'playbook'));

-- @down
-- NOT VALID so a leftover playbook row cannot block the rollback.
alter table filestore.providers drop constraint if exists providers_driver_check;
alter table filestore.providers add constraint providers_driver_check
  check (driver in ('s3', 'rest', 'supabase', 'vercel_blob')) not valid;
