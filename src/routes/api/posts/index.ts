import { HttpErrors } from '@fastify/sensible';
import { Body, Query } from '@kitajs/runtime';
import { desc } from 'drizzle-orm';
import { FastifyInstance } from 'fastify';
import { CreatePost, posts } from '../../../db';
import { LimitOffset } from '../../../models';
import { Authorized } from '../../../providers/auth';

/**
 * @tag Posts
 * @summary Get posts
 * @operationId getPosts
 */
export async function get({ drizzle }: FastifyInstance, filter: Query<LimitOffset>) {
  return drizzle
    .select()
    .from(posts)
    .limit(filter.limit)
    .offset(filter.offset)
    .orderBy(desc(posts.createdAt));
}

/**
 * @tag Posts
 * @summary Create a post
 * @operationId createPost
 */
export async function post(
  { drizzle }: FastifyInstance,
  { user }: Authorized,
  errors: HttpErrors,
  body: Body<CreatePost>
) {
  try {
    return drizzle
      .insert(posts)
      .values({
        ...body,
        authorId: user.id
      })
      .returning()
      .then((rows) => rows[0]!);
  } catch (error: any) {
    if (error.constraint_name === 'posts_title_unique') {
      throw errors.conflict('This title was already created!');
    }

    throw error;
  }
}
