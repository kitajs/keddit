import Html from '@kitajs/html';
import { desc, eq } from 'drizzle-orm';
import { Database, posts, users } from '../db';
import { LimitOffset } from '../models';
import { Post } from './post';

export interface PostListProps extends LimitOffset {
  db: Database;
  userId?: number;
}

export async function PostList({ db, limit, offset, userId }: PostListProps) {
  const query = await db
    .select()
    .from(posts)
    .innerJoin(users, eq(posts.authorId, users.id))
    .limit(limit)
    .offset(offset)
    .orderBy(desc(posts.createdAt));

  if (query.length === 0) {
    return <p>No more posts available.</p>;
  }

  return (
    <>
      {query.map((post) => (
        <li>
          <Post
            author={post.users.name}
            body={post.posts.body}
            createdAt={post.posts.createdAt}
            title={post.posts.title}
            id={post.posts.id}
            authored={userId === post.posts.authorId}
          />
        </li>
      ))}

      {userId ? (
        <button
          role="button"
          hx-swap="outerHTML"
          hx-get={`/components/posts?limit=${limit}&offset=${offset + limit}`}
          hx-trigger="revealed"
        >
          Load more
        </button>
      ) : (
        <a href="/login">Login to load more</a>
      )}
    </>
  );
}
