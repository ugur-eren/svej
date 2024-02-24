import type {PrismaTypes, PrismaIncludes, Comment as PrismaComment} from 'database';

export type Comment = PrismaTypes.CommentGetPayload<{
  include: ReturnType<typeof PrismaIncludes.Comment>;
}> & {
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

export type CreateRequest = {
  postId: string;
  text: string;
};

export type CreateResponse = PrismaComment;
