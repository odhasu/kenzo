# Kenzo — Build Roadmap

Pace: ~1 hour/day, solo, prompting Claude Code.
Goal of v1: a working funnel builder + tracking system. No video blocks, no AI-generation, no custom domains, no payments. Those are named as later phases so we don't scope-creep into them early.

How to use this roadmap:
- Each session has one job. Don't start session N+1 until session N's "Done when" is true.
- Start a **new Claude Code session per session** below (not one giant continuous chat) — fresh context catches things a long, tired context window misses.
- Every session ends with you actually looking at the result (running it, clicking it) — not just reading code Claude wrote.
- If a session goes over 1 hour, stop anyway. Pick up next session next time. Don't rush a session to "finish" it.

---

## PHASE 0 — Foundation (Sessions 1–2)

### Session 1: Repo + deploy skeleton
**Goal:** Empty Next.js app, pushed to GitHub, deployed on Vercel, visible at a live URL.
**Do:**
- `npx create-next-app@latest` (TypeScript, App Router, Tailwind — say yes to all)
- Push to a new GitHub repo
- Connect repo to Vercel, deploy
- Confirm the default Next.js page loads at your Vercel URL
**Done when:** You can visit a live URL and see the default Next.js starter page.
**Verify:** Open the Vercel URL in a browser. If it loads, done.

### Session 2: Supabase project + connection
**Goal:** Supabase project exists, Next.js app can talk to it.
**Do:**
- Create a Supabase project
- Install `@supabase/supabase-js` and `@supabase/ssr`
- Add Supabase URL + anon key to `.env.local` (and Vercel env vars)
- Create one test table (e.g. `ping`), write one row, read it back from a Next.js page
**Done when:** A page on your site displays a value pulled live from Supabase.
**Verify:** Load the page, see the Supabase value rendered. Change the value in Supabase directly, refresh, see it change.

---

## PHASE 1 — Data model (Sessions 3–5)

This phase has no UI and no login pages yet. It's the foundation the builder sits on. Resist the urge to skip to building the visual editor before this exists — the editor is just a UI on top of this data.

**Important:** even with no login page yet, every table from this point on gets a `user_id` column and RLS turned on the moment it's created. We develop against one hardcoded test user id (a real row in Supabase's `auth.users`, created manually via the Supabase dashboard). This way, when real auth (Sessions 6–7) lands, nothing about the data layer has to change — we just swap the hardcoded id for whoever is actually logged in. Skipping RLS now and adding it later is how security holes happen; we don't do that here.

### Session 3: Funnel + Page tables
**Goal:** Database structure for funnels and pages exists, with RLS on from day one.
**Do:**
- In the Supabase dashboard, manually create one test user (Authentication tab) — this is your dev identity until real login exists
- Table `funnels`: id, user_id, name, slug, status (draft/published), created_at
- Table `pages`: id, funnel_id, slug, title, content (jsonb — this holds the block data), order, created_at
- RLS: users can only see/edit funnels (and their pages) where `user_id` = their own id
- The app uses the test user's id directly for now (no login UI yet) when creating/reading rows
**Done when:** You can manually insert a funnel + a page row in Supabase and the RLS policy correctly blocks a second test user from seeing it.
**Verify:** Create a second test user in Supabase, confirm it cannot query the first user's funnel.

### Session 4: Block schema design
**Goal:** Decide and document the shape of `content` (jsonb) for a page — i.e. what a "block" looks like.
**Do:**
- Design a simple block array, e.g.:
  ```json
  [
    { "id": "abc123", "type": "heading", "props": { "text": "Welcome" } },
    { "id": "def456", "type": "text", "props": { "text": "Some body copy" } },
    { "id": "ghi789", "type": "button", "props": { "label": "Buy now", "href": "#" } },
    { "id": "jkl012", "type": "image", "props": { "src": "...", "alt": "..." } },
    { "id": "mno345", "type": "form", "props": { "fields": ["email"] } }
  ]
  ```
- Write this shape into CLAUDE.md or a `/docs/block-schema.md` so future sessions don't reinvent it
- No video block type yet — that's Phase 5 (later)
**Done when:** You have a written, fixed block schema you're committing to.
**Verify:** Re-read it. Could a `text`, `heading`, `button`, `image`, `form` cover a basic landing page section? If yes, ship it.

### Session 5: Server functions to read/write funnels
**Goal:** Code-level functions (not UI yet) to create a funnel, save page content, fetch a funnel by slug.
**Do:**
- `createFunnel(name)`
- `savePage(pageId, content)`
- `getFunnelBySlug(slug)`
- Call these from a temporary test page/script to confirm they work
**Done when:** You can create a funnel and save block content to it from code, and read it back.
**Verify:** Run each function once, check the Supabase table updates correctly.

---

## PHASE 2 — Real auth (Sessions 6–7)

Now that the data model exists and works against a hardcoded test user, swap that out for real login. This is the right time for auth — not session 1, because there was nothing to protect yet; not session 15, because the dashboard you're about to build needs to know whose funnels it's showing.

### Session 6: Auth — email/password
**Goal:** A user can sign up and log in with email/password; the app uses their real id instead of the hardcoded test id.
**Do:**
- Set up Supabase Auth (email/password provider, already on by default)
- Build `/signup` and `/login` pages
- Build session handling (Supabase SSR helpers, middleware for protected routes)
- Replace the hardcoded test user id from Phase 1 with the real logged-in user's id everywhere it was used
- Build a `/dashboard` page that only loads if logged in, redirects to `/login` if not
**Done when:** You can sign up, get logged in, see `/dashboard`, log out, and get redirected away from `/dashboard` when logged out — and your existing test-user funnel data still works correctly under the new real account.
**Verify:** Do the full flow yourself in the browser: signup → dashboard → logout → try /dashboard again → redirected.

### Session 7: Auth — Google login + security pass
**Goal:** Google OAuth works, and auth is actually secure end to end.
**Do:**
- Enable Google provider in Supabase Auth, set up OAuth credentials in Google Cloud Console
- Add "Continue with Google" button
- Review: confirm `.env.local` is in `.gitignore` (no keys ever committed)
- Review: re-check RLS on every table built so far (funnels, pages) now that real users exist, not just the hardcoded test one
**Done when:** Google login works end to end, and RLS is confirmed correct under real accounts.
**Verify:** Log in with Google. Then try querying another real user's row using the anon key from a different logged-in session — it should be blocked by RLS.

---

## PHASE 3 — The builder UI (Sessions 8–14)

### Session 8: Dashboard — list + create funnels
**Goal:** Logged-in user sees their funnels, can create a new one.
**Do:**
- `/dashboard` lists the user's funnels (name, status, last edited)
- "New funnel" button → creates a funnel row → redirects to its editor
**Done when:** You can create multiple funnels and see them listed.
**Verify:** Create 2 funnels, confirm both show up, confirm a different test user sees none of them.

### Session 9: Editor shell — render blocks (read-only first)
**Goal:** A page that loads a funnel's page content and renders the blocks as actual HTML (no editing yet).
**Do:**
- `/dashboard/funnels/[id]/edit`
- Fetch the page content, map over blocks, render a component per block type (`HeadingBlock`, `TextBlock`, `ButtonBlock`, `ImageBlock`, `FormBlock`)
**Done when:** Manually-inserted block JSON renders correctly as a page.
**Verify:** Insert test block JSON in Supabase directly, load the editor page, see it rendered correctly.

### Session 10: Add a block
**Goal:** "Add block" UI — pick a type, it appends to the page, saves to Supabase.
**Do:**
- "+ Add block" button → small menu (heading/text/button/image/form)
- On click, append a new block with default props, save immediately
**Done when:** Clicking "add heading" actually adds a heading block and it persists after refresh.
**Verify:** Add a block, refresh the page, confirm it's still there (proves it saved, not just local state).

### Session 11: Edit a block's content
**Goal:** Click a block, edit its text/props inline, save.
**Do:**
- Click-to-edit on each block type (contenteditable text, a simple form for button label/link, image URL input)
- Save on blur or with a save button — your call, but be consistent
**Done when:** You can change a heading's text and it persists.
**Verify:** Edit text, refresh, confirm the change stuck.

### Session 12: Reorder + delete blocks
**Goal:** Move blocks up/down, delete a block.
**Do:**
- Up/down arrows or drag handles per block
- Delete button per block (with a confirm step — don't let one misclick wipe a block silently)
**Done when:** You can reorder a 3-block page and delete one, and it's correct after refresh.
**Verify:** Reorder, refresh, confirm order stuck. Delete, refresh, confirm it's gone.

### Session 13: Publish flow
**Goal:** A "Publish" button that makes the funnel viewable at a public URL.
**Do:**
- Public route: `/f/[slug]` (or similar) — renders the published version of the page
- "Publish" button sets funnel `status = published` and locks in the current content as the published snapshot (don't let live edits instantly change what's public — copy it on publish)
**Done when:** Visiting `/f/your-slug` shows the funnel, logged out, with no editor UI.
**Verify:** Log out completely, visit the public URL in an incognito window, confirm it loads and looks right.

### Session 14: Make published pages fast
**Goal:** Published funnel pages load fast — this is the actual competitive feature, treat it seriously.
**Do:**
- Switch published page rendering to static generation or ISR (Incremental Static Regeneration) rather than client-fetching on every load
- Re-generate the static page when "Publish" is clicked
- Test load speed (Vercel's own speed insights, or just a stopwatch + hard refresh)
**Done when:** A published page loads near-instantly, not "spinner then content."
**Verify:** Hard refresh the public funnel URL a few times. It should render immediately, not flash blank/loading first.

---

## PHASE 4 — Tracking (Sessions 15–19)

### Session 15: Events table
**Goal:** Database table to store tracking events securely.
**Do:**
- Table `events`: id, funnel_id, page_id, type (page_view/click/conversion), session_id (anonymous visitor identifier, not tied to your user accounts), metadata (jsonb), created_at
- RLS: public can INSERT (visitors aren't logged in), but only the funnel owner can SELECT their funnel's events — this is the important security rule, get it right
**Done when:** RLS allows anonymous inserts but blocks reads from non-owners.
**Verify:** Try inserting an event as an anonymous (no-auth) client — should work. Try reading another user's events as a logged-in different user — should be blocked.

### Session 16: Page view tracking
**Goal:** Every visit to a published funnel page logs a `page_view` event.
**Do:**
- On `/f/[slug]` page load, fire an insert to `events` with type `page_view`, a generated/stored anonymous session id (cookie or localStorage)
**Done when:** Visiting a published funnel creates a row in `events`.
**Verify:** Visit a published funnel page, check Supabase, confirm the event landed with correct funnel_id.

### Session 17: Click tracking
**Goal:** Button clicks on a published funnel log a `click` event.
**Do:**
- Buttons fire a tracking call on click before/alongside navigating
- Store which block/button was clicked in `metadata`
**Done when:** Clicking a button on a live funnel logs a click event with identifying info.
**Verify:** Click a published funnel's button, confirm a `click` event row appears with the right block id.

### Session 18: Conversion tracking
**Goal:** Form submission counts as a `conversion` event.
**Do:**
- Form block submission → insert a `conversion` event (and store the submitted form data somewhere sane and secure — a separate `leads` table, not just shoved in event metadata if it contains personal info)
- RLS on `leads` table same pattern as events: public insert, owner-only read
**Done when:** Submitting a form on a live funnel logs a conversion and stores the lead data securely.
**Verify:** Submit a test form, confirm both the conversion event and the lead row exist, confirm a different user can't read that lead.

### Session 19: Basic analytics dashboard
**Goal:** Funnel owner can see view/click/conversion counts for their funnel.
**Do:**
- Simple dashboard view: total views, total clicks, total conversions, basic conversion rate (conversions/views)
- Doesn't need to be fancy — numbers in a card is enough for v1
**Done when:** You can look at a funnel's dashboard and see real numbers that match what you generated by testing.
**Verify:** Generate known test traffic (visit 3 times, click twice, submit once), confirm the dashboard shows 3/2/1.

---

## PHASE 5 — Later (not detailed yet, don't start until v1 above is solid)

These are intentionally **not** broken into sessions yet, because their data model depends on Phases 1–4 being done and stable first. Revisit and plan these properly once v1 works end-to-end.

- **Video/VSL blocks** — embed-based video block type, later: watch-time tracking (per-second retention like Clyro)
- **AI-assisted editing** — "add a hero section" style prompting that edits the block JSON via an LLM API call
- **AI-from-reference generation** — feeding in example funnel sites, AI proposing a full funnel structure
- **Custom domains** — beyond the kenzo.io subdomain
- **Payments/checkout** — explicitly last, not touched until everything above works

---

## Notes on pace

19 sessions at ~1hr/day ≈ 3–4 weeks if you're consistent, longer if not — that's fine, this isn't a race. If a session's "Done when" isn't true at the end of an hour, that's not a failure, just pick it back up next session. Don't merge two sessions into one to "catch up" — that's exactly the kind of overloaded-context situation that produces worse results.
