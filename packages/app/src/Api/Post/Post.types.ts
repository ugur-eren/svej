import type {PrismaTypes, PrismaIncludes} from 'database';

export type Post = PrismaTypes.PostGetPayload<{include: ReturnType<typeof PrismaIncludes.Post>}> & {
  liked: boolean;
  disliked: boolean;
  mine: boolean;
};

export type ReactionCounts = {
  likes: number;
  dislikes: number;
  comments: number;
};

export type ReactionType = 'like' | 'dislike' | 'remove';
