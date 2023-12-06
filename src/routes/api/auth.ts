import { HttpErrors } from '@fastify/sensible';
import { Body, Query } from '@kitajs/runtime';
import { PrismaClient } from 'prisma-client';
import { FastifyInstance, FastifyReply } from 'fastify';
import { Env } from '../../env';
import { createUserJwt, verifyUserPassword } from '../../features/user/auth';
import { EmailAndPassword } from '../../features/user/model';

/**
 * @tag Auth
 * @summary Login
 * @operationId login
 */
export async function post(
  { jwt }: FastifyInstance,
  prisma: PrismaClient,
  reply: FastifyReply,
  body: Body<EmailAndPassword>,
  errors: HttpErrors,
  cookie: Query<boolean> = true
) {
  const user = await prisma.user.findUnique({
    where: { email: body.email }
  });

  if (
    !user ||
    // Invalid password
    !(await verifyUserPassword(user.password, body.password))
  ) {
    if (cookie) {
      reply.clearCookie('token');
    }

    throw errors.unauthorized('Invalid email or password');
  }

  const token = createUserJwt(jwt, user);

  if (cookie) {
    reply.setCookie('token', token, {
      httpOnly: true,
      path: '/',
      sameSite: 'strict',
      maxAge: Env.JWT_EXPIRES_SECONDS
    });
  }

  // FIXME: Prisma does not have an easy way to hide fields for now...
  // https://github.com/prisma/prisma/issues/5042
  user.password = '';

  return {
    token: !cookie && token,
    user
  };
}
