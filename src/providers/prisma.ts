import { PrismaClient } from 'prisma-client';
import { FastifyInstance } from 'fastify';
import { Env } from '../env';

const prisma = new PrismaClient({
  datasourceUrl: Env.DATABASE_URL,
  log: [
    { emit: 'event', level: 'query' },
    { emit: 'event', level: 'warn' },
    { emit: 'event', level: 'info' },
    { emit: 'event', level: 'error' }
  ]
});

export default function (): PrismaClient {
  return prisma;
}

export async function onReady(this: FastifyInstance) {
  prisma.$on('error', this.log.error.bind(this.log));
  prisma.$on('info', this.log.debug.bind(this.log));
  prisma.$on('query', this.log.trace.bind(this.log));
  prisma.$on('warn', this.log.warn.bind(this.log));

  await prisma.$connect();
}

export async function onClose(this: FastifyInstance) {
  await prisma.$disconnect();
}
