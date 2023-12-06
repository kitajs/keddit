import Html from '@kitajs/html';
import { PrismaClient } from 'prisma-client';
import { TakeSkip } from '../utils/model';
import { PostCard } from './post';

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

  const cards = posts.map((post) => (
    <li>
      <PostCard
        author={post.author.name}
        post={post}
        authored={userId === post.authorId}
      />
    </li>
  ));

  if (!userId) {
    return (
      <>
        {cards}

        <a href="/login" role="button" class="outline" style={{ textAlign: 'center' }}>
          Login to load more
        </a>
      </>
    );
  }

  return (
    <>
      {cards}

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
