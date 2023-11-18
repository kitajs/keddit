import { Html } from '@kitajs/html';
import { Post } from '@prisma/client';
import { PostCard } from './post';

export interface PostCardsProps {
  posts: (Post & { author: { name: string } })[];
  userId?: number;
}

export function PostCards({ posts, userId }: PostCardsProps) {
  return (
    <>
      {posts.map((post) => (
        <li>
          <PostCard
            author={post.author.name}
            post={post}
            authored={userId === post.authorId}
          />
        </li>
      ))}
    </>
  );
}
