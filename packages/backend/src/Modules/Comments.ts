import {ErrorCodes, Zod} from '@svej/common';
import {NotificationType} from '@svej/database';
import {Prisma, PrismaIncludes} from '@svej/server-side';
import {ModuleError} from '@/Utils/Error';
import {assertCommentExists, assertPostExists} from './Internal/Assert';
import {safeUpdate} from './Internal/Query';

const extendComment = <
  T extends {likes: {id: string}[]; dislikes: {id: string}[]; authorId: string},
>(
  comment: T,
  userId: string,
) => {
  return {
    ...comment,
    liked: comment.likes.length > 0,
    disliked: comment.dislikes.length > 0,
    mine: comment.authorId === userId,
  };
};

export const CommentsModule = {
  async getById(viewerId: string, commentId: string) {
    const comment = await Prisma.comment.findUnique({
      where: {id: commentId},
      include: PrismaIncludes.Comment(viewerId),
    });

    assertCommentExists(comment);

    return extendComment(comment, viewerId);
  },

  // TODO: pagination
  async getByPostId(viewerId: string, postId: string) {
    const post = await Prisma.post.findUnique({
      where: {id: postId},
      select: {id: true},
    });

    assertPostExists(post);

    const comments = await Prisma.comment.findMany({
      where: {post: {id: postId}},
      include: PrismaIncludes.Comment(viewerId),
    });

    return comments.map((comment) => extendComment(comment, viewerId));
  },

  async getReactionCounts(commentId: string) {
    const commentReactions = await Prisma.comment.findUnique({
      where: {id: commentId},
      select: {
        _count: {
          select: {
            likes: true,
            dislikes: true,
          },
        },
      },
    });

    assertCommentExists(commentReactions);

    return commentReactions._count;
  },

  async setReaction(viewerId: string, commentId: string, type: Zod.Reaction.ALL_TYPES) {
    const comment = await safeUpdate(() => {
      return Prisma.comment.update({
        where: {
          id: commentId,
        },
        data: {
          likes:
            type === Zod.Reaction.ALL_TYPES.LIKE
              ? {connect: {id: viewerId}}
              : {disconnect: {id: viewerId}},

          dislikes:
            type === Zod.Reaction.ALL_TYPES.DISLIKE
              ? {connect: {id: viewerId}}
              : {disconnect: {id: viewerId}},
        },
      });
    }, new ModuleError(ErrorCodes.CommentNotFound));

    return comment;
  },

  async create(viewerId: string, postId: string, content: string) {
    const post = await Prisma.post.findUnique({
      where: {id: postId},
      select: {id: true, authorId: true},
    });

    assertPostExists(post);

    const shouldNotify = post.authorId !== viewerId;

    const comment = await Prisma.comment.create({
      data: {
        post: {connect: {id: post.id}},
        author: {connect: {id: viewerId}},
        text: content,
        notifications: {
          create: shouldNotify
            ? {
                type: NotificationType.COMMENT,
                owner: {connect: {id: post.authorId}},
                user: {connect: {id: viewerId}},
                post: {connect: {id: post.id}},
              }
            : undefined,
        },
      },
    });

    return comment;
  },
};
