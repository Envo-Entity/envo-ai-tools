# ENVO AI TOOLS

A simple monorepo with:

- `Frontend`: Next.js app using Tailwind, TanStack Query, and shadcn-style UI components
- `Backend`: Node.js + TypeScript + Express API with Gemini integration and Drizzle/Neon setup

## Getting Started

1. Install dependencies:

```bash
npm run setup
```

2. Create env files from the examples:

- `cp Backend/.env.example Backend/.env`
- `cp Frontend/.env.example Frontend/.env.local`

3. Add your values:

```env
# Backend/.env
PORT=4000
FRONTEND_URL=http://localhost:3000

DATABASE_URL=your_neon_database_url

GEMINI_API_KEY=your_gemini_api_key
GEMINI_TEXT_MODEL=gemini-3.1-pro-preview
GEMINI_IMAGE_MODEL=gemini-3.1-flash-image-preview

META_APP_ID=your_meta_app_id
META_APP_SECRET=your_meta_app_secret
META_ACCESS_TOKEN=your_meta_access_token
META_AD_ACCOUNT_ID=123456789012345
META_PAGE_ID=123456789012345
META_DSA_BENEFICIARY=Your legal business name
META_DSA_PAYOR=Your legal paying entity name

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

Notes:

- `META_AD_ACCOUNT_ID` should be the Meta ad account ID. `123456789012345` is preferred, and `act_123456789012345` is also accepted.
- `META_APP_ID` and `META_APP_SECRET` are included in the example because they are part of the expected Meta credential set, even though the current campaign-creation flow only directly requires `META_ACCESS_TOKEN`, `META_AD_ACCOUNT_ID`, and `META_PAGE_ID` at runtime.
- `META_DSA_BENEFICIARY` should be the legal person or organization being promoted in the ad.
- `META_DSA_PAYOR` should be the legal paying entity if Meta requires it for the account. In many cases it can be the same as the beneficiary.

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
