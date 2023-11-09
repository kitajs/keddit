import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

export * from './schema';
export * as schema from './schema';

// Adds the drizzle property to the FastifyInstance type
declare module 'fastify' {
  interface FastifyInstance {
    drizzle: Database;
  }
}

export type Database = PostgresJsDatabase<typeof import('./schema')>;
