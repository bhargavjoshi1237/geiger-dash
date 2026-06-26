-- create_organization RPC.
--
-- The onboarding wizard inserts an org and needs the new id/slug back. Doing
-- insert ... returning under RLS makes Postgres evaluate the SELECT policy
-- (is_org_member(id)) against the row being inserted, which a self-referential
-- lookup can't see mid-statement -> "new row violates row-level security policy".
--
-- Running creation through a SECURITY DEFINER function sidesteps that: the insert
-- happens past RLS, the slug is made unique against every org (not just the
-- caller's visible ones), and the owner membership row is created atomically.

create or replace function public.create_organization(p_name text, p_description text default '')
returns table (id uuid, slug text)
language plpgsql security definer set search_path = public, auth
as $$
declare
  uid uuid := auth.uid();
  base text;
  candidate text;
  n int := 2;
  new_id uuid;
begin
  if uid is null then
    raise exception 'Authentication required' using errcode = '28000';
  end if;
  if coalesce(btrim(p_name), '') = '' then
    raise exception 'Organization name is required' using errcode = '22023';
  end if;

  -- Globally-unique slug derived from the name.
  base := btrim(coalesce(nullif(regexp_replace(lower(btrim(p_name)), '[^a-z0-9]+', '-', 'g'), ''), 'workspace'), '-');
  if base = '' then base := 'workspace'; end if;
  base := left(base, 48);
  candidate := base;
  while exists (select 1 from public.organizations o where o.slug = candidate) loop
    candidate := base || '-' || n;
    n := n + 1;
    if n > 1000 then
      candidate := base || '-' || left(replace(gen_random_uuid()::text, '-', ''), 8);
      exit;
    end if;
  end loop;

  insert into public.organizations (name, description, slug, created_by, owner, is_active, metadata)
  values (
    btrim(p_name),
    coalesce(btrim(p_description), ''),
    candidate,
    uid, uid, true,
    jsonb_build_object(
      'members', jsonb_build_array(uid::text),
      'onboarding', jsonb_build_object('source', 'wizard', 'completedAt', now())
    )
  )
  returning organizations.id into new_id;

  if not exists (
    select 1 from public.organization_users ou
    where ou.organization = new_id and ou."user" = uid
  ) then
    insert into public.organization_users (organization, "user", role)
    values (new_id, uid, 'Owner');
  end if;

  id := new_id;
  slug := candidate;
  return next;
end;
$$;

grant execute on function public.create_organization(text, text) to authenticated, service_role;
