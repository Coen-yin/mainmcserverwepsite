# techy Minecraft Server Website

## Overview

Full-featured Minecraft server website for the "techy" server. Built with React + Vite frontend, Express API server, PostgreSQL database, and Clerk authentication.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React 18 + Vite + Tailwind CSS v4
- **Auth**: Clerk (with Google sign-in)
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Routing**: Wouter
- **Data fetching**: TanStack React Query

## Admin Access

- Admin password: `Carronshore93`
- Access via `/admin` route

## Features

- Home page with live server status, player count, announcements
- Sign in / Sign up with email or Google (via Clerk)
- User profiles with Minecraft username, bio, rank badge
- Forums with categories, threads, posts, pin/lock (admin)
- Announcements system with types (general/important/update/event)
- Server rules with severity levels
- Public ban list
- Ban appeal submission
- Staff application form
- Vote for the server on multiple sites with cooldown tracking
- Player leaderboards (kills, deaths, playtime, votes, money)
- Screenshot gallery
- Store with ranks, cosmetics, boosters, bundles
- Changelog/version history
- Support tickets
- Admin panel with full control: users, bans, appeals, applications, announcements, forums, gallery, rules, store, changelog, tickets

## Render Deployment

The project is set up to deploy as a **single web service** on Render. The Express API server serves both the API and the built React frontend.

### Files for Render
- `render.yaml` — Blueprint config (web service + PostgreSQL database)
- `render-build.sh` — Build script (installs, builds frontend + API, runs DB migrations)

### Steps to deploy on Render
1. Push this repo to GitHub
2. Go to [render.com](https://render.com) → New → **Blueprint**
3. Connect your GitHub repo — Render will detect `render.yaml` automatically
4. Set the required environment variables:
   - `VITE_CLERK_PUBLISHABLE_KEY` — from [dashboard.clerk.com](https://dashboard.clerk.com) (starts with `pk_live_`)
   - `CLERK_SECRET_KEY` — from Clerk dashboard (starts with `sk_live_`)
   - `VITE_CLERK_PROXY_URL` — set to `https://YOUR-APP-NAME.onrender.com/api/__clerk` after first deploy
5. Deploy! Render will provision a free PostgreSQL database, build everything, and start the server.

### Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

## Artifacts

- `artifacts/techy-mc` — React + Vite frontend (preview path: `/`)
- `artifacts/api-server` — Express API server (path: `/api`)

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
