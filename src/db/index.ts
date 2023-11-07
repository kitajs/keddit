import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

export * as schema from './schema';
export * from './schema';
export * from './queries';

// Adds the drizzle property to the FastifyInstance type
declare module 'fastify' {
  interface FastifyInstance {
    drizzle: Database;
    queries: import('./queries').Queries;
  }
}

export type Database = PostgresJsDatabase<typeof import('./schema')>;
