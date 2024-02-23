import type {Prisma} from '@prisma/client';

export const Author: Prisma.UserInclude = {
  profilePhoto: true,
  tags: true,
};

export const User: Prisma.UserInclude = {
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
};

export const Post = (userId: string) =>
  ({
    _count: true,

    medias: true,
    author: {include: Author},

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
        author: {include: Author},
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

    author: {include: Author},
  } satisfies Prisma.CommentInclude);
