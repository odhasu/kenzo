-- Funnels
create table public.funnels (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  slug text not null unique,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.funnels enable row level security;
create policy "users manage own funnels" on public.funnels for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create index idx_funnels_user_id on public.funnels(user_id);
create index idx_funnels_slug on public.funnels(slug);

-- Funnel pages
create table public.pages (
  id uuid primary key default gen_random_uuid(),
  funnel_id uuid not null references public.funnels(id) on delete cascade,
  slug text not null,
  title text not null,
  content jsonb not null default '[]',
  settings jsonb not null default '{}',
  "order" int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.pages enable row level security;
create policy "users manage pages via funnel" on public.pages for all
  using (auth.uid() = (select user_id from public.funnels where id = funnel_id))
  with check (auth.uid() = (select user_id from public.funnels where id = funnel_id));
create index idx_pages_funnel_id on public.pages(funnel_id);

-- Leads (simplified CRM)
create table public.leads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  funnel_id uuid references public.funnels(id) on delete set null,
  email text,
  name text not null,
  phone text,
  stage text not null default 'qualified' check (stage in ('qualified', 'booked', 'closed_won', 'lost')),
  metadata jsonb default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.leads enable row level security;
create policy "users manage own leads" on public.leads for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create index idx_leads_user_id on public.leads(user_id);
create index idx_leads_funnel_id on public.leads(funnel_id);

-- Funnel analytics events
create table public.funnel_events (
  id uuid primary key default gen_random_uuid(),
  funnel_id uuid not null references public.funnels(id) on delete cascade,
  event_type text not null check (event_type in ('view', 'submission', 'web_vital')),
  path text,
  value numeric,
  metadata jsonb,
  created_at timestamptz default now()
);
alter table public.funnel_events enable row level security;
create policy "users read own funnel events" on public.funnel_events for select
  using (auth.uid() = (select user_id from public.funnels where id = funnel_id));
create policy "public can insert events" on public.funnel_events for insert
  to anon, authenticated with check (true);
create index idx_funnel_events_funnel_id on public.funnel_events(funnel_id);
create index idx_funnel_events_type on public.funnel_events(event_type);
create index idx_funnel_events_created on public.funnel_events(created_at);

-- AI chat messages
create table public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  funnel_id uuid references public.funnels(id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz not null default now()
);
alter table public.chat_messages enable row level security;
create policy "users manage own chat" on public.chat_messages for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create index idx_chat_messages_funnel_id on public.chat_messages(funnel_id);

-- Templates (DB-backed)
create table public.templates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  description text not null default '',
  category text not null default 'general',
  blocks jsonb not null default '[]',
  settings jsonb not null default '{}',
  is_public boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.templates enable row level security;
create policy "anyone can read public templates" on public.templates for select
  using (is_public = true);
create policy "users manage own templates" on public.templates for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
