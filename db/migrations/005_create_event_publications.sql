-- Create event_publications table (Sprint 10)
create table if not exists public.event_publications (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  config jsonb not null default '{}',
  template_key text not null,
  template_version integer not null default 1,
  version integer not null default 1,
  published_at timestamptz not null default now()
);

create index if not exists event_publications_event_id_idx
  on public.event_publications (event_id);

alter table public.event_publications enable row level security;

-- Public can read only published invitations (no drafts).
create policy "Public can view published event publications"
  on public.event_publications
  for select
  using (
    exists (
      select 1 from public.events
      where events.id = event_publications.event_id
        and events.status = 'published'
    )
  );

-- Allow service role to manage publications.
create policy "Allow service role to manage event publications"
  on public.event_publications
  for all
  using (true)
  with check (true);

-- Allow public to read only published events (needed for the EXISTS() above).
create policy "Public can view published events"
  on public.events
  for select
  using (status = 'published');

