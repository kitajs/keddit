import { Query } from '@kitajs/runtime';
import { desc, eq } from 'drizzle-orm';
import { FastifyInstance } from 'fastify';
import { posts } from '../../../../db';
import { LimitOffset } from '../../../../models';
import { Authorized } from '../../../../providers/auth';

/**
 * @tag Users
 * @summary Get posts from the current user
 * @operationId getMePosts
 */
export async function get(
  { drizzle }: FastifyInstance,
  { user }: Authorized,
  query: Query<LimitOffset>
) {
  return drizzle
    .select()
    .from(posts)
    .where(eq(posts.authorId, user.id))
    .limit(query.limit)
    .offset(query.offset)
    .orderBy(desc(posts.createdAt));
}
