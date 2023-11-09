import Html from '@kitajs/html';
import { PostWithAuthor } from '../db';
import { Locale } from '../providers/locale';

export async function Post(
  {
    title,
    body,
    createdAt,
    author,
    id,
    authored
  }: PostWithAuthor & { authored: boolean },
  locale: Locale
) {
  const date = new Date(createdAt);

  return (
    <article id={id.toString()}>
      <header safe>{title}</header>
      <span safe>{body}</span>
      <footer>
        Posted at{' '}
        <time datetime={date.toISOString()} safe>
          {date.toLocaleString(locale)}
        </time>{' '}
        by {authored ? ((<b>You</b>) as 'safe') : Html.escapeHtml(author)}
      </footer>
    </article>
  );
}
