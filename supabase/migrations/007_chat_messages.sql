create table public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  funnel_id uuid references public.funnels(id) on delete cascade,
  console_type text not null check (console_type in ('editor', 'developer')),
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  logs jsonb,
  created_at timestamptz not null default now()
);

alter table public.chat_messages enable row level security;

create policy "users manage own chat messages"
  on public.chat_messages for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
