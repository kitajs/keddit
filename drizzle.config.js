require('dotenv/config');

/** @type {import("drizzle-kit").Config} */
module.exports = {
  schema: './src/db/schema.ts',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL
  }
};
