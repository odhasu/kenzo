# Kenzo ⚡

Kenzo is a premium, high-converting funnel builder SaaS designed specifically for agencies, coaches, and resellers selling high-ticket offers. It clones the clean aesthetics and layout conversion strategies of clyro.io.

## Key Features

- **✦ Template-First Creation**: Funnels are created from a gallery of conversion-ready templates at `/templates`. "Use template" seeds a funnel with guaranteed-valid blocks + theme and opens the editor — no AI wait on creation.
- **✦ Kenzo AI Builder**: In the 3-panel editor, the AI Builder sidebar is a *thinking partner* — it reasons out loud, asks before guessing, and applies scoped edits (add/update/delete/move blocks + settings). Pick **Best** (Claude) or **Fast** (DeepSeek); the provider chain falls through on failure. Chat sessions persist per funnel.
- **✦ Passwordless Bypass (`og@gmail.com`)**: Features a passwordless bypass login for test user `og@gmail.com`. Enter the email and leave the password blank (or enter `og`) to be signed in automatically with a valid, secure Supabase session.
- **✦ Proxy Route Security**: Proxy (`proxy.ts`) secures the `/dashboard` and `/admin` routes. Unauthenticated visitors are automatically intercepted and redirected to `/login`.
- **✦ Multi-Style Theming**: 4 selectable theme presets (Dark Green, Dark Minimal, Light Clean, Light Blue). Sections use CSS custom properties — switch entire funnel style with one click. No hardcoded colors.

## Getting Started

### 1. Environment Configuration

Create a `.env.local` file in the root directory and add the following keys:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# AI providers — DeepSeek = Fast, Anthropic/Claude = Best. The chain falls through on failure.
DEEPSEEK_API_KEY=your_deepseek_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key

# Optional extra fallbacks / model overrides
# AI_GATEWAY_API_KEY=your_vercel_ai_gateway_key
# OPENAI_API_KEY=your_openai_api_key
# GEMINI_API_KEY=your_gemini_api_key
```

### 2. Run the Development Server

Install dependencies and start the Next.js local server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Tech Stack
- **Framework**: Next.js (App Router, Turbopack)
- **Database / Auth**: Supabase (PostgreSQL, GoTrue SSR)
- **AI Models**: Multi-provider chain — DeepSeek (Fast) + Anthropic Claude (Best), with Vercel AI Gateway / OpenAI / Gemini fallback
- **Styling**: TailwindCSS & Theme-driven CSS Custom Properties (see `lib/themes.ts`)
