# Unified Social Media Ads SaaS Platform

A full-stack SaaS platform to create once and publish campaigns across multiple ad platforms from one dashboard.

## What This Project Does

This project provides:

- User authentication and session handling
- Campaign creation, editing, duplication, and deletion
- Platform connection management
- Media upload and management
- Async campaign publishing through Cloudflare Queues
- Campaign status tracking with per-platform progress
- AI-assisted ad copy generation and analysis (mock service)

Supported platform types in backend:

- meta
- google_ads
- tiktok
- linkedin

Frontend Platforms page currently shows cards for:

- Instagram (mapped to meta)
- Facebook (mapped to meta)
- Google Ads
- LinkedIn

## Tech Stack

### Frontend

- Next.js 14 (App Router)
- React 18
- Tailwind CSS
- SWR
- Axios
- React Hot Toast

### Backend

- Cloudflare Workers
- Hono
- D1 (SQLite)
- Cloudflare KV
- Cloudflare R2
- Cloudflare Queues
- Durable Objects

## Repository Structure

- frontend: Next.js UI
- backend: Worker API, repositories, services, queue worker
- shared: shared constants and validators
- DEPLOYMENT.md: deployment-focused instructions

## Core Architecture

### Backend Layers

- Adapters: platform-specific behavior (Meta, Google, TikTok, LinkedIn)
- Repositories: D1 data access (users, campaigns, platforms, jobs, media)
- Services: business logic (auth, campaigns, publish, media, platforms)
- Queue worker: async job execution and retries

### Async Publish Flow

1. User publishes a campaign
2. Backend creates publishing_jobs rows
3. Messages are sent to publish-queue
4. Worker queue handler processes each message
5. Adapter creates ads on target platform
6. publishing_jobs and campaign_platforms statuses are updated
7. Frontend polls status endpoint and renders progress

## Local Development Setup

## 1. Prerequisites

- Node.js 18+
- npm
- Wrangler CLI (via local dependency or npx)
- Cloudflare account with D1/KV/R2/Queues configured

## 2. Install Dependencies

From project root:

```bash
cd backend
npm install

cd ../frontend
npm install
```

## 3. Backend Configuration

Backend config is in backend/wrangler.toml.

Required bindings used by the code:

- DB (D1)
- CACHE (KV)
- MEDIA_BUCKET (R2)
- PUBLISH_QUEUE (Queue producer)
- publish-queue consumer

Queue bindings expected:

```toml
[[queues.consumers]]
queue = "publish-queue"

[[queues.producers]]
binding = "PUBLISH_QUEUE"
queue = "publish-queue"
```

## 4. Apply Database Schema

```bash
cd backend
npm run db:local
```

For remote database migrations:

```bash
npm run db:migrate
```

## 5. Run Backend

```bash
cd backend
npm run dev
```

Default local URL is typically:

- http://localhost:8787

## 6. Run Frontend

Set frontend env variable in frontend/.env.local:

```env
NEXT_PUBLIC_API_URL=http://localhost:8787
```

Start frontend:

```bash
cd frontend
npm run dev
```

Default local URL:

- http://localhost:3000

## Scripts

### Backend scripts

- npm run dev
- npm run deploy
- npm run deploy:staging
- npm run deploy:production
- npm run db:migrate
- npm run db:local
- npm run test

### Frontend scripts

- npm run dev
- npm run build
- npm run start
- npm run lint
- npm run export

## API Reference

All protected endpoints require:

- Authorization: Bearer <token>

Response envelope:

- success: boolean
- data (on success)
- error (on failure)
- timestamp

### Health

- GET /health

### Auth

- POST /api/auth/signup
- POST /api/auth/login

### Campaigns

- GET /api/campaigns
- POST /api/campaigns
- GET /api/campaigns/:id
- PUT /api/campaigns/:id
- DELETE /api/campaigns/:id
- POST /api/campaigns/:id/duplicate

### Media

- POST /api/media/upload
- GET /api/media
- DELETE /api/media/:id

### Platforms

- POST /api/platforms/connect
- GET /api/platforms
- DELETE /api/platforms/:platformType

### Publish and Status

- POST /api/publish
- GET /api/status/:campaignId

### AI

- POST /api/ai/generate-copy
- POST /api/ai/analyze-copy

## Platform Connection Behavior

- Campaign creation validates selected platforms are connected and active.
- Platform disconnect is implemented as soft disconnect:
  - isActive false
  - tokens cleared
  - metadata updated with disconnectedAt
- Soft disconnect avoids foreign key breakage for historical campaign_platforms rows.

## Queue Processing Notes

- Messages are produced through env.PUBLISH_QUEUE.
- Worker entry exports queue(batch, env, ctx) for consumer handling.
- If queue send fails, campaign_platform status is marked failed (no silent pending).
- Job retries use exponential backoff fields on publishing_jobs.

## Database Overview

Primary tables:

- users
- platforms
- media
- campaigns
- campaign_platforms
- publishing_jobs
- campaign_templates
- analytics

Important relationships:

- campaigns.user_id -> users.id
- campaign_platforms.campaign_id -> campaigns.id
- campaign_platforms.platform_id -> platforms.id
- publishing_jobs.campaign_platform_id -> campaign_platforms.id

## Frontend Pages

- /auth/login
- /auth/signup
- /dashboard
- /dashboard/campaign/create
- /dashboard/campaign/[id]
- /dashboard/platforms

## Known Mocked Components

The current implementation contains mocked adapter/auth behavior for platform integrations and AI behavior. Replace adapter authenticate/create/status logic with real provider OAuth and API calls for production use.

## Common Issues and Fixes

### Platform status stuck at PENDING

Check:

- Queue producer binding exists in wrangler.toml
- Queue consumer exists in wrangler.toml
- Worker export includes queue handler
- Wrangler dev server restarted after config changes

### D1 Type object not supported

Cause:

- Passing Date objects directly to D1 bind

Fix:

- Normalize Date values to ISO strings before repository execute/update

### Foreign key constraint on platform disconnect

Cause:

- Hard deleting a platform referenced by campaign_platforms

Fix:

- Use soft disconnect (isActive false, clear tokens) instead of delete

### Frontend changes not visible

- Restart frontend dev server
- Hard refresh browser (Ctrl+F5)
- Confirm route path (for platform cards use /dashboard/platforms)

## Security Notes

For real deployment:

- Never commit real secrets to repository
- Store JWT_SECRET and OPENAI_API_KEY via Wrangler secrets
- Add proper password hashing (bcrypt/argon2) for production-grade auth
- Implement OAuth PKCE flows for each ad platform
- Add request validation and rate limits for public endpoints

## Deployment

Use DEPLOYMENT.md for full environment and rollout instructions.

## Suggested Next Enhancements

1. Replace mocked platform adapters with real OAuth and API integrations
2. Add webhook-based status updates (reduce polling)
3. Add role-based access control and team workspaces
4. Add automated integration tests for publish pipeline
5. Add observability dashboards for queue lag and failure rates
