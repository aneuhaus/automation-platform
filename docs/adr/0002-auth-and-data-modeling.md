# ADR-0002: Authentication strategy and data modeling choices

## Status
Accepted

## Date
2026-01-06

## Context

The automation platform requires a secure and scalable foundation for:

1. **User Identity**: Users must be able to register, log in, and access resources securely.
2. **Multi-Tenancy**: Users belong to organizations, and data (workflows, requests) must be isolated per organization.
3. **Workflow Management**: Organizations create workflows that their users can execute via requests.
4. **MVP Velocity**: We need to ship quickly while leaving room for future enhancements (e.g., SSO, RBAC).

### Constraints
- Backend is built with NestJS and PostgreSQL.
- No external identity provider budget at MVP stage.
- Team is familiar with JWT-based auth patterns.

## Decision

### 1. Authentication Approach
- **JWT (JSON Web Tokens)**: Used for stateless authentication. This allows the backend to remain scalable and avoids the need for session storage in the database.
- **Bcrypt**: Used for password hashing with a high cost factor to ensure security against brute-force attacks.
- **Passport.js**: Utilized to provide a standard, extensible middleware layer for NestJS.
- **Why**: This approach provides a balance between security and developer productivity, using industry-standard tools that are well-supported in the NestJS ecosystem.

### 2. Data Modeling Strategy
- **UUIDs**: All primary keys use UUIDs to prevent ID enumeration and facilitate future database merges or distributed generation.
- **Organization-Based Multi-Tenancy**: Most entities (Users, Workflows) are linked to an `Organization`. This simplifies data isolation and ensures that users only access what belongs to their company.
- **Request Status Strategy**: Instead of a simple boolean soft-delete, we use a `status` field (`PENDING`, `APPROVED`, `REJECTED`, `CANCELLED`) for the `Request` model. This provides a better audit trail and state management.
- **Composite Indexes**: We explicitly added indexes like `[workflowId, status]` to optimize common query patterns for request filtering.
- **Why**: This schema establishes clear ownership and performance baselines while remaining flexible enough for future iterations.

### 3. Considerations at Scale
- **RBAC (Role-Based Access Control)**: While currently simple, the system is designed to allow the addition of a `roles` table or field to the `User` model to handle granular permissions.
- **Database Partitioning**: As the `Request` table grows, we may need to partition it by `organizationId` or `createdAt`.
- **Cache Layer**: Frequently accessed data like `Workflow` definitions should be moved to a Redis cache to reduce database load.
- **External Identity Providers**: The use of Passport.js allows us to easily migrate to or integrate with providers like Auth0 or Keycloak if enterprise requirements arise.

## Alternatives Considered

| Option | Why Rejected |
|--------|--------------|
| **Session-based auth** | Requires server-side session storage, adding complexity and reducing horizontal scalability. |
| **OAuth/OIDC from day one** | Adds external dependency and cost; overkill for MVP with internal users only. |
| **Integer IDs** | Vulnerable to enumeration attacks and problematic in distributed/multi-region setups. |
| **Single-table per organization** | Harder to manage migrations and cross-org analytics; row-level tenancy is simpler. |
| **Soft-delete with `deletedAt`** | For `Request`, a status-based approach is more semantically meaningful (approved/rejected is not "deleted"). |

## Consequences

### Positive
- Fast time-to-market with familiar tooling.
- Clear data ownership model via `organizationId`.
- Extensible architecture for future RBAC and SSO.

### Negative
- **JWT Revocation**: Tokens cannot be easily revoked without a blacklist or very short TTLs. Mitigation: Use short-lived tokens (e.g., 15 min) with refresh token rotation in future.
- **Tenant Enforcement Burden**: Developers must consistently filter by `organizationId`. Mitigation: The `@CurrentUser` decorator and service-level checks reduce this risk.
- **Secret Rotation**: Changing `JWT_SECRET` invalidates all tokens. Mitigation: Plan for key rotation with dual-key support in future.

## Code References

| Component | File |
|-----------|------|
| Data Models | [schema.prisma](../apps/api/prisma/schema.prisma) |
| Auth Module | [auth.module.ts](../apps/api/src/modules/auth/auth.module.ts) |
| Auth Service | [auth.service.ts](../apps/api/src/modules/auth/auth.service.ts) |
| JWT Strategy | [jwt.strategy.ts](../apps/api/src/modules/auth/jwt.strategy.ts) |
| User Service | [user.service.ts](../apps/api/src/modules/user/user.service.ts) |
| Current User Decorator | [current-user.decorator.ts](../apps/api/src/common/decorators/current-user.decorator.ts) |
| Auth Guard | [jwt-auth.guard.ts](../apps/api/src/common/guards/jwt-auth.guard.ts) |
