import Html from '@kitajs/html';
import { Body, Query } from '@kitajs/runtime';
import { PrismaClient } from 'prisma-client';
import { FastifyInstance, FastifyReply } from 'fastify';
import { LoginForm } from '../components/forms';
import { Layout } from '../components/layout';
import { Env } from '../env';
import { createUserJwt, verifyUserPassword } from '../features/user/auth';
import { EmailAndPassword } from '../features/user/model';
import { Authorized } from '../providers/auth';

export async function get({ user }: Authorized<false>, next: Query = '/', email?: Query) {
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
        <LoginForm next={next} defaultEmail={email} />

        {next !== '/' && (
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

  if (!user) {
    reply.clearCookie('token');

    return (
      <LoginForm next={next} emailError="User not found." defaultEmail={body.email} />
    );
  }

  if (!(await verifyUserPassword(user.password, body.password))) {
    reply.clearCookie('token');

    return (
      <LoginForm
        next={next}
        passwordError="Invalid password."
        defaultEmail={body.email}
      />
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

  return '';
}
