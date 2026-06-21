-- 009_leads_pipeline.sql
-- CRM pipeline: leads, stages, dispositions, closer tracking.

CREATE TABLE IF NOT EXISTS leads (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  funnel_id       uuid REFERENCES funnels(id) ON DELETE SET NULL,
  -- lead info
  name            text NOT NULL,
  email           text,
  phone           text,
  source          text CHECK (source IN ('ig_dm', 'application', 'webinar', 'referral', 'manual', 'other')) DEFAULT 'manual',
  -- pipeline
  stage           text CHECK (stage IN (
                    'qualified', 'booked', 'closed_won',
                    'lost', 'no_show', 'follow_up', 'unqualified'
                  )) DEFAULT 'qualified',
  deal_value      numeric(10,2) DEFAULT 0,
  payment_type    text CHECK (payment_type IN ('pif', 'payment_plan', 'unknown')) DEFAULT 'unknown',
  -- assignments
  closer_id       uuid REFERENCES auth.users(id),
  setter_id       uuid REFERENCES auth.users(id),
  -- tracking
  notes           text,
  disposition     text CHECK (disposition IN (
                    'closed_won', 'lost', 'no_show', 'follow_up', 'unqualified'
                  )),
  booked_call_at  timestamptz,
  closed_at       timestamptz,
  last_contact_at timestamptz DEFAULT now(),
  -- metadata
  metadata        jsonb DEFAULT '{}',
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now()
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_leads_user_id ON leads(user_id);
CREATE INDEX IF NOT EXISTS idx_leads_stage ON leads(stage);
CREATE INDEX IF NOT EXISTS idx_leads_funnel_id ON leads(funnel_id);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Users manage their own leads
CREATE POLICY "Users manage own leads"
  ON leads
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Updated trigger for leads
CREATE OR REPLACE FUNCTION update_leads_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION update_leads_updated_at();
