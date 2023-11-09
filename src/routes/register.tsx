import Html from '@kitajs/html';
import { Body, Query } from '@kitajs/runtime';
import { hash } from 'argon2';
import { FastifyInstance, FastifyReply } from 'fastify';
import { Layout } from '../components/layout';
import { Nav } from '../components/nav';
import { CreateUser, users } from '../db';

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
            Login
          </button>
        </form>
      </article>
    </Layout>
  );
}

export async function post(
  { drizzle }: FastifyInstance,
  reply: FastifyReply,
  body: Body<CreateUser>
) {
  try {
    body.password = await hash(body.password);

    const user = await drizzle
      .insert(users)
      .values(body)
      .returning()
      .then((rows) => rows[0]!);

    reply.header('hx-redirect', `/login?email=${user.email}`);
    return <div>Redirecting...</div>;
  } catch (error: any) {
    if (error.constraint_name === 'users_email_unique') {
      reply.header(
        'hx-redirect',
        `/register?name=${body.name}&email=Email already exists`
      );
      return <div>Redirecting...</div>;
    }

    throw error;
  }
}
