# Data Model

> **Templates are code-defined, not DB rows** — they live in `lib/templates.ts` (`TEMPLATES`). See [TEMPLATES.md](TEMPLATES.md). Only the **Library** (user-saved sections) needs a table.
> **No credits/billing tables** — kenzo does not meter AI usage.

## Tables

### funnels (migration 002)
| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | auto-generated |
| `user_id` | uuid FK | → auth.users |
| `name` | text | user-visible name |
| `slug` | text | URL-safe, unique per user |
| `status` | text | 'draft' | 'published' |
| `created_at` | timestamptz | auto |
| `updated_at` | timestamptz | auto |

RLS: `auth.uid() = user_id`

### pages (migration 002)
| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | auto-generated |
| `funnel_id` | uuid FK | → funnels.id |
| `slug` | text | URL segment (usually "main") |
| `title` | text | page title |
| `content` | jsonb | `Block[]` — all blocks in order |
| `settings` | jsonb | `FunnelSettings` object (migration 006 added this column) |
| `order` | int | page ordering within funnel |
| `created_at` | timestamptz | auto |
| `updated_at` | timestamptz | auto |

RLS: via funnel ownership (subquery on `funnels` where `auth.uid() = user_id`)

### admins (migration 003)
| Column | Type | Notes |
|--------|------|-------|
| `user_id` | uuid PK | → auth.users |
| `created_at` | timestamptz | auto |

RLS: service role only (admin list is sensitive)

### waitlist (migration 004)
| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | auto |
| `email` | text | unique |
| `created_at` | timestamptz | auto |

RLS: public INSERT, admin SELECT

### applications (migration 005)
| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | auto |
| `name` | text | |
| `email` | text | |
| `phone` | text | |
| `answers` | jsonb | form responses |
| `created_at` | timestamptz | auto |

RLS: public INSERT, admin SELECT

### chat_messages (migration 007)
| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | auto |
| `user_id` | uuid FK | → auth.users |
| `funnel_id` | uuid FK | → funnels.id (nullable for create chat) |
| `console_type` | text | 'editor' | 'create' |
| `role` | text | 'user' | 'assistant' |
| `content` | text | message body |
| `created_at` | timestamptz | auto |

RLS: owner manages own rows

### business_profiles (migration 008)
| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | auto |
| `user_id` | uuid FK | → auth.users, unique |
| `niche` | text | |
| `offer_type` | text | |
| `price_point` | text | |
| `target_audience` | text | |
| `pain_points` | text | |
| `transformation` | text | |
| `tone` | text | |
| `social_proof` | text | |
| `cta_preference` | text | |
| `created_at` | timestamptz | auto |
| `updated_at` | timestamptz | auto |

RLS: `auth.uid() = user_id`

### leads (migration 009)
| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | auto |
| `user_id` | uuid FK | → auth.users (owner of the funnel) |
| `funnel_id` | uuid FK | → funnels.id (which funnel the lead came from) |
| `source` | text | traffic source |
| `stage` | text | pipeline stage (new, contacted, qualified, etc.) |
| `deal_value` | numeric | |
| `payment_type` | text | |
| `closer_id` | text | |
| `setter_id` | text | |
| `disposition` | text | |
| `booked_call_at` | timestamptz | |
| `closed_at` | timestamptz | |
| `name` | text | lead name |
| `email` | text | lead email |
| `phone` | text | lead phone |
| `notes` | text | |
| `created_at` | timestamptz | auto |
| `updated_at` | timestamptz | auto (trigger) |

RLS: `auth.uid() = user_id`

### funnel_events (migration 010 — Phase 3)
| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | auto |
| `funnel_id` | uuid FK | → funnels.id |
| `user_id` | uuid FK | → auth.users (nullable — anon views) |
| `event_type` | text | 'view' | 'submission' | 'web_vital' |
| `path` | text | URL path |
| `value` | numeric | metric value (e.g., LCP in ms) |
| `metadata` | jsonb | extra data (e.g., {vital: "LCP", rating: "good"}) |
| `created_at` | timestamptz | auto |

Indexes: `funnel_id`, `event_type`, `created_at`
RLS: owner reads own funnels' events; public INSERT for views/web-vitals from `/f/[slug]`

### library_sections (migration 011 — 📋 planned)
User-saved reusable sections (Clyro's Library). See [TEMPLATES.md](TEMPLATES.md#library-).
| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | auto |
| `user_id` | uuid FK | → auth.users |
| `name` | text | user-visible label |
| `blocks` | jsonb | `Block[]` — the saved section(s) |
| `thumbnail` | text | optional preview image URL |
| `created_at` | timestamptz | auto |

RLS: `auth.uid() = user_id`

> **Preview-data** (mock offer/testimonials/pricing for the builder preview) reuses `business_profiles` ✅. If a richer mock set is needed later, add `preview_data` (jsonb on `pages` or a small per-funnel table) — 📋, not required yet.

## Relationships

```
funnels 1──N pages
funnels 1──N leads
funnels 1──N funnel_events
funnels 1──N chat_messages
users   1──1 business_profiles
users   1──N funnels
users   1──N library_sections   (📋)
```

## Migration rules

1. All schema changes = new numbered SQL file in `supabase/migrations/`
2. Format: `NNN_description.sql` (next = 011 → `011_library_sections.sql`)
3. Never edit old migration files
4. Always include RLS policies
5. Always include appropriate indexes

## RLS patterns

```sql
-- Owner-only read/write
CREATE POLICY "owner only" ON table_name
  FOR ALL USING (auth.uid() = user_id);

-- Public insert (for beacons, waitlist, applications)
CREATE POLICY "public insert" ON table_name
  FOR INSERT WITH CHECK (true);

-- Admin read all
CREATE POLICY "admin read" ON table_name
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid())
  );
```
