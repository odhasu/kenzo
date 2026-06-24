-- 012: Templates table — user-editable template library
-- Seeds from code on first access; users can customize their own copies.

create table if not exists templates (
  id          text primary key,                  -- slug: 'innercircle', 'waitlist', etc.
  user_id     uuid references auth.users on delete cascade, -- null = system template
  name        text not null,
  description text not null default '',
  archetype   text not null default 'application', -- application | waitlist | vsl | agency
  block_order jsonb not null default '[]'::jsonb,  -- BlockType[]
  theme       text not null default 'dark-green',
  background  text not null default 'none',
  seed_props  jsonb not null default '{}'::jsonb,  -- Partial<Record<BlockType, Partial<Block['props']>>>
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- RLS: anyone can read system templates; users can CRUD their own
alter table templates enable row level security;

-- Read: system templates (user_id IS NULL) OR user's own
create policy "Anyone can read templates"
  on templates for select
  using (user_id is null or user_id = auth.uid());

-- Insert: authenticated users can create their own templates
create policy "Users can create templates"
  on templates for insert
  with check (user_id = auth.uid());

-- Update: users can update their own templates
create policy "Users can update their own templates"
  on templates for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Delete: users can delete their own templates
create policy "Users can delete their own templates"
  on templates for delete
  using (user_id = auth.uid());

-- Trigger for updated_at
create or replace function trigger_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_templates_updated_at on templates;
create trigger trg_templates_updated_at
  before update on templates
  for each row execute function trigger_updated_at();
