# Create Flow — Live-Chat Split-Screen

## Overview

The `/create` page is the centerpiece of Kenzo. It replaces the old form-based wizard (`OnboardingWizard`) with a single split-screen:

```
┌─────────────────────┬──────────────────────────┐
│                     │                          │
│    AI CHAT (LEFT)   │   LIVE PREVIEW (RIGHT)   │
│                     │                          │
│  Asks questions     │   BlockRenderer renders  │
│  about niche,       │   funnel in real-time    │
│  offer, audience    │   as AI emits blocks     │
│                     │                          │
│  Persists answers   │   Starts from            │
│  to business_       │   makeBaseFunnel()       │
│  profiles           │                          │
│                     │                          │
└─────────────────────┴──────────────────────────┘
```

## Component: `LiveChatBuilder.tsx`

### Layout
- LEFT panel (~40% width): Chat interface
- RIGHT panel (~60% width): Live funnel preview (read-only `BlockRenderer`)

### Chat flow

1. **Opening**: AI greets user, asks first questions (niche + offer type)
2. **Discovery rounds**: 2-3 rounds of questions, each building on previous answers
   - Round 1: Niche, who they help, what they sell
   - Round 2: Price point, audience pain points, tone/voice
   - Round 3: Social proof (testimonials, results, case studies)
3. **Template selection**: AI selects skeleton internally (Waitlist / Application / VSL / Agency)
4. **Live build**: After each answer, AI emits `{blocks, settings, explanation}`
5. **Completion**: User says "done" or AI signals completion → funnel persisted → redirect to editor

### Question content

Repurposed from `app/api/ai/onboarding-questions/route.ts` into a conversational script:
- Niche / industry
- Target audience / avatar
- Offer type (course, coaching, community, service)
- Price point
- Key transformation / outcome
- Pain points the offer solves
- Tone of voice (professional, casual, bold, empathetic)
- Social proof (testimonials, numbers, case studies)
- Call to action preference

### Answer persistence

Each answer is upserted to `business_profiles` by `user_id` as it arrives. Fields:
- `niche`, `offer_type`, `price_point`, `target_audience`
- `pain_points`, `transformation`, `tone`, `social_proof`
- `cta_preference`

### Template selection

AI chooses from 4 archetypes based on answers:

| Answers signal | Template | Block order |
|----------------|----------|-------------|
| Pre-launch, email capture only | Waitlist | hero → ticker → cards → faq → cta |
| High-ticket, qualification needed | Application | hero → ticker → cards → results → faq → apply |
| Video-driven, long-form sales | VSL | hero(video) → cards → faq → cta |
| Service/agency, portfolio | Agency | hero → cards → results → faq → cta |

### Preview reliability

1. **Start valid**: Always begin from `makeBaseFunnel()` — guaranteed 6 valid blocks
2. **Validate AI output**: Every block from AI checked against `DEFAULT_PROPS[type]`
3. **Sanitize missing props**: Fall back to `DEFAULT_PROPS[type]` for any missing/undefined props
4. **Error boundary**: `ErrorBoundary` wraps `BlockRenderer` → catches render errors gracefully
5. **Re-render safety**: Preview uses stable keys (`block.id`) to avoid flicker

## API: `POST /api/ai/build-funnel`

### Request
```json
{
  "blocks": [...],
  "settings": {...},
  "answers": {
    "niche": "reselling",
    "offer_type": "coaching",
    "price_point": "997",
    "target_audience": "beginners",
    "pain_points": "no vendor access",
    "transformation": "10k/month",
    "tone": "bold",
    "social_proof": "200+ members"
  },
  "message": "Make it more aggressive"
}
```

### Response
```json
{
  "blocks": [...],
  "settings": {...},
  "explanation": "Updated hero CTA, added urgency to ticker..."
}
```

### Validation
1. Parse JSON → `extractJson()` strips fences
2. Validate each block: type must be valid `BlockType`, props must match shape
3. Missing props → fill from `DEFAULT_PROPS[type]`
4. Invalid blocks → omit, log warning
5. Return sanitized output

### Known bug to reconcile

`app/api/ai/create-funnel/route.ts` requires `plannedSections` + base keys (`name, niche, audience, price, tone, goal, socialProof`), but `OnboardingWizard.generateFunnel()` sends `{answers:{offer_type, transform, …}}` with NO `plannedSections` → it 400s. The new live-chat flow replaces this path. **Fix in Phase 1**: make `plannedSections` optional or supply from template.

## Transition to editor

1. User clicks "Done" or AI signals completion
2. Funnel persisted via `createFunnel()` + page with blocks+settings
3. Redirect to `/dashboard/funnels/[id]/edit?tab=ai`
4. Future: inline fade-in of editor chrome on same screen (no redirect)
