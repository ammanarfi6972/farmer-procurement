# Technology Stack

## Recommended stack

### Frontend / application

- Next.js with App Router
- React
- TypeScript
- Tailwind CSS
- shadcn/ui or equivalent accessible component primitives
- Lucide icons

### Backend / data

- Supabase
- PostgreSQL
- Supabase Auth
- Supabase Realtime
- Supabase Storage where needed

### Validation / forms

- Zod
- React Hook Form where forms are complex

### Data fetching

Prefer server-side data loading and server mutations in the Next.js architecture.

Use TanStack Query only where it materially improves a client-heavy workflow.

### Maps

- Google Maps JavaScript API
- Places
- Routes

### Charts

- Recharts or another lightweight React chart library

### Testing

- Vitest
- React Testing Library
- Playwright

### Hosting

- Vercel for the web application
- Supabase for managed database/auth/realtime/storage

## Architecture style

Prefer a modular monolith for the SIH prototype.

Do not create microservices unless a concrete requirement appears.

## Suggested layers

```text
app/
  routes/pages
components/
lib/
  domain/
  db/
  auth/
  queue/
  scheduling/
  notifications/
  maps/
  pricing/
  analytics/
  i18n/
supabase/
  migrations/
  seed/
tests/
```

## State management

Do not add a global state library by default.

Use:

- URL state for filters/search where useful;
- server state through Next.js data flows;
- local component state for UI;
- a small client store only for genuinely cross-component interactive state.

## Realtime

Use Supabase Realtime for queue/status updates where justified.

## PWA

Implement:

- manifest;
- service worker;
- installable shell;
- basic cache strategy;
- offline fallback.

Follow current Next.js PWA guidance during implementation rather than relying on an abandoned plugin.

## Engineering principle

Choose boring, well-supported technologies over novelty.
