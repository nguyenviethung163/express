---
trigger: always_on
glob: "**/*.{ts,js}"
description: Comprehensive coding standards and architectural patterns for the project.
---

# DMStudio Project Code Style Guide (Antigravity AI)

## 🏗️ Architecture & Structure

This project follows a **Modular Architecture**. Each feature or domain should be self-contained within `src/modules/[module-name]`.

### Module Components:

- **`[module].controller.ts`**: Handles entry points, parses request data, and returns responses.
- **`[module].service.ts`**: Contains the core business logic and direct database interactions.
- **`[module].routes.ts`**: Defines the endpoint paths and binds them to controller methods.
- **`[module].validation.ts`**: Contains Zod schemas for request validation.
- **`[module].constants.ts`**: (Optional) Module-specific constants.

## 📁 Naming Conventions

- **Files & Directories**: Use `kebab-case` (e.g., `user.controller.ts`, `error-handler.ts`).
- **Variables & Functions**: Use `camelCase`.
- **Classes & Types/Enums**: Use `PascalCase`.
- **Constants**: Use `UPPER_SNAKE_CASE`.

## 💻 Coding Standards

### 1. Asynchronous Handling

- Always wrap Express route handlers with the `AsyncHandler` utility to ensure errors are caught and passed to the global error handler.
- Use `async/await` instead of raw Promises or callbacks.

### 2. Standardized Responses

- Never send raw JSON via `res.json()`.
- Use the `ApiResponse` utility for consistent output:
  - `ApiResponse.ok(res, message, data)`
  - `ApiResponse.created(res, message, data)`

### 3. Error Handling

- Throw the custom `ApiError` class for expected failures (e.g., `ApiError.notFound()`, `ApiError.unauthorized()`).
- Avoid frequent `try/catch` blocks in controllers; allow the global `errorHandler` middleware to process thrown errors.

### 4. Database Access

- Use [Drizzle ORM](https://orm.drizzle.team/) for all database operations.
- Direct database calls belong ONLY in the **Service layer**.
- Follow the **Migration Workflow**:
  1. Update schema in `src/drizzle/schemas/`.
  2. Run `npm run db:generate`.
  3. Apply with `npm run db:migrate`.

## 🧪 Testing Standards

- **Framework**: [Vitest](https://vitest.dev/).
- **Location**: Place `*.test.ts` files alongside the corresponding source file.
- **Mocks**: Use `vi.mock` for external dependencies and the database.
- **Drizzle Mocks**: When mocking `db`, ensure the fluent UI ( `.select().from()...`) and `.then()` behavior are correctly simulated.

## 🛡️ Security & Performance

- **Validation**: Every request body/query must be validated using Zod schemas.
- **Logging**: Use the centralized `pino-logger`. Do not use `console.log` in production code.
- **Environment**: Access variables only through the validated `src/configs/env.ts` object.

## 🚀 Deployment & Infrastructure

- **Docker**: Always maintain the multi-stage `Dockerfile`.
- **CI/CD**: Ensure new code passes the `typecheck`, `format:check`, and `test` jobs in GitHub Actions.
