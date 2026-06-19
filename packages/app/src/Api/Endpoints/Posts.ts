import {Zod} from '@svej/common';
import ApiInstance from '../ApiInstance';

export type Post = (Awaited<ReturnType<ReturnType<typeof ApiInstance.posts>['get']>> & {
  error: null;
})['data'];

export const getById = async (postId: string) => {
  return ApiInstance.posts({postId}).get();
};

export const create = async (data: Parameters<typeof ApiInstance.posts.post>[0]) => {
  return ApiInstance.posts.post(data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const react = async (commentId: string, type: Zod.Reaction.TYPES) => {
  return ApiInstance.comments({commentId}).reactions.put({type});
};

export const removeReaction = async (commentId: string) => {
  return ApiInstance.comments({commentId}).reactions.delete();
};

export const getComments = async (postId: string) => {
  return ApiInstance.posts({postId}).comments.get();
};

export const createComment = async (
  postId: string,
  data: Parameters<ReturnType<typeof ApiInstance.posts>['comments']['post']>[0],
) => {
  return ApiInstance.posts({postId}).comments.post(data);
};
