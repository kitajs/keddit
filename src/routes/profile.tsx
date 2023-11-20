import { Html } from '@kitajs/html';
import { Body } from '@kitajs/runtime';
import { PrismaClient } from '@prisma/client';
import { FastifyReply, FastifyRequest } from 'fastify';
import { SimpleField } from '../components/fields';
import { Layout } from '../components/layout';
import { UpdateUser } from '../features/user/model';
import { updateUser } from '../features/user/service';
import { Authorized } from '../providers/auth';

export function get({ user }: Authorized<'html'>) {
  return (
    <Layout user={user}>
      <section>
        <form method="post" hx-post="/profile" hx-swap="outerHTML">
          <SimpleField
            id="name"
            required
            placeholder="Username"
            autocomplete="username"
            type="text"
            subtitle={user.name}
            minlength={3}
          />
          <SimpleField
            id="email"
            required
            autocomplete="email"
            placeholder="Email address"
            type="email"
            subtitle="We'll never share your email with anyone else."
            defaultValue={user.email}
          />
          <button type="submit">Update current user</button>
        </form>
      </section>
    </Layout>
  );
}

export async function post(
  prisma: PrismaClient,
  { user }: Authorized,
  { log }: FastifyRequest,
  reply: FastifyReply,
  body: Body<UpdateUser>
) {
  const [error] = await updateUser(prisma, user.id, body);

  if (error) {
    // TODO: Handle error
    log.error(error);
  }

  reply.header('hx-redirect', '/profile');
  return <div>Redirecting...</div>;
}
