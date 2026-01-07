# ADR-0003: Frontend architecture, SSR strategy, and typed contracts

## Status

Accepted

## Date

2026-01-06

## Context

For Day 3 of the automation platform development, we needed to establish a production-ready frontend architecture that supports:

1.  **Authentication**: Secure session management.
2.  **Data Fetching**: Efficient and type-safe communication with the NestJS backend.
3.  **Rendering Performance**: Proper use of Next.js App Router (SSR vs CSR).
4.  **Contract Sharing**: End-to-end type safety using Zod.

## Decision

### 1. Cookie-based Authentication

- **Choice**: We use HTTP-only, secure (in production) cookies to store the JWT.
- **Why**: Cookies are safer than localStorage for JWTs (XSS protection) and work seamlessly with Next.js Server Components for SSR.
- **Implementation**: A server-side `auth.ts` library manages cookies, and local API routes (`/api/auth/*`) handle the bridge between client actions and the backend.

### 2. Isomorphic API Client

- **Choice**: A custom `apiClient` wrapper around `fetch`.
- **Why**: Centralizes headers (Authorization, x-correlation-id), handles base URLs, and provides a unified error handling strategy.
- **Traceability**: Every request generates a `x-correlation-id` to trace requests from frontend to backend.

### 3. Progressive Rendering (SSR/CSR Split)

- **Choice**: "Server by default".
- **Workflows List**: Implemented as a Server Component (SSR). This avoids waterfalls, improves SEO, and handles the initial data fetch on the server.
- **Forms (Login, Create Workflow)**: Implemented as Client Components (CSR) to provide rich interactivity, real-time validation (via `react-hook-form` + `zod`), and immediate feedback.

### 4. Shared Contracts

- **Choice**: Direct use of the `@automation-platform/contracts` workspace package.
- **Why**: Ensures the frontend and backend always agree on the API shape. Validation happens on both sides using the exact same Zod schemas.

## Consequences

### Positive

- Fast initial page loads for data-heavy pages (SSR).
- Consistent error handling across the app.
- Full traceability with correlation IDs.
- Reduced boilerplate for data fetching.

### Negative

- Increased complexity in managing server/client boundaries.
- More "moving parts" with proxy API routes for client calls.

## Code References

- Auth Lib: `apps/web/src/lib/auth.ts`
- API Client: `apps/web/src/lib/api-client.ts`
- Dashboard Layout: `apps/web/src/app/(dashboard)/layout.tsx`
- Workflows SSR: `apps/web/src/app/(dashboard)/workflows/page.tsx`
- Create Workflow CSR: `apps/web/src/app/(dashboard)/workflows/new/page.tsx`
