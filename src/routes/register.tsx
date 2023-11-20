import Html from '@kitajs/html';
import { Body, Query, Use } from '@kitajs/runtime';
import { PrismaClient } from '@prisma/client';
import { FastifyReply, FastifyRequest } from 'fastify';
import { SimpleField } from '../components/fields';
import { Layout } from '../components/layout';
import { CreateUser } from '../features/user/model';
import { createUser } from '../features/user/service';

export async function get(name?: Query, email?: Query) {
  return (
    <Layout>
      <section>
        <form method="post" hx-post="/register" hx-swap="outerHTML">
          <SimpleField
            id="name"
            required
            placeholder="Username"
            autocomplete="name"
            type="text"
            defaultValue={name}
            minlength={3}
          />
          <SimpleField
            id="email"
            required
            placeholder="Email address"
            autocomplete="email"
            type="email"
            subtitle="We'll never share your email with anyone else."
            defaultValue={email}
          />
          <SimpleField
            id="password"
            required
            placeholder="Password"
            type="password"
            autocomplete="password"
            minlength={8}
          />
          <button type="submit">Register now</button>
        </form>
      </section>
    </Layout>
  );
}

export async function post(
  this: Use<[]>,
  { log }: FastifyRequest,
  reply: FastifyReply,
  prisma: PrismaClient,
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
