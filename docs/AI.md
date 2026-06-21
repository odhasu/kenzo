# AI — Provider Chain & Prompts

## Provider chain

```
DeepSeek (primary) → Vercel AI Gateway → Anthropic → OpenAI → Gemini (fallback)
```

Ordered by cost + quality for this use case. DeepSeek is primary for its strong JSON output and low cost. Vercel AI Gateway provides unified access with zero data retention.

### Current inconsistency (Phase 5 fix)

- `/api/ai` — uses full provider chain
- `/api/ai/create-funnel` — DeepSeek-only
- `/api/ai/plan-funnel` — DeepSeek-only

Phase 5 extracts the chain into `lib/ai-provider.ts` and unifies all routes.

## AI endpoints

### `POST /api/ai` — Edit existing funnel
```
Request:  { blocks, settings, prompt, model?, funnelId? }
Response: { blocks, settings, explanation }
```
Used by the editor's AI Builder tab. Modifies existing funnel content.

### `POST /api/ai/build-funnel` — Build funnel from answers (Phase 1)
```
Request:  { blocks, settings, answers, message }
Response: { blocks, settings, explanation }
```
Used by the live-chat split-screen. Builds funnel progressively as user answers questions.

### `POST /api/ai/plan-funnel` — Plan funnel structure
```
Request:  { answers }
Response: { plannedSections, template, reasoning }
```
Pre-plans the block order and template before building.

### `POST /api/ai/create-funnel` — Create funnel from scratch
```
Request:  { plannedSections, name, niche, audience, price, tone, goal, socialProof }
Response: { blocks, settings }
```
**Known bug**: Requires `plannedSections` but `OnboardingWizard` doesn't send it → 400s.
Fix in Phase 1: make `plannedSections` optional or supply from template selection.

## System prompt

Defined in `lib/ai-prompt.ts` → `SYSTEM_PROMPT`. Key sections:
- Block schema (12 types with full props)
- Settings schema (all 25 fields)
- Human writing rules (banned words, rhythm, voice, specificity)
- Self-audit checklist
- Section constraint enforcement
- Few-shot examples (3)
- Output format (minified JSON, no fences)

## JSON extraction

`extractJson(text: string): string`
1. Trim whitespace
2. Strip markdown fences (` ```json ` or ` ``` `)
3. Extract from first `{` to last `}`
4. Return trimmed JSON string

## Validation contract

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

## Model selection

| Model | Use case | Cost |
|-------|----------|------|
| DeepSeek V3 | Primary — all funnel builds | Low |
| Claude Opus 4 | Fallback — complex rewrites | High |
| Claude Sonnet 4 | Fallback — standard edits | Medium |
| GPT-4o | Fallback — alternative perspective | Medium |
| Gemini Pro | Last resort | Low |

## Retry strategy

1. Attempt 1: Primary model (DeepSeek)
2. On JSON parse failure: Retry primary with stricter prompt ("ONLY valid JSON, no commentary")
3. On second failure: Fall back to next provider
4. On all failures: Return current state unchanged + error explanation

## Streaming (future)

Optional SSE streaming for live-chat build:
```
event: block_update
data: {"blocks": [...], "settings": {...}, "partial": true}

event: done
data: {"blocks": [...], "settings": {...}, "explanation": "..."}
```

## Cost tracking

- Log model, token count, and latency per request
- Store in `funnel_events` or separate table
- Dashboard shows AI usage/cost per funnel
