import { Path, Query } from '@kitajs/runtime';
import { FastifyInstance } from 'fastify';
import { LimitOffset } from '../../../../models';
import { Authorized } from '../../../../providers/auth';
import { desc, eq } from 'drizzle-orm';
import { posts } from '../../../../db';

/**
 * @tag Users
 * @summary Get posts from a user
 * @operationId getUserPosts
 */
export async function get(
  { drizzle }: FastifyInstance,
  {}: Authorized,
  id: Path<number>,
  query: Query<LimitOffset>
) {
  return drizzle.select()
  .from(posts)
  .where(eq(posts.authorId, id))
  .limit(query.limit)
  .offset(query.offset)
  .orderBy(desc(posts.createdAt))
}
