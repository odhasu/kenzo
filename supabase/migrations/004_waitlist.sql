create table public.waitlist (
  id bigint generated always as identity primary key,
  email text not null unique,
  created_at timestamptz not null default now()
);

alter table public.waitlist enable row level security;

create policy "public can insert waitlist"
  on public.waitlist for insert
  with check (true);

create policy "no public reads"
  on public.waitlist for select
  using (false);
