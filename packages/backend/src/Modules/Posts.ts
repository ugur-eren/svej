import {Config, ErrorCodes, Zod} from '@svej/common';
import {NotificationType, Prisma as PrismaTypes} from '@svej/database';
import {Prisma, PrismaIncludes} from '@svej/server-side';
import {ModuleError} from '@/Utils/Error';
import {ImageHandler} from '@/Utils/ImageHandler';
import {VideoHandler} from '@/Utils/VideoHandler';
import {getBlocksList, getBlocksWhereClause, isBlocked} from '@/Utils/Query';
import {assertPostExists} from './Internal/Assert';

const extendPost = <T extends {likes: {id: string}[]; dislikes: {id: string}[]; authorId: string}>(
  post: T,
) => {
  const {likes, dislikes, ...rest} = post;

  return {
    ...rest,
    liked: likes.length > 0,
    disliked: dislikes.length > 0,
  };
};

export const PostsModule = {
  async getById(viewerId: string, postId: string) {
    const post = await Prisma.post.findUnique({
      where: {
        id: postId,
        author: getBlocksWhereClause(viewerId),
      },
      include: PrismaIncludes.Post(viewerId),
    });

    assertPostExists(post);

    return extendPost(post);
  },

  async getByUserId(viewerId: string, userId: string, cursor?: string) {
    if (await isBlocked(viewerId, userId)) {
      return {posts: [], nextCursor: undefined};
    }

    const posts = await Prisma.post.findMany({
      where: {authorId: userId},
      skip: cursor ? 1 : 0,
      take: Config.postsPerPage,
      cursor: cursor ? {id: cursor} : undefined,
      include: PrismaIncludes.Post(viewerId),
      orderBy: [{createdAt: 'desc'}, {id: 'desc'}],
    });

    const lastPost = posts[posts.length - 1];
    const nextCursor = lastPost ? lastPost.id : undefined;

    return {
      posts: posts.map((post) => extendPost(post)),
      nextCursor,
    };
  },

  async getExploreFeed(viewerId: string, cursor?: string) {
    const excludedUserIds = await getBlocksList(viewerId);

    const posts = await Prisma.post.findMany({
      where: {authorId: {notIn: excludedUserIds}},
      skip: cursor ? 1 : 0,
      take: Config.postsPerPage,
      cursor: cursor ? {id: cursor} : undefined,
      include: PrismaIncludes.Post(viewerId),
      orderBy: [{createdAt: 'desc'}, {id: 'desc'}],
    });

    const lastPost = posts[posts.length - 1];
    const nextCursor = lastPost ? lastPost.id : undefined;

    return {
      posts: posts.map((post) => extendPost(post)),
      nextCursor,
    };
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

  async setReaction(viewerId: string, postId: string, type: Zod.Reaction.ALL_TYPES) {
    const post = await Prisma.post.findUnique({
      where: {
        id: postId,
        author: getBlocksWhereClause(viewerId),
      },
      select: {id: true, authorId: true},
    });

    assertPostExists(post);

    const shouldNotify = type === Zod.Reaction.ALL_TYPES.LIKE && post.authorId !== viewerId;

    const updatedPost = await Prisma.post.update({
      where: {
        id: postId,
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

        notifications: {
          create: shouldNotify
            ? {
                type: NotificationType.POST_LIKE,
                owner: {connect: {id: post.authorId}},
                user: {connect: {id: viewerId}},
              }
            : undefined,
        },
      },
    });

    return updatedPost;
  },

  async create(viewerId: string, files: File[], description?: string) {
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
        author: {connect: {id: viewerId}},
        medias: {
          createMany: {data: fileRecords},
        },
      },
    });

    return post;
  },
};
