---
name: Project Auditor
description: Audits the codebase for compliance with project-specific coding standards.
---

# Project Auditor Skill

This skill provides instructions and patterns for auditing this Express/Drizzle project to ensure it adheres to the modular architecture and coding standards defined in `.cursorrules`.

## Audit Checklist

### 1. Module Structure

Ensure every feature in `src/modules` contains:

- `*.controller.ts`
- `*.service.ts`
- `*.routes.ts`
- `*.validation.ts`

### 2. Controller Standards

- [ ] Uses `AsyncHandler` wrapper.
- [ ] Returns `ApiResponse` methods (e.g., `ApiResponse.ok`).
- [ ] Does NOT contain business logic or direct DB calls (delegates to Service).
- [ ] Strictly types request body using `as [ValidationType]`.

### 3. Service Standards

- [ ] Methods are `static` or the service is a singleton.
- [ ] Contains all DB logic using `drizzle-orm` fluent UI.
- [ ] Throws `ApiError` for expected error cases (Conflict, NotFound, etc.).

### 4. Database Standards

- [ ] Schemas are in `src/drizzle/schemas/`.
- [ ] No hardcoded SQL (use Drizzle query builder).
- [ ] All schema changes have matching migration files in `src/drizzle/migrations/`.

### 5. Documentation Standards

- [ ] Core Service methods have JSDoc descriptions.
- [ ] JSDoc includes `@param` and `@returns` when applicable.
- [ ] Exported utility functions are documented.

### 6. Caching Standards

- [ ] Frequent GET routes use `cacheMiddleware`.
- [ ] Cache keys are prefixed or user-aware where necessary.
- [ ] `RedisService` is used for manual cache invalidation.

### 7. Storage Standards

- [ ] No direct imports of `CloudinaryProvider` or `LocalStorageProvider` in modules.
- [ ] Uses `StorageService.upload()` and `StorageService.delete()`.

## Audit Commands

Run these to verify the project state:

- `npm run typecheck`: Verify TS integrity.
- `npm run test`: Run all unit tests.
- `npm run format:check`: Check code formatting.
- `npm run lint`: Run linting for potential issues.
