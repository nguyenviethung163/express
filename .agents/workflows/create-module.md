---
description: How to create a new module in the project
---

# Creating a New Module

Follow these steps to generate a new feature module following the project's modular architecture.

1. **Create Directory**: Create a new folder in `src/modules/[name]`.
2. **Define Schema** (Optional): If the module needs new tables, add them to `src/drizzle/schemas/[name].schema.ts` and export them in `src/drizzle/index.ts`.
3. **Generate Migration**:
   // turbo
   `npm run db:generate`
4. **Scaffolding Files**:
   - Create `[name].validation.ts` with Zod schemas.
   - Create `[name].service.ts` with business logic and **JSDoc comments**.
   - Create `[name].controller.ts` with HTTP handlers and **JSDoc comments**.
   - Create `[name].routes.ts` defining endpoints (consider `cacheMiddleware` for GET).
5. **Register Routes**: Import and mount the new router in `src/routes/index.ts`.
6. **Add Tests**: Create `[name].service.test.ts` and verify with:
   // turbo
   `npm run test`
7. **Document & Audit**: Run the "Project Auditor" skill to verify compliance.
