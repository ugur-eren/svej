import {Config, ErrorCodes, Zod} from '@svej/common';
import {NotificationType, Prisma as PrismaTypes} from '@svej/database';
import {Prisma, PrismaIncludes} from '@/Services';
import {ModuleError} from '@/Utils/Error';
import {ImageHandler} from '@/Utils/ImageHandler';
import {VideoHandler} from '@/Utils/VideoHandler';
import {assertPostExists} from './Internal/Assert';

const extendPost = (
  post: PrismaTypes.PostGetPayload<{include: ReturnType<typeof PrismaIncludes.Post>}>,
  userId: string,
) => {
  return {
    ...post,
    liked: post.likes.some((like) => like.id === userId),
    disliked: post.dislikes.some((dislike) => dislike.id === userId),
    mine: post.authorId === userId,
  };
};

export const PostsModule = {
  async getById(postId: string, userId: string) {
    const post = await Prisma.post.findUnique({
      where: {id: postId},
      include: PrismaIncludes.Post(userId),
    });

    assertPostExists(post);

    return extendPost(post, userId);
  },

  // TODO: pagination
  async getByUserId(userId: string) {
    const posts = await Prisma.post.findMany({
      where: {authorId: userId},
      include: PrismaIncludes.Post(userId),
      orderBy: {createdAt: 'desc'},
    });

    return posts.map((post) => extendPost(post, userId));
  },

  async getReactionCounts(postId: string) {
    const postReactions = await Prisma.post.findUnique({
      where: {id: postId},
      select: {
        _count: {
          select: {
            likes: true,
            dislikes: true,
            comments: true,
          },
        },
      },
    });

    assertPostExists(postReactions);

    return postReactions._count;
  },

  async setReaction(postId: string, userId: string, type: Zod.Reaction.ALL_TYPES) {
    const post = await Prisma.post.findUnique({
      where: {id: postId},
      select: {id: true, authorId: true},
    });

    assertPostExists(post);

    const shouldNotify = type === Zod.Reaction.ALL_TYPES.LIKE && post.authorId !== userId;

    const updatedPost = await Prisma.post.update({
      where: {
        id: postId,
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

        notifications: {
          create: shouldNotify
            ? {
                type: NotificationType.POST_LIKE,
                owner: {connect: {id: post.authorId}},
                user: {connect: {id: userId}},
              }
            : undefined,
        },
      },
    });

    return updatedPost;
  },

  async create(userId: string, files: File[], description?: string) {
    if (!description && !files.length) {
      throw new ModuleError(ErrorCodes.PostDoesntHaveMediaOrDescription);
    }

    let fileRecords: PrismaTypes.MediaCreateManyPostInput[] = [];

    try {
      fileRecords = (
        await Promise.all(
          files.map(async (file) => {
            if (file.size > Config.maxFileSize) return null;

            if (file.type.startsWith('image/')) {
              return ImageHandler(file, 'post');
            }

            if (file.type.startsWith('video/')) {
              return VideoHandler(file);
            }

            return null;
          }),
        )
      ).filter(<T>(file: T | null): file is T => file !== null);
    } catch (err) {
      console.error('Error processing files:', err);

      throw new ModuleError(ErrorCodes.FileProcessingError);
    }

    const post = await Prisma.post.create({
      data: {
        description,
        author: {connect: {id: userId}},
        medias: {
          createMany: {data: fileRecords},
        },
      },
    });

    return post;
  },
};
