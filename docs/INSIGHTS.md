# Insights / Analytics

## Overview

Four metric groups on the funnel insights dashboard (`/dashboard/funnels/[id]/insights`):

1. **Traffic & Conversion**
2. **Speed / Time-to-Value**
3. **Pipeline Value** (from leads CRM)
4. **Page Load Performance** (Core Web Vitals)

## Data source: `funnel_events`

Append-only table (migration 010):
```sql
CREATE TABLE funnel_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  funnel_id uuid REFERENCES funnels(id) NOT NULL,
  user_id uuid REFERENCES auth.users(id),
  event_type text NOT NULL,  -- 'view', 'submission', 'web_vital'
  path text,
  value numeric,
  metadata jsonb,
  created_at timestamptz DEFAULT now()
);
```

Indexes: `funnel_id`, `event_type`, `created_at`
RLS: owner reads own funnels' events; public INSERT for anon beacons

## Client beacon

On `/f/[slug]`, a client-side beacon fires:

### View event
```typescript
// On page load
fetch('/api/events', {
  method: 'POST',
  body: JSON.stringify({
    funnel_id: '<funnel-id>',
    event_type: 'view',
    path: window.location.pathname,
  }),
})
```

### Web Vitals
```typescript
// On idle, via web-vitals library
import { onLCP, onCLS, onINP } from 'web-vitals'

onLCP(({ value }) => beacon({ event_type: 'web_vital', value, metadata: { vital: 'LCP' } }))
onCLS(({ value }) => beacon({ event_type: 'web_vital', value, metadata: { vital: 'CLS' } }))
onINP(({ value }) => beacon({ event_type: 'web_vital', value, metadata: { vital: 'INP' } }))
```

## API: `GET /api/insights/[id]`

Returns aggregated metrics for a funnel:

```json
{
  "traffic": {
    "total_views": 1240,
    "unique_visitors": 890,
    "submissions": 45,
    "conversion_rate": 3.63
  },
  "speed": {
    "time_to_first_application_hours": 2.5,
    "avg_time_in_stage_days": { "new": 1.2, "contacted": 3.5, "qualified": 7.0 },
    "time_to_close_days": 14.3,
    "close_rate": 0.28
  },
  "pipeline": {
    "leads_by_stage": { "new": 12, "contacted": 8, "qualified": 5, "closed_won": 3 },
    "pipeline_value": 12500,
    "closed_won_weekly": [2500, 3200, 1800, 4100]
  },
  "performance": {
    "lcp_p50": 1200,
    "lcp_p75": 2100,
    "cls_p50": 0.05,
    "cls_p75": 0.12,
    "inp_p50": 80,
    "inp_p75": 150
  }
}
```

## Aggregation SQL

### Traffic
```sql
SELECT
  COUNT(*) FILTER (WHERE event_type = 'view') as total_views,
  COUNT(DISTINCT metadata->>'visitor_id') as unique_visitors,
  COUNT(*) FILTER (WHERE event_type = 'submission') as submissions
FROM funnel_events
WHERE funnel_id = $1
  AND created_at > now() - interval '30 days'
```

### Speed (from leads table)
```sql
SELECT
  EXTRACT(EPOCH FROM MIN(created_at) - MIN(funnels.created_at)) / 3600 as time_to_first_app,
  AVG(EXTRACT(EPOCH FROM COALESCE(closed_at, now()) - created_at)) / 86400 as avg_time_to_close
FROM leads
JOIN funnels ON funnels.id = leads.funnel_id
WHERE leads.funnel_id = $1
```

### Pipeline value
```sql
SELECT
  stage,
  COUNT(*) as count,
  SUM(deal_value) as total_value
FROM leads
WHERE funnel_id = $1
GROUP BY stage
```

### Page load performance
```sql
SELECT
  metadata->>'vital' as vital,
  PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY value) as p50,
  PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY value) as p75
FROM funnel_events
WHERE funnel_id = $1 AND event_type = 'web_vital'
GROUP BY metadata->>'vital'
```

## Funnel detail screen

`/dashboard/funnels/[id]` shows:
- Funnel name, status, created date
- Quick stats (views, conversion %, pipeline $)
- Two action buttons: **Edit funnel** → `.../edit`, **View Insights** → `.../insights`
