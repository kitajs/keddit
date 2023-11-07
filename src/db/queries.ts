// drizzle.select().from(users).where(eq(users.id, userId)).limit(1)

import { desc, eq, sql } from 'drizzle-orm';
import { users, type Database, posts } from './index';

export type Queries = ReturnType<typeof queries>;

export function queries(db: Database) {
  const getUserByIdSql = db
    .select()
    .from(users)
    .where(eq(users.id, sql.placeholder('userId')))
    .limit(1)
    .prepare('getUserById');

  const listPostsSql = db
    .select()
    .from(posts)
    .limit(sql.placeholder('limit'))
    .offset(sql.placeholder('offset'))
    .orderBy(desc(posts.createdAt));

  const listsPostsByAuthorIdSql = db
    .select()
    .from(posts)
    .where(eq(posts.authorId, sql.placeholder('authorId')))
    .limit(sql.placeholder('limit'))
    .offset(sql.placeholder('offset'))
    .orderBy(desc(posts.createdAt));

  const listPostsJoinAuthorSql = db
    .select()
    .from(posts)
    .innerJoin(users, eq(posts.authorId, users.id))
    .limit(sql.placeholder('limit'))
    .offset(sql.placeholder('offset'))
    .orderBy(desc(posts.createdAt));

  return {
    getUserById(userId: number) {
      return getUserByIdSql.execute({ userId }).then((rows) => rows[0]);
    },

    listPosts(limit: number, offset: number) {
      return listPostsSql.execute({ limit, offset });
    },

    listPostsByAuthorId(authorId: number, limit: number, offset: number) {
      return listsPostsByAuthorIdSql.execute({ authorId, limit, offset });
    },

    listPostsJoinAuthor(limit: number, offset: number) {
      return listPostsJoinAuthorSql.execute({ limit, offset });
    }
  };
}
