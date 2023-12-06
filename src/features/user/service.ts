import { PrismaClient } from 'prisma-client';
import { hashUserPassword } from './auth';
import { CreateUser, UpdateUser } from './model';

/** Creates a new user and hashes his password */
export async function createUser(prisma: PrismaClient, body: CreateUser) {
  try {
    const password = await hashUserPassword(body.password);

    const user = await prisma.user.create({
      data: {
        email: body.email.trim(),
        name: body.name.trim(),
        password
      }
    });

    return [null, user] as const;
  } catch (error: any) {
    return [error, null] as const;
  }
}

/** Creates a new user and hashes his password */
export async function updateUser(prisma: PrismaClient, userId: number, body: UpdateUser) {
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        name: body.name?.trim(),
        email: body.email?.trim()
      }
    });

    return [null, user] as const;
  } catch (error: any) {
    return [error, null] as const;
  }
}
