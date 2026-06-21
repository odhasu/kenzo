-- 008_business_profile.sql
-- Stores onboarding interview answers so users interview once, reuse everywhere.

CREATE TABLE IF NOT EXISTS business_profiles (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  -- step 1: niche
  offer_type  text,          -- coaching | consulting | course | dfy | agency | other
  niche       text,          -- specific niche/industry
  transform   text,          -- main transformation delivered
  competitors text,          -- alternatives clients consider
  -- step 2: ideal client
  dream_client       text,   -- role, situation, pain level
  tried_before       text,   -- what they tried that didn't work
  client_wants       text,   -- the one thing they want most
  -- step 3: offer
  offer_name   text,         -- what the offer is called
  offer_format text,         -- 1:1 | group | course | dfy | mix
  offer_includes text,       -- deliverables list
  guarantee    text,         -- risk reversal / guarantee
  -- step 4: pricing
  price        text,         -- main offer price
  value_roi    text,         -- typical value/ROI clients get
  payment_type text,         -- PIF | payment_plan | both
  -- step 5: pain points
  pain_points  text,         -- what keeps them up at night
  top_objection text,        -- biggest objection to buying
  inaction_cost text,        -- what happens if they don't solve it
  social_proof text,         -- testimonials, case studies, numbers
  -- voice & brand
  brand_voice  text,         -- how the user talks (casual, formal, bold, etc.)
  voice_notes  text,         -- freeform notes on voice/words to use or avoid
  created_at   timestamptz DEFAULT now(),
  updated_at   timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE business_profiles ENABLE ROW LEVEL SECURITY;

-- Users can manage their own profile
CREATE POLICY "Users manage own business profile"
  ON business_profiles
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Add business_profile_id to funnels so each funnel links to the profile used
ALTER TABLE funnels ADD COLUMN IF NOT EXISTS business_profile_id uuid REFERENCES business_profiles(id);
