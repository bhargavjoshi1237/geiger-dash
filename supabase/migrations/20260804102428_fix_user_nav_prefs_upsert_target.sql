-- Make public.user_nav_prefs upsertable
--
-- 20260804102110 keyed the table with a PARTIAL unique index
-- (… where deleted_at is null). Postgres cannot infer a partial index for
-- `ON CONFLICT (cols)` — an INSERT has no WHERE clause for the predicate to be
-- implied by — so every upsert failed with 42P10 "no unique or exclusion
-- constraint matching the ON CONFLICT specification". That is the only way the
-- apps ever write this table, so it was unusable.
--
-- The fix is a real UNIQUE constraint, which requires the key to be total. Soft
-- delete is therefore dropped from this table, and that is the right call on its
-- own merits: a row here is identified by (product, surface, project, user), and
-- "this user's sidebar preference" has no deleted state — clearing it means
-- storing an empty `hidden` array, not tombstoning the row. A deleted_at column
-- nothing may ever set would be a column that lies.
--
-- Idempotent: safe on a database that already has the constraint.

-- @up
drop index if exists public.user_nav_prefs_scope_idx;

-- Collapse any duplicates the partial index would have allowed (a soft-deleted
-- row sharing a live row's key), keeping the most recently updated one, so the
-- constraint can be created.
delete from public.user_nav_prefs a
using public.user_nav_prefs b
where a.id <> b.id
  and a.product is not distinct from b.product
  and a.surface is not distinct from b.surface
  and a.project_id is not distinct from b.project_id
  and a.user_id is not distinct from b.user_id
  and (a.updated_at, a.id) < (b.updated_at, b.id);

alter table public.user_nav_prefs drop column if exists deleted_at;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'user_nav_prefs_scope_key'
      and conrelid = 'public.user_nav_prefs'::regclass
  ) then
    alter table public.user_nav_prefs
      add constraint user_nav_prefs_scope_key
      unique nulls not distinct (product, surface, project_id, user_id);
  end if;
end;
$$;

drop index if exists public.user_nav_prefs_user_idx;
create index if not exists user_nav_prefs_user_idx
  on public.user_nav_prefs (user_id);

-- @down
alter table public.user_nav_prefs
  drop constraint if exists user_nav_prefs_scope_key;

alter table public.user_nav_prefs add column if not exists deleted_at timestamptz;

create unique index if not exists user_nav_prefs_scope_idx
  on public.user_nav_prefs (product, surface, project_id, user_id) nulls not distinct
  where deleted_at is null;

drop index if exists public.user_nav_prefs_user_idx;
create index if not exists user_nav_prefs_user_idx
  on public.user_nav_prefs (user_id)
  where deleted_at is null;
