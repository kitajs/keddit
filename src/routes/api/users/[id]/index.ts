import { HttpErrors } from '@fastify/sensible';
import { Path } from '@kitajs/runtime';
import { FastifyInstance } from 'fastify';
import { UserWithoutPassword } from '../../../../db';
import { Authorized } from '../../../../providers/auth';

/**
 * @tag Users
 * @summary Get a user by id
 * @operationId getUser
 */
export async function get(
  { queries }: FastifyInstance,
  {}: Authorized,
  errors: HttpErrors,
  id: Path<number>
): Promise<UserWithoutPassword> {
  const user = await queries.getUserById(id);

  if (!user) {
    throw errors.notFound('User not found');
  }

  return user;
}
