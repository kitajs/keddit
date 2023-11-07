import { FastifyInstance } from 'fastify';
import { Authorized } from '../../../../providers/auth';
import { Body } from '@kitajs/runtime';
import { UpdateUser, UserWithoutPassword, users } from '../../../../db';
import { eq } from 'drizzle-orm';

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
  { drizzle }: FastifyInstance,
  { user }: Authorized,
  body: Body<UpdateUser>
): Promise<UserWithoutPassword> {
  return drizzle
    .update(users)
    .set(body)
    .where(eq(users.id, user.id))
    .returning()
    .then((rows) => rows[0]!);
}
