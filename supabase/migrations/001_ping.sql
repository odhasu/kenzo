create table public.ping (
  id bigint generated always as identity primary key,
  message text not null,
  created_at timestamptz default now()
);

alter table public.ping enable row level security;

create policy "public can read ping" on public.ping for select using (true);

insert into public.ping (message) values ('Supabase connection works!');
