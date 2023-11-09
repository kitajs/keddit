import Html from '@kitajs/html';
import { Body, Query } from '@kitajs/runtime';
import { verify } from 'argon2';
import { eq } from 'drizzle-orm';
import { FastifyInstance, FastifyReply } from 'fastify';
import { Layout } from '../components/layout';
import { Nav } from '../components/nav';
import { users } from '../db';
import { Login } from '../models';
import { Authorized } from '../providers/auth';

export async function get(
  reply: FastifyReply,
  { user }: Authorized<false>,
  email?: Query,
  next: Query = '/'
) {
  if (user) {
    reply.header('hx-redirect', '/');
    return <div>Redirecting...</div>;
  }

  return (
    <Layout>
      <Nav />

      <article>
        <form method="post" hx-post={`/login?next=${next}`}>
          <input type="email" name="email" placeholder="Email" required value={email} />
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            min="8"
          />
          <button type="submit" class="secondary">
            Register
          </button>
        </form>
      </article>
    </Layout>
  );
}

export async function post(
  { drizzle, jwt }: FastifyInstance,
  reply: FastifyReply,
  body: Body<Login>,
  next: Query = '/'
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
      <>
        <div>Invalid email or password</div>
        <a href="/login">Login</a>
      </>
    );
  }

  const token = jwt.sign({ userId: user.id }, { expiresIn: '1d' });

  // Http only cookies are sent automatically by the browser
  reply.header(
    'Set-Cookie',
    `token=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${60 * 60 * 24};`
  );

  reply.header('hx-redirect', next);

  return <div>Redirecting...</div>;
}
