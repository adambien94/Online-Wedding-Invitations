-- Create events table
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  type text not null default 'wedding' check (type in ('wedding', 'birthday', 'communion', 'baptism', 'anniversary', 'corporate_event')),
  slug text not null unique,
  owner_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  event_date date null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz null
);

create index if not exists events_slug_idx on public.events (slug);
create index if not exists events_owner_id_idx on public.events (owner_id);
create index if not exists events_status_idx on public.events (status);

-- Create event_members table
create table if not exists public.event_members (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'editor' check (role in ('owner', 'editor')),
  created_at timestamptz not null default now()
);

create index if not exists event_members_event_id_idx on public.event_members (event_id);
create index if not exists event_members_user_id_idx on public.event_members (user_id);
create unique index if not exists event_members_unique_owner on public.event_members (event_id, user_id) where role = 'owner';

-- Enable RLS on events
alter table public.events enable row level security;

create policy "Users can view their own events"
  on public.events
  for select
  using (auth.uid() = owner_id);

create policy "Users can insert own events"
  on public.events
  for insert
  with check (auth.uid() = owner_id);

create policy "Users can update their own events"
  on public.events
  for update
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

create policy "Users can delete their own events"
  on public.events
  for delete
  using (auth.uid() = owner_id);

create policy "Allow service role to manage events"
  on public.events
  for all
  using (true)
  with check (true);

-- Enable RLS on event_members
alter table public.event_members enable row level security;

create policy "Users can view their own event memberships"
  on public.event_members
  for select
  using (auth.uid() = user_id);

create policy "Users can insert their own event memberships"
  on public.event_members
  for insert
  with check (auth.uid() = user_id);

create policy "Allow service role to manage memberships"
  on public.event_members
  for all
  using (true)
  with check (true);
