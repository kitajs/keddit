import Html from '@kitajs/html';
import { Queries } from '../db';
import { LimitOffset } from '../models';
import { Locale } from '../providers/locale';

export interface PostWithAuthor {
  title: string;
  body: string;
  createdAt: string;
  author: string;
}

export async function Post(
  { title, body, createdAt, author }: PostWithAuthor,
  locale: Locale
) {
  const date = new Date(createdAt);

  return (
    <article>
      <header safe>{title}</header>
      <span safe>{body}</span>
      <footer>
        Posted at{' '}
        <time datetime={date.toISOString()} safe>
          {date.toLocaleString(locale)}
        </time>{' '}
        by <span safe>{author}</span>
      </footer>
    </article>
  );
}

export async function PostList({
  queries,
  limit,
  offset,
  authenticated
}: { queries: Queries; authenticated: boolean } & LimitOffset) {
  const posts = await queries.listPostsJoinAuthor(limit, offset);

  if (posts.length === 0) {
    return <p>There are no more posts.</p>;
  }

  return (
    <>
      {posts.map((post) => (
        <li>
          <Post
            author={post.users.name}
            body={post.posts.body}
            createdAt={post.posts.createdAt}
            title={post.posts.title}
          />
        </li>
      ))}

      {authenticated ? (
        <button
          hx-swap='outerHTML'
          hx-get={`/components/posts?limit=${limit}&offset=${offset + limit}`}
          hx-trigger='revealed'>
          Load more
        </button>
      ) : (
        <a href='/login'>Login to load more</a>
      )}
    </>
  );
}
