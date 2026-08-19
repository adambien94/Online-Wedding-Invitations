-- Create event_drafts table
create table if not exists public.event_drafts (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null unique references public.events(id) on delete cascade,
  config jsonb not null default '{}',
  version integer not null default 1,
  updated_at timestamptz not null default now()
);

create index if not exists event_drafts_event_id_idx on public.event_drafts (event_id);

-- Enable RLS
alter table public.event_drafts enable row level security;

create policy "Users can view drafts of their own events"
  on public.event_drafts
  for select
  using (
    exists (
      select 1 from public.events
      where events.id = event_drafts.event_id
        and events.owner_id = auth.uid()
    )
  );

create policy "Users can insert drafts for their own events"
  on public.event_drafts
  for insert
  with check (
    exists (
      select 1 from public.events
      where events.id = event_drafts.event_id
        and events.owner_id = auth.uid()
    )
  );

create policy "Users can update drafts of their own events"
  on public.event_drafts
  for update
  using (
    exists (
      select 1 from public.events
      where events.id = event_drafts.event_id
        and events.owner_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.events
      where events.id = event_drafts.event_id
        and events.owner_id = auth.uid()
    )
  );

create policy "Allow service role to manage drafts"
  on public.event_drafts
  for all
  using (true)
  with check (true);

-- Auto-bump updated_at on change
create or replace function public.set_event_drafts_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  new.version = old.version + 1;
  return new;
end;
$$;

create trigger event_drafts_updated_at
  before update on public.event_drafts
  for each row execute function public.set_event_drafts_updated_at();
