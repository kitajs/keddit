import Html from '@kitajs/html';
import { PrismaClient } from '@prisma/client';
import { TakeSkip } from '../utils/model';
import { PostCards } from './post-cards';

export interface PostListProps extends TakeSkip {
  prisma: PrismaClient;
  userId?: number;
}

export async function PostList({ prisma, take, skip, userId }: PostListProps) {
  const posts = await prisma.post.findMany({
    select: {
      body: true,
      createdAt: true,
      id: true,
      title: true,
      authorId: true,
      author: { select: { name: true } }
    },
    orderBy: { createdAt: 'desc' },
    skip,
    take
  });

  if (!userId) {
    return (
      <>
        <PostCards posts={posts} userId={userId} />

        <a href="/login" role="button" class="outline" style={{ textAlign: 'center' }}>
          Login to load more
        </a>
      </>
    );
  }

  return (
    <>
      <PostCards posts={posts} userId={userId} />

      {posts.length >= take && (
        <button
          role="button"
          hx-swap="outerHTML"
          hx-get={`/posts?take=${take}&skip=${skip + take}`}
          hx-trigger="revealed"
        >
          Load more
        </button>
      )}
    </>
  );
}
