# STAGEONE

An AI Artist Growth Operating System — a premium, cinematic SaaS web app that helps independent artists launch music like a major label.

## Run & Operate

- `pnpm --filter @workspace/stageone run dev` — run the frontend (port assigned by workflow)
- `pnpm --filter @workspace/api-server run dev` — run the API server
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, Tailwind CSS, Framer Motion, shadcn/ui, wouter (routing)
- API: Express 5
- Icons: lucide-react
- Build: esbuild (API), Vite (frontend)

## Where things live

- `artifacts/stageone/` — React + Vite frontend (landing page + dashboard)
- `artifacts/stageone/public/` — Static assets: logo.png, favicon.png
- `artifacts/stageone/src/pages/` — Page components (landing, dashboard, not-found)
- `artifacts/stageone/src/index.css` — Global theme / CSS variables
- `artifacts/api-server/` — Express API server

## Architecture decisions

- Dark-mode only app — html element always has class "dark"; no light mode toggle
- All CSS custom properties set to STAGEONE color palette (deep blacks + metallic gold accent #C8A96B)
- Logo served from /public/logo.png, referenced via import.meta.env.BASE_URL
- Presentation-first build — no backend/database needed for v1; dashboard uses static seed data
- Framer Motion used for all animations: scroll-triggered reveals, hover states, floating hero mockup

## Product

- **Landing page** (/) — Cinematic marketing page: hero, problem section, AI feature grid, Artist DNA panel, workflow steps, CTA, footer
- **Dashboard** (/dashboard) — Artist control center: sidebar nav, campaign cards, analytics stats, DNA profile panel, activity feed

## User preferences

- Premium, cinematic feel — comparable to Linear, Raycast, Arc Browser
- Exact brand colors: Background #0A0A0B, Gold accent #C8A96B, borders #2B2B31
- No emojis anywhere in the UI
- Inter font for all typography

## Gotchas

- Logo must be referenced as `${import.meta.env.BASE_URL}logo.png` (not /logo.png) since the app may be served at a subpath
- Google Fonts @import must be the very first line in index.css before all other @imports

## Pointers

- See the `pnpm-workspace` skill for workspace structure and TypeScript setup
- See the `react-vite` skill for frontend build conventions
