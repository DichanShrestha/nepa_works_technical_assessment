# Backend Infrastructure Foundation

Clean, production-ready Express + TypeScript + Prisma 7 + PostgreSQL backend foundation for the hiring assessment.

## Requirements

- Node.js >= 20.x
- npm >= 10.x
- Docker & Docker Compose (optional for local DB or containerized deployment)
- PostgreSQL (if running DB locally outside Docker)

## Environment Variables

Copy `.env.example` to `.env` and adjust values if needed:

| Variable | Default Value | Description |
| --- | --- | --- |
| `PORT` | `4000` | HTTP Server Port |
| `NODE_ENV` | `development` | Runtime environment (`development` / `production`) |
| `FRONTEND_URL` | `http://localhost:3000` | Allowed origin for CORS |
| `POSTGRES_USER` | `postgres` | PostgreSQL Database User |
| `POSTGRES_PASSWORD` | `postgres` | PostgreSQL Database Password |
| `POSTGRES_DB` | `hiring_assessment` | PostgreSQL Database Name |
| `POSTGRES_PORT` | `5432` | Host port for PostgreSQL |
| `DATABASE_URL` | `postgresql://postgres:postgres@localhost:5432/hiring_assessment?schema=public` | Prisma Database Connection String |

## Local Setup & Development

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Generate Prisma Client**
   ```bash
   npm run prisma:generate
   ```

3. **Run Database Migrations**
   ```bash
   npm run prisma:migrate
   ```

4. **Start Development Server** (with live reloading via `tsx`)
   ```bash
   npm run dev
   ```

5. **Build and Start Production Server**
   ```bash
   npm run build
   npm run start
   ```

6. **Linting & Formatting**
   ```bash
   npm run lint
   npm run format
   ```

## Prisma 7 Setup & Migrations

This backend uses **Prisma 7**.

- **Generate Client**: `npm run prisma:generate`
- **Create & Apply Migration (Dev)**: `npm run prisma:migrate`
- **Deploy Migrations (Prod/CI)**: `npm run prisma:deploy`

*Note: The initial Prisma schema includes a minimal `HealthCheck` model. Add assessment models (e.g. `Event`) in `prisma/schema.prisma` before running `npm run prisma:migrate`.*

## Health Check Endpoint

- **URL**: `GET /health` (also accessible at `GET /api/health`)
- **Response**:
  ```json
  {
    "success": true,
    "message": "API is running"
  }
  ```

## Docker Commands

Run backend container standalone:

```bash
docker build -t hiring-assessment-backend .
docker run -p 4000:4000 --env-file .env hiring-assessment-backend
```

To run full stack via Docker Compose from repository root:

```bash
docker compose up --build
```

## Project Structure

```
backend/
├── src/
│   ├── config/          # Centralized configuration (env, prisma)
│   ├── controllers/     # Route controller functions (e.g. health)
│   ├── middlewares/     # Centralized error handler & 404 handler
│   ├── routes/          # Express router hierarchy (/api, /health)
│   ├── services/        # Business logic services placeholder
│   ├── utils/           # Utility classes (AppError)
│   ├── app.ts           # Express application setup
│   └── server.ts        # Server entrypoint & graceful shutdown
├── prisma/
│   └── schema.prisma    # Prisma 7 schema file
├── .env.example         # Template for environment variables
├── .gitignore
├── Dockerfile           # Multi-stage production Docker build
├── package.json
├── tsconfig.json        # Strict TypeScript configuration
├── eslint.config.mjs    # ESLint flat config
├── prettier.config.js   # Prettier config
└── README.md
```
