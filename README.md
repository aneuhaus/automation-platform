# Automation Platform

A system for managing workflow approvals and automation.

## Tech Stack

- **Monorepo**: pnpm workspaces
- **Frontend**: Next.js (App Router), Tailwind CSS, shadcn/ui
- **Backend**: NestJS (Modular Monolith)
- **Contracts**: Shared Zod schemas + TypeScript types
- **Tooling**: ESLint, Prettier, TypeScript Strict Mode
- **CI**: GitHub Actions

## Architecture

The project follows a monorepo structure:

- `apps/web`: Frontend application.
- `apps/api`: Backend API.
- `packages/contracts`: Shared Zod schemas and types.

Requests communicate via HTTP but share the same contract definitions for inputs and outputs.

## Getting Started

### Prerequisites

- Node.js v20+
- pnpm v9+

### Setup

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build
```

### Development

```bash
# Run API & Web
pnpm dev
```

### Quality Checks

```bash
# Lint everything
pnpm lint

# Check types
pnpm typecheck
```

## Decisions

See [docs/adr](docs/adr) for architectural decision records.
