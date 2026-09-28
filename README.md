# Event Dashboard

## Overview
A full-stack, real-time event dashboard designed for tracking and visualizing application events. The system efficiently ingests event payloads, aggregates analytics over rolling time windows, and provides a clean, responsive UI for filtering and monitoring event streams.

## Features
- **Event Ingestion API**: High-throughput REST endpoint for creating events with arbitrary JSON payloads.
- **Event Listing**: Tabular view of all incoming events.
- **Pagination**: Server-side cursor/offset-based pagination for efficient data retrieval.
- **Filtering**: Query events by event type, date range, or a search string.
- **Analytics**: Real-time aggregation of metrics (e.g., total events, events per minute, top event types) within a rolling 24-hour window.
- **Rate Limiting**: API abuse prevention using a strict 30 requests/minute rate limiter on API routes.
- **Real-time Polling**: The frontend automatically refreshes event and analytics data every 5 seconds.
- **Responsive Dashboard**: Mobile-friendly, human-designed interface without generic AI SaaS tropes.
- **Validation**: Strict runtime schema validation using Zod for incoming requests.
- **Automated Tests**: Integration test coverage using Jest and Supertest.

## Tech Stack
- **Frontend**: Next.js (React), TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Testing**: Jest, Supertest
- **Containerization**: Docker, Docker Compose

## Architecture
Browser → Next.js (Frontend) → Express API (Backend) → Prisma (ORM) → PostgreSQL

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/events` | Ingest a new event record. |
| `GET`  | `/api/events` | Retrieve paginated and filtered events. |
| `GET`  | `/api/events/analytics` | Retrieve aggregated event metrics for the last 24 hours. |

**Query parameters for `GET /api/events`:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `event_type` (string): Filter by a specific event type (e.g., "login", "purchase")
- `start_date` (ISO date): Filter events occurring after this timestamp
- `end_date` (ISO date): Filter events occurring before this timestamp
- `search` (string): Filter events by text in payload or user ID

**Example request for `POST /api/events`:**
```json
{
  "id": "evt_12345",
  "userId": "usr_987",
  "eventType": "login",
  "payload": {
    "ip": "192.168.1.1",
    "device": "macOS"
  },
  "timestamp": "2026-09-28T10:00:00Z"
}
```

## Environment Variables
The root directory contains a `.env.example` file. You must copy this to `.env` to configure your environment. Do not commit actual `.env` files containing sensitive credentials.

Required variables:
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `POSTGRES_DB`
- `POSTGRES_PORT`
- `PORT` (Backend port)
- `NODE_ENV`
- `FRONTEND_URL`
- `NEXT_PUBLIC_API_URL`

## Running Locally

The easiest way to run the entire application stack (PostgreSQL, Backend, Frontend) is via Docker Compose. This automatically handles dependency installation and orchestration for all services.

**1. Configure environment variables**
```bash
cp .env.example .env
```

**2. Start the application**
```bash
docker compose up --build
```
This orchestrates the `postgres`, `backend`, and `frontend` services. 
- The frontend will be available at `http://localhost:3000`
- The backend API will be available at `http://localhost:4000`

**3. Run database migrations (First time setup)**
Once the containers are running, apply the Prisma schema to the database:
```bash
docker compose exec backend npm run prisma:migrate
```

**4. Seed the database (Optional)**
```bash
docker compose exec backend npm run seed
```

## Running Tests
Tests are configured to run against the backend service. Because tests rely on database access and the database runs in a container, run the test suite via Docker:

```bash
# From the backend directory
npm run test:docker
```
*Note: This script executes `docker compose exec backend npm test` under the hood.*

**Test Coverage:**
- **Events API:** Creation validation, required fields, invalid timestamps, pagination metadata, and filters (event type, date range).
- **Analytics API:** Verification of the 24-hour sliding window aggregation.
- **Rate Limiting:** Ensuring the 429 status code returns after exceeding the 30 req/min threshold.

## Project Structure
```text
nepa_works_techinal_assessment/
├── .env.example
├── docker-compose.yml
├── backend/
│   ├── package.json
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   ├── src/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── routes/
│   │   ├── schema/
│   │   ├── services/
│   │   ├── app.ts
│   │   └── server.ts
│   └── tests/
│       ├── analytics.test.ts
│       ├── events.test.ts
│       └── rate-limit.test.ts
└── frontend/
    ├── package.json
    └── src/
        ├── app/
        │   ├── layout.tsx
        │   └── page.tsx
        ├── components/
        └── lib/
            └── api.ts
```

## Implementation Notes
- **API Validation:** All incoming requests are strictly validated at the controller level using Zod schemas.
- **Centralized Error Handling:** Handled via a custom `AppError` class and a global error middleware, ensuring consistent API responses.
- **Database Indexes:** The Prisma schema applies indexes on `eventType`, `timestamp`, and `userId` to ensure performant filtering and aggregation queries.
- **Rate Limiting:** Protects the API routes from abuse with `express-rate-limit`.
- **Polling vs WebSockets:** The frontend uses an optimized 5-second polling interval utilizing `useEffect` and React state management rather than WebSockets, fulfilling real-time requirements with lower overhead.
- **Separation of Concerns:** Strict delineation between frontend presentation logic and backend data services.
