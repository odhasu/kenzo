-- Applications table for OGs Inner Circle funnel submissions
create table if not exists applications (
  id              uuid primary key default gen_random_uuid(),
  experience      text,
  goal            text,
  age             text,
  budget          text,
  email           text not null,
  name            text not null,
  phone           text,
  contact_preference text,
  created_at      timestamptz not null default now()
);

-- Public can insert (anonymous visitors), only service role can read
alter table applications enable row level security;

create policy "anyone can apply"
  on applications for insert
  to anon, authenticated
  with check (true);

-- Only authenticated users with admin role can read
create policy "admins can view applications"
  on applications for select
  to authenticated
  using (
    exists (
      select 1 from admins where user_id = auth.uid()
    )
  );
