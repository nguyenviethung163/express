# DMStudio - Express.js TypeScript (Drizzle + PostgreSQL)

A modern, production-ready Express.js built with TypeScript, Drizzle ORM, and PostgreSQL. Features a robust authentication flow, modular architecture, and comprehensive security integrations.

## 🚀 Features

- **Runtime**: [Node.js](https://nodejs.org/) with [TypeScript](https://www.typescriptlang.org/) and ESM support.
- **Web Framework**: [Express.js v5](https://expressjs.com/) for building scalable APIs.
- **Database**: [PostgreSQL](https://www.postgresql.org/) managed via [Drizzle ORM](https://orm.drizzle.team/).
- **Authentication**:
  - JWT-based (Access & Refresh tokens).
  - Secure HttpOnly cookie management.
  - Password hashing with [Argon2](https://github.com/ranisalt/node-argon2).
- **Validation**: Schema-based validation using [Zod](https://zod.dev/).
- **Logging**: High-performance logging with [Pino](https://github.com/pinojs/pino) and `pino-http`.
- **Documentation**: Automated OpenAPI 2.0 (Swagger) generation.
- **Security**:
  - [Helmet](https://helmetjs.github.io/) for security headers.
  - CORS configuration.
  - Rate limiting for global and sensitive routes (Login/Register).
- **Development**: Fast reloads with `tsx`.

---

## 🛠️ Getting Started

### Prerequisites

- Node.js v20+
- Docker and Docker Compose

### 1. Setup Environment

Clone the repository and copy the example environment file:

```bash
cp .env.example .env
```

Ensure the `DATABASE_URL` matches your Docker configuration:
`postgresql://postgres:postgres@localhost:5433/my_express_app`

### 2. Start PostgreSQL with Docker

```bash
docker-compose up -d
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Push Database Schema

```bash
npx drizzle-kit push
```

### 5. Run the Application

```bash
npm run dev
```

The server will be available at `http://localhost:3000`.

---

## Database Migrations

This project uses [Drizzle ORM](https://orm.drizzle.team/) for database management and migrations.

### Workflow

1.  **Modify Schema**: Edit files in `src/drizzle/schemas/`.
2.  **Generate Migration**: Create a new SQL migration file based on schema changes.
    ```bash
    npm run db:generate
    ```
3.  **Apply Migration**: Sync your local or production database with the migration files.
    ```bash
    npm run db:migrate
    ```

### Other Scripts

- `npm run db:push`: Quickly push schema changes to the database (best for rapid development, bypasses migration files).
- `npm run db:studio`: Open Drizzle Studio to visualize and edit your data.

---

## 📚 API Documentation

API documentation is generated automatically using `swagger-autogen`.

- **Interactive UI**: [http://localhost:3000/api/docs](http://localhost:3000/api/docs)
- **Update Documentation**: If you add new routes, run:
  ```bash
  npx tsx src/swagger.config.ts
  ```

---

## 📂 Project Structure

```text
src/
├── configs/            # App configuration and Env validation
├── db/                 # Database client initialization
├── drizzle/            # Drizzle schemas, migrations, and helpers
├── modules/            # Domain-driven modules (Auth, User, Health)
│   └── auth/           # Controller, Service, Routes, and Validation
├── shared/             # Shared logic across the app
│   ├── middlewares/    # Custom Express middlewares
│   ├── utils/          # Utility functions (JWT, Logger, Shutdown)
│   ├── errors/         # Centralized error handling
│   └── constants/      # App-wide constants
├── server.ts           # App entry point
└── app.ts              # Express app configuration
```

---

## 📜 Available Scripts

- `npm run dev`: Starts the development server with hot-reload.
- `npm run build`: Compiles TypeScript to JavaScript in the `dist` folder.
- `npm run start`: Starts the compiled production server.
- `npm run typecheck`: Runs TypeScript compiler in no-emit mode to check types.
- `npm run format:fix`: Formats the entire codebase using Prettier.

---

## 🛡️ Security Best Practices

- **Rate Limiting**: Global limit is 100 requests per 15 min. Auth routes are limited to 5 attempts per hour.
- **Graceful Shutdown**: The server listens for `SIGTERM`/`SIGINT` to close DB connections and active handles before exiting.
- **Centralized Error Handling**: All errors are processed via a global handler into a standardized JSON format.
