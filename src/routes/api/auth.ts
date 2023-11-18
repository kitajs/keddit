import { HttpErrors } from '@fastify/sensible';
import { Body, Query } from '@kitajs/runtime';
import { FastifyInstance, FastifyReply } from 'fastify';
import { JWT_EXPIRES_SECONDS, createUserJwt, verifyUserPassword } from '../../users/auth';
import { EmailAndPassword } from '../../users/model';

/**
 * @tag Auth
 * @summary Login
 * @operationId login
 */
export async function post(
  { prisma, jwt }: FastifyInstance,
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
      maxAge: JWT_EXPIRES_SECONDS
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
