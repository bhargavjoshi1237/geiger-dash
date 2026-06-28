-- Billing tables for the pricing-page Stripe checkout (geiger-dash).
--
-- Three user-scoped tables in public (reachable by supabase-js' default client,
-- like the existing plan/projects tables):
--   payments    one row per Stripe Checkout Session (the money movement)
--   purchases   one row per order (what was bought: plan + products + metrics)
--   user_plan   the user's current entitlement (one row per user, upserted)
--
-- Writes happen only through the service-role client (checkout action + webhook
-- + success-page finalizer). RLS lets a signed-in user read their OWN rows and
-- nothing else; anon has no access. Everything is idempotent.

-- ===========================================================================
-- 0. Shared updated_at trigger (local + idempotent; don't depend on flow.*).
-- ===========================================================================
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ===========================================================================
-- 1. payments — Stripe Checkout Session / money movement.
-- ===========================================================================
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  stripe_session_id text unique,
  stripe_payment_intent text,
  amount_total integer,                          -- minor units (cents)
  currency text not null default 'usd',
  status text not null default 'pending',        -- pending | paid | failed | expired | refunded
  customer_email text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists payments_user_idx on public.payments (user_id, created_at desc);
create index if not exists payments_status_idx on public.payments (status);

-- ===========================================================================
-- 2. purchases — the order/cart contents tied to a payment.
-- ===========================================================================
create table if not exists public.purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  payment_id uuid references public.payments(id) on delete set null,
  organization_id uuid references public.organizations(id) on delete set null, -- optional/future
  plan_key text not null,                        -- basic | plus | pro
  billing_interval text not null default 'month',-- month | year
  amount_total integer,                          -- minor units (cents)
  currency text not null default 'usd',
  products text[] not null default '{}',
  metrics jsonb not null default '{}'::jsonb,
  status text not null default 'pending',         -- pending | completed | refunded | canceled
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists purchases_user_idx on public.purchases (user_id, created_at desc);
create index if not exists purchases_payment_idx on public.purchases (payment_id);

-- ===========================================================================
-- 3. user_plan — the user's current active entitlement (one row per user).
-- ===========================================================================
create table if not exists public.user_plan (
  user_id uuid primary key references auth.users(id) on delete cascade,
  plan_key text not null,
  billing_interval text not null default 'month',
  status text not null default 'active',          -- active | inactive | canceled
  products text[] not null default '{}',
  amount_total integer,
  currency text not null default 'usd',
  current_purchase_id uuid references public.purchases(id) on delete set null,
  started_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ===========================================================================
-- 4. updated_at triggers.
-- ===========================================================================
drop trigger if exists payments_touch_updated_at on public.payments;
create trigger payments_touch_updated_at before update on public.payments
  for each row execute function public.touch_updated_at();

drop trigger if exists purchases_touch_updated_at on public.purchases;
create trigger purchases_touch_updated_at before update on public.purchases
  for each row execute function public.touch_updated_at();

drop trigger if exists user_plan_touch_updated_at on public.user_plan;
create trigger user_plan_touch_updated_at before update on public.user_plan
  for each row execute function public.touch_updated_at();

-- ===========================================================================
-- 5. RLS — a user may read only their own rows; writes go via service_role.
-- ===========================================================================
alter table public.payments enable row level security;
drop policy if exists payments_select_own on public.payments;
create policy payments_select_own on public.payments
  for select using (user_id = auth.uid());

alter table public.purchases enable row level security;
drop policy if exists purchases_select_own on public.purchases;
create policy purchases_select_own on public.purchases
  for select using (user_id = auth.uid());

alter table public.user_plan enable row level security;
drop policy if exists user_plan_select_own on public.user_plan;
create policy user_plan_select_own on public.user_plan
  for select using (user_id = auth.uid());

-- ===========================================================================
-- 6. Grants. anon: none. authenticated: read-only (gated by RLS above).
--    service_role: full access for server-side writes (bypasses RLS).
-- ===========================================================================
revoke all on public.payments from anon;
revoke all on public.purchases from anon;
revoke all on public.user_plan from anon;

grant select on public.payments to authenticated;
grant select on public.purchases to authenticated;
grant select on public.user_plan to authenticated;

grant all on public.payments to service_role;
grant all on public.purchases to service_role;
grant all on public.user_plan to service_role;
