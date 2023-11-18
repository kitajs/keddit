import { Body } from '@kitajs/runtime';
import { FastifyInstance, FastifyReply } from 'fastify';
import { Authorized } from '../../../../providers/auth';
import { UpdateUser } from '../../../../users/model';

/**
 * @tag Users
 * @operationId me
 * @summary Get the current user
 */
export async function get(auth: Authorized) {
  return auth.user;
}

/**
 * @tag Users
 * @operationId updateMe
 * @summary Update the current user
 */
export async function post(
  { prisma }: FastifyInstance,
  { user }: Authorized,
  reply: FastifyReply,
  body: Body<UpdateUser>
) {
  reply.status(204);

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: {
      name: body.name?.trim(),
      email: body.email?.trim()
    }
  });

  // FIXME: Prisma does not have an easy way to hide fields for now...
  // https://github.com/prisma/prisma/issues/5042
  updated.password = '';

  return updated;
}
