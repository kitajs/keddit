import Html from '@kitajs/html';
import { Post } from '@prisma/client';
import { Locale } from '../../providers/locale';

export interface PostCardProps {
  post: Post;
  author: string;
  /** If the logged in user is the author */
  authored: boolean;
}

export async function PostCard(
  { post, author, authored }: PostCardProps,
  locale: Locale
) {
  return (
    <article id={post.id + ''}>
      <header safe>{post.title}</header>
      <span safe>{post.body}</span>
      <footer>
        <span>
          Posted at {Html.escapeHtml(new Date(post.createdAt).toLocaleString(locale))} by{' '}
          {authored ? <b>You</b> : Html.escapeHtml(author)}
        </span>
      </footer>
    </article>
  );
}
