create table public.funnels (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  slug text not null unique,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now()
);

alter table public.funnels enable row level security;

create policy "users manage own funnels"
  on public.funnels for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- dev override (remove in production)
-- drop policy "users manage own funnels" on public.funnels;
-- create policy "dev_all_access" on public.funnels for all using (true) with check (true);

create table public.pages (
  id uuid primary key default gen_random_uuid(),
  funnel_id uuid not null references public.funnels(id) on delete cascade,
  slug text not null,
  title text not null,
  content jsonb not null default '[]',
  "order" int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.pages enable row level security;

create policy "users manage own pages"
  on public.pages for all
  using (exists (
    select 1 from public.funnels
    where funnels.id = pages.funnel_id
    and funnels.user_id = auth.uid()
  ))
  with check (exists (
    select 1 from public.funnels
    where funnels.id = pages.funnel_id
    and funnels.user_id = auth.uid()
  ));
