import Html from '@kitajs/html';
import { Query } from '@kitajs/runtime';
import { FastifyInstance, FastifyRequest } from 'fastify';
import { PostList } from '../../components/post-list';
import { LimitOffset } from '../../models';
import { Authorized } from '../../providers/auth';

export async function get(
  { drizzle }: FastifyInstance,
  { user }: Authorized,
  { limit, offset }: Query<LimitOffset>,
  { headers }: FastifyRequest
) {
  if (!headers['hx-request']) {
    return 'This route can only be accessed via htmx';
  }

  return <PostList db={drizzle} limit={limit} offset={offset} userId={user.id} />;
}
