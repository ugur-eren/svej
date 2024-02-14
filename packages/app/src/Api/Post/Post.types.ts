import type {PrismaTypes, PrismaIncludes} from 'database';

export type Post = PrismaTypes.PostGetPayload<{include: typeof PrismaIncludes.Post}>;

export type PostWithComments = PrismaTypes.PostGetPayload<{
  include: typeof PrismaIncludes.PostWithComments;
}>;

export type ReactionCounts = {
  likes: number;
  dislikes: number;
  comments: number;
};

export type ReactionType = 'like' | 'dislike' | 'remove';
