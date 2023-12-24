import { HttpErrors } from '@fastify/sensible';
import { Body } from '@kitajs/runtime';
import { FastifyInstance, FastifyReply } from 'fastify';
import { PrismaClient } from 'prisma-client';
import { Env } from '../../env';
import { createUserJwt, verifyUserPassword } from '../../features/user/auth';
import { EmailAndPassword } from '../../features/user/model';

/**
 * Authenticates a user and returns a JWT token via http only cookie
 *
 * @tag Auth
 * @summary Login
 * @operationId login
 */
export async function post(
  { jwt }: FastifyInstance,
  prisma: PrismaClient,
  reply: FastifyReply,
  body: Body<EmailAndPassword>,
  errors: HttpErrors
) {
  const user = await prisma.user.findUnique({
    where: { email: body.email }
  });

  if (
    // user not found
    !user ||
    // Invalid password
    !(await verifyUserPassword(user.password, body.password))
  ) {
    reply.clearCookie('token');
    throw errors.unauthorized('Invalid email or password');
  }

  // Creates the JWT token from our provider
  const token = createUserJwt(jwt, user);

  // Defines our HTTP only cookie
  reply.setCookie('token', token, {
    httpOnly: true,
    path: '/',
    sameSite: 'strict',
    maxAge: Env.JWT_EXPIRES_SECONDS
  });

  // Prisma does not have an easy way to hide fields for now...
  // https://github.com/prisma/prisma/issues/5042
  user.password = '';

  return { user };
}
