# AI — Provider Chain, Prompts & Scoped Edits

The AI is the builder's core, exactly as in [Clyro](REFERENCE-CLYRO.md): describe a change → AI writes the funnel (blocks + settings) → preview updates live. Two edit granularities — **whole-funnel** and **scoped** (Inspect).

## Provider chain ✅

```
DeepSeek (primary) → Vercel AI Gateway → Anthropic → OpenAI → Gemini (fallback)
```

Ordered by cost + quality. DeepSeek primary for strong JSON + low cost; Vercel AI Gateway gives unified access with zero data retention. Extracted into `lib/ai-provider.ts` with retries (Phase 5 ✅) and used by all AI routes.

> **No credits.** Unlike Clyro, kenzo does not meter or bill AI usage. Cost tracking (model/tokens/latency) may be logged internally for ops, but no credit counter or per-message cost is shown to users.

## Composer modes

- **Chat** (✅) — code/content edits. The only mode for now.
- **Image** (— ) — Clyro generates visuals; kenzo skips AI image-gen. Users **upload** their own images via 📎 attach (📋) instead.

Model is selectable per message via the composer picker 🔨. See [model selection](#model-selection).

## Scoped edits — Inspect 📋

Clyro's most-hyped feature: click an element in the preview to capture it as the edit target. kenzo maps this onto the existing two-shape AI contract:

- **No block selected** → message edits the whole funnel.
- **Block selected** (clicked in preview) → the request includes `selectedId`; the AI returns **targeted `ops`** that touch only that block, leaving everything else byte-for-byte unchanged.

This already exists structurally — `lib/ai-prompt.ts` distinguishes **targeted ops** (`{ "ops": [...], "settings": {...}, "explanation": "..." }`) from **full rebuild** (`{ "blocks": [...], "settings": {...}, "explanation": "..." }`). Scoped edits = pass `selectedId` + instruct the AI to emit ops only for that block.

## AI endpoints

### `POST /api/ai` — Edit existing funnel ✅
```
Request:  { blocks, settings, prompt, model?, funnelId?, selectedId? }
Response: { ops | blocks, settings, explanation }
```
Used by the editor's AI composer. `selectedId` (📋) scopes the edit to one block → AI returns `ops`. Full rebuild only when the user explicitly asks ("rebuild", "start over", "regenerate the whole page").

### `POST /api/ai/build-funnel` — Build funnel from answers ✅
```
Request:  { blocks, settings, answers, message }
Response: { blocks, settings, explanation }
```
Used by the live-chat split-screen. Builds the funnel progressively as the user answers.

### `POST /api/ai/plan-funnel` — Plan funnel structure ✅
```
Request:  { answers }
Response: { plannedSections, template, reasoning }
```
Pre-plans block order + picks a template before building.

### `POST /api/ai/create-funnel` — Create funnel from scratch 🔨
```
Request:  { plannedSections?, name, niche, audience, price, tone, goal, socialProof }
Response: { blocks, settings }
```
**Fixed in Phase 1**: `plannedSections` made optional (supplied from template selection when absent). Superseded by the live-chat flow for the main create path.

## System prompt ✅

Defined in `lib/ai-prompt.ts` → `SYSTEM_PROMPT`. Key sections:
- Block schema (12 types with full props)
- Settings schema (all 25 fields)
- **Op vs rebuild rules** — targeted `ops` by default; full rebuild only on explicit request
- Human writing rules (banned words, rhythm, voice, specificity)
- Self-audit checklist + section-constraint enforcement
- Few-shot examples (3)
- Output format (minified JSON, no fences)
- **Compose-don't-invent rule** — use existing block/section types; only introduce new structure when the user genuinely needs functionality the library lacks (Clyro's doctrine)

## JSON extraction ✅

`extractJson(text)`: trim → strip markdown fences → extract first `{` to last `}` → return trimmed JSON.

## Validation contract ✅

Every AI response MUST be validated before rendering:

```typescript
function validateBlocks(blocks: unknown): Block[] {
  // 1. Must be array
  // 2. Each item must have: id (string), type (valid BlockType), props (object)
  // 3. Missing props → fill from DEFAULT_PROPS[type]
  // 4. Invalid blocks → omit with warning
  // 5. Return sanitized array (always valid, never throws)
}
```

For `ops`: apply each op against the current blocks; if an op references a missing id or invalid field, skip it and keep the funnel unchanged (never crash).

## Model selection

| Model | Use case | Notes |
|-------|----------|-------|
| DeepSeek V3 | Primary — all funnel builds | Low cost, strong JSON |
| Claude Opus 4.x | Complex rewrites | Most capable |
| Claude Sonnet 4.x | Standard edits | Balanced |
| GPT-4o | Alternative perspective | Fallback |
| Gemini Pro | Last resort | Fallback |

Composer shows a model picker (Clyro-style, minus the credit hint) so the user can pick capability per task.

## Retry strategy ✅

1. Attempt 1: primary model (DeepSeek)
2. On JSON parse failure: retry primary with stricter prompt ("ONLY valid JSON, no commentary")
3. On second failure: fall back to next provider in the chain
4. On all failures: return current state unchanged + error explanation (funnel never breaks)

## Streaming ✅ (simulated) → 📋 (true SSE)

`lib/ai-provider.ts` simulates streaming (`createSimulatedStream`, 3 words/chunk) so the explanation types out live. True provider SSE for incremental block updates is planned:
```
event: block_update
data: {"blocks":[...],"settings":{...},"partial":true}

event: done
data: {"blocks":[...],"settings":{...},"explanation":"..."}
```

## Internal cost tracking (ops only, not user-facing)

- Optionally log model, token count, latency per request.
- Store in a separate ops table or logs — **never surfaced as user credits.**
