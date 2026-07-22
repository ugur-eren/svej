import {Zod} from '@svej/common';
import {AxiosRequestConfig} from 'axios';
import ApiInstance from '../ApiInstance';

export type Post = (Awaited<ReturnType<typeof getById>> & {
  ok: true;
})['data'];

export const getById = async (postId: string) => {
  return ApiInstance.posts({postId}).get();
};

export const create = async (
  data: Parameters<typeof ApiInstance.posts.post>[0],
  config?: AxiosRequestConfig,
) => {
  return ApiInstance.posts.post(data, config);
};

export const react = async (postId: string, type: Zod.Reaction.TYPES) => {
  return ApiInstance.posts({postId}).reactions.put({type});
};

export const removeReaction = async (postId: string) => {
  return ApiInstance.posts({postId}).reactions.delete();
};

export const getComments = async (postId: string, cursor?: string) => {
  return ApiInstance.posts({postId}).comments.get({query: {cursor}});
};

export const createComment = async (
  postId: string,
  data: Parameters<ReturnType<typeof ApiInstance.posts>['comments']['post']>[0],
) => {
  return ApiInstance.posts({postId}).comments.post(data);
};
