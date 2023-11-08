import { Query } from '@kitajs/runtime';
import { FastifyInstance } from 'fastify';
import { LimitOffset } from '../../../../models';
import { Authorized } from '../../../../providers/auth';
import { eq, desc } from 'drizzle-orm';
import { posts } from '../../../../db';

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
 return drizzle .select()
    .from(posts)
    .where(eq(posts.authorId,user.id))
    .limit(query.limit)
    .offset(query.offset)
    .orderBy(desc(posts.createdAt))
}
