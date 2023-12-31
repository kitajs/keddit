globalThis.KITA_PROJECT_ROOT = __dirname;

import '@kitajs/html/htmx';

import fastifyCookie from '@fastify/cookie';
import fastifyEtag from '@fastify/etag';
import fastifyFormbody from '@fastify/formbody';
import fastifyJwt from '@fastify/jwt';
import fastifyStatic from '@fastify/static';
import { Kita } from '@kitajs/runtime';
import addFormats from 'ajv-formats';
import closeWithGrace from 'close-with-grace';
import fastify from 'fastify';
import path from 'path';
import { Env } from './env';

export const app = fastify({
  logger: {
    level: Env.LOG_LEVEL
  },
  ajv: {
    customOptions: {
      formats: [addFormats]
    }
  }
});

app.register(fastifyCookie);

app.register(fastifyEtag);

app.register(fastifyFormbody);

app.register(fastifyStatic, {
  root: path.resolve('public')
});

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
          // https://swagger.io/docs/specification/authentication/bearer-authentication/
          bearer: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT'
          },

          // https://swagger.io/docs/specification/authentication/cookie-authentication/
          cookie: {
            type: 'apiKey',
            in: 'cookie',
            name: 'token'
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
  closeListeners.uninstall();
});

// Start listening.
app.listen({ port: Env.PORT, host: Env.HOST }, async (err) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
});
