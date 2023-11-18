import { httpErrors } from '@fastify/sensible';
import { ProviderGenerics, RouteSchema } from '@kitajs/runtime';
import { User } from '@prisma/client';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { verifyUserJwt } from '../users/auth';

export type Authorized<Force extends boolean | 'html' = true> = {
  user: Force extends true | 'html' ? User : User | undefined;
};

export default async function (
  { jwt, prisma }: FastifyInstance,
  { headers, cookies, url }: FastifyRequest,
  [force = true]: ProviderGenerics<[boolean | 'html']>,
  reply: FastifyReply
): Promise<Authorized<boolean>> {
  let token = headers.authorization || cookies.token;

  if (!token) {
    if (!force) {
      return { user: undefined };
    }

    if (force === 'html') {
      return reply
        .redirect('/login?next=' + encodeURIComponent(url))
        .send('Redirecting...');
    } else {
      throw httpErrors.unauthorized('Missing authorization header');
    }
  }

  if (token.startsWith('Bearer ')) {
    token = token.slice(7);
  }

  if (!token) {
    if (force === 'html') {
      return reply
        .redirect('/login?next=' + encodeURIComponent(url))
        .send('Redirecting...');
    } else {
      throw httpErrors.unauthorized('Missing authorization header');
    }
  }

  const { userId } = await verifyUserJwt(jwt, token);

  if (!userId || typeof userId !== 'number') {
    if (force === 'html') {
      return reply
        .redirect('/login?next=' + encodeURIComponent(url))
        .send('Redirecting...');
    } else {
      throw httpErrors.unauthorized('Invalid token');
    }
  }

  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!user) {
    if (force === 'html') {
      return reply
        .redirect('/login?next=' + encodeURIComponent(url))
        .send('Redirecting...');
    } else {
      throw httpErrors.expectationFailed('User not found');
    }
  }

  // FIXME: Prisma does not have an easy way to hide fields for now...
  // https://github.com/prisma/prisma/issues/5042
  user.password = '';

  return { user };
}

export function transformSchema(schema: RouteSchema): RouteSchema {
  const security = (schema.security ??= []);
  const responses = (schema.responses ??= {});

  // Adds Bearer and Cookie security to every route
  security.push({ bearer: [] }, { cookie: [] });

  // Adds 401 response to every route
  responses[401] ??= {
    description: 'Unauthorized'
  };

  return schema;
}
