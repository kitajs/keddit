import { HttpErrors } from '@fastify/sensible';
import { Body, Query } from '@kitajs/runtime';
import { PrismaClient } from '@prisma/client';
import { FastifyReply, FastifyRequest } from 'fastify';
import { CreatePost } from '../../../features/posts/model';
import { createPost } from '../../../features/posts/service';
import { Authorized } from '../../../providers/auth';
import { TakeSkip } from '../../../utils/model';

/**
 * @tag Posts
 * @summary Get posts
 * @operationId getPosts
 */
export async function get(prisma: PrismaClient, filter: Query<TakeSkip>) {
  return prisma.post.findMany({
    take: filter.take,
    skip: filter.skip,
    orderBy: { createdAt: 'desc' }
  });
}

/**
 * @tag Posts
 * @summary Create a post
 * @operationId createPost
 */
export async function post(
  prisma: PrismaClient,
  { user }: Authorized,
  { log }: FastifyRequest,
  reply: FastifyReply,
  errors: HttpErrors,
  body: Body<CreatePost>
) {
  const [error, post] = await createPost(prisma, user.id, body);

  if (post) {
    reply.status(201);
    return post;
  }

  log.error(error);
  throw errors.internalServerError('Something went wrong!');
}
