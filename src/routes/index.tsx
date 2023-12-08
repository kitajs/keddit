import Html from '@kitajs/html';
import { Suspense } from '@kitajs/html/suspense';
import { SuspenseId } from '@kitajs/runtime';
import { PrismaClient } from 'prisma-client';
import { SimpleField } from '../components/fields';
import { Layout } from '../components/layout';
import { PostList } from '../components/post-list';
import { Authorized } from '../providers/auth';

export async function get(
  prisma: PrismaClient,
  { user }: Authorized<false>,
  rid: SuspenseId
) {
  return (
    <Layout user={user}>
      {!!user && (
        <section>
          <form
            method="post"
            hx-post="/posts"
            hx-swap="afterbegin"
            hx-target="#post-list"
            // hx-on::after-request is a syntax error in JSX
            {...{ 'hx-on::after-request': 'this.reset()' }}
          >
            <SimpleField
              id="title"
              autocomplete="off"
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
              autocomplete="off"
              minlength="10"
              maxlength="300"
              inputType="textarea"
            />
            <button type="submit" class="primary" role="button">
              Publish post.
            </button>
          </form>
        </section>
      )}

      <section>
        <ul id="post-list">
          <Suspense rid={rid} fallback={<progress />} catch={'Unknown error!'}>
            <PostList prisma={prisma} take={10} skip={0} userId={user?.id} />
          </Suspense>
        </ul>
      </section>
    </Layout>
  );
}
