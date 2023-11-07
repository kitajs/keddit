import Html from '@kitajs/html';
import { Query } from '@kitajs/runtime';
import { FastifyInstance, FastifyRequest } from 'fastify';
import { PostList } from '../../components/post';
import { LimitOffset } from '../../models';
import { Authorized } from '../../providers/auth';

export async function get(
  { queries }: FastifyInstance,
  {}: Authorized,
  { limit, offset }: Query<LimitOffset>,
  { headers }: FastifyRequest
) {
  if (!headers['hx-request']) {
    return 'This route can only be accessed via htmx';
  }

  return <PostList queries={queries} limit={limit} offset={offset} authenticated />;
}
