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
AUTH_COOKIE_DOMAIN=
AUTH_COOKIE_SAME_SITE=lax
AUTH_COOKIE_SECURE=true
UPLOADTHING_TOKEN=your_uploadthing_token
```

```env
# Frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:4000
```

4. Start both apps:

```bash
npm run dev
```

Optional production auth cookie settings:

- `AUTH_COOKIE_DOMAIN`: set this when the frontend and backend should share the auth cookie across subdomains
- `AUTH_COOKIE_SAME_SITE`: `lax`, `strict`, or `none`
- `AUTH_COOKIE_SECURE`: `true` or `false`

## Included

- Drizzle + Neon DB client setup
- Gemini chat endpoint using `gemini-3.1-pro-preview`
- Minimal full-stack chat UI
- UploadThing asset uploads with client-side resize/compression before upload

## Drizzle Studio

From the backend folder, run:

```bash
cd /Users/shivanshsharma/Code/aitools/Backend
bun run db:studio
```

It will use `Backend/.env` and open Drizzle Studio against your Neon database.
