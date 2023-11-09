import Html from '@kitajs/html';
import { FastifyReply } from 'fastify';
import { Layout } from '../components/layout';
import { Nav } from '../components/nav';

export async function get(reply: FastifyReply) {
  reply.header('Set-Cookie', `token=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0;`);

  return (
    <Layout>
      <Nav />

      <article>
        <div>Logged out</div>
      </article>
    </Layout>
  );
}
