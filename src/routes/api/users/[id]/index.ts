import { HttpErrors } from '@fastify/sensible';
import { Path } from '@kitajs/runtime';
import { eq } from 'drizzle-orm';
import { FastifyInstance } from 'fastify';
import { UserWithoutPassword, users } from '../../../../db';
import { Authorized } from '../../../../providers/auth';

/**
 * @tag Users
 * @summary Get a user by id
 * @operationId getUser
 */
export async function get(
  { drizzle }: FastifyInstance,
  {}: Authorized,
  errors: HttpErrors,
  id: Path<number>
): Promise<UserWithoutPassword> {
  const [user] = await drizzle.select().from(users).where(eq(users.id, id)).limit(1);

  if (!user) {
    throw errors.notFound('User not found');
  }

  return user;
}
