-- Organization project and plan tables.
-- Mirrored here so the org schema is tracked inside the repo's Supabase SQL hierarchy.

create table if not exists public.organizations (
  id uuid not null default gen_random_uuid(),
  name text null,
  description text not null,
  created_by uuid null,
  created_at timestamp with time zone null default now(),
  owner uuid null,
  metadata jsonb null,
  is_active boolean null default false,
  country text null,
  phone text null,
  constraint organizations_pkey primary key (id),
  constraint organizations_created_by_fkey foreign key (created_by) references auth.users (id),
  constraint organizations_owner_fkey foreign key (owner) references auth.users (id)
) tablespace pg_default;

create table if not exists public.plan (
  id uuid not null default gen_random_uuid(),
  created_at timestamp with time zone not null default now(),
  organisation uuid null,
  plan jsonb null,
  constraint plan_pkey primary key (id)
) tablespace pg_default;

create table if not exists public.projects (
  flow_project_id uuid not null default gen_random_uuid(),
  created_at timestamp with time zone not null default now(),
  dam_project_id uuid null default gen_random_uuid(),
  notes_project_id uuid null default gen_random_uuid(),
  grey_project_id uuid null default gen_random_uuid(),
  office_project_id uuid null default gen_random_uuid(),
  forms_project_id uuid null default gen_random_uuid(),
  events_project_id uuid null default gen_random_uuid(),
  content_project_id uuid null default gen_random_uuid(),
  pods_project_id uuid null default gen_random_uuid(),
  comms_project_id uuid null default gen_random_uuid(),
  chat_project_id uuid null default gen_random_uuid(),
  canvas_project_id uuid null default gen_random_uuid(),
  docs_project_id uuid null default gen_random_uuid(),
  id uuid not null,
  constraint projects_pkey primary key (id)
) tablespace pg_default;

create table if not exists public.organization_users (
  id uuid not null default gen_random_uuid(),
  created_at timestamp with time zone not null default now(),
  "user" uuid null,
  organization uuid null,
  role public.Role null default 'User'::"Role",
  constraint organization_users_pkey primary key (id),
  constraint organization_users_organization_fkey foreign key (organization) references organizations (id),
  constraint organization_users_user_fkey foreign key ("user") references auth.users (id)
) tablespace pg_default;

create table if not exists public.organization_project (
  id uuid not null default gen_random_uuid(),
  created_at timestamp with time zone not null default now(),
  project uuid null,
  organisition uuid null,
  plan uuid null,
  constraint organization_project_pkey primary key (id),
  constraint organization_project_organisition_fkey foreign key (organisition) references organizations (id),
  constraint organization_project_plan_fkey foreign key (plan) references plan (id),
  constraint organization_project_project_fkey foreign key (project) references projects (id)
) tablespace pg_default;