import { relations } from 'drizzle-orm';
import { pgTable, serial, text } from 'drizzle-orm/pg-core';
import { posts } from './posts';

export type User = typeof users.$inferSelect;

export interface CreateUser {
  /** @minLength 3 */
  name: string;

  /** @format email */
  email: string;

  /**
   * @minLength 8
   * @format password
   */
  password: string;
}

export type UpdateUser = Pick<Partial<CreateUser>, 'name' | 'email'>;

export type UserWithoutPassword = {
  id: number;
  name: string;
  email: string;
};

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').unique().notNull(),
  password: text('password').notNull()
});

export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts)
}));
