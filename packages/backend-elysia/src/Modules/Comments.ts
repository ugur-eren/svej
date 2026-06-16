import {ErrorCodes, Zod} from '@svej/common';
import {NotificationType, Prisma as PrismaTypes} from '@svej/database';
import {Prisma, PrismaIncludes} from '@/Services';
import {ModuleError} from '@/Utils/Error';
import {assertCommentExists, assertPostExists} from './Internal/Assert';
import {safeUpdate} from './Internal/Query';

const extendComment = (
  comment: PrismaTypes.CommentGetPayload<{include: ReturnType<typeof PrismaIncludes.Comment>}>,
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
  async getById(commentId: string, userId: string) {
    const comment = await Prisma.comment.findUnique({
      where: {id: commentId},
      include: PrismaIncludes.Comment(userId),
    });

    assertCommentExists(comment);

    return extendComment(comment, userId);
  },

  // TODO: pagination
  async getByPostId(postId: string, userId: string) {
    const post = await Prisma.post.findUnique({
      where: {id: postId},
      select: {id: true},
    });

    assertPostExists(post);

    const comments = await Prisma.comment.findMany({
      where: {post: {id: postId}},
      include: PrismaIncludes.Comment(userId),
    });

    return comments.map((comment) => extendComment(comment, userId));
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

  async setReaction(commentId: string, userId: string, type: Zod.Reaction.ALL_TYPES) {
    const comment = await safeUpdate(() => {
      return Prisma.comment.update({
        where: {
          id: commentId,
        },
        data: {
          likes:
            type === Zod.Reaction.ALL_TYPES.LIKE
              ? {connect: {id: userId}}
              : {disconnect: {id: userId}},

          dislikes:
            type === Zod.Reaction.ALL_TYPES.DISLIKE
              ? {connect: {id: userId}}
              : {disconnect: {id: userId}},
        },
      });
    }, new ModuleError(ErrorCodes.CommentNotFound));

    return comment;
  },

  async create(postId: string, userId: string, content: string) {
    const post = await Prisma.post.findUnique({
      where: {id: postId},
      select: {id: true, authorId: true},
    });

    assertPostExists(post);

    const shouldNotify = post.authorId !== userId;

    const comment = await Prisma.comment.create({
      data: {
        post: {connect: {id: post.id}},
        author: {connect: {id: userId}},
        text: content,
        notifications: {
          create: shouldNotify
            ? {
                type: NotificationType.COMMENT,
                owner: {connect: {id: post.authorId}},
                user: {connect: {id: userId}},
                post: {connect: {id: post.id}},
              }
            : undefined,
        },
      },
    });

    return comment;
  },
};
