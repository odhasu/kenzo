-- Seed: Lucas Resell template (public, system-owned)
insert into public.templates (id, user_id, name, description, category, blocks, settings, is_public)
values (
  '00000000-0000-0000-0000-000000000001',
  null,
  'Lucas Resell',
  'High-ticket application funnel for agency owners. Hero, results, FAQ, and apply CTA.',
  'agency',
  '[
    {"id":"hero-1","type":"ic-hero","props":{"badge":"HIGH-TICKET CLIENTS","headline":"Get Paid What You''re Worth","subtext":"We help agency owners land $3k–$10k/mo retainer clients without cold outreach.","cta":"Apply Now","ctaUrl":"#apply"},"hidden":false},
    {"id":"cards-1","type":"ic-cards","props":{"headline":"What You Get","cards":[{"title":"Done-With-You Setup","desc":"We build your entire funnel in 7 days."},{"title":"AI Lead Engine","desc":"Automated DM outreach that books calls."},{"title":"Sales Training","desc":"Close high-ticket deals confidently."}]},"hidden":false},
    {"id":"results-1","type":"ic-results","props":{"headline":"Client Results","photos":[]},"hidden":false},
    {"id":"faq-1","type":"ic-faq","props":{"headline":"Frequently Asked Questions","items":[{"question":"How long until I see results?","answer":"Most clients book their first qualified call within 48 hours of launch."},{"question":"Do I need an existing audience?","answer":"No. Our AI engine handles outreach for you."},{"question":"What niches do you work with?","answer":"Coaching, consulting, SMMA, SaaS, and info-products."}]},"hidden":false},
    {"id":"cta-1","type":"ic-cta","props":{"button":"Apply to Work With Us","url":"#apply","subtext":"Limited spots available. We only take 5 clients per month."},"hidden":false}
  ]'::jsonb,
  '{"theme":"dark-green","background":"gradient"}'::jsonb,
  true
);
