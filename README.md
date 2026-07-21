# Kyydissä — Small Furniture Delivery Marketplace

> A two-sided marketplace connecting people who need small furniture moved with drivers who have spare trunk space — built as a full-stack + AI engineering portfolio project.

[![Web](https://img.shields.io/badge/web-vercel-black)](https://furniture-marketplace-seven.vercel.app)
[![API](https://img.shields.io/badge/api-render-46E3B7)](https://furniture-marketplace-jkp7.onrender.com/swagger)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

---

## Why this project

Moving a single chair, side table, or shelf across a city is an oddly hard problem: public transport is awkward for it, and a "man with a van" minimum callout fee often costs more than the item itself. This project explores a lightweight marketplace for exactly that gap — **post what needs moving, drivers who are already going that way pick it up.**

It's built primarily as a demonstration of full-stack and applied-AI engineering: a real two-sided marketplace with auth, async post/favorite/accept workflows across web and mobile clients, backed by a typed .NET API — with an AI layer (RAG-based suggestions, an agentic route assistant, and an MCP server) layered on top as the project matures.

📸 *[Demo screenshot/GIF placeholder — drop a recording of the Browse → Favorite → Accept flow here]*

## Highlights

- **Three live clients, one backend** — a Next.js web app, an Expo/React Native mobile app, and a Swagger-documented .NET API, all talking to the same Postgres database in real time.
- **Real marketplace mechanics** — posts, favorites, and status transitions (Open → Accepted), not just CRUD.
- **Secure, role-aware auth** — JWT-based, with ASP.NET Core Identity roles (Buyer/Seller/Driver/Admin), and platform-appropriate token storage (`localStorage` on web, Keychain/Keystore via `expo-secure-store` on mobile).
- **Cost-conscious infrastructure** — designed to run on free tiers (Neon, Render, Vercel, Expo) end-to-end, with a UI-level cold-start warning banner for the API's free-tier sleep/wake cycle.
- **In progress: an AI engineering layer** — RAG-based post enrichment, an MCP server exposing marketplace data to any MCP-compatible agent, and a LangGraph-based route-matching assistant. See [Roadmap](#roadmap--known-simplifications).

## Tech stack

| Layer | Technology |
|---|---|
| Web | Next.js 14 (App Router), TypeScript, Tailwind CSS, Zustand |
| Mobile | Expo (React Native), Expo Router, TypeScript, Zustand, `expo-secure-store` |
| Backend | ASP.NET Core 8 (Minimal APIs), EF Core 8, ASP.NET Core Identity, JWT auth |
| Database | PostgreSQL (via [Neon](https://neon.tech), serverless/free-tier) |
| Hosting | [Vercel](https://vercel.com) (web), [Render](https://render.com) (API, Dockerized) |
| CI/CD Pipeline | GitHub Actions (`.github/workflows/ci.yml` & `.github/workflows/cd.yml`) |
| Planned (AI layer) | `pgvector`, LangChain/LangGraph, MCP TypeScript SDK |

## Architecture

```
┌──────────────────┐      ┌────────────────────┐
│  Next.js Web App  │      │  Expo Mobile App     │
│  (Vercel)          │      │  (Browse/Favorites/  │
│                    │      │   Profile tabs)       │
└─────────┬──────────┘      └──────────┬───────────┘
          │                            │
          └─────────────┬──────────────┘
                         │  REST + JWT
                ┌────────▼─────────┐
                │  ASP.NET Core API │
                │  (Render, Docker)  │
                └────────┬──────────┘
                         │
                ┌────────▼─────────┐
                │  PostgreSQL (Neon) │
                └────────────────────┘
```

## Project structure

```
furniture-marketplace/
├── Api/        → ASP.NET Core 8 backend (Identity, JWT auth, Posts, Favorites)
│   └── README.md   → backend-specific setup (Neon, user-secrets, migrations)
├── web/        → Next.js web app (browse, post, login/register)
│   └── README.md   → frontend-specific setup
├── mobile/     → Expo/React Native driver app (browse, favorites, accept)
└── README.md   → you are here
```

Each subfolder has its own README with detailed local setup instructions — this root README is the high-level map.

## Getting started

Each app runs independently and talks to the same API. Quick links to detailed setup:

- **[Api/README.md](./Api/README.md)** — .NET API: Neon database setup, `dotnet user-secrets`, running migrations, local run.
- **[web/README.md](./web/README.md)** — Next.js web app: install, env vars, running against a local or deployed API.
- **mobile/** — Expo app: `npm install`, then `npx expo start` (requires the Expo Go app on a physical device, or an iOS Simulator / Android Emulator). Points at the deployed Render API by default — see `mobile/lib/api.ts`.

In short, for a fully local setup: start the API first (`dotnet run` in `Api/`), then the web app (`npm run dev` in `web/`) and/or the mobile app (`npx expo start` in `mobile/`) in separate terminals.

## Live demo

- **Web:** [furniture-marketplace-seven.vercel.app](https://furniture-marketplace-seven.vercel.app)
- **API (Swagger):** [furniture-marketplace-jkp7.onrender.com/swagger](https://furniture-marketplace-jkp7.onrender.com/swagger)
- **Mobile:** not distributed via app stores — see the demo recording above, or run locally via Expo Go.

> The API runs on Render's free tier, which sleeps after ~15 minutes of inactivity. First load after idling can take up to 60 seconds to wake up — the web app shows a banner explaining this when it happens.

## Roadmap & known simplifications

This project deliberately favors a working, deployable core over completeness. Documented here on purpose — these are judgment calls, not oversights:

- **No payments integration.** Pricing is set manually per post; no Stripe/escrow yet. Adding this is straightforward but wasn't the focus of this iteration.
- **No photo uploads yet.** Posts are text/structured-data only for now; image upload via Azure Blob/S3 is a natural next step.
- **Free-text location fields**, not geocoded lat/lng — keeps the MVP simple; a map view would need real geocoding.
- **First-come-first-accepted, no formal driver vetting** — appropriate for a demo; a real deployment would need identity verification and a reputation system.
- **Next Step — Heartwarming Platform UI (Web & Mobile):** Building a heartwarming landing page and platform UI across both web and mobile apps featuring motion-driven cards, interactive search filters, and adoption CTAs.
- **Planned, not yet built:** RAG-based post enrichment (price/category suggestions via `pgvector`), a LangGraph route-matching agent, and an MCP server exposing marketplace data for agentic querying.

## License

MIT — see [LICENSE](./LICENSE).