# Leads CRM

## Overview

Built-in lightweight CRM for tracking leads that come through published funnels. Data feeds into the Insights dashboard for pipeline value and speed metrics.

## Table: `leads` (migration 009)

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | auto |
| `user_id` | uuid FK | → auth.users (funnel owner) |
| `funnel_id` | uuid FK | → funnels.id (source funnel) |
| `source` | text | Traffic source (organic, paid, referral, etc.) |
| `stage` | text | Pipeline stage |
| `deal_value` | numeric | Expected/actual deal value in $ |
| `payment_type` | text | One-time, recurring, split-pay |
| `closer_id` | text | Who closed the deal |
| `setter_id` | text | Who set the appointment |
| `disposition` | text | Outcome (won, lost, disqualified, etc.) |
| `booked_call_at` | timestamptz | When call was scheduled |
| `closed_at` | timestamptz | When deal was won/lost |
| `name` | text | Lead name |
| `email` | text | Lead email |
| `phone` | text | Lead phone |
| `notes` | text | Free-form notes |
| `created_at` | timestamptz | auto |
| `updated_at` | timestamptz | auto (trigger) |

## Pipeline stages

Default stages (customizable per user):
```
new → contacted → qualified → proposal_sent → negotiation → closed_won
                                                      → closed_lost
```

## Components

Located in `components/pipeline/`:
- Kanban board view
- Lead cards with drag-to-stage
- Pipeline stats (value by stage, conversion rate)

## Insights tie-in

Leads data powers two insight groups:

### Speed metrics
- Time from funnel creation to first lead
- Average time in each stage
- Time to close (from lead creation to `closed_at`)
- Close rate (closed_won / total closed)

### Pipeline value
- Leads count by stage
- Total pipeline value (sum of `deal_value` for open stages)
- Closed-won revenue per week
- Average deal value

## RLS

```sql
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "owner only" ON leads
  FOR ALL USING (auth.uid() = user_id);
```

Users see only their own leads. Leads are tied to `user_id` (funnel owner), not the lead's identity.

## API endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/leads` | List leads (filterable by funnel_id, stage) |
| POST | `/api/leads` | Create lead |
| PATCH | `/api/leads/[id]` | Update lead (stage, value, notes, etc.) |
| GET | `/api/leads/stats` | Pipeline stats aggregation |

## Future enhancements

- Email automation triggers (stage change → email sequence)
- Task reminders for follow-ups
- Lead scoring based on behavior data
- Integration with Calendly/Zoom for call booking
