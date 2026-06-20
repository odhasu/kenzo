# TERMINAL 2 — DATABASE
This terminal: Supabase DB only. Migrations, schema, RLS policies.

## Tables

| table        | migration | purpose                          | RLS                               |
|--------------|-----------|----------------------------------|-----------------------------------|
| funnels      | 002       | user's funnels                   | owner sees only own rows          |
| pages        | 002       | pages inside a funnel            | via funnel ownership              |
| admins       | 003       | admin role list                  | service role only                 |
| waitlist     | 004       | email waitlist signups           | public INSERT, admin SELECT       |
| applications | 005       | Inner Circle funnel submissions  | public INSERT, admin SELECT       |

## Block schema
`pages.content` is a JSONB array of blocks.

**Basic elements:**
```json
{ "id": "abc", "type": "heading",  "props": { "text": "Title" } }
{ "id": "def", "type": "text",     "props": { "text": "Body" } }
{ "id": "ghi", "type": "button",   "props": { "label": "CTA", "href": "#" } }
{ "id": "jkl", "type": "image",    "props": { "src": "...", "alt": "..." } }
{ "id": "mno", "type": "form",     "props": { "fields": ["email"] } }
```

**IC sections (dark funnel):**
```json
{ "id": "a", "type": "ic-hero",   "props": { "badge": "...", "headline": "...", "subtext": "...", "ctaLabel": "...", "ctaHref": "#apply" } }
{ "id": "b", "type": "ic-ticker", "props": { "items": ["item1", "item2"] } }
{ "id": "c", "type": "ic-apply",  "props": { "headline": "Apply Now", "subtext": "..." } }
{ "id": "d", "type": "ic-cards",  "props": { "headline": "...", "cards": [{ "title": "...", "desc": "...", "bullets": ["..."] }], "ctaLabel": "...", "ctaHref": "#apply" } }
{ "id": "e", "type": "ic-faq",    "props": { "headline": "...", "items": [{ "q": "...", "a": "..." }] } }
{ "id": "f", "type": "ic-cta",    "props": { "label": "...", "href": "#apply", "subtext": "..." } }
```

## Migrations
All schema changes = new file in `migrations/` numbered in order.
Format: `006_description.sql`
Never edit old migration files.
Next migration: **006**

## RLS pattern
```sql
-- owners see own funnels
CREATE POLICY "owner only" ON funnels
  USING (auth.uid() = user_id);

-- public insert, owner read (events / applications / waitlist)
CREATE POLICY "public insert" ON applications
  FOR INSERT WITH CHECK (true);

CREATE POLICY "admin read" ON applications
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid())
  );
```
