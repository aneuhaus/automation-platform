# 1. Monorepo Structure and Contracts Strategy

Date: 2026-01-06

## Status

Accepted

## Context

We are building an automation platform that requires tight integration between the frontend (web) and backend (api). We need a mechanism to ensure type safety and validation consistency across both applications. We also need a scalable repository structure that supports multiple applications and shared libraries.

## Decision

We have decided to use a **Monorepo** structure managed by **pnpm workspaces**.

We have also decided to use the **Contracts Pattern** with **Zod** as our shared source of truth for API definitions.

### Monorepo
- **Why**: Allows code sharing, unified versioning (or at least unified dependency management), and atomic commits across frontend and backend.
- **Tools**: pnpm workspaces for dependency linking. Low overhead compared to Nx/Turbo (for now), but scalable.

### Contracts Package (`packages/contracts`)
- **Why**:
    - Defines Zod schemas for all domain entities (Workflow, Request).
    - Exports inferred TypeScript types.
    - Used by Frontend for form validation and API typing.
    - Used by Backend for DTO validation and database typing.
    - Eliminates "types out of sync" bugs.

### Modular Monolith (Backend)
- **Why**: We are starting with `apps/api` as a modular monolith (NestJS modules) instead of microservices.
- **Reasoning**: Reduces operational complexity (deployment, networking) while allowing logical separation (Auth, Workflow, Request modules). Can extract to microservices later if scale demands it.

## Consequences

- **Positive**: High development velocity, shared type safety, consistent validation.
- **Negative**: Monorepos can become large; strict tooling is required (lint/typecheck at root) to prevent degradation.
