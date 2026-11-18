-- OfferPilot — Phase 3 initial schema
-- Run this once in the Supabase SQL Editor (or `supabase db push` if you use the CLI).
-- Safe to re-run: every statement is guarded with IF NOT EXISTS / OR REPLACE.

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  email text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (id = auth.uid());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (id = auth.uid()) with check (id = auth.uid());

-- profiles rows are created by the handle_new_user trigger below, not by the client.
drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
  for insert with check (id = auth.uid());

-- ---------------------------------------------------------------------------
-- promotions
-- Extends the requested columns with `name` and `promotion_type`, which the
-- existing Calculator / Library / Dashboard UI already depends on (a
-- promotion's display name is distinct from its product name, e.g.
-- "Summer Sale 20%" on the product "Everyday Tote"; `promotion_type` is the
-- BOGO / Bundle / Free Shipping / etc. selector already in the UI).
-- Nothing the brief asked for is removed — these two columns are additive.
-- ---------------------------------------------------------------------------
create table if not exists public.promotions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  promotion_type text not null default 'Percentage Off'
    check (promotion_type in ('Percentage Off', 'Fixed Amount Off', 'BOGO', 'Free Shipping', 'Bundle')),
  product_name text not null,
  selling_price numeric(12, 2) not null check (selling_price >= 0),
  product_cost numeric(12, 2) not null default 0 check (product_cost >= 0),
  discount_type text not null default 'percentage' check (discount_type in ('percentage', 'fixed')),
  discount_value numeric(12, 2) not null default 0 check (discount_value >= 0),
  shipping_cost numeric(12, 2) not null default 0 check (shipping_cost >= 0),
  payment_fee_percentage numeric(5, 2) not null default 2.9
    check (payment_fee_percentage >= 0 and payment_fee_percentage <= 100),
  expected_quantity integer not null default 1 check (expected_quantity >= 0),
  profit_per_order numeric(12, 2) not null default 0,
  profit_margin numeric(6, 2) not null default 0,
  total_projected_profit numeric(14, 2) not null default 0,
  campaign_start_date date,
  campaign_end_date date,
  status text not null default 'draft' check (status in ('draft', 'planned', 'active', 'completed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists promotions_user_id_idx on public.promotions (user_id);
create index if not exists promotions_status_idx on public.promotions (status);

alter table public.promotions enable row level security;

drop policy if exists "promotions_select_own" on public.promotions;
create policy "promotions_select_own" on public.promotions
  for select using (user_id = auth.uid());

drop policy if exists "promotions_insert_own" on public.promotions;
create policy "promotions_insert_own" on public.promotions
  for insert with check (user_id = auth.uid());

drop policy if exists "promotions_update_own" on public.promotions;
create policy "promotions_update_own" on public.promotions
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "promotions_delete_own" on public.promotions;
create policy "promotions_delete_own" on public.promotions
  for delete using (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- comparisons
-- ---------------------------------------------------------------------------
create table if not exists public.comparisons (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  scenarios jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists comparisons_user_id_idx on public.comparisons (user_id);

alter table public.comparisons enable row level security;

drop policy if exists "comparisons_select_own" on public.comparisons;
create policy "comparisons_select_own" on public.comparisons
  for select using (user_id = auth.uid());

drop policy if exists "comparisons_insert_own" on public.comparisons;
create policy "comparisons_insert_own" on public.comparisons
  for insert with check (user_id = auth.uid());

drop policy if exists "comparisons_update_own" on public.comparisons;
create policy "comparisons_update_own" on public.comparisons
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "comparisons_delete_own" on public.comparisons;
create policy "comparisons_delete_own" on public.comparisons
  for delete using (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- campaigns: intentionally not a separate table. The Campaign Calendar
-- reads and writes promotions.campaign_start_date / campaign_end_date /
-- status directly — one source of truth for "when is this running",
-- matching how the Phase 2 UI already works. Running the same promotion
-- again later is handled by duplicating the promotion row, not by a
-- second campaign row pointing back at it.
-- ---------------------------------------------------------------------------

-- ---------------------------------------------------------------------------
-- user_settings
-- ---------------------------------------------------------------------------
create table if not exists public.user_settings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users (id) on delete cascade,
  default_currency text not null default 'USD',
  default_shipping_cost numeric(12, 2) not null default 0,
  default_payment_fee numeric(5, 2) not null default 2.9,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.user_settings enable row level security;

drop policy if exists "user_settings_select_own" on public.user_settings;
create policy "user_settings_select_own" on public.user_settings
  for select using (user_id = auth.uid());

drop policy if exists "user_settings_insert_own" on public.user_settings;
create policy "user_settings_insert_own" on public.user_settings
  for insert with check (user_id = auth.uid());

drop policy if exists "user_settings_update_own" on public.user_settings;
create policy "user_settings_update_own" on public.user_settings
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- updated_at trigger
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_updated_at on public.promotions;
create trigger set_updated_at before update on public.promotions
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at on public.comparisons;
create trigger set_updated_at before update on public.comparisons
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at on public.user_settings;
create trigger set_updated_at before update on public.user_settings
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- new-user bootstrap: create a profile row + default settings row
-- the moment someone signs up, so the app never has to special-case
-- "no profile yet".
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email)
  values (new.id, new.raw_user_meta_data ->> 'full_name', new.email);

  insert into public.user_settings (user_id)
  values (new.id);

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
