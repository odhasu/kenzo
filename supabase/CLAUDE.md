# TERMINAL 2 — DATABASE

This terminal: Supabase DB only. Migrations, schema, RLS policies.

**Full spec → [../docs/](../docs/README.md)** — see [DATA-MODEL.md](../docs/DATA-MODEL.md) for all tables, columns, RLS, relationships.

## Migrations
All schema changes = new file in `migrations/` numbered in order.
Format: `NNN_description.sql`
Never edit old migration files.
Next migration: **010** (funnel_events).

## Existing migrations
| # | Description |
|---|-------------|
| 001 | ping |
| 002 | funnels + pages |
| 003 | admins |
| 004 | waitlist |
| 005 | applications |
| 006 | page_settings |
| 007 | chat_messages |
| 008 | business_profiles |
| 009 | leads_pipeline |

## RLS patterns
```sql
-- Owner-only access
CREATE POLICY "owner only" ON table_name
  FOR ALL USING (auth.uid() = user_id);

-- Public insert (beacons, waitlist, applications)
CREATE POLICY "public insert" ON table_name
  FOR INSERT WITH CHECK (true);

-- Admin read
CREATE POLICY "admin read" ON table_name
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid())
  );
```
