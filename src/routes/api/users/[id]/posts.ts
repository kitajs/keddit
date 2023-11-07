import { Path, Query } from '@kitajs/runtime';
import { FastifyInstance } from 'fastify';
import { LimitOffset } from '../../../../models';
import { Authorized } from '../../../../providers/auth';

/**
 * @tag Users
 * @summary Get posts from a user
 * @operationId getUserPosts
 */
export async function get(
  { queries }: FastifyInstance,
  {}: Authorized,
  id: Path<number>,
  query: Query<LimitOffset>
) {
  return queries.listPostsByAuthorId(id, query.limit, query.offset);
}
