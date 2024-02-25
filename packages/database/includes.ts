import type {Prisma} from '@prisma/client';

export const Author = (userId: string) =>
  ({
    profilePhoto: true,
    tags: true,
    followers: {select: {id: true}, where: {id: userId}},
  } satisfies Prisma.UserInclude);

export const User = (userId: string) =>
  ({
    _count: {
      select: {
        posts: true,
        follows: true,
        followers: true,
      },
    },

    profilePhoto: true,
    coverPhoto: true,
    tags: true,
    followers: {select: {id: true}, where: {id: userId}},
  } satisfies Prisma.UserInclude);

export const Post = (userId: string) =>
  ({
    _count: true,

    medias: true,
    author: {include: Author(userId)},

    likes: {
      select: {
        id: true,
      },
      where: {
        id: userId,
      },
    },
    dislikes: {
      select: {
        id: true,
      },
      where: {
        id: userId,
      },
    },

    comments: {
      include: {
        author: {include: Author(userId)},
      },
      take: 2,
      orderBy: {
        likes: {
          _count: 'desc',
        },
      },
    },
  } satisfies Prisma.PostInclude);

export const Comment = (userId: string) =>
  ({
    _count: {
      select: {
        likes: true,
        dislikes: true,
      },
    },

    likes: {
      select: {
        id: true,
      },
      where: {
        id: userId,
      },
    },
    dislikes: {
      select: {
        id: true,
      },
      where: {
        id: userId,
      },
    },

    author: {include: Author(userId)},
  } satisfies Prisma.CommentInclude);
