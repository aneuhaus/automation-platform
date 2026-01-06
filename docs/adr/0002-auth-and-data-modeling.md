# ADR-0002: Authentication strategy and data modeling choices

## Status
Accepted

## Context
We need to establish a secure and scalable foundation for the API, specifically regarding user authentication and core data modeling.

## Decision
1.  **Authentication**: We will use **JWT (JSON Web Tokens)** for stateless authentication.
    *   **Strategy**: Email + Password (hashed with bcrypt).
    *   **Implementation**: `@nestjs/passport` with `passport-jwt` and `passport-local` (though manual validation is chosen for simplicity initially).
    *   **Justification**: JWTs are standard, scalable, and work well for APIs that might serve multiple frontends (web, mobile, CLI).

2.  **Data Modeling**: We are using **Prisma** with **PostgreSQL**.
    *   **Naming Conventions**: CamelCase for model fields (JS standard), snake_case for DB map (DB standard).
    *   **IDs**: UUIDs (`@default(uuid())`) for all primary keys to ensure uniqueness across distributed systems and avoid enumeration attacks.
    *   **Timestamps**: `createdAt` and `updatedAt` on all entities.
    *   **Organization-Centric**: Users belong to an Organization. Resources (Workflows) belong to an Organization.

## Consequences
*   Stateless auth requires careful handling of token expiration and revocation (future work).
*   UUIDs are slightly larger than integers but offer better security and flexibility.
