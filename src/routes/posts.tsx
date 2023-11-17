import Html from '@kitajs/html';
import { Body } from '@kitajs/runtime';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { CreatePost } from '../posts/model';
import { createPost } from '../posts/service';
import { Authorized } from '../providers/auth';

export async function post(
  { prisma }: FastifyInstance,
  { user }: Authorized,
  { log }: FastifyRequest,
  reply: FastifyReply,
  body: Body<CreatePost>
) {
  const [error] = await createPost(prisma, user.id, body);

  if (error) {
    // TODO: Handle error
    log.error(error);
  }

  reply.status(201);
  reply.header('hx-redirect', '/');
  return <div>Redirecting...</div>;
}
