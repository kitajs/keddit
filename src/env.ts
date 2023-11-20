// We could do a fancier validation here, but this is env variables,
// so we just want to fail fast in the application startup.
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined');
}

export const Env = Object.freeze({
  PORT: Number(process.env.PORT || 1228),
  DATABASE_URL: String(process.env.DATABASE_URL),
  LOG_LEVEL: String(process.env.LOG_LEVEL ?? 'trace').toLowerCase(),
  JWT_SECRET: String(process.env.JWT_SECRET),
  JWT_EXPIRES_SECONDS: Number(process.env.JWT_EXPIRES_SECONDS ?? 60 * 60 * 24) // 1 day
});
