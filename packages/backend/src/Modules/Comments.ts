import {Config, ErrorCodes, Zod} from '@svej/common';
import {NotificationType} from '@svej/database';
import {Prisma, PrismaIncludes} from '@svej/server-side';
import {ModuleError} from '@/Utils/Error';
import {getBlocksList, getBlocksWhereClause} from '@/Utils/Query';
import {assertCommentExists, assertPostExists} from './Internal/Assert';
import {extendComment, safeUpdate} from './Internal/Query';

export const CommentsModule = {
  async getById(viewerId: string, commentId: string) {
    const comment = await Prisma.comment.findFirst({
      where: {
        id: commentId,
        author: getBlocksWhereClause(viewerId),
        active: true,
      },
      include: PrismaIncludes.Comment(viewerId),
    });

    assertCommentExists(comment);

    return extendComment(comment);
  },

  async getByPostId(viewerId: string, postId: string, cursor?: string) {
    const post = await Prisma.post.findFirst({
      where: {
        id: postId,
        author: getBlocksWhereClause(viewerId),
        active: true,
      },
      select: {id: true},
    });

    assertPostExists(post);

    const excludedUserIds = await getBlocksList(viewerId);

    const comments = await Prisma.comment.findMany({
      where: {
        postId,
        authorId: {notIn: excludedUserIds},
        active: true,
      },
      skip: cursor ? 1 : 0,
      take: Config.commentsPerPage,
      cursor: cursor ? {id: cursor} : undefined,
      include: PrismaIncludes.Comment(viewerId),
      orderBy: [{likes: {_count: 'desc'}}, {id: 'desc'}],
    });

    const lastComment = comments[comments.length - 1];
    const nextCursor = lastComment ? lastComment.id : undefined;

    return {
      comments: comments.map((comment) => extendComment(comment)),
      nextCursor,
    };
  },

  async getReactionCounts(commentId: string) {
    const commentReactions = await Prisma.comment.findFirst({
      where: {
        id: commentId,
        active: true,
      },
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
          author: getBlocksWhereClause(viewerId),
          active: true,
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
    const post = await Prisma.post.findFirst({
      where: {
        id: postId,
        author: getBlocksWhereClause(viewerId),
        active: true,
      },
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

  async update(viewerId: string, commentId: string, text?: string) {
    const comment = await Prisma.comment.findFirst({
      where: {
        id: commentId,
        active: true,
      },
      select: {id: true, authorId: true},
    });

    assertCommentExists(comment);

    if (comment.authorId !== viewerId) {
      throw new ModuleError(ErrorCodes.Forbidden);
    }

    const updatedComment = await Prisma.comment.update({
      where: {id: comment.id},
      data: {text},
      include: PrismaIncludes.Comment(viewerId),
    });

    return extendComment(updatedComment);
  },

  async delete(viewerId: string, commentId: string) {
    const comment = await Prisma.comment.findFirst({
      where: {
        id: commentId,
        active: true,
      },
      select: {id: true, authorId: true},
    });

    assertCommentExists(comment);

    if (comment.authorId !== viewerId) {
      throw new ModuleError(ErrorCodes.Forbidden);
    }

    await Prisma.comment.update({
      where: {id: comment.id},
      data: {active: false},
    });

    return {};
  },
};
