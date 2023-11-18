import Html from '@kitajs/html';
import { Suspense } from '@kitajs/html/suspense';
import { SuspenseId } from '@kitajs/runtime';
import { FastifyInstance, FastifyRequest } from 'fastify';
import { SimpleField } from '../components/fields';
import { Layout } from '../components/layout';
import { PostList } from '../components/post-list';
import { Authorized } from '../providers/auth';

export async function get(
  { prisma }: FastifyInstance,
  { log }: FastifyRequest,
  rid: SuspenseId,
  { user }: Authorized<false>
) {
  return (
    <Layout user={user}>
      {!!user && (
        <section>
          <form method="post" hx-post="/posts" hx-swap="outerHTML">
            <SimpleField
              id="title"
              autocomplete='off'
              required
              placeholder="Title"
              type="text"
              minlength="5"
              maxlength="50"
            />
            <SimpleField
              id="body"
              placeholder="Write your thoughts..."
              required
              autocomplete='off'
              minlength="10"
              maxlength="300"
              of="textarea"
            />
            <button type="submit" class="primary" role="button">
              Publish post.
            </button>
          </form>
        </section>
      )}

      <section>
        <ul>
          <Suspense
            rid={rid}
            fallback={<progress />}
            catch={(err) => {
              log.error(err);
              return <li>Something went wrong</li>;
            }}
          >
            <PostList prisma={prisma} take={30} skip={0} userId={user?.id} />
          </Suspense>
        </ul>
      </section>
    </Layout>
  );
}
