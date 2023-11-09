import Html from '@kitajs/html';
import { Suspense } from '@kitajs/html/suspense';
import { Body, SuspenseId } from '@kitajs/runtime';
import { FastifyInstance, FastifyReply } from 'fastify';
import { Layout } from '../components/layout';
import { Nav } from '../components/nav';
import { PostList } from '../components/post-list';
import { CreatePost, posts } from '../db';
import { Authorized } from '../providers/auth';

export async function get(
  { drizzle }: FastifyInstance,
  rid: SuspenseId,
  { user }: Authorized<false>
) {
  return (
    <Layout>
      <Nav user={user} />

      <article>
        <form method="post" hx-post="/" hx-swap="outerHTML">
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
        {' '}
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
            <PostList db={drizzle} limit={30} offset={0} userId={user?.id} />
          </Suspense>
        </ul>
      </article>
    </Layout>
  );
}

export async function post(
  { drizzle }: FastifyInstance,
  { user }: Authorized,
  reply: FastifyReply,
  body: Body<CreatePost>
) {
  await drizzle.insert(posts).values({
    ...body,
    authorId: user.id
  });

  reply.header('hx-redirect', `/`);
  return <div>Redirecting...</div>;
}
