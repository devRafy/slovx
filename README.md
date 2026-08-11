# Xavier — AI-powered WhatsApp Sales Assistant

Xavier is a multi-tenant SaaS platform that lets businesses connect their WhatsApp
Business number and automate customer conversations using Claude AI.

## Stack

- **Frontend:** React 18 + Vite + Tailwind + Zustand + React Router
- **Backend:** Node.js + Express + Prisma (PostgreSQL / Supabase)
- **AI:** Anthropic Claude
- **Messaging:** Meta WhatsApp Cloud API (Embedded Signup)

## Project layout

```
xavier_saas/
├── backend/       Express API + Prisma
└── frontend/      Vite + React app
```

## Local setup

**Prerequisites:** Node 20+, a Supabase project, a Meta App with WhatsApp product,
an Anthropic API key.

### Backend

```bash
cd backend
npm install
cp .env.example .env    # fill in real values
npx prisma db push       # creates tables in Supabase
npm run dev              # runs on http://localhost:4000
```

### Frontend

```bash
cd frontend
npm install
# create .env with VITE_META_APP_ID and VITE_META_CONFIG_ID
npm run dev              # runs on http://localhost:5173
```

## Legal

- [Privacy Policy](/privacy)
- [Terms of Service](/terms)

© SlovX. All rights reserved.
