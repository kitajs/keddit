import { HttpErrors } from '@fastify/sensible';
import Html from '@kitajs/html';
import { Query } from '@kitajs/runtime';
import { FastifyInstance, FastifyRequest } from 'fastify';
import { Authorized } from '../../providers/auth';
import { PostList } from '../../utils/components/post-list';
import { TakeSkip } from '../../utils/model';

export async function get(
  { prisma }: FastifyInstance,
  { user }: Authorized,
  { take, skip }: Query<TakeSkip>,
  { headers }: FastifyRequest,
  errors: HttpErrors
) {
  if (!headers['hx-request']) {
    throw errors.badRequest('This route is only accessible via htmx');
  }

  return <PostList prisma={prisma} take={take} skip={skip} userId={user.id} />;
}
