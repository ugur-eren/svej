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

export const Post: Prisma.PostInclude = {
  _count: true,

  medias: true,
  author: {include: Author},
};

export const Comment: Prisma.CommentInclude = {
  _count: {
    select: {
      likes: true,
      dislikes: true,
    },
  },

  author: {include: Author},
};

export const PostWithComments: Prisma.PostInclude = {
  ...Post,

  comments: {include: Comment},
};
