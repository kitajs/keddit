import { relations } from 'drizzle-orm';
import { date, integer, pgTable, serial, text } from 'drizzle-orm/pg-core';
import { users } from './users';

export type Post = typeof posts.$inferSelect;

export type CreatePost = {
  /**
   * @minLength 5
   * @maxLength 50
   */
  title: string;

  /**
   * @minLength 10
   * @maxLength 300
   */
  body: string;
};

export type PostWithAuthor = {
  title: string;
  body: string;
  createdAt: string;
  author: string;
  id: number;
};

export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  body: text('body').notNull(),
  createdAt: date('created_at').defaultNow().notNull(),
  authorId: integer('author_id').notNull()
});

export const postsRelations = relations(posts, ({ one }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id]
  })
}));
