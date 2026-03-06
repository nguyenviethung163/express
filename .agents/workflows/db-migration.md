---
description: Standardized workflow for database migrations
---

# Database Migration Workflow

Use this workflow whenever you change the database schema in `src/drizzle/schemas/`.

1. **Edit Schema**: Modify or create files in `src/drizzle/schemas/`.
2. **Export Schema**: Ensure new schemas are exported in `src/drizzle/index.ts`.
3. **Generate Migration**:
   // turbo
   `npm run db:generate`
4. **Review Migration**: Check the generated SQL file in `src/drizzle/migrations/`.
5. **Apply Migration**:
   // turbo
   `npm run db:migrate`
6. **Verify with Studio** (Optional):
   `npm run db:studio`
