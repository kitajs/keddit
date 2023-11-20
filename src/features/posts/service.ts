import { PrismaClient } from '@prisma/client';
import { CreatePost } from './model';

export async function createPost(
  prisma: PrismaClient,
  authorId: number,
  body: CreatePost
) {
  try {
    const post = await prisma.post.create({
      data: {
        title: body.title,
        body: body.body,
        authorId
      }
    });

    return [null, post] as const;
  } catch (error: any) {
    return [error, null] as const;
  }
}
