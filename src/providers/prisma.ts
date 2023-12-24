import { FastifyInstance } from 'fastify';
import { PrismaClient } from 'prisma-client';
import { Env } from '../env';

// Singleton is not a problem here
const prisma = new PrismaClient({
  datasourceUrl: Env.DATABASE_URL,
  log: [
    { emit: 'event', level: 'query' },
    { emit: 'event', level: 'warn' },
    { emit: 'event', level: 'info' },
    { emit: 'event', level: 'error' }
  ]
});

// Simply returns the prisma instance
export default function (): PrismaClient {
  return prisma;
}

// Providers can also have lifecycle hooks, this one connects and disconnects from the database
// and also binds the prisma events to the fastify logger
export async function onReady(this: FastifyInstance) {
  prisma.$on('error', this.log.error.bind(this.log));
  prisma.$on('info', this.log.debug.bind(this.log));
  prisma.$on('query', this.log.trace.bind(this.log));
  prisma.$on('warn', this.log.warn.bind(this.log));

  await prisma.$connect();
}

// This hook is called when the server is shutting down
export async function onClose(this: FastifyInstance) {
  await prisma.$disconnect();
}