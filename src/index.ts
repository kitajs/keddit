globalThis.KITA_PROJECT_ROOT = __dirname;

import fastifyEtag from '@fastify/etag';
import fastifyFormbody from '@fastify/formbody';
import fastifyJwt from '@fastify/jwt';
import '@kitajs/html/htmx';
import { Kita } from '@kitajs/runtime';
import addFormats from 'ajv-formats';
import closeWithGrace from 'close-with-grace';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import fastify from 'fastify';
import path from 'path';
import postgres from 'postgres';
import { schema } from './db';
import { Env } from './env';

const app = fastify({
  logger: {
    level: Env.LOG_LEVEL
  },
  ajv: {
    plugins: [addFormats]
  }
});

const pg = postgres(Env.DATABASE_URL, {
  max: 1,
  onnotice(query) {
    app.log.trace(query.message);
  }
});

app.decorate(
  'drizzle',
  drizzle(pg, {
    schema,
    logger: {
      logQuery(query) {
        app.log.trace(query);
      }
    }
  })
);

app.register(fastifyEtag)

app.register(fastifyFormbody);

app.register(fastifyJwt, {
  secret: Env.JWT_SECRET
});

// Register your application as a normal plugin.
app.register(Kita, {
  fastifySwagger: {
    openapi: {
      openapi: '3.1.0',
      components: {
        securitySchemes: {
          default: {
            type: 'apiKey',
            name: 'Authorization',
            in: 'header'
          }
        }
      }
    }
  }
});

// delay is the number of milliseconds for the graceful close to finish
const closeListeners = closeWithGrace({ delay: 500 }, async function ({ err }) {
  if (err) {
    app.log.error(err);
  }

  await app.close();
});

// Cancelling the close listeners
app.addHook('onClose', async () => {
  await pg.end();
  closeListeners.uninstall();
});

// Start listening.
app.listen({ port: Env.PORT }, async (err) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }

  await migrate(app.drizzle, { migrationsFolder: path.resolve(__dirname, '../drizzle') });
  app.log.info('Migration complete!');
});
