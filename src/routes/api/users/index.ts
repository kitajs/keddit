import { HttpErrors } from '@fastify/sensible';
import { Body } from '@kitajs/runtime';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { PrismaClient } from 'prisma-client';
import { CreateUser } from '../../../features/user/model';
import { createUser } from '../../../features/user/service';

// JSdocs comments in the post function adds documentation to the final open api spec.
/**
 * Creates a user and returns it
 *
 * @tag Users
 * @summary Create a user
 * @operationId createUser
 */
export async function post(
  // our prisma provider
  prisma: PrismaClient,
  // the logger instance for this request
  { log }: FastifyRequest,
  // an integration with @fastify/sensible
  errors: HttpErrors,
  // used to set the status code of the response
  reply: FastifyReply,
  // a Kita type responsible for extracting, validating and documenting the
  // request body
  body: Body<CreateUser>
) {
  // Calls our service
  const [error, user] = await createUser(prisma, body);

  // User created, lets just return it
  if (user) {
    // Prisma does not have an easy way to hide fields for now...
    // https://github.com/prisma/prisma/issues/5042
    user.password = '';

    reply.status(201);

    return user;
  }

  // Prisma code when a unique constraint is violated
  if (error.code === 'P2002') {
    throw errors.conflict('Email already registered!');
  }

  log.error(error);
  throw errors.internalServerError('Something went wrong!');
}
