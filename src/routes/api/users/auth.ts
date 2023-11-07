import { HttpErrors } from '@fastify/sensible';
import { Body } from '@kitajs/runtime';
import { verify } from 'argon2';
import { eq } from 'drizzle-orm';
import { FastifyInstance, FastifyReply } from 'fastify';
import { UserWithoutPassword, users } from '../../../db';
import { Login } from '../../../models';

/**
 * @tag Auth
 * @summary Login
 * @operationId login
 */
export async function post(
  { drizzle, jwt }: FastifyInstance,
  httpErrors: HttpErrors,
  reply: FastifyReply,
  {email,password}: Body<Login>
) {
  const [user] = await drizzle
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (
    !user ||
    // Invalid password
    !(await verify(user.password, password))
  ) {
    // Clear the cookie
    reply.header('Set-Cookie', `token=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0;`);

    throw httpErrors.unauthorized('Invalid email or password');
  }

  const token = jwt.sign({ userId: user.id }, { expiresIn: '1d' });

  // Http only cookies are sent automatically by the browser
  reply.header(
    'Set-Cookie',
    `token=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${60 * 60 * 24};`
  );

  return {
    token: `Bearer ${token}`,
    user: user as UserWithoutPassword
  };
}
