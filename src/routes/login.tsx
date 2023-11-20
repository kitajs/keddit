import Html from '@kitajs/html';
import { Body, Query } from '@kitajs/runtime';
import { PrismaClient } from '@prisma/client';
import { FastifyInstance, FastifyReply } from 'fastify';
import { SimpleField } from '../components/fields';
import { Layout } from '../components/layout';
import { Env } from '../env';
import { createUserJwt, verifyUserPassword } from '../features/user/auth';
import { EmailAndPassword } from '../features/user/model';
import { Authorized } from '../providers/auth';

export async function get({ user }: Authorized<false>, email?: Query, next?: Query) {
  if (user) {
    return (
      <Layout user={user}>
        <section>
          <div>You are already logged in.</div>
          <a href="/logout">Logout</a>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section>
        <form method="post" hx-post={`/login?next=${next || '/'}`}>
          <SimpleField
            id="email"
            autocomplete="email"
            required
            placeholder="Email address"
            type="email"
            subtitle="We'll never share your email with anyone else."
            defaultValue={email}
          />
          <SimpleField
            id="password"
            autocomplete="password"
            required
            placeholder="Password"
            type="password"
            minlength={8}
          />
          <button type="submit">Register</button>
        </form>

        {!!next && (
          <small>
            After login you will be redirected to <code safe>{next}</code>
          </small>
        )}
      </section>
    </Layout>
  );
}

export async function post(
  { jwt }: FastifyInstance,
  prisma: PrismaClient,
  reply: FastifyReply,
  body: Body<EmailAndPassword>,
  next: Query = '/'
) {
  const user = await prisma.user.findUnique({
    where: { email: body.email },
    select: { id: true, password: true }
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
    maxAge: Env.JWT_EXPIRES_SECONDS
  });

  reply.header('hx-redirect', next);

  return <div>Redirecting...</div>;
}
