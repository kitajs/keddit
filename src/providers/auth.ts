import { httpErrors } from '@fastify/sensible';
import { ProviderGenerics, RouteSchema } from '@kitajs/runtime';
import { FastifyInstance, FastifyRequest } from 'fastify';
import { UserWithoutPassword } from '../db';

export type Authorized<Force extends boolean = true> = {
  user: Force extends true ? UserWithoutPassword : UserWithoutPassword | undefined;
};

export default async function (
  { jwt, queries }: FastifyInstance,
  { headers }: FastifyRequest,
  [force = true]: ProviderGenerics<[boolean]>
): Promise<Authorized<boolean>> {
  const header =
    headers.authorization ||
    headers.cookie?.slice(headers.cookie.indexOf('token=') + 6).split(';', 1)[0];

  if (!header) {
    if (!force) {
      return { user: undefined };
    }

    throw httpErrors.unauthorized('Missing authorization header');
  }

  let [type, token] = header.split(' ');

  if (type?.startsWith('Bearer ')) {
    token = type.slice(7);
  } else {
    token = type;
  }

  if (!token) {
    throw httpErrors.unauthorized('Invalid authorization type');
  }

  const { userId } = await jwt.verify<{ userId: number }>(token);

  if (!userId || typeof userId !== 'number') {
    throw httpErrors.unauthorized('Invalid token');
  }

  const user = await queries.getUserById(userId);

  if (!user) {
    throw httpErrors.expectationFailed('User not found');
  }

  return {
    user
  };
}

export function transformSchema(schema: RouteSchema): RouteSchema {
  const headers = (schema.headers ??= {});

  headers.type ??= 'object';
  headers.properties ??= {};
  headers.properties['authorization'] ??= {
    type: 'string',
    description: 'Bearer token'
  };

  const security = (schema.security ??= []);
  security.push({ default: [] });

  return schema;
}
