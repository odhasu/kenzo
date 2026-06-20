alter table public.pages add column if not exists settings jsonb not null default '{}';
