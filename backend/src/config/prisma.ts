import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { env } from './env';

// Create a Postgres connection pool
const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

// Initialize the Prisma 7 driver adapter for PostgreSQL
const adapter = new PrismaPg(pool);

// Instantiate PrismaClient with the Prisma 7 driver adapter
export const prisma = new PrismaClient({ adapter });
