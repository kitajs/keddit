import { HttpErrors } from '@fastify/sensible';
import { Path } from '@kitajs/runtime';
import { FastifyInstance } from 'fastify';
import { Authorized } from '../../../../providers/auth';

/**
 * @tag Users
 * @summary Get a user by id
 * @operationId getUser
 */
export async function get(
  { prisma }: FastifyInstance,
  _: Authorized,
  errors: HttpErrors,
  id: Path<number>
) {
  const user = await prisma.user.findUnique({
    where: { id }
  });

  if (!user) {
    throw errors.notFound('User not found');
  }

  // FIXME: Prisma does not have an easy way to hide fields for now...
  // https://github.com/prisma/prisma/issues/5042
  user.password = '';

  return user;
}
