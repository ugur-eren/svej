import type {PrismaTypes, PrismaIncludes} from 'database';

export type Post = Omit<
  PrismaTypes.PostGetPayload<{include: ReturnType<typeof PrismaIncludes.Post>}>,
  'comments'
> & {
  comments: PrismaTypes.CommentGetPayload<{include: typeof PrismaIncludes.Comment}>[];
};

export type ReactionCounts = {
  likes: number;
  dislikes: number;
  comments: number;
};

export type ReactionType = 'like' | 'dislike' | 'remove';
