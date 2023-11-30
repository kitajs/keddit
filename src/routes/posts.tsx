import Html from '@kitajs/html';
import { Body, Query } from '@kitajs/runtime';
import { PrismaClient } from '@prisma/client';
import { FastifyReply, FastifyRequest } from 'fastify';
import { PostCard } from '../components/post';
import { PostList } from '../components/post-list';
import { CreatePost } from '../features/posts/model';
import { createPost } from '../features/posts/service';
import { Authorized } from '../providers/auth';
import { TakeSkip } from '../utils/model';

export async function get(
  prisma: PrismaClient,
  { user }: Authorized<'html'>,
  { take, skip }: Query<TakeSkip>
) {
  return <PostList prisma={prisma} take={take} skip={skip} userId={user.id} />;
}

export async function post(
  prisma: PrismaClient,
  { user }: Authorized,
  { log }: FastifyRequest,
  reply: FastifyReply,
  body: Body<CreatePost>
) {
  const [error, post] = await createPost(prisma, user.id, body);

  if (error) {
    // TODO: Handle error
    log.error(error);
    reply.status(500);

    return <div>Internal Server Error</div>;
  }

  return <PostCard post={post!} author={user.name} authored />;
}
