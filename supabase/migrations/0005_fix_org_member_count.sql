-- Fix find_organization's member_count.
--
-- The original definition added the length of metadata.members to the count of
-- organization_users rows. Because every join path keeps BOTH sources in sync,
-- that double-counted every member (roughly 2x the real number). Membership is
-- also recorded on the owner/created_by columns, which the old count ignored.
--
-- Count the DISTINCT union of all three sources instead so the preview shown in
-- the onboarding "join organization" step matches the /org dashboard.

create or replace function public.find_organization(q text)
returns table (id uuid, name text, slug text, member_count int)
language sql stable security definer set search_path = public, auth
as $$
  select o.id, o.name, o.slug,
    (
      select count(distinct m)::int
      from (
        select ou."user"::text as m
        from public.organization_users ou
        where ou.organization = o.id
        union
        select jsonb_array_elements_text(
          case when jsonb_typeof(o.metadata->'members') = 'array'
               then o.metadata->'members' else '[]'::jsonb end
        )
        union
        select o.created_by::text where o.created_by is not null
        union
        select o.owner::text where o.owner is not null
      ) members
    ) as member_count
  from public.organizations o
  where o.deleted_at is null
    and auth.uid() is not null
    and (
      (q ~ '^[0-9a-fA-F-]{36}$' and o.id = q::uuid)
      or (o.slug is not null and o.slug = lower(q))
    )
  limit 1;
$$;

grant execute on function public.find_organization(text) to authenticated, service_role;
