import { Html } from '@kitajs/html';
import { Body } from '@kitajs/runtime';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { SimpleField } from '../components/fields';
import { Layout } from '../components/layout';
import { Authorized } from '../providers/auth';
import { UpdateUser } from '../users/model';
import { updateUser } from '../users/service';

export function get({ user }: Authorized<'html'>) {
  return (
    <Layout user={user}>
      <section>
        <form method="post" hx-post="/profile" hx-swap="outerHTML">
          <SimpleField
            id="name"
            required
            placeholder="Username"
            autocomplete='username'
            type="text"
            value={user.name}
            minlength={3}
          />
          <SimpleField
            id="email"
            required
            autocomplete='email'
            placeholder="Email address"
            type="email"
            small="We'll never share your email with anyone else."
            value={user.email}
          />
          <button type="submit">Update current user</button>
        </form>
      </section>
    </Layout>
  );
}

export async function post(
  { prisma }: FastifyInstance,
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
