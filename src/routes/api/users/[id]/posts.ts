import { Path, Query } from '@kitajs/runtime';
import { PrismaClient } from '@prisma/client';
import { Authorized } from '../../../../providers/auth';
import { TakeSkip } from '../../../../utils/model';

/**
 * @tag Users
 * @summary Get posts from a user
 * @operationId getUserPosts
 */
export async function get(
  prisma: PrismaClient,
  _: Authorized<false>,
  id: Path<number>,
  query: Query<TakeSkip>
) {
  return prisma.post.findMany({
    where: { authorId: id },
    take: query.take,
    skip: query.skip,
    orderBy: { createdAt: 'desc' }
  });
}
