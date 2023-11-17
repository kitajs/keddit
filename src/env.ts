export const Env = {
  PORT: Number(process.env.PORT || 1228),
  DATABASE_URL: String(process.env.DATABASE_URL ?? ''),
  LOG_LEVEL: String(process.env.LOG_LEVEL ?? 'info').toLowerCase(),
  JWT_SECRET: String(process.env.JWT_SECRET ?? '')
};

// We could do a fancier validation here, but this is env variables,
// so we just want to fail fast in the application startup.
if (!Env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}

if (!Env.JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined');
}
