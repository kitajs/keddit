import Html from '@kitajs/html';
import { Body, Query, Use } from '@kitajs/runtime';
import { FastifyInstance, FastifyReply } from 'fastify';
import { CreateUser } from '../users/model';
import { createUser } from '../users/service';
import { Layout } from '../utils/components/layout';
import { Nav } from '../utils/components/nav';

export async function get(name?: Query, email?: Query) {
  return (
    <Layout>
      <Nav />

      <article>
        <form method="post" hx-post="/register" hx-swap="outerHTML">
          <input type="text" name="name" placeholder="Name" required value={name} />
          <input type="email" name="email" placeholder="Email" required value={email} />
          <input
            type="password"
            name="password"
            placeholder="Password"
            min="8"
            required
          />

          <button type="submit" class="secondary">
            Register now
          </button>
        </form>
      </article>
    </Layout>
  );
}

export async function post(
  this: Use<[]>,
  { prisma, log }: FastifyInstance,
  reply: FastifyReply,
  body: Body<CreateUser>
) {
  const [error, user] = await createUser(prisma, body);

  if (user) {
    reply.header('hx-redirect', `/login?email=${user.email}`);
    return <div>Redirecting...</div>;
  }

  if (error.code === 'P2002') {
    reply.header('hx-redirect', `/register?name=${body.name}&email=Email already exists`);
    return <div>Redirecting...</div>;
  }

  log.error(error);
  reply.header('hx-redirect', `/register?name=Unknown error...`);

  return <div>Redirecting...</div>;
}
