import Html from '@kitajs/html';
import { Post } from '@prisma/client';

export interface PostCardProps {
  post: Post;
  author: string;
  /** If the logged in user is the author */
  authored: boolean;
}

export async function PostCard({ post, author, authored }: PostCardProps) {
  // TODO: The locale could be parsed from the Accept-Language header
  const date = new Date(post.createdAt).toLocaleString('en-US');

  return (
    <article id={post.id + ''}>
      <header class="headings">
        <h3 safe style={{ textTransform: 'uppercase' }}>
          {post.title}
        </h3>
        {!authored && <div safe>{author}</div>}
      </header>
      <span safe>{post.body}</span>
      <footer>
        <small>
          Posted at <i safe>{date}</i>
        </small>
      </footer>
    </article>
  );
}
