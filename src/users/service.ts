import { PrismaClient } from '@prisma/client';
import { hashUserPassword } from './auth';
import { CreateUser } from './model';

/** Creates a new user and hashes his password */
export async function createUser(prisma: PrismaClient, body: CreateUser) {
  try {
    body.password = await hashUserPassword(body.password);

    const user = await prisma.user.create({
      data: body
    });

    return [null, user] as const;
  } catch (error: any) {
    return [error, null] as const;
  }
}
