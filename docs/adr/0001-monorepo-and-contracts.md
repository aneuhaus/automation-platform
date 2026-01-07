# ADR-0001: Monorepo structure and contracts strategy

## Status

Accepted

## Date

2026-01-06

## Context

The automation platform requires tight integration between the frontend (web) and backend (api). We need:

1. **Type Safety**: A mechanism to ensure type consistency across both applications.
2. **Validation Consistency**: Shared validation logic to prevent "types out of sync" bugs.
3. **Scalable Structure**: A repository layout that supports multiple applications and shared libraries.
4. **MVP Velocity**: Minimal operational overhead during early development.

### Constraints

- Small team; cannot afford complex CI/CD pipelines for microservices.
- Frontend and backend are developed in parallel by overlapping contributors.
- Team is familiar with pnpm and NestJS.

## Decision

### 1. Monorepo with pnpm Workspaces

- **Structure**: `apps/` for deployable applications (`api`, `web`), `packages/` for shared libraries (`contracts`).
- **Why**: Allows code sharing, unified dependency management, and atomic commits across frontend and backend.
- **Tools**: pnpm workspaces for dependency linking. Low overhead compared to Nx/Turbo, but scalable if needed later.

### 2. Contracts Package (`packages/contracts`)

- **Zod Schemas**: All domain entities (Workflow, Request, etc.) are defined as Zod schemas in a shared package.
- **Inferred Types**: TypeScript types are exported from Zod schemas, ensuring a single source of truth.
- **Why**:
  - Frontend uses schemas for form validation and API typing.
  - Backend uses schemas for DTO validation and database typing.
  - Eliminates type drift between client and server.

### 3. Modular Monolith (Backend)

- **Pattern**: `apps/api` is structured as a modular monolith using NestJS modules (Auth, User, Workflow, Request).
- **Why**: Reduces operational complexity (deployment, networking) while allowing logical separation. Can extract to microservices later if scale demands it.

## Alternatives Considered

| Option                            | Why Rejected                                                                           |
| --------------------------------- | -------------------------------------------------------------------------------------- |
| **Polyrepo**                      | Increases coordination overhead; makes atomic cross-app changes difficult.             |
| **Nx/Turbo from day one**         | Adds tooling complexity; pnpm workspaces are sufficient for current scale.             |
| **Microservices from day one**    | Operational overhead (service discovery, networking, deployment) is too high for MVP.  |
| **OpenAPI/Swagger for contracts** | Requires code generation step; Zod provides runtime validation + types in one package. |
| **GraphQL**                       | Team more experienced with REST; GraphQL adds schema management overhead.              |

## Consequences

### Positive

- High development velocity with shared type safety.
- Consistent validation logic across frontend and backend.
- Atomic commits enable coordinated changes without version drift.
- Easy to refactor into microservices later by extracting modules.

### Negative

- Monorepos can become large; strict tooling (lint/typecheck at root) is required to prevent degradation.
- All apps share a single CI pipeline; slow tests in one app can block others.
- Developers must understand workspace linking to avoid dependency issues.

## Code References

| Component         | File                                                                        |
| ----------------- | --------------------------------------------------------------------------- |
| Workspace Config  | [pnpm-workspace.yaml](../pnpm-workspace.yaml)                               |
| Root Package      | [package.json](../package.json)                                             |
| Contracts Package | [packages/contracts/src/index.ts](../packages/contracts/src/index.ts)       |
| Workflow Schema   | [packages/contracts/src/workflow.ts](../packages/contracts/src/workflow.ts) |
| Request Schema    | [packages/contracts/src/request.ts](../packages/contracts/src/request.ts)   |
| API App Module    | [apps/api/src/app.module.ts](../apps/api/src/app.module.ts)                 |
