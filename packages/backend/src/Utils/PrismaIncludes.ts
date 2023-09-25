import {PrismaTypes} from 'database';

export const Author: PrismaTypes.UserInclude = {
  profilePhoto: true,
  tags: true,
};

export const User: PrismaTypes.UserInclude = {
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

export const Post: PrismaTypes.PostInclude = {
  _count: true,

  medias: true,
  author: {include: Author},
};

export const Comment: PrismaTypes.CommentInclude = {
  _count: {
    select: {
      likes: true,
      dislikes: true,
    },
  },

  author: {include: Author},
};

export const PostWithComments: PrismaTypes.PostInclude = {
  ...Post,

  comments: {include: Comment},
};
