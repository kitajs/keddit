import { Query } from '@kitajs/runtime';
import { PrismaClient } from '@prisma/client';
import { Authorized } from '../../../../providers/auth';
import { TakeSkip } from '../../../../utils/model';

/**
 * @tag Users
 * @summary Get posts from the current user
 * @operationId getMePosts
 */
export async function get(
  prisma: PrismaClient,
  { user }: Authorized,
  query: Query<TakeSkip>
) {
  return prisma.post.findMany({
    where: { authorId: user.id },
    take: query.take,
    skip: query.skip,
    orderBy: { createdAt: 'desc' }
  });
}
