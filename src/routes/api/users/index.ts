import { HttpErrors } from '@fastify/sensible';
import { Body } from '@kitajs/runtime';
import { hash } from 'argon2';
import type { FastifyInstance } from 'fastify';
import { CreateUser, UserWithoutPassword, users } from '../../../db';

/**
 * @tag Users
 * @summary Create a user
 * @operationId createUser
 */
export async function post(
  { drizzle }: FastifyInstance,
  errors: HttpErrors,
  body: Body<CreateUser>
): Promise<UserWithoutPassword> {
  try {
    body.password = await hash(body.password);

    return await drizzle
      .insert(users)
      .values(body)
      .returning()
      .then((rows) => rows[0]!);
  } catch (error: any) {
    if (error.constraint_name === 'users_email_unique') {
      throw errors.conflict('Email already registered!');
    }

    throw error;
  }
}
