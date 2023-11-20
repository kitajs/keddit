import { Html } from '@kitajs/html';
import { Body } from '@kitajs/runtime';
import { PrismaClient } from '@prisma/client';
import { FastifyReply, FastifyRequest } from 'fastify';
import { Layout } from '../components/layout';
import { UpdateUserForm } from '../components/update-user';
import { UpdateUser } from '../features/user/model';
import { updateUser } from '../features/user/service';
import { Authorized } from '../providers/auth';

export function get({ user }: Authorized<'html'>) {
  return (
    <Layout user={user}>
      <section>
        <UpdateUserForm user={user} />
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
  const [error, updatedUser] = await updateUser(prisma, user.id, body);

  if (error) {
    // TODO: Handle error
    log.error(error);
    reply.code(500);
    return <div>Internal Server Error</div>;
  }

  return <UpdateUserForm user={updatedUser!} />;
}
