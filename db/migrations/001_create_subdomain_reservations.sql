create extension if not exists pgcrypto;

create table if not exists public.subdomain_reservations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid null,
  slug text not null unique,
  status text not null default 'reserved' check (status in ('reserved', 'claimed', 'released')),
  claimed_event_id uuid null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  expires_at timestamptz null
);

create index if not exists subdomain_reservations_slug_idx
  on public.subdomain_reservations (slug);

create index if not exists subdomain_reservations_user_id_idx
  on public.subdomain_reservations (user_id);

alter table public.subdomain_reservations enable row level security;

create policy "Users can view their own reservation"
  on public.subdomain_reservations
  for select
  using (auth.uid() = user_id);

create policy "Users can insert their own reservation"
  on public.subdomain_reservations
  for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own reservation"
  on public.subdomain_reservations
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own reservation"
  on public.subdomain_reservations
  for delete
  using (auth.uid() = user_id);

create policy "Allow service role to manage reservations"
  on public.subdomain_reservations
  for all
  using (true)
  with check (true);
