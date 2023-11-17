import Html from '@kitajs/html';
import { Suspense } from '@kitajs/html/suspense';
import { SuspenseId } from '@kitajs/runtime';
import { FastifyInstance } from 'fastify';
import { Authorized } from '../providers/auth';
import { Layout } from '../utils/components/layout';
import { Nav } from '../utils/components/nav';
import { PostList } from '../utils/components/post-list';

export async function get(
  { prisma }: FastifyInstance,
  rid: SuspenseId,
  { user }: Authorized<false>
) {
  return (
    <Layout>
      <Nav user={user} />

      <article>
        <form method="post" hx-post="/posts" hx-swap="outerHTML">
          <input
            type="text"
            name="title"
            placeholder="Title"
            required
            minlength="5"
            maxlength="50"
          />
          <textarea
            name="body"
            placeholder="Write your thoughts..."
            required
            minlength="10"
            maxlength="300"
          />
          <button type="submit" class="secondary" role="button">
            Publish post.
          </button>
        </form>
      </article>

      <article>
        <ul>
          <Suspense
            rid={rid}
            fallback={
              <li>
                <button aria-busy="true" class="secondary" role="button"></button>
              </li>
            }
            catch={(err) => {
              console.error(err);
              return <li>Something went wrong</li>;
            }}
          >
            <PostList prisma={prisma} take={30} skip={0} userId={user?.id} />
          </Suspense>
        </ul>
      </article>
    </Layout>
  );
}
