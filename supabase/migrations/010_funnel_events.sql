-- 010_funnel_events.sql
-- Append-only event table for funnel analytics: views, submissions, web vitals.
-- RLS: owner reads own funnels' events; public inserts for beacons from /f/[slug].

CREATE TABLE IF NOT EXISTS funnel_events (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  funnel_id   uuid NOT NULL REFERENCES funnels(id) ON DELETE CASCADE,
  user_id     uuid REFERENCES auth.users(id),
  event_type  text NOT NULL CHECK (event_type IN ('view', 'submission', 'web_vital')),
  path        text,
  value       numeric,
  metadata    jsonb,
  created_at  timestamptz DEFAULT now()
);

-- Indexes for aggregation queries
CREATE INDEX IF NOT EXISTS idx_funnel_events_funnel_id ON funnel_events(funnel_id);
CREATE INDEX IF NOT EXISTS idx_funnel_events_event_type ON funnel_events(event_type);
CREATE INDEX IF NOT EXISTS idx_funnel_events_created_at ON funnel_events(created_at);
-- Composite index for common query pattern: get events for a funnel in time range
CREATE INDEX IF NOT EXISTS idx_funnel_events_funnel_type_time
  ON funnel_events(funnel_id, event_type, created_at);

ALTER TABLE funnel_events ENABLE ROW LEVEL SECURITY;

-- Owner reads events for their own funnels
CREATE POLICY "owner read own funnel events"
  ON funnel_events
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM funnels
      WHERE funnels.id = funnel_events.funnel_id
      AND funnels.user_id = auth.uid()
    )
  );

-- Public insert for beacons (anon views + web vitals from /f/[slug])
CREATE POLICY "public insert events"
  ON funnel_events
  FOR INSERT
  WITH CHECK (true);
