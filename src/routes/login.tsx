import Html from '@kitajs/html';
import { Body, Query } from '@kitajs/runtime';
import { FastifyInstance, FastifyReply } from 'fastify';
import { Authorized } from '../providers/auth';
import { JWT_EXPIRES_SECONDS, createUserJwt, verifyUserPassword } from '../users/auth';
import { EmailAndPassword } from '../users/model';
import { Layout } from '../utils/components/layout';
import { Nav } from '../utils/components/nav';

export async function get(
  reply: FastifyReply,
  { user }: Authorized<false>,
  email?: Query,
  next: Query = '/'
) {
  if (user) {
    reply.header('hx-redirect', next);
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
            minlength="8"
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
  { prisma, jwt }: FastifyInstance,
  reply: FastifyReply,
  body: Body<EmailAndPassword>,
  next: Query = '/'
) {
  const user = await prisma.user.findUnique({
    where: { email: body.email },
    select: {
      id: true,
      password: true
    }
  });

  if (
    !user ||
    // Invalid password
    !(await verifyUserPassword(user.password, body.password))
  ) {
    reply.clearCookie('token');

    return (
      <>
        <div>Invalid email or password</div>
        <a href="/login">Login</a>
      </>
    );
  }

  const token = createUserJwt(jwt, user);

  reply.setCookie('token', token, {
    httpOnly: true,
    path: '/',
    sameSite: 'strict',
    maxAge: JWT_EXPIRES_SECONDS
  });

  reply.header('hx-redirect', next);

  return <div>Redirecting...</div>;
}
