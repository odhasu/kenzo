# DeepSeek build prompt — Part 6: Kenzo AI becomes a thinking builder

> Paste everything below the line into DeepSeek as a single build task. It is self-contained.
> Goal in one line: stop the AI from blindly editing on every message. Make it **think, reply, and edit only when the request is a clear change** — and give it the power to do hard edits.
> Source of truth: `docs/AI.md` and `docs/EDITOR.md` (already updated). If this prompt and those docs ever disagree, the docs win.

---

## Role

You are a senior Next.js engineer in the `kenzo` repo — a funnel-builder SaaS for coaches selling $400–$1000+ offers. Stack: **Next.js App Router + TypeScript + Tailwind + Supabase + Vercel**. You make precise, working edits and never break the build.

## Hard rules (read first)

- This is a **modified Next.js** — APIs/conventions may differ from your training data. Before writing routing/rendering/server code, read the relevant guide in `node_modules/next/dist/docs/`. Heed deprecation notices.
- Never touch `node_modules`, `.next`, `next-env.d.ts`, `tsconfig.tsbuildinfo`.
- Never import from any `components/_ref-*` or `components/refernces/*` folder — reference only.
- DB changes = a **new numbered SQL file** in `supabase/migrations/`. Keep RLS on every table.
- Published funnel pages (`/f/[slug]`) stay **ISR** and fast (<1s).
- Event handlers only in `'use client'` components, never Server Components.
- **No provider names, no model picker, no credits** anywhere in the UI. The brand is "Kenzo AI".
- The funnel must **never break**: a bad AI op is skipped, not fatal.

---

## The behavior you are building (the whole point)

Today `SYSTEM_PROMPT` forces the model to output edit-ops JSON on *every* turn, "no prose." That's why it ignores intent and always changes code. Replace that with a 3-action model. Every turn the AI:

1. **Thinks** — streams its full reasoning first.
2. **Replies** — always returns a conversational `reply`.
3. **Acts** — picks exactly one `action`:

| `action` | Trigger | Effect on the funnel |
|----------|---------|----------------------|
| `talk` | Question, advice, strategy, greeting — not a change request | none (`ops` empty) |
| `clarify` | Change requested but vague / ambiguous / large | none; returns ONE `question` |
| `edit` | Clear, unambiguous, actionable change | applies `ops` (or `blocks` on explicit rebuild) straight to canvas |

**The rule: edit only when the change is clear. When unsure, clarify — never guess. Otherwise just talk.**

### Response contract (the model's JSON, after the thinking stream)
```jsonc
{
  "action": "talk" | "clarify" | "edit",
  "reply": "string — ALWAYS present",
  "question": "string — only when action='clarify'",
  "ops": [ /* targeted ops — when action='edit' */ ],
  "blocks": [ /* full page — only on explicit rebuild */ ],
  "settings": { /* changed fields (ops) or all fields (rebuild) */ }
}
```

---

## Tasks (file by file)

### 1. `lib/ai-prompt.ts` — new system prompt
- Replace `SYSTEM_PROMPT` with the new prompt text in **`docs/AI.md` → "System prompt"** (the fenced block). Use it verbatim, then append the full BLOCK SCHEMA and SETTINGS SCHEMA that already exist in the current prompt (don't lose them).
- Keep `extractJson()` as-is.
- Add the new `code` block to the BLOCK SCHEMA text: `'code': props: { html: string }` with a note that inline JS is stripped on publish.

### 2. `app/api/ai/route.ts` — parse + apply the new contract
- Parse the model output into `{ action, reply, question?, ops?, blocks?, settings? }`.
- **Only mutate when `action='edit'`.** For `talk` / `clarify`, return the reply/question and the **unchanged** blocks+settings. Ignore any stray `ops` on non-edit actions.
- Unknown / missing `action` → treat as `talk` (safe default, no edit).
- Keep `applyOps` + `validateBlockProps`. A bad op (missing id / invalid field) is skipped; funnel stays valid.
- Stream over SSE:
  ```
  event: thinking   data: {"delta":"..."}     // 0..n, the reasoning
  event: message    data: { action, reply, question?, ops|blocks, settings, blocks (resolved), settings (resolved) }
  event: done       data: {}
  ```
  Return the **resolved** blocks+settings (after ops applied) in the `message` event so the client can render without re-applying.

### 3. `lib/ai-provider.ts` — thinking channel
- In `callAI`, when the provider exposes reasoning (DeepSeek `reasoning_content`, Anthropic thinking), surface it as a stream the route can forward as `thinking` events.
- If no reasoning channel, emit a short `thinking` preamble (1–2 lines) so the UX is consistent.
- Keep the silent fallback chain DeepSeek → Gateway → Anthropic → OpenAI → Gemini and the JSON-retry behavior.

### 4. `components/editor/AiBuilderPanel.tsx` — render think → reply → edit
- Show a **collapsible "Thinking…" block** that fills from `thinking` events, then collapses when `message` arrives.
- Render `reply` as the assistant message. If `action='clarify'`, show `question` as the prompt to answer.
- **Apply to canvas only when `action='edit'`** (use the resolved blocks+settings from the `message` event). For `talk`/`clarify`, change nothing on the canvas.
- Wire each applied AI edit into the editor's **undo stack** so ↶ reverts it. (If no undo stack exists, add a simple one in `EditorLayout.tsx`: snapshot blocks+settings before each AI edit.)
- Persist messages to `chat_messages` as today.

### 5. `types/blocks.ts` + `lib/templates.ts` — the `code` block
- Add `BlockType` `'code'` with props `{ html: string }`.
- Add `DEFAULT_PROPS.code = { html: '<!-- your html/css/js -->' }`.

### 6. Rendering the `code` block — full in editor, sanitized on publish
- **Editor preview** (`BlockRenderer` in the editor context): render `html` raw, scripts allowed, so the builder sees the real thing.
- **Published `/f/[slug]`** (ISR, public): render through a new **`lib/sanitize.ts`** that strips `<script>`, inline event handlers (`on*=`), and `javascript:` URLs, and allows only whitelisted iframe embeds (youtube, vimeo, calendly, typeform). This blocks XSS against visitors and protects lead capture.
- Pick the trust level by render context (editor vs published), not by a prop the AI controls.

---

## Acceptance criteria (test these exact behaviors)

1. "is this hero any good?" → `talk`. Reply with an opinion. **Canvas unchanged.**
2. "make it pop more" → `clarify`. Asks one question (e.g. which section / bigger or brighter). **Canvas unchanged.**
3. "change the hero headline to 'Lose 10kg in 12 weeks'" → `edit`. Headline updates, nothing else moves.
4. "rebuild it from scratch, cleaner" → `clarify` first (keep anything?), then rebuild after the answer.
5. Thinking text streams visibly, then collapses.
6. Add a countdown via a `code` block → ticks in the editor; on the published page the markup renders but injected `<script>` is stripped (no console errors, no XSS).
7. A deliberately malformed op does **not** break the funnel.
8. `npm run build` is green. No provider names / model picker / credits in the UI.

## Out of scope
- New marketing pages, billing, new templates content, analytics changes.
- Don't refactor unrelated files. Stay inside the AI path + the `code` block + undo wiring.
