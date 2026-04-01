# ENVO AI TOOLS

A simple monorepo with:

- `Frontend`: Next.js app using Tailwind, TanStack Query, and shadcn-style UI components
- `Backend`: Node.js + TypeScript + Express API with Gemini integration and Drizzle/Neon setup

## Getting Started

1. Install dependencies:

```bash
npm run setup
```

2. Create env files:

- `Backend/.env`
- `Frontend/.env.local`

3. Add your values:

```env
# Backend/.env
PORT=4000
DATABASE_URL=your_neon_database_url
GEMINI_API_KEY=your_gemini_api_key
FRONTEND_URL=http://localhost:3000
SITE_PASSWORD=1234
AUTH_COOKIE_SECRET=use-a-long-random-string-here
```

```env
# Frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:4000
```

4. Start both apps:

```bash
npm run dev
```

## Included

- Drizzle + Neon DB client setup
- Gemini chat endpoint using `gemini-3.1-pro-preview`
- Minimal full-stack chat UI
