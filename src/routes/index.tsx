import Html from '@kitajs/html';
import { Suspense } from '@kitajs/html/suspense';
import { SuspenseId } from '@kitajs/runtime';
import { FastifyInstance } from 'fastify';
import { Layout } from '../components/layout';
import { Nav } from '../components/nav';
import { PostList } from '../components/post';
import { Authorized } from '../providers/auth';

export async function get(
  { drizzle }: FastifyInstance,
  rid: SuspenseId,
  { user }: Authorized<false>
) {
  
  return (
    <Layout>
      <Nav user={user} />

      <ul>
        <Suspense
          rid={rid}
          fallback={
            <li>
              <button aria-busy='true' class='secondary'></button>
            </li>
          }
          catch={(err: any) => (
            <li>
              <div safe>{String(err.message)}</div>
            </li>
          )}>
          <PostList db={drizzle} limit={30} offset={0} authenticated={!!user} />
        </Suspense>
      </ul>
    </Layout>
  );
}
