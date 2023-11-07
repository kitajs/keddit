import Html from '@kitajs/html';
import { Body } from '@kitajs/runtime';
import { verify } from 'argon2';
import { eq } from 'drizzle-orm';
import { FastifyInstance, FastifyReply } from 'fastify';
import { Layout } from '../components/layout';
import { Nav } from '../components/nav';
import { users } from '../db';
import { Login } from '../models';
import { Authorized } from '../providers/auth';

export async function get(reply: FastifyReply, { user }: Authorized<false>) {
  if (user) {
    return reply.redirect(302, '/');
  }

  return (
    <Layout>
      <Nav />

      <form method='post' hx-post='/login' hx-swap='outerHTML'>
        <input type='text' name='email' placeholder='Email' required />
        <input type='password' name='password' placeholder='Password' required />
        <button type='submit' class='secondary'>
          Post
        </button>
      </form>
    </Layout>
  );
}

export async function post(
  { drizzle, jwt }: FastifyInstance,
  reply: FastifyReply,
  body: Body<Login>
) {
  const [user] = await drizzle
    .select()
    .from(users)
    .where(eq(users.email, body.email))
    .limit(1);

  if (
    !user ||
    // Invalid password
    !(await verify(user.password, body.password))
  ) {
    // Clear the cookie
    reply.header('Set-Cookie', `token=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0;`);

    return (
      <Layout>
        <div>Invalid email or password</div>
        <a href='/login'>Login</a>
      </Layout>
    );
  }

  const token = jwt.sign({ userId: user.id }, { expiresIn: '1d' });

  // Http only cookies are sent automatically by the browser
  reply.header(
    'Set-Cookie',
    `token=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${60 * 60 * 24};`
  );

  return reply.redirect(302, '/');
}
