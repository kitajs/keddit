import { PrismaClient } from '@prisma/client';
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
