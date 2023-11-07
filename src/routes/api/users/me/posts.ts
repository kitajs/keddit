import { Query } from '@kitajs/runtime';
import { FastifyInstance } from 'fastify';
import { LimitOffset } from '../../../../models';
import { Authorized } from '../../../../providers/auth';

/**
 * @tag Users
 * @summary Get posts from the current user
 * @operationId getMePosts
 */
export async function get(
  { queries }: FastifyInstance,
  { user }: Authorized,
  query: Query<LimitOffset>
) {
  return queries.listPostsByAuthorId(user.id, query.limit, query.offset);
}
