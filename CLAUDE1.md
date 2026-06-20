# Kenzo — CLAUDE.md

Funnel builder + tracking platform. Solo founder, learning as he goes. Token usage matters — keep sessions small and focused.

## Stack
- Next.js (App Router, TypeScript, Tailwind)
- Supabase (Postgres, Auth, RLS)
- Vercel (hosting + deploy)

## Scope discipline
v1 = builder + tracking only. Do NOT build, scaffold, or suggest: video blocks, AI-generation features, custom domains, payments/checkout. These are real future phases, not today's job. If asked to do something outside the current session's stated goal, do only that goal — flag the rest instead of doing it "while you're in there."

## Security (non-negotiable)
- Every Supabase table has Row Level Security ON from the moment it's created — including before real login exists. Early sessions develop against one manually-created test user id in Supabase; that's fine, but RLS policies must still be correct and tested against a second test user.
- Default RLS pattern: a user can only read/write rows where `user_id` matches their own auth id.
- Public-facing tables (events, leads) allow anonymous INSERT only — never anonymous SELECT.
- Never commit `.env.local` or any key/secret. Always confirm `.gitignore` covers it.
- Never log or print API keys, even partially, even in debug output.
- Real auth (email/password + Google) lands in its own phase, after the data model exists. Don't build login pages before there's data worth protecting; don't build the dashboard before real login exists.

## Performance
Published funnel pages must be statically generated or ISR — never client-side-fetch-on-load for the public-facing page. This is the core product promise (fast pages). Treat page-load speed as a correctness requirement, not a nice-to-have.

## Verification (do this before marking any session done)
1. Run the dev server (or check the live Vercel deploy) and actually load the page/feature in a browser.
2. For anything involving RLS: test as two different users (or one logged-in, one anonymous) to confirm access is correctly blocked, not just correctly allowed.
3. For anything that writes data: refresh the page after the action and confirm the change persisted — don't trust local UI state alone.
4. State what you verified and how, in plain terms, before saying a session is complete.

## Working style
- One session = one goal, from ROADMAP.md. Don't pull in scope from later sessions.
- If something is ambiguous, ask rather than assume — this project is being learned, not just shipped.
- Keep explanations short. Founder is not a professional engineer yet; prioritize working code and plain-English explanation over jargon.

## Folder structure
- `src/app/` — pages (website, dashboard, builder, public funnel pages)
- `src/components/blocks/` — funnel block UI (heading, text, button, image, form)
- `src/lib/supabase/` — Supabase client setup
- `src/lib/funnels.ts` — backend functions (create/save/get funnels)
- `src/middleware.ts` — route protection / security
- `supabase/migrations/` — table + RLS definitions (SQL)

## When this file gets long
If this file grows past a couple thousand tokens, that's a signal to clean it, not extend it. Remove anything no longer true, duplicated, or that the model now handles correctly without being told.
