-- 013: Fix templates PK — allow user customizations alongside system templates
-- 012 used `id` as sole PK. System templates (user_id=NULL) share same id as user edits.
-- Fix: surrogate PK, partial unique indexes for system + user uniqueness.

-- 1. Drop old PK and rename slug column
alter table templates drop constraint if exists templates_pkey;
alter table templates rename column id to template_id;

-- 2. Add surrogate UUID PK
alter table templates add column id uuid primary key default gen_random_uuid();

-- 3. Partial unique indexes: system templates unique by template_id, user templates by (user_id, template_id)
create unique index if not exists idx_templates_system
  on templates (template_id) where user_id is null;

create unique index if not exists idx_templates_user
  on templates (user_id, template_id) where user_id is not null;

-- 4. Re-add the RLS policies that reference the renamed column
-- (Policies from 012 still work since they reference no column name; just the table)
