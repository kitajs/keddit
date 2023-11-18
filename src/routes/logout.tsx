import Html from '@kitajs/html';
import { FastifyReply } from 'fastify';
import { Layout } from '../components/layout';

export async function get(reply: FastifyReply) {
  reply.clearCookie('token');

  return (
    <Layout>
      <section>
        <h2>Logged out</h2>
        <a href="/login">Login</a>
      </section>
    </Layout>
  );
}
