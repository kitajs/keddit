import { HttpErrors } from '@fastify/sensible';
import { Body } from '@kitajs/runtime';
import { PrismaClient } from 'prisma-client';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { CreateUser } from '../../../features/user/model';
import { createUser } from '../../../features/user/service';

/**
 * @tag Users
 * @summary Create a user
 * @operationId createUser
 */
export async function post(
  prisma: PrismaClient,
  { log }: FastifyRequest,
  errors: HttpErrors,
  reply: FastifyReply,
  body: Body<CreateUser>
) {
  const [error, user] = await createUser(prisma, body);

  if (user) {
    // FIXME: Prisma does not have an easy way to hide fields for now...
    // https://github.com/prisma/prisma/issues/5042
    user.password = '';

    reply.status(201);

    return user;
  }

  if (error.code === 'P2002') {
    throw errors.conflict('Email already registered!');
  }

  log.error(error);
  throw errors.internalServerError('Something went wrong!');
}
