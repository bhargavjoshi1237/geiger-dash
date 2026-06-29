-- Adds avatar_url to organizations for org icons / profile pictures.
-- Idempotent: safe to run multiple times.

alter table public.organizations
  add column if not exists avatar_url text null;
