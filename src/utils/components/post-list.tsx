import Html from '@kitajs/html';
import { PrismaClient } from '@prisma/client';
import { TakeSkip } from '../model';
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

  return (
    <>
      {posts.map((post) => (
        <li>
          <PostCard
            author={post.author.name}
            post={post}
            authored={userId === post.authorId}
          />
        </li>
      ))}

      {userId ? (
        posts.length !== take ? (
          <>No more posts available.</>
        ) : (
          <button
            role="button"
            hx-swap="outerHTML"
            hx-get={`/components/posts?take=${take}&skip=${skip + take}`}
            hx-trigger="revealed"
          >
            Load more
          </button>
        )
      ) : (
        <a href="/login">Login to load more</a>
      )}
    </>
  );
}
