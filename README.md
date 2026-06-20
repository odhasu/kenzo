# Kenzo ⚡

Kenzo is a premium, high-converting funnel builder SaaS designed specifically for agencies, coaches, and resellers selling high-ticket offers. It clones the clean aesthetics and layout conversion strategies of clyro.io.

## Key Features

- **✦ AI Funnel Architect**: Replaces static form wizardry with an interactive 10-step chat interview. The architect gathers business goals, price points, and aesthetics to auto-generate customized copy and layouts using DeepSeek AI.
- **✦ Editor Chat Sidebar**: Once funnel generation finishes, users are redirected to the editor with the **AI Builder** tab pre-opened, loading their entire wizard chat history. You can converse with the assistant in real-time to adjust layout blocks, styling, colors, and copywriting.
- **✦ Passwordless Bypass (`og@gmail.com`)**: Features a passwordless bypass login for test user `og@gmail.com`. Enter the email and leave the password blank (or enter `og`) to be signed in automatically with a valid, secure Supabase session.
- **✦ Middleware Route Security**: Secures the `/dashboard` and `/admin` routes. Unauthenticated visitors are automatically intercepted and redirected to `/login`.
- **✦ Premium Dark Aesthetics**: Styled with neon green accents (`#39FF14`), modern Outfit/Inter typography, and fully responsive layouts.

## Getting Started

### 1. Environment Configuration

Create a `.env.local` file in the root directory and add the following keys:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
DEEPSEEK_API_KEY=your_deepseek_api_key
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
- **AI Models**: DeepSeek Chat API
- **Styling**: TailwindCSS & Custom Vanilla CSS Variables
