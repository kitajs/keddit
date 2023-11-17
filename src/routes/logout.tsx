import Html from '@kitajs/html';
import { FastifyReply } from 'fastify';
import { Layout } from '../utils/components/layout';
import { Nav } from '../utils/components/nav';

export async function get(reply: FastifyReply) {
  reply.clearCookie('token');

  return (
    <Layout>
      <Nav />

      <article>
        <div>Logged out</div>
      </article>
    </Layout>
  );
}
